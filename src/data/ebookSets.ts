import type { Language } from '../lib/language';

/**
 * Payhip eBook sets and the Griot Moon Library (added 2026-11-13).
 *
 * Each set is a Payhip bundle of three existing single-title products, sold once for
 * $6.99 (the three titles cost $8.97 separately). The library is a Payhip bundle of all
 * 32 eBook products on a $29.99 yearly subscription; Payhip removes access the moment a
 * member cancels, so the copy says so. Book ids must match src/data/books.ts and every
 * book listed here must have an ebookUrl. The Broken Toy is in two sets on purpose:
 * 32 titles do not divide into threes.
 */

type Localized = Record<Language, string>;

export interface EbookSet {
  /** Anchor on /ebooks and the image file name in src/assets/sets. */
  key: string;
  /** payhip.com/b/<code> */
  url: string;
  bookIds: [string, string, string];
  name: Localized;
  tagline: Localized;
}

export const SET_PRICE = { en: '$6.99', es: '6,99 US$', fr: '6,99 $ US' } as const;
export const LIBRARY_PRICE = { en: '$29.99 a year', es: '29,99 US$ al año', fr: '29,99 $ US par an' } as const;
export const LIBRARY_URL = 'https://payhip.com/b/vV1ao';
export const LIBRARY_BOOK_COUNT = 32;

