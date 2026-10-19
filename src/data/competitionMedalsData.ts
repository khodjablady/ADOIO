export interface CategoryMedalStats {
  category: 'Fruité Vert' | 'Fruité Mûr' | 'Fruité Goût à l\'ancienne';
  or: number;
  argent: number;
  bronze: number;
  total: number;
  averageScore: number;
}

export interface CampaignMedalsHistory {
  campaign: string;
  year: number;
  edition: string;
  date: string;
  totalSamplesSubmitted: number;
  totalMedalsAwarded: number;
  orCount: number;
  argentCount: number;
  bronzeCount: number;
  averageJuryScore: number;
  averageAcidityPercent: number;
  categories: {
    fruiteVert: CategoryMedalStats;
    fruiteMur: CategoryMedalStats;
    goutAncienne: CategoryMedalStats;
  };
  highlight: string;
}

export interface LaureateMillAward {
  id: string;
  campaign: string;
  year: number;
  millName: string;
  commune: string;
  millType: 'Moderne Continue' | 'Traditionnel Amélioré' | 'Domaine Artisanal';
  category: 'Fruité Vert' | 'Fruité Mûr' | 'Fruité Goût à l\'ancienne';
  variety: string;
  medal: 'or' | 'argent' | 'bronze';
  score: number;
  acidity: number;
  k232: number;
  juryAppreciation: string;
}

export const HISTORICAL_MEDALS_DATA: CampaignMedalsHistory[] = [
  {
    campaign: '2021 / 2022',
    year: 2022,
    edition: '20ᵉ Fête de l\'Olive',
    date: 'Avril 2022',
    totalSamplesSubmitted: 48,
    totalMedalsAwarded: 18,
    orCount: 4,
    argentCount: 6,
    bronzeCount: 8,
    averageJuryScore: 81.4,
    averageAcidityPercent: 0.28,
    categories: {
      fruiteVert: {
        category: 'Fruité Vert',
        or: 2,
        argent: 2,
        bronze: 3,
        total: 7,
        averageScore: 82.5,
      },
      fruiteMur: {
        category: 'Fruité Mûr',
        or: 1,
        argent: 2,
        bronze: 3,
        total: 6,
        averageScore: 81.0,
      },
      goutAncienne: {
        category: 'Fruité Goût à l\'ancienne',
        or: 1,
        argent: 2,
        bronze: 2,
        total: 5,
        averageScore: 80.7,
      },
    },
    highlight: 'Introduction de la grille d\'évaluation organoleptique COI harmonisée avec la DSA.',
  },
  {
    campaign: '2022 / 2023',
    year: 2023,
    edition: '21ᵉ Fête de l\'Olive',
    date: 'Avril 2023',
    totalSamplesSubmitted: 59,
    totalMedalsAwarded: 21,
    orCount: 5,
    argentCount: 8,
    bronzeCount: 8,
    averageJuryScore: 82.8,
    averageAcidityPercent: 0.25,
    categories: {
      fruiteVert: {
        category: 'Fruité Vert',
        or: 2,
        argent: 3,
        bronze: 3,
        total: 8,
        averageScore: 83.8,
      },
      fruiteMur: {
        category: 'Fruité Mûr',
        or: 2,
        argent: 3,
        bronze: 2,
        total: 7,
        averageScore: 82.4,
      },
      goutAncienne: {
        category: 'Fruité Goût à l\'ancienne',
        or: 1,
        argent: 2,
        bronze: 3,
        total: 6,
        averageScore: 81.9,
      },
    },
    highlight: 'Forte progression des huiles précoces récoltées sous filets avec extraction à froid.',
  },
  {
    campaign: '2023 / 2024',
    year: 2024,
    edition: '22ᵉ Fête de l\'Olive',
    date: 'Avril 2024',
    totalSamplesSubmitted: 72,
    totalMedalsAwarded: 24,
    orCount: 7,
    argentCount: 8,
    bronzeCount: 9,
    averageJuryScore: 84.1,
    averageAcidityPercent: 0.22,
    categories: {
      fruiteVert: {
        category: 'Fruité Vert',
        or: 3,
        argent: 3,
        bronze: 3,
        total: 9,
        averageScore: 85.3,
      },
      fruiteMur: {
        category: 'Fruité Mûr',
        or: 2,
        argent: 3,
        bronze: 4,
        total: 9,
        averageScore: 83.6,
      },
      goutAncienne: {
        category: 'Fruité Goût à l\'ancienne',
        or: 2,
        argent: 2,
        bronze: 2,
        total: 6,
        averageScore: 83.0,
      },
    },
    highlight: 'La variété Azeradj de la Soummam décroche 2 médailles d\'or consécutives.',
  },
  {
    campaign: '2024 / 2025',
    year: 2025,
    edition: '23ᵉ Fête de l\'Olive',
    date: 'Avril 2025',
    totalSamplesSubmitted: 86,
    totalMedalsAwarded: 27,
    orCount: 8,
    argentCount: 10,
    bronzeCount: 9,
    averageJuryScore: 85.6,
    averageAcidityPercent: 0.19,
    categories: {
      fruiteVert: {
        category: 'Fruité Vert',
        or: 4,
        argent: 4,
        bronze: 3,
        total: 11,
        averageScore: 86.9,
      },
      fruiteMur: {
        category: 'Fruité Mûr',
        or: 2,
        argent: 4,
        bronze: 3,
        total: 9,
        averageScore: 85.1,
      },
      goutAncienne: {
        category: 'Fruité Goût à l\'ancienne',
        or: 2,
        argent: 2,
        bronze: 3,
        total: 7,
        averageScore: 84.2,
      },
    },
    highlight: 'Record historique de participation : 86 huileries et domaines candidats en compétition.',
  },
  {
    campaign: '2025 / 2026',
    year: 2026,
    edition: '24ᵉ Fête de l\'Olive (Session en cours)',
    date: '6 avril 2026',
    totalSamplesSubmitted: 98,
    totalMedalsAwarded: 30,
    orCount: 9,
    argentCount: 11,
    bronzeCount: 10,
    averageJuryScore: 86.8,
    averageAcidityPercent: 0.18,
    categories: {
      fruiteVert: {
        category: 'Fruité Vert',
        or: 4,
        argent: 4,
        bronze: 4,
        total: 12,
        averageScore: 87.8,
      },
      fruiteMur: {
        category: 'Fruité Mûr',
        or: 3,
        argent: 4,
        bronze: 3,
        total: 10,
        averageScore: 86.4,
      },
      goutAncienne: {
        category: 'Fruité Goût à l\'ancienne',
        or: 2,
        argent: 3,
        bronze: 3,
        total: 8,
        averageScore: 85.5,
      },
    },
    highlight: 'Médailles officielles gravées Fête de l\'Olive 6 avril 2026 remises aux lauréats d\'excellence.',
  },
];

