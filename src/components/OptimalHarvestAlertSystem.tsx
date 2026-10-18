import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  BellRing, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Wind, 
  Thermometer, 
  CloudRain, 
  Sun, 
  Droplets, 
  Calendar, 
  ShieldCheck, 
  Smartphone, 
  Send, 
  RefreshCw, 
  Sliders, 
  MapPin, 
  Leaf, 
  ChevronRight, 
  Info, 
  Clock,
  Snowflake,
  Flame,
  Check,
  Award
} from 'lucide-react';

export interface VarietyHarvestProfile {
  id: string;
  name: string;
  kabyleName: string;
  optimalPeriodLabel: string;
  optimalMonths: string;
  idealTempMin: number;
  idealTempMax: number;
  maxWindSpeedKmH: number;
  maxPrecipitationMm48h: number;
  ripenessWindow: string;
  oilYieldExpectation: string;
  polyphenolLevel: string;
  bestObjective: string;
  advisoryTip: string;
  emergencyActions: string[];
}

export const VARIETY_HARVEST_PROFILES: Record<string, VarietyHarvestProfile> = {
  chemlal: {
    id: 'chemlal',
    name: 'Chemlal de Kabylie',
    kabyleName: 'Izemmuren n Ccemlal',
    optimalPeriodLabel: '15 Novembre – 15 Janvier',
    optimalMonths: 'Novembre à Janvier',
    idealTempMin: 10,
    idealTempMax: 18,
    maxWindSpeedKmH: 25,
    maxPrecipitationMm48h: 3,
    ripenessWindow: 'Véraison 60% noire / 40% tournante',
    oilYieldExpectation: '18 à 22 Litres / quintal',
    polyphenolLevel: 'Élevé (380 – 520 mg/kg)',
    bestObjective: 'Fruité vert intense, artichaut cru et feuille d’olivier',
    advisoryTip: 'Ne pas attendre le noircissement total à 100% : la récolte à mi-véraison préserve la fraîcheur aromatique et garantit une acidité Vierge Extra < 0,35%.',
    emergencyActions: [
      'Déployer les grands filets ajourés propres sous la frondaison avant secouage',
      'Transférer immédiatement en caisses plastiques ajourées de 20 kg (bannir les sacs étanches)',
      'Acheminer au moulin moderne à chaîne continue pour trituration sous 24h'
    ]
  },
  bouchouk: {
    id: 'bouchouk',
    name: 'Bouchouk',
    kabyleName: 'Buccuk n Tsedda',
    optimalPeriodLabel: '20 Octobre – 30 Novembre',
    optimalMonths: 'Fin Octobre à Fin Novembre',
    idealTempMin: 12,
    idealTempMax: 20,
    maxWindSpeedKmH: 22,
    maxPrecipitationMm48h: 2,
    ripenessWindow: 'Véraison mi-noire à épiderme violacé',
    oilYieldExpectation: '21 à 25 Litres / quintal (Rendement record)',
    polyphenolLevel: 'Très Élevé (> 500 mg/kg)',
    bestObjective: 'Huile de caractère montagnarde, ardence poivrée nette',
    advisoryTip: 'Variété rustique de moyenne montagne (Chemini, Sidi-Aïch). Exige un sol ressuyé sans rosée persistante pour une extraction fluide.',
    emergencyActions: [
      'Attendre 10h du matin pour la dissipation complète des brouillards de versant',
      'Éviter le gaulage brutal pour préserver les rameaux porteurs de l’année suivante',
      'Priorité d’extraction au moulin sans aucun ajout d’eau tiède supérieure à 27°C'
    ]
  },
  aberkane: {
    id: 'aberkane',
    name: 'Aberkane',
    kabyleName: 'Aberkan n Taddart',
    optimalPeriodLabel: '25 Octobre – 15 Décembre',
    optimalMonths: 'Novembre à Mi-Décembre',
    idealTempMin: 12,
    idealTempMax: 21,
    maxWindSpeedKmH: 20,
    maxPrecipitationMm48h: 1,
    ripenessWindow: 'Stade noir brillant précoce',
    oilYieldExpectation: '19 à 23 Litres / quintal',
    polyphenolLevel: 'Moyen à Équilibré (320 mg/kg)',
    bestObjective: 'Huile douce et ronde, arômes d’amande douce et de pomme mûre',
    advisoryTip: 'La pulpe de l’Aberkane est tendre : elle craint les pluies prolongées qui favorisent le ramollissement et les moisissures. Cueillir par temps sec.',
    emergencyActions: [
      'Cueillette manuelle soignée au peigne ou au vibreur basse intensité',
      'Pas de stockage intermédiaire : triturer impérativement dans les 18 heures',
      'Lavage et effeuillage minutieux à l’arrivée au moulin'
    ]
  },
  limli: {
    id: 'limli',
    name: 'Limli',
    kabyleName: 'Limli n Yighzer',
    optimalPeriodLabel: '05 Novembre – 20 Décembre',
    optimalMonths: 'Novembre à Mi-Décembre',
    idealTempMin: 11,
    idealTempMax: 19,
    maxWindSpeedKmH: 24,
    maxPrecipitationMm48h: 4,
    ripenessWindow: 'Véraison violacée homogène',
    oilYieldExpectation: '20 à 24 Litres / quintal',
    polyphenolLevel: 'Équilibré (350 mg/kg)',
    bestObjective: 'Robe vert doré, équilibre soyeux en bouche',
    advisoryTip: 'Bien adaptée au couloir alluvionnaire de la Soummam. Surveiller l’arrivée des premières gelées nocturnes qui altèrent son fruité délicat.',
    emergencyActions: [
      'Vérifier les prévisions de gel nocturne sous abri avant de planifier la journée',
      'Utiliser des peignes télescopiques légers pour ne pas déchirer l’écorce',
      'Séparer les lots de première cueillette des chutes tardives'
    ]
  },
  azeradj: {
    id: 'azeradj',
    name: 'Azeradj (Adjeraz)',
    kabyleName: 'Ajeṛṛaḍ n Sedduq',
    optimalPeriodLabel: '15 Octobre – 25 Novembre',
    optimalMonths: 'Octobre à Fin Novembre',
    idealTempMin: 13,
    idealTempMax: 22,
    maxWindSpeedKmH: 22,
    maxPrecipitationMm48h: 2,
    ripenessWindow: 'Vert tournant à piquetage violacé',
    oilYieldExpectation: '20 à 23 Litres / quintal',
    polyphenolLevel: 'Très Élevé (480 mg/kg)',
    bestObjective: 'Double fin (Confiserie et Huile prestige ADOIO)',
    advisoryTip: 'Perle des hauts plateaux de Seddouk. Si destinée à l’huile Vierge Extra prestige, cueillir dès la première véraison pour capturer ses notes d’herbe coupée.',
    emergencyActions: [
      'Cueillette sélective précoce sur toile tendue',
      'Pesée et traçabilité immédiate pour la démarche Indication Géographique (IG)',
      'Extraction à froid immédiate sur chaîne moderne 2 phases'
    ]
  },
  assemblage: {
    id: 'assemblage',
    name: 'Assemblage Terroir Kabylie',
    kabyleName: 'Asduy n Bgayet',
    optimalPeriodLabel: '01 Novembre – 31 Décembre',
    optimalMonths: 'Novembre et Décembre',
    idealTempMin: 11,
    idealTempMax: 19,
    maxWindSpeedKmH: 25,
    maxPrecipitationMm48h: 3,
    ripenessWindow: 'Mixte Chemlal + Bouchouk à mi-maturité',
    oilYieldExpectation: '19,5 à 22 Litres / quintal',
    polyphenolLevel: 'Harmonieux (420 mg/kg)',
    bestObjective: 'Grande complexité aromatique, signature typique de Béjaïa',
    advisoryTip: 'Homogénéiser les délais de cueillette entre les parcelles pour ne pas mélanger des olives de fraîcheur inégale.',
    emergencyActions: [
      'Coordonner les équipes de cueillette en tiwizi sur l’ensemble du verger',
      'Assurer une rotation continue vers l’huilerie partenaire',
      'Protéger les caisses empilées de la pluie et du soleil direct'
    ]
  }
};

