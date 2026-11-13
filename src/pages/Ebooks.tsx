import Seo from '../components/Seo';
import { Link } from '../components/LocalizedLink';
import { useBooks } from '../data/books';
import {
  EBOOK_SETS,
  LIBRARY_BOOK_COUNT,
  LIBRARY_PRICE,
  LIBRARY_URL,
  SET_PRICE,
  setImage,
} from '../data/ebookSets';
import { useLanguage, useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

// /ebooks: the Payhip eBook sets and the yearly Griot Moon Library (added 2026-11-13).
// Payhip's own checkout pages are English-only, so the Spanish and French pages say so.

const TRANSLATIONS = {
  en: {
    seoTitle: 'eBook Sets and the Griot Moon Library',
    seoDesc:
      'Pawa Seyni picture books as eBooks in English, French and Spanish: 11 themed sets of 3 for $6.99, or all 32 eBooks in the Griot Moon Library for $29.99 a year.',
    heading: 'eBook sets and the Griot Moon Library',
    subheading:
      'Every eBook includes its English, French and Spanish editions (EPUB). Instant download after checkout with Payhip.',
    checkoutNote: '',
    libraryTag: 'Best value',
    libraryName: 'Griot Moon Library',
    libraryPoints: [
      `All ${LIBRARY_BOOK_COUNT} eBooks, each in English, French and Spanish`,
      `Bought one by one, the same ${LIBRARY_BOOK_COUNT} eBooks cost $95.68`,
      'Renews each year. Cancel any time in your Payhip account; access ends when you cancel',
    ],
    libraryCta: 'Join the library',
    setsHeading: 'Themed sets of 3 eBooks',
    setsIntro: '$6.99 a set, instead of $8.97 for the three books bought one by one.',
    setCta: 'Buy the set',
    enEsNote: '{title} comes in English and Spanish.',
    singleNote: 'Prefer just one story? Every book page sells its eBook on its own for $2.99.',
    browse: 'Browse all books →',
  },
  es: {
    seoTitle: 'Paquetes de eBooks y la Biblioteca Griot Moon',
    seoDesc:
      'Los libros ilustrados de Pawa Seyni como eBooks en inglés, francés y español: 11 paquetes temáticos de 3 por 6,99 US$, o los 32 eBooks en la Biblioteca Griot Moon por 29,99 US$ al año.',
    heading: 'Paquetes de eBooks y la Biblioteca Griot Moon',
    subheading:
      'Cada eBook incluye sus ediciones en inglés, francés y español (EPUB). Descarga inmediata después de pagar con Payhip.',
    checkoutNote: 'La página de pago de Payhip está en inglés.',
    libraryTag: 'La mejor opción',
    libraryName: 'Biblioteca Griot Moon',
    libraryPoints: [
      `Los ${LIBRARY_BOOK_COUNT} eBooks, cada uno en inglés, francés y español`,
      `Comprados uno a uno, los mismos ${LIBRARY_BOOK_COUNT} eBooks cuestan 95,68 US$`,
      'Se renueva cada año. Cancela cuando quieras desde tu cuenta de Payhip; el acceso termina al cancelar',
    ],
    libraryCta: 'Unirme a la biblioteca',
    setsHeading: 'Paquetes temáticos de 3 eBooks',
    setsIntro: '6,99 US$ por paquete, en lugar de 8,97 US$ por los tres libros comprados uno a uno.',
    setCta: 'Comprar el paquete',
    enEsNote: '{title} viene en inglés y español.',
    singleNote: '¿Prefieres solo una historia? Cada página de libro vende su eBook por separado a 2,99 US$.',
    browse: 'Ver todos los libros →',
  },
  fr: {
    seoTitle: 'Coffrets de livres numériques et Bibliothèque Griot Moon',
    seoDesc:
      'Les albums de Pawa Seyni en livres numériques anglais, français et espagnol : 11 coffrets thématiques de 3 pour 6,99 $ US, ou les 32 livres dans la Bibliothèque Griot Moon pour 29,99 $ US par an.',
    heading: 'Coffrets de livres numériques et Bibliothèque Griot Moon',
    subheading:
      'Chaque livre numérique comprend ses éditions anglaise, française et espagnole (EPUB). Téléchargement immédiat après le paiement sur Payhip.',
    checkoutNote: 'La page de paiement de Payhip est en anglais.',
    libraryTag: 'Le meilleur choix',
    libraryName: 'Bibliothèque Griot Moon',
    libraryPoints: [
      `Les ${LIBRARY_BOOK_COUNT} livres numériques, chacun en anglais, français et espagnol`,
      `Achetés un par un, les mêmes ${LIBRARY_BOOK_COUNT} livres coûtent 95,68 $ US`,
      'Renouvelé chaque année. Résiliez à tout moment depuis votre compte Payhip ; l’accès prend fin à la résiliation',
    ],
    libraryCta: 'Rejoindre la bibliothèque',
    setsHeading: 'Coffrets thématiques de 3 livres numériques',
    setsIntro: '6,99 $ US le coffret, au lieu de 8,97 $ US pour les trois livres achetés un par un.',
    setCta: 'Acheter le coffret',
    enEsNote: '{title} existe en anglais et en espagnol.',
    singleNote: 'Une seule histoire vous suffit ? Chaque page de livre vend son livre numérique seul à 2,99 $ US.',
    browse: 'Voir tous les livres →',
  },
};

export default function Ebooks() {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  const byId = new Map(useBooks().map(b => [b.id, b]));
  const library = setImage('library');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Seo title={t.seoTitle} description={t.seoDesc} path="/ebooks" />

      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">{t.subheading}</p>
        {t.checkoutNote && <p className="mt-2 text-sm text-gray-500">{t.checkoutNote}</p>}
      </header>

      <section
        id="library"
        className="scroll-mt-24 grid md:grid-cols-[320px_1fr] gap-8 items-center bg-gradient-to-br from-indigo-900 to-purple-900 text-white rounded-3xl p-6 md:p-10 shadow-xl mb-14"
      >
        <img
          src={library.src}
          srcSet={library.srcSet}
          sizes="(min-width: 768px) 320px, 100vw"
          width={320}
          height={320}
          loading="lazy"
          alt={t.libraryName}
          className="w-full max-w-[320px] mx-auto rounded-2xl shadow-lg"
        />
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider bg-amber-400 text-indigo-950 rounded-full px-3 py-1 mb-3">
            {t.libraryTag}
          </span>
          <h2 className="text-3xl font-bold mb-1">{t.libraryName}</h2>
          <p className="text-2xl font-semibold text-amber-300 mb-4">{LIBRARY_PRICE[language]}</p>
          <ul className="space-y-2 mb-6 text-indigo-100">
            {t.libraryPoints.map(p => (
              <li key={p} className="flex gap-2">
                <span aria-hidden="true">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <a
            href={LIBRARY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('Purchase Click', { book: 'library', placement: 'ebooks-library', language })}
            className="inline-block w-full sm:w-auto text-center py-3 px-8 bg-amber-400 text-indigo-950 font-bold rounded-full shadow-md hover:bg-amber-300 hover:scale-105 transition-all duration-200 text-lg"
          >
            {t.libraryCta}
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">{t.setsHeading}</h2>
        <p className="text-gray-600 text-center mb-8">{t.setsIntro}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {EBOOK_SETS.map(set => {
            const img = setImage(set.key);
            return (
              <article
                key={set.key}
                id={set.key}
                className="scroll-mt-24 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
              >
                <img
                  src={img.src}
                  srcSet={img.srcSet}
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                  width={640}
                  height={640}
                  loading="lazy"
                  alt={set.name[language]}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{set.name[language]}</h3>
                  <p className="text-sm text-gray-600 mb-3">{set.tagline[language]}</p>
                  <ul className="text-sm text-gray-700 space-y-1 mb-3">
                    {set.bookIds.map(id => {
                      const b = byId.get(id);
                      return (
                        <li key={id}>
                          <Link to={`/books/${id}`} className="text-indigo-700 hover:underline">
                            {b?.title ?? id}
                          </Link>
                          {b && <span className="text-gray-500"> · {b.ageRange}</span>}
                        </li>
                      );
                    })}
                  </ul>
                  {set.bookIds.includes('the-chiefs-green-rule') && (
                    <p className="text-xs text-gray-500 mb-3">{t.enEsNote.replace('{title}', byId.get('the-chiefs-green-rule')?.title ?? '')}</p>
                  )}
                  <div className="mt-auto">
                    <a
                      href={set.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track('Purchase Click', { book: `set:${set.key}`, placement: 'ebooks-set', language })}
                      className="block text-center py-2.5 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold rounded-full shadow hover:shadow-lg transition-all duration-200"
                    >
                      {t.setCta}, {SET_PRICE[language]}
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <p className="text-center text-gray-600 mt-12">
        {t.singleNote}{' '}
        <Link to="/books" className="text-indigo-700 font-semibold hover:underline">
          {t.browse}
        </Link>
      </p>
    </div>
  );
}
