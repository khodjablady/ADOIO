import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Droplets, 
  Award, 
  Search, 
  ArrowRight, 
  CheckCircle2,
  FileText,
  Compass,
  Phone,
  Download,
  ExternalLink
} from 'lucide-react';
import { SILOS_CONFIG } from './SiloNavigation';
import { OLIVE_VARIETIES, BEJAIA_COMMUNES_DATA, ADOIO_INFO } from '../data/bejaiaOliveData';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [filterText, setFilterText] = useState('');

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectSection = (id: string) => {
    onNavigate(id);
    onClose();
  };

  const normalizedQuery = filterText.trim().toLowerCase();

  const filteredSilos = SILOS_CONFIG.map((silo) => ({
    ...silo,
    subsections: normalizedQuery
      ? silo.subsections.filter(
          (sub) =>
            sub.title.toLowerCase().includes(normalizedQuery) ||
            sub.description.toLowerCase().includes(normalizedQuery) ||
            sub.slug.toLowerCase().includes(normalizedQuery) ||
            silo.title.toLowerCase().includes(normalizedQuery)
        )
      : silo.subsections,
  })).filter((silo) => silo.subsections.length > 0);

  const filteredCommunes = BEJAIA_COMMUNES_DATA.filter(c => 
    c.commune.toLowerCase().includes(normalizedQuery) ||
    c.daira.toLowerCase().includes(normalizedQuery)
  );

  const filteredVarieties = OLIVE_VARIETIES.filter(v =>
    v.name.toLowerCase().includes(normalizedQuery) ||
    v.kabyleName.toLowerCase().includes(normalizedQuery)
  );

  const officialGuides = [
    {
      title: 'Guide du Consommateur de l’Huile d’Olive (ADOIO – Édition révisée)',
      subtitle: 'Comprendre, choisir, déguster, lire l’étiquette, cuisiner et conserver (8 pages)',
      pdfUrl: '/assets/aistudio/Guide_consommateur_huile_olive_ADOIO_revise_b2346a53.pdf',
      sectionId: 'degustation',
      badge: 'Guide Consommateur PDF',
    },
    {
      title: 'Les Sous-Produits Oléicoles : Mieux les connaître, mieux les valoriser',
      subtitle: 'Grignons, margines, bois de taille, compostage, biomasse, cosmétique & oléotourisme (14 pages)',
      pdfUrl: '/assets/aistudio/Les_sous_produits_oleicoles_version_revisee_265b6229.pdf',
      sectionId: 'sous-produits',
      badge: 'Guide Technique PDF',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sitemap-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FAF7F2] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E6DEC9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-6 bg-[#233416] text-[#FAF7F2] flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B0D984] mb-1">
              <Compass className="w-3.5 h-3.5 text-[#E6AB3C]" />
              <span>Architecture de l'Information · 4 Piliers & 17 Chapitres</span>
            </div>
            <h3 id="sitemap-modal-title" className="font-serif text-2xl font-bold tracking-tight">
              Plan du Site & Table des Matières ADOIO
            </h3>
            <p className="text-xs text-[#E8F4D9]/80 mt-0.5">
              Accès direct sans friction à tous les modules, guides PDF officiels, communes, fiches variétales, glossaire et outils interactifs.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] transition-colors cursor-pointer"
            aria-label="Fermer le plan du site"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar inside modal */}
        <div className="p-4 bg-[#F4EEE1] border-b border-[#E6DEC9] shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[#567B34] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrer les 17 chapitres, une variété (Chemlal, Bouchouk...), une commune (Akbou, Seddouk...), un terme du glossaire..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-[#E6DEC9] text-xs focus:outline-none focus:ring-2 focus:ring-[#567B34] text-[#18230F]"
            />
          </div>
        </div>

        {/* Scrollable Content: 4 Silos Architecture */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Grid of the 4 Thematic Silos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSilos.map((silo) => {
              const Icon = silo.icon;
              const originalIdx = SILOS_CONFIG.findIndex((s) => s.id === silo.id);
              return (
                <div 
                  key={silo.id}
                  className="bg-white rounded-2xl p-5 border border-[#E6DEC9] shadow-xs flex flex-col justify-between hover:border-[#8CBE5D] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#E8F4D9] text-[#233416] flex items-center justify-center font-bold text-xs">
                        P{originalIdx + 1}
                      </div>
                      <Icon className="w-5 h-5 text-[#31491E]" />
                      <h4 className="font-serif font-bold text-base text-[#18230F]">
                        {silo.title}
                      </h4>
                    </div>
                    <p className="text-xs text-[#567B34] mb-3 font-medium">
                      {silo.subtitle}
                    </p>

                    <div className="space-y-2">
                      {silo.subsections.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSection(sub.id)}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4EEE1] border border-transparent hover:border-[#E6DEC9] transition-all group flex items-start justify-between gap-2 cursor-pointer"
                        >
                          <div>
                            <div className="text-xs font-bold text-[#18230F] group-hover:text-[#31491E] flex items-center gap-1.5">
                              <span>{sub.title}</span>
                              <span className="text-[10px] text-[#567B34]/60 font-mono">#{sub.slug}</span>
                            </div>
                            <p className="text-[11px] text-[#436229]/80 mt-0.5 leading-snug">
                              {sub.description}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#567B34] shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Official PDF Guides & Documents Library */}
          <div className="bg-[#F4EEE1] p-5 rounded-2xl border border-[#E6DEC9]">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-[#31491E]" />
              <h5 className="font-serif font-bold text-sm text-[#18230F]">
                Bibliothèque des Guides Officiels ADOIO (Documents PDF & Rubriques dédiées)
              </h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {officialGuides.map((doc) => (
                <div
                  key={doc.pdfUrl}
                  className="bg-white rounded-xl p-3.5 border border-[#E6DEC9] flex flex-col justify-between gap-3"
                >
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[#E8F4D9] text-[#233416] text-[10px] font-bold mb-1">
                      {doc.badge}
                    </span>
                    <h6 className="text-xs font-bold text-[#18230F]">{doc.title}</h6>
                    <p className="text-[11px] text-[#436229] mt-0.5">{doc.subtitle}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E6DEC9]/60">
                    <button
                      onClick={() => handleSelectSection(doc.sectionId)}
                      className="px-2.5 py-1 rounded-lg bg-[#31491E] hover:bg-[#233416] text-white text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Aller à la rubrique interactive
                    </button>
                    <a
                      href={doc.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] text-[11px] font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-[#567B34]" />
                      <span>Lire le PDF</span>
                    </a>
                    <a
                      href={doc.pdfUrl}
                      download
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-[#F4EEE1] text-[#233416] border border-[#E6DEC9] text-[11px] font-semibold transition-colors"
                    >
                      <Download className="w-3 h-3 text-[#567B34]" />
                      <span>Télécharger</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Deep-Links Index: Variétés & Communes (Eliminates orphan content) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Varietal Index */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-[#E6AB3C]" />
                <h5 className="font-serif font-bold text-sm text-[#18230F]">
                  Index des Variétés Kabyles ({filteredVarieties.length})
                </h5>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {filteredVarieties.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => handleSelectSection(`varietes`)}
                    className="px-2.5 py-1 rounded-lg bg-white text-[11px] font-semibold text-[#233416] border border-[#E6DEC9] hover:bg-[#E8F4D9] hover:border-[#8CBE5D] transition-colors cursor-pointer"
                  >
                    {v.name} <span className="text-[#567B34] font-normal font-serif italic">({v.kabyleName})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Communes Index */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9]">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[#E6AB3C]" />
                <h5 className="font-serif font-bold text-sm text-[#18230F]">
                  Index des 52 Communes ({filteredCommunes.length})
                </h5>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {filteredCommunes.slice(0, 18).map((c) => (
                  <button
                    key={c.commune}
                    onClick={() => handleSelectSection('carte-interactive')}
                    className="px-2 py-0.5 rounded-md bg-white text-[11px] text-[#233416] border border-[#E6DEC9] hover:bg-[#E8F4D9] transition-colors cursor-pointer"
                  >
                    {c.commune}
                  </button>
                ))}
                {filteredCommunes.length > 18 && (
                  <button
                    onClick={() => handleSelectSection('carte-interactive')}
                    className="px-2 py-0.5 rounded-md bg-[#E8F4D9] text-[11px] font-bold text-[#31491E] cursor-pointer"
                  >
                    + {filteredCommunes.length - 18} autres sur la carte
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Institutional Contacts and Direct Support */}
          <div className="bg-[#233416] text-[#FAF7F2] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#FAF7F2]/10 text-[#E6AB3C]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold block text-sm">Permanence ADOIO - Siège Régional</span>
                <span className="text-[#E8F4D9]/80 text-[11px]">{ADOIO_INFO.headquarters}</span>
              </div>
            </div>
            <a
              href={`tel:${ADOIO_INFO.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8CBE5D] hover:bg-[#729e4b] text-[#18230F] font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{ADOIO_INFO.phone}</span>
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F4EEE1] border-t border-[#E6DEC9] flex items-center justify-between text-xs text-[#567B34] shrink-0">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#567B34]" />
            Architecture 4 Piliers · 17 Chapitres interconnectés · Zéro contenu orphelin
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#233416] text-white font-bold hover:bg-[#18230F] transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