export const EBOOK_SETS: EbookSet[] = [
  {
    key: 'wise-leaders',
    url: 'https://payhip.com/b/n09vI',
    bookIds: ['the-chiefs-3-gifts', 'chief-maels-final-gift', 'the-servant-king'],
    name: { en: 'Wise Leaders', es: 'Líderes sabios', fr: 'Chefs sages' },
    tagline: {
      en: 'Stories about leading with humility, sharing power and passing on good values.',
      es: 'Historias sobre liderar con humildad, compartir el poder y transmitir buenos valores.',
      fr: 'Des histoires pour diriger avec humilité, partager le pouvoir et transmettre de bonnes valeurs.',
    },
  },
  {
    key: 'caring-for-the-earth',
    url: 'https://payhip.com/b/7zxFU',
    bookIds: ['the-chiefs-green-rule', 'the-grandmothers-trees', 'the-trees-we-plant-for-tomorrow'],
    name: { en: 'Caring for the Earth', es: 'Cuidar la Tierra', fr: 'Prendre soin de la Terre' },
    tagline: {
      en: 'Stories about protecting the land and planting for the generations to come.',
      es: 'Historias sobre proteger la tierra y sembrar para las generaciones futuras.',
      fr: 'Des histoires sur la protection de la terre et les arbres plantés pour les générations futures.',
    },
  },
  {
    key: 'generosity-and-gratitude',
    url: 'https://payhip.com/b/CeP4N',
    bookIds: ['the-spirit-that-shares', 'the-hand-that-gives', 'the-thankful-farmer'],
    name: { en: 'Generosity and Gratitude', es: 'Generosidad y gratitud', fr: 'Générosité et gratitude' },
    tagline: {
      en: 'Stories about sharing what we have and giving thanks for it.',
      es: 'Historias sobre compartir lo que tenemos y dar gracias por ello.',
      fr: 'Des histoires sur le partage de ce que l’on a et la gratitude.',
    },
  },
  {
    key: 'together-in-community',
    url: 'https://payhip.com/b/gnqTY',
    bookIds: ['ubuntu-we-are-together', 'the-mighty-fist', 'our-child'],
    name: { en: 'Together in Community', es: 'Juntos en comunidad', fr: 'Ensemble en communauté' },
    tagline: {
      en: 'Stories about belonging, togetherness and the strength we find in each other.',
      es: 'Historias sobre pertenecer, estar juntos y la fuerza que encontramos los unos en los otros.',
      fr: 'Des histoires sur l’appartenance, l’unité et la force que l’on trouve les uns dans les autres.',
    },
  },
  {
    key: 'listening-to-elders',
    url: 'https://payhip.com/b/uDp5I',
    bookIds: ['the-whistling-secret', 'kweku-and-the-wise-forest', 'the-brothers-and-the-wise-land'],
    name: { en: 'Listening to Elders', es: 'Escuchar a los mayores', fr: 'Écouter les anciens' },
    tagline: {
      en: 'Stories about curiosity, tradition and the wisdom of those who came before us.',
      es: 'Historias sobre la curiosidad, la tradición y la sabiduría de quienes vinieron antes.',
      fr: 'Des histoires sur la curiosité, la tradition et la sagesse de ceux qui nous ont précédés.',
    },
  },
  {
    key: 'brave-hearts',
    url: 'https://payhip.com/b/NFpsu',
    bookIds: ['yama-and-luna', 'yamas-brave-choice', 'a-little-light-for-the-dark'],
    name: { en: 'Brave Hearts', es: 'Corazones valientes', fr: 'Cœurs courageux' },
    tagline: {
      en: 'Stories about finding courage at night, at the market and in your own heart.',
      es: 'Historias sobre encontrar valor de noche, en el mercado y en tu propio corazón.',
      fr: 'Des histoires pour trouver du courage la nuit, au marché et dans son propre cœur.',
    },
  },
  {
    key: 'feelings-and-friendship',
    url: 'https://payhip.com/b/B07gP',
    bookIds: ['finding-my-quiet', 'the-broken-toy', 'the-day-we-woke-up-as-dinosaurs'],
    name: { en: 'Feelings and Friendship', es: 'Emociones y amistad', fr: 'Émotions et amitié' },
    tagline: {
      en: 'Stories about calm, forgiveness and the joy of imagining together.',
      es: 'Historias sobre la calma, el perdón y la alegría de imaginar juntos.',
      fr: 'Des histoires sur le calme, le pardon et la joie d’imaginer ensemble.',
    },
  },
  {
    key: 'joy-and-peace',
    url: 'https://payhip.com/b/f5G6P',
    bookIds: ['the-laughing-village', 'a-tale-of-hope-and-humor', 'the-talking-tree'],
    name: { en: 'Joy and Peace', es: 'Alegría y paz', fr: 'Joie et paix' },
    tagline: {
      en: 'Stories about laughter, hope and solving conflict by listening.',
      es: 'Historias sobre la risa, la esperanza y resolver conflictos escuchando.',
      fr: 'Des histoires sur le rire, l’espoir et la résolution des conflits par l’écoute.',
    },
  },
  {
    key: 'patience-pays-off',
    url: 'https://payhip.com/b/SDJ47',
    bookIds: ['slow-and-strong-wins-the-race', 'the-full-pot-and-the-empty-pot', 'grandmeres-garden-under-the-moon'],
    name: { en: 'Patience Pays Off', es: 'La paciencia da frutos', fr: 'La patience porte ses fruits' },
    tagline: {
      en: 'Stories about steady effort, quiet strength and waiting for good things to grow.',
      es: 'Historias sobre el esfuerzo constante, la fuerza tranquila y esperar a que crezcan las cosas buenas.',
      fr: 'Des histoires sur l’effort constant, la force tranquille et l’attente des bonnes choses qui grandissent.',
    },
  },
  {
    key: 'clever-thinkers',
    url: 'https://payhip.com/b/iLtZ2',
    bookIds: ['the-clever-pots', 'the-clever-scientist-professor-hawel', 'the-hunt-with-two-paths'],
    name: { en: 'Clever Thinkers', es: 'Mentes ingeniosas', fr: 'Esprits ingénieux' },
    tagline: {
      en: 'Stories about invention, science and seeing a problem from more than one side.',
      es: 'Historias sobre la invención, la ciencia y mirar un problema desde más de un lado.',
      fr: 'Des histoires sur l’invention, la science et l’art de voir un problème sous plusieurs angles.',
    },
  },
  {
    key: 'kindness-and-second-chances',
    url: 'https://payhip.com/b/pK7DM',
    bookIds: ['the-kindness-garden', 'the-garden-of-second-chances', 'the-broken-toy'],
    name: { en: 'Kindness and Second Chances', es: 'Bondad y segundas oportunidades', fr: 'Bonté et secondes chances' },
    tagline: {
      en: 'Stories about kindness, forgiveness and earning trust again.',
      es: 'Historias sobre la bondad, el perdón y volver a ganarse la confianza.',
      fr: 'Des histoires sur la bonté, le pardon et la confiance regagnée.',
    },
  },
];

/** The sets a book belongs to (usually one; The Broken Toy is in two). */
export const setsForBook = (bookId: string): EbookSet[] =>
  EBOOK_SETS.filter(s => s.bookIds.includes(bookId));

// Responsive WebP variants of each set image, same pipeline as the book covers.
const SET_SRCSET = import.meta.glob<string>('../assets/sets/*.jpg', {
  eager: true,
  import: 'default',
  query: '?w=320;640&format=webp&as=srcset',
});
const SET_SRC = import.meta.glob<string>('../assets/sets/*.jpg', { eager: true, import: 'default' });
export const setImage = (key: string) => ({
  src: SET_SRC[`../assets/sets/${key}.jpg`] ?? '',
  srcSet: SET_SRCSET[`../assets/sets/${key}.jpg`] ?? '',
});
