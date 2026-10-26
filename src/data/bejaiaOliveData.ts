export interface OliveMillTechnicalSpecs {
  hourlyThroughputKg: number;
  minBatchKg: number;
  equipmentBrand: string;
  extractionProcess: string;
  malaxationTemp: string;
  storageCapacityLiters: number;
  storageType: string;
  avgYieldRange: string;
  avgAcidity: string;
  byproductsValorization: string;
}

export interface OliveMillCampaignInfo {
  openingHours: string;
  pricingInfo: string;
  averageWaitTime: string;
  appointmentRequired: boolean;
}

export interface OliveMill {
  id: string;
  name: string;
  commune: string;
  daira: string;
  lat: number;
  lng: number;
  type: 'modern' | 'traditional' | 'cooperative' | 'domaine';
  typeLabel: string;
  capacityQxPerDay: number;
  contactPerson: string;
  phone: string;
  address: string;
  yearEstablished: number;
  brands: string[];
  certifiedBio?: boolean;
  igCandidate?: boolean;
  description: string;
  speciality: string;
  technicalSpecs: OliveMillTechnicalSpecs;
  services: string[];
  campaignInfo: OliveMillCampaignInfo;
}

export interface OliveVariety {
  id: string;
  name: string;
  kabyleName: string;
  category: 'oil' | 'table' | 'mixed';
  proportionKabylie: string;
  oilYieldPercent: string;
  harvestWindow: string;
  fruitCharacteristics: string;
  flavorProfile: string[];
  resistance: string;
  description: string;
  bestUse: string;
}

export interface CommuneStat {
  commune: string;
  daira: string;
  lat: number;
  lng: number;
  hectares: number;
  treesCount: number;
  millsCount: number;
  avgProductionLiters: number;
  mainVarieties: string[];
}

export const BEJAIA_GLOBAL_STATS = {
  totalHectares: 57400,
  totalTrees: 5350000,
  producingTrees: 4850000,
  activeMills: 448,
  modernContinuousMills: 192,
  traditionalMills: 256,
  annualOilProductionLitersMin: 18500000,
  annualOilProductionLitersMax: 26000000,
  nationalProductionShare: 28.5, // 1ère wilaya oléicole
  averageYieldPerQuintal: 19.4, // Litres d'huile par quintal
  registeredFarmers: 24500,
};

export interface HistoricalCampaignData {
  campaign: string;
  shortYear: string;
  year: number;
  oilProductionLiters: number;
  oilProductionMillionLiters: number;
  olivesCrushedQuintals: number;
  averageYieldLitersPerQx: number;
  extraVirginSharePercent: number;
  tableOlivesQuintals: number;
  activeMillsCampaign: number;
  modernMillsActive: number;
  rainfallMm: number;
  climateSummary: string;
  agronomicHighlight: string;
  cycleType: 'on' | 'off' | 'equilibre';
  marketPriceDzdPerLiter: number;
}

export const BEJAIA_HISTORICAL_PRODUCTION_5Y: HistoricalCampaignData[] = [
  {
    campaign: "2020 / 2021",
    shortYear: "2020-21",
    year: 2021,
    oilProductionLiters: 19500000,
    oilProductionMillionLiters: 19.5,
    olivesCrushedQuintals: 1040000,
    averageYieldLitersPerQx: 18.75,
    extraVirginSharePercent: 24,
    tableOlivesQuintals: 42000,
    activeMillsCampaign: 418,
    modernMillsActive: 145,
    rainfallMm: 540,
    climateSummary: "Automne doux avec pluies tardives en Soummam. Démarrage de cueillette échelonné.",
    agronomicHighlight: "Reprise post-sécheresse, début de sensibilisation aux filets de cueillette par l'ADOIO.",
    cycleType: "equilibre",
    marketPriceDzdPerLiter: 750
  },
  {
    campaign: "2021 / 2022",
    shortYear: "2021-22",
    year: 2022,
    oilProductionLiters: 24800000,
    oilProductionMillionLiters: 24.8,
    olivesCrushedQuintals: 1280000,
    averageYieldLitersPerQx: 19.38,
    extraVirginSharePercent: 29,
    tableOlivesQuintals: 51000,
    activeMillsCampaign: 432,
    modernMillsActive: 160,
    rainfallMm: 610,
    climateSummary: "Année d'alternance haute ('Année On') avec excellente floraison printanière.",
    agronomicHighlight: "Volumes records dans les bassins d'Akbou et Seddouk. Saturation temporaire des moulins.",
    cycleType: "on",
    marketPriceDzdPerLiter: 700
  },
  {
    campaign: "2022 / 2023",
    shortYear: "2022-23",
    year: 2023,
    oilProductionLiters: 16900000,
    oilProductionMillionLiters: 16.9,
    olivesCrushedQuintals: 935000,
    averageYieldLitersPerQx: 18.07,
    extraVirginSharePercent: 35,
    tableOlivesQuintals: 36000,
    activeMillsCampaign: 425,
    modernMillsActive: 172,
    rainfallMm: 420,
    climateSummary: "Alternance basse ('Année Off') combinée à un déficit pluviométrique estival marqué.",
    agronomicHighlight: "Fruits de petit calibre mais concentration record en polyphénols et antioxydants naturels.",
    cycleType: "off",
    marketPriceDzdPerLiter: 850
  },
  {
    campaign: "2023 / 2024",
    shortYear: "2023-24",
    year: 2024,
    oilProductionLiters: 22400000,
    oilProductionMillionLiters: 22.4,
    olivesCrushedQuintals: 1140000,
    averageYieldLitersPerQx: 19.65,
    extraVirginSharePercent: 42,
    tableOlivesQuintals: 48000,
    activeMillsCampaign: 440,
    modernMillsActive: 184,
    rainfallMm: 580,
    climateSummary: "Pluies salvatrices en octobre-novembre réhydratant les drupes avant cueillette.",
    agronomicHighlight: "Bond qualitatif majeur : généralisation des caisses plastiques ajourées et délais < 48h.",
    cycleType: "on",
    marketPriceDzdPerLiter: 950
  },
  {
    campaign: "2024 / 2025",
    shortYear: "2024-25",
    year: 2025,
    oilProductionLiters: 25600000,
    oilProductionMillionLiters: 25.6,
    olivesCrushedQuintals: 1260000,
    averageYieldLitersPerQx: 20.32,
    extraVirginSharePercent: 49,
    tableOlivesQuintals: 54000,
    activeMillsCampaign: 448,
    modernMillsActive: 192,
    rainfallMm: 645,
    climateSummary: "Hiver froid assainissant, floraison protégée du sirocco et pluviométrie automnale idéale.",
    agronomicHighlight: "Campagne d'excellence : près de 50% de Vierge Extra, acidité moyenne < 0,38% dans les lignes continues.",
    cycleType: "on",
    marketPriceDzdPerLiter: 920
  }
];

