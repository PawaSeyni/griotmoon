// Build-script view of the book catalog: id and age range per book.
//
// src/data/books.ts cannot be imported in Node (it resolves covers through Vite's
// import.meta.glob), so this reads the source with the same `    id: '…',` pattern that
// scripts/gen-sitemap.mjs and scripts/check-i18n-catalog.mjs use. Eva splits a
// browser-free books.data.ts for this; do that here if more fields are ever needed.
// An empty or short result is a hard error, never a silent fallback.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** @returns {{ id: string, ageRange: string | null, asin: string | null, status: string | null }[]} */
export function loadBooks() {
  const src = readFileSync(path.join(ROOT, 'src', 'data', 'books.ts'), 'utf8');
  const starts = [...src.matchAll(/^ {4}id: '([^']+)',/gm)];
  if (!starts.length) throw new Error('catalog: no book ids found in src/data/books.ts');
  return starts.map((m, i) => {
    const block = src.slice(m.index, starts[i + 1]?.index ?? src.length);
    return {
      id: m[1],
      ageRange: /^ {4}ageRange: '([^']+)',/m.exec(block)?.[1] ?? null,
      asin: /^ {4}amazonUrl: dp\('([A-Z0-9]{10})'\),/m.exec(block)?.[1] ?? null,
      status: /^ {4}status: '([^']+)',/m.exec(block)?.[1] ?? null,
    };
  });
}
