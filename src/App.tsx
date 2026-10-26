/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ArrowUp, ListOrdered, ArrowRight } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { SiloNavigation } from './components/SiloNavigation';
import { HeroSection } from './components/HeroSection';
import { AdoioSection } from './components/AdoioSection';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';

// Lazy-loaded below-the-fold sections & modals for fast initial paint on mobile/3G
const OfflineGuidesModal = lazy(() =>
  import('./components/OfflineGuidesModal').then((m) => ({ default: m.OfflineGuidesModal }))
);
const StatsAndPotential = lazy(() =>
  import('./components/StatsAndPotential').then((m) => ({ default: m.StatsAndPotential }))
);
const OliveLandscapesGallery = lazy(() =>
  import('./components/OliveLandscapesGallery').then((m) => ({ default: m.OliveLandscapesGallery }))
);
const InteractiveOliveMap = lazy(() =>
  import('./components/InteractiveOliveMap').then((m) => ({ default: m.InteractiveOliveMap }))
);
const MillsDirectory = lazy(() =>
  import('./components/MillsDirectory').then((m) => ({ default: m.MillsDirectory }))
);
const VarietiesGuide = lazy(() =>
  import('./components/VarietiesGuide').then((m) => ({ default: m.VarietiesGuide }))
);
const TastingAndQuality = lazy(() =>
  import('./components/TastingAndQuality').then((m) => ({ default: m.TastingAndQuality }))
);
const OilCompetitionSection = lazy(() =>
  import('./components/OilCompetitionSection').then((m) => ({ default: m.OilCompetitionSection }))
);
const OliveGlossarySection = lazy(() =>
  import('./components/OliveGlossarySection').then((m) => ({ default: m.OliveGlossarySection }))
);
const YieldSimulator = lazy(() =>
  import('./components/YieldSimulator').then((m) => ({ default: m.YieldSimulator }))
);
const OrganicFertilizationCalculator = lazy(() =>
  import('./components/OrganicFertilizationCalculator').then((m) => ({
    default: m.OrganicFertilizationCalculator,
  }))
);
const IrrigationGuide = lazy(() =>
  import('./components/IrrigationGuide').then((m) => ({ default: m.IrrigationGuide }))
);
const ByproductsValorizationSection = lazy(() =>
  import('./components/ByproductsValorizationSection').then((m) => ({
    default: m.ByproductsValorizationSection,
  }))
);
const PhytosanitaryDiagnosis = lazy(() =>
  import('./components/PhytosanitaryDiagnosis').then((m) => ({ default: m.PhytosanitaryDiagnosis }))
);
const CalendarAndPractices = lazy(() =>
  import('./components/CalendarAndPractices').then((m) => ({ default: m.CalendarAndPractices }))
);
const AdoioAssistantChatbot = lazy(() =>
  import('./components/AdoioAssistantChatbot').then((m) => ({ default: m.AdoioAssistantChatbot }))
);
const FaqOleiculture = lazy(() =>
  import('./components/FaqOleiculture').then((m) => ({ default: m.FaqOleiculture }))
);
const AdhesionModal = lazy(() =>
  import('./components/AdhesionModal').then((m) => ({ default: m.AdhesionModal }))
);
const SitemapModal = lazy(() =>
  import('./components/SitemapModal').then((m) => ({ default: m.SitemapModal }))
);

const SectionSkeleton: React.FC<{ id?: string; label: string }> = ({ id, label }) => (
  <div
    id={id}
    role="status"
    aria-live="polite"
    aria-label={`Chargement de la section ${label}`}
    className="py-16 px-4 max-w-7xl mx-auto"
  >
    <div className="rounded-3xl border border-[#E6DEC9] bg-white/60 p-8 animate-pulse space-y-4">
      <div className="h-4 w-48 bg-[#E8F4D9] rounded" />
      <div className="h-8 w-80 max-w-full bg-[#E6DEC9]/70 rounded-lg" />
      <div className="h-32 w-full bg-[#F4EEE1]/80 rounded-2xl" />
    </div>
  </div>
);

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
}

function getAdaptiveRootMargin(): string {
  try {
    const nav = navigator as Navigator & { connection?: NetworkInformationLike };
    const conn = nav.connection;
    if (!conn) return '650px 0px';
    if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
      // Ultra-tight prefetch window on 2G / Save-Data to avoid competing with visible assets
      return '80px 0px';
    }
    if (conn.effectiveType === '3g' || (typeof conn.downlink === 'number' && conn.downlink < 1.5)) {
      return '260px 0px';
    }
    return '650px 0px';
  } catch {
    return '650px 0px';
  }
}

