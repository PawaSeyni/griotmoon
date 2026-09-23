// Retailer links and affiliate disclosure (parity plan P3-2), ported from Story Time with
// Eva and adapted: Griot Moon sells one Amazon listing per book, so there is no per-language
// edition mapping, and it has no featured-titles or related-book policy to check here.
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

test('book pages: a published book has a Buy link to its own ASIN; a coming-soon book has none', () => {
  for (const [, prefix] of Object.entries(LOCALES)) for (const b of books) {
    const h = read(`${prefix}/books/${b.id}`);
    const own = amazonAnchors(h).filter((a) => a.includes(`/dp/${b.asin}?`));
    if (b.status === 'coming-soon') assert.equal(own.length, 0, `${prefix}/books/${b.id}: coming soon must not sell`);
    else assert.ok(own.length >= 1, `${prefix}/books/${b.id}: no Buy link to ASIN ${b.asin}`);
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
