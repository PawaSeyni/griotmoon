// Pawa Seyni Collection — African heritage picture books at Griot Moon.
//
// Each book carries localized title/subtitle/description/theme (EN/ES/FR).
// All titles currently ship as 'coming-soon' placeholders: swap in the real
// Amazon ASIN via dp('...') and remove the status flag as each goes live.
// Covers are designed SVG placeholders until final art lands in
// src/assets/covers/.

import { useLanguage, type Language } from '../lib/language';
import { amazonDp } from '../lib/amazon';
import ubuntuCover from '../assets/covers/ubuntu.svg';
import yamAndEggCover from '../assets/covers/yam-and-egg.svg';
import whistlingSecretCover from '../assets/covers/whistling-secret.svg';
import mightyFistCover from '../assets/covers/mighty-fist.svg';
import chiefGreenRuleCover from '../assets/covers/chief-green-rule.svg';

type LocalizedString = Record<Language, string>;

export interface Book {
  id: string;
  coverImage: string;
  ageRange: string;
  languages: string[];
  amazonUrl: string;
  featured?: boolean;
  /** Publication state. Absent/'published' = live with a Buy CTA; 'coming-soon' shows a placeholder. */
  status?: 'published' | 'coming-soon';
  title: LocalizedString;
  subtitle?: LocalizedString;
  description: LocalizedString;
  theme: LocalizedString;
}

export interface LocalizedBook {
  id: string;
  coverImage: string;
  ageRange: string;
  languages: string[];
  amazonUrl: string;
  featured?: boolean;
  status?: 'published' | 'coming-soon';
  title: string;
  subtitle?: string;
  description: string;
  theme: string;
}

const dp = amazonDp;

/** A book not yet for sale — show a "coming soon" placeholder instead of a Buy CTA. */
export const isComingSoon = (b: { status?: string }): boolean => b.status === 'coming-soon';

