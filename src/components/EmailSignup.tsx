import { useEffect, useRef, useState } from 'react';
import { useLanguage, useTranslation, type Language } from '../lib/language';
import { track } from '../lib/analytics';

// Server-side subscribe (netlify/functions/subscribe.mjs, parity plan P2-1). It calls
// MailerLite's API with the account token and returns a real result, so the form can
// tell success from failure and `Lead Created` means a subscriber MailerLite created.
// Adds to the group "griotmoon-signups", which triggers the welcome automation. The
// function's rate limit is bound to this exact path (tests/funnel/subscribe.test.mjs).
const SUBSCRIBE_ENDPOINT = '/.netlify/functions/subscribe';

// Lead-magnet registry. Pins/FB posts deep-link to the form with `?lm=<slug>`
// so the right freebie is both tagged on the subscriber AND delivered instantly
// on the success screen, closing the funnel leak where pins used to point
// straight at the ungated PDF and captured no email. Each magnet maps to its
// per-language PDF (single-file bilingual magnets repeat the same path).
/** What the offer says, per language: written from the PDF's actual contents. */
type MagnetCopy = { blurb: string; bullets: string[]; cta: string };
type Magnet = { tag: string; title: Record<Language, string>; copy: Record<Language, MagnetCopy>; pdf: Record<Language, string> };
const LEAD_MAGNETS: Record<string, Magnet> = {
  'bedtime-routine': {
    tag: 'bedtime-routine',
    title: {
      en: 'Get the Bedtime Chart',
      es: 'Descarga la rutina de dormir',
      fr: 'Téléchargez le tableau du coucher',
    },
    copy: {
      en: {
        blurb: 'A calm, predictable bedtime in eight simple steps. Print the chart, put it by the bed, and let your child tick off each step on the way to sweet dreams.',
        bullets: ['✓ One-page printable chart with 8 bedtime steps', '✓ Every step labeled in English, Spanish & French', '✓ Tick boxes your child checks off each night'],
        cta: 'Get My Free Chart 🌙',
      },
      es: {
        blurb: 'Una hora de dormir tranquila y predecible en ocho pasos sencillos. Imprime la tabla, ponla junto a la cama y deja que tu hijo marque cada paso hasta los dulces sueños.',
        bullets: ['✓ Tabla imprimible de una página con 8 pasos para dormir', '✓ Cada paso en español, inglés y francés', '✓ Casillas que tu hijo marca cada noche'],
        cta: 'Quiero mi tabla gratis 🌙',
      },
      fr: {
        blurb: 'Un coucher calme et prévisible en huit étapes simples. Imprimez le tableau, affichez-le près du lit et laissez votre enfant cocher chaque étape jusqu’aux beaux rêves.',
        bullets: ['✓ Tableau d’une page à imprimer, 8 étapes du coucher', '✓ Chaque étape en français, anglais et espagnol', '✓ Des cases que votre enfant coche chaque soir'],
        cta: 'Recevoir mon tableau gratuit 🌙',
      },
    },
    pdf: { en: '/bedtime-routine.pdf', es: '/bedtime-routine-es.pdf', fr: '/bedtime-routine-fr.pdf' },
  },
  'bilingual-starter-kit': {
    tag: 'bilingual-starter-kit',
    title: {
      en: 'Download the FREE 20-Page Trilingual Starter Kit!',
      es: '¡Descarga GRATIS el kit trilingüe de 20 páginas!',
      fr: 'Téléchargez gratuitement le kit trilingue de 20 pages !',
    },
    copy: {
      en: {
        blurb: 'Twenty trilingual pages to start your family’s reading adventure, with a mini story, first words and playful activities in English, Spanish and French. For ages 3 to 8.',
        bullets: ['✓ 20-page activity pack in English, Spanish & French', '✓ Mini story, Pawa’s Big Day, plus a first-words guide', '✓ Coloring, word search, letter tracing & a certificate', '✓ Age-appropriate book recommendations'],
        cta: 'Get My Free Kit 🎨',
      },
      es: {
        blurb: 'Veinte páginas trilingües para empezar la aventura lectora de tu familia, con un mini cuento, primeras palabras y actividades divertidas en español, inglés y francés. Para niños de 3 a 8 años.',
        bullets: ['✓ Pack de 20 páginas de actividades en español, inglés y francés', '✓ Mini cuento «El gran día de Pawa» y guía de primeras palabras', '✓ Colorear, sopa de letras, trazar letras y un certificado', '✓ Recomendaciones de libros por edad'],
        cta: 'Quiero mi kit gratis 🎨',
      },
      fr: {
        blurb: 'Vingt pages trilingues pour lancer l’aventure lecture de votre famille, avec une mini-histoire, les premiers mots et des activités ludiques en français, anglais et espagnol. Pour les 3 à 8 ans.',
        bullets: ['✓ Pack d’activités de 20 pages en français, anglais et espagnol', '✓ Mini-histoire « Le grand jour de Pawa » et guide des premiers mots', '✓ Coloriage, mots cachés, lettres à tracer et certificat', '✓ Recommandations de livres par tranche d\'âge'],
        cta: 'Recevoir mon kit gratuit 🎨',
      },
    },
    pdf: { en: '/bilingual-starter-kit.pdf', es: '/bilingual-starter-kit.pdf', fr: '/bilingual-starter-kit.pdf' },
  },
  'bilingual-flashcards': {
    tag: 'bilingual-flashcards',
    title: {
      en: 'Get Free Flashcards',
      es: 'Descarga tarjetas bilingües',
      fr: 'Téléchargez les cartes bilingues',
    },
    copy: {
      en: {
        blurb: 'Print, cut and play. Trilingual flashcards for ages 3 to 8, every word in English, Spanish and French, with easy game ideas for matching and quick review.',
        bullets: ['✓ Four themes: animals, colors, numbers & shapes', '✓ Every card says it three ways: English, Spanish & French', '✓ Print, cut and laminate, game ideas included'],
        cta: 'Get My Free Flashcards 🃏',
      },
      es: {
        blurb: 'Imprime, recorta y juega. Tarjetas trilingües para niños de 3 a 8 años: cada palabra en español, inglés y francés, con ideas de juegos para emparejar y repasar.',
        bullets: ['✓ Cuatro temas: animales, colores, números y formas', '✓ Cada tarjeta en tres idiomas: español, inglés y francés', '✓ Para imprimir, recortar y plastificar, con ideas de juegos'],
        cta: 'Quiero mis tarjetas gratis 🃏',
      },
      fr: {
        blurb: 'Imprimez, découpez, jouez. Des cartes trilingues pour les 3 à 8 ans : chaque mot en français, anglais et espagnol, avec des idées de jeux pour associer et réviser.',
        bullets: ['✓ Quatre thèmes : animaux, couleurs, nombres et formes', '✓ Chaque carte en trois langues : français, anglais et espagnol', '✓ À imprimer, découper et plastifier, idées de jeux incluses'],
        cta: 'Recevoir mes cartes gratuites 🃏',
      },
    },
    pdf: { en: '/bilingual-flashcards.pdf', es: '/bilingual-flashcards.pdf', fr: '/bilingual-flashcards.pdf' },
  },
  'parents-guide': {
    tag: 'parents-guide',
    title: {
      en: "Get the Parent's Guide",
      es: 'Descarga la guía para padres',
      fr: 'Téléchargez le guide des parents',
    },
    copy: {
      en: {
        blurb: 'Raising a bilingual reader, without the stress. A short, practical guide to choosing a home-language approach, reading bilingual books well, and knowing what to expect at each age.',
        bullets: ['✓ Three proven home-language strategies, explained simply', '✓ How to read a bilingual book with your child', '✓ Milestones from birth to age 8, and why mixing languages is normal'],
        cta: 'Get My Free Guide 📖',
      },
      es: {
        blurb: 'Criar un lector bilingüe, sin estrés. Una guía breve y práctica para elegir cómo usar los idiomas en casa, leer bien un libro bilingüe y saber qué esperar a cada edad.',
        bullets: ['✓ Tres estrategias probadas para los idiomas en casa', '✓ Cómo leer un libro bilingüe con tu hijo', '✓ Etapas de 0 a 8 años, y por qué mezclar idiomas es normal'],
        cta: 'Quiero mi guía gratis 📖',
      },
      fr: {
        blurb: 'Élever un lecteur bilingue, sans stress. Un guide court et pratique pour choisir votre approche des langues à la maison, bien lire un livre bilingue et savoir à quoi vous attendre à chaque âge.',
        bullets: ['✓ Trois stratégies éprouvées pour les langues à la maison', '✓ Comment lire un livre bilingue avec votre enfant', '✓ Les étapes de 0 à 8 ans, et pourquoi mélanger les langues est normal'],
        cta: 'Recevoir mon guide gratuit 📖',
      },
    },
    pdf: { en: '/parents-guide.pdf', es: '/parents-guide-es.pdf', fr: '/parents-guide-fr.pdf' },
  },
  'follow-up-activities': {
    tag: 'follow-up-activities',
    title: {
      en: 'Get 5 Reading Activities',
      es: 'Descarga 5 actividades de lectura',
      fr: 'Téléchargez 5 activités de lecture',
    },
    copy: {
      en: {
        blurb: 'The story is over, the fun doesn’t have to be. Five quick, screen-free activities that help your child remember and retell any picture book, ours included.',
        bullets: ['✓ Five screen-free activities on one printable page', '✓ Works with any picture book and things you have at home', '✓ Builds memory, retelling and early writing'],
        cta: 'Get My Free Activities ✨',
      },
      es: {
        blurb: 'El cuento terminó, la diversión sigue. Cinco actividades rápidas y sin pantallas para que tu hijo recuerde y vuelva a contar cualquier libro ilustrado, incluidos los nuestros.',
        bullets: ['✓ Cinco actividades sin pantallas en una sola página', '✓ Para cualquier libro ilustrado, con lo que tienes en casa', '✓ Memoria, narración y primeros pasos en la escritura'],
        cta: 'Quiero mis actividades gratis ✨',
      },
      fr: {
        blurb: 'L’histoire est finie, le plaisir continue. Cinq activités rapides et sans écran pour aider votre enfant à retenir et raconter n’importe quel album, les nôtres compris.',
        bullets: ['✓ Cinq activités sans écran sur une seule page', '✓ Pour n’importe quel album, avec ce que vous avez à la maison', '✓ Mémoire, récit et premiers pas vers l’écriture'],
        cta: 'Recevoir mes activités gratuites ✨',
      },
    },
    pdf: { en: '/follow-up-activities.pdf', es: '/follow-up-activities-es.pdf', fr: '/follow-up-activities-fr.pdf' },
  },
};
const DEFAULT_MAGNET = 'bilingual-starter-kit';

