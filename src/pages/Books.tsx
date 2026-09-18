import { useMemo, useState } from 'react';
import { useBooks } from '../data/books';
import BookCard from '../components/BookCard';
import BookRecommendations from '../components/BookRecommendations';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { matchesAgeFilter } from '../lib/ages';
import { AMAZON_AUTHOR_URL } from '../lib/amazon';
import { useTranslation, useLanguage, localizePath } from '../lib/language';

const SITE_URL = 'https://griotmoon.com';
const FLAG_TO_LANG: Record<string, string> = { '🇺🇸': 'en', '🇪🇸': 'es', '🇫🇷': 'fr' };

const TRANSLATIONS = {
  en: {
    seoTitle: 'African Heritage Tales for Children and Families in the Diaspora',
    seoDesc: 'Browse all {n} African heritage tales in the Pawa Seyni Collection: picture books for children and families in the diaspora, rooted in the griot tradition, ages 3–9.',
    heading: 'African heritage tales for children and families in the diaspora.',
    subheading: 'Rooted in the griot tradition, these stories reconnect young readers with the wisdom, values, and community spirit passed down around the village fire for generations.',
    searchPlaceholder: 'Search books by title or theme...',
    ageAll: 'All',
    age3to5: '3-5 years',
    age6to8: '6-8 years',
    age9plus: '9+ years',
    showingBook: 'book',
    showingBooks: 'books',
    showing: 'Showing',
    emptyMsg: 'No books found. Try a different search!',
    amazonHeading: 'Find All Books on Amazon',
    amazonBlurb: "Find Pawa Seyni's books on Amazon. Availability, formats, pricing, shipping, and returns are handled by Amazon.",
    amazonCta: '🛒 View All Books on Amazon →',
    pricingHeading: 'Formats & Pricing',
    paperbackLabel: 'Paperback',
    ebookLabel: 'eBook',
    seePrice: 'See price on Amazon',
    freeLabel: 'Always free',
    freeItems: 'Activities, read-alongs & the starter kit',
    pricingNote: 'Prices in USD. Final price and availability on Amazon.',
    browseHeading: 'Find the right African story for your child',
    browseIntro: 'Explore the collection by age, theme, or language. These picture books draw on African storytelling traditions while giving families practical ways to talk about community, courage, kindness, wisdom, and belonging.',
    ageBrowse: 'Browse by age',
    themeBrowse: 'Explore common themes',
    languageBrowse: 'Bilingual & multilingual reading',
    themeCommunity: 'Community & belonging',
    themeCourage: 'Courage & resilience',
    themeKindness: 'Kindness & generosity',
    themeWisdom: 'Wisdom & perspective',
    themeQueries: ['community', 'courage', 'kindness', 'wisdom'],
    multilingualBlurb: 'Look for the language flags on each book to see which published editions are available in English, Spanish, and French.',
    learnHeading: 'Keep the story going',
    learnBlurb: 'Pair a book with practical reading guides and activities designed for families and educators.',
    resourcesCta: 'Explore parent reading resources →',
    activitiesCta: 'Explore free story activities →',
  },
  es: {
    seoTitle: 'Cuentos de herencia africana para niños y familias de la diáspora',
    seoDesc: 'Explora los {n} libros de la Colección Pawa Seyni, álbumes multiculturales para niños de 3 a 9 años sobre asombro tranquilo, bondad y curiosidad.',
    heading: 'Cuentos de herencia africana para niños y familias de la diáspora.',
    subheading: 'Enraizadas en la tradición del griot, estas historias reconectan a los pequeños lectores con la sabiduría, los valores y el espíritu comunitario transmitidos alrededor del fuego del pueblo durante generaciones.',
    searchPlaceholder: 'Buscar libros por título o tema...',
    ageAll: 'Todos',
    age3to5: '3-5 años',
    age6to8: '6-8 años',
    age9plus: '9+ años',
    showingBook: 'libro',
    showingBooks: 'libros',
    showing: 'Mostrando',
    emptyMsg: 'No se encontraron libros. ¡Prueba otra búsqueda!',
    amazonHeading: 'Encuentra todos los libros en Amazon',
    amazonBlurb: 'Encuentra los libros de Pawa Seyni en Amazon. La disponibilidad, los formatos, los precios, el envío y las devoluciones los gestiona Amazon.',
    amazonCta: '🛒 Ver todos los libros en Amazon →',
    pricingHeading: 'Formatos y precios',
    paperbackLabel: 'Tapa blanda',
    ebookLabel: 'eBook',
    seePrice: 'Consulta el precio en Amazon',
    freeLabel: 'Siempre gratis',
    freeItems: 'Actividades, lecturas en voz alta y el kit de inicio',
    pricingNote: 'Precios en USD. Precio final y disponibilidad en Amazon.',
    browseHeading: 'Encuentra la historia africana adecuada para tu peque',
    browseIntro: 'Explora la colección por edad, tema o idioma. Estos álbumes se inspiran en tradiciones narrativas africanas y ayudan a conversar sobre comunidad, valentía, bondad, sabiduría y pertenencia.',
    ageBrowse: 'Explorar por edad',
    themeBrowse: 'Temas para explorar',
    languageBrowse: 'Lectura bilingüe y multilingüe',
    themeCommunity: 'Comunidad y pertenencia',
    themeCourage: 'Valentía y resiliencia',
    themeKindness: 'Bondad y generosidad',
    themeWisdom: 'Sabiduría y perspectiva',
    themeQueries: ['comunidad', 'valentía', 'bondad', 'sabiduría'],
    multilingualBlurb: 'Consulta las banderas de cada libro para ver qué ediciones publicadas están disponibles en inglés, español y francés.',
    learnHeading: 'Continúa la historia',
    learnBlurb: 'Combina un libro con guías de lectura y actividades prácticas para familias y educadores.',
    resourcesCta: 'Explorar recursos de lectura →',
    activitiesCta: 'Explorar actividades gratuitas →',
  },
  fr: {
    seoTitle: 'Contes du patrimoine africain pour les enfants et les familles de la diaspora',
    seoDesc: 'Parcourez les {n} livres de la Collection Pawa Seyni, albums multiculturels pour enfants de 3 à 9 ans sur l\'émerveillement tranquille, la bonté et la curiosité.',
    heading: 'Contes du patrimoine africain pour les enfants et les familles de la diaspora.',
    subheading: 'Enracinées dans la tradition du griot, ces histoires reconnectent les jeunes lecteurs à la sagesse, aux valeurs et à l\'esprit communautaire transmis autour du feu du village depuis des générations.',
    searchPlaceholder: 'Rechercher un livre par titre ou thème...',
    ageAll: 'Tous',
    age3to5: '3-5 ans',
    age6to8: '6-8 ans',
    age9plus: '9+ ans',
    showingBook: 'livre',
    showingBooks: 'livres',
    showing: 'Affichage de',
    emptyMsg: 'Aucun livre trouvé. Essayez une autre recherche !',
    amazonHeading: 'Trouvez tous les livres sur Amazon',
    amazonBlurb: 'Trouvez les livres de Pawa Seyni sur Amazon. La disponibilité, les formats, les prix, la livraison et les retours sont gérés par Amazon.',
    amazonCta: '🛒 Voir tous les livres sur Amazon →',
    pricingHeading: 'Formats et prix',
    paperbackLabel: 'Livre broché',
    ebookLabel: 'Livre numérique',
    seePrice: 'Voir le prix sur Amazon',
    freeLabel: 'Toujours gratuit',
    freeItems: 'Activités, lectures à voix haute et le kit de démarrage',
    pricingNote: 'Prix en USD. Prix final et disponibilité sur Amazon.',
    browseHeading: 'Trouvez le conte africain adapté à votre enfant',
    browseIntro: 'Explorez la collection par âge, thème ou langue. Ces albums s’inspirent des traditions narratives africaines et ouvrent des conversations sur la communauté, le courage, la gentillesse, la sagesse et l’appartenance.',
    ageBrowse: 'Explorer par âge',
    themeBrowse: 'Thèmes à explorer',
    languageBrowse: 'Lecture bilingue et multilingue',
    themeCommunity: 'Communauté et appartenance',
    themeCourage: 'Courage et résilience',
    themeKindness: 'Gentillesse et générosité',
    themeWisdom: 'Sagesse et perspective',
    themeQueries: ['communauté', 'courage', 'gentillesse', 'sagesse'],
    multilingualBlurb: 'Consultez les drapeaux de chaque livre pour savoir quelles éditions publiées sont disponibles en anglais, espagnol et français.',
    learnHeading: 'Prolongez l’histoire',
    learnBlurb: 'Associez un livre à des guides de lecture et des activités pratiques pour les familles et les éducateurs.',
    resourcesCta: 'Explorer les ressources de lecture →',
    activitiesCta: 'Explorer les activités gratuites →',
  },
};

