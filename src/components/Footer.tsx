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
  ShieldCheck
} from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenAdhesion: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenAdhesion }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#18230F] text-[#FAF7F2] border-t border-[#8CBE5D]/20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-[#FAF7F2]/10">
          {/* Brand info */}
          <div className="lg:col-span-5 space-y-4">
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
          </div>

          {/* Quick links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E6AB3C]">
              Navigation du Portail
            </h4>
            <ul className="space-y-2 text-xs text-[#E8F4D9]/80">
              <li>
                <button
                  onClick={() => onNavClick('potential')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Potentialités & Verger de Béjaïa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('carte-interactive')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Carte Interactive des Bassins & Moulins
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('adoio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Missions & Gouvernance ADOIO
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('annuaire')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Annuaire des 448 Huileries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('varietes')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Guide Variétal (Chemlal, Bouchouk...)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('simulateur')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Simulateur de Rendement & Récolte
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('pratiques')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Calendrier & Bonnes Pratiques
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
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
