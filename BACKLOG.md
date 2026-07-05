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
- [x] **Amazon Associates tracking ID** — DONE 2026-07-05: the Associates account (Eva Gallo
  login, StoreID storytimewi20-20) is active; created `griotmoon-20` tracking ID, added
  griotmoon.com to the account's website list (child-directed declaration: No), and set the
  tag in `src/lib/amazon.ts`. ⚠️ Follow-up (You): Associates Central shows a red banner
  "The primary account holder needs to finish filling out tax information" — payments are
  blocked until the tax interview is completed (Associates Central > Submit tax information).
- [x] **MailerLite welcome automation** — DONE 2026-07-04: "Griot Moon — Welcome + Trilingual
  Starter Kit" is ACTIVE (trigger: joins griotmoon-signups → rebranded welcome email with the
  starter-kit button pointing at griotmoon.com). Eva's 3 drip emails were Removed (restorable in
  MailerLite) — rebuild them Griot Moon-branded when the PDFs are rebranded. Sender is still
  contact@storytimewitheva.com for deliverability; authenticate griotmoon.com in MailerLite
  (DKIM DNS records at IONOS) then switch the sender.
- [x] **Verify contact@griotmoon.com exists** — DONE 2026-07-05: test email sent from Gmail,
  no bounce after several minutes (IONOS rejects unknown mailboxes within seconds). Mailbox works.
  One follow-up when convenient: confirm someone actually reads that inbox regularly.
- [x] **MailerLite test subscriber** — DONE 2026-07-04: confirmed via the opt-in link; the
  welcome automation fired and "Welcome to Griot Moon! 🌙" arrived. End-to-end verified.
  (Optionally delete the test subscriber from griotmoon-signups later.)
- [x] **Google Search Console** — DONE 2026-07-04: URL-prefix property https://griotmoon.com/
  verified via HTML file (public/google393f037d25edb628.html — keep it), sitemap.xml submitted.
  Optional upgrade later: a Domain property (needs a DNS TXT record at IONOS).

## P2 — Content quality (worth doing soon)

- [x] **Rebrand the lead-magnet PDFs** (DONE 2026-07-04) (Claude, with your review) — all downloads in `public/`
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
- [x] **Author photo** (DONE 2026-07-05: official Amazon Author Central portrait installed on About, EN/ES/FR captions).
- [ ] **Clean emblem file** (You) — nav/favicon use Claude's simplified vector recreation of the
  cowrie emblem. Send the original SVG/high-res PNG to replace `public/favicon.svg` and to
  produce the gold-line dark variant properly.
- [x] **16:9 hero crop for social cards** (DONE 2026-07-04) (You/Claude) — `public/og-image.jpg` is a square-ish
  crop of the fire scene; a purpose-made 1200×630 crop would frame the griot and moon better.
- [ ] **Games content review** (Claude) — the 12 games in `public/games/` were string-rebranded;
  play through them once to catch Eva-era wording or book references in the game content.
- [ ] **Pixel the butterfly** (You decide) — Eva's mascot component still appears on the Profile
  page. Keep it, restyle it as a Griot Moon firefly (fits the fire/night brand), or remove.
- [ ] **Draft cover art** (You) — several site covers come from files stamped `DRAFT`
  (e.g. Ubuntu v01, Yama and Luna v01). Replace in `src/assets/covers/` as finals land.

## P3 — Catalog growth (as publishing progresses)

- [x] **Release automation** — DONE 2026-07-05: `npm run check:releases`
  (scripts/check-amazon-releases.mjs) probes Amazon's product-image endpoint (bot-wall-proof)
  for every coming-soon book with an `expectedAsin`, and `--apply` publishes them in books.ts.
  First run published 5 books that were already live (Prof. Hawel, Thankful Farmer,
  Slow and Strong, Garden of Second Chances, Trees We Plant). Now fully autonomous:
  the GitHub Action (.github/workflows/check-releases.yml) runs it every Monday 09:00 UTC
  and pushes any changes, which auto-deploys via the git-connected Netlify site.
- [x] **All 30 books published** — DONE 2026-07-05: the final 5 were found live via Amazon
  search (Hand That Gives 1069628875, Chief Mael 106946287X, Broken Toy 1069628891,
  Chief's 3 Gifts 1996972928, Chief's Green Rule B0FB4B7235). Zero coming-soon left.
- [x] **4 more live Pawa Seyni books added** (DONE 2026-07-05: catalog is now 34 titles) — add them
  to the catalog when covers/copy are ready: Grandmère's Garden Under the Moon (1996972308) ·
  A Tale of Hope and Humor (1069628867) · The Wolf Pack's Promise (B0F9WNQS9Q) ·
  The Day We Woke Up as Dinosaurs (1996972103).
- [ ] **Kindle editions for the 2 pending batch titles** (You) — per your KDP checklist:
  Kweku and the Wise Forest and The Brothers and the Wise Land have live paperbacks but
  Kindle editions still to publish (EPUBs are ready in the archive).
- [x] **"The Day We Woke Up as Dinosaurs"** (folded into the "4 more live books" item above) — live on Amazon (`dp/1996972103`, Bedtime & Wisdom)
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

**From the 2026-07-05 full audit** (everything HIGH/MED was fixed same-day; these remain):
- [ ] Add JSON-LD structured data to the 57 pages missing it (activities x30, resources,
  contact, links, privacy, terms x3 langs, 12 games). Home/books/about/faq already have it.
- [ ] Localize book ES/FR `alt`/title suffixes further if wanted; titles now differ per lang
  via localized subtitles (done), but game pages have no hreflang (single-URL trilingual, LOW).
- [ ] localStorage key `eva_reading_tracker_v1` (progress.ts + reading-tracker game) — internal
  only; renaming needs a one-time migration in both files or users lose history.
- [ ] Performance: LCP 5.5s on throttled mobile (was 8.1s before webp/1280px hero). Next lever:
  responsive srcset / AVIF / CDN image transforms.
- [ ] 8 react-refresh lint warnings (Pixel.tsx, language.tsx, toast.tsx) — DX only.

- [x] **Push to GitHub + git-connected Netlify** — DONE 2026-07-05: repo at
  github.com/PawaSeyni/griotmoon (private, branch `main`), linked in Netlify; every push to
  main builds (`npm run build`, CI prerender via @sparticuz/chromium, validated 165/165 routes)
  and deploys automatically. Weekly release-watch Action validated with a manual dispatch.
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