export const ADOIO_INFO = {
  acronym: "ADOIO",
  fullName: "Association pour le Développement de l'Oléiculture et des Industries Oléicoles de la Wilaya de Béjaïa",
  tamazightTitle: "Tiddukla i Usnerni n Uzemmur d Tmguriwin n Uzemmur n Twilayt n Bgayet",
  creationYear: 2004,
  headquarters: "Chambre d'Agriculture de Béjaïa, 06000, Béjaïa - Algérie",
  phone: "+213 661630658",
  mobile: "+213 661 77 80 80",
  email: "infos@blady-product.com",
  contactSecondary: "adoio.bejaia@gmail.com",
  presidentMessage: "L'olivier est bien plus qu'une culture en Kabylie : c'est notre âme, notre histoire et un moteur d'avenir économique. L'ADOIO œuvre chaque jour aux côtés des oléiculteurs et mouliniers pour hisser l'Huile d'Olive de Béjaïa aux plus hauts standards internationaux de pureté et d'authenticité.",
  keyMissions: [
    {
      title: "Compétitivité & Structuration de la Filière",
      desc: "Fédérer l'ensemble des maillons de la chaîne : pépiniéristes, oléiculteurs, huileries modernes, coopératives villageoises et conditionneurs pour bâtir une filière solide et rémunératrice.",
      icon: "TrendingUp"
    },
    {
      title: "Qualité & Labellisation IG Terroir",
      desc: "Promouvoir la certification 'Indication Géographique Protégée' (IGP Huile d'Olive de Kabylie - Béjaïa) et garantir une acidité oléique inférieure à 0.5% pour valoriser le prestige de nos terroirs.",
      icon: "Award"
    },
    {
      title: "Modernisation & Vulgarisation Technique",
      desc: "Accompagner le renouvellement technologique vers les moulins continus 2 et 3 phases sans ajout d'eau excessive, diffuser les techniques de taille raisonnée et de cueillette au filet.",
      icon: "Cpu"
    },
    {
      title: "Économie Circulaire & Éco-responsabilité",
      desc: "Gérer l'impact environnemental des margines par lagunage contrôlé et valoriser le grignon d'olive en biomasse combustible, fertilisant organique composté et charbon actif.",
      icon: "Leaf"
    }
  ]
};

export const BEJAIA_COMMUNES_DATA: CommuneStat[] = [
  {
    commune: "Seddouk",
    daira: "Seddouk",
    lat: 36.5542,
    lng: 4.6853,
    hectares: 7200,
    treesCount: 680000,
    millsCount: 64,
    avgProductionLiters: 3100000,
    mainVarieties: ["Azeradj/Adjeraz", "Bouchouk", "Limli"]
  },
  {
    commune: "Akbou",
    daira: "Akbou",
    lat: 36.4578,
    lng: 4.5422,
    hectares: 6800,
    treesCount: 640000,
    millsCount: 52,
    avgProductionLiters: 2950000,
    mainVarieties: ["Chemlal", "Bouchouk"]
  },
  {
    commune: "Tazmalt",
    daira: "Tazmalt",
    lat: 36.4042,
    lng: 4.3986,
    hectares: 5400,
    treesCount: 510000,
    millsCount: 41,
    avgProductionLiters: 2400000,
    mainVarieties: ["Chemlal", "Aberkane"]
  },
  {
    commune: "Sidi Aïch",
    daira: "Sidi Aïch",
    lat: 36.6111,
    lng: 4.6908,
    hectares: 4900,
    treesCount: 460000,
    millsCount: 38,
    avgProductionLiters: 2150000,
    mainVarieties: ["Chemlal", "Limli"]
  },
  {
    commune: "Ouzellaguen",
    daira: "Ifri-Ouzellaguen",
    lat: 36.5414,
    lng: 4.6144,
    hectares: 4600,
    treesCount: 430000,
    millsCount: 35,
    avgProductionLiters: 2000000,
    mainVarieties: ["Chemlal", "Bouchouk"]
  },
  {
    commune: "El Kseur",
    daira: "El Kseur",
    lat: 36.6833,
    lng: 4.8558,
    hectares: 4200,
    treesCount: 395000,
    millsCount: 32,
    avgProductionLiters: 1850000,
    mainVarieties: ["Chemlal", "Sigoise"]
  },
  {
    commune: "Amizour",
    daira: "Amizour",
    lat: 36.6436,
    lng: 4.9083,
    hectares: 4100,
    treesCount: 380000,
    millsCount: 30,
    avgProductionLiters: 1750000,
    mainVarieties: ["Chemlal", "Aberkane"]
  },
  {
    commune: "Timezrit",
    daira: "Timezrit",
    lat: 36.6508,
    lng: 4.7733,
    hectares: 3800,
    treesCount: 355000,
    millsCount: 28,
    avgProductionLiters: 1600000,
    mainVarieties: ["Chemlal", "Limli"]
  },
  {
    commune: "Adekar",
    daira: "Adekar",
    lat: 36.6972,
    lng: 4.6639,
    hectares: 3500,
    treesCount: 330000,
    millsCount: 22,
    avgProductionLiters: 1450000,
    mainVarieties: ["Chemlal", "Aberkane"]
  },
  {
    commune: "Chemini",
    daira: "Chemini",
    lat: 36.6025,
    lng: 4.6117,
    hectares: 3300,
    treesCount: 310000,
    millsCount: 24,
    avgProductionLiters: 1400000,
    mainVarieties: ["Chemlal", "Bouchouk"]
  },
  {
    commune: "Ighzer Amokrane",
    daira: "Ouzellaguen",
    lat: 36.5290,
    lng: 4.5980,
    hectares: 3100,
    treesCount: 290000,
    millsCount: 26,
    avgProductionLiters: 1350000,
    mainVarieties: ["Chemlal", "Limli"]
  },
  {
    commune: "Darguina",
    daira: "Darguina",
    lat: 36.5689,
    lng: 5.2894,
    hectares: 2800,
    treesCount: 265000,
    millsCount: 18,
    avgProductionLiters: 1200000,
    mainVarieties: ["Chemlal", "Azeradj/Adjeraz"]
  }
];

