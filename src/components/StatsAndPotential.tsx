import React, { useState } from 'react';
import { 
  BEJAIA_GLOBAL_STATS, 
  BEJAIA_COMMUNES_DATA, 
  CommuneStat 
} from '../data/bejaiaOliveData';
import { 
  Layers, 
  BarChart3, 
  Trees, 
  Building2, 
  Droplet, 
  MapPin, 
  TrendingUp, 
  CheckCircle2,
  Info
} from 'lucide-react';

export const StatsAndPotential: React.FC = () => {
  const [selectedCommune, setSelectedCommune] = useState<CommuneStat>(BEJAIA_COMMUNES_DATA[0]);
  const [sortBy, setSortBy] = useState<'production' | 'trees' | 'hectares' | 'mills'>('production');

  const sortedCommunes = [...BEJAIA_COMMUNES_DATA].sort((a, b) => {
    if (sortBy === 'production') return b.avgProductionLiters - a.avgProductionLiters;
    if (sortBy === 'trees') return b.treesCount - a.treesCount;
    if (sortBy === 'hectares') return b.hectares - a.hectares;
    if (sortBy === 'mills') return b.millsCount - a.millsCount;
    return 0;
  });

  const modernPercent = Math.round(
    (BEJAIA_GLOBAL_STATS.modernContinuousMills / BEJAIA_GLOBAL_STATS.activeMills) * 100
  );
  const tradPercent = 100 - modernPercent;

  return (
    <section id="potential" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
            <Layers className="w-4 h-4 text-[#E6AB3C]" />
            <span>Données Officielles & Statistiques Agricoles</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
            Potentialités Oléicoles de la Wilaya de Béjaïa
          </h2>
          <p className="mt-3 text-base text-[#436229] leading-relaxed">
            Première région productrice d'huile d'olive en Algérie, Béjaïa conjugue un relief montagneux généreux, un microclimat méditerranéen tempéré et une tradition oléicole millénaire portée par la vallée de la Soummam.
          </p>
        </div>

        {/* 4 Pillars of Potential */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC9] shadow-xs hover:border-[#8CBE5D] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E] mb-4">
              <Trees className="w-6 h-6 text-[#436229]" />
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6F9D44] font-semibold">
              Superficie Arborée
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#18230F] mt-1">
              57 400 <span className="text-base font-sans font-medium text-[#567B34]">ha</span>
            </div>
            <p className="text-xs text-[#567B34] mt-2">
              Soit plus de 52% de la surface agricole utile (SAU) arboricole de la wilaya.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC9] shadow-xs hover:border-[#8CBE5D] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FEF5DB] flex items-center justify-center text-[#B47A16] mb-4">
              <Droplet className="w-6 h-6 text-[#E6AB3C]" />
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6F9D44] font-semibold">
              Arbres Productifs
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#18230F] mt-1">
              4,85 <span className="text-base font-sans font-medium text-[#567B34]">M arbres</span>
            </div>
            <p className="text-xs text-[#567B34] mt-2">
              Sur un total de 5,35 millions d'oliviers, avec 500 000 jeunes plants en cours d'entrée en production.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC9] shadow-xs hover:border-[#8CBE5D] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E] mb-4">
              <Building2 className="w-6 h-6 text-[#436229]" />
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6F9D44] font-semibold">
              Infrastructures de Trituration
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#18230F] mt-1">
              448 <span className="text-base font-sans font-medium text-[#567B34]">unités</span>
            </div>
            <p className="text-xs text-[#567B34] mt-2">
              192 chaînes modernes continues (43%) et 256 huileries traditionnelles à super-presses (57%).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E6DEC9] shadow-xs hover:border-[#8CBE5D] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FEF5DB] flex items-center justify-center text-[#B47A16] mb-4">
              <TrendingUp className="w-6 h-6 text-[#E6AB3C]" />
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6F9D44] font-semibold">
              Part Nationale
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#18230F] mt-1">
              28,5 <span className="text-base font-sans font-medium text-[#567B34]">%</span>
            </div>
            <p className="text-xs text-[#567B34] mt-2">
              Béjaïa assure près d'un tiers de la production algérienne totale d'huile d'olive chaque campagne.
            </p>
          </div>
        </div>

        {/* Interactive Communes Explorer & Detailed Panel */}
        <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 lg:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#E6DEC9]">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                Cartographie des Bassins Oléicoles de Béjaïa
              </h3>
              <p className="text-xs sm:text-sm text-[#567B34] mt-1">
                Explorez les statistiques détaillées par commune : oliveraies, huileries et volumes moyens.
              </p>
            </div>

            {/* Sorting controls */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6F9D44] font-medium hidden sm:inline">Classer par :</span>
              <div className="flex bg-[#F4EEE1] p-1 rounded-lg">
                <button
                  onClick={() => setSortBy('production')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    sortBy === 'production' ? 'bg-[#31491E] text-white shadow-xs' : 'text-[#31491E] hover:text-[#18230F]'
                  }`}
                >
                  Production
                </button>
                <button
                  onClick={() => setSortBy('hectares')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    sortBy === 'hectares' ? 'bg-[#31491E] text-white shadow-xs' : 'text-[#31491E] hover:text-[#18230F]'
                  }`}
                >
                  Superficie
                </button>
                <button
                  onClick={() => setSortBy('mills')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    sortBy === 'mills' ? 'bg-[#31491E] text-white shadow-xs' : 'text-[#31491E] hover:text-[#18230F]'
                  }`}
                >
                  Huileries
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            {/* Left list of communes */}
            <div className="lg:col-span-5 space-y-2 max-h-[460px] overflow-y-auto pr-2">
              {sortedCommunes.map((c) => {
                const isSelected = selectedCommune.commune === c.commune;
                return (
                  <button
                    key={c.commune}
                    onClick={() => setSelectedCommune(c)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#233416] text-[#FAF7F2] border-[#233416] shadow-sm'
                        : 'bg-[#FAF7F2] text-[#242A20] border-[#E6DEC9] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{c.commune}</span>
                        <span className={`text-[11px] ${isSelected ? 'text-[#E6AB3C]' : 'text-[#6F9D44]'}`}>
                          Daïra de {c.daira}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs mt-1 opacity-80">
                        <span>{c.hectares.toLocaleString()} ha</span>
                        <span>·</span>
                        <span>{c.millsCount} huileries</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono text-xs font-bold block ${isSelected ? 'text-[#E6AB3C]' : 'text-[#31491E]'}`}>
                        {(c.avgProductionLiters / 1000000).toFixed(2)} M L
                      </span>
                      <span className="text-[10px] opacity-70">huile/an</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right selected commune detail card */}
            <div className="lg:col-span-7 bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6DEC9] flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC9]">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Fiche Territoriale
                    </div>
                    <h4 className="font-serif text-2xl font-bold text-[#18230F]">
                      Commune de {selectedCommune.commune}
                    </h4>
                    <p className="text-xs text-[#567B34]">
                      Bassin oléicole de la Daïra de {selectedCommune.daira} · Wilaya de Béjaïa
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-[#E8F4D9] text-[#233416] text-xs font-bold inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#567B34]" />
                      Bassin Majeur
                    </span>
                  </div>
                </div>

                {/* Quantitative metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9]">
                    <span className="text-[11px] text-[#6F9D44] block">Superficie</span>
                    <span className="font-serif text-lg font-bold text-[#18230F]">
                      {selectedCommune.hectares.toLocaleString()} ha
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9]">
                    <span className="text-[11px] text-[#6F9D44] block">Oliviers</span>
                    <span className="font-serif text-lg font-bold text-[#18230F]">
                      {(selectedCommune.treesCount / 1000).toFixed(0)}k arbres
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9]">
                    <span className="text-[11px] text-[#6F9D44] block">Huileries</span>
                    <span className="font-serif text-lg font-bold text-[#18230F]">
                      {selectedCommune.millsCount} moulins
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9]">
                    <span className="text-[11px] text-[#6F9D44] block">Production</span>
                    <span className="font-serif text-lg font-bold text-[#E6AB3C]">
                      {(selectedCommune.avgProductionLiters / 1000000).toFixed(2)} M L
                    </span>
                  </div>
                </div>

                {/* Dominant Varieties & Character */}
                <div className="bg-white p-4 rounded-xl border border-[#E6DEC9] space-y-2">
                  <span className="text-xs font-bold text-[#18230F] block">
                    Variétés phares cultivées dans cette zone :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCommune.mainVarieties.map((v) => (
                      <span
                        key={v}
                        className="px-2.5 py-1 rounded bg-[#E8F4D9] text-[#233416] text-xs font-semibold"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specific commentary */}
                <div className="text-xs text-[#436229] leading-relaxed flex items-start gap-2 bg-[#FAF7F2] p-3 rounded-lg border border-[#E6DEC9]">
                  <Info className="w-4 h-4 text-[#8CBE5D] shrink-0 mt-0.5" />
                  <span>
                    La commune de <strong>{selectedCommune.commune}</strong> bénéficie d'un ensoleillement optimal et d'une tradition de cueillette soignée. Ses huiles sont reconnues pour leur robe vert doré et leur nez d'herbe fraîche coupée et d'artichaut.
                  </span>
                </div>
              </div>

              {/* Progress bar representing share */}
              <div className="mt-6 pt-4 border-t border-[#E6DEC9]">
                <div className="flex justify-between text-xs text-[#567B34] mb-1.5 font-medium">
                  <span>Part dans la production de la wilaya</span>
                  <span className="font-bold text-[#18230F]">
                    {((selectedCommune.avgProductionLiters / BEJAIA_GLOBAL_STATS.annualOilProductionLitersMin) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#E6DEC9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#567B34] to-[#E6AB3C] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (selectedCommune.avgProductionLiters / BEJAIA_GLOBAL_STATS.annualOilProductionLitersMin) * 100 * 3
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Industrial Modernization vs Tradition Analysis */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC9] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E8F4D9] flex items-center justify-center text-[#31491E]">
                <BarChart3 className="w-5 h-5 text-[#436229]" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#18230F]">
                  Transition Technologique des Huileries
                </h3>
                <p className="text-xs text-[#567B34]">Répartition des 448 moulins en activité</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#18230F] mb-1">
                  <span>Systèmes Continus Modernes (2 et 3 phases)</span>
                  <span className="text-[#31491E]">192 unités ({modernPercent}%)</span>
                </div>
                <div className="w-full h-3 bg-[#E6DEC9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#31491E]" style={{ width: `${modernPercent}%` }}></div>
                </div>
                <p className="text-[11px] text-[#567B34] mt-1">
                  Extraction mécanique à froid régulée (&lt; 27°C), séparation centrifuge instantanée, hygiène inox HACCP.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#18230F] mb-1">
                  <span>Presses Traditionnelles à Scourtins & Meules</span>
                  <span className="text-[#AF4D24]">256 unités ({tradPercent}%)</span>
                </div>
                <div className="w-full h-3 bg-[#E6DEC9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#AF4D24]" style={{ width: `${tradPercent}%` }}></div>
                </div>
                <p className="text-[11px] text-[#567B34] mt-1">
                  Maintien du patrimoine artisanal de village, production d'huiles au fruité mûr très appréciées localement.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E6DEC9] text-xs text-[#31491E]">
              <strong>Objectif ADOIO :</strong> Encourager la mise à niveau des huileries traditionnelles vers le système continu 2 phases afin de supprimer les rejets d'eau et garantir une acidité &lt; 0.5%.
            </div>
          </div>

          {/* Terroir & Climate asset */}
          <div className="bg-gradient-to-br from-[#233416] to-[#18230F] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#8CBE5D]/30 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6AB3C]/20 flex items-center justify-center text-[#E6AB3C]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FAF7F2]">
                  Le Terroir Soummam - Babors
                </h3>
                <p className="text-xs text-[#B0D984]">Pourquoi l'huile de Béjaïa est-elle si singulière ?</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#E8F4D9]/90 leading-relaxed">
              La wilaya de Béjaïa offre une configuration géographique idéale : la vallée de l'Oued Soummam agit comme un régulateur thermique naturel entre la Méditerranée et les massifs du Djurdjura et des Babors.
            </p>

            <ul className="space-y-2.5 text-xs text-[#E8F4D9]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E6AB3C] shrink-0 mt-0.5" />
                <span><strong>Altitude échelonnée (0m à 1200m) :</strong> Permet d'étaler la maturité des olives de novembre à février et de préserver les antioxydants.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E6AB3C] shrink-0 mt-0.5" />
                <span><strong>Sols calcaires et schisteux drainants :</strong> Concentration aromatique des fruits et limitation du stress hydrique estival.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E6AB3C] shrink-0 mt-0.5" />
                <span><strong>Vigueur de la variété Chemlal :</strong> Parfaitement acclimatée depuis des siècles, résistant au froid hivernal et aux fortes chaleurs.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
