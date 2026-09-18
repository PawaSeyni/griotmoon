import { readFile } from 'node:fs/promises';

const src = await readFile('src/data/books.ts', 'utf8');
const failures = [];
const ids = [...src.matchAll(/^ {4}id: '([^']+)',/gm)].map(m => m[1]);

for (const id of ids) {
  const start = src.indexOf(`    id: '${id}',`);
  const next = src.indexOf("\n  {\n    id: '", start + 1);
  const block = src.slice(start, next === -1 ? src.indexOf('\n];', start) : next);

  for (const field of ['title', 'description', 'theme']) {
    const re = new RegExp(field + ':\\s*\\{([\\s\\S]*?)\\n\\s*\\},');
    const m = block.match(re);
    if (!m) {
      failures.push(`${id}: missing localized ${field}`);
      continue;
    }
    for (const lang of ['en', 'es', 'fr']) {
      if (!new RegExp(`\\b${lang}:\\s*['\"]`).test(m[1])) {
        failures.push(`${id}: ${field} missing ${lang}`);
      }
    }
  }

  const langs = block.match(/languages:\s*(TRI|EN)/)?.[1];
  if (!langs) failures.push(`${id}: languages must use TRI or EN catalog constant`);

  // Catch the exact cross-book contamination that previously leaked Kofi's
  // Whistling Secret copy into another title.
  if (id !== 'the-whistling-secret' && /Kofi adore siffler|Kofi loves to whistle|Kofi le encanta silbar/i.test(block)) {
    failures.push(`${id}: contains Whistling Secret copy`);
  }
}

if (new Set(ids).size !== ids.length) failures.push('duplicate book id in catalog');

if (failures.length) {
  console.error('i18n catalog validation failed:\n' + failures.map(x => '  - ' + x).join('\n'));
  process.exit(1);
}
console.log(`i18n catalog validation passed for ${ids.length} books.`);
