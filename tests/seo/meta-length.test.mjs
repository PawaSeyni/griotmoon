// Title and meta-description LENGTH, against the prerendered dist/ — what crawlers
// actually receive. Runs after `npm run build` as part of `npm run verify`.
//
// Why this test exists: until 2026-10-11 BookDetail passed its visible page copy
// straight into the head — `"{title}: {subtitle}"` as the title and the full blurb
// as the description — so 26 of 33 English book titles exceeded 60 characters
// (Grandmère's Garden Under the Moon reached 101) and all 33 descriptions exceeded
// 160, in every language. The fix derives both in one place (src/lib/seoText.ts,
// surfaced as LocalizedBook.metaDescription); this is what stops a new book, or a
// longer subtitle, from quietly reintroducing it.
//
// SCOPE: book detail pages only. 18 non-book pages are also over the budget today
// (mostly /es and /fr, where translation inflates length — es/privacy at 172,
// fr/privacy at 204, fr/ 157 with a 68-char title). Those are tracked separately
// and are deliberately NOT asserted here: failing this test on them would mean
// either widening the limits until they mean nothing, or blocking the book-page
// fix behind unrelated copy edits.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://griotmoon.com';

// Kept in step with src/lib/seoText.ts. Duplicated rather than imported because
// this test reads built output and must not depend on the TS source compiling.
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

// Comments can sit between <head> and <title>, and one of ours mentions "<title>",
// so strip comments before matching or the regex reads the comment instead.
const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, '');

// Measure CONTENT length, not markup length. A description containing a quotation
// mark arrives in the attribute as &quot;, and counting that as six characters
// fails a page that is actually within budget: The Mighty Fist quotes "One finger
// is weak, but a fist is mighty." and measured 168 escaped against 158 real.
// Entities are what the transport needs; the parsed string is what a crawler reads.
// &amp; must be decoded last so "&amp;quot;" does not turn into a quote.
const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const titleOf = (html) => decode((stripComments(html).match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '').trim());
const descOf = (html) =>
  decode((stripComments(html).match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? '').trim());

function bookRoutes() {
  const xml = readFileSync(path.join(ROOT, 'dist', 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].slice(SITE.length))
    .filter((p) => /^(\/(es|fr))?\/books\/[^/]+\/$/.test(p));
}

const read = (p) => readFileSync(path.join(ROOT, 'dist', p.replace(/^\//, ''), 'index.html'), 'utf8');

test('book pages: <title> fits the budget', () => {
  const routes = bookRoutes();
  assert.ok(routes.length >= 90, `expected 33 books x 3 languages, got ${routes.length} routes`);
  const over = routes
    .map((p) => ({ p, t: titleOf(read(p)) }))
    .filter(({ t }) => t.length > TITLE_MAX)
    .map(({ p, t }) => `${p} — ${t.length} chars: ${t}`);
  assert.deepEqual(over, [], `titles over ${TITLE_MAX} chars:\n${over.join('\n')}`);
});

test('book pages: meta description fits the budget, and is not empty', () => {
  const bad = [];
  for (const p of bookRoutes()) {
    const d = descOf(read(p));
    if (d.length === 0) bad.push(`${p} — empty description`);
    else if (d.length > DESCRIPTION_MAX) bad.push(`${p} — ${d.length} chars: ${d}`);
  }
  assert.deepEqual(bad, [], `descriptions outside 1..${DESCRIPTION_MAX}:\n${bad.join('\n')}`);
});

test('book pages: a truncated description ends cleanly', () => {
  // clampMeta either ends on sentence punctuation or appends an ellipsis. A
  // description ending in a bare partial word means the trimming regressed.
  const bad = bookRoutes()
    .map((p) => ({ p, d: descOf(read(p)) }))
    .filter(({ d }) => d.length > 0 && !/[.!?…]$/.test(d))
    .map(({ p, d }) => `${p} — ends "${d.slice(-24)}"`);
  assert.deepEqual(bad, [], `descriptions with a ragged ending:\n${bad.join('\n')}`);
});
