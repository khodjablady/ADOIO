import React, { useState } from 'react';
import { 
  Calculator, 
  Droplet, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Calendar,
  Layers,
  Info,
  ArrowUpRight,
  Leaf,
  TreePine,
  Recycle,
  Sun,
  Flame,
  Wind,
  Sprout
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { OptimalHarvestAlertSystem } from './OptimalHarvestAlertSystem';
import { HarvestAlertManager } from './HarvestAlertManager';
import { ArticleAudioReader } from './ArticleAudioReader';

export const YieldSimulator: React.FC = () => {
  // Quick Converter state (top of section: 15% to 25% configurable yield)
  const [quickWeightKg, setQuickWeightKg] = useState<number>(300);
  const [quickUnit, setQuickUnit] = useState<'kg' | 'qx'>('kg');
  const [quickYieldPercent, setQuickYieldPercent] = useState<number>(20);

  const [inputMode, setInputMode] = useState<'weight' | 'trees'>('weight');
  const [weightKg, setWeightKg] = useState<number>(500); // 5 quintaux
  const [treeCount, setTreeCount] = useState<number>(30);
  const [kgPerTree, setKgPerTree] = useState<number>(25);

  const [selectedVariety, setSelectedVariety] = useState<string>('chemlal');
  const [comparedVariety, setComparedVariety] = useState<string>('bouchouk');
  const [isComparingVarieties, setIsComparingVarieties] = useState<boolean>(true);

  const [harvestPeriod, setHarvestPeriod] = useState<'early' | 'mid' | 'late'>('mid');
  const [extractionType, setExtractionType] = useState<'modern' | 'traditional'>('modern');
  const [delayHours, setDelayHours] = useState<'fast' | 'medium' | 'slow'>('fast');

  // Environmental & Carbon Footprint practices state
  const [soilPractice, setSoilPractice] = useState<'enherbe' | 'raisonne' | 'intensif'>('enherbe');
  const [fertPractice, setFertPractice] = useState<'organique' | 'raisonnee' | 'chimique'>('organique');
  const [phytoPractice, setPhytoPractice] = useState<'bio' | 'conventionnelle'>('bio');
  const [waterPractice, setWaterPractice] = useState<'pluvial' | 'solaire' | 'diesel'>('pluvial');
  const [byproductPractice, setByproductPractice] = useState<'circulaire' | 'standard'>('circulaire');

  // Compute total olive weight
  const totalWeight = inputMode === 'weight' ? weightKg : treeCount * kgPerTree;
  const totalQuintals = totalWeight / 100;

  // Base yields by variety (liters per quintal)
  const varietyBaseYields: Record<string, number> = {
    chemlal: 18.0,
    bouchouk: 22.5,
    aberkane: 19.5,
    limli: 22.5,
    azeradj: 22.5,
    autres: 20.0,
    assemblage: 19.8,
  };

  // Detailed agronomic & sensory profiles for side-by-side comparison
  const varietyProfiles: Record<
    string,
    {
      name: string;
      shortName: string;
      yieldRange: string;
      polyphenols: string;
      stability: string;
      terroir: string;
      sensory: string;
      caliber: string;
    }
  > = {
    chemlal: {
      name: 'Chemlal de Kabylie',
      shortName: 'Chemlal',
      yieldRange: '16 – 20 %',
      polyphenols: '420 mg/kg (Élevé)',
      stability: '18 – 24 mois',
      terroir: 'Vallée de la Soummam & piémonts',
      sensory: 'Fruité vert équilibré, amande fraîche, ardence franche',
      caliber: 'Petit à moyen (2,2 g)',
    },
    bouchouk: {
      name: 'Bouchouk',
      shortName: 'Bouchouk',
      yieldRange: '20 – 25 %',
      polyphenols: '340 mg/kg (Moyen-Haut)',
      stability: '14 – 18 mois',
      terroir: 'Guenzet, Beni Maouche, Haute-Soummam',
      sensory: 'Doux, floral, pomme mûre et noisette fraîche',
      caliber: 'Gros drupe (4,5 g)',
    },
    aberkane: {
      name: 'Aberkane',
      shortName: 'Aberkane',
      yieldRange: '19 – 23 %',
      polyphenols: '390 mg/kg (Élevé)',
      stability: '16 – 20 mois',
      terroir: 'Akbou, Ouzellaguen, Ighzer Amokrane',
      sensory: 'Rond, velouté, fruits noirs et cœur d’artichaut',
      caliber: 'Moyen à gros (3,8 g)',
    },
    limli: {
      name: 'Limli de Sidi-Aïch',
      shortName: 'Limli',
      yieldRange: '20 – 24 %',
      polyphenols: '460 mg/kg (Très élevé)',
      stability: '20 – 24 mois',
      terroir: 'Moyenne & Basse Soummam (Sidi-Aïch, El Kseur)',
      sensory: 'Fruité vert intense, herbacé vif et poivré',
      caliber: 'Moyen allongé (2,8 g)',
    },
    azeradj: {
      name: 'Azeradj / Adjeraz',
      shortName: 'Azeradj',
      yieldRange: '20 – 25 %',
      polyphenols: '450 mg/kg (Très élevé)',
      stability: '20 – 24 mois',
      terroir: 'Seddouk, Amalou, Tazmalt (pollinisateur)',
      sensory: 'Puissant, feuille d’olivier, tomate verte',
      caliber: 'Gros ovoïde (4,2 g)',
    },
    autres: {
      name: 'Autres / Exotique',
      shortName: 'Autres',
      yieldRange: '18 – 22 %',
      polyphenols: '310 mg/kg (Moyen)',
      stability: '12 – 16 mois',
      terroir: 'Périmètres irrigués récents',
      sensory: 'Fruité léger à moyen, souple en bouche',
      caliber: 'Moyen (3,2 g)',
    },
    assemblage: {
      name: 'Assemblage Kabyle',
      shortName: 'Assemblage',
      yieldRange: '18 – 22 %',
      polyphenols: '410 mg/kg (Élevé)',
      stability: '18 – 22 mois',
      terroir: 'Vergers familiaux mixtes (Chemlal + Azeradj)',
      sensory: 'Complexe, harmonieux, typicité terroir Béjaïa',
      caliber: 'Mixte (2,5 – 4,0 g)',
    },
  };

  // Modifier by harvest period
  const periodYieldFactor = {
    early: 0.85, // ~17 L/qx (early green)
    mid: 1.0,    // ~20.5 L/qx (optimum)
    late: 1.12,  // ~23 L/qx (black mature)
  }[harvestPeriod];

  // Modifier by extraction technology
  const techYieldFactor = extractionType === 'modern' ? 1.02 : 0.96;

  // Final estimated yield in Liters per quintal (Variety A)
  const finalYieldPerQuintal = (varietyBaseYields[selectedVariety] || 20) * periodYieldFactor * techYieldFactor;
  // Total estimated oil in Liters (Variety A)
  const estimatedOilLiters = Math.round(totalQuintals * finalYieldPerQuintal);

  // Final estimated yield in Liters per quintal (Variety B - Compared)
  const comparedYieldPerQuintal = (varietyBaseYields[comparedVariety] || 20) * periodYieldFactor * techYieldFactor;
  // Total estimated oil in Liters (Variety B - Compared)
  const comparedEstimatedOilLiters = Math.round(totalQuintals * comparedYieldPerQuintal);

  // Acidity calculation
  let baseAcidity = 0.25;
  if (harvestPeriod === 'late') baseAcidity += 0.25;
  if (extractionType === 'traditional') baseAcidity += 0.2;

  if (delayHours === 'fast') {
    // Under 24h
    baseAcidity += 0.05;
  } else if (delayHours === 'medium') {
    // 24-48h
    baseAcidity += 0.35;
  } else {
    // > 4 days (sacs plastiques)
    baseAcidity += 1.3;
  }

  const estimatedAcidity = parseFloat(baseAcidity.toFixed(2));

  // Determine official grade
  let qualityGrade = "Huile d'Olive Vierge Extra (HOVE)";
  let gradeColor = "text-[#31491E] bg-[#E8F4D9]";
  let pricePerLiter = 1150; // DZD

  if (estimatedAcidity > 0.8 && estimatedAcidity <= 2.0) {
    qualityGrade = "Huile d'Olive Vierge";
    gradeColor = "text-[#B47A16] bg-[#FEF5DB]";
    pricePerLiter = 850;
  } else if (estimatedAcidity > 2.0) {
    qualityGrade = "Huile d'Olive Courante / Lampante";
    gradeColor = "text-[#AF4D24] bg-red-100";
    pricePerLiter = 550;
  }

  const estimatedValueDZD = estimatedOilLiters * pricePerLiter;
  const comparedEstimatedValueDZD = comparedEstimatedOilLiters * pricePerLiter;

  // Deltas (Variety B vs Variety A)
  const yieldDiffPerQuintal = parseFloat((comparedYieldPerQuintal - finalYieldPerQuintal).toFixed(1));
  const litersDiff = comparedEstimatedOilLiters - estimatedOilLiters;
  const valueDiffDZD = comparedEstimatedValueDZD - estimatedValueDZD;
  const yieldDiffPercent =
    finalYieldPerQuintal > 0
      ? parseFloat((((comparedYieldPerQuintal - finalYieldPerQuintal) / finalYieldPerQuintal) * 100).toFixed(1))
      : 0;

  // Variety names for labels and tooltips
  const varietyNames: Record<string, string> = {
    chemlal: 'Chemlal de Kabylie',
    bouchouk: 'Bouchouk',
    aberkane: 'Aberkane',
    limli: 'Limli',
    azeradj: 'Azeradj / Adjeraz',
    autres: 'Autres / Exotique',
    assemblage: 'Assemblage Kabyle',
  };

  // Chart configuration state
  const [chartMetric, setChartMetric] = useState<'yield' | 'volume' | 'combined'>('yield');
  const [showWilayaBenchmark, setShowWilayaBenchmark] = useState<boolean>(true);

  // Multi-season historical data for Béjaïa Soummam Valley (2020 to 2026)
  const historicalSeasons = [
    {
      season: '2020-2021',
      shortYear: '20-21',
      isCurrent: false,
      cycle: 'Année de charge (+)',
      cycleType: 'on' as const,
      wilayaAvgYield: 21.0,
      seasonYieldFactor: 1.06,
      treeLoadFactor: 1.18,
      climateNote: 'Pluies printanières idéales en Soummam, véraison abondante et floraison homogène.',
    },
    {
      season: '2021-2022',
      shortYear: '21-22',
      isCurrent: false,
      cycle: 'Alternance biennale (-)',
      cycleType: 'off' as const,
      wilayaAvgYield: 17.6,
      seasonYieldFactor: 0.92,
      treeLoadFactor: 0.74,
      climateNote: 'Sécheresse estivale prolongée et repos physiologique post-charge des oliviers.',
    },
    {
      season: '2022-2023',
      shortYear: '22-23',
      isCurrent: false,
      cycle: 'Campagne d’équilibre',
      cycleType: 'mid' as const,
      wilayaAvgYield: 19.5,
      seasonYieldFactor: 1.00,
      treeLoadFactor: 0.98,
      climateNote: 'Climat tempéré et précipitations d’automne favorables en moyenne altitude.',
    },
    {
      season: '2023-2024',
      shortYear: '23-24',
      isCurrent: false,
      cycle: 'Concentration oléique',
      cycleType: 'mid' as const,
      wilayaAvgYield: 18.8,
      seasonYieldFactor: 0.96,
      treeLoadFactor: 0.88,
      climateNote: 'Faible pluviométrie compensée par des fruits riches en lipides et polyphénols.',
    },
    {
      season: '2024-2025',
      shortYear: '24-25',
      isCurrent: false,
      cycle: 'Grande charge (+)',
      cycleType: 'on' as const,
      wilayaAvgYield: 21.8,
      seasonYieldFactor: 1.08,
      treeLoadFactor: 1.22,
      climateNote: 'Pluies généreuses de fin d’été, fruits charnus et floraison record.',
    },
    {
      season: '2025-2026',
      shortYear: '25-26*',
      isCurrent: true,
      cycle: 'Simulation Actuelle',
      cycleType: 'on' as const,
      wilayaAvgYield: 19.4,
      seasonYieldFactor: 1.00,
      treeLoadFactor: 1.00,
      climateNote: 'Projection basée sur vos paramètres actuels (variété, cueillette et trituration).',
    },
  ];

  // Map data for Recharts (including both Variety A and Variety B)
  const multiSeasonChartData = historicalSeasons.map((s) => {
    const calculatedYield = s.isCurrent
      ? parseFloat(finalYieldPerQuintal.toFixed(1))
      : parseFloat((finalYieldPerQuintal * s.seasonYieldFactor).toFixed(1));

    const calculatedComparedYield = s.isCurrent
      ? parseFloat(comparedYieldPerQuintal.toFixed(1))
      : parseFloat((comparedYieldPerQuintal * s.seasonYieldFactor).toFixed(1));

    const seasonWeightKg = Math.round(totalWeight * s.treeLoadFactor);
    const seasonLiters = s.isCurrent
      ? estimatedOilLiters
      : Math.round((seasonWeightKg / 100) * calculatedYield);

    const seasonComparedLiters = s.isCurrent
      ? comparedEstimatedOilLiters
      : Math.round((seasonWeightKg / 100) * calculatedComparedYield);

    return {
      season: s.season,
      shortYear: s.shortYear,
      isCurrent: s.isCurrent,
      cycle: s.cycle,
      cycleType: s.cycleType,
      rendementVariete: calculatedYield,
      rendementVarieteComparee: calculatedComparedYield,
      rendementWilaya: s.wilayaAvgYield,
      productionLitres: seasonLiters,
      productionLitresComparee: seasonComparedLiters,
      poidsOlivesKg: seasonWeightKg,
      climat: s.climateNote,
    };
  });

  // Calculate statistics across seasons
  const avgYieldAcrossSeasons = (
    multiSeasonChartData.reduce((acc, curr) => acc + curr.rendementVariete, 0) /
    multiSeasonChartData.length
  ).toFixed(1);

  const avgComparedYieldAcrossSeasons = (
    multiSeasonChartData.reduce((acc, curr) => acc + curr.rendementVarieteComparee, 0) /
    multiSeasonChartData.length
  ).toFixed(1);

  const avgLitersAcrossSeasons = Math.round(
    multiSeasonChartData.reduce((acc, curr) => acc + curr.productionLitres, 0) /
    multiSeasonChartData.length
  );

  const avgComparedLitersAcrossSeasons = Math.round(
    multiSeasonChartData.reduce((acc, curr) => acc + curr.productionLitresComparee, 0) /
    multiSeasonChartData.length
  );

  const highestYieldSeason = multiSeasonChartData.reduce((prev, curr) =>
    curr.rendementVariete > prev.rendementVariete ? curr : prev
  );

  const lowestYieldSeason = multiSeasonChartData.reduce((prev, curr) =>
    curr.rendementVariete < prev.rendementVariete ? curr : prev
  );

  const alternanceGapPercent = Math.round(
    ((highestYieldSeason.rendementVariete - lowestYieldSeason.rendementVariete) /
      parseFloat(avgYieldAcrossSeasons)) *
      100
  );

  // Environmental & Carbon metrics calculation
  const effectiveTrees = inputMode === 'trees' ? treeCount : Math.max(1, Math.round(totalWeight / 25));

  // Baseline tree carbon sequestration (permanent wood, roots, foliage & soil): ~18.5 kg CO2e / tree / year
  const baselineTreeSequestration = effectiveTrees * 18.5;

  // Agricultural practice emissions & carbon credits per tree / year (kg CO2e)
  const soilFactors = {
    enherbe: { emissions: 1.2, sequestrationBonus: 3.5, label: 'Enherbement spontané / Pâturage ovin (Puits de sol)' },
    raisonne: { emissions: 4.8, sequestrationBonus: 1.0, label: 'Travail superficiel raisonné du sol' },
    intensif: { emissions: 11.5, sequestrationBonus: 0, label: 'Labours profonds répétés au tracteur' },
  }[soilPractice];

  const fertFactors = {
    organique: { emissions: 1.0, sequestrationBonus: 2.8, label: 'Compost de grignons & fumier local ADOIO' },
    raisonnee: { emissions: 6.2, sequestrationBonus: 0.5, label: 'Fumure minérale raisonnée' },
    chimique: { emissions: 15.0, sequestrationBonus: 0, label: 'Engrais chimiques de synthèse (Azote minéral)' },
  }[fertPractice];

  const phytoFactors = {
    bio: { emissions: 0.6, label: 'Pièges à phéromones & argile kaolin (Éco-responsable)' },
    conventionnelle: { emissions: 4.2, label: 'Traitements insecticides chimiques conventionnels' },
  }[phytoPractice];

  const waterFactors = {
    pluvial: { emissions: 0, label: '100% Pluvial kabyle traditionnel (0 énergie fossile)' },
    solaire: { emissions: 1.2, label: 'Goutte-à-goutte avec pompage solaire' },
    diesel: { emissions: 8.5, label: 'Motopompe thermique au gasoil' },
  }[waterPractice];

  // Circular economy avoidance for mill byproducts (per tonne of olives)
  // Valorizing pomace avoids fossil heating/wood; composting wastewater (margines) avoids methane/pollution
  const byproductEmissionsAvoided = byproductPractice === 'circulaire'
    ? 160 * (totalWeight / 1000)
    : 0;

  const byproductEmissionsGross = byproductPractice === 'standard'
    ? 45 * (totalWeight / 1000)
    : 10 * (totalWeight / 1000);

  // Total gross emissions (kg CO2e)
  const totalEmissionsKg = Math.round(
    effectiveTrees * (soilFactors.emissions + fertFactors.emissions + phytoFactors.emissions + waterFactors.emissions) +
    byproductEmissionsGross
  );

  // Total gross sequestration (kg CO2e)
  const totalSequestrationKg = Math.round(
    baselineTreeSequestration +
    effectiveTrees * (soilFactors.sequestrationBonus + fertFactors.sequestrationBonus) +
    byproductEmissionsAvoided
  );

  // Net Carbon Balance: Sequestration - Emissions
  const netCarbonSavedKg = totalSequestrationKg - totalEmissionsKg;
  const isCarbonSink = netCarbonSavedKg > 0;

  // Carbon footprint per Liter of oil produced (kg CO2e / Liter)
  // Negative means it removed carbon from the atmosphere
  const carbonFootprintPerLiter = estimatedOilLiters > 0
    ? parseFloat(((totalEmissionsKg - totalSequestrationKg) / estimatedOilLiters).toFixed(2))
    : 0;

  // Real-world equivalencies
  const kmCarEquivalent = Math.abs(Math.round(netCarbonSavedKg / 0.12)); // 0.12 kg CO2e / km
  const roundtripsAlgerBejaia = Math.max(1, Math.round(kmCarEquivalent / 520)); // ~520 km A/R

  // Quick Converter calculations (15% to 25% configurable yield)
  const safeQuickWeightKg = Math.max(0, quickWeightKg || 0);
  const quickQuintals = safeQuickWeightKg / 100;
  // Volume in Liters according to standard Kabyle mill yield (L / 100 kg)
  const quickEstimatedLiters = Number((quickQuintals * quickYieldPercent).toFixed(1));
  const quickBidons5L = Number((quickEstimatedLiters / 5).toFixed(1));
  const quickBottles75cl = Math.floor(quickEstimatedLiters / 0.75);

  const handleQuickUnitChange = (newUnit: 'kg' | 'qx') => {
    setQuickUnit(newUnit);
  };

  const handleQuickInputValChange = (valStr: string) => {
    const parsed = parseFloat(valStr);
    if (isNaN(parsed) || parsed < 0) {
      setQuickWeightKg(0);
      return;
    }
    if (quickUnit === 'qx') {
      setQuickWeightKg(Math.round(parsed * 100));
    } else {
      setQuickWeightKg(Math.round(parsed));
    }
  };

  const applyQuickToDetailedSimulator = () => {
    setInputMode('weight');
    const clamped = Math.min(5000, Math.max(50, Math.round(safeQuickWeightKg / 50) * 50 || 50));
    setWeightKg(clamped);
    if (quickYieldPercent <= 17.5) {
      setHarvestPeriod('early');
    } else if (quickYieldPercent >= 22.5) {
      setHarvestPeriod('late');
    } else {
      setHarvestPeriod('mid');
    }
  };

  return (
    <section id="simulateur" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
            <Calculator className="w-4 h-4 text-[#E6AB3C]" />
            <span>Outil Décisionnel pour Oléiculteurs & Consommateurs</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
            Simulateur de Récolte & Rendement en Huile
          </h2>
          <p className="mt-3 text-base text-[#436229] leading-relaxed">
            Estimez le volume d'huile obtenu, le taux d'acidité prévisible et la valeur commerciale de vos olives de Kabylie selon la variété, la date de cueillette et le délai de trituration.
          </p>
          <div className="mt-4">
            <ArticleAudioReader
              sectionId="simulateur"
              title="Simulateur de Récolte et Rendement en Huile d'Olive"
              text={() =>
                `Simulateur décisionnel de récolte et rendement en huile d'olive de Kabylie. Pour un lot de ${totalWeight} kilogrammes d'olives (${totalQuintals.toFixed(1)} quintaux) de variété ${selectedVariety}, le rendement estimé est de ${finalYieldPerQuintal.toFixed(1)} litres par quintal, soit une production totale de ${estimatedOilLiters} litres d'huile d'olive. Taux d'acidité oléique estimé : ${estimatedAcidity} pour cent, correspondant à la catégorie officielle ${qualityGrade}. Règle agronomique essentielle : cueillir au stade de véraison tournante, transporter les olives dans des caisses plastiques ajourées et triturer en moins de 24 à 48 heures à une température inférieure à 27 degrés Celsius.`
              }
            />
          </div>
        </div>

        {/* Petit Calculateur Express : Poids des Olives -> Volume d'Huile (15% à 25%) */}
        <div className="mb-10 bg-white rounded-3xl border-2 border-[#D5C7A3] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#18230F] via-[#243516] to-[#31491E] px-5 py-3.5 sm:px-7 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E6AB3C]/20 border border-[#E6AB3C]/40 flex items-center justify-center text-[#E6AB3C]">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Convertisseur Express : Poids d'Olives → Volume d'Huile
                  </h3>
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#E6AB3C] text-[#18230F]">
                    Calcul Instantané
                  </span>
                </div>
                <p className="text-[11px] text-[#E8F4D9]/80">
                  Conversion rapide selon un rendement moyen configurable de 15% à 25% (15 à 25 L par quintal)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={applyQuickToDetailedSimulator}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Transférer ces valeurs vers le simulateur agronomique complet ci-dessous"
            >
              <span>Synchroniser avec le simulateur complet</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#E6AB3C]" />
            </button>
          </div>

          <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* 1. Poids des olives récoltées */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="quick-olive-weight" className="text-xs font-bold uppercase tracking-wider text-[#18230F]">
                  1. Poids d'olives récoltées
                </label>
                <div className="inline-flex rounded-lg bg-[#FAF7F2] p-0.5 border border-[#E6DEC9]">
                  <button
                    type="button"
                    onClick={() => handleQuickUnitChange('kg')}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      quickUnit === 'kg'
                        ? 'bg-[#31491E] text-white'
                        : 'text-[#436229] hover:text-[#18230F]'
                    }`}
                  >
                    Kilogrammes (kg)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickUnitChange('qx')}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      quickUnit === 'qx'
                        ? 'bg-[#31491E] text-white'
                        : 'text-[#436229] hover:text-[#18230F]'
                    }`}
                  >
                    Quintaux (qx)
                  </button>
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  id="quick-olive-weight"
                  type="number"
                  min="0"
                  max={quickUnit === 'qx' ? 1000 : 100000}
                  step={quickUnit === 'qx' ? '0.5' : '10'}
                  value={quickUnit === 'qx' ? Number((safeQuickWeightKg / 100).toFixed(2)) : safeQuickWeightKg}
                  onChange={(e) => handleQuickInputValChange(e.target.value)}
                  className="w-full px-4 py-2.5 pr-28 rounded-xl border border-[#D5C7A3] bg-[#FAF7F2] text-[#18230F] font-mono text-lg font-extrabold focus:outline-none focus:border-[#31491E]"
                />
                <span className="absolute right-3 text-xs font-bold text-[#567B34] bg-[#E8F4D9] px-2.5 py-1 rounded-lg border border-[#C5DFB0]">
                  {quickUnit === 'kg'
                    ? `${quickQuintals.toFixed(1)} qx`
                    : `${safeQuickWeightKg.toLocaleString('fr-FR')} kg`}
                </span>
              </div>

              {/* Quick weight presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-[#567B34] mr-1">Lots fréquents :</span>
                {[
                  { label: '100 kg (1 qx)', kg: 100 },
                  { label: '300 kg (3 qx)', kg: 300 },
                  { label: '500 kg (5 qx)', kg: 500 },
                  { label: '1 000 kg (10 qx)', kg: 1000 },
                  { label: '2 500 kg (25 qx)', kg: 2500 },
                ].map((preset) => (
                  <button
                    key={preset.kg}
                    type="button"
                    onClick={() => setQuickWeightKg(preset.kg)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      safeQuickWeightKg === preset.kg
                        ? 'bg-[#31491E] text-white border-[#31491E]'
                        : 'bg-[#FAF7F2] text-[#31491E] border-[#E6DEC9] hover:border-[#31491E]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Rendement moyen configurable (15% à 25%) */}
            <div className="lg:col-span-4 space-y-3 lg:border-x lg:border-[#E6DEC9] lg:px-6">
              <div className="flex items-center justify-between">
                <label htmlFor="quick-yield-slider" className="text-xs font-bold uppercase tracking-wider text-[#18230F]">
                  2. Rendement moyen (15% – 25%)
                </label>
                <span className="font-mono text-base font-extrabold text-[#18230F] bg-[#FEF5DB] border border-[#E6AB3C] px-2.5 py-0.5 rounded-lg">
                  {quickYieldPercent.toFixed(1)}% ({quickYieldPercent.toFixed(1)} L/qx)
                </span>
              </div>

              <input
                id="quick-yield-slider"
                type="range"
                min="15"
                max="25"
                step="0.5"
                value={quickYieldPercent}
                onChange={(e) => setQuickYieldPercent(parseFloat(e.target.value))}
                className="w-full accent-[#31491E] cursor-pointer"
              />

              <div className="flex justify-between text-[10px] font-semibold text-[#567B34]">
                <span>15% (Récolte précoce)</span>
                <span>20% (Moyenne Kabylie)</span>
                <span>25% (Maturité haute)</span>
              </div>

              {/* Quick yield presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {[
                  { pct: 15, label: '15% Vert' },
                  { pct: 18, label: '18% Chemlal' },
                  { pct: 20, label: '20% Standard' },
                  { pct: 22.5, label: '22.5% Bouchouk' },
                  { pct: 25, label: '25% Tardif' },
                ].map((item) => (
                  <button
                    key={item.pct}
                    type="button"
                    onClick={() => setQuickYieldPercent(item.pct)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                      quickYieldPercent === item.pct
                        ? 'bg-[#E6AB3C] text-[#18230F] border-[#D49524] font-bold'
                        : 'bg-[#FAF7F2] text-[#436229] border-[#E6DEC9] hover:border-[#E6AB3C]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Résultat instantané en volume d'huile */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#F4F9EC] to-[#E8F4D9] p-4 sm:p-5 rounded-2xl border border-[#C5DFB0] flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#31491E] block">
                    Volume d'Huile Estimé
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-3xl sm:text-4xl font-extrabold text-[#18230F]">
                      {quickEstimatedLiters.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-base font-bold text-[#31491E]">Litres</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-[#31491E] text-[#E6AB3C] flex items-center justify-center shrink-0 shadow-xs">
                  <Droplet className="w-5 h-5 fill-current" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#C5DFB0]/80 text-center">
                <div className="bg-white/80 rounded-xl p-2 border border-[#C5DFB0]/60">
                  <span className="text-[10px] font-semibold text-[#567B34] block">Bidons de 5L</span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-[#18230F]">
                    {quickBidons5L} bidons
                  </span>
                </div>
                <div className="bg-white/80 rounded-xl p-2 border border-[#C5DFB0]/60">
                  <span className="text-[10px] font-semibold text-[#567B34] block">Bouteilles 75cl</span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-[#18230F]">
                    {quickBottles75cl} bout.
                  </span>
                </div>
                <div className="bg-white/80 rounded-xl p-2 border border-[#C5DFB0]/60">
                  <span className="text-[10px] font-semibold text-[#567B34] block">Poids net huile</span>
                  <span className="font-mono text-xs sm:text-sm font-extrabold text-[#18230F]">
                    ~{(quickEstimatedLiters * 0.916).toFixed(1)} kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Panel (Left) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC9] shadow-xs space-y-6">
            {/* Mode selection tabs */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#18230F] block mb-2">
                Mode de calcul de la récolte :
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#FAF7F2] p-1 rounded-xl border border-[#E6DEC9]">
                <button
                  type="button"
                  onClick={() => setInputMode('weight')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    inputMode === 'weight'
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'text-[#31491E] hover:text-[#18230F]'
                  }`}
                >
                  Par Poids d'Olives (kg / quintaux)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('trees')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    inputMode === 'trees'
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'text-[#31491E] hover:text-[#18230F]'
                  }`}
                >
                  Par Nombre d'Oliviers
                </button>
              </div>
            </div>

            {/* Weight or Trees sliders */}
            {inputMode === 'weight' ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#18230F]">Quantité d'olives récoltées :</span>
                  <span className="font-mono text-sm font-extrabold text-[#31491E]">
                    {weightKg} kg ({(weightKg / 100).toFixed(1)} quintaux)
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-[#31491E] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-[#6F9D44]">
                  <span>50 kg (petit verger)</span>
                  <span>1 000 kg (10 qx)</span>
                  <span>5 000 kg (50 qx)</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#18230F]">Nombre d'oliviers :</span>
                    <span className="font-mono font-bold text-[#31491E]">{treeCount} arbres</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={treeCount}
                    onChange={(e) => setTreeCount(Number(e.target.value))}
                    className="w-full accent-[#31491E] cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#18230F]">Rendement moyen/arbre :</span>
                    <span className="font-mono font-bold text-[#31491E]">{kgPerTree} kg/arbre</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={kgPerTree}
                    onChange={(e) => setKgPerTree(Number(e.target.value))}
                    className="w-full accent-[#31491E] cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Variety Selector & Side-by-Side Comparison Controls */}
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#18230F] flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-[#31491E]" />
                  <span>Sélection & Comparaison Variétale :</span>
                </label>

                <div className="flex items-center gap-2">
                  {isComparingVarieties && (
                    <button
                      type="button"
                      onClick={() => {
                        const temp = selectedVariety;
                        setSelectedVariety(comparedVariety);
                        setComparedVariety(temp);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white hover:bg-[#E8F4D9] text-[#31491E] border border-[#D5C7A3] transition-all flex items-center gap-1 cursor-pointer"
                      title="Inverser la Variété A et la Variété B"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Inverser A ⇄ B</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsComparingVarieties(!isComparingVarieties)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      isComparingVarieties
                        ? 'bg-[#31491E] text-white border-[#31491E]'
                        : 'bg-white text-[#436229] border-[#D5C7A3] hover:border-[#31491E]'
                    }`}
                  >
                    {isComparingVarieties ? '✓ Mode Comparaison Côte à Côte' : '+ Comparer 2 Variétés'}
                  </button>
                </div>
              </div>

              <div className={`grid grid-cols-1 ${isComparingVarieties ? 'sm:grid-cols-2' : ''} gap-3`}>
                {/* Variété A */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#31491E] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#31491E]" />
                      {isComparingVarieties ? 'Variété A (Référence)' : 'Variété principale'}
                    </span>
                    <span className="font-mono font-bold text-[#18230F]">
                      Base : {varietyBaseYields[selectedVariety]} L/qx
                    </span>
                  </div>
                  <select
                    value={selectedVariety}
                    onChange={(e) => setSelectedVariety(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5C7A3] focus:outline-none focus:border-[#31491E] bg-white font-bold text-[#18230F]"
                  >
                    <option value="chemlal">Chemlal de Kabylie (Rendement 16–20%)</option>
                    <option value="bouchouk">Bouchouk (Fruité fin 20–25%)</option>
                    <option value="aberkane">Aberkane Noire (Rond & Velouté 19–23%)</option>
                    <option value="limli">Limli de Sidi-Aïch (Fruité vert 20–24%)</option>
                    <option value="azeradj">Azeradj / Adjeraz Haute-Soummam (20–25%)</option>
                    <option value="autres">Autres / Exotique (18–22%)</option>
                    <option value="assemblage">Assemblage Traditionnel Kabyle (Moy. 20%)</option>
                  </select>
                </div>

                {/* Variété B (si mode comparaison actif) */}
                {isComparingVarieties && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#B47A16] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#E6AB3C]" />
                        Variété B (Comparée)
                      </span>
                      <span className="font-mono font-bold text-[#B47A16]">
                        Base : {varietyBaseYields[comparedVariety]} L/qx
                      </span>
                    </div>
                    <select
                      value={comparedVariety}
                      onChange={(e) => setComparedVariety(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6AB3C] focus:outline-none focus:border-[#B47A16] bg-[#FEF5DB]/50 font-bold text-[#18230F]"
                    >
                      <option value="chemlal">Chemlal de Kabylie (Rendement 16–20%)</option>
                      <option value="bouchouk">Bouchouk (Fruité fin 20–25%)</option>
                      <option value="aberkane">Aberkane Noire (Rond & Velouté 19–23%)</option>
                      <option value="limli">Limli de Sidi-Aïch (Fruité vert 20–24%)</option>
                      <option value="azeradj">Azeradj / Adjeraz Haute-Soummam (20–25%)</option>
                      <option value="autres">Autres / Exotique (18–22%)</option>
                      <option value="assemblage">Assemblage Traditionnel Kabyle (Moy. 20%)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Presets de duels variétaux fréquents en Kabylie */}
              {isComparingVarieties && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#E6DEC9]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] mr-1">
                    Duels types :
                  </span>
                  {[
                    { a: 'chemlal', b: 'bouchouk', label: 'Chemlal vs Bouchouk' },
                    { a: 'chemlal', b: 'limli', label: 'Chemlal vs Limli' },
                    { a: 'aberkane', b: 'azeradj', label: 'Aberkane vs Azeradj' },
                    { a: 'chemlal', b: 'assemblage', label: 'Chemlal vs Assemblage' },
                  ].map((pair) => {
                    const isCurrentPair = selectedVariety === pair.a && comparedVariety === pair.b;
                    return (
                      <button
                        key={pair.label}
                        type="button"
                        onClick={() => {
                          setSelectedVariety(pair.a);
                          setComparedVariety(pair.b);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                          isCurrentPair
                            ? 'bg-[#18230F] text-[#E6AB3C] border-[#18230F]'
                            : 'bg-white text-[#436229] border-[#E6DEC9] hover:border-[#31491E]'
                        }`}
                      >
                        {pair.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Harvest Period */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#18230F] block">
                Période de récolte & Véraison :
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setHarvestPeriod('early')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    harvestPeriod === 'early'
                      ? 'border-[#31491E] bg-[#E8F4D9] text-[#18230F]'
                      : 'border-[#E6DEC9] bg-[#FAF7F2] text-[#436229]'
                  }`}
                >
                  <span className="font-bold text-xs block">Novembre (Primeur)</span>
                  <span className="text-[10px] block opacity-80 mt-1">Fruité vert intense, acidité minime, rendement 16-18L</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHarvestPeriod('mid')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    harvestPeriod === 'mid'
                      ? 'border-[#31491E] bg-[#E8F4D9] text-[#18230F]'
                      : 'border-[#E6DEC9] bg-[#FAF7F2] text-[#436229]'
                  }`}
                >
                  <span className="font-bold text-xs block">Décembre (Optimal)</span>
                  <span className="text-[10px] block opacity-80 mt-1">Équilibre idéal arômes & rendement 19-22L</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHarvestPeriod('late')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    harvestPeriod === 'late'
                      ? 'border-[#31491E] bg-[#E8F4D9] text-[#18230F]'
                      : 'border-[#E6DEC9] bg-[#FAF7F2] text-[#436229]'
                  }`}
                >
                  <span className="font-bold text-xs block">Janvier (Tardive)</span>
                  <span className="text-[10px] block opacity-80 mt-1">Fruité mûr, max de litres (22-25L), acidité plus sensible</span>
                </button>
              </div>
            </div>

            {/* Delay & Extraction Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18230F] block">
                  Délai avant trituration au moulin :
                </label>
                <select
                  value={delayHours}
                  onChange={(e) => setDelayHours(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-medium"
                >
                  <option value="fast">&lt; 24h en caisses ajourées (Recommandé ADOIO)</option>
                  <option value="medium">24 à 48 heures</option>
                  <option value="slow">&gt; 4 jours (Sacs plastiques / fermentation)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#18230F] block">
                  Technologie de trituration :
                </label>
                <select
                  value={extractionType}
                  onChange={(e) => setExtractionType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-medium"
                >
                  <option value="modern">Système Continu Moderne 2/3 Phases (Inox)</option>
                  <option value="traditional">Presse Traditionnelle à Meules & Scourtins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary (Right) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#233416] to-[#18230F] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#8CBE5D]/30 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#FAF7F2]/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E6AB3C]" />
                <h3 className="font-serif text-xl font-bold">
                  {isComparingVarieties ? 'Résultats Côte à Côte (A vs B)' : 'Résultats Prévisionnels'}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#B0D984]">
                {totalWeight} kg d'olives ({totalQuintals.toFixed(1)} qx)
              </span>
            </div>

            {/* Liters produced (Single or Side-by-Side) */}
            {!isComparingVarieties ? (
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#B0D984] font-medium block">
                  Production d'Huile Estimée ({varietyNames[selectedVariety]})
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#E6AB3C]">
                    {estimatedOilLiters}
                  </span>
                  <span className="text-lg font-sans font-bold text-[#FAF7F2]">Litres</span>
                </div>
                <p className="text-xs text-[#E8F4D9]/80">
                  Rendement moyen calculé : <strong>{finalYieldPerQuintal.toFixed(1)} L / quintal</strong>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Card Variété A */}
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-[#8CBE5D]/40 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B0D984] block truncate">
                      A • {varietyNames[selectedVariety]}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-3xl font-extrabold text-white">
                        {estimatedOilLiters}
                      </span>
                      <span className="text-xs font-bold text-[#B0D984]">Litres</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#E8F4D9]/90 block">
                      {finalYieldPerQuintal.toFixed(1)} L / qx
                    </span>
                  </div>

                  {/* Card Variété B */}
                  <div className="p-3.5 rounded-2xl bg-[#E6AB3C]/15 border border-[#E6AB3C]/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E6AB3C] block truncate">
                      B • {varietyNames[comparedVariety]}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-3xl font-extrabold text-[#E6AB3C]">
                        {comparedEstimatedOilLiters}
                      </span>
                      <span className="text-xs font-bold text-[#FAF7F2]">Litres</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#E6AB3C] block">
                      {comparedYieldPerQuintal.toFixed(1)} L / qx
                    </span>
                  </div>
                </div>

                {/* Écart net (Delta B vs A) */}
                <div className="px-3.5 py-2.5 rounded-xl bg-black/25 border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#E8F4D9]/90 font-medium">Impact sur le rendement final :</span>
                  <span
                    className={`font-mono font-extrabold ${
                      litersDiff > 0
                        ? 'text-[#8CBE5D]'
                        : litersDiff < 0
                        ? 'text-[#FFB4A2]'
                        : 'text-[#E6AB3C]'
                    }`}
                  >
                    {litersDiff > 0 ? `+${litersDiff}` : litersDiff} L ({yieldDiffPercent > 0 ? `+${yieldDiffPercent}%` : `${yieldDiffPercent}%`})
                  </span>
                </div>
              </div>
            )}

            {/* Quality Grade and Acidity */}
            <div className="bg-[#FAF7F2]/10 backdrop-blur-md p-4 rounded-2xl border border-[#FAF7F2]/15 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#E8F4D9]">Acidité oléique prévue :</span>
                <span className="font-mono text-base font-bold text-[#E6AB3C]">
                  ~{estimatedAcidity}%
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#B0D984] block mb-1">Classification officielle :</span>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-block ${gradeColor}`}>
                  {qualityGrade}
                </div>
              </div>

              {estimatedAcidity <= 0.8 ? (
                <p className="text-[11px] text-[#E8F4D9] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8CBE5D] shrink-0" />
                  Conforme au standard d'excellence Vierge Extra ADOIO.
                </p>
              ) : (
                <p className="text-[11px] text-[#FFB4A2] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#FFB4A2] shrink-0" />
                  Attention : le délai de stockage dégrade l'acidité au-dessus du seuil Extra Vierge (0.8%).
                </p>
              )}
            </div>

            {/* Economic value */}
            <div className="pt-2 border-t border-[#FAF7F2]/15">
              <div className="flex justify-between items-center text-xs text-[#B0D984]">
                <span>Valorisation marchande estimée :</span>
                <span>~{pricePerLiter} DZD / L</span>
              </div>
              {!isComparingVarieties ? (
                <div className="font-serif text-2xl font-bold text-[#FAF7F2] mt-1">
                  {estimatedValueDZD.toLocaleString('fr-FR')}{' '}
                  <span className="text-sm font-sans font-medium text-[#E6AB3C]">DZD</span>
                </div>
              ) : (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-[#B0D984] block">
                      {varietyProfiles[selectedVariety]?.shortName}
                    </span>
                    <span className="font-serif text-base font-bold text-white">
                      {estimatedValueDZD.toLocaleString('fr-FR')} DZD
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#E6AB3C]/10 border border-[#E6AB3C]/30">
                    <span className="text-[10px] text-[#E6AB3C] block">
                      {varietyProfiles[comparedVariety]?.shortName} (
                      {valueDiffDZD >= 0
                        ? `+${valueDiffDZD.toLocaleString('fr-FR')}`
                        : valueDiffDZD.toLocaleString('fr-FR')}{' '}
                      DA)
                    </span>
                    <span className="font-serif text-base font-bold text-[#E6AB3C]">
                      {comparedEstimatedValueDZD.toLocaleString('fr-FR')} DZD
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Recommandation ADOIO */}
            <div className="p-3.5 bg-[#FAF7F2]/10 rounded-xl text-xs text-[#E8F4D9] space-y-1">
              <strong className="text-[#E6AB3C] block font-semibold">Conseil de l'expert ADOIO :</strong>
              <p className="text-[11px] leading-relaxed opacity-90">
                {delayHours === 'fast'
                  ? "Excellente pratique ! Le transport immédiat en caisses garantit une huile sans chômé, riche en antioxydants et d'une conservation supérieure à 18 mois."
                  : "Pour accéder à la plus-value Vierge Extra (gain de +300 DZD par litre), apportez vos olives au pressoir dans les 24h suivant le détachement de l'arbre."}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* PANNEAU DE COMPARAISON CÔTE À CÔTE DE DEUX VARIÉTÉS D'OLIVES */}
        {/* ===================================================================== */}
        {isComparingVarieties && (
          <div className="mt-10 bg-white rounded-3xl border-2 border-[#D5C7A3] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E6DEC9]">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#31491E] mb-1">
                  <Layers className="w-4 h-4 text-[#E6AB3C]" />
                  <span>Comparateur Variétal Côte à Côte — Impact sur le Rendement Final</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18230F]">
                  {varietyNames[selectedVariety]} <span className="text-[#E6AB3C] font-sans text-lg mx-1">vs</span>{' '}
                  {varietyNames[comparedVariety]}
                </h3>
                <p className="text-xs sm:text-sm text-[#436229] mt-1">
                  Analyse comparative à conditions identiques ({totalWeight.toLocaleString('fr-FR')} kg d’olives, récolte en{' '}
                  {harvestPeriod === 'early' ? 'Novembre' : harvestPeriod === 'mid' ? 'Décembre' : 'Janvier'}, trituration{' '}
                  {extractionType === 'modern' ? 'continue moderne' : 'traditionnelle par pression'}).
                </p>
              </div>

              {/* Synthèse du différentiel */}
              <div className="px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-[#D5C7A3] flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-[#31491E] text-[#E6AB3C] flex items-center justify-center font-bold shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="text-[#567B34] font-semibold block">Différentiel de rendement final :</span>
                  {litersDiff === 0 ? (
                    <span className="font-bold text-[#18230F]">
                      Rendement identique ({finalYieldPerQuintal.toFixed(1)} L/qx, soit {estimatedOilLiters} L)
                    </span>
                  ) : (
                    <span className="font-bold text-[#18230F]">
                      <strong>
                        {litersDiff > 0 ? varietyNames[comparedVariety] : varietyNames[selectedVariety]}
                      </strong>{' '}
                      produit{' '}
                      <span className="text-[#31491E] font-extrabold">
                        +{Math.abs(litersDiff)} Litres ({Math.abs(yieldDiffPercent)}%)
                      </span>{' '}
                      de plus (+{Math.abs(valueDiffDZD).toLocaleString('fr-FR')} DZD)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cartes Côte à Côte A vs B + Jauges visuelles */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Colonne Variété A */}
              <div className="lg:col-span-5 rounded-2xl bg-[#F4F9EC] border border-[#C5DFB0] p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#31491E] text-white text-[10px] font-bold uppercase tracking-wider">
                      Variété A • Référence
                    </span>
                    <span className="text-xs font-mono font-bold text-[#31491E]">
                      Plage : {varietyProfiles[selectedVariety]?.yieldRange}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#18230F]">
                    {varietyNames[selectedVariety]}
                  </h4>
                  <p className="text-xs text-[#436229] mt-1">
                    {varietyProfiles[selectedVariety]?.sensory}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-[#C5DFB0]">
                    <span className="text-[10px] font-bold uppercase text-[#567B34] block">Rendement Final</span>
                    <span className="font-serif text-2xl font-extrabold text-[#18230F]">
                      {finalYieldPerQuintal.toFixed(1)} <span className="text-xs font-sans">L/qx</span>
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#C5DFB0]">
                    <span className="text-[10px] font-bold uppercase text-[#567B34] block">Volume Total</span>
                    <span className="font-serif text-2xl font-extrabold text-[#31491E]">
                      {estimatedOilLiters.toLocaleString('fr-FR')} <span className="text-xs font-sans">L</span>
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#C5DFB0]">
                    <span className="text-[10px] font-bold uppercase text-[#567B34] block">Conditionnement</span>
                    <span className="font-mono text-xs font-bold text-[#18230F] block mt-0.5">
                      {(estimatedOilLiters / 5).toFixed(1)} bidons (5L)
                    </span>
                    <span className="text-[10px] text-[#567B34]">
                      ou {Math.floor(estimatedOilLiters / 0.75)} bout. 75cl
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#C5DFB0]">
                    <span className="text-[10px] font-bold uppercase text-[#567B34] block">Valeur Marchande</span>
                    <span className="font-mono text-xs font-extrabold text-[#18230F] block mt-0.5">
                      {estimatedValueDZD.toLocaleString('fr-FR')} DZD
                    </span>
                    <span className="text-[10px] text-[#567B34]">Moy. 6 ans : {avgYieldAcrossSeasons} L/qx</span>
                  </div>
                </div>
              </div>

              {/* Colonne Centrale : Écart & Jauges Comparatives */}
              <div className="lg:col-span-2 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC9] p-4 flex flex-col justify-center items-center text-center space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34]">
                  Écart (B vs A)
                </span>
                <div className="space-y-1">
                  <span className="text-[11px] text-[#436229] block">Rendement / qx</span>
                  <span
                    className={`font-mono text-base font-extrabold px-2.5 py-0.5 rounded-lg inline-block ${
                      yieldDiffPerQuintal > 0
                        ? 'bg-[#E8F4D9] text-[#31491E]'
                        : yieldDiffPerQuintal < 0
                        ? 'bg-red-100 text-[#AF4D24]'
                        : 'bg-gray-100 text-[#18230F]'
                    }`}
                  >
                    {yieldDiffPerQuintal > 0 ? `+${yieldDiffPerQuintal}` : yieldDiffPerQuintal} L/qx
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-[#436229] block">Volume Huile</span>
                  <span
                    className={`font-mono text-base font-extrabold px-2.5 py-0.5 rounded-lg inline-block ${
                      litersDiff > 0
                        ? 'bg-[#E8F4D9] text-[#31491E]'
                        : litersDiff < 0
                        ? 'bg-red-100 text-[#AF4D24]'
                        : 'bg-gray-100 text-[#18230F]'
                    }`}
                  >
                    {litersDiff > 0 ? `+${litersDiff}` : litersDiff} L
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-[#436229] block">Bidons de 5L</span>
                  <span className="font-mono text-xs font-bold text-[#18230F]">
                    {litersDiff > 0 ? `+${(litersDiff / 5).toFixed(1)}` : (litersDiff / 5).toFixed(1)} bidons
                  </span>
                </div>
              </div>

              {/* Colonne Variété B */}
              <div className="lg:col-span-5 rounded-2xl bg-[#FEF5DB]/70 border border-[#E6AB3C] p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#E6AB3C] text-[#18230F] text-[10px] font-bold uppercase tracking-wider">
                      Variété B • Comparée
                    </span>
                    <span className="text-xs font-mono font-bold text-[#8C5E0A]">
                      Plage : {varietyProfiles[comparedVariety]?.yieldRange}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#18230F]">
                    {varietyNames[comparedVariety]}
                  </h4>
                  <p className="text-xs text-[#436229] mt-1">
                    {varietyProfiles[comparedVariety]?.sensory}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white p-3 rounded-xl border border-[#E6AB3C]/60">
                    <span className="text-[10px] font-bold uppercase text-[#8C5E0A] block">Rendement Final</span>
                    <span className="font-serif text-2xl font-extrabold text-[#18230F]">
                      {comparedYieldPerQuintal.toFixed(1)} <span className="text-xs font-sans">L/qx</span>
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#E6AB3C]/60">
                    <span className="text-[10px] font-bold uppercase text-[#8C5E0A] block">Volume Total</span>
                    <span className="font-serif text-2xl font-extrabold text-[#B47A16]">
                      {comparedEstimatedOilLiters.toLocaleString('fr-FR')} <span className="text-xs font-sans">L</span>
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#E6AB3C]/60">
                    <span className="text-[10px] font-bold uppercase text-[#8C5E0A] block">Conditionnement</span>
                    <span className="font-mono text-xs font-bold text-[#18230F] block mt-0.5">
                      {(comparedEstimatedOilLiters / 5).toFixed(1)} bidons (5L)
                    </span>
                    <span className="text-[10px] text-[#567B34]">
                      ou {Math.floor(comparedEstimatedOilLiters / 0.75)} bout. 75cl
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[#E6AB3C]/60">
                    <span className="text-[10px] font-bold uppercase text-[#8C5E0A] block">Valeur Marchande</span>
                    <span className="font-mono text-xs font-extrabold text-[#18230F] block mt-0.5">
                      {comparedEstimatedValueDZD.toLocaleString('fr-FR')} DZD
                    </span>
                    <span className="text-[10px] text-[#567B34]">
                      Moy. 6 ans : {avgComparedYieldAcrossSeasons} L/qx
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau comparatif agronomique et qualitatif des deux variétés */}
            <div className="overflow-x-auto rounded-2xl border border-[#E6DEC9]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#18230F] text-white">
                    <th className="py-3 px-4 font-bold">Critère Agronomique & Organoleptique</th>
                    <th className="py-3 px-4 font-bold text-[#B0D984]">
                      Variété A : {varietyNames[selectedVariety]}
                    </th>
                    <th className="py-3 px-4 font-bold text-[#E6AB3C]">
                      Variété B : {varietyNames[comparedVariety]}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DEC9]">
                  <tr className="bg-[#FAF7F2]">
                    <td className="py-2.5 px-4 font-bold text-[#18230F]">Terroir de prédilection (Béjaïa)</td>
                    <td className="py-2.5 px-4 text-[#31491E]">{varietyProfiles[selectedVariety]?.terroir}</td>
                    <td className="py-2.5 px-4 text-[#8C5E0A]">{varietyProfiles[comparedVariety]?.terroir}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-2.5 px-4 font-bold text-[#18230F]">Teneur en polyphénols (antioxydants)</td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-[#18230F]">
                      {varietyProfiles[selectedVariety]?.polyphenols}
                    </td>
                    <td className="py-2.5 px-4 font-mono font-semibold text-[#18230F]">
                      {varietyProfiles[comparedVariety]?.polyphenols}
                    </td>
                  </tr>
                  <tr className="bg-[#FAF7F2]">
                    <td className="py-2.5 px-4 font-bold text-[#18230F]">Stabilité & durée de conservation</td>
                    <td className="py-2.5 px-4 text-[#436229]">{varietyProfiles[selectedVariety]?.stability}</td>
                    <td className="py-2.5 px-4 text-[#436229]">{varietyProfiles[comparedVariety]?.stability}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-2.5 px-4 font-bold text-[#18230F]">Calibre moyen du fruit (drupe)</td>
                    <td className="py-2.5 px-4 text-[#436229]">{varietyProfiles[selectedVariety]?.caliber}</td>
                    <td className="py-2.5 px-4 text-[#436229]">{varietyProfiles[comparedVariety]?.caliber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Maturity Index & Oil Content Threshold Alert Manager (localStorage) */}
        <HarvestAlertManager
          selectedVariety={selectedVariety}
          currentHarvestPeriod={harvestPeriod}
          currentYieldPerQuintal={finalYieldPerQuintal}
          onSelectVariety={setSelectedVariety}
        />

        {/* Personalized Harvest Optimal Window Alerts System (PWA Service Worker) */}
        <OptimalHarvestAlertSystem 
          selectedVariety={selectedVariety} 
          onSelectVariety={setSelectedVariety} 
        />

        {/* Multi-Season Recharts Section */}
        <div className="mt-12 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-xs space-y-8">
          {/* Section Sub-Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC9]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1.5">
                <BarChart3 className="w-4 h-4 text-[#E6AB3C]" />
                <span>Analyse Historique & Projection Multi-Campagnes</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18230F]">
                Comparaison des Rendements Annuels & Évolution Multi-Saisons (2020 – 2026)
              </h3>
              <p className="text-xs sm:text-sm text-[#436229] mt-1 max-w-2xl leading-relaxed">
                Visualisez l'évolution du rendement en huile et du volume récolté de votre verger à travers les cycles d’alternance biennale et les conditions climatiques de la vallée de la Soummam.
              </p>
            </div>

            {/* View Mode Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#FAF7F2] p-1 rounded-xl border border-[#E6DEC9] flex items-center gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setChartMetric('yield')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    chartMetric === 'yield'
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'text-[#436229] hover:text-[#18230F]'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5" />
                  <span>Rendement (L / qx)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('volume')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    chartMetric === 'volume'
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'text-[#436229] hover:text-[#18230F]'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Volume (Litres)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('combined')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    chartMetric === 'combined'
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'text-[#436229] hover:text-[#18230F]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Vue Combinée</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowWilayaBenchmark(!showWilayaBenchmark)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  showWilayaBenchmark
                    ? 'bg-[#FEF5DB] border-[#E6AB3C] text-[#B47A16]'
                    : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#6F9D44] hover:text-[#18230F]'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${showWilayaBenchmark ? 'text-[#B47A16]' : 'text-gray-400'}`} />
                <span>Réf. Wilaya (19.4 L/qx)</span>
              </button>
            </div>
          </div>

          {/* Key Multi-Season Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#6F9D44] tracking-wider">
                  Rendement Moyen (6 ans)
                </span>
                <Droplet className="w-4 h-4 text-[#567B34]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#18230F]">
                  {avgYieldAcrossSeasons}
                </span>
                {isComparingVarieties && (
                  <span className="text-xs font-mono font-bold text-[#B47A16]">
                    vs {avgComparedYieldAcrossSeasons}
                  </span>
                )}
                <span className="text-xs text-[#567B34] font-semibold">L / qx</span>
              </div>
              <p className="text-[11px] text-[#567B34] mt-1">
                {isComparingVarieties
                  ? `${varietyProfiles[selectedVariety]?.shortName} vs ${varietyProfiles[comparedVariety]?.shortName}`
                  : `Variété : ${varietyNames[selectedVariety]}`}
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#6F9D44] tracking-wider">
                  Simulation Actuelle
                </span>
                <Sparkles className="w-4 h-4 text-[#E6AB3C]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#E6AB3C]">
                  {finalYieldPerQuintal.toFixed(1)}
                </span>
                {isComparingVarieties && (
                  <span className="text-xs font-mono font-bold text-[#31491E]">
                    vs {comparedYieldPerQuintal.toFixed(1)}
                  </span>
                )}
                <span className="text-xs text-[#18230F] font-semibold">L / qx</span>
              </div>
              <p className="text-[11px] text-[#567B34] mt-1">
                {isComparingVarieties
                  ? `${estimatedOilLiters.toLocaleString('fr-FR')} L vs ${comparedEstimatedOilLiters.toLocaleString('fr-FR')} L`
                  : `Soit ${estimatedOilLiters.toLocaleString('fr-FR')} L pour ${totalWeight} kg`}
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#6F9D44] tracking-wider">
                  Amplitude d'Alternance
                </span>
                <TrendingUp className="w-4 h-4 text-[#AF4D24]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#AF4D24]">
                  ±{alternanceGapPercent}%
                </span>
                <span className="text-xs text-[#AF4D24] font-semibold">écart max</span>
              </div>
              <p className="text-[11px] text-[#567B34] mt-1">
                Min {lowestYieldSeason.rendementVariete} · Max {highestYieldSeason.rendementVariete} L/qx
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#6F9D44] tracking-wider">
                  Volume Moyen Annuel
                </span>
                <Calendar className="w-4 h-4 text-[#31491E]" />
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#31491E]">
                  {avgLitersAcrossSeasons.toLocaleString('fr-FR')}
                </span>
                {isComparingVarieties && (
                  <span className="text-xs font-mono font-bold text-[#B47A16]">
                    vs {avgComparedLitersAcrossSeasons.toLocaleString('fr-FR')}
                  </span>
                )}
                <span className="text-xs text-[#31491E] font-semibold">L</span>
              </div>
              <p className="text-[11px] text-[#567B34] mt-1">
                Lissé sur le cycle biennal
              </p>
            </div>
          </div>

          {/* Recharts Chart Container */}
          <div className="bg-[#FAF7F2]/80 p-4 sm:p-6 rounded-2xl border border-[#E6DEC9]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#18230F] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#31491E]"></span>
                {chartMetric === 'yield'
                  ? isComparingVarieties
                    ? `Rendement en huile par quintal (${varietyNames[selectedVariety]} vs ${varietyNames[comparedVariety]})`
                    : `Rendement en huile par quintal (${varietyNames[selectedVariety]} vs Wilaya)`
                  : chartMetric === 'volume'
                  ? `Volume annuel total estimé en Litres (Impact variétal & alternance biennale)`
                  : `Vue combinée : Production en Litres (barres) & Rendement en L/quintal (courbes)`}
              </span>
              <span className="text-[11px] text-[#6F9D44] font-medium hidden sm:inline-block">
                Survolez les colonnes pour inspecter le détail climatique
              </span>
            </div>

            <div className="h-80 sm:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={multiSeasonChartData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DEC9" vertical={false} />
                  <XAxis 
                    dataKey="shortYear" 
                    stroke="#567B34" 
                    tick={{ fill: '#31491E', fontSize: 12, fontWeight: 700 }}
                    tickLine={{ stroke: '#E6DEC9' }}
                  />

                  {chartMetric === 'yield' && (
                    <YAxis
                      domain={[12, 28]}
                      stroke="#567B34"
                      tick={{ fill: '#31491E', fontSize: 11 }}
                      unit=" L/qx"
                    />
                  )}

                  {chartMetric === 'volume' && (
                    <YAxis
                      stroke="#567B34"
                      tick={{ fill: '#31491E', fontSize: 11 }}
                      unit=" L"
                    />
                  )}

                  {chartMetric === 'combined' && (
                    <>
                      <YAxis
                        yAxisId="left"
                        stroke="#31491E"
                        tick={{ fill: '#31491E', fontSize: 11 }}
                        unit=" L"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[12, 28]}
                        stroke="#E6AB3C"
                        tick={{ fill: '#B47A16', fontSize: 11 }}
                        unit=" L/qx"
                      />
                    </>
                  )}

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#18230F] text-[#FAF7F2] p-4 rounded-2xl shadow-2xl border border-[#8CBE5D]/40 text-xs space-y-2.5 max-w-xs backdrop-blur-md">
                            <div className="flex items-center justify-between gap-3 border-b border-[#FAF7F2]/15 pb-2">
                              <span className="font-serif font-bold text-sm text-[#E6AB3C]">
                                Campagne {data.season}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  data.isCurrent
                                    ? 'bg-[#E6AB3C] text-[#18230F]'
                                    : data.cycleType === 'on'
                                    ? 'bg-[#E8F4D9] text-[#233416]'
                                    : data.cycleType === 'off'
                                    ? 'bg-[#FEF5DB] text-[#B47A16]'
                                    : 'bg-white/10 text-[#E8F4D9]'
                                }`}
                              >
                                {data.cycle}
                              </span>
                            </div>

                            <div className="space-y-1.5 pt-0.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[#B0D984]">
                                  A • {varietyNames[selectedVariety]} :
                                </span>
                                <span className="text-white text-sm font-mono font-bold">
                                  {data.rendementVariete} L/qx ({data.productionLitres.toLocaleString('fr-FR')} L)
                                </span>
                              </div>

                              {isComparingVarieties && (
                                <div className="flex justify-between items-center">
                                  <span className="text-[#E6AB3C]">
                                    B • {varietyNames[comparedVariety]} :
                                  </span>
                                  <span className="text-[#E6AB3C] text-sm font-mono font-bold">
                                    {data.rendementVarieteComparee} L/qx ({data.productionLitresComparee.toLocaleString('fr-FR')} L)
                                  </span>
                                </div>
                              )}

                              {showWilayaBenchmark && (
                                <div className="flex justify-between items-center text-[#E8F4D9]/80">
                                  <span>Moyenne Wilaya Béjaïa :</span>
                                  <span className="font-mono text-xs font-semibold text-[#E6AB3C]">
                                    {data.rendementWilaya} L / qx
                                  </span>
                                </div>
                              )}

                              <div className="flex justify-between items-center text-[11px] text-[#E8F4D9]/70 pt-1 border-t border-[#FAF7F2]/10">
                                <span>Poids équivalent récolté :</span>
                                <span>
                                  {data.poidsOlivesKg.toLocaleString('fr-FR')} kg (
                                  {Math.round(data.poidsOlivesKg / 100)} qx)
                                </span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-[#FAF7F2]/10 text-[10px] text-[#B0D984] leading-snug">
                              🌱 <em>{data.climat}</em>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend
                    verticalAlign="top"
                    height={40}
                    wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingBottom: '12px' }}
                  />

                  {/* Render based on selected metric */}
                  {chartMetric === 'yield' && (
                    <>
                      <Bar
                        dataKey="rendementVariete"
                        name={`Variété A : ${varietyNames[selectedVariety]} (L/qx)`}
                        fill="#31491E"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={42}
                      />
                      {isComparingVarieties && (
                        <Bar
                          dataKey="rendementVarieteComparee"
                          name={`Variété B : ${varietyNames[comparedVariety]} (L/qx)`}
                          fill="#E6AB3C"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={42}
                        />
                      )}
                      {showWilayaBenchmark && (
                        <Line
                          type="monotone"
                          dataKey="rendementWilaya"
                          name="Moyenne Wilaya Béjaïa (L/qx)"
                          stroke="#AF4D24"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#AF4D24', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                          activeDot={{ r: 6 }}
                        />
                      )}
                      <ReferenceLine
                        y={19.4}
                        stroke="#6F9D44"
                        strokeDasharray="4 4"
                        label={{
                          value: 'Norme Béjaïa 19.4 L/qx',
                          position: 'right',
                          fill: '#567B34',
                          fontSize: 10,
                          fontWeight: 600
                        }}
                      />
                    </>
                  )}

                  {chartMetric === 'volume' && (
                    <>
                      <Bar
                        dataKey="productionLitres"
                        name={`Volume A : ${varietyNames[selectedVariety]} (L)`}
                        fill="#31491E"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={42}
                      />
                      {isComparingVarieties && (
                        <Bar
                          dataKey="productionLitresComparee"
                          name={`Volume B : ${varietyNames[comparedVariety]} (L)`}
                          fill="#E6AB3C"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={42}
                        />
                      )}
                    </>
                  )}

                  {chartMetric === 'combined' && (
                    <>
                      <Bar
                        yAxisId="left"
                        dataKey="productionLitres"
                        name={`Volume A : ${varietyNames[selectedVariety]} (L)`}
                        fill="#6F9D44"
                        opacity={0.85}
                        radius={[8, 8, 0, 0]}
                        maxBarSize={38}
                      />
                      {isComparingVarieties && (
                        <Bar
                          yAxisId="left"
                          dataKey="productionLitresComparee"
                          name={`Volume B : ${varietyNames[comparedVariety]} (L)`}
                          fill="#E6AB3C"
                          opacity={0.85}
                          radius={[8, 8, 0, 0]}
                          maxBarSize={38}
                        />
                      )}
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="rendementVariete"
                        name={`Rendement A : ${varietyNames[selectedVariety]} (L/qx)`}
                        stroke="#18230F"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#18230F', stroke: '#E6AB3C', strokeWidth: 2 }}
                      />
                      {isComparingVarieties && (
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="rendementVarieteComparee"
                          name={`Rendement B : ${varietyNames[comparedVariety]} (L/qx)`}
                          stroke="#B47A16"
                          strokeWidth={3}
                          dot={{ r: 5, fill: '#E6AB3C', stroke: '#18230F', strokeWidth: 2 }}
                        />
                      )}
                      {showWilayaBenchmark && (
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="rendementWilaya"
                          name="Moyenne Wilaya (L/qx)"
                          stroke="#AF4D24"
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={{ r: 4, fill: '#AF4D24' }}
                        />
                      )}
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Seasonal Breakdown Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {multiSeasonChartData.map((s) => (
              <div
                key={s.season}
                className={`p-3 rounded-xl border transition-all text-xs ${
                  s.isCurrent
                    ? 'bg-[#FEF5DB] border-[#E6AB3C] shadow-xs ring-2 ring-[#E6AB3C]/30'
                    : 'bg-[#FAF7F2] border-[#E6DEC9] hover:border-[#8CBE5D]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[#18230F]">{s.season}</span>
                  {s.isCurrent && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E6AB3C] text-[#18230F]">
                      Actuelle
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#6F9D44] text-[11px]">Rendement :</span>
                    <strong className="text-[#18230F] font-mono">{s.rendementVariete} L/qx</strong>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#6F9D44] text-[11px]">Volume :</span>
                    <span className="font-semibold text-[#31491E]">{s.productionLitres} L</span>
                  </div>
                  <div className="text-[10px] text-[#567B34] truncate mt-1">
                    {s.cycle}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Educational Note: L'alternance biennale en Kabylie */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC9] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#436229]">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#18230F]">
                <HelpCircle className="w-4 h-4 text-[#E6AB3C]" />
                <span>Pourquoi cette variation cyclique ?</span>
              </div>
              <p className="leading-relaxed">
                L’olivier kabyle (particulièrement le <em>Chemlal</em> et l’<em>Azeradj</em>) présente un phénomène naturel d'<strong>alternance biennale</strong> : une saison de forte charge épuise les réserves de glucides de l’arbre, entraînant un repos physiologique la saison suivante.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#18230F]">
                <Droplet className="w-4 h-4 text-[#567B34]" />
                <span>Rôle de la pluviométrie en Soummam</span>
              </div>
              <p className="leading-relaxed">
                Les précipitations d’avril-mai déterminent le taux de nouaison des fleurs, tandis que les pluies de septembre-octobre favorisent la lipogenèse (accumulation d’huile dans la pulpe) sans diluer le taux de matière grasse.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#18230F]">
                <ShieldCheck className="w-4 h-4 text-[#31491E]" />
                <span>Recommandation ADOIO pour lisser le rendement</span>
              </div>
              <p className="leading-relaxed">
                Pour atténuer l’alternance de 30% à 40%, l'ADOIO préconise : une <strong>taille raisonnée d’aération</strong> post-récolte, une cueillette précoce au filet (évite l'épuisement des branches) et un apport organique foliaire en sortie d'hiver.
              </p>
            </div>
          </div>
        </div>

        {/* Environmental Impact & Carbon Footprint Section */}
        <div className="mt-12 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-xs space-y-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC9]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1.5">
                <Leaf className="w-4 h-4 text-[#8CBE5D]" />
                <span>Transition Écologique & Économie Circulaire ADOIO</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18230F]">
                Impact Environnemental & Empreinte Carbone de la Récolte
              </h3>
              <p className="text-xs sm:text-sm text-[#436229] mt-1 max-w-2xl leading-relaxed">
                Estimez le bilan carbone net de votre production oléicole. L'olivier est un puits de carbone naturel : en adoptant des pratiques agroécologiques, votre huile d'olive de Kabylie peut devenir régénératrice pour le climat.
              </p>
            </div>

            {/* Quick Badge */}
            <div className="flex items-center gap-2 bg-[#E8F4D9] px-4 py-2 rounded-2xl border border-[#8CBE5D]/30 text-xs font-bold text-[#233416]">
              <TreePine className="w-4 h-4 text-[#567B34]" />
              <span>Verger de {effectiveTrees} oliviers · {totalWeight} kg d'olives</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Practices Selector (Left - 7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#18230F] block">
                Paramétrez vos pratiques agronomiques :
              </span>

              {/* 1. Travail du sol */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-[#567B34]" />
                    <span>Conduite & Travail du sol :</span>
                  </span>
                  <span className="text-[11px] text-[#6F9D44] font-medium">Stockage carbone sol</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSoilPractice('enherbe')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      soilPractice === 'enherbe'
                        ? 'bg-[#E8F4D9] border-[#8CBE5D] text-[#233416] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Enherbement spontané</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Pâturage ovin traditionnel (+3.5 kg CO₂/arbre)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSoilPractice('raisonne')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      soilPractice === 'raisonne'
                        ? 'bg-[#E8F4D9] border-[#8CBE5D] text-[#233416] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Travail superficiel</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Griffonnage léger modéré</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSoilPractice('intensif')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      soilPractice === 'intensif'
                        ? 'bg-[#FEF5DB] border-[#E6AB3C] text-[#B47A16] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Labours profonds</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Tracteur fréquent (+11.5 kg CO₂/arbre)</span>
                  </button>
                </div>
              </div>

              {/* 2. Fertilisation */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                    <Recycle className="w-3.5 h-3.5 text-[#567B34]" />
                    <span>Fertilisation & Matière Organique :</span>
                  </span>
                  <span className="text-[11px] text-[#6F9D44] font-medium">Recommandation ADOIO</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFertPractice('organique')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      fertPractice === 'organique'
                        ? 'bg-[#E8F4D9] border-[#8CBE5D] text-[#233416] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Compost & Grignons</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Fumier ovin + grignons compostés</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFertPractice('raisonnee')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      fertPractice === 'raisonnee'
                        ? 'bg-[#E8F4D9] border-[#8CBE5D] text-[#233416] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Minérale raisonnée</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Apport fractionné modéré</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFertPractice('chimique')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      fertPractice === 'chimique'
                        ? 'bg-[#FEF5DB] border-[#E6AB3C] text-[#B47A16] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Engrais de synthèse</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Azote minéral lourd (+15 kg CO₂/arbre)</span>
                  </button>
                </div>
              </div>

              {/* 3. Protection & Traitements */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#567B34]" />
                    <span>Protection phytosanitaire :</span>
                  </span>
                  <span className="text-[11px] text-[#6F9D44] font-medium">Lutte contre la mouche</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPhytoPractice('bio')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      phytoPractice === 'bio'
                        ? 'bg-[#E8F4D9] border-[#8CBE5D] text-[#233416] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Écologique & Bio (Argile / Pièges)</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Piégeage de Dacus oleae & kaolin naturel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPhytoPractice('conventionnelle')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      phytoPractice === 'conventionnelle'
                        ? 'bg-[#FEF5DB] border-[#E6AB3C] text-[#B47A16] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Chimique conventionnelle</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Insecticides de synthèse</span>
                  </button>
                </div>
              </div>

              {/* 4. Conduite hydrique & Énergie */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-[#567B34]" />
                    <span>Ressources en eau & Énergie :</span>
                  </span>
                  <span className="text-[11px] text-[#6F9D44] font-medium">Consommation énergétique</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWaterPractice('pluvial')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      waterPractice === 'pluvial'
                        ? 'bg-[#E8F4D9] border-[#8CBE5D] text-[#233416] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">100% Pluvial kabyle</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Zéro énergie, eau de pluie</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWaterPractice('solaire')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      waterPractice === 'solaire'
                        ? 'bg-[#E8F4D9] border-[#8CBE5D] text-[#233416] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Pompage Solaire</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Goutte-à-goutte photovoltaïque</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWaterPractice('diesel')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      waterPractice === 'diesel'
                        ? 'bg-[#FEF5DB] border-[#E6AB3C] text-[#B47A16] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Motopompe Diesel</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Gasoil thermique (+8.5 kg CO₂/arbre)</span>
                  </button>
                </div>
              </div>

              {/* 5. Économie circulaire moulin */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#567B34]" />
                    <span>Valorisation des sous-produits de trituration :</span>
                  </span>
                  <span className="text-[11px] text-[#6F9D44] font-medium">Grignons & Margines</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setByproductPractice('circulaire')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      byproductPractice === 'circulaire'
                        ? 'bg-[#E8F4D9] border-[#8CBE5D] text-[#233416] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Économie Circulaire ADOIO</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Grignons en biomasse combustible + lagunage margines (-160 kg CO₂/t)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setByproductPractice('standard')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      byproductPractice === 'standard'
                        ? 'bg-[#FEF5DB] border-[#E6AB3C] text-[#B47A16] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <strong className="block text-xs font-bold">Filière Standard</strong>
                    <span className="text-[10px] block opacity-80 mt-0.5">Sans valorisation énergétique locale</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Carbon Footprint & Impact Results (Right - 5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#233416] to-[#18230F] text-[#FAF7F2] p-6 sm:p-7 rounded-3xl border border-[#8CBE5D]/30 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]/15">
                <div className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#8CBE5D]" />
                  <h4 className="font-serif text-lg font-bold">Bilan Carbone Net</h4>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  isCarbonSink
                    ? 'bg-[#E8F4D9] text-[#233416]'
                    : 'bg-[#FEF5DB] text-[#B47A16]'
                }`}>
                  {isCarbonSink ? 'Puits de Carbone' : 'Émetteur Net'}
                </span>
              </div>

              {/* Main Net Carbon Number */}
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#B0D984] font-medium block">
                  Bilan Carbone Annuel du Verger
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-4xl sm:text-5xl font-extrabold text-[#E6AB3C]">
                    {isCarbonSink ? '-' : '+'}{Math.abs(netCarbonSavedKg).toLocaleString()}
                  </span>
                  <span className="text-lg font-sans font-bold text-[#FAF7F2]">kg CO₂e</span>
                </div>
                <p className="text-xs text-[#E8F4D9]/80">
                  {isCarbonSink
                    ? '✨ Votre verger séquestre plus de carbone qu’il n’en émet !'
                    : '⚠️ Les émissions mécaniques et chimiques dépassent la séquestration naturelle.'}
                </p>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#FAF7F2]/15 text-xs">
                <div className="bg-[#FAF7F2]/10 p-3 rounded-xl border border-[#FAF7F2]/15">
                  <span className="text-[10px] uppercase font-bold text-[#8CBE5D] block">Séquestration Brute</span>
                  <span className="font-serif text-lg font-bold text-white">+{totalSequestrationKg.toLocaleString()}</span>
                  <span className="text-[10px] text-[#B0D984] block">kg CO₂e / an</span>
                </div>

                <div className="bg-[#FAF7F2]/10 p-3 rounded-xl border border-[#FAF7F2]/15">
                  <span className="text-[10px] uppercase font-bold text-[#E6AB3C] block">Émissions Pratiques</span>
                  <span className="font-serif text-lg font-bold text-white">-{totalEmissionsKg.toLocaleString()}</span>
                  <span className="text-[10px] text-[#E8F4D9]/70 block">kg CO₂e / an</span>
                </div>
              </div>

              {/* Unit Footprint per Liter of Olive Oil */}
              <div className="bg-[#FAF7F2]/10 p-4 rounded-2xl border border-[#FAF7F2]/15 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#E8F4D9]">Empreinte par Litre d'Huile :</span>
                  <span className={`font-mono text-base font-bold ${
                    carbonFootprintPerLiter <= 0 ? 'text-[#8CBE5D]' : 'text-[#E6AB3C]'
                  }`}>
                    {carbonFootprintPerLiter <= 0 ? `${carbonFootprintPerLiter}` : `+${carbonFootprintPerLiter}`} kg CO₂e / L
                  </span>
                </div>
                <p className="text-[11px] text-[#E8F4D9]/80 leading-snug">
                  {carbonFootprintPerLiter <= 0
                    ? `Chaque litre d’huile produit avec ces méthodes a retiré ${Math.abs(carbonFootprintPerLiter)} kg de CO₂ de l’atmosphère.`
                    : `Pour réduire cette empreinte en dessous de zéro, privilégiez le compost organique et l’enherbement.`}
                </p>
              </div>

              {/* Real World Equivalencies */}
              <div className="space-y-2 pt-1 border-t border-[#FAF7F2]/15 text-xs text-[#E8F4D9]">
                <strong className="text-[#E6AB3C] block font-semibold">Équivalences concrètes :</strong>
                <div className="space-y-1.5 text-[11px]">
                  <p className="flex items-center gap-2">
                    <span>🚗</span>
                    <span>Équivaut à <strong>{kmCarEquivalent.toLocaleString()} km</strong> en voiture absorbés par votre verger.</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📍</span>
                    <span>Soit environ <strong>{roundtripsAlgerBejaia} allers-retours Alger-Béjaïa</strong> neutralisés.</span>
                  </p>
                </div>
              </div>

              {/* ADOIO Environmental Diagnostic */}
              <div className="p-3.5 bg-[#FAF7F2]/10 rounded-xl text-xs text-[#E8F4D9] space-y-1">
                <strong className="text-[#8CBE5D] flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8CBE5D]" />
                  <span>Avis Agroécologique ADOIO :</span>
                </strong>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {soilPractice === 'enherbe' && fertPractice === 'organique'
                    ? "Exemplaire ! Votre verger incarne l'oléiculture régénératrice kabyle. Il préserve la biodiversité du sol et valorise les sous-produits locaux."
                    : "Pour maximiser la séquestration et obtenir le label Vierge Extra Éco-responsable, l'ADOIO recommande de remplacer les labours profonds par un couvert végétal naturel fauché au printemps."}
                </p>
              </div>

              {/* Direct Link to Silo 4 Organic Fertilization Calculator */}
              <div className="pt-2">
                <a
                  href="#fertilisation"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#8CBE5D] hover:bg-[#9ED46D] text-[#18230F] text-xs font-bold transition-all shadow-xs"
                >
                  <Sprout className="w-4 h-4 text-[#18230F]" />
                  <span>Calculer vos Besoins en Fertilisation Organique</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
