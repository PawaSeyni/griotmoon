import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import NotFound from './NotFound';
import ReadAlong from '../components/ReadAlong';
import TapToTranslate from '../components/TapToTranslate';
import BookStatusButton from '../components/BookStatusButton';
import { books, useBook, useBooks, isComingSoon } from '../data/books';
import BookCard from '../components/BookCard';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, localizePath, useLanguage, useTranslation } from '../lib/language';
import type { Language } from '../lib/language';
import { track } from '../lib/analytics';

const SITE_URL = 'https://griotmoon.com';
const FLAG_TO_LANG: Record<string, string> = { '🇺🇸': 'en', '🇪🇸': 'es', '🇫🇷': 'fr' };

const TRANSLATIONS = {
  en: { back: '← Back to all books', theme: 'Theme', paperback: 'Paperback', ebook: 'eBook', priceNote: 'See current price on Amazon', buy: '🛒 Buy on Amazon', comingSoon: '🔜 Coming soon', comingSoonNote: 'This title is on its way. Check back soon!', coverAlt: 'book cover', ages: 'Ages', agesSuffix: '', bookLangs: 'Book editions available in', related: 'Continue exploring', relatedIntro: 'More stories with related themes and reading experiences.', guides: 'Reading guides & activities', guidesIntro: 'Extend the conversation after the story with free family reading resources and creative activities.', resourcesCta: 'Explore reading resources →', activitiesCta: 'Try free activities →', pageAudioNote: 'This page can be viewed and read aloud in English, Spanish, and French.', bilingualShow: '🌐 Show description in other languages', bilingualHide: '🌐 Hide other languages', tapShow: '🔤 Tap words to translate', tapHide: '🔤 Stop translating' },
  es: { back: '← Volver a todos los libros', theme: 'Tema', paperback: 'Tapa blanda', ebook: 'eBook', priceNote: 'Consulta el precio actual en Amazon', buy: '🛒 Comprar en Amazon', comingSoon: '🔜 Próximamente', comingSoonNote: 'Este título está en camino. ¡Vuelve pronto!', coverAlt: 'portada del libro', ages: 'Edades', agesSuffix: 'años', bookLangs: 'Ediciones del libro disponibles en', related: 'Sigue explorando', relatedIntro: 'Más historias con temas y experiencias de lectura relacionados.', guides: 'Guías de lectura y actividades', guidesIntro: 'Continúa la conversación después del cuento con recursos gratuitos de lectura familiar y actividades creativas.', resourcesCta: 'Explorar recursos de lectura →', activitiesCta: 'Probar actividades gratuitas →', pageAudioNote: 'Esta página puede verse y escucharse en inglés, español y francés.', bilingualShow: '🌐 Mostrar la descripción en otros idiomas', bilingualHide: '🌐 Ocultar otros idiomas', tapShow: '🔤 Toca para traducir', tapHide: '🔤 Dejar de traducir' },
  fr: { back: '← Retour à tous les livres', theme: 'Thème', paperback: 'Livre broché', ebook: 'Livre numérique', priceNote: 'Voir le prix actuel sur Amazon', buy: '🛒 Acheter sur Amazon', comingSoon: '🔜 Bientôt disponible', comingSoonNote: 'Ce titre arrive bientôt. Revenez vite !', coverAlt: 'couverture du livre', ages: 'Âges', agesSuffix: 'ans', bookLangs: 'Éditions du livre disponibles en', related: 'Continuez à explorer', relatedIntro: 'D’autres histoires aux thèmes et expériences de lecture proches.', guides: 'Guides de lecture et activités', guidesIntro: 'Prolongez la conversation après l’histoire avec des ressources de lecture familiale et des activités créatives gratuites.', resourcesCta: 'Explorer les ressources →', activitiesCta: 'Essayer les activités gratuites →', pageAudioNote: 'Cette page peut être consultée et écoutée en anglais, espagnol et français.', bilingualShow: '🌐 Afficher la description dans d\'autres langues', bilingualHide: '🌐 Masquer les autres langues', tapShow: '🔤 Touche pour traduire', tapHide: '🔤 Arrêter la traduction' },
};

