import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Lock,
  Unlock,
  Sparkles,
  BookOpen,
  Sprout,
  Factory,
  FlaskConical,
  Trophy,
  HelpCircle,
  Check,
} from 'lucide-react';

export interface QuizQuestion {
  id: string;
  level: 1 | 2 | 3;
  termId: string;
  termLabel: string;
  kabyleTerm?: string;
  question: string;
  contextHint: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  adoioTip: string;
}

export interface QuizLevelMeta {
  level: 1 | 2 | 3;
  title: string;
  subtitle: string;
  badgeTitle: string;
  minScoreToPass: number;
  description: string;
}

export const QUIZ_LEVELS: QuizLevelMeta[] = [
  {
    level: 1,
    title: 'Niveau 1 · Initiation Verger & Cycle Végétatif',
    subtitle: 'Phénologie, taille en gobelet, pollinisation et indice de maturité',
    badgeTitle: 'Oléiculteur Averti',
    minScoreToPass: 3,
    description:
      'Maîtrisez les étapes clés du cycle de l’olivier en Kabylie : débourrement, nouaison croisée Chemlal/Azeradj, taille d’aération et véraison.',
  },
  {
    level: 2,
    title: 'Niveau 2 · Maîtrise du Moulin & Trituration',
    subtitle: 'Extraction à froid COI, malaxage, prévention des défauts et sous-produits',
    badgeTitle: 'Maître Moulinier COI',
    minScoreToPass: 3,
    description:
      'Validez les paramètres critiques de transformation au moulin : plafond thermique de 27 °C, durée de malaxage, élimination du chômé et valorisation des grignons.',
  },
  {
    level: 3,
    title: 'Niveau 3 · Expert Qualité COI & Biochimie ADOIO',
    subtitle: 'Acidité libre, polyphénols EFSA, indice de peroxyde, ardence et alternance',
    badgeTitle: 'Expert Oléologue ADOIO',
    minScoreToPass: 4,
    description:
      'Dominez les critères physico-chimiques et organoleptiques d’une Huile d’Olive Vierge Extra (HOVE) de concours international.',
  },
];