export const OLIVE_VARIETIES: OliveVariety[] = [
  {
    id: "chemlal",
    name: "Chemlal de Kabylie",
    kabyleName: "Tacmlalt / Achemllal",
    category: "oil",
    proportionKabylie: "40% du verger",
    oilYieldPercent: "16% à 20% (16 à 20 L / quintal)",
    harvestWindow: "Novembre à Janvier",
    fruitCharacteristics: "Fruit ovoïde de calibre moyen (1.8 à 2.5 g), peau fine devenant noir violacé brillant à complète maturité. Noyau facilement détachable.",
    flavorProfile: ["Fruité vert intense", "Notes d'herbe coupée", "Amande amère", "Ardence poivrée en finale"],
    resistance: "Remarquable rusticité, résistance aux gelées d'altitude kabyles et aux étés secs.",
    description: "La variété reine par excellence de la Kabylie et de la wilaya de Béjaïa. Elle confère à l'huile son caractère charpenté, sa couleur jaune doré aux reflets émeraude et sa haute richesse en polyphénols antioxydants.",
    bestUse: "Huile d'olive Vierge Extra pure de terroir, assaisonnement de salades, poissons grillés et couscous traditionnel."
  },
  {
    id: "bouchouk",
    name: "Bouchouk El Ghalia",
    kabyleName: "Tabuckukt n Lɛalia",
    category: "mixed",
    proportionKabylie: "6% à 8% du verger",
    oilYieldPercent: "20% à 25% (20 à 25 L / quintal)",
    harvestWindow: "Octobre (table) à Décembre (huile)",
    fruitCharacteristics: "Gros fruit allongé légèrement incurvé avec un rostre terminal (forme de bec ou crochet), pulpe charnue et ferme.",
    flavorProfile: ["Arômes d'artichaut frais", "Pomme verte", "Douceur en bouche", "Légère amertume soyeuse"],
    resistance: "Excellente adaptation aux sols calcaires et terrasses de la vallée de la Soummam.",
    description: "Très prisée des connaisseurs pour sa finesse gustative et sa double aptitude. Elle est récoltée verte pour la préparation des olives cassées traditionnelles ou mûre pour une huile d'une élégance rare.",
    bestUse: "Huile gastronomique de finition, dégustation à cru sur pain chaud, confiserie d'olives de table."
  },
  {
    id: "aberkane",
    name: "Aberkane",
    kabyleName: "Taberkant (L'Olive Noire)",
    category: "oil",
    proportionKabylie: "4% à 5% du verger",
    oilYieldPercent: "19% à 23%",
    harvestWindow: "Décembre à Février",
    fruitCharacteristics: "Fruit de taille moyenne, parfaitement sphérique, d'un noir profond et lustré à maturité complète.",
    flavorProfile: ["Fruité mûr", "Fruits rouges cuits", "Noisette grillée", "Faible ardence"],
    resistance: "Grande longévité, adapté aux parcelles rocheuses et aux pentes abruptes des Babors et du Djurdjura.",
    description: "Une variété ancestrale montagnarde kabyle. Les arbres sont souvent centenaires, offrant une huile douce, ronde et veloutée, très appréciée pour la cuisine quotidienne et les préparations chaudes.",
    bestUse: "Plats mijotés kabyles, tajines, gâteaux traditionnels à l'huile d'olive."
  },
  {
    id: "limli",
    name: "Limli",
    kabyleName: "Talimlit",
    category: "oil",
    proportionKabylie: "15% du verger",
    oilYieldPercent: "18% à 22%",
    harvestWindow: "Novembre à mi-Décembre",
    fruitCharacteristics: "Petite olive rondelette très riche en jus oléique, regroupée en grappes denses.",
    flavorProfile: ["Herbacé vif", "Feuille de figuier", "Amertume franche", "Piquant rafraîchissant"],
    resistance: "Très productive en année de charge, tolérante aux vents de montagne.",
    description: "Présente principalement dans les coteaux de la Haute-Soummam et vers Seddouk. Elle est souvent pressée en début de campagne pour produire une huile primeur au fruité vert saisissant.",
    bestUse: "Huile de caractère pour relever le tajine de légumes, les purées de fèves (Bissara / Tiwaffa) et légumes vapeur."
  },
  {
    id: "azeradj",
    name: "Azeradj / Adjeraz",
    kabyleName: "Azradj / Adjeraz",
    category: "mixed",
    proportionKabylie: "25% du verger",
    oilYieldPercent: "20% à 25% (20 à 25 L / quintal)",
    harvestWindow: "Octobre à Novembre",
    fruitCharacteristics: "Gros fruit ovoïde régulier, chair très abondante et croquante, faible adhérence du noyau.",
    flavorProfile: ["Notes beurrées", "Amande douce", "Acidité très faible"],
    resistance: "Demande des sols plus profonds et une bonne hygrométrie.",
    description: "Variété d'excellence pour la confiserie des olives de table en saumure aromatisée (thym de Kabylie, laurier sauvage, ail et rondelles de citron).",
    bestUse: "Conserves d'olives de table traditionnelles au sel marin, apéritifs kabyles."
  },
  {
    id: "autres",
    name: "Autres",
    kabyleName: "Exotique",
    category: "mixed",
    proportionKabylie: "8% du verger",
    oilYieldPercent: "18% à 22%",
    harvestWindow: "Novembre à Janvier",
    fruitCharacteristics: "Ensemble de cultivars introduits ou minoritaires (Sigoise, Sevillane, Arbequina, Picholine).",
    flavorProfile: ["Fruité vert et mûr", "Notes végétales douces", "Ardence modérée"],
    resistance: "Variable selon la lignée et l'adaptation pédoclimatique locale.",
    description: "Variétés d'introduction ou cultivars minoritaires contribuant à la biodiversité oléicole de la wilaya de Béjaïa.",
    bestUse: "Huiles d'assemblage équilibrées et olives de bouche complémentaires."
  }
];

