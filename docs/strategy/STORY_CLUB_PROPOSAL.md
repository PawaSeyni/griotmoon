# Griot Moon Weekly Story Club: proposal and review

Status: **proposal, not approved, nothing built.** Added 8 October 2026.

- Part 1 is the external analysis Papa supplied, kept as written (links unchanged).
- Part 2 is Claude's review of it against the repo, the catalog, the KDP records
  and Plausible as of 8 October 2026.

---

## Part 1: The analysis (as supplied)

**I recommend a “Griot Moon Weekly Story Club” at CAD $7.99 per month:** one children’s ebook unlocked each week, with English, French, and Spanish editions included, and each story available for three calendar months.

The practical delivery method is a weekly email linking to a private online reader. **An ordinary PDF or EPUB attachment cannot reliably expire after someone downloads it.** This plan controls access through your website; it cannot erase screenshots or copies a reader has already captured.

This is a researched implementation plan. I have not changed the website.

### What the current website supports

Griot Moon already presents African heritage stories, multilingual reading, activities, book discovery, and a Profile link. These provide a good starting point for a subscription. However, the public pages do not establish whether the Profile feature has secure accounts or whether a payment backend exists. Those need technical verification before choosing the final integration. [griotmoon.com](https://griotmoon.com/?utm_source=chatgpt.com)

The catalogue lists 33 books and shows language availability by title. Some entries, including *The Yam and the Egg* and *Kweku and the Wise Forest*, currently show only English. **A three-language website does not establish that every full book is ready in all three languages.** [Griot Moon](https://griotmoon.com/books?utm_source=chatgpt.com)

The first implementation task should therefore be an inventory of complete, approved ebook files—not just catalogue listings.

### The subscription offer

| Feature | Recommended launch policy |
|---|---|
| Subscription unit | One family account managed by a parent or guardian |
| Delivery | First story immediately after successful payment; another every seven days |
| Weekly entitlement | One distinct story, with all three language editions |
| Reading period | Three calendar months from each story’s unlock date |
| Language choice | Preferred email language plus optional links for any or all three book languages |
| Reader | Mobile-friendly browser reader with language switching |
| Cancellation | Stop renewal; continue weekly releases through the paid period |
| Already released books | Remain available until their individual expiry dates |
| Permanent ownership | Separate purchase option, where available |

Include all three languages in the base price. Charging extra for French or Spanish would weaken the feature that most clearly distinguishes this offer.

The positioning should emphasize **African heritage, family reading, and experiencing the same story across languages**. Competing on catalogue size would be difficult.

### Pricing research and recommendation

Prices below are published prices checked during this research; currencies are deliberately kept separate.

| Alternative | Published price or model | Implication for Griot Moon |
|---|---|---|
| Epic Family | US $13.99/month or US $84.99/year | A large digital library creates a strong value benchmark |
| BookBox | Free multilingual animated stories; no signup required | Multilingual content alone is insufficient differentiation |
| Bookroo picture-book club | Advertised from $19.95; physical books | Useful as a curated-family-experience comparison, but not a direct digital price benchmark |

Epic’s official help centre confirms its prices, while its website advertises more than 40,000 books and related content. BookBox advertises free stories across more than 50 languages. Bookroo’s physical-book offer should not be treated as evidence that families will pay the same amount for temporary digital access. [Epic Help Center](https://support.getepic.com/hc/en-us/articles/204259899-How-much-does-Epic-Family-cost?utm_source=chatgpt.com)

My proposed prices are **commercial hypotheses to test**, not established customer willingness to pay:

| Offer | Proposed CAD price | Recommendation |
|---|---:|---|
| Monthly family subscription | **$7.99/month** | Launch with this |
| Founding-member promotion | $5.99/month for the first three billing months | Optional limited promotion; show the later price clearly |
| Annual subscription | $79/year | Introduce after validating content supply and retention |
| Three-month gift membership | $23.97, non-renewing | Add after the core subscription works |

At $7.99/month, the average cost is approximately **$1.84 per weekly story**, including access to its three language editions.

Avoid launching multiple language tiers, child-count tiers, or school plans initially. One clear family offer will make conversion and retention easier to interpret.

### Economics

Stripe’s published Canadian standard domestic-card fee is 2.9% plus CAD $0.30, with pay-as-you-go Billing adding 0.7% of billing volume. International cards and currency conversion can add fees. [Pricing](https://stripe.com/en-ca/billing/pricing?utm_source=chatgpt.com)

Using those domestic-card rates:

| Monthly subscribers | Gross monthly revenue | After estimated payment and Billing fees |
|---:|---:|---:|
| 25 | $199.75 | $185.06 |
| 100 | $799.00 | $740.24 |
| 250 | $1,997.50 | $1,850.59 |

These figures exclude taxes, hosting, email, translation, production, support, refunds, and marketing. They are **not profit forecasts**.

At this price, each subscriber contributes approximately $7.40 before those costs. For illustration, $100 of monthly fixed operating costs would require about 14 subscribers to cover them—but content production could be the larger expense.

### How to enforce the three-month limit

| Approach | What expires? | Suitability |
|---|---|---|
| PDF/EPUB email attachment | Nothing reliably after download | Does not meet your requirement |
| Expiring download link | Future downloads only | Insufficient by itself |
| Private browser reader | Future authorized reading requests | **Recommended launch approach** |
| DRM-protected ebook loan | Reading permission in compatible software | Possible later option for offline reading |

Readium LCP supports licenses with start and end dates. However, it adds compatible-reader requirements and integration costs. EDRLab currently lists an entry-level annual server certification fee of €1,200 before tax; this is separate from implementation and any service-provider charges. I would defer this until customers demonstrate a need for offline reading. [EDRLab](https://www.edrlab.org/readium-lcp/principles/?utm_source=chatgpt.com)

For the browser reader, implement these controls:

1. Store full books in private storage, outside public website assets.
2. Record each subscriber’s story entitlement with an unlock timestamp and expiry timestamp.
3. Check the signed-in account and entitlement on every protected content request.
4. Serve pages through an authenticated endpoint; avoid handing out a complete downloadable file.
5. Prevent protected content from being saved by offline website caching.
6. End the reading session at expiry and reject subsequent page requests.
7. Keep expired covers and reading history visible, with a separate purchase link.

**Expiry must be enforced during access—not depend on a nightly cleanup job.** A delayed scheduled job must never extend someone’s permission.

If temporary asset URLs are used, their expiry should be short and never exceed the remaining entitlement period. Cloudflare’s documentation confirms that presigned URLs can be reused by anyone holding them until they expire, so they are not a replacement for account-level access checks. [Cloudflare R2 docs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/?utm_source=chatgpt.com)

Use **three calendar months**, rather than silently substituting 90 days. For example:

| Event | Date |
|---|---|
| First story unlocked | October 8, 2026 |
| First story expires | January 8, 2027 |
| Second story unlocked | October 15, 2026 |
| Second story expires | January 15, 2027 |

Define month-end handling consistently and show the exact expiry date in the reader. Changing languages, reopening an email, or renewing the subscription should not reset it.

### French, English, and Spanish delivery

Use one shared story record linked to three approved editions:

| Information | Purpose |
|---|---|
| Story ID | Identifies the same story across languages |
| Edition language | `en`, `fr`, or `es` |
| Approved content version | Prevents unfinished translations from being released |
| Email language | Controls the parent’s notification language |
| Requested book languages | One, two, or all three |
| Story entitlement | Gives access to all editions until the same expiry date |

A parent could receive a French email with buttons for **Lire en français**, **Read in English**, and **Leer en español**. In the reader, switching languages should preserve the corresponding page where the editions allow it.

The weekly release should count as **one story**, not three books merely because three editions exist.

Before release, verify the complete text, accents, punctuation, illustrations, page order, and mobile layout in each language. Automated translation can help prepare drafts; it should not automatically publish children’s books without editorial review.

### The content-supply constraint

A year of weekly delivery requires approximately **52 distinct stories**, or **156 language editions** if every release includes all three languages.

If all 33 listed books prove to be distinct and eligible, the catalogue would still need approximately 19 additional stories for a 52-week programme. The actual gap may be greater after checking translation readiness, distribution rights, and suitable age ranges.

Do not sell an annual plan promising a new story every week until there is a credible 52-week content schedule. If stories will repeat, disclose that clearly.

I recommend a **13-week pilot**, backed by 13 complete trilingual stories and at least four reserve stories. That gives enough runway to test engagement while building the next season.

One essential rights check: Amazon states that ebooks enrolled in **KDP Select cannot be distributed digitally elsewhere during their exclusivity period, including through the author’s website**. Check enrollment for every intended edition before placing it in the subscription. [Amazon Kindle Direct Publishing](https://kdp.amazon.com/en_US/select?language=en_US&utm_source=chatgpt.com)

### The implementation plan

The proposed architecture is a secure reader added to Griot Moon, connected to Stripe Checkout and Billing, a database of subscriptions and reading permissions, private book storage, and an email delivery service. The final providers should follow an inspection of the existing website’s stack.

| Workstream | Required capability |
|---|---|
| Subscription page | Price, weekly cadence, three languages, expiry explanation, sample story |
| Parent account | Secure login, email verification, preferences |
| Payments | Monthly checkout, payment confirmation, cancellation portal |
| Bookshelf | Available stories, language buttons, expiry dates, next release |
| Reader | Protected content, page navigation, mobile layout, language switching |
| Weekly delivery | Scheduled entitlement creation and localized email |
| Administration | Upload editions, approve releases, manage schedule, inspect failures |
| Reporting | Paid conversion, reading starts, language use, cancellations, delivery failures |

Stripe documents subscription events for successful payments, failed payments, and subscription changes. Use verified server-side events to provision delivery; a browser’s checkout-success page alone should not activate a membership. [docs.stripe.com](https://docs.stripe.com/billing/subscriptions/webhooks?utm_source=chatgpt.com)

Automate routine operation:

- Release only approved stories to eligible paid subscribers.
- Create each entitlement once, even if a job retries.
- Retry failed emails without granting duplicate stories or extending expiry.
- Suspend new releases for unpaid periods.
- Keep previously paid story entitlements through their promised expiry.
- Alert you if a translation, release, or delivery fails.
- Separate optional marketing preferences from subscription-service notifications.

Start with a fixed story sequence per subscriber: story one on signup, story two seven days later. This prevents late joiners from missing the beginning and makes delivery easier to verify.

### A realistic rollout

| Period | Deliverable |
|---|---|
| Days 1–5 | Inspect website stack; inventory files, translations, and rights; approve offer rules |
| Days 6–12 | Build parent accounts, payment integration, and protected entitlement system |
| Days 13–19 | Build reader, bookshelf, and all three language flows |
| Days 20–25 | Add weekly delivery, cancellation handling, retries, and administrator controls |
| Days 26–30 | Run a small paid pilot after acceptance checks pass |

This is a proposed schedule, conditional on the website’s existing infrastructure and the books being ready. Translation and editorial production may take longer than the software.

Launch checks should prove that:

- A forwarded link does not give another account access.
- Expired books fail through both the reader and direct content endpoints.
- Switching languages does not extend access.
- Payment and email retries do not duplicate releases.
- Cancellation stops future billing and releases at the correct time.
- All three complete editions work on phones and tablets.
- No eligible paid subscriber misses a scheduled story.

For the pilot, recruit 20–30 families and measure actual reading and renewal behaviour. Use paid conversion, weekly reading starts, second-month retention, and language switching as the principal signals; email opens alone will not establish value.

---

## Part 2: Review (Claude, 8 October 2026)

**Verdict: a sound design for the wrong moment. Don't build it yet.** The access
and expiry rules are right and the arithmetic checks out. But three facts the
analysis could not see from outside decide the timing: there is no audience yet,
the French and Spanish ebook files may not exist, and the site has no backend for
accounts or payments.

### What checks out

- **Arithmetic:** all of it is correct.
  - Fees: 7.99 × (1 − 2.9% − 0.7%) − 0.30 = $7.40 per subscriber, giving $185.06 / $740.24 / $1,850.59.
  - $1.84 per weekly story (7.99 × 12 ÷ 52).
  - 14 subscribers to cover $100, a $23.97 three-month gift, and expiry dates 8 Oct → 8 Jan and 15 Oct → 15 Jan.
- **Access design:**
  - Server-side entitlement checked on every page request.
  - Expiry enforced at access time, not by a cleanup job.
  - Webhook-driven provisioning and idempotent weekly releases.
  - One story with three editions sharing one expiry.
  - These are the right rules; keep them if this is ever built.
- **Its caution about languages was fair**, but the French and Spanish files exist (see 2).
- **Not re-checked here:** the competitor prices (Epic, BookBox, Bookroo), Stripe's rates and EDRLab's fee. They are dated research.

### What it missed

**1. Demand is the binding constraint, not software.**
- **Traffic:** Plausible shows **40 visitors** for 9 Sep to 8 Oct 2026: 22 direct, 13 Google, 2 Ecosia, 1 Bing, 1 Pinterest, 1 test.
- **Leads:** **1 Lead Created**, which was our own `griotmoon7` test, so **zero real leads**.
- **Pilot math:** recruiting 20 to 30 *paying* families needs thousands of visitors at typical rates.
- **Timing:** the traffic work (P4 in [PARITY_WORK_PLAN.md](../PARITY_WORK_PLAN.md)) is held until Story Time with Eva's Day 30 readout in late October.
- **Consequence:** building first would ship a store with no shoppers.

**2. Content supply is much better than first thought (corrected 8 Oct, same day).**
- **Where the files are:** the French and Spanish ebooks live in iCloud, under `PaWa Press/01_Imprints/Pawa Seyni/<book>/Ebook/{EN,FR,ES}/`, not on the Desktop where I first looked.
- **FR/ES coverage:** all 32 book folders have a fixed-layout KDP EPUB in French and in Spanish. They are `v01` builds dated 3 to 5 October 2026, with matching 2560×2560 covers.
- **EN coverage:** English EPUBs exist for 29 of the 32. Hope and Humor, The Chief's Green Rule and The Chief's 3 Gifts have none in that folder; their English Kindle editions sit on the other KDP account.
- **Missing book:** The Yam and the Egg has no folder.
- **Approval state:** they are drafts, not approved releases. `PawaSeyni_Production_Tracker.xlsx` has 69 items: 32 Done, 30 "Done (to verify)", 7 Open.
  - PS-067 (French Kindle eBooks for all 32) is still Open.
  - PS-068 (Spanish interiors for all 32) is still Open.
  - I did not check whether any FR/ES edition is already on sale.
- **Site is out of date:** `src/data/books.ts` still marks 12 books English-only. The site understates the catalogue once these are approved.
- **Pilot math:** a 13-story trilingual pilot (39 edition files plus reserves) is achievable from existing files after review. Content is no longer the gating task; review and approval are.

**3. It undercuts the books' own price.**
- **Kindle price:** each Pawa Seyni Kindle ebook sells at **$7.99**, earning about $4.80 per sale.
- **Club price:** about four stories a month, in three languages, for the price of one ebook.
- **Ownership:** families who care about owning a book buy on Amazon, and the analysis routes "permanent ownership" there too.
- **Risk:** the club competes with those Amazon sales and with Associates commission.
- **Possible answer:** the club could be positioned as discovery that feeds purchases. Expired stories should then link to the paperback or ebook, which the analysis already suggests.
- **Before pricing:** decide this deliberately.

**4. It requires a backend Griot Moon doesn't have.**
- **What exists:** the site is static on Netlify with a single function (`subscribe`). "Profile" is browser-only `localStorage`, with no accounts and no database.
- **What the plan adds:** auth, a database, private storage, scheduled jobs and payment webhooks.
- **Policy:** the house standard is static sites only. The one approved exception is Private Viewing Room (Netlify Functions + Neon).
- **Feasibility:** feasible on that same pattern, with Netlify Blobs for private page images and Netlify Scheduled Functions for the weekly release. It is still Papa's call to make Griot Moon a second exception.

**5. Sales tax is excluded, and it isn't small for digital subscriptions.**
- **Canada:** GST/HST registration applies past CA$30,000 a year.
- **EU:** the EU charges VAT on digital services from the first sale to an EU consumer, with no threshold for non-EU sellers.
- **US:** some US states tax digital goods.
- **Options:** Stripe Tax, or a merchant of record that collects and remits for you. Gumroad, already used for VettedCounsel, sells memberships as merchant of record. That would avoid Stripe Billing, Stripe Tax and a customer portal for a pilot.

**6. Children's data.**
- **Accounts:** keep accounts parent-only.
- **Reading data:** store no child names or ages, and treat reading history as personal data.
- **Privacy page:** update it before launch, as was done for the Pinterest disclosure.
- **Weekly emails:** they are service messages and must stay separate from marketing consent, which the analysis notes.

**7. KDP Select risk is lower than it implies, but not zero.**
- **Policy:** house policy since July 2026 is to never enroll new Kindle ebooks in Select, and the July batch was published outside it.
- **Exceptions:** the Kindle editions on Papa's other KDP account were not checked. That includes the 2025 Mael trilogy, such as The Chief's Green Rule (B0FB4B7235).
- **Action:** check each title's Select status on the bookshelf before it enters the club.

### A leaner pilot, if and when demand exists

- **Drop accounts:** the weekly MailerLite email carries a **signed per-subscriber reader link**.
- **Token:** it encodes subscriber, story and expiry.
- **Check:** a Netlify function verifies the signature, the expiry and the subscription status before serving page images from private storage.
- **Payments:** Gumroad membership or a Stripe Payment Link, with its webhook marking status.
- **Trade-off:** a forwarded link works for its holder until it expires. That is acceptable for 20 to 30 pilot families, and accounts can come later.
- **Build size:** roughly 10 working days instead of 30.

### Recommended sequence

1. **Now (no site changes):**
   - Close the FR/ES review: PS-067, PS-068 and the "Done (to verify)" items.
   - Check KDP Select status on both accounts.
   The files already exist (see 2).
2. **Papa's decisions:**
   - backend exception: yes or no;
   - payment provider: Gumroad (merchant of record) or Stripe + Stripe Tax;
   - the club's stance toward the $7.99 Amazon ebooks.
3. **After Eva's Day 30 readout, inside P4:**
   - **Demand test:** run it before any build, as a Story Club waitlist landing page with the price shown, feeding MailerLite. Set the go threshold in advance (for example, 30 waitlist signups or 10 paid pre-orders).
   - **Build:** only if the threshold is met, using the lean pilot above.

---

## Part 3: Options other than a subscription (Claude, 8 October 2026)

Papa asked for alternatives.

### Starting point

The real asset is **96 ebook editions: 32 stories × English, French and Spanish**. That is a rare thing for African heritage picture books. Most options below sell or distribute those files without building accounts, a reader or billing.

### The options

| # | Option | What it is | Build on Griot Moon | Who handles tax | Fits today's traffic? |
|---|---|---|---|---|---|
| 1 | **Publish FR/ES on Amazon** | List the French and Spanish Kindle editions, plus paperbacks if wanted. Amazon.fr, .ca, .es, .com.mx and .com (US Spanish). | None (book pages link to each edition) | Amazon | **Yes**: Amazon brings its own shoppers |
| 2 | **Go wide** | Same files on Apple Books, Kobo (strong in Canada and France), Google Play and Barnes & Noble, following the Eva `EBOOK_DISTRIBUTION_WORKFLOW.md` playbook | None | Each store | Yes |
| 3 | **Libraries and schools** | Distribute to OverDrive/Libby and hoopla through an aggregator (e.g. Draft2Digital or PublishDrive), and pitch Canadian French-immersion and US dual-language programs | None, or one "For schools" page | Distributor / invoice | Yes; institutions buy without visiting the site |
| 4 | **Trilingual bundles sold direct** | One story in all three languages (e.g. CA$9.99), or themed 4-story sets (e.g. CA$24.99), as permanent downloads | Small: Buy buttons only | Gumroad (merchant of record, as for VettedCounsel) | Partly; needs traffic |
| 5 | **Classroom licence** | A yearly licence for a teacher to project and read the trilingual editions in class (e.g. CA$49 per classroom), with the activity PDFs | Small: one page + Gumroad | Gumroad | Partly; sold by outreach |
| 6 | **Kindle Unlimited (KDP Select)** | Amazon's own subscription: readers borrow, Amazon pays per page read | None | Amazon | Yes |
| 7 | **Hosted membership** (Patreon / Ko-fi) | A weekly story post to paying members; tests subscription demand without building anything | None | Platform | Needs an audience |
| 8 | **Free trilingual sample → list** | One complete story free in all three languages as the email magnet, then offers 1, 2 and 4 | Small: new magnet in the existing funnel | n/a | Grows the audience the other options need |

### Conflicts to know before mixing them

- **Kindle Unlimited (6) blocks 2, 4, 5 and 7** for every ebook enrolled, because Select requires ebook exclusivity for 90 days. It also contradicts the house rule from July 2026 (never enroll new Kindle ebooks). Picture books earn little per page read. **Not recommended**, except perhaps as a short test on a few FR/ES titles kept out of every other channel.
- **Direct prices (4) must respect KDP price parity.** A single-language ebook sold cheaper elsewhere invites Amazon to price-match it down. A three-language bundle is a different product from any single Amazon edition, which is why the option is shaped that way.
- **Direct files are DRM-free.** That is normal for Gumroad sellers (VettedCounsel already sells this way), and it is fine for a permanent purchase.
- **Approval comes first.** All options except 8 need the FR/ES editions approved, meaning PS-067 and PS-068 closed.

### Recommendation

| Step | Do | Why |
|---|---|---|
| Now | **1 + 2**: publish the reviewed FR/ES ebooks on Amazon and wide, in batches | Zero site work and existing demand. They triple the number of editions that can be found. Griot Moon's book pages then link to each edition, which also fixes the 12 "English only" labels. |
| Now | **8**: make one trilingual story the free magnet | The cheapest way to grow the email list, which every later option needs |
| Next | **3**: libraries and schools in Canada | French immersion is the natural buyer for EN/FR/ES picture books, and institutions do not depend on site traffic |
| Later | **4 or 5** on Gumroad | Only once the list or school outreach shows interest; a few days' work |
| If demand shows | **7, then the Story Club** | Test recurring payment on a hosted platform before building the reader in Part 1 |

Options 1, 2 and 3 change nothing on the live sites and need no campaign, so they fit inside the Story Time with Eva freeze. Options 4, 5 and 8 touch the Griot Moon funnel and belong in P4, after the readout.