export interface TerroirZone {
  id: string;
  name: string;
  daira: string;
  altitude: string;
  baseTemp: number;
  baseHumidity: number;
  baseWind: number;
  basePrecip: number;
  weatherCondition: 'clear' | 'partly_cloudy' | 'rain' | 'frost' | 'windy';
  weatherLabel: string;
}

export const TERROIR_ZONES: TerroirZone[] = [
  {
    id: 'akbou',
    name: 'Akbou (Vallée de la Soummam)',
    daira: 'Akbou',
    altitude: '180 m',
    baseTemp: 16.5,
    baseHumidity: 58,
    baseWind: 14,
    basePrecip: 0,
    weatherCondition: 'clear',
    weatherLabel: 'Ensoleillé, doux et sec'
  },
  {
    id: 'seddouk',
    name: 'Seddouk (Plateau Oléicole)',
    daira: 'Seddouk',
    altitude: '490 m',
    baseTemp: 14.8,
    baseHumidity: 62,
    baseWind: 12,
    basePrecip: 0,
    weatherCondition: 'clear',
    weatherLabel: 'Ciel dégagé, brise légère'
  },
  {
    id: 'chemini',
    name: 'Chemini (Versants du Djurdjura)',
    daira: 'Chemini',
    altitude: '750 m',
    baseTemp: 13.2,
    baseHumidity: 68,
    baseWind: 18,
    basePrecip: 0.5,
    weatherCondition: 'partly_cloudy',
    weatherLabel: 'Éclaircies montagnardes, air vivifiant'
  },
  {
    id: 'tazmalt',
    name: 'Tazmalt (Contreforts Akfadou)',
    daira: 'Tazmalt',
    altitude: '320 m',
    baseTemp: 15.2,
    baseHumidity: 60,
    baseWind: 15,
    basePrecip: 0,
    weatherCondition: 'clear',
    weatherLabel: 'Temps clair et stable'
  },
  {
    id: 'aokas',
    name: 'Aokas (Corniche & Cap Carbon)',
    daira: 'Aokas',
    altitude: '120 m',
    baseTemp: 17.0,
    baseHumidity: 72,
    baseWind: 16,
    basePrecip: 0,
    weatherCondition: 'partly_cloudy',
    weatherLabel: 'Douceur maritime, légère brise'
  },
  {
    id: 'sidi-aich',
    name: 'Sidi-Aïch & Leflaye (Moyenne Soummam)',
    daira: 'Sidi-Aïch',
    altitude: '240 m',
    baseTemp: 15.8,
    baseHumidity: 61,
    baseWind: 13,
    basePrecip: 0,
    weatherCondition: 'clear',
    weatherLabel: 'Grand soleil, conditions parfaites'
  }
];