export const REPRESENTATIVE_MILLS: OliveMill[] = [
  {
    id: "mill-01",
    name: "Huilerie Moderne de Seddouk (Blady Products)",
    commune: "Seddouk",
    daira: "Seddouk",
    lat: 36.5560,
    lng: 4.6880,
    type: "modern",
    typeLabel: "Système Continu 2 Phases Haute Performance",
    capacityQxPerDay: 80,
    contactPerson: "Direction Technique ADOIO",
    phone: "+213 661630658 / +213 661 77 80 80",
    address: "Zone d'Activité / Rue du 17 Octobre 1961, Seddouk Centre",
    yearEstablished: 1998,
    brands: ["Huile Vierge Extra Seddouk", "Terroir Soummam"],
    certifiedBio: true,
    igCandidate: true,
    description: "Huilerie de référence équipée des dernières technologies de centrifugation à froid sans adjonction d'eau. Centre pilote pour les formations de l'ADOIO et la recherche sur la valorisation des grignons.",
    speciality: "Fruité vert d'exception, acidité garantie inférieure à 0.3%.",
    technicalSpecs: {
      hourlyThroughputKg: 1000,
      minBatchKg: 150,
      equipmentBrand: "Pieralisi Protoreattore & Décanteur 2 Phases",
      extractionProcess: "Extraction à froid intégrale sans ajout d'eau (Éco-2-Phases)",
      malaxationTemp: "22°C – 25°C (Sondes thermiques numériques par cuve)",
      storageCapacityLiters: 45000,
      storageType: "Cuves Inox 316L alimentaires inertées à l'azote",
      avgYieldRange: "19 à 23 L / quintal",
      avgAcidity: "≤ 0,28 % acide oléique",
      byproductsValorization: "Séparation noyau/pulpe (biométhanisation & bûches écologiques) + compostage grignon humide"
    },
    services: [
      "Trituration à façon par lot individuel traçable",
      "Effeuillage pneumatique & double lavage à l'eau claire",
      "Analyse physico-chimique rapide (acidité & indice de peroxyde)",
      "Filtration sur plaques de cellulose & embouteillage verre fumé",
      "Prêt de caisses plastiques ajourées (palox 25 kg et 300 kg)",
      "Ateliers de dégustation sensorielle & conseil agronomique ADOIO"
    ],
    campaignInfo: {
      openingHours: "7j/7 de 06h00 à 22h00 (octobre à février)",
      pricingInfo: "14 DA / kg d'olives ou retenue en huile (10 %)",
      averageWaitTime: "Moins de 6h sur rendez-vous téléphonique",
      appointmentRequired: true
    }
  },
  {
    id: "mill-02",
    name: "Domaine Oléicole & Moulin d'Akbou",
    commune: "Akbou",
    daira: "Akbou",
    lat: 36.4620,
    lng: 4.5450,
    type: "domaine",
    typeLabel: "Domaine Intégré (Oliveraie & Moulin Continu)",
    capacityQxPerDay: 60,
    contactPerson: "Améziane Belkacem",
    phone: "+213 550 42 18 90",
    address: "Route Nationale 26, Vallée de la Soummam, Akbou",
    yearEstablished: 2005,
    brands: ["Akbou Dorée", "Soummam Prestige"],
    certifiedBio: true,
    igCandidate: true,
    description: "Exploitation familiale de 40 hectares d'oliviers Chemlal et Bouchouk conduits en agriculture raisonnée. Récolte manuelle au filet et trituration sous 8 heures.",
    speciality: "Huile monovariétale Chemlal primée aux concours nationaux.",
    technicalSpecs: {
      hourlyThroughputKg: 750,
      minBatchKg: 200,
      equipmentBrand: "Alfa Laval Olive Oil (Ligne Continue Compacte)",
      extractionProcess: "Broyage à marteaux inox & décantation centrifuge à froid",
      malaxationTemp: "23°C – 26°C (Malaxeurs hermétiques anti-oxydation)",
      storageCapacityLiters: 32000,
      storageType: "Chai climatisé (16°C) avec cuves Inox à fond conique",
      avgYieldRange: "20 à 24 L / quintal",
      avgAcidity: "≤ 0,32 % acide oléique",
      byproductsValorization: "Épandage raisonné des grignons compostés sur les 40 ha du domaine"
    },
    services: [
      "Trituration express sous 8h pour lots récoltés en caisses",
      "Conditionnement à façon en bouteilles personnalisées et bidons métalliques",
      "Garde en cuve inox climatisée pour producteurs partenaires",
      "Vente directe au domaine & dégustation des cuvées monovariétales",
      "Pesée électronique certifiée avec bon de traçabilité parcellaire"
    ],
    campaignInfo: {
      openingHours: "Tous les jours de 07h00 à 20h00",
      pricingInfo: "15 DA / kg (remise pour lots certifiés sans sacs plastique)",
      averageWaitTime: "Créneau garanti sous 8h sur réservation",
      appointmentRequired: true
    }
  },
  {
    id: "mill-03",
    name: "Huilerie Traditionnelle El-Baraka de Sidi Aïch",
    commune: "Sidi Aïch",
    daira: "Sidi Aïch",
    lat: 36.6130,
    lng: 4.6920,
    type: "traditional",
    typeLabel: "Meules de Granit & Super-Presses Hydrauliques",
    capacityQxPerDay: 25,
    contactPerson: "Mouloud Haddad",
    phone: "+213 662 11 34 78",
    address: "Chemin de Remila, Sidi Aïch",
    yearEstablished: 1968,
    brands: ["Zzit Sidi Aïch Tradition"],
    certifiedBio: false,
    igCandidate: true,
    description: "Trituration traditionnelle perpétuée depuis trois générations. Écrasement lent sous lourdes meules en pierre de granit préservant la texture onctueuse et la saveur douce d'antan.",
    speciality: "Huile douce fruitée mûre, arômes de fruits secs et de pâte d'olive.",
    technicalSpecs: {
      hourlyThroughputKg: 300,
      minBatchKg: 100,
      equipmentBrand: "2 Meules de Granit Massif + 3 Super-Presses Hydrauliques 350 bars",
      extractionProcess: "Détritage lent sur pierre, empilage sur scourtins lavés à chaud & décantation naturelle",
      malaxationTemp: "Température ambiante naturelle (sans chauffage excessif)",
      storageCapacityLiters: 10000,
      storageType: "Cuves inox & jarres traditionnelles de décantation",
      avgYieldRange: "18 à 21 L / quintal",
      avgAcidity: "0,6 % à 1,2 % (profil traditionnel fruité mûr)",
      byproductsValorization: "Grignon sec redistribué aux oléiculteurs pour le chauffage domestique"
    },
    services: [
      "Pressage artisanal de petits lots familiaux (dès 100 kg)",
      "Décantation naturelle par gravité à l'ancienne",
      "Restitution intégrale du grignon sec de presse au producteur",
      "Accueil des récoltes villageoises avec ou sans rendez-vous",
      "Vente directe d'huile traditionnelle de terroir"
    ],
    campaignInfo: {
      openingHours: "6j/7 de 06h30 à 19h30 (fermé le vendredi matin)",
      pricingInfo: "12 DA / kg ou dîme coutumière (1 L sur 10 L produits)",
      averageWaitTime: "12h à 24h selon affluence de la semaine",
      appointmentRequired: false
    }
  },
  {
    id: "mill-04",
    name: "Coopérative Oléicole de Tazmalt",
    commune: "Tazmalt",
    daira: "Tazmalt",
    lat: 36.4060,
    lng: 4.4020,
    type: "cooperative",
    typeLabel: "Coopérative Agricole Polyvalente",
    capacityQxPerDay: 70,
    contactPerson: "Secrétariat de la Coopérative",
    phone: "+213 34 35 60 12",
    address: "Boulevard de la Liberté, Tazmalt",
    yearEstablished: 1986,
    brands: ["L'Étoile du Djurdjura", "Tazmalt Extra"],
    certifiedBio: false,
    igCandidate: true,
    description: "Regroupe plus de 280 petits producteurs des flancs du Djurdjura et de la vallée. Mise en commun d'outils modernes de tri, de lavage et de décantation centrifuge.",
    speciality: "Assemblage équilibré Chemlal et Aberkane de haute altitude.",
    technicalSpecs: {
      hourlyThroughputKg: 900,
      minBatchKg: 120,
      equipmentBrand: "Rapanelli 3 Phases + Séparateurs Centrifuges Verticaux",
      extractionProcess: "Chaîne continue coopérative avec double station de lavage haute pression",
      malaxationTemp: "24°C – 26,5°C (4 bacs de malaxage indépendants pour suivi des lots)",
      storageCapacityLiters: 55000,
      storageType: "Batterie de 12 silos Inox alimentaires de 4 500 L",
      avgYieldRange: "19 à 22,5 L / quintal",
      avgAcidity: "≤ 0,45 % acide oléique",
      byproductsValorization: "Unité collective d'épuisement et séchage des grignons + bassins de lagunage"
    },
    services: [
      "Tarif solidaire préférentiel pour les adhérents de la coopérative",
      "Collecte groupée par camion plateau dans les villages d'altitude",
      "Location à prix coûtant de filets de récolte et peignes vibreurs",
      "Commercialisation collective sous marque coopérative 'L'Étoile du Djurdjura'",
      "Pesée pont-bascule & stockage collectif sécurisé"
    ],
    campaignInfo: {
      openingHours: "7j/7 de 06h00 à 21h00 en pleine campagne",
      pricingInfo: "10 DA / kg (adhérents) · 13 DA / kg (non-adhérents)",
      averageWaitTime: "Planification par village (passage sous 12h)",
      appointmentRequired: true
    }
  },
  {
    id: "mill-05",
    name: "Huilerie des Frères Ould-Ali (Ouzellaguen)",
    commune: "Ouzellaguen",
    daira: "Ifri-Ouzellaguen",
    lat: 36.5430,
    lng: 4.6170,
    type: "modern",
    typeLabel: "Ligne Continue Alfa Laval 3 Phases",
    capacityQxPerDay: 50,
    contactPerson: "Rachid Ould-Ali",
    phone: "+213 551 89 20 44",
    address: "Ighzer Amokrane, RN 26",
    yearEstablished: 2011,
    brands: ["Numidia Vierge Extra"],
    certifiedBio: true,
    igCandidate: true,
    description: "Moulin moderne ultra-propre avec cuves de stockage en inox sous atmosphère d'azote pour éviter toute oxydation prématurée.",
    speciality: "Fruité vert intense aux notes d'artichaut et de feuille fraîche.",
    technicalSpecs: {
      hourlyThroughputKg: 650,
      minBatchKg: 150,
      equipmentBrand: "Alfa Laval NX X19 (Ligne Inox Intégrale)",
      extractionProcess: "Extraction centrifuge à froid avec échangeur thermique tubulaire",
      malaxationTemp: "21°C – 24°C (Refroidissement initial de la pâte pour arômes verts)",
      storageCapacityLiters: 28000,
      storageType: "Cuves Inox 304L/316L sous couverture d'azote alimentaire",
      avgYieldRange: "18,5 à 22 L / quintal",
      avgAcidity: "≤ 0,30 % acide oléique",
      byproductsValorization: "Valorisation des noyaux concassés en biocombustible pour chaudières"
    },
    services: [
      "Trituration spéciale 'Récolte Précoce / Fruité Vert'",
      "Filtration immédiate sur plaques pour éliminer l'humidité résiduelle",
      "Conditionnement en bouteilles verre sombre anti-UV (25 cl, 50 cl, 75 cl)",
      "Mise à disposition gratuite de caisses ventilées pour les clients fidèles",
      "Suivi par SMS dès que le lot est pressé et prêt à être récupéré"
    ],
    campaignInfo: {
      openingHours: "Tous les jours de 06h30 à 21h30",
      pricingInfo: "14 DA / kg ou équivalent en huile vierge extra",
      averageWaitTime: "Moins de 8h avec ticket horodaté",
      appointmentRequired: true
    }
  },
  {
    id: "mill-06",
    name: "Moulin Ancestral d'Ighil Ali / Seddouk",
    commune: "Seddouk",
    daira: "Seddouk",
    lat: 36.5480,
    lng: 4.6790,
    type: "traditional",
    typeLabel: "Presse Artisanale Traditionnelle",
    capacityQxPerDay: 20,
    contactPerson: "Da Said Meziane",
    phone: "+213 670 99 12 05",
    address: "Village Tibouamouchine, Seddouk",
    yearEstablished: 1954,
    brands: ["Huile du Village Meziane"],
    certifiedBio: true,
    igCandidate: true,
    description: "Monument d'histoire oléicole avec son pressoir à scourtins en fibres végétales. Visites pédagogiques organisées en saison pour les écoles et passionnés du patrimoine.",
    speciality: "Huile de garde traditionnelle, ambrée et parfumée.",
    technicalSpecs: {
      hourlyThroughputKg: 220,
      minBatchKg: 80,
      equipmentBrand: "Bassin à Meule de Pierre + Pressoir à Scourtins Végétaux",
      extractionProcess: "Première pression mécanique douce et séparation par décantation en bassins carrelés",
      malaxationTemp: "20°C – 25°C (Travail lent à température de cave voûtée)",
      storageCapacityLiters: 8000,
      storageType: "Jarres en terre cuite vernissée & fûts inox alimentaires",
      avgYieldRange: "19 à 22 L / quintal",
      avgAcidity: "0,5 % à 1,0 %",
      byproductsValorization: "Briquettes de grignon sec pressé pour foyers villageois"
    },
    services: [
      "Trituration à l'ancienne de petits lots dès 80 kg",
      "Visites guidées patrimoniales et démonstration du savoir-faire kabyle",
      "Dégustation traditionnelle avec galette d'orge (Aghroum) au moulin",
      "Vente directe d'huile de garde non filtrée en cruches et bidons"
    ],
    campaignInfo: {
      openingHours: "Tous les jours de 07h00 à 18h30",
      pricingInfo: "11 DA / kg ou 10 % en huile",
      averageWaitTime: "Passage dans la journée selon ordre d'arrivée",
      appointmentRequired: false
    }
  },
  {
    id: "mill-07",
    name: "Agro-Huile Soummam (El Kseur)",
    commune: "El Kseur",
    daira: "El Kseur",
    lat: 36.6850,
    lng: 4.8580,
    type: "modern",
    typeLabel: "Centrifugation Continue & Conditionnement Verre Fumé",
    capacityQxPerDay: 90,
    contactPerson: "Karim Benkaci",
    phone: "+213 34 25 18 70",
    address: "Zone Industrielle Berchiche, El Kseur",
    yearEstablished: 2014,
    brands: ["Gouraya Gold", "Soummam Bio"],
    certifiedBio: true,
    igCandidate: true,
    description: "Grande unité moderne certifiée ISO 22000 et HACCP, exportant vers les marchés maghrébins et européens. Laboratoire interne de contrôle de l'acidité et des peroxydes.",
    speciality: "Huile d'olive extra-vierge filtrée pour exportation.",
    technicalSpecs: {
      hourlyThroughputKg: 1200,
      minBatchKg: 250,
      equipmentBrand: "Double Ligne Pieralisi Leopard DMF (2 Phases sans eau)",
      extractionProcess: "Extraction haute cadence automatisée avec contrôle optique des fruits",
      malaxationTemp: "22°C – 24,5°C (Pilotage automate PLC et traçabilité par lot)",
      storageCapacityLiters: 85000,
      storageType: "Chai isotherme 18 cuves Inox 316L sous azote + ligne d'embouteillage automatique",
      avgYieldRange: "19,5 à 23,5 L / quintal",
      avgAcidity: "≤ 0,25 % acide oléique (Certifié Export)",
      byproductsValorization: "Extraction de pâté d'olive (antioxydants cosmétiques) et granulés biomasse"
    },
    services: [
      "Laboratoire interne d'analyse certifié (acidité, peroxydes, K232/K270)",
      "Ligne d'embouteillage, capsulage et étiquetage aux normes export (UE / Canada)",
      "Achat direct des récoltes d'olives saines sur contrat auprès des producteurs",
      "Trituration dédiée aux lots certifiés Agriculture Biologique (ECOCERT)",
      "Logistique de collecte par camions-bennes alimentaires dans toute la wilaya"
    ],
    campaignInfo: {
      openingHours: "24h/24 et 7j/7 en période de pic de récolte (3 équipes)",
      pricingInfo: "15 DA / kg (trituration simple) · Forfait conditionnement sur devis",
      averageWaitTime: "Moins de 4h grâce à la double ligne continue",
      appointmentRequired: true
    }
  },
  {
    id: "mill-08",
    name: "Huilerie des Crêtes d'Adekar",
    commune: "Adekar",
    daira: "Adekar",
    lat: 36.6990,
    lng: 4.6650,
    type: "domaine",
    typeLabel: "Moulin de Haute Montagne (900m d'altitude)",
    capacityQxPerDay: 35,
    contactPerson: "Youcef Ait-Kaci",
    phone: "+213 664 30 75 19",
    address: "Village Hallafa, Forêt de l'Akfadou, Adekar",
    yearEstablished: 2008,
    brands: ["L'Or d'Akfadou"],
    certifiedBio: true,
    igCandidate: true,
    description: "Située en bordure de la majestueuse forêt de chênes d'Akfadou. Les oliviers bénéficient d'un microclimat montagnard vivifiant conférant à l'huile une teneur record en antioxydants.",
    speciality: "Arômes sauvages, notes de thym et de genêt de montagne.",
    technicalSpecs: {
      hourlyThroughputKg: 450,
      minBatchKg: 100,
      equipmentBrand: "Oliomio / Mori-TEM 2 Phases (Spécial Lots de Terroir)",
      extractionProcess: "Micro-huilerie de précision à couteaux inox et malaxage court",
      malaxationTemp: "21°C – 23°C (Préservation maximale des polyphénols de montagne)",
      storageCapacityLiters: 16000,
      storageType: "Cuves Inox sous gaz inerte en cave semi-enterrée",
      avgYieldRange: "17,5 à 20,5 L / quintal (haute concentration polyphénolique)",
      avgAcidity: "≤ 0,29 % acide oléique",
      byproductsValorization: "Compostage forestier enrichi aux feuilles d'olivier pour amendement"
    },
    services: [
      "Trituration de micro-lots parcellaires dès 100 kg",
      "Sélection spéciale cuvées haute teneur en polyphénols (> 450 mg/kg)",
      "Mise en bouteille verre sombre numérotée à la propriété",
      "Conseil en récolte précoce de montagne et prêt de caisses ajourées",
      "Expédition de coffrets dégustation dans les 58 wilayas"
    ],
    campaignInfo: {
      openingHours: "Tous les jours de 07h00 à 19h30",
      pricingInfo: "15 DA / kg ou 10 % en huile",
      averageWaitTime: "Moins de 6h sur prise de rendez-vous",
      appointmentRequired: true
    }
  },
  {
    id: "mill-09",
    name: "Huilerie Moderne de la Vallée d'Amizour",
    commune: "Amizour",
    daira: "Amizour",
    lat: 36.6450,
    lng: 4.9100,
    type: "modern",
    typeLabel: "Chaîne Continue 2 Phases",
    capacityQxPerDay: 45,
    contactPerson: "Nabil Cherifi",
    phone: "+213 555 12 43 88",
    address: "Entrée Ouest RN 75, Amizour",
    yearEstablished: 2016,
    brands: ["Amizour Pure Vierge"],
    certifiedBio: true,
    igCandidate: true,
    description: "Installations de trituration récentes axées sur les oliveraies de la plaine d'Amizour et du contrefort d'Oued Amassine.",
    speciality: "Fruité équilibré et grande douceur en bouche.",
    technicalSpecs: {
      hourlyThroughputKg: 600,
      minBatchKg: 150,
      equipmentBrand: "Barracane 2 Phases Inox",
      extractionProcess: "Lavage hydro-pneumatique, broyage doux et décantation horizontale",
      malaxationTemp: "23°C – 25,5°C",
      storageCapacityLiters: 24000,
      storageType: "Cuves Inox alimentaires avec filtration sur demande",
      avgYieldRange: "19 à 22 L / quintal",
      avgAcidity: "≤ 0,35 % acide oléique",
      byproductsValorization: "Séparation du noyau sec vendu comme biocombustible écologique"
    },
    services: [
      "Trituration à façon par lot individuel avec pesée électronique",
      "Filtration fine et remplissage en bidons alimentaires 5 L / 10 L / 20 L",
      "Prêt de caisses de récolte ventilées aux oléiculteurs de la daïra",
      "Parking poids lourds et quai de déchargement rapide"
    ],
    campaignInfo: {
      openingHours: "7j/7 de 06h30 à 21h00",
      pricingInfo: "13 DA / kg ou retenue de 10 %",
      averageWaitTime: "6h à 10h en moyenne",
      appointmentRequired: false
    }
  },
  {
    id: "mill-10",
    name: "Pressoir Artisanal des Collines de Timezrit",
    commune: "Timezrit",
    daira: "Timezrit",
    lat: 36.6520,
    lng: 4.7760,
    type: "traditional",
    typeLabel: "Presse Hydraulique Moderne & Meules",
    capacityQxPerDay: 30,
    contactPerson: "Lounes Bouzid",
    phone: "+213 661 40 92 15",
    address: "Village Ighil Oumched, Timezrit",
    yearEstablished: 1974,
    brands: ["Huile des Crêtes de Timezrit"],
    certifiedBio: false,
    igCandidate: true,
    description: "Perchée sur les hauteurs dominant la Soummam, cette huilerie familiale perpétue l'art de la trituration artisanale des vieilles souches de Chemlal.",
    speciality: "Robe vert sombre, arômes d'amande et d'herbe séchée.",
    technicalSpecs: {
      hourlyThroughputKg: 350,
      minBatchKg: 100,
      equipmentBrand: "Meules de Granit + Presses Hydrauliques Inox + Séparateur Final",
      extractionProcess: "Procédé mixte : broyage sur pierre de granit suivi d'une séparation centrifuge",
      malaxationTemp: "22°C – 26°C",
      storageCapacityLiters: 12000,
      storageType: "Cuves Inox alimentaires & décanteurs",
      avgYieldRange: "19 à 22,5 L / quintal",
      avgAcidity: "≤ 0,55 % acide oléique",
      byproductsValorization: "Grignon sec pressé valorisé pour les fours traditionnels et vergers"
    },
    services: [
      "Trituration mixte alliant goût traditionnel des meules et pureté centrifuge",
      "Acceptation des petits lots familiaux dès 100 kg",
      "Conseil sur la maturité optimale des vergers de montagne",
      "Vente directe d'huile vierge du terroir de Timezrit"
    ],
    campaignInfo: {
      openingHours: "Tous les jours de 06h30 à 20h00",
      pricingInfo: "12 DA / kg ou 10 % en huile",
      averageWaitTime: "Moins de 12h",
      appointmentRequired: false
    }
  },
  {
    id: "mill-11",
    name: "Moulin Coopératif de Chemini",
    commune: "Chemini",
    daira: "Chemini",
    lat: 36.6040,
    lng: 4.6130,
    type: "cooperative",
    typeLabel: "Unité Solidaire de Trituration",
    capacityQxPerDay: 40,
    contactPerson: "Bureau des Oléiculteurs",
    phone: "+213 34 33 21 09",
    address: "Centre bourg, Chemini",
    yearEstablished: 1992,
    brands: ["Chemini Terroir"],
    certifiedBio: true,
    igCandidate: true,
    description: "Coopérative villageoise réunissant les arboriculteurs des versants escarpés de l'Akfadou. Récolte méticuleuse et respect du calendrier floral.",
    speciality: "Notes prononcées de pomme verte et d'artichaut.",
    technicalSpecs: {
      hourlyThroughputKg: 520,
      minBatchKg: 100,
      equipmentBrand: "Amenduni 2 Phases & Effeuilleuse Haute Capacité",
      extractionProcess: "Extraction coopérative à froid avec traçabilité par village (Ath Waghlis)",
      malaxationTemp: "22°C – 25°C",
      storageCapacityLiters: 22000,
      storageType: "Cuves Inox collectives et individuelles scellées",
      avgYieldRange: "18,5 à 21,5 L / quintal",
      avgAcidity: "≤ 0,34 % acide oléique",
      byproductsValorization: "Plateforme de compostage collectif pour les vergers en terrasses"
    },
    services: [
      "Trituration solidaire par lot villageois ou individuel (dès 100 kg)",
      "Mise en commun de filets, échelles légères et caisses ajourées",
      "Formation annuelle à la taille de fructification et au contrôle du Dacus",
      "Conditionnement collectif pour les foires nationales et salons agricoles"
    ],
    campaignInfo: {
      openingHours: "7j/7 de 06h30 à 20h30",
      pricingInfo: "11 DA / kg (coopérateurs) · 13 DA / kg (extérieurs)",
      averageWaitTime: "Créneau planifié par comité de village (< 10h)",
      appointmentRequired: true
    }
  },
  {
    id: "mill-12",
    name: "Huilerie des Babors de Darguina",
    commune: "Darguina",
    daira: "Darguina",
    lat: 36.5710,
    lng: 5.2910,
    type: "modern",
    typeLabel: "Système Continu 3 Phases",
    capacityQxPerDay: 55,
    contactPerson: "Farid Kaci",
    phone: "+213 671 88 34 00",
    address: "Route des Gorges, Darguina",
    yearEstablished: 2012,
    brands: ["L'Émeraude des Babors"],
    certifiedBio: true,
    igCandidate: true,
    description: "Située sur le flanc oriental de la wilaya, traitant les olives montagnardes bénéficiant d'une pluviométrie abondante et de sols forestiers riches.",
    speciality: "Huile de caractère puissant et ardence marquée.",
    technicalSpecs: {
      hourlyThroughputKg: 700,
      minBatchKg: 150,
      equipmentBrand: "Pieralisi 3 Phases & Double Séparateur Vertical",
      extractionProcess: "Lavage par hydro-cyclone, broyage inox et centrifugation à basse température",
      malaxationTemp: "23°C – 25°C",
      storageCapacityLiters: 30000,
      storageType: "Cuves Inox 316L thermorégulées",
      avgYieldRange: "19 à 22,5 L / quintal",
      avgAcidity: "≤ 0,33 % acide oléique",
      byproductsValorization: "Bassin d'évaporation écologique sécurisé & valorisation du grignon sec"
    },
    services: [
      "Trituration à façon pour les producteurs du bassin oriental (Darguina, Kherrata, Souk El Tenine)",
      "Service de navette et collecte des récoltes en zones montagneuses",
      "Filtration et conditionnement en bouteilles verre et bidons alimentaires",
      "Contrôle gratuit du taux d'acidité à la sortie du séparateur"
    ],
    campaignInfo: {
      openingHours: "7j/7 de 06h00 à 21h30",
      pricingInfo: "13 DA / kg ou retenue de 10 % en huile",
      averageWaitTime: "Moins de 8h sur réservation",
      appointmentRequired: true
    }
  }
];

