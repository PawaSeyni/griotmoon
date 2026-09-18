import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { Link } from '../components/LocalizedLink';
import NotFound from './NotFound';
import { useLanguage } from '../lib/language';
import {
  RESOURCE_TRANSLATIONS,
  ArticleMakingReadingMagical,
  ArticleAgeAppropriate,
  ArticleFollowUp,
  ArticleReluctantReaders,
  ArticlePerfectReadingEnvironment,
  ArticleBilingualReading,
} from './Resources';

const SITE = 'https://griotmoon.com';
const SLUGS = ['make-reading-time-magical','reading-milestones-by-age','activities-after-reading','reluctant-readers','reading-environment','bilingual-reading-benefits'] as const;
const ARTICLE_KEYS = ['article1','article3','article4','article5','article2','article6'] as const;
const COMPONENTS = [ArticleMakingReadingMagical,ArticleAgeAppropriate,ArticleFollowUp,ArticleReluctantReaders,ArticlePerfectReadingEnvironment,ArticleBilingualReading] as const;

export default function ResourceArticle() {
  const { slug = '' } = useParams();
  const { language } = useLanguage();
  const index = SLUGS.indexOf(slug as typeof SLUGS[number]);
  if (index < 0) return <NotFound />;

  const copy = RESOURCE_TRANSLATIONS[language];
  const resource = copy.resources[index];
  const article = copy[ARTICLE_KEYS[index]];
  const Article = COMPONENTS[index];
  const path = `/resources/${slug}`;
  const canonical = `${SITE}${language === 'en' ? '' : '/' + language}${path}/`;
  const schema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: resource.title,
    description: resource.desc,
    author: { '@type': 'Person', name: 'Pawa Seyni' },
    publisher: { '@type': 'Organization', name: 'Griot Moon', url: SITE },
    mainEntityOfPage: canonical,
    inLanguage: language,
  }), [resource.title, resource.desc, canonical, language]);
  const breadcrumbSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: language === 'fr' ? 'Accueil' : language === 'es' ? 'Inicio' : 'Home', item: `${SITE}${language === 'en' ? '/' : `/${language}/`}` },
      { '@type': 'ListItem', position: 2, name: language === 'fr' ? 'Ressources' : language === 'es' ? 'Recursos' : 'Resources', item: `${SITE}${language === 'en' ? '' : '/' + language}/resources/` },
      { '@type': 'ListItem', position: 3, name: resource.title, item: canonical },
    ],
  }), [resource.title, canonical, language]);

  return (
    <main>
      <Seo title={resource.title} description={resource.desc} path={path} />
      <JsonLd id="resource-article" data={schema} />
      <JsonLd id="resource-breadcrumbs" data={breadcrumbSchema} />
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <Link to="/resources" className="text-sm font-semibold text-purple-600 hover:text-purple-800">
          ← {language === 'fr' ? 'Toutes les ressources' : language === 'es' ? 'Todos los recursos' : 'All resources'}
        </Link>
      </div>
      <Article t={article as never} />
      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="border-t pt-6">
          <Link to="/books" className="font-semibold text-purple-700 hover:text-purple-900">
            {language === 'fr' ? 'Découvrir les livres Griot Moon →' : language === 'es' ? 'Descubre los libros de Griot Moon →' : 'Explore Griot Moon books →'}
          </Link>
        </div>
      </div>
    </main>
  );
}
