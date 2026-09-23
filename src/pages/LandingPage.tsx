import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import NotFound from './NotFound';
import EmailSignup, { isKnownMagnet, magnetTitle } from '../components/EmailSignup';
import { useLanguage, useTranslation } from '../lib/language';
import { track } from '../lib/analytics';

const TRANSLATIONS = {
  en: { imprint: 'Griot Moon · Pawa Press', explore: 'Explore griotmoon.com', description: 'Free printable activities from Griot Moon, African heritage picture books in English, Spanish and French.' },
  es: { imprint: 'Griot Moon · Pawa Press', explore: 'Explora griotmoon.com', description: 'Actividades imprimibles gratis de Griot Moon, libros ilustrados de herencia africana en inglés, español y francés.' },
  fr: { imprint: 'Griot Moon · Pawa Press', explore: 'Découvrez griotmoon.com', description: 'Activités imprimables gratuites de Griot Moon, albums du patrimoine africain en anglais, espagnol et français.' },
};

/**
 * One lead magnet per page, at /free/<magnet> (and /es/free/…, /fr/free/…), ported from
 * Story Time with Eva (parity plan P2-3). Built for pins and ads: the whole page is the
 * offer, with no navbar or catalog competing with it (App.tsx drops the site chrome on
 * /free/ paths). The form, delivery and success screen are the same EmailSignup the rest
 * of the site uses, driven by the route instead of `?lm=`. noindex: these are campaign
 * destinations, not search results, and they are kept out of the sitemap.
 */
export default function LandingPage() {
  const { magnet } = useParams();
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const known = isKnownMagnet(magnet);

  // Top of the funnel: one Landing View per magnet shown. Keyed on the magnet, not on
  // mount, because the router reuses this component when only :magnet changes; a
  // language switch is not a new view.
  useEffect(() => {
    if (known) track('Landing View', { language, lead_magnet: String(magnet), landing_page: `/free/${magnet}` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [magnet]);

  // An edited or mistyped pin URL gets a real 404, never a default offer.
  if (!known) return <NotFound />;

  const title = magnetTitle(magnet as string, language);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Seo title={title} description={t.description} path={`/free/${magnet}`} noindex />

      {/* Brand-only header: a trust signal and a way back to the site, no navigation. */}
      <header className="py-4 px-4 flex justify-center border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-purple-700 hover:text-purple-900 transition-colors">
          <span className="text-2xl" aria-hidden>🌙</span>
          <span>Griot Moon</span>
        </Link>
      </header>

      <main className="flex-1">
        {/* Without site chrome the form's <h2> would be the first heading; an sr-only <h1>
            keeps the outline correct for screen readers without changing the design. */}
        <h1 className="sr-only">{title}</h1>
        {/* key remounts the form (fresh magnet, new Form View) if :magnet changes client-side. */}
        <EmailSignup key={magnet} magnet={magnet} placement="landing" />
      </main>

      <footer className="py-6 px-4 text-center text-xs text-gray-600 space-y-2">
        <p>{t.imprint} · © {new Date().getFullYear()} Pawa Press Inc.</p>
        <Link to="/" className="inline-block text-purple-600 hover:text-purple-800 font-medium">
          {t.explore} →
        </Link>
      </footer>
    </div>
  );
}
