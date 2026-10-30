import React, { useState, useEffect, useCallback } from 'react';
import { AGRICULTURAL_CALENDAR } from '../data/bejaiaOliveData';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  AlertTriangle, 
  BookOpen, 
  Leaf, 
  Clock, 
  Download,
  ArrowRight,
  Bell,
  BellRing,
  BellOff,
  Sliders
} from 'lucide-react';
import { BejaiaHarvestWeatherWidget } from './BejaiaHarvestWeatherWidget';
import { WeatherAlertCenter } from './WeatherAlertCenter';
import { ArticleAudioReader } from './ArticleAudioReader';
import { VARIETY_HARVEST_PROFILES } from './OptimalHarvestAlertSystem';

interface SimulatorHarvestSnapshot {
  varietyId: string;
  varietyName: string;
  harvestPeriod: 'early' | 'mid' | 'late';
  optimalWindowLabel: string;
  optimalMonths: string;
  ripenessWindow: string;
  maturityIndex: number;
  yieldPerQuintal: number;
  estimatedOilLiters: number;
  estimatedAcidity: number;
  qualityGrade: string;
  isApproachingOrOptimal: boolean;
  updatedAt: string;
}

const SIMULATOR_SNAPSHOT_KEY = 'adoio_simulator_harvest_snapshot';
const LOCAL_NOTIF_TOGGLE_KEY = 'adoio_calendar_harvest_notif_enabled';

const DEFAULT_SNAPSHOT: SimulatorHarvestSnapshot = {
  varietyId: 'chemlal',
  varietyName: 'Chemlal de Kabylie',
  harvestPeriod: 'mid',
  optimalWindowLabel: VARIETY_HARVEST_PROFILES.chemlal.optimalPeriodLabel,
  optimalMonths: VARIETY_HARVEST_PROFILES.chemlal.optimalMonths,
  ripenessWindow: VARIETY_HARVEST_PROFILES.chemlal.ripenessWindow,
  maturityIndex: 3.1,
  yieldPerQuintal: 18.4,
  estimatedOilLiters: 92,
  estimatedAcidity: 0.3,
  qualityGrade: "Huile d'Olive Vierge Extra (HOVE)",
  isApproachingOrOptimal: true,
  updatedAt: new Date().toISOString(),
};

function loadSimulatorSnapshot(): SimulatorHarvestSnapshot {
  try {
    const raw = localStorage.getItem(SIMULATOR_SNAPSHOT_KEY);
    if (!raw) return DEFAULT_SNAPSHOT;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_SNAPSHOT;
    return { ...DEFAULT_SNAPSHOT, ...parsed };
  } catch {
    return DEFAULT_SNAPSHOT;
  }
}

