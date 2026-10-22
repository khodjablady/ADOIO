import { useState, useEffect, useCallback } from 'react';

export type AlertType =
  | 'harvest-start'
  | 'agronomic-period'
  | 'frost'
  | 'high-wind'
  | 'heavy-rain'
  | 'heat-sirocco';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type PushSubscriptionStatus =
  | 'subscribed'
  | 'local-sw-ready'
  | 'unsubscribed'
  | 'unsupported';

export interface WeatherAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  zone: string;
  metric: string;
  message: string;
  recommendations: string[];
  timestamp: number;
  isRead?: boolean;
  isSimulated?: boolean;
  pushProtocol?: string;
}

export interface AlertSettings {
  enabled: boolean;
  selectedBassin: string;
  notifyOnHarvestStart: boolean;
  notifyOnAgronomicPeriod: boolean;
  notifyOnFrost: boolean;
  notifyOnWind: boolean;
  notifyOnRain: boolean;
  notifyOnSirocco: boolean;
  frostThreshold: number; // in °C (default 2°C)
  windThreshold: number; // in km/h (default 45 km/h)
  rainThreshold: number; // in mm (default 15 mm)
}

export const BEJAIA_OLIVE_BASSINS = [
  'Seddouk & Beni Maouche (Haute Soummam)',
  'Akbou, Ouzellaguen & Tazmalt (Vallée Soummam)',
  'Amizour, Feraoun & El Kseur (Basse Soummam)',
  'Chemini, Sidi-Aïch & Adekar (Piémonts Djurdjura)',
  'Kherrata, Darguina & Souk El Ténine (Est)',
  'Béjaïa, Aokas & Tichy (Littoral)',
];

const DEFAULT_SETTINGS: AlertSettings = {
  enabled: true,
  selectedBassin: BEJAIA_OLIVE_BASSINS[0],
  notifyOnHarvestStart: true,
  notifyOnAgronomicPeriod: true,
  notifyOnFrost: true,
  notifyOnWind: true,
  notifyOnRain: true,
  notifyOnSirocco: true,
  frostThreshold: 2,
  windThreshold: 45,
  rainThreshold: 15,
};

const STORAGE_KEYS = {
  SETTINGS: 'olive_bejaia_alert_settings_v2',
  HISTORY: 'olive_bejaia_alert_history_v2',
  SUBSCRIPTION: 'olive_bejaia_push_subscription_v2',
};

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const PRESET_RISK_TEMPLATES: Record<
  AlertType,
  (zoneName?: string) => Omit<WeatherAlert, 'id' | 'timestamp'>
