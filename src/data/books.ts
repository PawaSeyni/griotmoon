// Pawa Seyni Collection — African heritage picture books at Griot Moon.
//
// Catalog built from the production archive (Desktop/Organized/17_Completed_
// Books_Archive) and the live Amazon listings (verified 2026-07-04).
// Titles keep their English name in every language (they're the brand on the
// printed covers); subtitles, descriptions, and themes are localized.
// 'coming-soon' books have finished covers but no live Amazon listing yet —
// add the ASIN via dp('...') and drop the flag as each goes live.

import { useLanguage, type Language } from '../lib/language';
import { amazonDp } from '../lib/amazon';

import ubuntuWeAreTogether from '../assets/covers/ubuntu-we-are-together.jpg';
import theMightyFist from '../assets/covers/the-mighty-fist.jpg';
import theWhistlingSecret from '../assets/covers/the-whistling-secret.jpg';
import theYamAndTheEgg from '../assets/covers/the-yam-and-the-egg.jpg';
import theTalkingTree from '../assets/covers/the-talking-tree.jpg';
import theLaughingVillage from '../assets/covers/the-laughing-village.jpg';
import ourChild from '../assets/covers/our-child.jpg';
import theCleverPots from '../assets/covers/the-clever-pots.jpg';
import theHuntWithTwoPaths from '../assets/covers/the-hunt-with-two-paths.jpg';
import kwekuAndTheWiseForest from '../assets/covers/kweku-and-the-wise-forest.jpg';
import theSpiritThatShares from '../assets/covers/the-spirit-that-shares.jpg';
import yamaAndLuna from '../assets/covers/yama-and-luna.jpg';
import yamasBraveChoice from '../assets/covers/yamas-brave-choice.jpg';
import aLittleLightForTheDark from '../assets/covers/a-little-light-for-the-dark.jpg';
import findingMyQuiet from '../assets/covers/finding-my-quiet.jpg';
import theKindnessGarden from '../assets/covers/the-kindness-garden.jpg';
import theServantKing from '../assets/covers/the-servant-king.jpg';
import theFullPotAndTheEmptyPot from '../assets/covers/the-full-pot-and-the-empty-pot.jpg';
import theGrandmothersTrees from '../assets/covers/the-grandmothers-trees.jpg';
import theBrothersAndTheWiseLand from '../assets/covers/the-brothers-and-the-wise-land.jpg';
import theChiefsGreenRule from '../assets/covers/the-chiefs-green-rule.jpg';
import chiefMaelsFinalGift from '../assets/covers/chief-maels-final-gift.jpg';
import theChiefs3Gifts from '../assets/covers/the-chiefs-3-gifts.jpg';
import theBrokenToy from '../assets/covers/the-broken-toy.jpg';
import theHandThatGives from '../assets/covers/the-hand-that-gives.jpg';
import theThankfulFarmer from '../assets/covers/the-thankful-farmer.jpg';
import slowAndStrongWinsTheRace from '../assets/covers/slow-and-strong-wins-the-race.jpg';
import theCleverScientist from '../assets/covers/the-clever-scientist-professor-hawel.jpg';
import theGardenOfSecondChances from '../assets/covers/the-garden-of-second-chances.jpg';
import theTreesWePlantForTomorrow from '../assets/covers/the-trees-we-plant-for-tomorrow.jpg';

type LocalizedString = Record<Language, string>;

export interface Book {
  id: string;
  coverImage: string;
  ageRange: string;
  languages: string[];
  amazonUrl: string;
  featured?: boolean;
  /** Publication state. Absent/'published' = live with a Buy CTA; 'coming-soon' shows a placeholder. */
  status?: 'published' | 'coming-soon';
  title: LocalizedString;
  subtitle?: LocalizedString;
  description: LocalizedString;
  theme: LocalizedString;
}

export interface LocalizedBook {
  id: string;
  coverImage: string;
  ageRange: string;
  languages: string[];
  amazonUrl: string;
  featured?: boolean;
  status?: 'published' | 'coming-soon';
  title: string;
  subtitle?: string;
  description: string;
  theme: string;
}

const dp = amazonDp;
const TRI = ['🇺🇸', '🇪🇸', '🇫🇷'];
const EN = ['🇺🇸'];

/** A book not yet for sale — show a "coming soon" placeholder instead of a Buy CTA. */
export const isComingSoon = (b: { status?: string }): boolean => b.status === 'coming-soon';

