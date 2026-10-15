/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StatsAndPotential } from './components/StatsAndPotential';
import { InteractiveOliveMap } from './components/InteractiveOliveMap';
import { AdoioSection } from './components/AdoioSection';
import { MillsDirectory } from './components/MillsDirectory';
import { VarietiesGuide } from './components/VarietiesGuide';
import { YieldSimulator } from './components/YieldSimulator';
import { TastingAndQuality } from './components/TastingAndQuality';
import { CalendarAndPractices } from './components/CalendarAndPractices';
import { AdhesionModal } from './components/AdhesionModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('potential');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAdhesionOpen, setIsAdhesionOpen] = useState<boolean>(false);

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onSearch={handleHeroSearch}
          onOpenSimulator={() => scrollToSection('simulateur')}
          onExploreMills={() => scrollToSection('annuaire')}
          onExploreAdoio={() => scrollToSection('adoio')}
          onExploreMap={() => scrollToSection('carte-interactive')}
        />

        {/* Potentialities & Official Figures */}
        <StatsAndPotential />

        {/* Interactive Geographical Map of Communes & Registered Mills */}
        <InteractiveOliveMap />

        {/* ADOIO Association Section */}
        <AdoioSection onOpenAdhesion={() => setIsAdhesionOpen(true)} />

        {/* Mills & Producers Directory */}
        <MillsDirectory initialSearch={searchQuery} />

        {/* Kabylie Varieties Guide */}
        <VarietiesGuide />

        {/* Harvest & Yield Interactive Simulator */}
        <YieldSimulator />

        {/* Tasting & Quality Standards */}
        <TastingAndQuality />

        {/* Seasonal Calendar & Best Agricultural Practices */}
        <CalendarAndPractices />
      </main>

      {/* Footer */}
      <Footer
        onNavClick={scrollToSection}
        onOpenAdhesion={() => setIsAdhesionOpen(true)}
      />

      {/* Membership / Contact Modal */}
      <AdhesionModal
        isOpen={isAdhesionOpen}
        onClose={() => setIsAdhesionOpen(false)}
      />
    </div>
  );
}