export default function BookDetail() {
  const { slug = '' } = useParams();
  const book = useBook(slug);
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const localizedBooks = useBooks();
  const [bilingual, setBilingual] = useState(false);
  const [tapMode, setTapMode] = useState(false);

  // Book View: once per book page. A language switch changes the URL but is not a new view.
  const bookId = book?.id;
  useEffect(() => {
    if (bookId) track('Book View', { book: bookId, language });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookId]);

  const cover = book?.coverImage ?? '';
  // og:image stays the 1000px JPEG: social crawlers want a plain absolute
  // JPEG/PNG, not a srcset or WebP.
  const ogImage = `${SITE_URL}${cover}`;

  // Memoized so toggling bilingual / tap mode doesn't tear down and re-inject
  // the JSON-LD <script>. book is derived from slug+language, so those (plus
  // the derived ogImage) are the real inputs. url tracks the localized canonical.
  const bookSchema = useMemo(() => {
    if (!book) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: { '@type': 'Person', name: 'Pawa Seyni' },
      inLanguage: book.languages.map(f => FLAG_TO_LANG[f]).filter(Boolean),
      bookFormat: 'https://schema.org/Paperback',
      image: ogImage,
      url: `${SITE_URL}${localizePath(`/books/${book.id}`, language)}/`,
      ...(book.subtitle ? { alternativeHeadline: book.subtitle } : {}),
      ...(book.amazonUrl ? { sameAs: book.amazonUrl.split('?')[0] } : {}),
      abstract: book.description,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, language, ogImage]);

  // Unknown id → real (noindex) 404 rather than a blank page.
  if (!book) return <NotFound />;

  // Raw record (all-language strings) for the side-by-side bilingual view.
  const raw = books.find((b) => b.id === slug);
  const otherLangs = SUPPORTED_LANGUAGES.filter((l) => l !== language) as Language[];
  const winningCluster = book.id === 'ubuntu-we-are-together' || book.id === 'the-whistling-secret';
  const rawTheme = raw?.theme.en.toLowerCase() ?? '';
  const relatedBooks = winningCluster ? localizedBooks.filter((candidate) => {
    if (candidate.id === book.id) return false;
    const candidateRaw = books.find((b) => b.id === candidate.id);
    if (!candidateRaw) return false;
    const words = rawTheme.split(/[\s,]+/).filter((word) => word.length > 3);
    return words.some((word) => candidateRaw.theme.en.toLowerCase().includes(word));
  }).slice(0, 3) : [];

  return (
    <main className="py-8 px-4">
      <Seo title={book.subtitle ? `${book.title}: ${book.subtitle}` : book.title} description={book.description} path={`/books/${book.id}`} image={ogImage} />
      <JsonLd id="book" data={bookSchema} />

      <div className="max-w-4xl mx-auto">
        <Link to="/books" className="inline-flex items-center gap-1 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
          {t.back}
        </Link>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl overflow-hidden shadow-xl bg-gray-100 aspect-square">
            <img
              src={cover}
              srcSet={book?.coverSrcSet || undefined}
              sizes="(min-width: 768px) 448px, 90vw"
              alt={`${book.title} – ${t.coverAlt}`}
              className="w-full h-full object-cover"
              width={600}
              height={600}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                {t.ages} {book.ageRange.replace('-', '–')}{t.agesSuffix && ` ${t.agesSuffix}`}
              </span>
              <span className="text-lg" aria-hidden>{book.languages.join(' ')}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">{book.title}</h1>
            {book.subtitle && <p className="text-gray-500 italic mb-4">{book.subtitle}</p>}

            {tapMode ? (
              <TapToTranslate text={book.description} language={language} className="text-gray-600 leading-relaxed mb-4" />
            ) : (
              <ReadAlong text={book.description} book={book.id} className="text-gray-600 leading-relaxed mb-4" />
            )}

            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => setTapMode((v) => !v)}
                aria-pressed={tapMode}
                className={`inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-full transition-colors ${
                  tapMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'text-purple-600 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                {tapMode ? t.tapHide : t.tapShow}
              </button>
            </div>

            {raw && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-700">{t.bookLangs} {book.languages.join(' ')}</p>
                <p className="text-xs text-gray-500 mb-2">{t.pageAudioNote}</p>
                <button
                  type="button"
                  onClick={() => setBilingual((v) => !v)}
                  aria-expanded={bilingual}
                  aria-controls="bilingual-panel"
                  className="inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-full text-purple-600 border border-purple-200 hover:bg-purple-50 transition-colors"
                >
                  {bilingual ? t.bilingualHide : t.bilingualShow}
                </button>
                {bilingual && (
                  <div id="bilingual-panel" className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {otherLangs.map((l) => (
                      <div key={l} className="bg-purple-50/60 rounded-xl p-4">
                        <p className="text-xs font-semibold text-purple-700 mb-1">
                          {LANGUAGE_LABELS[l].flag} {LANGUAGE_LABELS[l].name}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed" lang={l}>
                          {raw.description[l]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-purple-50 rounded-xl px-4 py-2 inline-block mb-5">
              <span className="text-sm text-purple-700 font-medium">{t.theme}: {book.theme}</span>
            </div>

            <div className="mb-4">
              <BookStatusButton bookId={book.id} />
            </div>

            {isComingSoon(book) ? (
              <>
                <p className="text-sm text-gray-500 mb-3">{t.comingSoonNote}</p>
                <span className="inline-block w-full sm:w-auto text-center py-3 px-8 bg-gray-100 text-gray-500 font-bold rounded-full text-lg cursor-default">
                  {t.comingSoon}
                </span>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-3">
                  📖 {t.paperback} · 📱 {t.ebook} · {t.priceNote}
                </p>
                <a
                  href={book.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('Purchase Click', { book: book.id, placement: 'detail', language })}
                  className="inline-block w-full sm:w-auto text-center py-3 px-8 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-lg"
                >
                  {t.buy}
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {winningCluster && (
        <section className="max-w-4xl mx-auto mt-12 border-t border-gray-200 pt-10">
          {relatedBooks.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.related}</h2>
              <p className="text-gray-600 mb-6">{t.relatedIntro}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {relatedBooks.map((relatedBook) => <BookCard key={relatedBook.id} book={relatedBook} priority={false} placement="related" />)}
              </div>
            </>
          )}
          <div className="bg-purple-50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{t.guides}</h2>
            <p className="text-gray-600 mb-4">{t.guidesIntro}</p>
            <div className="flex flex-wrap gap-5">
              <Link to="/resources" className="font-semibold text-purple-700 hover:text-purple-900">{t.resourcesCta}</Link>
              <Link to="/activities" className="font-semibold text-purple-700 hover:text-purple-900">{t.activitiesCta}</Link>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
