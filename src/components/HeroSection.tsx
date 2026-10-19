import React, { useState } from 'react';
import { Search, Droplets, MapPin, Sparkles, ChevronRight, Calculator, ShieldCheck, Trophy } from 'lucide-react';
import { BEJAIA_GLOBAL_STATS } from '../data/bejaiaOliveData';
import { Jubile25Badge } from './Jubile25Badge';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onOpenSimulator: () => void;
  onExploreMills: () => void;
  onExploreAdoio: () => void;
  onExploreMap?: () => void;
  onExploreCompetition?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenSimulator,
  onExploreMills,
  onExploreAdoio,
  onExploreMap,
  onExploreCompetition,
}) => {
  const [localSearch, setLocalSearch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      onSearch(localSearch.trim());
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-[#233416] via-[#1E2D13] to-[#18230F] text-[#FAF7F2] pt-12 pb-16 lg:pt-20 lg:pb-24">
      {/* Decorative ambient background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#8CBE5D_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#E6AB3C]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#567B34]/20 blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2]/10 backdrop-blur-md border border-[#FAF7F2]/15 text-[#E8F4D9] text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#E6AB3C]"></span>
            <span>Wilaya de Béjaïa · Terroir de la Vallée de la Soummam</span>
          </div>
          {onExploreCompetition && (
            <button
              onClick={onExploreCompetition}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6AB3C] hover:bg-[#D09222] text-[#18230F] text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105"
            >
              <Trophy className="w-3.5 h-3.5 text-[#18230F]" />
              <span>Concours Meilleure Huile 2026 : Inscriptions</span>
            </button>
          )}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8CBE5D]/20 text-[#B0D984] text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E6AB3C]" />
            <span>Filière Oléicole & Labellisation Terroir</span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#FAF7F2] leading-[1.12]">
              L'Or Vert de Béjaïa & l'Excellence Oléicole de Kabylie
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 max-w-3xl">
              <p className="text-base sm:text-lg text-[#E8F4D9]/90 font-normal leading-relaxed flex-1">
                Bienvenue sur le portail de référence dédié aux potentialités oléicoles de la wilaya de Béjaïa et aux missions de l’<strong>ADOIO</strong>. De la cueillette ancestrale aux huileries modernes à chaîne continue, découvrez la richesse de notre patrimoine oléicole.
              </p>

              {/* Logo officiel du 25e Jubilé d'Argent ADOIO */}
              <Jubile25Badge size={150} onClick={onExploreAdoio} />
            </div>

            {/* Quick interactive search */}
            <form onSubmit={handleSubmit} className="max-w-xl">
              <div className="relative flex items-center bg-[#FAF7F2] rounded-xl shadow-lg p-1.5 border-2 border-[#E6AB3C]/30 focus-within:border-[#E6AB3C] transition-all">
                <Search className="w-5 h-5 text-[#436229] ml-3 shrink-0" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Rechercher une huilerie, commune (Seddouk, Akbou...), variété (Chemlal)..."
                  className="w-full px-3 py-2 text-sm text-[#18230F] placeholder-[#6F9D44] focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer"
                >
                  Rechercher
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-[#E8F4D9]/70">
                <span className="font-medium">Suggestions :</span>
                {['Seddouk', 'Akbou', 'Chemlal', 'Huilerie Moderne', 'Bio'].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => {
                      setLocalSearch(kw);
                      onSearch(kw);
                    }}
                    className="hover:text-[#FAF7F2] underline decoration-[#E6AB3C]/60 underline-offset-2 cursor-pointer transition-colors"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </form>

            {/* Direct quick CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              {onExploreMap && (
                <button
                  onClick={onExploreMap}
                  className="px-5 py-3 rounded-xl bg-[#E6AB3C] hover:bg-[#D09222] text-[#18230F] font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer hover:shadow-lg"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Carte Interactive du Verger</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onExploreMills}
                className="px-5 py-3 rounded-xl bg-[#FAF7F2]/15 hover:bg-[#FAF7F2]/25 text-[#FAF7F2] font-semibold text-sm border border-[#FAF7F2]/20 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E6AB3C]" />
                <span>Annuaire des Huileries</span>
              </button>
              
              <button
                onClick={onOpenSimulator}
                className="px-5 py-3 rounded-xl bg-[#FAF7F2]/15 hover:bg-[#FAF7F2]/25 text-[#FAF7F2] font-semibold text-sm border border-[#FAF7F2]/20 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-[#E6AB3C]" />
                <span>Simulateur de Rendement</span>
              </button>

              {onExploreCompetition && (
                <button
                  onClick={onExploreCompetition}
                  className="px-5 py-3 rounded-xl bg-[#FAF7F2]/15 hover:bg-[#FAF7F2]/25 text-[#FAF7F2] font-semibold text-sm border border-[#FAF7F2]/20 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-4 h-4 text-[#E6AB3C]" />
                  <span>Concours 2026</span>
                </button>
              )}

              <button
                onClick={onExploreAdoio}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-[#E8F4D9] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Découvrir l'ADOIO</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right card: Terroir Highlight Card */}
          <div className="lg:col-span-4">
            <div className="relative rounded-2xl bg-gradient-to-br from-[#2E421D] to-[#1C2912] p-6 border border-[#8CBE5D]/25 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F2]/15">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#E6AB3C]/20 flex items-center justify-center text-[#E6AB3C]">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#FAF7F2] text-sm">Huile d'Olive de Kabylie</h3>
                    <p className="text-[11px] text-[#B0D984]">Terroir Soummam & Babors</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-[#FAF7F2]/10 text-[#E8F4D9]">
                  Vierge Extra
                </span>
              </div>

              <div className="space-y-3 text-xs text-[#E8F4D9]/90">
                <div className="flex justify-between items-center py-1 border-b border-[#FAF7F2]/10">
                  <span className="text-[#B0D984]">Variétés dominantes</span>
                  <span className="font-semibold text-[#FAF7F2]">Chemlal & Azeradj (±85%)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#FAF7F2]/10">
                  <span className="text-[#B0D984]">Acidité oléique visée</span>
                  <span className="font-semibold text-[#E6AB3C]">≤ 0.3% - 0.5%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#FAF7F2]/10">
                  <span className="text-[#B0D984]">Mode d'extraction</span>
                  <span className="font-semibold text-[#FAF7F2]">Extraction mécanique à froid</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#FAF7F2]/10">
                  <span className="text-[#B0D984]">Profil sensoriel</span>
                  <span className="font-semibold text-[#FAF7F2]">Fruité vert, herbe, amande</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#B0D984]">Partenaire agricole</span>
                  <span className="font-semibold text-[#FAF7F2]">Chambre d'agriculture de Béjaïa</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#18230F]/60 border border-[#8CBE5D]/20 text-[11px] text-[#FAF7F2]/80 italic">
                « L'huile d'olive kabyle est réputée pour sa longue conservation, sa richesse en polyphénols et son caractère généreux. »
              </div>
            </div>
          </div>
        </div>

        {/* Global Key Stats Bar (Unboxed clean typographic style) */}
        <div className="mt-14 pt-8 border-t border-[#FAF7F2]/15">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#B0D984] font-medium block">
                Verger Oléicole
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF7F2]">
                57 400 <span className="text-sm font-sans font-medium text-[#E6AB3C]">ha</span>
              </div>
              <p className="text-[11px] text-[#E8F4D9]/70">1ère wilaya en superficie</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#B0D984] font-medium block">
                Patrimoine Arboricole
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF7F2]">
                5,35 <span className="text-sm font-sans font-medium text-[#E6AB3C]">M</span>
              </div>
              <p className="text-[11px] text-[#E8F4D9]/70">d'oliviers recensés</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#B0D984] font-medium block">
                Parc de Trituration
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF7F2]">
                448 <span className="text-sm font-sans font-medium text-[#E6AB3C]">huileries</span>
              </div>
              <p className="text-[11px] text-[#E8F4D9]/70">192 chaînes modernes + 256 trad.</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#B0D984] font-medium block">
                Production Annuelle
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF7F2]">
                18 à 26 <span className="text-sm font-sans font-medium text-[#E6AB3C]">M litres</span>
              </div>
              <p className="text-[11px] text-[#E8F4D9]/70">~28.5% du volume national</p>
            </div>

            <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#B0D984] font-medium block">
                Rendement Moyen
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-[#E6AB3C]">
                19.4 <span className="text-sm font-sans font-medium text-[#FAF7F2]">L / qx</span>
              </div>
              <p className="text-[11px] text-[#E8F4D9]/70">Pic jusqu'à 24 L en pleine maturité</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
