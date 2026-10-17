import React, { useState, useMemo } from 'react';
import { 
  Sprout, 
  Trees, 
  Scale, 
  Layers, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Droplets, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  Clock,
  Printer
} from 'lucide-react';

export type TreeAgeGroup = 'young' | 'growth' | 'mature' | 'centennial';
export type OrganicFertilizerType = 'farm_manure' | 'olive_pomace_compost' | 'vegetal_compost' | 'poultry_manure';
export type SoilType = 'schist_mountain' | 'alluvial_plain' | 'clay_limestone';
export type VigorGoal = 'traditional_dry' | 'optimal_dry' | 'supplementary_irrigation';

interface AgeConfig {
  id: TreeAgeGroup;
  label: string;
  ageSpan: string;
  description: string;
  baseKgPerTree: number; // kg compost per tree
  nRequirementGrams: number; // g N per tree
  pRequirementGrams: number; // g P2O5 per tree
  kRequirementGrams: number; // g K2O per tree
  crownRadiusMeters: number; // for spreading recommendations
}

const AGE_CONFIGS: Record<TreeAgeGroup, AgeConfig> = {
  young: {
    id: 'young',
    label: 'Jeunes Scions & Remplacements',
    ageSpan: '1 à 4 ans',
    description: 'Phase d’implantation racinaire. Besoins modérés axés sur le développement végétatif et la mycorhization.',
    baseKgPerTree: 8,
    nRequirementGrams: 50,
    pRequirementGrams: 30,
    kRequirementGrams: 40,
    crownRadiusMeters: 0.8
  },
  growth: {
    id: 'growth',
    label: 'Jeunes Arbres en Formation',
    ageSpan: '5 à 15 ans',
    description: 'Entrée en production et structuration charpentière. Besoin d’un apport régulier pour soutenir la croissance et les premières récoltes.',
    baseKgPerTree: 20,
    nRequirementGrams: 150,
    pRequirementGrams: 70,
    kRequirementGrams: 180,
    crownRadiusMeters: 1.8
  },
  mature: {
    id: 'mature',
    label: 'Adultes en Pleine Production',
    ageSpan: '16 à 50 ans',
    description: 'Productivité maximale (35-70 kg d’olives/arbre). Reconstitution majeure des exportations en potasse (K) et azote (N).',
    baseKgPerTree: 40,
    nRequirementGrams: 350,
    pRequirementGrams: 140,
    kRequirementGrams: 450,
    crownRadiusMeters: 3.2
  },
  centennial: {
    id: 'centennial',
    label: 'Vénérables & Multiséculaires',
    ageSpan: 'Plus de 50 ans (Centenaires de Seddouk/Chemini)',
    description: 'Arbres patrimoniaux à très grand houppier. Entretien de la fertilité humique profonde et soutien contre l’alternance biennale.',
    baseKgPerTree: 65,
    nRequirementGrams: 500,
    pRequirementGrams: 200,
    kRequirementGrams: 650,
    crownRadiusMeters: 4.8
  }
};

interface FertilizerProperties {
  id: OrganicFertilizerType;
  name: string;
  localOrigin: string;
  nPercent: number; // % N sur matière brute
  pPercent: number; // % P2O5
  kPercent: number; // % K2O
  organicMatterPercent: number; // % MO
  ratioCN: string;
  description: string;
  adoioNote: string;
}

