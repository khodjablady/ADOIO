import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Droplets,
  Sprout,
  Award,
  Factory,
  Recycle,
  X,
  ArrowRight,
  Copy,
  Check,
  Trophy,
} from 'lucide-react';
import { OliveQuiz } from './OliveQuiz';

export type GlossaryCategory =
  | 'all'
  | 'agronomie'
  | 'extraction'
  | 'chimie'
  | 'degustation'
  | 'sous-produits';

export interface GlossaryTerm {
  id: string;
  term: string;
  kabyleTerm?: string;
  category: Exclude<GlossaryCategory, 'all'>;
  categoryLabel: string;
  shortDefinition: string;
  detailedExplanation: string;
  practicalTipBejaia: string;
  normOrThreshold?: string;
  relatedSectionId?: string;
  relatedSectionLabel?: string;
}

export const OLIVE_GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'extraction-a-froid',
    term: 'Extraction à froid',
    kabyleTerm: 'Aẓmi s usemmiḍ',
    category: 'extraction',
    categoryLabel: 'Trituration & Moulin',
    shortDefinition:
      "Procédé mécanique de trituration où la température de la pâte d'olive est maintenue strictement en dessous de 27 °C.",
    detailedExplanation:
      "Conformément aux normes du Conseil Oléicole International (COI), la mention « Première pression à froid » (système traditionnel à scourtins) ou « Extraction à froid » (chaîne continue par centrifugation) garantit que la pâte d'olive n'a subi aucun chauffage au-delà de 27 °C durant le malaxage et la séparation. Cette maîtrise thermique préserve les composés aromatiques volatils (fruité vert), les tocophérols (vitamine E) et les polyphénols antioxydants.",
    practicalTipBejaia:
      "En huilerie moderne à Béjaïa (Akbou, Seddouk, Ouzellaguen), vérifiez la sonde thermique du malaxeur : un malaxage de 30 à 40 minutes entre 24 °C et 26 °C offre le meilleur équilibre entre rendement et arômes pour la variété Chemlal.",
    normOrThreshold: 'T° pâte < 27 °C (Norme COI)',
    relatedSectionId: 'degustation',
    relatedSectionLabel: 'Guide du Consommateur & COI',
  },
  {
    id: 'debourrement',
    term: 'Débourrement',
    kabyleTerm: 'aki n tzemmurt / Afsay n yimɣi',
    category: 'agronomie',
    categoryLabel: 'Cycle Végétatif & Verger',
    shortDefinition:
      "Stade phénologique printanier marquant le réveil végétatif de l'olivier par l'éclosion des bourgeons foliaires et floraux.",
    detailedExplanation:
      "Après le repos hivernal nécessaire à la vernalisation (besoin en froid), l'élévation des températures au début du printemps déclenche la montée de sève. Les écailles protectrices des bourgeons s'écartent pour laisser apparaître les jeunes pousses et les futures grappes florales (inflorescences). C'est une période de forte mobilisation en azote et en eau.",
    practicalTipBejaia:
      "Dans la vallée de la Soummam (basse altitude), le débourrement débute dès fin février – mi-mars, contre fin mars – début avril sur les hauteurs (Beni Maouche, Adekar, Chemini). Toutes les opérations de taille et d'épandage de compost doivent impérativement être achevées avant ce stade.",
    normOrThreshold: 'Février – Avril selon altitude',
    relatedSectionId: 'pratiques',
    relatedSectionLabel: 'Calendrier Agronomique',
  },
  {
    id: 'polyphenols',
    term: 'Polyphénols (Biophénols)',
    kabyleTerm: 'Iferdisen n tezmert',
    category: 'chimie',
    categoryLabel: 'Biochimie & Santé',
    shortDefinition:
      "Antioxydants naturels puissants présents dans l'huile d'olive vierge extra, responsables de sa stabilité à l'oxydation, de son amertume et de son piquant.",
    detailedExplanation:
      "Les polyphénols (notamment l'oleuropéine, l'oléocanthal et l'oléacéine) sont des molécules phénoliques hydrophiles synthétisées par l'olivier pour se défendre contre les stress biotiques et climatiques. Lors de la trituration, ils passent dans l'huile et la protègent du rancissement tout en conférant les attributs positifs d'amertume (sur la langue) et d'ardence/piquant (dans la gorge). Ils possèdent des vertus cardiovasculaires et anti-inflammatoires reconnues.",
    practicalTipBejaia:
      "Les variétés autochtones kabyles comme l'Azeradj et la Chemlal récoltées au stade tournant (véraison précoce en novembre) présentent des teneurs remarquables dépassant souvent 350 à 500 mg/kg.",
    normOrThreshold: '≥ 250 mg/kg (Allégation santé EFSA)',
    relatedSectionId: 'varietes',
    relatedSectionLabel: 'Guide Variétal Kabyle',
  },
  {
    id: 'veraison',
    term: 'Véraison (Indice de Maturité)',
    kabyleTerm: 'Aburez / Tazwara n tebrek',
    category: 'agronomie',
    categoryLabel: 'Cycle Végétatif & Verger',
    shortDefinition:
      "Phase de transition physiologique durant laquelle la peau de l'olive passe progressivement du vert franc au jaune-paille, au violet puis au noir.",
    detailedExplanation:
      "La véraison correspond au pic de la lipogenèse (synthèse des gouttelettes d'huile dans la pulpe du fruit) et au début de la synthèse des anthocyanes (pigments violets). C'est à ce stade précis que l'olive atteint son potentiel qualitatif maximal : toute l'huile est déjà formée dans le fruit tandis que le taux d'antioxydants et d'arômes est à son sommet.",
    practicalTipBejaia:
      "L'ADOIO recommande de déclencher la cueillette lorsque l'Indice de Maturité (IM) se situe entre 2,5 et 3,5 (olives majoritairement vert-jaune et tournantes violettes), sans attendre que les olives tombent ou noircissent complètement.",
    normOrThreshold: 'Indice de Maturité optimal : 2,5 – 3,5',
    relatedSectionId: 'simulateur',
    relatedSectionLabel: 'Simulateur & Alerte Récolte',
  },
  {
    id: 'acidite-oleique',
    term: 'Acidité libre (Taux d’acidité oléique)',
    kabyleTerm: 'Aseddi / Tazuni n zzit',
    category: 'chimie',
    categoryLabel: 'Biochimie & Santé',
    shortDefinition:
      "Indicateur chimique mesurant la dégradation des triglycérides de l'huile en acides gras libres (exprimé en grammes d'acide oléique pour 100 g d'huile).",
    detailedExplanation:
      "Contrairement à une idée reçue, l'acidité libre d'une huile d'olive est totalement imperceptible au goût (elle ne se détecte qu'en laboratoire). Elle reflète l'état sanitaire des olives avant et pendant la trituration : des olives piquées par la mouche, ramassées au sol, stockées dans des sacs en plastique ou triturées tardivement subissent une hydrolyse enzymatique qui fait grimper l'acidité.",
    practicalTipBejaia:
      "Pour obtenir une Vierge Extra d'excellence (≤ 0,3 % d'acidité), transportez vos olives en caisses plastiques ajourées et faites-les triturer dans les 24 à 48 heures suivant la récolte.",
    normOrThreshold: '≤ 0,8 % (Norme Vierge Extra COI)',
    relatedSectionId: 'degustation',
    relatedSectionLabel: 'Normes COI & Étiquetage',
  },
  {
    id: 'indice-peroxyde',
    term: 'Indice de peroxyde',
    kabyleTerm: 'Aktili n uksid',
    category: 'chimie',
    categoryLabel: 'Biochimie & Santé',
    shortDefinition:
      "Paramètre physico-chimique évaluant le niveau d'oxydation primaire de l'huile d'olive (rancissement naissant).",
    detailedExplanation:
      "Exprimé en milliéquivalents d'oxygène actif par kilogramme d'huile (mEq O₂/kg), l'indice de peroxyde mesure la quantité d'hydroperoxydes formés au contact de l'air, de la chaleur ou de la lumière. Un indice élevé signale que l'huile a commencé à s'oxyder et perdra rapidement ses qualités organoleptiques et nutritionnelles.",
    practicalTipBejaia:
      "Après trituration, soutirez l'huile pour éliminer les dépôts de fond (lies) et conservez-la dans des cuves en acier inoxydable ou des bouteilles en verre foncé entre 14 °C et 18 °C à l'abri de la lumière.",
    normOrThreshold: '≤ 20 mEq O₂/kg (Norme COI)',
    relatedSectionId: 'degustation',
    relatedSectionLabel: 'Conservation de l’Huile',
  },
  {
    id: 'ardence',
    term: 'Ardence (Piquant / Poivré)',
    kabyleTerm: 'Aqerḥan n taɣect',
    category: 'degustation',
    categoryLabel: 'Analyse Sensorielle COI',
    shortDefinition:
      "Sensation tactile de picotement poivré ressentie au fond de la gorge lors de la dégustation d'une huile d'olive fraîche.",
    detailedExplanation:
      "En analyse sensorielle officielle COI, l'ardence (ou piquant) n'est pas un défaut ni un signe d'acidité : c'est un attribut positif majeur directement lié à la présence d'oléocanthal, un polyphénol aux propriétés anti-inflammatoires naturelles. Une huile qui fait légèrement tousser (huile dite « d'une toux » ou « de deux toux ») témoigne d'une récolte précoce et d'une richesse exceptionnelle en antioxydants.",
    practicalTipBejaia:
      "En Kabylie, ce piquant caractéristique de l'huile nouvelle (Zzit n ujdid) issue des variétés Azeradj et Chemlal s'harmonise et s'adoucit naturellement après 2 à 3 mois de décantation.",
    normOrThreshold: 'Attribut sensoriel positif COI',
    relatedSectionId: 'degustation',
    relatedSectionLabel: 'Roue des Arômes & Dégustation',
  },
  {
    id: 'fruite-vert-mur',
    term: 'Fruité (Vert vs Mûr)',
    kabyleTerm: 'Rriḥa n uzemmur azegzaw',
    category: 'degustation',
    categoryLabel: 'Analyse Sensorielle COI',
    shortDefinition:
      "Ensemble des sensations olfactives caractéristiques de l'huile issue d'olives saines et fraîches, perçues par voie directe ou rétro-nasale.",
    detailedExplanation:
      "Le « Fruité vert » caractérise les huiles obtenues à partir d'olives cueillies vertes ou en début de véraison : il évoque l'herbe fraîchement coupée, la feuille d'olivier, l'artichaut cru, l'amande verte ou le plant de tomate. Le « Fruité mûr » provient d'olives récoltées plus tardivement et développe des notes plus douces et rondes de pomme mûre, d'amande sèche et de fruits jaunes.",
    practicalTipBejaia:
      "Pour concourir au prix de la Meilleure Huile d'Olive de Béjaïa (Fête de l'Olive), le jury COI recherche une médiane de fruité supérieure à 4,5/10 avec zéro défaut organoleptique.",
    normOrThreshold: 'Médiane du fruité > 0 (Vierge Extra)',
    relatedSectionId: 'concours',
    relatedSectionLabel: 'Concours Meilleure Huile 2026',
  },
  {
    id: 'malaxage',
    term: 'Malaxage de la pâte',
    kabyleTerm: 'Aɛrek n uzemmur',
    category: 'extraction',
    categoryLabel: 'Trituration & Moulin',
    shortDefinition:
      "Brassage lent et contrôlé de la pâte d'olives broyées visant à rassembler les micro-gouttelettes d'huile (coalescence) avant la séparation.",
    detailedExplanation:
      "Après le broyage des olives entières (pulpe + noyau), les gouttelettes d'huile sont dispersées en émulsion avec l'eau de végétation. Le malaxeur brasse lentement la pâte (18 à 22 tours/minute) pour rompre les membranes lipoprotéiques et fusionner les gouttelettes en une phase huileuse continue extractible par le décanteur centrifuge.",
    practicalTipBejaia:
      "Un malaxage trop long (> 45 min) ou à l'air libre oxyde les polyphénols. Les 192 huileries à chaîne continue moderne de Béjaïa utilisent des malaxeurs fermés en inox garantissant l'hygiène et la préservation des arômes.",
    normOrThreshold: 'Durée idéale : 25 à 40 min à < 27 °C',
    relatedSectionId: 'annuaire',
    relatedSectionLabel: 'Annuaire des 448 Huileries',
  },
  {
    id: 'alternance-on-off',
    term: 'Alternance bisannuelle (Saison ON / OFF)',
    kabyleTerm: 'Aseggas n lɣella / Aseggas n usteɛfu',
    category: 'agronomie',
    categoryLabel: 'Cycle Végétatif & Verger',
    shortDefinition:
      "Tendance physiologique naturelle de l'olivier à produire une forte récolte une année (année ON), suivie d'une faible récolte l'année suivante (année OFF).",
    detailedExplanation:
      "L'olivier fructifie sur le bois poussé l'année précédente. Lors d'une année de forte charge (ON), le développement des nombreux fruits mobilise l'essentiel des réserves glucidiques et minérales de l'arbre au détriment de la croissance des nouveaux rameaux végétatifs et de l'induction florale pour l'année suivante. Une récolte trop tardive (en janvier-février) aggrave fortement ce phénomène.",
    practicalTipBejaia:
      "À Béjaïa, on atténue l'alternance de moitié grâce à 3 leviers : une récolte précoce (novembre-décembre), une taille annuelle équilibrée en gobelet aéré et un apport organo-minéral couplé à une irrigation déficitaire contrôlée (RDI) lors de la nouaison.",
    normOrThreshold: 'Réduction de 40 % à 60 % par taille & récolte précoce',
    relatedSectionId: 'irrigation',
    relatedSectionLabel: 'Guide Irrigation & Fertilisation',
  },
  {
    id: 'nouaison',
    term: 'Nouaison',
    kabyleTerm: 'Tuṭṭfa n ujeǧǧig',
    category: 'agronomie',
    categoryLabel: 'Cycle Végétatif & Verger',
    shortDefinition:
      "Phase critique post-floraison où l'ovaire de la fleur fécondée se transforme en jeune olive (drupe).",
    detailedExplanation:
      "Sur un olivier adulte produisant des centaines de milliers de fleurs au mois de mai, seules 2 % à 5 % des fleurs aboutissent normalement à un fruit viable. La réussite de la pollinisation croisée (notamment entre Azeradj pollinisateur et Chemlal) et l'absence de stress hydrique ou de vent chaud desséchant (Sirocco) durant la nouaison déterminent directement le volume de la future récolte.",
    practicalTipBejaia:
      "La variété Chemlal étant partiellement auto-incompatible (stérilité mâle), la présence de 10 % à 15 % d'oliviers Azeradj, Bouchouk ou Sigoise dans la parcelle est indispensable pour assurer une bonne nouaison.",
    normOrThreshold: 'Taux de nouaison optimal : 3 % à 5 % des fleurs',
    relatedSectionId: 'varietes',
    relatedSectionLabel: 'Pollinisation & Variétés',
  },
  {
    id: 'grignons-margines',
    term: 'Grignons & Margines',
    kabyleTerm: 'Amurḍus & Afeqqus',
    category: 'sous-produits',
    categoryLabel: 'Économie Circulaire & Sous-Produits',
    shortDefinition:
      "Co-produits solides (grignons : pulpe, peau et fragments de noyaux) et effluents liquides (margines : eaux de végétation) issus de la trituration.",
    detailedExplanation:
      "Lors de l'extraction de 100 kg d'olives, le moulin génère environ 35 à 45 kg de grignons bruts et 40 à 80 litres de margines (selon le système à 2 phases, 3 phases ou presse). Riches en matière organique, potassium et composés phénoliques, ces sous-produits ne doivent jamais être rejetés dans les oueds (notamment l'Oued Soummam) mais valorisés en économie circulaire.",
    practicalTipBejaia:
      "Les grignons dénoyautés servent à l'alimentation du bétail ou au co-compostage avec le fumier et le bois de taille broyé ; les noyaux concassés constituent un biocombustible renouvelable à haut pouvoir calorifique (4 500 kcal/kg).",
    normOrThreshold: 'Épandage contrôlé margines : 50 à 80 m³/ha',
    relatedSectionId: 'sous-produits',
    relatedSectionLabel: 'Valorisation des Sous-Produits',
  },
  {
    id: 'chomage-avine',
    term: 'Chômage & Aviné (Défauts fermentaires)',
    kabyleTerm: 'Zzit iḥemmen / Aɣmal n uzemmur',
    category: 'degustation',
    categoryLabel: 'Analyse Sensorielle COI',
    shortDefinition:
      "Défauts organoleptiques rédhibitoires causés par la fermentation anaérobie ou aérobie des olives entassées avant trituration.",
    detailedExplanation:
      "Le défaut de « Chômé » (fermentation lactique/butyrique au cœur des tas d'olives privés d'oxygène) et le défaut « Aviné-Vinaigré » (fermentation acétique produisant de l'acide acétique et de l'acétate d'éthyle) apparaissent lorsque les olives sont stockées plusieurs jours dans des sacs en jute ou en plastique. La moindre présence de ces défauts déclasse immédiatement l'huile hors de la catégorie Vierge Extra.",
    practicalTipBejaia:
      "Proscrivez définitivement les sacs en polypropylène tissé : utilisez exclusivement des caisses plastiques ventilées de 20 à 25 kg et triturez vos lots dès le retour du verger.",
    normOrThreshold: 'Médiane des défauts = 0,0 (Norme Vierge Extra)',
    relatedSectionId: 'degustation',
    relatedSectionLabel: 'Guide du Consommateur COI',
  },
  {
    id: 'taille-gobelet',
    term: 'Taille en gobelet aéré',
    kabyleTerm: 'Afraas n tzemmurt',
    category: 'agronomie',
    categoryLabel: 'Cycle Végétatif & Verger',
    shortDefinition:
      "Architecture de conduite de l'olivier structurée autour de 3 à 4 charpentières principales ouvertes au centre pour maximiser la pénétration de la lumière.",
    detailedExplanation:
      "Selon le dicton agronomique méditerranéen, « une hirondelle doit pouvoir traverser la frondaison sans toucher une feuille ». En évidant le centre de l'arbre et en maintenant des rameaux fructifères retombants bien éclairés sur le pourtour, la taille en gobelet améliore la photosynthèse, augmente le taux d'huile des fruits et réduit l'humidité stagnante favorable à l'œil de paon et à la fumagine.",
    practicalTipBejaia:
      "Désinfectez systématiquement vos sécateurs et scies à l'alcool ou à l'eau de Javel diluée entre chaque arbre pour éviter de propager la bactérie de la tuberculose (Pseudomonas savastanoi).",
    normOrThreshold: 'Période : Fin février – Fin mars (hors gel)',
    relatedSectionId: 'diagnostic-phytosanitaire',
    relatedSectionLabel: 'Diagnostic Phytosanitaire Bio',
  },
];

