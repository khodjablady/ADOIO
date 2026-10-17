import { useState, useEffect, useCallback } from 'react';

export type AlertType = 'frost' | 'high-wind' | 'heavy-rain' | 'heat-sirocco';
export type AlertSeverity = 'critical' | 'warning' | 'info';

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
}

export interface AlertSettings {
  enabled: boolean;
  notifyOnFrost: boolean;
  notifyOnWind: boolean;
  notifyOnRain: boolean;
  notifyOnSirocco: boolean;
  frostThreshold: number; // in °C (default 2°C)
  windThreshold: number; // in km/h (default 45 km/h)
  rainThreshold: number; // in mm (default 15 mm)
}

const DEFAULT_SETTINGS: AlertSettings = {
  enabled: true,
  notifyOnFrost: true,
  notifyOnWind: true,
  notifyOnRain: true,
  notifyOnSirocco: true,
  frostThreshold: 2,
  windThreshold: 45,
  rainThreshold: 15,
};

const STORAGE_KEYS = {
  SETTINGS: 'olive_bejaia_alert_settings',
  HISTORY: 'olive_bejaia_alert_history',
  LAST_TRIGGERED: 'olive_bejaia_last_alerts_triggered',
};

export const PRESET_RISK_TEMPLATES: Record<AlertType, (zoneName?: string) => Omit<WeatherAlert, 'id' | 'timestamp'>> = {
  frost: (zoneName = 'Seddouk & Versants Djurdjura') => ({
    type: 'frost',
    severity: 'critical',
    title: `❄️ Alerte Gel Nocturne : Risque de gelée blanche (${zoneName})`,
    zone: zoneName,
    metric: 'T° attendue : -0.5°C à 1.5°C',
    message: 'Chute brutale des températures nocturnes propice au gel des drupes et des jeunes rameaux.',
    recommendations: [
      'Suspendre immédiatement le gaulage et la récolte sur les arbres gelés : les olives touchées par le gel s’oxydent très vite et altèrent l’acidité oléique.',
      'Attendre le dégel complet en milieu de matinée avant toute manipulation des branches.',
      'Ne pas réaliser de taille de restructuration ou d’éclaircie avant ou pendant une vague de froid.',
      'Protéger les jeunes greffes et scions de 1 à 3 ans par buttage ou paillage protecteur au pied.'
    ]
  }),
  'high-wind': (zoneName = 'Couloir d’Akbou · Vallée de la Soummam') => ({
    type: 'high-wind',
    severity: 'warning',
    title: `💨 Alerte Rafales Violentes : Vents > 48 km/h (${zoneName})`,
    zone: zoneName,
    metric: 'Rafales : 52 km/h',
    message: 'Fortes turbulences aérologiques le long de l’oued Soummam risquant de faire chuter prématurément les olives.',
    recommendations: [
      'Renforcer immédiatement les piquets d’ancrage et le lestage des filets au sol.',
      'Arrêter temporairement les peignes vibreurs et les interventions sur échelles en hauteur.',
      'Ramasser et isoler impérativement les olives tombées au sol par terreau pour ne pas contaminer la cuve Extra-Vierge.',
      'Vérifier l’état des branches maîtresses après les rafales pour parer aux cassures.'
    ]
  }),
  'heavy-rain': (zoneName = 'Terrasses de Chemini & Littoral de Béjaïa') => ({
    type: 'heavy-rain',
    severity: 'critical',
    title: `🌧️ Alerte Pluies Torrentielles : Précipitations > 18 mm (${zoneName})`,
    zone: zoneName,
    metric: 'Cumul : 22 mm en 6h',
    message: 'Averses continues créant des risques de ravinement sur les terrasses et d’engorgement des sols.',
    recommendations: [
      'Cesser immédiatement la cueillette : les olives cueillies humides fermentent à grande vitesse.',
      'Ne JAMAIS stocker les olives mouillées dans des sacs en polyéthylène hermétiques.',
      'Acheminer sans délai les caisses aérées de la journée vers l’huilerie pour un pressage sous 24h chrono.',
      'Nettoyer les rigoles d’évacuation des terrasses pour éviter l’effondrement des murets en pierre sèche.'
    ]
  }),
  'heat-sirocco': (zoneName = 'Bassin de Tazmalt & Ighzer Amokrane') => ({
    type: 'heat-sirocco',
    severity: 'warning',
    title: `🔥 Alerte Vent Desséchant (Iryifi / Sirocco) : T° > 36°C (${zoneName})`,
    zone: zoneName,
    metric: 'T° : 37°C · Humidité : 18%',
    message: 'Vent chaud du Sud et hygrométrie critique provoquant un stress hydrique aigu des oliveraies.',
    recommendations: [
      'Si un système de micro-irrigation existe, procéder à une irrigation d’appoint nocturne ou à l’aube.',
      'Proscrire strictement tout traitement phytosanitaire foliaire sous forte chaleur pour éviter les brûlures.',
      'Veiller au maintien du couvert végétal fauché pour limiter l’évaporation superficielle du sol.',
      'Vigilance renforcée contre les départs d’incendies à proximité des vergers.'
    ]
  })
};

