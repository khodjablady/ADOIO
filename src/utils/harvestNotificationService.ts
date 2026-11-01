export interface RegionalBasinData {
  id: string;
  commune: string;
  daira: string;
  altitudeLabel: string;
  altitudeMeters: number;
  thermalShiftDays: number; // Negative = earlier ripening, Positive = later ripening
  avgTempNovC: number;
  nightTempNovC: number;
  soilMoistureStatus: string;
  regionalNote: string;
}

export const BEJAIA_REGIONAL_BASINS: RegionalBasinData[] = [
  {
    id: 'seddouk',
    commune: 'Seddouk',
    daira: 'Seddouk',
    altitudeLabel: 'Plateau & Coteaux (380 – 520 m)',
    altitudeMeters: 450,
    thermalShiftDays: 0,
    avgTempNovC: 15.4,
    nightTempNovC: 8.2,
    soilMoistureStatus: 'Ressuyé optimal (pluies d’octobre 42 mm)',
    regionalNote: 'Berceau de l’Azeradj et du Chemlal de coteau ; amplitude thermique idéale pour la synthèse des polyphénols.',
  },
  {
    id: 'akbou',
    commune: 'Akbou',
    daira: 'Akbou',
    altitudeLabel: 'Haute Vallée de la Soummam (160 – 280 m)',
    altitudeMeters: 210,
    thermalShiftDays: -8,
    avgTempNovC: 17.2,
    nightTempNovC: 9.8,
    soilMoistureStatus: 'Sec et portance excellente',
    regionalNote: 'Maturation précoce de 7 à 10 jours grâce à l’ensoleillement du couloir de la Soummam.',
  },
  {
    id: 'ouzellaguen',
    commune: 'Ouzellaguen (Ifri)',
    daira: 'Ouzellaguen',
    altitudeLabel: 'Piémonts d’Ifri & Soummam (200 – 420 m)',
    altitudeMeters: 300,
    thermalShiftDays: -5,
    avgTempNovC: 16.5,
    nightTempNovC: 9.1,
    soilMoistureStatus: 'Équilibré, faible humidité matinale',
    regionalNote: 'Terroir historique de grands crus Vierge Extra à faible acidité (< 0,30%).',
  },
  {
    id: 'sidi-aich',
    commune: 'Sidi-Aïch',
    daira: 'Sidi-Aïch',
    altitudeLabel: 'Moyenne Soummam (140 – 350 m)',
    altitudeMeters: 230,
    thermalShiftDays: -6,
    avgTempNovC: 16.8,
    nightTempNovC: 9.4,
    soilMoistureStatus: 'Ressuyé, rosée dissipée dès 09h30',
    regionalNote: 'Zone de prédilection de la variété Limli et du Bouchouk à haut rendement.',
  },
  {
    id: 'tazmalt',
    commune: 'Tazmalt',
    daira: 'Tazmalt',
    altitudeLabel: 'Plaine & Coteaux Sud (260 – 410 m)',
    altitudeMeters: 320,
    thermalShiftDays: -7,
    avgTempNovC: 17.0,
    nightTempNovC: 8.9,
    soilMoistureStatus: 'Sec et chaud en journée',
    regionalNote: 'Lipogenèse rapide ; surveiller la véraison pour éviter la surmaturité des variétés précoces.',
  },
  {
    id: 'amizour',
    commune: 'Amizour',
    daira: 'Amizour',
    altitudeLabel: 'Basse Soummam & Collines (80 – 320 m)',
    altitudeMeters: 180,
    thermalShiftDays: -6,
    avgTempNovC: 16.9,
    nightTempNovC: 9.6,
    soilMoistureStatus: 'Frais et bien drainé',
    regionalNote: 'Conditions douces favorisant une entrée en véraison régulière dès fin octobre.',
  },
  {
    id: 'el-kseur',
    commune: 'El Kseur',
    daira: 'El Kseur',
    altitudeLabel: 'Plaine Alluviale & Coteaux (60 – 250 m)',
    altitudeMeters: 140,
    thermalShiftDays: -9,
    avgTempNovC: 17.5,
    nightTempNovC: 10.2,
    soilMoistureStatus: 'Sol profond équilibré',
    regionalNote: 'L’un des bassins les plus précoces de la wilaya ; idéal pour les huiles primeurs de novembre.',
  },
  {
    id: 'timezrit',
    commune: 'Timezrit',
    daira: 'Timezrit',
    altitudeLabel: 'Massif & Coteaux d’Altitude (450 – 720 m)',
    altitudeMeters: 580,
    thermalShiftDays: 6,
    avgTempNovC: 14.1,
    nightTempNovC: 6.8,
    soilMoistureStatus: 'Humidité modérée de versant',
    regionalNote: 'Maturation plus lente en altitude offrant des huiles très riches en antioxydants.',
  },
  {
    id: 'chemini',
    commune: 'Chemini (Ath Waghlis)',
    daira: 'Chemini',
    altitudeLabel: 'Montagne & Versants (600 – 900 m)',
    altitudeMeters: 740,
    thermalShiftDays: 12,
    avgTempNovC: 12.8,
    nightTempNovC: 5.4,
    soilMoistureStatus: 'Frais, brumes matinales fréquentes',
    regionalNote: 'Cueillette décalée de 10 à 14 jours ; privilégier la récolte avant les gelées de décembre.',
  },
  {
    id: 'aokas',
    commune: 'Aokas & Littoral Est',
    daira: 'Aokas',
    altitudeLabel: 'Piémont Maritime (40 – 250 m)',
    altitudeMeters: 110,
    thermalShiftDays: -8,
    avgTempNovC: 17.8,
    nightTempNovC: 11.0,
    soilMoistureStatus: 'Douceur côtière, brise marine',
    regionalNote: 'Absence de gel précoce ; excellente précocité pour l’Azeradj et le Chemlal littoral.',
  },
];

