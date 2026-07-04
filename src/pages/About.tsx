import { Link } from '../components/LocalizedLink';
import EmailSignup from '../components/EmailSignup';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import ReadAloudButton from '../components/ReadAloudButton';
import { useMemo } from 'react';
import { useTranslation, useLanguage, localizePath } from '../lib/language';
import griotFire from '../assets/griot-fire.jpg'; // brand scene; swap for Pawa Seyni's portrait when available

const SITE_URL = 'https://griotmoon.com';

const AUTHOR_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Pawa Seyni',
  jobTitle: 'Children’s Author',
  description:
    'Anthropologist and author of African heritage picture books for children ages 3–9 — the African Heritage Tales, the Yama Stories, and the Mael Trilogy — published by Pawa Press. A portion of proceeds supports the SEN Yakaar Foundation.',
  image: `${SITE_URL}/og-image.jpg`,
};

const TRANSLATIONS = {
  en: {
    seoTitle: 'About Pawa Seyni',
    seoDesc: 'Pawa Seyni writes African heritage picture books for children ages 3–9 — folktales, courage, and Ubuntu, told in the fireside tradition of the griot.',
    heading: 'About Griot Moon',
    subheading: 'Stories from the fire, kept for every child',
    refrain: 'When the moon rises, the village gathers.',
    refrainAttr: 'the promise of every book in the Pawa Seyni Collection',
    photoNote: 'The griot’s fire — the scene behind every Griot Moon story',
    bioHeading: 'A Note from the Author',
    bio: [
      'I write picture books for children who carry many homes inside them. I am an anthropologist by training — after two decades in the academy studying West African oral traditions, I came back to the villages of my ancestors to do the work that first drew me to the field: sitting at the feet of elders, listening to the stories they pass down without anyone calling them lessons.',
      'In West Africa, keeping those stories belongs to the griot: the storyteller, praise-singer, and keeper of a village’s memory. Griot Moon is my way of carrying a small ember from that fire to your family’s bedtime — the African Heritage Tales bring beloved folktales like The Yam and the Egg, The Mighty Fist, and Ubuntu to a new generation; the Yama Stories follow a curious little girl learning her place in the world; and the Mael Trilogy tells of a young chief learning what it means to lead.',
      'The children around the fire in these books come from everywhere, because that is who these stories are for. African heritage is the root; every curious child is the welcome guest. A portion of proceeds from every book supports the SEN Yakaar Foundation, bringing books and learning resources to children across the West African diaspora.',
    ],
    motivation: 'My hope is simple: that a story you read tonight becomes a story your child tells someday.',
    viewBooks: '📚 Browse the Books',
    contactEva: '✉️ Contact Pawa Seyni',
    missionHeading: 'Our Mission & Values',
    cards: [
      { title: 'Our Story', text: 'Griot Moon is the home of the Pawa Seyni Collection at Pawa Press — picture books rooted in the West African storytelling tradition, written to be read aloud and retold. It grew from one wish: that the fireside never goes out, no matter where a family lives.' },
      { title: 'Why Stories Matter', text: 'Oral stories built vocabularies, memories, and whole histories long before books did. Reading these tales aloud does what the fireside always did — it gathers people, builds empathy, and hands children words worth keeping.' },
      { title: 'Our Mission', text: 'To put African heritage stories in every child’s hands — folktales, proverbs, and everyday courage — with free activities and read-alouds in English, Spanish, and French.' },
      { title: 'Our Values', text: 'Ubuntu — I am because we are. Inclusive representation, respect for the tradition the stories come from, and reading made joyful and accessible for families everywhere.' },
    ],
  },
  es: {
    seoTitle: 'Acerca de Pawa Seyni',
    seoDesc: 'Pawa Seyni escribe libros ilustrados de herencia africana para niños de 3 a 9 años: cuentos populares, valentía y Ubuntu, contados en la tradición del griot junto al fuego.',
    heading: 'Acerca de Griot Moon',
    subheading: 'Historias del fuego, guardadas para cada niño',
    refrain: 'Cuando sale la luna, el pueblo se reúne.',
    refrainAttr: 'la promesa de cada libro de la Colección Pawa Seyni',
    photoNote: 'El fuego del griot: la escena detrás de cada historia de Griot Moon',
    bioHeading: 'Una nota del autor',
    bio: [
      'Escribo libros ilustrados para niños que llevan muchos hogares dentro de sí. Soy antropólogo de formación: tras dos décadas en la academia estudiando las tradiciones orales de África Occidental, volví a los pueblos de mis antepasados a hacer el trabajo que me llevó a este campo — sentarme a los pies de los mayores y escuchar las historias que transmiten sin que nadie las llame lecciones.',
      'En África Occidental, guardar esas historias es tarea del griot: el narrador, cantor y guardián de la memoria del pueblo. Griot Moon es mi manera de llevar una brasa de ese fuego a la hora de dormir de tu familia: los Cuentos de Herencia Africana traen cuentos queridos como El Ñame y el Huevo, El Puño Poderoso y Ubuntu a una nueva generación; las Historias de Yama siguen a una niña curiosa descubriendo su lugar en el mundo; y la Trilogía de Mael cuenta la historia de un joven jefe aprendiendo a liderar.',
      'Los niños alrededor del fuego en estos libros vienen de todas partes, porque para ellos son estas historias. La herencia africana es la raíz; cada niño curioso es el invitado bienvenido. Una parte de las ganancias de cada libro apoya a la Fundación SEN Yakaar, que lleva libros y recursos educativos a niños de la diáspora de África Occidental.',
    ],
    motivation: 'Mi esperanza es sencilla: que una historia que leas esta noche se convierta en una historia que tu peque cuente algún día.',
    viewBooks: '📚 Ver los libros',
    contactEva: '✉️ Contactar a Pawa Seyni',
    missionHeading: 'Nuestra misión y valores',
    cards: [
      { title: 'Nuestra historia', text: 'Griot Moon es el hogar de la Colección Pawa Seyni en Pawa Press: libros ilustrados con raíces en la tradición narrativa de África Occidental, escritos para leerse en voz alta y volver a contarse. Nació de un deseo: que el fuego del cuento nunca se apague, viva donde viva la familia.' },
      { title: 'Por qué importan las historias', text: 'Las historias orales construyeron vocabularios, recuerdos e historias enteras mucho antes que los libros. Leer estos cuentos en voz alta hace lo que siempre hizo el fuego: reunir a la gente, cultivar la empatía y regalar palabras que valen la pena guardar.' },
      { title: 'Nuestra misión', text: 'Poner historias de herencia africana en las manos de cada niño — cuentos populares, proverbios y valentía cotidiana — con actividades gratuitas y lecturas en voz alta en inglés, español y francés.' },
      { title: 'Nuestros valores', text: 'Ubuntu: soy porque somos. Representación inclusiva, respeto por la tradición de la que vienen las historias y una lectura alegre y accesible para familias de todo el mundo.' },
    ],
  },
  fr: {
    seoTitle: 'À propos de Pawa Seyni',
    seoDesc: "Pawa Seyni écrit des albums d'héritage africain pour les enfants de 3 à 9 ans — contes, courage et Ubuntu, racontés dans la tradition du griot, au coin du feu.",
    heading: 'À propos de Griot Moon',
    subheading: 'Des histoires du feu, gardées pour chaque enfant',
    refrain: 'Quand la lune se lève, le village se rassemble.',
    refrainAttr: 'la promesse de chaque livre de la Collection Pawa Seyni',
    photoNote: 'Le feu du griot — la scène derrière chaque histoire de Griot Moon',
    bioHeading: "Mot de l'auteur",
    bio: [
      "J'écris des albums pour les enfants qui portent plusieurs foyers en eux. Je suis anthropologue de formation : après deux décennies à l'université à étudier les traditions orales d'Afrique de l'Ouest, je suis revenu dans les villages de mes ancêtres pour faire le travail qui m'avait d'abord attiré — m'asseoir aux pieds des anciens et écouter les histoires qu'ils transmettent sans que personne ne les appelle des leçons.",
      "En Afrique de l'Ouest, garder ces histoires est l'affaire du griot : le conteur, le chanteur et le gardien de la mémoire du village. Griot Moon est ma façon de porter une braise de ce feu jusqu'au coucher de votre famille : les Contes de l'Héritage Africain apportent à une nouvelle génération des contes aimés comme L'Igname et l'Œuf, Le Poing Puissant et Ubuntu ; les Histoires de Yama suivent une petite fille curieuse qui découvre sa place dans le monde ; et la Trilogie de Mael raconte un jeune chef qui apprend à diriger.",
      "Les enfants autour du feu dans ces livres viennent de partout, parce que c'est à eux que ces histoires sont destinées. L'héritage africain est la racine ; chaque enfant curieux est l'invité bienvenu. Une partie des recettes de chaque livre soutient la Fondation SEN Yakaar, qui apporte livres et ressources éducatives aux enfants de la diaspora ouest-africaine.",
    ],
    motivation: "Mon espoir est simple : qu'une histoire lue ce soir devienne un jour une histoire que votre enfant racontera.",
    viewBooks: '📚 Parcourir les livres',
    contactEva: '✉️ Contacter Pawa Seyni',
    missionHeading: 'Notre mission et nos valeurs',
    cards: [
      { title: 'Notre histoire', text: "Griot Moon est la maison de la Collection Pawa Seyni chez Pawa Press : des albums enracinés dans la tradition du conte d'Afrique de l'Ouest, écrits pour être lus à voix haute et racontés à nouveau. Tout est né d'un souhait : que le feu du conte ne s'éteigne jamais, où que vive la famille." },
      { title: 'Pourquoi les histoires comptent', text: "Les histoires orales ont bâti des vocabulaires, des souvenirs et des histoires entières bien avant les livres. Lire ces contes à voix haute fait ce que le feu a toujours fait : rassembler, nourrir l'empathie et offrir aux enfants des mots qui valent d'être gardés." },
      { title: 'Notre mission', text: "Mettre des histoires d'héritage africain entre les mains de chaque enfant — contes, proverbes et courage du quotidien — avec des activités gratuites et des lectures à voix haute en anglais, espagnol et français." },
      { title: 'Nos valeurs', text: "Ubuntu — je suis parce que nous sommes. Une représentation inclusive, le respect de la tradition dont viennent les histoires, et une lecture joyeuse et accessible pour toutes les familles." },
    ],
  },
};

