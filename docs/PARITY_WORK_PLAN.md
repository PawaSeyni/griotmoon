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

### P0-0 Move this clone out of iCloud first (DONE 22 September 2026)

**Completed. The clone now lives at `~/Developer/griotmoon`, beside Eva.**

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

**Acceptance:** met and verified on 22 September 2026.

| Check | Result |
|---|---|
| Location | `~/Developer/griotmoon` |
| `git status` | clean, on `main`, in sync with origin |
| `git fsck` | no errors |
| History | intact, including this plan's own commits |
| Stray " 2" files | none anywhere in the tree |
| Left behind on Desktop | nothing |
| `npm run lint` from the new path | passes, 0 errors |

**Still worth knowing:** iCloud Desktop sync remains switched on, and the same
conflict copies exist in other repositories still on the Desktop, including
`Optionstutor/.git/index 2` and `papanguer/.git/index 2`. Those are outside this
plan's scope but they carry the same risk this item was written to remove.


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

**Acceptance:** met on 22 September 2026, with `pnguer+griotmoon@gmail.com`.
Zero subscribers means no traffic, not a broken funnel.

| Check | Result |
|---|---|
| Subscriber in `griotmoon-signups` | yes, `language=en`, `lead_magnet=bilingual-starter-kit` |
| Confirmation email | arrived, sender `contact@griotmoon.com`, subject "Confirm your email to get the Starter Kit" |
| Confirm link | clicked, subscriber `active`, `opted_in_at` 20:19:42 UTC |
| Endpoint, read server-side | HTTP 200, `{"success":true}` |

**Defects found, none of them blocking:**

- **The welcome email's sender address is `contact@storytimewitheva.com`.** The
  display name is correct ("Pawa Seyni · Griot Moon", Reply-To the same), so a
  reader sees Griot Moon unless they expand the sender details. Switch the address
  to `contact@griotmoon.com` on the "Griot Moon, Welcome + Trilingual Starter Kit"
  automation so the sending domain matches the brand. Belongs to P2-5; low urgency.
- **The confirmation greeting renders as "Thanks ."** when no first name is given.
  The name merge tag has no fallback. The welcome email already uses
  `{$name|default:'…'}`; the confirmation needs the same.
- **The first browser signup could not be confirmed from the browser.** The page
  showed its success screen, but the subscriber was absent 30 seconds later. Two
  confirmation emails did arrive (20:17:47 and 20:18:17) for the submissions made
  before 20:19, so it most likely landed late rather than being lost. The page
  cannot tell either way, which is P2-1's whole argument.
- **MailerLite reports the form as `"active": false`.** Submissions are still
  accepted today. Reactivate it, or retire it in P2-1 when the server-side
  function replaces the browser-direct call.

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

**Acceptance:** met on 22 September 2026, and enforced by the build.

- `src/analytics/events.ts`: 11 events, schema 1. Eva's personalization, journey
  and experiment events are left out because Griot Moon has none of those
  surfaces. `Purchase Click` carries `language`, not `edition`: each book has one
  Amazon listing.
- `src/analytics/funnels.ts`: 6 funnels.
- `track()` is typed against the dictionary and filters property keys at runtime,
  so an undeclared key such as an email cannot reach Plausible.
- `npm run check:analytics`, part of `npm run verify`, fails the build on an
  undeclared event, property or value, on a declared event with no call site, and
  on a funnel step that is never fired. Negative-tested.
- Each event was checked firing with the right properties in a running build.
  `Search` sends a result-count bucket once typing settles, never the query.
- Renamed: `Signup` → `Lead Created`, `Amazon Click` → `Purchase Click`,
  `Lead Magnet Download` → `Magnet Download`, `Read Along Start` → `Read Aloud`.
  P1-2 creates goals for the new names only.

**Consequence for P1-4:** until P2-1, `Lead Created` fires when the browser's
`no-cors` request did not throw, not on confirmed creation. After P2-1 it will
mean backend-confirmed. That is a change in meaning inside the baseline's key
outcome, which is the exact trap Eva's first baseline fell into. Either freeze the
baseline after P2-1, or freeze it before and state in its banner that
`Lead Created` is browser-assumed.

### P1-2 Configure the Plausible property