function readParam(name: string): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(name);
}

/**
 * Campaign attribution from the URL's `utm_*` params, captured at mount so it survives
 * the `?signup=` redirect of the native fallback. The subscribe function stores them on
 * the subscriber and drops them gracefully if MailerLite rejects the fields.
 */
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
function readUtm(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of UTM_KEYS) {
    const v = readParam(k);
    if (v) out[k] = v.slice(0, 120);
  }
  return out;
}

/** The route's magnet (a /free/<slug> landing page) wins over `?lm=`; unknown falls back. */
function resolveMagnet(routeSlug?: string): Magnet {
  const slug = (routeSlug ?? readParam('lm') ?? '').toLowerCase();
  return LEAD_MAGNETS[slug] ?? LEAD_MAGNETS[DEFAULT_MAGNET];
}

/** True for a registered lead-magnet slug; /free/<unknown> must 404, never show a default offer. */
export function isKnownMagnet(slug: string | undefined): boolean {
  return Boolean(slug && Object.hasOwn(LEAD_MAGNETS, slug));
}

/** A registered magnet's headline in one language (landing-page <title> and <h1>). */
export function magnetTitle(slug: string, language: Language): string {
  return LEAD_MAGNETS[slug]?.title[language] ?? LEAD_MAGNETS[DEFAULT_MAGNET].title[language];
}

