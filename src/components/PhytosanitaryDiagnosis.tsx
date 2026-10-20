import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  Bug,
  Leaf,
  TreePine,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Droplets,
  Search,
  Info,
  Sprout,
  Award
} from 'lucide-react';

export type SymptomOrgan = 'feuilles' | 'fruits' | 'rameaux' | 'arbre';

export interface SymptomItem {
  id: string;
  organ: SymptomOrgan;
  organLabel: string;
  label: string;
  detail: string;
}

export interface DiseaseProfile {
  id: string;
  name: string;
  scientificName: string;
  kabyleTerm: string;
  category: 'Ravageur (Insecte)' | 'Maladie Fongique' | 'Maladie Vasculaire du Sol' | 'Maladie Bactérienne';
  severity: 'Élevée' | 'Critique' | 'Modérée';
  peakPeriod: string;
  symptomIds: string[];
  primarySymptomsSummary: string;
  favorableConditions: string;
  bioTreatments: {
    title: string;
    productOrMethod: string;
    dosageAndTiming: string;
  }[];
  prophylaxisActions: string[];
  varietalSensitivity: string;
}

const SYMPTOMS_CATALOG: SymptomItem[] = [
  // Feuilles
  {
    id: 'taches-circulaires-paon',
    organ: 'feuilles',
    organLabel: 'Feuilles',
    label: 'Taches circulaires concentriques (« œil de paon »)',
    detail: 'Auréoles brunes/noires entourées d’un halo jaune sur la face supérieure des feuilles.',
  },
  {
    id: 'chute-precoce-feuilles',
    organ: 'feuilles',
    organLabel: 'Feuilles',
    label: 'Jaunissement et défoliation précoce du bas de la frondaison',
    detail: 'Chute importante des feuilles au printemps ou à l’automne, rameaux dégarnis.',
  },
  {
    id: 'enduit-noir-fumagine',
    organ: 'feuilles',
    organLabel: 'Feuilles',
    label: 'Dépôt noirâtre semblable à de la suie (fumagine)',
    detail: 'Pellicule noire recouvrant les feuilles et réduisant la photosynthèse.',
  },
  {
    id: 'feuilles-enroulees-seches',
    organ: 'feuilles',
    organLabel: 'Feuilles',
    label: 'Feuilles desséchées qui restent accrochées aux rameaux',
    detail: 'Les feuilles brunissent brutalement, s’enroulent vers le bas et ne tombent pas immédiatement.',
  },
  {
    id: 'galeries-mineuses-feuilles',
    organ: 'feuilles',
    organLabel: 'Feuilles',
    label: 'Jeunes feuilles rongées ou minées au printemps',
    detail: 'Galeries sinueuses dans le limbe foliaire et bourgeons terminaux attaqués.',
  },

  // Fruits & Fleurs
  {
    id: 'piqures-triangulaires-fruits',
    organ: 'fruits',
    organLabel: 'Olives & Fleurs',
    label: 'Piqûres de ponte en entaille sur les olives vertes ou tournantes',
    detail: 'Petites taches brunes triangulaires à la surface de la drupe dès juillet-septembre.',
  },
  {
    id: 'galeries-pulpe-trous-sortie',
    organ: 'fruits',
    organLabel: 'Olives & Fleurs',
    label: 'Galeries larvaires dans la pulpe et trous de sortie ronds',
    detail: 'Pulpe ramollie et brunie, présence d’asticots blancs ou de trous de sortie, hausse de l’acidité.',
  },
  {
    id: 'chute-prematurée-olives',
    organ: 'fruits',
    organLabel: 'Olives & Fleurs',
    label: 'Chute prématurée des olives au sol (septembre – novembre)',
    detail: 'Les fruits tombent avant maturité ou présentent un trou au niveau du pédoncule.',
  },
  {
    id: 'amas-cotonneux-fleurs',
    organ: 'fruits',
    organLabel: 'Olives & Fleurs',
    label: 'Amas cotonneux blancs et cireux sur les boutons floraux',
    detail: 'Manchons blancs d’aspect cotonneux au printemps (avril-mai) provoquant la coulure des fleurs.',
  },
  {
    id: 'boutons-floraux-toiles',
    organ: 'fruits',
    organLabel: 'Olives & Fleurs',
    label: 'Boutons floraux perforés et reliés par de fins fils soyeux',
    detail: 'Chenilles verdâtres dévorant l’intérieur des fleurs avant la nouaison.',
  },

  // Rameaux & Écorce
  {
    id: 'dessechement-unilateral-rameau',
    organ: 'rameaux',
    organLabel: 'Rameaux & Bois',
    label: 'Dessèchement brutal d’une seule branche ou d’un secteur de l’arbre',
    detail: 'Apoplexie estivale ou printanière touchant un côté de l’olivier tandis que le reste demeure vert.',
  },
  {
    id: 'brunissement-vaisseaux-bois',
    organ: 'rameaux',
    organLabel: 'Rameaux & Bois',
    label: 'Anneau brun-noirâtre sous l’écorce (coupe transversale du rameau)',
    detail: 'Coloration brune des vaisseaux du xylème visible lorsqu’on coupe la branche atteinte.',
  },
  {
    id: 'galles-tumeurs-rameaux',
    organ: 'rameaux',
    organLabel: 'Rameaux & Bois',
    label: 'Excroissances ligneuses et tumeurs crevassées (broussins/chancres)',
    detail: 'Tumeurs verruqueuses de 1 à 3 cm sur les jeunes rameaux et branches, souvent après grêle ou gaulage.',
  },
  {
    id: 'boucliers-noirs-H',
    organ: 'rameaux',
    organLabel: 'Rameaux & Bois',
    label: 'Carapaces brunes/noires bombées avec un « H » en relief sur les rameaux',
    detail: 'Insectes immobiles fixés sur les brindilles et sous les feuilles, sécrétant du miellat collant.',
  },
];

