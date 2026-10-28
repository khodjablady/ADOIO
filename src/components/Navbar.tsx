import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, Droplets, MapPin, Phone, Award, Calculator, BookOpen, Building2, ListOrdered, Bell, Trophy, Recycle, Stethoscope, Moon, Sun, Monitor, Sparkles, WifiOff, LogIn, LogOut, UserCheck, Heart, CheckCircle2, User as UserIcon, Trash2, ExternalLink, Sprout, Factory, FlaskConical } from 'lucide-react';
import type { User } from 'firebase/auth';
import { AdoioLogo } from './AdoioLogo';
import { PWAInstallButton } from './PWAInstallButton';
import { REPRESENTATIVE_MILLS } from '../data/bejaiaOliveData';
import {
  subscribeToUserAccount,
  signInWithGoogle,
  signOutUser,
  syncUserFavoritesInFirestore,
  UserProfileData,
} from '../firebase';

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
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeProfileSection, setActiveProfileSection] = useState<'overview' | 'favorites' | 'adhesion' | 'quiz'>('overview');
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToUserAccount(({ user, profile }) => {
      setAuthUser(user);
      setUserProfile(profile);
      if (!user) {
        setProfileModalOpen(false);
        setAccountMenuOpen(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.warn('Google Sign-In cancelled or failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setAccountMenuOpen(false);
    setProfileModalOpen(false);
    try {
      await signOutUser();
    } catch (err) {
      console.warn('Sign-out error:', err);
    }
  };

  const handleRemoveFavoriteFromProfile = async (millId: string) => {
    if (!userProfile) return;
    const updated = userProfile.favoriteMillIds.filter((id) => id !== millId);
    await syncUserFavoritesInFirestore(updated);
  };

  const savedFavoriteMills = useMemo(() => {
    const ids = userProfile?.favoriteMillIds || [];
    return REPRESENTATIVE_MILLS.filter((m) => ids.includes(m.id));
  }, [userProfile?.favoriteMillIds]);

  const PROFILE_LABELS: Record<string, string> = {
    oleiculteur: 'Oléiculteur / Planteur',
    moulinier: 'Huilerie / Moulinier',
    cooperative: 'Coopérative Oléicole',
    conditionneur: 'Conditionneur / Négociant',
    chercheur: 'Agronome / Chercheur',
    amateur: "Amateur d'Huile d'Olive",
  };

  const totalQuizScore =
    (userProfile?.quizBestScore1 || 0) +
    (userProfile?.quizBestScore2 || 0) +
    (userProfile?.quizBestScore3 || 0);

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

            {/* Persistent User Account Sign-In / Profile Menu */}
            {authUser ? (
              <div className="relative shrink-0 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveProfileSection('overview');
                    setProfileModalOpen(true);
                    setAccountMenuOpen(false);
                  }}
                  aria-label="Ouvrir mon profil utilisateur (Favoris, Adhésion ADOIO, Historique Quiz)"
                  title="Mon Profil Utilisateur : Favoris, Statut d'Adhésion ADOIO & Historique Quiz"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#E8F4D9] text-[#18230F] border border-[#8CBE5D] text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  {authUser.photoURL ? (
                    <img
                      src={authUser.photoURL}
                      alt={authUser.displayName || 'Profil'}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-[#31491E]"
                    />
                  ) : (
                    <UserCheck className="w-4 h-4 text-[#31491E]" />
                  )}
                  <span className="max-w-[96px] truncate hidden xl:inline">
                    {userProfile?.displayName || authUser.displayName || 'Mon Profil'}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#E8F4D9] text-[#233416] text-[10px] font-extrabold tabular-nums">
                    {userProfile?.favoriteMillIds.length || 0}♥
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountMenuOpen((prev) => !prev)}
                  aria-expanded={accountMenuOpen}
                  aria-label="Menu rapide du compte"
                  title="Menu rapide du compte"
                  className="p-1.5 rounded-lg bg-white/85 hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] text-xs font-bold transition-colors cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#31491E]" />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] shadow-xl p-4 z-50 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#E6DEC9]">
                      <div className="truncate">
                        <div className="font-serif font-bold text-sm text-[#18230F] truncate">
                          {userProfile?.displayName || authUser.displayName || 'Membre ADOIO'}
                        </div>
                        <div className="text-[11px] text-[#567B34] truncate">
                          {authUser.email}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#E8F4D9] text-[#233416] text-[10px] font-bold shrink-0">
                        Synchronisé
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setActiveProfileSection('overview');
                        setProfileModalOpen(true);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#E6AB3C]" />
                      <span>Ouvrir Mon Profil Complet</span>
                    </button>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          setActiveProfileSection('favorites');
                          setProfileModalOpen(true);
                        }}
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E6DEC9] hover:border-[#8CBE5D] flex items-center justify-between text-left cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2 font-semibold text-[#18230F]">
                          <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                          <span>Huileries favorites</span>
                        </span>
                        <span className="font-bold text-[#31491E] tabular-nums">
                          {userProfile?.favoriteMillIds.length || 0}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          setActiveProfileSection('adhesion');
                          setProfileModalOpen(true);
                        }}
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E6DEC9] hover:border-[#8CBE5D] flex items-center justify-between text-left cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2 font-semibold text-[#18230F]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#567B34]" />
                          <span>Statut Adhésion ADOIO</span>
                        </span>
                        <span className="font-mono text-[11px] font-bold text-[#31491E]">
                          {userProfile?.adhesionReferenceId || 'Non affilié'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          setActiveProfileSection('quiz');
                          setProfileModalOpen(true);
                        }}
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E6DEC9] hover:border-[#8CBE5D] flex items-center justify-between text-left cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2 font-semibold text-[#18230F]">
                          <Trophy className="w-3.5 h-3.5 text-[#E6AB3C]" />
                          <span>Progression Quiz COI</span>
                        </span>
                        <span className="font-bold text-[#31491E] tabular-nums">
                          {totalQuizScore}/15 ({userProfile?.quizCompletedLevels.length || 0}/3 niv.)
                        </span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                disabled={isSigningIn}
                onClick={handleGoogleSignIn}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white hover:bg-[#E8F4D9] text-[#233416] text-xs font-bold border border-[#E6DEC9] transition-colors cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-60"
                title="Se connecter avec Google pour sauvegarder vos favoris, votre statut d'adhésion et votre progression au quiz"
              >
                <LogIn className="w-3.5 h-3.5 text-[#567B34]" />
                <span>{isSigningIn ? 'Connexion...' : 'Connexion'}</span>
              </button>
            )}
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

            {/* Mobile Account Sign-In / Sign-Out Card */}
            {authUser ? (
              <div className="p-3 rounded-xl bg-white border border-[#8CBE5D]/60 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <UserCheck className="w-4 h-4 text-[#31491E] shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-bold text-[#18230F] truncate">
                        {userProfile?.displayName || authUser.displayName || 'Membre ADOIO'}
                      </div>
                      <div className="text-[10px] text-[#567B34] truncate">{authUser.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      void handleSignOut();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Déconnexion</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#E6DEC9] text-[11px] text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveProfileSection('favorites');
                      setProfileModalOpen(true);
                    }}
                    className="bg-[#FAF7F2] hover:bg-[#E8F4D9] p-1.5 rounded-lg transition-colors"
                  >
                    <span className="block text-[10px] text-[#567B34]">Favoris</span>
                    <strong className="text-[#18230F]">{userProfile?.favoriteMillIds.length || 0}</strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveProfileSection('adhesion');
                      setProfileModalOpen(true);
                    }}
                    className="bg-[#FAF7F2] hover:bg-[#E8F4D9] p-1.5 rounded-lg transition-colors"
                  >
                    <span className="block text-[10px] text-[#567B34]">Adhésion</span>
                    <strong className="text-[#18230F] truncate block">
                      {userProfile?.adhesionReferenceId || '—'}
                    </strong>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveProfileSection('quiz');
                      setProfileModalOpen(true);
                    }}
                    className="bg-[#FAF7F2] hover:bg-[#E8F4D9] p-1.5 rounded-lg transition-colors"
                  >
                    <span className="block text-[10px] text-[#567B34]">Quiz COI</span>
                    <strong className="text-[#18230F]">{totalQuizScore}/15</strong>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveProfileSection('overview');
                    setProfileModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#233416] text-xs font-bold flex items-center justify-center gap-1.5 border border-[#8CBE5D]/50"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#31491E]" />
                  <span>Ouvrir Mon Profil Complet</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={isSigningIn}
                onClick={() => {
                  void handleGoogleSignIn();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-white text-[#233416] text-sm font-bold flex items-center justify-center gap-2 border border-[#E6DEC9]"
              >
                <LogIn className="w-4 h-4 text-[#567B34]" />
                <span>{isSigningIn ? 'Connexion en cours...' : 'Se connecter (Sauvegarde Compte)'}</span>
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Conditional User Profile View Modal (Rendered only when Firebase Auth user is signed in) */}
      {authUser && profileModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-profile-modal-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setProfileModalOpen(false)}
        >
          <div
            className="bg-[#FAF7F2] rounded-3xl border border-[#E6DEC9] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E6DEC9]">
              <div className="flex items-center gap-3.5">
                {authUser.photoURL ? (
                  <img
                    src={authUser.photoURL}
                    alt={authUser.displayName || 'Profil'}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#31491E] shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#E8F4D9] border-2 border-[#31491E] flex items-center justify-center text-[#233416]">
                    <UserCheck className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 id="user-profile-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                      {userProfile?.displayName || authUser.displayName || 'Profil Oléiculteur ADOIO'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8F4D9] text-[#233416] text-[11px] font-bold border border-[#8CBE5D]/50">
                      Compte Synchronisé
                    </span>
                  </div>
                  <p className="text-xs text-[#567B34] mt-0.5">{authUser.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                aria-label="Fermer le profil utilisateur"
                className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section Tabs inside User Profile View */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'overview', label: "Vue d'ensemble", icon: UserIcon },
                {
                  id: 'favorites',
                  label: `Favoris (${savedFavoriteMills.length})`,
                  icon: Heart,
                },
                { id: 'adhesion', label: 'Adhésion ADOIO', icon: Award },
                { id: 'quiz', label: `Quiz COI (${totalQuizScore}/15)`, icon: Trophy },
              ].map((tab) => {
                const Icon = tab.icon;
                const isCurrent = activeProfileSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveProfileSection(tab.id as typeof activeProfileSection)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#31491E] text-[#FAF7F2] border-[#31491E] shadow-xs'
                        : 'bg-white text-[#233416] border-[#E6DEC9] hover:bg-[#E8F4D9]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#E6AB3C]' : 'text-[#567B34]'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 1. SAVED FAVORITES SECTION */}
            {(activeProfileSection === 'overview' || activeProfileSection === 'favorites') && (
              <div className="bg-white rounded-2xl border border-[#E6DEC9] p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-[#18230F] flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                    <span>Huileries Favorites Enregistrées ({savedFavoriteMills.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileModalOpen(false);
                      handleNavClick('annuaire');
                    }}
                    className="text-xs font-bold text-[#31491E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voir l'annuaire</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {savedFavoriteMills.length === 0 ? (
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs text-[#567B34] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span>Aucune huilerie favorite associée à votre compte pour le moment.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileModalOpen(false);
                        handleNavClick('annuaire');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#31491E] text-white font-bold shrink-0 cursor-pointer"
                    >
                      Explorer les 448 moulins
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {savedFavoriteMills.map((mill) => (
                      <div
                        key={mill.id}
                        className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-[#18230F] truncate">{mill.name}</div>
                          <div className="text-[11px] text-[#567B34] truncate">
                            {mill.commune} ({mill.daira}) · {mill.typeLabel} · {mill.capacityQxPerDay} qx/j
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setProfileModalOpen(false);
                              handleNavClick('annuaire');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white border border-[#E6DEC9] hover:bg-[#E8F4D9] text-[#233416] font-semibold cursor-pointer"
                          >
                            Fiche
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleRemoveFavoriteFromProfile(mill.id)}
                            title="Retirer des favoris"
                            aria-label={`Retirer ${mill.name} des favoris`}
                            className="p-1.5 rounded-lg bg-white border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. ADHESION STATUS SECTION */}
            {(activeProfileSection === 'overview' || activeProfileSection === 'adhesion') && (
              <div className="bg-white rounded-2xl border border-[#E6DEC9] p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-[#18230F] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#E6AB3C]" />
                    <span>Statut d'Adhésion ADOIO Béjaïa</span>
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      userProfile?.adhesionReferenceId
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {userProfile?.adhesionReferenceId ? 'Dossier Enregistré' : 'Non affilié'}
                  </span>
                </div>

                {userProfile?.adhesionReferenceId ? (
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#8CBE5D]/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#567B34] font-bold block">
                        Référence d'affiliation
                      </span>
                      <span className="font-mono text-sm font-bold text-[#31491E]">
                        {userProfile.adhesionReferenceId}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#567B34] font-bold block">
                        Catégorie de membre
                      </span>
                      <span className="font-bold text-[#18230F]">
                        {PROFILE_LABELS[userProfile.adhesionProfileType] ||
                          userProfile.adhesionProfileType ||
                          'Oléiculteur'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#567B34] font-bold block">
                        Exploitation / Moulin & Commune
                      </span>
                      <span className="font-semibold text-[#18230F]">
                        {userProfile.adhesionFarmName || 'Exploitation Familiale'} ·{' '}
                        {userProfile.adhesionCommune || 'Béjaïa'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#567B34] font-bold block">
                        Date d'enregistrement
                      </span>
                      <span className="text-[#436229]">
                        {userProfile.adhesionSubmittedAt || 'Campagne 2026'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <p className="text-[#436229]">
                      Associez votre exploitation ou huilerie à l'ADOIO pour bénéficier des analyses d'acidité, formations et kits de récolte.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileModalOpen(false);
                        onOpenAdhesion();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#31491E] text-white font-bold shrink-0 cursor-pointer"
                    >
                      Demander mon adhésion
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. QUIZ HISTORY & PROGRESSION SECTION */}
            {(activeProfileSection === 'overview' || activeProfileSection === 'quiz') && (
              <div className="bg-white rounded-2xl border border-[#E6DEC9] p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-[#18230F] flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#E6AB3C]" />
                    <span>Historique & Progression au Quiz Oléicole COI</span>
                  </h4>
                  <span className="text-xs font-bold text-[#31491E] bg-[#E8F4D9] px-2.5 py-0.5 rounded-full tabular-nums">
                    Score total : {totalQuizScore} / 15 pts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {[
                    {
                      level: 1,
                      title: 'Niveau 1 · Verger',
                      badge: 'Oléiculteur Averti',
                      score: userProfile?.quizBestScore1 || 0,
                      minPass: 3,
                      icon: Sprout,
                    },
                    {
                      level: 2,
                      title: 'Niveau 2 · Moulin',
                      badge: 'Maître Moulinier COI',
                      score: userProfile?.quizBestScore2 || 0,
                      minPass: 3,
                      icon: Factory,
                    },
                    {
                      level: 3,
                      title: 'Niveau 3 · Qualité COI',
                      badge: 'Expert Oléologue ADOIO',
                      score: userProfile?.quizBestScore3 || 0,
                      minPass: 4,
                      icon: FlaskConical,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isCompleted =
                      userProfile?.quizCompletedLevels.includes(item.level) ||
                      item.score >= item.minPass;
                    return (
                      <div
                        key={item.level}
                        className={`p-3 rounded-xl border ${
                          isCompleted
                            ? 'bg-[#EDF5E6] border-[#8CBE5D]'
                            : 'bg-[#FAF7F2] border-[#E6DEC9]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-[#31491E] flex items-center gap-1">
                            <Icon className="w-3.5 h-3.5" />
                            <span>{item.title}</span>
                          </span>
                          <span className="font-extrabold text-[#18230F] tabular-nums">
                            {item.score}/5
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-[#18230F]">{item.badge}</div>
                        <div className="text-[10px] text-[#567B34] mt-1">
                          {isCompleted ? '✓ Niveau validé' : `Seuil requis : ${item.minPass}/5`}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[#567B34]">
                    Dernier niveau consulté :{' '}
                    <strong>Niveau {userProfile?.quizLastPlayedLevel || 1}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileModalOpen(false);
                      handleNavClick('glossaire-oleicole');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#233416] font-bold cursor-pointer"
                  >
                    Accéder au Quiz COI
                  </button>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E6DEC9]">
              <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-2 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Se déconnecter</span>
              </button>
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#31491E] hover:bg-[#233416] text-white text-xs font-bold cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
