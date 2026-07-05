import { Link } from '../components/LocalizedLink';
import { useBooks } from '../data/books';
import { activities } from '../data/activities';
import BookCard from '../components/BookCard';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { useTranslation } from '../lib/language';
import griotFire from '../assets/griot-fire.jpg'; // hero scene: the griot's fire under the cowrie moon
import griotFireWebp from '../assets/griot-fire.webp'; // smaller webp for browsers that support it

const SITE_URL = 'https://griotmoon.com';

// Organization + WebSite structured data. Defined at module scope so the
// reference is stable across renders (JsonLd re-runs its effect on data change).
const ORG_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Griot Moon',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description:
      'The Pawa Seyni Collection: African heritage picture books for children ages 3–9, with free activities in English, Spanish, and French.',
    founder: { '@type': 'Person', name: 'Pawa Seyni' },
    // sameAs: add the Griot Moon social profiles here as each account goes live.
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Griot Moon',
    url: SITE_URL,
    inLanguage: ['en', 'es', 'fr'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  },
];

const TRANSLATIONS = {
  en: {
    seoTitle: 'Griot Moon: African Heritage Picture Books for Curious Minds',
    seoDesc: 'African bedtime stories, heritage tales, and wisdom for growing hearts. The Pawa Seyni Collection: picture books for ages 3–9 with free activities in English, Spanish, and French.',
    heroLine1: 'When the Moon Rises,',
    heroLine2: 'the Village Gathers.',
    heroSubtitle: 'African bedtime stories, heritage tales, and wisdom for growing hearts.',
    heroImageAlt: 'An elderly griot telling stories to children from many backgrounds around a village fire under the full moon',
    ctaBooksPrefix: '✨ Browse',
    ctaBooksSuffix: 'Magical Books',
    ctaActivities: '🎨 Explore Free Activities',
    ctaActivityKit: 'Get Free Activity Kit 🎨',
    statBooks: 'Magical Books',
    statLanguages: 'Languages',
    statActivities: 'Fun Activities',
    featuredTitle: 'Featured Books',
    featuredSubtitle: 'Discover our carefully selected collection of magical stories',
    browseAll: 'Browse All Books →',
    hiwTitle: 'How It Works',
    hiwSubtitle: 'Three simple steps to magical reading',
    hiw: [
      { emoji: '🔍', title: 'Browse', desc: "Explore Pawa Seyni's books and multilingual activities" },
      { emoji: '✨', title: 'Choose', desc: "Pick the perfect story or activity for your child's age" },
      { emoji: '🎉', title: 'Enjoy!', desc: 'Start reading, playing, and learning together' },
    ],
    benefitsTitle: 'Why Griot Moon',
    benefitsSubtitle: 'School teaches knowledge. Stories cement the values that keep a community together.',
    benefits: [
      { emoji: '🌍', title: 'Read in three languages', desc: 'Switch between English, Spanish, and French anytime, made for bilingual families and language learners.' },
      { emoji: '🔊', title: 'Hear every story', desc: 'Tap Listen on any book to hear it read aloud with natural pronunciation in each language.' },
      { emoji: '🎨', title: 'Free activities & printables', desc: 'Story dice, coloring, a reading journal, and a free trilingual starter kit, all free.' },
      { emoji: '💜', title: 'Gentle stories with heart', desc: 'Quiet, values-rich picture books about kindness, courage, and wonder for ages 3–9.' },
    ],
    activitiesTitle: 'Fun Activities with Pawa Seyni',
    activitiesSubtitle: 'Learning comes alive through play!',
    liveBadge: 'Live',
    ages: 'Ages',
    tryIt: 'Try it →',
    seeAll: 'See All Activities →',
    activityPreview: [
      { emoji: '✍️', slug: 'story-builder', title: 'Story Dice Creator', desc: 'Roll the dice to mix characters, settings, and plot twists into a brand-new story.', ages: '6-9' },
      { emoji: '🎭', slug: 'character-workshop', title: 'Character Workshop', desc: 'Step-by-step character builder, type, name, look, personality, powers, and backstory.', ages: '6-9' },
      { emoji: '📓', slug: 'adventure-journal', title: 'Reading Journal', desc: "Record books you've read, favorite characters, and your thoughts. Saves to your device.", ages: '6-9' },
    ],
  },
  es: {
    seoTitle: 'Griot Moon, Libros ilustrados multiculturales para mentes curiosas',
    seoDesc: 'La Colección Pawa Seyni, libros ilustrados para niños de 3 a 9 años sobre asombro tranquilo, magia nocturna y el regreso a casa. Lee con nosotros y descubre actividades gratuitas.',
    heroLine1: 'Cuando sale la luna,',
    heroLine2: 'el pueblo se reúne.',
    heroSubtitle: 'Cuentos africanos para dormir, relatos de herencia y sabiduría para corazones que crecen.',
    heroImageAlt: 'Un anciano griot contando historias a niños de muchos orígenes alrededor de una fogata bajo la luna llena',
    ctaBooksPrefix: '✨ Explora',
    ctaBooksSuffix: 'libros mágicos',
    ctaActivities: '🎨 Descubre actividades gratis',
    ctaActivityKit: 'Recibe el kit de actividades gratis 🎨',
    statBooks: 'Libros mágicos',
    statLanguages: 'Idiomas',
    statActivities: 'Actividades divertidas',
    featuredTitle: 'Libros destacados',
    featuredSubtitle: 'Descubre nuestra colección cuidadosamente seleccionada de historias mágicas',
    browseAll: 'Ver todos los libros →',
    hiwTitle: 'Cómo funciona',
    hiwSubtitle: 'Tres pasos sencillos para una lectura mágica',
    hiw: [
      { emoji: '🔍', title: 'Explora', desc: 'Explora los libros de Pawa Seyni y actividades multilingües' },
      { emoji: '✨', title: 'Elige', desc: 'Selecciona la historia o actividad perfecta para la edad de tu peque' },
      { emoji: '🎉', title: '¡Disfruta!', desc: 'Empieza a leer, jugar y aprender juntos' },
    ],
    benefitsTitle: 'Por qué Griot Moon',
    benefitsSubtitle: 'La escuela enseña conocimientos. Las historias cimentan los valores que mantienen unida a una comunidad.',
    benefits: [
      { emoji: '🌍', title: 'Lee en tres idiomas', desc: 'Cambia entre inglés, español y francés cuando quieras, ideal para familias bilingües y para aprender idiomas.' },
      { emoji: '🔊', title: 'Escucha cada historia', desc: 'Pulsa Escuchar en cualquier libro para oírlo en voz alta con pronunciación natural en cada idioma.' },
      { emoji: '🎨', title: 'Actividades y descargables gratis', desc: 'Dados de historias, páginas para colorear, un diario de lectura y un kit de inicio trilingüe, todo gratis.' },
      { emoji: '💜', title: 'Historias tiernas con valores', desc: 'Libros ilustrados serenos sobre la bondad, la valentía y el asombro, para edades de 3 a 9 años.' },
    ],
    activitiesTitle: 'Actividades divertidas con Pawa Seyni',
    activitiesSubtitle: '¡El aprendizaje cobra vida con el juego!',
    liveBadge: 'En vivo',
    ages: 'Edades',
    tryIt: 'Probar →',
    seeAll: 'Ver todas las actividades →',
    activityPreview: [
      { emoji: '✍️', slug: 'story-builder', title: 'Creador de dados de historia', desc: 'Lanza los dados para mezclar personajes, escenarios y giros en una nueva historia.', ages: '6-9' },
      { emoji: '🎭', slug: 'character-workshop', title: 'Taller de personajes', desc: 'Constructor paso a paso, tipo, nombre, apariencia, personalidad, poderes e historia.', ages: '6-9' },
      { emoji: '📓', slug: 'adventure-journal', title: 'Diario de lectura', desc: 'Registra los libros leídos, personajes favoritos y tus pensamientos. Se guarda en tu dispositivo.', ages: '6-9' },
    ],
  },
  fr: {
    seoTitle: 'Griot Moon, Albums illustrés multiculturels pour les esprits curieux',
    seoDesc: 'La Collection Pawa Seyni, des albums pour enfants de 3 à 9 ans sur l\'émerveillement tranquille, la magie nocturne et le retour à la maison. Lisez avec nous et explorez des activités gratuites.',
    heroLine1: 'Quand la lune se lève,',
    heroLine2: 'le village se rassemble.',
    heroSubtitle: "Histoires africaines du soir, contes du patrimoine et sagesse pour les cœurs qui grandissent.",
    heroImageAlt: 'Un vieux griot racontant des histoires à des enfants de tous horizons autour d’un feu de village sous la pleine lune',
    ctaBooksPrefix: '✨ Parcourir',
    ctaBooksSuffix: 'livres magiques',
    ctaActivities: '🎨 Découvrir les activités gratuites',
    ctaActivityKit: 'Recevoir le kit d’activités gratuit 🎨',
    statBooks: 'Livres magiques',
    statLanguages: 'Langues',
    statActivities: 'Activités amusantes',
    featuredTitle: 'Livres en vedette',
    featuredSubtitle: 'Découvrez notre collection soigneusement choisie d\'histoires magiques',
    browseAll: 'Voir tous les livres →',
    hiwTitle: 'Comment ça marche',
    hiwSubtitle: 'Trois étapes simples pour une lecture magique',
    hiw: [
      { emoji: '🔍', title: 'Explorer', desc: "Explorez les livres de Pawa Seyni et des activités multilingues" },
      { emoji: '✨', title: 'Choisir', desc: "Choisissez l'histoire ou l'activité idéale pour l'âge de votre enfant" },
      { emoji: '🎉', title: 'Profiter !', desc: 'Commencez à lire, jouer et apprendre ensemble' },
    ],
    benefitsTitle: 'Pourquoi Griot Moon',
    benefitsSubtitle: "L'école transmet le savoir. Les histoires scellent les valeurs qui tiennent une communauté unie.",
    benefits: [
      { emoji: '🌍', title: 'Lisez en trois langues', desc: 'Passez de l\'anglais à l\'espagnol et au français à tout moment, parfait pour les familles bilingues et l\'apprentissage des langues.' },
      { emoji: '🔊', title: 'Écoutez chaque histoire', desc: 'Appuyez sur Écouter sur n\'importe quel livre pour l\'entendre lu à voix haute avec une prononciation naturelle dans chaque langue.' },
      { emoji: '🎨', title: 'Activités et imprimables gratuits', desc: 'Dés à histoires, coloriages, un journal de lecture et un kit de démarrage trilingue, tout gratuit.' },
      { emoji: '💜', title: 'Des histoires douces et porteuses de sens', desc: 'Des albums paisibles sur la gentillesse, le courage et l\'émerveillement, pour les 3 à 9 ans.' },
    ],
    activitiesTitle: 'Activités amusantes avec Pawa Seyni',
    activitiesSubtitle: 'L\'apprentissage prend vie par le jeu !',
    liveBadge: 'En direct',
    ages: 'Âges',
    tryIt: 'Essayer →',
    seeAll: 'Voir toutes les activités →',
    activityPreview: [
      { emoji: '✍️', slug: 'story-builder', title: 'Créateur de dés à histoire', desc: 'Lancez les dés pour mélanger personnages, décors et rebondissements en une toute nouvelle histoire.', ages: '6-9' },
      { emoji: '🎭', slug: 'character-workshop', title: 'Atelier de personnages', desc: 'Constructeur pas à pas, type, nom, apparence, personnalité, pouvoirs et histoire.', ages: '6-9' },
      { emoji: '📓', slug: 'adventure-journal', title: 'Journal de lecture', desc: 'Enregistrez les livres lus, vos personnages préférés et vos pensées. Sauvegardé sur votre appareil.', ages: '6-9' },
    ],
  },
};

