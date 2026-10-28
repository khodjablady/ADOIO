import React, { useState, useEffect, useRef } from 'react';
import { 
  BEJAIA_GLOBAL_STATS, 
  BEJAIA_COMMUNES_DATA, 
  BEJAIA_HISTORICAL_PRODUCTION_5Y,
  HistoricalCampaignData,
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
  Info,
  Calendar,
  Sparkles,
  CloudRain,
  Award,
  ArrowUpRight,
  ChevronRight,
  Filter,
  History
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';
import { ArticleAudioReader } from './ArticleAudioReader';

interface AnimatedCounterProps {
  end: number;
  decimals?: number;
  decimalSeparator?: ',' | '.';
  thousandsSeparator?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}

const formatAnimatedValue = (
  value: number,
  decimals: number,
  decimalSeparator: ',' | '.',
  thousandsSeparator: string
): string => {
  const fixed = value.toFixed(decimals);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = thousandsSeparator
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)
    : intPart;
  return decPart !== undefined ? `${formattedInt}${decimalSeparator}${decPart}` : formattedInt;
};

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  decimals = 0,
  decimalSeparator = ',',
  thousandsSeparator = ' ',
  prefix = '',
  suffix = '',
  duration = 1500,
  delay = 0,
  className = '',
}) => {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const previousEndRef = useRef(0);

  useEffect(() => {
    const node = spanRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -24px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEnteredView) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(end);
      previousEndRef.current = end;
      return;
    }

    const startValue = previousEndRef.current;
    const delta = end - startValue;
    if (delta === 0) {
      setDisplayValue(end);
      return;
    }

    let rafId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const isInitialRun = startValue === 0;
    const effectiveDuration = isInitialRun ? duration : Math.min(650, duration);
    const effectiveDelay = isInitialRun ? delay : 0;

    const startAnimation = () => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / effectiveDuration);
        // Ease-out quartic curve for a smooth, natural deceleration
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = startValue + delta * eased;
        setDisplayValue(current);

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setDisplayValue(end);
          previousEndRef.current = end;
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    if (effectiveDelay > 0) {
      timeoutId = setTimeout(startAnimation, effectiveDelay);
    } else {
      startAnimation();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [end, duration, delay, hasEnteredView]);

  const formatted = formatAnimatedValue(displayValue, decimals, decimalSeparator, thousandsSeparator);

  return (
    <span
      ref={spanRef}
      className={`tabular-nums inline-block ${className}`}
      aria-label={`${prefix}${formatAnimatedValue(end, decimals, decimalSeparator, thousandsSeparator)}${suffix}`}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export const StatsAndPotential: React.FC = () => {
  const [selectedCommune, setSelectedCommune] = useState<CommuneStat>(BEJAIA_COMMUNES_DATA[0]);
  const [sortBy, setSortBy] = useState<'production' | 'trees' | 'hectares' | 'mills'>('production');
  const [pillarsInView, setPillarsInView] = useState(false);
  const [modernizationInView, setModernizationInView] = useState(false);
  const pillarsRef = useRef<HTMLDivElement | null>(null);
  const modernizationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setPillarsInView(true);
      setModernizationInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === pillarsRef.current) {
              setPillarsInView(true);
            } else if (entry.target === modernizationRef.current) {
              setModernizationInView(true);
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    if (pillarsRef.current) observer.observe(pillarsRef.current);
    if (modernizationRef.current) observer.observe(modernizationRef.current);

    return () => observer.disconnect();
  }, []);

  // 5-Year Historical Production Recharts State
  const [selectedCampaign, setSelectedCampaign] = useState<HistoricalCampaignData>(
    BEJAIA_HISTORICAL_PRODUCTION_5Y[BEJAIA_HISTORICAL_PRODUCTION_5Y.length - 1]
  );
  const [historyMetric, setHistoryMetric] = useState<'combined' | 'oil' | 'olives' | 'yield' | 'quality'>('combined');

  const total5yOil = BEJAIA_HISTORICAL_PRODUCTION_5Y.reduce((sum, c) => sum + c.oilProductionMillionLiters, 0);
  const avg5yOil = (total5yOil / BEJAIA_HISTORICAL_PRODUCTION_5Y.length).toFixed(1);
  const maxCampaign = [...BEJAIA_HISTORICAL_PRODUCTION_5Y].sort((a, b) => b.oilProductionMillionLiters - a.oilProductionMillionLiters)[0];
  const evStart = BEJAIA_HISTORICAL_PRODUCTION_5Y[0].extraVirginSharePercent;
  const evEnd = BEJAIA_HISTORICAL_PRODUCTION_5Y[BEJAIA_HISTORICAL_PRODUCTION_5Y.length - 1].extraVirginSharePercent;
  const evGrowth = Math.round(((evEnd - evStart) / evStart) * 100);
  const avgYield5y = (
    BEJAIA_HISTORICAL_PRODUCTION_5Y.reduce((sum, c) => sum + c.averageYieldLitersPerQx, 0) /
    BEJAIA_HISTORICAL_PRODUCTION_5Y.length
  ).toFixed(2);

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
          <div className="mt-4">
            <ArticleAudioReader
              sectionId="potential"
              title="Potentialités Oléicoles et Chiffres Clés de la Wilaya de Béjaïa"
              text={() =>
                `Données officielles et potentiel oléicole de la wilaya de Béjaïa. Superficie oléicole totale : 57 400 hectares répartis sur les 52 communes de la wilaya, soit plus de 52 % de la surface agricole arboricole. Le verger compte 5,35 millions d'oliviers dont 4,85 millions d'arbres en plein rapport. Le parc de trituration rassemble 448 huileries actives, dont 192 chaînes modernes en continu (${modernPercent} %) et 256 moulins traditionnels (${tradPercent} %). Béjaïa assure 28,5 % de la production nationale algérienne d'huile d'olive, avec une moyenne quinquennale de ${avg5yOil} millions de litres par campagne et un rendement moyen de ${avgYield5y} litres par quintal. Focus sur la commune sélectionnée (${selectedCommune.commune}, daïra de ${selectedCommune.daira}) : ${selectedCommune.hectares} hectares, ${selectedCommune.treesCount.toLocaleString('fr-FR')} oliviers, ${selectedCommune.millsCount} huileries et une production moyenne de ${selectedCommune.avgProductionLiters.toLocaleString('fr-FR')} litres.`
              }
            />
          </div>
        </div>

        {/* 4 Pillars of Potential */}
        <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <div
            className={`bg-white p-6 rounded-2xl border border-[#E6DEC9] shadow-xs hover:border-[#8CBE5D] hover:shadow-md transition-all duration-700 ${
              pillarsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E] mb-4">
              <Trees className="w-6 h-6 text-[#436229]" />
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6F9D44] font-semibold">
              Superficie Arborée
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#18230F] mt-1">
              <AnimatedCounter
                end={BEJAIA_GLOBAL_STATS.oliveSurfaceHectares}
                decimals={0}
                thousandsSeparator=" "
                duration={1600}
                delay={0}
              />{' '}
              <span className="text-base font-sans font-medium text-[#567B34]">ha</span>
            </div>
            <p className="text-xs text-[#567B34] mt-2">
              Soit plus de 52% de la surface agricole utile (SAU) arboricole de la wilaya.
            </p>
          </div>

          <div
            className={`bg-white p-6 rounded-2xl border border-[#E6DEC9] shadow-xs hover:border-[#8CBE5D] hover:shadow-md transition-all duration-700 delay-100 ${
              pillarsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#FEF5DB] flex items-center justify-center text-[#B47A16] mb-4">
              <Droplet className="w-6 h-6 text-[#E6AB3C]" />
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6F9D44] font-semibold">
              Arbres Productifs
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#18230F] mt-1">
              <AnimatedCounter
                end={BEJAIA_GLOBAL_STATS.productiveTrees / 1000000}
                decimals={2}
                decimalSeparator=","
                thousandsSeparator=""
                duration={1600}
                delay={120}
              />{' '}
              <span className="text-base font-sans font-medium text-[#567B34]">M arbres</span>
            </div>
            <p className="text-xs text-[#567B34] mt-2">
              Sur un total de 5,35 millions d'oliviers, avec 500 000 jeunes plants en cours d'entrée en production.
            </p>
          </div>

          <div
            className={`bg-white p-6 rounded-2xl border border-[#E6DEC9] shadow-xs hover:border-[#8CBE5D] hover:shadow-md transition-all duration-700 delay-200 ${
              pillarsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E] mb-4">
              <Building2 className="w-6 h-6 text-[#436229]" />
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6F9D44] font-semibold">
              Infrastructures de Trituration
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#18230F] mt-1">
              <AnimatedCounter
                end={BEJAIA_GLOBAL_STATS.activeMills}
                decimals={0}
                thousandsSeparator=" "
                duration={1600}
                delay={240}
              />{' '}
              <span className="text-base font-sans font-medium text-[#567B34]">unités</span>
            </div>
            <p className="text-xs text-[#567B34] mt-2">
              192 chaînes modernes continues (43%) et 256 huileries traditionnelles à super-presses (57%).
            </p>
          </div>

          <div
            className={`bg-white p-6 rounded-2xl border border-[#E6DEC9] shadow-xs hover:border-[#8CBE5D] hover:shadow-md transition-all duration-700 delay-300 ${
              pillarsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#FEF5DB] flex items-center justify-center text-[#B47A16] mb-4">
              <TrendingUp className="w-6 h-6 text-[#E6AB3C]" />
            </div>
            <div className="text-xs uppercase tracking-wider text-[#6F9D44] font-semibold">
              Part Nationale
            </div>
            <div className="font-serif text-3xl font-extrabold text-[#18230F] mt-1">
              <AnimatedCounter
                end={BEJAIA_GLOBAL_STATS.shareOfNationalProductionPercent}
                decimals={1}
                decimalSeparator=","
                thousandsSeparator=""
                duration={1600}
                delay={360}
              />{' '}
              <span className="text-base font-sans font-medium text-[#567B34]">%</span>
            </div>
            <p className="text-xs text-[#567B34] mt-2">
              Béjaïa assure près d'un tiers de la production algérienne totale d'huile d'olive chaque campagne.
            </p>
          </div>
        </div>

        {/* 5-Year Historical Production Evolution Chart (Recharts) */}
        <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 lg:p-8 shadow-sm mb-14">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-[#E6DEC9]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1.5">
                <History className="w-4 h-4 text-[#E6AB3C]" />
                <span>Bilan Quinquennal Consolidé (2020 – 2025)</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                Évolution Historique de la Production Oléicole de la Wilaya
              </h3>
              <p className="text-xs sm:text-sm text-[#567B34] mt-1 max-w-3xl leading-relaxed">
                Suivi pluriannuel des campagnes de récolte à Béjaïa : impact des cycles d'alternance biennale kabyle, volumes d'huile extraite, rendements moyens et montée en gamme de l'huile Vierge Extra.
              </p>
            </div>

            {/* Metric Switcher Controls */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E6DEC9]">
              <button
                type="button"
                onClick={() => setHistoryMetric('combined')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  historyMetric === 'combined'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'text-[#31491E] hover:text-[#18230F] hover:bg-white/60'
                }`}
              >
                Vue Combinée
              </button>
              <button
                type="button"
                onClick={() => setHistoryMetric('oil')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  historyMetric === 'oil'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'text-[#31491E] hover:text-[#18230F] hover:bg-white/60'
                }`}
              >
                Volume Huile (M L)
              </button>
              <button
                type="button"
                onClick={() => setHistoryMetric('olives')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  historyMetric === 'olives'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'text-[#31491E] hover:text-[#18230F] hover:bg-white/60'
                }`}
              >
                Olives (Quintaux)
              </button>
              <button
                type="button"
                onClick={() => setHistoryMetric('yield')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  historyMetric === 'yield'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'text-[#31491E] hover:text-[#18230F] hover:bg-white/60'
                }`}
              >
                Rendement (L/qx)
              </button>
              <button
                type="button"
                onClick={() => setHistoryMetric('quality')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  historyMetric === 'quality'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'text-[#31491E] hover:text-[#18230F] hover:bg-white/60'
                }`}
              >
                Vierge Extra (%)
              </button>
            </div>
          </div>

          {/* 4 Quinquennial Macro-Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-[#E6DEC9]">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]/80">
              <span className="text-[11px] uppercase tracking-wider text-[#6F9D44] font-bold block">
                Moyenne Quinquennale
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#18230F]">
                  <AnimatedCounter
                    end={Number(avg5yOil)}
                    decimals={1}
                    decimalSeparator="."
                    thousandsSeparator=""
                    duration={1400}
                    delay={0}
                  />
                </span>
                <span className="text-xs text-[#567B34] font-semibold">M Litres / an</span>
              </div>
              <p className="text-[11px] text-[#567B34] mt-1">
                Total cumulé :{' '}
                <strong>
                  <AnimatedCounter
                    end={total5yOil}
                    decimals={1}
                    decimalSeparator="."
                    thousandsSeparator=" "
                    suffix=" M Litres"
                    duration={1400}
                    delay={60}
                  />
                </strong>
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]/80">
              <span className="text-[11px] uppercase tracking-wider text-[#6F9D44] font-bold block">
                Campagne Record
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#E6AB3C]">
                  <AnimatedCounter
                    end={maxCampaign.oilProductionMillionLiters}
                    decimals={1}
                    decimalSeparator="."
                    thousandsSeparator=""
                    duration={1400}
                    delay={100}
                  />
                </span>
                <span className="text-xs text-[#18230F] font-semibold">M Litres</span>
              </div>
              <p className="text-[11px] text-[#567B34] mt-1">
                Campagne <strong>{maxCampaign.campaign}</strong> (Année On)
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]/80">
              <span className="text-[11px] uppercase tracking-wider text-[#6F9D44] font-bold block">
                Essor Vierge Extra
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#31491E]">
                  <AnimatedCounter
                    end={evGrowth}
                    decimals={0}
                    prefix="+"
                    suffix="%"
                    duration={1400}
                    delay={200}
                  />
                </span>
                <span className="text-xs text-[#567B34] font-semibold">en 5 ans</span>
              </div>
              <p className="text-[11px] text-[#567B34] mt-1">
                De <strong>{evStart}%</strong> en 2020 à <strong>{evEnd}%</strong> en 2025
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]/80">
              <span className="text-[11px] uppercase tracking-wider text-[#6F9D44] font-bold block">
                Rendement Moyen
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-serif text-2xl font-bold text-[#567B34]">
                  <AnimatedCounter
                    end={Number(avgYield5y)}
                    decimals={2}
                    decimalSeparator="."
                    thousandsSeparator=""
                    duration={1400}
                    delay={300}
                  />
                </span>
                <span className="text-xs text-[#567B34] font-semibold">L / quintal</span>
              </div>
              <p className="text-[11px] text-[#567B34] mt-1">
                Min 18.07 L/qx · Max 20.32 L/qx
              </p>
            </div>
          </div>

          {/* Recharts Historical Chart */}
          <div className="pt-6 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-[#18230F] flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-[#31491E] inline-block"></span>
                  {historyMetric === 'combined' && "Production d'Huile (Barres, Millions L) & Rendement Moyen (Courbe or, L/qx)"}
                  {historyMetric === 'oil' && "Volume Total d'Huile d'Olive Produit (Millions de Litres)"}
                  {historyMetric === 'olives' && "Volume d'Olives Récoltées et Triturées (Quintaux)"}
                  {historyMetric === 'yield' && "Rendement d'Extraction Moyen par Quintal (Litres d'Huile / Quintal)"}
                  {historyMetric === 'quality' && "Taux d'Huile Vierge Extra Certifiée (Acidité < 0.8% et < 0.5%)"}
                </span>
              </div>
              <span className="text-[#6F9D44] text-[11px] font-medium">
                Cliquez sur une campagne ou un point pour afficher son analyse agro-climatique
              </span>
            </div>

            <div className="h-72 sm:h-84 md:h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={BEJAIA_HISTORICAL_PRODUCTION_5Y}
                  margin={{ top: 15, right: 25, bottom: 20, left: 10 }}
                  onClick={(e: any) => {
                    if (e && e.activePayload && e.activePayload[0]) {
                      setSelectedCampaign(e.activePayload[0].payload as HistoricalCampaignData);
                    }
                  }}
                >
                  <defs>
                    <linearGradient id="oilBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#31491E" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#567B34" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="oilBarActiveGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E6AB3C" stopOpacity={1} />
                      <stop offset="100%" stopColor="#B47A16" stopOpacity={0.85} />
                    </linearGradient>
                    <linearGradient id="qualityAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8CBE5D" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#8CBE5D" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="olivesBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6F9D44" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#253518" stopOpacity={0.75} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DEC9" vertical={false} />
                  
                  <XAxis
                    dataKey="campaign"
                    stroke="#567B34"
                    tick={{ fill: '#31491E', fontSize: 12, fontWeight: 700 }}
                    tickLine={{ stroke: '#E6DEC9' }}
                    dy={5}
                  />

                  {/* Dynamic Y-Axes based on selected metric */}
                  {historyMetric === 'combined' && (
                    <>
                      <YAxis
                        yAxisId="left"
                        domain={[0, 30]}
                        stroke="#31491E"
                        tick={{ fill: '#31491E', fontSize: 11 }}
                        unit=" M L"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[16, 22]}
                        stroke="#B47A16"
                        tick={{ fill: '#B47A16', fontSize: 11 }}
                        unit=" L/qx"
                      />
                    </>
                  )}

                  {historyMetric === 'oil' && (
                    <YAxis
                      domain={[0, 30]}
                      stroke="#31491E"
                      tick={{ fill: '#31491E', fontSize: 11 }}
                      unit=" M L"
                    />
                  )}

                  {historyMetric === 'olives' && (
                    <YAxis
                      domain={[800000, 1400000]}
                      stroke="#31491E"
                      tick={{ fill: '#31491E', fontSize: 11 }}
                      tickFormatter={(val) => `${(val / 1000).toFixed(0)}k qx`}
                    />
                  )}

                  {historyMetric === 'yield' && (
                    <YAxis
                      domain={[16, 22]}
                      stroke="#31491E"
                      tick={{ fill: '#31491E', fontSize: 11 }}
                      unit=" L/qx"
                    />
                  )}

                  {historyMetric === 'quality' && (
                    <YAxis
                      domain={[15, 60]}
                      stroke="#31491E"
                      tick={{ fill: '#31491E', fontSize: 11 }}
                      unit=" %"
                    />
                  )}

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as HistoricalCampaignData;
                        return (
                          <div className="bg-[#18230F] text-[#FAF7F2] p-4 rounded-2xl shadow-2xl border border-[#8CBE5D]/40 text-xs min-w-[260px] space-y-2.5 z-50">
                            <div className="flex items-center justify-between pb-2 border-b border-white/15">
                              <span className="font-serif font-bold text-sm text-[#E6AB3C]">
                                Campagne {data.campaign}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  data.cycleType === 'on'
                                    ? 'bg-[#567B34] text-white'
                                    : data.cycleType === 'off'
                                    ? 'bg-[#AF4D24] text-white'
                                    : 'bg-[#B47A16] text-white'
                                }`}
                              >
                                {data.cycleType === 'on'
                                  ? 'Année Haute (On)'
                                  : data.cycleType === 'off'
                                  ? 'Année Basse (Off)'
                                  : 'Équilibrée'}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-[#B0D984]">Production Huile :</span>
                                <span className="font-bold text-white text-sm">
                                  {data.oilProductionMillionLiters} Millions L
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-white/80">
                                <span>Volume exact :</span>
                                <span className="font-mono">{data.oilProductionLiters.toLocaleString()} L</span>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-[#B0D984]">Olives triturées :</span>
                                <span className="font-semibold text-white">
                                  {data.olivesCrushedQuintals.toLocaleString()} quintaux
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-[#B0D984]">Rendement moyen :</span>
                                <span className="font-bold text-[#E6AB3C]">
                                  {data.averageYieldLitersPerQx} L / quintal
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-[#B0D984]">Part Vierge Extra :</span>
                                <span className="font-bold text-[#8CBE5D]">
                                  {data.extraVirginSharePercent}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-[#B0D984]">Chaînes modernes :</span>
                                <span className="text-white">
                                  {data.modernMillsActive} / {data.activeMillsCampaign} moulins
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-[#B0D984]">Pluviométrie :</span>
                                <span className="text-white">{data.rainfallMm} mm</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/10 text-[10px] text-white/70 italic leading-snug">
                              « {data.agronomicHighlight} »
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {historyMetric === 'combined' && (
                    <>
                      <ReferenceLine
                        yAxisId="left"
                        y={Number(avg5yOil)}
                        stroke="#AF4D24"
                        strokeDasharray="4 4"
                        label={{
                          value: `Moyenne 5 ans (${avg5yOil} M L)`,
                          fill: '#AF4D24',
                          fontSize: 11,
                          position: 'insideTopLeft'
                        }}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="oilProductionMillionLiters"
                        name="Production d'Huile (M L)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={55}
                      >
                        {BEJAIA_HISTORICAL_PRODUCTION_5Y.map((entry) => (
                          <Cell
                            key={entry.campaign}
                            fill={
                              selectedCampaign.campaign === entry.campaign
                                ? 'url(#oilBarActiveGrad)'
                                : 'url(#oilBarGrad)'
                            }
                            stroke={selectedCampaign.campaign === entry.campaign ? '#B47A16' : '#233416'}
                            strokeWidth={selectedCampaign.campaign === entry.campaign ? 2 : 1}
                            className="cursor-pointer transition-all duration-200"
                          />
                        ))}
                      </Bar>
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="averageYieldLitersPerQx"
                        name="Rendement Moyen (L/qx)"
                        stroke="#E6AB3C"
                        strokeWidth={3}
                        dot={{ r: 5, fill: '#E6AB3C', stroke: '#18230F', strokeWidth: 2 }}
                        activeDot={{ r: 8, fill: '#E6AB3C', stroke: '#FAF7F2', strokeWidth: 2 }}
                      />
                    </>
                  )}

                  {historyMetric === 'oil' && (
                    <>
                      <ReferenceLine
                        y={Number(avg5yOil)}
                        stroke="#AF4D24"
                        strokeDasharray="4 4"
                        label={{
                          value: `Moyenne (${avg5yOil} M L)`,
                          fill: '#AF4D24',
                          fontSize: 11,
                          position: 'insideTopLeft'
                        }}
                      />
                      <Bar
                        dataKey="oilProductionMillionLiters"
                        name="Huile (M Litres)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={60}
                      >
                        {BEJAIA_HISTORICAL_PRODUCTION_5Y.map((entry) => (
                          <Cell
                            key={entry.campaign}
                            fill={
                              selectedCampaign.campaign === entry.campaign
                                ? 'url(#oilBarActiveGrad)'
                                : 'url(#oilBarGrad)'
                            }
                            stroke={selectedCampaign.campaign === entry.campaign ? '#B47A16' : '#233416'}
                            strokeWidth={selectedCampaign.campaign === entry.campaign ? 2 : 1}
                            className="cursor-pointer"
                          />
                        ))}
                      </Bar>
                    </>
                  )}

                  {historyMetric === 'olives' && (
                    <Bar
                      dataKey="olivesCrushedQuintals"
                      name="Olives Récoltées (Quintaux)"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={60}
                    >
                      {BEJAIA_HISTORICAL_PRODUCTION_5Y.map((entry) => (
                        <Cell
                          key={entry.campaign}
                          fill={
                            selectedCampaign.campaign === entry.campaign
                              ? '#E6AB3C'
                              : 'url(#olivesBarGrad)'
                          }
                          className="cursor-pointer"
                        />
                      ))}
                    </Bar>
                  )}

                  {historyMetric === 'yield' && (
                    <Line
                      type="monotone"
                      dataKey="averageYieldLitersPerQx"
                      name="Rendement (L/qx)"
                      stroke="#567B34"
                      strokeWidth={3.5}
                      dot={{ r: 6, fill: '#567B34', stroke: '#18230F', strokeWidth: 2 }}
                      activeDot={{ r: 9, fill: '#E6AB3C', stroke: '#18230F', strokeWidth: 2 }}
                    />
                  )}

                  {historyMetric === 'quality' && (
                    <Area
                      type="monotone"
                      dataKey="extraVirginSharePercent"
                      name="Part Vierge Extra (%)"
                      stroke="#31491E"
                      strokeWidth={3}
                      fill="url(#qualityAreaGrad)"
                      dot={{ r: 5, fill: '#8CBE5D', stroke: '#18230F', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#E6AB3C', stroke: '#18230F', strokeWidth: 2 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Interactive Campaign Deep Dive Inspector Card */}
          <div className="mt-6 pt-6 border-t border-[#E6DEC9]">
            {/* Quick-Pick Campaign Buttons */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <span className="text-xs font-bold text-[#18230F] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#567B34]" />
                <span>Sélectionner une campagne pour inspecter le bilan :</span>
              </span>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {BEJAIA_HISTORICAL_PRODUCTION_5Y.map((camp) => {
                  const isCurrent = selectedCampaign.campaign === camp.campaign;
                  return (
                    <button
                      key={camp.campaign}
                      type="button"
                      onClick={() => setSelectedCampaign(camp)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                        isCurrent
                          ? 'bg-[#233416] text-[#FAF7F2] shadow-sm ring-2 ring-[#E6AB3C]'
                          : 'bg-[#FAF7F2] text-[#31491E] border border-[#E6DEC9] hover:bg-white'
                      }`}
                    >
                      <span>{camp.campaign}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          camp.cycleType === 'on'
                            ? 'bg-[#8CBE5D]'
                            : camp.cycleType === 'off'
                            ? 'bg-[#AF4D24]'
                            : 'bg-[#E6AB3C]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campaign Focused Detail Banner */}
            <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#E6DEC9]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6DEC9]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      Fiche de Campagne
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        selectedCampaign.cycleType === 'on'
                          ? 'bg-[#E8F4D9] text-[#233416]'
                          : selectedCampaign.cycleType === 'off'
                          ? 'bg-[#FAF0EA] text-[#AF4D24]'
                          : 'bg-[#FEF5DB] text-[#B47A16]'
                      }`}
                    >
                      {selectedCampaign.cycleType === 'on'
                        ? 'Année Haute (Alternance Positive)'
                        : selectedCampaign.cycleType === 'off'
                        ? 'Année Basse (Alternance Négative)'
                        : 'Cycle Équilibré'}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                    Campagne Oléicole {selectedCampaign.campaign}
                  </h4>
                  <p className="text-xs text-[#567B34] mt-0.5">
                    Données officielles Wilaya de Béjaïa · {selectedCampaign.modernMillsActive} moulins continus modernes & {selectedCampaign.activeMillsCampaign - selectedCampaign.modernMillsActive} moulins traditionnels
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white px-3.5 py-2 rounded-xl border border-[#E6DEC9] text-right">
                    <span className="text-[10px] text-[#6F9D44] uppercase font-bold block">
                      Pluviométrie annuelle
                    </span>
                    <span className="font-serif text-base font-bold text-[#18230F] flex items-center justify-end gap-1">
                      <CloudRain className="w-3.5 h-3.5 text-[#567B34]" />
                      <AnimatedCounter
                        end={selectedCampaign.rainfallMm}
                        decimals={0}
                        thousandsSeparator=" "
                        suffix=" mm"
                        duration={1200}
                      />
                    </span>
                  </div>
                  <div className="bg-white px-3.5 py-2 rounded-xl border border-[#E6DEC9] text-right">
                    <span className="text-[10px] text-[#6F9D44] uppercase font-bold block">
                      Prix Indicatif Terroir
                    </span>
                    <span className="font-serif text-base font-bold text-[#E6AB3C]">
                      <AnimatedCounter
                        end={selectedCampaign.marketPriceDzdPerLiter}
                        decimals={0}
                        thousandsSeparator=" "
                        suffix=" DZD / L"
                        duration={1200}
                      />
                    </span>
                  </div>
                </div>
              </div>

              {/* Specific campaign highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-4">
                <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
                  <span className="text-[11px] text-[#6F9D44] block">Production d'Huile</span>
                  <span className="font-serif text-lg font-bold text-[#18230F]">
                    <AnimatedCounter
                      end={selectedCampaign.oilProductionMillionLiters}
                      decimals={1}
                      decimalSeparator="."
                      suffix=" M L"
                      duration={1300}
                    />
                  </span>
                  <span className="text-[10px] text-[#567B34] block font-mono">
                    <AnimatedCounter
                      end={selectedCampaign.oilProductionLiters}
                      decimals={0}
                      thousandsSeparator=" "
                      suffix=" L"
                      duration={1300}
                    />
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
                  <span className="text-[11px] text-[#6F9D44] block">Olives Triturées</span>
                  <span className="font-serif text-lg font-bold text-[#18230F]">
                    <AnimatedCounter
                      end={Math.round(selectedCampaign.olivesCrushedQuintals / 1000)}
                      decimals={0}
                      thousandsSeparator=" "
                      suffix="k qx"
                      duration={1300}
                    />
                  </span>
                  <span className="text-[10px] text-[#567B34] block">
                    + {(selectedCampaign.tableOlivesQuintals / 1000).toFixed(0)}k qx table
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
                  <span className="text-[11px] text-[#6F9D44] block">Rendement Moyen</span>
                  <span className="font-serif text-lg font-bold text-[#E6AB3C]">
                    <AnimatedCounter
                      end={selectedCampaign.averageYieldLitersPerQx}
                      decimals={2}
                      decimalSeparator="."
                      suffix=" L/qx"
                      duration={1300}
                    />
                  </span>
                  <span className="text-[10px] text-[#567B34] block">
                    ≈ {(selectedCampaign.averageYieldLitersPerQx * 0.916).toFixed(1)}% en poids
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
                  <span className="text-[11px] text-[#6F9D44] block">Taux Vierge Extra</span>
                  <span className="font-serif text-lg font-bold text-[#31491E]">
                    <AnimatedCounter
                      end={selectedCampaign.extraVirginSharePercent}
                      decimals={0}
                      suffix="%"
                      duration={1300}
                    />
                  </span>
                  <span className="text-[10px] text-[#567B34] block">
                    Acidité &lt; 0.8% certifiée
                  </span>
                </div>
              </div>

              {/* Climate & Agronomic Commentary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#18230F]">
                    <CloudRain className="w-4 h-4 text-[#567B34]" />
                    <span>Contexte Météorologique & Phénologie</span>
                  </div>
                  <p className="text-[#436229] leading-relaxed">
                    {selectedCampaign.climateSummary}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#18230F]">
                    <Award className="w-4 h-4 text-[#E6AB3C]" />
                    <span>Faits Marquants & Vulgarisation ADOIO</span>
                  </div>
                  <p className="text-[#436229] leading-relaxed">
                    {selectedCampaign.agronomicHighlight}
                  </p>
                </div>
              </div>
            </div>
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
                      <AnimatedCounter
                        end={selectedCommune.hectares}
                        decimals={0}
                        thousandsSeparator=" "
                        suffix=" ha"
                        duration={1200}
                      />
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9]">
                    <span className="text-[11px] text-[#6F9D44] block">Oliviers</span>
                    <span className="font-serif text-lg font-bold text-[#18230F]">
                      <AnimatedCounter
                        end={Math.round(selectedCommune.treesCount / 1000)}
                        decimals={0}
                        thousandsSeparator=" "
                        suffix="k arbres"
                        duration={1200}
                      />
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9]">
                    <span className="text-[11px] text-[#6F9D44] block">Huileries</span>
                    <span className="font-serif text-lg font-bold text-[#18230F]">
                      <AnimatedCounter
                        end={selectedCommune.millsCount}
                        decimals={0}
                        thousandsSeparator=" "
                        suffix=" moulins"
                        duration={1200}
                      />
                    </span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-[#E6DEC9]">
                    <span className="text-[11px] text-[#6F9D44] block">Production</span>
                    <span className="font-serif text-lg font-bold text-[#E6AB3C]">
                      <AnimatedCounter
                        end={selectedCommune.avgProductionLiters / 1000000}
                        decimals={2}
                        decimalSeparator="."
                        suffix=" M L"
                        duration={1200}
                      />
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
                    <AnimatedCounter
                      end={(selectedCommune.avgProductionLiters / BEJAIA_GLOBAL_STATS.annualOilProductionLitersMin) * 100}
                      decimals={1}
                      decimalSeparator="."
                      suffix="%"
                      duration={1200}
                    />
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#E6DEC9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#567B34] to-[#E6AB3C] rounded-full transition-all duration-700 ease-out"
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
        <div ref={modernizationRef} className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <span className="text-[#31491E]">
                    <AnimatedCounter
                      end={BEJAIA_GLOBAL_STATS.modernContinuousMills}
                      decimals={0}
                      suffix=" unités ("
                      duration={1500}
                    />
                    <AnimatedCounter
                      end={modernPercent}
                      decimals={0}
                      suffix="%)"
                      duration={1500}
                    />
                  </span>
                </div>
                <div className="w-full h-3 bg-[#E6DEC9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#31491E] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: modernizationInView ? `${modernPercent}%` : '0%' }}
                  ></div>
                </div>
                <p className="text-[11px] text-[#567B34] mt-1">
                  Extraction mécanique à froid régulée (&lt; 27°C), séparation centrifuge instantanée, hygiène inox HACCP.
                </p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#18230F] mb-1">
                  <span>Presses Traditionnelles à Scourtins & Meules</span>
                  <span className="text-[#AF4D24]">
                    <AnimatedCounter
                      end={BEJAIA_GLOBAL_STATS.traditionalMills}
                      decimals={0}
                      suffix=" unités ("
                      duration={1500}
                      delay={150}
                    />
                    <AnimatedCounter
                      end={tradPercent}
                      decimals={0}
                      suffix="%)"
                      duration={1500}
                      delay={150}
                    />
                  </span>
                </div>
                <div className="w-full h-3 bg-[#E6DEC9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#AF4D24] rounded-full transition-all duration-1000 ease-out delay-150"
                    style={{ width: modernizationInView ? `${tradPercent}%` : '0%' }}
                  ></div>
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
