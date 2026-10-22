import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Medal, 
  Sparkles, 
  TrendingUp, 
  Droplet, 
  Filter, 
  Maximize2, 
  CheckCircle2, 
  Layers, 
  ChevronRight, 
  Calendar, 
  Building2, 
  BarChart3, 
  ExternalLink,
  Info,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine
} from 'recharts';
import { 
  HISTORICAL_MEDALS_DATA, 
  TOP_LAUREATE_MILLS, 
  MEDAL_DETAILS, 
  CampaignMedalsHistory,
  LaureateMillAward 
} from '../data/competitionMedalsData';

type ViewMode = 'stacked' | 'category' | 'quality';
type CategoryFilter = 'all' | 'Fruité Vert' | 'Fruité Mûr' | 'Fruité Goût à l\'ancienne';
type MedalFilter = 'all' | 'or' | 'argent' | 'bronze';

export const CompetitionMedalsChartSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('stacked');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedMedalType, setSelectedMedalType] = useState<MedalFilter>('all');
  const [activeCampaignIndex, setActiveCampaignIndex] = useState<number>(HISTORICAL_MEDALS_DATA.length - 1);
  const [inspectedMedal, setInspectedMedal] = useState<'or' | 'argent' | 'bronze' | null>(null);

  const activeCampaign = HISTORICAL_MEDALS_DATA[activeCampaignIndex];

  // Prepare chart data based on active filters
  const chartData = HISTORICAL_MEDALS_DATA.map((item) => {
    if (selectedCategory === 'all') {
      return {
        campaign: item.campaign,
        shortYear: String(item.year),
        or: item.orCount,
        argent: item.argentCount,
        bronze: item.bronzeCount,
        totalMedals: item.totalMedalsAwarded,
        samples: item.totalSamplesSubmitted,
        avgScore: item.averageJuryScore,
        avgAcidity: item.averageAcidityPercent,
        edition: item.edition,
        highlight: item.highlight,
      };
    } else {
      let catData;
      if (selectedCategory === 'Fruité Vert') catData = item.categories.fruiteVert;
      else if (selectedCategory === 'Fruité Mûr') catData = item.categories.fruiteMur;
      else catData = item.categories.goutAncienne;

      return {
        campaign: item.campaign,
        shortYear: String(item.year),
        or: catData.or,
        argent: catData.argent,
        bronze: catData.bronze,
        totalMedals: catData.total,
        avgScore: catData.averageScore,
        avgAcidity: item.averageAcidityPercent,
        samples: item.totalSamplesSubmitted,
        edition: item.edition,
        highlight: item.highlight,
      };
    }
  });

  // Filter laureate mills for the emulation table
  const filteredLaureates = TOP_LAUREATE_MILLS.filter((mill) => {
    const matchesCategory = selectedCategory === 'all' || mill.category === selectedCategory;
    const matchesMedal = selectedMedalType === 'all' || mill.medal === selectedMedalType;
    return matchesCategory && matchesMedal;
  });

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#18230F] text-[#FAF7F2] p-4 rounded-2xl shadow-2xl border border-[#E6AB3C]/40 text-xs max-w-xs space-y-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-white/15">
            <div>
              <span className="font-bold text-sm text-[#FAF7F2] block">{data.campaign}</span>
              <span className="text-[11px] text-[#E6AB3C] font-semibold">{data.edition}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[#E8F4D9]">
              {data.samples} candidats
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center py-1">
            <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-400/30">
              <span className="text-[10px] text-amber-200 font-bold block">Or 🥇</span>
              <span className="text-sm font-extrabold text-amber-300">{data.or}</span>
            </div>
            <div className="bg-slate-400/20 p-2 rounded-xl border border-slate-300/30">
              <span className="text-[10px] text-slate-200 font-bold block">Argent 🥈</span>
              <span className="text-sm font-extrabold text-slate-200">{data.argent}</span>
            </div>
            <div className="bg-amber-800/25 p-2 rounded-xl border border-amber-600/30">
              <span className="text-[10px] text-amber-300 font-bold block">Bronze 🥉</span>
              <span className="text-sm font-extrabold text-amber-400">{data.bronze}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-[#E8F4D9]/80">Score moyen jury COI :</span>
            <span className="font-bold text-[#E6AB3C]">{data.avgScore} / 100</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#E8F4D9]/80">Acidité moyenne :</span>
            <span className="font-bold text-emerald-400">{data.avgAcidity}%</span>
          </div>

          <p className="text-[10px] text-[#E8F4D9]/75 italic pt-1 leading-snug border-t border-white/5">
            « {data.highlight} »
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-16 pt-16 border-t-2 border-[#E6DEC9] space-y-12">
      
      {/* Header of Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
            <Trophy className="w-4 h-4 text-[#E6AB3C]" />
            <span>Palmarès Historique & Émulation Oléicole · Fête de l'Olive (2022 - 2026)</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18230F] tracking-tight">
            Les Médailles Officielles & l'Historique Quinquennal Recharts
          </h3>
          <p className="text-xs sm:text-sm text-[#436229] mt-2 max-w-2xl leading-relaxed">
            Pour stimuler l'émulation entre moulins modernes et pressoirs traditionnels de la wilaya, découvrez les 3 médailles millésimées remises lors de la Fête de l'Olive et l'évolution historique des distinctions décernées par le jury d'experts agréé COI.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-3 rounded-2xl bg-white border border-[#E6DEC9] shadow-xs text-center">
            <span className="text-[10px] text-[#6F9D44] font-bold uppercase tracking-wider block">Médailles 5 ans</span>
            <span className="text-xl sm:text-2xl font-serif font-extrabold text-[#18230F]">120</span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white border border-[#E6DEC9] shadow-xs text-center">
            <span className="text-[10px] text-[#6F9D44] font-bold uppercase tracking-wider block">Progression COI</span>
            <span className="text-xl sm:text-2xl font-serif font-extrabold text-[#567B34]">+6.6%</span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white border border-[#E6DEC9] shadow-xs text-center">
            <span className="text-[10px] text-[#6F9D44] font-bold uppercase tracking-wider block">Acidité Vierge Extra</span>
            <span className="text-xl sm:text-2xl font-serif font-extrabold text-[#AF4D24]">0.18%</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. TRIPTYQUE DES 3 MÉDAILLES OFFICIELLES (OR, ARGENT, BRONZE) */}
      {/* ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-[#E6AB3C]" />
            <h4 className="font-serif text-lg font-bold text-[#18230F]">
              Triptyque des Médailles de la Fête de l'Olive (24ᵉ Édition · 6 avril 2026 - Béjaïa)
            </h4>
          </div>
          <span className="text-xs text-[#567B34] hidden sm:inline">
            Cliquez sur une médaille pour zoomer et voir le cahier d'attribution
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['or', 'argent', 'bronze'] as const).map((type) => {
            const m = MEDAL_DETAILS[type];
            return (
              <div
                key={type}
                role="button"
                tabIndex={0}
                aria-label={`Inspecter la ${m.name} (${m.scoreRange})`}
                onClick={() => setInspectedMedal(type)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setInspectedMedal(type);
                  }
                }}
                className="bg-white rounded-3xl border-2 border-[#18230F] p-6 shadow-[5px_5px_0px_0px_#18230F] relative group hover:-translate-y-1.5 transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                {/* Top badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${m.badgeBg}`}>
                    {m.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-8 h-8 rounded-full bg-[#FAF7F2] group-hover:bg-[#E8F4D9] flex items-center justify-center text-[#18230F] border border-[#E6DEC9] transition-colors"
                    title="Agrandir la médaille"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Medallion Visual Container */}
                <div className="relative py-4 flex items-center justify-center">
                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 group-hover:scale-105 transition-transform duration-300 drop-shadow-xl">
                    <img
                      src={m.svgSrc}
                      alt={`${m.name} – Concours de la meilleure huile d'olive de Béjaïa (${m.scoreRange})`}
                      width={192}
                      height={192}
                      decoding="async"
                      className="w-full h-full object-contain filter group-hover:drop-shadow-[0_12px_20px_rgba(0,0,0,0.3)] transition-all"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Card Information */}
                <div className="mt-4 pt-4 border-t border-[#E6DEC9] space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#18230F]">
                    <span>Palier d'Évaluation :</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E6DEC9]">
                      {m.scoreRange}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#436229] leading-relaxed line-clamp-2">
                    {m.criterion}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-[#567B34]">
                    <span>Acidité : {m.acidityRequired.split('(')[0]}</span>
                    <span className="text-[#AF4D24]">Détails &rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. GRAPHIQUE HISTORIQUE RECHARTS (5 DERNIÈRES ANNÉES)      */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border-2 border-[#18230F] p-6 sm:p-8 shadow-[6px_6px_0px_0px_#18230F]">
        
        {/* Controls Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC9]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#567B34] block">
              Évolution Quinquennale · BarChart & ComposedChart Recharts
            </span>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
              Dynamique des Médailles Décernées par Campagne
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter Pills */}
            <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#E6DEC9] text-xs font-semibold">
              <span className="px-2 text-[11px] text-[#6F9D44] hidden sm:inline">Catégorie :</span>
              {(['all', 'Fruité Vert', 'Fruité Mûr', 'Fruité Goût à l\'ancienne'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg transition-all text-xs cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'text-[#233416] hover:bg-[#E8F4D9]'
                  }`}
                >
                  {cat === 'all' ? 'Toutes Catégories' : cat}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#E6DEC9] text-xs font-semibold">
              <button
                onClick={() => setViewMode('stacked')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'stacked'
                    ? 'bg-[#18230F] text-white shadow-xs'
                    : 'text-[#233416] hover:bg-[#E8F4D9]'
                }`}
                title="Barres empilées Or, Argent, Bronze"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Médailles</span>
              </button>
              <button
                onClick={() => setViewMode('quality')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'quality'
                    ? 'bg-[#18230F] text-white shadow-xs'
                    : 'text-[#233416] hover:bg-[#E8F4D9]'
                }`}
                title="Score jury et acidité"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Score COI</span>
              </button>
            </div>
          </div>
        </div>

        {/* The Recharts Graphic Container */}
        <div className="pt-6 pb-2">
          <div className="h-80 sm:h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'stacked' ? (
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  onClick={(e: any) => {
                    if (e && e.activeTooltipIndex !== undefined) {
                      setActiveCampaignIndex(e.activeTooltipIndex);
                    }
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DEC9" vertical={false} />
                  <XAxis 
                    dataKey="campaign" 
                    tick={{ fill: '#31491E', fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: '#B0A894' }}
                    tickLine={{ stroke: '#B0A894' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    tick={{ fill: '#31491E', fontSize: 11 }}
                    axisLine={{ stroke: '#B0A894' }}
                    tickLine={{ stroke: '#B0A894' }}
                    label={{ value: 'Nombre de Médailles', angle: -90, position: 'insideLeft', fill: '#567B34', fontSize: 11 }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    domain={[75, 95]}
                    tick={{ fill: '#E6AB3C', fontSize: 11 }}
                    axisLine={{ stroke: '#E6AB3C' }}
                    tickLine={{ stroke: '#E6AB3C' }}
                    label={{ value: 'Score Jury COI (/100)', angle: 90, position: 'insideRight', fill: '#E6AB3C', fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontWeight: 600 }}
                  />
                  
                  {/* Stacked Bars for the 3 medals */}
                  <Bar yAxisId="left" dataKey="or" name="Médailles d'Or" stackId="a" fill="#D4AF37" radius={[0, 0, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-or-${index}`} fill="#D4AF37" />
                    ))}
                  </Bar>
                  <Bar yAxisId="left" dataKey="argent" name="Médailles d'Argent" stackId="a" fill="#94A3B8" radius={[0, 0, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-argent-${index}`} fill="#94A3B8" />
                    ))}
                  </Bar>
                  <Bar yAxisId="left" dataKey="bronze" name="Médailles de Bronze" stackId="a" fill="#CD7F32" radius={[6, 6, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-bronze-${index}`} fill="#CD7F32" />
                    ))}
                  </Bar>

                  {/* Average Jury Score Trend Line */}
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="avgScore" 
                    name="Score Moyen Jury COI" 
                    stroke="#18230F" 
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#E6AB3C', stroke: '#18230F', strokeWidth: 2 }}
                    activeDot={{ r: 8, fill: '#FFFFFF', stroke: '#E6AB3C', strokeWidth: 3 }}
                  />
                </ComposedChart>
              ) : (
                <ComposedChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DEC9" vertical={false} />
                  <XAxis 
                    dataKey="campaign" 
                    tick={{ fill: '#31491E', fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: '#B0A894' }}
                  />
                  <YAxis 
                    yAxisId="score"
                    domain={[75, 92]}
                    tick={{ fill: '#18230F', fontSize: 11 }}
                    label={{ value: 'Note Sensorielle COI (/100)', angle: -90, position: 'insideLeft', fill: '#18230F', fontSize: 11 }}
                  />
                  <YAxis 
                    yAxisId="acidity"
                    orientation="right"
                    domain={[0.1, 0.35]}
                    tick={{ fill: '#AF4D24', fontSize: 11 }}
                    label={{ value: 'Acidité Libre Moyenne (%)', angle: 90, position: 'insideRight', fill: '#AF4D24', fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="top" height={36} />

                  <Area 
                    yAxisId="score"
                    type="monotone" 
                    dataKey="avgScore" 
                    name="Progression Qualité Sensorielle (COI)" 
                    fill="#E8F4D9" 
                    stroke="#31491E" 
                    strokeWidth={3}
                  />
                  <Line 
                    yAxisId="acidity"
                    type="monotone" 
                    dataKey="avgAcidity" 
                    name="Baisse Acidité Libre (%)" 
                    stroke="#AF4D24" 
                    strokeWidth={3}
                    strokeDasharray="4 4"
                    dot={{ r: 5, fill: '#AF4D24' }}
                  />
                  <ReferenceLine yAxisId="acidity" y={0.2} stroke="#558B2F" strokeDasharray="3 3" label="Objectif Vierge Extra < 0.2%" />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Selected Campaign Detailed Factsheet */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#18230F] text-white font-bold text-xs">
                {activeCampaign.campaign}
              </span>
              <span className="font-bold text-sm text-[#18230F]">{activeCampaign.edition}</span>
            </div>
            <p className="text-xs text-[#436229]">
              {activeCampaign.highlight}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0">
            <div className="text-right">
              <span className="text-[#6F9D44] block text-[11px]">Candidatures en lice :</span>
              <strong className="text-[#18230F] text-sm">{activeCampaign.totalSamplesSubmitted} huiles</strong>
            </div>
            <div className="h-8 w-px bg-[#E6DEC9]" />
            <div className="text-right">
              <span className="text-[#6F9D44] block text-[11px]">Total médaillées :</span>
              <strong className="text-[#567B34] text-sm">{activeCampaign.totalMedalsAwarded} lots primés</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. TABLEAU D'HONNEUR & ÉMULATION DES HUILERIES LAURÉATES */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC9] mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1">
              <Sparkles className="w-4 h-4 text-[#E6AB3C]" />
              <span>Stimulation de l'Émulation Régionale</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
              Tableau d'Honneur des Moulins & Huileries Primées
            </h4>
            <p className="text-xs text-[#567B34] mt-0.5">
              Ces exploitations modèles hissent l'huile d'olive de Béjaïa au rang des standards internationaux du Conseil Oléicole International.
            </p>
          </div>

          {/* Quick Medal Filter */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs font-semibold text-[#6F9D44] mr-1">Médaille :</span>
            {(['all', 'or', 'argent', 'bronze'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMedalType(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedMedalType === m
                    ? m === 'or'
                      ? 'bg-[#D4AF37] text-white shadow-xs'
                      : m === 'argent'
                      ? 'bg-[#94A3B8] text-white shadow-xs'
                      : m === 'bronze'
                      ? 'bg-[#CD7F32] text-white shadow-xs'
                      : 'bg-[#18230F] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#233416] hover:bg-[#E8F4D9]'
                }`}
              >
                {m === 'all' ? 'Toutes' : m === 'or' ? 'Or 🥇' : m === 'argent' ? 'Argent 🥈' : 'Bronze 🥉'}
              </button>
            ))}
          </div>
        </div>

        {/* Laureate Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLaureates.map((mill) => {
            const medalInfo = MEDAL_DETAILS[mill.medal];
            return (
              <div
                key={mill.id}
                className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] hover:border-[#18230F] transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={medalInfo.svgSrc}
                      alt={medalInfo.name}
                      className="w-12 h-12 shrink-0 drop-shadow-md group-hover:rotate-6 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${medalInfo.badgeBg}`}>
                          {medalInfo.name}
                        </span>
                        <span className="text-[11px] font-semibold text-[#567B34]">
                          {mill.campaign}
                        </span>
                      </div>
                      <h5 className="font-serif font-bold text-sm sm:text-base text-[#18230F] mt-0.5">
                        {mill.millName}
                      </h5>
                      <span className="text-xs text-[#6F9D44] font-medium flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#567B34]" />
                        {mill.commune} · {mill.millType}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#6F9D44] block">Score COI</span>
                    <strong className="text-sm sm:text-base font-extrabold text-[#18230F]">
                      {mill.score} <span className="text-[10px] text-[#6F9D44]">/100</span>
                    </strong>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E6DEC9] text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#436229]">Catégorie : <strong>{mill.category}</strong></span>
                    <span className="text-[#567B34]">Cépage : <strong>{mill.variety}</strong></span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E6DEC9]/60">
                    <span className="text-emerald-700 font-semibold">Acidité libre : {mill.acidity}%</span>
                    <span className="text-slate-600 font-mono">K232 : {mill.k232}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#436229] italic leading-snug">
                  « {mill.juryAppreciation} »
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MODAL INSPECTEUR HAUTE DÉFINITION DE LA MÉDAILLE      */}
      {/* ========================================================= */}
      {inspectedMedal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setInspectedMedal(null)}
        >
          <div 
            className="bg-[#FAF7F2] rounded-3xl border-2 border-[#18230F] shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setInspectedMedal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-neutral-100 border border-[#E6DEC9] text-[#18230F] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {(() => {
              const m = MEDAL_DETAILS[inspectedMedal];
              return (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E]">
                      <Medal className="w-6 h-6 text-[#E6AB3C]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#567B34] block">
                        Spécimen Officiel Gravé · 24ᵉ Fête de l'Olive
                      </span>
                      <h4 className="font-serif text-2xl font-bold text-[#18230F]">
                        {m.name} (Édition du 6 avril 2026 - Béjaïa)
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-[#E6DEC9] shadow-inner">
                      <div className="w-56 h-56 drop-shadow-2xl">
                        <img
                          src={m.svgSrc}
                          alt={m.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-[10px] text-[#6F9D44] font-mono mt-3">
                        Gravure monétaire officielle ADOIO-BEJAIA
                      </span>
                    </div>

                    <div className="space-y-3 text-xs text-[#242A20]">
                      <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
                        <strong className="text-[#18230F] block mb-1">Palier d'attribution :</strong>
                        <span className="text-sm font-bold text-[#567B34]">{m.scoreRange}</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
                        <strong className="text-[#18230F] block mb-1">Critère Sensoriel :</strong>
                        <p className="text-[11px] text-[#436229] leading-relaxed">{m.criterion}</p>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-[#E6DEC9] space-y-1">
                        <strong className="text-[#18230F] block">Exigences Physico-Chimiques :</strong>
                        <p className="text-[11px] text-[#567B34]">{m.acidityRequired}</p>
                        <p className="text-[11px] text-[#567B34]">{m.peroxideRequired}</p>
                        <p className="text-[11px] text-[#567B34]">{m.polyfenols}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#E8F4D9] text-[#233416] text-[11px]">
                        <strong>Privilège Lauréat :</strong> {m.prestigeBonus}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setInspectedMedal(null)}
                      className="px-5 py-2.5 rounded-xl bg-[#18230F] text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Fermer l'Aperçu
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
};
