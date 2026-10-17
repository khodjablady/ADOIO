import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Building2, 
  Droplets, 
  Award, 
  Calculator, 
  BookOpen, 
  Layers, 
  ListOrdered,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export interface SiloItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subsections: {
    id: string;
    slug: string;
    title: string;
    description: string;
  }[];
}

export const SILOS_CONFIG: SiloItem[] = [
  {
    id: 'silo-terroir',
    slug: 'terroir-adoio',
    title: 'Terroir & Association',
    subtitle: 'Missions ADOIO & Verger de Béjaïa',
    icon: Award,
    color: '#31491E',
    subsections: [
      {
        id: 'adoio',
        slug: 'missions-adoio',
        title: 'Missions & 25 ans ADOIO',
        description: 'Gouvernance, conseil d’administration et programme de labellisation.',
      },
      {
        id: 'potential',
        slug: 'chiffres-verger',
        title: 'Potentiel & Chiffres Clés',
        description: '5,35 millions d’arbres, 52 communes oléicoles et statistiques officielles.',
      },
      {
        id: 'galerie-paysages',
        slug: 'paysages-oleicoles',
        title: 'Galerie des Paysages',
        description: 'Mosaïque de terroirs : vallée de la Soummam, terrasses et arbres centenaires.',
      },
    ],
  },
  {
    id: 'silo-cartographie',
    slug: 'carte-moulins',
    title: 'Cartographie & Huileries',
    subtitle: 'SIG & Répertoire des 448 pressoirs',
    icon: MapPin,
    color: '#8CBE5D',
    subsections: [
      {
        id: 'carte-interactive',
        slug: 'carte-bassins',
        title: 'Carte Interactive SIG',
        description: 'Géolocalisation des bassins, moulins et calcul d’itinéraires routiers.',
      },
      {
        id: 'annuaire',
        slug: 'annuaire-huileries',
        title: 'Annuaire des 448 Moulins',
        description: 'Huileries modernes à chaîne continue et pressoirs traditionnels filtrables.',
      },
    ],
  },
  {
    id: 'silo-varietes',
    slug: 'varietes-degustation',
    title: 'Variétés & Dégustation',
    subtitle: 'Patrimoine génétique & Normes COI',
    icon: Droplets,
    color: '#E6AB3C',
    subsections: [
      {
        id: 'varietes',
        slug: 'guide-varietal',
        title: 'Guide Variétal Kabyle',
        description: 'Chemlal, Bouchouk, Aberkane, Limli, Azeradj et fiches partageables.',
      },
      {
        id: 'degustation',
        slug: 'degustation-qualite',
        title: 'Dégustation & Normes COI',
        description: 'Critères organoleptiques, acidité Vierge Extra et bienfaits nutritionnels.',
      },
    ],
  },
  {
    id: 'silo-outils',
    slug: 'outils-pratiques',
    title: 'Outils & Bonnes Pratiques',
    subtitle: 'Simulateur Recharts & Calendrier',
    icon: Calculator,
    color: '#436229',
    subsections: [
      {
        id: 'simulateur',
        slug: 'simulateur-recolte',
        title: 'Simulateur de Rendement & Carbone',
        description: 'Calcul prévisionnel multi-saisons Recharts et bilan carbone de l’oliveraie.',
      },
      {
        id: 'pratiques',
        slug: 'calendrier-agronomique',
        title: 'Météo, Alertes Gel & Calendrier',
        description: 'Météo en direct à Béjaïa, alertes push gelée du Service Worker, indice récolte et taille.',
      },
      {
        id: 'faq-oleiculture',
        slug: 'faq-pratiques',
        title: 'FAQ Taille, Bio & Récolte',
        description: 'Réponses techniques d’experts sur la taille, les traitements bio et la récolte.',
      },
    ],
  },
];

interface SiloNavigationProps {
  activeSectionId: string;
  onNavigate: (sectionId: string) => void;
  onOpenSitemap: () => void;
}

