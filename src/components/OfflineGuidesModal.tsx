import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  WifiOff,
  Wifi,
  HardDriveDownload,
  CheckCircle2,
  Star,
  Trash2,
  RefreshCw,
  BookOpen,
  Droplets,
  Stethoscope,
  Calendar,
  Building2,
  Award,
  Recycle,
  Calculator,
  HelpCircle,
  ExternalLink,
  X,
  Database,
  Eye,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  OLIVE_VARIETIES,
  REPRESENTATIVE_MILLS,
  TASTING_GUIDE,
} from '../data/bejaiaOliveData';

export const PRIORITY_GUIDES_CACHE_NAME = 'adoio-priority-guides-v1';
const PRIORITY_SELECTION_STORAGE_KEY = 'adoio_offline_priority_section_ids_v1';

export interface OfflineTechnicalGuide {
  id: string;
  sectionId: string;
  title: string;
  category: string;
  defaultPriority: boolean;
  estimatedSizeKb: number;
  summary: string;
  fieldUseCase: string;
  keyTakeaways: string[];
  preloadChunk: () => Promise<unknown>;
  buildOfflinePayload: () => Record<string, unknown>;
}

export const OFFLINE_TECHNICAL_GUIDES: OfflineTechnicalGuide[] = [
  {
    id: 'guide-varietes-kabylie',
    sectionId: 'varietes',
    title: 'Guide des Variétés Autochtones & Comparateur',
    category: 'Génétique & Verger',
    defaultPriority: true,
    estimatedSizeKb: 28,
    summary:
      'Fiches complètes des cultivars de Béjaïa (Chemlal, Bouchouk, Azeradj, Limli, Aberkane), rendements en huile, fenêtres de récolte et résistance.',
    fieldUseCase: 'Identification parcellaire au verger et choix de la période optimale de gaulage/cueillette.',
    keyTakeaways: [
      'Chemlal de Kabylie (40% du verger) : 16 à 20 L/qx, récolte nov.–janv., forte richesse en polyphénols.',
      'Azeradj / Adjeraz (25% du verger) : 20 à 25 L/qx, double aptitude table & huile, récolte précoce oct.–nov.',
      'Limli (15% du verger) : 18 à 22 L/qx, idéale en huile primeur fruité vert (bassin de Seddouk / Soummam).',
      'Bouchouk El Ghalia : gros calibre (20 à 25 L/qx), arômes d’artichaut et pomme verte.',
      'Aberkane : variété rustique d’altitude (Babors / Djurdjura), huile douce et veloutée.',
    ],
    preloadChunk: () => import('./VarietiesGuide'),
    buildOfflinePayload: () => ({
      varieties: OLIVE_VARIETIES,
    }),
  },
  {
    id: 'guide-diagnostic-bio',
    sectionId: 'diagnostic-phytosanitaire',
    title: 'Diagnostic Phytosanitaire & Traitements Bio',
    category: 'Santé du Verger',
    defaultPriority: true,
    estimatedSizeKb: 34,
    summary:
      'Protocole de reconnaissance terrain (Mouche de l’olive Dacus oleae, Œil de paon, Psylle, Teigne, Neiroun) et solutions biologiques homologuées.',
    fieldUseCase: 'Inspection visuelle des feuilles et drupes en zone montagneuse sans couverture mobile.',
    keyTakeaways: [
      'Mouche de l’olive (Bactrocera oleae) : piégeage massif (phosphate diammonique) dès juin + argile kaolinite blanche.',
      'Œil de paon (Fusicladium oleagineum) : taille d’aération de la frondaison + bouillie bordelaise après récolte.',
      'Psylle de l’olivier (Euphyllura olivina) : amas cotonneux au printemps, favoriser la faune auxiliaire (punaises anthocorides).',
      'Scolyte / Neiroun : éliminer et brûler immédiatement les bois de taille dépérissants hors de la parcelle.',
    ],
    preloadChunk: () => import('./PhytosanitaryDiagnosis'),
    buildOfflinePayload: () => ({
      emergencyProtocol: 'Surveillance hebdomadaire des pièges et pulvérisation préventive à base de kaolinite.',
    }),
  },
  {
    id: 'guide-calendrier-pratiques',
    sectionId: 'pratiques',
    title: 'Calendrier Agronomique & Taille de Fructification',
    category: 'Conduite Culturales',
    defaultPriority: true,
    estimatedSizeKb: 26,
    summary:
      'Travaux mois par mois en Kabylie, règles d’or de la taille annuelle d’éclairement et bonnes pratiques de récolte au filet.',
    fieldUseCase: 'Planification des chantiers de taille (février–avril) et de cueillette (novembre–janvier).',
    keyTakeaways: [
      'Taille (février–mars) : ouvrir le centre de l’arbre en gobelet (« laisser passer l’hirondelle ») pour la lumière.',
      'Récolte à la véraison (olive tournante violet-noir) : indice de maturité optimal pour maximiser les antioxydants.',
      'Proscrire les sacs en plastique fermés : transport exclusif en caisses plastiques ajourées (palox).',
      'Délai cueillette -> trituration : moins de 24h à 48h pour éviter toute fermentation anaérobie (chômé).',
    ],
    preloadChunk: () => import('./CalendarAndPractices'),
    buildOfflinePayload: () => ({
      goldenRules: [
        'Cueillette manuelle au peigne sur filets propres',
        'Séparation des olives tombées au sol et des olives cueillies sur l’arbre',
        'Stockage en caisses ajourées à l’ombre avant apport au moulin',
      ],
    }),
  },
  {
    id: 'guide-normes-coi-degustation',
    sectionId: 'degustation',
    title: 'Guide du Consommateur ADOIO & Normes COI',
    category: 'Qualité & Trituration',
    defaultPriority: true,
    estimatedSizeKb: 31,
    summary:
      'Critères physico-chimiques (acidité ≤ 0,8%, indice de peroxyde ≤ 20), attributs positifs (fruité, amertume, ardence) et conservation.',
    fieldUseCase: 'Contrôle qualité à la sortie du séparateur au moulin et conseils de stockage en cuve inox.',
    keyTakeaways: [
      'Vierge Extra (HOVE) : Acidité oléique libre ≤ 0,8% (objectif terroir ADOIO ≤ 0,3%), 0 défaut sensoriel.',
      'Extraction à froid : température de la pâte d’olive strictement inférieure à 27°C durant le malaxage.',
      'L’ardence (piquant en gorge) et l’amertume sont des gages de fraîcheur (oléocanthal et polyphénols).',
      'Conservation : à l’abri de la lumière (verre fumé ou inox), entre 14°C et 18°C, soutirage des lies après 1 mois.',
    ],
    preloadChunk: () => import('./TastingAndQuality'),
    buildOfflinePayload: () => ({
      tastingGuide: TASTING_GUIDE,
    }),
  },
  {
    id: 'guide-annuaire-moulins',
    sectionId: 'annuaire',
    title: 'Annuaire Technique des Huileries de Béjaïa',
    category: 'Moulins & Trituration',
    defaultPriority: true,
    estimatedSizeKb: 42,
    summary:
      'Répertoire hors-ligne des huileries de référence : téléphones directs, cadences (kg/h), lots minimums acceptés et prestations.',
    fieldUseCase: 'Contacter un moulin ou vérifier le lot minimum requis depuis une commune rurale sans réseau.',
    keyTakeaways: REPRESENTATIVE_MILLS.slice(0, 6).map(
      (m) =>
        `${m.name} (${m.commune}) — ${m.capacityQxPerDay} qx/j (lot min. ${m.technicalSpecs.minBatchKg} kg) · Tél: ${m.phone}`
    ),
    preloadChunk: () => import('./MillsDirectory'),
    buildOfflinePayload: () => ({
      mills: REPRESENTATIVE_MILLS,
    }),
  },
  {
    id: 'guide-irrigation-hydrique',
    sectionId: 'irrigation',
    title: 'Guide d’Irrigation & Stades Hydriques Critiques',
    category: 'Gestion de l’Eau',
    defaultPriority: false,
    estimatedSizeKb: 22,
    summary:
      'Pilotage de l’irrigation déficitaire contrôlée (goutte-à-goutte) selon les 3 stades phénologiques sensibles de l’olivier.',
    fieldUseCase: 'Calcul des apports d’eau d’appoint lors des épisodes de sécheresse printanière ou estivale.',
    keyTakeaways: [
      'Stade 1 (Avril–Mai, Floraison & Nouaison) : éviter tout stress hydrique sévère pour limiter la coulure des fleurs.',
      'Stade 2 (Juillet–Août, Durcissement du noyau) : tolérance élevée, irrigation modérée d’entretien.',
      'Stade 3 (Septembre–Octobre, Lipogenèse / Véraison) : apport déterminant pour le calibre du fruit et l’accumulation d’huile.',
    ],
    preloadChunk: () => import('./IrrigationGuide'),
    buildOfflinePayload: () => ({
      stages: ['Nouaison (Avril-Mai)', 'Durcissement du noyau (Juillet)', 'Lipogenèse (Septembre-Octobre)'],
    }),
  },
  {
    id: 'guide-fertilisation-organique',
    sectionId: 'fertilisation',
    title: 'Barème de Fertilisation Organique & Compost',
    category: 'Sols & Nutrition',
    defaultPriority: false,
    estimatedSizeKb: 19,
    summary:
      'Dosages d’amendements organiques (fumier décomposé, compost de grignon épuisé) selon l’âge des oliviers et la pente.',
    fieldUseCase: 'Dosage sur le terrain lors de l’épandage d’automne à l’aplomb de la couronne foliaire.',
    keyTakeaways: [
      'Jeunes plants (1 à 5 ans) : 10 à 15 kg de compost mûr par arbre en couronne superficielle.',
      'Oliviers en pleine production : 30 à 45 kg de matière organique bien humifiée par pied tous les 2 ans.',
      'Grignon d’olive : toujours composter pendant 6 à 9 mois avec brassage avant épandage au verger.',
    ],
    preloadChunk: () => import('./OrganicFertilizationCalculator'),
    buildOfflinePayload: () => ({
      dosages: { youngTreeKg: 15, matureTreeKg: 40, centenaryTreeKg: 60 },
    }),
  },
  {
    id: 'guide-valorisation-sous-produits',
    sectionId: 'sous-produits',
    title: 'Valorisation des Grignons, Margines & Biomasse',
    category: 'Économie Circulaire',
    defaultPriority: false,
    estimatedSizeKb: 24,
    summary:
      'Procédés de séparation noyau/pulpe, briquettes biocombustibles, lagunage contrôlé des margines et compostage.',
    fieldUseCase: 'Gestion éco-responsable des effluents d’huilerie durant la campagne de trituration.',
    keyTakeaways: [
      'Noyau d’olive concassé : pouvoir calorifique élevé (~4 500 kcal/kg), substitut propre au fioul.',
      'Margines : interdiction absolue de rejet direct dans les oueds (Oued Soummam) ; stockage en bassins d’évaporation étanches.',
      'Bois de taille broyé (BRF) : paillage protecteur contre l’érosion des terrasses de montagne.',
    ],
    preloadChunk: () => import('./ByproductsValorizationSection'),
    buildOfflinePayload: () => ({
      circularEconomy: true,
    }),
  },
  {
    id: 'guide-glossaire-oleicole',
    sectionId: 'glossaire-oleicole',
    title: 'Glossaire Technique Oléicole & Lexique Kabyle',
    category: 'Référentiel Métier',
    defaultPriority: false,
    estimatedSizeKb: 25,
    summary:
      'Définitions précises des termes de moulinage et d’oléiculture (Malaxage, Décanteur, Véraison, Ardence, Polyphénols, Scourtin).',
    fieldUseCase: 'Référence pédagogique rapide pour producteurs, étudiants et apprentis mouliniers.',
    keyTakeaways: [
      'Véraison : passage progressif de l’épiderme de l’olive du vert tendre au violet puis au noir.',
      'Malaxage : brassage lent de la pâte broyée (20 à 35 min à < 27°C) pour coalescer les gouttelettes d’huile.',
      'Décanteur centrifuge (2 ou 3 phases) : séparation horizontale continue huile / grignon / eau de végétation.',
    ],
    preloadChunk: () => import('./OliveGlossarySection'),
    buildOfflinePayload: () => ({
      glossary: true,
    }),
  },
];

