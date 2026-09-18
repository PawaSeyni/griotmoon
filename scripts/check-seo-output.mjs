import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.resolve('dist');
const SITE = 'https://griotmoon.com';
const xml = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const failures = [];

const count = (html, re) => [...html.matchAll(re)].length;
const hrefs = (html, re) => [...html.matchAll(re)].map(m => m[1]);

for (const absolute of locs) {
  const u = new URL(absolute);
  if (u.origin !== SITE) failures.push(`off-origin sitemap URL: ${absolute}`);

  // Standalone game HTML files are intentionally static and not SPA snapshots.
  if (path.extname(u.pathname)) continue;

  if (u.pathname !== '/' && !u.pathname.endsWith('/')) {
    failures.push(`non-canonical sitemap URL lacks trailing slash: ${absolute}`);
  }

  const rel = u.pathname === '/' ? 'index.html' : path.join(u.pathname.slice(1), 'index.html');
  let html;
  try {
    await stat(path.join(DIST, rel));
    html = await readFile(path.join(DIST, rel), 'utf8');
  } catch {
    failures.push(`missing prerendered route: ${u.pathname} -> dist/${rel}`);
    continue;
  }

  const canonicals = hrefs(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/gi);
  if (canonicals.length !== 1) {
    failures.push(`${u.pathname}: expected 1 canonical, found ${canonicals.length}`);
  } else if (canonicals[0] !== absolute) {
    failures.push(`${u.pathname}: canonical ${canonicals[0]} != sitemap ${absolute}`);
  }

  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
    failures.push(`${u.pathname}: sitemap route is noindex`);
  }

  const alternates = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["'][^>]*>/gi)]
    .map(m => ({ lang: m[1], href: m[2] }));
  for (const lang of ['en', 'es', 'fr', 'x-default']) {
    if (alternates.filter(a => a.lang === lang).length !== 1) {
      failures.push(`${u.pathname}: expected exactly one hreflang=${lang}`);
    }
  }

  if (count(html, /cloudflareinsights\.com/gi) > 0 || count(html, /beacon\.min\.js/gi) > 0) {
    failures.push(`${u.pathname}: stale Cloudflare Web Analytics reference in rendered HTML`);
  }
}

// Every internal link in every snapshot must resolve to a real file in dist.
// There is no SPA fallback on this site, so a link to a route that was not
// prerendered is a hard 404 in production. This is exactly how the six
// /resources/<slug>/ article pages shipped dead on 2026-09-18: the route
// existed in React, the sitemap generator knew the slugs, but the committed
// sitemap was stale, so prerender never wrote them.
const { readdir } = await import('node:fs/promises');
async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.name.endsWith('.html')) yield full;
  }
}
const seenLinks = new Set();
for await (const file of walk(DIST)) {
  const html = await readFile(file, 'utf8');
  // The prerender serves dist/ from localhost:5099; that origin must never
  // survive into a snapshot (absolute modulepreload hrefs did, on Vite 8).
  const leak = html.match(/https?:\/\/localhost(:\d+)?[^"'\s<]*/);
  if (leak) failures.push(`prerender origin leaked into ${path.relative(DIST, file)}: ${leak[0]}`);
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    if (seenLinks.has(href)) continue;
    seenLinks.add(href);
    const rel = href.slice(1);
    const candidates = path.extname(rel)
      ? [rel]
      : [path.join(rel, 'index.html'), rel + '.html'];
    let found = false;
    for (const c of candidates) {
      try { await stat(path.join(DIST, c)); found = true; break; } catch { /* next */ }
    }
    if (!found) failures.push(`dead internal link ${href} (first seen in ${path.relative(DIST, file)})`);
  }
}

const shell = await readFile(path.join(DIST, 'index.html'), 'utf8');
if (!shell.includes('https://plausible.io/js/pa-XNEfN50ABtDJcf6klL0ua.js')) {
  failures.push('Plausible production script missing from dist/index.html');
}

if (failures.length) {
  console.error('SEO output validation failed:\n' + failures.map(x => '  - ' + x).join('\n'));
  process.exit(1);
}
console.log(`SEO output validation passed for ${locs.length} sitemap URLs and ${seenLinks.size} distinct internal links.`);