export const books: Book[] = [
  {
    id: 'ubuntu',
    coverImage: ubuntuCover,
    ageRange: '4-8',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    amazonUrl: dp(''),
    featured: true,
    status: 'coming-soon',
    title: {
      en: 'Ubuntu',
      es: 'Ubuntu',
      fr: 'Ubuntu',
    },
    subtitle: {
      en: 'I Am Because We Are',
      es: 'Soy porque somos',
      fr: 'Je suis parce que nous sommes',
    },
    description: {
      en: 'When a storm scatters the village harvest, one child learns the oldest lesson under the moon: no one carries a heavy basket alone. A warm introduction to Ubuntu — the African philosophy that we become ourselves through each other.',
      es: 'Cuando una tormenta dispersa la cosecha del pueblo, una niña aprende la lección más antigua bajo la luna: nadie carga sola una cesta pesada. Una cálida introducción al Ubuntu, la filosofía africana de que llegamos a ser nosotros mismos gracias a los demás.',
      fr: "Quand une tempête disperse la récolte du village, une enfant apprend la plus ancienne leçon sous la lune : personne ne porte seul un panier trop lourd. Une belle introduction à l'Ubuntu, la philosophie africaine selon laquelle nous devenons nous-mêmes grâce aux autres.",
    },
    theme: {
      en: 'Community and belonging',
      es: 'Comunidad y pertenencia',
      fr: 'Communauté et appartenance',
    },
  },
  {
    id: 'yam-and-egg',
    coverImage: yamAndEggCover,
    ageRange: '3-7',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    amazonUrl: dp(''),
    featured: true,
    status: 'coming-soon',
    title: {
      en: 'Yam and Egg',
      es: 'Ñame y Huevo',
      fr: "L'Igname et l'Œuf",
    },
    subtitle: {
      en: 'A Folktale of Sharing',
      es: 'Un cuento popular sobre compartir',
      fr: 'Un conte sur le partage',
    },
    description: {
      en: 'A hungry traveler, one yam, one egg, and a village that has forgotten how to share a table. Told in the rhythm of the old fireside folktales, this story shows how the smallest meal grows when it is divided with love.',
      es: 'Un viajero hambriento, un ñame, un huevo y un pueblo que ha olvidado cómo compartir la mesa. Contada al ritmo de los viejos cuentos junto al fuego, esta historia muestra cómo la comida más pequeña crece cuando se reparte con amor.',
      fr: "Un voyageur affamé, une igname, un œuf et un village qui a oublié comment partager sa table. Raconté au rythme des vieux contes au coin du feu, ce récit montre comment le plus petit repas grandit quand on le partage avec amour.",
    },
    theme: {
      en: 'Generosity and sharing',
      es: 'Generosidad y compartir',
      fr: 'Générosité et partage',
    },
  },
  {
    id: 'whistling-secret',
    coverImage: whistlingSecretCover,
    ageRange: '4-8',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    amazonUrl: dp(''),
    featured: true,
    status: 'coming-soon',
    title: {
      en: 'The Whistling Secret',
      es: 'El secreto del silbido',
      fr: 'Le secret du sifflement',
    },
    subtitle: {
      en: 'A Yama Story',
      es: 'Una historia de Yama',
      fr: 'Une histoire de Yama',
    },
    description: {
      en: 'Yama has learned a secret whistle from her grandfather — one that calls the evening birds home. But a secret this good is hard to keep, and harder to give away. A gentle Yama-series story about trust, patience, and the things elders pass down.',
      es: 'Yama ha aprendido de su abuelo un silbido secreto, uno que llama a los pájaros del atardecer a casa. Pero un secreto tan bueno es difícil de guardar, y más difícil de regalar. Una tierna historia de la serie Yama sobre la confianza, la paciencia y lo que los mayores nos transmiten.',
      fr: "Yama a appris de son grand-père un sifflement secret — celui qui appelle les oiseaux du soir à la maison. Mais un si beau secret est difficile à garder, et plus difficile encore à offrir. Une douce histoire de la série Yama sur la confiance, la patience et ce que les anciens nous transmettent.",
    },
    theme: {
      en: 'Family wisdom and patience',
      es: 'Sabiduría familiar y paciencia',
      fr: 'Sagesse familiale et patience',
    },
  },
  {
    id: 'mighty-fist',
    coverImage: mightyFistCover,
    ageRange: '4-8',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: {
      en: 'The Mighty Fist',
      es: 'El puño poderoso',
      fr: 'Le poing puissant',
    },
    subtitle: {
      en: 'Strength, Gently Used',
      es: 'La fuerza, usada con ternura',
      fr: 'La force, employée avec douceur',
    },
    description: {
      en: 'Everyone says Kofi has the strongest hands in the village — strong enough to crack palm nuts, strong enough to win every game. But when his little sister needs help, Kofi discovers what strong hands are really for. A story about gentleness as the truest strength.',
      es: 'Todos dicen que Kofi tiene las manos más fuertes del pueblo: capaces de partir nueces de palma y de ganar todos los juegos. Pero cuando su hermanita necesita ayuda, Kofi descubre para qué sirven de verdad unas manos fuertes. Una historia sobre la ternura como la fuerza más verdadera.',
      fr: "Tout le monde dit que Kofi a les mains les plus fortes du village — assez fortes pour casser des noix de palme, assez fortes pour gagner à tous les jeux. Mais quand sa petite sœur a besoin d'aide, Kofi découvre à quoi servent vraiment des mains fortes. Une histoire sur la douceur comme la plus vraie des forces.",
    },
    theme: {
      en: 'Gentleness and self-control',
      es: 'Ternura y autocontrol',
      fr: 'Douceur et maîtrise de soi',
    },
  },
  {
    id: 'chief-green-rule',
    coverImage: chiefGreenRuleCover,
    ageRange: '4-8',
    languages: ['🇺🇸', '🇪🇸', '🇫🇷'],
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: {
      en: 'Chief Green Rule',
      es: 'El jefe de la regla verde',
      fr: 'Le chef à la règle verte',
    },
    subtitle: {
      en: 'Caring for the Land That Cares for Us',
      es: 'Cuidar la tierra que nos cuida',
      fr: 'Prendre soin de la terre qui prend soin de nous',
    },
    description: {
      en: 'The new chief has one rule, and it is green: what you take from the land, you give back. When the river runs low and the baobab drops its leaves, the village children set out to discover what the old rule really means. An earth-loving story of stewardship.',
      es: 'El nuevo jefe tiene una sola regla, y es verde: lo que tomas de la tierra, lo devuelves. Cuando el río baja y el baobab pierde sus hojas, los niños del pueblo salen a descubrir qué significa de verdad la vieja regla. Una historia sobre el cuidado de la tierra.',
      fr: "Le nouveau chef n'a qu'une règle, et elle est verte : ce que tu prends à la terre, tu le lui rends. Quand la rivière baisse et que le baobab perd ses feuilles, les enfants du village partent découvrir ce que signifie vraiment la vieille règle. Une histoire d'amour et de respect de la terre.",
    },
    theme: {
      en: 'Nature and stewardship',
      es: 'Naturaleza y cuidado del planeta',
      fr: 'Nature et protection de la terre',
    },
  },
];

function localize(book: Book, lang: Language): LocalizedBook {
  return {
    id: book.id,
    coverImage: book.coverImage,
    ageRange: book.ageRange,
    languages: book.languages,
    amazonUrl: book.amazonUrl,
    featured: book.featured,
    status: book.status,
    title: book.title[lang] ?? book.title.en,
    subtitle: book.subtitle ? (book.subtitle[lang] ?? book.subtitle.en) : undefined,
    description: book.description[lang] ?? book.description.en,
    theme: book.theme[lang] ?? book.theme.en,
  };
}

/** Returns all books localized for the current language. */
export function useBooks(): LocalizedBook[] {
  const { language } = useLanguage();
  return books.map((b) => localize(b, language));
}

/** Returns a single book localized for the current language, by id. */
export function useBook(id: string): LocalizedBook | undefined {
  const { language } = useLanguage();
  const found = books.find((b) => b.id === id);
  return found ? localize(found, language) : undefined;
}