const TRANSLATIONS = {
  en: {
    firstNamePlaceholder: 'First name (optional)',
    emailPlaceholder: 'Enter your email address',
    submitting: 'Sending…',
    successHeading: 'Success, your download is ready!',
    successDetail: 'Tap below to grab your freebie. You’re on the list, so new printables and reading tips are on the way.',
    download: '📥 Download your free PDF',
    errorMessage: 'Something went wrong. Please try again or email contact@griotmoon.com.',
    privacy: '🔒 We respect your privacy. No spam, ever.',
    audienceNote: 'For parents & guardians. Please sign up on your child’s behalf.',
  },
  es: {
    firstNamePlaceholder: 'Nombre (opcional)',
    emailPlaceholder: 'Escribe tu correo electrónico',
    submitting: 'Enviando…',
    successHeading: '¡Listo! Tu descarga está disponible.',
    successDetail: 'Toca abajo para obtener tu recurso gratis. Ya estás en la lista, así que pronto recibirás más materiales y consejos de lectura.',
    download: '📥 Descarga tu PDF gratis',
    errorMessage: 'Algo salió mal. Inténtalo de nuevo o escríbenos a contact@griotmoon.com.',
    privacy: '🔒 Respetamos tu privacidad. Nunca spam.',
    audienceNote: 'Para padres y tutores. Por favor, regístrate en nombre de tu peque.',
  },
  fr: {
    firstNamePlaceholder: 'Prénom (facultatif)',
    emailPlaceholder: 'Entrez votre adresse e-mail',
    submitting: 'Envoi…',
    successHeading: 'C’est fait ! Votre téléchargement est prêt.',
    successDetail: 'Cliquez ci-dessous pour récupérer votre ressource gratuite. Vous êtes inscrit, de nouveaux imprimables et conseils de lecture arrivent bientôt.',
    download: '📥 Téléchargez votre PDF gratuit',
    errorMessage: 'Une erreur est survenue. Réessayez ou écrivez à contact@griotmoon.com.',
    privacy: '🔒 Nous respectons votre vie privée. Jamais de spam.',
    audienceNote: 'Pour les parents et tuteurs. Merci de vous inscrire au nom de votre enfant.',
  },
};