const DISEASES_DATABASE: DiseaseProfile[] = [
  {
    id: 'mouche-olive',
    name: "Mouche de l'Olive",
    scientificName: 'Bactrocera oleae',
    kabyleTerm: 'Thizimth n’uzemmour',
    category: 'Ravageur (Insecte)',
    severity: 'Critique',
    peakPeriod: 'Juillet à Novembre (jusqu’à la véraison)',
    symptomIds: [
      'piqures-triangulaires-fruits',
      'galeries-pulpe-trous-sortie',
      'chute-prematurée-olives',
    ],
    primarySymptomsSummary:
      'Piqûres de ponte sur les drupes, galeries larvaires dégradant la pulpe, chute précoce des olives et forte hausse de l’acidité oléique et de l’indice de peroxyde.',
    favorableConditions:
      'Été modéré (20–30 °C), humidité atmosphérique ou fonds de vallées irrigués (Soummam, Sidi-Aïch, El Kseur), variétés à gros calibre (Bouchouk, Azeradj).',
    bioTreatments: [
      {
        title: 'Barrière minérale préventive à l’Argile Kaolinite calcinée',
        productOrMethod: 'Pulvérisation foliaire de Kaolin pur (30 à 50 g/L d’eau)',
        dosageAndTiming:
          'Dès le durcissement du noyau (fin juin / début juillet), renouveler après un lessivage pluvieux (> 20 mm). Le film blanc camoufle l’olive et empêche la ponte tout en réduisant le stress thermique.',
      },
      {
        title: 'Piégeage massif (Attract & Kill) & Pièges McPhail / Bouteilles',
        productOrMethod: 'Pièges alimentaires au phosphate diammonique (30 à 40 g/L) ou capsules de phéromones sexuelles',
        dosageAndTiming:
          'Poser 1 piège par arbre (ou 1 sur 2 dans les grands vergers) côté Sud/Sud-Ouest à hauteur d’homme dès juin. Renouveler la solution toutes les 3 à 4 semaines.',
      },
      {
        title: 'Biocontrôle au Spinosad (Appât localisé)',
        productOrMethod: 'Traitement par taches (1 m² de frondaison par arbre) à base de Spinosad homologué Bio',
        dosageAndTiming:
          'Uniquement si le seuil de capture dépasse 5 mouches/piège/semaine ou 2 à 3 % de fruits piqués.',
      },
    ],
    prophylaxisActions: [
      'Avancer la récolte (novembre – début décembre) dès la véraison tournante pour stopper le dernier cycle larvaire.',
      'Triturer les olives en moins de 24 heures dans des caisses ventilées pour bloquer le développement fongique dans les galeries.',
      'Travailler superficiellement le sol sous la frondaison en hiver pour exposer les pupes au froid et aux oiseaux prédateurs.',
    ],
    varietalSensitivity:
      'Bouchouk et Azeradj (gros calibre) sont plus attractives tôt en saison ; Chemlal et Limli sont touchées plus tardivement à l’automne.',
  },
  {
    id: 'verticilliose',
    name: "Verticilliose de l'Olivier",
    scientificName: 'Verticillium dahliae',
    kabyleTerm: 'Aqor n’tachetta (Dessèchement vasculaire)',
    category: 'Maladie Vasculaire du Sol',
    severity: 'Critique',
    peakPeriod: 'Printemps (Avril – Juin) & Fin d’été',
    symptomIds: [
      'dessechement-unilateral-rameau',
      'feuilles-enroulees-seches',
      'brunissement-vaisseaux-bois',
    ],
    primarySymptomsSummary:
      'Flétrissement et dessèchement soudain (apoplexie) d’une charpentière ou d’un secteur de l’arbre ; les feuilles mortes brunes restent enroulées et attachées aux rameaux ; anneau brun dans les vaisseaux du bois.',
    favorableConditions:
      'Sols lourds ou humides, excès d’eau ou d’azote, cultures intercalaires sensibles aux solanacées/maraîchage (tomate, pomme de terre, piment, pastèque) et blessures racinaires par labours profonds.',
    bioTreatments: [
      {
        title: 'Antagonisme fongique biologique de la rhizosphère (Trichoderma)',
        productOrMethod: 'Inoculation du sol avec Trichoderma harzianum / Trichoderma asperellum et mycorhizes',
        dosageAndTiming:
          'Application au printemps et à l’automne par arrosage au pied ou via le goutte-à-goutte avec des acides humiques pour coloniser la rhizosphère et bloquer le champignon tellurique.',
      },
      {
        title: 'Biofumigation & Amendement en Compost Mûr ADOIO',
        productOrMethod: 'Incorporation superficielle de compost mûr riche en microflore suppressive et engrais vert de crucifères (moutarde)',
        dosageAndTiming:
          'Fin d’hiver : stimule l’activité microbienne antagoniste des microsclérotes de Verticillium dans le sol.',
      },
      {
        title: 'Assainissement chirurgical des branches atteintes',
        productOrMethod: 'Coupe sanitaire en dessous de la zone brunie et masticage au cuivre bio',
        dosageAndTiming:
          'Par temps sec : brûler ou évacuer immédiatement hors du verger les bois et feuilles contaminés (ne jamais les broyer sur place).',
      },
    ],
    prophylaxisActions: [
      'Bannir absolument les cultures maraîchères intercalaires (tomate, pomme de terre, poivron, aubergine, melon) entre les rangs d’oliviers.',
      'Arrêter les labours profonds au tracteur qui sectionnent les racines et propagent les microsclérotes d’un arbre à l’autre.',
      'Désinfecter systématiquement les sécateurs et scies à l’alcool à 70° ou à l’eau de Javel diluée entre chaque arbre.',
    ],
    varietalSensitivity:
      'Les jeunes plantations irriguées intensivement sont les plus vulnérables ; l’enherbement spontané et la fertilisation organique équilibrée renforcent la résilience.',
  },
  {
    id: 'oeil-de-paon',
    name: "Œil de Paon (Tavelure / Cycloconium)",
    scientificName: 'Spilocea oleagina (Fusicladium oleagineum)',
    kabyleTerm: 'Thitt n’Tawes',
    category: 'Maladie Fongique',
    severity: 'Élevée',
    peakPeriod: 'Automne (Octobre – Novembre) & Printemps (Mars – Avril)',
    symptomIds: [
      'taches-circulaires-paon',
      'chute-precoce-feuilles',
    ],
    primarySymptomsSummary:
      'Taches rondes gris-brun auréolées de jaune sur la face supérieure des feuilles (« œil de paon »), suivies d’une chute massive des feuilles basses et d’un affaiblissement de la nouaison.',
    favorableConditions:
      'Forte humidité (> 80 %), brouillards persistants dans les bas-fonds de la vallée de la Soummam, températures douces (10 à 20 °C) et frondaisons trop denses mal aérées.',
    bioTreatments: [
      {
        title: 'Traitement cuprique préventif homologué en Agriculture Biologique',
        productOrMethod: 'Bouillie bordelaise ou Hydroxyde / Oxychlorure de cuivre à dose raisonnée',
        dosageAndTiming:
          'Deux applications clés : 1) juste après la récolte / taille de fin d’hiver (février-mars) avant les pluies printanières, et 2) au début de l’automne (septembre-octobre) sur variétés sensibles.',
      },
      {
        title: 'Stimulation des défenses naturelles (Bicarbonate de potassium & Prêle)',
        productOrMethod: 'Décoction de prêle riche en silice + Bicarbonate de potassium en alternance',
        dosageAndTiming:
          'Au printemps pour assécher le mycélium superficiel et limiter le cumul annuel de cuivre métal dans le sol.',
      },
    ],
    prophylaxisActions: [
      'Pratiquer une taille d’éclaircie (« en gobelet aéré ») permettant au soleil et au vent de sécher rapidement le cœur de l’arbre.',
      'Éviter les excès de fumure azotée qui produisent un feuillage tendre très réceptif au champignon.',
    ],
    varietalSensitivity:
      'Sensibilité marquée dans les zones humides de basse vallée ; l’aération de la couronne réduit l’incidence de plus de 60 %.',
  },
  {
    id: 'psylle-olivier',
    name: "Psylle de l'Olivier (Coton des fleurs)",
    scientificName: 'Euphyllura olivina',
    kabyleTerm: 'Thadout n’uzemmour (Coton blanc)',
    category: 'Ravageur (Insecte)',
    severity: 'Modérée',
    peakPeriod: 'Printemps (Avril – Mai, stade boutons floraux)',
    symptomIds: [
      'amas-cotonneux-fleurs',
      'enduit-noir-fumagine',
    ],
    primarySymptomsSummary:
      'Sécrétion d’une cire blanche d’aspect cotonneux enveloppant les grappes florales et les jeunes pousses, succion de la sève et coulure florale en cas de forte colonie (> 10 larves par grappe).',
    favorableConditions:
      'Printemps doux et humides, vergers non taillés à frondaison touffue, absence de punaises prédatrices (Anthocorides) suite à des traitements chimiques non sélectifs.',
    bioTreatments: [
      {
        title: 'Lavage au Savon Noir Agricole (Sels potassiques d’acides gras)',
        productOrMethod: 'Savon noir liquide potassique dilué à 1,5 – 2 % (15 à 20 mL/L d’eau)',
        dosageAndTiming:
          'Pulvérisation mouillante avant l’ouverture des fleurs (stade boutons verts) pour dissoudre le manchon cireux protecteur et asphyxier les larves sans nuire aux abeilles.',
      },
      {
        title: 'Poudrage ou pulvérisation d’Argile Kaolinite / Bentonite',
        productOrMethod: 'Suspension de Kaolin à 3 % au stade pré-floral',
        dosageAndTiming:
          'Perturbe la fixation et la ponte des adultes au printemps.',
      },
    ],
    prophylaxisActions: [
      'Préserver la faune auxiliaire naturelle (punaises Anthocorides, chrysopes, coccinelles, hyménoptères parasitoïdes Psyllaephagus) en proscrivant tout insecticide chimique.',
      'Supprimer les gourmands internes qui abritent les premiers foyers printaniers.',
    ],
    varietalSensitivity:
      'Présent dans toute la Kabylie au printemps ; rarement nuisible sous le seuil de 8 à 10 larves par inflorescence si les auxiliaires sont préservés.',
  },
  {
    id: 'cochenille-fumagine',
    name: "Cochenille Noire & Fumagine (Noir de l'Olivier)",
    scientificName: 'Saissetia oleae + Capnodium oleaginum',
    kabyleTerm: 'Berrouk / Thikhoukhin (Suie noire)',
    category: 'Ravageur (Insecte)',
    severity: 'Élevée',
    peakPeriod: 'Printemps & Été (éclosion des larves mobiles en Juin – Juillet)',
    symptomIds: [
      'enduit-noir-fumagine',
      'boucliers-noirs-H',
      'chute-precoce-feuilles',
    ],
    primarySymptomsSummary:
      'Carapaces brunes/noires portant deux carènes transversales et une longitudinale formant la lettre « H ». Le miellat sucré sécrété provoque le développement de la fumagine (suie noire) qui asphyxie l’arbre.',
    favorableConditions:
      'Frondaison fermée et humide, excès d’azote, vergers encaissés peu ventilés.',
    bioTreatments: [
      {
        title: 'Lavage au Savon Noir Potassique + Huile Blanche Paraffinique Bio',
        productOrMethod: 'Savon noir (2 %) suivi d’une huile minérale blanche d’été homologuée Bio (au stade larves mobiles)',
        dosageAndTiming:
          'Cibler impérativement la sortie des jeunes larves mobiles (« stade L1 » en fin juin / juillet), moment où la carapace cireuse n’est pas encore formée.',
      },
      {
        title: 'Traitement cuprique d’assainissement contre la Fumagine',
        productOrMethod: 'Bouillie bordelaise légère après lavage au savon noir',
        dosageAndTiming:
          'Fait sécher et se détacher les croûtes noires de fumagine pour restaurer la photosynthèse des feuilles.',
      },
    ],
    prophylaxisActions: [
      'La taille d’aération sévère est le meilleur remède : la chaleur estivale (> 35 °C) et le rayonnement solaire direct au cœur de l’arbre tuent naturellement plus de 80 % des jeunes larves de cochenilles.',
    ],
    varietalSensitivity:
      'Tous les cultivars kabyles en cas d’abandon de taille ou de plantation trop serrée.',
  },
  {
    id: 'teigne-olivier',
    name: "Teigne de l'Olivier",
    scientificName: 'Prays oleae',
    kabyleTerm: 'Thimess n’uzemmour (Chenille des fleurs et du noyau)',
    category: 'Ravageur (Insecte)',
    severity: 'Modérée',
    peakPeriod: '3 générations : Feuilles (Fév-Mars), Fleurs (Avril-Mai), Fruits (Juin & Septembre)',
    symptomIds: [
      'boutons-floraux-toiles',
      'galeries-mineuses-feuilles',
      'chute-prematurée-olives',
    ],
    primarySymptomsSummary:
      'Trois générations annuelles : 1) chenilles mineuses des feuilles en fin d’hiver, 2) chenilles dévorant les boutons floraux reliés par des fils de soie au printemps, 3) chenilles pénétrant dans le noyau provoquant la chute des olives en juin et septembre.',
    favorableConditions:
      'Hivers doux suivis de printemps secs lors de la floraison.',
    bioTreatments: [
      {
        title: 'Biocontrôle microbiologique au Bacillus thuringiensis (Bt kurstaki)',
        productOrMethod: 'Pulvérisation de Bacillus thuringiensis subsp. kurstaki homologué Bio',
        dosageAndTiming:
          'Appliquer le soir (sensible aux UV) sur la génération anthophage (stade boutons floraux gonflés, avant l’ouverture de plus de 10 % des fleurs) si plus de 10 % des grappes sont attaquées.',
      },
      {
        title: 'Suivi par pièges Delta à phéromones sexuelles',
        productOrMethod: 'Pièges englués à capsules de phéromone de Prays oleae',
        dosageAndTiming:
          'Installation dès fin mars pour détecter le pic de vol et positionner exactement le traitement au Bt.',
      },
    ],
    prophylaxisActions: [
      'Ne jamais traiter pendant la pleine floraison afin de protéger les insectes pollinisateurs et la faune utile.',
    ],
    varietalSensitivity:
      'Plus marquée sur les variétés à floraison groupée et drupes moyennes à grosses.',
  },
  {
    id: 'tuberculose-olivier',
    name: "Tuberculose de l'Olivier (Chancre bactérien)",
    scientificName: 'Pseudomonas savastanoi',
    kabyleTerm: 'Thizourin / Tumeurs des rameaux',
    category: 'Maladie Bactérienne',
    severity: 'Modérée',
    peakPeriod: 'Toute l’année (infections lors des pluies après gaulage, taille ou grêle)',
    symptomIds: [
      'galles-tumeurs-rameaux',
      'dessechement-unilateral-rameau',
    ],
    primarySymptomsSummary:
      'Excroissances parenchymateuses verruqueuses et crevassées (tumeurs ou galles de 0,5 à 3 cm) sur les rameaux, branches et parfois le tronc, entravant la circulation de la sève.',
    favorableConditions:
      'Blessures mécaniques causées par le gaulage à la perche lors de la récolte, épisodes de grêle, gelées ou taille par temps pluvieux.',
    bioTreatments: [
      {
        title: 'Protection cuprique immédiate des plaies (Cuivre Bio)',
        productOrMethod: 'Pulvérisation de Bouillie bordelaise ou Hydroxyde de cuivre',
        dosageAndTiming:
          'Dans les 24 à 48 heures suivant la récolte, la taille ou un orage de grêle pour cicatriser et aseptiser les micro-blessures de l’écorce.',
      },
      {
        title: 'Élimination sanitaire par temps sec',
        productOrMethod: 'Suppression des rameaux porteurs de tumeurs en été (juillet-août)',
        dosageAndTiming:
          'Tailler en période chaude et sèche lorsque la bactérie est inactive, en désinfectant la lame entre chaque coupe.',
      },
    ],
    prophylaxisActions: [
      'Remplacer impérativement le gaulage brutal à la perche par des peignes vibreurs ou manuels et des filets au sol.',
      'Lors de la taille annuelle, tailler les arbres atteints de tuberculose en tout dernier lieu.',
    ],
    varietalSensitivity:
      'Sensibilité accrue dans les vergers récoltés par gaulage traditionnel.',
  },
];