export const books: Book[] = [
  // ============ African Heritage Tales — live on Amazon ============
  {
    id: 'ubuntu-we-are-together',
    coverImage: ubuntuWeAreTogether,
    ageRange: '3-8',
    languages: TRI,
    amazonUrl: dp('1069462837'),
    featured: true,
    title: { en: 'Ubuntu We Are Together', es: 'Ubuntu We Are Together', fr: 'Ubuntu We Are Together' },
    subtitle: {
      en: 'A Story of Ubuntu',
      es: 'Una historia de Ubuntu',
      fr: 'Une histoire d’Ubuntu',
    },
    description: {
      en: 'When a researcher offers a basket of fruit as a prize for a race, the children surprise everyone — they hold hands and walk to the finish line together. "How can I be happy if my friends are sad?" one child asks. Through their choice, a village elder shares the meaning of Ubuntu: "I am, because we are."',
      es: 'Cuando un investigador ofrece una cesta de fruta como premio de una carrera, los niños sorprenden a todos: se toman de las manos y caminan juntos hasta la meta. «¿Cómo puedo ser feliz si mis amigos están tristes?», pregunta un niño. A través de su elección, un anciano del pueblo comparte el significado de Ubuntu: «Soy, porque somos».',
      fr: 'Quand un chercheur offre un panier de fruits comme prix d’une course, les enfants surprennent tout le monde : ils se prennent la main et marchent ensemble jusqu’à l’arrivée. « Comment puis-je être heureux si mes amis sont tristes ? » demande un enfant. À travers leur choix, un ancien du village partage le sens d’Ubuntu : « Je suis, parce que nous sommes. »',
    },
    theme: {
      en: 'Ubuntu, togetherness, and empathy',
      es: 'Ubuntu, unión y empatía',
      fr: 'Ubuntu, entraide et empathie',
    },
  },
  {
    id: 'the-mighty-fist',
    coverImage: theMightyFist,
    ageRange: '4-8',
    languages: TRI,
    amazonUrl: dp('1069628816'),
    featured: true,
    title: { en: 'The Mighty Fist', es: 'The Mighty Fist', fr: 'The Mighty Fist' },
    subtitle: {
      en: 'An African Tale of Community and Shared Strength',
      es: 'Un cuento africano de comunidad y fuerza compartida',
      fr: 'Un conte africain de communauté et de force partagée',
    },
    description: {
      en: 'During a devastating drought, young Yama learns an ancient truth from her grandmother, Mama Sagar: "One finger is weak, but a fist is mighty." As the village faces crisis, Yama teaches her community that individual efforts are small — but when everyone pools resources and strength, they become unstoppable.',
      es: 'Durante una sequía devastadora, la pequeña Yama aprende de su abuela, Mama Sagar, una verdad antigua: «Un dedo es débil, pero un puño es poderoso». Cuando el pueblo enfrenta la crisis, Yama enseña a su comunidad que los esfuerzos individuales son pequeños, pero cuando todos unen recursos y fuerzas, se vuelven imparables.',
      fr: 'Pendant une sécheresse dévastatrice, la petite Yama apprend de sa grand-mère, Mama Sagar, une vérité ancienne : « Un doigt est faible, mais un poing est puissant. » Quand le village affronte la crise, Yama montre à sa communauté que les efforts individuels sont petits — mais quand chacun met en commun ressources et forces, ils deviennent inarrêtables.',
    },
    theme: {
      en: 'Community and collective strength',
      es: 'Comunidad y fuerza colectiva',
      fr: 'Communauté et force collective',
    },
  },
  {
    id: 'the-whistling-secret',
    coverImage: theWhistlingSecret,
    ageRange: '3-8',
    languages: TRI,
    amazonUrl: dp('1069462845'),
    featured: true,
    title: { en: 'The Whistling Secret', es: 'The Whistling Secret', fr: 'The Whistling Secret' },
    subtitle: {
      en: 'A West African Tale About the Wisdom Inside Old Rules',
      es: 'Un cuento de África Occidental sobre la sabiduría dentro de las viejas reglas',
      fr: 'Un conte ouest-africain sur la sagesse cachée dans les vieilles règles',
    },
    description: {
      en: "In Kofi's West African village, everyone knows the rule: no whistling after dark. Nobody questions it. But Kofi loves to whistle — he can whistle like a hornbill, whistle the market song, whistle his grandmother's lullaby back to her. And the night is full of music that pulls at his lips.",
      es: 'En el pueblo de Kofi, en África Occidental, todos conocen la regla: no se silba después del anochecer. Nadie la cuestiona. Pero a Kofi le encanta silbar — silba como un cálao, silba la canción del mercado, le devuelve silbando la nana a su abuela. Y la noche está llena de música que le tira de los labios.',
      fr: "Dans le village ouest-africain de Kofi, tout le monde connaît la règle : on ne siffle pas après la tombée de la nuit. Personne ne la questionne. Mais Kofi adore siffler — il siffle comme un calao, siffle la chanson du marché, siffle la berceuse de sa grand-mère. Et la nuit est pleine de musiques qui attirent ses lèvres.",
    },
    theme: {
      en: 'Curiosity and elder wisdom',
      es: 'Curiosidad y sabiduría de los mayores',
      fr: 'Curiosité et sagesse des anciens',
    },
  },
  {
    id: 'the-yam-and-the-egg',
    coverImage: theYamAndTheEgg,
    ageRange: '4-6',
    languages: EN,
    amazonUrl: dp('1069462802'),
    title: { en: 'The Yam and the Egg', es: 'The Yam and the Egg', fr: 'The Yam and the Egg' },
    subtitle: {
      en: 'A Wolof Wisdom Tale for Curious Children',
      es: 'Un cuento de sabiduría wolof para niños curiosos',
      fr: 'Un conte de sagesse wolof pour enfants curieux',
    },
    description: {
      en: 'When Yama asks why a yam and an egg are cooking together in the same pot, her grandmother answers with a Wolof saying that takes Yama the rest of the day to understand. A market-day tale of elder wisdom, steam rising from a clay pot, and how the same situation changes each of us differently.',
      es: 'Cuando Yama pregunta por qué un ñame y un huevo se cocinan juntos en la misma olla, su abuela responde con un dicho wolof que a Yama le toma el resto del día entender. Un cuento de día de mercado sobre la sabiduría de los mayores y cómo la misma situación nos transforma a cada uno de manera diferente.',
      fr: "Quand Yama demande pourquoi une igname et un œuf cuisent ensemble dans la même marmite, sa grand-mère répond par un dicton wolof que Yama mettra le reste de la journée à comprendre. Un conte de jour de marché sur la sagesse des anciens et la façon dont une même épreuve nous transforme chacun différemment.",
    },
    theme: {
      en: 'Elder wisdom and tradition',
      es: 'Sabiduría de los mayores y tradición',
      fr: 'Sagesse des anciens et tradition',
    },
  },
  {
    id: 'the-talking-tree',
    coverImage: theTalkingTree,
    ageRange: '3-8',
    languages: TRI,
    amazonUrl: dp('1069462810'),
    title: { en: 'The Talking Tree', es: 'The Talking Tree', fr: 'The Talking Tree' },
    subtitle: {
      en: 'A West African Tale of Peace and Listening',
      es: 'Un cuento de África Occidental sobre la paz y la escucha',
      fr: "Un conte ouest-africain de paix et d'écoute",
    },
    description: {
      en: 'Between two proud West African villages lies a shared meadow — and a growing dispute. The people of each village claim the meadow as their own, and the arguments grow louder every day. Fences go up. Friendships fade. The children can no longer play together. Then the old baobab offers another way.',
      es: 'Entre dos orgullosos pueblos de África Occidental hay una pradera compartida — y una disputa que crece. Cada pueblo reclama la pradera como suya, y las discusiones suben de tono cada día. Se levantan cercas. Las amistades se apagan. Los niños ya no pueden jugar juntos. Entonces el viejo baobab ofrece otro camino.',
      fr: "Entre deux fiers villages d'Afrique de l'Ouest s'étend une prairie partagée — et une dispute qui grandit. Chaque village revendique la prairie, et les querelles montent chaque jour. Des clôtures se dressent. Les amitiés s'éteignent. Les enfants ne peuvent plus jouer ensemble. Alors le vieux baobab propose un autre chemin.",
    },
    theme: {
      en: 'Peace and conflict resolution',
      es: 'Paz y resolución de conflictos',
      fr: 'Paix et résolution des conflits',
    },
  },
  {
    id: 'the-laughing-village',
    coverImage: theLaughingVillage,
    ageRange: '4-8',
    languages: TRI,
    amazonUrl: dp('1069628859'),
    title: { en: 'The Laughing Village', es: 'The Laughing Village', fr: 'The Laughing Village' },
    subtitle: {
      en: 'A Yama Story of Joy and Resilience',
      es: 'Una historia de Yama sobre la alegría y la resiliencia',
      fr: 'Une histoire de Yama sur la joie et la résilience',
    },
    description: {
      en: 'A village that has forgotten how to laugh, and a girl who refuses to let the silence win. A joyful Yama story about how laughter — shared at the right moment, in the right company — can knit a weary community back together.',
      es: 'Un pueblo que ha olvidado cómo reír, y una niña que se niega a dejar ganar al silencio. Una alegre historia de Yama sobre cómo la risa — compartida en el momento justo y en buena compañía — puede volver a unir a una comunidad cansada.',
      fr: "Un village qui a oublié comment rire, et une petite fille qui refuse de laisser gagner le silence. Une joyeuse histoire de Yama sur la façon dont le rire — partagé au bon moment, en bonne compagnie — peut retisser une communauté fatiguée.",
    },
    theme: {
      en: 'Joy and community resilience',
      es: 'Alegría y resiliencia comunitaria',
      fr: 'Joie et résilience communautaire',
    },
  },
  {
    id: 'our-child',
    coverImage: ourChild,
    ageRange: '3-6',
    languages: TRI,
    amazonUrl: dp('1996972014'),
    title: { en: 'Our Child', es: 'Our Child', fr: 'Our Child' },
    subtitle: {
      en: 'A Fulani Tale of Community and Belonging',
      es: 'Un cuento fulani de comunidad y pertenencia',
      fr: 'Un conte peul de communauté et d’appartenance',
    },
    description: {
      en: 'On the banks of the Senegal River, a whole village helps raise one child — because in the Fulani way of pulaaku, every child belongs to everyone. A warm introduction to community, belonging, and the values that hold a people together.',
      es: 'A orillas del río Senegal, todo un pueblo ayuda a criar a un niño — porque en la tradición fulani del pulaaku, cada niño pertenece a todos. Una cálida introducción a la comunidad, la pertenencia y los valores que mantienen unido a un pueblo.',
      fr: "Sur les rives du fleuve Sénégal, tout un village aide à élever un enfant — car dans la tradition peule du pulaaku, chaque enfant appartient à tous. Une belle introduction à la communauté, à l'appartenance et aux valeurs qui unissent un peuple.",
    },
    theme: {
      en: 'Community and belonging',
      es: 'Comunidad y pertenencia',
      fr: 'Communauté et appartenance',
    },
  },
  {
    id: 'the-clever-pots',
    coverImage: theCleverPots,
    ageRange: '4-7',
    languages: TRI,
    amazonUrl: dp('1996972073'),
    title: { en: 'The Clever Pots', es: 'The Clever Pots', fr: 'The Clever Pots' },
    subtitle: {
      en: 'A Haalpulaar Story',
      es: 'Una historia haalpulaar',
      fr: 'Une histoire haalpulaar',
    },
    description: {
      en: 'When the village needs to keep its water cool and its grain dry, a young girl watches how nature solves its own problems — and shapes the answer from river clay. A Haalpulaar story about learning from nature and the quiet genius of everyday invention.',
      es: 'Cuando el pueblo necesita mantener fresca el agua y seco el grano, una niña observa cómo la naturaleza resuelve sus propios problemas — y moldea la respuesta con arcilla del río. Una historia haalpulaar sobre aprender de la naturaleza y el genio silencioso de la invención cotidiana.',
      fr: "Quand le village doit garder son eau fraîche et son grain au sec, une petite fille observe comment la nature résout ses propres problèmes — et façonne la réponse dans l'argile du fleuve. Une histoire haalpulaar sur l'art d'apprendre de la nature et le génie discret de l'invention quotidienne.",
    },
    theme: {
      en: 'Learning from nature and invention',
      es: 'Aprender de la naturaleza e inventar',
      fr: 'Apprendre de la nature et inventer',
    },
  },
  {
    id: 'the-hunt-with-two-paths',
    coverImage: theHuntWithTwoPaths,
    ageRange: '4-8',
    languages: TRI,
    amazonUrl: dp('1996972138'),
    title: { en: 'The Hunt with Two Paths', es: 'The Hunt with Two Paths', fr: 'The Hunt with Two Paths' },
    subtitle: {
      en: 'A Story About Seeing Many Truths',
      es: 'Una historia sobre ver muchas verdades',
      fr: 'Une histoire sur les nombreuses vérités',
    },
    description: {
      en: 'Two hunters set out on the same hunt and come home with two different stories — and both are true. A wisdom tale about perspective: how the same day can look entirely different through different eyes, and why listening to both paths makes the village wiser.',
      es: 'Dos cazadores salen a la misma cacería y vuelven a casa con dos historias diferentes — y ambas son ciertas. Un cuento de sabiduría sobre la perspectiva: cómo el mismo día puede verse completamente distinto con otros ojos, y por qué escuchar ambos caminos hace más sabio al pueblo.',
      fr: "Deux chasseurs partent pour la même chasse et rentrent avec deux histoires différentes — et toutes deux sont vraies. Un conte de sagesse sur la perspective : comment la même journée peut sembler toute autre à travers d'autres yeux, et pourquoi écouter les deux chemins rend le village plus sage.",
    },
    theme: {
      en: 'Perspective and wisdom',
      es: 'Perspectiva y sabiduría',
      fr: 'Perspective et sagesse',
    },
  },
  {
    id: 'kweku-and-the-wise-forest',
    coverImage: kwekuAndTheWiseForest,
    ageRange: '7-10',
    languages: EN,
    amazonUrl: dp('1996972316'),
    title: { en: 'Kweku and the Wise Forest', es: 'Kweku and the Wise Forest', fr: 'Kweku and the Wise Forest' },
    subtitle: {
      en: 'A Tale of Listening and Learning',
      es: 'Un cuento sobre escuchar y aprender',
      fr: "Un conte sur l'écoute et l'apprentissage",
    },
    description: {
      en: 'When the older boys laugh and call him too small, Kweku decides to prove them wrong by entering the western forest on the night of the new moon — the very night his grandfather warned him never to go. The forest swallows the last light, the familiar trees turn strange, and Kweku realizes he is lost.',
      es: 'Cuando los chicos mayores se ríen y lo llaman demasiado pequeño, Kweku decide demostrarles lo contrario entrando en el bosque del oeste la noche de luna nueva — la misma noche que su abuelo le advirtió que jamás fuera. El bosque se traga la última luz, los árboles conocidos se vuelven extraños, y Kweku descubre que está perdido.',
      fr: "Quand les grands se moquent de lui et le trouvent trop petit, Kweku décide de leur prouver le contraire en entrant dans la forêt de l'ouest la nuit de la nouvelle lune — la nuit même où son grand-père lui avait interdit d'y aller. La forêt avale la dernière lumière, les arbres familiers deviennent étranges, et Kweku comprend qu'il est perdu.",
    },
    theme: {
      en: 'Listening to elders and resilience',
      es: 'Escuchar a los mayores y resiliencia',
      fr: 'Écoute des anciens et résilience',
    },
  },
  {
    id: 'the-spirit-that-shares',
    coverImage: theSpiritThatShares,
    ageRange: '3-8',
    languages: TRI,
    amazonUrl: dp('1069628832'),
    title: { en: 'The Spirit That Shares', es: 'The Spirit That Shares', fr: 'The Spirit That Shares' },
    subtitle: {
      en: 'A Tale of Generosity and Abundance',
      es: 'Un cuento de generosidad y abundancia',
      fr: "Un conte de générosité et d'abondance",
    },
    description: {
      en: "In a small African village, a kind widow with two children lives with little, sharing what little she has. When a weary traveler arrives at her door during a fierce storm, she welcomes him without hesitation, offering her small meal and warm fire. She doesn't know the mysterious visitor is a wise elder testing the hearts of the villagers.",
      es: 'En un pequeño pueblo africano, una viuda bondadosa con dos hijos vive con poco y comparte lo poco que tiene. Cuando un viajero agotado llega a su puerta en medio de una tormenta feroz, ella lo recibe sin dudar, ofreciéndole su pequeña cena y el calor de su fuego. No sabe que el misterioso visitante es un sabio anciano que pone a prueba los corazones del pueblo.',
      fr: "Dans un petit village africain, une veuve généreuse et ses deux enfants vivent de peu — et partagent ce peu. Quand un voyageur épuisé frappe à sa porte au cœur d'un violent orage, elle l'accueille sans hésiter, offrant son maigre repas et la chaleur de son feu. Elle ignore que le mystérieux visiteur est un sage venu éprouver le cœur des villageois.",
    },
    theme: {
      en: 'Generosity and abundance',
      es: 'Generosidad y abundancia',
      fr: 'Générosité et abondance',
    },
  },
  // ============ The Yama Stories & Bedtime · Wisdom — live on Amazon ============
  {
    id: 'yama-and-luna',
    coverImage: yamaAndLuna,
    ageRange: '3-6',
    languages: TRI,
    amazonUrl: dp('1996972006'),
    title: { en: 'Yama and Luna', es: 'Yama and Luna', fr: 'Yama and Luna' },
    subtitle: {
      en: 'A Starlight Safari',
      es: 'Un safari a la luz de las estrellas',
      fr: 'Un safari sous les étoiles',
    },
    description: {
      en: 'Yama loves the night sky, but from her bedroom window it feels impossibly far away. Then Luna arrives — a mysterious cat with a glowing star on her chest and a purr like a tiny thunderstorm. Together they leap into the velvet dark on a safari through the cosmos.',
      es: 'A Yama le encanta el cielo nocturno, pero desde la ventana de su cuarto se siente imposiblemente lejos. Entonces llega Luna — una gata misteriosa con una estrella brillante en el pecho y un ronroneo como una pequeña tormenta. Juntas saltan a la oscuridad de terciopelo en un safari por el cosmos.',
      fr: "Yama adore le ciel nocturne, mais depuis la fenêtre de sa chambre il semble impossiblement loin. Puis Luna arrive — une chatte mystérieuse avec une étoile lumineuse sur la poitrine et un ronronnement comme un petit orage. Ensemble, elles bondissent dans le noir de velours pour un safari à travers le cosmos.",
    },
    theme: {
      en: 'Wonder and turning fear into curiosity',
      es: 'Asombro y convertir el miedo en curiosidad',
      fr: "Émerveillement et peur transformée en curiosité",
    },
  },
  {
    id: 'yamas-brave-choice',
    coverImage: yamasBraveChoice,
    ageRange: '5-9',
    languages: TRI,
    amazonUrl: dp('1996972235'),
    title: { en: "Yama's Brave Choice", es: "Yama's Brave Choice", fr: "Yama's Brave Choice" },
    subtitle: {
      en: 'A Yama Story About Honesty',
      es: 'Una historia de Yama sobre la honestidad',
      fr: "Une histoire de Yama sur l'honnêteté",
    },
    description: {
      en: 'Telling the truth is easy when it costs nothing. But when Yama sees something unfair happen — and staying quiet would be so much simpler — she has to decide what kind of person she wants to be. A Yama story about honesty, integrity, and standing up for what is right.',
      es: 'Decir la verdad es fácil cuando no cuesta nada. Pero cuando Yama ve algo injusto — y quedarse callada sería mucho más simple — tiene que decidir qué clase de persona quiere ser. Una historia de Yama sobre la honestidad, la integridad y defender lo que es justo.',
      fr: "Dire la vérité est facile quand cela ne coûte rien. Mais quand Yama est témoin d'une injustice — et que se taire serait tellement plus simple — elle doit décider quelle personne elle veut être. Une histoire de Yama sur l'honnêteté, l'intégrité et le courage de défendre ce qui est juste.",
    },
    theme: {
      en: 'Honesty and standing up for what is right',
      es: 'Honestidad y defender lo justo',
      fr: "Honnêteté et défense du juste",
    },
  },
  {
    id: 'a-little-light-for-the-dark',
    coverImage: aLittleLightForTheDark,
    ageRange: '3-8',
    languages: EN,
    amazonUrl: dp('1996972286'),
    title: { en: 'A Little Light for the Dark', es: 'A Little Light for the Dark', fr: 'A Little Light for the Dark' },
    subtitle: {
      en: 'A Story About Courage, Curiosity, and the Night',
      es: 'Una historia sobre la valentía, la curiosidad y la noche',
      fr: 'Une histoire de courage, de curiosité et de nuit',
    },
    description: {
      en: 'Yama is scared of the dark. The shadows on her wall look like strange and frightening shapes, and the nighttime feels too big and too quiet. Then a tiny golden firefly named Flicker taps at her window — and the night begins to change.',
      es: 'Yama le tiene miedo a la oscuridad. Las sombras de su pared parecen formas extrañas y aterradoras, y la noche se siente demasiado grande y demasiado silenciosa. Entonces una pequeña luciérnaga dorada llamada Flicker golpea su ventana — y la noche empieza a cambiar.',
      fr: "Yama a peur du noir. Les ombres sur son mur ressemblent à des formes étranges et effrayantes, et la nuit semble trop grande et trop silencieuse. Puis une minuscule luciole dorée nommée Flicker tapote à sa fenêtre — et la nuit commence à changer.",
    },
    theme: {
      en: 'Courage and the wonder of night',
      es: 'Valentía y el asombro de la noche',
      fr: 'Courage et merveille de la nuit',
    },
  },
  {
    id: 'finding-my-quiet',
    coverImage: findingMyQuiet,
    ageRange: '3-8',
    languages: EN,
    amazonUrl: dp('1996972294'),
    title: { en: 'Finding My Quiet', es: 'Finding My Quiet', fr: 'Finding My Quiet' },
    subtitle: {
      en: 'A Story About Stillness in a Big, Busy World',
      es: 'Una historia sobre la calma en un mundo grande y ruidoso',
      fr: 'Une histoire de calme dans un monde grand et bruyant',
    },
    description: {
      en: "Yama loves her big, bright, busy world — the rumble of the market, the singing birds, the tinkling of Mama's wind chimes. But sometimes all the sounds crash together like thunder, and her whole body wants to say: Stop. I need a quiet place.",
      es: 'Yama ama su mundo grande, brillante y ajetreado — el rumor del mercado, el canto de los pájaros, el tintineo de las campanillas de Mamá. Pero a veces todos los sonidos chocan como un trueno, y todo su cuerpo quiere decir: Alto. Necesito un lugar tranquilo.',
      fr: "Yama aime son monde grand, lumineux et animé — le grondement du marché, le chant des oiseaux, le tintement des carillons de Maman. Mais parfois tous les sons s'entrechoquent comme le tonnerre, et tout son corps veut dire : Stop. J'ai besoin d'un endroit calme.",
    },
    theme: {
      en: 'Mindfulness and self-regulation',
      es: 'Atención plena y autorregulación',
      fr: 'Pleine conscience et apaisement',
    },
  },
  {
    id: 'the-kindness-garden',
    coverImage: theKindnessGarden,
    ageRange: '3-6',
    languages: TRI,
    amazonUrl: dp('1069628840'),
    title: { en: 'The Kindness Garden', es: 'The Kindness Garden', fr: 'The Kindness Garden' },
    subtitle: {
      en: 'A Yama Story About Kindness That Grows',
      es: 'Una historia de Yama sobre la bondad que crece',
      fr: 'Une histoire de Yama sur la gentillesse qui grandit',
    },
    description: {
      en: 'Kindness, Yama discovers, works like a garden: plant a small good deed, tend it, and watch it spread further than you ever expected. A gentle story about kindness and lending a hand — and how one small helper can change a whole neighborhood.',
      es: 'La bondad, descubre Yama, funciona como un jardín: siembra una pequeña buena acción, cuídala, y mira cómo se extiende más lejos de lo que imaginabas. Una historia tierna sobre la bondad y echar una mano — y cómo una pequeña ayudante puede cambiar todo un vecindario.',
      fr: "La gentillesse, découvre Yama, fonctionne comme un jardin : plante une petite bonne action, entretiens-la, et regarde-la s'étendre plus loin que tu ne l'imaginais. Une douce histoire de gentillesse et d'entraide — et comment une petite main peut changer tout un quartier.",
    },
    theme: {
      en: 'Kindness and community service',
      es: 'Bondad y servicio comunitario',
      fr: 'Gentillesse et service aux autres',
    },
  },
  {
    id: 'the-servant-king',
    coverImage: theServantKing,
    ageRange: '5-9',
    languages: TRI,
    amazonUrl: dp('1996972200'),
    title: { en: 'The Servant King', es: 'The Servant King', fr: 'The Servant King' },
    subtitle: {
      en: 'The Kabir Edition',
      es: 'Edición Kabir',
      fr: 'Édition Kabir',
    },
    description: {
      en: 'What makes a king truly great — his crown, or his hands? A story of a ruler who leads by serving: carrying water, kneeling in the fields, and listening before he speaks. A tale of humility and what leadership looks like when it bows.',
      es: '¿Qué hace verdaderamente grande a un rey — su corona o sus manos? La historia de un gobernante que lidera sirviendo: cargando agua, arrodillándose en los campos y escuchando antes de hablar. Un cuento sobre la humildad y cómo se ve el liderazgo cuando se inclina.',
      fr: "Qu'est-ce qui rend un roi vraiment grand — sa couronne ou ses mains ? L'histoire d'un souverain qui dirige en servant : portant l'eau, s'agenouillant dans les champs, écoutant avant de parler. Un conte d'humilité, où l'on découvre à quoi ressemble un chef qui s'incline.",
    },
    theme: {
      en: 'Service, humility, and leadership',
      es: 'Servicio, humildad y liderazgo',
      fr: 'Service, humilité et leadership',
    },
  },
  {
    id: 'the-full-pot-and-the-empty-pot',
    coverImage: theFullPotAndTheEmptyPot,
    ageRange: '5-9',
    languages: EN,
    amazonUrl: dp('1996972553'),
    title: { en: 'The Full Pot and the Empty Pot', es: 'The Full Pot and the Empty Pot', fr: 'The Full Pot and the Empty Pot' },
    subtitle: {
      en: 'A Tale of Wisdom and Quiet Strength',
      es: 'Un cuento de sabiduría y fuerza serena',
      fr: 'Un conte de sagesse et de force tranquille',
    },
    description: {
      en: "Brothers Kael and Seni have come to the village council to settle a dispute over their father's millet field. Kael is loud, proud, and impossible to stop once he starts speaking. Seni is quiet, careful, and listens before he offers his thoughts — sometimes not offering them at all.",
      es: 'Los hermanos Kael y Seni acuden al consejo del pueblo para resolver una disputa por el campo de mijo de su padre. Kael es ruidoso, orgulloso e imposible de detener cuando empieza a hablar. Seni es callado, cuidadoso, y escucha antes de dar su opinión — a veces sin darla en absoluto.',
      fr: "Les frères Kael et Seni se présentent au conseil du village pour régler un différend sur le champ de mil de leur père. Kael est bruyant, fier, impossible à arrêter quand il parle. Seni est silencieux, prudent, et écoute avant d'offrir sa pensée — parfois sans l'offrir du tout.",
    },
    theme: {
      en: 'Quiet strength and listening',
      es: 'Fuerza serena y escucha',
      fr: 'Force tranquille et écoute',
    },
  },
  {
    id: 'the-grandmothers-trees',
    coverImage: theGrandmothersTrees,
    ageRange: '4-8',
    languages: EN,
    amazonUrl: dp('1996972618'),
    title: { en: "The Grandmother's Trees", es: "The Grandmother's Trees", fr: "The Grandmother's Trees" },
    subtitle: {
      en: 'A Story About Planting for People You Will Never Meet',
      es: 'Una historia sobre plantar para personas que nunca conocerás',
      fr: 'Une histoire sur planter pour ceux qu’on ne rencontrera jamais',
    },
    description: {
      en: '"Why do we plant trees we will never sit under?" Yaw asks, holding a small sapling beside his grandmother in the field. She tells him about the great baobab in her own grandmother\'s village — planted long ago by someone who never rested in its shade.',
      es: '«¿Por qué plantamos árboles bajo los que nunca nos sentaremos?», pregunta Yaw, sosteniendo un pequeño retoño junto a su abuela en el campo. Ella le habla del gran baobab del pueblo de su propia abuela — plantado hace mucho por alguien que nunca descansó a su sombra.',
      fr: "« Pourquoi plantons-nous des arbres sous lesquels nous ne nous assiérons jamais ? » demande Yaw, un petit plant à la main, près de sa grand-mère dans le champ. Elle lui raconte le grand baobab du village de sa propre grand-mère — planté jadis par quelqu'un qui ne s'est jamais reposé à son ombre.",
    },
    theme: {
      en: 'Legacy and intergenerational giving',
      es: 'Legado y generosidad entre generaciones',
      fr: 'Héritage et générosité entre générations',
    },
  },
  {
    id: 'the-brothers-and-the-wise-land',
    coverImage: theBrothersAndTheWiseLand,
    ageRange: '6-10',
    languages: EN,
    amazonUrl: dp('1996972499'),
    title: { en: 'The Brothers and the Wise Land', es: 'The Brothers and the Wise Land', fr: 'The Brothers and the Wise Land' },
    subtitle: {
      en: 'A Tale of Books, Soil, and the Wisdom Between Them',
      es: 'Un cuento de libros, tierra y la sabiduría entre ambos',
      fr: 'Un conte de livres, de terre et de la sagesse entre les deux',
    },
    description: {
      en: 'Kwame and Kwesi are brothers farming their first independent season in Tamale, northern Ghana. Kwame trusts his farming guidebooks. Kwesi trusts the soil, the indicator plants, and what the land has always said. When their seeds struggle and the rains are uncertain, both brothers must question what they know.',
      es: 'Kwame y Kwesi son hermanos que cultivan su primera temporada por cuenta propia en Tamale, al norte de Ghana. Kwame confía en sus manuales de agricultura. Kwesi confía en el suelo, en las plantas indicadoras y en lo que la tierra siempre ha dicho. Cuando sus semillas sufren y las lluvias son inciertas, ambos hermanos deben cuestionar lo que saben.',
      fr: "Kwame et Kwesi sont deux frères qui cultivent leur première saison indépendante à Tamale, au nord du Ghana. Kwame fait confiance à ses manuels d'agriculture. Kwesi fait confiance au sol, aux plantes indicatrices et à ce que la terre a toujours dit. Quand leurs semences peinent et que les pluies se font incertaines, les deux frères doivent remettre en question ce qu'ils savent.",
    },
    theme: {
      en: 'Traditional knowledge and cooperation',
      es: 'Saberes tradicionales y cooperación',
      fr: 'Savoirs traditionnels et coopération',
    },
  },
  // ============ Coming soon — finished, awaiting their Amazon listings ============
  {
    id: 'the-chiefs-green-rule',
    coverImage: theChiefsGreenRule,
    ageRange: '3-9',
    languages: TRI,
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: { en: "The Chief's Green Rule", es: "The Chief's Green Rule", fr: "The Chief's Green Rule" },
    subtitle: {
      en: 'A Story of Trees, Water, and Wisdom',
      es: 'Una historia de árboles, agua y sabiduría',
      fr: "Une histoire d'arbres, d'eau et de sagesse",
    },
    description: {
      en: "In a village nestled in the Ethiopian highlands, Chief Mael made a special rule: for every tree we take, we must plant five new ones. Not everyone understood at first. The work was hard, the soil was dry, and the children's legs grew tired — but the land was listening.",
      es: 'En un pueblo enclavado en las tierras altas de Etiopía, el jefe Mael creó una regla especial: por cada árbol que tomamos, debemos plantar cinco nuevos. No todos lo entendieron al principio. El trabajo era duro, el suelo estaba seco y las piernas de los niños se cansaban — pero la tierra estaba escuchando.',
      fr: "Dans un village niché sur les hauts plateaux d'Éthiopie, le chef Mael a instauré une règle spéciale : pour chaque arbre que nous prenons, nous devons en planter cinq nouveaux. Tout le monde n'a pas compris au début. Le travail était dur, le sol était sec, et les jambes des enfants fatiguaient — mais la terre écoutait.",
    },
    theme: {
      en: 'Caring for the land',
      es: 'Cuidar la tierra',
      fr: 'Prendre soin de la terre',
    },
  },
  {
    id: 'chief-maels-final-gift',
    coverImage: chiefMaelsFinalGift,
    ageRange: '3-9',
    languages: TRI,
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: { en: "Chief Mael's Final Gift", es: "Chief Mael's Final Gift", fr: "Chief Mael's Final Gift" },
    subtitle: {
      en: 'A Mael Trilogy Tale of Leadership',
      es: 'Un cuento de la trilogía de Mael sobre el liderazgo',
      fr: 'Un conte de la trilogie de Mael sur le leadership',
    },
    description: {
      en: 'When devastating floods threaten the villages, the old chiefs argue over what to do. Chief Abebe wants everyone to move. Chief Berkeley points fingers. Chief Hanif calls for ceremonies. But wise Chief Mael — with that special twinkle in his eye — sees what the others cannot: it is time for a new voice.',
      es: 'Cuando inundaciones devastadoras amenazan los pueblos, los viejos jefes discuten sobre qué hacer. El jefe Abebe quiere que todos se muden. El jefe Berkeley busca culpables. El jefe Hanif pide ceremonias. Pero el sabio jefe Mael — con ese brillo especial en los ojos — ve lo que los demás no pueden: es hora de una nueva voz.',
      fr: "Quand des inondations dévastatrices menacent les villages, les vieux chefs se disputent sur la marche à suivre. Le chef Abebe veut que tout le monde parte. Le chef Berkeley cherche des coupables. Le chef Hanif réclame des cérémonies. Mais le sage chef Mael — avec cette étincelle dans les yeux — voit ce que les autres ne voient pas : il est temps d'écouter une nouvelle voix.",
    },
    theme: {
      en: 'Leadership and sharing power',
      es: 'Liderazgo y compartir el poder',
      fr: 'Leadership et partage du pouvoir',
    },
  },
  {
    id: 'the-chiefs-3-gifts',
    coverImage: theChiefs3Gifts,
    ageRange: '3-6',
    languages: TRI,
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: { en: "The Chief's 3 Gifts", es: "The Chief's 3 Gifts", fr: "The Chief's 3 Gifts" },
    subtitle: {
      en: 'A Wise Way of Teaching Leadership',
      es: 'Una manera sabia de enseñar liderazgo',
      fr: "Une sage façon d'enseigner le leadership",
    },
    description: {
      en: 'What do a stone, a piece of charcoal, and a feather reveal about leadership? When young Mael becomes the village advisor, he receives three mysterious gifts from the chief — each holding wisdom passed through generations: be strong as stone, warm as charcoal, and gentle as a feather.',
      es: '¿Qué revelan una piedra, un trozo de carbón y una pluma sobre el liderazgo? Cuando el joven Mael se convierte en consejero del pueblo, recibe del jefe tres regalos misteriosos — cada uno con una sabiduría transmitida por generaciones: sé fuerte como la piedra, cálido como el carbón y suave como la pluma.',
      fr: "Que révèlent une pierre, un morceau de charbon et une plume sur le leadership ? Quand le jeune Mael devient conseiller du village, il reçoit du chef trois cadeaux mystérieux — chacun portant une sagesse transmise de génération en génération : sois fort comme la pierre, chaleureux comme le charbon et doux comme la plume.",
    },
    theme: {
      en: 'Leadership and values',
      es: 'Liderazgo y valores',
      fr: 'Leadership et valeurs',
    },
  },
  {
    id: 'the-broken-toy',
    coverImage: theBrokenToy,
    ageRange: '3-8',
    languages: TRI,
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: { en: 'The Broken Toy', es: 'The Broken Toy', fr: 'The Broken Toy' },
    subtitle: {
      en: 'A Yama Story About Friendship, Forgiveness, and Ubuntu',
      es: 'Una historia de Yama sobre la amistad, el perdón y el Ubuntu',
      fr: "Une histoire de Yama sur l'amitié, le pardon et l'Ubuntu",
    },
    description: {
      en: 'Yama and Max are best friends. They share everything — especially the bright little wooden car they push through the courtyard from morning until dusk. Then one sunny morning, a tiny wheel cracks off, and something bigger breaks between them: they blame each other, turn their backs, and walk away.',
      es: 'Yama y Max son mejores amigos. Lo comparten todo — especialmente el pequeño coche de madera pintada que empujan por el patio de la mañana al atardecer. Entonces, una mañana soleada, una ruedita se rompe, y algo más grande se rompe entre ellos: se culpan, se dan la espalda y se alejan.',
      fr: "Yama et Max sont les meilleurs amis du monde. Ils partagent tout — surtout la petite voiture en bois peint qu'ils poussent dans la cour du matin au soir. Puis, un matin ensoleillé, une petite roue se casse, et quelque chose de plus grand se brise entre eux : ils s'accusent, se tournent le dos et s'en vont.",
    },
    theme: {
      en: 'Friendship and forgiveness',
      es: 'Amistad y perdón',
      fr: 'Amitié et pardon',
    },
  },
  {
    id: 'the-hand-that-gives',
    coverImage: theHandThatGives,
    ageRange: '3-8',
    languages: TRI,
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: { en: 'The Hand That Gives', es: 'The Hand That Gives', fr: 'The Hand That Gives' },
    subtitle: {
      en: 'A Tale of Generosity and the Circle of Giving',
      es: 'Un cuento de generosidad y el círculo del dar',
      fr: 'Un conte de générosité et du cercle du don',
    },
    description: {
      en: 'Kael is a generous hunter whose spirit is as vast as the African savanna — he shares his bounty freely with hungry families, asking nothing in return. Years later, when sudden illness leaves him too weak to plant his fields, the circle of giving comes back around.',
      es: 'Kael es un cazador generoso cuyo espíritu es tan vasto como la sabana africana: comparte su caza libremente con las familias hambrientas, sin pedir nada a cambio. Años después, cuando una enfermedad repentina lo deja demasiado débil para sembrar sus campos, el círculo del dar vuelve a él.',
      fr: "Kael est un chasseur généreux dont l'esprit est aussi vaste que la savane africaine — il partage librement son butin avec les familles affamées, sans rien demander en retour. Des années plus tard, quand une maladie soudaine le laisse trop faible pour planter ses champs, le cercle du don revient vers lui.",
    },
    theme: {
      en: 'Generosity and reciprocity',
      es: 'Generosidad y reciprocidad',
      fr: 'Générosité et réciprocité',
    },
  },
  {
    id: 'the-thankful-farmer',
    coverImage: theThankfulFarmer,
    ageRange: '4-8',
    languages: EN,
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: { en: 'The Thankful Farmer', es: 'The Thankful Farmer', fr: 'The Thankful Farmer' },
    subtitle: {
      en: 'A Tale of Gratitude and Opening Your Eyes to Blessings',
      es: 'Un cuento de gratitud y de abrir los ojos a las bendiciones',
      fr: 'Un conte de gratitude et de bénédictions révélées',
    },
    description: {
      en: "Kwame begins each morning kneeling to give thanks for his soil, rain, and sunshine. His neighbor Kofi rushes through his days complaining about the weather, the weeds, the endless work. When drought strikes both fields, Kwame's grateful heart helps him notice what others miss: a tiny green sprout hiding a spring of water below.",
      es: 'Kwame comienza cada mañana arrodillado, dando gracias por su tierra, la lluvia y el sol. Su vecino Kofi corre por sus días quejándose del clima, de las malas hierbas, del trabajo interminable. Cuando la sequía golpea ambos campos, el corazón agradecido de Kwame le ayuda a notar lo que otros no ven: un pequeño brote verde que esconde un manantial.',
      fr: "Kwame commence chaque matin à genoux, remerciant pour sa terre, la pluie et le soleil. Son voisin Kofi traverse ses journées en se plaignant du temps, des mauvaises herbes, du travail sans fin. Quand la sécheresse frappe les deux champs, le cœur reconnaissant de Kwame lui fait remarquer ce que les autres manquent : une petite pousse verte cachant une source.",
    },
    theme: {
      en: 'Gratitude and perspective',
      es: 'Gratitud y perspectiva',
      fr: 'Gratitude et regard neuf',
    },
  },
  {
    id: 'slow-and-strong-wins-the-race',
    coverImage: slowAndStrongWinsTheRace,
    ageRange: '6-10',
    languages: EN,
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: { en: 'Slow and Strong Wins the Race', es: 'Slow and Strong Wins the Race', fr: 'Slow and Strong Wins the Race' },
    subtitle: {
      en: 'A Story About the Power of the Steady Plan',
      es: 'Una historia sobre el poder del plan constante',
      fr: 'Une histoire sur la force du plan régulier',
    },
    description: {
      en: "While her classmates rush, cram, and panic before every test, Zahra does something different. Two sharpened pencils. Notebook open to yesterday's date. A little each day, always reviewed before moving on. She calls it the Steady Plan — and everyone calls her Tortoise.",
      es: 'Mientras sus compañeros corren, se atiborran y entran en pánico antes de cada examen, Zahra hace algo diferente. Dos lápices afilados. El cuaderno abierto en la fecha de ayer. Un poco cada día, siempre repasando antes de avanzar. Ella lo llama el Plan Constante — y todos la llaman Tortuga.',
      fr: "Pendant que ses camarades se précipitent, bachotent et paniquent avant chaque contrôle, Zahra fait autrement. Deux crayons taillés. Le cahier ouvert à la date d'hier. Un peu chaque jour, toujours révisé avant d'avancer. Elle appelle ça le Plan Régulier — et tout le monde l'appelle Tortue.",
    },
    theme: {
      en: 'Perseverance and steady habits',
      es: 'Perseverancia y hábitos constantes',
      fr: 'Persévérance et habitudes régulières',
    },
  },
  {
    id: 'the-clever-scientist-professor-hawel',
    coverImage: theCleverScientist,
    ageRange: '5-8',
    languages: EN,
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: { en: 'The Clever Scientist — Professor Hawel', es: 'The Clever Scientist — Professor Hawel', fr: 'The Clever Scientist — Professor Hawel' },
    subtitle: {
      en: 'Roots of Tomorrow: A Journey to the Past',
      es: 'Raíces del mañana: un viaje al pasado',
      fr: 'Racines de demain : un voyage vers le passé',
    },
    description: {
      en: 'Professor Hawel was once a young girl who saved her village with clever clay pots. Now she teaches at a great university — until a letter arrives from Dr. Yama, a scientist whose grandparents came from the same river basin. "Please come," Yama wrote. "Our people need us both."',
      es: 'La profesora Hawel fue una vez una niña que salvó su pueblo con ingeniosas ollas de barro. Ahora enseña en una gran universidad — hasta que llega una carta de la Dra. Yama, una científica cuyos abuelos venían de la misma cuenca del río. «Por favor, ven», escribió Yama. «Nuestro pueblo nos necesita a las dos».',
      fr: "La professeure Hawel fut jadis une petite fille qui sauva son village avec d'ingénieuses poteries d'argile. Aujourd'hui elle enseigne dans une grande université — jusqu'à ce qu'arrive une lettre de la Dre Yama, une scientifique dont les grands-parents venaient du même bassin fluvial. « Viens, je t'en prie », écrit Yama. « Notre peuple a besoin de nous deux. »",
    },
    theme: {
      en: 'Women in science and heritage knowledge',
      es: 'Mujeres en la ciencia y saberes ancestrales',
      fr: 'Femmes de science et savoirs ancestraux',
    },
  },
  {
    id: 'the-garden-of-second-chances',
    coverImage: theGardenOfSecondChances,
    ageRange: '5-9',
    languages: EN,
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: { en: 'The Garden of Second Chances', es: 'The Garden of Second Chances', fr: 'The Garden of Second Chances' },
    subtitle: {
      en: 'A Story About Repair, Trust, and Growing Again',
      es: 'Una historia sobre reparar, confiar y volver a crecer',
      fr: 'Une histoire de réparation, de confiance et de renouveau',
    },
    description: {
      en: "Dayo was hungry. That is why he crept into Mama Nia's garden and took what he needed. But Nana Kweku saw him — and the village council saw something punishment alone could not fix. Instead of shame and exclusion, they offer Dayo a path: work in Mama Nia's garden, and grow something back.",
      es: 'Dayo tenía hambre. Por eso se metió en el huerto de Mama Nia y tomó lo que necesitaba. Pero Nana Kweku lo vio — y el consejo del pueblo vio algo que el castigo solo no podía arreglar. En lugar de vergüenza y exclusión, le ofrecen a Dayo un camino: trabajar en el huerto de Mama Nia y hacer crecer algo de vuelta.',
      fr: "Dayo avait faim. C'est pourquoi il s'est glissé dans le jardin de Mama Nia pour prendre ce qu'il lui fallait. Mais Nana Kweku l'a vu — et le conseil du village a vu ce qu'une punition seule ne pouvait réparer. Au lieu de la honte et de l'exclusion, on offre à Dayo un chemin : travailler dans le jardin de Mama Nia, et faire repousser quelque chose.",
    },
    theme: {
      en: 'Second chances and earning trust',
      es: 'Segundas oportunidades y ganarse la confianza',
      fr: 'Secondes chances et confiance retrouvée',
    },
  },
  {
    id: 'the-trees-we-plant-for-tomorrow',
    coverImage: theTreesWePlantForTomorrow,
    ageRange: '3-8',
    languages: TRI,
    amazonUrl: dp(''),
    status: 'coming-soon',
    title: { en: 'The Trees We Plant for Tomorrow', es: 'The Trees We Plant for Tomorrow', fr: 'The Trees We Plant for Tomorrow' },
    subtitle: {
      en: 'A Fulani Tale of Patience and Strength',
      es: 'Un cuento fulani de paciencia y fortaleza',
      fr: 'Un conte peul de patience et de force',
    },
    description: {
      en: 'A sapling gives no shade today, no fruit tomorrow — so why plant it at all? A Fulani tale about patience, stewardship, and the quiet strength of tending what will outlive us, for the children who will stand where we stood.',
      es: 'Un retoño no da sombra hoy, ni fruto mañana — entonces, ¿para qué plantarlo? Un cuento fulani sobre la paciencia, el cuidado de la tierra y la fuerza serena de cultivar lo que nos sobrevivirá, para los niños que estarán donde estuvimos.',
      fr: "Un jeune arbre ne donne pas d'ombre aujourd'hui, pas de fruit demain — alors pourquoi le planter ? Un conte peul sur la patience, le soin de la terre et la force tranquille de cultiver ce qui nous survivra, pour les enfants qui se tiendront là où nous étions.",
    },
    theme: {
      en: 'Patience and stewardship',
      es: 'Paciencia y cuidado de la tierra',
      fr: 'Patience et soin de la terre',
    },
  },
];

function localize(book: Book, lang: Language): LocalizedBook {
  return {
    id: book.id,
    coverImage: book.coverImage,
    ageRange: book.ageRange,
    languages: book.languages,
    amazonUrl: book.amazonUrl,
    featured: book.featured,
    status: book.status,
    title: book.title[lang] ?? book.title.en,
    subtitle: book.subtitle ? (book.subtitle[lang] ?? book.subtitle.en) : undefined,
    description: book.description[lang] ?? book.description.en,
    theme: book.theme[lang] ?? book.theme.en,
  };
}

/** Returns all books localized for the current language. */
export function useBooks(): LocalizedBook[] {
  const { language } = useLanguage();
  return books.map((b) => localize(b, language));
}

/** Returns a single book localized for the current language, by id. */
export function useBook(id: string): LocalizedBook | undefined {
  const { language } = useLanguage();
  const found = books.find((b) => b.id === id);
  return found ? localize(found, language) : undefined;
}
