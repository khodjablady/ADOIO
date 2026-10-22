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
    subtitle: 'Génétique, Normes COI & Concours 2026',
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
        title: 'Dégustation & Guide Consommateur',
        description: 'Guide officiel du consommateur ADOIO (PDF), catégories COI, étiquetage, cuisson et conservation.',
      },
      {
        id: 'concours',
        slug: 'concours-huile',
        title: 'Concours Meilleure Huile 2026',
        description: 'Fête de l’Olive, palmarès & graphique des médailles (5 ans), règlement COI et inscription.',
      },
      {
        id: 'glossaire-oleicole',
        slug: 'glossaire-oleicole',
        title: 'Glossaire Oléicole',
        description: 'Définitions claires des termes techniques (extraction à froid, débourrement, polyphénols, véraison, ardence).',
      },
    ],
  },
  {
    id: 'silo-outils',
    slug: 'outils-pratiques',
    title: 'Outils & Bonnes Pratiques',
    subtitle: 'Simulateurs, Sous-Produits, Diagnostic Bio & Météo',
    icon: Calculator,
    color: '#436229',
    subsections: [
      {
        id: 'simulateur',
        slug: 'simulateur-recolte',
        title: 'Simulateur & Comparateur Variétal',
        description: 'Convertisseur express (15-25%), duel côte à côte de 2 variétés, Recharts multi-saisons et carbone.',
      },
      {
        id: 'fertilisation',
        slug: 'calculateur-fertilisation',
        title: 'Calculateur Fertilisation Organique',
        description: 'Besoins en compost et fumure selon la taille de la parcelle et l’âge des oliviers.',
      },
      {
        id: 'irrigation',
        slug: 'guide-irrigation',
        title: 'Guide & Calculateur d’Irrigation',
        description: 'Besoins en eau selon l’âge des oliviers et le type de sol kabyle (RDI ADOIO).',
      },
      {
        id: 'sous-produits',
        slug: 'valorisation-sous-produits',
        title: 'Valorisation des Sous-Produits',
        description: 'Guide ADOIO : grignons, margines, alimentation animale, compost, biomasse et cosmétiques.',
      },
      {
        id: 'diagnostic-phytosanitaire',
        slug: 'diagnostic-phytosanitaire',
        title: 'Diagnostic Phytosanitaire & Bio',
        description: 'Identification par symptômes (mouche de l’olive, verticilliose, œil de paon) et traitements bio.',
      },
      {
        id: 'pratiques',
        slug: 'calendrier-agronomique',
        title: 'Météo, Alertes Gel & Calendrier',
        description: 'Météo en direct à Béjaïa, alertes push gelée du Service Worker, indice récolte et taille.',
      },
      {
        id: 'assistant-adoio',
        slug: 'assistant-adoio',
        title: 'Assistant Agronomique ADOIO',
        description: 'Conseiller interactif sur les techniques de taille, les maladies de l’olivier et le calendrier de Béjaïa.',
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

  // Flatten all subsections for sequential Prev/Next navigation
  const allSubsections = SILOS_CONFIG.flatMap((silo) =>
    silo.subsections.map((sub) => ({ ...sub, siloId: silo.id, siloTitle: silo.title }))
  );

  const currentFlatIndex = Math.max(
    0,
    allSubsections.findIndex((sub) => sub.id === activeSectionId)
  );
  const prevSubsection = currentFlatIndex > 0 ? allSubsections[currentFlatIndex - 1] : null;
  const nextSubsection =
    currentFlatIndex < allSubsections.length - 1 ? allSubsections[currentFlatIndex + 1] : null;

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
    <div className="sticky top-16 md:top-[108px] z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DEC9] shadow-xs transition-all no-print">
      {/* Scroll progress bar */}
      <div className="w-full bg-[#E6DEC9]/40 h-0.5">
        <div 
          className="bg-[#567B34] h-0.5 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 md:py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          {/* Breadcrumb path */}
          <nav aria-label="Fil d'Ariane contextuel" className="flex items-center gap-1.5 text-xs text-[#436229] overflow-x-auto whitespace-nowrap py-0.5">
            <button
              onClick={() => onNavigate('hero')}
              className="text-[#31491E] font-medium hover:text-[#18230F] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-[#567B34]" />
              <span>Portail Béjaïa</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-[#B0D984] shrink-0" />

            <button
              onClick={() => onNavigate(activeSilo.subsections[0].id)}
              className="font-semibold text-[#18230F] hover:text-[#31491E] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            >
              {React.createElement(activeSilo.icon, { className: 'w-3.5 h-3.5 text-[#E6AB3C]' })}
              <span>{activeSilo.title}</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-[#B0D984] shrink-0" />

            <span className="text-[#567B34] font-semibold text-[11px] shrink-0">
              {activeSubsection.title}
            </span>

            <span className="text-[10px] font-mono tabular-nums text-[#567B34]/80 ml-1 shrink-0">
              · {currentFlatIndex + 1}/{allSubsections.length}
            </span>
          </nav>

          {/* 4 Thematic Silo Switcher Tabs */}
          <div className="hidden sm:flex items-center gap-1 overflow-x-auto pb-0.5 md:pb-0 scrollbar-none">
            {SILOS_CONFIG.map((silo, idx) => {
              const Icon = silo.icon;
              const isCurrentSilo = silo.id === activeSilo.id;

              return (
                <button
                  key={silo.id}
                  onClick={() => onNavigate(silo.subsections[0].id)}
                  title={`${silo.title} : ${silo.subtitle}`}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
                    isCurrentSilo
                      ? 'bg-[#31491E] text-white shadow-xs'
                      : 'bg-white/60 hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9]/60'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold tabular-nums ${
                    isCurrentSilo ? 'bg-[#E6AB3C] text-[#18230F]' : 'bg-[#E6DEC9] text-[#436229]'
                  }`}>
                    {idx + 1}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isCurrentSilo ? 'text-[#FAF7F2]' : 'text-[#567B34]'}`} />
                  <span className="hidden lg:inline">{silo.title}</span>
                </button>
              );
            })}

            {/* Sitemap Modal Trigger Button */}
            <button
              onClick={onOpenSitemap}
              className="ml-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#F4EEE1] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap"
              title="Afficher le plan du site complet et l'index thématique (17 chapitres)"
            >
              <ListOrdered className="w-3.5 h-3.5 text-[#567B34]" />
              <span className="hidden xl:inline">Plan du site (17)</span>
            </button>
          </div>
        </div>

        {/* Subsections Quick Bar + Sequential Stepper (Desktop & Tablet) */}
        <div className="hidden md:flex mt-1.5 pt-1.5 border-t border-[#E6DEC9]/40 items-center justify-between text-[11px] overflow-x-auto whitespace-nowrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[#567B34] font-semibold shrink-0">
              Chapitres ({activeSilo.subsections.length}) :
            </span>
            {activeSilo.subsections.map((sub) => {
              const isSelected = sub.id === activeSectionId;
              return (
                <button
                  key={sub.id}
                  onClick={() => onNavigate(sub.id)}
                  className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer font-medium whitespace-nowrap shrink-0 ${
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

          <div className="hidden xl:flex items-center gap-1.5 shrink-0">
            {prevSubsection && (
              <button
                onClick={() => onNavigate(prevSubsection.id)}
                className="px-2 py-0.5 rounded-md bg-white hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] text-[10px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                title={`Chapitre précédent : ${prevSubsection.title}`}
              >
                ← {prevSubsection.title}
              </button>
            )}
            {nextSubsection && (
              <button
                onClick={() => onNavigate(nextSubsection.id)}
                className="px-2 py-0.5 rounded-md bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#18230F] border border-[#8CBE5D]/50 text-[10px] font-bold transition-colors cursor-pointer whitespace-nowrap"
                title={`Chapitre suivant : ${nextSubsection.title}`}
              >
                Suivant : {nextSubsection.title} →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
