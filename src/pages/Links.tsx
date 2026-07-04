import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    seoTitle: 'Griot Moon: Links',
    seoDesc: 'Quick links from the Pawa Seyni Collection: the books on Amazon, free printables, and where to follow along.',
    tagline: 'African heritage picture books for curious minds · EN · ES · FR',
    sectionBooks: 'The Books',
    amazonCta: '📚 The Pawa Seyni Collection',
    amazonSub: 'Browse all the books, African heritage picture books, ages 3–9',
    sectionFreebies: 'Free Printables',
    bedtimeCta: '🌙 Bilingual Bedtime Routine Chart',
    bedtimeSub: 'Free PDF · EN · ES · FR available',
    starterCta: '🎒 Trilingual Starter Kit',
    starterSub: '20-page free PDF · EN / ES / FR',
    flashCta: '🃏 Bilingual Flashcards (Animals · Colors · Numbers)',
    flashSub: 'Free printable · EN / ES / FR',
    guideCta: '📖 Parent\'s Guide to Bilingual Reading',
    guideSub: 'Free PDF · available in EN · ES · FR',
    sectionFollow: 'Follow Along',
    pinterestCta: '📌 Pinterest: daily reading inspiration',
    instagramCta: '📷 Instagram @pawaseyni.books',
    threadsCta: '🧵 Threads @pawaseyni.books',
    tiktokCta: '🎵 TikTok @pawaseyni',
    homepageCta: '🏠 Explore griotmoon.com',
    sectionEmail: 'Stay in touch',
    emailCta: '💌 Join the newsletter',
    emailSub: 'Bedtime stories, reading tips, free printables, weekly',
    footer: 'Griot Moon · Home of the Pawa Seyni Collection · Pawa Press',
  },
  es: {
    seoTitle: 'Griot Moon, Enlaces',
    seoDesc: 'Enlaces rápidos de la Colección Pawa Seyni: los libros en Amazon, imprimibles gratis y dónde seguirnos.',
    tagline: 'Libros de herencia africana para mentes curiosas · EN · ES · FR',
    sectionBooks: 'Los libros',
    amazonCta: '📚 La Colección Pawa Seyni',
    amazonSub: 'Explora todos los libros, herencia africana, 3 a 9 años',
    sectionFreebies: 'Imprimibles gratis',
    bedtimeCta: '🌙 Rutina de la noche bilingüe (PDF)',
    bedtimeSub: 'Gratis · disponible EN · ES · FR',
    starterCta: '🎒 Kit de inicio trilingüe',
    starterSub: 'PDF de 20 páginas · EN / ES / FR',
    flashCta: '🃏 Tarjetas bilingües (Animales · Colores · Números)',
    flashSub: 'Imprimible gratis · EN / ES / FR',
    guideCta: '📖 Guía para padres, lectura bilingüe',
    guideSub: 'PDF gratis · EN · ES · FR',
    sectionFollow: 'Síguenos',
    pinterestCta: '📌 Pinterest, inspiración de lectura diaria',
    instagramCta: '📷 Instagram @pawaseyni.books',
    threadsCta: '🧵 Threads @pawaseyni.books',
    tiktokCta: '🎵 TikTok @pawaseyni',
    homepageCta: '🏠 Explora griotmoon.com',
    sectionEmail: 'Sigamos en contacto',
    emailCta: '💌 Únete al boletín',
    emailSub: 'Cuentos para dormir, consejos de lectura, imprimibles, semanal',
    footer: 'Griot Moon · Hogar de la Colección Pawa Seyni · Pawa Press',
  },
  fr: {
    seoTitle: 'Griot Moon, Liens',
    seoDesc: 'Liens rapides de la Collection Pawa Seyni : les livres sur Amazon, des imprimés gratuits et où nous suivre.',
    tagline: "Albums d'héritage africain pour les esprits curieux · EN · ES · FR",
    sectionBooks: 'Les livres',
    amazonCta: '📚 La Collection Pawa Seyni',
    amazonSub: 'Tous les livres, héritage africain, 3 à 9 ans',
    sectionFreebies: 'Imprimés gratuits',
    bedtimeCta: '🌙 Routine du coucher bilingue (PDF)',
    bedtimeSub: 'Gratuit · disponible EN · ES · FR',
    starterCta: '🎒 Kit de démarrage trilingue',
    starterSub: 'PDF de 20 pages · EN / ES / FR',
    flashCta: '🃏 Cartes bilingues (Animaux · Couleurs · Nombres)',
    flashSub: 'Imprimé gratuit · EN / ES / FR',
    guideCta: '📖 Guide parental, lecture bilingue',
    guideSub: 'PDF gratuit · EN · ES · FR',
    sectionFollow: 'Suivez-nous',
    pinterestCta: '📌 Pinterest, inspiration lecture quotidienne',
    instagramCta: '📷 Instagram @pawaseyni.books',
    threadsCta: '🧵 Threads @pawaseyni.books',
    tiktokCta: '🎵 TikTok @pawaseyni',
    homepageCta: '🏠 Découvrez griotmoon.com',
    sectionEmail: 'Restons en contact',
    emailCta: '💌 Rejoignez la newsletter',
    emailSub: 'Histoires du soir, astuces de lecture, imprimés, hebdomadaire',
    footer: 'Griot Moon · Maison de la Collection Pawa Seyni · Pawa Press',
  },
};