function loadPriorityGuideIds(): string[] {
  try {
    const raw = localStorage.getItem(PRIORITY_SELECTION_STORAGE_KEY);
    if (!raw) {
      return OFFLINE_TECHNICAL_GUIDES.filter((g) => g.defaultPriority).map((g) => g.id);
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter((id): id is string => typeof id === 'string');
    }
    return OFFLINE_TECHNICAL_GUIDES.filter((g) => g.defaultPriority).map((g) => g.id);
  } catch {
    return OFFLINE_TECHNICAL_GUIDES.filter((g) => g.defaultPriority).map((g) => g.id);
  }
}

export interface CachedGuideMetadata {
  guideId: string;
  cachedAt: string;
  sizeBytes: number;
}

export async function inspectPriorityGuidesCache(): Promise<Record<string, CachedGuideMetadata>> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return {};
  }
  try {
    const cache = await window.caches.open(PRIORITY_GUIDES_CACHE_NAME);
    const keys = await cache.keys();
    const map: Record<string, CachedGuideMetadata> = {};

    for (const req of keys) {
      const url = new URL(req.url);
      if (url.pathname.startsWith('/offline-guides/') && url.pathname.endsWith('.json')) {
        const guideId = url.pathname.replace('/offline-guides/', '').replace('.json', '');
        const res = await cache.match(req);
        if (res) {
          const clone = res.clone();
          const text = await clone.text();
          const cachedAt = res.headers.get('X-Cached-At') || new Date().toISOString();
          map[guideId] = {
            guideId,
            cachedAt,
            sizeBytes: new Blob([text]).size,
          };
        }
      }
    }
    return map;
  } catch {
    return {};
  }
}

