import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { OLIVE_VARIETIES, OliveVariety } from '../data/bejaiaOliveData';
import {
  Droplets,
  Sparkles,
  Calendar,
  Utensils,
  Check,
  ArrowRight,
  Share2,
  Copy,
  ArrowLeftRight,
  Shield,
  Scale,
  Sprout,
  Filter,
  Search,
  RotateCcw,
  X,
} from 'lucide-react';
import { ShareVarietyModal } from './ShareVarietyModal';
import { VarietyTenYearYieldChart } from './VarietyTenYearYieldChart';
import { ArticleAudioReader } from './ArticleAudioReader';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardRevealVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const tabButtonVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export type VarietyCategoryFilter = 'all' | 'oil' | 'mixed';
export type VarietyPrecocityFilter = 'all' | 'early' | 'mid' | 'late';

interface VarietyAgronomicMetrics {
  precocityRank: number; // 1 = très précoce, 4 = tardive
  precocityGroup: 'early' | 'mid' | 'late';
  precocityBadge: string;
  precocityDetail: string;
  avgYieldNum: number; // average % for visual bar
  yieldRangeLiters: string;
  coldTolerance: string;
  droughtTolerance: string;
  altitudeZone: string;
  pollinationNote: string;
  shortLabel: string;
}

export const VARIETY_AGRONOMIC_METRICS: Record<string, VarietyAgronomicMetrics> = {
  chemlal: {
    precocityRank: 3,
    precocityGroup: 'mid',
    precocityBadge: 'Mi-saison à Tardive (Nov – Janv)',
    precocityDetail: 'Véraison progressive dès mi-novembre ; maturité complète en décembre.',
    avgYieldNum: 18,
    yieldRangeLiters: '16 à 20 L / quintal',
    coldTolerance: 'Élevée (jusqu’à 900 m d’altitude)',
    droughtTolerance: 'Très élevée (système racinaire profond)',
    altitudeZone: 'Coteaux, moyenne montagne & vallée (150 – 850 m)',
    pollinationNote: 'Auto-stérile partielle : nécessite 10 à 15 % d’Azeradj comme pollinisateur.',
    shortLabel: 'Chemlal',
  },
  azeradj: {
    precocityRank: 1,
    precocityGroup: 'early',
    precocityBadge: 'Très Précoce (Octobre – Novembre)',
    precocityDetail: 'Première variété récoltée en Kabylie (verte en oct., tournante en nov.).',
    avgYieldNum: 22.5,
    yieldRangeLiters: '20 à 25 L / quintal',
    coldTolerance: 'Moyenne à bonne (préfère les expositions abritées)',
    droughtTolerance: 'Modérée (apprécie les sols profonds et frais)',
    altitudeZone: 'Plateaux de Seddouk, plaines et piémonts (100 – 600 m)',
    pollinationNote: 'Pollinisateur universel de référence pour les vergers de Chemlal.',
    shortLabel: 'Azeradj',
  },
  bouchouk: {
    precocityRank: 2,
    precocityGroup: 'early',
    precocityBadge: 'Précoce à Mi-saison (Oct – Déc)',
    precocityDetail: 'Récolte dès octobre pour la table et novembre pour l’extraction d’huile.',
    avgYieldNum: 22.5,
    yieldRangeLiters: '20 à 25 L / quintal',
    coldTolerance: 'Bonne sur terrasses calcaires bien drainées',
    droughtTolerance: 'Bonne tolérance estivale',
    altitudeZone: 'Vallée de la Soummam, Sidi-Aïch & Chemini (200 – 650 m)',
    pollinationNote: 'Bonne compatibilité florale avec Chemlal et Limli.',
    shortLabel: 'Bouchouk',
  },
  limli: {
    precocityRank: 2,
    precocityGroup: 'early',
    precocityBadge: 'Précoce (Novembre – Mi-Décembre)',
    precocityDetail: 'Lipogenèse rapide produisant les premières huiles primeurs ardentes.',
    avgYieldNum: 20,
    yieldRangeLiters: '18 à 22 L / quintal',
    coldTolerance: 'Bonne, très résistante aux vents de couloir',
    droughtTolerance: 'Élevée sur coteaux schisteux et marno-calcaires',
    altitudeZone: 'Coteaux de la Haute et Moyenne Soummam (150 – 550 m)',
    pollinationNote: 'Floraison abondante, idéale en verger mixte dans le bassin de Sidi-Aïch.',
    shortLabel: 'Limli',
  },
  aberkane: {
    precocityRank: 4,
    precocityGroup: 'late',
    precocityBadge: 'Tardive de Montagne (Déc – Fév)',
    precocityDetail: 'Noircissement précoce de l’épiderme mais maturité pulpaire hivernale.',
    avgYieldNum: 21,
    yieldRangeLiters: '19 à 23 L / quintal',
    coldTolerance: 'Exceptionnelle (haute montagne, Babors & Djurdjura)',
    droughtTolerance: 'Élevée sur pentes rocheuses escarpées',
    altitudeZone: 'Versants d’altitude et reliefs escarpés (500 – 1 000 m)',
    pollinationNote: 'Arbres centenaires rustiques adaptés aux terroirs froids et humides.',
    shortLabel: 'Aberkane',
  },
  autres: {
    precocityRank: 3,
    precocityGroup: 'mid',
    precocityBadge: 'Mi-saison (Novembre – Janvier)',
    precocityDetail: 'Échelonnement variable selon le cultivar (Sigoise, Picholine, Arbequina).',
    avgYieldNum: 20,
    yieldRangeLiters: '18 à 22 L / quintal',
    coldTolerance: 'Variable selon la lignée variétale',
    droughtTolerance: 'Moyenne à bonne (souvent conduite avec irrigation d’appoint)',
    altitudeZone: 'Plaines alluviales et vergers intensifs pilotes (50 – 400 m)',
    pollinationNote: 'Complément de biodiversité et d’assemblage aromatique.',
    shortLabel: 'Autres cultivars',
  },
};

export interface FilterVarietiesOptions {
  varietyId?: string; // 'all' or specific variety id ('chemlal', 'bouchouk', 'azeradj', etc.)
  category?: VarietyCategoryFilter;
  precocity?: VarietyPrecocityFilter;
  searchQuery?: string;
}

