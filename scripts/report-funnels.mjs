// Funnel and performance report (parity plan P1-3), ported from Story Time with Eva.
//
//   npm run report:funnels                                    30 days ending today, from Plausible
//   npm run report:funnels -- --from 2026-09-01 --to 2026-09-30
//   npm run report:funnels -- --fixture scripts/fixtures/funnel-events.json [--out file.md]
//
// Input is a flat list of aggregated rows { event, props: {…}, count }: what the Plausible
// Stats API v2 returns for a goal broken down by its custom properties, or a fixture. The
// report derives every funnel in src/analytics/funnels.ts, segments by each funnel's
// dimensions, ranks books by Amazon clicks per view, compares locales, and marks any count
// below MIN_SAMPLE. It reads ONLY the schema-1 events: Plausible's automatic outbound-link
// and file-download goals also fire on an Amazon click and a PDF download and are not used.
//
// Any failed API call prints a line starting "HTTP" and makes the script exit non-zero,
// so "zero HTTP lines" (P1-2's acceptance) is checkable.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { EVENTS, SCHEMA_VERSION } from '../src/analytics/events.ts';
import { FUNNELS, MIN_SAMPLE } from '../src/analytics/funnels.ts';
import { loadBooks } from './lib/catalog.mjs';

// Local runs read PLAUSIBLE_API_KEY from the git-ignored .env (see .env.example); an
// explicit environment variable always wins.
try { process.loadEnvFile('.env'); } catch { /* no .env: fall through to process.env */ }

const args = Object.fromEntries(process.argv.slice(2).map((a, i, all) => (a.startsWith('--') ? [a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true] : [])).filter((x) => x.length));
if (Boolean(args.from) !== Boolean(args.to)) { console.error('Pass both --from and --to (YYYY-MM-DD), or neither for the last 30 days.'); process.exit(2); }
// Default: the 30 days ending today, inclusive (UTC dates).
const isoDay = (d) => d.toISOString().slice(0, 10);
const to = args.to ?? isoDay(new Date());
const from = args.from ?? isoDay(new Date(Date.parse(to) - 29 * 86400000));
const books = loadBooks();
let httpErrors = 0;

async function fetchPlausible() {
  const key = process.env.PLAUSIBLE_API_KEY;
  if (!key) return null;
  const site = process.env.PLAUSIBLE_SITE_ID || 'griotmoon.com';
  // Always an explicit [from, to]. Plausible's relative '30d' ends YESTERDAY, so it hides
  // today's events, which matters most right after a schema change.
  const dateRange = [from, to];
  const rows = [];
  for (const e of EVENTS) {
    const dims = [...e.required, ...e.optional].map((p) => `event:props:${p}`);
    const body = { site_id: site, metrics: ['events'], date_range: dateRange, filters: [['is', 'event:goal', [e.name]]], dimensions: dims };
    const r = await fetch('https://plausible.io/api/v2/query', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) {
      httpErrors++;
      console.error(`HTTP ${r.status} for '${e.name}': ${(await r.text()).slice(0, 300)}`);
      continue;
    }
    const j = await r.json();
    for (const row of j.results ?? []) rows.push({ event: e.name, props: Object.fromEntries(dims.map((d, i) => [d.replace('event:props:', ''), row.dimensions[i]])), count: row.metrics[0] });
  }
  return rows;
}

let rows; let source;
if (args.fixture) { rows = JSON.parse(readFileSync(args.fixture, 'utf8')); source = `fixture ${args.fixture}`; }
else { rows = await fetchPlausible(); source = `Plausible Stats API v2 (${process.env.PLAUSIBLE_SITE_ID || 'griotmoon.com'})`; }

const bookById = Object.fromEntries(books.map((b) => [b.id, b]));
/** Sum of counts for an event, filtered by `where`, grouped by a property (or 'age'). */
const count = (event, where = {}, by = null) => {
  const out = {};
  for (const r of rows ?? []) {
    if (r.event !== event) continue;
    if (Object.entries(where).some(([k, v]) => String(r.props?.[k]) !== v)) continue;
    let key = 'all';
    if (by === 'age') key = !r.props?.book ? '(no book)' : bookById[r.props.book]?.ageRange ?? '(not in catalog)';
    else if (by) key = r.props?.[by] ?? '(unset)';
    out[key] = (out[key] ?? 0) + (r.count ?? 0);
  }
  return out;
};
const pct = (a, b) => (b ? `${((100 * a) / b).toFixed(1)}%` : 'n/a');
const warn = (n) => (n < MIN_SAMPLE ? ' ⚠︎ below minimum sample' : '');
const range = args.fixture ? 'fixture' : `${from} to ${to}`;

