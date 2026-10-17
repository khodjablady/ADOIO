import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2, Sparkles } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'banner' | 'footer';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'navbar',
  className = '' 
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);

  // If already installed as PWA or in standalone mode, do not show prompt
  if (isInstalled) {
    return null;
  }

  // If browser doesn't support install prompt and is not iOS, keep minimal fallback or hide
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleInstallClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] border border-[#E6DEC9] hover:border-[#8CBE5D] text-[#233416] text-xs font-bold transition-all shadow-2xs cursor-pointer ${className}`}
          title="Installer l'application pour consultation hors-ligne"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#567B34]" />
          <span className="hidden sm:inline">Installer l'App</span>
          <span className="sm:hidden">App</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
        </button>
      )}

      {variant === 'banner' && (
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-[#233416] to-[#31491E] text-[#FAF7F2] border border-[#8CBE5D]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8CBE5D]/20 border border-[#8CBE5D]/30 flex items-center justify-center text-[#8CBE5D] shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E6AB3C]">
                  Application Hors-Ligne Gratuite
                </span>
                <span className="text-[10px] bg-[#8CBE5D]/20 text-[#B0D984] px-2 py-0.2 rounded-full font-semibold">PWA</span>
              </div>
              <p className="text-xs text-[#E8F4D9] mt-0.5 leading-snug">
                Installez le portail sur votre téléphone pour consulter les huileries et le guide technique au verger sans internet.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="px-4 py-2 rounded-xl bg-[#E6AB3C] hover:bg-[#D09222] text-[#18230F] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Installer sur Téléphone</span>
          </button>
        </div>
      )}

      {variant === 'footer' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-2 text-xs font-medium text-[#FAF7F2]/80 hover:text-white transition-colors cursor-pointer ${className}`}
        >
          <Smartphone className="w-4 h-4 text-[#E6AB3C]" />
          <span>Installer l'application PWA (Hors-ligne)</span>
        </button>
      )}

      {/* iOS Installation Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-[#FAF7F2] p-6 shadow-2xl border border-[#E6DEC9] text-[#242A20]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC9]">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#567B34]" />
                <h3 className="font-serif text-lg font-bold text-[#18230F]">Installer sur iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-[#E6DEC9]/40 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-[#436229] leading-relaxed">
              Pour accéder au portail sans connexion dans vos oliveraies depuis Safari iOS :
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#E6DEC9]">
                <div className="w-6 h-6 rounded-lg bg-[#E8F4D9] text-[#233416] font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <span className="font-bold text-[#18230F] block">Bouton Partager</span>
                  <p className="text-[11px] text-[#567B34] flex items-center gap-1 mt-0.5">
                    Appuyez sur <Share2 className="w-3.5 h-3.5 inline text-[#3B82F6]" /> dans la barre de navigation Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#E6DEC9]">
                <div className="w-6 h-6 rounded-lg bg-[#E8F4D9] text-[#233416] font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <span className="font-bold text-[#18230F] block">Sur l'écran d'accueil</span>
                  <p className="text-[11px] text-[#567B34] flex items-center gap-1 mt-0.5">
                    Faites défiler vers le bas et sélectionnez <PlusSquare className="w-3.5 h-3.5 inline text-[#567B34]" /> « Sur l'écran d'accueil ».
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#E6DEC9]">
                <div className="w-6 h-6 rounded-lg bg-[#E8F4D9] text-[#233416] font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <span className="font-bold text-[#18230F] block">Valider l'ajout</span>
                  <p className="text-[11px] text-[#567B34] mt-0.5">
                    Appuyez sur « Ajouter » en haut à droite. L'icône Olive Béjaïa apparaîtra sur votre écran d'accueil.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-xl bg-[#233416] py-2.5 text-xs font-bold text-[#FAF7F2] hover:bg-[#18230F] transition-colors cursor-pointer"
            >
              Compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};
