// Retailer links and affiliate disclosure (parity plan P3-2), ported from Story Time with
// Eva. Griot Moon DOES have a per-language edition mapping as of 2026-10-11: where a book
// has a live French or Spanish edition, that locale's page sells it, and where it does not,
// the page sells the English edition and says so. Before then every locale sold the English
// ASIN while 21 of 33 books claimed three editions existed (concern L17). It has no
// featured-titles or related-book policy to check here.
// Runs on the prerendered dist/ after `npm run build`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBooks } from '../../scripts/lib/catalog.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const books = loadBooks();
const TAG = 'tag=griotmoon-20';
const LOCALES = { en: '', es: '/es', fr: '/fr' };
const NOTE = { en: 'As an Amazon Associate', es: 'Como Asociado de Amazon', fr: 'En tant que Partenaire Amazon' };
const read = (route) => readFileSync(path.join(DIST, route.replace(/^\//, ''), 'index.html'), 'utf8');
const amazonAnchors = (h) => h.match(/<a\b[^>]*href="https:\/\/(?:www\.)?amazon\.[a-z.]+[^"]*"[^>]*>/g) ?? [];

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith('.html')) yield p;
  }
}

test('catalog: every book has an ASIN', () => {
  assert.ok(books.length >= 30, `${books.length} books parsed`);
  const missing = books.filter((b) => !b.asin).map((b) => b.id);
  assert.deepEqual(missing, [], 'books without a dp(ASIN) amazonUrl');
});

test('every Amazon link anywhere on the site carries the affiliate tag, opens in a new tab with noopener', () => {
  const bad = [];
  let total = 0;
  for (const file of htmlFiles(DIST)) {
    for (const a of amazonAnchors(readFileSync(file, 'utf8'))) {
      total++;
      const where = path.relative(DIST, file);
      if (!a.includes(TAG)) bad.push(`${where}: no affiliate tag: ${a.slice(0, 120)}`);
      if (!/target="_blank"/.test(a) || !/rel="[^"]*noopener/.test(a)) bad.push(`${where}: not target=_blank + noopener: ${a.slice(0, 120)}`);
    }
  }
  assert.ok(total > 100, `expected many Amazon links, found ${total}`);
  assert.deepEqual(bad, [], bad.slice(0, 20).join('\n'));
});

test('book pages: a published book sells the edition for that page\u2019s language; a coming-soon book sells nothing', () => {
  for (const [loc, prefix] of Object.entries(LOCALES)) for (const b of books) {
    const h = read(`${prefix}/books/${b.id}`);
    const expected = b.editions[loc] ?? b.asin;
    const own = amazonAnchors(h).filter((a) => a.includes(`/dp/${expected}?`));
    if (b.status === 'coming-soon') assert.equal(own.length, 0, `${prefix}/books/${b.id}: coming soon must not sell`);
    else assert.ok(own.length >= 1, `${prefix}/books/${b.id}: no Buy link to the ${loc} edition (${expected})`);
  }
});

test('book pages: a page that sells an English edition to a non-English reader says so', () => {
  // The honesty guarantee, as a test. A translated page that links to the English book
  // without saying so promises a book in a language it will not ship.
  const NOTE = { es: 'La edici\u00f3n que vendemos de este t\u00edtulo est\u00e1 en ingl\u00e9s.', fr: 'L\u2019\u00e9dition vendue pour ce titre est en anglais.' };
  for (const loc of ['es', 'fr']) for (const b of books) {
    if (b.status === 'coming-soon') continue;
    const h = read(`${LOCALES[loc]}/books/${b.id}`);
    if (b.editions[loc]) {
      assert.ok(!h.includes(NOTE[loc]), `${LOCALES[loc]}/books/${b.id}: sells the ${loc} edition, must not claim English`);
    } else {
      assert.ok(h.includes(NOTE[loc]), `${LOCALES[loc]}/books/${b.id}: sells the English edition without saying so`);
    }
  }
});

test('disclosure: the affiliate note sits on every published book page, in the page language', () => {
  for (const [loc, prefix] of Object.entries(LOCALES)) for (const b of books) {
    if (b.status === 'coming-soon') continue;
    const h = read(`${prefix}/books/${b.id}`);
    // React renders the bare JSX attribute as ="true"; the footer's is ="footer".
    const m = /data-affiliate-disclosure="true">([^<]*)</.exec(h);
    assert.ok(m && m[1].includes(NOTE[loc]), `${prefix}/books/${b.id}: Buy-group disclosure missing or not in ${loc}`);
  }
});

test('disclosure: the footer carries the affiliate note, with text, in every language', () => {
  for (const [loc, prefix] of Object.entries(LOCALES)) {
    const h = read(prefix || '/');
    const m = /data-affiliate-disclosure="footer">([^<]*)</.exec(h);
    assert.ok(m && m[1].trim().length > 20, `${prefix || '/'}: footer disclosure empty or missing`);
    assert.ok(m[1].includes(NOTE[loc]), `${prefix || '/'}: footer disclosure not in ${loc}`);
  }
});