export const TASTING_GUIDE = {
  positiveAttributes: [
    {
      name: "Le Fruité (Fruity)",
      definition: "Ensemble des sensations olfactives caractéristiques de l'huile, dépendantes de la variété des olives et perçues directement ou par voie rétro-nasale.",
      kabyleNotes: "Dans nos huiles de Béjaïa : fruité vert aux arômes d'herbe fraîchement coupée, feuille d'olivier, artichaut cru, pomme verte et amande fraîche."
    },
    {
      name: "L'Amertume (Bitter)",
      definition: "Saveur élémentaire caractéristique des huiles obtenues d'olives vertes ou au stade véraison, perçue sur les papilles caliciformes de la langue.",
      kabyleNotes: "Signe indéniable de fraîcheur et de forte teneur en polyphénols (antioxydants protecteurs). Une amertume modérée témoigne d'un fruit récolté au bon moment."
    },
    {
      name: "L'Ardence / Piquant (Pungent)",
      definition: "Sensation tactile de picotement au fond de la gorge, ressentie quelques secondes après la déglutition.",
      kabyleNotes: "Causée par l'oléocanthal, un composé naturel anti-inflammatoire remarquable propre aux huiles d'olive vierges extra d'exception comme la Chemlal de Kabylie."
    }
  ],
  coiCategories: [
    {
      grade: "Huile d'Olive Vierge Extra (HOVE)",
      acidity: "Acidité oléique ≤ 0.8% (visée ADOIO ≤ 0.3%)",
      peroxide: "Indice peroxyde ≤ 20 meq O2/kg",
      tastingNotes: "Fruité > 0, défaut sensoriel = 0. Qualité absolue, extraction 100% mécanique à froid (< 27°C)."
    },
    {
      grade: "Huile d'Olive Vierge",
      acidity: "Acidité oléique ≤ 2.0%",
      peroxide: "Indice peroxyde ≤ 20 meq O2/kg",
      tastingNotes: "Fruité présent, tolérance minime d'imperfection sensorielle. Goût agréable pour cuisson quotidienne."
    },
    {
      grade: "Huile d'Olive Courante / Lampante",
      acidity: "Acidité oléique > 2.0%",
      peroxide: "> 20 meq O2/kg",
      tastingNotes: "Olives restées trop longtemps en tas avant broyage (fermentation). Impropre à la consommation directe en l'état sans raffinage."
    }
  ],
  storageAdvice: [
    "À l'abri direct de la lumière : préférer les bouteilles en verre teinté foncé ou bidons inox alimentaires.",
    "À température stable : idéale entre 14°C et 18°C. Ne jamais la laisser près des fourneaux ou au plein soleil.",
    "Hermétique à l'air : bien reboucher après chaque service pour limiter l'oxydation des acides gras précieux.",
    "Consommation optimale : dans les 18 mois suivant la récolte pour profiter de l'intégralité des vitamines E et polyphénols."
  ]
};

