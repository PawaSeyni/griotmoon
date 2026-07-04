# Griot Moon — griotmoon.com

African heritage picture books for children ages 3–9, by **Pawa Seyni** (Pawa Press).
Sister site to [storytimewitheva.com](https://storytimewitheva.com), sharing the same
React + Vite + Tailwind + Netlify architecture with the "Midnight Indigo" theme.

## Stack

- React 18 + TypeScript + Vite, React Router (EN/ES/FR localized routes)
- Tailwind CSS — brand palette lives in `tailwind.config.js` (the raw `purple`/`pink`/
  `yellow`/`orange` scales are re-pointed at night indigo / terracotta / moon gold / fire amber)
- Netlify: hosting, Forms (contact), prerendering via `scripts/prerender.mjs`

## Commands

- `npm run dev` — local dev server
- `npm run build` — typecheck + build + prerender (what Netlify runs)
- `npm run build:spa` — build without prerendering
- `npm run gen:sitemap` — regenerate `public/sitemap.xml` from the book catalog

## Content

- **Books**: `src/data/books.ts` — the Pawa Seyni Collection (Ubuntu, Yam and Egg,
  The Whistling Secret, The Mighty Fist, Chief Green Rule). All are `coming-soon`;
  add the Amazon ASIN via `dp('...')` and remove the flag as each goes live.
- **Covers**: `src/assets/covers/*.svg` are designed placeholders — replace with final art.
- **Hero art**: `src/assets/griot-fire.jpg` (the griot's fire scene), also `public/og-image.jpg`.

## Launch TODOs

- [x] MailerLite: griotmoon-signups group + dedicated form wired in (2026-07-04)
- [ ] Add a Plausible site for griotmoon.com (`index.html` has the slot)
- [ ] Amazon Associates tag in `src/lib/amazon.ts` + real ASINs in `books.ts`
- [ ] Replace placeholder covers and the About-page image
- [ ] Regenerate the lead-magnet PDFs with Griot Moon branding (`public/*.pdf` are Eva-branded)
- [ ] Add social accounts to Footer, Links page, and Home JSON-LD `sameAs` as they go live
