// IndexNow: tell Bing (and the other IndexNow engines) which pages changed in this deploy.
//
// Runs as the LAST step of the Netlify production build (after check:hydration), so a
// build the gates reject never announces anything. It fingerprints every sitemap URL by
// its visible content (title, description, canonical, body text; not the hashed asset
// filenames, which change on every code deploy), publishes the fingerprints at
// /indexnow-manifest.json, and compares them with the manifest on the live site. Only
// new or changed URLs are submitted, plus URLs that disappeared, so engines learn about
// removals. URLs come from dist/sitemap.xml, not from the files on disk, so noindex
// routes and stray files are never submitted and /games/<slug>.html keeps its extension.
// IndexNow is a hint, not an indexing guarantee, and a failure here never fails the build.
//
//   node scripts/indexnow.mjs              # fingerprint only (no CONTEXT=production)
//   CONTEXT=production node scripts/indexnow.mjs --dry-run   # show what would be sent
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const DRY_RUN = process.argv.includes('--dry-run');

const urls = [...(await readFile(path.join(DIST, 'sitemap.xml'), 'utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const SITE_URL = new URL(urls[0]).origin;
const HOST = new URL(SITE_URL).host;

function fileFor(url) {
  const p = decodeURIComponent(new URL(url).pathname);
  return path.join(DIST, p.endsWith('/') ? `${p}index.html` : p);
}

function fingerprint(html) {
  const pick = re => (html.match(re) || [])[1] || '';
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const material = [pick(/<title>([^<]*)/i), pick(/name="description" content="([^"]*)"/i), pick(/rel="canonical" href="([^"]*)"/i), body].join('\n');
  return createHash('sha256').update(material).digest('hex').slice(0, 16);
}

const manifest = {};
const missing = [];
for (const url of urls) {
  try {
    manifest[url] = fingerprint(await readFile(fileFor(url), 'utf8'));
  } catch {
    missing.push(url);
  }
}
await writeFile(path.join(DIST, 'indexnow-manifest.json'), JSON.stringify(manifest, null, 1));
console.log(`indexnow: fingerprinted ${Object.keys(manifest).length} sitemap URLs${missing.length ? ` (${missing.length} with no file, left out: ${missing.slice(0, 3).join(', ')})` : ''}`);

if (process.env.CONTEXT !== 'production') {
  console.log(`indexnow: CONTEXT=${process.env.CONTEXT || 'local'}, not submitting`);
  process.exit(0);
}

try {
  const key = (await readdir(DIST)).find(f => /^[0-9a-f]{32}\.txt$/.test(f))?.slice(0, 32);
  if (!key) throw new Error('no IndexNow key file in dist/');
  let previous = {};
  try {
    const r = await fetch(`${SITE_URL}/indexnow-manifest.json`, { signal: AbortSignal.timeout(10000) });
    if (r.ok) previous = await r.json();
  } catch {
    /* first deploy with IndexNow: everything counts as new */
  }
  const changed = Object.keys(manifest).filter(u => previous[u] !== manifest[u]);
  const removed = Object.keys(previous).filter(u => !(u in manifest));
  const urlList = [...changed, ...removed];
  if (!urlList.length) {
    console.log('indexnow: no content changes, nothing to submit');
    process.exit(0);
  }
  if (DRY_RUN) {
    console.log(`indexnow: --dry-run, would submit ${urlList.length} URL(s) (${changed.length} new/changed, ${removed.length} removed)`);
    urlList.slice(0, 10).forEach(u => console.log(`  ${u}`));
    process.exit(0);
  }
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE_URL}/${key}.txt`, urlList }),
    signal: AbortSignal.timeout(15000),
  });
  console.log(`indexnow: submitted ${urlList.length} URL(s) (${changed.length} new/changed, ${removed.length} removed) -> HTTP ${res.status}`);
} catch (e) {
  console.log(`indexnow: skipped (${e.message}); the deploy is unaffected`);
}
