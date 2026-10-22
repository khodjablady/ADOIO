import React from 'react';
import { ADOIO_INFO } from '../data/bejaiaOliveData';
import { AdoioLogo } from './AdoioLogo';
import { 
  Droplets, 
  MapPin, 
  Phone, 
  Mail, 
  ArrowUp, 
  Heart,
  ShieldCheck,
  Globe,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenAdhesion: () => void;
  onOpenSitemap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenAdhesion, onOpenSitemap }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#18230F] text-[#FAF7F2] border-t border-[#8CBE5D]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-[#FAF7F2]/10">
          {/* Brand info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center">
                <AdoioLogo size={48} className="w-full h-full" />
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-[#FAF7F2]">
                  Olive Béjaïa
                </span>
                <span className="block text-[10px] text-[#B0D984] font-medium tracking-wide uppercase">
                  Portail Officiel ADOIO
                </span>
              </div>
            </div>

            <p className="text-xs text-[#E8F4D9]/80 leading-relaxed max-w-sm">
              L'Association pour le Développement de l'Oléiculture et des Industries Oléicoles (ADOIO) œuvre pour la valorisation du patrimoine oléicole de la wilaya de Béjaïa et l'essor de l'Huile d'Olive de Kabylie.
            </p>

            <div className="pt-2 text-xs text-[#B0D984] italic font-serif">
              « Zzit uzemmur d lmektub n tmurt nneɣ »
            </div>

            {onOpenSitemap && (
              <div className="pt-2">
                <button
                  onClick={onOpenSitemap}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] text-xs font-semibold border border-[#FAF7F2]/15 transition-all cursor-pointer"
                >
                  <span>Consulter le Plan du Site & Index</span>
                </button>
              </div>
            )}
          </div>

          {/* 4 Thematic Pillars links */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Pillar 1 & 2 */}
            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#E6AB3C] mb-2">
                  1. Terroir & Association
                </h4>
                <ul className="space-y-1.5 text-xs text-[#E8F4D9]/80">
                  <li>
                    <button
                      onClick={() => onNavClick('adoio')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Missions & 25 ans ADOIO
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('potential')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Potentialités & Chiffres Clés
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('galerie-paysages')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Galerie des Paysages Oléicoles
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#E6AB3C] mb-2">
                  2. Cartographie & Huileries
                </h4>
                <ul className="space-y-1.5 text-xs text-[#E8F4D9]/80">
                  <li>
                    <button
                      onClick={() => onNavClick('carte-interactive')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Carte Interactive & Bassins
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('annuaire')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Annuaire des 448 Huileries
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pillar 3 & 4 */}
            <div className="space-y-4">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#E6AB3C] mb-2">
                  3. Variétés & Dégustation
                </h4>
                <ul className="space-y-1.5 text-xs text-[#E8F4D9]/80">
                  <li>
                    <button
                      onClick={() => onNavClick('varietes')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Guide Variétal (Chemlal...)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('degustation')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Dégustation & Normes COI
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('concours')}
                      className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5 text-[#E6AB3C] font-semibold"
                    >
                      <span>Concours Meilleure Huile 2026</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('glossaire-oleicole')}
                      className="hover:text-white transition-colors cursor-pointer text-left text-[#B0D984] font-semibold"
                    >
                      Glossaire Oléicole & Termes COI
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#E6AB3C] mb-2">
                  4. Outils & Bonnes Pratiques
                </h4>
                <ul className="space-y-1.5 text-xs text-[#E8F4D9]/80">
                  <li>
                    <button
                      onClick={() => onNavClick('simulateur')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Simulateur de Rendement & Carbone
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('fertilisation')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Calculateur Fertilisation Organique
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('irrigation')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Guide & Calculateur d'Irrigation
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('sous-produits')}
                      className="hover:text-white transition-colors cursor-pointer text-left text-[#E6AB3C] font-semibold"
                    >
                      Valorisation des Sous-Produits (Guide ADOIO)
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('diagnostic-phytosanitaire')}
                      className="hover:text-white transition-colors cursor-pointer text-left text-[#B0D984] font-semibold"
                    >
                      Diagnostic Phytosanitaire & Bio
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('pratiques')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      Calendrier, Météo & Vigilance Gel
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('assistant-adoio')}
                      className="hover:text-white transition-colors cursor-pointer text-left text-[#E6AB3C] font-semibold"
                    >
                      Assistant Agronomique ADOIO
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => onNavClick('faq-oleiculture')}
                      className="hover:text-white transition-colors cursor-pointer text-left"
                    >
                      FAQ Taille, Bio & Récolte
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6AB3C]">
              Coordonnées de l'Association
            </h4>
            <div className="space-y-2.5 text-xs text-[#E8F4D9]/85">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E6AB3C] shrink-0 mt-0.5" />
                <span>{ADOIO_INFO.headquarters}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E6AB3C] shrink-0" />
                <a href={`tel:${ADOIO_INFO.phone}`} className="hover:text-white underline">
                  {ADOIO_INFO.phone}
                </a>
                <span>/</span>
                <a href={`tel:${ADOIO_INFO.mobile}`} className="hover:text-white underline">
                  {ADOIO_INFO.mobile}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E6AB3C] shrink-0" />
                <a href={`mailto:${ADOIO_INFO.email}`} className="hover:text-white underline">
                  {ADOIO_INFO.email}
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdhesion}
                className="px-4 py-2 rounded-lg bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-[#FAF7F2] text-xs font-semibold border border-[#FAF7F2]/15 transition-all cursor-pointer"
              >
                Formulaire de Contact / Adhésion
              </button>
            </div>

            {/* Sites du Secteur Oléicole International */}
            <div className="pt-4 border-t border-[#FAF7F2]/10 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6AB3C] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#E6AB3C]" />
                <span>Sites du Secteur Oléicole</span>
              </h4>
              <ul className="space-y-2 text-xs text-[#E8F4D9]/85">
                <li>
                  <a
                    href="https://www.internationaloliveoil.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-2 p-2 rounded-lg bg-[#FAF7F2]/5 hover:bg-[#FAF7F2]/15 border border-[#FAF7F2]/10 transition-all"
                  >
                    <div>
                      <span className="font-semibold text-white group-hover:text-[#E6AB3C] transition-colors block">
                        Conseil Oléicole International (COI)
                      </span>
                      <span className="text-[11px] text-[#B0D984] font-mono">
                        www.internationaloliveoil.org
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#E6AB3C] shrink-0 mt-0.5" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.oliveoiltimes.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-2 p-2 rounded-lg bg-[#FAF7F2]/5 hover:bg-[#FAF7F2]/15 border border-[#FAF7F2]/10 transition-all"
                  >
                    <div>
                      <span className="font-semibold text-white group-hover:text-[#E6AB3C] transition-colors block">
                        Olive Oil Times (Actualités & Marchés)
                      </span>
                      <span className="text-[11px] text-[#B0D984] font-mono">
                        www.oliveoiltimes.com
                      </span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#E6AB3C] shrink-0 mt-0.5" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#E8F4D9]/60">
          <div>
            © {new Date().getFullYear()} ADOIO Béjaïa — Association pour le Développement de l'Oléiculture et des Industries Oléicoles. Tous droits réservés.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8CBE5D]" /> Terroirs de Kabylie
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-white transition-colors cursor-pointer"
              title="Retour en haut"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