Griot Moon has its own Plausible property, key `pa-XNEfN50ABtDJcf6klL0ua`, separate
from Eva's.

**Do:** create a goal for every event in the taxonomy, and enable every custom
property the report queries. Plausible answers HTTP 400 for any goal that is not
configured, and silently cannot break down by a property that is not enabled.
Eva's runbook is `docs/plausible-setup.md`; use Plausible's own "detected events"
bulk-add where it offers one.

**Acceptance:** the report script runs with zero `HTTP` error lines.

**Configured 22 September 2026;** the acceptance above can only be checked once P1-3
exists.

- Goals: all 11 events in schema 1. `Activity Complete` already existed; the
  other 10 were added.
- Custom properties: `activity`, `book`, `lead_magnet` and `language` already
  existed; `destination`, `placement`, `asset` and `results` were added.
- Left in place, a decision for the owner: goals under the retired names
  (`Signup`, `Amazon Click`, `Lead Magnet Download`, `Read Along Start`).
  They keep their history and receive nothing new.
- **Double count removed:** Plausible's form auto-tracking was on, so every signup
  was counted twice, as the built-in `Form: Submission` and as `Lead Created` (the
  double count Eva removed in DA-01). Turned off on 22 September 2026 (Site
  settings, General, Tracking); the served script no longer carries
  `formSubmissions`. The `Form: Submission` goal keeps its history.
- **Still on, by design:** outbound-link and file-download auto-tracking. They also
  fire on an Amazon click and a magnet PDF download, next to `Purchase Click` and
  `Magnet Download`. Those are separate goals, not outcomes, so the funnel report
  must use the schema-1 events only.

### P1-3 Funnel report script

**Port:** `scripts/report-funnels.mjs` and `scripts/lib/catalog.mjs` from Eva.
Eva's version loads the Stats API key from a git-ignored `.env` itself.

**Acceptance:** `npm run report:funnels` produces a report against real data.

**Ported 22 September 2026; acceptance pending the API key.**

- `scripts/report-funnels.mjs`: every funnel, its dimensions, Amazon clicks per
  book-page view, locale parity and book views by age range, with the
  minimum-sample warning. It reads only schema-1 events.
- `scripts/lib/catalog.mjs` reads book ids and age ranges with the same pattern
  the sitemap and i18n scripts use. Eva's version compiles a browser-free
  `books.data.ts`, which Griot Moon does not have; Eva's theme and age-band
  segments are replaced by the raw `ageRange`.
- Two changes from Eva's copy: the default range is Plausible's `'30d'` literal
  (Eva sends `['30d', 'now']`; Plausible's API documents custom ranges as two
  ISO dates, so Eva's default likely fails, not yet confirmed against a live
  call; worth checking in Eva after its freeze), and any failed
  call prints an `HTTP` line and exits non-zero, so P1-2's acceptance can be
  checked by the exit code.
- The report states that its step rates divide event totals, not the same
  visitors, so a step can exceed 100%.
- `.env` was **not** git-ignored before this change. It now is, with
  `.env.example` as the template.
- Tested with `scripts/fixtures/funnel-events.json` (synthetic), with no key
  ("No data", exit 0), with an invalid key (11 `HTTP 401` lines, exit 1), and with
  a one-sided date range (rejected, exit 2).

**Acceptance met 22 September 2026, and P1-2 with it:** `npm run report:funnels`
ran against the live property with zero `HTTP` lines and exit 0. The query shape
is proven on real data: the same call returns the old `Amazon Click` goal broken
down by `book`.

- **Fixed on the first real run:** Plausible's relative `'30d'` range ends
  yesterday, so it hid everything from the day schema 1 shipped. The default is
  now an explicit range of the 30 days ending today.
- **Every schema-1 count is zero** because no one has visited since the deploy,
  not because a query is wrong.
- **Traffic, measured:** 18 visitors and 26 pageviews in the 30 days to
  22 September, and one Amazon click. That settles P0-1: the empty list is a
  traffic problem. It also means P1-4's baseline will be close to zero on every
  funnel. That is still worth freezing, as the "before" of any campaign, but no
  rate in it will clear the 50-event minimum.

### P1-4 Freeze a pre-campaign baseline

Once P1-1 to P1-3 are done and the taxonomy has stopped changing, capture a
baseline **before** any campaign traffic, and mark it do-not-regenerate.

