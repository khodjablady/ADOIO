import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Plus,
  Trash2,
  Droplet,
  Sparkles,
  Scale,
  Check,
  Info,
  Sprout,
  RefreshCw,
  Volume2
} from 'lucide-react';

export interface HarvestThresholdSubscription {
  id: string;
  parcelName: string;
  commune: string;
  varietyId: string;
  varietyLabel: string;
  targetImMin: number;
  targetImMax: number;
  minOilContentPercent: number;
  objectiveLabel: string;
  enabled: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
}

interface HarvestAlertManagerProps {
  selectedVariety?: string;
  currentHarvestPeriod?: 'early' | 'mid' | 'late';
  currentYieldPerQuintal?: number;
  onSelectVariety?: (varietyId: string) => void;
}

const STORAGE_KEY = 'adoio_harvest_maturity_alerts_v1';

const VARIETY_OPTIONS: Array<{
  id: string;
  label: string;
  defaultImMin: number;
  defaultImMax: number;
  defaultMinOil: number;
  defaultCommune: string;
}> = [
  {
    id: 'chemlal',
    label: 'Chemlal de Kabylie',
    defaultImMin: 2.6,
    defaultImMax: 3.6,
    defaultMinOil: 18.0,
    defaultCommune: 'Akbou',
  },
  {
    id: 'bouchouk',
    label: 'Bouchouk',
    defaultImMin: 2.8,
    defaultImMax: 3.8,
    defaultMinOil: 21.0,
    defaultCommune: 'Chemini',
  },
  {
    id: 'aberkane',
    label: 'Aberkane',
    defaultImMin: 2.5,
    defaultImMax: 3.4,
    defaultMinOil: 19.0,
    defaultCommune: 'Ouzellaguen',
  },
  {
    id: 'limli',
    label: 'Limli de Sidi-Aïch',
    defaultImMin: 2.7,
    defaultImMax: 3.7,
    defaultMinOil: 20.0,
    defaultCommune: 'Sidi-Aïch',
  },
  {
    id: 'azeradj',
    label: 'Azeradj / Adjeraz',
    defaultImMin: 2.4,
    defaultImMax: 3.4,
    defaultMinOil: 20.5,
    defaultCommune: 'Seddouk',
  },
  {
    id: 'assemblage',
    label: 'Assemblage Kabyle',
    defaultImMin: 2.6,
    defaultImMax: 3.6,
    defaultMinOil: 19.5,
    defaultCommune: 'Amizour',
  },
];

const MATURITY_PRESETS = [
  {
    id: 'prestige',
    label: 'Fruité Vert Prestige (HOVE Concours)',
    imMin: 2.2,
    imMax: 3.1,
    minOil: 17.5,
    description: 'Véraison précoce : taux maximal de polyphénols et ardence marquée.',
  },
  {
    id: 'equilibre',
    label: 'Optimum Agro-Économique ADOIO',
    imMin: 2.7,
    imMax: 3.6,
    minOil: 19.5,
    description: 'Meilleur compromis entre teneur en huile élevée et acidité < 0,4 %.',
  },
  {
    id: 'rendement',
    label: 'Rendement Huilier Maximal (Fruité Mûr)',
    imMin: 3.4,
    imMax: 4.3,
    minOil: 21.5,
    description: 'Olives noires à pulpe souple : extraction maximale au moulin.',
  },
] as const;

const DEFAULT_SUBSCRIPTIONS: HarvestThresholdSubscription[] = [
  {
    id: 'sub-chemlal-akbou',
    parcelName: 'Verger Coteaux d’Akbou',
    commune: 'Akbou',
    varietyId: 'chemlal',
    varietyLabel: 'Chemlal de Kabylie',
    targetImMin: 2.6,
    targetImMax: 3.6,
    minOilContentPercent: 18.0,
    objectiveLabel: 'Optimum Agro-Économique ADOIO',
    enabled: true,
    createdAt: '2025-10-15T08:30:00.000Z',
  },
  {
    id: 'sub-azeradj-seddouk',
    parcelName: 'Parcelle Takaât (Haute-Soummam)',
    commune: 'Seddouk',
    varietyId: 'azeradj',
    varietyLabel: 'Azeradj / Adjeraz',
    targetImMin: 2.4,
    targetImMax: 3.3,
    minOilContentPercent: 20.0,
    objectiveLabel: 'Fruité Vert Prestige (HOVE Concours)',
    enabled: true,
    createdAt: '2025-10-18T10:15:00.000Z',
  },
];

