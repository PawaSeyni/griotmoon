// Checks whether "coming-soon" books have gone live on Amazon, and (with
// --apply) flips them to published in src/data/books.ts.
//
//   node scripts/check-amazon-releases.mjs           -> report only
//   node scripts/check-amazon-releases.mjs --apply   -> also rewrite books.ts
//
// A coming-soon book is checkable once it carries an `expectedAsin` (the
// ISBN-10 assigned to its paperback; Amazon uses the ISBN-10 as the ASIN).
// Detection: https://www.amazon.com/dp/<asin> returns HTTP 200 for a live
// listing and 404 for an unknown ASIN. Amazon sometimes bot-blocks with
// 503/captcha; those are reported as UNKNOWN and never treated as "live".
import { readFileSync, writeFileSync } from 'node:fs';

const BOOKS = new URL('../src/data/books.ts', import.meta.url).pathname;
const APPLY = process.argv.includes('--apply');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const src = readFileSync(BOOKS, 'utf8');

// Parse the catalog: id, coming-soon flag, expectedAsin, per-book source span.
const entries = [];
const re = /id: '([a-z0-9-]+)',/g;
let m;
while ((m = re.exec(src))) entries.push({ id: m[1], start: m.index });
entries.forEach((e, i) => { e.end = i + 1 < entries.length ? entries[i + 1].start : src.length; });

const candidates = [];
for (const e of entries) {
  const body = src.slice(e.start, e.end);
  if (!body.includes("status: 'coming-soon',")) continue;
  const asin = body.match(/expectedAsin: '([0-9X]{10})',/);
  if (asin) candidates.push({ id: e.id, asin: asin[1] });
  else console.log(`SKIP     ${e.id}  (coming-soon, no expectedAsin yet)`);
}

async function check(asin) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`https://www.amazon.com/dp/${asin}`, {
        method: 'GET', redirect: 'follow',
        headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
      });
      const text = await res.text();
      if (res.status === 404) return 'not-live';
      if (res.status === 200) {
        // captcha page also comes back 200 sometimes; require product markers
        if (/captcha/i.test(text)) return 'unknown';
        if (/id="productTitle"|id="title"|dp-container/.test(text)) return 'live';
        return 'unknown';
      }
      if (res.status === 503) { await new Promise(r => setTimeout(r, 4000)); continue; }
      return 'unknown';
    } catch { return 'unknown'; }
  }
  return 'unknown';
}

let updated = src;
const released = [];
for (const c of candidates) {
  const status = await check(c.asin);
  console.log(`${status === 'live' ? 'LIVE  🎉' : status === 'not-live' ? 'not yet' : 'UNKNOWN '} ${c.id}  dp/${c.asin}`);
  if (status === 'live') {
    released.push(c);
    if (APPLY) {
      const e = entries.find(x => x.id === c.id);
      let body = updated.slice(updated.indexOf(`id: '${c.id}',`), );
      // operate inside this book's span only
      const start = updated.indexOf(`id: '${c.id}',`);
      const nextIdx = entries[entries.indexOf(entries.find(x => x.id === c.id)) + 1];
      const end = nextIdx ? updated.indexOf(`id: '${nextIdx.id}',`) : updated.length;
      let span = updated.slice(start, end);
      span = span
        .replace("amazonUrl: dp(''),", `amazonUrl: dp('${c.asin}'),`)
        .replace(/\n\s*status: 'coming-soon',/, '')
        .replace(new RegExp(`\\n\\s*expectedAsin: '${c.asin}',`), '');
      updated = updated.slice(0, start) + span + updated.slice(end);
    }
  }
  await new Promise(r => setTimeout(r, 2500)); // be polite to Amazon
}

if (APPLY && released.length) {
  writeFileSync(BOOKS, updated);
  console.log(`\nApplied: ${released.map(r => r.id).join(', ')} now published in books.ts.`);
  console.log('Next: npm run gen:sitemap && npm run build:spa, then deploy.');
} else if (released.length) {
  console.log(`\n${released.length} book(s) are LIVE. Re-run with --apply to publish them in books.ts.`);
} else {
  console.log('\nNo newly released books.');
}