**Why it must be after the taxonomy settles:** Eva's first approved baseline
straddled a schema change and had to be redone. See
`docs/analytics/REPORT_PRECAMPAIGN.md` in Eva for the frozen-snapshot pattern.

**Acceptance:** a committed baseline file with a do-not-regenerate banner.

**Acceptance met 22 September 2026:** `docs/analytics/REPORT_PRECAMPAIGN.md`,
window 24 August to 22 September 2026, frozen before P2-1 by the owner's choice.

- The funnel tables are all zero by construction: schema 1 went live on the
  window's last day. The baseline that matters is the traffic section: 19
  visitors, 27 pageviews, sources Direct 13 and Google 6.
- Our own traffic is separated: 22 September is the P0-1 test (certain), and
  18 September is probably internal QA through a VPN. Without both days, about
  11 visitors in 30 days, no leads and no Amazon clicks.
- `scripts/report-funnels.mjs` now refuses to overwrite any file containing
  `FROZEN SNAPSHOT` (exit 3), so the do-not-regenerate banner is enforced, not
  just stated.

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

**Acceptance met on the deploy preview, 23 September 2026 (UTC):**

| Check | Result |
|---|---|
| GET | 405 `method_not_allowed` |
| Invalid address | 422 `invalid_email` |
| Foreign origin | 403 `bad_origin` |
| Existing address, new field values | 200, fields written (`updated_at` moved) |
| New address through the real form | 200, **active** immediately, welcome email 8 s later, no confirmation email |
| Events | `Form View` → `Form Start` → `Lead Created` once, after success |

**Lessons from getting the key in place (took most of an evening):**

- The Griot Moon folder's local Netlify link (`.netlify/state.json`) pointed at
  **storytimewitheva**. Every `netlify env:*` from that folder hit Eva's project,
  and griotmoon had **no environment variables at all**. Set Griot's variables in
  the web UI on `app.netlify.com/projects/griotmoon/configuration/env`, and check
  the link before trusting any CLI result.
- The first token failed MailerLite's group lookup (the function answered
  `group_unavailable` and, correctly, wrote nothing). A new token fixed it. The
  function now logs MailerLite's status on that path.
- Never delete a MailerLite token to "reset" it: the account is shared, and one of
  them is Eva's.

### P2-2 Decide opt-in mode

Griot Moon is on double opt-in; Eva moved to single. Double opt-in depresses list
growth and makes `Lead Created` ambiguous, because a created subscriber is not a
confirmed one.

**Acceptance:** an explicit decision recorded here, not a default inherited from
form setup.

**Decided 22 September 2026: single opt-in,** by the owner, the same mode as Eva.

- Forced by P2-1 in practice: on the shared MailerLite account, API-created
  subscribers are active immediately with no confirmation email. The only API
  route to double opt-in is an account-wide setting that would also change Eva
  mid-experiment, so it was not an option.
- `Lead Created` now means an active subscriber MailerLite created, with no
  pending confirmation.
- The Privacy page (EN/ES/FR) and the signup success message (EN/ES/FR) no
  longer promise a confirmation email. Wording matches Eva's.
- Takes effect when P2-1 merges; until then the live site still runs double
  opt-in through the old form.

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

**Built 22 September 2026 (PR stacked on P2-1, so it ships after it):**

- `/free/<magnet>` in EN/ES/FR for all 5 magnets: 15 prerendered pages, noindex,
  out of the sitemap, no navbar or footer. An unknown slug renders the 404 page.
- `scripts/prerender.mjs` fails the build when `LANDING_SLUGS` and the magnet
  registry disagree in either direction. Negative-tested.
- New event `Landing View` (`language`, `lead_magnet`, `landing_page`), a
  `landing` placement for the form, and a `landing-entrances` funnel. Plausible
  needs a `Landing View` goal and a `landing_page` custom property before the
  report can break it down.
