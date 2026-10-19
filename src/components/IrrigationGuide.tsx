import React, { useState, useMemo } from 'react';
import { 
  Droplets, 
  Droplet, 
  Calendar, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Printer, 
  Download, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Gauge, 
  TrendingUp, 
  ArrowRight,
  Sun,
  Flame,
  CloudRain,
  Sliders,
  Sprout
} from 'lucide-react';

export type TreeAgeGroup = 'young' | 'growth' | 'mature' | 'centenarian';
export type KabyleSoilType = 'argilo_calcaire' | 'schiste_pente' | 'terrasse_muret' | 'alluvionnaire';
export type IrrigationMethod = 'drip' | 'micro_spray' | 'basin' | 'rainfed';
export type SeasonPeriod = 'spring_growth' | 'summer_pit' | 'late_summer_oil' | 'autumn_veraison';

interface SoilCharacteristic {
  id: KabyleSoilType;
  name: string;
  kabyleName: string;
  location: string;
  waterRetention: 'high' | 'medium' | 'low';
  waterRetentionLabel: string;
  reserveUtileMmPerM: number; // Réserve Utile (mm/m)
  drainageSpeed: string;
  percolationRisk: string;
  description: string;
  multiplier: number; // Modulateur de fréquence et dose
  recommendedSpacingHours: number;
}

export const KABYLE_SOIL_CHARACTERISTICS: Record<KabyleSoilType, SoilCharacteristic> = {
  argilo_calcaire: {
    id: 'argilo_calcaire',
    name: 'Argilo-calcaire Alluvionnaire de Plaine',
    kabyleName: 'Akal n targa d Iɣzer',
    location: 'Bassin d’Akbou, Tazmalt, Vallée alluviale de la Soummam',
    waterRetention: 'high',
    waterRetentionLabel: 'Forte rétention (140 – 160 mm/m)',
    reserveUtileMmPerM: 150,
    drainageSpeed: 'Lent à modéré',
    percolationRisk: 'Risque d’asphyxie racinaire si sur-irrigation',
    description: 'Terre riche et profonde capable de stocker l’eau plusieurs semaines. Espacer les arrosages pour aérer le système racinaire.',
    multiplier: 1.0,
    recommendedSpacingHours: 12
  },
  schiste_pente: {
    id: 'schiste_pente',
    name: 'Schisteux & Gréseux de Pente',
    kabyleName: 'Akal n udrar d iẓra',
    location: 'Versants de Chemini, Sidi-Aïch, Ighzer Amokrane',
    waterRetention: 'medium',
    waterRetentionLabel: 'Moyenne rétention (80 – 100 mm/m)',
    reserveUtileMmPerM: 90,
    drainageSpeed: 'Rapide, forte pierrosité',
    percolationRisk: 'Ruissellement de surface sur pente raide',
    description: 'Sol montagnard très drainant. Privilégier des doses modérées mais répétées via goutte-à-goutte pour éviter le lessivage.',
    multiplier: 0.85,
    recommendedSpacingHours: 8
  },
  terrasse_muret: {
    id: 'terrasse_muret',
    name: 'Sol Squelettique de Terrasses en Pierre Sèche',
    kabyleName: 'Tirisa n tzemmurt n Cmini',
    location: 'Terrasses empierrées d’Adekar, Seddouk Ouffella, Djurdjura oriental',
    waterRetention: 'low',
    waterRetentionLabel: 'Faible rétention (60 – 75 mm/m)',
    reserveUtileMmPerM: 70,
    drainageSpeed: 'Très rapide, sol superficiel (< 40 cm)',
    percolationRisk: 'Dessèchement rapide en plein été',
    description: 'Ouvrages paysans retenant la terre. Paillage organique indispensable sous le houppier pour conserver l’humidité nocturne.',
    multiplier: 0.75,
    recommendedSpacingHours: 6
  },
  alluvionnaire: {
    id: 'alluvionnaire',
    name: 'Alluvions Filtrantes & Sables de Berge',
    kabyleName: 'Amlal n wasif',
    location: 'Berges de l’Oued Soummam, terrasses basses alluviales',
    waterRetention: 'low',
    waterRetentionLabel: 'Rétention modérée (90 – 110 mm/m)',
    reserveUtileMmPerM: 100,
    drainageSpeed: 'Très rapide et aéré',
    percolationRisk: 'Percolation profonde hors de portée des racines',
    description: 'Sol meuble et très aéré. Nécessite une irrigation fractionnée et précise pour éviter les pertes d’eau en profondeur.',
    multiplier: 0.9,
    recommendedSpacingHours: 7
  }
};