const CARD_STYLES = [
  { emoji: '🔥', color: 'from-purple-400 to-purple-600' },
  { emoji: '🥁', color: 'from-pink-400 to-pink-600' },
  { emoji: '🌙', color: 'from-blue-400 to-blue-600' },
  { emoji: '🌍', color: 'from-green-400 to-green-600' },
];

export default function About() {
  const t = useTranslation(TRANSLATIONS);
  const { language } = useLanguage();
  // Per-language, trailing-slash URL matching the page's own canonical/hreflang.
  const authorSchema = useMemo(
    () => ({ ...AUTHOR_SCHEMA, url: `${SITE_URL}${localizePath('/about', language)}/` }),
    [language],
  );

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/about" image={`${SITE_URL}/og-image.jpg`} />
      <JsonLd id="author" data={authorSchema} />

      <section className="bg-gradient-to-b from-amber-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{t.heading}</h1>
          <p className="text-gray-500 text-lg">{t.subheading}</p>
        </div>
      </section>

      {/* Pawa Seyni Collection imprint refrain — the locked signature line */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <blockquote className="border-l-4 border-orange-400 pl-6 py-2">
            <p className="text-2xl md:text-3xl font-serif italic text-slate-700 leading-snug">
              {t.refrain}
            </p>
            <footer className="mt-3 text-sm text-gray-500 not-italic">
              — {t.refrainAttr}
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-shrink-0 w-full md:w-72">
              <img
                src={griotFire}
                alt=""
                width={800}
                height={800}
                className="w-full aspect-square rounded-2xl shadow-xl border-4 border-white ring-4 ring-purple-100 object-cover"
              />
              <p className="text-center text-xs text-gray-500 mt-3 italic">{t.photoNote}</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">{t.bioHeading}</h2>
              <div className="mb-4">
                <ReadAloudButton text={[...t.bio, t.motivation].join(' ')} compact />
              </div>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {t.bio.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <p className="font-medium text-purple-700">{t.motivation}</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div>
                  <p className="font-bold text-gray-800 text-lg">Pawa Seyni</p>
                  <p className="text-purple-600 text-sm">Pawa Press · griotmoon.com</p>
                </div>
                <span className="text-2xl">📚🌙🔥</span>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                >
                  {t.viewBooks}
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-purple-400 text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-all duration-200 text-sm">
                  {t.contactEva}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">{t.missionHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {t.cards.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-50">
                <div className={`w-12 h-12 bg-gradient-to-br ${CARD_STYLES[i].color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-md`}>
                  {CARD_STYLES[i].emoji}
                </div>
                <h3 className="font-bold text-gray-800 text-xl mb-2">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EmailSignup />
    </main>
  );
}
