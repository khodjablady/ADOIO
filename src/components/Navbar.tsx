import React, { useState } from 'react';
import { Menu, X, Droplets, MapPin, Phone, Award, Calculator, BookOpen, Building2, ListOrdered, Bell, Trophy, Recycle, Stethoscope, Moon, Sun, Monitor, Sparkles, WifiOff } from 'lucide-react';
import { AdoioLogo } from './AdoioLogo';
import { PWAInstallButton } from './PWAInstallButton';

export type ThemeMode = 'system' | 'light' | 'dark';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdhesion: () => void;
  onOpenSimulator: () => void;
  onOpenSitemap?: () => void;
  onOpenOfflineGuides?: () => void;
  offlineCachedCount?: number;
  isDarkMode?: boolean;
  isSystemTheme?: boolean;
  themePreference?: ThemeMode;
  onSelectTheme?: (theme: ThemeMode) => void;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdhesion,
  onOpenSimulator,
  onOpenSitemap,
  onOpenOfflineGuides,
  offlineCachedCount = 5,
  isDarkMode = false,
  isSystemTheme = true,
  themePreference,
  onSelectTheme,
  onToggleDarkMode,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTheme: ThemeMode =
    themePreference ?? (isSystemTheme ? 'system' : isDarkMode ? 'dark' : 'light');

  const themeOptions: {
    id: ThemeMode;
    label: string;
    shortLabel: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
  }[] = [
    {
      id: 'system',
      label: 'Système',
      shortLabel: 'Auto',
      icon: Monitor,
      title: `Synchronisé avec le système (${isDarkMode ? 'Sombre' : 'Clair'})`,
    },
    {
      id: 'light',
      label: 'Clair',
      shortLabel: 'Clair',
      icon: Sun,
      title: 'Thème Clair (Jour)',
    },
    {
      id: 'dark',
      label: 'Sombre',
      shortLabel: 'Nuit',
      icon: Moon,
      title: 'Mode Nuit optimisé pour la lecture',
    },
  ];

  const handleThemeChange = (mode: ThemeMode) => {
    if (onSelectTheme) {
      onSelectTheme(mode);
    } else if (onToggleDarkMode) {
      onToggleDarkMode();
    }
  };

  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

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
      sub: 'Cultivars, Guide COI & Glossaire Oléicole',
      groupIds: ['varietes', 'degustation', 'glossaire-oleicole'],
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
      sub: 'Fertilisation, Eau, Gel & Chatbot ADOIO',
      groupIds: ['fertilisation', 'irrigation', 'pratiques', 'assistant-adoio', 'faq-oleiculture'],
    },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    setActiveTab(id);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DEC9] transition-all no-print">
      {/* Top institutional utility bar (Desktop & Tablet) */}
      <div className="hidden md:block bg-[#233416] text-[#E8F4D9] text-xs px-4 h-7 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto h-full flex justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span>Filière oléicole, Bejaïa - Algérie</span>
            <span className="text-[#B0D984]/50">·</span>
            <span className="text-[#E8F4D9]/80 font-serif italic">
              « Zzit uzemmur n Bgayet » · Patrimoine Oléicole de Kabylie
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#FAF7F2]/80">
            <span className="flex items-center gap-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#E6AB3C]" /> CAW de Béjaïa
            </span>
            <a
              href="tel:+213661630658"
              className="flex items-center gap-1 text-[11px] hover:text-[#FAF7F2] transition-colors tabular-nums"
            >
              <Phone className="w-3.5 h-3.5 text-[#E6AB3C]" /> +213 661630658
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-3">
          {/* Logo & Brand */}
          <button
            onClick={() => handleNavClick('hero')}
            aria-label="Olive Béjaïa ADOIO - Retour à l'accueil"
            className="flex items-center gap-3 text-left group cursor-pointer rounded-xl shrink-0"
          >
            <div className="w-11 h-11 md:w-13 md:h-13 rounded-full flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform duration-200">
              <AdoioLogo size={50} className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-[#18230F] leading-none whitespace-nowrap">
                  Olive Béjaïa
                </span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#567B34]">
                  · ADOIO
                </span>
              </div>
              <p className="text-[10px] text-[#567B34] font-medium tracking-tight leading-tight mt-0.5 hidden sm:block max-w-[300px] lg:max-w-[340px]">
                Association pour le développement de l’oléiculture et des industries oléicoles.
                <span className="block">Agréée par le Wali le 11/08/2014 sous le numéro 024/2014</span>
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
                  className={`px-2.5 py-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold tracking-wide cursor-pointer whitespace-nowrap shrink-0 ${
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
            {(onSelectTheme || onToggleDarkMode) && (
              <div
                role="radiogroup"
                aria-label="Sélecteur de thème (Système, Clair, Sombre)"
                className="inline-flex items-center p-0.5 rounded-lg bg-white/85 border border-[#E6DEC9] shadow-2xs shrink-0"
              >
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = activeTheme === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Thème ${option.label}`}
                      title={option.title}
                      onClick={() => handleThemeChange(option.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                          e.preventDefault();
                          const idx = themeOptions.findIndex((o) => o.id === activeTheme);
                          const next = themeOptions[(idx + 1) % themeOptions.length];
                          handleThemeChange(next.id);
                        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                          e.preventDefault();
                          const idx = themeOptions.findIndex((o) => o.id === activeTheme);
                          const prev =
                            themeOptions[(idx - 1 + themeOptions.length) % themeOptions.length];
                          handleThemeChange(prev.id);
                        }
                      }}
                      className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-[#233416] text-[#FAF7F2] shadow-2xs'
                          : 'text-[#31491E] hover:bg-[#E8F4D9] hover:text-[#18230F]'
                      }`}
                    >
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'text-[#E6AB3C]' : 'text-[#567B34]'
                        }`}
                      />
                      <span className="hidden 2xl:inline">{option.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {onOpenOfflineGuides && (
              <button
                type="button"
                onClick={onOpenOfflineGuides}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#233416] text-xs font-bold border border-[#8CBE5D]/50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title="Mode Hors-Ligne : Consulter la liste des guides techniques enregistrés dans le Cache Storage du Service Worker"
                aria-label="Mode Hors-Ligne : Guides techniques consultables sans connexion"
              >
                <WifiOff className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                <span>Mode Hors-Ligne</span>
                {offlineCachedCount > 0 && (
                  <span className="text-[10px] font-extrabold text-[#31491E] tabular-nums">
                    ({offlineCachedCount})
                  </span>
                )}
              </button>
            )}
            {onOpenSitemap && (
              <button
                onClick={onOpenSitemap}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/80 hover:bg-[#E8F4D9] text-[#233416] text-xs font-semibold border border-[#E6DEC9] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title="Afficher l'index complet du portail (17 chapitres)"
              >
                <ListOrdered className="w-3.5 h-3.5 text-[#567B34]" />
                <span className="hidden 2xl:inline">Index</span>
              </button>
            )}
            <button
              onClick={() => handleNavClick('alertes-meteo')}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-950 text-xs font-semibold border border-amber-200/80 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              title="Centre de vigilance agricole et alertes météo push"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden lg:inline">Vigilance Gel</span>
            </button>
            <PWAInstallButton variant="navbar" />
            <button
              onClick={onOpenSimulator}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0 ${
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
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] text-xs font-bold shadow-xs transition-all hover:shadow cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>Adhérer</span>
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex md:hidden items-center gap-1.5">
            {onOpenOfflineGuides && (
              <button
                type="button"
                onClick={onOpenOfflineGuides}
                className="p-2 rounded-lg bg-[#E8F4D9] text-[#233416] border border-[#8CBE5D]/40"
                aria-label="Mode Hors-Ligne : Guides techniques sans connexion"
                title="Mode Hors-Ligne"
              >
                <WifiOff className="w-5 h-5 text-[#31491E]" />
              </button>
            )}
            {(onSelectTheme || onToggleDarkMode) && (
              <div
                role="radiogroup"
                aria-label="Sélecteur de thème mobile"
                className="inline-flex items-center p-0.5 rounded-lg bg-white/85 border border-[#E6DEC9]"
              >
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = activeTheme === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Thème ${option.label}`}
                      title={option.title}
                      onClick={() => handleThemeChange(option.id)}
                      className={`p-1.5 rounded-md transition-colors ${
                        isSelected
                          ? 'bg-[#233416] text-[#E6AB3C]'
                          : 'text-[#31491E] hover:bg-[#E8F4D9]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            )}
            <button
              onClick={onOpenSimulator}
              className="p-2 rounded-lg bg-[#E8F4D9] text-[#233416]"
              aria-label="Simulateur"
            >
              <Calculator className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#233416] hover:bg-[#E8F4D9]"
              aria-label={mobileMenuOpen ? 'Fermer le menu principal' : 'Ouvrir le menu principal'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-menu"
          aria-label="Navigation mobile"
          className="md:hidden border-t border-[#E6DEC9] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[82vh] overflow-y-auto"
        >
          <div className="grid grid-cols-1 gap-1.5">
            {[
              { id: 'adoio', label: 'ADOIO & Terroir (25 ans)', icon: Award },
              { id: 'carte-interactive', label: 'Carte Interactive SIG', icon: MapPin },
              { id: 'annuaire', label: 'Annuaire des 448 Huileries', icon: Building2 },
              { id: 'varietes', label: 'Guide Variétal Kabyle', icon: Droplets },
              { id: 'degustation', label: 'Guide du Consommateur & Normes COI', icon: Award },
              { id: 'concours', label: 'Concours Meilleure Huile 2026', icon: Trophy },
              { id: 'glossaire-oleicole', label: 'Glossaire Oléicole (Termes & Définitions)', icon: BookOpen },
              { id: 'simulateur', label: 'Simulateur & Comparateur Variétal', icon: Calculator },
              { id: 'sous-produits', label: 'Valorisation des Sous-Produits', icon: Recycle },
              { id: 'diagnostic-phytosanitaire', label: 'Diagnostic Phytosanitaire & Bio', icon: Stethoscope },
              { id: 'pratiques', label: 'Calendrier, Irrigation & Fertilisation', icon: BookOpen },
              { id: 'assistant-adoio', label: 'Chatbot Assistant Agronomique ADOIO', icon: Sparkles },
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
            {onOpenOfflineGuides && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOfflineGuides();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#E8F4D9] text-[#233416] text-sm font-bold flex items-center justify-center gap-2 border border-[#8CBE5D]/50"
              >
                <WifiOff className="w-4 h-4 text-[#31491E]" />
                <span>Mode Hors-Ligne · Guides en Cache ({offlineCachedCount})</span>
              </button>
            )}
            {(onSelectTheme || onToggleDarkMode) && (
              <div className="w-full p-2.5 rounded-lg bg-white border border-[#E6DEC9] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#233416] px-1">
                  <span>Apparence & Thème</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E8F4D9] text-[#233416]">
                    {activeTheme === 'system'
                      ? `Système (${isDarkMode ? 'Sombre' : 'Clair'})`
                      : activeTheme === 'dark'
                        ? 'Mode Sombre'
                        : 'Mode Clair'}
                  </span>
                </div>
                <div
                  role="radiogroup"
                  aria-label="Choisir le mode d'affichage"
                  className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9]"
                >
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = activeTheme === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleThemeChange(option.id)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#233416] text-[#FAF7F2] shadow-xs'
                            : 'text-[#233416] hover:bg-[#E8F4D9]'
                        }`}
                      >
                        <Icon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-[#E6AB3C]' : 'text-[#567B34]'
                          }`}
                        />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <PWAInstallButton variant="banner" className="mb-1" />
            <button
              onClick={() => handleNavClick('alertes-meteo')}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-50 text-amber-950 text-sm font-bold flex items-center justify-center gap-2 border border-amber-200"
            >
              <Bell className="w-4 h-4 text-amber-600" />
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
                Plan du site & Index Thématique (17 modules)
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
        </nav>
      )}
    </header>
  );
};