const FERTILIZERS_DATA: Record<OrganicFertilizerType, FertilizerProperties> = {
  farm_manure: {
    id: 'farm_manure',
    name: 'Fumier de Ferme Ovin / Bovin Composté',
    localOrigin: 'Élevages pastoraux des douars de Kabylie',
    nPercent: 0.6,
    pPercent: 0.35,
    kPercent: 0.8,
    organicMatterPercent: 28,
    ratioCN: '16 - 20 (Équilibré)',
    description: 'Amendement traditionnel kabyle par excellence. Libération lente et continue des nutriments, amélioration spectaculaire de la structure du sol.',
    adoioNote: 'Exiger un fumier mûri d’au moins 6 mois pour éviter la brûlure des radicelles et détruire les graines d’adventices.'
  },
  olive_pomace_compost: {
    id: 'olive_pomace_compost',
    name: 'Compost de Grignons d’Olive & Margines',
    localOrigin: 'Valorisation des 448 huileries de la wilaya de Béjaïa',
    nPercent: 1.1,
    pPercent: 0.45,
    kPercent: 1.6,
    organicMatterPercent: 42,
    ratioCN: '22 - 26 (Humigène)',
    description: 'Circulaire et écologique. Exceptionnellement riche en potassium (K₂O) et en matière organique stable réactivant la microflore du sol.',
    adoioNote: 'Idéal pour le terroir kabyle. Le compostage aérobie neutralise les polyphénols inhibiteurs et concentre le potassium.'
  },
  vegetal_compost: {
    id: 'vegetal_compost',
    name: 'Compost Végétal Fermier (Broyats de Taille & Litière)',
    localOrigin: 'Recyclage des résidus de taille d’oliviers sur l’exploitation',
    nPercent: 0.8,
    pPercent: 0.3,
    kPercent: 0.7,
    organicMatterPercent: 35,
    ratioCN: '20 - 24',
    description: 'Produit sur place par broyage des rameaux d’émondage et feuilles d’olivier. Zéro coût d’achat et excellente rétention d’humidité.',
    adoioNote: 'Ne composter que des résidus de bois sains, exempts de verticilliose ou de tumeurs bactériennes du chancre.'
  },
  poultry_manure: {
    id: 'poultry_manure',
    name: 'Fientes de Volaille Compostées (Fumier Avicole)',
    localOrigin: 'Coopératives avicoles de la vallée de la Soummam',
    nPercent: 2.2,
    pPercent: 1.8,
    kPercent: 1.2,
    organicMatterPercent: 50,
    ratioCN: '9 - 12 (Minéralisation rapide)',
    description: 'Amendement concentré « coup de fouet ». Très riche en azote et phosphore, parfait pour les vergers carencés ou fatigués.',
    adoioNote: 'À doser avec modération (quantités réduites de moitié) pour éviter tout excès végétatif au détriment de la fructification.'
  }
};

