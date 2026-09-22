// Thin wrapper over Plausible custom events.
//
// Plausible is loaded in index.html with a queue stub, so calling track()
// before the script finishes loading is safe (calls buffer, then flush). If
// Plausible is blocked (ad blocker, no-JS) this is a silent no-op. Analytics
// must never throw into the app.
//
// The event list lives in src/analytics/events.ts. Event names and property keys
// are checked at compile time against it, and property keys are filtered again at
// runtime (default-deny), so nothing outside the dictionary, such as an email,
// can reach Plausible. Funnels built from these events: src/analytics/funnels.ts.

import { EVENT_BY_NAME, validateEvent, type EVENTS, type EventName } from '../analytics/events';

type Def<E extends EventName> = Extract<(typeof EVENTS)[number], { name: E }>;
export type PropsFor<E extends EventName> =
  { [K in Def<E>['required'][number]]: string } & { [K in Def<E>['optional'][number]]?: string };

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function track<E extends EventName>(event: E, props: PropsFor<E>): void {
  if (typeof window === 'undefined') return;
  try {
    const def = EVENT_BY_NAME[event];
    const allowed = new Set([...def.required, ...def.optional]);
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(props as Record<string, unknown>)) {
      if (allowed.has(k) && typeof v === 'string' && v !== '') clean[k] = v;
    }
    if (import.meta.env.DEV) {
      const problems = validateEvent(event, props as Record<string, unknown>);
      if (problems.length) console.warn('[analytics]', ...problems);
    }
    window.plausible?.(event, { props: clean });
  } catch {
    // never let analytics break the page
  }
}