export type HarvestWindowState = 'optimal_open' | 'imminent' | 'veraison_active' | 'late_stage';

export interface VarietyRegionalHarvestEvaluation {
  varietyId: string;
  varietyName: string;
  kabyleName: string;
  basin: RegionalBasinData;
  windowState: HarvestWindowState;
  windowStatusLabel: string;
  adjustedWindowDates: string;
  daysUntilOptimal: number; // 0 if already inside optimal window
  observedMaturityIndex: number; // 0.0 to 5.0 (Jaén index)
  targetMaturityRange: string;
  expectedOilYieldLitersQx: string;
  expectedPolyphenolsMgKg: number;
  expectedMaxAcidityPercent: number;
  readinessScorePercent: number;
  alertHeadline: string;
  alertMessage: string;
  recommendedAction: string;
}

interface BaseVarietyWindowConfig {
  id: string;
  name: string;
  kabyleName: string;
  baseStartDayOfYear: number; // e.g., Oct 20 = 293, Nov 1 = 305, Nov 15 = 319
  baseDurationDays: number;
  baseImNov1: number; // Baseline Jaén Maturity Index at 450m on Nov 1
  targetImMin: number;
  targetImMax: number;
  yieldRangeLitersQx: string;
  polyphenolsMgKg: number;
  maxAcidity: number;
}

