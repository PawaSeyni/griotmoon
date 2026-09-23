// P2-5: every welcome email links to /dl/<lang>/<magnet>. These rules must cover every
// registered magnet in every language, point at files that exist, and fall back rather
// than 404 when the subscriber's lead_magnet field is blank or unknown.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readPdfMap, validate, buildRedirects, LANGS, FALLBACK_MAGNET } from '../../scripts/gen-download-redirects.mjs';

const map = readPdfMap();

test('every registered magnet has a PDF in every language, and every file exists', () => {
  assert.ok(Object.keys(map).length >= 5, 'magnets parsed');
  assert.deepEqual(validate(map), []);
});

test('one exact rule per magnet and language, pointing at that PDF', () => {
  const text = buildRedirects(map);
  for (const [slug, pdfs] of Object.entries(map)) {
    for (const lang of LANGS) assert.ok(text.includes(`/dl/${lang}/${slug}  ${pdfs[lang]}  302`), `${lang}/${slug}`);
  }
});

test('exact rules come before the fallbacks, and the fallbacks are the starter kit', () => {
  const lines = buildRedirects(map).trim().split('\n').slice(1);
  const firstFallback = lines.findIndex((l) => l.includes('/*'));
  assert.ok(firstFallback > 0 && lines.slice(0, firstFallback).every((l) => !l.includes('*')), 'exact rules first');
  for (const lang of LANGS) assert.ok(lines.includes(`/dl/${lang}/*  ${map[FALLBACK_MAGNET][lang]}  302`), `${lang} fallback`);
  assert.equal(lines.at(-1), `/dl/*  ${map[FALLBACK_MAGNET].en}  302`);
});

test('validate catches a missing language and a missing file', () => {
  assert.match(validate({ [FALLBACK_MAGNET]: map[FALLBACK_MAGNET], broken: { en: '/nope.pdf', es: '/nope.pdf' } }).join('|'), /broken: no fr pdf/);
  assert.match(validate({ [FALLBACK_MAGNET]: map[FALLBACK_MAGNET], gone: { en: '/does-not-exist.pdf', es: '/x.pdf', fr: '/x.pdf' } }).join('|'), /not in public/);
});
