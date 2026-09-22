// FUNNEL definitions, ported from Story Time with Eva (src/analytics/funnels.ts). BROWSER-FREE.
// A funnel is an ordered list of steps; each step is an event name plus an optional property
// filter. Dimensions are the properties a report may group by. Every funnel states whether its
// last step measures intent or a verified outcome. scripts/check-analytics.mjs fails the build
// if a step names an event that is not in the dictionary or has no call site.

export interface FunnelStep { event: string; where?: Record<string, string> }
export interface FunnelDefinition {
  id: string;
  title: string;
  steps: FunnelStep[];
  dimensions: string[];
  /** What the final step proves. */
  measures: 'intent' | 'outcome';
  notes?: string;
}

export const FUNNELS: FunnelDefinition[] = [
  { id: 'discovery-to-retailer', title: 'Homepage CTA → book page → Amazon click',
    steps: [{ event: 'Homepage CTA', where: { destination: 'books' } }, { event: 'Book View' }, { event: 'Purchase Click', where: { placement: 'detail' } }],
    dimensions: ['book', 'language'], measures: 'intent',
    notes: 'The Amazon click is the conversion proxy; no downstream purchase data exists.' },
  { id: 'book-to-retailer', title: 'Book page → Amazon click',
    steps: [{ event: 'Book View' }, { event: 'Purchase Click', where: { placement: 'detail' } }],
    dimensions: ['book', 'language'], measures: 'intent' },
  { id: 'purchase-by-placement', title: 'Amazon clicks by placement',
    steps: [{ event: 'Purchase Click' }], dimensions: ['placement', 'book', 'language'], measures: 'intent' },
  { id: 'signup-by-placement', title: 'Newsletter: view → start → lead',
    steps: [{ event: 'Form View' }, { event: 'Form Start' }, { event: 'Lead Created' }],
    dimensions: ['placement', 'lead_magnet', 'language'], measures: 'outcome',
    notes: 'Lead Created is browser-assumed until P2-1 moves the subscribe call server-side.' },
  { id: 'lead-to-download', title: 'Lead → magnet download',
    steps: [{ event: 'Lead Created' }, { event: 'Magnet Download' }],
    dimensions: ['lead_magnet', 'language'], measures: 'outcome' },
  { id: 'homepage-to-signup', title: 'Homepage kit CTA → form start → lead',
    steps: [{ event: 'Homepage CTA', where: { destination: 'signup' } }, { event: 'Form Start', where: { placement: 'home' } }, { event: 'Lead Created', where: { placement: 'home' } }],
    dimensions: ['lead_magnet', 'language'], measures: 'outcome' },
];

/** Minimum events in a segment before a rate is reported without a warning. */
export const MIN_SAMPLE = 50;
