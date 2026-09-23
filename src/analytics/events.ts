// Versioned EVENT DICTIONARY, the runtime contract behind src/lib/analytics.ts. BROWSER-FREE
// and import-free, so scripts can load it directly (Node strips the types).
//
// Ported from Story Time with Eva (src/analytics/events.ts) and cut down to the surfaces
// Griot Moon actually has: no personalization, journeys or experiments. Every event here
// has at least one track() call site; scripts/check-analytics.mjs fails the build if not.
//
// Schema 1 replaced the pre-parity names (22 September 2026):
//   Signup -> Lead Created, Amazon Click -> Purchase Click,
//   Lead Magnet Download -> Magnet Download, Read Along Start -> Read Aloud.
// Old names stay in Plausible history; they are not goals in schema 1.
//
// Deprecation from here on: never rename in place. Add the new event, mark the old one
// `deprecated` with the replacement, keep both for one release, then remove the old one.
// Bump SCHEMA_VERSION only if a property's meaning changes.
//
// There is deliberately no "Form Submit": each outcome fires exactly one event (Eva DA-01).

export const SCHEMA_VERSION = 1 as const;

export type EventKind = 'intent' | 'outcome' | 'exposure';

export interface EventDefinition {
  name: string;
  kind: EventKind;
  required: readonly string[];
  optional: readonly string[];
  /** Allowed values for enumerated properties. */
  values?: Readonly<Record<string, readonly string[]>>;
  privacy: string;
  notes?: string;
}

const LANGUAGES = ['en', 'es', 'fr'] as const;
/** Pages that render <EmailSignup>. */
const FORM_PLACEMENTS = ['home', 'books', 'about', 'activities', 'resources'] as const;
/** Where a buy button sits: the book page, or a BookCard on one of these surfaces. */
const PURCHASE_PLACEMENTS = ['detail', 'home', 'books', 'related', 'recommended'] as const;

export const EVENTS = [
  // ---- discovery and purchase ----
  { name: 'Homepage CTA', kind: 'intent', required: ['destination'], optional: [],
    values: { destination: ['books', 'activities', 'signup'] }, privacy: 'destination token only' },
  { name: 'Book View', kind: 'intent', required: ['book', 'language'], optional: [],
    values: { language: LANGUAGES }, privacy: 'stable book id' },
  { name: 'Purchase Click', kind: 'intent', required: ['book', 'placement', 'language'], optional: [],
    values: { placement: PURCHASE_PLACEMENTS, language: LANGUAGES },
    privacy: 'stable book id; no retailer purchase data exists',
    notes: 'Outbound Amazon click, the conversion proxy. One listing per book, so language is the site language, not an edition.' },
  // ---- newsletter ----
  { name: 'Form View', kind: 'exposure', required: ['language', 'lead_magnet', 'placement'], optional: [],
    values: { language: LANGUAGES, placement: FORM_PLACEMENTS }, privacy: 'once per form when half visible' },
  { name: 'Form Start', kind: 'intent', required: ['language', 'lead_magnet', 'placement'], optional: [],
    values: { language: LANGUAGES, placement: FORM_PLACEMENTS }, privacy: 'first focus only; never the typed value' },
  { name: 'Lead Created', kind: 'outcome', required: ['language', 'lead_magnet', 'placement'], optional: [],
    values: { language: LANGUAGES, placement: FORM_PLACEMENTS }, privacy: 'never the email or name',
    notes: 'Fires only when the subscribe function (P2-1) returns success, i.e. MailerLite created the subscriber. Single opt-in (P2-2), so created means active. Before P2-1 (up to 22 September 2026) it fired when the browser request did not throw.' },
  { name: 'Magnet Download', kind: 'outcome', required: ['language', 'lead_magnet', 'asset'], optional: ['placement'],
    values: { language: LANGUAGES, placement: FORM_PLACEMENTS }, privacy: 'asset path only' },
  // ---- engagement ----
  { name: 'Read Aloud', kind: 'intent', required: ['language'], optional: ['book'],
    values: { language: LANGUAGES }, privacy: 'no text' },
  { name: 'Activity Complete', kind: 'outcome', required: ['activity'], optional: [], privacy: 'activity slug' },
  { name: 'Language Switch', kind: 'intent', required: ['language'], optional: [],
    values: { language: LANGUAGES }, privacy: 'target language' },
  { name: 'Search', kind: 'intent', required: ['language', 'results'], optional: [],
    values: { language: LANGUAGES, results: ['0', '1-5', '6+'] },
    privacy: 'result-count bucket only; NEVER the query text (it could be a child\'s name)' },
] as const satisfies readonly EventDefinition[];

export type EventName = (typeof EVENTS)[number]['name'];

export const EVENT_BY_NAME: Record<string, EventDefinition> = Object.fromEntries(EVENTS.map((e) => [e.name, e]));

/** Problems with an event payload against the dictionary. Empty means valid. */
export function validateEvent(name: string, props: Record<string, unknown> = {}): string[] {
  const def = EVENT_BY_NAME[name];
  if (!def) return [`unknown event "${name}"`];
  const out: string[] = [];
  for (const r of def.required) if (props[r] === undefined || props[r] === '') out.push(`${name}: missing required "${r}"`);
  const allowed = new Set([...def.required, ...def.optional]);
  for (const k of Object.keys(props)) if (!allowed.has(k)) out.push(`${name}: unexpected property "${k}"`);
  for (const [k, vals] of Object.entries(def.values ?? {})) {
    if (props[k] !== undefined && !vals.includes(String(props[k]))) out.push(`${name}: "${k}" = ${String(props[k])} not in [${vals.join(', ')}]`);
  }
  return out;
}
