// Rewrites the hard-coded Lexend preload hash in dist/index.html to whatever
// hash the current build actually emitted. Without this, a @fontsource or Vite
// bump changes the hash and the <link rel="preload"> silently 404s.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const assets = readdirSync('dist/assets');
const font = assets.find(f => /^lexend-latin-wght-normal-.*\.woff2$/.test(f));
if (!font) {
  console.error('fix-font-preload: no lexend woff2 found in dist/assets — preload left untouched');
  process.exit(0);
}
const path = 'dist/index.html';
const html = readFileSync(path, 'utf8');
const updated = html.replace(/\/assets\/lexend-latin-wght-normal-[^"]+\.woff2/, `/assets/${font}`);
if (updated !== html) {
  writeFileSync(path, updated);
  console.log(`fix-font-preload: preload now points at /assets/${font}`);
} else {
  console.log('fix-font-preload: preload already correct');
}
