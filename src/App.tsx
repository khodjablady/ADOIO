/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SiloNavigation } from './components/SiloNavigation';
import { HeroSection } from './components/HeroSection';
import { StatsAndPotential } from './components/StatsAndPotential';
import { OliveLandscapesGallery } from './components/OliveLandscapesGallery';
import { InteractiveOliveMap } from './components/InteractiveOliveMap';
import { AdoioSection } from './components/AdoioSection';
import { MillsDirectory } from './components/MillsDirectory';
import { VarietiesGuide } from './components/VarietiesGuide';
import { YieldSimulator } from './components/YieldSimulator';
import { OrganicFertilizationCalculator } from './components/OrganicFertilizationCalculator';
import { IrrigationGuide } from './components/IrrigationGuide';
import { TastingAndQuality } from './components/TastingAndQuality';
import { OilCompetitionSection } from './components/OilCompetitionSection';
import { CalendarAndPractices } from './components/CalendarAndPractices';
import { FaqOleiculture } from './components/FaqOleiculture';
import { AdhesionModal } from './components/AdhesionModal';
import { SitemapModal } from './components/SitemapModal';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('adoio');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdhesionOpen, setIsAdhesionOpen] = useState<boolean>(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState<boolean>(false);

  // Unified scroll handler with URL hash sync
  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    
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
      'concours': 'concours',
      'concours-huile': 'concours',
      'meilleure-huile': 'concours',
      'fete-olive': 'concours',
      'outils-pratiques': 'simulateur',
      'simulateur-recolte': 'simulateur',
      'alertes-recolte': 'alertes-recolte-optimale',
      'alertes-recolte-optimale': 'alertes-recolte-optimale',
      'calculateur-fertilisation': 'fertilisation',
      'fertilisation': 'fertilisation',
      'guide-irrigation': 'irrigation',
      'irrigation': 'irrigation',
      'besoins-eau': 'irrigation',
      'calendrier-agronomique': 'pratiques',
      'alertes-meteo': 'alertes-meteo',
      'alertes-gel': 'alertes-meteo',
      'faq-pratiques': 'faq-oleiculture',
      'faq': 'faq-oleiculture',
    };

    const targetId = slugMap[sectionId] || sectionId;
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${targetId}`);
    }
  };

  // Scroll to hash on page load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 300);
    }
  }, []);

  // Track active section via IntersectionObserver for automatic Silo & Breadcrumb update
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
      'simulateur',
      'fertilisation',
      'irrigation',
      'pratiques',
      'faq-oleiculture',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            setActiveTab(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: [0.25, 0.5],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    scrollToSection('annuaire');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#242A20]">
      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={scrollToSection}
        onOpenAdhesion={() => setIsAdhesionOpen(true)}
        onOpenSimulator={() => scrollToSection('simulateur')}
        onOpenSitemap={() => setIsSitemapOpen(true)}
      />

      {/* Thematic Silo Navigation Bar (Breadcrumb + 4 Topic Clusters Switcher) */}
      <SiloNavigation
        activeSectionId={activeTab}
        onNavigate={scrollToSection}
        onOpenSitemap={() => setIsSitemapOpen(true)}
      />

      {/* Main Content Organized into 4 Thematic Silos */}
      <main className="flex-1">
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
        <div id="terroir-adoio" className="scroll-mt-36">
          {/* ADOIO Association Section (Missions, Jubilé 25 ans, Bureau) */}
          <AdoioSection onOpenAdhesion={() => setIsAdhesionOpen(true)} />

          {/* Potentialities & Official Figures (Verger, 52 communes) */}
          <StatsAndPotential />

          {/* Olive Landscapes Gallery of Béjaïa */}
          <OliveLandscapesGallery />
        </div>

        {/* ============================================================ */}
        {/* SILO 2 : CARTOGRAPHIE & ANNUAIRE DES HUILERIES (SIG & 448 moulins) */}
        {/* ============================================================ */}
        <div id="carte-moulins" className="scroll-mt-36">
          {/* Interactive Geographical Map of Communes & Registered Mills */}
          <InteractiveOliveMap />

          {/* Mills & Producers Directory (Modern continuous & traditional) */}
          <MillsDirectory initialSearch={searchQuery} />
        </div>

        {/* ============================================================ */}
        {/* SILO 3 : PATRIMOINE VARIÉTAL & DÉGUSTATION (Génétique & Normes COI) */}
        {/* ============================================================ */}
        <div id="varietes-degustation" className="scroll-mt-36">
          {/* Kabylie Varieties Guide with Social Sharing */}
          <VarietiesGuide />

          {/* Tasting & Quality Standards (COI Norms, Acidity, Sensory) */}
          <TastingAndQuality />

          {/* Annual Competition for the Best Olive Oil of the Season (Fête de l'Olive) */}
          <OilCompetitionSection />
        </div>

        {/* ============================================================ */}
        {/* SILO 4 : OUTILS & BONNES PRATIQUES (Simulateur Recharts & Calendrier) */}
        {/* ============================================================ */}
        <div id="outils-pratiques" className="scroll-mt-36">
          {/* Harvest & Multi-Season Yield Simulator with Carbon Footprint */}
          <YieldSimulator />

          {/* Organic Fertilization Calculator based on parcel size & olive tree age */}
          <div id="fertilisation" className="scroll-mt-36 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <OrganicFertilizationCalculator />
          </div>

          {/* Interactive Irrigation Guide & Water Needs Simulator */}
          <IrrigationGuide />

          {/* Seasonal Calendar & Best Agricultural Practices */}
          <CalendarAndPractices />

          {/* Interactive FAQ on Pruning, Bio Treatments, and Harvesting */}
          <FaqOleiculture
            onOpenAdhesion={() => setIsAdhesionOpen(true)}
            onOpenSimulator={() => scrollToSection('simulateur')}
          />
        </div>
      </main>

      {/* Footer with 4-pillar structured links */}
      <Footer
        onNavClick={scrollToSection}
        onOpenAdhesion={() => setIsAdhesionOpen(true)}
        onOpenSitemap={() => setIsSitemapOpen(true)}
      />

      {/* Membership / Contact Modal */}
      <AdhesionModal
        isOpen={isAdhesionOpen}
        onClose={() => setIsAdhesionOpen(false)}
      />

      {/* Full Sitemap & Thematic Index Modal (Eliminates orphan content) */}
      <SitemapModal
        isOpen={isSitemapOpen}
        onClose={() => setIsSitemapOpen(false)}
        onNavigate={scrollToSection}
      />

      {/* Offline Status & Cached Information Indicator for Isolated Rural Zones */}
      <OfflineIndicator />
    </div>
  );
}
