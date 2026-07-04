# Griot Moon — Backlog & Launch Checklist

Last updated: 2026-07-04. The site is **live at [griotmoon.com](https://griotmoon.com)**
with the full 30-book catalog. This file tracks everything NOT done yet.
Check items off as they land; each item says who can do it
(**You** = needs your accounts/decisions · **Claude** = can be done in a session ·
**Joint** = Claude drives your browser, you approve).

---

## P1 — Before announcing the site publicly

- [ ] **Plausible analytics** (You/Joint) — create a site for `griotmoon.com` at plausible.io,
  paste its script tag into `index.html` (the slot is marked with a comment), redeploy.
  The Privacy page already describes Plausible, so this also makes the policy accurate.
- [ ] **Amazon Associates tracking ID** (You) — in your Associates account, add a tracking ID
  for Griot Moon (e.g. `griotmoon-20`), then set it in `src/lib/amazon.ts`
  (`AMAZON_ASSOCIATE_TAG`, currently `''`). Until then Buy links work but earn no commission.
- [ ] **MailerLite welcome automation** (You/Joint) — the new form works and subscribers land in
  `griotmoon-signups`, but no welcome email fires yet. In MailerLite: copy Eva's welcome
  automation, set trigger to "subscriber joins group → griotmoon-signups", swap the PDF links.
- [ ] **Verify contact@griotmoon.com exists** (You) — the domain has IONOS mail records, but
  confirm a `contact@griotmoon.com` mailbox (or alias) is actually set up; the Footer,
  Contact page, and FAQ all point to it.
- [ ] **MailerLite test subscriber** (You) — a double-opt-in email for
  `pnguer+griotmoon-test@gmail.com` is in your inbox from endpoint testing.
  Confirm it (to watch the flow) or delete the pending subscriber.
- [ ] **Google Search Console** (You/Joint) — add and verify `griotmoon.com`, submit
  `https://griotmoon.com/sitemap.xml` (159 URLs, regenerates on every build).

## P2 — Content quality (worth doing soon)

- [ ] **Rebrand the lead-magnet PDFs** (Claude, with your review) — all downloads in `public/`
  are still Story Time with Eva-branded inside: `bedtime-routine` (EN/ES/FR),
  `bilingual-starter-kit`, `bilingual-flashcards`, `parents-guide` (EN/ES/FR),
  `follow-up-activities` (EN/ES/FR). Regenerate with Griot Moon branding.
- [ ] **Spot-check 8 drafted book descriptions** (You) — these had auto-generated placeholder
  metadata locally, so the site copy was written from titles/themes and may not match the
  printed books: Our Child, The Clever Pots, The Kindness Garden, The Laughing Village,
  The Servant King, Yama's Brave Choice, The Hunt with Two Paths, The Trees We Plant for
  Tomorrow. Also skim the ES/FR translations of all 30 (written by Claude).
- [ ] **Resources page content pass** (Claude, with your direction) — `src/pages/Resources.tsx`
  (~1,000 lines) still carries Eva-era articles with names swapped. The reading-milestone
  guides are generic, but the framing should be re-grounded in Griot Moon's heritage angle.
- [ ] **Author photo** (You) — the About page uses the fire artwork as a placeholder portrait.
  Drop a real photo (or a chosen illustration) into `src/assets/` and swap the import.
- [ ] **Clean emblem file** (You) — nav/favicon use Claude's simplified vector recreation of the
  cowrie emblem. Send the original SVG/high-res PNG to replace `public/favicon.svg` and to
  produce the gold-line dark variant properly.
- [ ] **16:9 hero crop for social cards** (You/Claude) — `public/og-image.jpg` is a square-ish
  crop of the fire scene; a purpose-made 1200×630 crop would frame the griot and moon better.
- [ ] **Games content review** (Claude) — the 12 games in `public/games/` were string-rebranded;
  play through them once to catch Eva-era wording or book references in the game content.
- [ ] **Pixel the butterfly** (You decide) — Eva's mascot component still appears on the Profile
  page. Keep it, restyle it as a Griot Moon firefly (fits the fire/night brand), or remove.
- [ ] **Draft cover art** (You) — several site covers come from files stamped `DRAFT`
  (e.g. Ubuntu v01, Yama and Luna v01). Replace in `src/assets/covers/` as finals land.

## P3 — Catalog growth (as publishing progresses)

- [ ] **ASINs for the 10 coming-soon titles** — when each goes live on Amazon, add the ASIN via
  `dp('...')` in `src/data/books.ts` and remove `status: 'coming-soon'`:
  The Chief's Green Rule · Chief Mael's Final Gift · The Chief's 3 Gifts · The Broken Toy ·
  The Hand That Gives · The Thankful Farmer · Slow and Strong Wins the Race ·
  The Clever Scientist (Prof. Hawel) · The Garden of Second Chances · The Trees We Plant for Tomorrow.
- [ ] **Kindle editions for the 2 pending batch titles** (You) — per your KDP checklist:
  Kweku and the Wise Forest and The Brothers and the Wise Land have live paperbacks but
  Kindle editions still to publish (EPUBs are ready in the archive).
- [ ] **"The Day We Woke Up as Dinosaurs"** — live on Amazon (`dp/1996972103`, Bedtime & Wisdom)
  but not on the site because no local cover/metadata was found. Add it once assets exist.
- [ ] **"The Bridge of Unity"** — finished covers exist (nested inside The Kindness Garden folder);
  decide whether it joins the catalog.
- [ ] **ES/FR edition flags** — 11 books currently show 🇺🇸-only (EN-only covers found locally).
  As translated editions publish, flip their `languages` to the trilingual set.
- [ ] **Wide ebook distribution** (You) — Kobo / Apple Books / B&N / Google Play per your
  `EBOOK_DISTRIBUTION_WORKFLOW.md` playbook.

## P4 — Marketing & ecosystem (when ready)

- [ ] **Social accounts** (You) — create Griot Moon profiles (Instagram, Pinterest, Facebook,
  TikTok, YouTube, Threads), then re-add: Footer icon row, Links-page rows, and Home
  JSON-LD `sameAs` (the removed markup is in git history, commit `11f039b`).
- [ ] **Pinterest domain verification** — Eva's tag was removed from `index.html`; add Griot
  Moon's own when the Pinterest account exists.
- [ ] **Cross-link the sibling sites** (You decide) — add Griot Moon to storytimewitheva.com's
  Links page/footer and vice versa ("sister press" placement).
- [ ] **Marketing assets** (Claude) — social announcement kit, Pinterest pins per book,
  a launch email for the Eva list introducing Griot Moon.

## P5 — Technical housekeeping (low urgency)

- [ ] **Push to GitHub + git-connected Netlify** — deploys are currently manual (Netlify MCP
  upload). Create a GitHub repo, connect it in Netlify for auto-deploys on push.
- [ ] **Review the Lighthouse report** — the `@netlify/plugin-lighthouse` audit runs on every
  deploy (see deploy summary in the Netlify dashboard); set score thresholds once baselined.
- [ ] **Prune unused translation keys** — Links/Footer still carry unused social-CTA strings
  (pinterestCta, tiktokCta, amazonAuthor, …). Harmless; clean up on the next content pass.
- [ ] **Optimize cover weight** — 30 covers ≈ 4.8 MB total (~165 KB each). Fine for now;
  consider WebP/AVIF via the build pipeline if the Books page LCP needs it.

---

## Done (for context)

2026-07-04, from design pitch to live site in one day: 3 design rounds → Midnight Indigo +
cowrie emblem + village-fire hero · repo scaffolded from storytimewitheva (trilingual,
15 pages, games) · full rebrand + theme via Tailwind scale re-pointing · real 30-book catalog
with production covers and 20 live ASINs · real author bio (EN/ES/FR) · Netlify site + Forms ·
IONOS DNS cutover (mail untouched) · HTTPS + canonical redirect · sitemap ·
MailerLite `griotmoon-signups` group + form, endpoint verified.