export const CULINARY_PAIRINGS = [
  {
    dish: "Seksu s Zzit (Couscous Kabyle à l'Huile Nouvelle)",
    oilType: "Fruité Vert Intense de Chemlal",
    desc: "Versée généreusement à cru sur les grains de semoule cuits à la vapeur de légumes de saison (navets, fèves, courges). Le parfum végétal se libère instantanément sous l'effet de la chaleur."
  },
  {
    dish: "Aghrum Aquran & Tikerbabine",
    oilType: "Huile Vierge Extra Ronde & Équilibrée",
    desc: "Galette de semoule croustillante trempée dans l'huile dorée et saupoudrée d'une pincée de fleur de sel et de zaatar, ou boulettes de semoule aux herbes de la Soummam."
  },
  {
    dish: "Tiwaffa / Bissara (Purée de fèves séchées)",
    oilType: "Huile de Terroir Rustique et Ardent",
    desc: "Un filet généreux d'huile d'olive ardente avec cumin sauvage et piment de Cayenne pour réchauffer les rigoureux hivers kabyles."
  },
  {
    dish: "Salades Champêtres & Poissons de la Baie de Béjaïa",
    oilType: "Huile de Bouchouk El Ghalia aux notes d'artichaut",
    desc: "Idéale avec les sardines fraîches grillées du port de Béjaïa, tomates de plein champ et oignons rouges doux."
  }
];