const BASE_VARIETY_WINDOWS: Record<string, BaseVarietyWindowConfig> = {
  azeradj: {
    id: 'azeradj',
    name: 'Azeradj (Adjeraz)',
    kabyleName: 'Ajeṛṛaḍ',
    baseStartDayOfYear: 290, // Oct 17
    baseDurationDays: 38,
    baseImNov1: 3.1,
    targetImMin: 2.4,
    targetImMax: 3.5,
    yieldRangeLitersQx: '20 à 24 L/qx',
    polyphenolsMgKg: 490,
    maxAcidity: 0.28,
  },
  bouchouk: {
    id: 'bouchouk',
    name: 'Bouchouk de Kabylie',
    kabyleName: 'Buccuk',
    baseStartDayOfYear: 296, // Oct 23
    baseDurationDays: 40,
    baseImNov1: 2.9,
    targetImMin: 2.5,
    targetImMax: 3.6,
    yieldRangeLitersQx: '21 à 25 L/qx',
    polyphenolsMgKg: 510,
    maxAcidity: 0.30,
  },
  limli: {
    id: 'limli',
    name: 'Limli de la Soummam',
    kabyleName: 'Limli',
    baseStartDayOfYear: 304, // Oct 31
    baseDurationDays: 42,
    baseImNov1: 2.7,
    targetImMin: 2.5,
    targetImMax: 3.6,
    yieldRangeLitersQx: '19 à 23 L/qx',
    polyphenolsMgKg: 410,
    maxAcidity: 0.32,
  },
  chemlal: {
    id: 'chemlal',
    name: 'Chemlal de Kabylie',
    kabyleName: 'Ccemlal',
    baseStartDayOfYear: 312, // Nov 8 at 450m (Nov 1 in low valleys!)
    baseDurationDays: 55,
    baseImNov1: 2.55,
    targetImMin: 2.6,
    targetImMax: 3.7,
    yieldRangeLitersQx: '18 à 21 L/qx',
    polyphenolsMgKg: 460,
    maxAcidity: 0.32,
  },
  aberkane: {
    id: 'aberkane',
    name: 'Aberkane',
    kabyleName: 'Aberkan',
    baseStartDayOfYear: 308, // Nov 4
    baseDurationDays: 45,
    baseImNov1: 2.65,
    targetImMin: 2.5,
    targetImMax: 3.5,
    yieldRangeLitersQx: '19 à 23 L/qx',
    polyphenolsMgKg: 370,
    maxAcidity: 0.35,
  },
  autres: {
    id: 'autres',
    name: 'Autres Cultivars (Sigoise, Picholine)',
    kabyleName: 'Tiyaḍ',
    baseStartDayOfYear: 306, // Nov 2
    baseDurationDays: 48,
    baseImNov1: 2.75,
    targetImMin: 2.5,
    targetImMax: 3.6,
    yieldRangeLitersQx: '18 à 22 L/qx',
    polyphenolsMgKg: 390,
    maxAcidity: 0.34,
  },
};