export async function cacheGuideInStorage(guide: OfflineTechnicalGuide): Promise<CachedGuideMetadata | null> {
  // 1. Preload the React component chunk so it is cached by the browser / SW JS cache
  try {
    await guide.preloadChunk();
  } catch {
    // Ignore chunk preload error if already offline
  }

  if (typeof window === 'undefined' || !('caches' in window)) {
    return null;
  }

  try {
    const cache = await window.caches.open(PRIORITY_GUIDES_CACHE_NAME);
    const nowIso = new Date().toISOString();
    const payloadObj = {
      id: guide.id,
      sectionId: guide.sectionId,
      title: guide.title,
      category: guide.category,
      summary: guide.summary,
      fieldUseCase: guide.fieldUseCase,
      keyTakeaways: guide.keyTakeaways,
      data: guide.buildOfflinePayload(),
      cachedAt: nowIso,
    };
    const jsonString = JSON.stringify(payloadObj);
    const sizeBytes = new Blob([jsonString]).size;

    const response = new Response(jsonString, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Cache-Status': 'HIT-OFFLINE-PRIORITY',
        'X-Cached-At': nowIso,
      },
    });

    await cache.put(`/offline-guides/${guide.id}.json`, response);

    // Notify Service Worker if active so its Cache Storage & shell URLs stay synchronized
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_PRIORITY_GUIDES',
        guides: [payloadObj],
      });
    }

    return {
      guideId: guide.id,
      cachedAt: nowIso,
      sizeBytes,
    };
  } catch {
    return null;
  }
}