interface DeferredSectionProps {
  id: string;
  label: string;
  forceMount?: boolean;
  children: React.ReactNode;
}

const DeferredSection: React.FC<DeferredSectionProps> = ({
  id,
  label,
  forceMount = false,
  children,
}) => {
  const [shouldRender, setShouldRender] = useState<boolean>(forceMount);
  const placeholderRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (forceMount && !shouldRender) {
      setShouldRender(true);
    }
  }, [forceMount, shouldRender]);

  useEffect(() => {
    if (shouldRender) return;

    const handleBeforePrint = () => setShouldRender(true);
    window.addEventListener('beforeprint', handleBeforePrint);

    const node = placeholderRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShouldRender(true);
      return () => window.removeEventListener('beforeprint', handleBeforePrint);
    }

    // Granular pre-fetch margin adapted to 2G / 3G / Save-Data conditions
    const margin = getAdaptiveRootMargin();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      window.removeEventListener('beforeprint', handleBeforePrint);
    };
  }, [shouldRender]);

  if (!shouldRender) {
    return (
      <div ref={placeholderRef}>
        <SectionSkeleton id={id} label={label} />
      </div>
    );
  }

  return <Suspense fallback={<SectionSkeleton id={id} label={label} />}>{children}</Suspense>;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('adoio');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdhesionOpen, setIsAdhesionOpen] = useState<boolean>(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);
  const [isOfflineGuidesOpen, setIsOfflineGuidesOpen] = useState<boolean>(false);
  const [offlineCachedCount, setOfflineCachedCount] = useState<number>(5);
  const [showFloatingTop, setShowFloatingTop] = useState<boolean>(false);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState<boolean>(false);
  const [forcedSections, setForcedSections] = useState<Record<string, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('adoio_theme_mode');
      if (savedTheme === 'dark') return true;
      if (savedTheme === 'light') return false;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('adoio_theme_mode', isDarkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Unified scroll handler with URL hash sync & instant lazy section hydration
  const scrollToSection = (sectionId: string) => {
    // Normalize aliases for backward compatibility & SEO slugs
    const slugMap: Record<string, string> = {
      'terroir-adoio': 'adoio',
      'missions-adoio': 'adoio',
      'chiffres-verger': 'potential',
      'paysages-oleicoles': 'galerie-paysages',
      'galerie': 'galerie-paysages',
      'carte-moulins': 'carte-interactive',
      'carte-bassins': 'carte-interactive',
      'annuaire-huileries': 'annuaire',
      'varietes-degustation': 'varietes',
      'guide-varietal': 'varietes',
      'degustation-qualite': 'degustation',
      'guide-consommateur': 'degustation',
      'guide-consommateur-adoio': 'degustation',
      'concours': 'concours',
      'concours-huile': 'concours',
      'meilleure-huile': 'concours',
      'palmares-medailles': 'concours',
      'fete-olive': 'concours',
      'glossaire': 'glossaire-oleicole',
      'glossaire-oleicole': 'glossaire-oleicole',
      'lexique-oleicole': 'glossaire-oleicole',
      'outils-pratiques': 'simulateur',
      'simulateur-recolte': 'simulateur',
      'comparateur-varietes': 'simulateur',
      'convertisseur-huile': 'simulateur',
      'alertes-recolte': 'alertes-recolte-optimale',
      'alertes-recolte-optimale': 'alertes-recolte-optimale',
      'calculateur-fertilisation': 'fertilisation',
      'fertilisation': 'fertilisation',
      'guide-irrigation': 'irrigation',
      'irrigation': 'irrigation',
      'besoins-eau': 'irrigation',
      'sous-produits': 'sous-produits',
      'valorisation-sous-produits': 'sous-produits',
      'grignons-margines': 'sous-produits',
      'diagnostic-phytosanitaire': 'diagnostic-phytosanitaire',
      'diagnostic': 'diagnostic-phytosanitaire',
      'maladies-olivier': 'diagnostic-phytosanitaire',
      'calendrier-agronomique': 'pratiques',
      'alertes-meteo': 'alertes-meteo',
      'alertes-gel': 'alertes-meteo',
      'assistant-adoio': 'assistant-adoio',
      'chatbot-adoio': 'assistant-adoio',
      'faq-pratiques': 'faq-oleiculture',
      'faq': 'faq-oleiculture',
    };

    const targetId = slugMap[sectionId] || sectionId;
    const parentDeferredId =
      targetId === 'alertes-meteo'
        ? 'pratiques'
        : targetId === 'alertes-recolte-optimale'
          ? 'simulateur'
          : targetId;

    // Immediately mount the target deferred section (and preceding sections if needed)
    setForcedSections((prev) => ({
      ...prev,
      [parentDeferredId]: true,
      [targetId]: true,
    }));

    if (targetId !== 'hero' && targetId !== 'alertes-meteo' && targetId !== 'alertes-recolte-optimale') {
      setActiveTab(targetId);
    } else if (targetId === 'alertes-meteo') {
      setActiveTab('pratiques');
    } else if (targetId === 'alertes-recolte-optimale') {
      setActiveTab('simulateur');
    }

    const performScroll = (attemptsLeft: number) => {
      const element = document.getElementById(targetId) || document.getElementById(parentDeferredId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState(null, '', `#${targetId}`);
      } else if (attemptsLeft > 0) {
        setTimeout(() => performScroll(attemptsLeft - 1), 80);
      }
    };

    performScroll(6);
  };

  // Scroll to hash on page load & listen to hashchange
  useEffect(() => {
    const applyHashNavigation = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setTimeout(() => {
          scrollToSection(hash);
        }, 200);
      }
    };

    applyHashNavigation();
    window.addEventListener('hashchange', applyHashNavigation);
    return () => window.removeEventListener('hashchange', applyHashNavigation);
  }, []);

  // Track active section via viewport-band IntersectionObserver (works accurately on very tall sections)
  useEffect(() => {
    const sectionIds = [
      'adoio',
      'potential',
      'galerie-paysages',
      'carte-interactive',
      'annuaire',
      'varietes',
      'degustation',
      'concours',
      'glossaire-oleicole',
      'simulateur',
      'fertilisation',
      'irrigation',
      'sous-produits',
      'diagnostic-phytosanitaire',
      'pratiques',
      'assistant-adoio',
      'faq-oleiculture',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        // Narrow reading detection band below sticky headers (~22% from top to 68% from bottom)
        rootMargin: '-22% 0px -68% 0px',
        threshold: [0, 0.05],
      }
    );

    const observedElements = new Set<Element>();
    const observeAllSections = () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && !observedElements.has(el)) {
          observedElements.add(el);
          observer.observe(el);
        }
      });
    };

    observeAllSections();

    const mainEl = document.getElementById('main-content');
    const mutationObserver = new MutationObserver(() => {
      observeAllSections();
    });
    if (mainEl) {
      mutationObserver.observe(mainEl, { childList: true, subtree: true });
    }

    const handleFloatingVisibility = () => {
      setShowFloatingTop(window.scrollY > 650);
    };
    window.addEventListener('scroll', handleFloatingVisibility, { passive: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
      window.removeEventListener('scroll', handleFloatingVisibility);
    };
  }, []);

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    scrollToSection('annuaire');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#242A20]">
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Accessibility Skip Link (WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-[#18230F] focus:text-[#FAF7F2] focus:font-bold focus:text-xs focus:shadow-lg"
      >
        Aller directement au contenu principal
      </a>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={scrollToSection}
        onOpenAdhesion={() => setIsAdhesionOpen(true)}
        onOpenSimulator={() => scrollToSection('simulateur')}
        onOpenSitemap={() => setIsSitemapOpen(true)}
        onOpenOfflineGuides={() => setIsOfflineGuidesOpen(true)}
        offlineCachedCount={offlineCachedCount}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Thematic Silo Navigation Bar (Breadcrumb + 4 Topic Clusters Switcher) */}
      <SiloNavigation
        activeSectionId={activeTab}
        onNavigate={scrollToSection}
        onOpenSitemap={() => setIsSitemapOpen(true)}
      />

      {/* Main Content Organized into 4 Thematic Silos */}
      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onSearch={handleHeroSearch}
          onOpenSimulator={() => scrollToSection('simulateur')}
          onExploreMills={() => scrollToSection('annuaire')}
          onExploreAdoio={() => scrollToSection('adoio')}
          onExploreMap={() => scrollToSection('carte-interactive')}
          onExploreCompetition={() => scrollToSection('concours')}
        />

        {/* ============================================================ */}
        {/* SILO 1 : TERROIR & ASSOCIATION ADOIO (Missions, 25 ans, Chiffres) */}
        {/* ============================================================ */}
        <div id="terroir-adoio" className="scroll-mt-44" role="region" aria-label="Pilier 1 : Terroir et Association ADOIO">
          {/* ADOIO Association Section (Missions, Jubilé 25 ans, Bureau) */}
          <AdoioSection onOpenAdhesion={() => setIsAdhesionOpen(true)} />

          {/* Potentialities & Official Figures (Verger, 52 communes) */}
          <DeferredSection
            id="potential"
            label="Chiffres & Verger"
            forceMount={Boolean(forcedSections['potential'])}
          >
            <StatsAndPotential />
          </DeferredSection>

          {/* Olive Landscapes Gallery of Béjaïa */}
          <DeferredSection
            id="galerie-paysages"
            label="Galerie des Paysages"
            forceMount={Boolean(forcedSections['galerie-paysages'])}
          >
            <OliveLandscapesGallery />
          </DeferredSection>

          {/* Inter-Silo Contextual Bridge : Silo 1 -> Silo 2 */}
          <div className="bg-[#233416] text-[#FAF7F2] border-y border-[#8CBE5D]/30 py-5 px-4 no-print">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-[#E6AB3C] text-[#18230F] text-[11px] font-extrabold uppercase tracking-wider">
                  Continuité du Parcours · Pilier 2
                </span>
                <p className="text-xs sm:text-sm text-[#E8F4D9]">
                  Explorez maintenant la <strong>géolocalisation SIG des 52 communes</strong> et le répertoire des <strong>448 huileries de Béjaïa</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => scrollToSection('carte-interactive')}
                  className="px-3.5 py-2 rounded-xl bg-[#8CBE5D] hover:bg-[#729e4b] text-[#18230F] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Ouvrir la Carte SIG</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => scrollToSection('annuaire')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer"
                >
                  Annuaire des 448 Moulins
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SILO 2 : CARTOGRAPHIE & ANNUAIRE DES HUILERIES (SIG & 448 moulins) */}
        {/* ============================================================ */}
        <div id="carte-moulins" className="scroll-mt-44 cv-auto" role="region" aria-label="Pilier 2 : Cartographie SIG et Annuaire des Huileries">
          {/* Interactive Geographical Map of Communes & Registered Mills */}
          <DeferredSection
            id="carte-interactive"
            label="Carte Interactive SIG"
            forceMount={Boolean(forcedSections['carte-interactive'])}
          >
            <InteractiveOliveMap />
          </DeferredSection>

          {/* Mills & Producers Directory (Modern continuous & traditional) */}
          <DeferredSection
            id="annuaire"
            label="Annuaire des 448 Huileries"
            forceMount={Boolean(forcedSections['annuaire']) || Boolean(searchQuery)}
          >
            <MillsDirectory initialSearch={searchQuery} />
          </DeferredSection>

          {/* Inter-Silo Contextual Bridge : Silo 2 -> Silo 3 */}
          <div className="bg-[#233416] text-[#FAF7F2] border-y border-[#8CBE5D]/30 py-5 px-4 no-print">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-[#E6AB3C] text-[#18230F] text-[11px] font-extrabold uppercase tracking-wider">
                  Continuité du Parcours · Pilier 3
                </span>
                <p className="text-xs sm:text-sm text-[#E8F4D9]">
                  Découvrez les <strong>variétés autochtones kabyles</strong>, le <strong>Guide officiel du Consommateur ADOIO</strong>, le <strong>Concours 2026</strong> et le <strong>Glossaire Oléicole</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => scrollToSection('varietes')}
                  className="px-3.5 py-2 rounded-xl bg-[#8CBE5D] hover:bg-[#729e4b] text-[#18230F] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Guide Variétal</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => scrollToSection('degustation')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer"
                >
                  Guide du Consommateur
                </button>
                <button
                  onClick={() => scrollToSection('concours')}
                  className="px-3.5 py-2 rounded-xl bg-[#E6AB3C]/20 hover:bg-[#E6AB3C]/30 text-[#E6AB3C] text-xs font-bold border border-[#E6AB3C]/40 transition-colors cursor-pointer"
                >
                  Concours 2026
                </button>
                <button
                  onClick={() => scrollToSection('glossaire-oleicole')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer"
                >
                  Glossaire Oléicole
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SILO 3 : PATRIMOINE VARIÉTAL & DÉGUSTATION (Génétique & Normes COI) */}
        {/* ============================================================ */}
        <div id="varietes-degustation" className="scroll-mt-44 cv-auto" role="region" aria-label="Pilier 3 : Variétés, Guide du Consommateur, Concours et Glossaire Oléicole">
          {/* Kabylie Varieties Guide with Social Sharing */}
          <DeferredSection
            id="varietes"
            label="Guide des Variétés"
            forceMount={Boolean(forcedSections['varietes'])}
          >
            <VarietiesGuide />
          </DeferredSection>

          {/* Tasting & Quality Standards (Consumer Guide ADOIO, COI Norms, Sensory) */}
          <DeferredSection
            id="degustation"
            label="Guide du Consommateur & Normes COI"
            forceMount={Boolean(forcedSections['degustation'])}
          >
            <TastingAndQuality />
          </DeferredSection>

          {/* Annual Competition for the Best Olive Oil of the Season (Fête de l'Olive) */}
          <DeferredSection
            id="concours"
            label="Concours Meilleure Huile 2026"
            forceMount={Boolean(forcedSections['concours'])}
          >
            <OilCompetitionSection />
          </DeferredSection>

          {/* Technical Olive-Growing Glossary for Producers & Millers */}
          <DeferredSection
            id="glossaire-oleicole"
            label="Glossaire Oléicole"
            forceMount={Boolean(forcedSections['glossaire-oleicole'])}
          >
            <OliveGlossarySection onNavigate={scrollToSection} />
          </DeferredSection>

          {/* Inter-Silo Contextual Bridge : Silo 3 -> Silo 4 */}
          <div className="bg-[#233416] text-[#FAF7F2] border-y border-[#8CBE5D]/30 py-5 px-4 no-print">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-[#E6AB3C] text-[#18230F] text-[11px] font-extrabold uppercase tracking-wider">
                  Continuité du Parcours · Pilier 4
                </span>
                <p className="text-xs sm:text-sm text-[#E8F4D9]">
                  Passez à l’action avec le <strong>Simulateur Comparatif de Variétés</strong>, la <strong>Valorisation des Sous-Produits</strong>, le <strong>Diagnostic Bio</strong> et l’<strong>Assistant Agronomique ADOIO</strong>.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => scrollToSection('simulateur')}
                  className="px-3.5 py-2 rounded-xl bg-[#8CBE5D] hover:bg-[#729e4b] text-[#18230F] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Simulateur & Comparateur</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => scrollToSection('sous-produits')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer"
                >
                  Sous-Produits
                </button>
                <button
                  onClick={() => scrollToSection('diagnostic-phytosanitaire')}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer"
                >
                  Diagnostic Bio
                </button>
                <button
                  onClick={() => scrollToSection('assistant-adoio')}
                  className="px-3.5 py-2 rounded-xl bg-[#E6AB3C]/20 hover:bg-[#E6AB3C]/30 text-[#E6AB3C] text-xs font-bold border border-[#E6AB3C]/40 transition-colors cursor-pointer"
                >
                  Assistant ADOIO
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SILO 4 : OUTILS & BONNES PRATIQUES (Simulateur Recharts & Calendrier) */}
        {/* ============================================================ */}
        <div id="outils-pratiques" className="scroll-mt-44 cv-auto" role="region" aria-label="Pilier 4 : Outils Agronomiques, Sous-Produits, Diagnostic et Bonnes Pratiques">
          {/* Harvest & Multi-Season Yield Simulator with Carbon Footprint */}
          <DeferredSection
            id="simulateur"
            label="Simulateur de Rendement"
            forceMount={Boolean(forcedSections['simulateur'])}
          >
            <YieldSimulator />
          </DeferredSection>

          {/* Organic Fertilization Calculator based on parcel size & olive tree age */}
          <div id="fertilisation" className="scroll-mt-44 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <DeferredSection
              id="fertilisation-module"
              label="Calculateur de Fertilisation"
              forceMount={Boolean(forcedSections['fertilisation'])}
            >
              <OrganicFertilizationCalculator />
            </DeferredSection>
          </div>

          {/* Interactive Irrigation Guide & Water Needs Simulator */}
          <DeferredSection
            id="irrigation"
            label="Guide d'Irrigation"
            forceMount={Boolean(forcedSections['irrigation'])}
          >
            <IrrigationGuide />
          </DeferredSection>

          {/* Valorization of Olive By-products (Grignons, Margines, Compost, Biomass, Cosmetics, Tourism) */}
          <DeferredSection
            id="sous-produits"
            label="Valorisation des Sous-Produits"
            forceMount={Boolean(forcedSections['sous-produits'])}
          >
            <ByproductsValorizationSection />
          </DeferredSection>

          {/* Interactive Phytosanitary Diagnosis & Bio Treatments Module */}
          <DeferredSection
            id="diagnostic-phytosanitaire"
            label="Diagnostic Phytosanitaire Bio"
            forceMount={Boolean(forcedSections['diagnostic-phytosanitaire'])}
          >
            <PhytosanitaryDiagnosis />
          </DeferredSection>

          {/* Seasonal Calendar & Best Agricultural Practices */}
          <DeferredSection
            id="pratiques"
            label="Calendrier Agronomique"
            forceMount={Boolean(forcedSections['pratiques'])}
          >
            <CalendarAndPractices />
          </DeferredSection>

          {/* AI-Powered Agronomic Assistant Chatbot (Pruning, Olive Diseases & Bejaia Calendar) */}
          <DeferredSection
            id="assistant-adoio"
            label="Assistant Agronomique ADOIO"
            forceMount={Boolean(forcedSections['assistant-adoio'])}
          >
            <AdoioAssistantChatbot />
          </DeferredSection>

          {/* Interactive FAQ on Pruning, Bio Treatments, and Harvesting */}
          <DeferredSection
            id="faq-oleiculture"
            label="FAQ Oléicole"
            forceMount={Boolean(forcedSections['faq-oleiculture'])}
          >
            <FaqOleiculture
              onOpenAdhesion={() => setIsAdhesionOpen(true)}
              onOpenSimulator={() => scrollToSection('simulateur')}
            />
          </DeferredSection>
        </div>
      </main>

      {/* Floating Quick-Access & Back-to-Top Controller */}
      {showFloatingTop && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 no-print animate-in fade-in slide-in-from-bottom-4 duration-200">
          <button
            onClick={() => setIsSitemapOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-[#233416]/95 hover:bg-[#18230F] text-[#FAF7F2] text-xs font-bold shadow-xl border border-[#8CBE5D]/40 flex items-center gap-2 backdrop-blur-md transition-all cursor-pointer tabular-nums"
            title="Ouvrir le Plan du Site et l'Index des 17 chapitres"
          >
            <ListOrdered className="w-4 h-4 text-[#E6AB3C]" aria-hidden="true" />
            <span className="hidden sm:inline">Index Rapide (17)</span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2.5 rounded-2xl bg-[#31491E] hover:bg-[#233416] text-white shadow-xl border border-[#8CBE5D]/40 transition-all cursor-pointer"
            title="Remonter tout en haut de la page"
            aria-label="Remonter en haut de la page"
          >
            <ArrowUp className="w-4 h-4 text-[#E6AB3C]" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Footer with 4-pillar structured links */}
      <Footer
        onNavClick={scrollToSection}
        onOpenAdhesion={() => setIsAdhesionOpen(true)}
        onOpenSitemap={() => setIsSitemapOpen(true)}
      />

      {/* Membership / Contact Modal (Loaded on demand) */}
      {isAdhesionOpen && (
        <Suspense fallback={null}>
          <AdhesionModal
            isOpen={isAdhesionOpen}
            onClose={() => setIsAdhesionOpen(false)}
          />
        </Suspense>
      )}

      {/* Full Sitemap & Thematic Index Modal (Loaded on demand) */}
      {isSitemapOpen && (
        <Suspense fallback={null}>
          <SitemapModal
            isOpen={isSitemapOpen}
            onClose={() => setIsSitemapOpen(false)}
            onNavigate={scrollToSection}
          />
        </Suspense>
      )}

      {/* Offline Guides & Service Worker Cache Storage Modal (Lazy-loaded on demand) */}
      {isOfflineGuidesOpen && (
        <Suspense fallback={null}>
          <OfflineGuidesModal
            isOpen={isOfflineGuidesOpen}
            onClose={() => setIsOfflineGuidesOpen(false)}
            onNavigateToSection={scrollToSection}
            onCacheCountChange={setOfflineCachedCount}
          />
        </Suspense>
      )}

      {/* Offline Status & Cached Information Indicator for Isolated Rural Zones */}
      <OfflineIndicator />
    </div>
  );
}
