// Analytics contract check (parity plan P1-1). Fails when the event dictionary, the funnels
// and the real track() call sites disagree:
//   1. every track() call names a declared event and only its declared property keys,
//      and any literal value it passes is one the dictionary allows;
//   2. every declared event has at least one call site (the dictionary lists only what fires);
//   3. every funnel step names a declared, fired event, filtered only on that event's
//      properties and allowed values.
// Node 22.18+ strips TypeScript types, so the dictionary is imported directly.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { EVENTS, EVENT_BY_NAME } from '../src/analytics/events.ts';
import { FUNNELS } from '../src/analytics/funnels.ts';

const root = new URL('..', import.meta.url).pathname;
const errors = [];

function* sourceFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* sourceFiles(p);
    else if (/\.tsx?$/.test(name)) yield p;
  }
}

/** Text of the call's argument list, from just after `track(` to its matching `)`. */
function argsAt(src, start) {
  let depth = 1;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '(') depth++;
    else if (src[i] === ')' && --depth === 0) return src.slice(start, i);
  }
  return src.slice(start);
}

const fired = new Map(); // event -> [file:line]
for (const file of sourceFiles(join(root, 'src'))) {
  if (file.endsWith(join('src', 'lib', 'analytics.ts'))) continue;
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/\btrack\(\s*'([^']+)'\s*,/g)) {
    const where = `${relative(root, file)}:${src.slice(0, m.index).split('\n').length}`;
    const name = m[1];
    const def = EVENT_BY_NAME[name];
    if (!def) { errors.push(`${where}: track('${name}') is not in src/analytics/events.ts`); continue; }
    fired.set(name, [...(fired.get(name) ?? []), where]);
    const args = argsAt(src, m.index + m[0].length);
    const allowed = new Set([...def.required, ...def.optional]);
    // Keys are read with string and template-literal contents blanked out, so `${x}`
    // inside a template string is not mistaken for an object key.
    const keySrc = args.replace(/`(?:\\.|[^`])*`/g, '``').replace(/'(?:\\.|[^'])*'/g, "''");
    for (const k of keySrc.matchAll(/[{,]\s*([A-Za-z_]\w*)\s*(?=[:,}])/g)) {
      if (!allowed.has(k[1])) errors.push(`${where}: '${name}' has undeclared property "${k[1]}"`);
    }
    for (const [, k, v] of args.matchAll(/([A-Za-z_]\w*)\s*:\s*'([^']*)'/g)) {
      const vals = def.values?.[k];
      if (vals && !vals.includes(v)) errors.push(`${where}: '${name}' ${k}='${v}' not in [${vals.join(', ')}]`);
    }
  }
}

for (const e of EVENTS) if (!fired.has(e.name)) errors.push(`event '${e.name}' is declared but never fired`);

for (const f of FUNNELS) {
  for (const step of f.steps) {
    const def = EVENT_BY_NAME[step.event];
    if (!def) { errors.push(`funnel ${f.id}: step '${step.event}' is not a declared event`); continue; }
    if (!fired.has(step.event)) errors.push(`funnel ${f.id}: step '${step.event}' is never fired`);
    for (const [k, v] of Object.entries(step.where ?? {})) {
      if (![...def.required, ...def.optional].includes(k)) errors.push(`funnel ${f.id}: '${step.event}' has no property "${k}"`);
      else if (def.values?.[k] && !def.values[k].includes(v)) errors.push(`funnel ${f.id}: '${step.event}' ${k}='${v}' is not an allowed value`);
    }
  }
}

if (errors.length) {
  console.error(`check:analytics FAILED (${errors.length})`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
const sites = [...fired.values()].reduce((n, s) => n + s.length, 0);
console.log(`check:analytics OK: ${EVENTS.length} events, ${sites} call sites, ${FUNNELS.length} funnels`);