interface OptimalHarvestAlertSystemProps {
  selectedVariety?: string;
  onSelectVariety?: (varietyId: string) => void;
}

export const OptimalHarvestAlertSystem: React.FC<OptimalHarvestAlertSystemProps> = ({
  selectedVariety = 'chemlal',
  onSelectVariety
}) => {
  const [activeVarietyId, setActiveVarietyId] = useState<string>(
    VARIETY_HARVEST_PROFILES[selectedVariety] ? selectedVariety : 'chemlal'
  );
  const [selectedZoneId, setSelectedZoneId] = useState<string>('seddouk');
  const [harvestGoal, setHarvestGoal] = useState<'fruite_vert' | 'equilibre' | 'fruite_mur'>('equilibre');
  
  // Weather scenario override for interactive testing
  const [weatherScenario, setWeatherScenario] = useState<'optimal' | 'rain' | 'frost' | 'wind'>('optimal');

  // PWA Notification State
  const [swRegistered, setSwRegistered] = useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isAutoMonitoringActive, setIsAutoMonitoringActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('olive_harvest_auto_monitoring') === 'true';
    } catch {
      return true;
    }
  });
  const [isSendingNotification, setIsSendingNotification] = useState<boolean>(false);
  const [lastNotificationStatus, setLastNotificationStatus] = useState<{
    success: boolean;
    timestamp: string;
    message: string;
    method?: string;
  } | null>(null);

  // Sync external selectedVariety changes
  useEffect(() => {
    if (selectedVariety && VARIETY_HARVEST_PROFILES[selectedVariety]) {
      setActiveVarietyId(selectedVariety);
    }
  }, [selectedVariety]);

  // Check Service Worker & Notification Permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(reg => {
        setSwRegistered(!!reg);
      }).catch(() => {
        setSwRegistered(false);
      });
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleVarietyChange = (newId: string) => {
    setActiveVarietyId(newId);
    if (onSelectVariety) {
      onSelectVariety(newId);
    }
  };

  const currentProfile = VARIETY_HARVEST_PROFILES[activeVarietyId] || VARIETY_HARVEST_PROFILES.chemlal;
  const currentZone = TERROIR_ZONES.find(z => z.id === selectedZoneId) || TERROIR_ZONES[1];

  // Derive simulated live conditions based on base zone + weather scenario
  const weatherSnapshot = {
    temp: weatherScenario === 'optimal' ? currentZone.baseTemp :
          weatherScenario === 'frost' ? 1.2 :
          weatherScenario === 'rain' ? 11.5 : 18.2,
    wind: weatherScenario === 'wind' ? 48 : (weatherScenario === 'optimal' ? currentZone.baseWind : 16),
    precip48h: weatherScenario === 'rain' ? 24.5 : (weatherScenario === 'optimal' ? currentZone.basePrecip : 0),
    humidity: weatherScenario === 'rain' ? 92 : (weatherScenario === 'frost' ? 78 : currentZone.baseHumidity),
    label: weatherScenario === 'optimal' ? currentZone.weatherLabel :
           weatherScenario === 'frost' ? '❄️ Risque de Gelée Blanche (-0.5°C à l’aube)' :
           weatherScenario === 'rain' ? '🌧️ Fortes pluies orageuses continues (24 mm)' :
           '💨 Bourrasques violentes de secteur Nord-Ouest (48 km/h)'
  };

  // Evaluate harvest opportunity score (0 to 100%)
  let score = 96;
  const penalties: string[] = [];
  const advantages: string[] = [];

  // Temperature evaluation
  if (weatherSnapshot.temp < currentProfile.idealTempMin) {
    if (weatherSnapshot.temp <= 3) {
      score -= 50;
      penalties.push(`Température critique (${weatherSnapshot.temp}°C) : risque de gel des olives et oxydation.`);
    } else {
      score -= 20;
      penalties.push(`Température fraîche (${weatherSnapshot.temp}°C) : fluidité d’extraction légèrement ralentie.`);
    }
  } else if (weatherSnapshot.temp > currentProfile.idealTempMax + 5) {
    score -= 15;
    penalties.push(`Chaleur excessive (${weatherSnapshot.temp}°C) : risque de fermentation prématurée en caisse.`);
  } else {
    advantages.push(`Température idéale (${weatherSnapshot.temp}°C) pour préserver les arômes fruités.`);
  }

  // Rain evaluation
  if (weatherSnapshot.precip48h > currentProfile.maxPrecipitationMm48h) {
    score -= 45;
    penalties.push(`Précipitations récentes de ${weatherSnapshot.precip48h} mm : les olives gorgées d'eau perdent en polyphénols.`);
  } else {
    advantages.push(`Temps sec et sol stabilisé : fruits à teneur en eau optimale.`);
  }

  // Wind evaluation
  if (weatherSnapshot.wind > currentProfile.maxWindSpeedKmH) {
    score -= 30;
    penalties.push(`Vent à ${weatherSnapshot.wind} km/h : prise au vent dangereuse des filets et décrochage au sol.`);
  } else {
    advantages.push(`Vent calme (${weatherSnapshot.wind} km/h) facilitant le déploiement des toiles et filets.`);
  }

  score = Math.max(10, Math.min(100, score));

  const isHarvestOptimal = score >= 80;
  const isHarvestAcceptable = score >= 60 && score < 80;

  // Function to trigger personalized PWA notification via Service Worker
  const triggerHarvestNotification = useCallback(async (isManualTrigger = true) => {
    setIsSendingNotification(true);

    try {
      // 1. Request permission if needed
      let perm: NotificationPermission = 'default';
      if (typeof window !== 'undefined' && 'Notification' in window) {
        perm = Notification.permission;
        if (perm === 'default') {
          perm = await Notification.requestPermission();
          setNotificationPermission(perm);
        }
      }

      const notifTitle = isHarvestOptimal
        ? `🌿 Période Optimale : Récoltez vos olives ${currentProfile.name} !`
        : isHarvestAcceptable
        ? `⚠️ Vigilance Récolte : Conditions modérées pour ${currentProfile.name}`
        : `🛑 Alerte Récolte Déconseillée : ${currentProfile.name} à ${currentZone.name}`;

      const notifBody = isHarvestOptimal
        ? `Terroir ${currentZone.name} : Conditions climatiques parfaites (${weatherSnapshot.temp}°C, temps sec, vent ${weatherSnapshot.wind} km/h). Teneur optimale en huile & polyphénols.`
        : isHarvestAcceptable
        ? `Terroir ${currentZone.name} : Fenêtre acceptable (${score}%). Surveillez les prévisions météo avant de déployer les filets.`
        : `Alerte météo à ${currentZone.name} (${weatherSnapshot.label}). Interrompez la cueillette pour préserver la qualité de l’huile.`;

      const notifOptions = {
        body: notifBody,
        icon: '/pwa-192x192.png',
        badge: '/icon.svg',
        tag: `harvest-alert-${currentProfile.id}-${Date.now()}`,
        renotify: true,
        requireInteraction: true,
        data: {
          url: '/#simulateur',
          variety: currentProfile.name,
          zone: currentZone.name,
          score: score,
          timestamp: Date.now()
        },
        actions: [
          { action: 'view-sim', title: '📊 Ouvrir le Simulateur' },
          { action: 'dismiss', title: 'Compris' }
        ]
      };

      let delivered = false;
      let methodUsed = 'Service Worker PWA';

      // 2. Dispatch via Service Worker
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.ready;
          if (reg && 'showNotification' in reg) {
            await reg.showNotification(notifTitle, notifOptions as any);
            delivered = true;
            methodUsed = 'Service Worker PWA (Registration API)';
          }
        } catch (swErr) {
          console.warn('SW registration.showNotification warning:', swErr);
        }

        // Also post message to controller if active
        if (!delivered && navigator.serviceWorker.controller) {
          try {
            navigator.serviceWorker.controller.postMessage({
              type: 'TRIGGER_SW_NOTIFICATION',
              title: notifTitle,
              options: notifOptions
            });
            delivered = true;
            methodUsed = 'Service Worker PWA (Message Bus)';
          } catch (pmErr) {
            console.warn('postMessage to SW warning:', pmErr);
          }
        }
      }

      // 3. Fallback to Window Notification API
      if (!delivered && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(notifTitle, {
            body: notifOptions.body,
            icon: notifOptions.icon,
            badge: notifOptions.badge
          });
          delivered = true;
          methodUsed = 'API Notification Navigateur (Fallback)';
        } catch (winErr) {
          console.warn('Window Notification fallback error:', winErr);
        }
      }

      setLastNotificationStatus({
        success: delivered || perm === 'granted',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message: delivered 
          ? `Alerte transmise avec succès (${methodUsed})` 
          : perm === 'denied'
          ? "Permission de notification refusée dans votre navigateur."
          : "Notification préparée et mise en file d’attente du Service Worker.",
        method: methodUsed
      });

    } catch (err) {
      setLastNotificationStatus({
        success: false,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        message: `Erreur d'envoi : ${String(err)}`
      });
    } finally {
      setIsSendingNotification(false);
    }
  }, [currentProfile, currentZone, weatherSnapshot, score, isHarvestOptimal, isHarvestAcceptable]);

  const toggleAutoMonitoring = () => {
    const nextVal = !isAutoMonitoringActive;
    setIsAutoMonitoringActive(nextVal);
    try {
      localStorage.setItem('olive_harvest_auto_monitoring', String(nextVal));
    } catch {
      // ignore
    }
    if (nextVal && notificationPermission === 'default') {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        Notification.requestPermission().then(p => setNotificationPermission(p));
      }
    }
  };

  return (
    <div id="alertes-recolte-optimale" className="mt-12 bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-[#E6DEC9]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1.5">
            <Smartphone className="w-4 h-4 text-[#E6AB3C]" />
            <span>Service Worker PWA · Déclencheur Intelligent de Cueillette</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F] flex items-center gap-2">
            <span>Alertes Personnalisées de Récolte Optimale</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#E8F4D9] text-[#233416] border border-[#8CBE5D]">
              <Sparkles className="w-3 h-3 text-[#E6AB3C]" />
              Bio-Météo & Cépages
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-[#567B34] mt-1 max-w-3xl leading-relaxed">
            Recevez une notification push directement sur votre appareil dès que la fenêtre biométéorologique locale est parfaite pour cueillir votre variété d'olives (équilibre acidité & polyphénols).
          </p>
        </div>

        {/* PWA Service Worker Status Badge */}
        <div className="flex items-center gap-2 shrink-0 bg-[#FAF7F2] px-3.5 py-2 rounded-2xl border border-[#E6DEC9]">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              notificationPermission === 'granted' ? 'bg-[#567B34]' : 'bg-[#E6AB3C]'
            }`} />
            <div className="text-left text-xs">
              <span className="font-bold text-[#18230F] block">
                {notificationPermission === 'granted' ? 'Notifications PWA Actives' : 'PWA Prête à Notifier'}
              </span>
              <span className="text-[10px] text-[#567B34]">
                {swRegistered ? 'Service Worker opérationnel' : 'Service Worker en veille'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 pb-6 border-b border-[#E6DEC9]">
        {/* 1. Variety Choice */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#18230F] flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-[#567B34]" />
            <span>Variété surveillée :</span>
          </label>
          <select
            value={activeVarietyId}
            onChange={(e) => handleVarietyChange(e.target.value)}
            className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-semibold text-[#18230F] cursor-pointer"
          >
            {Object.values(VARIETY_HARVEST_PROFILES).map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.optimalMonths})
              </option>
            ))}
          </select>
          <span className="text-[11px] text-[#6F9D44] block font-serif italic">
            « {currentProfile.kabyleName} »
          </span>
        </div>

        {/* 2. Terroir / Microclimate Zone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#18230F] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E6AB3C]" />
            <span>Bassin Oléicole / Terroir :</span>
          </label>
          <select
            value={selectedZoneId}
            onChange={(e) => setSelectedZoneId(e.target.value)}
            className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-semibold text-[#18230F] cursor-pointer"
          >
            {TERROIR_ZONES.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} · {z.altitude}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-[#567B34] block">
            Daïra de {currentZone.daira} · {currentZone.altitude}
          </span>
        </div>

        {/* 3. Harvest Target Profile */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#18230F] flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#8CBE5D]" />
            <span>Profil aromatique visé :</span>
          </label>
          <select
            value={harvestGoal}
            onChange={(e) => setHarvestGoal(e.target.value as any)}
            className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-semibold text-[#18230F] cursor-pointer"
          >
            <option value="fruite_vert">Fruité Vert & Polyphénols Max (Cueillette Précoce)</option>
            <option value="equilibre">Équilibre Rendement-Arômes Vierge Extra (Standard ADOIO)</option>
            <option value="fruite_mur">Fruité Mûr Doux Traditionnel (Cueillette Tardive)</option>
          </select>
          <span className="text-[11px] text-[#567B34] block">
            Fenêtre optimale : <strong>{currentProfile.optimalPeriodLabel}</strong>
          </span>
        </div>
      </div>

      {/* Live Bio-Météo Evaluation & Readiness Gauge */}
      <div className="py-6 border-b border-[#E6DEC9]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#567B34] block">
              Diagnostic Climatologique en Temps Réel
            </span>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-[#18230F] mt-0.5">
              Conditions Observées sur le Terroir de {currentZone.name}
            </h4>
          </div>

          {/* Simulation Toggle Pills to demonstrate scenarios */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#E6DEC9] text-xs">
            <span className="text-[10px] text-[#6F9D44] font-bold px-2 uppercase hidden sm:inline">Simulateur météo :</span>
            <button
              type="button"
              onClick={() => setWeatherScenario('optimal')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                weatherScenario === 'optimal'
                  ? 'bg-[#31491E] text-white shadow-xs'
                  : 'text-[#31491E] hover:bg-white/60'
              }`}
              title="Tester les conditions optimales de cueillette"
            >
              ☀️ Idéal (Sec & Doux)
            </button>
            <button
              type="button"
              onClick={() => setWeatherScenario('frost')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                weatherScenario === 'frost'
                  ? 'bg-cyan-700 text-white shadow-xs'
                  : 'text-cyan-800 hover:bg-white/60'
              }`}
              title="Simuler un risque de gelée blanche matinale"
            >
              ❄️ Risque Gel
            </button>
            <button
              type="button"
              onClick={() => setWeatherScenario('rain')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                weatherScenario === 'rain'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-800 hover:bg-white/60'
              }`}
              title="Simuler des pluies continues"
            >
              🌧️ Pluie
            </button>
            <button
              type="button"
              onClick={() => setWeatherScenario('wind')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                weatherScenario === 'wind'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-white/60'
              }`}
              title="Simuler des rafales violentes"
            >
              💨 Vent Fort
            </button>
          </div>
        </div>

        {/* 4 Sensor Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6DEC9]/80">
            <div className="flex items-center justify-between text-xs text-[#6F9D44] mb-1 font-semibold">
              <span>Température</span>
              <Thermometer className="w-3.5 h-3.5 text-[#E6AB3C]" />
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
              {weatherSnapshot.temp}°C
            </div>
            <span className="text-[10px] text-[#567B34] block mt-0.5">
              Idéal {currentProfile.idealTempMin}°C à {currentProfile.idealTempMax}°C
            </span>
          </div>

          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6DEC9]/80">
            <div className="flex items-center justify-between text-xs text-[#6F9D44] mb-1 font-semibold">
              <span>Précipitations 48h</span>
              <CloudRain className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
              {weatherSnapshot.precip48h} mm
            </div>
            <span className="text-[10px] text-[#567B34] block mt-0.5">
              Tolérance max &lt; {currentProfile.maxPrecipitationMm48h} mm
            </span>
          </div>

          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6DEC9]/80">
            <div className="flex items-center justify-between text-xs text-[#6F9D44] mb-1 font-semibold">
              <span>Vitesse du Vent</span>
              <Wind className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
              {weatherSnapshot.wind} km/h
            </div>
            <span className="text-[10px] text-[#567B34] block mt-0.5">
              Pose des filets sûre &lt; {currentProfile.maxWindSpeedKmH} km/h
            </span>
          </div>

          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E6DEC9]/80">
            <div className="flex items-center justify-between text-xs text-[#6F9D44] mb-1 font-semibold">
              <span>Maturité {currentProfile.name}</span>
              <Leaf className="w-3.5 h-3.5 text-[#567B34]" />
            </div>
            <div className="font-serif text-sm sm:text-base font-bold text-[#31491E] truncate">
              {currentProfile.ripenessWindow.split('/')[0]}
            </div>
            <span className="text-[10px] text-[#567B34] block mt-0.5">
              Rendement attendu : {currentProfile.oilYieldExpectation.split(' ')[0]} L/qx
            </span>
          </div>
        </div>

        {/* Opportunity Score Gauge Banner */}
        <div className={`p-5 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all ${
          isHarvestOptimal 
            ? 'bg-gradient-to-r from-[#E8F4D9] to-[#FAF7F2] border-[#8CBE5D]' 
            : isHarvestAcceptable
            ? 'bg-gradient-to-r from-[#FEF5DB] to-[#FAF7F2] border-[#E6AB3C]'
            : 'bg-gradient-to-r from-red-50 to-[#FAF7F2] border-red-300'
        }`}>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isHarvestOptimal
                  ? 'bg-[#31491E] text-[#FAF7F2]'
                  : isHarvestAcceptable
                  ? 'bg-[#B47A16] text-white'
                  : 'bg-red-800 text-white'
              }`}>
                {isHarvestOptimal ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8CBE5D]" />
                    <span>Fenêtre Optimale Ouverte</span>
                  </>
                ) : isHarvestAcceptable ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-[#FEF5DB]" />
                    <span>Fenêtre Modérée</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-white" />
                    <span>Récolte Déconseillée</span>
                  </>
                )}
              </span>

              <span className="font-serif font-extrabold text-lg text-[#18230F]">
                Score d'Opportunité : {score}%
              </span>
            </div>

            <p className="text-xs text-[#242A20] font-medium leading-relaxed">
              {isHarvestOptimal
                ? `Les conditions biométéorologiques à ${currentZone.name} sont parfaitement alignées avec le profil végétatif de la variété ${currentProfile.name}. L'extraction d'huile Vierge Extra sera optimale.`
                : isHarvestAcceptable
                ? `Conditions partiellement favorables à ${currentZone.name}. Vous pouvez récolter mais prenez garde au taux d'humidité des drupes.`
                : `Conditions défavorables détectées. ${penalties[0] || "Reportez le ramassage pour préserver l'intégrité sanitaire des olives."}`}
            </p>

            {/* List of Positive & Negative Factors */}
            <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
              {advantages.map((adv, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-[#8CBE5D]/50 text-[#31491E] font-medium">
                  <Check className="w-3 h-3 text-[#567B34]" />
                  <span>{adv}</span>
                </span>
              ))}
              {penalties.map((pen, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white border border-red-300 text-red-900 font-medium">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span>{pen}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => triggerHarvestNotification(true)}
              disabled={isSendingNotification}
              className="px-5 py-3 rounded-2xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] font-bold text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSendingNotification ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#E6AB3C]" />
              ) : (
                <BellRing className="w-4 h-4 text-[#E6AB3C]" />
              )}
              <span>Envoyer l'Alerte PWA sur cet Appareil</span>
            </button>

            <button
              type="button"
              onClick={toggleAutoMonitoring}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isAutoMonitoringActive
                  ? 'bg-white border-[#567B34] text-[#31491E]'
                  : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#6F9D44] hover:bg-white'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAutoMonitoringActive ? 'bg-[#567B34]' : 'bg-gray-400'}`} />
              <span>
                {isAutoMonitoringActive ? 'Veille Automatique PWA : Active' : 'Activer la Veille Quotidienne'}
              </span>
            </button>
          </div>
        </div>

        {/* Notification Status confirmation banner */}
        {lastNotificationStatus && (
          <div className={`mt-3 p-3 rounded-xl border text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
            lastNotificationStatus.success
              ? 'bg-[#E8F4D9] border-[#8CBE5D] text-[#233416]'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#567B34] shrink-0" />
              <span>
                <strong>{lastNotificationStatus.timestamp} :</strong> {lastNotificationStatus.message}
              </span>
            </div>
            {lastNotificationStatus.method && (
              <span className="text-[10px] font-mono bg-white/70 px-2 py-0.5 rounded border border-[#8CBE5D]/30 shrink-0 hidden sm:inline">
                {lastNotificationStatus.method}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Agronomic Technical Advisory Card */}
      <div className="pt-6">
        <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC9] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DEC9]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#567B34]" />
              <h4 className="font-serif text-base font-bold text-[#18230F]">
                Protocole de Récolte Recommandé · {currentProfile.name}
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-[#B47A16] bg-[#FEF5DB] px-2.5 py-1 rounded-lg border border-[#E6AB3C]/40">
              Polyphénols cibles : {currentProfile.polyphenolLevel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-[#18230F] block">
                💡 Conseil de l'agronome ADOIO :
              </span>
              <p className="text-[#436229] leading-relaxed bg-white p-3.5 rounded-xl border border-[#E6DEC9]">
                {currentProfile.advisoryTip}
              </p>
              <div className="text-[11px] text-[#567B34] font-medium flex items-center gap-1.5 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#E6AB3C]" />
                <span>Règle d'or de la Soummam : Moins de 24 heures entre l'arbre et le moulin.</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-[#18230F] block">
                🛡️ Mesures d'urgence & Bonnes Pratiques en verger :
              </span>
              <ul className="space-y-1.5">
                {currentProfile.emergencyActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-[#E6DEC9] text-[#242A20]">
                    <span className="w-5 h-5 rounded-full bg-[#E8F4D9] text-[#31491E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