interface OliveGlossarySectionProps {
  onNavigate?: (sectionId: string) => void;
}

export const OliveGlossarySection: React.FC<OliveGlossarySectionProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategory>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [highlightedTermId, setHighlightedTermId] = useState<string | null>(null);

  const categories: {
    id: GlossaryCategory;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'all', label: 'Tous les termes', icon: BookOpen },
    { id: 'agronomie', label: 'Cycle & Verger', icon: Sprout },
    { id: 'extraction', label: 'Trituration & Froid', icon: Factory },
    { id: 'chimie', label: 'Polyphénols & Chimie', icon: Droplets },
    { id: 'degustation', label: 'Dégustation COI', icon: Award },
    { id: 'sous-produits', label: 'Sous-Produits', icon: Recycle },
  ];

  // Available first letters from terms
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    OLIVE_GLOSSARY_TERMS.forEach((item) => {
      const firstChar = item.term
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .charAt(0)
        .toUpperCase();
      if (firstChar) letters.add(firstChar);
    });
    return Array.from(letters).sort();
  }, []);

  const filteredTerms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return OLIVE_GLOSSARY_TERMS.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const firstChar = item.term
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .charAt(0)
        .toUpperCase();
      const matchesLetter = selectedLetter === 'ALL' || firstChar === selectedLetter;
      const matchesSearch =
        !q ||
        item.term.toLowerCase().includes(q) ||
        (item.kabyleTerm && item.kabyleTerm.toLowerCase().includes(q)) ||
        item.shortDefinition.toLowerCase().includes(q) ||
        item.detailedExplanation.toLowerCase().includes(q) ||
        item.practicalTipBejaia.toLowerCase().includes(q);
      return matchesCat && matchesLetter && matchesSearch;
    });
  }, [searchQuery, selectedCategory, selectedLetter]);

  const handleCopyTerm = async (item: GlossaryTerm) => {
    const textToCopy = `${item.term}${item.kabyleTerm ? ` (${item.kabyleTerm})` : ''} — ${item.shortDefinition}\n${item.detailedExplanation}\nConseil ADOIO Béjaïa : ${item.practicalTipBejaia}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSelectGlossaryTerm = (termId: string) => {
    setSelectedCategory('all');
    setSelectedLetter('ALL');
    setSearchQuery('');
    setHighlightedTermId(termId);
    setTimeout(() => {
      const el = document.getElementById(`glossary-term-${termId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 80);
    setTimeout(() => {
      setHighlightedTermId((prev) => (prev === termId ? null : prev));
    }, 4500);
  };

  const scrollToQuiz = () => {
    const el = document.getElementById('quiz-oleicole');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="glossaire-oleicole"
      className="py-16 sm:py-20 bg-[#FAF7F2] border-t border-[#E6DEC9] scroll-mt-44"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <BookOpen className="w-4 h-4 text-[#E6AB3C]" />
              <span>Référentiel Technique ADOIO · Pilier 3</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight text-balance">
              Glossaire Oléicole & Terminologie du Moulin
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#436229] leading-relaxed">
              Définitions claires et repères pratiques pour les oléiculteurs et mouliniers de la wilaya de Béjaïa : maîtrisez les notions clés du verger et du laboratoire COI (<strong>extraction à froid</strong>, <strong>débourrement</strong>, <strong>polyphénols</strong>, <strong>véraison</strong>, <strong>acidité libre</strong>, <strong>ardence</strong>) avec leurs équivalents en langue kabyle.
            </p>
          </div>

          {/* Summary Counter & Quiz CTA */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="flex items-center gap-4 text-xs text-[#436229] bg-[#F4EEE1] px-4 py-3 rounded-2xl border border-[#E6DEC9] tabular-nums">
              <div>
                <span className="font-serif font-bold text-xl text-[#18230F] block leading-none">
                  {filteredTerms.length} / {OLIVE_GLOSSARY_TERMS.length}
                </span>
                <span className="text-[11px] text-[#567B34] font-medium">
                  termes techniques affichés
                </span>
              </div>
              <span aria-hidden="true" className="text-[#E6DEC9] text-lg">
                |
              </span>
              <div className="text-[11px] text-[#31491E] leading-snug">
                <strong className="block text-[#18230F]">Normes COI & Terrain</strong>
                <span>Français · Tamazight (Kabyle)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToQuiz}
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-[#18230F] text-[#FAF7F2] hover:bg-[#31491E] text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#E6AB3C]" />
              <span>Quiz Oléicole (3 Niveaux)</span>
            </button>
          </div>
        </div>

        {/* Search & Interactive Category Filters */}
        <div className="bg-[#F4EEE1] rounded-2xl p-4 sm:p-5 border border-[#E6DEC9] mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#567B34] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un terme (ex. extraction à froid, débourrement, polyphénols, véraison, ardence...)"
                aria-label="Rechercher un terme dans le glossaire oléicole"
                className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-[#E6DEC9] text-xs sm:text-sm text-[#18230F] placeholder-[#6F9D44] focus:outline-none focus:border-[#31491E]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[#567B34] hover:text-[#18230F] cursor-pointer"
                  aria-label="Effacer la recherche"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Alphabetical Quick Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setSelectedLetter('ALL')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedLetter === 'ALL'
                    ? 'bg-[#233416] text-white'
                    : 'bg-white text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                }`}
              >
                A–Z
              </button>
              {availableLetters.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() =>
                    setSelectedLetter((prev) => (prev === letter ? 'ALL' : letter))
                  }
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center justify-center ${
                    selectedLetter === letter
                      ? 'bg-[#E6AB3C] text-[#18230F]'
                      : 'bg-white text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Functional Segmented Category Controls */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E6DEC9]/70">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'bg-white text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-[#E6AB3C]' : 'text-[#567B34]'
                    }`}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {/* Quick preset term buttons */}
            <div className="ml-auto hidden xl:flex items-center gap-2 text-xs text-[#436229]">
              <span className="font-medium text-[#567B34]">Accès rapide :</span>
              {['Extraction à froid', 'Débourrement', 'Polyphénols', 'Véraison'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLetter('ALL');
                    setSearchQuery(preset);
                  }}
                  className="underline decoration-[#567B34]/50 hover:text-[#18230F] cursor-pointer transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Glossary Cards Grid */}
        {filteredTerms.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#E6DEC9] space-y-3">
            <p className="font-serif text-lg font-bold text-[#18230F]">
              Aucun terme ne correspond à votre filtre actuel.
            </p>
            <p className="text-xs text-[#436229]">
              Essayez un autre mot-clé (ex. « froid », « polyphénols », « taille ») ou réinitialisez les filtres.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLetter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-[#31491E] text-white text-xs font-bold hover:bg-[#233416] transition-colors cursor-pointer"
            >
              Afficher les {OLIVE_GLOSSARY_TERMS.length} termes du glossaire
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTerms.map((item) => {
              const isCopied = copiedId === item.id;
              const isHighlighted = highlightedTermId === item.id;
              return (
                <article
                  key={item.id}
                  id={`glossary-term-${item.id}`}
                  className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 scroll-mt-36 ${
                    isHighlighted
                      ? 'border-[#31491E] ring-2 ring-[#E6AB3C] shadow-md bg-[#FAF7F2]'
                      : 'border-[#E6DEC9] hover:border-[#8CBE5D]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Unboxed clean metadata kicker with typographic separators */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#567B34]">
                        <span className="font-bold uppercase tracking-wider text-[#31491E]">
                          {item.categoryLabel}
                        </span>
                        {item.normOrThreshold && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-[11px] tabular-nums text-[#436229]">
                              {item.normOrThreshold}
                            </span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopyTerm(item)}
                        title="Copier la fiche définition"
                        aria-label={`Copier la définition de ${item.term}`}
                        className="p-1.5 rounded-lg text-[#567B34] hover:bg-[#F4EEE1] hover:text-[#18230F] transition-colors cursor-pointer shrink-0"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-[#31491E]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Term Title & Kabyle Translation */}
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#18230F] leading-snug">
                        {item.term}
                      </h3>
                      {item.kabyleTerm && (
                        <p className="text-xs font-serif italic text-[#567B34] mt-0.5">
                          Appellation kabyle : « {item.kabyleTerm} »
                        </p>
                      )}
                    </div>

                    {/* Short Definition Lead */}
                    <p className="text-xs sm:text-sm font-semibold text-[#233416] leading-relaxed">
                      {item.shortDefinition}
                    </p>

                    {/* Detailed Agronomic / Technical Explanation */}
                    <p className="text-xs text-[#436229] leading-relaxed">
                      {item.detailedExplanation}
                    </p>
                  </div>

                  {/* Practical Field Recommendation for Bejaia Growers */}
                  <div className="pt-3 border-t border-[#E6DEC9]/70 space-y-2.5">
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs text-[#233416] leading-relaxed">
                      <span className="font-bold text-[#31491E] block mb-0.5">
                        Repère pratique Oléiculteur Béjaïa (ADOIO) :
                      </span>
                      <span>{item.practicalTipBejaia}</span>
                    </div>

                    {item.relatedSectionId && onNavigate && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => onNavigate(item.relatedSectionId!)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#31491E] hover:text-[#18230F] transition-colors cursor-pointer"
                        >
                          <span>Approfondir : {item.relatedSectionLabel}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#E6AB3C]" />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Interactive Quiz Oléicole with 3-Level Progression */}
        <div className="mt-12 pt-10 border-t border-[#E6DEC9]">
          <OliveQuiz
            onSelectGlossaryTerm={handleSelectGlossaryTerm}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </section>
  );
};
