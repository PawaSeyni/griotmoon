# Griot Moon — griotmoon.com

African heritage picture books for children ages 3–9, by **Pawa Seyni** (Pawa Press).
Sister site to [storytimewitheva.com](https://storytimewitheva.com), sharing the same
React + Vite + Tailwind + Netlify architecture with the "Midnight Indigo" theme.

## Stack

- React 18 + TypeScript + Vite, React Router (EN/ES/FR localized routes)
- Tailwind CSS — brand palette lives in `tailwind.config.js` (the raw `purple`/`pink`/
  `yellow`/`orange` scales are re-pointed at night indigo / terracotta / moon gold / fire amber)
- Netlify: hosting, Forms (contact), prerendering via `scripts/prerender.mjs`
- CI/CD: git-connected Netlify — every push to `main` (GitHub `PawaSeyni/griotmoon`)
  builds and deploys. A weekly GitHub Action (`.github/workflows/check-releases.yml`)
  probes Amazon for coming-soon books and auto-publishes any that go live.

## Commands

- `npm run dev` — local dev server
- `npm run build` — typecheck + build + prerender
- `npm run build:spa` — build without prerendering
- `npm run gen:sitemap` — regenerate `public/sitemap.xml` from the book catalog
- `npm run verify` — the deploy gate (Netlify build command and CI): checks, build +
  prerender, SEO output, then the hydration check
- `npm run check:hydration` — hydrate every prerendered page in headless Chrome
  (needs a built `dist/`)

## Hydration contract

`src/main.tsx` hydrates the prerendered snapshots (`scripts/prerender.mjs`) rather than
repainting them; that is what keeps mobile Lighthouse in the 90s. The snapshot is taken
**after** effects run, so a component's first render must already produce what the
snapshot shows. Hydration breaks if a component:

- renders `Math.random()`, `Date.now()`/`new Date()` or other per-load values, or
- changes visible output in a mount effect (e.g. `useState(false)` then
  `useEffect(() => setShown(true))`; start from the value the snapshot will contain).

A broken page still looks right, it just silently repaints and loses the LCP gain.
`scripts/check-hydration.mjs` (last step of `npm run verify`) loads every prerendered
route at its production URL and fails the build on React errors #418/#422/#423/#425.
Attribute-only differences (e.g. a `className`) are not reported by React's production
build, so the check cannot see them.

## Content

- **Books**: `src/data/books.ts` — the Pawa Seyni Collection, 34 published titles with
  real Amazon ASINs. For future titles: add the book as `status: 'coming-soon'` with an
  `expectedAsin` (the paperback ISBN-10); the weekly release check publishes it automatically
  once the Amazon listing goes live (`npm run check:releases -- --apply` to run it manually).
- **Covers**: `src/assets/covers/*.jpg` — real cover art from the production archive.
- **Hero art**: `src/assets/griot-fire.jpg` (the griot's fire scene), also `public/og-image.jpg`.

## Launch TODOs

See [BACKLOG.md](BACKLOG.md) for the full prioritized checklist. Highlights:

- [x] MailerLite: griotmoon-signups group + dedicated form wired in (2026-07-04)
- [x] Real covers, About-page portrait, 34-book catalog with live ASINs (2026-07-05)
- [x] Lead-magnet PDFs rebranded for Griot Moon (2026-07-04)
- [x] GitHub + git-connected Netlify + weekly Amazon release watch (2026-07-05)
- [x] Analytics: Plausible in `index.html` (2026-08-15). Cloudflare Web Analytics
      was removed 2026-08-23 — two beacons, two disagreeing pageview counts, and
      only Plausible has the custom goals (`src/lib/analytics.ts`).
- [ ] Amazon Associates tag in `src/lib/amazon.ts`
- [ ] Add social accounts to Footer, Links page, and Home JSON-LD `sameAs` as they go live
