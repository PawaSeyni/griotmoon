# Pre-campaign baseline (parity plan P1-4)

> **FROZEN SNAPSHOT. Do not regenerate this file.** It was produced on
> 22 September 2026 and is the "before" that any Griot Moon campaign is compared
> against. Re-running the report over this window later would overwrite a record
> whose whole value is that it was taken before any campaign traffic existed.
> `scripts/report-funnels.mjs` refuses to overwrite a file containing this banner.
> Write new windows to new files, for example `REPORT_D15.md` and `REPORT_D30.md`.

> **Read this before the numbers.** Every funnel table below is zero, and that is
> correct: the schema-1 events went live on 22 September 2026, the last day of this
> window, and no visitor arrived after the deploy. The baseline that matters here
> is the traffic section, which Plausible records independently of the event
> schema.

## Window and definitions

- **Window:** 24 August to 22 September 2026, both inclusive, 30 days.
- **Event schema:** version 1 (`src/analytics/events.ts`), live only on the last day.
- **`Lead Created` changes meaning at P2-1.** Until then it fires when the
  browser's `no-cors` request did not throw; after P2-1 it means a
  backend-confirmed subscriber. Any comparison across P2-1 must say so. It is
  zero here, so this window is not distorted by it.
- **Double opt-in** is on (P2-2 undecided): a created subscriber is not a
  confirmed one.

## Traffic: the real starting line

| Measure | Value |
|---|---|
| Visitors | 19 |
| Visits | 21 |
| Pageviews | 27 |
| Bounce rate | 76% |
| Days with any visit | 10 of 30 |
| Sources | Direct / None 13, Google 6 |
| Countries | Canada 5, Switzerland 5, United States 4, China 2, France 2, Congo 1 |

Top pages by pageviews: `/` 11, `/books/` 4, `/books` 3,
`/books/ubuntu-we-are-together/` 3, `/fr/books/` 2,
`/books/the-whistling-secret/` 2, `/fr/` 1, `/books/the-thankful-farmer` 1.

### Events recorded under the pre-schema names

| Event | Count | Date | Note |
|---|---|---|---|
| `Signup` | 2 | 22 Sep | Our own P0-1 test with `pnguer+griotmoon@gmail.com`. Not a lead. |
| `Amazon Click` | 1 | 18 Sep | *The Thankful Farmer*, with the `griotmoon-20` Associates tag. |
| `Outbound Link: Click` | 1 | 18 Sep | The same click, recorded by Plausible's auto-tracking. |

### How much of this is us

- **22 September:** 1 visitor, and both `Signup` events: the P0-1 test. Certain.
- **18 September:** 7 visitors, 5 of them direct from Switzerland, plus the only
  Amazon click. That was a day of site work (covers sync, catalog change), and the
  owner's VPN rotates exit countries, so this is **probably** internal QA. It is
  not provable from aggregate data, so it stays in the totals.

Taking both days out as a sensitivity check leaves roughly **11 visitors in
30 days, 6 of them from Google, no signups and no Amazon clicks.** That is the
organic starting line.

### What this means for a campaign

- The site has almost no traffic, so the first distribution push should be
  visible against this window immediately. Count-based gates will work;
  rate-based ones will not until volume exists.
- No segment reaches the 50-event minimum, so this baseline supports "from zero
  to N" comparisons, not rate comparisons.
- Google is the only organic source observed.

## Generated report

Command: `npm run report:funnels -- --from 2026-08-24 --to 2026-09-22`, run 22 September 2026.

Source: Plausible Stats API v2 (griotmoon.com). Range: 2026-08-24 to 2026-09-22. Event schema version 1. Minimum sample 50 events per segment. Rates are INTENT unless the funnel says outcome.

**How to read the rates:** Plausible returns totals per event, not the same visitors followed step to step. A step rate is one total divided by the previous one, so it can exceed 100% (a Book View can come from search, a pin or a shared link, not only the step before). Read it as a ratio of volumes, not a conversion rate.

### Homepage CTA → book page → Amazon click (intent)

The Amazon click is the conversion proxy; no downstream purchase data exists.

| Step | Events | Rate from previous |
|---|---|---|
| Homepage CTA {"destination":"books"} | 0 ⚠︎ below minimum sample |  |
| Book View | 0 ⚠︎ below minimum sample | n/a |
| Purchase Click {"placement":"detail"} | 0 ⚠︎ below minimum sample | n/a |

### Book page → Amazon click (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Book View | 0 ⚠︎ below minimum sample |  |
| Purchase Click {"placement":"detail"} | 0 ⚠︎ below minimum sample | n/a |

### Amazon clicks by placement (intent)

| Step | Events | Rate from previous |
|---|---|---|
| Purchase Click | 0 ⚠︎ below minimum sample |  |

### Newsletter: view → start → lead (outcome)

Lead Created is browser-assumed until P2-1 moves the subscribe call server-side.

| Step | Events | Rate from previous |
|---|---|---|
| Form View | 0 ⚠︎ below minimum sample |  |
| Form Start | 0 ⚠︎ below minimum sample | n/a |
| Lead Created | 0 ⚠︎ below minimum sample | n/a |

### Lead → magnet download (outcome)

| Step | Events | Rate from previous |
|---|---|---|
| Lead Created | 0 ⚠︎ below minimum sample |  |
| Magnet Download | 0 ⚠︎ below minimum sample | n/a |

### Homepage kit CTA → form start → lead (outcome)

| Step | Events | Rate from previous |
|---|---|---|
| Homepage CTA {"destination":"signup"} | 0 ⚠︎ below minimum sample |  |
| Form Start {"placement":"home"} | 0 ⚠︎ below minimum sample | n/a |
| Lead Created {"placement":"home"} | 0 ⚠︎ below minimum sample | n/a |

### Book performance: Amazon clicks per book-page view

No book reached 50 views; nothing is classified.

### Locale parity

| Locale | Form views | Leads | Rate |
|---|---|---|---|
| en | 0 ⚠︎ below minimum sample | 0 | n/a |
| fr | 0 ⚠︎ below minimum sample | 0 | n/a |
| es | 0 ⚠︎ below minimum sample | 0 | n/a |

A locale whose rate is under half of English with a full sample is a translation or parity gap to investigate.

### Book views by age range

none

### Known gaps

- Amazon purchases are not observable; every purchase figure is an outbound click (intent).
- Until parity plan P2-1, `Lead Created` fires when the browser's request did not throw, not on a confirmed subscriber. Double opt-in: created is not confirmed.
- Each book has one Amazon listing, so `language` on a purchase is the site language, not an edition.