export function filterOliveVarieties(
  varieties: OliveVariety[],
  options: FilterVarietiesOptions
): OliveVariety[] {
  const {
    varietyId = 'all',
    category = 'all',
    precocity = 'all',
    searchQuery = '',
  } = options;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return varieties.filter((v) => {
    if (varietyId !== 'all' && v.id !== varietyId) {
      return false;
    }
    if (category !== 'all' && v.category !== category) {
      return false;
    }
    if (precocity !== 'all') {
      const metrics = VARIETY_AGRONOMIC_METRICS[v.id];
      if (!metrics || metrics.precocityGroup !== precocity) {
        return false;
      }
    }
    if (normalizedQuery) {
      const metrics = VARIETY_AGRONOMIC_METRICS[v.id];
      const searchableText = [
        v.name,
        v.kabyleName,
        v.description,
        v.fruitCharacteristics,
        v.resistance,
        v.bestUse,
        v.harvestWindow,
        ...v.flavorProfile,
        metrics?.altitudeZone || '',
        metrics?.precocityBadge || '',
      ]
        .join(' ')
        .toLowerCase();
      if (!searchableText.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });
}

export const VarietiesGuide: React.FC = () => {
  const [selectedVariety, setSelectedVariety] = useState<OliveVariety>(OLIVE_VARIETIES[0]);
  const [activeVarietyFilter, setActiveVarietyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<VarietyCategoryFilter>('all');
  const [precocityFilter, setPrecocityFilter] = useState<VarietyPrecocityFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [compareVarietyAId, setCompareVarietyAId] = useState<string>(OLIVE_VARIETIES[0].id); // Chemlal
  const [compareVarietyBId, setCompareVarietyBId] = useState<string>(
    OLIVE_VARIETIES.find((v) => v.id === 'azeradj')?.id || OLIVE_VARIETIES[1].id
  ); // Azeradj
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [varietyToShare, setVarietyToShare] = useState<OliveVariety>(OLIVE_VARIETIES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredVarieties = useMemo(
    () =>
      filterOliveVarieties(OLIVE_VARIETIES, {
        varietyId: activeVarietyFilter,
        category: categoryFilter,
        precocity: precocityFilter,
        searchQuery,
      }),
    [activeVarietyFilter, categoryFilter, precocityFilter, searchQuery]
  );

  const hasActiveFilters =
    activeVarietyFilter !== 'all' ||
    categoryFilter !== 'all' ||
    precocityFilter !== 'all' ||
    searchQuery.trim() !== '';

  const handleToggleVarietyFilter = (varietyId: string) => {
    if (varietyId === 'all') {
      setActiveVarietyFilter('all');
      return;
    }
    const found = OLIVE_VARIETIES.find((v) => v.id === varietyId);
    if (found) {
      setSelectedVariety(found);
      window.history.replaceState(null, '', `#varietes-${found.id}`);
    }
    setActiveVarietyFilter((prev) => (prev === varietyId ? 'all' : varietyId));
  };

  const handleSelectVariety = (variety: OliveVariety) => {
    setSelectedVariety(variety);
    window.history.replaceState(null, '', `#varietes-${variety.id}`);
  };

  const handleResetFilters = () => {
    setActiveVarietyFilter('all');
    setCategoryFilter('all');
    setPrecocityFilter('all');
    setSearchQuery('');
  };

  // Keep selectedVariety synced if filters narrow down the list
  useEffect(() => {
    if (
      filteredVarieties.length > 0 &&
      !filteredVarieties.some((v) => v.id === selectedVariety.id)
    ) {
      setSelectedVariety(filteredVarieties[0]);
    }
  }, [filteredVarieties, selectedVariety.id]);

  const varietyA =
    OLIVE_VARIETIES.find((v) => v.id === compareVarietyAId) || OLIVE_VARIETIES[0];
  const varietyB =
    OLIVE_VARIETIES.find((v) => v.id === compareVarietyBId) || OLIVE_VARIETIES[1];

  const metricsA =
    VARIETY_AGRONOMIC_METRICS[varietyA.id] || VARIETY_AGRONOMIC_METRICS.chemlal;
  const metricsB =
    VARIETY_AGRONOMIC_METRICS[varietyB.id] || VARIETY_AGRONOMIC_METRICS.azeradj;

  // Read URL hash or search param (?variety=...) to automatically select shared variety
  useEffect(() => {
    const handleHashOrQuery = () => {
      const params = new URLSearchParams(window.location.search);
      const queryVar = params.get('variety');
      if (queryVar) {
        const foundByQuery = OLIVE_VARIETIES.find(
          (v) => v.id.toLowerCase() === queryVar.toLowerCase()
        );
        if (foundByQuery) {
          setSelectedVariety(foundByQuery);
          return;
        }
      }

      const hash = window.location.hash;
      if (hash.startsWith('#varietes-')) {
        const id = hash.replace('#varietes-', '');
        const found = OLIVE_VARIETIES.find((v) => v.id === id);
        if (found) setSelectedVariety(found);
      }
    };

    handleHashOrQuery();
    window.addEventListener('hashchange', handleHashOrQuery);
    return () => window.removeEventListener('hashchange', handleHashOrQuery);
  }, []);

  const getVarietyShareData = (variety: OliveVariety) => {
    const baseUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : 'https://olive-bejaia.dz/';
    const url = `${baseUrl}#varietes-${variety.id}`;
    const title = `Variété d'olive de Kabylie : ${variety.name} (${variety.kabyleName})`;
    const summary = `${title} — Proportion : ${variety.proportionKabylie} | Rendement en huile : ${variety.oilYieldPercent} | Arômes : ${variety.flavorProfile.slice(0, 3).join(', ')}. Guide Variétal ADOIO Béjaïa :`;

    return {
      url,
      whatsappUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${summary}\n${url}`)}`,
      facebookUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(summary)}`,
      twitterUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(summary)}&url=${encodeURIComponent(url)}&hashtags=OliveBejaia,HuileDOliveKabylie,ADOIO`,
      copyText: `${summary}\n${url}`,
    };
  };

  const handleCopyVarietyLink = async (variety: OliveVariety) => {
    const { copyText } = getVarietyShareData(variety);
    try {
      await navigator.clipboard.writeText(copyText);
      setCopiedId(variety.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(variety.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleOpenShare = (variety?: OliveVariety) => {
    const target = variety || selectedVariety;
    setVarietyToShare(target);
    setIsShareModalOpen(true);
    window.history.replaceState(null, '', `#varietes-${target.id}`);
  };

  const handleSwapVarieties = () => {
    setCompareVarietyAId(compareVarietyBId);
    setCompareVarietyBId(compareVarietyAId);
  };

  const handleAssignToComparator = (varietyId: string, slot: 'A' | 'B') => {
    if (slot === 'A') {
      if (varietyId === compareVarietyBId) {
        setCompareVarietyBId(compareVarietyAId);
      }
      setCompareVarietyAId(varietyId);
    } else {
      if (varietyId === compareVarietyAId) {
        setCompareVarietyAId(compareVarietyBId);
      }
      setCompareVarietyBId(varietyId);
    }
    const el = document.getElementById('comparateur-deux-varietes');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const activeShare = getVarietyShareData(selectedVariety);

  return (
    <section id="varietes" className="py-16 sm:py-24 bg-[#F4EEE1] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Global Guide Social Share Bar */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
        >
          <motion.div variants={cardRevealVariants} className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <Droplets className="w-4 h-4 text-[#E6AB3C]" />
              <span>Patrimoine Génétique & Variétal de Kabylie</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              Guide des Variétés d'Oliviers de la Région
            </h2>
            <p className="mt-3 text-base text-[#436229] leading-relaxed">
              Façonnées par des siècles de sélection paysanne dans les monts du Djurdjura et de la Soummam, les variétés de Béjaïa offrent une palette aromatique unique et une remarquable résistance aux aléas climatiques.
            </p>
            <div className="mt-4">
              <ArticleAudioReader
                sectionId="varietes"
                title={`Guide des Variétés d'Oliviers de Kabylie — Focus sur ${selectedVariety.name}`}
                text={() => {
                  const metrics = VARIETY_AGRONOMIC_METRICS[selectedVariety.id];
                  return `Les variétés autochtones de Béjaïa résultent d'une sélection paysanne séculaire dans les monts du Djurdjura et de la vallée de la Soummam. Variété actuellement sélectionnée : ${selectedVariety.name}, appelée en kabyle ${selectedVariety.kabyleName}. Part du verger : ${selectedVariety.proportionKabylie}. Rendement moyen en huile : ${selectedVariety.oilYieldPercent}. Période optimale de récolte : ${selectedVariety.harvestWindow}. Description agronomique : ${selectedVariety.description} Caractéristiques du fruit : ${selectedVariety.fruitCharacteristics}. Profil aromatique : ${selectedVariety.flavorProfile.join(', ')}. Résistance : ${selectedVariety.resistance}. Usage recommandé : ${selectedVariety.bestUse}. ${
                    metrics
                      ? `Précocité : ${metrics.precocityBadge}, ${metrics.precocityDetail} Tolérance au froid : ${metrics.coldTolerance}. Tolérance à la sécheresse : ${metrics.droughtTolerance}. Pollinisation : ${metrics.pollinationNote}`
                      : ''
                  }`;
                }}
              />
            </div>
          </motion.div>

          {/* Direct Social Share Bar in Section Header */}
          <motion.div
            variants={cardRevealVariants}
            className="bg-white/90 backdrop-blur-xs border border-[#E6DEC9] rounded-2xl p-3.5 shadow-xs shrink-0"
          >
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#31491E] mb-2 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#E6AB3C]" />
              <span>Partager la variété ({selectedVariety.name}) :</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={activeShare.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Partager ${selectedVariety.name} sur WhatsApp`}
                title={`Partager ${selectedVariety.name} sur WhatsApp`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold shadow-2xs transition-transform active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.115-.515-1.745-.718-2.884-2.483-2.97-2.6-.088-.114-.717-.954-.717-1.821 0-.867.452-1.294.613-1.467.161-.173.351-.217.468-.217.117 0 .234.001.336.006.107.005.25-.041.391.298.144.348.491 1.199.534 1.286.044.087.073.189.015.305-.058.115-.088.188-.175.289-.088.102-.185.228-.264.306-.088.087-.18.182-.077.359.102.176.455.751.977 1.216.671.597 1.236.782 1.412.87.175.087.278.073.38-.044.103-.116.44-.514.557-.69.117-.175.234-.145.394-.087.161.058 1.02.481 1.195.568.176.088.293.131.336.205.044.072.044.419-.1.824z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.662 1.448 5.178L2.05 21.95l4.893-1.365C8.423 21.492 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.666 0-3.21-.52-4.484-1.411l-.322-.224-2.91.812.815-2.873-.243-.349A8.006 8.006 0 014 12c0-4.411 3.589-8.05 8-8.05 4.411 0 8 3.639 8 8.05 0 4.411-3.589 8.05-8 8.05z" />
                </svg>
                <span>WhatsApp</span>
              </a>

              <a
                href={activeShare.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Partager ${selectedVariety.name} sur Facebook`}
                title={`Partager ${selectedVariety.name} sur Facebook`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#1464D2] text-white text-xs font-bold shadow-2xs transition-transform active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href={activeShare.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Partager ${selectedVariety.name} sur Twitter / X`}
                title={`Partager ${selectedVariety.name} sur Twitter / X`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1419] hover:bg-[#272C30] text-white text-xs font-bold shadow-2xs transition-transform active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Twitter</span>
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Système de Filtrage & Bascule des Variétés Autochtones de Béjaïa */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={cardRevealVariants}
          className="bg-white rounded-3xl border border-[#E6DEC9] p-5 sm:p-6 shadow-xs mb-8"
          aria-label="Système de filtrage des variétés d'oliviers de Béjaïa"
        >
          {/* Top Row: Filter Title, Live Count & Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6DEC9]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#233416] text-[#E6AB3C] flex items-center justify-center shrink-0">
                <Filter className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#18230F] leading-tight">
                  Filtrer & Explorer les Cultivars de Béjaïa
                </h3>
                <p className="text-xs text-[#567B34]">
                  Basculez entre Chemlal, Bouchouk, Azeradj, Limli ou Aberkane et filtrez par vocation ou maturité
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <span
                data-testid="varieties-filter-count"
                className="font-mono text-xs font-bold tabular-nums px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#233416] border border-[#E6DEC9] whitespace-nowrap"
              >
                {filteredVarieties.length} sur {OLIVE_VARIETIES.length} variété{filteredVarieties.length > 1 ? 's' : ''}
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  data-testid="reset-variety-filters"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F4D9] hover:bg-[#d7ebc0] text-[#233416] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#567B34]" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>
          </div>

          {/* Primary Toggle Row: Native Varieties of Béjaïa (Chemlal, Bouchouk, Azeradj, etc.) */}
          <div className="mt-4">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#567B34]">
                Accès rapide par cultivar autochtone :
              </span>
              <span className="text-[11px] text-[#6F9D44] hidden sm:inline">
                Cliquez sur une variété pour filtrer et afficher sa fiche complète
              </span>
            </div>

            <div
              role="group"
              aria-label="Filtrer par variété d'olive"
              className="flex flex-wrap gap-2"
            >
              <button
                type="button"
                onClick={() => handleToggleVarietyFilter('all')}
                data-testid="filter-variety-all"
                aria-pressed={activeVarietyFilter === 'all'}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activeVarietyFilter === 'all'
                    ? 'bg-[#233416] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#FAF7F2] text-[#242A20] border border-[#E6DEC9] hover:border-[#8CBE5D]'
                }`}
              >
                <span>Toutes les variétés</span>
                <span
                  className={`font-mono text-[10px] tabular-nums px-1.5 py-0.5 rounded ${
                    activeVarietyFilter === 'all'
                      ? 'bg-[#FAF7F2]/15 text-[#E6AB3C]'
                      : 'bg-white text-[#567B34]'
                  }`}
                >
                  {OLIVE_VARIETIES.length}
                </span>
              </button>

              {OLIVE_VARIETIES.map((v) => {
                const isVarietyFiltered = activeVarietyFilter === v.id;
                const isCurrentlySelected = selectedVariety.id === v.id && activeVarietyFilter === 'all';
                const shortName = VARIETY_AGRONOMIC_METRICS[v.id]?.shortLabel || v.name;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleToggleVarietyFilter(v.id)}
                    data-testid={`filter-variety-${v.id}`}
                    aria-pressed={isVarietyFiltered}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                      isVarietyFiltered
                        ? 'bg-[#233416] text-[#FAF7F2] shadow-sm ring-2 ring-[#E6AB3C]/50'
                        : isCurrentlySelected
                        ? 'bg-[#E8F4D9] text-[#18230F] border border-[#8CBE5D]'
                        : 'bg-white text-[#242A20] border border-[#E6DEC9] hover:border-[#8CBE5D]'
                    }`}
                  >
                    <span>{shortName}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isVarietyFiltered
                          ? 'bg-[#FAF7F2]/15 text-[#E6AB3C]'
                          : isCurrentlySelected
                          ? 'bg-[#233416] text-[#FAF7F2]'
                          : 'bg-[#FAF7F2] text-[#567B34]'
                      }`}
                    >
                      {v.category === 'oil' ? 'Huile' : 'Mixte'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary Filter Row: Vocation, Precocity & Search Input */}
          <div className="mt-4 pt-4 border-t border-[#E6DEC9] grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Vocation / Category Filter */}
            <div className="md:col-span-4">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#567B34] mb-1.5">
                Vocation oléicole
              </label>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrer par vocation">
                {(
                  [
                    { id: 'all', label: 'Toutes' },
                    { id: 'oil', label: 'À Huile (Vierge Extra)' },
                    { id: 'mixed', label: 'Double Fin (Huile & Table)' },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    data-testid={`filter-category-${cat.id}`}
                    aria-pressed={categoryFilter === cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      categoryFilter === cat.id
                        ? 'bg-[#567B34] text-white shadow-2xs'
                        : 'bg-[#FAF7F2] text-[#242A20] border border-[#E6DEC9] hover:border-[#8CBE5D]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Precocity / Harvest Maturity Filter */}
            <div className="md:col-span-5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#567B34] mb-1.5">
                Maturité & Période de récolte
              </label>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrer par précocité">
                {(
                  [
                    { id: 'all', label: 'Toutes saisons' },
                    { id: 'early', label: 'Précoce (Oct–Nov)' },
                    { id: 'mid', label: 'Mi-saison (Nov–Jan)' },
                    { id: 'late', label: 'Tardive (Déc–Fév)' },
                  ] as const
                ).map((prec) => (
                  <button
                    key={prec.id}
                    type="button"
                    data-testid={`filter-precocity-${prec.id}`}
                    aria-pressed={precocityFilter === prec.id}
                    onClick={() => setPrecocityFilter(prec.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                      precocityFilter === prec.id
                        ? 'bg-[#E6AB3C] text-[#18230F] shadow-2xs'
                        : 'bg-[#FAF7F2] text-[#242A20] border border-[#E6DEC9] hover:border-[#8CBE5D]'
                    }`}
                  >
                    {prec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Query Input */}
            <div className="md:col-span-3">
              <label
                htmlFor="variety-search-input"
                className="block text-[11px] font-bold uppercase tracking-wider text-[#567B34] mb-1.5"
              >
                Recherche (nom, arôme, terroir)
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#567B34] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="variety-search-input"
                  data-testid="variety-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ex: Chemlal, artichaut, Soummam..."
                  className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs text-[#18230F] placeholder:text-[#567B34]/60 focus:outline-none focus:border-[#233416] focus:bg-white transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Effacer la recherche"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#567B34] hover:text-[#18230F] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Progressive Scroll Variety Cards Grid (Aperçu Synoptique des Cultivars Filtrés) */}
        {filteredVarieties.length === 0 ? (
          <div
            data-testid="varieties-empty-state"
            className="bg-white rounded-3xl border border-[#E6DEC9] p-8 text-center mb-10 shadow-2xs"
          >
            <p className="font-serif text-lg font-bold text-[#18230F]">
              Aucune variété ne correspond aux filtres sélectionnés
            </p>
            <p className="text-xs text-[#567B34] mt-1 max-w-md mx-auto">
              Essayez de modifier vos critères de vocation, de période de récolte ou de réinitialiser le filtre variétal.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#233416] text-[#FAF7F2] text-xs font-bold hover:bg-[#31491E] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#E6AB3C]" />
              <span>Afficher toutes les variétés de Béjaïa</span>
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={containerVariants}
            data-testid="varieties-cards-grid"
            className={`grid grid-cols-1 ${
              filteredVarieties.length === 1
                ? 'sm:grid-cols-1 max-w-2xl'
                : filteredVarieties.length === 2
                ? 'sm:grid-cols-2'
                : 'sm:grid-cols-2 lg:grid-cols-3'
            } gap-4 mb-10`}
          >
            {filteredVarieties.map((variety) => {
              const isSelected = selectedVariety.id === variety.id;
              const isComparedA = compareVarietyAId === variety.id;
              const isComparedB = compareVarietyBId === variety.id;

              return (
                <motion.article
                  key={variety.id}
                  data-testid={`variety-card-${variety.id}`}
                  variants={cardRevealVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => handleSelectVariety(variety)}
                  className={`rounded-2xl p-5 border transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#233416] text-[#FAF7F2] border-[#233416] shadow-md'
                      : 'bg-white text-[#18230F] border-[#E6DEC9] hover:border-[#8CBE5D] shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs mb-2">
                      <span
                        className={`font-serif italic ${
                          isSelected ? 'text-[#E6AB3C]' : 'text-[#567B34]'
                        }`}
                      >
                        {variety.kabyleName}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-semibold tabular-nums ${
                          isSelected ? 'text-[#E8F4D9]/90' : 'text-[#436229]'
                        }`}
                      >
                        {variety.oilYieldPercent}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-lg font-bold leading-snug">
                        {variety.name}
                      </h3>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                          isSelected
                            ? 'bg-[#FAF7F2]/15 text-[#E6AB3C]'
                            : 'bg-[#FAF7F2] text-[#567B34]'
                        }`}
                      >
                        {variety.category === 'oil' ? 'À Huile' : 'Huile & Table'}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${
                        isSelected ? 'text-[#E8F4D9]/85' : 'text-[#436229]'
                      }`}
                    >
                      {variety.description}
                    </p>
                  </div>

                  <div
                    className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 text-[11px] ${
                      isSelected
                        ? 'border-[#FAF7F2]/15 text-[#B0D984]'
                        : 'border-[#E6DEC9] text-[#567B34]'
                    }`}
                  >
                    <span>{variety.harvestWindow}</span>
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleAssignToComparator(variety.id, 'A')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                          isComparedA
                            ? 'bg-[#E6AB3C] text-[#18230F]'
                            : isSelected
                            ? 'bg-[#FAF7F2]/15 text-[#FAF7F2] hover:bg-[#FAF7F2]/25'
                            : 'bg-[#FAF7F2] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D]'
                        }`}
                        title={`Définir ${variety.name} comme Variété A dans le comparateur`}
                      >
                        {isComparedA ? '✓ Variété A' : 'Comparer A'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAssignToComparator(variety.id, 'B')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer whitespace-nowrap ${
                          isComparedB
                            ? 'bg-[#8CBE5D] text-[#18230F]'
                            : isSelected
                            ? 'bg-[#FAF7F2]/15 text-[#FAF7F2] hover:bg-[#FAF7F2]/25'
                            : 'bg-[#FAF7F2] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D]'
                        }`}
                        title={`Définir ${variety.name} comme Variété B dans le comparateur`}
                      >
                        {isComparedB ? '✓ Variété B' : 'Comparer B'}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* Active Variety Detail Card with scroll-in and variety-switch motion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={cardRevealVariants}
          className="bg-white rounded-3xl border border-[#E6DEC9] p-6 lg:p-10 shadow-sm mb-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedVariety.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Left overview */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-mono text-xs font-bold text-[#567B34] bg-[#E8F4D9] px-2.5 py-1 rounded">
                        Nom en Tamazight : {selectedVariety.kabyleName}
                      </span>
                      <span className="text-xs text-[#6F9D44] font-medium">
                        {selectedVariety.proportionKabylie}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenShare(selectedVariety)}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D] text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer group"
                      title={`Ouvrir toutes les options de partage pour ${selectedVariety.name}`}
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#E6AB3C] group-hover:scale-110 transition-transform" />
                      <span>Partager la fiche</span>
                    </button>
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-[#18230F] mt-2">
                    {selectedVariety.name}
                  </h3>
                  <p className="text-sm text-[#436229] leading-relaxed mt-3">
                    {selectedVariety.description}
                  </p>
                </div>

                {/* Flavor Profile Pills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#18230F] block">
                    Signature Aromatique & Gustative :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedVariety.flavorProfile.map((flavor) => (
                      <span
                        key={flavor}
                        className="px-3 py-1 rounded-lg bg-[#FEF5DB] border border-[#E6AB3C]/30 text-[#B47A16] text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#E6AB3C]" />
                        {flavor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Characteristics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E6DEC9] space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#31491E]">
                      <Droplets className="w-4 h-4 text-[#E6AB3C]" />
                      <span>Rendement en Huile</span>
                    </div>
                    <p className="text-sm font-semibold text-[#18230F]">
                      {selectedVariety.oilYieldPercent}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.12 }}
                    className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E6DEC9] space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#31491E]">
                      <Calendar className="w-4 h-4 text-[#E6AB3C]" />
                      <span>Fenêtre de Récolte</span>
                    </div>
                    <p className="text-sm font-semibold text-[#18230F]">
                      {selectedVariety.harvestWindow}
                    </p>
                  </motion.div>
                </div>

                {/* Culinary use */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                  className="p-4 rounded-xl bg-[#E8F4D9] border border-[#8CBE5D]/30 flex items-start gap-3"
                >
                  <Utensils className="w-5 h-5 text-[#31491E] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#233416]">
                    <strong className="block text-sm font-bold text-[#18230F] mb-1">
                      Conseil Culinaire ADOIO :
                    </strong>
                    {selectedVariety.bestUse}
                  </div>
                </motion.div>
              </div>

              {/* Right agronomic card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="lg:col-span-5 bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6DEC9] space-y-5"
              >
                <h4 className="font-serif text-lg font-bold text-[#18230F] pb-3 border-b border-[#E6DEC9]">
                  Fiche Morphologique & Agronomique
                </h4>

                <div className="space-y-4 text-xs text-[#436229]">
                  <div>
                    <span className="font-bold text-[#18230F] block mb-1">
                      Morphologie du fruit :
                    </span>
                    <p className="leading-relaxed bg-white p-3 rounded-lg border border-[#E6DEC9]">
                      {selectedVariety.fruitCharacteristics}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-[#18230F] block mb-1">
                      Rusticité & Comportement :
                    </span>
                    <p className="leading-relaxed bg-white p-3 rounded-lg border border-[#E6DEC9]">
                      {selectedVariety.resistance}
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-[#E6DEC9] space-y-2">
                    <span className="font-bold text-[#18230F] block">
                      Aptitude industrielle :
                    </span>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#567B34]" />
                        <span>Extraction continue à froid : Excellente</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#567B34]" />
                        <span>Richesse en antioxydants : Très élevée</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#567B34]" />
                        <span>Stabilité oxydative : Remarquable (&gt; 18 mois)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Quick Social Share Bar (WhatsApp, Facebook, Twitter + Copy) */}
                  <div className="pt-3 border-t border-[#E6DEC9] space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#18230F]">
                      <span className="flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-[#E6AB3C]" />
                        <span>Partager cette fiche technique :</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyVarietyLink(selectedVariety)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#31491E] hover:text-[#567B34] cursor-pointer"
                        title="Copier le lien direct et le résumé"
                      >
                        {copiedId === selectedVariety.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#25D366]" />
                            <span>Lien copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-[#E6AB3C]" />
                            <span>Copier le lien</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href={activeShare.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                        title={`Partager ${selectedVariety.name} sur WhatsApp`}
                      >
                        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.115-.515-1.745-.718-2.884-2.483-2.97-2.6-.088-.114-.717-.954-.717-1.821 0-.867.452-1.294.613-1.467.161-.173.351-.217.468-.217.117 0 .234.001.336.006.107.005.25-.041.391.298.144.348.491 1.199.534 1.286.044.087.073.189.015.305-.058.115-.088.188-.175.289-.088.102-.185.228-.264.306-.088.087-.18.182-.077.359.102.176.455.751.977 1.216.671.597 1.236.782 1.412.87.175.087.278.073.38-.044.103-.116.44-.514.557-.69.117-.175.234-.145.394-.087.161.058 1.02.481 1.195.568.176.088.293.131.336.205.044.072.044.419-.1.824z" />
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.662 1.448 5.178L2.05 21.95l4.893-1.365C8.423 21.492 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.666 0-3.21-.52-4.484-1.411l-.322-.224-2.91.812.815-2.873-.243-.349A8.006 8.006 0 014 12c0-4.411 3.589-8.05 8-8.05 4.411 0 8 3.639 8 8.05 0 4.411-3.589 8.05-8 8.05z" />
                        </svg>
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={activeShare.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-xl bg-[#1877F2] hover:bg-[#1464D2] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                        title={`Partager ${selectedVariety.name} sur Facebook`}
                      >
                        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>Facebook</span>
                      </a>

                      <a
                        href={activeShare.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-2.5 rounded-xl bg-[#0F1419] hover:bg-[#272C30] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                        title={`Partager ${selectedVariety.name} sur Twitter / X`}
                      >
                        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>Twitter</span>
                      </a>
                    </div>
                  </div>

                  {/* Cross-linking to Yield Simulator */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const simEl = document.getElementById('simulateur');
                        if (simEl) {
                          simEl.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#233416] text-xs font-bold border border-[#8CBE5D]/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <span>Simuler le rendement de la {selectedVariety.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#436229]" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Side-by-Side Two-Variety Comparator (Rendement, Précocité, Résistance) */}
        <motion.div
          id="comparateur-deux-varietes"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={cardRevealVariants}
          className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-sm mb-12"
        >
          {/* Comparator Header & Quick Presets */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC9]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1">
                <Scale className="w-4 h-4 text-[#E6AB3C]" />
                <span>Outil d’Aide au Choix Variétal · ADOIO Béjaïa</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                Comparateur Côte à Côte de Deux Variétés
              </h3>
              <p className="text-xs text-[#436229] mt-1">
                Sélectionnez deux cultivars de Kabylie pour comparer directement leur <strong>rendement en huile</strong>, leur <strong>précocité de récolte</strong> et leur <strong>résistance pédoclimatique</strong>.
              </p>
            </div>

            {/* Preset comparison pairs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-[#567B34] mr-1">
                Duels fréquents :
              </span>
              <button
                type="button"
                onClick={() => {
                  setCompareVarietyAId('chemlal');
                  setCompareVarietyBId('azeradj');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  compareVarietyAId === 'chemlal' && compareVarietyBId === 'azeradj'
                    ? 'bg-[#233416] text-[#FAF7F2]'
                    : 'bg-[#FAF7F2] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D]'
                }`}
              >
                Chemlal vs Azeradj
              </button>
              <button
                type="button"
                onClick={() => {
                  setCompareVarietyAId('bouchouk');
                  setCompareVarietyBId('limli');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  compareVarietyAId === 'bouchouk' && compareVarietyBId === 'limli'
                    ? 'bg-[#233416] text-[#FAF7F2]'
                    : 'bg-[#FAF7F2] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D]'
                }`}
              >
                Bouchouk vs Limli
              </button>
              <button
                type="button"
                onClick={() => {
                  setCompareVarietyAId('chemlal');
                  setCompareVarietyBId('aberkane');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  compareVarietyAId === 'chemlal' && compareVarietyBId === 'aberkane'
                    ? 'bg-[#233416] text-[#FAF7F2]'
                    : 'bg-[#FAF7F2] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D]'
                }`}
              >
                Chemlal vs Aberkane
              </button>
            </div>
          </div>

          {/* Variety A & Variety B Selectors Bar */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-11 gap-3 items-center bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]">
            {/* Selector A */}
            <div className="md:col-span-5 space-y-1.5">
              <label
                htmlFor="select-variety-a"
                className="text-[11px] font-bold uppercase tracking-wider text-[#233416] flex items-center gap-1.5"
              >
                <span className="w-5 h-5 rounded-md bg-[#E6AB3C] text-[#18230F] flex items-center justify-center font-extrabold text-[10px]">
                  A
                </span>
                <span>Première variété à comparer</span>
              </label>
              <select
                id="select-variety-a"
                value={compareVarietyAId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === compareVarietyBId) {
                    setCompareVarietyBId(compareVarietyAId);
                  }
                  setCompareVarietyAId(val);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6DEC9] font-serif font-bold text-sm text-[#18230F] focus:outline-none focus:border-[#233416] cursor-pointer"
              >
                {OLIVE_VARIETIES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.kabyleName}) — {v.oilYieldPercent}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center pt-2 md:pt-5">
              <button
                type="button"
                onClick={handleSwapVarieties}
                className="p-2.5 rounded-xl bg-white hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D] transition-colors cursor-pointer shadow-2xs"
                title="Inverser la Variété A et la Variété B"
                aria-label="Inverser les deux variétés comparées"
              >
                <ArrowLeftRight className="w-4 h-4 text-[#567B34]" />
              </button>
            </div>

            {/* Selector B */}
            <div className="md:col-span-5 space-y-1.5">
              <label
                htmlFor="select-variety-b"
                className="text-[11px] font-bold uppercase tracking-wider text-[#233416] flex items-center gap-1.5"
              >
                <span className="w-5 h-5 rounded-md bg-[#8CBE5D] text-[#18230F] flex items-center justify-center font-extrabold text-[10px]">
                  B
                </span>
                <span>Seconde variété à comparer</span>
              </label>
              <select
                id="select-variety-b"
                value={compareVarietyBId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === compareVarietyAId) {
                    setCompareVarietyAId(compareVarietyBId);
                  }
                  setCompareVarietyBId(val);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E6DEC9] font-serif font-bold text-sm text-[#18230F] focus:outline-none focus:border-[#233416] cursor-pointer"
              >
                {OLIVE_VARIETIES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.kabyleName}) — {v.oilYieldPercent}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-Side Comparison Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-[#E6DEC9] bg-[#FAF7F2]">
                  <th className="py-3.5 px-4 w-1/4 font-bold uppercase tracking-wider text-[11px] text-[#567B34]">
                    Critère Agronomique
                  </th>
                  <th className="py-3.5 px-4 w-[37.5%] border-l border-[#E6DEC9]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-[#E6AB3C] text-[#18230F] flex items-center justify-center font-extrabold text-[11px] shrink-0">
                        A
                      </span>
                      <div>
                        <span className="font-serif text-base font-bold text-[#18230F] block">
                          {varietyA.name}
                        </span>
                        <span className="font-serif italic text-xs text-[#567B34] font-normal">
                          {varietyA.kabyleName} · {varietyA.proportionKabylie}
                        </span>
                      </div>
                    </div>
                  </th>
                  <th className="py-3.5 px-4 w-[37.5%] border-l border-[#E6DEC9]">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-[#8CBE5D] text-[#18230F] flex items-center justify-center font-extrabold text-[11px] shrink-0">
                        B
                      </span>
                      <div>
                        <span className="font-serif text-base font-bold text-[#18230F] block">
                          {varietyB.name}
                        </span>
                        <span className="font-serif italic text-xs text-[#567B34] font-normal">
                          {varietyB.kabyleName} · {varietyB.proportionKabylie}
                        </span>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DEC9] text-xs">
                {/* 1. RENDEMENT EN HUILE */}
                <tr className="bg-amber-50/35 hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#18230F] align-top">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-[#E6AB3C] shrink-0" />
                      <span>Rendement en Huile</span>
                    </div>
                    <span className="text-[11px] font-normal text-[#567B34] block mt-0.5">
                      Taux d’extraction & Litres / quintal
                    </span>
                  </td>
                  <td className="py-4 px-4 border-l border-[#E6DEC9] align-top">
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <span className="font-serif text-base font-bold text-[#18230F]">
                        {varietyA.oilYieldPercent}
                      </span>
                      {metricsA.avgYieldNum >= metricsB.avgYieldNum && (
                        <span className="text-[11px] font-bold text-[#B47A16]">
                          Rendement supérieur {metricsA.avgYieldNum === metricsB.avgYieldNum ? 'ex-æquo' : ''}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E6DEC9] overflow-hidden mb-1.5">
                      <div
                        className="h-full bg-[#E6AB3C] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (metricsA.avgYieldNum / 26) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#436229]">
                      Moyenne : <strong>{metricsA.yieldRangeLiters}</strong> en chaîne continue à froid.
                    </span>
                  </td>
                  <td className="py-4 px-4 border-l border-[#E6DEC9] align-top">
                    <div className="flex items-baseline justify-between gap-2 mb-1.5">
                      <span className="font-serif text-base font-bold text-[#18230F]">
                        {varietyB.oilYieldPercent}
                      </span>
                      {metricsB.avgYieldNum >= metricsA.avgYieldNum && (
                        <span className="text-[11px] font-bold text-[#31491E]">
                          Rendement supérieur {metricsA.avgYieldNum === metricsB.avgYieldNum ? 'ex-æquo' : ''}
                        </span>
                      )}
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E6DEC9] overflow-hidden mb-1.5">
                      <div
                        className="h-full bg-[#567B34] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (metricsB.avgYieldNum / 26) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#436229]">
                      Moyenne : <strong>{metricsB.yieldRangeLiters}</strong> en chaîne continue à froid.
                    </span>
                  </td>
                </tr>

                {/* 2. PRÉCOCITÉ & PÉRIODE DE RÉCOLTE */}
                <tr className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#18230F] align-top">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#567B34] shrink-0" />
                      <span>Précocité & Récolte</span>
                    </div>
                    <span className="text-[11px] font-normal text-[#567B34] block mt-0.5">
                      Entrée en véraison & calendrier
                    </span>
                  </td>
                  <td className="py-4 px-4 border-l border-[#E6DEC9] align-top space-y-1">
                    <div className="font-bold text-[#18230F]">
                      {metricsA.precocityBadge}
                    </div>
                    <div className="text-[11px] text-[#567B34] font-semibold">
                      Fenêtre : {varietyA.harvestWindow}
                    </div>
                    <p className="text-[#436229] leading-relaxed">
                      {metricsA.precocityDetail}
                    </p>
                  </td>
                  <td className="py-4 px-4 border-l border-[#E6DEC9] align-top space-y-1">
                    <div className="font-bold text-[#18230F]">
                      {metricsB.precocityBadge}
                    </div>
                    <div className="text-[11px] text-[#567B34] font-semibold">
                      Fenêtre : {varietyB.harvestWindow}
                    </div>
                    <p className="text-[#436229] leading-relaxed">
                      {metricsB.precocityDetail}
                    </p>
                  </td>
                </tr>

                {/* 3. RÉSISTANCE & RUSTICITÉ PÉDOCLIMATIQUE */}
                <tr className="bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#18230F] align-top">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#31491E] shrink-0" />
                      <span>Résistance & Rusticité</span>
                    </div>
                    <span className="text-[11px] font-normal text-[#567B34] block mt-0.5">
                      Gel, sécheresse & étage bioclimatique
                    </span>
                  </td>
                  <td className="py-4 px-4 border-l border-[#E6DEC9] align-top space-y-1.5">
                    <p className="font-semibold text-[#18230F] leading-relaxed">
                      {varietyA.resistance}
                    </p>
                    <ul className="space-y-1 text-[11px] text-[#436229]">
                      <li>
                        • <strong>Froid & Gel :</strong> {metricsA.coldTolerance}
                      </li>
                      <li>
                        • <strong>Sécheresse :</strong> {metricsA.droughtTolerance}
                      </li>
                      <li>
                        • <strong>Terroir type :</strong> {metricsA.altitudeZone}
                      </li>
                    </ul>
                  </td>
                  <td className="py-4 px-4 border-l border-[#E6DEC9] align-top space-y-1.5">
                    <p className="font-semibold text-[#18230F] leading-relaxed">
                      {varietyB.resistance}
                    </p>
                    <ul className="space-y-1 text-[11px] text-[#436229]">
                      <li>
                        • <strong>Froid & Gel :</strong> {metricsB.coldTolerance}
                      </li>
                      <li>
                        • <strong>Sécheresse :</strong> {metricsB.droughtTolerance}
                      </li>
                      <li>
                        • <strong>Terroir type :</strong> {metricsB.altitudeZone}
                      </li>
                    </ul>
                  </td>
                </tr>

                {/* 4. MORPHOLOGIE DU FRUIT & VOCATION */}
                <tr className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#18230F] align-top">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-[#567B34] shrink-0" />
                      <span>Calibre & Vocation</span>
                    </div>
                    <span className="text-[11px] font-normal text-[#567B34] block mt-0.5">
                      Morphologie de la drupe & usage
                    </span>
                  </td>
                  <td className="py-4 px-4 border-l border-[#E6DEC9] align-top space-y-1">
                    <span className="font-bold text-[#31491E] block">
                      {varietyA.category === 'oil'
                        ? 'Variété exclusivement à Huile'
                        : 'Variété Double Fin (Huile & Olive de Table)'}
                    </span>
                    <p className="text-[#436229] leading-relaxed">
                      {varietyA.fruitCharacteristics}
                    </p>
                  </td>
                  <td className="py-4 px-4 border-l border-[#E6DEC9] align-top space-y-1">
                    <span className="font-bold text-[#31491E] block">
                      {varietyB.category === 'oil'
                        ? 'Variété exclusivement à Huile'
                        : 'Variété Double Fin (Huile & Olive de Table)'}
                    </span>
                    <p className="text-[#436229] leading-relaxed">
                      {varietyB.fruitCharacteristics}
                    </p>
                  </td>
                </tr>

                {/* 5. PROFIL AROMATIQUE & POLLINISATION */}
                <tr className="bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-4 px-4 font-bold text-[#18230F] align-top">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E6AB3C] shrink-0" />
                      <span>Profil Sensoriel & Verger</span>
                    </div>
                    <span className="text-[11px] font-normal text-[#567B34] block mt-0.5">
                      Arômes dominants & pollinisation
                    </span>
                  </td>
                  <td className="py-4 px-4 border-l border-[#E6DEC9] align-top space-y-1.5">
                    <div className="font-semibold text-[#18230F]">
                      {varietyA.flavorProfile.join(' · ')}
                    </div>
                    <p className="text-[11px] text-[#567B34]">
                      {metricsA.pollinationNote}
                    </p>
                  </td>
                  <td className="py-4 px-4 border-l border-[#E6DEC9] align-top space-y-1.5">
                    <div className="font-semibold text-[#18230F]">
                      {varietyB.flavorProfile.join(' · ')}
                    </div>
                    <p className="text-[11px] text-[#567B34]">
                      {metricsB.pollinationNote}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Interactive D3.js 10-Year Yield Curve according to selected precocity */}
          <VarietyTenYearYieldChart varietyA={varietyA} varietyB={varietyB} />
        </motion.div>

        {/* Variety Comparison Matrix Card with scroll reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={cardRevealVariants}
          className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-sm"
        >
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                Tableau Récapitulatif des Variétés de la Wilaya
              </h3>
              <p className="text-xs text-[#567B34] mt-1">
                Repères techniques pour les oléiculteurs et pépiniéristes de Béjaïa ({filteredVarieties.length} sur {OLIVE_VARIETIES.length} affichée{filteredVarieties.length > 1 ? 's' : ''})
              </p>
            </div>
            <span className="text-[11px] text-[#6F9D44] font-medium">
              Partage direct sur WhatsApp, Facebook ou Twitter pour chaque variété
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242A20]">
              <thead className="bg-[#FAF7F2] text-[#31491E] font-bold border-b border-[#E6DEC9]">
                <tr>
                  <th className="py-3 px-4">Variété</th>
                  <th className="py-3 px-4">Tamazight</th>
                  <th className="py-3 px-4">Proportion</th>
                  <th className="py-3 px-4">Rendement Huile</th>
                  <th className="py-3 px-4">Période Récolte</th>
                  <th className="py-3 px-4">Profil Principal</th>
                  <th className="py-3 px-4 text-center">Partage Social</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DEC9]">
                {(filteredVarieties.length > 0 ? filteredVarieties : OLIVE_VARIETIES).map((v) => {
                  const rowShare = getVarietyShareData(v);
                  const isRowSelected = selectedVariety.id === v.id;
                  return (
                    <tr
                      key={v.id}
                      onClick={() => handleSelectVariety(v)}
                      className={`cursor-pointer transition-colors ${
                        isRowSelected
                          ? 'bg-[#E8F4D9]/65 hover:bg-[#E8F4D9]'
                          : 'hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-[#18230F]">
                        <div className="flex items-center gap-2">
                          {isRowSelected && (
                            <span
                              className="w-2 h-2 rounded-full bg-[#233416] shrink-0"
                              aria-hidden="true"
                            />
                          )}
                          <span>{v.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-serif italic text-[#567B34]">
                        {v.kabyleName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold tabular-nums">{v.proportionKabylie}</td>
                      <td className="py-3.5 px-4 font-bold text-[#E6AB3C] tabular-nums">
                        {v.oilYieldPercent}
                      </td>
                      <td className="py-3.5 px-4">{v.harvestWindow}</td>
                      <td className="py-3.5 px-4 text-[#436229]">{v.flavorProfile[0]}</td>
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <a
                            href={rowShare.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Partager ${v.name} sur WhatsApp`}
                            title={`Partager ${v.name} sur WhatsApp`}
                            className="p-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.115-.515-1.745-.718-2.884-2.483-2.97-2.6-.088-.114-.717-.954-.717-1.821 0-.867.452-1.294.613-1.467.161-.173.351-.217.468-.217.117 0 .234.001.336.006.107.005.25-.041.391.298.144.348.491 1.199.534 1.286.044.087.073.189.015.305-.058.115-.088.188-.175.289-.088.102-.185.228-.264.306-.088.087-.18.182-.077.359.102.176.455.751.977 1.216.671.597 1.236.782 1.412.87.175.087.278.073.38-.044.103-.116.44-.514.557-.69.117-.175.234-.145.394-.087.161.058 1.02.481 1.195.568.176.088.293.131.336.205.044.072.044.419-.1.824z" />
                              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.662 1.448 5.178L2.05 21.95l4.893-1.365C8.423 21.492 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.666 0-3.21-.52-4.484-1.411l-.322-.224-2.91.812.815-2.873-.243-.349A8.006 8.006 0 014 12c0-4.411 3.589-8.05 8-8.05 4.411 0 8 3.639 8 8.05 0 4.411-3.589 8.05-8 8.05z" />
                            </svg>
                          </a>
                          <a
                            href={rowShare.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Partager ${v.name} sur Facebook`}
                            title={`Partager ${v.name} sur Facebook`}
                            className="p-1.5 rounded-lg bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                          <a
                            href={rowShare.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Partager ${v.name} sur Twitter / X`}
                            title={`Partager ${v.name} sur Twitter / X`}
                            className="p-1.5 rounded-lg bg-gray-900/10 hover:bg-gray-900 text-gray-800 hover:text-white transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenShare(v)}
                            className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] hover:border-[#8CBE5D] transition-colors cursor-pointer"
                            title={`Plus d'options de partage pour ${v.name}`}
                          >
                            <Share2 className="w-3.5 h-3.5 text-[#E6AB3C]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Social Share Modal */}
        <ShareVarietyModal
          variety={varietyToShare}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </div>
    </section>
  );
};
