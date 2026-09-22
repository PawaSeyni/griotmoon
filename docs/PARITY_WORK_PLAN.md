# Griot Moon: parity work plan

**Goal.** Bring griotmoon.com to the level Story Time with Eva reached on
22 September 2026, so that a campaign run here can be measured, trusted and
repeated.

**How to use this.** Every item names the Eva implementation to copy from, so you
are porting working code rather than designing from scratch. Eva's repository is
at `~/Developer/storytimewitheva`. Work top to bottom: the phases are ordered by
dependency, not by appetite.

**Scope boundary, and it matters.** Eva is running a frozen 30-day experiment.
The two sites have separate Plausible properties and separate MailerLite groups,
so **building** here cannot contaminate Eva's measurement. **Running a campaign**
here can, because the traffic plan has both brands sharing one Pinterest account.
Build during Eva's freeze. Do not run a Griot Moon campaign until Eva's Day 30
readout is recorded.

---

## Where the two sites actually stand

Measured 22 September 2026, not assumed.

| Capability | Eva | Griot Moon |
|---|---|---|
| Books in catalogue | 20 | 33 |
| Languages, EN/ES/FR | yes | yes |
| Prerendered routes, real 404s | yes | yes |
| Per-article resource pages | yes | **yes, already** |
| CSP enforced | yes | yes |
| Retired-book redirects | yes | yes |
| CI workflows | yes | yes |
| Lead magnet registry | 7 + 2 packs | 5 |
| Gated `/free/<magnet>` landing pages | 27 | **none** |
| Server-side subscribe function | yes | **none** |
| Pinterest server-side conversions | yes | **none** |
| Event taxonomy and funnel definitions | 28 events, 9 funnels | **none** |
| Funnel report script | yes | **none** |
| Deploy provenance (`version.json`) | yes | **none** |
| Test suites | 7 directories, 228 tests | **none** |
| `docs/` directory | yes | **none** |
| MailerLite subscribers | 13 | **0** |
| Welcome sequence | 8 steps EN, 7 FR, 7 ES | 1 step, EN only |
| Opt-in mode | single | double |

Griot Moon is not far behind on the **site**. It is a long way behind on
**measurement and conversion**. That is the shape of the work.

---

## P0. Answer one question before building anything

### P0-0 Move this clone out of iCloud first

**Do this before anything else, including P0-1.**

This clone sits at `~/Desktop/griotmoon`, and iCloud Desktop sync is switched on.
Found here on 22 September 2026:

```
~/Desktop/griotmoon/.npmrc 2
~/Desktop/griotmoon/.git/index 2
```

Those " 2" files are iCloud conflict copies. The second one is inside `.git`,
which means iCloud is duplicating git's own index. That can corrupt repository
state, and it is not theoretical: Eva's clone was moved off the Desktop for
exactly this reason (`bc94403`, "clone moved out of iCloud sync to ~/Developer").

**Do:** move the clone to `~/Developer/griotmoon`, the same place Eva lives, then
delete the stray conflict copies. Do not simply delete the " 2" files and carry
on; iCloud will make more.

**Acceptance:** the repository resolves to `~/Developer/griotmoon`, `git status`
is clean, and no " 2" files reappear after a build.


### P0-1 Does the signup actually work?

`griotmoon-signups` holds zero subscribers, on a site that has been live for
months with 186 indexed URLs. There are two explanations and they need different
responses: no traffic, or a funnel that silently drops people.

The signup posts from the browser straight to MailerLite's JSONP endpoint with
`mode: 'no-cors'` (`src/components/EmailSignup.tsx`). The page therefore cannot
read the response and **cannot tell success from failure**. This is the exact
architecture that showed a success screen on Eva while dropping every email, when
the endpoint began returning 503. Eva's fix was PR #74.

Probed 22 September 2026: the endpoint currently answers correctly, returning
HTTP 200 with a validation error for a bad address. So this is a latent failure
mode, not a confirmed outage.

**Do this:** one real end-to-end signup with a real address you control. Confirm
the subscriber appears in `griotmoon-signups`, and confirm the double opt-in
confirmation email arrives and is branded correctly. The shared MailerLite account
sends an account-level confirmation that is mis-branded "Storytimewitheva" for the
other four brands, so test the **confirmation** email, not just the subscribe.

**Acceptance:** a subscriber visible in the group, and a correctly branded
confirmation email in your inbox.

**If it fails,** P2-1 stops being an improvement and becomes an outage fix.

