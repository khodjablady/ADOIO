import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle2,
  MapPin,
  Sparkles,
  Calendar,
  Thermometer,
  Droplets,
  Plus,
  Trash2,
  X,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import {
  BEJAIA_REGIONAL_BASINS,
  evaluateRegionalHarvestWindow,
  loadRegionalVarietySubscriptions,
  saveRegionalVarietySubscriptions,
  dispatchRegionalHarvestNotification,
  VarietyAlertSubscription,
  BrowserNotificationDispatchResult
} from '../utils/harvestNotificationService';
import { OLIVE_VARIETIES } from '../data/bejaiaOliveData';

interface RegionalHarvestNotificationBannerProps {
  selectedVarietyId: string;
  onSelectVarietyId?: (varietyId: string) => void;
}

export const RegionalHarvestNotificationBanner: React.FC<
  RegionalHarvestNotificationBannerProps
> = ({ selectedVarietyId, onSelectVarietyId }) => {
  const [selectedBasinId, setSelectedBasinId] = useState<string>('seddouk');
  const [subscriptions, setSubscriptions] = useState<VarietyAlertSubscription[]>(() =>
    loadRegionalVarietySubscriptions()
  );
  const [permissionState, setPermissionState] = useState<
    NotificationPermission | 'unsupported'
  >(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  });
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [activeToast, setActiveToast] =
    useState<BrowserNotificationDispatchResult | null>(null);

  // Persist subscriptions whenever updated
  useEffect(() => {
    saveRegionalVarietySubscriptions(subscriptions);
  }, [subscriptions]);

  // Evaluate current selected variety + regional basin
  const currentEval = useMemo(
    () => evaluateRegionalHarvestWindow(selectedVarietyId, selectedBasinId),
    [selectedVarietyId, selectedBasinId]
  );

  // Evaluate all saved subscriptions against regional data
  const evaluatedSubscriptions = useMemo(() => {
    return subscriptions.map((sub) => ({
      subscription: sub,
      evaluation: evaluateRegionalHarvestWindow(sub.varietyId, sub.basinId),
    }));
  }, [subscriptions]);

  const isCurrentPairSubscribed = useMemo(() => {
    return subscriptions.some(
      (s) =>
        s.varietyId === selectedVarietyId &&
        s.basinId === selectedBasinId &&
        s.enabled
    );
  }, [subscriptions, selectedVarietyId, selectedBasinId]);

  const handleTriggerNotification = async (
    evalTarget = currentEval
  ) => {
    setIsDispatching(true);
    try {
      const result = await dispatchRegionalHarvestNotification(evalTarget);
      setPermissionState(result.permissionState);
      setActiveToast(result);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleSubscribeCurrentPair = async () => {
    const existingIndex = subscriptions.findIndex(
      (s) => s.varietyId === selectedVarietyId && s.basinId === selectedBasinId
    );

    if (existingIndex >= 0) {
      const updated = subscriptions.map((item, idx) =>
        idx === existingIndex ? { ...item, enabled: !item.enabled } : item
      );
      setSubscriptions(updated);
      if (!subscriptions[existingIndex].enabled) {
        await handleTriggerNotification(currentEval);
      }
      return;
    }

    const newSub: VarietyAlertSubscription = {
      id: `alert-${selectedVarietyId}-${selectedBasinId}-${Date.now()}`,
      varietyId: selectedVarietyId,
      varietyName: currentEval.varietyName,
      basinId: selectedBasinId,
      communeName: currentEval.basin.commune,
      enabled: true,
      notifyOnImminent: true,
      createdAt: new Date().toISOString(),
      lastNotifiedAt: new Date().toISOString(),
    };

    setSubscriptions((prev) => [newSub, ...prev]);
    await handleTriggerNotification(currentEval);
  };

  const handleRemoveSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleToggleSubscription = async (sub: VarietyAlertSubscription) => {
    const nextEnabled = !sub.enabled;
    setSubscriptions((prev) =>
      prev.map((item) =>
        item.id === sub.id ? { ...item, enabled: nextEnabled } : item
      )
    );
    if (nextEnabled) {
      const ev = evaluateRegionalHarvestWindow(sub.varietyId, sub.basinId);
      await handleTriggerNotification(ev);
    }
  };

  const thermalShiftText =
    currentEval.basin.thermalShiftDays === 0
      ? 'Référence thermique moyenne (0 j)'
      : currentEval.basin.thermalShiftDays < 0
      ? `Maturation avancée de ${Math.abs(currentEval.basin.thermalShiftDays)} jours (Bassin précoce)`
      : `Maturation décalée de +${currentEval.basin.thermalShiftDays} jours (Altitude)`;

  return (
    <div
      id="alertes-fenetre-recolte-variete"
      className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-sm mb-12 space-y-6 relative"
    >
      {/* Floating Browser Notification Toast (Guaranteed visibility in preview & desktop/mobile) */}
      {activeToast && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] bg-[#18230F] text-[#FAF7F2] rounded-2xl border border-[#8CBE5D] shadow-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#E6AB3C]">
              <BellRing className="w-4 h-4 text-[#8CBE5D] animate-bounce shrink-0" />
              <span>Notification Navigateur · ADOIO Béjaïa ({activeToast.timestamp})</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveToast(null)}
              aria-label="Fermer la notification"
              className="p-1 rounded-lg text-[#D4E8BF] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="font-serif text-base font-bold text-white mt-2">
            {activeToast.headline}
          </h4>
          <p className="text-xs text-[#E8F4D9]/90 leading-relaxed mt-1.5">
            {activeToast.body}
          </p>

          <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-[#8CBE5D] font-semibold">
              {activeToast.methodLabel}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveToast(null);
                  const dirEl = document.getElementById('annuaire');
                  if (dirEl) dirEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg bg-[#31491E] hover:bg-[#436229] text-white font-bold transition-colors cursor-pointer"
              >
                Trouver un moulin →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E6DEC9]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1">
            <BellRing className="w-4 h-4 text-[#E6AB3C]" />
            <span>Alertes Navigateur & Phénologie Régionale · Wilaya de Béjaïa</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
            Notification de Fenêtre Optimale de Récolte par Variété & Commune
          </h3>
          <p className="text-xs sm:text-sm text-[#436229] mt-1 max-w-3xl leading-relaxed">
            Recevez une alerte navigateur dès que votre variété d’olives (Chemlal, Azeradj, Bouchouk, Limli, Aberkane) entre dans sa fenêtre optimale de véraison selon l’altitude et les relevés agro-climatiques de votre commune.
          </p>
        </div>

        {/* Browser Permission Status Pill */}
        <div className="flex items-center gap-2.5 bg-[#FAF7F2] px-4 py-2.5 rounded-2xl border border-[#E6DEC9] self-start lg:self-auto shrink-0">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              permissionState === 'granted'
                ? 'bg-[#567B34]'
                : permissionState === 'denied'
                ? 'bg-[#AF4D24]'
                : 'bg-[#E6AB3C]'
            }`}
          />
          <div className="text-xs">
            <span className="font-bold text-[#18230F] block">
              {permissionState === 'granted'
                ? 'Notifications Navigateur Autorisées'
                : permissionState === 'denied'
                ? 'Mode Alerte Intégrée Actif'
                : 'Notifications Navigateur Prêtes'}
            </span>
            <span className="text-[11px] text-[#567B34] tabular-nums">
              {subscriptions.filter((s) => s.enabled).length} alerte
              {subscriptions.filter((s) => s.enabled).length > 1 ? 's' : ''} variétale
              {subscriptions.filter((s) => s.enabled).length > 1 ? 's' : ''} surveillée
              {subscriptions.filter((s) => s.enabled).length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Selector Row: Variety + Regional Basin */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Variety Selector */}
        <div className="md:col-span-4 space-y-1.5">
          <label
            htmlFor="harvest-notif-variety-select"
            className="text-xs font-bold text-[#18230F] flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E6AB3C]" />
            <span>1. Votre variété d'olives :</span>
          </label>
          <select
            id="harvest-notif-variety-select"
            value={selectedVarietyId}
            onChange={(e) => onSelectVarietyId?.(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-bold text-[#18230F] cursor-pointer"
          >
            {OLIVE_VARIETIES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.kabyleName})
              </option>
            ))}
          </select>
        </div>

        {/* Regional Basin Selector */}
        <div className="md:col-span-4 space-y-1.5">
          <label
            htmlFor="harvest-notif-basin-select"
            className="text-xs font-bold text-[#18230F] flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-[#567B34]" />
            <span>2. Bassin régional / Commune :</span>
          </label>
          <select
            id="harvest-notif-basin-select"
            value={selectedBasinId}
            onChange={(e) => setSelectedBasinId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-bold text-[#18230F] cursor-pointer"
          >
            {BEJAIA_REGIONAL_BASINS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.commune} — {b.altitudeLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Primary Action Buttons */}
        <div className="md:col-span-4 flex flex-wrap sm:flex-nowrap gap-2">
          <button
            type="button"
            onClick={handleSubscribeCurrentPair}
            aria-pressed={isCurrentPairSubscribed}
            className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              isCurrentPairSubscribed
                ? 'bg-[#E8F4D9] text-[#233416] border border-[#8CBE5D]'
                : 'bg-[#233416] hover:bg-[#31491E] text-white border border-[#233416] shadow-xs'
            }`}
          >
            {isCurrentPairSubscribed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#31491E] shrink-0" />
                <span>Alerte Activée</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-[#E6AB3C] shrink-0" />
                <span>Surveiller cette variété</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTriggerNotification(currentEval)}
            disabled={isDispatching}
            className="py-2.5 px-3.5 rounded-xl bg-[#FEF5DB] hover:bg-[#E6AB3C] text-[#18230F] border border-[#E6AB3C] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="Envoyer immédiatement une notification navigateur pour cette variété et commune"
          >
            <Bell className="w-3.5 h-3.5 text-[#8C5828] shrink-0" />
            <span>Tester l'alerte</span>
          </button>
        </div>
      </div>

      {/* Live Regional Evaluation Card for Selected Variety & Basin */}
      <div
        className={`p-5 rounded-2xl border transition-all space-y-4 ${
          currentEval.windowState === 'optimal_open'
            ? 'bg-gradient-to-r from-[#E8F4D9]/90 to-[#FAF7F2] border-[#8CBE5D]'
            : currentEval.windowState === 'imminent'
            ? 'bg-gradient-to-r from-[#FEF5DB]/90 to-[#FAF7F2] border-[#E6AB3C]'
            : 'bg-[#FAF7F2] border-[#E6DEC9]'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  currentEval.windowState === 'optimal_open'
                    ? 'bg-[#233416] text-white'
                    : currentEval.windowState === 'imminent'
                    ? 'bg-[#B47A16] text-white'
                    : 'bg-[#436229] text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-[#E6AB3C]" />
                <span>{currentEval.windowStatusLabel}</span>
              </span>
              <span className="text-xs font-bold text-[#31491E] tabular-nums">
                Score de maturité régionale : {currentEval.readinessScorePercent}%
              </span>
            </div>

            <h4 className="font-serif text-lg font-bold text-[#18230F] pt-1">
              {currentEval.varietyName} · Terroir de {currentEval.basin.commune} ({currentEval.basin.altitudeLabel})
            </h4>
            <p className="text-xs text-[#436229] leading-relaxed">
              {currentEval.basin.regionalNote}
            </p>
          </div>

          <div className="bg-white/90 px-4 py-3 rounded-2xl border border-[#E6DEC9] text-left md:text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] block">
              Fenêtre Régionale Calculée
            </span>
            <span className="font-serif text-base font-bold text-[#18230F] block mt-0.5">
              {currentEval.adjustedWindowDates}
            </span>
            <span className="text-[11px] font-semibold text-[#31491E] block mt-0.5">
              {thermalShiftText}
            </span>
          </div>
        </div>

        {/* 4 Regional Agronomic Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
            <span className="text-[11px] text-[#567B34] font-semibold block">
              Indice de Maturité (Jaén)
            </span>
            <span className="font-serif text-lg font-bold text-[#18230F] tabular-nums">
              IM {currentEval.observedMaturityIndex}
            </span>
            <span className="text-[10px] text-[#31491E] font-semibold block mt-0.5">
              Cible variété : {currentEval.targetMaturityRange}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
            <span className="text-[11px] text-[#567B34] font-semibold flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-[#E6AB3C]" />
              <span>Climat {currentEval.basin.commune}</span>
            </span>
            <span className="font-serif text-lg font-bold text-[#18230F] tabular-nums">
              {currentEval.basin.avgTempNovC}°C jour / {currentEval.basin.nightTempNovC}°C nuit
            </span>
            <span className="text-[10px] text-[#436229] block mt-0.5 truncate">
              {currentEval.basin.soilMoistureStatus}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
            <span className="text-[11px] text-[#567B34] font-semibold flex items-center gap-1">
              <Droplets className="w-3 h-3 text-[#31491E]" />
              <span>Rendement & Acidité</span>
            </span>
            <span className="font-serif text-lg font-bold text-[#18230F] tabular-nums">
              {currentEval.expectedOilYieldLitersQx}
            </span>
            <span className="text-[10px] text-[#31491E] font-semibold block mt-0.5 tabular-nums">
              Acidité visée ≤ {currentEval.expectedMaxAcidityPercent}% (HOVE)
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
            <span className="text-[11px] text-[#567B34] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#567B34]" />
              <span>Polyphénols Estimés</span>
            </span>
            <span className="font-serif text-lg font-bold text-[#18230F] tabular-nums">
              ~{currentEval.expectedPolyphenolsMgKg} mg/kg
            </span>
            <span className="text-[10px] text-[#436229] block mt-0.5">
              Stabilité oxydative maximale
            </span>
          </div>
        </div>

        {/* Recommended Field Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E6DEC9]/80 text-xs">
          <div className="flex items-start sm:items-center gap-2 text-[#233416]">
            <Calendar className="w-4 h-4 text-[#31491E] shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Consigne agronomique :</strong> {currentEval.recommendedAction}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const simEl = document.getElementById('alertes-recolte-optimale');
              if (simEl) {
                simEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-xs font-bold text-[#31491E] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>Diagnostic météo détaillé</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subscribed Variety Alerts List */}
      {evaluatedSubscriptions.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#31491E]">
              Vos Alertes Variétales Régionales Enregistrées ({evaluatedSubscriptions.length})
            </h4>
            <span className="text-[11px] text-[#567B34]">
              Cliquez sur « Notifier » pour recevoir le bulletin de récolte sur votre navigateur
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {evaluatedSubscriptions.map(({ subscription, evaluation }) => {
              const isOptimal = evaluation.windowState === 'optimal_open';
              return (
                <div
                  key={subscription.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                    subscription.enabled
                      ? isOptimal
                        ? 'bg-[#E8F4D9]/50 border-[#8CBE5D]'
                        : 'bg-[#FAF7F2] border-[#E6DEC9]'
                      : 'bg-gray-50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          !subscription.enabled
                            ? 'bg-gray-400'
                            : isOptimal
                            ? 'bg-[#31491E]'
                            : 'bg-[#E6AB3C]'
                        }`}
                      />
                      <p className="text-xs font-bold text-[#18230F] truncate">
                        {evaluation.varietyName} · {evaluation.basin.commune}
                      </p>
                    </div>
                    <p className="text-[11px] text-[#436229] truncate tabular-nums">
                      {evaluation.windowStatusLabel} · Fenêtre : {evaluation.adjustedWindowDates}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTriggerNotification(evaluation)}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title={`Envoyer l'alerte navigateur pour ${evaluation.varietyName} à ${evaluation.basin.commune}`}
                    >
                      <BellRing className="w-3 h-3 text-[#31491E]" />
                      <span>Notifier</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSubscription(subscription)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                        subscription.enabled
                          ? 'bg-[#233416] text-white border-[#233416]'
                          : 'bg-white text-[#567B34] border-[#E6DEC9]'
                      }`}
                    >
                      {subscription.enabled ? 'Actif' : 'Pause'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubscription(subscription.id)}
                      aria-label={`Supprimer l'alerte ${evaluation.varietyName} à ${evaluation.basin.commune}`}
                      className="p-1.5 rounded-xl text-[#AF4D24] hover:bg-[#AF4D24]/10 transition-colors cursor-pointer"
                      title="Supprimer cette alerte"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