export const TOP_LAUREATE_MILLS: LaureateMillAward[] = [
  {
    id: 'laur-1',
    campaign: '2025 / 2026',
    year: 2026,
    millName: 'Huilerie Moderne d\'Akbou (Famille Benali)',
    commune: 'Akbou',
    millType: 'Moderne Continue',
    category: 'Fruité Vert',
    variety: 'Chemlal Précoce & Azeradj',
    medal: 'or',
    score: 89.4,
    acidity: 0.16,
    k232: 1.62,
    juryAppreciation: 'Arômes vifs d\'artichaut cru, d\'herbe fraîchement coupée et ardence tonique remarquable.',
  },
  {
    id: 'laur-2',
    campaign: '2025 / 2026',
    year: 2026,
    millName: 'Domaine Aït-Mansour & Fils',
    commune: 'Seddouk',
    millType: 'Domaine Artisanal',
    category: 'Fruité Mûr',
    variety: 'Aberkane de Seddouk',
    medal: 'or',
    score: 88.2,
    acidity: 0.18,
    k232: 1.68,
    juryAppreciation: 'Rondeur veloutée avec des arômes persistants d\'amande douce et de pomme mûre.',
  },
  {
    id: 'laur-3',
    campaign: '2025 / 2026',
    year: 2026,
    millName: 'Pressoir Traditionnel du Village d\'Amalou',
    commune: 'Amalou',
    millType: 'Traditionnel Amélioré',
    category: 'Fruité Goût à l\'ancienne',
    variety: 'Chemlal Traditionnelle',
    medal: 'or',
    score: 86.8,
    acidity: 0.22,
    k232: 1.74,
    juryAppreciation: 'Saveurs authentiques de sous-bois et pâte d\'olive noire confite, sans défaut d\'oxydation.',
  },
  {
    id: 'laur-4',
    campaign: '2024 / 2025',
    year: 2025,
    millName: 'Huilerie Numidie & Terroir',
    commune: 'Tazmalt',
    millType: 'Moderne Continue',
    category: 'Fruité Vert',
    variety: 'Azeradj Pur',
    medal: 'or',
    score: 88.6,
    acidity: 0.17,
    k232: 1.65,
    juryAppreciation: 'Équilibre parfait entre amertume et ardence avec des notes de feuille de figuier.',
  },
  {
    id: 'laur-5',
    campaign: '2024 / 2025',
    year: 2025,
    millName: 'Coopérative Oléicole de Souk El Tenine',
    commune: 'Souk El Tenine',
    millType: 'Moderne Continue',
    category: 'Fruité Mûr',
    variety: 'Limli Maritime',
    medal: 'argent',
    score: 84.5,
    acidity: 0.21,
    k232: 1.76,
    juryAppreciation: 'Douceur soyeuse avec finale délicatement fruitée et notes florales.',
  },
  {
    id: 'laur-6',
    campaign: '2023 / 2024',
    year: 2024,
    millName: 'Huilerie Écologique des Monts de Chemini',
    commune: 'Chemini',
    millType: 'Moderne Continue',
    category: 'Fruité Vert',
    variety: 'Bouchouk de Montagne',
    medal: 'argent',
    score: 84.1,
    acidity: 0.20,
    k232: 1.72,
    juryAppreciation: 'Profil montagnard intense, haute teneur en polyphénols totaux (> 420 mg/kg).',
  },
  {
    id: 'laur-7',
    campaign: '2023 / 2024',
    year: 2024,
    millName: 'Moulins de la Haute Soummam',
    commune: 'Ighzer Amokrane',
    millType: 'Moderne Continue',
    category: 'Fruité Goût à l\'ancienne',
    variety: 'Assemblage Soummam',
    medal: 'bronze',
    score: 79.5,
    acidity: 0.27,
    k232: 1.88,
    juryAppreciation: 'Typicité kabyle marquée avec rondeur crémeuse et notes de pain grillé.',
  },
  {
    id: 'laur-8',
    campaign: '2022 / 2023',
    year: 2023,
    millName: 'Huilerie Bio Vallée d\'Amizour',
    commune: 'Amizour',
    millType: 'Moderne Continue',
    category: 'Fruité Vert',
    variety: 'Chemlal Bio',
    medal: 'or',
    score: 86.2,
    acidity: 0.19,
    k232: 1.69,
    juryAppreciation: 'Finesse aromatique sur la pomme verte et l\'amandon frais.',
  },
];

