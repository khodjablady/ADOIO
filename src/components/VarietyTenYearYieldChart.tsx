import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { OliveVariety } from '../data/bejaiaOliveData';
import { TrendingUp, Calendar, Droplets, Sliders, Info } from 'lucide-react';

export type PrecocityProfileId =
  | 'varietes-comparees'
  | 'tres-precoce'
  | 'precoce'
  | 'mi-saison'
  | 'tardive-montagne';

export interface PrecocityProfileConfig {
  id: Exclude<PrecocityProfileId, 'varietes-comparees'>;
  label: string;
  shortLabel: string;
  harvestMonths: string;
  firstBearingYear: number;
  fullMaturityYear: number;
  alternanceAmplitude: number; // 0 to 1
  description: string;
  typicalVarieties: string;
  baseCurveKgPerTree: number[]; // Years 1 to 10
}

export const PRECOCITY_PROFILES: Record<
  Exclude<PrecocityProfileId, 'varietes-comparees'>,
  PrecocityProfileConfig
> = {
  'tres-precoce': {
    id: 'tres-precoce',
    label: 'Très Précoce (Octobre – Novembre)',
    shortLabel: 'Très Précoce (Oct–Nov)',
    harvestMonths: 'Octobre – Novembre',
    firstBearingYear: 2,
    fullMaturityYear: 6,
    alternanceAmplitude: 0.14,
    description:
      'Mise à fruit rapide dès la 2ᵉ–3ᵉ année. La récolte automnale précoce libère tôt les réserves de l’arbre, limitant fortement l’alternance bisannuelle.',
    typicalVarieties: 'Azeradj, cultivars intensifs précoces',
    baseCurveKgPerTree: [0, 3.5, 9.5, 17, 25, 32, 36, 39, 41, 43],
  },
  precoce: {
    id: 'precoce',
    label: 'Précoce à Mi-saison (Octobre – Décembre)',
    shortLabel: 'Précoce (Oct–Déc)',
    harvestMonths: 'Fin Octobre – Mi-Décembre',
    firstBearingYear: 3,
    fullMaturityYear: 7,
    alternanceAmplitude: 0.18,
    description:
      'Entrée en production franche à la 3ᵉ année avec une montée en charge régulière et un haut rendement en huile dès novembre.',
    typicalVarieties: 'Bouchouk de Soummam, Limli (Sidi-Aïch)',
    baseCurveKgPerTree: [0, 2.0, 7.5, 14.5, 22, 29, 34, 37.5, 40, 42],
  },
  'mi-saison': {
    id: 'mi-saison',
    label: 'Mi-saison à Tardive (Novembre – Janvier)',
    shortLabel: 'Mi-saison (Nov–Janv)',
    harvestMonths: 'Mi-Novembre – Janvier',
    firstBearingYear: 3,
    fullMaturityYear: 8,
    alternanceAmplitude: 0.28,
    description:
      'Enracinement profond durant les 3 premières années avant une forte expansion de la frondaison. Sensible à l’alternance ON/OFF si la récolte dépasse décembre.',
    typicalVarieties: 'Chemlal de Kabylie, Sigoise',
    baseCurveKgPerTree: [0, 1.0, 5.0, 11.5, 19, 27, 33, 38, 41.5, 44],
  },
  'tardive-montagne': {
    id: 'tardive-montagne',
    label: 'Tardive de Montagne (Décembre – Février)',
    shortLabel: 'Tardive (Déc–Fév)',
    harvestMonths: 'Décembre – Février',
    firstBearingYear: 4,
    fullMaturityYear: 9,
    alternanceAmplitude: 0.34,
    description:
      'Phase juvénile plus longue adaptée aux étages froids d’altitude (500–1 000 m). Production rustique mais marquée par le cycle bisannuel en récolte hivernale.',
    typicalVarieties: 'Aberkane (Babors & Djurdjura)',
    baseCurveKgPerTree: [0, 0.5, 3.2, 8.5, 15, 22.5, 29, 34.5, 38.5, 41],
  },
};

const VARIETY_TO_PRECOCITY: Record<string, Exclude<PrecocityProfileId, 'varietes-comparees'>> = {
  azeradj: 'tres-precoce',
  bouchouk: 'precoce',
  limli: 'precoce',
  chemlal: 'mi-saison',
  autres: 'mi-saison',
  aberkane: 'tardive-montagne',
};

