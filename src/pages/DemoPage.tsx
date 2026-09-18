import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import ActivityStatusButton from '../components/ActivityStatusButton';
import Seo from '../components/Seo';
import { useActivity } from '../data/activities';
import { useTranslation } from '../lib/language';

const TRANSLATIONS = {
  en: {
    back: '← Back to Activities',
    seoSuffix: 'Free interactive activity for ages',
    storyDiceTitle: 'Free Online Story Dice Generator for Kids',
    storyDiceDesc: 'Roll free online story dice to generate characters, settings, goals, problems, solutions, and plot twists. A creative writing prompt generator for kids ages 6–9.',
    storyDiceHeading: 'Free online story dice generator for kids',
    storyDiceIntro: 'Roll six story dice to create a character, setting, goal, problem, solution, and surprise twist. Use the result as a creative writing prompt, tell the story aloud, or roll again for a completely new adventure.',
  },
  es: {
    back: '← Volver a actividades',
    seoSuffix: 'Actividad interactiva gratuita para edades',
    storyDiceTitle: 'Generador gratuito de dados de historias para niños',
    storyDiceDesc: 'Lanza dados de historias online para generar personajes, escenarios, objetivos, problemas, soluciones y giros. Un generador gratuito de ideas para escribir.',
    storyDiceHeading: 'Generador online de dados de historias para niños',
    storyDiceIntro: 'Lanza seis dados narrativos para crear un personaje, escenario, objetivo, problema, solución y giro sorpresa. Usa el resultado como idea para escribir, contar una historia en voz alta o vuelve a lanzar.',
  },
  fr: {
    back: '← Retour aux activités',
    seoSuffix: 'Activité interactive gratuite pour les',
    storyDiceTitle: 'Générateur gratuit de dés à histoire pour enfants',
    storyDiceDesc: 'Lancez des dés à histoire en ligne pour générer personnages, décors, objectifs, problèmes, solutions et rebondissements. Un générateur gratuit d’idées d’écriture.',
    storyDiceHeading: 'Générateur de dés à histoire en ligne pour enfants',
    storyDiceIntro: 'Lancez six dés narratifs pour créer un personnage, un décor, un objectif, un problème, une solution et un rebondissement. Utilisez le résultat comme idée d’écriture, racontez l’histoire à voix haute ou relancez.',
  },
};

interface DemoPageProps {
  children: ReactNode;
}

export default function DemoPage({ children }: DemoPageProps) {
  const { pathname } = useLocation();
  // pathname like "/activities/story-builder"
  const slug = pathname.split('/').filter(Boolean).pop() ?? '';
  const activity = useActivity(slug);
  const t = useTranslation(TRANSLATIONS);
  const isStoryDice = slug === 'story-builder';

  return (
    <main className="py-8 px-4">
      {activity && (
        <Seo
          title={isStoryDice ? t.storyDiceTitle : activity.title}
          description={isStoryDice ? t.storyDiceDesc : `${activity.desc} ${t.seoSuffix} ${activity.ages}.`}
          path={`/activities/${activity.slug}`}
        />
      )}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            to="/activities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            {t.back}
          </Link>
          {activity && <ActivityStatusButton slug={activity.slug} />}
        </div>
        {activity && (
          isStoryDice ? (
            <header className="max-w-3xl mx-auto text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{t.storyDiceHeading}</h1>
              <p className="text-gray-600 leading-relaxed">{t.storyDiceIntro}</p>
            </header>
          ) : <h1 className="sr-only">{activity.title}</h1>
        )}
        {children}
      </div>
    </main>
  );
}