interface AgeWaterProfile {
  ageGroup: TreeAgeGroup;
  title: string;
  rangeYears: string;
  canopyDiameterM: number;
  rootDepthM: number;
  baseLitersPerDaySummer: number; // Litres par arbre par jour en pic d'évapotranspiration
  turnaroundDaysDrip: number;
  turnaroundDaysBasin: number;
  canopyProjectionAreaM2: number;
  drippersPerTreeRecommended: number;
  collarWarning: string;
}

export const AGE_WATER_PROFILES: Record<TreeAgeGroup, AgeWaterProfile> = {
  young: {
    ageGroup: 'young',
    title: 'Jeunes Scions & Plants Récents',
    rangeYears: '1 à 3 ans',
    canopyDiameterM: 1.2,
    rootDepthM: 0.45,
    baseLitersPerDaySummer: 8,
    turnaroundDaysDrip: 4,
    turnaroundDaysBasin: 6,
    canopyProjectionAreaM2: 2.0,
    drippersPerTreeRecommended: 2,
    collarWarning: 'Arroser à 30–40 cm du tronc. Ne jamais mouiller le collet pour prévenir la pourriture racinaire.'
  },
  growth: {
    ageGroup: 'growth',
    title: 'Arbres en Croissance & Formation',
    rangeYears: '4 à 10 ans',
    canopyDiameterM: 2.8,
    rootDepthM: 1.2,
    baseLitersPerDaySummer: 22,
    turnaroundDaysDrip: 6,
    turnaroundDaysBasin: 9,
    canopyProjectionAreaM2: 7.5,
    drippersPerTreeRecommended: 4,
    collarWarning: 'Disposer les goutteurs en couronne à mi-rayon sous la frondaison (environ 70 cm du tronc).'
  },
  mature: {
    ageGroup: 'mature',
    title: 'Adultes en Pleine Production',
    rangeYears: '11 à 50 ans',
    canopyDiameterM: 5.2,
    rootDepthM: 2.5,
    baseLitersPerDaySummer: 48,
    turnaroundDaysDrip: 8,
    turnaroundDaysBasin: 12,
    canopyProjectionAreaM2: 22.0,
    drippersPerTreeRecommended: 6,
    collarWarning: 'Positionner la rampe sous la ligne de projection externe de la couronne (zone d’absorption active des radicelles).'
  },
  centenarian: {
    ageGroup: 'centenarian',
    title: 'Oliviers Centenaires & Multiséculaires',
    rangeYears: '> 50 ans (quadri-centenaires)',
    canopyDiameterM: 7.5,
    rootDepthM: 5.5,
    baseLitersPerDaySummer: 65,
    turnaroundDaysDrip: 12,
    turnaroundDaysBasin: 18,
    canopyProjectionAreaM2: 45.0,
    drippersPerTreeRecommended: 8,
    collarWarning: 'Racines pivotantes profondes (> 4m). Seul un arrosage d’appoint sous la couronne lors des canicules est nécessaire.'
  }
};

interface PhenologicalStage {
  id: SeasonPeriod;
  title: string;
  months: string;
  factorKc: number; // Coefficient cultural
  agronomicObjective: string;
  sensitivityToStress: 'high' | 'critical' | 'moderate' | 'low';
  recommendation: string;
}