---

## P1. Measurement layer

You cannot improve what you cannot see, and every later phase reports through
this.

### P1-1 Event taxonomy and funnel definitions

**Port:** `src/analytics/events.ts` and `src/analytics/funnels.ts` from Eva.
Adapt the event list to Griot Moon's surfaces. Eva defines 28 events and 9
funnels.

**Watch for:** Eva removed `Form Submit` in PR #216 (DA-01) so each outcome fires
exactly one event. Start without it rather than adding it and retiring it later.

**Acceptance:** `track()` calls exist on every funnel step, and the funnel
definitions name only events the site actually fires.

### P1-2 Configure the Plausible property

Griot Moon has its own Plausible property, key `pa-XNEfN50ABtDJcf6klL0ua`, separate
from Eva's.

**Do:** create a goal for every event in the taxonomy, and enable every custom
property the report queries. Plausible answers HTTP 400 for any goal that is not
configured, and silently cannot break down by a property that is not enabled.
Eva's runbook is `docs/plausible-setup.md`; use Plausible's own "detected events"
bulk-add where it offers one.

**Acceptance:** the report script runs with zero `HTTP` error lines.

### P1-3 Funnel report script

**Port:** `scripts/report-funnels.mjs` and `scripts/lib/catalog.mjs` from Eva.
Eva's version loads the Stats API key from a git-ignored `.env` itself.

**Acceptance:** `npm run report:funnels` produces a report against real data.

### P1-4 Freeze a pre-campaign baseline

Once P1-1 to P1-3 are done and the taxonomy has stopped changing, capture a
baseline **before** any campaign traffic, and mark it do-not-regenerate.

**Why it must be after the taxonomy settles:** Eva's first approved baseline
straddled a schema change and had to be redone. See
`docs/analytics/REPORT_PRECAMPAIGN.md` in Eva for the frozen-snapshot pattern.

**Acceptance:** a committed baseline file with a do-not-regenerate banner.

---

## P2. Conversion infrastructure

### P2-1 Server-side subscribe function

**Port:** `netlify/functions/subscribe.mjs`, `_ratelimit.mjs` and `_verify.mjs`
from Eva. Griot Moon has no `netlify/functions` directory at all.

**Why:** the browser cannot see whether a signup succeeded. A server-side
function returns a real status, lets the UI show a real error, and makes
`Lead Created` mean a backend-confirmed subscriber rather than a hopeful guess.

**Also:** Eva's form keeps a native pre-hydration fallback that posts and
redirects, so a signup works before JavaScript loads.

**Then:** drop `https://assets.mailerlite.com` from `connect-src` in
`netlify.toml`. It is only there to permit the browser-direct call, and leaving it
after the migration widens the CSP for no reason.

**Acceptance:** GET returns 405, an invalid address returns 422, a valid one
returns 200 and creates a real subscriber.

### P2-2 Decide opt-in mode

Griot Moon is on double opt-in; Eva moved to single. Double opt-in depresses list
growth and makes `Lead Created` ambiguous, because a created subscriber is not a
confirmed one.

**Acceptance:** an explicit decision recorded here, not a default inherited from
form setup.

### P2-3 Gated landing pages

Eva serves 27 prerendered `/free/<magnet>` pages, noindex, one per magnet per
language, each a single offer with one form. Griot Moon's five magnets are only
reachable by deep-linking the homepage form with `?lm=<slug>`.

**Port:** the `/free/:magnet` route, the `LandingPage` component, and the
`LANDING_SLUGS` build guard in `scripts/prerender.mjs` that fails the build when a
registered magnet has no prerendered page.

**Why it matters for paid and social:** a pin or an ad that lands on a homepage
converts worse than one that lands on the offer, and cannot be measured per offer.

**Acceptance:** every registered magnet has a prerendered page in all three
languages, and the build fails if one is missing.

### P2-4 Pinterest server-side conversions

**Port:** `netlify/functions/_pinterest.mjs` from Eva, called from the subscribe
function on confirmed success.

**Why this design:** it sends a SHA-256 hashed email and nothing else, no IP, no
user agent, no browser pixel, no cookies. That keeps the privacy promise intact
while still letting Pinterest see conversions. Do **not** add a Pinterest browser
tag: it would require a CSP change and contradict the published privacy policy.

**Needs:** a Pinterest ad account for Griot Moon, or a decision to attribute to
the existing one. Eva uses ad account `549770651316`, named for Eva.