export const SiloNavigation: React.FC<SiloNavigationProps> = ({
  activeSectionId,
  onNavigate,
  onOpenSitemap,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Determine active silo based on activeSectionId
  const activeSilo = SILOS_CONFIG.find((silo) =>
    silo.subsections.some((sub) => sub.id === activeSectionId)
  ) || SILOS_CONFIG[0];

  const activeSubsection = activeSilo.subsections.find(
    (sub) => sub.id === activeSectionId
  ) || activeSilo.subsections[0];

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DEC9] shadow-xs transition-all">
      {/* Scroll progress bar */}
      <div className="w-full bg-[#E6DEC9]/40 h-0.5">
        <div 
          className="bg-[#567B34] h-0.5 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Breadcrumb path */}
          <nav aria-label="Fil d'Ariane contextuel" className="flex items-center gap-1.5 text-xs text-[#436229] overflow-x-auto whitespace-nowrap py-0.5">
            <button
              onClick={() => onNavigate('hero')}
              className="text-[#31491E] font-medium hover:text-[#18230F] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#567B34]" />
              <span>Portail Béjaïa</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-[#B0D984] shrink-0" />

            <span className="font-semibold text-[#18230F] flex items-center gap-1">
              {React.createElement(activeSilo.icon, { className: 'w-3.5 h-3.5 text-[#E6AB3C]' })}
              <span>{activeSilo.title}</span>
            </span>

            <ChevronRight className="w-3.5 h-3.5 text-[#B0D984] shrink-0" />

            <span className="text-[#567B34] bg-[#E8F4D9] px-2 py-0.5 rounded-md font-semibold text-[11px]">
              {activeSubsection.title}
            </span>
          </nav>

          {/* 4 Thematic Silo Switcher Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {SILOS_CONFIG.map((silo, idx) => {
              const Icon = silo.icon;
              const isCurrentSilo = silo.id === activeSilo.id;

              return (
                <button
                  key={silo.id}
                  onClick={() => onNavigate(silo.subsections[0].id)}
                  title={`${silo.title} : ${silo.subtitle}`}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isCurrentSilo
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'bg-white/60 hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9]/60'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrentSilo ? 'bg-[#E6AB3C] text-[#18230F]' : 'bg-[#E6DEC9] text-[#436229]'
                  }`}>
                    {idx + 1}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isCurrentSilo ? 'text-[#FAF7F2]' : 'text-[#567B34]'}`} />
                  <span className="hidden sm:inline">{silo.title}</span>
                </button>
              );
            })}

            {/* Sitemap Modal Trigger Button */}
            <button
              onClick={onOpenSitemap}
              className="ml-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#F4EEE1] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Afficher le plan du site complet et l'index thématique"
            >
              <ListOrdered className="w-3.5 h-3.5 text-[#567B34]" />
              <span className="hidden lg:inline">Plan du site (Index)</span>
            </button>
          </div>
        </div>

        {/* Subsections Quick Chips */}
        <div className="mt-1.5 pt-1.5 border-t border-[#E6DEC9]/40 flex items-center justify-between text-[11px] overflow-x-auto whitespace-nowrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#567B34] font-medium hidden sm:inline">Dans ce pilier :</span>
            {activeSilo.subsections.map((sub) => {
              const isSelected = sub.id === activeSectionId;
              return (
                <button
                  key={sub.id}
                  onClick={() => onNavigate(sub.id)}
                  className={`px-2.5 py-0.5 rounded-full transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-[#233416] text-white shadow-xs'
                      : 'bg-[#FAF7F2] text-[#436229] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                  }`}
                >
                  {sub.title}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[#436229]/80 hidden md:flex items-center gap-1 font-serif italic">
            <Sparkles className="w-3 h-3 text-[#E6AB3C]" />
            <span>Règle des 3 clics : accès direct garanti</span>
          </div>
        </div>
      </div>
    </div>
  );
};