function loadSubscriptionsFromStorage(): HarvestThresholdSubscription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SUBSCRIPTIONS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_SUBSCRIPTIONS;
    return parsed;
  } catch {
    return DEFAULT_SUBSCRIPTIONS;
  }
}

function getMaturityStageInfo(im: number): {
  stageName: string;
  colorClass: string;
  badgeBg: string;
  pigmentDesc: string;
} {
  if (im < 2.0) {
    return {
      stageName: 'Stade Vert Intense (Pré-véraison)',
      colorClass: 'text-[#31491E]',
      badgeBg: 'bg-[#E8F4D9] text-[#233416] border-[#8CBE5D]/50',
      pigmentDesc: 'Épiderme vert franc, lipogenèse encore incomplète.',
    };
  }
  if (im <= 3.6) {
    return {
      stageName: 'Fenêtre Optimale (Véraison Tournante à Violacée)',
      colorClass: 'text-[#31491E]',
      badgeBg: 'bg-[#31491E] text-white border-[#31491E]',
      pigmentDesc: '50 % à 75 % d’épiderme violacé : pic de synthèse lipidique et polyphénols intacts.',
    };
  }
  if (im <= 4.5) {
    return {
      stageName: 'Maturité Complète (Épiderme Noir)',
      colorClass: 'text-[#B47A16]',
      badgeBg: 'bg-[#FEF5DB] text-[#8C5E0A] border-[#E6AB3C]',
      pigmentDesc: 'Épiderme noir brillant, pulpe blanche à mi-violacée, rendement élevé.',
    };
  }
  return {
    stageName: 'Surmaturité Avancée (Risque de Chute & Acidité)',
    colorClass: 'text-[#AF4D24]',
    badgeBg: 'bg-[#FAF0EA] text-[#AF4D24] border-[#AF4D24]/40',
    pigmentDesc: 'Pulpe violette jusqu’au noyau : récolte urgente requise pour éviter l’oxydation.',
  };
}