function formatDayOfYearFr(dayOfYear: number): string {
  const date = new Date(2026, 0, 1);
  date.setDate(dayOfYear);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

export function evaluateRegionalHarvestWindow(
  varietyId: string,
  basinId: string
): VarietyRegionalHarvestEvaluation {
  const config = BASE_VARIETY_WINDOWS[varietyId] || BASE_VARIETY_WINDOWS.chemlal;
  const basin =
    BEJAIA_REGIONAL_BASINS.find((b) => b.id === basinId) || BEJAIA_REGIONAL_BASINS[0];

  // Reference campaign day: early November (day 305)
  const currentCampaignDay = 305;
  const adjustedStartDay = config.baseStartDayOfYear + basin.thermalShiftDays;
  const adjustedEndDay = adjustedStartDay + config.baseDurationDays;

  // Adjust Maturity Index based on regional thermal shift (-8 days = +0.32 IM earlier ripening)
  const imShift = (-basin.thermalShiftDays * 0.038);
  const observedMaturityIndex = Number(
    Math.max(1.6, Math.min(4.4, config.baseImNov1 + imShift)).toFixed(2)
  );

  const daysUntilOptimal = Math.max(0, adjustedStartDay - currentCampaignDay);
  const adjustedWindowDates = `${formatDayOfYearFr(adjustedStartDay)} – ${formatDayOfYearFr(adjustedEndDay)}`;

  let windowState: HarvestWindowState = 'optimal_open';
  let windowStatusLabel = 'Fenêtre Optimale Ouverte';
  let readinessScorePercent = 94;

  if (
    observedMaturityIndex >= config.targetImMin &&
    observedMaturityIndex <= config.targetImMax &&
    daysUntilOptimal <= 2
  ) {
    windowState = 'optimal_open';
    windowStatusLabel = 'Fenêtre Optimale Active (Cueillette Recommandée)';
    readinessScorePercent = Math.min(
      98,
      Math.round(88 + (observedMaturityIndex - config.targetImMin) * 10)
    );
  } else if (daysUntilOptimal <= 10 || observedMaturityIndex >= config.targetImMin - 0.25) {
    windowState = 'imminent';
    windowStatusLabel = `Entrée en Fenêtre Optimale sous ${Math.max(2, daysUntilOptimal)} jours`;
    readinessScorePercent = Math.max(76, 86 - daysUntilOptimal);
  } else if (observedMaturityIndex < config.targetImMin - 0.25) {
    windowState = 'veraison_active';
    windowStatusLabel = `En Véraison Progressive (J-${daysUntilOptimal} avant pic)`;
    readinessScorePercent = 64;
  } else {
    windowState = 'late_stage';
    windowStatusLabel = 'Maturité Avancée (Récolte Prioritaire)';
    readinessScorePercent = 82;
  }

  const alertHeadline =
    windowState === 'optimal_open'
      ? `🌿 Fenêtre Optimale Ouverte : ${config.name} à ${basin.commune}`
      : windowState === 'imminent'
      ? `🔔 Alerte Véraison : ${config.name} prête sous ${Math.max(2, daysUntilOptimal)} j à ${basin.commune}`
      : `📊 Suivi Régional ${config.name} (${basin.commune}) : ${windowStatusLabel}`;

  const alertMessage =
    windowState === 'optimal_open'
      ? `Le bassin de ${basin.commune} (${basin.altitudeLabel}) affiche un Indice de Maturité de ${observedMaturityIndex} (cible ${config.targetImMin}–${config.targetImMax}) avec ${basin.avgTempNovC}°C. Conditions idéales pour récolter la ${config.name} (${config.yieldRangeLitersQx}, polyphénols ~${config.polyphenolsMgKg} mg/kg).`
      : `À ${basin.commune}, l'Indice de Maturité de la ${config.name} atteint ${observedMaturityIndex}. Fenêtre régionale calculée : ${adjustedWindowDates}. Préparez vos filets et caisses ajourées.`;

  const recommendedAction =
    windowState === 'optimal_open'
      ? `Déployez les filets par temps sec dès 09h30 et réservez un créneau en chaîne continue (< 27°C) dans la Daïra de ${basin.daira} pour trituration sous 24h.`
      : `Planifiez vos équipes de cueillette pour la période ${adjustedWindowDates} et surveillez le passage à mi-véraison (IM ≥ ${config.targetImMin}).`;

  return {
    varietyId: config.id,
    varietyName: config.name,
    kabyleName: config.kabyleName,
    basin,
    windowState,
    windowStatusLabel,
    adjustedWindowDates,
    daysUntilOptimal,
    observedMaturityIndex,
    targetMaturityRange: `IM ${config.targetImMin.toFixed(1)} – ${config.targetImMax.toFixed(1)}`,
    expectedOilYieldLitersQx: config.yieldRangeLitersQx,
    expectedPolyphenolsMgKg: config.polyphenolsMgKg + Math.round(basin.altitudeMeters * 0.05),
    expectedMaxAcidityPercent: config.maxAcidity,
    readinessScorePercent,
    alertHeadline,
    alertMessage,
    recommendedAction,
  };
}

export interface VarietyAlertSubscription {
  id: string;
  varietyId: string;
  varietyName: string;
  basinId: string;
  communeName: string;
  enabled: boolean;
  notifyOnImminent: boolean;
  createdAt: string;
  lastNotifiedAt?: string;
}

const SUBSCRIPTIONS_STORAGE_KEY = 'adoio_regional_variety_harvest_alerts_v1';

const DEFAULT_REGIONAL_SUBSCRIPTIONS: VarietyAlertSubscription[] = [
  {
    id: 'alert-azeradj-seddouk',
    varietyId: 'azeradj',
    varietyName: 'Azeradj (Adjeraz)',
    basinId: 'seddouk',
    communeName: 'Seddouk',
    enabled: true,
    notifyOnImminent: true,
    createdAt: '2026-10-25T09:00:00.000Z',
  },
  {
    id: 'alert-chemlal-akbou',
    varietyId: 'chemlal',
    varietyName: 'Chemlal de Kabylie',
    basinId: 'akbou',
    communeName: 'Akbou',
    enabled: true,
    notifyOnImminent: true,
    createdAt: '2026-10-28T09:00:00.000Z',
  },
];

export function loadRegionalVarietySubscriptions(): VarietyAlertSubscription[] {
  try {
    const raw = localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
    if (!raw) return DEFAULT_REGIONAL_SUBSCRIPTIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_REGIONAL_SUBSCRIPTIONS;
  } catch {
    return DEFAULT_REGIONAL_SUBSCRIPTIONS;
  }
}

export function saveRegionalVarietySubscriptions(subs: VarietyAlertSubscription[]): void {
  try {
    localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, JSON.stringify(subs));
  } catch {
    // Ignore storage quota errors
  }
}

