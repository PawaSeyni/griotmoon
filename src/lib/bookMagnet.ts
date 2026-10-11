/**
 * Which lead magnet a book's detail page offers.
 *
 * Why this exists: until 2026-10-11 the signup form appeared only on the home page
 * and /resources, so the 33 book pages — the pages an ad, a pin or a post actually
 * lands on — sent every visitor to Amazon and captured nothing. `griotmoon-signups`
 * sat at 0. Concern L18 in the PaWa Press register.
 *
 * The default is deliberate rather than a fallback. `follow-up-activities` is the only
 * magnet written to pair with a story the reader has just met ("five screen-free
 * activities that help your child remember and retell any picture book"), so on a book
 * page it is the offer that follows from the page rather than interrupting it.
 *
 * Bedtime titles get the bedtime chart instead. Keep that list short and evidence-led:
 * add an id only when the book is genuinely read at bedtime, not merely set at night.
 */
export type BookMagnet = 'follow-up-activities' | 'bedtime-routine';

const BEDTIME_BOOKS = new Set([
  'grandmeres-garden-under-the-moon', // listed on Amazon as a bedtime story
  'a-little-light-for-the-dark',      // courage and the wonder of night
  'yama-and-luna',                    // moonlit, turns fear into curiosity
  'finding-my-quiet',                 // mindfulness and self-regulation
]);

export function bookMagnet(bookId: string): BookMagnet {
  return BEDTIME_BOOKS.has(bookId) ? 'bedtime-routine' : 'follow-up-activities';
}