export const OrganicFertilizationCalculator: React.FC = () => {
  // Input states
  const [calculationMode, setCalculationMode] = useState<'area' | 'treeCount'>('area');
  const [areaHectares, setAreaHectares] = useState<number>(1.5);
  const [treeDensity, setTreeDensity] = useState<number>(120); // trees / hectare
  const [directTreeCount, setDirectTreeCount] = useState<number>(180);
  const [ageGroup, setAgeGroup] = useState<TreeAgeGroup>('mature');
  const [fertilizerType, setFertilizerType] = useState<OrganicFertilizerType>('olive_pomace_compost');
  const [vigorGoal, setVigorGoal] = useState<VigorGoal>('optimal_dry');
  const [soilType, setSoilType] = useState<SoilType>('schist_mountain');
  const [includeCoverCrop, setIncludeCoverCrop] = useState<boolean>(true); // Engrais vert féverole

  // Effective number of trees
  const totalTrees = useMemo(() => {
    if (calculationMode === 'area') {
      return Math.round(areaHectares * treeDensity);
    }
    return Math.max(1, directTreeCount);
  }, [calculationMode, areaHectares, treeDensity, directTreeCount]);

  // Vigor multiplier
  const vigorMultiplier = useMemo(() => {
    switch (vigorGoal) {
      case 'traditional_dry': return 0.85;
      case 'optimal_dry': return 1.0;
      case 'supplementary_irrigation': return 1.25;
    }
  }, [vigorGoal]);

  // Soil modifier
  const soilMultiplier = useMemo(() => {
    switch (soilType) {
      case 'schist_mountain': return 1.1; // Pentes lessivées nécessitant plus de matière organique
      case 'alluvial_plain': return 0.95; // Sols alluvionnaires déjà profonds
      case 'clay_limestone': return 1.0;
    }
  }, [soilType]);

  // Calculations
  const results = useMemo(() => {
    const ageCfg = AGE_CONFIGS[ageGroup];
    const fertCfg = FERTILIZERS_DATA[fertilizerType];

    // Base requirement per tree modified by vigor and soil
    let kgPerTree = ageCfg.baseKgPerTree * vigorMultiplier * soilMultiplier;

    // Adjust for fertilizer concentration (poultry manure is much more concentrated)
    if (fertilizerType === 'poultry_manure') {
      kgPerTree *= 0.45;
    } else if (fertilizerType === 'olive_pomace_compost') {
      kgPerTree *= 0.9; // Pomace compost is nutrient-dense
    }

    kgPerTree = Math.round(kgPerTree * 10) / 10;
    const totalTonnes = Math.round((kgPerTree * totalTrees / 1000) * 100) / 100;

    // Nutrient supply in kg
    const totalNSupply = Math.round((totalTonnes * 1000 * (fertCfg.nPercent / 100)));
    const totalPSupply = Math.round((totalTonnes * 1000 * (fertCfg.pPercent / 100)));
    const totalKSupply = Math.round((totalTonnes * 1000 * (fertCfg.kPercent / 100)));
    const totalMOSupply = Math.round((totalTonnes * (fertCfg.organicMatterPercent / 100)) * 10) / 10;

    // Cover crop bonus (féverole apporte 30-50 kg N/ha par fixation symbiotique)
    const coverCropNBonus = includeCoverCrop ? Math.round((calculationMode === 'area' ? areaHectares : totalTrees / 120) * 40) : 0;

    // Practical units
    const wheelbarrows = Math.round((totalTonnes * 1000) / 50); // 1 brouette ≈ 50 kg
    const farmTrailers = Math.round((totalTonnes / 2.5) * 10) / 10; // 1 remorque agricole ≈ 2.5 tonnes

    return {
      totalTrees,
      kgPerTree,
      totalTonnes,
      wheelbarrows,
      farmTrailers,
      totalNSupply: totalNSupply + coverCropNBonus,
      coverCropNBonus,
      totalPSupply,
      totalKSupply,
      totalMOSupply,
      crownRadiusMeters: ageCfg.crownRadiusMeters,
      targetNPerTree: ageCfg.nRequirementGrams,
      targetKPerTree: ageCfg.kRequirementGrams
    };
  }, [ageGroup, fertilizerType, vigorMultiplier, soilMultiplier, totalTrees, includeCoverCrop, calculationMode, areaHectares]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="calculateur-fertilisation" className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-xs relative overflow-hidden mb-12 scroll-mt-32">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#8CBE5D]/15 via-[#E6AB3C]/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#E6DEC9] relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1.5">
            <Sprout className="w-4 h-4 text-[#8CBE5D]" />
            <span>Agronomie de Précision · Terroir de Béjaïa</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18230F] flex items-center gap-2.5">
            <span>Calculateur de Fertilisation Organique de l'Oliveraie</span>
            <span className="hidden sm:inline-block text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#E8F4D9] text-[#233416] border border-[#8CBE5D]">
              Normes ADOIO
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-[#436229] mt-1 max-w-2xl leading-relaxed">
            Estimez précisément les tonnages de fumier composté ou de compost de grignons nécessaires pour reconstituer les réserves de votre verger selon la superficie et l'âge des arbres.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-white text-[#233416] border border-[#E6DEC9] text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          title="Imprimer ou enregistrer en PDF la fiche de fertilisation"
        >
          <Printer className="w-4 h-4 text-[#567B34]" />
          <span>Fiche Récapitulative</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Parameter Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Parcel Size & Density */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC9]">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-[#18230F] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#567B34]" />
                <span>1. Taille de la Parcelle & Peuplement</span>
              </label>

              {/* Toggle Area vs Tree Count */}
              <div className="flex bg-white rounded-lg p-0.5 border border-[#E6DEC9] text-xs">
                <button
                  type="button"
                  onClick={() => setCalculationMode('area')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    calculationMode === 'area'
                      ? 'bg-[#233416] text-[#FAF7F2]'
                      : 'text-[#436229] hover:text-[#18230F]'
                  }`}
                >
                  Par Surface
                </button>
                <button
                  type="button"
                  onClick={() => setCalculationMode('treeCount')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    calculationMode === 'treeCount'
                      ? 'bg-[#233416] text-[#FAF7F2]'
                      : 'text-[#436229] hover:text-[#18230F]'
                  }`}
                >
                  Par Nombre d’Arbres
                </button>
              </div>
            </div>

            {calculationMode === 'area' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#436229] font-medium">Surface du verger :</span>
                    <span className="font-bold text-[#18230F]">{areaHectares} ha ({Math.round(areaHectares * 100)} ares)</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="15"
                    step="0.1"
                    value={areaHectares}
                    onChange={(e) => setAreaHectares(parseFloat(e.target.value))}
                    className="w-full accent-[#233416] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#567B34] mt-1">
                    <span>0.2 ha (Jardin)</span>
                    <span>5 ha</span>
                    <span>15 ha (Grand domaine)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#436229] font-medium">Densité d'arbres :</span>
                    <span className="font-bold text-[#18230F]">{treeDensity} arbres / ha</span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="250"
                    step="10"
                    value={treeDensity}
                    onChange={(e) => setTreeDensity(parseInt(e.target.value))}
                    className="w-full accent-[#233416] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#567B34] mt-1">
                    <span>80 (Pentes Chemini)</span>
                    <span>120 (Standard Soummam)</span>
                    <span>200+ (Intensif)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#436229] font-medium">Nombre total d’oliviers à fertiliser :</span>
                  <span className="font-bold text-[#18230F] text-sm">{directTreeCount} oliviers</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1500"
                  step="10"
                  value={directTreeCount}
                  onChange={(e) => setDirectTreeCount(parseInt(e.target.value))}
                  className="w-full accent-[#233416] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#567B34] mt-1">
                  <span>10 oliviers</span>
                  <span>500 oliviers</span>
                  <span>1500 oliviers</span>
                </div>
              </div>
            )}

            <div className="mt-3 pt-2.5 border-t border-[#E6DEC9] flex items-center justify-between text-xs">
              <span className="text-[#567B34] flex items-center gap-1">
                <Trees className="w-3.5 h-3.5 text-[#8CBE5D]" />
                <span>Effectif total calculé du verger :</span>
              </span>
              <span className="font-bold text-[#233416] px-2 py-0.5 rounded-md bg-[#E8F4D9] border border-[#8CBE5D]/40">
                {results.totalTrees} arbres
              </span>
            </div>
          </div>

          {/* Step 2: Tree Age Selection */}
          <div>
            <label className="text-xs font-bold text-[#18230F] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Clock className="w-4 h-4 text-[#567B34]" />
              <span>2. Âge Dominant des Oliviers</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(AGE_CONFIGS) as TreeAgeGroup[]).map((key) => {
                const item = AGE_CONFIGS[key];
                const isSelected = ageGroup === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAgeGroup(key)}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#233416] text-[#FAF7F2] border-[#233416] shadow-xs'
                        : 'bg-white text-[#242A20] border-[#E6DEC9] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs sm:text-sm">{item.label}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-white/20 text-[#FAF7F2]' : 'bg-[#FAF7F2] text-[#567B34] border border-[#E6DEC9]'
                      }`}>
                        {item.ageSpan}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                      isSelected ? 'text-[#E8F4D9]/90' : 'text-[#436229]'
                    }`}>
                      {item.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Organic Fertilizer Selection */}
          <div>
            <label className="text-xs font-bold text-[#18230F] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Scale className="w-4 h-4 text-[#567B34]" />
              <span>3. Type d'Amendement Organique Choisi</span>
            </label>

            <div className="space-y-2">
              {(Object.keys(FERTILIZERS_DATA) as OrganicFertilizerType[]).map((key) => {
                const item = FERTILIZERS_DATA[key];
                const isSelected = fertilizerType === key;
                return (
                  <div
                    key={key}
                    onClick={() => setFertilizerType(key)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F4EEE1] border-[#31491E] shadow-2xs'
                        : 'bg-white border-[#E6DEC9] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="fertilizer"
                          checked={isSelected}
                          onChange={() => setFertilizerType(key)}
                          className="text-[#233416] focus:ring-[#8CBE5D] cursor-pointer mt-0.5"
                        />
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-[#18230F] flex flex-wrap items-center gap-2">
                            <span>{item.name}</span>
                            {key === 'olive_pomace_compost' && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                                ♻️ Recommandé Terroir Béjaïa
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#567B34] block mt-0.5">
                            {item.localOrigin}
                          </span>
                        </div>
                      </div>

                      {/* Nutrient mini pill */}
                      <div className="text-right shrink-0 hidden sm:block text-[11px] font-mono text-[#436229]">
                        <span>NPK: {item.nPercent}-{item.pPercent}-{item.kPercent}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 4: Soil Context & Cover Crop Option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC9]">
              <label className="text-[11px] font-bold text-[#18230F] uppercase block mb-1">
                Nature du Terroir / Pente
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#E6DEC9] rounded-lg text-xs font-semibold text-[#18230F] cursor-pointer"
              >
                <option value="schist_mountain">Versants Schisteux / Terrasses (Chemini/Adekar)</option>
                <option value="alluvial_plain">Plaine Alluvionnaire Profonde (Akbou/Sidi-Aïch)</option>
                <option value="clay_limestone">Plateaux Argilo-calcaires (Seddouk/Béni Maouche)</option>
              </select>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC9]">
              <label className="text-[11px] font-bold text-[#18230F] uppercase block mb-1">
                Objectif de Conduite
              </label>
              <select
                value={vigorGoal}
                onChange={(e) => setVigorGoal(e.target.value as VigorGoal)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#E6DEC9] rounded-lg text-xs font-semibold text-[#18230F] cursor-pointer"
              >
                <option value="traditional_dry">Pluvial Traditionnel (Entretien régulier)</option>
                <option value="optimal_dry">Pluvial Amélioré (Haute qualité Vierge Extra)</option>
                <option value="supplementary_irrigation">Irrigué d'appoint / Goutte-à-goutte</option>
              </select>
            </div>
          </div>

          {/* Cover Crop Checkbox (Tiwizi d'engrais vert) */}
          <div className="p-3.5 rounded-xl bg-[#E8F4D9]/50 border border-[#8CBE5D]/50 flex items-start gap-3">
            <input
              type="checkbox"
              id="coverCrop"
              checked={includeCoverCrop}
              onChange={(e) => setIncludeCoverCrop(e.target.checked)}
              className="rounded text-[#233416] mt-0.5 cursor-pointer"
            />
            <label htmlFor="coverCrop" className="text-xs text-[#233416] cursor-pointer">
              <span className="font-bold block">Associer un engrais vert hivernal (*Ibawen* - Féverole / Vesce)</span>
              <span className="text-[#436229] text-[11px] block mt-0.5">
                Fixe naturellement +40 kg d’Azote atmosphérique/ha, réduit de 25% le besoin en fumure et préserve le sol des fortes pluies hivernales.
              </span>
            </label>
          </div>

        </div>

        {/* Right Column: Calculations & Agronomic Prescription Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          
          {/* Main Output Box */}
          <div className="bg-gradient-to-br from-[#233416] to-[#18230F] text-[#FAF7F2] p-6 rounded-3xl shadow-lg border border-[#8CBE5D]/30 relative overflow-hidden">
            {/* Background seal */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#8CBE5D]/10 rounded-bl-full pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase font-bold tracking-wider text-[#E6AB3C] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Bilan Prescriptif ADOIO</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/90 border border-white/20">
                Campagne {new Date().getFullYear()}
              </span>
            </div>

            {/* Total Tonnage Highlight */}
            <div className="my-4">
              <span className="text-xs text-[#E8F4D9]/80 block font-medium">Volume d'amendement organique total :</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#FAF7F2]">
                  {results.totalTonnes}
                </span>
                <span className="text-xl font-bold text-[#E6AB3C]">Tonnes</span>
              </div>
              <div className="text-xs text-[#8CBE5D] font-semibold mt-1">
                Soit environ <span className="underline font-bold text-white">{results.kgPerTree} kg</span> par olivier
              </div>
            </div>

            {/* Practical Equivalences */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/15 my-4 text-xs">
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <span className="text-[#E8F4D9]/70 text-[10px] block uppercase">En brouettes (50 kg)</span>
                <span className="font-bold text-base text-white">{results.wheelbarrows} brouettes</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                <span className="text-[#E8F4D9]/70 text-[10px] block uppercase">En remorques (2.5 t)</span>
                <span className="font-bold text-base text-white">{results.farmTrailers} bennes</span>
              </div>
            </div>

            {/* NPK Breakdown */}
            <div className="pt-2 text-xs">
              <span className="text-[11px] font-bold text-[#E6AB3C] uppercase tracking-wider block mb-2">
                Éléments Fertilisants Majeurs Apportés :
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-[#E8F4D9]/80">Azote organique (N) :</span>
                  <span className="font-bold text-emerald-300">
                    {results.totalNSupply} kg
                    {results.coverCropNBonus > 0 && <span className="text-[10px] text-emerald-400 font-normal"> (dont +{results.coverCropNBonus} kg biofixé)</span>}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-[#E8F4D9]/80">Phosphore (P₂O₅) :</span>
                  <span className="font-bold text-white">{results.totalPSupply} kg</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-[#E8F4D9]/80">Potassium (K₂O) :</span>
                  <span className="font-bold text-amber-300">{results.totalKSupply} kg (Taux d'huile)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#E8F4D9]/80">Matière Organique Humique (MO) :</span>
                  <span className="font-bold text-[#8CBE5D]">{results.totalMOSupply} Tonnes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Spreading Protocols from ADOIO */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC9] space-y-3">
            <h4 className="text-xs font-bold text-[#18230F] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#567B34]" />
              <span>Règles d'Épandage Recommandées par l'ADOIO</span>
            </h4>

            <ul className="space-y-2 text-xs text-[#436229] leading-snug">
              <li className="flex items-start gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#E6AB3C] shrink-0 mt-0.5" />
                <span>
                  <strong>Période idéale :</strong> Fin novembre à janvier (post-récolte immédiate), pour que les pluies d'hiver dissolvent et enfouissent les fractions humiques.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-[#567B34] shrink-0 mt-0.5" />
                <span>
                  <strong>Zone d'épandage :</strong> En couronne à l'aplomb du feuillage (rayon de <strong>{results.crownRadiusMeters} m</strong> autour du tronc).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Attention :</strong> Ne jamais adosser le fumier contre le collet du tronc (risque d'asphyxie et développement du pourridié).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Enfouissement :</strong> Léger griffage à 10-15 cm de profondeur pour ne pas sectionner les radicelles nourricières de surface.
                </span>
              </li>
            </ul>

            <div className="mt-2 pt-2 border-t border-[#E6DEC9] text-[11px] text-[#567B34] italic">
              Note du terroir : {FERTILIZERS_DATA[fertilizerType].adoioNote}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