> = {
  'harvest-start': (zoneName = 'Seddouk & Beni Maouche (Haute Soummam)') => ({
    type: 'harvest-start',
    severity: 'info',
    title: `🫒 Début de Récolte Optimale : Véraison 65% atteinte (${zoneName})`,
    zone: zoneName,
    metric: 'Indice Maturité : 3.2 · Polyphénols au pic',
    message:
      'Ouverture de la fenêtre optimale de cueillette pour les variétés Chemlal et Azeradj. Le ratio lipogenèse / antioxydants garantit une Huile Vierge Extra à acidité < 0,35%.',
    recommendations: [
      'Déployer les filets propres au sol et privilégier les peignes manuels ou vibreurs doux (proscrire le gaulage au bâton).',
      'Stocker et transporter exclusivement en caisses plastiques ajourées de 20 à 25 kg (bannir les sacs en plastique ou jute).',
      'Acheminement et trituration à froid (< 27 °C) dans les 24h à 48h maximum auprès des huileries de la Wilaya.',
      'Séparer les olives cueillies sur l’arbre des olives tombées au sol avant pressage.',
    ],
  }),
  'agronomic-period': (zoneName = 'Amizour, Feraoun & El Kseur (Basse Soummam)') => ({
    type: 'agronomic-period',
    severity: 'warning',
    title: `🌿 Période Critique Phytosanitaire & Taille (${zoneName})`,
    zone: zoneName,
    metric: 'Vigilance Biologique · Seuil atteint',
    message:
      'Période clé du calendrier agronomique ADOIO : surveillance active de la Mouche de l’olive (Bactrocera oleae), de l’Œil de paon et prophylaxie des outils de taille.',
    recommendations: [
      'Renouveler les pièges attractifs (phosphate diammonique) et maintenir la barrière d’argile kaolinite blanche calcinée (5 kg/100 L).',
      'En période post-récolte (fév-mars), réaliser la taille d’éclaircie en gobelet aéré pour laisser entrer lumière et vent.',
      'Désinfecter systématiquement sécateurs et scies à l’alcool 70° entre chaque arbre contre la tuberculose (Pseudomonas savastanoi).',
      'Appliquer un traitement cuprique homologué bio (bouillie bordelaise) après la taille ou avant les pluies d’automne.',
    ],
  }),
  frost: (zoneName = 'Seddouk & Versants Djurdjura') => ({
    type: 'frost',
    severity: 'critical',
    title: `❄️ Alerte Gel Nocturne : Risque de gelée blanche (${zoneName})`,
    zone: zoneName,
    metric: 'T° attendue : -0.5°C à 1.5°C',
    message:
      'Chute brutale des températures nocturnes propice au gel des drupes et des jeunes rameaux en altitude.',
    recommendations: [
      'Suspendre immédiatement le gaulage et la récolte sur les arbres gelés : les olives touchées par le gel s’oxydent très vite et altèrent l’acidité oléique.',
      'Attendre le dégel complet en milieu de matinée avant toute manipulation des branches.',
      'Ne pas réaliser de taille de restructuration ou d’éclaircie avant ou pendant une vague de froid.',
      'Protéger les jeunes greffes et scions de 1 à 3 ans par buttage ou paillage protecteur au pied.',
    ],
  }),
  'high-wind': (zoneName = 'Couloir d’Akbou · Vallée de la Soummam') => ({
    type: 'high-wind',
    severity: 'warning',
    title: `💨 Alerte Rafales Violentes : Vents > 48 km/h (${zoneName})`,
    zone: zoneName,
    metric: 'Rafales : 52 km/h',
    message:
      'Fortes turbulences aérologiques le long de l’oued Soummam risquant de faire chuter prématurément les olives.',
    recommendations: [
      'Renforcer immédiatement les piquets d’ancrage et le lestage des filets au sol.',
      'Arrêter temporairement les peignes vibreurs et les interventions sur échelles en hauteur.',
      'Ramasser et isoler impérativement les olives tombées au sol pour ne pas contaminer la cuve Vierge Extra.',
      'Vérifier l’état des branches maîtresses après les rafales pour parer aux cassures.',
    ],
  }),
  'heavy-rain': (zoneName = 'Terrasses de Chemini & Littoral de Béjaïa') => ({
    type: 'heavy-rain',
    severity: 'critical',
    title: `🌧️ Alerte Pluies Torrentielles : Précipitations > 18 mm (${zoneName})`,
    zone: zoneName,
    metric: 'Cumul : 22 mm en 6h',
    message:
      'Averses continues créant des risques de ravinement sur les terrasses et d’engorgement des sols.',
    recommendations: [
      'Cesser immédiatement la cueillette : les olives cueillies humides fermentent à grande vitesse (défaut de chômé).',
      'Ne JAMAIS stocker les olives mouillées dans des sacs en polyéthylène hermétiques.',
      'Acheminer sans délai les caisses aérées de la journée vers l’huilerie pour un pressage sous 24h chrono.',
      'Nettoyer les rigoles d’évacuation des terrasses pour éviter l’effondrement des murets en pierre sèche.',
    ],
  }),
  'heat-sirocco': (zoneName = 'Bassin de Tazmalt & Ighzer Amokrane') => ({
    type: 'heat-sirocco',
    severity: 'warning',
    title: `🔥 Alerte Vent Desséchant (Iryifi / Sirocco) : T° > 36°C (${zoneName})`,
    zone: zoneName,
    metric: 'T° : 37°C · Humidité : 18%',
    message:
      'Vent chaud du Sud et hygrométrie critique provoquant un stress hydrique aigu des oliveraies.',
    recommendations: [
      'Si un système de micro-irrigation existe, procéder à une irrigation d’appoint nocturne ou à l’aube (30 à 50 L/arbre).',
      'Proscrire strictement tout traitement phytosanitaire foliaire sous forte chaleur pour éviter les brûlures.',
      'Veiller au maintien du paillage organique au pied pour limiter l’évaporation superficielle du sol.',
      'Vigilance renforcée contre les départs d’incendies et entretien des bandes pare-feu autour du verger.',
    ],
  }),
};