export const HarvestAlertManager: React.FC<HarvestAlertManagerProps> = ({
  selectedVariety = 'chemlal',
  currentHarvestPeriod = 'mid',
  currentYieldPerQuintal = 19.8,
  onSelectVariety,
}) => {
  const [subscriptions, setSubscriptions] = useState<HarvestThresholdSubscription[]>(() =>
    loadSubscriptionsFromStorage()
  );

  // Live field diagnostic sliders (Maturity Index 0.0 - 6.0 & Oil Content % 12 - 26%)
  const [observedIm, setObservedIm] = useState<number>(() => {
    if (currentHarvestPeriod === 'early') return 2.3;
    if (currentHarvestPeriod === 'late') return 4.2;
    return 3.1;
  });

  const [observedOilPercent, setObservedOilPercent] = useState<number>(() =>
    Number(Math.min(26, Math.max(12, currentYieldPerQuintal)).toFixed(1))
  );

  // Sync observed metrics when user changes simulator controls
  useEffect(() => {
    if (currentHarvestPeriod === 'early') {
      setObservedIm(2.3);
    } else if (currentHarvestPeriod === 'mid') {
      setObservedIm(3.1);
    } else {
      setObservedIm(4.2);
    }
  }, [currentHarvestPeriod]);

  useEffect(() => {
    const nextOil = Number(Math.min(26, Math.max(12, currentYieldPerQuintal)).toFixed(1));
    setObservedOilPercent(nextOil);
  }, [currentYieldPerQuintal]);

  // New subscription form state
  const [parcelName, setParcelName] = useState<string>('');
  const [commune, setCommune] = useState<string>('Akbou');
  const [formVarietyId, setFormVarietyId] = useState<string>(selectedVariety || 'chemlal');
  const [targetImMin, setTargetImMin] = useState<number>(2.6);
  const [targetImMax, setTargetImMax] = useState<number>(3.6);
  const [minOilContentPercent, setMinOilContentPercent] = useState<number>(18.5);
  const [objectiveLabel, setObjectiveLabel] = useState<string>('Optimum Agro-Économique ADOIO');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [browserNotifStatus, setBrowserNotifStatus] = useState<'default' | 'granted' | 'denied' | 'unsupported'>(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });

  // Sync form variety with simulator's selected variety
  useEffect(() => {
    const found = VARIETY_OPTIONS.find((v) => v.id === selectedVariety);
    if (found) {
      setFormVarietyId(found.id);
      setTargetImMin(found.defaultImMin);
      setTargetImMax(found.defaultImMax);
      setMinOilContentPercent(found.defaultMinOil);
      setCommune(found.defaultCommune);
    }
  }, [selectedVariety]);

  // Persist subscriptions in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
    } catch {
      // Ignore storage quota errors
    }
  }, [subscriptions]);

  // Multi-tab sync via storage event
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea && event.storageArea !== window.localStorage) return;
      if (event.key === STORAGE_KEY || event.key === null) {
        setSubscriptions(loadSubscriptionsFromStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const showTemporaryFeedback = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  // Evaluate each subscription against the current Maturity Index & Oil Content
  const evaluatedSubscriptions = useMemo(() => {
    return subscriptions.map((sub) => {
      const imReached = observedIm >= sub.targetImMin && observedIm <= sub.targetImMax;
      const imExceeded = observedIm > sub.targetImMax;
      const oilReached = observedOilPercent >= sub.minOilContentPercent;
      const isOptimalReady = sub.enabled && imReached && oilReached;
      const isUrgentOverripe = sub.enabled && imExceeded && oilReached;

      return {
        ...sub,
        imReached,
        imExceeded,
        oilReached,
        isOptimalReady,
        isUrgentOverripe,
      };
    });
  }, [subscriptions, observedIm, observedOilPercent]);

  const activeReadyAlerts = useMemo(
    () => evaluatedSubscriptions.filter((s) => s.isOptimalReady || s.isUrgentOverripe),
    [evaluatedSubscriptions]
  );

  const applyPreset = (preset: (typeof MATURITY_PRESETS)[number]) => {
    setTargetImMin(preset.imMin);
    setTargetImMax(preset.imMax);
    setMinOilContentPercent(preset.minOil);
    setObjectiveLabel(preset.label);
  };

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const varietyObj =
      VARIETY_OPTIONS.find((v) => v.id === formVarietyId) || VARIETY_OPTIONS[0];
    const cleanName = parcelName.trim() || `Verger ${varietyObj.label} (${commune})`;
    const normalizedMin = Math.min(targetImMin, targetImMax);
    const normalizedMax = Math.max(targetImMin, targetImMax);

    const newSub: HarvestThresholdSubscription = {
      id: `sub-${Date.now()}`,
      parcelName: cleanName,
      commune: commune.trim() || 'Béjaïa',
      varietyId: varietyObj.id,
      varietyLabel: varietyObj.label,
      targetImMin: Number(normalizedMin.toFixed(1)),
      targetImMax: Number(normalizedMax.toFixed(1)),
      minOilContentPercent: Number(minOilContentPercent.toFixed(1)),
      objectiveLabel,
      enabled: true,
      createdAt: new Date().toISOString(),
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    setParcelName('');
    showTemporaryFeedback(`Alerte enregistrée dans votre navigateur pour « ${cleanName} ».`);
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, enabled: !sub.enabled } : sub))
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    showTemporaryFeedback('Abonnement au seuil de maturité supprimé.');
  };

  const triggerLocalNotificationTest = async (sub?: HarvestThresholdSubscription) => {
    const targetSub = sub || evaluatedSubscriptions[0];
    const title = targetSub
      ? `🫒 Récolte Optimale : ${targetSub.parcelName}`
      : '🫒 Alerte Maturité Optimale — ADOIO Béjaïa';
    const body = targetSub
      ? `${targetSub.varietyLabel} (${targetSub.commune}) a atteint IM ${observedIm.toFixed(
          1
        )} (cible ${targetSub.targetImMin}–${targetSub.targetImMax}) et ${observedOilPercent.toFixed(
          1
        )}% d'huile (seuil ≥ ${targetSub.minOilContentPercent}%). Cueillette recommandée !`
      : `Indice de maturité ${observedIm.toFixed(1)} et teneur en huile ${observedOilPercent.toFixed(
          1
        )}% atteints.`;

    showTemporaryFeedback(body);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        let perm = Notification.permission;
        if (perm === 'default') {
          perm = await Notification.requestPermission();
          setBrowserNotifStatus(perm);
        }
        if (perm === 'granted') {
          if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg && 'showNotification' in reg) {
              await reg.showNotification(title, {
                body,
                icon: '/pwa-192x192.png',
                badge: '/pwa-192x192.png',
                tag: 'adoio-harvest-maturity-alert',
              });
              return;
            }
          }
          new Notification(title, {
            body,
            icon: '/pwa-192x192.png',
          });
        }
      } catch {
        // Fallback to in-app toast already shown above
      }
    }
  };

  const stageInfo = getMaturityStageInfo(observedIm);

  return (
    <div
      id="harvest-alert-manager"
      className="mt-12 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-xs space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC9]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1.5">
            <BellRing className="w-4 h-4 text-[#E6AB3C]" aria-hidden="true" />
            <span>Surveillance Agronomique Locale (Stockage Hors-Ligne localStorage)</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18230F]">
            Gestionnaire d'Alertes de Seuils de Maturité &amp; Teneur en Huile
          </h3>
          <p className="text-xs sm:text-sm text-[#436229] mt-1 max-w-3xl leading-relaxed">
            Abonnez vos parcelles à des seuils précis d'<strong>Indice de Maturité (échelle COI 0–7)</strong> et de{' '}
            <strong>teneur en huile (%)</strong>. Vos seuils sont sauvegardés localement et déclenchent une alerte dès que les conditions de récolte optimale sont réunies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="px-3.5 py-2 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs font-bold text-[#18230F] flex items-center gap-2 tabular-nums">
            <Bell className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
            <span>
              {subscriptions.filter((s) => s.enabled).length} abonnement
              {subscriptions.filter((s) => s.enabled).length > 1 ? 's' : ''} actif
              {subscriptions.filter((s) => s.enabled).length > 1 ? 's' : ''}
            </span>
          </div>

          <button
            type="button"
            onClick={() => triggerLocalNotificationTest()}
            className="px-3.5 py-2 rounded-2xl bg-[#233416] hover:bg-[#31491E] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Tester l'envoi d'une notification locale de maturité optimale"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
            <span>Tester l'alerte locale</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackToast && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-2xl bg-[#233416] text-[#FAF7F2] border border-[#8CBE5D]/50 flex items-center justify-between gap-3 text-xs shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#8CBE5D] shrink-0" aria-hidden="true" />
            <span className="font-medium leading-relaxed">{feedbackToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackToast(null)}
            className="text-[11px] font-bold text-[#E6AB3C] hover:underline shrink-0 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Active Triggered Alerts Banner */}
      {activeReadyAlerts.length > 0 ? (
        <div
          role="region"
          aria-label="Alertes de récolte optimale déclenchées"
          className="p-5 rounded-2xl bg-gradient-to-r from-[#E8F4D9] via-[#FAF7F2] to-[#FEF5DB] border-2 border-[#8CBE5D] space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#31491E] text-white flex items-center justify-center shrink-0">
                <BellRing className="w-4 h-4 text-[#E6AB3C]" aria-hidden="true" />
              </span>
              <div>
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#18230F]">
                  {activeReadyAlerts.length} Parcelle{activeReadyAlerts.length > 1 ? 's' : ''} en Fenêtre de Récolte Optimale !
                </h4>
                <p className="text-xs text-[#31491E]">
                  Les valeurs actuelles (IM <strong>{observedIm.toFixed(1)}</strong> · Huile{' '}
                  <strong>{observedOilPercent.toFixed(1)} %</strong>) atteignent vos seuils configurés :
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-xl bg-[#31491E] text-[#E6AB3C] self-start sm:self-center">
              Action Recommandée
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {activeReadyAlerts.map((alertSub) => (
              <div
                key={`triggered-${alertSub.id}`}
                className="bg-white p-3.5 rounded-xl border border-[#8CBE5D] flex items-center justify-between gap-3 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#18230F]">{alertSub.parcelName}</span>
                    <span className="text-[11px] text-[#567B34]">({alertSub.commune})</span>
                  </div>
                  <p className="text-[11px] text-[#31491E] mt-0.5">
                    <strong>{alertSub.varietyLabel}</strong> ·{' '}
                    {alertSub.isUrgentOverripe
                      ? `Attention : IM ${observedIm.toFixed(1)} dépasse la cible max (${alertSub.targetImMax})`
                      : `Cible IM ${alertSub.targetImMin}–${alertSub.targetImMax} & Huile ≥ ${alertSub.minOilContentPercent}% validées`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => triggerLocalNotificationTest(alertSub)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#E8F4D9] hover:bg-[#31491E] text-[#233416] hover:text-white text-[11px] font-bold transition-colors shrink-0 cursor-pointer"
                >
                  Notifier
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] flex items-center justify-between gap-3 text-xs text-[#436229]">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#567B34] shrink-0" aria-hidden="true" />
            <span>
              Aucun seuil de récolte n'est encore franchi avec les mesures actuelles (IM{' '}
              <strong className="tabular-nums">{observedIm.toFixed(1)}</strong> · Teneur en huile{' '}
              <strong className="tabular-nums">{observedOilPercent.toFixed(1)} %</strong>). Ajustez les curseurs de relevé terrain ci-dessous pour simuler l'évolution de la maturation.
            </span>
          </div>
        </div>
      )}

      {/* Main 2-Column Layout: Left = Live Field Diagnostic & Subscription Form, Right = Saved Subscriptions List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Live Maturity/Oil Sensor & New Alert Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Interactive Field Maturity & Oil Content Simulator */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC9] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
                <h4 className="font-serif text-base font-bold text-[#18230F]">
                  Relevé Terrain Actuel (Indice de Maturité &amp; Teneur en Huile)
                </h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${stageInfo.badgeBg}`}>
                {stageInfo.stageName}
              </span>
            </div>

            <p className="text-xs text-[#567B34] leading-relaxed">
              {stageInfo.pigmentDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              {/* Maturity Index Slider (0.0 to 6.0) */}
              <div className="bg-white p-4 rounded-xl border border-[#E6DEC9] space-y-2">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="slider-observed-im" className="text-xs font-bold text-[#18230F]">
                    Indice de Maturité (IM)
                  </label>
                  <span className="font-serif text-lg font-extrabold text-[#31491E] tabular-nums">
                    {observedIm.toFixed(1)} <span className="text-xs font-sans font-normal text-[#567B34]">/ 7,0</span>
                  </span>
                </div>
                <input
                  id="slider-observed-im"
                  type="range"
                  min={0.5}
                  max={6.0}
                  step={0.1}
                  value={observedIm}
                  onChange={(e) => setObservedIm(parseFloat(e.target.value))}
                  className="w-full accent-[#31491E] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#567B34] font-medium">
                  <span>1.0 (Vert)</span>
                  <span className="text-[#31491E] font-bold">2.5–3.6 (Optimum)</span>
                  <span>5.0+ (Noir mûr)</span>
                </div>
              </div>

              {/* Oil Content Slider (12% to 26%) */}
              <div className="bg-white p-4 rounded-xl border border-[#E6DEC9] space-y-2">
                <div className="flex justify-between items-baseline">
                  <label htmlFor="slider-observed-oil" className="text-xs font-bold text-[#18230F]">
                    Teneur en Huile Mesurée
                  </label>
                  <span className="font-serif text-lg font-extrabold text-[#B47A16] tabular-nums">
                    {observedOilPercent.toFixed(1)} <span className="text-xs font-sans font-normal text-[#567B34]">% (L/qx)</span>
                  </span>
                </div>
                <input
                  id="slider-observed-oil"
                  type="range"
                  min={12.0}
                  max={26.0}
                  step={0.5}
                  value={observedOilPercent}
                  onChange={(e) => setObservedOilPercent(parseFloat(e.target.value))}
                  className="w-full accent-[#E6AB3C] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#567B34] font-medium">
                  <span>12 % (Précoce)</span>
                  <span className="text-[#B47A16] font-bold">18–22 % (Cible)</span>
                  <span>26 % (Max)</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Form to Subscribe to a New Maturity Threshold Alert */}
          <form
            onSubmit={handleAddSubscription}
            className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC9] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-base font-bold text-[#18230F] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
                <span>Configurer un Nouvel Abonnement d'Alerte Récolte</span>
              </h4>
              <span className="text-[11px] font-semibold text-[#567B34]">
                Sauvegarde automatique
              </span>
            </div>

            {/* Quick Agronomic Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#436229] block">
                Profils de seuils recommandés par l'ADOIO :
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {MATURITY_PRESETS.map((preset) => {
                  const isSelectedPreset = objectiveLabel === preset.label;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelectedPreset
                          ? 'bg-[#233416] text-white border-[#233416] shadow-2xs'
                          : 'bg-white text-[#18230F] border-[#E6DEC9] hover:border-[#8CBE5D]'
                      }`}
                    >
                      <span className="text-[11px] font-bold block line-clamp-1">
                        {preset.label}
                      </span>
                      <span
                        className={`text-[10px] block mt-0.5 tabular-nums ${
                          isSelectedPreset ? 'text-[#E6AB3C]' : 'text-[#567B34]'
                        }`}
                      >
                        IM {preset.imMin}–{preset.imMax} · Huile ≥ {preset.minOil}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parcel Name, Commune, Variety */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="alert-parcel-name" className="text-[11px] font-bold text-[#18230F] block mb-1">
                  Nom de la parcelle / verger
                </label>
                <input
                  id="alert-parcel-name"
                  type="text"
                  value={parcelName}
                  onChange={(e) => setParcelName(e.target.value)}
                  placeholder="Ex: Verger Ighzer Amokrane"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-white focus:outline-none focus:border-[#31491E]"
                />
              </div>

              <div>
                <label htmlFor="alert-commune" className="text-[11px] font-bold text-[#18230F] block mb-1">
                  Commune (Béjaïa)
                </label>
                <input
                  id="alert-commune"
                  type="text"
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  placeholder="Ex: Akbou, Seddouk..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-white focus:outline-none focus:border-[#31491E]"
                />
              </div>

              <div>
                <label htmlFor="alert-variety" className="text-[11px] font-bold text-[#18230F] block mb-1">
                  Variété d'olivier
                </label>
                <select
                  id="alert-variety"
                  value={formVarietyId}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    setFormVarietyId(nextId);
                    if (onSelectVariety) onSelectVariety(nextId);
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-white font-semibold text-[#18230F] focus:outline-none focus:border-[#31491E] cursor-pointer"
                >
                  {VARIETY_OPTIONS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Threshold Numeric Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
                <label htmlFor="alert-im-min" className="text-[11px] font-bold text-[#18230F] block">
                  Indice Maturité Min (IM)
                </label>
                <div className="flex items-center justify-between mt-1">
                  <input
                    id="alert-im-min"
                    type="number"
                    min={0.5}
                    max={6.0}
                    step={0.1}
                    value={targetImMin}
                    onChange={(e) => setTargetImMin(parseFloat(e.target.value) || 2.0)}
                    className="w-20 font-serif text-base font-bold text-[#31491E] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E6DEC9] tabular-nums"
                  />
                  <span className="text-[11px] text-[#567B34]">Début véraison</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
                <label htmlFor="alert-im-max" className="text-[11px] font-bold text-[#18230F] block">
                  Indice Maturité Max (IM)
                </label>
                <div className="flex items-center justify-between mt-1">
                  <input
                    id="alert-im-max"
                    type="number"
                    min={1.0}
                    max={6.5}
                    step={0.1}
                    value={targetImMax}
                    onChange={(e) => setTargetImMax(parseFloat(e.target.value) || 3.6)}
                    className="w-20 font-serif text-base font-bold text-[#31491E] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E6DEC9] tabular-nums"
                  />
                  <span className="text-[11px] text-[#567B34]">Limite pré-noire</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
                <label htmlFor="alert-min-oil" className="text-[11px] font-bold text-[#18230F] block">
                  Teneur en Huile Min (%)
                </label>
                <div className="flex items-center justify-between mt-1">
                  <input
                    id="alert-min-oil"
                    type="number"
                    min={10}
                    max={28}
                    step={0.5}
                    value={minOilContentPercent}
                    onChange={(e) => setMinOilContentPercent(parseFloat(e.target.value) || 18.0)}
                    className="w-20 font-serif text-base font-bold text-[#B47A16] bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E6DEC9] tabular-nums"
                  />
                  <span className="text-[11px] text-[#567B34]">% / L par qx</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-[#567B34]">
                {browserNotifStatus === 'granted'
                  ? '✓ Notifications système du navigateur activées sur cet appareil.'
                  : 'Les alertes sont affichées en direct et peuvent activer les notifications du navigateur.'}
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#31491E] hover:bg-[#233416] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                <Bell className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                <span>S'abonner à ce seuil de maturité</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Active Subscriptions List & Status Evaluation */}
        <div className="lg:col-span-5 bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#E6DEC9] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC9]">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#18230F]">
                Vos Abonnements de Maturité ({subscriptions.length})
              </h4>
              <p className="text-[11px] text-[#567B34]">
                Persistés dans <code className="font-mono">localStorage</code> · Disponibles hors-ligne
              </p>
            </div>
            {subscriptions.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSubscriptions(DEFAULT_SUBSCRIPTIONS);
                  showTemporaryFeedback('Seuils par défaut ADOIO restaurés.');
                }}
                className="text-[11px] font-semibold text-[#567B34] hover:text-[#18230F] flex items-center gap-1 cursor-pointer"
                title="Restaurer les abonnements types de Béjaïa"
              >
                <RefreshCw className="w-3 h-3" aria-hidden="true" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>

          {evaluatedSubscriptions.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-[#E6DEC9] space-y-2">
              <Bell className="w-8 h-8 text-[#8CBE5D] mx-auto" aria-hidden="true" />
              <p className="font-serif text-sm font-bold text-[#18230F]">
                Aucun seuil de maturité configuré
              </p>
              <p className="text-xs text-[#567B34]">
                Utilisez le formulaire ci-contre pour enregistrer une alerte sur votre variété d'olivier.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {evaluatedSubscriptions.map((sub) => {
                const statusBadge = !sub.enabled
                  ? {
                      text: 'En pause',
                      cls: 'bg-gray-100 text-gray-600 border-gray-200',
                    }
                  : sub.isOptimalReady
                  ? {
                      text: 'Récolte Optimale !',
                      cls: 'bg-[#31491E] text-white border-[#31491E]',
                    }
                  : sub.isUrgentOverripe
                  ? {
                      text: 'Seuil IM dépassé (Urgent)',
                      cls: 'bg-[#AF4D24] text-white border-[#AF4D24]',
                    }
                  : {
                      text: 'En attente de maturation',
                      cls: 'bg-[#FEF5DB] text-[#8C5E0A] border-[#E6AB3C]/50',
                    };

                return (
                  <div
                    key={sub.id}
                    className={`bg-white p-4 rounded-2xl border transition-all space-y-3 ${
                      sub.isOptimalReady
                        ? 'border-[#31491E] shadow-xs'
                        : sub.isUrgentOverripe
                        ? 'border-[#AF4D24]'
                        : 'border-[#E6DEC9]'
                    } ${!sub.enabled ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] block">
                          {sub.commune} · {sub.varietyLabel}
                        </span>
                        <h5 className="font-serif text-sm font-bold text-[#18230F] mt-0.5">
                          {sub.parcelName}
                        </h5>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${statusBadge.cls}`}
                      >
                        {statusBadge.text}
                      </span>
                    </div>

                    {/* Threshold progress indicators */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          sub.imReached
                            ? 'bg-[#E8F4D9]/70 border-[#8CBE5D] text-[#18230F]'
                            : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-semibold">
                          <span>Cible Indice IM</span>
                          {sub.imReached && (
                            <Check className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold block mt-0.5 tabular-nums">
                          {sub.targetImMin.toFixed(1)} à {sub.targetImMax.toFixed(1)}{' '}
                          <span className="text-[10px] font-normal opacity-80">
                            (actuel {observedIm.toFixed(1)})
                          </span>
                        </span>
                      </div>

                      <div
                        className={`p-2.5 rounded-xl border ${
                          sub.oilReached
                            ? 'bg-[#E8F4D9]/70 border-[#8CBE5D] text-[#18230F]'
                            : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-semibold">
                          <span>Seuil Teneur Huile</span>
                          {sub.oilReached && (
                            <Check className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold block mt-0.5 tabular-nums">
                          ≥ {sub.minOilContentPercent.toFixed(1)} %{' '}
                          <span className="text-[10px] font-normal opacity-80">
                            (actuel {observedOilPercent.toFixed(1)}%)
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Footer actions for each subscription */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E6DEC9]/70 text-[11px]">
                      <span className="text-[#567B34] truncate max-w-[180px]" title={sub.objectiveLabel}>
                        {sub.objectiveLabel}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSubscription(sub.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] font-bold border border-[#E6DEC9] transition-colors cursor-pointer"
                        >
                          {sub.enabled ? 'Mettre en pause' : 'Activer'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSubscription(sub.id)}
                          aria-label={`Supprimer l'abonnement ${sub.parcelName}`}
                          title="Supprimer cet abonnement"
                          className="p-1.5 rounded-lg text-[#AF4D24] hover:bg-[#FAF0EA] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