export const PhytosanitaryDiagnosis: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'piqures-triangulaires-fruits',
    'galeries-pulpe-trous-sortie',
  ]);
  const [activeOrganFilter, setActiveOrganFilter] = useState<'all' | SymptomOrgan>('all');
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setSelectedDiseaseId(null);
  };

  const resetDiagnosis = () => {
    setSelectedSymptoms([]);
    setSelectedDiseaseId(null);
  };

  // Compute ranked disease matches based on selected symptoms
  const diagnosedDiseases = useMemo(() => {
    return DISEASES_DATABASE.map((disease) => {
      const matchedSymptoms = disease.symptomIds.filter((sId) =>
        selectedSymptoms.includes(sId)
      );
      const matchCount = matchedSymptoms.length;
      const totalDiseaseSymptoms = disease.symptomIds.length;
      const confidencePct =
        selectedSymptoms.length === 0
          ? 0
          : Math.round((matchCount / totalDiseaseSymptoms) * 100);

      return {
        disease,
        matchedSymptoms,
        matchCount,
        confidencePct,
      };
    }).sort((a, b) => {
      if (b.confidencePct !== a.confidencePct) {
        return b.confidencePct - a.confidencePct;
      }
      return b.matchCount - a.matchCount;
    });
  }, [selectedSymptoms]);

  const activeDiagnostic = useMemo(() => {
    if (selectedDiseaseId) {
      return (
        diagnosedDiseases.find((d) => d.disease.id === selectedDiseaseId) ||
        diagnosedDiseases[0]
      );
    }
    return diagnosedDiseases[0];
  }, [diagnosedDiseases, selectedDiseaseId]);

  const filteredSymptoms =
    activeOrganFilter === 'all'
      ? SYMPTOMS_CATALOG
      : SYMPTOMS_CATALOG.filter((s) => s.organ === activeOrganFilter);

  const organTabs: { id: 'all' | SymptomOrgan; label: string; count: number }[] = [
    { id: 'all', label: 'Tous les organes', count: SYMPTOMS_CATALOG.length },
    {
      id: 'feuilles',
      label: 'Feuilles',
      count: SYMPTOMS_CATALOG.filter((s) => s.organ === 'feuilles').length,
    },
    {
      id: 'fruits',
      label: 'Olives & Fleurs',
      count: SYMPTOMS_CATALOG.filter((s) => s.organ === 'fruits').length,
    },
    {
      id: 'rameaux',
      label: 'Rameaux & Bois',
      count: SYMPTOMS_CATALOG.filter((s) => s.organ === 'rameaux').length,
    },
  ];

  // Quick clinical case presets
  const clinicalPresets = [
    {
      label: "Cas 1 : Mouche de l'Olive",
      symptoms: ['piqures-triangulaires-fruits', 'galeries-pulpe-trous-sortie', 'chute-prematurée-olives'],
    },
    {
      label: 'Cas 2 : Verticilliose (Branche sèche)',
      symptoms: ['dessechement-unilateral-rameau', 'feuilles-enroulees-seches', 'brunissement-vaisseaux-bois'],
    },
    {
      label: 'Cas 3 : Œil de Paon',
      symptoms: ['taches-circulaires-paon', 'chute-precoce-feuilles'],
    },
    {
      label: 'Cas 4 : Psylle (Coton blanc)',
      symptoms: ['amas-cotonneux-fleurs'],
    },
    {
      label: 'Cas 5 : Cochenille & Fumagine',
      symptoms: ['enduit-noir-fumagine', 'boucliers-noirs-H'],
    },
  ];

  return (
    <section
      id="diagnostic-phytosanitaire"
      className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9] scroll-mt-36"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#31491E]/10 border border-[#31491E]/20 text-xs font-bold uppercase tracking-wider text-[#31491E] mb-3">
              <Stethoscope className="w-4 h-4 text-[#567B34]" />
              <span>Clinique Végétale & Protection Biologique ADOIO</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              Module de Diagnostic Phytosanitaire & Traitements Bio
            </h2>
            <p className="mt-3 text-base text-[#436229] leading-relaxed">
              Sélectionnez les symptômes observés au verger sur les feuilles, les olives, les fleurs ou les rameaux pour identifier les maladies et ravageurs courants en Kabylie (<strong>mouche de l’olive, verticilliose, œil de paon, psylle, cochenille, teigne, tuberculose</strong>) et obtenir un protocole de lutte biologique respectueux du cahier des charges Vierge Extra.
            </p>
          </div>

          {/* Raccourcis de cas cliniques types */}
          <div className="bg-white p-3.5 rounded-2xl border border-[#D5C7A3] space-y-2 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] block">
              Simuler un cas clinique fréquent au verger :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {clinicalPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setSelectedSymptoms(preset.symptoms);
                    setSelectedDiseaseId(null);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#FAF7F2] hover:bg-[#31491E] text-[#31491E] hover:text-white border border-[#E6DEC9] transition-all cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Diagnostic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLONNE GAUCHE : SÉLECTION DES SYMPTÔMES OBSERVÉS */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E6DEC9]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#18230F] flex items-center gap-2">
                  <Search className="w-5 h-5 text-[#31491E]" />
                  <span>1. Symptômes observés sur vos oliviers</span>
                </h3>
                <p className="text-xs text-[#567B34] mt-0.5">
                  Cochez un ou plusieurs signes visibles ({selectedSymptoms.length} sélectionné{selectedSymptoms.length > 1 ? 's' : ''})
                </p>
              </div>

              {selectedSymptoms.length > 0 && (
                <button
                  type="button"
                  onClick={resetDiagnosis}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border border-[#D5C7A3] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>

            {/* Filtres par organe */}
            <div className="flex flex-wrap gap-1.5 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#E6DEC9]">
              {organTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveOrganFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 flex-1 justify-center ${
                    activeOrganFilter === tab.id
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'text-[#436229] hover:text-[#18230F]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeOrganFilter === tab.id
                        ? 'bg-[#E6AB3C] text-[#18230F]'
                        : 'bg-[#E6DEC9] text-[#18230F]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Liste des symptômes à cocher */}
            <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1">
              {filteredSymptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    type="button"
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#F4F9EC] border-2 border-[#31491E] shadow-2xs'
                        : 'bg-[#FAF7F2]/70 border-[#E6DEC9] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        isSelected
                          ? 'bg-[#31491E] border-[#31491E] text-white'
                          : 'bg-white border-[#D5C7A3]'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#18230F]">
                          {symptom.label}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#E6DEC9] text-[#567B34] shrink-0">
                          {symptom.organLabel}
                        </span>
                      </div>
                      <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                        {symptom.detail}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* COLONNE DROITE : RÉSULTAT DU DIAGNOSTIC & PROTOCOLE BIO */}
          <div className="lg:col-span-6 space-y-6">
            {/* Barre des correspondances identifiées */}
            <div className="bg-white rounded-3xl border border-[#E6DEC9] p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                  2. Pathologies & Ravageurs compatibles
                </span>
                <span className="text-[11px] text-[#436229]">
                  Cliquez sur une fiche pour consulter son protocole bio
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {diagnosedDiseases.slice(0, 4).map((item) => {
                  const isCurrent = activeDiagnostic.disease.id === item.disease.id;
                  return (
                    <button
                      key={item.disease.id}
                      type="button"
                      onClick={() => setSelectedDiseaseId(item.disease.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isCurrent
                          ? 'bg-[#18230F] text-white border-[#18230F]'
                          : 'bg-[#FAF7F2] text-[#18230F] border-[#E6DEC9] hover:border-[#31491E]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">
                          {item.disease.name}
                        </span>
                        <span
                          className={`text-[10px] italic block truncate ${
                            isCurrent ? 'text-[#B0D984]' : 'text-[#567B34]'
                          }`}
                        >
                          {item.disease.scientificName}
                        </span>
                      </div>

                      <span
                        className={`font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg shrink-0 ${
                          item.confidencePct >= 66
                            ? 'bg-[#E6AB3C] text-[#18230F]'
                            : item.confidencePct > 0
                            ? 'bg-[#E8F4D9] text-[#31491E]'
                            : 'bg-white/15 text-[#999]'
                        }`}
                      >
                        {item.confidencePct}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fiche détaillée de la maladie / ravageur diagnostiqué */}
            {activeDiagnostic && (
              <div className="bg-gradient-to-br from-[#18230F] via-[#223315] to-[#31491E] text-white rounded-3xl p-6 sm:p-8 border border-[#8CBE5D]/30 shadow-xl space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-white/15">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E6AB3C] text-[#18230F] text-[10px] font-extrabold uppercase tracking-wider">
                        {activeDiagnostic.disease.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          activeDiagnostic.disease.severity === 'Critique'
                            ? 'bg-red-500/20 text-[#FFB4A2] border border-red-400/40'
                            : 'bg-white/10 text-[#E8F4D9]'
                        }`}
                      >
                        Vigilance : {activeDiagnostic.disease.severity}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      {activeDiagnostic.disease.name}
                    </h3>
                    <p className="text-xs text-[#B0D984] mt-0.5">
                      Nom scientifique : <em>{activeDiagnostic.disease.scientificName}</em> • Appellation locale :{' '}
                      <strong>{activeDiagnostic.disease.kabyleTerm}</strong>
                    </p>
                  </div>

                  <div className="bg-white/10 border border-white/15 rounded-2xl px-4 py-2.5 text-center shrink-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#B0D984] block">
                      Indice de correspondance
                    </span>
                    <span className="font-mono text-2xl font-extrabold text-[#E6AB3C]">
                      {activeDiagnostic.confidencePct}%
                    </span>
                  </div>
                </div>

                {/* Synthèse clinique & Conditions favorables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6AB3C] block">
                      Période de risque maximal
                    </span>
                    <p className="text-white font-semibold">{activeDiagnostic.disease.peakPeriod}</p>
                    <p className="text-[#E8F4D9]/80 text-[11px] leading-relaxed pt-1">
                      {activeDiagnostic.disease.primarySymptomsSummary}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B0D984] block">
                      Facteurs favorisants en Kabylie
                    </span>
                    <p className="text-[#E8F4D9]/90 text-[11px] leading-relaxed">
                      {activeDiagnostic.disease.favorableConditions}
                    </p>
                  </div>
                </div>

                {/* Recommandations de Traitements Biologiques Homologués */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6AB3C] flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-[#8CBE5D]" />
                    <span>Protocole de Traitement Biologique & Biocontrôle Recommandé</span>
                  </h4>

                  <div className="space-y-2.5">
                    {activeDiagnostic.disease.bioTreatments.map((treat, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {idx + 1}. {treat.title}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#8CBE5D]/25 text-[#B0D984] shrink-0">
                            100% Bio / Biocontrôle
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#E6AB3C]">
                          Produit / Méthode : {treat.productOrMethod}
                        </p>
                        <p className="text-xs text-[#E8F4D9]/90 leading-relaxed">
                          {treat.dosageAndTiming}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mesures Prophylactiques Culturales */}
                <div className="p-4 rounded-2xl bg-black/25 border border-white/10 space-y-2">
                  <span className="text-xs font-bold text-[#B0D984] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8CBE5D]" />
                    <span>Prophylaxie culturale & Prévention durable au verger :</span>
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#E8F4D9]/90">
                    {activeDiagnostic.disease.prophylaxisActions.map((act, i) => (
                      <li key={i} className="leading-relaxed">
                        • {act}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] text-[#E6AB3C] pt-1 border-t border-white/10">
                    <strong>Sensibilité variétale :</strong> {activeDiagnostic.disease.varietalSensitivity}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
