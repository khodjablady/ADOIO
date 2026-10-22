import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  BellOff,
  ShieldAlert,
  AlertTriangle,
  Snowflake,
  Wind,
  CloudRain,
  Flame,
  CheckCircle2,
  Settings,
  Sparkles,
  Smartphone,
  Volume2,
  X,
  Info,
  Trash2,
  Send,
  Sliders,
  MapPin,
  Sprout,
  Calendar,
  Radio,
} from 'lucide-react';
import {
  useWeatherAlerts,
  AlertType,
  BEJAIA_OLIVE_BASSINS,
} from '../hooks/useWeatherAlerts';

interface WeatherAlertCenterProps {
  className?: string;
  onNavigateToCalendar?: () => void;
}

export const WeatherAlertCenter: React.FC<WeatherAlertCenterProps> = ({
  className = '',
  onNavigateToCalendar,
}) => {
  const {
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
    subscribeToPush,
    unsubscribeFromPush,
    simulateAlert,
    dismissAlert,
    dismissLiveToast,
    clearAllHistory,
  } = useWeatherAlerts();

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [testingType, setTestingType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'alerts' | 'test' | 'history'>('alerts');

  const handleTestAlert = async (type: AlertType, zoneName?: string) => {
    setTestingType(type);
    await simulateAlert(type, zoneName || settings.selectedBassin);
    setTimeout(() => {
      setTestingType(null);
    }, 600);
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'harvest-start':
        return <Sprout className="w-5 h-5 text-emerald-700" />;
      case 'agronomic-period':
        return <Calendar className="w-5 h-5 text-[#567B34]" />;
      case 'frost':
        return <Snowflake className="w-5 h-5 text-cyan-600" />;
      case 'high-wind':
        return <Wind className="w-5 h-5 text-amber-600" />;
      case 'heavy-rain':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'heat-sirocco':
        return <Flame className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    }
  };

  const getAlertBg = (type: AlertType, severity: string) => {
    if (type === 'harvest-start') {
      return 'bg-emerald-50/90 border-emerald-300 text-emerald-950';
    }
    if (type === 'agronomic-period') {
      return 'bg-[#F4F9EC] border-[#8CBE5D] text-[#18230F]';
    }
    if (severity === 'critical') return 'bg-red-50/90 border-red-200 text-red-950';
    if (type === 'frost') return 'bg-cyan-50/80 border-cyan-200 text-cyan-950';
    if (type === 'high-wind') return 'bg-amber-50/80 border-amber-200 text-amber-950';
    if (type === 'heavy-rain') return 'bg-blue-50/80 border-blue-200 text-blue-950';
    return 'bg-amber-50/80 border-amber-200 text-amber-950';
  };

  const isPushSubscribed =
    pushStatus === 'subscribed' ||
    pushStatus === 'local-sw-ready' ||
    permission === 'granted';

  return (
    <div
      id="alertes-meteo"
      className={`bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-7 shadow-xs relative overflow-hidden ${className}`}
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-500/10 via-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-[#E6DEC9] relative z-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Notifications PWA · Web Push API (RFC 8030 / VAPID)</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F] flex flex-wrap items-center gap-2">
            <span>Alertes Push : Périodes Critiques, Début de Récolte & Météo Locale</span>
          </h3>
          <p className="text-xs text-[#436229] mt-1 max-w-2xl leading-relaxed">
            Abonnez-vous aux notifications Push PWA pour être alerté en temps réel de l’ouverture optimale de la récolte (véraison Chemlal, Azeradj, Limli), des risques météo locaux (gel, sirocco, vents forts) et des périodes clés du calendrier oléicole à Béjaïa.
          </p>
        </div>

        {/* Basin Selector + Push API Subscription Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto justify-between lg:justify-end">
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E6DEC9] rounded-xl px-2.5 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#567B34] shrink-0" />
            <label htmlFor="push-bassin-select" className="sr-only">
              Sélectionner votre bassin oléicole à Béjaïa
            </label>
            <select
              id="push-bassin-select"
              value={settings.selectedBassin}
              onChange={(e) => updateSettings({ selectedBassin: e.target.value })}
              className="bg-transparent text-xs font-bold text-[#18230F] focus:outline-none cursor-pointer max-w-[210px] truncate"
            >
              {BEJAIA_OLIVE_BASSINS.map((bassin) => (
                <option key={bassin} value={bassin}>
                  {bassin}
                </option>
              ))}
            </select>
          </div>

          {isPushSubscribed ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <BellRing className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  API Push Active
                  {pushSubscriptionId ? ` · #${pushSubscriptionId.slice(0, 6)}` : ''}
                </span>
              </div>
              <button
                onClick={unsubscribeFromPush}
                className="px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-red-50 text-[#436229] hover:text-red-700 border border-[#E6DEC9] text-[11px] font-semibold transition-colors cursor-pointer"
                title="Désactiver l'abonnement Push sur cet appareil"
              >
                Désabonner
              </button>
            </div>
          ) : permission === 'denied' ? (
            <button
              onClick={subscribeToPush}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold cursor-pointer"
              title="Activer le mode Push local via Service Worker"
            >
              <BellOff className="w-3.5 h-3.5 text-amber-700" />
              <span>Activer Relais Push PWA</span>
            </button>
          ) : (
            <button
              onClick={subscribeToPush}
              disabled={isSubscribing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#233416] hover:bg-[#31491E] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
            >
              <Bell className="w-3.5 h-3.5 text-[#E6AB3C]" />
              <span>
                {isSubscribing ? 'Connexion API Push...' : 'Activer les Notifications Push'}
              </span>
            </button>
          )}

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              showSettings
                ? 'bg-[#233416] text-[#FAF7F2] border-[#233416]'
                : 'bg-[#FAF7F2] text-[#436229] border-[#E6DEC9] hover:bg-white'
            }`}
            title="Paramètres des canaux Push et seuils météo"
            aria-label="Configurer les canaux de notification Push"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Push Notification Toast Preview (Displays immediately when a Push is triggered) */}
      {liveToastAlert && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 p-4 rounded-2xl bg-[#18230F] text-[#FAF7F2] border border-[#8CBE5D] shadow-md flex items-start justify-between gap-3 animate-fadeIn"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#233416] border border-[#8CBE5D]/50 flex items-center justify-center shrink-0 mt-0.5">
              <BellRing className="w-5 h-5 text-[#E6AB3C] animate-bounce" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#B0D984]">
                <span>Notification Push PWA Transmise en Direct</span>
                <span>·</span>
                <span>{liveToastAlert.pushProtocol || 'Service Worker Push API'}</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-white mt-0.5">
                {liveToastAlert.title}
              </h4>
              <p className="text-xs text-[#E8F4D9]/90 mt-1 leading-relaxed">
                <strong className="text-[#E6AB3C]">{liveToastAlert.metric}</strong> —{' '}
                {liveToastAlert.message}
              </p>
              {liveToastAlert.recommendations[0] && (
                <p className="text-[11px] text-[#B0D984] mt-1.5 font-medium">
                  👉 Action prioritaire : {liveToastAlert.recommendations[0]}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={dismissLiveToast}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#E8F4D9] cursor-pointer shrink-0"
            aria-label="Fermer l'aperçu de notification Push"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Subscription callout banner if not yet subscribed */}
      {!isPushSubscribed && (
        <div className="mt-4 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-800 mt-0.5">
              <Bell className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Recevez les alertes « Début de récolte » et « Météo locale » sur votre mobile ou PC
              </h4>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                Le Service Worker PWA utilise l’API Push (<code className="font-mono text-[11px]">PushManager</code>) pour notifier les oléiculteurs de Béjaïa dès que la véraison optimale est atteinte ou qu’un gel printanier / coup de sirocco menace le verger.
              </p>
              {lastNotificationStatus && (
                <p className="text-[11px] font-semibold text-amber-950 mt-1">
                  Statut : {lastNotificationStatus}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={subscribeToPush}
            disabled={isSubscribing}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-[#233416] hover:bg-[#31491E] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-2"
          >
            <BellRing className="w-4 h-4 text-[#E6AB3C]" />
            <span>S'abonner via l'API Push</span>
          </button>
        </div>
      )}

      {isPushSubscribed && lastNotificationStatus && (
        <div className="mt-3 flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs text-[#233416]">
          <span className="font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{lastNotificationStatus}</span>
          </span>
          <span className="text-[11px] text-[#567B34] hidden sm:inline">
            Bassin : <strong>{settings.selectedBassin}</strong>
          </span>
        </div>
      )}

      {/* Channels & Threshold settings drawer */}
      {showSettings && (
        <div className="mt-4 p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] animate-fadeIn">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E6DEC9]">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#567B34]" />
              <h4 className="text-xs font-bold text-[#18230F] uppercase tracking-wider">
                Canaux d’Abonnement Push & Seuils de Vigilance Agronomique
              </h4>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="p-1 rounded-lg hover:bg-[#E6DEC9]/40 text-[#436229] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {/* 1. Harvest Start & Ripeness Channel */}
            <div className="p-3.5 bg-white rounded-xl border border-emerald-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span>Début de Récolte & Véraison</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.notifyOnHarvestStart}
                  onChange={(e) =>
                    updateSettings({ notifyOnHarvestStart: e.target.checked })
                  }
                  className="rounded text-[#233416] cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-[#436229] leading-snug">
                Alerte dès l’ouverture optimale de la cueillette par variété (Azeradj, Limli, Chemlal) et par altitude.
              </p>
            </div>

            {/* 2. Critical Agronomic & Phytosanitary Periods */}
            <div className="p-3.5 bg-white rounded-xl border border-[#8CBE5D]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#567B34]" />
                  <span>Périodes Taille & Vigilance Bio</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.notifyOnAgronomicPeriod}
                  onChange={(e) =>
                    updateSettings({ notifyOnAgronomicPeriod: e.target.checked })
                  }
                  className="rounded text-[#233416] cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-[#436229] leading-snug">
                Fenêtre de taille de fructification (fév-mars), pic de vol Mouche de l’olive (argile kaolinite) et Œil de paon.
              </p>
            </div>

            {/* 3. Frost toggle & threshold */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E6DEC9]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                  <Snowflake className="w-4 h-4 text-cyan-600" />
                  <span>Alerte Gel Nocturne / Printanier</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.notifyOnFrost}
                  onChange={(e) => updateSettings({ notifyOnFrost: e.target.checked })}
                  className="rounded text-[#233416] cursor-pointer"
                />
              </div>
              <select
                value={settings.frostThreshold}
                onChange={(e) =>
                  updateSettings({ frostThreshold: Number(e.target.value) })
                }
                aria-label="Seuil de température pour l'alerte gel"
                className="w-full mt-1 px-2 py-1 bg-[#FAF7F2] border border-[#E6DEC9] rounded-lg font-semibold text-[#18230F] text-xs cursor-pointer"
              >
                <option value={0}>≤ 0°C (Gelée sévère)</option>
                <option value={1}>≤ 1°C (Gel modéré)</option>
                <option value={2}>≤ 2°C (Gelée blanche / Défaut)</option>
                <option value={3}>≤ 3°C (Vigilance précoce)</option>
              </select>
            </div>

            {/* 4. Wind toggle & threshold */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E6DEC9]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-amber-600" />
                  <span>Vents Violents (Soummam)</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.notifyOnWind}
                  onChange={(e) => updateSettings({ notifyOnWind: e.target.checked })}
                  className="rounded text-[#233416] cursor-pointer"
                />
              </div>
              <select
                value={settings.windThreshold}
                onChange={(e) =>
                  updateSettings({ windThreshold: Number(e.target.value) })
                }
                aria-label="Seuil de vitesse du vent"
                className="w-full mt-1 px-2 py-1 bg-[#FAF7F2] border border-[#E6DEC9] rounded-lg font-semibold text-[#18230F] text-xs cursor-pointer"
              >
                <option value={35}>≥ 35 km/h (Vent soutenu)</option>
                <option value={45}>≥ 45 km/h (Seuil filets Soummam)</option>
                <option value={55}>≥ 55 km/h (Bourrasques critiques)</option>
              </select>
            </div>

            {/* 5. Rain toggle & threshold */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E6DEC9]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-blue-600" />
                  <span>Pluies Fortes (Arrêt cueillette)</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.notifyOnRain}
                  onChange={(e) => updateSettings({ notifyOnRain: e.target.checked })}
                  className="rounded text-[#233416] cursor-pointer"
                />
              </div>
              <select
                value={settings.rainThreshold}
                onChange={(e) =>
                  updateSettings({ rainThreshold: Number(e.target.value) })
                }
                aria-label="Seuil de cumul de pluie"
                className="w-full mt-1 px-2 py-1 bg-[#FAF7F2] border border-[#E6DEC9] rounded-lg font-semibold text-[#18230F] text-xs cursor-pointer"
              >
                <option value={10}>≥ 10 mm (Humidification)</option>
                <option value={15}>≥ 15 mm (Arrêt récolte)</option>
                <option value={25}>≥ 25 mm (Torrentiel / Ravinement)</option>
              </select>
            </div>

            {/* 6. Sirocco toggle */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E6DEC9]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-[#18230F] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-600" />
                  <span>Sirocco / Iryifi (&gt; 36°C)</span>
                </span>
                <input
                  type="checkbox"
                  checked={settings.notifyOnSirocco}
                  onChange={(e) => updateSettings({ notifyOnSirocco: e.target.checked })}
                  className="rounded text-[#233416] cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-[#436229] leading-snug">
                Vigilance stress hydrique aigu et protection de la floraison/nouaison (Humidité &lt; 25%).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs navigation: Active Alerts, Test Simulators, History */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-5 border-b border-[#E6DEC9] pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'bg-[#233416] text-[#FAF7F2]'
                : 'text-[#436229] hover:bg-[#FAF7F2]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Périodes Critiques & Vigilances ({activeAlerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'test'
                ? 'bg-[#233416] text-[#FAF7F2]'
                : 'text-[#436229] hover:bg-[#FAF7F2]'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-[#E6AB3C]" />
            <span>Tester l’API Push (6 Scénarios)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#233416] text-[#FAF7F2]'
                : 'text-[#436229] hover:bg-[#FAF7F2]'
            }`}
          >
            <span>Journal Push ({alertHistory.length})</span>
          </button>
        </div>

        {activeTab === 'history' && alertHistory.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Effacer l'historique</span>
          </button>
        )}
      </div>

      {/* Tab 1: Active Alerts list */}
      {activeTab === 'alerts' && (
        <div className="mt-4 space-y-3">
          {activeAlerts.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] text-center">
              <div className="w-12 h-12 rounded-full bg-[#E8F4D9] text-[#233416] flex items-center justify-center mx-auto mb-2 border border-[#8CBE5D]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-base font-bold text-[#18230F]">
                Aucune alerte non lue pour {settings.selectedBassin}
              </h4>
              <p className="text-xs text-[#436229] max-w-md mx-auto mt-1">
                Testez dès maintenant l’envoi d’une notification Push « Début de récolte » ou « Alerte Gel » pour vérifier la réception sur votre appareil.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handleTestAlert('harvest-start', settings.selectedBassin)}
                  className="px-4 py-2 rounded-xl bg-[#233416] hover:bg-[#31491E] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sprout className="w-3.5 h-3.5 text-[#B0D984]" />
                  <span>Recevoir Push « Début de Récolte »</span>
                </button>
                <button
                  onClick={() => setActiveTab('test')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#E6DEC9] text-[#233416] text-xs font-bold hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                >
                  Voir les 6 scénarios Push
                </button>
              </div>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${getAlertBg(
                  alert.type,
                  alert.severity
                )}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0 border border-current/20">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-sm sm:text-base">
                          {alert.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/90 text-xs font-extrabold uppercase tracking-wider border border-current/20">
                          {alert.metric}
                        </span>
                        {alert.isSimulated && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-200 text-amber-900 font-semibold">
                            Push Test
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs opacity-90 mb-2">
                        <span className="flex items-center gap-1 font-semibold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{alert.zone}</span>
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(alert.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {alert.pushProtocol && (
                          <>
                            <span>•</span>
                            <span className="font-medium opacity-80">
                              {alert.pushProtocol}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-xs mb-3 font-medium leading-relaxed">
                        {alert.message}
                      </p>

                      {/* Agronomic Recommendations for Farmers */}
                      <div className="bg-white/85 backdrop-blur-xs p-3.5 rounded-xl border border-current/20">
                        <div className="text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Consignes agronomiques ADOIO aux oléiculteurs :</span>
                        </div>
                        <ul className="space-y-1.5 text-xs">
                          {alert.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 mt-1.5 opacity-70" />
                              <span className="leading-snug">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer shrink-0"
                    title="Masquer cette alerte"
                    aria-label="Fermer l'alerte"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: 6 Test & Simulators for Farmers (Harvest Start + Agronomic Period + 4 Weather Alerts) */}
      {activeTab === 'test' && (
        <div className="mt-4 space-y-4">
          <div className="p-4 rounded-2xl bg-[#F4F9EC] border border-[#8CBE5D] text-xs text-[#18230F] flex items-start gap-3">
            <Info className="w-5 h-5 text-[#567B34] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">
                Simulateur d’Événements Web Push API (<code className="font-mono">sw-push.js</code> + <code className="font-mono">/api/push/dispatch-alert</code>) :
              </span>
              <p className="mt-0.5 leading-relaxed text-[#233416]">
                Déclenchez l’un des 6 scénarios critiques ci-dessous (ouverture de la récolte à la véraison, période de taille/mouche de l’olive, gelée blanche, rafales, pluies torrentielles ou sirocco) pour recevoir instantanément la notification PWA.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Scenario 1: Harvest Start (Début de Récolte Optimale) */}
            <div className="p-4 rounded-2xl bg-white border-2 border-emerald-300 hover:border-emerald-500 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    Début de Récolte
                  </span>
                </div>
                <h5 className="font-bold text-sm text-[#18230F]">
                  Ouverture Récolte & Véraison (Chemlal / Azeradj)
                </h5>
                <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                  Alerte Push d’entrée en maturité optimale (65% tournante violet-noir) avec pic de polyphénols et consignes de trituration à froid &lt; 24h.
                </p>
              </div>
              <button
                onClick={() => handleTestAlert('harvest-start', settings.selectedBassin)}
                disabled={testingType === 'harvest-start'}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sprout className="w-3.5 h-3.5" />
                <span>
                  {testingType === 'harvest-start'
                    ? 'Envoi Push en cours...'
                    : 'Déclencher Push Début Récolte'}
                </span>
              </button>
            </div>

            {/* Scenario 2: Critical Agronomic & Phytosanitary Period */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#8CBE5D] hover:border-[#567B34] transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E8F4D9] text-[#233416] flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E8F4D9] text-[#233416]">
                    Calendrier & Bio
                  </span>
                </div>
                <h5 className="font-bold text-sm text-[#18230F]">
                  Période Critique : Mouche de l’Olive & Taille
                </h5>
                <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                  Rappel Push pour la barrière d’argile kaolinite bio (juin-sept) ou l’ouverture de la taille de fructification (fév-mars) avec prophylaxie.
                </p>
              </div>
              <button
                onClick={() =>
                  handleTestAlert('agronomic-period', settings.selectedBassin)
                }
                disabled={testingType === 'agronomic-period'}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-[#233416] hover:bg-[#31491E] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E6AB3C]" />
                <span>
                  {testingType === 'agronomic-period'
                    ? 'Envoi Push en cours...'
                    : 'Déclencher Push Calendrier Bio'}
                </span>
              </button>
            </div>

            {/* Scenario 3: Frost */}
            <div className="p-4 rounded-2xl bg-white border border-[#E6DEC9] hover:border-cyan-400 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                    <Snowflake className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-100 text-cyan-800">
                    Gelée Nocturne
                  </span>
                </div>
                <h5 className="font-bold text-sm text-[#18230F]">
                  Risque de Gel à Seddouk (-0.5°C)
                </h5>
                <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                  Alerte gelée blanche sur les hauts plateaux de Seddouk et Beni Maouche. Risque d’éclatement cellulaire des drupes et oxydation.
                </p>
              </div>
              <button
                onClick={() => handleTestAlert('frost', 'Hauts Plateaux de Seddouk')}
                disabled={testingType === 'frost'}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Snowflake className="w-3.5 h-3.5" />
                <span>
                  {testingType === 'frost' ? 'Envoi en cours...' : 'Déclencher Push Gel'}
                </span>
              </button>
            </div>

            {/* Scenario 4: High wind */}
            <div className="p-4 rounded-2xl bg-white border border-[#E6DEC9] hover:border-amber-400 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Wind className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    Vents 52 km/h
                  </span>
                </div>
                <h5 className="font-bold text-sm text-[#18230F]">
                  Rafales Bassin d’Akbou
                </h5>
                <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                  Vents violents dans le couloir de la Soummam. Risque d’envol des filets de récolte et chute massive des olives au sol.
                </p>
              </div>
              <button
                onClick={() =>
                  handleTestAlert('high-wind', 'Vallée de la Soummam · Akbou')
                }
                disabled={testingType === 'high-wind'}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Wind className="w-3.5 h-3.5" />
                <span>
                  {testingType === 'high-wind'
                    ? 'Envoi en cours...'
                    : 'Déclencher Push Vents'}
                </span>
              </button>
            </div>

            {/* Scenario 5: Heavy rain */}
            <div className="p-4 rounded-2xl bg-white border border-[#E6DEC9] hover:border-blue-400 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <CloudRain className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Pluie 22 mm
                  </span>
                </div>
                <h5 className="font-bold text-sm text-[#18230F]">
                  Pluies Torrentielles Chemini
                </h5>
                <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                  Averses abondantes sur les terrasses du Djurdjura. Consigne d’arrêt immédiat de la cueillette et pressage d’urgence sous 24h.
                </p>
              </div>
              <button
                onClick={() => handleTestAlert('heavy-rain', 'Terrasses de Chemini')}
                disabled={testingType === 'heavy-rain'}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>
                  {testingType === 'heavy-rain'
                    ? 'Envoi en cours...'
                    : 'Déclencher Push Pluie'}
                </span>
              </button>
            </div>

            {/* Scenario 6: Heat / Sirocco */}
            <div className="p-4 rounded-2xl bg-white border border-[#E6DEC9] hover:border-red-400 transition-all shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">
                    Sirocco 37°C
                  </span>
                </div>
                <h5 className="font-bold text-sm text-[#18230F]">
                  Sirocco Desséchant Tazmalt
                </h5>
                <p className="text-xs text-[#436229] mt-1 leading-relaxed">
                  Vent sec et brûlant (Iryifi) avec humidité &lt; 20%. Risque de dessiccation prématurée de la pulpe et stress hydrique.
                </p>
              </div>
              <button
                onClick={() =>
                  handleTestAlert('heat-sirocco', 'Tazmalt & Oued Soummam')
                }
                disabled={testingType === 'heat-sirocco'}
                className="mt-4 w-full py-2 px-3 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>
                  {testingType === 'heat-sirocco'
                    ? 'Envoi en cours...'
                    : 'Déclencher Push Sirocco'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="mt-4 space-y-2">
          {alertHistory.length === 0 ? (
            <div className="p-5 text-center text-xs text-[#436229] bg-[#FAF7F2] rounded-xl border border-[#E6DEC9]">
              Aucun historique d'alerte Push enregistré pour le moment.
            </div>
          ) : (
            alertHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E6DEC9] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {getAlertIcon(item.type)}
                  <div>
                    <div className="font-bold text-[#18230F]">{item.title}</div>
                    <div className="text-[11px] text-[#567B34]">
                      {item.zone} · {item.metric} ·{' '}
                      {new Date(item.timestamp).toLocaleString('fr-FR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    simulateAlert(item.type, item.zone);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E6DEC9] text-[#233416] hover:bg-[#E8F4D9] transition-colors font-semibold text-[11px] shrink-0 cursor-pointer"
                >
                  Renvoyer Push
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer agronomic notes */}
      <div className="mt-6 pt-4 border-t border-[#E6DEC9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-[#436229]">
        <div className="flex items-center gap-2">
          <Smartphone className="w-3.5 h-3.5 text-[#567B34]" />
          <span>
            Compatible Web Push API (Android, Chrome, Edge, Firefox, Safari iOS 16.4+ sur écran d’accueil PWA).
          </span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <Volume2 className="w-3.5 h-3.5 text-[#E6AB3C]" />
          <span>
            Notification système + aperçu temps réel intégré au portail ADOIO.
          </span>
        </div>
      </div>
    </div>
  );
};