const VARIETY_OIL_YIELD_AVG: Record<string, number> = {
  azeradj: 0.225, // 22.5%
  bouchouk: 0.225, // 22.5%
  limli: 0.2, // 20.0%
  chemlal: 0.18, // 18.0%
  aberkane: 0.21, // 21.0%
  autres: 0.2, // 20.0%
};

export interface YearlyYieldPoint {
  year: number;
  valueA: number;
  valueB: number;
  valueRef?: number;
  kgA: number;
  kgB: number;
  litersA: number;
  litersB: number;
}

interface VarietyTenYearYieldChartProps {
  varietyA: OliveVariety;
  varietyB: OliveVariety;
}

export const VarietyTenYearYieldChart: React.FC<VarietyTenYearYieldChartProps> = ({
  varietyA,
  varietyB,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedPrecocity, setSelectedPrecocity] =
    useState<PrecocityProfileId>('varietes-comparees');
  const [unitMode, setUnitMode] = useState<'liters_oil' | 'kg_olives'>('liters_oil');
  const [includeAlternance, setIncludeAlternance] = useState<boolean>(true);
  const [hoveredYear, setHoveredYear] = useState<number>(7);
  const [containerWidth, setContainerWidth] = useState<number>(760);

  // Observe container width for responsive D3 rendering
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const w = el.getBoundingClientRect().width;
      if (w > 240) setContainerWidth(Math.floor(w));
    };

    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const precocityKeyA = VARIETY_TO_PRECOCITY[varietyA.id] || 'mi-saison';
  const precocityKeyB = VARIETY_TO_PRECOCITY[varietyB.id] || 'tres-precoce';

  const profileA = PRECOCITY_PROFILES[precocityKeyA];
  const profileB = PRECOCITY_PROFILES[precocityKeyB];
  const activeCustomProfile =
    selectedPrecocity !== 'varietes-comparees'
      ? PRECOCITY_PROFILES[selectedPrecocity]
      : null;

  // Build 10-year series for Variety A, Variety B, and optional selected precocity simulation
  const chartData: YearlyYieldPoint[] = useMemo(() => {
    const oilRateA = VARIETY_OIL_YIELD_AVG[varietyA.id] || 0.19;
    const oilRateB = VARIETY_OIL_YIELD_AVG[varietyB.id] || 0.21;

    // When a specific precocity is chosen by the user, we modulate harvest timing effect
    const precocityHarvestMultiplier = (
      baseProfile: PrecocityProfileConfig,
      overrideProfile: PrecocityProfileConfig | null,
      yearIdx: number
    ) => {
      const effectiveProfile = overrideProfile || baseProfile;
      const baseKg = effectiveProfile.baseCurveKgPerTree[yearIdx];
      const year = yearIdx + 1;

      if (!includeAlternance || year < 5) {
        return baseKg;
      }

      // Biennial bearing oscillation (ON in odd mature years, OFF in even mature years)
      const sign = year % 2 === 1 ? 1 : -1;
      const amp = effectiveProfile.alternanceAmplitude;
      return Math.max(0, Number((baseKg * (1 + sign * amp * 0.65)).toFixed(2)));
    };

    return Array.from({ length: 10 }, (_, idx) => {
      const year = idx + 1;

      // If user selects a specific precocity regime, we show how Variety A and Variety B behave under that regime vs their natural precocity
      const kgA =
        selectedPrecocity === 'varietes-comparees'
          ? precocityHarvestMultiplier(profileA, null, idx)
          : Number(
              (
                precocityHarvestMultiplier(profileA, activeCustomProfile, idx) *
                (0.92 + oilRateA * 0.4)
              ).toFixed(2)
            );

      const kgB =
        selectedPrecocity === 'varietes-comparees'
          ? precocityHarvestMultiplier(profileB, null, idx)
          : Number(
              (
                precocityHarvestMultiplier(profileB, activeCustomProfile, idx) *
                (0.92 + oilRateB * 0.4)
              ).toFixed(2)
            );

      // Harvest date also slightly shifts oil extraction percentage (early = slightly lower % oil but higher polyphenols; late = slightly higher apparent oil %)
      const precocityOilFactor =
        selectedPrecocity === 'tres-precoce'
          ? 0.94
          : selectedPrecocity === 'precoce'
          ? 0.98
          : selectedPrecocity === 'tardive-montagne'
          ? 1.04
          : 1.0;

      const litersA = Number((kgA * oilRateA * precocityOilFactor).toFixed(2));
      const litersB = Number((kgB * oilRateB * precocityOilFactor).toFixed(2));

      const valueA = unitMode === 'liters_oil' ? litersA : kgA;
      const valueB = unitMode === 'liters_oil' ? litersB : kgB;

      let valueRef: number | undefined;
      if (activeCustomProfile) {
        const refKg = precocityHarvestMultiplier(activeCustomProfile, null, idx);
        valueRef =
          unitMode === 'liters_oil'
            ? Number((refKg * 0.205 * precocityOilFactor).toFixed(2))
            : refKg;
      }

      return {
        year,
        valueA,
        valueB,
        valueRef,
        kgA,
        kgB,
        litersA,
        litersB,
      };
    });
  }, [
    varietyA.id,
    varietyB.id,
    profileA,
    profileB,
    selectedPrecocity,
    activeCustomProfile,
    unitMode,
    includeAlternance,
  ]);

  // Cumulative 10-year metrics
  const cumulativeStats = useMemo(() => {
    const totalLitersA = chartData.reduce((acc, d) => acc + d.litersA, 0);
    const totalLitersB = chartData.reduce((acc, d) => acc + d.litersB, 0);
    const totalKgA = chartData.reduce((acc, d) => acc + d.kgA, 0);
    const totalKgB = chartData.reduce((acc, d) => acc + d.kgB, 0);
    return {
      totalLitersA: totalLitersA.toFixed(1),
      totalLitersB: totalLitersB.toFixed(1),
      totalKgA: Math.round(totalKgA),
      totalKgB: Math.round(totalKgB),
    };
  }, [chartData]);

  const activePoint =
    chartData.find((d) => d.year === hoveredYear) || chartData[6];

  // D3 Rendering Effect
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const isCompact = containerWidth < 540;
    const height = isCompact ? 300 : 350;
    const margin = {
      top: 28,
      right: isCompact ? 18 : 30,
      bottom: 44,
      left: isCompact ? 42 : 54,
    };

    const innerWidth = Math.max(180, containerWidth - margin.left - margin.right);
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${containerWidth} ${height}`);

    const defs = svg.append('defs');

    // Area Gradient for Variety A (#E6AB3C)
    const gradA = defs
      .append('linearGradient')
      .attr('id', 'd3-yield-grad-a')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    gradA.append('stop').attr('offset', '0%').attr('stop-color', '#E6AB3C').attr('stop-opacity', 0.28);
    gradA.append('stop').attr('offset', '100%').attr('stop-color', '#E6AB3C').attr('stop-opacity', 0.02);

    // Area Gradient for Variety B (#436229)
    const gradB = defs
      .append('linearGradient')
      .attr('id', 'd3-yield-grad-b')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    gradB.append('stop').attr('offset', '0%').attr('stop-color', '#567B34').attr('stop-opacity', 0.24);
    gradB.append('stop').attr('offset', '100%').attr('stop-color', '#567B34').attr('stop-opacity', 0.02);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([1, 10])
      .range([0, innerWidth]);

    const maxVal =
      d3.max(chartData, (d) =>
        Math.max(d.valueA, d.valueB, d.valueRef ?? 0)
      ) || 10;

    const yScale = d3
      .scaleLinear()
      .domain([0, maxVal * 1.16])
      .nice()
      .range([innerHeight, 0]);

    // Agronomic phase background bands
    const phases = [
      {
        start: 1,
        end: 2.5,
        label: isCompact ? 'Juvénile' : '1–2 ans : Phase juvénile',
        color: '#F4EEE1',
      },
      {
        start: 2.5,
        end: 5.5,
        label: isCompact ? 'Entrée prod.' : '3–5 ans : Entrée en production',
        color: '#FAF7F2',
      },
      {
        start: 5.5,
        end: 10,
        label: isCompact ? 'Pleine prod.' : '6–10 ans : Verger adulte & cycle ON/OFF',
        color: '#F2F7EC',
      },
    ];

    phases.forEach((p) => {
      const x1 = xScale(p.start);
      const x2 = xScale(p.end);
      g.append('rect')
        .attr('x', x1)
        .attr('y', 0)
        .attr('width', Math.max(0, x2 - x1))
        .attr('height', innerHeight)
        .attr('fill', p.color)
        .attr('opacity', 0.65);

      g.append('text')
        .attr('x', x1 + (x2 - x1) / 2)
        .attr('y', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#567B34')
        .attr('font-size', isCompact ? '9px' : '10px')
        .attr('font-weight', '600')
        .text(p.label);
    });

    // Horizontal gridlines
    const yTicks = yScale.ticks(5);
    yTicks.forEach((tickVal) => {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(tickVal))
        .attr('y2', yScale(tickVal))
        .attr('stroke', '#E6DEC9')
        .attr('stroke-dasharray', tickVal === 0 ? 'none' : '3,3')
        .attr('stroke-width', 1);
    });

    // Axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(10)
      .tickFormat((d) => (isCompact ? `A${d}` : `Année ${d}`));

    const yUnitSuffix = unitMode === 'liters_oil' ? ' L' : ' kg';
    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => `${d}${yUnitSuffix}`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((axisG) => {
        axisG.select('.domain').attr('stroke', '#C7B299');
        axisG.selectAll('line').attr('stroke', '#C7B299');
        axisG
          .selectAll('text')
          .attr('fill', '#233416')
          .attr('font-size', isCompact ? '10px' : '11px')
          .attr('font-weight', '600');
      });

    g.append('g')
      .call(yAxis)
      .call((axisG) => {
        axisG.select('.domain').remove();
        axisG.selectAll('line').remove();
        axisG
          .selectAll('text')
          .attr('fill', '#436229')
          .attr('font-size', isCompact ? '10px' : '11px')
          .attr('font-weight', '600');
      });

    // Area & Line Generators
    const areaA = d3
      .area<YearlyYieldPoint>()
      .x((d) => xScale(d.year))
      .y0(innerHeight)
      .y1((d) => yScale(d.valueA))
      .curve(d3.curveMonotoneX);

    const areaB = d3
      .area<YearlyYieldPoint>()
      .x((d) => xScale(d.year))
      .y0(innerHeight)
      .y1((d) => yScale(d.valueB))
      .curve(d3.curveMonotoneX);

    const lineA = d3
      .line<YearlyYieldPoint>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.valueA))
      .curve(d3.curveMonotoneX);

    const lineB = d3
      .line<YearlyYieldPoint>()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.valueB))
      .curve(d3.curveMonotoneX);

    // Draw Areas
    g.append('path')
      .datum(chartData)
      .attr('fill', 'url(#d3-yield-grad-a)')
      .attr('d', areaA);

    g.append('path')
      .datum(chartData)
      .attr('fill', 'url(#d3-yield-grad-b)')
      .attr('d', areaB);

    // Optional reference curve if user picked a specific precocity profile
    if (activeCustomProfile) {
      const lineRef = d3
        .line<YearlyYieldPoint>()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.valueRef ?? 0))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#18230F')
        .attr('stroke-width', 1.75)
        .attr('stroke-dasharray', '5,4')
        .attr('opacity', 0.65)
        .attr('d', lineRef);
    }

    // Draw Lines
    g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#D99B26')
      .attr('stroke-width', 3)
      .attr('d', lineA);

    g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#436229')
      .attr('stroke-width', 3)
      .attr('d', lineB);

    // Active hovered year vertical guide line
    const activeX = xScale(hoveredYear);
    g.append('line')
      .attr('x1', activeX)
      .attr('x2', activeX)
      .attr('y1', 20)
      .attr('y2', innerHeight)
      .attr('stroke', '#18230F')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.65);

    // Data points for Variety A
    g.selectAll('.dot-a')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('class', 'dot-a')
      .attr('cx', (d) => xScale(d.year))
      .attr('cy', (d) => yScale(d.valueA))
      .attr('r', (d) => (d.year === hoveredYear ? 6.5 : 4))
      .attr('fill', (d) => (d.year === hoveredYear ? '#18230F' : '#E6AB3C'))
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => setHoveredYear(d.year))
      .on('click', (_, d) => setHoveredYear(d.year));

    // Data points for Variety B
    g.selectAll('.dot-b')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('class', 'dot-b')
      .attr('cx', (d) => xScale(d.year))
      .attr('cy', (d) => yScale(d.valueB))
      .attr('r', (d) => (d.year === hoveredYear ? 6.5 : 4))
      .attr('fill', (d) => (d.year === hoveredYear ? '#18230F' : '#567B34'))
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseenter', (_, d) => setHoveredYear(d.year))
      .on('click', (_, d) => setHoveredYear(d.year));

    // Invisible interactive overlay columns for smooth scrubbing across Years 1..10
    const colWidth = innerWidth / 9;
    g.selectAll('.year-hit-zone')
      .data(chartData)
      .enter()
      .append('rect')
      .attr('class', 'year-hit-zone')
      .attr('x', (d) => Math.max(0, xScale(d.year) - colWidth / 2))
      .attr('y', 0)
      .attr('width', colWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mousemove', (_, d) => setHoveredYear(d.year))
      .on('click', (_, d) => setHoveredYear(d.year));
  }, [chartData, containerWidth, hoveredYear, unitMode, activeCustomProfile]);

  return (
    <div className="mt-8 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC9] p-5 sm:p-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E6DEC9]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1">
            <TrendingUp className="w-4 h-4 text-[#E6AB3C]" />
            <span>Modélisation Agronomique D3.js · Horizon 10 Ans</span>
          </div>
          <h4 className="font-serif text-lg sm:text-xl font-bold text-[#18230F]">
            Courbe de Rendement sur 10 Ans selon la Précocité et l’Entrée en Production
          </h4>
          <p className="text-xs text-[#436229] mt-1">
            Visualisez la montée en production (phase juvénile, formation du gobelet et verger adulte) ainsi que l’effet du stade de précocité sur l’alternance bisannuelle.
          </p>
        </div>

        {/* Unit & Alternance Toggles */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex rounded-xl bg-white p-1 border border-[#E6DEC9]">
            <button
              type="button"
              onClick={() => setUnitMode('liters_oil')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                unitMode === 'liters_oil'
                  ? 'bg-[#233416] text-[#FAF7F2]'
                  : 'text-[#233416] hover:bg-[#F4EEE1]'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-[#E6AB3C]" />
              <span>Huile (L / arbre)</span>
            </button>
            <button
              type="button"
              onClick={() => setUnitMode('kg_olives')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                unitMode === 'kg_olives'
                  ? 'bg-[#233416] text-[#FAF7F2]'
                  : 'text-[#233416] hover:bg-[#F4EEE1]'
              }`}
            >
              <span>Olives (kg / arbre)</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIncludeAlternance((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              includeAlternance
                ? 'bg-[#233416] text-[#FAF7F2] border-[#233416]'
                : 'bg-white text-[#233416] border-[#E6DEC9] hover:border-[#8CBE5D]'
            }`}
            title="Activer ou lisser l'oscillation bisannuelle ON/OFF à partir de la 5e année"
          >
            <Sliders className="w-3.5 h-3.5 text-[#E6AB3C]" />
            <span>{includeAlternance ? 'Avec cycle ON/OFF' : 'Courbe lissée'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Precocity Selector Bar */}
      <div className="my-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#E6DEC9]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#18230F] shrink-0">
          <Calendar className="w-4 h-4 text-[#567B34]" />
          <span>Précocité choisie :</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedPrecocity('varietes-comparees')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedPrecocity === 'varietes-comparees'
                ? 'bg-[#31491E] text-white'
                : 'bg-[#FAF7F2] text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
            }`}
          >
            Précocité naturelle ({varietyA.name} vs {varietyB.name})
          </button>

          {(
            Object.values(PRECOCITY_PROFILES) as PrecocityProfileConfig[]
          ).map((prof) => {
            const isSelected = selectedPrecocity === prof.id;
            return (
              <button
                key={prof.id}
                type="button"
                onClick={() => setSelectedPrecocity(prof.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#E6AB3C] text-[#18230F]'
                    : 'bg-[#FAF7F2] text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                }`}
              >
                {prof.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contextual Precocity Explanation Banner */}
      <div className="mb-4 px-4 py-3 rounded-xl bg-[#F4EEE1] border border-[#E6DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#233416]">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-[#31491E] shrink-0 mt-0.5" />
          <div>
            {activeCustomProfile ? (
              <>
                <strong className="text-[#18230F]">
                  Simulation « {activeCustomProfile.label} » :
                </strong>{' '}
                {activeCustomProfile.description}{' '}
                <span className="text-[#567B34] font-medium">
                  (Entrée en production : Année {activeCustomProfile.firstBearingYear} · Pleine maturité : Année {activeCustomProfile.fullMaturityYear})
                </span>
              </>
            ) : (
              <>
                <strong className="text-[#18230F]">
                  Comparaison des précocités intrinsèques :
                </strong>{' '}
                <strong>{varietyA.name}</strong> ({profileA.shortLabel}, 1ʳᵉ récolte dès l’année{' '}
                {profileA.firstBearingYear}) face à <strong>{varietyB.name}</strong> (
                {profileB.shortLabel}, 1ʳᵉ récolte dès l’année {profileB.firstBearingYear}).
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 shrink-0 text-xs font-bold">
          <span className="inline-flex items-center gap-1.5 text-[#18230F]">
            <span className="w-3 h-3 rounded-full bg-[#E6AB3C] inline-block" />
            <span>A · {varietyA.name}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#18230F]">
            <span className="w-3 h-3 rounded-full bg-[#567B34] inline-block" />
            <span>B · {varietyB.name}</span>
          </span>
          {activeCustomProfile && (
            <span className="inline-flex items-center gap-1.5 text-[#436229]">
              <span className="w-4 border-t-2 border-dashed border-[#18230F] inline-block" />
              <span>Courbe type {activeCustomProfile.shortLabel}</span>
            </span>
          )}
        </div>
      </div>

      {/* D3 SVG Container */}
      <div
        ref={containerRef}
        className="w-full bg-white rounded-xl border border-[#E6DEC9] p-2 sm:p-3 overflow-hidden"
      >
        <svg
          ref={svgRef}
          className="w-full h-auto select-none overflow-visible"
          role="img"
          aria-label={`Courbe de rendement D3 sur 10 ans comparant ${varietyA.name} et ${varietyB.name}`}
        />
      </div>

      {/* Interactive Year Scrubber & Live Telemetry Readout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Year selector buttons + detail */}
        <div className="bg-white rounded-xl p-4 border border-[#E6DEC9] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#567B34] mb-2">
            <span className="font-bold uppercase tracking-wider text-[#31491E]">
              Inspection par Année (1 à 10)
            </span>
            <span className="font-mono font-bold text-[#18230F] tabular-nums">
              Année {activePoint.year} / 10
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 my-1">
            {chartData.map((d) => (
              <button
                key={d.year}
                type="button"
                onClick={() => setHoveredYear(d.year)}
                className={`py-1.5 rounded-lg text-xs font-bold tabular-nums transition-colors cursor-pointer ${
                  hoveredYear === d.year
                    ? 'bg-[#18230F] text-[#E6AB3C]'
                    : 'bg-[#FAF7F2] text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                }`}
              >
                A{d.year}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-[#567B34] mt-2">
            Survolez la courbe D3 ou cliquez sur une année pour inspecter les rendements annuels par arbre.
          </p>
        </div>

        {/* Variety A Year & 10-Yr Summary */}
        <div className="bg-white rounded-xl p-4 border border-[#E6DEC9] flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#E6AB3C] text-[#18230F] flex items-center justify-center font-extrabold text-[11px]">
                A
              </span>
              <span className="font-serif font-bold text-sm text-[#18230F]">
                {varietyA.name}
              </span>
            </div>
            <span className="text-[11px] text-[#567B34] font-medium">
              {profileA.shortLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F4EEE1] tabular-nums">
            <div>
              <span className="text-[11px] text-[#567B34] block">
                Année {activePoint.year} (par arbre)
              </span>
              <span className="font-serif text-lg font-bold text-[#18230F]">
                {activePoint.litersA} L{' '}
                <span className="text-xs font-sans font-normal text-[#436229]">
                  ({activePoint.kgA} kg)
                </span>
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#567B34] block">
                Cumul 10 ans (par arbre)
              </span>
              <span className="font-serif text-lg font-bold text-[#B47A16]">
                {cumulativeStats.totalLitersA} L{' '}
                <span className="text-xs font-sans font-normal text-[#436229]">
                  ({cumulativeStats.totalKgA} kg)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Variety B Year & 10-Yr Summary */}
        <div className="bg-white rounded-xl p-4 border border-[#E6DEC9] flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#8CBE5D] text-[#18230F] flex items-center justify-center font-extrabold text-[11px]">
                B
              </span>
              <span className="font-serif font-bold text-sm text-[#18230F]">
                {varietyB.name}
              </span>
            </div>
            <span className="text-[11px] text-[#567B34] font-medium">
              {profileB.shortLabel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F4EEE1] tabular-nums">
            <div>
              <span className="text-[11px] text-[#567B34] block">
                Année {activePoint.year} (par arbre)
              </span>
              <span className="font-serif text-lg font-bold text-[#18230F]">
                {activePoint.litersB} L{' '}
                <span className="text-xs font-sans font-normal text-[#436229]">
                  ({activePoint.kgB} kg)
                </span>
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#567B34] block">
                Cumul 10 ans (par arbre)
              </span>
              <span className="font-serif text-lg font-bold text-[#31491E]">
                {cumulativeStats.totalLitersB} L{' '}
                <span className="text-xs font-sans font-normal text-[#436229]">
                  ({cumulativeStats.totalKgB} kg)
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