type LinkRow = {
  href: string;
  external?: boolean;
  title: string;
  subtitle?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
};

export default function Links() {
  const t = useTranslation(TRANSLATIONS);

  const sections: { heading: string; rows: LinkRow[] }[] = [
    {
      heading: t.sectionBooks,
      rows: [
        {
          href: '/books',
          external: false,
          title: t.amazonCta,
          subtitle: t.amazonSub,
          variant: 'primary',
        },
      ],
    },
    {
      heading: t.sectionFreebies,
      rows: [
        { href: '/bedtime-routine.pdf', external: true, title: t.bedtimeCta, subtitle: t.bedtimeSub, variant: 'secondary' },
        { href: '/bilingual-starter-kit.pdf', external: true, title: t.starterCta, subtitle: t.starterSub, variant: 'secondary' },
        { href: '/bilingual-flashcards.pdf', external: true, title: t.flashCta, subtitle: t.flashSub, variant: 'secondary' },
        { href: '/parents-guide.pdf', external: true, title: t.guideCta, subtitle: t.guideSub, variant: 'secondary' },
      ],
    },
    {
      heading: t.sectionFollow,
      rows: [
        // Social rows removed until the Griot Moon accounts exist, re-add each
        // as it goes live (see git history for the row shape).
        { href: '/', external: false, title: t.homepageCta, variant: 'tertiary' },
      ],
    },
    {
      heading: t.sectionEmail,
      rows: [
        { href: '/#email-signup', external: false, title: t.emailCta, subtitle: t.emailSub, variant: 'secondary' },
      ],
    },
  ];

  const variantClasses: Record<NonNullable<LinkRow['variant']>, string> = {
    primary:
      'bg-[#b3572e] hover:bg-[#9a4a26] text-white border-transparent shadow-md',
    secondary:
      'bg-[#fdf8ec] hover:bg-[#f2dd9e] text-[#241f1a] border-[#d9a441]/40',
    tertiary:
      'bg-white hover:bg-[#fdf8ec] text-[#2a2456] border-[#2a2456]/30',
  };

  return (
    <>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/links" />
      <div className="min-h-screen bg-gradient-to-b from-[#f2f1fa] via-[#f9eecd]/50 to-[#f2f1fa] py-10 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3" aria-hidden>🌙</div>
            <h1 className="text-2xl font-bold text-[#241f1a] mb-1">
              Griot Moon
            </h1>
            <p className="text-sm text-[#2a2456] leading-snug">
              {t.tagline}
            </p>
          </div>

          {/* Sections */}
          {sections.map((section) => (
            <section key={section.heading} className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#2a2456]/70 mb-3 px-1">
                {section.heading}
              </h2>
              <div className="space-y-3">
                {section.rows.map((row) => {
                  const classes = `block w-full text-center px-5 py-4 rounded-2xl border transition-colors duration-150 ${
                    variantClasses[row.variant ?? 'secondary']
                  }`;
                  const inner = (
                    <>
                      <div className="font-semibold leading-tight">{row.title}</div>
                      {row.subtitle && (
                        <div className="text-xs mt-1 opacity-80">{row.subtitle}</div>
                      )}
                    </>
                  );
                  return row.external ? (
                    <a
                      key={row.href + row.title}
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={classes}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link key={row.href + row.title} to={row.href} className={classes}>
                      {inner}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Footer */}
          <p className="text-center text-xs text-[#2a2456]/70 mt-8">
            {t.footer}
          </p>
        </div>
      </div>
    </>
  );
}
