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
- `npm run build` — typecheck + build + prerender (what Netlify runs)
- `npm run build:spa` — build without prerendering
- `npm run gen:sitemap` — regenerate `public/sitemap.xml` from the book catalog

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
- [x] Analytics: Cloudflare Web Analytics beacon in `index.html` (2026-07-05)
- [ ] Amazon Associates tag in `src/lib/amazon.ts`
- [ ] Add social accounts to Footer, Links page, and Home JSON-LD `sameAs` as they go live