export const PHENOLOGICAL_STAGES: PhenologicalStage[] = [
  {
    id: 'spring_growth',
    title: 'Débourrement & Floraison',
    months: 'Avril – Mai',
    factorKc: 0.65,
    agronomicObjective: 'Nouaison abondante & croissance des jeunes pousses',
    sensitivityToStress: 'critical',
    recommendation: 'Une sécheresse printanière sévère provoque l’avortement ovarien des fleurs. Apport de confort si les pluies d’avril sont < 25 mm.'
  },
  {
    id: 'summer_pit',
    title: 'Durcissement du Noyau & Stress Estival',
    months: 'Juin – Juillet',
    factorKc: 0.50,
    agronomicObjective: 'Résistance caniculaire & limitation de la chute physiologique',
    sensitivityToStress: 'moderate',
    recommendation: 'Pratiquer l’Irrigation Déficitaire Régulée (RDI) : apporter 50% de l’ETc pour stimuler la synthèse des polyphénols sans flétrir la drupe.'
  },
  {
    id: 'late_summer_oil',
    title: 'Grossissement de la Drupe & Lipogenèse',
    months: 'Août – Mi-Septembre',
    factorKc: 0.70,
    agronomicObjective: 'Accumulation d’huile dans la pulpe (richesse en acide oléique)',
    sensitivityToStress: 'high',
    recommendation: 'Période clé pour le rendement en huile. Deux apports ciblés avant les premières pluies d’automne évitent le ratatinement des olives.'
  },
  {
    id: 'autumn_veraison',
    title: 'Véraison & Pré-Récolte',
    months: 'Fin Septembre – Novembre',
    factorKc: 0.40,
    agronomicObjective: 'Concentration des arômes & préparation de la cueillette',
    sensitivityToStress: 'low',
    recommendation: 'Stopper les irrigations 3 semaines avant récolte : évite la dilution de l’huile, durcit l’épiderme et réduit les attaques de mouche.'
  }
];