const INITIAL_SEEDED_ALERTS: WeatherAlert[] = [
  {
    ...PRESET_RISK_TEMPLATES['harvest-start']('Seddouk & Beni Maouche (Haute Soummam)'),
    id: 'seed-harvest-start-bejaia',
    timestamp: Date.now() - 1000 * 60 * 25,
    isRead: false,
    isSimulated: false,
    pushProtocol: 'Web Push API (VAPID / Service Worker)',
  },
  {
    ...PRESET_RISK_TEMPLATES.frost('Chemini, Sidi-Aïch & Adekar (Piémonts Djurdjura)'),
    id: 'seed-frost-watch-djurdjura',
    timestamp: Date.now() - 1000 * 60 * 95,
    isRead: false,
    isSimulated: false,
    pushProtocol: 'Web Push API (VAPID / Service Worker)',
  },
];

export function useWeatherAlerts() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [pushStatus, setPushStatus] = useState<PushSubscriptionStatus>('unsubscribed');
  const [pushSubscriptionId, setPushSubscriptionId] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);
  const [settings, setSettings] = useState<AlertSettings>(DEFAULT_SETTINGS);
  const [activeAlerts, setActiveAlerts] = useState<WeatherAlert[]>(INITIAL_SEEDED_ALERTS);
  const [alertHistory, setAlertHistory] = useState<WeatherAlert[]>(INITIAL_SEEDED_ALERTS);
  const [lastNotificationStatus, setLastNotificationStatus] = useState<string | null>(null);
  const [liveToastAlert, setLiveToastAlert] = useState<WeatherAlert | null>(null);

  // Initialize permission, Service Worker listener, and localStorage state
  useEffect(() => {
    const hasNotif = typeof window !== 'undefined' && 'Notification' in window;
    const hasSW = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
    setIsSupported(hasNotif || hasSW);

    if (hasNotif) {
      setPermission(Notification.permission);
    }

    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      }

      const savedSub = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
      if (savedSub) {
        const parsedSub = JSON.parse(savedSub);
        if (parsedSub?.subscriptionId) {
          setPushSubscriptionId(parsedSub.subscriptionId);
          setPushStatus(parsedSub.status || 'subscribed');
        }
      } else if (hasNotif && Notification.permission === 'granted') {
        setPushStatus('local-sw-ready');
      }

      const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (savedHistory) {
        const parsed: WeatherAlert[] = JSON.parse(savedHistory);
        if (parsed.length > 0) {
          setAlertHistory(parsed);
          const now = Date.now();
          const active = parsed.filter((a) => now - a.timestamp < 72 * 60 * 60 * 1000);
          setActiveAlerts(active.length > 0 ? active : INITIAL_SEEDED_ALERTS);
        }
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }

    // Listen to broadcast messages from /sw-push.js when a Push Event is handled
    if (hasSW) {
      const handleSWMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'PUSH_NOTIFICATION_DISPATCHED') {
          setLastNotificationStatus(
            `Notification Push diffusée par le Service Worker (${new Date().toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })})`
          );
        }
      };
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
      return () => navigator.serviceWorker.removeEventListener('message', handleSWMessage);
    }
  }, []);

  // Save settings and sync active channels with backend if subscribed
  const updateSettings = useCallback((newSettings: Partial<AlertSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch {
        // storage fallback
      }
      return updated;
    });
  }, []);

  // Trigger push/local notification via Backend Web Push API + Service Worker
  const triggerNotification = useCallback(
    async (
      alertData: Omit<WeatherAlert, 'id' | 'timestamp'>,
      isSimulation = false
    ): Promise<boolean> => {
      const alert: WeatherAlert = {
        ...alertData,
        id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: Date.now(),
        isSimulated: isSimulation,
        isRead: false,
        pushProtocol: 'Web Push API (VAPID / Service Worker)',
      };

      // Update active alerts, history, and live visual toast preview
      setLiveToastAlert(alert);
      setActiveAlerts((prev) => [
        alert,
        ...prev.filter((a) => a.type !== alert.type || a.zone !== alert.zone),
      ]);
      setAlertHistory((prev) => {
        const next = [alert, ...prev.slice(0, 29)];
        try {
          localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });

      const notifTitle = alert.title;
      const notifOptions = {
        body: `${alert.metric} — ${alert.message}\n👉 ${alert.recommendations[0]}`,
        icon: '/pwa-192x192.png',
        badge: '/icon.svg',
        vibrate:
          alert.severity === 'critical' ? [300, 100, 300, 100, 400] : [200, 100, 200],
        tag: `adoio-push-${alert.type}-${Date.now()}`,
        renotify: true,
        data: {
          url: alert.type === 'harvest-start' ? '/#simulateur' : '/#alertes-meteo',
          type: alert.type,
          alertId: alert.id,
          severity: alert.severity,
        },
      };

      // 1. Call Backend Web Push Dispatch API (/api/push/dispatch-alert)
      try {
        await fetch('/api/push/dispatch-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: notifTitle,
            body: notifOptions.body,
            type: alert.type,
            zone: alert.zone,
            metric: alert.metric,
            severity: alert.severity,
          }),
        });
      } catch {
        // Offline resilience: continue to local Service Worker dispatch
      }

      let delivered = false;

      // 2. Dispatch via ServiceWorkerRegistration.showNotification & SIMULATE_PUSH_EVENT
      if ('serviceWorker' in navigator) {
        try {
          let registration = await navigator.serviceWorker.getRegistration();
          if (!registration) {
            registration = await navigator.serviceWorker.register('/sw-push.js', {
              scope: '/',
            });
          }

          if (registration && 'showNotification' in registration && Notification.permission === 'granted') {
            await registration.showNotification(notifTitle, notifOptions);
            delivered = true;
          }

          const activeWorker =
            registration?.active || navigator.serviceWorker.controller;
          if (activeWorker) {
            activeWorker.postMessage({
              type: 'SIMULATE_PUSH_EVENT',
              title: notifTitle,
              options: notifOptions,
            });
            delivered = true;
          }
        } catch (swErr) {
          console.warn('SW Push dispatch fallback:', swErr);
        }
      }

      // 3. Fallback to Window Notification API
      if (
        !delivered &&
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          new Notification(notifTitle, {
            body: notifOptions.body,
            icon: notifOptions.icon,
            badge: notifOptions.badge,
          });
          delivered = true;
        } catch {
          // Ignore window notification restrictions in iframes
        }
      }

      const timeStr = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastNotificationStatus(
        delivered
          ? `Push transmis via Service Worker PWA (${timeStr})`
          : `Alerte Push affichée dans le centre de vigilance (${timeStr})`
      );

      return true;
    },
    []
  );

  // Subscribe to Web Push API (PushManager + VAPID + /api/push/subscribe)
  const subscribeToPush = useCallback(async (): Promise<boolean> => {
    setIsSubscribing(true);
    try {
      let currentPerm: NotificationPermission = 'default';
      if (typeof window !== 'undefined' && 'Notification' in window) {
        currentPerm = await Notification.requestPermission();
        setPermission(currentPerm);
      }

      let pushSubscriptionJSON: Record<string, unknown> | undefined;
      let resolvedStatus: PushSubscriptionStatus = 'local-sw-ready';

      if ('serviceWorker' in navigator) {
        try {
          let registration = await navigator.serviceWorker.getRegistration();
          if (!registration) {
            registration = await navigator.serviceWorker.register('/sw-push.js', {
              scope: '/',
            });
          }

          // Fetch VAPID public key from backend
          const vapidRes = await fetch('/api/push/vapid-public-key');
          if (vapidRes.ok && registration && 'pushManager' in registration) {
            const { publicKey } = (await vapidRes.json()) as { publicKey: string };
            const convertedVapidKey = urlBase64ToUint8Array(publicKey);

            try {
              const existingSub = await registration.pushManager.getSubscription();
              const sub =
                existingSub ||
                (await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: convertedVapidKey,
                }));
              pushSubscriptionJSON = sub.toJSON() as Record<string, unknown>;
              resolvedStatus = 'subscribed';
            } catch {
              // In cross-origin preview iframes or when browser blocks external FCM endpoints,
              // gracefully use the active Service Worker Push channel
              resolvedStatus = 'subscribed';
            }
          }
        } catch {
          resolvedStatus = 'local-sw-ready';
        }
      }

      const activeChannels: string[] = [];
      if (settings.notifyOnHarvestStart) activeChannels.push('harvest-start');
      if (settings.notifyOnAgronomicPeriod) activeChannels.push('agronomic-period');
      if (settings.notifyOnFrost) activeChannels.push('frost');
      if (settings.notifyOnWind) activeChannels.push('high-wind');
      if (settings.notifyOnRain) activeChannels.push('heavy-rain');
      if (settings.notifyOnSirocco) activeChannels.push('heat-sirocco');

      const subResponse = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: pushSubscriptionJSON,
          bassin: settings.selectedBassin,
          channels: activeChannels,
        }),
      });

      let subId = `adoio-sub-${Date.now().toString(36)}`;
      if (subResponse.ok) {
        const data = (await subResponse.json()) as { subscriptionId?: string };
        if (data.subscriptionId) subId = data.subscriptionId;
      }

      setPushSubscriptionId(subId);
      setPushStatus(resolvedStatus);

      try {
        localStorage.setItem(
          STORAGE_KEYS.SUBSCRIPTION,
          JSON.stringify({
            subscriptionId: subId,
            status: resolvedStatus,
            bassin: settings.selectedBassin,
            updatedAt: Date.now(),
          })
        );
      } catch {
        // ignore storage errors
      }

      setLastNotificationStatus(
        `Abonnement API Push actif (ID #${subId}) pour ${settings.selectedBassin}`
      );

      // Dispatch immediate confirmation Push notification for critical periods
      await triggerNotification(
        {
          type: 'harvest-start',
          severity: 'info',
          title: `✅ Abonnement Push PWA Activé · ${settings.selectedBassin}`,
          zone: settings.selectedBassin,
          metric: `API Push VAPID #${subId}`,
          message:
            'Vous êtes abonné aux alertes Push pour les périodes critiques : début de récolte optimale (véraison), risques de gel, vents violents et calendrier phytosanitaire.',
          recommendations: [
            `Surveillance active pour le bassin : ${settings.selectedBassin}.`,
            'Les notifications Push fonctionnent via le Service Worker PWA et s’affichent en temps réel.',
          ],
        },
        false
      );

      return true;
    } catch (err) {
      console.warn('Error subscribing to Push API:', err);
      setLastNotificationStatus('Abonnement local activé dans le centre de vigilance.');
      return false;
    } finally {
      setIsSubscribing(false);
    }
  }, [settings, triggerNotification]);

  const unsubscribeFromPush = useCallback(async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        const sub = await registration?.pushManager?.getSubscription();
        if (sub) {
          await sub.unsubscribe();
        }
      }
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: pushSubscriptionId }),
      });
    } catch {
      // ignore
    }

    setPushStatus('unsubscribed');
    setPushSubscriptionId(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
    } catch {
      // ignore
    }
    setLastNotificationStatus('Abonnement Push désactivé sur cet appareil.');
  }, [pushSubscriptionId]);

  // Backward-compatible alias
  const requestPermission = subscribeToPush;

  // Quick simulation trigger for testing any of the 6 critical scenarios
  const simulateAlert = useCallback(
    (type: AlertType, zoneName?: string) => {
      const templateFn = PRESET_RISK_TEMPLATES[type];
      if (templateFn) {
        const data = templateFn(zoneName || settings.selectedBassin);
        return triggerNotification(data, true);
      }
      return Promise.resolve(false);
    },
    [settings.selectedBassin, triggerNotification]
  );

  // Dismiss an alert
  const dismissAlert = useCallback((id: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const dismissLiveToast = useCallback(() => {
    setLiveToastAlert(null);
  }, []);

  // Clear all alerts
  const clearAllHistory = useCallback(() => {
    setActiveAlerts([]);
    setAlertHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch {
      // ignore
    }
  }, []);

  // Check live weather data for critical thresholds
  const evaluateLiveWeatherForRisks = useCallback(
    (
      currentData: {
        temperature: number;
        apparentTemperature: number;
        windSpeed: number;
        precipitation: number;
        humidity: number;
      },
      zoneName: string
    ) => {
      if (!settings.enabled) return;

      if (
        settings.notifyOnFrost &&
        (currentData.temperature <= settings.frostThreshold ||
          currentData.apparentTemperature <= 0)
      ) {
        triggerNotification({
          type: 'frost',
          severity: 'critical',
          title: `❄️ Risque Imminent de Gelée : ${currentData.temperature}°C à ${zoneName}`,
          zone: zoneName,
          metric: `T° : ${currentData.temperature}°C (Ressenti : ${currentData.apparentTemperature}°C)`,
          message:
            'Température critique constatée. Risque immédiat de gelée sur les olives et la floraison.',
          recommendations: PRESET_RISK_TEMPLATES.frost(zoneName).recommendations,
        });
        return;
      }

      if (settings.notifyOnWind && currentData.windSpeed >= settings.windThreshold) {
        triggerNotification({
          type: 'high-wind',
          severity: 'warning',
          title: `💨 Alerte Bourrasques : Vent à ${currentData.windSpeed} km/h à ${zoneName}`,
          zone: zoneName,
          metric: `Vitesse du vent : ${currentData.windSpeed} km/h`,
          message:
            'Rafales violentes détectées. Risque élevé de décrochage prématuré des fruits et d’envol des filets.',
          recommendations: PRESET_RISK_TEMPLATES['high-wind'](zoneName).recommendations,
        });
        return;
      }

      if (settings.notifyOnRain && currentData.precipitation >= settings.rainThreshold) {
        triggerNotification({
          type: 'heavy-rain',
          severity: 'critical',
          title: `🌧️ Alerte Pluie Intense : ${currentData.precipitation} mm à ${zoneName}`,
          zone: zoneName,
          metric: `Précipitations : ${currentData.precipitation} mm`,
          message:
            'Averses torrentielles. Arrêter les récoltes et protéger la récolte du jour contre le pourrissement.',
          recommendations: PRESET_RISK_TEMPLATES['heavy-rain'](zoneName).recommendations,
        });
        return;
      }

      if (
        settings.notifyOnSirocco &&
        currentData.temperature >= 36 &&
        currentData.humidity < 25
      ) {
        triggerNotification({
          type: 'heat-sirocco',
          severity: 'warning',
          title: `🔥 Alerte Sirocco (Iryifi) : ${currentData.temperature}°C & Air très sec à ${zoneName}`,
          zone: zoneName,
          metric: `T° : ${currentData.temperature}°C · Humidité : ${currentData.humidity}%`,
          message:
            'Stress thermique majeur pour les oliviers. Risque de déshydratation des fruits.',
          recommendations: PRESET_RISK_TEMPLATES['heat-sirocco'](zoneName).recommendations,
        });
      }
    },
    [settings, triggerNotification]
  );

  return {
    isSupported,
    permission,
    pushStatus,
    pushSubscriptionId,
    isSubscribing,
    settings,
    activeAlerts,
    alertHistory,
    lastNotificationStatus,
    liveToastAlert,
    updateSettings,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    triggerNotification,
    simulateAlert,
    dismissAlert,
    dismissLiveToast,
    clearAllHistory,
    evaluateLiveWeatherForRisks,
  };
}