let md = `# Griot Moon funnel report\n\n`;
md += `Source: ${source}. Range: ${range}. Event schema version ${SCHEMA_VERSION}. Minimum sample ${MIN_SAMPLE} events per segment. Rates are INTENT unless the funnel says outcome.\n\n**How to read the rates:** Plausible returns totals per event, not the same visitors followed step to step. A step rate is one total divided by the previous one, so it can exceed 100% (a Book View can come from search, a pin or a shared link, not only the step before). Read it as a ratio of volumes, not a conversion rate.\n\n`;
if (!rows) {
  md += `## No data\n\nNo \`PLAUSIBLE_API_KEY\` in the environment or \`.env\`, and no \`--fixture\`. The funnel definitions loaded; the numbers cannot. See .env.example.\n`;
} else {
  for (const f of FUNNELS) {
    md += `## ${f.title} (${f.measures})\n\n`;
    if (f.notes) md += `${f.notes}\n\n`;
    md += `| Step | Events | Rate from previous |\n|---|---|---|\n`;
    let prev = null;
    for (const st of f.steps) {
      const n = count(st.event, st.where).all ?? 0;
      md += `| ${st.event}${st.where ? ' ' + JSON.stringify(st.where) : ''} | ${n}${warn(n)} | ${prev === null ? '' : pct(n, prev)} |\n`;
      prev = n;
    }
    md += '\n';
    const last = f.steps.at(-1);
    for (const dim of f.dimensions) {
      const seg = count(last.event, last.where, dim);
      const keys = Object.keys(seg);
      if (!keys.length) continue;
      md += `By ${dim}: ${keys.sort((a, b) => seg[b] - seg[a]).map((k) => `${k} ${seg[k]}${warn(seg[k])}`).join(' · ')}\n\n`;
    }
  }
  // Amazon clicks per book-page view, from the book page only, with the minimum-sample guard.
  const views = count('Book View', {}, 'book'); const clicks = count('Purchase Click', { placement: 'detail' }, 'book');
  const perBook = Object.keys(views).map((b) => ({ book: b, views: views[b], clicks: clicks[b] ?? 0, rate: (clicks[b] ?? 0) / views[b] }));
  const eligible = perBook.filter((r) => r.views >= MIN_SAMPLE).sort((a, b) => b.rate - a.rate);
  md += `## Book performance: Amazon clicks per book-page view\n\n${eligible.length ? `| Book | Views | Amazon clicks | Rate |\n|---|---|---|---|\n${eligible.map((r) => `| ${r.book} | ${r.views} | ${r.clicks} | ${pct(r.clicks, r.views)} |`).join('\n')}\n\nTop: ${eligible.slice(0, 3).map((r) => r.book).join(', ')}.${eligible.length > 3 ? ` Bottom: ${eligible.slice(Math.max(3, eligible.length - 3)).map((r) => r.book).join(', ')}.` : ''} ${perBook.length - eligible.length} book(s) below the minimum sample are not classified.` : `No book reached ${MIN_SAMPLE} views; nothing is classified.`}\n\n`;
  const lv = count('Form View', {}, 'language'); const ll = count('Lead Created', {}, 'language');
  md += `## Locale parity\n\n| Locale | Form views | Leads | Rate |\n|---|---|---|---|\n${['en', 'fr', 'es'].map((l) => `| ${l} | ${lv[l] ?? 0}${warn(lv[l] ?? 0)} | ${ll[l] ?? 0} | ${pct(ll[l] ?? 0, lv[l] ?? 0)} |`).join('\n')}\n\nA locale whose rate is under half of English with a full sample is a translation or parity gap to investigate.\n\n`;
  md += `## Book views by age range\n\n${Object.entries(count('Book View', {}, 'age')).map(([k, v]) => `${k} ${v}`).join(' · ') || 'none'}\n\n`;
  const unknown = [...new Set(rows.filter((r) => r.props?.book && !bookById[r.props.book]).map((r) => r.props.book))];
  if (unknown.length) md += `⚠︎ ${unknown.length} book id(s) in the data are not in the catalog: ${unknown.join(', ')}. Usually retired or renamed books; they appear as "(not in catalog)" in the age breakdown.\n\n`;
  md += `## Known gaps\n\n- Amazon purchases are not observable; every purchase figure is an outbound click (intent).\n- Until parity plan P2-1, \`Lead Created\` fires when the browser's request did not throw, not on a confirmed subscriber. Double opt-in: created is not confirmed.\n- Each book has one Amazon listing, so \`language\` on a purchase is the site language, not an edition.\n`;
}
// A frozen snapshot is a record, not an output: refuse to overwrite one (P1-4).
if (args.out && existsSync(args.out) && readFileSync(args.out, 'utf8').includes('FROZEN SNAPSHOT')) {
  console.error(`${args.out} is a frozen snapshot and will not be overwritten. Write this window to a new file.`);
  process.exit(3);
}
if (args.out) { writeFileSync(args.out, md); console.log(`report written: ${args.out}`); } else console.log(md);
if (httpErrors) { console.error(`${httpErrors} Plausible request(s) failed; see the HTTP lines above.`); process.exit(1); }
