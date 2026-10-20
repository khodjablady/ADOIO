import React, { useState } from 'react';
import { Menu, X, Droplets, MapPin, Phone, Award, Calculator, BookOpen, Building2, ListOrdered, Bell, Trophy, Recycle, Stethoscope } from 'lucide-react';
import { AdoioLogo } from './AdoioLogo';
import { PWAInstallButton } from './PWAInstallButton';

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
    {
      id: 'adoio',
      label: 'Terroir & ADOIO',
      icon: Award,
      sub: 'Missions, 25 ans & Chiffres',
      groupIds: ['adoio', 'potential', 'galerie-paysages'],
    },
    {
      id: 'carte-interactive',
      label: 'Carte & 448 Moulins',
      icon: MapPin,
      sub: 'SIG & Annuaire huileries',
      groupIds: ['carte-interactive', 'annuaire'],
    },
    {
      id: 'varietes',
      label: 'Variétés & Guide COI',
      icon: Droplets,
      sub: 'Cultivars & Guide Consommateur',
      groupIds: ['varietes', 'degustation'],
    },
    {
      id: 'concours',
      label: 'Concours 2026',
      icon: Trophy,
      sub: "Fête de l'Olive & Palmarès",
      groupIds: ['concours'],
    },
    {
      id: 'sous-produits',
      label: 'Sous-Produits',
      icon: Recycle,
      sub: 'Grignons, Margines & Biomasse',
      groupIds: ['sous-produits'],
    },
    {
      id: 'diagnostic-phytosanitaire',
      label: 'Diagnostic Bio',
      icon: Stethoscope,
      sub: 'Symptômes & Traitements Bio',
      groupIds: ['diagnostic-phytosanitaire'],
    },
    {
      id: 'pratiques',
      label: 'Pratiques & Météo',
      icon: BookOpen,
      sub: 'Fertilisation, Eau & Gel',
      groupIds: ['fertilisation', 'irrigation', 'pratiques', 'faq-oleiculture'],
    },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    setActiveTab(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DEC9] transition-all no-print">
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
        <div className="flex items-center justify-between h-20 gap-3">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none shrink-0"
          >
            <div className="w-13 h-13 rounded-full flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-200">
              <AdoioLogo size={50} className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#18230F] leading-none">
                  Olive Béjaïa
                </span>
                <span className="bg-[#31491E] text-[#FAF7F2] text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                  ADOIO
                </span>
              </div>
              <p className="text-[10px] text-[#567B34] font-medium tracking-tight mt-1 hidden sm:block max-w-[230px] truncate">
                Filière oléicole & industries oléicoles de Béjaïa
              </p>
            </div>
          </button>

          {/* Desktop links (Group-aware active highlight) */}
          <nav aria-label="Navigation principale" className="hidden xl:flex items-center gap-1 text-sm font-medium text-[#31491E]">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = item.groupIds.includes(activeTab);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.sub}
                  className={`px-2.5 py-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold tracking-wide cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'text-[#233416] hover:bg-[#E8F4D9] hover:text-[#18230F]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#E6AB3C]' : 'text-[#567B34]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            {onOpenSitemap && (
              <button
                onClick={onOpenSitemap}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/80 hover:bg-[#E8F4D9] text-[#233416] text-xs font-semibold border border-[#E6DEC9] transition-colors cursor-pointer"
                title="Afficher l'index complet du portail (15 chapitres)"
              >
                <ListOrdered className="w-3.5 h-3.5 text-[#567B34]" />
                <span className="hidden 2xl:inline">Index</span>
              </button>
            )}
            <button
              onClick={() => handleNavClick('alertes-meteo')}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold border border-amber-200/80 transition-colors cursor-pointer"
              title="Centre de vigilance agricole et alertes météo push"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span className="hidden lg:inline">Vigilance Gel</span>
            </button>
            <PWAInstallButton variant="navbar" />
            <button
              onClick={onOpenSimulator}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors shadow-xs cursor-pointer ${
                activeTab === 'simulateur'
                  ? 'bg-[#233416] text-white border-[#233416]'
                  : 'bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#233416] border-[#8CBE5D]/40'
              }`}
              title="Convertisseur express & Comparateur de variétés"
            >
              <Calculator className={`w-3.5 h-3.5 ${activeTab === 'simulateur' ? 'text-[#E6AB3C]' : 'text-[#436229]'}`} />
              <span>Simulateur</span>
            </button>
            <button
              onClick={onOpenAdhesion}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] text-xs font-bold shadow-xs transition-all hover:shadow cursor-pointer"
            >
              <span>Adhérer</span>
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
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E6DEC9] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[82vh] overflow-y-auto">
          <div className="grid grid-cols-1 gap-1.5">
            {[
              { id: 'adoio', label: 'ADOIO & Terroir (25 ans)', icon: Award },
              { id: 'carte-interactive', label: 'Carte Interactive SIG', icon: MapPin },
              { id: 'annuaire', label: 'Annuaire des 448 Huileries', icon: Building2 },
              { id: 'varietes', label: 'Guide Variétal Kabyle', icon: Droplets },
              { id: 'degustation', label: 'Guide du Consommateur & Normes COI', icon: Award },
              { id: 'concours', label: 'Concours Meilleure Huile 2026', icon: Trophy },
              { id: 'simulateur', label: 'Simulateur & Comparateur Variétal', icon: Calculator },
              { id: 'sous-produits', label: 'Valorisation des Sous-Produits', icon: Recycle },
              { id: 'diagnostic-phytosanitaire', label: 'Diagnostic Phytosanitaire & Bio', icon: Stethoscope },
              { id: 'pratiques', label: 'Calendrier, Irrigation & Fertilisation', icon: BookOpen },
            ].map((item) => {
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
            <PWAInstallButton variant="banner" className="mb-1" />
            <button
              onClick={() => handleNavClick('alertes-meteo')}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-50 text-amber-950 text-sm font-bold flex items-center justify-center gap-2 border border-amber-200"
            >
              <Bell className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>Vigilance Gel & Alertes Push Météo</span>
            </button>
            {onOpenSitemap && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSitemap();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-white text-[#233416] text-sm font-bold flex items-center justify-center gap-2 border border-[#E6DEC9]"
              >
                <ListOrdered className="w-4 h-4 text-[#567B34]" />
                Plan du site & Index Thématique (15 modules)
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
              Simulateur & Comparateur de Rendement
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