export async function removeGuideFromStorage(guideId: string): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const cache = await window.caches.open(PRIORITY_GUIDES_CACHE_NAME);
    await cache.delete(`/offline-guides/${guideId}.json`);
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'REMOVE_CACHED_GUIDE',
        guideId,
      });
    }
  } catch {
    // Ignore cache delete error
  }
}

interface OfflineGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onCacheCountChange?: (count: number) => void;
}

export const OfflineGuidesModal: React.FC<OfflineGuidesModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSection,
  onCacheCountChange,
}) => {
  const isOnline = useOnlineStatus();
  const [priorityIds, setPriorityIds] = useState<string[]>(() => loadPriorityGuideIds());
  const [cachedMap, setCachedMap] = useState<Record<string, CachedGuideMetadata>>({});
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [filterTab, setFilterTab] = useState<'all' | 'priority' | 'cached'>('all');
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>('guide-varietes-kabylie');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const refreshCacheInspection = useCallback(async () => {
    const map = await inspectPriorityGuidesCache();
    setCachedMap(map);
    if (onCacheCountChange) {
      onCacheCountChange(Object.keys(map).length);
    }
    return map;
  }, [onCacheCountChange]);

  // Automatically ensure priority guides are cached in Service Worker Cache Storage on first load
  useEffect(() => {
    let mounted = true;
    const ensurePriorityGuidesCached = async () => {
      const existing = await inspectPriorityGuidesCache();
      const missingPriorityGuides = OFFLINE_TECHNICAL_GUIDES.filter(
        (g) => priorityIds.includes(g.id) && !existing[g.id]
      );
      if (missingPriorityGuides.length > 0) {
        for (const guide of missingPriorityGuides) {
          await cacheGuideInStorage(guide);
        }
      }
      if (mounted) {
        await refreshCacheInspection();
      }
    };

    ensurePriorityGuidesCached();

    // Listen to Service Worker broadcast updates
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'PRIORITY_GUIDES_CACHE_UPDATED') {
        refreshCacheInspection();
      }
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }

    return () => {
      mounted = false;
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
    };
  }, [priorityIds, refreshCacheInspection]);

  useEffect(() => {
    try {
      localStorage.setItem(PRIORITY_SELECTION_STORAGE_KEY, JSON.stringify(priorityIds));
    } catch {
      // Ignore storage error
    }
  }, [priorityIds]);

  useEffect(() => {
    if (!isOpen) return;
    refreshCacheInspection();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, refreshCacheInspection]);

  const handleTogglePriority = async (guide: OfflineTechnicalGuide) => {
    const isCurrentlyPriority = priorityIds.includes(guide.id);
    if (isCurrentlyPriority) {
      setPriorityIds((prev) => prev.filter((id) => id !== guide.id));
      setStatusMessage(`« ${guide.title} » retiré des sections prioritaires.`);
    } else {
      setPriorityIds((prev) => [...prev, guide.id]);
      await cacheGuideInStorage(guide);
      await refreshCacheInspection();
      setStatusMessage(
        `« ${guide.title} » marqué comme prioritaire et enregistré dans le Cache Storage.`
      );
    }
  };

  const handleToggleSingleCache = async (guide: OfflineTechnicalGuide) => {
    setIsSyncing(true);
    const isCached = Boolean(cachedMap[guide.id]);
    if (isCached) {
      await removeGuideFromStorage(guide.id);
      setStatusMessage(`Guide « ${guide.title} » retiré du Cache Storage.`);
    } else {
      await cacheGuideInStorage(guide);
      setStatusMessage(`Guide « ${guide.title} » mis en cache pour consultation hors-ligne.`);
    }
    await refreshCacheInspection();
    setIsSyncing(false);
  };

  const handleSyncPriorityGuides = async () => {
    setIsSyncing(true);
    const priorityGuides = OFFLINE_TECHNICAL_GUIDES.filter((g) => priorityIds.includes(g.id));
    for (const guide of priorityGuides) {
      await cacheGuideInStorage(guide);
    }
    await refreshCacheInspection();
    setIsSyncing(false);
    setStatusMessage(
      `${priorityGuides.length} guides prioritaires synchronisés dans le Cache Storage (${PRIORITY_GUIDES_CACHE_NAME}).`
    );
  };

  const handleCacheAllGuides = async () => {
    setIsSyncing(true);
    for (const guide of OFFLINE_TECHNICAL_GUIDES) {
      await cacheGuideInStorage(guide);
    }
    await refreshCacheInspection();
    setIsSyncing(false);
    setStatusMessage(
      `Les ${OFFLINE_TECHNICAL_GUIDES.length} guides techniques sont désormais enregistrés dans le Cache Storage hors-ligne.`
    );
  };

  const handleClearCache = async () => {
    setIsSyncing(true);
    if (typeof window !== 'undefined' && 'caches' in window) {
      await window.caches.delete(PRIORITY_GUIDES_CACHE_NAME);
    }
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_PRIORITY_GUIDES_CACHE',
      });
    }
    await refreshCacheInspection();
    setIsSyncing(false);
    setStatusMessage('Le Cache Storage des guides hors-ligne a été vidé.');
  };

  const displayedGuides = useMemo(() => {
    return OFFLINE_TECHNICAL_GUIDES.filter((g) => {
      if (filterTab === 'priority') return priorityIds.includes(g.id);
      if (filterTab === 'cached') return Boolean(cachedMap[g.id]);
      return true;
    });
  }, [filterTab, priorityIds, cachedMap]);

  const cachedCount = Object.keys(cachedMap).length;
  const totalCachedKb = useMemo(() => {
    const totalBytes = Object.values(cachedMap).reduce((sum, item) => sum + item.sizeBytes, 0);
    const estimatedChunksKb = OFFLINE_TECHNICAL_GUIDES.filter((g) => cachedMap[g.id]).reduce(
      (sum, g) => sum + g.estimatedSizeKb,
      0
    );
    return Math.max(Math.round(totalBytes / 1024), estimatedChunksKb);
  }, [cachedMap]);

  if (!isOpen) return null;

  const getGuideIcon = (sectionId: string) => {
    switch (sectionId) {
      case 'varietes':
        return Droplets;
      case 'diagnostic-phytosanitaire':
        return Stethoscope;
      case 'pratiques':
        return Calendar;
      case 'degustation':
        return Award;
      case 'annuaire':
        return Building2;
      case 'irrigation':
        return Droplets;
      case 'fertilisation':
        return Calculator;
      case 'sous-produits':
        return Recycle;
      default:
        return BookOpen;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="offline-guides-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF7F2] rounded-3xl border border-[#E6DEC9] max-w-4xl w-full p-5 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-black transition-colors cursor-pointer shadow-xs"
          title="Fermer (Échap)"
          aria-label="Fermer la fenêtre des guides hors-ligne"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="pr-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34]">
              <HardDriveDownload className="w-4 h-4 text-[#E6AB3C]" aria-hidden="true" />
              <span>Service Worker & Cache Storage PWA · Zones Rurales & Montagneuses</span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold normal-case ${
                  isOnline
                    ? 'bg-[#E8F4D9] text-[#233416]'
                    : 'bg-amber-100 text-amber-950 border border-amber-300'
                }`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="w-3 h-3 text-[#31491E]" aria-hidden="true" />
                    <span>Connecté (Synchronisation active)</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-amber-700" aria-hidden="true" />
                    <span>Mode Hors-Ligne Actif</span>
                  </>
                )}
              </span>
            </div>

            <h2
              id="offline-guides-modal-title"
              className="font-serif text-2xl sm:text-3xl font-bold text-[#18230F] mt-1.5"
            >
              Guides Techniques Consultables Hors-Ligne
            </h2>
            <p className="text-xs sm:text-sm text-[#436229] mt-1 leading-relaxed">
              Les sections marquées comme <strong>Prioritaires</strong> sont automatiquement stockées dans le{' '}
              <code className="px-1.5 py-0.5 rounded bg-[#E8F4D9] text-[#18230F] font-mono text-[11px]">
                Cache Storage ({PRIORITY_GUIDES_CACHE_NAME})
              </code>{' '}
              du Service Worker afin que vous puissiez les consulter au verger ou au moulin même sans couverture 3G/4G.
            </p>
          </div>

          {/* Cache Storage Metrics & Quick Sync Bar */}
          <div className="bg-[#233416] text-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#8CBE5D]/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#8CBE5D]/20 border border-[#8CBE5D]/40 flex items-center justify-center text-[#E6AB3C] shrink-0">
                <Database className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif text-base sm:text-lg font-bold text-white">
                    {cachedCount} / {OFFLINE_TECHNICAL_GUIDES.length} guides prêts hors-ligne
                  </span>
                  <span className="text-xs text-[#B0D984] font-semibold tabular-nums">
                    · ~{totalCachedKb} Ko en Cache Storage
                  </span>
                </div>
                <p className="text-xs text-[#E8F4D9]/85 mt-0.5">
                  {priorityIds.length} section{priorityIds.length > 1 ? 's' : ''} définie{priorityIds.length > 1 ? 's' : ''} comme prioritaire{priorityIds.length > 1 ? 's' : ''} pour vos déplacements sur le terrain.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={handleSyncPriorityGuides}
                disabled={isSyncing}
                className="px-3.5 py-2 rounded-xl bg-[#8CBE5D] hover:bg-[#78a84b] text-[#18230F] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span>Synchroniser les prioritaires ({priorityIds.length})</span>
              </button>
              <button
                type="button"
                onClick={handleCacheAllGuides}
                disabled={isSyncing}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-colors cursor-pointer disabled:opacity-50"
              >
                Tout mettre en cache
              </button>
              {cachedCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearCache}
                  disabled={isSyncing}
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-[#E8F4D9] hover:text-red-200 border border-white/10 transition-colors cursor-pointer"
                  title="Vider le Cache Storage des guides hors-ligne"
                  aria-label="Vider le Cache Storage des guides hors-ligne"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {statusMessage && (
            <div
              role="status"
              className="px-4 py-2.5 rounded-xl bg-[#E8F4D9] border border-[#8CBE5D]/50 text-xs font-semibold text-[#18230F] flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#31491E] shrink-0" aria-hidden="true" />
                <span>{statusMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-[#567B34] hover:text-[#18230F] cursor-pointer"
                aria-label="Masquer la notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6DEC9] pb-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-[#31491E] text-white'
                    : 'bg-white text-[#233416] border border-[#E6DEC9] hover:bg-[#E8F4D9]'
                }`}
              >
                Tous les guides ({OFFLINE_TECHNICAL_GUIDES.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('priority')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  filterTab === 'priority'
                    ? 'bg-[#AF4D24] text-white'
                    : 'bg-white text-[#233416] border border-[#E6DEC9] hover:border-[#AF4D24]'
                }`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    filterTab === 'priority' ? 'fill-white text-white' : 'fill-[#E6AB3C] text-[#E6AB3C]'
                  }`}
                  aria-hidden="true"
                />
                <span>Sections Prioritaires ({priorityIds.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('cached')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  filterTab === 'cached'
                    ? 'bg-[#233416] text-white'
                    : 'bg-white text-[#233416] border border-[#E6DEC9] hover:bg-[#E8F4D9]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#567B34]" aria-hidden="true" />
                <span>Enregistrés en Cache ({cachedCount})</span>
              </button>
            </div>

            <span className="text-[11px] text-[#567B34]">
              Cliquez sur « Prioritaire » pour inclure une section dans la synchronisation automatique.
            </span>
          </div>

          {/* Guides List */}
          <div className="space-y-3.5">
            {displayedGuides.map((guide) => {
              const Icon = getGuideIcon(guide.sectionId);
              const isPriority = priorityIds.includes(guide.id);
              const cacheInfo = cachedMap[guide.id];
              const isCached = Boolean(cacheInfo);
              const isExpanded = expandedGuideId === guide.id;

              return (
                <div
                  key={guide.id}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all ${
                    isPriority
                      ? 'border-[#8CBE5D] shadow-xs'
                      : 'border-[#E6DEC9] hover:border-[#8CBE5D]/60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isCached
                            ? 'bg-[#E8F4D9] text-[#233416]'
                            : 'bg-[#FAF7F2] text-[#567B34] border border-[#E6DEC9]'
                        }`}
                      >
                        <Icon className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="font-bold uppercase tracking-wider text-[#567B34]">
                            {guide.category}
                          </span>
                          <span aria-hidden="true" className="text-gray-300">·</span>
                          {isCached ? (
                            <span className="inline-flex items-center gap-1 font-bold text-[#31491E]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                              <span>Disponible hors-ligne (~{guide.estimatedSizeKb} Ko)</span>
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              Non mis en cache (~{guide.estimatedSizeKb} Ko)
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif text-base sm:text-lg font-bold text-[#18230F]">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-[#436229] leading-relaxed">
                          {guide.summary}
                        </p>
                      </div>
                    </div>

                    {/* Priority & Cache Toggle Controls */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleTogglePriority(guide)}
                        aria-pressed={isPriority}
                        title={
                          isPriority
                            ? 'Section marquée comme prioritaire (cliquer pour retirer)'
                            : 'Marquer cette section comme prioritaire pour le Cache Storage'
                        }
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-colors cursor-pointer ${
                          isPriority
                            ? 'bg-amber-50 border-amber-300 text-amber-950'
                            : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#567B34] hover:border-amber-300 hover:text-amber-900'
                        }`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            isPriority ? 'fill-[#E6AB3C] text-[#E6AB3C]' : 'text-gray-400'
                          }`}
                          aria-hidden="true"
                        />
                        <span>Prioritaire</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleSingleCache(guide)}
                        disabled={isSyncing}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-colors cursor-pointer ${
                          isCached
                            ? 'bg-[#E8F4D9] border-[#8CBE5D]/50 text-[#233416] hover:bg-[#D4E8BF]'
                            : 'bg-[#31491E] border-[#31491E] text-white hover:bg-[#233416]'
                        }`}
                      >
                        <HardDriveDownload className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{isCached ? 'En cache SW' : 'Mettre en cache'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Footer: Quick Offline Reader & Navigate to Full Section */}
                  <div className="mt-3.5 pt-3 border-t border-[#E6DEC9]/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="text-[11px] text-[#567B34]">
                      <strong className="text-[#233416]">Usage terrain :</strong> {guide.fieldUseCase}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedGuideId((prev) => (prev === guide.id ? null : guide.id))
                        }
                        className="font-bold text-[#567B34] hover:text-[#18230F] flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                        <span>{isExpanded ? 'Masquer le mémo' : 'Mémo hors-ligne'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateToSection(guide.sectionId);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#31491E] hover:bg-[#233416] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Ouvrir la section</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Offline Field Synthesis */}
                  {isExpanded && (
                    <div className="mt-3 p-4 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-2 animate-in fade-in duration-150">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#31491E]">
                          Points clés mémorisés pour consultation sans réseau
                        </span>
                        {cacheInfo && (
                          <span className="text-[11px] text-[#567B34]">
                            Stocké dans <code className="font-mono">{PRIORITY_GUIDES_CACHE_NAME}</code>
                          </span>
                        )}
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#18230F]">
                        {guide.keyTakeaways.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2
                              className="w-3.5 h-3.5 text-[#31491E] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6DEC9]">
            <p className="text-xs text-[#567B34] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#31491E] shrink-0" aria-hidden="true" />
              <span>
                Astuce : Avant de monter au verger (Akfadou, Timezrit, Chemini, Darguina), cliquez sur « Synchroniser les prioritaires ».
              </span>
            </p>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl bg-white border border-[#E6DEC9] hover:bg-gray-50 text-[#18230F] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
