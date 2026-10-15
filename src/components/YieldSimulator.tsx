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
  RefreshCw
} from 'lucide-react';

export const YieldSimulator: React.FC = () => {
  const [inputMode, setInputMode] = useState<'weight' | 'trees'>('weight');
  const [weightKg, setWeightKg] = useState<number>(500); // 5 quintaux
  const [treeCount, setTreeCount] = useState<number>(30);
  const [kgPerTree, setKgPerTree] = useState<number>(25);

  const [selectedVariety, setSelectedVariety] = useState<string>('chemlal');
  const [harvestPeriod, setHarvestPeriod] = useState<'early' | 'mid' | 'late'>('mid');
  const [extractionType, setExtractionType] = useState<'modern' | 'traditional'>('modern');
  const [delayHours, setDelayHours] = useState<'fast' | 'medium' | 'slow'>('fast');

  // Compute total olive weight
  const totalWeight = inputMode === 'weight' ? weightKg : treeCount * kgPerTree;
  const totalQuintals = totalWeight / 100;

  // Base yields by variety (liters per quintal)
  const varietyBaseYields: Record<string, number> = {
    chemlal: 20.5,
    bouchouk: 18.0,
    aberkane: 19.5,
    limli: 19.0,
    assemblage: 19.8,
  };

  // Modifier by harvest period
  const periodYieldFactor = {
    early: 0.85, // ~17 L/qx (early green)
    mid: 1.0,    // ~20.5 L/qx (optimum)
    late: 1.12,  // ~23 L/qx (black mature)
  }[harvestPeriod];

  // Modifier by extraction technology
  const techYieldFactor = extractionType === 'modern' ? 1.02 : 0.96;

  // Final estimated yield in Liters per quintal
  const finalYieldPerQuintal = (varietyBaseYields[selectedVariety] || 20) * periodYieldFactor * techYieldFactor;
  
  // Total estimated oil in Liters
  const estimatedOilLiters = Math.round(totalQuintals * finalYieldPerQuintal);

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

  return (
    <section id="simulateur" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
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

            {/* Variety Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#18230F] block">
                Variété principale :
              </label>
              <select
                value={selectedVariety}
                onChange={(e) => setSelectedVariety(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-medium"
              >
                <option value="chemlal">Chemlal de Kabylie (Rendement élevé 20-24%)</option>
                <option value="bouchouk">Bouchouk El Ghalia (Fruité fin 17-20%)</option>
                <option value="aberkane">Aberkane Noire (Rond & Velouté 19-23%)</option>
                <option value="limli">Limli de la Haute-Soummam (Herbacé vif 18-22%)</option>
                <option value="assemblage">Assemblage Traditionnel Kabyle (Moyenne 20%)</option>
              </select>
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
                <h3 className="font-serif text-xl font-bold">Résultats Prévisionnels</h3>
              </div>
              <span className="text-[11px] font-mono text-[#B0D984]">
                {totalWeight} kg d'olives
              </span>
            </div>

            {/* Liters produced */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#B0D984] font-medium block">
                Production d'Huile Estimée
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
              <div className="font-serif text-2xl font-bold text-[#FAF7F2] mt-1">
                {estimatedValueDZD.toLocaleString()} <span className="text-sm font-sans font-medium text-[#E6AB3C]">DZD</span>
              </div>
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
      </div>
    </section>
  );
};
