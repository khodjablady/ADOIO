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

export const ADOIO_INFO = {
  acronym: "ADOIO",
  fullName: "Association pour le Développement de l'Oléiculture et des Industries Oléicoles de la Wilaya de Béjaïa",
  tamazightTitle: "Tiddukla i Usnerni n Uzemmur d Tmguriwin n Uzemmur n Twilayt n Bgayet",
  creationYear: 2004,
  headquarters: "Chambre d'Agriculture de Béjaïa, 06000, Béjaïa - Algérie",
  phone: "+213 661630658",
  mobile: "+213 661 77 80 80",
  email: "infos@blady-product.com",
  contactSecondary: "contact@olive-bejaia.dz",
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
    proportionKabylie: "82% à 85% du verger",
    oilYieldPercent: "20% à 25% (20 à 25 L / quintal)",
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
    oilYieldPercent: "17% à 21%",
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
    proportionKabylie: "3% à 4% du verger",
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
    category: "table",
    proportionKabylie: "2% du verger",
    oilYieldPercent: "15% à 18%",
    harvestWindow: "Octobre à Novembre",
    fruitCharacteristics: "Gros fruit ovoïde régulier, chair très abondante et croquante, faible adhérence du noyau.",
    flavorProfile: ["Notes beurrées", "Amande douce", "Acidité très faible"],
    resistance: "Demande des sols plus profonds et une bonne hygrométrie.",
    description: "Variété d'excellence pour la confiserie des olives de table en saumure aromatisée (thym de Kabylie, laurier sauvage, ail et rondelles de citron).",
    bestUse: "Conserves d'olives de table traditionnelles au sel marin, apéritifs kabyles."
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
    speciality: "Fruité vert d'exception, acidité garantie inférieure à 0.3%."
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
    speciality: "Huile monovariétale Chemlal primée aux concours nationaux."
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
    speciality: "Huile douce fruitée mûre, arômes de fruits secs et de pâte d'olive."
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
    speciality: "Assemblage équilibré Chemlal et Aberkane de haute altitude."
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
    speciality: "Fruité vert intense aux notes d'artichaut et de feuille fraîche."
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
    speciality: "Huile de garde traditionnelle, ambrée et parfumée."
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
    speciality: "Huile d'olive extra-vierge filtrée pour exportation."
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
    speciality: "Arômes sauvages, notes de thym et de genêt de montagne."
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
    speciality: "Fruité équilibré et grande douceur en bouche."
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
    speciality: "Robe vert sombre, arômes d'amande et d'herbe séchée."
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
    speciality: "Notes prononcées de pomme verte et d'artichaut."
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
    speciality: "Huile de caractère puissant et ardence marquée."
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