export const AGRICULTURAL_CALENDAR = [
  {
    season: "Automne - Hiver (Novembre - Février)",
    action: "Campagne de Récolte & Trituration",
    kabyleTerm: "Alqad uzemmur",
    tasks: [
      "Pose impérative de filets au sol sous les arbres (bannir le contact direct avec la terre humide)",
      "Cueillette délicate à la main ou au peigne vibreur sans endommager les rameaux florifères de l'an prochain",
      "Stockage temporaire en caisses plastiques ajourées et aérées (proscrire les sacs en plastique étanches)",
      "Acheminement et trituration au moulin sous 24 à 48 heures maximum après la cueillette pour préserver l'acidité < 0.5%"
    ]
  },
  {
    season: "Fin d'Hiver (Février - Mars)",
    action: "Taille de Fructification & Entretien",
    kabyleTerm: "Aheyyam / Asɣas",
    tasks: [
      "Aération du centre de la canopée pour laisser pénétrer le soleil et le vent (frein naturel aux champignons)",
      "Suppression des rejets gourmands verticaux et des branches mortes ou séniles",
      "Application de mastic cicatrisant ou badigeon à la chaux sur les plaies de taille importantes",
      "Broyage fin des branches de taille et restitution au sol comme paillage organique"
    ]
  },
  {
    season: "Printemps (Avril - Mai)",
    action: "Floraison, Nourriture du Sol & Protection",
    kabyleTerm: "Ajeggeg d Umger",
    tasks: [
      "Labour superficiel (10-15 cm) pour éliminer les adventices concurrentes en eau sans couper les racines superficielles",
      "Apport de compost organique mûr issu du recyclage des grignons d'olive compostés",
      "Surveillance de la floraison et de la nouaison des jeunes fruits"
    ]
  },
  {
    season: "Été (Juin - Septembre)",
    action: "Veille Sanitaire & Lutte Biologique",
    kabyleTerm: "Asseggas d Tiwiziyin",
    tasks: [
      "Pose de pièges à phéromones et alimentaires contre la mouche de l'olive (Bactrocera oleae)",
      "Arrosage d'appoint ciblé au goutte-à-goutte pour les jeunes plantations lors des pics de canicule",
      "Désherbage de sécurité autour des troncs pour créer des coupe-feux préventifs contre les incendies estivaux"
    ]
  }
];