export const OLIVE_QUIZ_QUESTIONS: QuizQuestion[] = [
  // NIVEAU 1 : VERGER & CYCLE VÉGÉTATIF (5 questions)
  {
    id: 'q1-debourrement',
    level: 1,
    termId: 'debourrement',
    termLabel: 'Débourrement',
    kabyleTerm: 'Aki n tzemmurt',
    question:
      'À quoi correspond le stade phénologique du « débourrement » observé entre février et avril dans la vallée de la Soummam ?',
    contextHint: 'Stade de reprise printanière après le repos hivernal.',
    options: [
      'Au changement de couleur de l’olive du vert franc au violet tournant',
      'À l’ouverture des bourgeons végétatifs et floraux après la levée de dormance',
      'À la chute physiologique des fleurs non fécondées en juin',
      'À la séparation de l’eau de végétation et de l’huile dans le décanteur',
    ],
    correctIndex: 1,
    explanation:
      'Le débourrement marque le réveil printanier de l’olivier : les écailles protectrices s’écartent pour laisser émerger les jeunes pousses et futures grappes florales.',
    adoioTip:
      'Un stress hydrique ou une carence en bore et azote au moment du débourrement réduit jusqu’à 35 % la viabilité des fleurs.',
  },
  {
    id: 'q1-nouaison',
    level: 1,
    termId: 'nouaison',
    termLabel: 'Nouaison',
    kabyleTerm: 'Tuṭṭfa n ujeǧǧig',
    question:
      'La variété Chemlal de Kabylie étant mâle-stérile (autoincompatible), quelle pratique ADOIO recommande-t-elle pour sécuriser la nouaison ?',
    contextHint: 'Seules 3 % à 5 % des fleurs d’un olivier donnent un fruit viable.',
    options: [
      'Irriguer abondamment à l’eau froide pendant la pleine floraison de mai',
      'Implanter 10 % à 15 % d’arbres pollinisateurs compatibles (Azeradj ou Sigoise) au vent dominant',
      'Tailler sévèrement toutes les frondaisons basses juste avant la floraison',
      'Récolter uniquement après le mois de janvier pour reposer les fleurs',
    ],
    correctIndex: 1,
    explanation:
      'Chemlal ne produit pas de pollen fonctionnel suffisant. L’association de 10 % à 15 % d’Azeradj ou de Sigoise assure la pollinisation anémophile (par le vent) indispensable à la nouaison.',
    adoioTip:
      'Évitez tout traitement insecticide pendant l’ouverture des fleurs et surveillez le sirocco précoce de mai.',
  },
  {
    id: 'q1-taille-gobelet',
    level: 1,
    termId: 'taille-gobelet',
    termLabel: 'Taille en gobelet aéré',
    kabyleTerm: 'Afraas n tzemmurt',
    question:
      'Quel est le principe fondamental de la « taille en gobelet aéré » et quelle précaution sanitaire est obligatoire entre deux arbres ?',
    contextHint: 'Un proverbe oléicole rappelle qu’une colombe doit pouvoir traverser la frondaison sans toucher une branche.',
    options: [
      'Laisser le centre de l’arbre très dense pour ombrager les fruits et ne jamais désinfecter les outils',
      'Évider le centre autour de 3 à 5 charpentières pour faire pénétrer la lumière et désinfecter sécateurs/scies à l’alcool ou javel',
      'Couper uniquement les jeunes rameaux d’un an qui porteront les olives de l’année',
      'Pratiquer la taille en plein mois d’août sous forte chaleur',
    ],
    correctIndex: 1,
    explanation:
      'Le gobelet ouvert réduit l’humidité interne propice à l’œil de paon (Spilocea oleagina) et à la fumagine. La désinfection systématique des lames bloque la transmission de la tuberculose de l’olivier (Pseudomonas savastanoi).',
    adoioTip:
      'Intervenez entre la fin de la récolte et juste avant le débourrement (fin février à fin mars) hors jours de pluie.',
  },
  {
    id: 'q1-veraison',
    level: 1,
    termId: 'veraison',
    termLabel: 'Véraison',
    kabyleTerm: 'Aburez',
    question:
      'Quel Indice de Maturité (IM) pendant la véraison offre le compromis optimal entre teneur maximale en huile (lipogenèse achevée) et pic de polyphénols ?',
    contextHint: 'L’échelle IM va de 0 (peau vert intense) à 7 (chair noire jusqu’au noyau).',
    options: [
      'IM = 0,0 (olive minuscule avant durcissement du noyau en juillet)',
      'IM compris entre 2,5 et 3,5 (olive vert-jaune tournant au violet/pourpre)',
      'IM = 7,0 (olive entièrement noire et ridée ramassée au sol en février)',
      'L’indice de maturité n’a aucune influence sur la qualité de l’huile',
    ],
    correctIndex: 1,
    explanation:
      'À la véraison tournante (IM 2,5 – 3,5), la synthèse des lipides dans la drupe est quasi maximale tandis que les polyphénols antioxydants et les arômes volatils sont à leur sommet.',
    adoioTip:
      'Au-delà de la véraison complète (olive noire), le gain apparent en rendement n’est dû qu’à une perte d’eau du fruit, au détriment de la stabilité de l’huile.',
  },
  {
    id: 'q1-alternance',
    level: 1,
    termId: 'alternance-on-off',
    termLabel: 'Alternance bisannuelle (ON / OFF)',
    kabyleTerm: 'Aseggas yella, aseggas ulac',
    question:
      'Pourquoi une récolte trop tardive (janvier-février) aggrave-t-elle fortement le phénomène d’alternance bisannuelle (année ON suivie d’une année OFF) ?',
    contextHint: 'L’induction florale de la récolte suivante se joue dès l’hiver.',
    options: [
      'Les fruits restés longtemps sur l’arbre épuisent les réserves glucidiques et leurs noyaux émettent des gibbérellines qui inhibent l’induction florale',
      'Le froid de janvier transforme l’huile des olives en amidon dans les racines',
      'Les filets de récolte posés en hiver empêchent la pluie d’atteindre le tronc',
      'L’alternance dépend uniquement de la phase de la lune lors de la plantation',
    ],
    correctIndex: 0,
    explanation:
      'La présence prolongée d’une forte charge d’olives sur l’arbre mobilise les hydrates de carbone et libère des hormones (gibbérellines) qui bloquent la différenciation des bourgeons à fleurs pour le printemps suivant.',
    adoioTip:
      'Une récolte précoce (novembre-décembre) combinée à une taille annuelle régulière réduit l’amplitude de l’alternance de 40 % à 60 %.',
  },

  // NIVEAU 2 : MAÎTRISE DU MOULIN & TRITURATION (5 questions)
  {
    id: 'q2-extraction-froid',
    level: 2,
    termId: 'extraction-a-froid',
    termLabel: 'Extraction à froid',
    kabyleTerm: 'Aẓmi s usemmiḍ',
    question:
      'Selon la réglementation du Conseil Oléicole International (COI), quelle est la température maximale stricte de la pâte d’olive pour revendiquer la mention « Extraction à froid » ?',
    contextHint: 'Au-delà de ce seuil thermique, les esters aromatiques volatils s’évaporent.',
    options: [
      'Inférieure à 27 °C tout au long du broyage, du malaxage et de la décantation',
      'Jusqu’à 45 °C pour fluidifier l’huile et augmenter le rendement de 3 points',
      'Exactement 0 °C dans une chambre froide industrielle',
      'Inférieure à 60 °C lors de l’ajout d’eau bouillante dans le décanteur',
    ],
    correctIndex: 0,
    explanation:
      'Le seuil réglementaire COI est strictement inférieur à 27 °C. Dépasser cette température accélère l’oxydation enzymatique, détruit les arômes de fruité vert et dégrade les polyphénols.',
    adoioTip:
      'Vérifiez toujours l’afficheur numérique de la sonde thermique sur la cuve de malaxage lors de la trituration de votre lot.',
  },
  {
    id: 'q2-malaxage',
    level: 2,
    termId: 'malaxage',
    termLabel: 'Malaxage de la pâte',
    kabyleTerm: 'Aɛrek n uzemmur',
    question:
      'Quel est le rôle physique du malaxage après le broyage et quelle est sa durée optimale dans une huilerie moderne à 2 phases ?',
    contextHint: 'Un malaxage excessif au contact de l’air oxyde l’huile.',
    options: [
      'Cuire la pâte pendant 2 heures pour stériliser les noyaux concassés',
      'Permettre la coalescence des micro-gouttelettes d’huile en phase continue pendant 25 à 40 minutes à moins de 27 °C',
      'Fermenter la pâte pendant 48 heures avant de la passer à la centrifugeuse',
      'Ajouter des solvants chimiques pour dissoudre la peau de l’olive',
    ],
    correctIndex: 1,
    explanation:
      'Le brassage lent (20 à 30 tr/min) pendant 25 à 40 minutes rassemble les fines gouttelettes d’huile libérées des vacuoles (coalescence) et favorise le transfert des composés phénoliques vers la phase huileuse.',
    adoioTip:
      'Au-delà de 45 minutes en cuve non hermétique, l’oxygène dégrade les tocophérols et fait grimper l’indice de peroxyde.',
  },
  {
    id: 'q2-chomage-avine',
    level: 2,
    termId: 'chomage-avine',
    termLabel: 'Chômage & Aviné',
    kabyleTerm: 'riḥa n uɛemmur / Asemmum',
    question:
      'Quelle erreur post-récolte provoque les défauts rédhibitoires « Chômé » et « Aviné-Vinaigré » qui déclassent immédiatement une huile de la catégorie Vierge Extra ?',
    contextHint: 'Pour une Vierge Extra COI, la médiane des défauts (Md) doit être strictement égale à 0,0.',
    options: [
      'Transporter les olives en caisses plastiques ajourées et triturer en moins de 24 h',
      'Stocker les olives plusieurs jours en sacs de jute ou plastique entassés, provoquant un échauffement (35–45 °C) et une fermentation anaérobie/acétique',
      'Filtrer l’huile sur plaques de cellulose juste après la décantation',
      'Utiliser une cuve en acier inoxydable 304L ou 316L à l’abri de la lumière',
    ],
    correctIndex: 1,
    explanation:
      'En sacs fermés ou en tas épais, les olives s’échauffent rapidement : les entérobactéries et levures produisent les odeurs fétides du « chômé » puis de l’acide acétique et de l’éthanol (« aviné »).',
    adoioTip:
      'Règle d’or ADOIO : transport exclusivement en caisses rigides ventilées (20–25 kg max) et trituration dans les 24 h à 48 h suivant la cueillette.',
  },
  {
    id: 'q2-grignons-margines',
    level: 2,
    termId: 'grignons-margines',
    termLabel: 'Grignons & Margines',
    kabyleTerm: 'Amurḍus & Afeqqus',
    question:
      'Pourquoi le rejet direct des margines (eaux de végétation noires) dans les oueds est-il proscrit, et comment les valoriser durablement en Kabylie ?',
    contextHint: 'Les margines sont riches en polyphénols phytotoxiques à forte dose mais fertilisants après traitement.',
    options: [
      'Elles sont totalement composées d’eau pure sans aucun impact écologique',
      'Leur forte charge organique (DCO/DBO5) et leur pH acide asphyxient la faune aquatique ; elles doivent être évaporées en bassins ou co-compostées avec les grignons (50–80 m³/ha max)',
      'Elles peuvent être remises dans les bouteilles d’huile pour augmenter le volume vendu',
      'Les grignons secs n’ont aucun pouvoir calorifique et ne peuvent pas chauffer les moulins',
    ],
    correctIndex: 1,
    explanation:
      'Les margines présentent une demande chimique en oxygène très élevée. Co-compostées avec les grignons et feuilles d’olivier ou épandues de façon contrôlée, elles enrichissent les sols en potassium ; le grignon sec (4 500 kcal/kg) sert aussi de biocombustible.',
    adoioTip:
      'Privilégiez les moulins équipés de décanteurs 2 phases (sans ajout d’eau chaude) qui réduisent de 75 % le volume d’effluents liquides.',
  },
  {
    id: 'q2-filtration-stockage',
    level: 2,
    termId: 'chomage-avine',
    termLabel: 'Lies & Défaut de Lie (Boues)',
    kabyleTerm: 'Tixmirin n lqaɛ',
    question:
      'Que se passe-t-il si une huile fraîchement extraite est conservée plusieurs mois sans soutirage ni filtration sur ses dépôts aqueux et mucilagineux au fond de la cuve ?',
    contextHint: 'L’eau résiduelle et les fragments de pulpe contiennent des enzymes et des sucres.',
    options: [
      'Les dépôts fermentent en anaérobiose et transmettent à l’huile le défaut organoleptique de « lie / boues » tout en faisant monter l’acidité par hydrolyse',
      'Les boues augmentent la teneur en vitamine E et doublent la durée de conservation',
      'L’huile devient automatiquement plus fruitée au bout de 6 mois sur lies',
      'Les dépôts protègent l’huile contre l’oxygène de l’air',
    ],
    correctIndex: 0,
    explanation:
      'Les micro-gouttelettes d’eau et particules de pulpe décantées au fond des cuves subissent une fermentation butyrique/putride (« défaut de lie ») et activent les lipases qui augmentent l’acidité libre.',
    adoioTip:
      'Soutirez vos cuves inox après 7 à 15 jours de repos ou pratiquez une filtration douce sur cellulose avant embouteillage.',
  },

  // NIVEAU 3 : EXPERT QUALITÉ COI & BIOCHIMIE ADOIO (5 questions)
  {
    id: 'q3-acidite-oleique',
    level: 3,
    termId: 'acidite-oleique',
    termLabel: 'Acidité libre (Taux d’acidité oléique)',
    kabyleTerm: 'Aseddi',
    question:
      'Quel est le plafond réglementaire COI d’acidité libre pour la catégorie « Huile d’Olive Vierge Extra » (HOVE), et un dégustateur peut-il percevoir cette acidité en bouche ?',
    contextHint: 'C’est l’idée reçue la plus répandue chez les consommateurs.',
    options: [
      'Plafond ≤ 2,0 % ; elle donne un goût très piquant dans la gorge',
      'Plafond ≤ 0,8 % (0,8 g/100 g) ; l’acidité oléique libre est totalement imperceptible au goût et ne se mesure qu’en laboratoire',
      'Plafond ≤ 3,3 % ; plus une huile est acide, plus elle est amère en bouche',
      'Plafond = 0,0 % obligatoire ; toute trace d’acide gras rend l’huile impropre',
    ],
    correctIndex: 1,
    explanation:
      'Pour une Vierge Extra COI, l’acidité libre doit être ≤ 0,8 % (les meilleures cuvées ADOIO de Béjaïa se situent entre 0,15 % et 0,40 %). Contrairement à une croyance tenace, les acides gras libres n’ont aucune saveur : ce que le palais ressent est l’ardence et l’amertume des polyphénols.',
    adoioTip:
      'Une acidité basse prouve que l’olive était saine (sans attaque de mouche Bactrocera oleae) et triturée sans délai.',
  },
  {
    id: 'q3-polyphenols',
    level: 3,
    termId: 'polyphenols',
    termLabel: 'Polyphénols (Biophénols)',
    kabyleTerm: 'Iferdisen n tezmert',
    question:
      'À partir de quelle concentration minimale en polyphénols (oleuropéine, hydroxytyrosol, tyrosol) le règlement européen EFSA 432/2012 autorise-t-il l’allégation santé sur la protection des lipides sanguins contre le stress oxydatif ?',
    contextHint: 'Les variétés Chemlal et Azeradj de montagne récoltées tôt dépassent souvent 350 à 600 mg/kg.',
    options: [
      'Au moins 20 mg/kg d’huile d’olive',
      'Au moins 250 mg/kg d’huile d’olive (soit 5 mg de biophénols pour 20 g d’huile par jour)',
      'Uniquement dans les huiles raffinées désodorisées en usine',
      'Au moins 5 000 mg/kg obtenus en laissant les olives sécher au soleil',
    ],
    correctIndex: 1,
    explanation:
      'Le seuil officiel EFSA est de 250 mg/kg minimum. Ces antioxydants naturels protègent le système cardiovasculaire humain mais protègent aussi l’huile elle-même contre le rancissement pendant 18 à 24 mois.',
    adoioTip:
      'Amertume sur la langue et ardence dans la gorge sont les signatures sensorielles directes d’une richesse élevée en polyphénols.',
  },
  {
    id: 'q3-indice-peroxyde',
    level: 3,
    termId: 'indice-peroxyde',
    termLabel: 'Indice de peroxyde (IP)',
    kabyleTerm: 'Aktili n uksid',
    question:
      'Que mesure exactement l’Indice de Peroxyde (IP) d’une huile d’olive et quelle est la limite maximale COI pour une Vierge Extra ?',
    contextHint: 'Différenciez l’altération hydrolytique (acidité) de l’altération oxydative.',
    options: [
      'Il mesure la teneur en chlorophylle verte ; limite maximale ≥ 50 mEq O₂/kg',
      'Il mesure l’oxydation primaire des acides gras insaturés par l’oxygène, la chaleur ou les UV ; limite COI ≤ 20 mEq d’O₂ actif/kg',
      'Il mesure le pourcentage d’eau restant dans la cuve après centrifugation',
      'Il mesure le nombre de noyaux broyés par kilogramme de pâte',
    ],
    correctIndex: 1,
    explanation:
      'L’indice de peroxyde quantifie les hydroperoxydes formés au premier stade du rancissement. Le plafond COI est de 20 mEq O₂/kg, mais une HOVE fraîchement extraite et bien stockée affiche un IP inférieur à 8–10 mEq O₂/kg.',
    adoioTip:
      'Une bouteille en verre transparent exposée à la lumière directe voit son indice de peroxyde exploser en quelques semaines par photo-oxydation de la chlorophylle.',
  },
  {
    id: 'q3-ardence-oleocanthal',
    level: 3,
    termId: 'ardence',
    termLabel: 'Ardence (Piquant / Poivré)',
    kabyleTerm: 'Aqerḥan n taɣect',
    question:
      'Quelle molécule phénolique spécifique est responsable de l’« ardence » (sensation poivrée au fond de la gorge provoquant parfois un léger réflexe de toux) et quel est son statut au jury COI ?',
    contextHint: 'Ses propriétés anti-inflammatoires naturelles ont été comparées à celles de l’ibuprofène.',
    options: [
      'L’oléocanthal ; c’est l’un des 3 attributs positifs officiels du profil organoleptique COI (avec le fruité et l’amertume)',
      'L’acide acétique libre ; c’est un défaut majeur qui déclasse l’huile en lampante',
      'Le soufre résiduel ; il indique une fermentation dans les sacs de récolte',
      'La cire de la cuticule ; elle montre que l’huile a été chauffée à 50 °C',
    ],
    correctIndex: 0,
    explanation:
      'Découvert par le Dr Gary Beauchamp, l’oléocanthal active spécifiquement les récepteurs TRPA1 situés dans l’oropharynx. Au jury COI, l’ardence est un attribut positif majeur attestant d’une récolte fraîche à la véraison.',
    adoioTip:
      'Les grands crus de montagne (Seddouk, Beni Maouche, Akbou, Amizour) se distinguent par un équilibre remarquable entre fruité herbacé, amertume franche et ardence persistante.',
  },
  {
    id: 'q3-fruite-jury-coi',
    level: 3,
    termId: 'fruite-vert-mur',
    termLabel: 'Fruité (Vert vs Mûr) & Classement COI',
    kabyleTerm: 'Riḥa n uzemmur',
    question:
      'Quelles sont les deux conditions sensorielles cumulatives exigées par un panel de dégustation agréé COI (verre bleu cobalt à 28 °C) pour classer une huile en « Vierge Extra » ?',
    contextHint: 'Une huile parfaitement neutre (sans arôme) ne peut jamais être Vierge Extra.',
    options: [
      'Médiane du fruité (Mf) > 0,0 ET Médiane des défauts (Md) strictement égale à 0,0',
      'Médiane du fruité = 0,0 ET Médiane des défauts ≤ 2,5',
      'Couleur obligatoirement vert émeraude foncé à l’œil nu du dégustateur',
      'Absence totale d’amertume et de piquant en bouche',
    ],
    correctIndex: 0,
    explanation:
      'Le panel COI utilise des verres sombres pour neutraliser tout biais lié à la couleur de l’huile. Pour être classée Vierge Extra, l’huile doit présenter zéro défaut perceptible (Md = 0,0) et un fruité positif (Mf > 0,0), qu’il soit fruité vert (herbe coupée, feuille d’olivier, artichaut) ou fruité mûr (amande douce, pomme).',
    adoioTip:
      'Ne jugez jamais la qualité d’une huile d’olive à sa robe (jaune d’or ou vert intense) : seuls le nez et le palais révèlent la pureté du fruit.',
  },
];