**Acceptance:** a real signup produces a Signup conversion in the Pinterest
conversions dashboard.

### P2-5 Welcome sequence

Griot Moon has one automation, one step, English only. Eva has three sequences:
8 steps English, 7 French, 7 Spanish.

**Watch for:** Eva's sequences are all built around one title, so a subscriber who
asked for flashcards receives a welcome about a different book. Do not copy that
mistake. Each magnet's first email should deliver what was promised.

**Acceptance:** a test signup in each language receives the correct file and a
first email that matches the magnet.

---

## P3. Quality gates

### P3-1 Deploy provenance

**Port:** `scripts/gen-version.mjs` and `scripts/verify-deploy.mjs`, plus the
`no-store` cache header for `/version.json`.

**Why this is not optional here:** all sites share one Netlify team, and when its
credits run out production deploys are **silently skipped** while the live site
keeps serving the previous commit. Without a version stamp there is no way to tell
a deploy that shipped from one that did not. Every live verification in Eva's work
checks `version.json` first for this reason.

**Acceptance:** `/version.json` reports the deployed commit and is not cached.

### P3-2 Test suites

Griot Moon has no tests. Port Eva's in this order, highest value first:

1. **SEO** (`tests/seo/seo.test.mjs`): unique titles, canonical, reciprocal
   hreflang, no accidental noindex, across every sitemap route.
2. **Linking** (`tests/seo/linking.test.mjs`): no orphan routes, no thin pages.
3. **Monetization** (`tests/seo/monetization.test.mjs`): every Amazon link carries
   the Associates tag, opens in a new tab, has `rel="noopener"`, and points at the
   right language edition.
4. **Funnel** (`tests/funnel/*`): the analytics contract.
5. **End to end** (`tests/e2e/*`): a11y via axe, signup, search.

**Acceptance:** the suites run in CI and fail the build.

### P3-3 Add a typecheck script

Eva runs `tsc -b` as `npm run typecheck`. Griot Moon has no such script.

---

## P4. Content and campaign readiness

Do not start this until P0 to P3 are done and Eva's Day 30 readout exists.

### P4-1 Amazon Attribution

Same architecture as Eva, and the standing rules apply unchanged. Read
`docs/analytics/NEWSLETTER_ATTRIBUTION.md` in Eva's repo before creating anything.
The two rules that matter:

- **Associates and Attribution never share a link.** Associates Program Policies,
  Commission Income Statement section 5, treats combining attribution links as
  grounds for withholding commissions or terminating the account. Book pages carry
  the Associates tag and never Attribution. Campaign email links use Amazon's
  generated Attribution URL verbatim and never the Associates tag.
- **Verify the destination, never trust the catalogue.** Three things can disagree:
  this repository, the metadata you believe you set, and the live Amazon listing.
  Only the third reaches a reader. On Eva, nine destinations generated from a
  correct catalogue included one that resolved to a listing with a different title
  and a different age range from every other language of the same book. Creating a
  tag is mechanical; trusting where it points is not.

### P4-2 Positioning

Eva sits at multilingual-first with heritage as depth. Griot Moon's live title is
"African Heritage Picture Books for Curious Minds". The two brands were
deliberately kept as one audience with two storefronts, differing by catalogue and
tone rather than by audience. Keep that. Do not build a second acquisition funnel.

### P4-3 Campaign structure

When the time comes, reuse the shape rather than inventing one: one proposition,
one landing page, one email path, count-based gates rather than rate-based, and a
Day 15 checkpoint that is a diagnosis of where volume disappears rather than a
strategy meeting. Eva's spec is
`docs/campaigns/HOLIDAY_2026_BILINGUAL_READER.md`.

---

## What Griot Moon already has, so nobody rebuilds it

Worth stating, because the list above is long and this site is not a blank page:
33 books in three languages, prerendering with real 404s, an enforced CSP, retired
book redirects, CI, a lead magnet registry, 12 activity games, a search page, and
per-article resource pages, which Eva only gained on 19 September 2026.

---

## Order of work, condensed

| Phase | Items | Blocks what |
|---|---|---|
| P0 | Move off iCloud, then prove the signup works | Everything. A move and one test. |
| P1 | Events, Plausible config, report, frozen baseline | All measurement |
| P2 | Server-side subscribe, opt-in decision, landing pages, Pinterest, email | All conversion |
| P3 | Version stamping, tests, typecheck | Trusting any of it |
| P4 | Attribution, positioning, campaign | Held until Eva's Day 30 |