export const CalendarAndPractices: React.FC = () => {
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState<number>(0);
  const currentSeason = AGRICULTURAL_CALENDAR[selectedSeasonIdx];

  const [simulatorData, setSimulatorData] = useState<SimulatorHarvestSnapshot>(() =>
    loadSimulatorSnapshot()
  );

  const [isHarvestNotifEnabled, setIsHarvestNotifEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_NOTIF_TOGGLE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | 'unsupported'
  >(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  });

  const [localAlertBanner, setLocalAlertBanner] = useState<{
    title: string;
    body: string;
    timestamp: string;
    viaBrowserApi: boolean;
  } | null>(null);

  const dispatchHarvestWindowNotification = useCallback(
    async (snapshot: SimulatorHarvestSnapshot) => {
      const periodStatus =
        snapshot.harvestPeriod === 'early'
          ? 'Fenêtre de récolte optimale en approche (pré-véraison)'
          : snapshot.harvestPeriod === 'mid'
          ? 'Fenêtre de récolte optimale ouverte (véraison idéale)'
          : 'Attention : maturité avancée dépassant la fenêtre optimale';

      const title = `🫒 Alerte Récolte ADOIO : ${snapshot.varietyName}`;
      const body = `${periodStatus} — Période cible : ${snapshot.optimalWindowLabel} (${snapshot.ripenessWindow}, IM ${snapshot.maturityIndex.toFixed(
        1
      )}). Rendement simulé : ${snapshot.yieldPerQuintal.toFixed(1)} L/qx (${snapshot.estimatedOilLiters} L).`;

      let deliveredViaBrowser = false;

      if (typeof window !== 'undefined' && 'Notification' in window) {
        try {
          let perm = Notification.permission;
          if (perm === 'default') {
            perm = await Notification.requestPermission();
          }
          setNotificationPermission(perm);

          if (perm === 'granted') {
            try {
              new Notification(title, {
                body,
                icon: '/pwa-192x192.png',
                tag: 'adoio-calendar-optimal-harvest-window',
              });
              deliveredViaBrowser = true;
            } catch {
              if ('serviceWorker' in navigator) {
                const reg = await navigator.serviceWorker.getRegistration();
                if (reg && 'showNotification' in reg) {
                  await reg.showNotification(title, {
                    body,
                    icon: '/pwa-192x192.png',
                    tag: 'adoio-calendar-optimal-harvest-window',
                  });
                  deliveredViaBrowser = true;
                }
              }
            }
          }
        } catch {
          // Fallback to inline banner below
        }
      }

      setLocalAlertBanner({
        title,
        body,
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        viaBrowserApi: deliveredViaBrowser,
      });
    },
    []
  );

  // Listen for simulator updates (same tab custom event + cross-tab storage event)
  useEffect(() => {
    const handleSimulatorUpdate = (event: Event) => {
      const customEvt = event as CustomEvent<SimulatorHarvestSnapshot>;
      const nextData = customEvt.detail || loadSimulatorSnapshot();
      setSimulatorData(nextData);
      if (isHarvestNotifEnabled && nextData.isApproachingOrOptimal) {
        dispatchHarvestWindowNotification(nextData);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === SIMULATOR_SNAPSHOT_KEY) {
        const nextData = loadSimulatorSnapshot();
        setSimulatorData(nextData);
      } else if (event.key === LOCAL_NOTIF_TOGGLE_KEY) {
        setIsHarvestNotifEnabled(event.newValue === 'true');
      }
    };

    window.addEventListener('adoio-simulator-updated', handleSimulatorUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('adoio-simulator-updated', handleSimulatorUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [isHarvestNotifEnabled, dispatchHarvestWindowNotification]);

  const handleToggleHarvestNotification = async () => {
    const nextEnabled = !isHarvestNotifEnabled;
    setIsHarvestNotifEnabled(nextEnabled);
    try {
      localStorage.setItem(LOCAL_NOTIF_TOGGLE_KEY, String(nextEnabled));
    } catch {
      // Ignore storage errors
    }

    if (nextEnabled) {
      await dispatchHarvestWindowNotification(simulatorData);
    } else {
      setLocalAlertBanner(null);
    }
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <section id="pratiques" className="py-16 sm:py-24 bg-[#F4EEE1] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <BookOpen className="w-4 h-4 text-[#E6AB3C]" />
              <span>Guide Technique & Vulgarisation ADOIO</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              Calendrier Saisonnier & Bonnes Pratiques Oléicoles
            </h2>
            <p className="mt-2 text-sm text-[#436229] max-w-2xl leading-relaxed">
              Pour obtenir une huile d'olive Vierge Extra d'exception tout en préservant la longévité de nos oliviers centenaires, suivez les préconisations saisonnières de nos agronomes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <ArticleAudioReader
              sectionId="pratiques"
              title={`Calendrier Saisonnier et Bonnes Pratiques Oléicoles — ${currentSeason.season}`}
              text={() => {
                const allSeasonsText = AGRICULTURAL_CALENDAR.map(
                  (s) =>
                    `${s.season} (en kabyle ${s.kabyleTerm}) — Action principale : ${s.action}. Travaux recommandés : ${s.tasks.join(' ')}`
                ).join(' ');
                return `Guide technique du calendrier saisonnier de l'olivier à Béjaïa. Saison actuellement affichée : ${currentSeason.season} (${currentSeason.kabyleTerm}, ${currentSeason.action}). ${allSeasonsText}`;
              }}
            />
            <button
              onClick={handlePrintSummary}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E6DEC9] text-[#18230F] text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-[#FAF7F2] transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4 text-[#567B34]" />
              <span>Imprimer le Guide Synthétique</span>
            </button>
          </div>
        </div>

        {/* Simple Local Notification Toggle (Synced with YieldSimulator Data) */}
        <div
          id="calendar-harvest-notification-toggle"
          className="mb-8 bg-white rounded-3xl border-2 border-[#D5C7A3] p-5 sm:p-6 shadow-xs transition-all"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  isHarvestNotifEnabled
                    ? 'bg-[#233416] text-[#E6AB3C]'
                    : 'bg-[#FAF7F2] text-[#567B34] border border-[#E6DEC9]'
                }`}
              >
                {isHarvestNotifEnabled ? (
                  <BellRing className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#567B34]">
                    Alerte Locale Navigateur (Notification API)
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      simulatorData.isApproachingOrOptimal
                        ? 'bg-[#E8F4D9] text-[#233416] border-[#8CBE5D]'
                        : 'bg-[#FEF5DB] text-[#8C5E0A] border-[#E6AB3C]'
                    }`}
                  >
                    {simulatorData.harvestPeriod === 'early'
                      ? 'Fenêtre en approche (Novembre)'
                      : simulatorData.harvestPeriod === 'mid'
                      ? 'Fenêtre optimale active (Décembre)'
                      : 'Fin de fenêtre optimale (Tardif)'}
                  </span>
                </div>

                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#18230F]">
                  Rappel d'Approche de la Fenêtre Optimale de Récolte
                </h3>

                <p className="text-xs text-[#436229] leading-relaxed">
                  Synchronisé avec vos paramètres du{' '}
                  <a href="#simulateur" className="font-bold text-[#233416] underline hover:text-[#567B34]">
                    Simulateur de Rendement
                  </a>{' '}
                  : variété <strong>{simulatorData.varietyName}</strong> · période idéale{' '}
                  <strong>{simulatorData.optimalWindowLabel}</strong> ({simulatorData.ripenessWindow}, IM{' '}
                  <strong>{simulatorData.maturityIndex.toFixed(1)}</strong> ·{' '}
                  <strong>{simulatorData.yieldPerQuintal.toFixed(1)} L/qx</strong>).
                </p>
              </div>
            </div>

            {/* Toggle Switch + Test Action */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E6DEC9]">
              <button
                type="button"
                role="switch"
                aria-checked={isHarvestNotifEnabled}
                aria-label="Activer l'alerte locale de fenêtre optimale de récolte"
                onClick={handleToggleHarvestNotification}
                className={`group inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  isHarvestNotifEnabled
                    ? 'bg-[#233416] text-[#FAF7F2] border-[#233416] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#18230F] border-[#D5C7A3] hover:border-[#31491E]'
                }`}
              >
                <span
                  className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                    isHarvestNotifEnabled ? 'bg-[#8CBE5D]' : 'bg-[#D5C7A3]'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      isHarvestNotifEnabled ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </span>
                <span>
                  {isHarvestNotifEnabled
                    ? 'Alerte Récolte Activée'
                    : 'Activer l’Alerte Récolte'}
                </span>
              </button>

              {isHarvestNotifEnabled && (
                <button
                  type="button"
                  onClick={() => dispatchHarvestWindowNotification(simulatorData)}
                  className="px-3.5 py-2.5 rounded-2xl bg-[#E8F4D9] hover:bg-[#31491E] text-[#233416] hover:text-white border border-[#8CBE5D] text-xs font-bold transition-colors cursor-pointer"
                >
                  Tester la notification
                </button>
              )}
            </div>
          </div>

          {/* Permission / Live Alert Feedback Banner */}
          {localAlertBanner && isHarvestNotifEnabled && (
            <div
              role="status"
              aria-live="polite"
              className="mt-4 p-3.5 rounded-2xl bg-[#F4F9EC] border border-[#8CBE5D] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#18230F]"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#567B34] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    {localAlertBanner.title} ({localAlertBanner.timestamp})
                  </span>
                  <span className="text-[#31491E]">{localAlertBanner.body}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white border border-[#8CBE5D]/50 text-[#233416] shrink-0 self-start sm:self-center">
                {localAlertBanner.viaBrowserApi
                  ? 'Notification navigateur envoyée'
                  : notificationPermission === 'denied'
                  ? 'Relais local actif (notifications navigateur bloquées)'
                  : 'Alerte locale active'}
              </span>
            </div>
          )}
        </div>

        {/* Real-time Agricultural Weather Widget for Harvest Planning */}
        <BejaiaHarvestWeatherWidget />

        {/* Agricultural Weather & Push Notification Alerts Center */}
        <WeatherAlertCenter className="mb-10" />

        {/* 4 Seasons Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {AGRICULTURAL_CALENDAR.map((season, idx) => {
            const isSelected = selectedSeasonIdx === idx;
            return (
              <button
                key={season.season}
                onClick={() => setSelectedSeasonIdx(idx)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#233416] text-[#FAF7F2] border-[#233416] shadow-md -translate-y-0.5'
                    : 'bg-white text-[#242A20] border-[#E6DEC9] hover:border-[#8CBE5D]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    isSelected ? 'text-[#E6AB3C]' : 'text-[#6F9D44]'
                  }`}>
                    Étape 0{idx + 1}
                  </span>
                  <span className="font-serif italic text-xs opacity-80">
                    {season.kabyleTerm}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold leading-tight">
                  {season.action}
                </h3>
                <p className={`text-xs mt-1 ${isSelected ? 'text-[#E8F4D9]/80' : 'text-[#567B34]'}`}>
                  {season.season.split('(')[0]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Season Detail Panel */}
        <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-xs mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-6 border-b border-[#E6DEC9]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                Focus Opérationnel : {currentSeason.season}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                {currentSeason.action}
              </h3>
            </div>
            <span className="font-serif italic text-sm text-[#31491E] bg-[#E8F4D9] px-3 py-1 rounded-full">
              Terme kabyle : {currentSeason.kabyleTerm}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F]">
                Interventions prioritaires recommandées par l'ADOIO :
              </h4>
              <ul className="space-y-3">
                {currentSeason.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-3 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DEC9]">
                    <CheckCircle2 className="w-5 h-5 text-[#567B34] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#242A20] leading-relaxed font-medium">
                      {task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Do's and Don'ts comparison card */}
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6DEC9] space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F]">
                Ce qu'il faut faire vs À proscrire absolument :
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2 text-[#233416]">
                  <CheckCircle2 className="w-4 h-4 text-[#567B34] shrink-0 mt-0.5" />
                  <span><strong>À privilégier :</strong> Récolte sur filets propres suspendus ou déroulés, peignes électriques légers, transport sous 24h.</span>
                </div>
                <div className="flex items-start gap-2 text-[#AF4D24]">
                  <XCircle className="w-4 h-4 text-[#AF4D24] shrink-0 mt-0.5" />
                  <span><strong>À bannir :</strong> Le gaulage violent au gourdin qui brise les bourgeons floraux de l'année suivante et favorise l'alternance biennale.</span>
                </div>
                <div className="flex items-start gap-2 text-[#AF4D24]">
                  <XCircle className="w-4 h-4 text-[#AF4D24] shrink-0 mt-0.5" />
                  <span><strong>À bannir :</strong> L'entassement des olives dans des sacs en polyéthylène hermétiques qui accélère la montée en température et l'acidité.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental sustainability & by-products valorization */}
        <div className="bg-gradient-to-br from-[#233416] to-[#18230F] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#8CBE5D]/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8CBE5D]/20 flex items-center justify-center text-[#8CBE5D]">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#FAF7F2]">
                Écologie Oléicole & Économie Circulaire
              </h3>
              <p className="text-xs text-[#B0D984]">Gestion durable des sous-produits de l'olivier à Béjaïa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#E8F4D9]">
            <div className="bg-[#FAF7F2]/10 p-4 rounded-xl border border-[#FAF7F2]/10 space-y-2">
              <span className="font-bold text-[#E6AB3C] block">1. Valorisation des Grignons</span>
              <p className="leading-relaxed">
                Les résidus solides (pulpe et noyau broyé) sont séchés et transformés en pellets combustibles écologiques pour les chaudières ou valorisés en briquettes de chauffage.
              </p>
            </div>

            <div className="bg-[#FAF7F2]/10 p-4 rounded-xl border border-[#FAF7F2]/10 space-y-2">
              <span className="font-bold text-[#E6AB3C] block">2. Traitement des Margines</span>
              <p className="leading-relaxed">
                Les eaux de végétation acides sont dirigées vers des bassins d'évaporation contrôlés afin de prévenir toute pollution des nappes et des cours d'eau de la Soummam.
              </p>
            </div>

            <div className="bg-[#FAF7F2]/10 p-4 rounded-xl border border-[#FAF7F2]/10 space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-bold text-[#E6AB3C] block">3. Compostage & Fertilisation</span>
                <p className="leading-relaxed">
                  Mélangés aux fumiers locaux et aux feuilles d'olivier, les grignons épuisés créent un compost riche en humus restitué aux oliveraies pour régénérer les sols.
                </p>
              </div>
              <div className="space-y-1.5 mt-2 pt-2 border-t border-[#FAF7F2]/10 flex flex-col">
                <a
                  href="#fertilisation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8CBE5D] hover:text-[#FAF7F2] transition-colors"
                >
                  <span>Calculer vos doses de compost</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="#irrigation"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E6AB3C] hover:text-[#FAF7F2] transition-colors"
                >
                  <span>Simulateur d'irrigation selon le sol</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