/** Which page the form sits on; the `placement` property on every newsletter event. */
export type SignupPlacement = 'home' | 'books' | 'about' | 'activities' | 'resources' | 'landing';

export default function EmailSignup({ placement, magnet: magnetSlug }: { placement: SignupPlacement; magnet?: string }) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  // A submit before React hydrates posts natively to the function, which 303-redirects
  // back with ?signup=<result>; start in that state so the visitor sees the outcome.
  const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>(() => {
    const r = (readParam('signup') || '').toLowerCase();
    return r === 'ok' ? 'submitted' : r === 'invalid' || r === 'error' ? 'error' : 'idle';
  });
  const [utm] = useState(readUtm);
  const hpRef = useRef<HTMLInputElement>(null); // honeypot; real users never fill it
  const { language, setLanguage } = useLanguage();
  const t = useTranslation(TRANSLATIONS);
  const [magnet] = useState<Magnet>(() => resolveMagnet(magnetSlug));
  const offer = magnet.copy[language];
  const successRef = useRef<HTMLParagraphElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);

  // Form View: once per mount, when half the section is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        track('Form View', { language, lead_magnet: magnet.tag, placement });
        io.disconnect();
      }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
    // Fire once per mount; a later language switch is not a new view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Form Start: the first focus on either field. Never the typed value.
  const handleFocus = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    track('Form Start', { language, lead_magnet: magnet.tag, placement });
  };

  // Move focus to the success message so screen-reader users learn the signup
  // worked and the download link is available (the form they were on is gone).
  useEffect(() => {
    if (status === 'submitted') successRef.current?.focus();
  }, [status]);

  // Honor `?lang=` from language-targeted pins (e.g. an ES pin links with
  // &lang=es) so the whole page + delivered PDF render in the pin's language,
  // regardless of the visitor's browser locale.
  useEffect(() => {
    const lang = (readParam('lang') || '').toLowerCase();
    if (lang === 'en' || lang === 'es' || lang === 'fr') setLanguage(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'submitting') return;

    setStatus('submitting');

    const trimmedName = firstName.trim();

    try {
      const res = await fetch(SUBSCRIBE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: trimmedName, language, lead_magnet: magnet.tag, company: hpRef.current?.value || '', ...utm }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus('submitted');
        // Fired only on a backend-confirmed subscriber, never on submit.
        track('Lead Created', { language, lead_magnet: magnet.tag, placement });
        setEmail('');
        setFirstName('');
      } else {
        // A real failure now reaches the visitor instead of a silent "success".
        console.error('Signup rejected:', res.status, data);
        setStatus('error');
      }
    } catch (err) {
      console.error('Signup request failed:', err);
      setStatus('error');
    }
  };

  return (
    <section ref={sectionRef} id="email-signup" className="scroll-mt-24 bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-4">🎁</div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">{magnet.title[language]}</h2>
        <p className="text-purple-100 text-lg mb-6">{offer.blurb}</p>

        <ul className="text-left inline-block text-purple-100 text-sm mb-8 space-y-2">
          {offer.bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-2">{item}</li>
          ))}
        </ul>

        {status === 'submitted' ? (
          <div className="bg-white/20 rounded-2xl p-6 text-white" role="status" aria-live="polite">
            <div className="text-4xl mb-2">🎉</div>
            <p ref={successRef} tabIndex={-1} className="font-bold text-xl outline-none">{t.successHeading}</p>
            <p className="text-purple-100 text-sm mt-1 mb-4">{t.successDetail}</p>
            <a
              href={magnet.pdf[language]}
              onClick={() => track('Magnet Download', { language, lead_magnet: magnet.tag, asset: magnet.pdf[language], placement })}
              download
              target="_blank"
              rel="noopener"
              className="inline-block px-6 py-3 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t.download}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} action={SUBSCRIBE_ENDPOINT} method="post" className="flex flex-col gap-3 max-w-md mx-auto">
            {/* Native fallback: a submit before React hydrates posts these straight to the
                function, which redirects back to this page with ?signup=<result>. Such a
                signup is not counted as Lead Created (no script ran). */}
            <input type="hidden" name="language" value={language} />
            <input type="hidden" name="lead_magnet" value={magnet.tag} />
            <input type="hidden" name="return_to" value={typeof window !== 'undefined' ? window.location.pathname : ''} />
            {/* Honeypot: off-screen and hidden from assistive tech; bots fill it and the
                function drops the submission. A text input, not type=hidden, on purpose. */}
            <input
              type="text"
              name="company"
              ref={hpRef}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] top-0 h-px w-px opacity-0"
            />
            {Object.entries(utm).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v} />
            ))}
            <input
              type="text"
              name="name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              onFocus={handleFocus}
              placeholder={t.firstNamePlaceholder}
              aria-label={t.firstNamePlaceholder}
              autoComplete="given-name"
              disabled={status === 'submitting'}
              className="w-full px-5 py-3 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-md disabled:opacity-60"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={handleFocus}
                placeholder={t.emailPlaceholder}
                aria-label={t.emailPlaceholder}
                required
                autoComplete="email"
                disabled={status === 'submitting'}
                className="flex-1 px-5 py-3 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-md disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="px-6 py-3 bg-orange-700 hover:bg-orange-800 text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? t.submitting : offer.cta}
              </button>
            </div>
          </form>
        )}

        {status === 'error' && (
          <p role="alert" className="mt-4 text-pink-100 text-sm bg-red-500/30 rounded-full inline-block px-4 py-2">
            {t.errorMessage}
          </p>
        )}

        <p className="text-purple-200 text-xs mt-4">{t.privacy}</p>
        <p className="text-purple-200 text-xs mt-1">{t.audienceNote}</p>
      </div>
    </section>
  );
}