interface StoredQuizProgress {
  completedLevels: number[];
  bestScores: Record<number, number>;
  lastPlayedLevel: 1 | 2 | 3;
}

const STORAGE_KEY = 'adoio_olive_quiz_progress_v1';

const DEFAULT_PROGRESS: StoredQuizProgress = {
  completedLevels: [],
  bestScores: { 1: 0, 2: 0, 3: 0 },
  lastPlayedLevel: 1,
};

interface OliveQuizProps {
  onSelectGlossaryTerm?: (termId: string) => void;
  onNavigate?: (sectionId: string) => void;
}

export const OliveQuiz: React.FC<OliveQuizProps> = ({
  onSelectGlossaryTerm,
  onNavigate,
}) => {
  const [progress, setProgress] = useState<StoredQuizProgress>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
          bestScores: parsed.bestScores || { 1: 0, 2: 0, 3: 0 },
          lastPlayedLevel:
            parsed.lastPlayedLevel === 1 || parsed.lastPlayedLevel === 2 || parsed.lastPlayedLevel === 3
              ? parsed.lastPlayedLevel
              : 1,
        };
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_PROGRESS;
  });

  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(progress.lastPlayedLevel);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [levelAnswers, setLevelAnswers] = useState<Record<string, boolean>>({});
  const [showLevelSummary, setShowLevelSummary] = useState<boolean>(false);
  const [unlockAllMode, setUnlockAllMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage errors
    }
  }, [progress]);

  const levelQuestions = useMemo(
    () => OLIVE_QUIZ_QUESTIONS.filter((q) => q.level === activeLevel),
    [activeLevel]
  );

  const currentLevelMeta = useMemo(
    () => QUIZ_LEVELS.find((l) => l.level === activeLevel) || QUIZ_LEVELS[0],
    [activeLevel]
  );

  const currentQuestion = levelQuestions[currentIndex] || levelQuestions[0];

  const isLevelUnlocked = (lvl: 1 | 2 | 3): boolean => {
    if (lvl === 1 || unlockAllMode) return true;
    return progress.completedLevels.includes(lvl - 1);
  };

  const currentLevelScore = useMemo(() => {
    return levelQuestions.reduce((acc, q) => acc + (levelAnswers[q.id] ? 1 : 0), 0);
  }, [levelQuestions, levelAnswers]);

  const totalBestScore =
    (progress.bestScores[1] || 0) +
    (progress.bestScores[2] || 0) +
    (progress.bestScores[3] || 0);

  const handleSelectLevel = (lvl: 1 | 2 | 3) => {
    if (!isLevelUnlocked(lvl)) return;
    setActiveLevel(lvl);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setLevelAnswers({});
    setShowLevelSummary(false);
    setProgress((prev) => ({ ...prev, lastPlayedLevel: lvl }));
  };

  const handleChooseOption = (optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedOption(optionIdx);
    setIsSubmitted(true);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    const updatedAnswers = { ...levelAnswers, [currentQuestion.id]: isCorrect };
    setLevelAnswers(updatedAnswers);

    // If this was the last question of the level, update best score & progression immediately
    if (currentIndex === levelQuestions.length - 1) {
      const finalScore = levelQuestions.reduce(
        (acc, q) => acc + (updatedAnswers[q.id] ? 1 : 0),
        0
      );
      const passed = finalScore >= currentLevelMeta.minScoreToPass;
      setProgress((prev) => {
        const prevBest = prev.bestScores[activeLevel] || 0;
        const newBest = Math.max(prevBest, finalScore);
        const newCompleted =
          passed && !prev.completedLevels.includes(activeLevel)
            ? [...prev.completedLevels, activeLevel]
            : prev.completedLevels;
        return {
          ...prev,
          bestScores: { ...prev.bestScores, [activeLevel]: newBest },
          completedLevels: newCompleted,
        };
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < levelQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowLevelSummary(true);
    }
  };

  const handleRetryLevel = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setLevelAnswers({});
    setShowLevelSummary(false);
  };

  const handleResetAllProgress = () => {
    const fresh: StoredQuizProgress = {
      completedLevels: [],
      bestScores: { 1: 0, 2: 0, 3: 0 },
      lastPlayedLevel: 1,
    };
    setProgress(fresh);
    setActiveLevel(1);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setLevelAnswers({});
    setShowLevelSummary(false);
  };

  const getLevelIcon = (lvl: 1 | 2 | 3) => {
    if (lvl === 1) return <Sprout className="w-4 h-4" />;
    if (lvl === 2) return <Factory className="w-4 h-4" />;
    return <FlaskConical className="w-4 h-4" />;
  };

  const passedCurrentLevel = currentLevelScore >= currentLevelMeta.minScoreToPass;
  const allLevelsCompleted =
    progress.completedLevels.includes(1) &&
    progress.completedLevels.includes(2) &&
    progress.completedLevels.includes(3);

  return (
    <div
      id="quiz-oleicole"
      className="bg-white rounded-3xl border border-[#E6DEC9] shadow-sm overflow-hidden"
    >
      {/* Top Banner — Progression & Level Overview */}
      <div className="bg-gradient-to-br from-[#18230F] via-[#233416] to-[#31491E] text-[#FAF7F2] p-6 sm:p-8 border-b border-[#31491E]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#E6AB3C] mb-2">
              <Award className="w-4 h-4" />
              <span>Parcours d’Auto-Évaluation ADOIO</span>
              <span className="text-[#FAF7F2]/40">·</span>
              <span className="text-[#8CBE5D]">3 Niveaux Progressifs · 15 Questions Techniques</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#FAF7F2] mb-2">
              Quiz Oléicole : Du Verger à l’Excellence COI
            </h3>
            <p className="text-sm text-[#FAF7F2]/80 leading-relaxed">
              Testez votre maîtrise des termes agronomiques, de l’extraction à froid et des normes physico-chimiques. Validez au moins{' '}
              <strong className="text-[#E6AB3C] font-semibold">3/5 aux niveaux 1 et 2</strong> (et 4/5 au niveau 3) pour débloquer l’étape suivante.
            </p>
          </div>

          {/* Global Score & Controls */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-[#18230F]/70 border border-[#FAF7F2]/15 rounded-2xl p-4 shrink-0">
            <div className="pr-4 border-r border-[#FAF7F2]/15">
              <div className="text-[11px] uppercase tracking-wider text-[#FAF7F2]/60 font-semibold">
                Score Cumulé
              </div>
              <div className="text-2xl font-serif font-bold text-[#E6AB3C] tabular-nums">
                {totalBestScore}{' '}
                <span className="text-sm font-sans font-normal text-[#FAF7F2]/60">/ 15 pts</span>
              </div>
            </div>

            <div className="pr-4 border-r border-[#FAF7F2]/15">
              <div className="text-[11px] uppercase tracking-wider text-[#FAF7F2]/60 font-semibold">
                Niveaux Validés
              </div>
              <div className="text-lg font-bold text-[#8CBE5D] tabular-nums flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#E6AB3C]" />
                <span>{progress.completedLevels.length} / 3</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => setUnlockAllMode((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FAF7F2]/85 hover:text-[#E6AB3C] transition-colors cursor-pointer"
                title="Permet d'accéder librement aux 3 niveaux sans attendre le déblocage"
              >
                {unlockAllMode ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-[#8CBE5D]" />
                    <span>Accès libre activé</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#E6AB3C]" />
                    <span>Débloquer tous les niveaux</span>
                  </>
                )}
              </button>
              {(totalBestScore > 0 || progress.completedLevels.length > 0) && (
                <button
                  type="button"
                  onClick={handleResetAllProgress}
                  className="inline-flex items-center gap-1 text-[11px] text-[#FAF7F2]/60 hover:text-[#FAF7F2] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Réinitialiser le parcours</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3-Level Stepper Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#FAF7F2]/15">
          {QUIZ_LEVELS.map((lvl) => {
            const unlocked = isLevelUnlocked(lvl.level);
            const isCompleted = progress.completedLevels.includes(lvl.level);
            const isCurrent = activeLevel === lvl.level;
            const best = progress.bestScores[lvl.level] || 0;

            return (
              <button
                key={lvl.level}
                type="button"
                disabled={!unlocked}
                onClick={() => handleSelectLevel(lvl.level)}
                className={`text-left rounded-2xl p-4 transition-all border flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#FAF7F2] text-[#18230F] border-[#E6AB3C] shadow-md'
                    : unlocked
                    ? 'bg-[#18230F]/55 text-[#FAF7F2] border-[#FAF7F2]/15 hover:bg-[#18230F]/80 hover:border-[#E6AB3C]/50 cursor-pointer'
                    : 'bg-[#18230F]/30 text-[#FAF7F2]/45 border-[#FAF7F2]/10 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${
                        isCurrent
                          ? 'text-[#436229]'
                          : unlocked
                          ? 'text-[#E6AB3C]'
                          : 'text-[#FAF7F2]/40'
                      }`}
                    >
                      {getLevelIcon(lvl.level)}
                      <span>Niveau {lvl.level}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums">
                      {isCompleted ? (
                        <span
                          className={`inline-flex items-center gap-1 ${
                            isCurrent ? 'text-[#31491E]' : 'text-[#8CBE5D]'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Validé ({best}/5)</span>
                        </span>
                      ) : unlocked ? (
                        <span className={isCurrent ? 'text-[#5A5243]' : 'text-[#FAF7F2]/70'}>
                          Record : {best}/5
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#FAF7F2]/40">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Verrouillé</span>
                        </span>
                      )}
                    </span>
                  </div>

                  <div
                    className={`font-serif font-bold text-sm sm:text-base leading-snug mb-1 ${
                      isCurrent ? 'text-[#18230F]' : unlocked ? 'text-[#FAF7F2]' : 'text-[#FAF7F2]/50'
                    }`}
                  >
                    {lvl.badgeTitle}
                  </div>
                  <p
                    className={`text-xs leading-relaxed line-clamp-2 ${
                      isCurrent ? 'text-[#5A5243]' : 'text-[#FAF7F2]/65'
                    }`}
                  >
                    {lvl.subtitle}
                  </p>
                </div>

                {/* Progress bar per level */}
                <div className="mt-3 pt-2.5 border-t border-current/10 flex items-center justify-between text-[11px]">
                  <span>Seuil de réussite : {lvl.minScoreToPass}/5</span>
                  <span className="font-bold tabular-nums">{Math.round((best / 5) * 100)}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Quiz Body */}
      <div className="p-6 sm:p-8 bg-[#FAF7F2]/50">
        {!showLevelSummary ? (
          <div>
            {/* Question Progress Bar & Level Context */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[#E6DEC9]">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#436229] mb-1">
                  {currentLevelMeta.title}
                </div>
                <p className="text-xs text-[#5A5243]">{currentLevelMeta.description}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-semibold text-[#5A5243]">
                    Question{' '}
                    <span className="font-bold text-[#18230F] tabular-nums">
                      {currentIndex + 1} / {levelQuestions.length}
                    </span>
                  </div>
                  <div className="text-xs text-[#436229] font-bold tabular-nums">
                    Score actuel : {currentLevelScore} pt{currentLevelScore > 1 ? 's' : ''}
                  </div>
                </div>

                {/* Step dots */}
                <div className="flex items-center gap-1.5">
                  {levelQuestions.map((q, idx) => {
                    const answered = q.id in levelAnswers;
                    const correct = levelAnswers[q.id];
                    return (
                      <span
                        key={q.id}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === currentIndex
                            ? 'w-6 bg-[#18230F]'
                            : answered
                            ? correct
                              ? 'bg-[#436229]'
                              : 'bg-[#B91C1C]'
                            : 'bg-[#D5CBB3]'
                        }`}
                        title={`Question ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Question Card */}
            <div className="bg-white rounded-2xl border border-[#E6DEC9] p-6 sm:p-7 shadow-xs">
              {/* Related Term Metadata Header (Unboxed clean typography) */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#5A5243] mb-3 pb-3 border-b border-[#F4EEE1]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-[#436229]">
                    Terme évalué : {currentQuestion.termLabel}
                  </span>
                  {currentQuestion.kabyleTerm && (
                    <>
                      <span className="text-[#C7B299]">·</span>
                      <span className="italic font-medium text-[#7A6F5D]">
                        Tamazight : {currentQuestion.kabyleTerm}
                      </span>
                    </>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-[#7A6F5D]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#E6AB3C]" />
                  <span>Indice : {currentQuestion.contextHint}</span>
                </span>
              </div>

              {/* Question Prompt */}
              <h4 className="text-lg sm:text-xl font-serif font-bold text-[#18230F] leading-snug mb-6">
                {currentQuestion.question}
              </h4>

              {/* Options List */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((optionText, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrectOption = idx === currentQuestion.correctIndex;

                  let buttonStyle =
                    'bg-[#FAF7F2] border-[#E6DEC9] text-[#18230F] hover:border-[#436229] hover:bg-[#F4EEE1]/60';
                  let indicatorStyle = 'border-[#C7B299] text-[#5A5243] bg-white';

                  if (isSubmitted) {
                    if (isCorrectOption) {
                      buttonStyle =
                        'bg-[#EDF5E6] border-[#436229] text-[#18230F] ring-1 ring-[#436229]/40';
                      indicatorStyle = 'bg-[#436229] border-[#436229] text-white';
                    } else if (isSelected && !isCorrectOption) {
                      buttonStyle = 'bg-[#FEF2F2] border-[#DC2626] text-[#7F1D1D]';
                      indicatorStyle = 'bg-[#DC2626] border-[#DC2626] text-white';
                    } else {
                      buttonStyle = 'bg-[#FAF7F2]/50 border-[#E6DEC9]/60 text-[#7A6F5D] opacity-70';
                    }
                  }

                  const optionLetter = String.fromCharCode(65 + idx);

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleChooseOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${buttonStyle} ${
                        !isSubmitted ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg border text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${indicatorStyle}`}
                      >
                        {isSubmitted && isCorrectOption ? (
                          <Check className="w-4 h-4" />
                        ) : isSubmitted && isSelected && !isCorrectOption ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          optionLetter
                        )}
                      </span>
                      <span className="text-sm sm:text-base font-medium leading-relaxed">
                        {optionText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Pedagogical Feedback Drawer after answering */}
              {isSubmitted && (
                <div
                  className={`rounded-2xl p-5 border transition-all ${
                    selectedOption === currentQuestion.correctIndex
                      ? 'bg-[#EDF5E6]/70 border-[#8CBE5D]'
                      : 'bg-[#FFFBEB] border-[#E6AB3C]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-black/10">
                    <div className="flex items-center gap-2">
                      {selectedOption === currentQuestion.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-[#31491E] shrink-0" />
                          <span className="font-serif font-bold text-[#18230F] text-base">
                            Excellente réponse ! Notion maîtrisée
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-[#B45309] shrink-0" />
                          <span className="font-serif font-bold text-[#18230F] text-base">
                            Réponse incorrecte · Point technique à retenir
                          </span>
                        </>
                      )}
                    </div>

                    {onSelectGlossaryTerm && (
                      <button
                        type="button"
                        onClick={() => onSelectGlossaryTerm(currentQuestion.termId)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#31491E] hover:text-[#18230F] underline underline-offset-4 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Consulter la fiche « {currentQuestion.termLabel} »</span>
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-[#2A2621] leading-relaxed mb-3">
                    {currentQuestion.explanation}
                  </p>

                  <div className="bg-white/80 rounded-xl p-3.5 border border-[#E6DEC9] flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#D99B26] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#3A352F] leading-relaxed">
                      <strong className="font-bold text-[#18230F] uppercase tracking-wider">
                        Conseil Terrain ADOIO Béjaïa :{' '}
                      </strong>
                      {currentQuestion.adoioTip}
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#18230F] text-[#FAF7F2] hover:bg-[#31491E] text-sm font-bold transition-colors shadow-sm cursor-pointer"
                    >
                      <span>
                        {currentIndex < levelQuestions.length - 1
                          ? 'Question suivante'
                          : 'Voir le bilan du niveau'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Level Completion Summary View */
          <div className="bg-white rounded-2xl border border-[#E6DEC9] p-6 sm:p-8 text-center max-w-3xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#F4EEE1] border border-[#E6DEC9] flex items-center justify-center mx-auto mb-4 text-[#31491E]">
              {passedCurrentLevel ? (
                <Trophy className="w-7 h-7 text-[#D99B26]" />
              ) : (
                <RotateCcw className="w-7 h-7 text-[#5A5243]" />
              )}
            </div>

            <div className="text-xs font-bold uppercase tracking-widest text-[#436229] mb-1">
              Bilan du {currentLevelMeta.title}
            </div>

            <h4 className="text-2xl sm:text-3xl font-serif font-bold text-[#18230F] mb-2">
              {passedCurrentLevel
                ? `Félicitations ! Titre « ${currentLevelMeta.badgeTitle} » validé`
                : 'Encore un effort pour valider ce niveau'}
            </h4>

            <p className="text-sm text-[#5A5243] max-w-xl mx-auto mb-6">
              {passedCurrentLevel
                ? `Vous avez obtenu ${currentLevelScore} / ${levelQuestions.length} bonnes réponses (seuil requis : ${currentLevelMeta.minScoreToPass}/5).`
                : `Vous avez obtenu ${currentLevelScore} / ${levelQuestions.length}. Il faut au moins ${currentLevelMeta.minScoreToPass}/5 bonnes réponses pour débloquer le niveau suivant.`}
            </p>

            {/* Question-by-question recap */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-left mb-7">
              {levelQuestions.map((q, idx) => {
                const ok = levelAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                      ok
                        ? 'bg-[#EDF5E6]/60 border-[#8CBE5D] text-[#18230F]'
                        : 'bg-[#FEF2F2] border-[#FECACA] text-[#7F1D1D]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>Q{idx + 1}</span>
                      {ok ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#31491E]" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                      )}
                    </div>
                    <div className="font-semibold line-clamp-2">{q.termLabel}</div>
                    {onSelectGlossaryTerm && (
                      <button
                        type="button"
                        onClick={() => onSelectGlossaryTerm(q.termId)}
                        className="mt-2 text-[11px] underline text-left opacity-80 hover:opacity-100 cursor-pointer"
                      >
                        Voir la fiche →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Full Mastery Banner if all 3 levels are completed */}
            {allLevelsCompleted && (
              <div className="mb-7 p-5 rounded-2xl bg-gradient-to-r from-[#18230F] to-[#31491E] text-[#FAF7F2] text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-[#E6AB3C] mb-1">
                    Attestation de Maîtrise Technique ADOIO · Béjaïa
                  </div>
                  <div className="text-lg font-serif font-bold">
                    Parcours Complet Validé ({totalBestScore}/15 points)
                  </div>
                  <p className="text-xs text-[#FAF7F2]/80 mt-0.5">
                    Vous maîtrisez l’ensemble du référentiel verger, moulin et qualité physico-chimique COI.
                  </p>
                </div>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => onNavigate('chatbot-adoio')}
                    className="px-4 py-2.5 rounded-xl bg-[#E6AB3C] text-[#18230F] font-bold text-xs hover:bg-[#f0b94e] transition-colors shrink-0 cursor-pointer"
                  >
                    Approfondir avec l’Assistant IA
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRetryLevel}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#C7B299] bg-[#FAF7F2] text-[#18230F] hover:bg-[#F4EEE1] text-sm font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rejouer le Niveau {activeLevel}</span>
              </button>

              {activeLevel < 3 && isLevelUnlocked((activeLevel + 1) as 2 | 3) && (
                <button
                  type="button"
                  onClick={() => handleSelectLevel((activeLevel + 1) as 2 | 3)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#18230F] text-[#FAF7F2] hover:bg-[#31491E] text-sm font-bold transition-colors shadow-sm cursor-pointer"
                >
                  <span>Passer au Niveau {activeLevel + 1}</span>
                  <ArrowRight className="w-4 h-4 text-[#E6AB3C]" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
