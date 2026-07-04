import { Link } from './LocalizedLink';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    tagline: 'Stories from the fire — African heritage picture books and free activities for curious minds, ages 3–9.',
    quickLinks: 'Quick Links',
    home: 'Home',
    books: 'Books',
    activities: 'Activities',
    resources: 'Parent Resources',
    about: 'About Pawa Seyni',
    contact: 'Contact',
    faq: 'FAQ',
    connect: 'Connect with Pawa Seyni',
    connectBlurb: 'Join our community for weekly tips, new stories, and exclusive activities!',
    rights: '© {year} Pawa Press Inc. · Griot Moon. All rights reserved.',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    amazonAuthor: 'Amazon author page',
  },
  es: {
    tagline: 'Historias del fuego — libros de herencia africana y actividades gratis para mentes curiosas de 3 a 9 años.',
    quickLinks: 'Enlaces rápidos',
    home: 'Inicio',
    books: 'Libros',
    activities: 'Actividades',
    resources: 'Recursos para padres',
    about: 'Sobre Pawa Seyni',
    contact: 'Contacto',
    faq: 'Preguntas frecuentes',
    connect: 'Conecta con Pawa Seyni',
    connectBlurb: '¡Únete a nuestra comunidad para consejos semanales, historias nuevas y actividades exclusivas!',
    rights: '© {year} Pawa Press Inc. · Griot Moon. Todos los derechos reservados.',
    privacy: 'Política de privacidad',
    terms: 'Términos de uso',
    amazonAuthor: 'Página de autora en Amazon',
  },
  fr: {
    tagline: "Des histoires du feu — albums d'héritage africain et activités gratuites pour les esprits curieux de 3 à 9 ans.",
    quickLinks: 'Liens rapides',
    home: 'Accueil',
    books: 'Livres',
    activities: 'Activités',
    resources: 'Ressources pour parents',
    about: 'À propos de Pawa Seyni',
    contact: 'Contact',
    faq: 'FAQ',
    connect: 'Connectez-vous avec Pawa Seyni',
    connectBlurb: 'Rejoignez notre communauté pour des conseils hebdomadaires, de nouvelles histoires et des activités exclusives !',
    rights: '© {year} Pawa Press Inc. · Griot Moon. Tous droits réservés.',
    privacy: 'Politique de confidentialité',
    terms: 'Conditions d\'utilisation',
    amazonAuthor: 'Page autrice sur Amazon',
  },
};

export default function Footer() {
  const t = useTranslation(TRANSLATIONS);

  const links = [
    { to: '/', label: t.home },
    { to: '/books', label: t.books },
    { to: '/activities', label: t.activities },
    { to: '/resources', label: t.resources },
    { to: '/about', label: t.about },
    { to: '/contact', label: t.contact },
    { to: '/faq', label: t.faq },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌙</span>
              <span className="text-white font-bold text-lg">Griot Moon</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{t.tagline}</p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-white font-semibold mb-4">{t.quickLinks}</p>
            <ul className="space-y-2 text-sm">
              {links.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-purple-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-white font-semibold mb-4">{t.connect}</p>
            <p className="text-sm text-gray-400 mb-4">{t.connectBlurb}</p>
            {/* Social icons removed until the Griot Moon accounts exist — re-add
                each as it goes live (see git history for the icon-row markup). */}
            <div className="mt-4">
              <a
                href="mailto:contact@griotmoon.com"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                contact@griotmoon.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <p>{t.rights.replace('{year}', String(new Date().getFullYear()))}</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">{t.privacy}</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">{t.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