export const MEDAL_DETAILS = {
  or: {
    type: 'or',
    name: "Médaille d'Or",
    color: '#D4AF37',
    gradient: 'from-[#FFE57F] via-[#F5C05E] to-[#B38600]',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    svgSrc: '/images/medailles/medaille-or.svg',
    pngFallback: '/images/medailles/medaille-or.svg',
    scoreRange: 'Note globale ≥ 85 / 100',
    criterion: 'Excellence organoleptique sans aucun défaut, équilibre parfait du fruité, amertume et ardence harmonieuses.',
    acidityRequired: 'Acidité libre ≤ 0.3% (Norme Vierge Extra COI ≤ 0.8%)',
    peroxideRequired: 'Indice de peroxyde ≤ 10 meq O2/kg',
    polyfenols: 'Polyphénols totaux ≥ 350 mg/kg',
    prestigeBonus: 'Macaron millésimé officiel ADOIO pour bouteilles, mise en avant portail et accompagnement export.',
  },
  argent: {
    type: 'argent',
    name: "Médaille d'Argent",
    color: '#A6B0B8',
    gradient: 'from-[#FFFFFF] via-[#D1D8E0] to-[#718096]',
    badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    svgSrc: '/images/medailles/medaille-argent.svg',
    pngFallback: '/images/medailles/medaille-argent.svg',
    scoreRange: 'Note globale : 80 à 84 / 100',
    criterion: 'Très haute qualité aromatique, fruité net et expressif avec persistance agréable en bouche.',
    acidityRequired: 'Acidité libre ≤ 0.4%',
    peroxideRequired: 'Indice de peroxyde ≤ 12 meq O2/kg',
    polyfenols: 'Polyphénols totaux ≥ 280 mg/kg',
    prestigeBonus: 'Diplôme d\'honneur officiel DSA et référencement prioritaire dans l\'annuaire des moulins.',
  },
  bronze: {
    type: 'bronze',
    name: "Médaille de Bronze",
    color: '#CD7F32',
    gradient: 'from-[#E2B289] via-[#BA804C] to-[#6E421F]',
    badgeBg: 'bg-orange-100 text-orange-950 border-orange-300',
    svgSrc: '/images/medailles/medaille-bronze.svg',
    pngFallback: '/images/medailles/medaille-bronze.svg',
    scoreRange: 'Note globale : 75 à 79 / 100',
    criterion: 'Qualité supérieure certifiée, absence de défauts sensoriels, caractéristiques variétales bien marquées.',
    acidityRequired: 'Acidité libre ≤ 0.5%',
    peroxideRequired: 'Indice de peroxyde ≤ 14 meq O2/kg',
    polyfenols: 'Polyphénols totaux ≥ 220 mg/kg',
    prestigeBonus: 'Attestation de conformité COI et droit d\'usage du label Terroir Béjaïa pour la saison.',
  },
};
