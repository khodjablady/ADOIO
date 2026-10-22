import React, { useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { 
  WifiOff, 
  Wifi, 
  CheckCircle2, 
  Layers, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Sparkles,
  Database
} from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  // If online, don't show the offline alert banner, but reset dismiss state
  if (isOnline) {
    return null;
  }

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-20 left-5 z-50 flex items-center gap-2 bg-[#233416] text-[#FAF7F2] px-3 py-1.5 rounded-full shadow-lg border border-[#8CBE5D]/40 text-xs font-semibold cursor-pointer hover:bg-[#18230F] transition-all"
        title="Mode hors-ligne actif - Cliquer pour détails"
      >
        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        <span>Hors-ligne</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 left-5 right-5 sm:right-auto sm:max-w-md z-50 bg-[#233416] text-[#FAF7F2] rounded-2xl shadow-2xl border border-[#8CBE5D]/40 p-4 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Mode Hors-Ligne Actif
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <p className="text-xs text-[#E8F4D9] font-medium leading-tight mt-0.5">
              Zone rurale sans réseau · Données locales disponibles
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-white/10 text-[#E8F4D9] transition-colors cursor-pointer"
            title={isExpanded ? 'Réduire' : 'Voir les contenus accessibles'}
            aria-label="Détails hors-ligne"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg hover:bg-white/10 text-[#E8F4D9] transition-colors cursor-pointer"
            title="Masquer le bandeau"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#FAF7F2]/15 text-xs text-[#E8F4D9] space-y-2">
          <p className="text-[11px] leading-relaxed text-[#FAF7F2]/90">
            Grâce au <strong>Service Worker ADOIO</strong>, les producteurs et oléiculteurs peuvent consulter les ressources clés sur le terrain même sans connexion internet :
          </p>
          <ul className="space-y-1.5 text-[11px]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8CBE5D] shrink-0" />
              <span>Annuaire complet des 448 huileries et coordonnées</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8CBE5D] shrink-0" />
              <span>Guide des variétés kabyles (Chemlal, Bouchouk, etc.)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8CBE5D] shrink-0" />
              <span>Simulateur de récolte, rendement d'huile et bilan carbone</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8CBE5D] shrink-0" />
              <span>Calendrier technique, bonnes pratiques et FAQ de taille</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