export function useWeatherAlerts() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [settings, setSettings] = useState<AlertSettings>(DEFAULT_SETTINGS);
  const [activeAlerts, setActiveAlerts] = useState<WeatherAlert[]>([]);
  const [alertHistory, setAlertHistory] = useState<WeatherAlert[]>([]);
  const [lastNotificationStatus, setLastNotificationStatus] = useState<string | null>(null);

  // Initialize permission and localStorage state
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      }

      const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (savedHistory) {
        const parsed: WeatherAlert[] = JSON.parse(savedHistory);
        setAlertHistory(parsed);
        // Only keep alerts from last 48 hours in active list
        const now = Date.now();
        const active = parsed.filter(a => now - a.timestamp < 48 * 60 * 60 * 1000);
        setActiveAlerts(active);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  // Save settings
  const updateSettings = useCallback((newSettings: Partial<AlertSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      } catch {
        // storage fallback
      }
      return updated;
    });
  }, []);

  // Request browser notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setLastNotificationStatus('Les notifications ne sont pas prises en charge par ce navigateur.');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        setLastNotificationStatus('Notifications activées avec succès !');
        // Send a confirmation welcome notification via Service Worker
        await triggerNotification({
          type: 'frost',
          severity: 'info',
          title: '✅ Alertes Météo Activées · Wilaya de Béjaïa',
          zone: 'Toutes zones oléicoles',
          metric: 'Vigilance active',
          message: 'Vous recevrez les alertes de gelée, fortes rafales et averses critiques directement sur cet appareil.',
          recommendations: [
            'Le système surveille les conditions atmosphériques des bassins de Béjaïa, Akbou, Seddouk et Chemini.',
            'Les notifications fonctionnent même hors-ligne grâce au Service Worker enregistré.'
          ]
        }, false);
        return true;
      } else if (result === 'denied') {
        setLastNotificationStatus('Notifications refusées dans les réglages du navigateur.');
        return false;
      }
      return false;
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return false;
    }
  }, [isSupported]);

  // Trigger push/local notification via Service Worker
  const triggerNotification = useCallback(async (
    alertData: Omit<WeatherAlert, 'id' | 'timestamp'>,
    isSimulation = false
  ): Promise<boolean> => {
    const alert: WeatherAlert = {
      ...alertData,
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      isSimulated: isSimulation,
      isRead: false
    };

    // Update state & history
    setActiveAlerts(prev => [alert, ...prev.filter(a => a.type !== alert.type || a.zone !== alert.zone)]);
    setAlertHistory(prev => {
      const next = [alert, ...prev.slice(0, 24)];
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
      vibrate: alert.severity === 'critical' ? [300, 100, 300, 100, 400] : [200, 100, 200],
      tag: `olive-alert-${alert.type}`,
      renotify: true,
      data: {
        url: '/#pratiques',
        alertId: alert.id,
        severity: alert.severity
      },
      actions: [
        { action: 'view-tips', title: '🛡️ Mesures d’urgence' },
        { action: 'dismiss', title: 'Compris' }
      ]
    };

    let delivered = false;

    // 1. Try ServiceWorkerRegistration.showNotification (standard PWA way)
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration && 'showNotification' in registration) {
          await registration.showNotification(notifTitle, notifOptions);
          delivered = true;
        }

        // Also post message to active service worker controller
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'TRIGGER_SW_NOTIFICATION',
            title: notifTitle,
            options: notifOptions
          });
        }
      } catch (swErr) {
        console.warn('SW showNotification failed, trying fallback:', swErr);
      }
    }

    // 2. Fallback to Window Notification API if SW showNotification was not possible
    if (!delivered && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notifTitle, {
          body: notifOptions.body,
          icon: notifOptions.icon,
          badge: notifOptions.badge
        });
        delivered = true;
      } catch (notifErr) {
        console.warn('Fallback Notification failed:', notifErr);
      }
    }

    return delivered;
  }, []);

  // Quick simulation trigger for testing
  const simulateAlert = useCallback((type: AlertType, zoneName?: string) => {
    const templateFn = PRESET_RISK_TEMPLATES[type];
    if (templateFn) {
      const data = templateFn(zoneName);
      return triggerNotification(data, true);
    }
    return Promise.resolve(false);
  }, [triggerNotification]);

  // Dismiss an alert
  const dismissAlert = useCallback((id: string) => {
    setActiveAlerts(prev => prev.filter(a => a.id !== id));
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
  const evaluateLiveWeatherForRisks = useCallback((
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

    // Check Frost Risk
    if (settings.notifyOnFrost && (currentData.temperature <= settings.frostThreshold || currentData.apparentTemperature <= 0)) {
      triggerNotification({
        type: 'frost',
        severity: 'critical',
        title: `❄️ Risque Imminent de Gelée : ${currentData.temperature}°C à ${zoneName}`,
        zone: zoneName,
        metric: `T° : ${currentData.temperature}°C (Ressenti : ${currentData.apparentTemperature}°C)`,
        message: 'Température critique constatée. Risque immédiat de gelée sur les olives et la floraison.',
        recommendations: PRESET_RISK_TEMPLATES.frost(zoneName).recommendations
      });
      return;
    }

    // Check High Wind Risk
    if (settings.notifyOnWind && currentData.windSpeed >= settings.windThreshold) {
      triggerNotification({
        type: 'high-wind',
        severity: 'warning',
        title: `💨 Alerte Bourrasques : Vent à ${currentData.windSpeed} km/h à ${zoneName}`,
        zone: zoneName,
        metric: `Vitesse du vent : ${currentData.windSpeed} km/h`,
        message: 'Rafales violentes détectées. Risque élevé de décrochage prématuré des fruits et d’envol des filets.',
        recommendations: PRESET_RISK_TEMPLATES['high-wind'](zoneName).recommendations
      });
      return;
    }

    // Check Heavy Rain Risk
    if (settings.notifyOnRain && currentData.precipitation >= settings.rainThreshold) {
      triggerNotification({
        type: 'heavy-rain',
        severity: 'critical',
        title: `🌧️ Alerte Pluie Intense : ${currentData.precipitation} mm à ${zoneName}`,
        zone: zoneName,
        metric: `Précipitations : ${currentData.precipitation} mm`,
        message: 'Averses torrentielles. Arrêter les récoltes et protéger la récolte du jour contre le pourrissement.',
        recommendations: PRESET_RISK_TEMPLATES['heavy-rain'](zoneName).recommendations
      });
      return;
    }

    // Check Sirocco / Extreme dry heat
    if (settings.notifyOnSirocco && currentData.temperature >= 36 && currentData.humidity < 25) {
      triggerNotification({
        type: 'heat-sirocco',
        severity: 'warning',
        title: `🔥 Alerte Sirocco (Iryifi) : ${currentData.temperature}°C & Air très sec à ${zoneName}`,
        zone: zoneName,
        metric: `T° : ${currentData.temperature}°C · Humidité : ${currentData.humidity}%`,
        message: 'Stress thermique majeur pour les oliviers. Risque de déshydratation des fruits.',
        recommendations: PRESET_RISK_TEMPLATES['heat-sirocco'](zoneName).recommendations
      });
    }
  }, [settings, triggerNotification]);

  return {
    isSupported,
    permission,
    settings,
    activeAlerts,
    alertHistory,
    lastNotificationStatus,
    updateSettings,
    requestPermission,
    triggerNotification,
    simulateAlert,
    dismissAlert,
    clearAllHistory,
    evaluateLiveWeatherForRisks
  };
}