export default function Books() {
  const [search, setSearch] = useState('');
  const [ageFilter, setAgeFilter] = useState('All');
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const books = useBooks();

  // ItemList of Book schema for the full catalog, each entry links to its
  // on-site book page (localized), with Amazon kept under sameAs.
  const booksSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'The Pawa Seyni Collection',
      numberOfItems: books.length,
      itemListElement: books.map((book, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Book',
          name: book.title,
          author: { '@type': 'Person', name: 'Pawa Seyni' },
          inLanguage: book.languages.map(f => FLAG_TO_LANG[f]).filter(Boolean),
          url: `${SITE_URL}${localizePath(`/books/${book.id}`, language)}/`,
          sameAs: book.amazonUrl.split('?')[0], // clean product URL (no tracking param) for structured-data identity
          image: book.coverImage.startsWith('http') ? book.coverImage : `${SITE_URL}${book.coverImage}`,
          ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
          abstract: book.description,
        },
      })),
    }),
    [books, language],
  );

  // Internal age filter keys are language-invariant; UI labels come from t.
  const ageFilters: { key: string; label: string }[] = [
    { key: 'All', label: t.ageAll },
    { key: '3-5', label: t.age3to5 },
    { key: '6-8', label: t.age6to8 },
    { key: '9+', label: t.age9plus },
  ];

  const filtered = books.filter(book => {
    const q = search.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(q) ||
      book.description.toLowerCase().includes(q) ||
      book.theme.toLowerCase().includes(q);
    const matchesAge = matchesAgeFilter(book.ageRange, ageFilter);
    return matchesSearch && matchesAge;
  });

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc.replace('{n}', String(books.length))} path="/books" />
      <JsonLd id="books" data={booksSchema} />

      <section className="bg-gradient-to-b from-purple-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-pink-400 mx-auto mt-6 mb-8 rounded-full" />

          <div className="relative max-w-md mx-auto mb-6">
            <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {ageFilters.map(f => (
              <button
                key={f.key}
                onClick={() => setAgeFilter(f.key)}
                aria-pressed={ageFilter === f.key}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  ageFilter === f.key
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 px-4 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{t.browseHeading}</h2>
            <p className="text-gray-600 leading-relaxed">{t.browseIntro}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-purple-50 p-5">
              <h3 className="font-bold text-gray-800 mb-3">{t.ageBrowse}</h3>
              <div className="flex flex-wrap gap-2">
                {ageFilters.slice(1).map(f => <button key={f.key} onClick={() => setAgeFilter(f.key)} className="text-sm bg-white border border-purple-100 rounded-full px-3 py-2 hover:border-purple-300">{f.label}</button>)}
              </div>
            </div>
            <div className="rounded-2xl bg-orange-50 p-5">
              <h3 className="font-bold text-gray-800 mb-3">{t.themeBrowse}</h3>
              <div className="flex flex-wrap gap-2">
                {[t.themeCommunity,t.themeCourage,t.themeKindness,t.themeWisdom].map((label, i) => <button key={label} onClick={() => setSearch(t.themeQueries[i])} className="text-sm bg-white border border-orange-100 rounded-full px-3 py-2 hover:border-orange-300">{label}</button>)}
              </div>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5">
              <h3 className="font-bold text-gray-800 mb-3">{t.languageBrowse}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{t.multilingualBlurb}</p>
              <p className="mt-3 text-xl" aria-label="English, Spanish and French">🇺🇸 🇪🇸 🇫🇷</p>
            </div>
          </div>
        </div>
      </section>

      <BookRecommendations />

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 text-sm mb-6">
            {t.showing} {filtered.length} {filtered.length === 1 ? t.showingBook : t.showingBooks}
          </p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((book, i) => (
                <BookCard key={book.id} book={book} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-500 text-lg">{t.emptyMsg}</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">{t.pricingHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-md border border-gray-50 p-6">
              <div className="text-3xl mb-2" aria-hidden>📖</div>
              <p className="font-semibold text-gray-800">{t.paperbackLabel}</p>
              <p className="text-sm font-semibold text-purple-600 mt-1">{t.seePrice}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md border border-gray-50 p-6">
              <div className="text-3xl mb-2" aria-hidden>📱</div>
              <p className="font-semibold text-gray-800">{t.ebookLabel}</p>
              <p className="text-sm font-semibold text-purple-600 mt-1">{t.seePrice}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-md border border-purple-100 p-6">
              <div className="text-3xl mb-2" aria-hidden>🎁</div>
              <p className="font-semibold text-purple-700">{t.freeLabel}</p>
              <p className="text-sm text-gray-600 mt-1">{t.freeItems}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">{t.pricingNote}</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-y border-orange-100">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{t.amazonHeading}</h2>
          <p className="text-gray-500 mb-6">{t.amazonBlurb}</p>
          <a
            href={AMAZON_AUTHOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 text-lg"
          >
            {t.amazonCta}
          </a>
        </div>
      </section>

      <section className="py-12 px-4 bg-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{t.learnHeading}</h2>
          <p className="text-gray-600 mb-6">{t.learnBlurb}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={localizePath('/resources', language) + '/'} className="font-semibold text-purple-700 hover:text-purple-900">{t.resourcesCta}</a>
            <a href={localizePath('/activities', language) + '/'} className="font-semibold text-purple-700 hover:text-purple-900">{t.activitiesCta}</a>
          </div>
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
