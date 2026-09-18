import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import ReadAloudButton from '../components/ReadAloudButton';
import { Link } from '../components/LocalizedLink';
import NotFound from './NotFound';
import { useLanguage } from '../lib/language';

const SITE = 'https://griotmoon.com';
const SLUGS = ['make-reading-time-magical','reading-milestones-by-age','activities-after-reading','reluctant-readers','reading-environment','bilingual-reading-benefits'] as const;

const COPY = {
 en: [
  ['10 Ways to Make Reading Time Magical','Transform ordinary reading sessions into memorable adventures your child will look forward to.',['Set a warm, comfortable mood for reading.','Build a reading rhythm rather than a rigid rule.','Connect stories with hands-on play and imagination.','Let children turn pages and participate, even imperfectly.','Use playful voices and expression.','Welcome repetition: familiar stories help children notice language and patterns.','Introduce a second language naturally, a word or phrase at a time.','Pause for predictions and talk about the clues in the story.','Create a small, inviting reading nook.','Let your child see you reading for pleasure.']],
  ['Age-Appropriate Reading Milestones',"Every child arrives at reading on their own schedule. These broad milestones can help you support the journey without turning it into a race.",['Ages 2–3: focus on sounds, pictures, naming and repetition.','Ages 4–5: children often begin noticing letters, sounds and repeated patterns.','Ages 5–6: many children begin decoding simple words and trying to read independently.','Ages 6–7: reading practice increasingly becomes reading for meaning and pleasure.','Milestones are guides, not report cards. If you have concerns, talk with your child’s teacher or a qualified reading specialist.']],
  ['5 Creative Follow-Up Activities After Reading','The last page does not have to end the story. Use these simple activities to keep imagination, conversation and vocabulary moving.',['Act out a favorite scene together.','Draw what happened before the story began or after it ended.','Choose a new word from the story and look for natural ways to use it that day.','Cook, build or make something inspired by the story.','Write or dictate a letter from one character to another.']],
  ['Building a Love for Reading in Reluctant Readers','Some children love books immediately; others need a longer runway. Start with curiosity and choice rather than pressure.',['Begin with an interest the child already loves.','Allow active listening, audiobooks and drawing while listening.','Let children choose comics, joke books, nonfiction or graphic novels as well as storybooks.','Keep reading aloud even after independent reading begins.','Avoid turning reading into a punishment.']],
  ['Creating the Perfect Reading Environment','A good reading space does not need to be elaborate. Comfort, visible books and a familiar cue can do most of the work.',['Choose comfortable seating that invites children to stay.','Display some book covers face-out so children can choose visually.','Use comfortable task lighting appropriate for reading.','Keep distracting screens out of the immediate reading space when possible.']],
  ['Why Bilingual Reading Matters','Reading across languages can connect stories with family, culture and everyday conversation while giving children meaningful exposure to both languages.',['Start early if bilingual reading fits your family, but it is never necessary to make it a test.','Children may mix languages while learning to use both; bilingual development varies widely.','Keep the heritage language connected to real people, stories and routines.','Read the same favorite story in each language and talk about words that are similar or different.','If you have concerns about language development, seek guidance from a qualified professional who understands multilingual children.']]
 ],
 es: [
  ['10 formas de hacer mágico el tiempo de lectura','Transforma las sesiones de lectura cotidianas en aventuras memorables que tu peque espere con ilusión.',['Crea un ambiente cálido y cómodo.','Construye un ritmo de lectura, no una regla rígida.','Une las historias con el juego y la imaginación.','Deja que los niños pasen las páginas y participen.','Usa voces y expresión.','Acepta la repetición: las historias conocidas ayudan a notar el lenguaje y los patrones.','Introduce otro idioma con naturalidad, palabra a palabra.','Haz pausas para predecir y hablar de las pistas del cuento.','Crea un rincón de lectura sencillo y acogedor.','Deja que tu peque te vea leer por placer.']],
  ['Hitos de lectura por edades','Cada niño llega a la lectura a su propio ritmo. Estos hitos generales sirven como orientación, no como una carrera.',['De 2 a 3 años: sonidos, imágenes, nombres y repetición.','De 4 a 5 años: empiezan a notar letras, sonidos y patrones repetidos.','De 5 a 6 años: muchos empiezan a descifrar palabras sencillas.','De 6 a 7 años: la práctica se orienta cada vez más al significado y al placer.','Los hitos son guías, no calificaciones. Ante una preocupación, habla con su docente o un especialista cualificado.']],
  ['5 actividades creativas para después de leer','La última página no tiene por qué terminar la historia. Estas actividades mantienen viva la imaginación y la conversación.',['Representad juntos una escena favorita.','Dibuja qué pasó antes o después del cuento.','Elige una palabra nueva y úsala de forma natural durante el día.','Cocina, construye o crea algo inspirado en la historia.','Escribe o dicta una carta desde la perspectiva de un personaje.']],
  ['Cultivar el amor por la lectura en lectores reticentes','Algunos niños aman los libros enseguida; otros necesitan más tiempo. Empieza por la curiosidad y la elección.',['Parte de un interés que ya le entusiasme.','Permite escuchar mientras dibuja o juega y prueba audiolibros.','Deja que elija cómics, chistes, no ficción o novelas gráficas.','Sigue leyendo en voz alta aunque ya empiece a leer solo.','Evita convertir la lectura en castigo.']],
  ['Crear el ambiente perfecto para leer','Un buen espacio de lectura no tiene que ser elaborado. La comodidad, los libros visibles y una rutina familiar hacen mucho.',['Elige un asiento cómodo.','Muestra algunas portadas de frente para facilitar la elección.','Usa una iluminación cómoda y adecuada para leer.','Cuando sea posible, aleja las pantallas del espacio inmediato de lectura.']],
  ['Por qué importa leer en dos idiomas','Leer en varios idiomas puede conectar las historias con la familia, la cultura y la conversación cotidiana.',['Empieza pronto si encaja con tu familia, sin convertirlo en una prueba.','Los niños pueden mezclar idiomas; el desarrollo bilingüe varía mucho.','Conecta la lengua familiar con personas, historias y rutinas reales.','Lee un cuento favorito en cada idioma y compara palabras juntos.','Ante dudas sobre el desarrollo del lenguaje, consulta a un profesional cualificado con experiencia en niños multilingües.']]
 ],
 fr: [
  ['10 façons de rendre le temps de lecture magique','Transformez les séances de lecture ordinaires en moments que votre enfant attend avec plaisir.',['Créez une ambiance chaleureuse et confortable.','Installez un rythme de lecture plutôt qu’une règle rigide.','Reliez les histoires au jeu et à l’imagination.','Laissez les enfants tourner les pages et participer.','Jouez avec les voix et l’expression.','Accueillez la répétition : les histoires familières aident à remarquer la langue et les structures.','Introduisez une autre langue naturellement, mot après mot.','Faites une pause pour prédire et parler des indices de l’histoire.','Créez un petit coin lecture accueillant.','Laissez votre enfant vous voir lire pour le plaisir.']],
  ['Les étapes de lecture selon l’âge','Chaque enfant arrive à la lecture à son propre rythme. Ces repères généraux servent de guide, pas de course.',['De 2 à 3 ans : sons, images, mots et répétition.','De 4 à 5 ans : les enfants commencent souvent à remarquer lettres, sons et motifs répétés.','De 5 à 6 ans : beaucoup commencent à décoder des mots simples.','De 6 à 7 ans : la pratique s’oriente davantage vers le sens et le plaisir.','Ces repères ne sont pas des bulletins. En cas d’inquiétude, parlez à l’enseignant ou à un spécialiste qualifié.']],
  ['5 activités créatives après la lecture','La dernière page ne doit pas forcément mettre fin à l’histoire. Prolongez l’imagination et la conversation.',['Jouez ensemble une scène préférée.','Dessinez ce qui s’est passé avant ou après l’histoire.','Choisissez un nouveau mot et réutilisez-le naturellement dans la journée.','Cuisinez, construisez ou créez quelque chose inspiré de l’histoire.','Écrivez ou dictez une lettre du point de vue d’un personnage.']],
  ['Faire aimer la lecture aux lecteurs réticents','Certains enfants aiment les livres immédiatement; d’autres ont besoin de plus de temps. Commencez par la curiosité et le choix.',['Partez d’un intérêt que l’enfant aime déjà.','Autorisez l’écoute active, le dessin et les livres audio.','Laissez-le choisir BD, blagues, documentaires ou romans graphiques.','Continuez à lire à voix haute même quand la lecture autonome commence.','Évitez de transformer la lecture en punition.']],
  ['Créer l’environnement de lecture idéal','Un bon espace de lecture n’a pas besoin d’être sophistiqué. Confort, livres visibles et repères familiers suffisent souvent.',['Choisissez une assise confortable.','Présentez quelques couvertures de face pour faciliter le choix.','Utilisez un éclairage confortable adapté à la lecture.','Éloignez si possible les écrans de l’espace immédiat de lecture.']],
  ['Pourquoi la lecture bilingue est importante','Lire dans plusieurs langues peut relier les histoires à la famille, à la culture et aux conversations quotidiennes.',['Commencez tôt si cela convient à votre famille, sans en faire un test.','Les enfants peuvent mélanger les langues; le développement bilingue varie beaucoup.','Reliez la langue familiale à des personnes, histoires et routines réelles.','Lisez une histoire préférée dans chaque langue et comparez les mots ensemble.','En cas de préoccupation sur le langage, consultez un professionnel qualifié connaissant le développement multilingue.']]
 ]
} as const;

