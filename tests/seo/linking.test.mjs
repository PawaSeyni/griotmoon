// Internal linking and no thin pages (parity plan P3-2), ported from Story Time with Eva,
// checked on the prerendered dist.
//
//   1. ORPHANS: every indexable route (sitemap) has at least one inbound link from a
//      DIFFERENT prerendered page in the same language. A page nobody links to is a page
//      crawlers reach only through the sitemap and visitors never reach at all.
//   2. THIN PAGES: every indexable route carries real content: at least MIN_WORDS words of
//      visible text inside <main>, or at least two book links (a collection is its books).
//   3. STRUCTURED DATA: every same-site URL inside any page's JSON-LD (items, breadcrumbs,
//      page urls) is a real prerendered route. Eva checks this for collections and
//      journeys only; Griot Moon has neither, so it is checked everywhere.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://griotmoon.com';
// Below MIN_WORDS a page must earn its place another way: two book links (a collection is
// its books) or an interactive tool (a form, an input, a canvas: the content IS the tool).
const MIN_WORDS = 60;

// The sitemap the build generated and ships.
const sitemap = readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].slice(SITE.length)).filter((p) => !p.endsWith('.html'));
const norm = (p) => (p.replace(/\/+$/, '') || '/');
const fileFor = (p) => path.join(DIST, norm(p) === '/' ? 'index.html' : `${norm(p).replace(/^\//, '')}/index.html`);
const langOf = (p) => (/^\/(fr|es)(\/|$)/.exec(p)?.[1] ?? 'en');
const html = new Map(routes.map((p) => [norm(p), existsSync(fileFor(p)) ? readFileSync(fileFor(p), 'utf8') : null]));

const mainText = (h) => {
  const m = /<main[\s\S]*?<\/main>/.exec(h)?.[0] ?? '';
  return m.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' ').trim();
};
const linksOf = (h) => [...h.matchAll(/href="(\/[^"#?]*)/g)].map((m) => norm(m[1]));

test('linking — every indexable route is prerendered', () => {
  for (const [p, h] of html) assert.ok(h, `${p}: not prerendered`);
});

test('linking — no orphan: every indexable route has an inbound link from another page in its language', () => {
  const inbound = new Map([...html.keys()].map((p) => [p, 0]));
  for (const [from, h] of html) {
    if (!h) continue;
    for (const to of new Set(linksOf(h))) if (to !== from && inbound.has(to) && langOf(to) === langOf(from)) inbound.set(to, inbound.get(to) + 1);
  }
  const orphans = [...inbound].filter(([, n]) => n === 0).map(([p]) => p);
  assert.deepEqual(orphans, [], `orphan routes (in the sitemap, linked from nowhere):\n  ${orphans.join('\n  ')}`);
});

test('linking — no thin page: every indexable route has real content in <main>', () => {
  const thin = [];
  for (const [p, h] of html) {
    if (!h) continue;
    const words = mainText(h).split(' ').filter((w) => w.length > 1).length;
    const bookLinks = new Set(linksOf(h).filter((l) => /\/books\/[a-z0-9-]+$/.test(l))).size;
    const main = /<main[\s\S]*?<\/main>/.exec(h)?.[0] ?? '';
    // A form, an input or a row of controls is a tool, not a thin page.
    const interactive = /<(form|input|textarea|canvas|select)\b/.test(main) || (main.match(/<button\b/g) ?? []).length >= 6;
    if (words < MIN_WORDS && bookLinks < 2 && !interactive) thin.push(`${p} (${words} words, ${bookLinks} book links)`);
  }
  assert.deepEqual(thin, [], `thin pages:\n  ${thin.join('\n  ')}`);
});

test('structured data: every same-site URL in any JSON-LD block is a real prerendered route', () => {
  const bad = [];
  let checked = 0;
  for (const [p, h] of html) {
    if (!h) continue;
    for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
      const urls = JSON.stringify(JSON.parse(m[1])).match(/https:\/\/griotmoon\.com[^"\\]*/g) ?? [];
      for (const url of urls) {
        const route = url.slice(SITE.length).split(/[?#]/)[0];
        if (/\.(pdf|jpe?g|png|webp|svg|ico|xml|json)$/i.test(route)) {
          if (!existsSync(path.join(DIST, route))) bad.push(`${p}: asset ${url} is not in dist/`);
        } else {
          checked++;
          if (!html.has(norm(route)) && !existsSync(fileFor(route))) bad.push(`${p}: ${url} is not a prerendered route`);
        }
      }
    }
  }
  assert.ok(checked > 50, `expected many JSON-LD page URLs, checked ${checked}`);
  assert.deepEqual(bad, [], `JSON-LD points at missing pages:\n  ${bad.join('\n  ')}`);
});