export interface BrowserNotificationDispatchResult {
  deliveredViaNativeApi: boolean;
  permissionState: NotificationPermission | 'unsupported';
  methodLabel: string;
  timestamp: string;
  headline: string;
  body: string;
  evaluation: VarietyRegionalHarvestEvaluation;
}

export async function dispatchRegionalHarvestNotification(
  evaluation: VarietyRegionalHarvestEvaluation
): Promise<BrowserNotificationDispatchResult> {
  const timestamp = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  let permissionState: NotificationPermission | 'unsupported' = 'unsupported';
  let deliveredViaNativeApi = false;
  let methodLabel = 'Notification Navigateur Temps Réel (In-App + Web API)';

  if (typeof window !== 'undefined' && 'Notification' in window) {
    permissionState = Notification.permission;
    if (permissionState === 'default') {
      try {
        permissionState = await Notification.requestPermission();
      } catch {
        permissionState = Notification.permission;
      }
    }

    if (permissionState === 'granted') {
      // 1. Try Service Worker Registration Notification first
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg && 'showNotification' in reg) {
            await reg.showNotification(evaluation.alertHeadline, {
              body: evaluation.alertMessage,
              icon: '/pwa-192x192.png',
              badge: '/icon.svg',
              tag: `adoio-harvest-${evaluation.varietyId}-${evaluation.basin.id}`,
            });
            deliveredViaNativeApi = true;
            methodLabel = 'API Notification Navigateur (Service Worker PWA)';
          }
        } catch {
          // Fallback to window Notification below
        }
      }

      // 2. Fallback to standard Window Notification constructor
      if (!deliveredViaNativeApi) {
        try {
          new Notification(evaluation.alertHeadline, {
            body: evaluation.alertMessage,
            icon: '/pwa-192x192.png',
            tag: `adoio-harvest-${evaluation.varietyId}-${evaluation.basin.id}`,
          });
          deliveredViaNativeApi = true;
          methodLabel = 'API Web Notification Native (window.Notification)';
        } catch {
          // In sandboxed preview iframes, browser may block OS popups; UI banner handles display
          methodLabel = 'Alerte Navigateur Active (Aperçu Intégré)';
        }
      }
    } else if (permissionState === 'denied') {
      methodLabel = 'Alerte Navigateur Directe (Notifications OS restreintes par le navigateur)';
    }
  }

  return {
    deliveredViaNativeApi,
    permissionState,
    methodLabel,
    timestamp,
    headline: evaluation.alertHeadline,
    body: evaluation.alertMessage,
    evaluation,
  };
}