- **Copy mismatch, blocks campaigns on any magnet but the starter kit:** Griot
  Moon's magnets have only a title and a PDF, so every landing page shares the
  starter kit's blurb, bullets ("20-page activity pack…") and button ("Get my free
  kit"). Seen on `/fr/free/parents-guide/`: the headline offers the parents'
  guide, the body promises the activity pack. Each magnet needs its own blurb,
  bullets and button in EN/ES/FR (Eva's `magnet.copy` shape) before a pin or ad
  points at it.
  **Drafted 23 September 2026** from each PDF's actual contents (PR pending the
  owner's approval of the wording; FR/ES need a native read).

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

**Built 23 September 2026, dormant until configured:**

- `netlify/functions/_pinterest.mjs` ported, called from the subscribe function
  only after MailerLite confirms, best-effort (a Pinterest failure, even a thrown
  network error, never changes the signup result; tested, and the test fails
  without the guard).
- **No default ad account.** Eva's module falls back to Eva's account
  (`549770651316`), which would have posted Griot signups into Eva's campaign data.
  Griot's sends nothing unless `PINTEREST_CONVERSIONS_TOKEN` **and**
  `PINTEREST_AD_ACCOUNT_ID` are both set.
- **Privacy page (EN/ES/FR) now discloses it.** Griot's page never mentioned
  Pinterest; Eva's reviewed wording is reused with contact@griotmoon.com.
- **Configured 23 September 2026:** a separate Griot Moon ad account and its
  conversions token, set in Netlify on griotmoon through the web UI. Preview test
  (04:10 UTC): signup 200, MailerLite write confirmed, and no Pinterest line in the
  function log, which only logs failures, so Pinterest accepted the event. Privacy
  wording approved by the owner.

### P2-5 Welcome sequence

Griot Moon has one automation, one step, English only. Eva has three sequences:
8 steps English, 7 French, 7 Spanish.

**Watch for:** Eva's sequences are all built around one title, so a subscriber who
asked for flashcards receives a welcome about a different book. Do not copy that
mistake. Each magnet's first email should deliver what was promised.

**Acceptance:** a test signup in each language receives the correct file and a
first email that matches the magnet.

**Live 23 September 2026.** One welcome email per language, each delivering the file
the subscriber chose.

- **Site:** `/dl/<lang>/<magnet>` redirects to that PDF (302), generated at build time
  from the `LEAD_MAGNETS` pdf map, with starter-kit fallbacks; the build fails on a
  missing language or file (PR #35).
- **MailerLite:** segments `Griot Moon — EN/ES/FR signups (language=xx)` (group
  `griotmoon-signups` AND `language`), each triggering `Griot Moon — Welcome EN/ES/FR
  (delivers chosen printable)`. Sender `Pawa Seyni · Griot Moon <contact@griotmoon.com>`,
  reply-to the same. Button `https://griotmoon.com/dl/<lang>/{$lead_magnet}`. The old
  single English starter-kit automation is **paused** (kept, not deleted).
- **Verified:** a new Spanish signup (`pnguer+griotmoon3`, flashcards) got its email
  in 72 s from `contact@griotmoon.com`, button resolving to `bilingual-flashcards.pdf`,
  DKIM/SPF/DMARC pass for griotmoon.com. Field-change tests on existing subscribers
  also delivered English (bedtime chart) and Spanish (flashcards), about 14 minutes
  late.
- **Not yet verified:** French with a real signup; the English plain-text part after
  its fix (below).

**Gotchas learned here:**

- The API cannot write email HTML on this plan (Premium only) and cannot activate or
  pause automations. Design and activation are dashboard steps. **Activate opens a
  confirmation dialog; nothing saves until it is confirmed.**
- The API cannot edit an **active** automation: pause, edit, reactivate.
- `{$name|default:'…'}` in an automation's **plain-text** part made MailerLite blank
  every merge tag in that part, including `{$lead_magnet}` and `{$unsubscribe}`. The
  English plain text now says "Hi there," with no filter. Do not use that filter in
  plain text.
- "Joins segment" triggers on a field change lag about 14 minutes (segment
  recalculation); a new subscriber triggers within seconds.

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
| P0 | ~~Move off iCloud~~ done; prove the signup works | Everything. One test remains. |
| P1 | Events, Plausible config, report, frozen baseline | All measurement |
| P2 | Server-side subscribe, opt-in decision, landing pages, Pinterest, email | All conversion |
| P3 | Version stamping, tests, typecheck | Trusting any of it |
| P4 | Attribution, positioning, campaign | Held until Eva's Day 30 |
