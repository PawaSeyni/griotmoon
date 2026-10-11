/**
 * Length discipline for `<title>` and `<meta name="description">`.
 *
 * Why this exists: book pages fed their visible page copy straight into the
 * head. `<Seo title>` carried `"{title}: {subtitle}"` and the description was
 * the whole blurb, so on 2026-10-11 26 of 33 English titles ran past 60
 * characters (Grandmère's Garden Under the Moon reached 101 with the site
 * suffix) and all 33 descriptions past 160, in all three languages — Spanish
 * and French worse, since translation inflates both.
 *
 * The lengths were the symptom. The bug was page fields doing double duty as
 * metadata, which meant every new book inherited the problem. Deriving the meta
 * text here, once, is what stops that; `tests/seo/meta-length.test.mjs` holds
 * the line on the prerendered output so it cannot drift back.
 *
 * These are not hard search-engine cutoffs — Google measures rendered pixels,
 * not characters, and will rewrite a snippet whenever it prefers its own. They
 * are the conventional budgets at which a tag usually survives intact, which is
 * the most a static limit can promise.
 */

/** Includes the " | Griot Moon" suffix that `Seo` appends. */
export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

/**
 * Trim `text` to at most `max` characters.
 *
 * Prefers ending on a complete sentence, but only when that leaves at least
 * half the budget used — otherwise a book whose first sentence is short would
 * ship a thin description where a fuller, truncated one says more. Failing
 * that, cuts at the last word boundary and marks the truncation.
 */
export function clampMeta(text: string, max: number = DESCRIPTION_MAX): string {
  const s = text.trim().replace(/\s+/g, ' ');
  if (s.length <= max) return s;

  const window = s.slice(0, max + 1);
  // A sentence end is .!? followed by whitespace or the end of the window, so a
  // decimal point or "Mrs." mid-sentence is not mistaken for one.
  const ends = [...window.matchAll(/[.!?](?=\s|$)/g)];
  const last = ends.length ? ends[ends.length - 1] : undefined;
  if (last?.index !== undefined && last.index + 1 >= Math.floor(max / 2)) {
    return window.slice(0, last.index + 1).trim();
  }

  // The ellipsis costs one character, so cut at max - 1.
  const cut = window.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  let head = (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd();
  // Drop a trailing conjunction, preposition or dangling punctuation, so the
  // snippet reads as a clause that stopped rather than a word cut in half:
  // "…the best things grow slowly and…" becomes "…the best things grow slowly…".
  let prev: string;
  do {
    prev = head;
    head = head.replace(/[\s]*[,;:–—-]+$/, '');
    head = head.replace(/\s+(?:and|or|but|so|of|to|in|on|at|by|for|with|from|as|that|which|who|the|a|an|y|o|de|del|la|el|los|las|en|con|por|para|que|et|ou|le|les|du|des|une?|dans|avec|qui|pour)$/i, '');
  } while (head !== prev);
  return head + '…';
}