export default function Home() {
  const t = useTranslation(TRANSLATIONS);
  const books = useBooks();
  const featuredBooks = books.filter(b => b.featured);

  // Counts derive from the catalog so the hero CTA, this stat, and the /books
  // page can never disagree (previously: "50+" CTA vs "6+" stat vs 18 books).
  const stats = [
    { number: `${books.length}`, label: t.statBooks, emoji: '📚' },
    { number: '3', label: t.statLanguages, emoji: '🌍' },
    { number: `${activities.length}`, label: t.statActivities, emoji: '🎨' },
  ];

  return (
    <main>
      <Seo title={t.seoTitle} bare description={t.seoDesc} path="/" image={`${SITE_URL}/og-image.jpg`} />
      <JsonLd id="org" data={ORG_SCHEMA} />

      {/* Hero: the griot's fire under the cowrie moon. The artwork is the hero;
          copy sits in the darker left sky so the storyteller and children stay visible. */}
      <section className="hero-bg min-h-[85vh] flex items-center relative overflow-hidden px-4 py-20">
        <picture>
          <source type="image/webp" srcSet={griotFireWebp} />
          <img
            src={griotFire}
            alt={t.heroImageAlt}
            width={1280}
            height={1280}
            loading="eager"
            decoding="async"
            {...({ fetchpriority: 'high' } as Record<string, string>)}
            className="absolute inset-0 w-full h-full object-cover object-[center_38%]"
          />
        </picture>
        {/* Scrim: keeps headline/CTAs readable without hiding the scene. */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-purple-900/25 to-purple-900/80" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 via-purple-900/20 to-transparent" aria-hidden />

        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="text-center lg:text-left text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
              {t.heroLine1}<br />{t.heroLine2}
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-10 leading-relaxed drop-shadow-md">
              {t.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/books" className="btn-primary text-lg px-8 py-4 shadow-2xl">
                {t.ctaBooksPrefix} {books.length} {t.ctaBooksSuffix}
              </Link>
              <Link to="/activities" className="btn-secondary text-lg px-8 py-4">
                {t.ctaActivities}
              </Link>
            </div>
            {/* High-contrast lead-magnet CTA, scrolls to email signup form below the fold. */}
            <div className="mt-5 flex justify-center lg:justify-start">
              <a
                href="#email-signup"
                className="inline-flex items-center justify-center text-lg px-8 py-4 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-purple-900 font-extrabold rounded-full shadow-2xl ring-2 ring-yellow-200/60 hover:ring-yellow-100 transition-all duration-200 hover:scale-105"
              >
                {t.ctaActivityKit}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 gap-6 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl mb-1">{stat.emoji}</div>
              <div className="text-3xl font-extrabold text-purple-700">{stat.number}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.featuredTitle}</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">{t.featuredSubtitle}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredBooks.map(book => (
              <BookCard key={book.id} book={book} priority />
            ))}
          </div>
          <div className="text-center">
            <Link to="/books" className="btn-primary text-lg px-8 py-4">
              {t.browseAll}
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.hiwTitle}</h2>
            <p className="text-gray-500 text-lg">{t.hiwSubtitle}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.hiw.map((item, i) => (
              <div key={i} className="relative text-center p-8 bg-white rounded-2xl shadow-lg">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {i + 1}
                </div>
                <div className="text-6xl mb-4 mt-4">{item.emoji}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Griot Moon, honest benefit cards (no fabricated quotes) */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.benefitsTitle}</h2>
            <p className="text-gray-500 text-lg">{t.benefitsSubtitle}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.benefits.map((b, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-purple-50 text-center">
                <div className="text-4xl mb-3" aria-hidden>{b.emoji}</div>
                <h3 className="font-bold text-gray-800 mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Activities Preview */}
      <section className="py-20 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.activitiesTitle}</h2>
            <p className="text-gray-500 text-lg">{t.activitiesSubtitle}</p>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {t.activityPreview.map((act, i) => (
              <div key={i} className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                <span className="absolute top-4 right-4 z-10 text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                  {t.liveBadge}
                </span>
                <div className="h-2 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
                <div className="p-6">
                  <span className="text-4xl block mb-3">{act.emoji}</span>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{act.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{act.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">{t.ages}: {act.ages}</span>
                    <Link to={`/activities/${act.slug}`} className="text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                      {t.tryIt}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/activities" className="btn-primary text-lg px-8 py-4">
              {t.seeAll}
            </Link>
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <EmailSignup />
    </main>
  );
}