export default function ResourceArticle() {
 const { slug = '' } = useParams();
 const { language } = useLanguage();
 const index = SLUGS.indexOf(slug as typeof SLUGS[number]);
 if (index < 0) return <NotFound />;
 const [title, intro, sections] = COPY[language][index];
 const path = `/resources/${slug}`;
 const schema = useMemo(() => ({
   '@context':'https://schema.org','@type':'Article', headline:title, description:intro,
   author:{'@type':'Person',name:'Pawa Seyni'}, publisher:{'@type':'Organization',name:'Griot Moon'},
   mainEntityOfPage:`${SITE}${language === 'en' ? '' : '/' + language}${path}/`,
   inLanguage: language
 }), [title,intro,path,language]);
 return <main className="py-10 px-4">
  <Seo title={title} description={intro} path={path} />
  <JsonLd id="resource-article" data={schema} />
  <article className="max-w-3xl mx-auto">
   <Link to="/resources" className="text-sm font-semibold text-purple-600 hover:text-purple-800">← {language==='fr'?'Toutes les ressources':language==='es'?'Todos los recursos':'All resources'}</Link>
   <header className="mt-8 mb-8"><p className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2">{language==='fr'?'Guide pour parents':language==='es'?'Guía para familias':'Parent guide'}</p><h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">{title}</h1><p className="text-lg text-gray-600 leading-relaxed">{intro}</p><div className="mt-4"><ReadAloudButton text={intro} compact /></div></header>
   <div className="space-y-6 text-gray-700 leading-relaxed">{sections.map((s,i)=><section key={i}><h2 className="text-xl font-bold text-gray-800 mb-2">{s}</h2></section>)}</div>
   <div className="mt-12 border-t pt-6"><Link to="/books" className="font-semibold text-purple-700 hover:text-purple-900">{language==='fr'?'Découvrir les livres Griot Moon →':language==='es'?'Descubre los libros de Griot Moon →':'Explore Griot Moon books →'}</Link></div>
  </article>
 </main>;
}