export const IrrigationGuide: React.FC = () => {
  // Input parameters
  const [calculationMode, setCalculationMode] = useState<'trees' | 'hectares'>('trees');
  const [treeCount, setTreeCount] = useState<number>(100);
  const [hectares, setHectares] = useState<number>(1);
  const [densityTreesPerHa, setDensityTreesPerHa] = useState<number>(100);

  const [selectedAge, setSelectedAge] = useState<TreeAgeGroup>('mature');
  const [selectedSoil, setSelectedSoil] = useState<KabyleSoilType>('argilo_calcaire');
  const [selectedMethod, setSelectedMethod] = useState<IrrigationMethod>('drip');
  const [selectedStage, setSelectedStage] = useState<SeasonPeriod>('summer_pit');
  const [dripperFlowRateLh, setDripperFlowRateLh] = useState<number>(4); // Litres/heure par goutteur
  const [mulchingUsed, setMulchingUsed] = useState<boolean>(true); // Paillage organique

  // Synchronize trees count & hectares
  const totalTrees = useMemo(() => {
    if (calculationMode === 'trees') {
      return Math.max(1, treeCount);
    }
    return Math.max(1, Math.round(hectares * densityTreesPerHa));
  }, [calculationMode, treeCount, hectares, densityTreesPerHa]);

  const soilData = KABYLE_SOIL_CHARACTERISTICS[selectedSoil];
  const ageData = AGE_WATER_PROFILES[selectedAge];
  const stageData = PHENOLOGICAL_STAGES.find(s => s.id === selectedStage) || PHENOLOGICAL_STAGES[1];

  // Calculation of water requirements
  const calculations = useMemo(() => {
    // Base daily requirement in peak summer modified by phenological stage Kc
    const baseDaily = ageData.baseLitersPerDaySummer * stageData.factorKc;

    // Soil modulator (clay stores water longer; rocky slopes require shorter intervals)
    const soilFactor = soilData.multiplier;

    // Mulching saving (-20% evapotranspiration if applied)
    const mulchingFactor = mulchingUsed ? 0.80 : 1.0;

    // Method efficiency
    const efficiencyFactor = {
      drip: 0.90,        // 90% efficiency (micro-irrigation)
      micro_spray: 0.80, // 80% efficiency
      basin: 0.65,       // 65% efficiency (percolation/evaporation losses)
      rainfed: 1.0       // Zero irrigation
    }[selectedMethod];

    // Net daily water needed per tree (Litres / tree / day)
    const netDailyPerTree = selectedMethod === 'rainfed' 
      ? 0 
      : Math.round((baseDaily * soilFactor * mulchingFactor) / efficiencyFactor);

    // Days between irrigation cycles
    let daysBetweenIrrigations = selectedMethod === 'drip' 
      ? ageData.turnaroundDaysDrip 
      : ageData.turnaroundDaysBasin;

    // Soils with low retention require shorter turnaround
    if (soilData.waterRetention === 'low') {
      daysBetweenIrrigations = Math.max(3, Math.round(daysBetweenIrrigations * 0.75));
    } else if (soilData.waterRetention === 'high') {
      daysBetweenIrrigations = Math.round(daysBetweenIrrigations * 1.25);
    }

    // Water volume per irrigation session per tree (Litres)
    const litersPerTreePerSession = netDailyPerTree * daysBetweenIrrigations;

    // Total session volume for the orchard in m3
    const sessionVolumeM3 = (litersPerTreePerSession * totalTrees) / 1000;

    // Monthly volume estimate (m3 / month)
    const monthlyFrequency = Math.max(1, Math.round(30 / daysBetweenIrrigations));
    const monthlyVolumeM3 = sessionVolumeM3 * monthlyFrequency;

    // Pumping duration for drip irrigation
    const totalDrippersPerTree = ageData.drippersPerTreeRecommended;
    const treeDripFlowRateLh = totalDrippersPerTree * dripperFlowRateLh;
    const pumpingDurationHours = treeDripFlowRateLh > 0 
      ? (litersPerTreePerSession / treeDripFlowRateLh) 
      : 0;

    // Estimated water saving vs conventional flood irrigation
    const conventionalWaterM3 = (ageData.baseLitersPerDaySummer * 1.5 * 30 * totalTrees) / 1000;
    const waterSavedM3 = Math.max(0, conventionalWaterM3 - monthlyVolumeM3);
    const savingPercent = conventionalWaterM3 > 0 
      ? Math.round((waterSavedM3 / conventionalWaterM3) * 100) 
      : 0;

    return {
      netDailyPerTree,
      daysBetweenIrrigations,
      litersPerTreePerSession,
      sessionVolumeM3: Math.round(sessionVolumeM3 * 10) / 10,
      monthlyVolumeM3: Math.round(monthlyVolumeM3),
      monthlyFrequency,
      totalDrippersPerTree,
      pumpingDurationHours: Math.round(pumpingDurationHours * 10) / 10,
      waterSavedM3: Math.round(waterSavedM3),
      savingPercent
    };
  }, [ageData, soilData, stageData, selectedMethod, mulchingUsed, totalTrees, dripperFlowRateLh]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="irrigation" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9] scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <Droplets className="w-4 h-4 text-[#E6AB3C]" />
              <span>Outil Agronomique · Gestion Raisonnée de l'Eau</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              Guide & Simulateur d'Irrigation Raisonnée de l'Olivier
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#436229] max-w-3xl leading-relaxed">
              Estimez avec précision les besoins hydriques de votre verger selon l'âge de vos oliviers, le type de sol kabyle et le stade phénologique, en appliquant les recommandations d'Irrigation Déficitaire Régulée (RDI) de l'ADOIO.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E6DEC9] text-[#18230F] text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-[#F4EEE1] transition-colors cursor-pointer"
              title="Imprimer le protocole d'irrigation personnalisé"
            >
              <Printer className="w-4 h-4 text-[#567B34]" />
              <span>Imprimer la Fiche</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC9] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E] mb-3">
              <Droplet className="w-5 h-5 text-[#567B34]" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#6F9D44] font-bold block">
              Dose d'Arrosage
            </span>
            <div className="font-serif text-2xl font-bold text-[#18230F] mt-1">
              {calculations.litersPerTreePerSession} <span className="text-sm font-sans font-medium text-[#567B34]">L / arbre</span>
            </div>
            <p className="text-[11px] text-[#567B34] mt-1">
              Tous les <strong>{calculations.daysBetweenIrrigations} jours</strong> en cycle estival
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC9] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF5DB] flex items-center justify-center text-[#B47A16] mb-3">
              <Gauge className="w-5 h-5 text-[#E6AB3C]" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#6F9D44] font-bold block">
              Volume Parcelle
            </span>
            <div className="font-serif text-2xl font-bold text-[#E6AB3C] mt-1">
              {calculations.sessionVolumeM3} <span className="text-sm font-sans font-medium text-[#18230F]">m³ / passage</span>
            </div>
            <p className="text-[11px] text-[#567B34] mt-1">
              Soit <strong>{calculations.monthlyVolumeM3} m³ / mois</strong> ({calculations.monthlyFrequency} passages)
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC9] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E] mb-3">
              <Clock className="w-5 h-5 text-[#567B34]" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#6F9D44] font-bold block">
              Durée Goutteurs
            </span>
            <div className="font-serif text-2xl font-bold text-[#31491E] mt-1">
              {calculations.pumpingDurationHours} <span className="text-sm font-sans font-medium text-[#567B34]">heures</span>
            </div>
            <p className="text-[11px] text-[#567B34] mt-1">
              Avec {calculations.totalDrippersPerTree} goutteurs de {dripperFlowRateLh} L/h par olivier
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC9] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF5DB] flex items-center justify-center text-[#B47A16] mb-3">
              <Sparkles className="w-5 h-5 text-[#E6AB3C]" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#6F9D44] font-bold block">
              Économie d'Eau
            </span>
            <div className="font-serif text-2xl font-bold text-[#567B34] mt-1">
              -{calculations.savingPercent}%
            </div>
            <p className="text-[11px] text-[#567B34] mt-1">
              ~{calculations.waterSavedM3} m³ préservés vs submersion
            </p>
          </div>
        </div>

        {/* Interactive Configuration & Real-Time Simulator Box */}
        <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 lg:p-8 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC9]">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                Paramétrage de la Parcelle & du Terroir Kabyle
              </h3>
              <p className="text-xs sm:text-sm text-[#567B34] mt-0.5">
                Ajustez les curseurs pour adapter instantanément le calcul aux réalités de votre oliveraie.
              </p>
            </div>

            {/* Toggle calculation mode */}
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#E6DEC9] text-xs">
              <button
                type="button"
                onClick={() => setCalculationMode('trees')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  calculationMode === 'trees'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'text-[#31491E] hover:bg-white/60'
                }`}
              >
                Par Nombre d'Oliviers
              </button>
              <button
                type="button"
                onClick={() => setCalculationMode('hectares')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  calculationMode === 'hectares'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'text-[#31491E] hover:bg-white/60'
                }`}
              >
                Par Hectares
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            
            {/* 1. Age of Olive Trees */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#18230F] flex items-center justify-between">
                <span>Âge moyen des arbres :</span>
                <span className="text-[#567B34] font-medium">{ageData.rangeYears}</span>
              </label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value as TreeAgeGroup)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6DEC9] bg-[#FAF7F2] font-semibold text-[#18230F] focus:outline-none focus:border-[#31491E] cursor-pointer"
              >
                <option value="young">Jeunes scions (1 à 3 ans)</option>
                <option value="growth">Arbres en croissance (4 à 10 ans)</option>
                <option value="mature">Adultes en production (11 à 50 ans)</option>
                <option value="centenarian">Centenaires vénérables (&gt; 50 ans)</option>
              </select>
              <span className="text-[11px] text-[#6F9D44] block">
                Diamètre frondaison : ~{ageData.canopyDiameterM} m · Enracinement : ~{ageData.rootDepthM} m
              </span>
            </div>

            {/* 2. Soil Type in Kabylie */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#18230F] flex items-center justify-between">
                <span>Type de sol kabyle :</span>
                <span className="text-[#E6AB3C] font-mono text-[11px]">{soilData.reserveUtileMmPerM} mm RU</span>
              </label>
              <select
                value={selectedSoil}
                onChange={(e) => setSelectedSoil(e.target.value as KabyleSoilType)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6DEC9] bg-[#FAF7F2] font-semibold text-[#18230F] focus:outline-none focus:border-[#31491E] cursor-pointer"
              >
                <option value="argilo_calcaire">Argilo-calcaire de plaine (Akbou, Soummam)</option>
                <option value="schiste_pente">Schisteux de versants (Chemini, Sidi-Aïch)</option>
                <option value="terrasse_muret">Terrasses en pierre sèche (Adekar, Seddouk)</option>
                <option value="alluvionnaire">Alluvions légères de berge d'Oued</option>
              </select>
              <span className="text-[11px] text-[#6F9D44] block">
                {soilData.waterRetentionLabel}
              </span>
            </div>

            {/* 3. Phenological Stage */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#18230F] flex items-center justify-between">
                <span>Stade Phénologique :</span>
                <span className="text-[#31491E] font-medium">{stageData.months}</span>
              </label>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value as SeasonPeriod)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6DEC9] bg-[#FAF7F2] font-semibold text-[#18230F] focus:outline-none focus:border-[#31491E] cursor-pointer"
              >
                {PHENOLOGICAL_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.months})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-[#6F9D44] block">
                Sensibilité hydrique : <strong className="text-[#18230F]">{stageData.sensitivityToStress.toUpperCase()}</strong>
              </span>
            </div>

            {/* 4. Irrigation Technology */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#18230F] flex items-center justify-between">
                <span>Système d'irrigation :</span>
                <span className="text-[#567B34] font-medium">Technique</span>
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as IrrigationMethod)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6DEC9] bg-[#FAF7F2] font-semibold text-[#18230F] focus:outline-none focus:border-[#31491E] cursor-pointer"
              >
                <option value="drip">Goutte-à-goutte (Micro-irrigation ADOIO)</option>
                <option value="micro_spray">Micro-aspersion sous frondaison</option>
                <option value="basin">Cuvettes traditionnelles au pied</option>
                <option value="rainfed">Conduite pluviale stricte (Bour kabyle)</option>
              </select>
              <div className="flex items-center justify-between text-[11px] text-[#567B34]">
                <span>Débit goutteur :</span>
                <select
                  value={dripperFlowRateLh}
                  onChange={(e) => setDripperFlowRateLh(Number(e.target.value))}
                  disabled={selectedMethod !== 'drip'}
                  className="px-2 py-0.5 rounded border border-[#E6DEC9] bg-white text-xs disabled:opacity-40"
                >
                  <option value={2}>2 L / heure</option>
                  <option value={4}>4 L / heure (Standard)</option>
                  <option value={8}>8 L / heure</option>
                </select>
              </div>
            </div>
          </div>

          {/* Size Input Slider Bar */}
          <div className="mt-6 pt-6 border-t border-[#E6DEC9] grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {calculationMode === 'trees' ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#18230F]">Nombre total d'oliviers sur la parcelle :</span>
                  <span className="font-serif font-bold text-base text-[#31491E]">{treeCount} arbres</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={2500}
                  step={10}
                  value={treeCount}
                  onChange={(e) => setTreeCount(Number(e.target.value))}
                  className="w-full accent-[#31491E] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#567B34]">
                  <span>10 arbres (Jardin familial)</span>
                  <span>500 arbres</span>
                  <span>2 500 arbres (Grand domaine)</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#18230F] block">Superficie (hectares) :</label>
                  <input
                    type="number"
                    min={0.1}
                    max={100}
                    step={0.5}
                    value={hectares}
                    onChange={(e) => setHectares(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-[#FAF7F2] font-semibold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#18230F] block">Densité (arbres / ha) :</label>
                  <select
                    value={densityTreesPerHa}
                    onChange={(e) => setDensityTreesPerHa(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-[#FAF7F2] font-semibold"
                  >
                    <option value={70}>70 arbres/ha (Terrasses traditionnelles)</option>
                    <option value={100}>100 arbres/ha (Standard Soummam 10x10m)</option>
                    <option value={156}>156 arbres/ha (Semi-intensif 8x8m)</option>
                    <option value={204}>204 arbres/ha (Intensif 7x7m)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Mulching Switch */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9] flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#18230F] block">
                  Paillage Organique du Sol (Mulch de sous-produits)
                </span>
                <p className="text-[11px] text-[#567B34] mt-0.5 leading-snug">
                  Couverture du sol par broyat de taille, compost ou grignon d'olive déshuilé. Évite l'évaporation et économise 20% d'eau.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMulchingUsed(!mulchingUsed)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  mulchingUsed
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'bg-white border border-[#E6DEC9] text-[#6F9D44]'
                }`}
              >
                {mulchingUsed ? '✓ Paillage Activé (-20%)' : 'Sans Paillage'}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Agronomic Guidance & Soil Diagnostic Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card Left: Soil & Placement Strategy */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC9] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E]">
                <Layers className="w-5 h-5 text-[#436229]" />
              </div>
              <div>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#18230F]">
                  Comportement du Sol : {soilData.name}
                </h4>
                <p className="text-xs text-[#567B34] font-serif italic">« {soilData.kabyleName} » · {soilData.location}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#436229] leading-relaxed">
              {soilData.description}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DEC9]">
                <span className="text-[10px] text-[#6F9D44] font-bold block uppercase">Vitesse de drainage</span>
                <span className="font-bold text-[#18230F]">{soilData.drainageSpeed}</span>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DEC9]">
                <span className="text-[10px] text-[#6F9D44] font-bold block uppercase">Point de vigilance</span>
                <span className="font-bold text-[#AF4D24] text-[11px] leading-tight block mt-0.5">{soilData.percolationRisk}</span>
              </div>
            </div>

            <div className="p-4 bg-[#E8F4D9]/60 rounded-2xl border border-[#8CBE5D]/40 text-xs text-[#233416] space-y-1">
              <strong className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-[#567B34]" />
                <span>Règle d'or de placement des goutteurs :</span>
              </strong>
              <p className="leading-relaxed text-[11px]">
                {ageData.collarWarning}
              </p>
            </div>
          </div>

          {/* Card Right: Phenological Water Stress Advisory */}
          <div className="bg-gradient-to-br from-[#233416] to-[#18230F] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#8CBE5D]/30 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6AB3C]/20 flex items-center justify-center text-[#E6AB3C]">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-[#FAF7F2]">
                  Stade Phénologique : {stageData.title}
                </h4>
                <p className="text-xs text-[#B0D984]">{stageData.months} · Coefficient Kc : {stageData.factorKc}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#E6AB3C] font-bold block uppercase text-[10px] tracking-wider">
                  Objectif agronomique prioritaire :
                </span>
                <p className="text-[#E8F4D9] mt-0.5 text-xs sm:text-sm font-medium">
                  {stageData.agronomicObjective}
                </p>
              </div>

              <div>
                <span className="text-[#B0D984] font-bold block uppercase text-[10px] tracking-wider">
                  Préconisation technique ADOIO :
                </span>
                <p className="text-[#E8F4D9]/90 mt-0.5 leading-relaxed text-xs">
                  {stageData.recommendation}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 text-xs text-[#FAF7F2] space-y-1">
              <span className="font-bold text-[#E6AB3C] block">
                🌿 Pourquoi l'Irrigation Déficitaire Régulée (RDI) ?
              </span>
              <p className="text-[11px] text-[#E8F4D9]/80 leading-relaxed">
                Apporter un léger stress hydrique contrôlé en juillet-août bloque la surabondance de bois inutile et force l'olivier à concentrer ses polyphénols (oleocanthal, hydroxytyrosol), créant une huile Vierge Extra plus piquante et stable.
              </p>
            </div>
          </div>
        </div>

        {/* Seasonal Phenological Table */}
        <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 lg:p-8 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1">
              <Calendar className="w-4 h-4 text-[#E6AB3C]" />
              <span>Calendrier de Pilotage de l'Irrigation</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
              Besoins par Stade Phénologique dans la Vallée de la Soummam
            </h4>
            <p className="text-xs sm:text-sm text-[#567B34] mt-1">
              Synthèse des 4 phases critiques de la campagne oléicole pour optimiser l'eau sans gaspillage.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E6DEC9] bg-[#FAF7F2] text-[#18230F]">
                  <th className="py-3 px-4 font-bold">Stade & Mois</th>
                  <th className="py-3 px-4 font-bold">Sensibilité</th>
                  <th className="py-3 px-4 font-bold">Dose Indicative (L/arbre/semaine)</th>
                  <th className="py-3 px-4 font-bold">Impact Qualité Huile</th>
                  <th className="py-3 px-4 font-bold">Action Recommandée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DEC9]">
                <tr className={`transition-colors ${selectedStage === 'spring_growth' ? 'bg-[#E8F4D9]/50 font-semibold' : 'hover:bg-[#FAF7F2]'}`}>
                  <td className="py-3.5 px-4 font-bold text-[#18230F]">
                    Débourrement & Floraison<br />
                    <span className="text-[11px] font-normal text-[#567B34]">Avril – Mai</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">Critique</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#31491E] font-mono">
                    30 à 60 L / arbre
                  </td>
                  <td className="py-3.5 px-4 text-[#436229]">
                    Conditionne le nombre de fruits par grappe
                  </td>
                  <td className="py-3.5 px-4 text-[#18230F]">
                    Irriguer seulement en cas de printemps très sec (&lt; 20 mm de pluie)
                  </td>
                </tr>

                <tr className={`transition-colors ${selectedStage === 'summer_pit' ? 'bg-[#E8F4D9]/50 font-semibold' : 'hover:bg-[#FAF7F2]'}`}>
                  <td className="py-3.5 px-4 font-bold text-[#18230F]">
                    Durcissement du Noyau<br />
                    <span className="text-[11px] font-normal text-[#567B34]">Juin – Juillet</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Modérée</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#31491E] font-mono">
                    40 à 80 L / arbre
                  </td>
                  <td className="py-3.5 px-4 text-[#436229]">
                    Maximise les polyphénols antioxydants
                  </td>
                  <td className="py-3.5 px-4 text-[#18230F]">
                    Irrigation déficitaire de nuit (50% de la dose pleine)
                  </td>
                </tr>

                <tr className={`transition-colors ${selectedStage === 'late_summer_oil' ? 'bg-[#E8F4D9]/50 font-semibold' : 'hover:bg-[#FAF7F2]'}`}>
                  <td className="py-3.5 px-4 font-bold text-[#18230F]">
                    Grossissement & Lipogenèse<br />
                    <span className="text-[11px] font-normal text-[#567B34]">Août – Mi-Septembre</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">Élevée</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#31491E] font-mono">
                    60 à 120 L / arbre
                  </td>
                  <td className="py-3.5 px-4 text-[#436229]">
                    Détermine le rendement final en litres d'huile
                  </td>
                  <td className="py-3.5 px-4 text-[#18230F]">
                    Deux irrigations profondes espacées de 10 jours
                  </td>
                </tr>

                <tr className={`transition-colors ${selectedStage === 'autumn_veraison' ? 'bg-[#E8F4D9]/50 font-semibold' : 'hover:bg-[#FAF7F2]'}`}>
                  <td className="py-3.5 px-4 font-bold text-[#18230F]">
                    Véraison & Pré-Récolte<br />
                    <span className="text-[11px] font-normal text-[#567B34]">Fin Septembre – Novembre</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">Faible</span>
                  </td>
                  <td className="py-3.5 px-4 text-[#31491E] font-mono">
                    0 à 20 L / arbre (arrêt)
                  </td>
                  <td className="py-3.5 px-4 text-[#436229]">
                    Concentration en acide oléique, épiderme résistant
                  </td>
                  <td className="py-3.5 px-4 text-[#18230F]">
                    Cesser tout apport hydrique au moins 20 jours avant la cueillette
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E6DEC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#567B34]">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#E6AB3C] shrink-0" />
              <span>
                Ces préconisations sont validées par la Chambre d'Agriculture de Béjaïa (CAW) et l'ITAFV de Sidi-Aïch.
              </span>
            </div>

            <a
              href="#fertilisation"
              className="font-bold text-[#31491E] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Voir aussi le Calculateur de Fertilisation Organique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