export interface CollectionPoint {
  id: string;
  name: string;
  commune: string;
  daira: string;
  lat: number;
  lng: number;
  capacityTonnes: number;
  manager: string;
  phone: string;
  operatingDays: string;
  features: string[];
  description: string;
}

export const BEJAIA_COLLECTION_POINTS: CollectionPoint[] = [
  {
    id: "cp-seddouk",
    name: "Point de Collecte & Pesage Central de Seddouk",
    commune: "Seddouk",
    daira: "Seddouk",
    lat: 36.556,
    lng: 4.688,
    capacityTonnes: 280,
    manager: "Coopérative Oléicole de la Haute-Soummam",
    phone: "+213 661630658",
    operatingDays: "Tous les jours en saison (7h - 19h)",
    features: ["Pont-bascule électronique certifié", "Tri et effeuillage automatisé", "Caisses plastiques ajourées normalisées", "Contrôle d'acidité préalable"],
    description: "Plateforme centrale de collecte et de pesage de référence de la daïra de Seddouk, directement rattachée au réseau des huileries partenaires de l'ADOIO."
  },
  {
    id: "cp-akbou",
    name: "Hub de Collecte & Transit Oléicole d'Akbou",
    commune: "Akbou",
    daira: "Akbou",
    lat: 36.462,
    lng: 4.548,
    capacityTonnes: 450,
    manager: "Groupement des Producteurs de la Soummam",
    phone: "+213 34 35 22 10",
    operatingDays: "Lundi au Samedi (6h30 - 20h)",
    features: ["Pesage gros tonnage (camions & tracteurs)", "Zone de stockage ventilée sous abri", "Logistique directe vers huileries continues"],
    description: "Principal hub de regroupement des récoltes du grand bassin d'Akbou, de la plaine alluviale et des vergers étagés de l'Ighram."
  },
  {
    id: "cp-tazmalt",
    name: "Point de Collecte & Pesage de Tazmalt",
    commune: "Tazmalt",
    daira: "Tazmalt",
    lat: 36.386,
    lng: 4.398,
    capacityTonnes: 220,
    manager: "Association Agricole de Tazmalt",
    phone: "+213 34 38 14 55",
    operatingDays: "Tous les jours en récolte (7h - 18h30)",
    features: ["Pesage numérique individuel", "Fourniture de caisses alimentaires", "Acheminement quotidien vers les moulins"],
    description: "Centre de collecte stratégique pour les vergers de piémont du Djurdjura oriental et les exploitants familiaux de Tazmalt et Beni Mellikeche."
  },
  {
    id: "cp-sidi-aich",
    name: "Centre de Réception & Collecte de Sidi Aïch",
    commune: "Sidi Aïch",
    daira: "Sidi Aïch",
    lat: 36.615,
    lng: 4.692,
    capacityTonnes: 260,
    manager: "Coopérative Agricole de Sidi Aïch",
    phone: "+213 34 29 40 88",
    operatingDays: "7j/7 en période de cueillette",
    features: ["Pont-bascule 30 tonnes", "Bande de tri et soufflerie pour feuilles", "Enregistrement numérique des lots"],
    description: "Plateforme de convergence des récoltes de la moyenne vallée de la Soummam, garantissant un délai court (moins de 24h) avant trituration."
  },
  {
    id: "cp-el-kseur",
    name: "Point de Collecte de la Basse-Vallée (El Kseur)",
    commune: "El Kseur",
    daira: "El Kseur",
    lat: 36.688,
    lng: 4.858,
    capacityTonnes: 240,
    manager: "Antenne Oléicole d'El Kseur",
    phone: "+213 34 25 11 02",
    operatingDays: "Lundi au Samedi (7h - 18h)",
    features: ["Pesage électronique", "Stockage isotherme aéré", "Assistance technique aux oléiculteurs"],
    description: "Point de ralliement des récoltes des vergers intensifs et traditionnels situés à la charnière de la vallée et du golfe de Béjaïa."
  },
  {
    id: "cp-adekar",
    name: "Station de Collecte d'Altitude d'Adekar",
    commune: "Adekar",
    daira: "Adekar",
    lat: 36.738,
    lng: 4.662,
    capacityTonnes: 140,
    manager: "Collectif des Oléiculteurs de l'Akfadou",
    phone: "+213 34 32 80 15",
    operatingDays: "Mardi au Dimanche (8h - 17h30)",
    features: ["Pesage de montagne", "Conditionnement en caisses rigides", "Spécialité variété Chemlal d'altitude"],
    description: "Station dédiée aux oliveraies de haute altitude des crêtes boisées de l'Akfadou, réputées pour des huiles à forte teneur en antioxydants."
  },
  {
    id: "cp-amizour",
    name: "Point de Collecte & Pesage d'Amizour",
    commune: "Amizour",
    daira: "Amizour",
    lat: 36.642,
    lng: 4.908,
    capacityTonnes: 190,
    manager: "Groupement Agricole d'Amizour",
    phone: "+213 34 27 50 44",
    operatingDays: "Tous les jours en saison",
    features: ["Contrôle sanitaire visuel", "Pesée certifiée", "Transport groupé vers les huileries"],
    description: "Centre de transit assurant la collecte des oliveraies bordant l'Oued Soummam et le massif de Merdj Ouamane."
  },
  {
    id: "cp-tichy",
    name: "Point de Collecte Littoral & Babors (Tichy / Aokas)",
    commune: "Tichy",
    daira: "Tichy",
    lat: 36.668,
    lng: 5.158,
    capacityTonnes: 110,
    manager: "Relais Oléicole de la Côte Est",
    phone: "+213 34 23 72 30",
    operatingDays: "Lundi au Samedi (8h - 17h)",
    features: ["Pesée numérique", "Caisses de transport sécurisées", "Traitement des olives de côte"],
    description: "Service de proximité pour les oliveraies des versants maritimes et des contreforts nord des Babors."
  }
];

