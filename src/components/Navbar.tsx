import React, { useState } from 'react';
import { Menu, X, Droplets, MapPin, Phone, Award, Calculator, BookOpen, Layers, Building2, ListOrdered } from 'lucide-react';
import { AdoioLogo } from './AdoioLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdhesion: () => void;
  onOpenSimulator: () => void;
  onOpenSitemap?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdhesion,
  onOpenSimulator,
  onOpenSitemap,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'adoio', label: 'ADOIO & Terroir', icon: Award, sub: 'Missions & Chiffres' },
    { id: 'carte-interactive', label: 'Carte & Bassins', icon: MapPin, sub: 'SIG géoréférencé' },
    { id: 'annuaire', label: 'Huileries & Moulins', icon: Building2, sub: '448 unités' },
    { id: 'varietes', label: 'Guide Variétal', icon: Droplets, sub: 'Chemlal, Bouchouk...' },
    { id: 'degustation', label: 'Qualité & COI', icon: Award, sub: 'Normes & Sensoriel' },
    { id: 'pratiques', label: 'Bonnes Pratiques', icon: BookOpen, sub: 'Calendrier des soins' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DEC9] transition-all">
      {/* Top microbar */}
      <div className="bg-[#233416] text-[#E8F4D9] text-xs px-4 py-1.5 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8CBE5D] inline-block animate-pulse"></span>
              Campagne Oléicole Wilaya de Béjaïa
            </span>
            <span className="hidden md:inline text-[#B0D984]/50">|</span>
            <span className="hidden md:inline text-[#E8F4D9]/80 font-serif italic">
              « Zzit uzemmur n Bgayet » · Fierté du terroir kabyle
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#FAF7F2]/80">
            <span className="flex items-center gap-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#E6AB3C]" /> CAW de Béjaïa
            </span>
            <a
              href="tel:+213661630658"
              className="flex items-center gap-1 text-[11px] hover:text-[#FAF7F2] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#E6AB3C]" /> +213 661630658
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-200">
              <AdoioLogo size={54} className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#18230F] leading-none">
                  Olive Béjaïa
                </span>
                <span className="bg-[#31491E] text-[#FAF7F2] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                  ADOIO
                </span>
              </div>
              <p className="text-[11px] text-[#567B34] font-medium tracking-tight mt-1">
                Association pour le développement de l'oléiculture et des industries oléicoles
              </p>
            </div>
          </button>

          {/* Desktop links */}
          <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-[#31491E]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold tracking-wide ${
                    isActive
                      ? 'bg-[#31491E] text-white shadow-sm'
                      : 'text-[#233416] hover:bg-[#E8F4D9] hover:text-[#18230F]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#E6AB3C]' : 'text-[#567B34]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {onOpenSitemap && (
              <button
                onClick={onOpenSitemap}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/80 hover:bg-[#E8F4D9] text-[#233416] text-xs font-semibold border border-[#E6DEC9] transition-colors"
                title="Afficher l'index complet du portail"
              >
                <ListOrdered className="w-3.5 h-3.5 text-[#567B34]" />
                <span>Index & Silos</span>
              </button>
            )}
            <button
              onClick={onOpenSimulator}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#233416] text-xs font-bold border border-[#8CBE5D]/40 transition-colors shadow-xs"
              title="Calculer le rendement en huile d'olives"
            >
              <Calculator className="w-3.5 h-3.5 text-[#436229]" />
              <span>Simulateur</span>
            </button>
            <button
              onClick={onOpenAdhesion}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] text-xs font-bold shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
            >
              <span>Adhérer / Contact</span>
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSimulator}
              className="p-2 rounded-lg bg-[#E8F4D9] text-[#233416]"
              aria-label="Simulateur"
            >
              <Calculator className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#233416] hover:bg-[#E8F4D9] focus:outline-none"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6DEC9] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-[#31491E] text-white'
                      : 'text-[#233416] hover:bg-[#E8F4D9]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E6AB3C]' : 'text-[#567B34]'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E6DEC9] flex flex-col gap-2">
            {onOpenSitemap && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSitemap();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-white text-[#233416] text-sm font-bold flex items-center justify-center gap-2 border border-[#E6DEC9]"
              >
                <ListOrdered className="w-4 h-4 text-[#567B34]" />
                Plan du site & Index Thématique
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSimulator();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-[#E8F4D9] text-[#233416] text-sm font-bold flex items-center justify-center gap-2 border border-[#8CBE5D]/40"
            >
              <Calculator className="w-4 h-4 text-[#436229]" />
              Simulateur de Rendement en Huile
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdhesion();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-[#31491E] text-[#FAF7F2] text-sm font-bold shadow text-center"
            >
              Adhérer à l'ADOIO & Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
