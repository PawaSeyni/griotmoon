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

  // Edition honesty. A book's flags and its structured-data inLanguage are derived from
  // `editions`, so the only way to claim a Spanish or French edition is to name its ASIN.
  // Until 2026-10-11 this check accepted a bare TRI constant, and 21 of 33 books used it
  // while the catalogue held two non-English listings in total.
  if (/^\s*languages:/m.test(block)) {
    failures.push(`${id}: remove the literal languages field; flags derive from editions`);
  }
  const editions = block.match(/editions:\s*\{([^}]*)\}/)?.[1];
  if (editions) {
    for (const [, lang, asin] of editions.matchAll(/(\w+):\s*'([^']*)'/g)) {
      if (!['es', 'fr'].includes(lang)) failures.push(`${id}: editions.${lang} is not a translated edition`);
      if (!/^[A-Z0-9]{10}$/.test(asin)) failures.push(`${id}: editions.${lang} is not an ASIN (${asin})`);
    }
  }

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
