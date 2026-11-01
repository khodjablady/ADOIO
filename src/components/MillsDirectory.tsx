import React, { useState, useEffect, useMemo } from 'react';
import { 
  REPRESENTATIVE_MILLS, 
  BEJAIA_COMMUNES_DATA,
  OliveMill 
} from '../data/bejaiaOliveData';
import { 
  Search, 
  MapPin, 
  Phone, 
  Building2, 
  X,
  ExternalLink,
  Star,
  MessageSquare,
  Heart,
  Trash2,
  Cpu,
  CheckCircle2,
  Thermometer,
  Droplets,
  Clock,
  Award,
  Wrench,
  Scale,
  Recycle,
  Navigation,
  LocateFixed,
  Compass,
  SlidersHorizontal,
  Printer,
  Share2,
  Check,
  QrCode,
  Smartphone,
  Camera
} from 'lucide-react';
import { 
  getStoredReviews, 
  setLiveFirestoreReviews,
  calculateMillStats, 
  MillReview,
  MillStats
} from '../data/millReviewsData';
import { 
  subscribeToMillReviews,
  subscribeToUserAccount,
  syncUserFavoritesInFirestore
} from '../firebase';
import { MillReviewsSection } from './MillReviewsSection';
import { shareFinding } from '../utils/webShare';
import {
  MillQrCodeModal,
  MillQrSvg,
  buildMillMobileMapUrl
} from './MillQrCodeModal';
import { MillQrScannerModal } from './MillQrScannerModal';

const FAVORITES_STORAGE_KEY = 'adoio_favorite_mills_v1';

export interface UserProximityLocation {
  lat: number;
  lng: number;
  label: string;
  source: 'gps' | 'commune';
}

export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

const REFERENCE_LOCATIONS: Array<{ id: string; label: string; lat: number; lng: number }> = [
  { id: 'bejaia-centre', label: 'Béjaïa-Centre (Chef-lieu)', lat: 36.7509, lng: 5.0567 },
  ...BEJAIA_COMMUNES_DATA.map((c) => ({
    id: c.commune.toLowerCase().replace(/\s+/g, '-'),
    label: `${c.commune} (Daïra de ${c.daira})`,
    lat: c.lat,
    lng: c.lng,
  })),
];

function loadStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

interface MillsDirectoryProps {
  initialSearch?: string;
}

export const MillsDirectory: React.FC<MillsDirectoryProps> = ({ initialSearch = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCommune, setSelectedCommune] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyBio, setOnlyBio] = useState<boolean>(false);
  const [activeDirectoryTab, setActiveDirectoryTab] = useState<'all' | 'favorites'>('all');
  const [minRating, setMinRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'distance' | 'favorites' | 'rating' | 'reviews' | 'capacity'>('default');

  // Proximity & Geolocation filter states
  const [userLocation, setUserLocation] = useState<UserProximityLocation | null>(null);
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | 'all'>('all');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [selectedRefLocationId, setSelectedRefLocationId] = useState<string>('');

  const onlyFavorites = activeDirectoryTab === 'favorites';
  const setOnlyFavorites = (val: boolean | ((prev: boolean) => boolean)) => {
    setActiveDirectoryTab((prevTab) => {
      const prevBool = prevTab === 'favorites';
      const nextBool = typeof val === 'function' ? val(prevBool) : val;
      return nextBool ? 'favorites' : 'all';
    });
  };

  // Favorites state: persisted in Firestore when logged in, or LocalStorage when guest
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => loadStoredFavorites());
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  // Reviews state (persisted via Firestore)
  const [reviews, setReviews] = useState<MillReview[]>(() => getStoredReviews());
  const [activeModalMill, setActiveModalMill] = useState<OliveMill | null>(null);
  const [modalTab, setModalTab] = useState<'info' | 'reviews'>('info');
  const [copiedMillLink, setCopiedMillLink] = useState<boolean>(false);
  const [sharedMillId, setSharedMillId] = useState<string | null>(null);
  const [sharedDirectory, setSharedDirectory] = useState<boolean>(false);
  const [expandedQrMillId, setExpandedQrMillId] = useState<string | null>(null);
  const [activeQrModalMill, setActiveQrModalMill] = useState<OliveMill | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [lastScannedMill, setLastScannedMill] = useState<OliveMill | null>(null);

  // Hydrate initial state from URL search params (?mill=..., ?commune=..., ?tab=favorites)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const millParam = params.get('mill');
      const communeParam = params.get('commune');
      const tabParam = params.get('tab');

      if (tabParam === 'favorites') {
        setActiveDirectoryTab('favorites');
      }
      if (communeParam) {
        const matchedCommune = REPRESENTATIVE_MILLS.find(
          (m) => m.commune.toLowerCase() === communeParam.toLowerCase()
        )?.commune;
        if (matchedCommune) {
          setSelectedCommune(matchedCommune);
        }
      }
      if (millParam) {
        const matchedMill = REPRESENTATIVE_MILLS.find(
          (m) => m.id.toLowerCase() === millParam.toLowerCase()
        );
        if (matchedMill) {
          setActiveModalMill(matchedMill);
          setModalTab(params.get('view') === 'reviews' ? 'reviews' : 'info');
        }
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  const syncMillUrlParam = (millId: string | null) => {
    try {
      const url = new URL(window.location.href);
      if (millId) {
        url.searchParams.set('mill', millId);
        url.hash = 'annuaire';
      } else {
        url.searchParams.delete('mill');
        url.searchParams.delete('view');
      }
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    } catch {
      // Ignore history API errors
    }
  };

  const buildMillDeepLink = (mill: OliveMill): string => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('mill', mill.id);
      url.hash = 'annuaire';
      return url.toString();
    } catch {
      return `https://adoio-bejaia.dz/?mill=${encodeURIComponent(mill.id)}#annuaire`;
    }
  };

  const buildWhatsAppShareUrl = (mill: OliveMill, stats?: MillStats): string => {
    const deepLink = buildMillDeepLink(mill);
    const ratingLine =
      stats && stats.totalReviews > 0
        ? `⭐ Note oléiculteurs : ${stats.averageRating.toFixed(1)}/5 (${stats.totalReviews} avis)\n`
        : '';
    const bioBadge = mill.certifiedBio ? ' · Certifié Bio' : '';
    const message =
      `🫒 *Recommandation Huilerie — ADOIO Béjaïa*\n` +
      `*${mill.name}* (${mill.commune}, Daïra de ${mill.daira})\n` +
      `⚙️ Système : ${mill.typeLabel}${bioBadge}\n` +
      `⚡ Capacité : ${mill.capacityQxPerDay} qx/jour (lot dès ${mill.technicalSpecs.minBatchKg} kg)\n` +
      ratingLine +
      `📞 Tél : ${mill.phone}\n` +
      `🔗 Fiche complète : ${deepLink}`;

    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  };

  const handleShareMill = async (mill: OliveMill, stats?: MillStats | null, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const link = buildMillDeepLink(mill);
    const ratingPart =
      stats && stats.totalReviews > 0
        ? ` · Note ${stats.averageRating.toFixed(1)}/5 (${stats.totalReviews} avis)`
        : '';
    const outcome = await shareFinding({
      title: `${mill.name} — Huilerie à ${mill.commune} (Béjaïa)`,
      text: `${mill.typeLabel} à ${mill.commune} (Daïra de ${mill.daira}) · Capacité ${mill.capacityQxPerDay} qx/j (lot dès ${mill.technicalSpecs.minBatchKg} kg)${ratingPart} · Tél : ${mill.phone}`,
      url: link,
    });
    if (outcome === 'shared' || outcome === 'copied') {
      setSharedMillId(mill.id);
      setCopiedMillLink(true);
      setTimeout(() => {
        setSharedMillId((prev) => (prev === mill.id ? null : prev));
        setCopiedMillLink(false);
      }, 2400);
    }
  };

  const handleShareDirectoryFindings = async () => {
    let url = 'https://adoio-bejaia.dz/#annuaire';
    try {
      const parsed = new URL(window.location.href);
      parsed.searchParams.delete('mill');
      parsed.searchParams.delete('view');
      if (selectedCommune !== 'all') {
        parsed.searchParams.set('commune', selectedCommune);
      } else {
        parsed.searchParams.delete('commune');
      }
      if (onlyFavorites) {
        parsed.searchParams.set('tab', 'favorites');
      } else {
        parsed.searchParams.delete('tab');
      }
      parsed.hash = 'annuaire';
      url = parsed.toString();
    } catch {
      // Fallback URL already set
    }

    const title = onlyFavorites
      ? `Mes Huileries Favorites (${favoriteMills.length}) — ADOIO Béjaïa`
      : `Annuaire des Huileries de Béjaïa (${filteredMills.length} unités) — ADOIO`;
    const text =
      onlyFavorites && favoriteMills.length > 0
        ? `Sélection de ${favoriteMills.length} huilerie(s) en Kabylie (${favoriteSummary.totalCapacityQx} qx/j cumulés) : ${favoriteMills.map(({ mill }) => mill.name).join(', ')}.`
        : `Découvrez ${filteredMills.length} huilerie(s) et moulins en activité dans la Wilaya de Béjaïa${selectedCommune !== 'all' ? ` (Commune de ${selectedCommune})` : ''}.`;

    const outcome = await shareFinding({ title, text, url });
    if (outcome === 'shared' || outcome === 'copied') {
      setSharedDirectory(true);
      setTimeout(() => setSharedDirectory(false), 2400);
    }
  };

  useEffect(() => {
    if (!activeModalMill) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveModalMill(null);
        syncMillUrlParam(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalMill]);

  // Only persist to localStorage when the user is NOT logged in
  useEffect(() => {
    if (isUserLoggedIn) return;
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [favoriteIds, isUserLoggedIn]);

  useEffect(() => {
    if (isUserLoggedIn) return;
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea && event.storageArea !== window.localStorage) return;
      if (event.key === FAVORITES_STORAGE_KEY || event.key === null) {
        setFavoriteIds(loadStoredFavorites());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isUserLoggedIn]);

  // Synchronize favorite mills with the authenticated user's Firestore account
  useEffect(() => {
    const unsubscribe = subscribeToUserAccount(({ user, profile }) => {
      const loggedIn = Boolean(user);
      setIsUserLoggedIn(loggedIn);
      if (user && profile) {
        setFavoriteIds((prev) => {
          const sameLength = prev.length === profile.favoriteMillIds.length;
          const isSame =
            sameLength && prev.every((id, index) => id === profile.favoriteMillIds[index]);
          return isSame ? prev : profile.favoriteMillIds;
        });
      } else if (!user) {
        setFavoriteIds(loadStoredFavorites());
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleFavorite = (millId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavoriteIds((prev) => {
      const exists = prev.includes(millId);
      const next = exists ? prev.filter((id) => id !== millId) : [...prev, millId];
      if (isUserLoggedIn) {
        void syncUserFavoritesInFirestore(next);
      } else {
        try {
          localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage quota errors
        }
      }
      return next;
    });
  };

  const clearAllFavorites = () => {
    setFavoriteIds([]);
    if (isUserLoggedIn) {
      void syncUserFavoritesInFirestore([]);
    } else {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([]));
      } catch {
        // Ignore storage quota errors
      }
    }
  };

  const refreshReviews = () => {
    setReviews(getStoredReviews());
  };

  // Subscribe to shared Firestore mill reviews in real time across all visitors
  useEffect(() => {
    const unsubscribe = subscribeToMillReviews((remoteReviews) => {
      const merged = setLiveFirestoreReviews(remoteReviews);
      setReviews(merged);
    });
    return () => unsubscribe();
  }, []);

  // Sync when search initiated from Hero
  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
      setActiveDirectoryTab('all');
    }
  }, [initialSearch]);

  // Communes list from data
  const communes = useMemo(() => {
    return ['all', ...Array.from(new Set(REPRESENTATIVE_MILLS.map((m) => m.commune)))];
  }, []);

  // Count of mills per extraction type (Continuous, Traditional, Domaine, Cooperative)
  const typeCounts = useMemo(() => {
    const basePool = onlyFavorites
      ? REPRESENTATIVE_MILLS.filter((m) => favoriteIds.includes(m.id))
      : REPRESENTATIVE_MILLS;
    return {
      all: basePool.length,
      modern: basePool.filter((m) => m.type === 'modern').length,
      traditional: basePool.filter((m) => m.type === 'traditional').length,
      domaine: basePool.filter((m) => m.type === 'domaine').length,
      cooperative: basePool.filter((m) => m.type === 'cooperative').length,
    };
  }, [onlyFavorites, favoriteIds]);

  // Activate browser GPS location with intelligent fallback for Béjaïa
  const handleUseGpsLocation = () => {
    setLocationNotice(null);
    if (!('geolocation' in navigator)) {
      const defaultRef = REFERENCE_LOCATIONS.find((r) => r.id === 'seddouk') || REFERENCE_LOCATIONS[0];
      setUserLocation({
        lat: defaultRef.lat,
        lng: defaultRef.lng,
        label: defaultRef.label,
        source: 'commune',
      });
      setSelectedRefLocationId(defaultRef.id);
      setSortBy('distance');
      if (maxDistanceKm === 'all') setMaxDistanceKm(25);
      setLocationNotice(
        `Géolocalisation navigateur indisponible : position de référence fixée sur ${defaultRef.label}.`
      );
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const distFromBejaiaCenter = calculateDistanceKm(latitude, longitude, 36.62, 4.75);

        if (distFromBejaiaCenter > 150) {
          // User is located far outside Béjaïa (e.g., international visitor or another region)
          setUserLocation({
            lat: latitude,
            lng: longitude,
            label: 'Votre position GPS actuelle',
            source: 'gps',
          });
          setSelectedRefLocationId('');
          setMaxDistanceKm('all');
          setSortBy('distance');
          setLocationNotice(
            `Position GPS détectée à ${distFromBejaiaCenter.toFixed(0)} km de Béjaïa. Les huileries sont triées de la plus proche à la plus éloignée (rayon « Tous »). Vous pouvez aussi choisir une commune de départ en Kabylie.`
          );
        } else {
          setUserLocation({
            lat: latitude,
            lng: longitude,
            label: 'Ma position GPS (Béjaïa)',
            source: 'gps',
          });
          setSelectedRefLocationId('');
          if (maxDistanceKm === 'all') {
            setMaxDistanceKm(20);
          }
          setSortBy('distance');
          setLocationNotice(null);
        }
      },
      () => {
        setIsLocating(false);
        const defaultRef = REFERENCE_LOCATIONS.find((r) => r.id === 'seddouk') || REFERENCE_LOCATIONS[0];
        setUserLocation({
          lat: defaultRef.lat,
          lng: defaultRef.lng,
          label: defaultRef.label,
          source: 'commune',
        });
        setSelectedRefLocationId(defaultRef.id);
        if (maxDistanceKm === 'all') {
          setMaxDistanceKm(20);
        }
        setSortBy('distance');
        setLocationNotice(
          `Accès GPS non autorisé dans cet aperçu : point de référence initialisé sur ${defaultRef.label}. Vous pouvez changer de commune ci-contre.`
        );
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
    );
  };

  const handleSelectReferenceLocation = (refId: string) => {
    setLocationNotice(null);
    setSelectedRefLocationId(refId);
    if (!refId) {
      setUserLocation(null);
      setMaxDistanceKm('all');
      if (sortBy === 'distance') setSortBy('default');
      return;
    }
    const found = REFERENCE_LOCATIONS.find((r) => r.id === refId);
    if (found) {
      setUserLocation({
        lat: found.lat,
        lng: found.lng,
        label: found.label,
        source: 'commune',
      });
      setSortBy('distance');
    }
  };

  const handleSelectRadius = (radius: number | 'all') => {
    setMaxDistanceKm(radius);
    if (!userLocation && radius !== 'all') {
      const defaultRef = REFERENCE_LOCATIONS.find((r) => r.id === 'seddouk') || REFERENCE_LOCATIONS[0];
      setUserLocation({
        lat: defaultRef.lat,
        lng: defaultRef.lng,
        label: defaultRef.label,
        source: 'commune',
      });
      setSelectedRefLocationId(defaultRef.id);
      setSortBy('distance');
    } else if (userLocation) {
      setSortBy('distance');
    }
  };

  const clearProximityFilter = () => {
    setUserLocation(null);
    setMaxDistanceKm('all');
    setSelectedRefLocationId('');
    setLocationNotice(null);
    if (sortBy === 'distance') {
      setSortBy('default');
    }
  };

  // Compute stats and optional proximity distance for each mill
  const millsWithStats = useMemo(() => {
    return REPRESENTATIVE_MILLS.map((mill) => {
      const stats = calculateMillStats(mill.id, reviews);
      const distanceKm = userLocation
        ? calculateDistanceKm(userLocation.lat, userLocation.lng, mill.lat, mill.lng)
        : null;
      return { mill, stats, distanceKm };
    });
  }, [reviews, userLocation]);

  // Saved favorite mill objects for the Favorites tab & quick-access bar
  const favoriteMills = useMemo(() => {
    return millsWithStats.filter(({ mill }) => favoriteIds.includes(mill.id));
  }, [millsWithStats, favoriteIds]);

  // Summary statistics for bookmarked mills in the Favorites tab
  const favoriteSummary = useMemo(() => {
    const totalCapacityQx = favoriteMills.reduce((sum, { mill }) => sum + mill.capacityQxPerDay, 0);
    const bioCount = favoriteMills.filter(({ mill }) => mill.certifiedBio).length;
    const communesList = Array.from(new Set(favoriteMills.map(({ mill }) => mill.commune)));
    return {
      totalCapacityQx,
      bioCount,
      communesList,
    };
  }, [favoriteMills]);

  // Filtered and sorted mills
  const filteredMills = useMemo(() => {
    return millsWithStats
      .filter(({ mill, stats, distanceKm }) => {
        if (onlyFavorites && !favoriteIds.includes(mill.id)) {
          return false;
        }

        const matchesSearch = 
          mill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mill.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mill.daira.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mill.brands.some((b) => b.toLowerCase().includes(searchTerm.toLowerCase())) ||
          mill.speciality.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCommune = selectedCommune === 'all' || mill.commune === selectedCommune;
        const matchesType = selectedType === 'all' || mill.type === selectedType;
        const matchesBio = !onlyBio || mill.certifiedBio;
        const matchesRating = minRating === 'all' || stats.averageRating >= minRating;
        const matchesDistance =
          !userLocation ||
          maxDistanceKm === 'all' ||
          (distanceKm !== null && distanceKm <= maxDistanceKm);

        return (
          matchesSearch &&
          matchesCommune &&
          matchesType &&
          matchesBio &&
          matchesRating &&
          matchesDistance
        );
      })
      .sort((a, b) => {
        if (sortBy === 'distance' && a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === 'favorites') {
          const aFav = favoriteIds.includes(a.mill.id) ? 1 : 0;
          const bFav = favoriteIds.includes(b.mill.id) ? 1 : 0;
          if (bFav !== aFav) return bFav - aFav;
        }
        if (sortBy === 'rating') return b.stats.averageRating - a.stats.averageRating;
        if (sortBy === 'reviews') return b.stats.totalReviews - a.stats.totalReviews;
        if (sortBy === 'capacity') return b.mill.capacityQxPerDay - a.mill.capacityQxPerDay;
        if (userLocation && a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm;
        }
        return 0; // default order
      });
  }, [
    millsWithStats,
    searchTerm,
    selectedCommune,
    selectedType,
    onlyBio,
    onlyFavorites,
    favoriteIds,
    minRating,
    sortBy,
    userLocation,
    maxDistanceKm,
  ]);

  const handleOpenMill = (mill: OliveMill, tab: 'info' | 'reviews' = 'info') => {
    setActiveModalMill(mill);
    setModalTab(tab);
    syncMillUrlParam(mill.id);
  };

  const handlePrintMillSheet = () => {
    if (!activeModalMill) return;
    document.body.classList.add('printing-mill-sheet');
    const triggerPrint = () => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('printing-mill-sheet');
      }, 300);
    };

    if (modalTab !== 'info') {
      setModalTab('info');
      setTimeout(triggerPrint, 120);
    } else {
      triggerPrint();
    }
  };

  const activeMillStats: MillStats | null = useMemo(() => {
    if (!activeModalMill) return null;
    return calculateMillStats(activeModalMill.id, reviews);
  }, [activeModalMill, reviews]);

  const activeModalMillDistanceKm: number | null = useMemo(() => {
    if (!activeModalMill || !userLocation) return null;
    return calculateDistanceKm(
      userLocation.lat,
      userLocation.lng,
      activeModalMill.lat,
      activeModalMill.lng
    );
  }, [activeModalMill, userLocation]);

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCommune !== 'all' ||
    selectedType !== 'all' ||
    onlyBio ||
    onlyFavorites ||
    minRating !== 'all' ||
    Boolean(userLocation) ||
    maxDistanceKm !== 'all' ||
    sortBy !== 'default';

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCommune('all');
    setSelectedType('all');
    setOnlyBio(false);
    setOnlyFavorites(false);
    setMinRating('all');
    setUserLocation(null);
    setMaxDistanceKm('all');
    setSelectedRefLocationId('');
    setLocationNotice(null);
    setSortBy('default');
  };

  return (
    <section id="annuaire" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9] scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="annuaire-screen-content">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <MapPin className="w-4 h-4 text-[#E6AB3C]" />
              <span>Répertoire Professionnel des Moulins & Domaines</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              Annuaire des Huileries de Béjaïa
            </h2>
            <p className="mt-2 text-sm text-[#436229] max-w-2xl leading-relaxed">
              Consultez les huileries modernes à chaîne continue et moulins traditionnels en activité. Marquez vos huileries préférées en favoris pour les retrouver à tout moment dans votre onglet dédié.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#31491E] font-semibold tabular-nums">
            <span>
              {filteredMills.length} unité{filteredMills.length > 1 ? 's' : ''} affichée{filteredMills.length > 1 ? 's' : ''}
            </span>
            <span aria-hidden="true" className="text-[#8CBE5D]">·</span>
            <button
              type="button"
              onClick={() => setActiveDirectoryTab(activeDirectoryTab === 'favorites' ? 'all' : 'favorites')}
              className="flex items-center gap-1 text-[#AF4D24] hover:underline cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-[#AF4D24] text-[#AF4D24]" aria-hidden="true" />
              <span>
                {favoriteIds.length} favori{favoriteIds.length > 1 ? 's' : ''} sauvegardé{favoriteIds.length > 1 ? 's' : ''}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsQrScannerOpen(true)}
              aria-label="Scanner le code QR d'une huilerie avec la caméra"
              title="Utiliser la caméra pour scanner le code QR d'une huilerie et ouvrir instantanément sa fiche et sa localisation"
              className="px-3.5 py-2 rounded-xl bg-[#233416] hover:bg-[#31491E] text-white border border-[#233416] shadow-2xs text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <Camera className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
              <span>Scanner QR Huilerie</span>
            </button>
            <button
              type="button"
              onClick={handleShareDirectoryFindings}
              aria-label="Partager les résultats de l'annuaire des huileries"
              title="Partager la sélection actuelle d'huileries via Web Share ou copier le lien"
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D] shadow-2xs text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {sharedDirectory ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#567B34]" aria-hidden="true" />
                  <span>Sélection partagée !</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                  <span>Partager</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Last Scanned QR Huilerie Quick-Access Banner */}
        {lastScannedMill && (
          <div className="mb-6 p-4 rounded-2xl bg-[#E8F4D9] border border-[#8CBE5D] flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#233416] text-[#E6AB3C] flex items-center justify-center shrink-0">
                <QrCode className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#31491E] block">
                  Dernière huilerie scannée par caméra QR
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#18230F]">
                  {lastScannedMill.name}{' '}
                  <span className="font-normal text-[#436229]">
                    ({lastScannedMill.commune}, Daïra de {lastScannedMill.daira} · GPS {lastScannedMill.lat.toFixed(4)}° N, {lastScannedMill.lng.toFixed(4)}° E)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenMill(lastScannedMill, 'info')}
                className="px-3 py-1.5 rounded-xl bg-[#233416] hover:bg-[#31491E] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                <span>Ouvrir la fiche</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('adoio:focus-mill-on-map', {
                      detail: { millId: lastScannedMill.id },
                    })
                  );
                  const mapEl = document.getElementById('carte-interactive');
                  if (mapEl) {
                    mapEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#233416] border border-[#8CBE5D] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#AF4D24]" aria-hidden="true" />
                <span>Localiser sur la carte</span>
              </button>
              <button
                type="button"
                onClick={() => setLastScannedMill(null)}
                aria-label="Masquer la bannière de l'huilerie scannée"
                className="p-1.5 rounded-lg hover:bg-white/60 text-[#436229] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Primary Directory Tab Navigation: 'Toutes les Huileries' vs 'Favoris' */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E6DEC9]">
          <div
            role="tablist"
            aria-label="Vues de l'annuaire des huileries"
            className="inline-flex p-1.5 bg-[#F4EEE1] rounded-2xl border border-[#E6DEC9] self-start"
          >
            <button
              type="button"
              role="tab"
              id="tab-all-mills"
              aria-selected={activeDirectoryTab === 'all'}
              aria-controls="panel-mills-directory"
              onClick={() => setActiveDirectoryTab('all')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeDirectoryTab === 'all'
                  ? 'bg-[#233416] text-white shadow-xs'
                  : 'text-[#233416] hover:bg-white/70'
              }`}
            >
              <Building2 className="w-4 h-4" aria-hidden="true" />
              <span>Toutes les Huileries</span>
              <span
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold tabular-nums ${
                  activeDirectoryTab === 'all'
                    ? 'bg-[#31491E] text-[#E6AB3C]'
                    : 'bg-[#E6DEC9]/70 text-[#233416]'
                }`}
              >
                {REPRESENTATIVE_MILLS.length}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              id="tab-favorite-mills"
              aria-selected={activeDirectoryTab === 'favorites'}
              aria-controls="panel-mills-directory"
              onClick={() => setActiveDirectoryTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeDirectoryTab === 'favorites'
                  ? 'bg-[#AF4D24] text-white shadow-xs'
                  : 'text-[#233416] hover:bg-white/70'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  activeDirectoryTab === 'favorites'
                    ? 'fill-white text-white'
                    : 'fill-[#AF4D24] text-[#AF4D24]'
                }`}
                aria-hidden="true"
              />
              <span>Favoris</span>
              <span
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold tabular-nums ${
                  activeDirectoryTab === 'favorites'
                    ? 'bg-white/20 text-white'
                    : favoriteIds.length > 0
                    ? 'bg-[#AF4D24]/15 text-[#AF4D24]'
                    : 'bg-[#E6DEC9]/70 text-[#567B34]'
                }`}
              >
                {favoriteIds.length}
              </span>
            </button>
          </div>

          {activeDirectoryTab === 'all' && favoriteMills.length > 0 && (
            <div className="flex items-center gap-3 text-xs bg-[#F4EEE1] px-3.5 py-2 rounded-xl border border-[#E6DEC9]">
              <Heart className="w-3.5 h-3.5 fill-[#AF4D24] text-[#AF4D24] shrink-0" aria-hidden="true" />
              <span className="text-[#233416] font-medium">
                Vous avez <strong>{favoriteMills.length}</strong> huilerie{favoriteMills.length > 1 ? 's' : ''} en favoris
              </span>
              <button
                type="button"
                onClick={() => setActiveDirectoryTab('favorites')}
                className="font-bold text-[#AF4D24] hover:underline cursor-pointer shrink-0"
              >
                Ouvrir l'onglet Favoris →
              </button>
            </div>
          )}

          {activeDirectoryTab === 'favorites' && favoriteMills.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveDirectoryTab('all')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9] transition-colors cursor-pointer"
              >
                + Parcourir tout l'annuaire
              </button>
              <button
                type="button"
                onClick={clearAllFavorites}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#AF4D24] bg-white border border-[#AF4D24]/30 hover:bg-[#AF4D24]/10 transition-colors cursor-pointer"
                title="Supprimer toutes les huileries de vos favoris"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Vider mes favoris</span>
              </button>
            </div>
          )}
        </div>

        {/* Favorites Tab Summary Banner (Shown when in 'Favorites' tab with at least 1 saved mill) */}
        {activeDirectoryTab === 'favorites' && favoriteMills.length > 0 && (
          <div
            role="region"
            aria-label="Synthèse de vos huileries favorites"
            className="mb-6 bg-[#F4EEE1] rounded-3xl border border-[#E6DEC9] p-5 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-[#AF4D24] text-[#AF4D24]" aria-hidden="true" />
                  <h3 className="font-serif text-lg font-bold text-[#18230F]">
                    Vos Huileries Sauvegardées ({favoriteMills.length})
                  </h3>
                </div>
                <p className="text-xs text-[#567B34] mt-0.5">
                  {isUserLoggedIn
                    ? 'Synchronisé en temps réel sur votre compte utilisateur Firebase Firestore.'
                    : 'Conservation automatique dans le stockage local de votre navigateur (disponible hors-ligne).'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-white border border-[#E6DEC9] font-bold text-[#18230F] tabular-nums">
                  Capacité cumulée : {favoriteSummary.totalCapacityQx} qx/jour
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white border border-[#E6DEC9] font-bold text-[#31491E] tabular-nums">
                  {favoriteSummary.bioCount} certifiée{favoriteSummary.bioCount > 1 ? 's' : ''} Bio
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white border border-[#E6DEC9] font-semibold text-[#436229]">
                  Communes : {favoriteSummary.communesList.join(', ')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Filters Toolbar: Type (Continuous / Traditional), Proximity (GPS & Commune Radius), Search & Sort */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E6DEC9] shadow-xs mb-8 space-y-5">
            {/* Block 1: Extraction System Type Filter (Continuous vs Traditional) */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#31491E]">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                  <span>Filtrer par Système d'Extraction (Type de Moulin)</span>
                </div>
                {selectedType !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedType('all')}
                    className="text-[11px] font-bold text-[#AF4D24] hover:underline cursor-pointer"
                  >
                    Afficher tous les types ({typeCounts.all})
                  </button>
                )}
              </div>

              <div
                role="group"
                aria-label="Filtrer par type d'huilerie (Chaîne continue ou Presse traditionnelle)"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5"
              >
                <button
                  type="button"
                  onClick={() => setSelectedType('all')}
                  aria-pressed={selectedType === 'all'}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedType === 'all'
                      ? 'bg-[#233416] border-[#233416] text-white shadow-xs'
                      : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#18230F] hover:border-[#8CBE5D] hover:bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">Tous les systèmes</p>
                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        selectedType === 'all' ? 'text-[#D4E8BF]' : 'text-[#567B34]'
                      }`}
                    >
                      Parc oléicole complet
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-extrabold tabular-nums shrink-0 ${
                      selectedType === 'all'
                        ? 'bg-[#31491E] text-[#E6AB3C]'
                        : 'bg-[#E6DEC9]/70 text-[#233416]'
                    }`}
                  >
                    {typeCounts.all}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType(selectedType === 'modern' ? 'all' : 'modern')}
                  aria-pressed={selectedType === 'modern'}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedType === 'modern'
                      ? 'bg-[#31491E] border-[#31491E] text-white shadow-xs'
                      : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#18230F] hover:border-[#8CBE5D] hover:bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Cpu
                        className={`w-3.5 h-3.5 shrink-0 ${
                          selectedType === 'modern' ? 'text-[#E6AB3C]' : 'text-[#31491E]'
                        }`}
                        aria-hidden="true"
                      />
                      <p className="text-xs font-bold truncate">Chaîne Continue</p>
                    </div>
                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        selectedType === 'modern' ? 'text-[#D4E8BF]' : 'text-[#567B34]'
                      }`}
                    >
                      Inox 2 & 3 phases (&lt; 27°C)
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-extrabold tabular-nums shrink-0 ${
                      selectedType === 'modern'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E8F4D9] text-[#31491E]'
                    }`}
                  >
                    {typeCounts.modern}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedType(selectedType === 'traditional' ? 'all' : 'traditional')
                  }
                  aria-pressed={selectedType === 'traditional'}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedType === 'traditional'
                      ? 'bg-[#8C5828] border-[#8C5828] text-white shadow-xs'
                      : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#18230F] hover:border-[#8C5828]/50 hover:bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Scale
                        className={`w-3.5 h-3.5 shrink-0 ${
                          selectedType === 'traditional' ? 'text-[#FDE68A]' : 'text-[#8C5828]'
                        }`}
                        aria-hidden="true"
                      />
                      <p className="text-xs font-bold truncate">Presse Traditionnelle</p>
                    </div>
                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        selectedType === 'traditional' ? 'text-[#FDE68A]/90' : 'text-[#567B34]'
                      }`}
                    >
                      Taâssart · Meules de granit
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-extrabold tabular-nums shrink-0 ${
                      selectedType === 'traditional'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F4EEE1] text-[#8C5828]'
                    }`}
                  >
                    {typeCounts.traditional}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedType(selectedType === 'domaine' ? 'all' : 'domaine')}
                  aria-pressed={selectedType === 'domaine'}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedType === 'domaine'
                      ? 'bg-[#436229] border-[#436229] text-white shadow-xs'
                      : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#18230F] hover:border-[#8CBE5D] hover:bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Award
                        className={`w-3.5 h-3.5 shrink-0 ${
                          selectedType === 'domaine' ? 'text-[#E6AB3C]' : 'text-[#436229]'
                        }`}
                        aria-hidden="true"
                      />
                      <p className="text-xs font-bold truncate">Domaine Intégré</p>
                    </div>
                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        selectedType === 'domaine' ? 'text-[#D4E8BF]' : 'text-[#567B34]'
                      }`}
                    >
                      Olivaie & mise en bouteille
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-extrabold tabular-nums shrink-0 ${
                      selectedType === 'domaine'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E8F4D9] text-[#31491E]'
                    }`}
                  >
                    {typeCounts.domaine}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedType(selectedType === 'cooperative' ? 'all' : 'cooperative')
                  }
                  aria-pressed={selectedType === 'cooperative'}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedType === 'cooperative'
                      ? 'bg-[#AF4D24] border-[#AF4D24] text-white shadow-xs'
                      : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#18230F] hover:border-[#AF4D24]/50 hover:bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Building2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          selectedType === 'cooperative' ? 'text-white' : 'text-[#AF4D24]'
                        }`}
                        aria-hidden="true"
                      />
                      <p className="text-xs font-bold truncate">Coopérative</p>
                    </div>
                    <p
                      className={`text-[10px] truncate mt-0.5 ${
                        selectedType === 'cooperative' ? 'text-white/85' : 'text-[#567B34]'
                      }`}
                    >
                      Collectif d'oléiculteurs
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-extrabold tabular-nums shrink-0 ${
                      selectedType === 'cooperative'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#AF4D24]/15 text-[#AF4D24]'
                    }`}
                  >
                    {typeCounts.cooperative}
                  </span>
                </button>
              </div>
            </div>

            {/* Block 2: Proximity & Geolocation Filter (Autour de ma position / Commune de départ) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-3">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#233416]">
                    <Compass className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
                    <span>Proximité & Géolocalisation :</span>
                  </div>

                  {/* GPS Locate Button */}
                  <button
                    type="button"
                    onClick={handleUseGpsLocation}
                    disabled={isLocating}
                    aria-pressed={userLocation?.source === 'gps'}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      userLocation?.source === 'gps'
                        ? 'bg-[#31491E] text-white border-[#31491E] shadow-2xs'
                        : 'bg-white text-[#233416] border-[#8CBE5D] hover:bg-[#E8F4D9]'
                    }`}
                  >
                    <LocateFixed
                      className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`}
                      aria-hidden="true"
                    />
                    <span>
                      {isLocating
                        ? 'Localisation GPS…'
                        : userLocation?.source === 'gps'
                        ? 'Position GPS active'
                        : 'Autour de ma position (GPS)'}
                    </span>
                  </button>

                  {/* Or select a reference commune in Béjaïa */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-[#567B34]">ou départ :</span>
                    <select
                      value={selectedRefLocationId}
                      onChange={(e) => handleSelectReferenceLocation(e.target.value)}
                      aria-label="Choisir une commune de départ pour calculer les distances"
                      className="px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-white font-semibold text-[#18230F] cursor-pointer"
                    >
                      <option value="">Choisir un point de départ en Kabylie…</option>
                      {REFERENCE_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          📍 {loc.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Radius Selector Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-[#567B34] mr-1">Rayon max :</span>
                  {(
                    [
                      { value: 'all', label: 'Tous' },
                      { value: 5, label: '≤ 5 km' },
                      { value: 10, label: '≤ 10 km' },
                      { value: 20, label: '≤ 20 km' },
                      { value: 35, label: '≤ 35 km' },
                      { value: 50, label: '≤ 50 km' },
                    ] as const
                  ).map((opt) => {
                    const isActive =
                      Boolean(userLocation) && maxDistanceKm === opt.value;
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => handleSelectRadius(opt.value)}
                        aria-pressed={isActive}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold tabular-nums transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                          isActive
                            ? 'bg-[#233416] text-white border-[#233416] shadow-2xs'
                            : 'bg-white text-[#436229] border-[#E6DEC9] hover:border-[#8CBE5D]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}

                  {userLocation && (
                    <button
                      type="button"
                      onClick={clearProximityFilter}
                      className="ml-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-[#AF4D24] hover:bg-[#AF4D24]/10 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shrink-0"
                      title="Désactiver le filtre de proximité"
                    >
                      <X className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Désactiver</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Active Proximity Status Banner */}
              {userLocation && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E6DEC9]/70 text-xs">
                  <div className="flex flex-wrap items-center gap-2 text-[#233416]">
                    <Navigation className="w-3.5 h-3.5 text-[#31491E] shrink-0" aria-hidden="true" />
                    <span>
                      Distances calculées depuis{' '}
                      <strong className="text-[#18230F]">{userLocation.label}</strong>
                      {maxDistanceKm !== 'all' ? (
                        <>
                          {' '}
                          · Rayon actif :{' '}
                          <strong className="text-[#31491E] tabular-nums">
                            ≤ {maxDistanceKm} km
                          </strong>
                        </>
                      ) : (
                        ' · Toutes distances (triées de la plus proche à la plus éloignée)'
                      )}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#31491E] tabular-nums">
                    {filteredMills.length} huilerie{filteredMills.length > 1 ? 's' : ''} dans ce périmètre
                  </span>
                </div>
              )}

              {locationNotice && (
                <p className="text-[11px] text-[#8C5828] bg-[#F4EEE1] px-3 py-1.5 rounded-xl border border-[#E6DEC9]">
                  {locationNotice}
                </p>
              )}
            </div>

            {/* Block 3: Search, Commune, System Dropdown & Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
              {/* Search Input */}
              <div className="lg:col-span-4 relative">
                <Search className="w-4 h-4 text-[#6F9D44] absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Rechercher une huilerie par nom, commune, marque ou spécialité"
                  placeholder={
                    onlyFavorites
                      ? 'Rechercher parmi vos huileries favorites...'
                      : 'Rechercher par nom, commune, marque ou spécialité...'
                  }
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2]"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Effacer la recherche"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Commune Filter */}
              <div className="lg:col-span-3">
                <select
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  aria-label="Filtrer par commune"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-medium text-[#18230F] cursor-pointer"
                >
                  <option value="all">Toutes les communes</option>
                  {communes.filter((c) => c !== 'all').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Technology Type Filter */}
              <div className="lg:col-span-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  aria-label="Filtrer par système de trituration"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-medium text-[#18230F] cursor-pointer"
                >
                  <option value="all">Tous les systèmes</option>
                  <option value="modern">Moderne Continu</option>
                  <option value="traditional">Presse Traditionnelle</option>
                  <option value="domaine">Domaine Intégré</option>
                  <option value="cooperative">Coopérative</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="lg:col-span-3">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    const nextSort = e.target.value as typeof sortBy;
                    setSortBy(nextSort);
                    if (nextSort === 'distance' && !userLocation) {
                      handleUseGpsLocation();
                    }
                  }}
                  aria-label="Trier les huileries"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-bold text-[#233416] cursor-pointer"
                >
                  <option value="default">Trier : Par défaut</option>
                  <option value="distance">📍 Plus proches de ma position</option>
                  <option value="favorites">♥ Mes favoris en premier</option>
                  <option value="rating">★ Mieux notés par les oléiculteurs</option>
                  <option value="reviews">💬 Plus d'avis déposés</option>
                  <option value="capacity">⚡ Plus forte capacité (qx/j)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Secondary Interactive Filters (Favorites Filter, Bio, Min Rating) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E6DEC9]/60">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Favorites Toolbar Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setOnlyFavorites((prev) => !prev)}
                  aria-pressed={onlyFavorites}
                  aria-label={
                    onlyFavorites
                      ? 'Afficher toutes les huileries'
                      : 'Filtrer pour afficher uniquement mes huileries favorites'
                  }
                  title={
                    onlyFavorites
                      ? 'Désactiver le filtre Favoris pour voir toutes les huileries'
                      : 'Afficher uniquement les huileries marquées en Favoris'
                  }
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer select-none ${
                    onlyFavorites
                      ? 'bg-[#AF4D24] border-[#AF4D24] text-white shadow-2xs'
                      : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#233416] hover:border-[#AF4D24]/50 hover:text-[#AF4D24]'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 transition-transform ${
                      onlyFavorites
                        ? 'fill-white text-white scale-110'
                        : favoriteIds.length > 0
                          ? 'fill-[#AF4D24] text-[#AF4D24]'
                          : 'text-[#AF4D24]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>Favoris uniquement</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[11px] font-extrabold tabular-nums ${
                      onlyFavorites
                        ? 'bg-white/20 text-white'
                        : favoriteIds.length > 0
                          ? 'bg-[#AF4D24]/15 text-[#AF4D24]'
                          : 'bg-[#E6DEC9]/70 text-[#567B34]'
                    }`}
                  >
                    {favoriteIds.length}
                  </span>
                </button>

                {/* Bio Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#233416] bg-[#FAF7F2] px-3 py-1.5 rounded-xl border border-[#E6DEC9]">
                  <input
                    type="checkbox"
                    checked={onlyBio}
                    onChange={(e) => setOnlyBio(e.target.checked)}
                    className="rounded border-[#8CBE5D] text-[#31491E] focus:ring-[#31491E] w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>Certifié Bio / Raisonné</span>
                </label>

                {/* Min Rating Filter */}
                <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E6DEC9] text-xs">
                  <span className="text-[11px] font-semibold text-[#567B34] px-2">Avis :</span>
                  <button
                    type="button"
                    onClick={() => setMinRating('all')}
                    className={`px-2.5 py-0.5 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                      minRating === 'all'
                        ? 'bg-[#31491E] text-white shadow-2xs'
                        : 'text-[#436229] hover:bg-white'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    type="button"
                    onClick={() => setMinRating(4.5)}
                    className={`px-2.5 py-0.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                      minRating === 4.5
                        ? 'bg-[#31491E] text-white shadow-2xs'
                        : 'text-[#436229] hover:bg-white'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-[#E6AB3C] text-[#E6AB3C]" aria-hidden="true" />
                    <span>4.5+</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMinRating(4.0)}
                    className={`px-2.5 py-0.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                      minRating === 4.0
                        ? 'bg-[#31491E] text-white shadow-2xs'
                        : 'text-[#436229] hover:bg-white'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-[#E6AB3C] text-[#E6AB3C]" aria-hidden="true" />
                    <span>4.0+</span>
                  </button>
                </div>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-[#AF4D24] hover:underline font-semibold cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
        </div>

        {/* Tab Panel: Mills Grid or Empty States */}
        <div
          id="panel-mills-directory"
          role="tabpanel"
          aria-labelledby={activeDirectoryTab === 'favorites' ? 'tab-favorite-mills' : 'tab-all-mills'}
        >
        {activeDirectoryTab === 'favorites' && favoriteIds.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-[#E6DEC9] space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7 text-[#AF4D24]" aria-hidden="true" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="font-serif text-xl font-bold text-[#18230F]">
                Aucune huilerie enregistrée dans vos favoris
              </h3>
              <p className="text-xs sm:text-sm text-[#567B34] leading-relaxed">
                Cliquez sur le bouton <strong>« Favori »</strong> sur la fiche d'un moulin pour le sauvegarder dans votre navigateur. Vos huileries favorites restent mémorisées sur votre appareil pour comparer leurs capacités ou les appeler directement pendant la récolte.
              </p>
            </div>

            {/* Quick Bookmark Suggestions */}
            <div className="max-w-2xl mx-auto pt-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#567B34] mb-3">
                Ajouter rapidement une huilerie de référence :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                {REPRESENTATIVE_MILLS.slice(0, 3).map((suggestedMill) => (
                  <div
                    key={`suggest-${suggestedMill.id}`}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] flex flex-col justify-between gap-3"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#567B34]">
                        {suggestedMill.commune}
                      </p>
                      <p className="font-serif text-sm font-bold text-[#18230F] mt-0.5 line-clamp-1">
                        {suggestedMill.name}
                      </p>
                      <p className="text-[11px] text-[#436229] mt-0.5">
                        {suggestedMill.capacityQxPerDay} qx/j · {suggestedMill.typeLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(suggestedMill.id, e)}
                      className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-[#AF4D24] text-[#AF4D24] hover:text-white border border-[#AF4D24]/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Ajouter aux favoris</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveDirectoryTab('all')}
                className="px-5 py-2.5 bg-[#233416] hover:bg-[#31491E] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Parcourir toutes les huileries ({REPRESENTATIVE_MILLS.length})
              </button>
            </div>
          </div>
        ) : filteredMills.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E6DEC9] space-y-3">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto" aria-hidden="true" />
            <h3 className="font-serif text-lg font-bold text-[#18230F]">
              Aucune huilerie ne correspond à vos filtres
            </h3>
            <p className="text-xs text-[#567B34] max-w-md mx-auto">
              {userLocation && maxDistanceKm !== 'all'
                ? `Aucune huilerie trouvée dans un rayon de ${maxDistanceKm} km autour de ${userLocation.label}. Essayez d'élargir le rayon de proximité ou de réinitialiser les filtres.`
                : "Essayez d'assouplir vos critères de recherche ou de réinitialiser les filtres actifs."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {userLocation && maxDistanceKm !== 'all' && (
                <button
                  type="button"
                  onClick={() => setMaxDistanceKm('all')}
                  className="px-4 py-2 bg-[#E8F4D9] text-[#233416] border border-[#8CBE5D] rounded-xl text-xs font-bold cursor-pointer"
                >
                  Élargir à toutes les distances
                </button>
              )}
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-4 py-2 bg-[#31491E] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMills.map(({ mill, stats, distanceKm }) => {
              const isFavorite = favoriteIds.includes(mill.id);
              const systemLabel =
                mill.type === 'modern'
                  ? 'Moderne 2/3 Ph.'
                  : mill.type === 'traditional'
                  ? 'Presse Traditionnelle'
                  : mill.type === 'domaine'
                  ? 'Domaine Intégré'
                  : 'Coopérative';
              const estimatedDriveMinutes =
                distanceKm !== null ? Math.max(3, Math.round(distanceKm * 1.45)) : null;

              return (
                <div
                  key={mill.id}
                  onClick={() => handleOpenMill(mill, 'info')}
                  className={`bg-white rounded-3xl border p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group ${
                    isFavorite
                      ? 'border-[#AF4D24]/50 hover:border-[#AF4D24]'
                      : 'border-[#E6DEC9] hover:border-[#8CBE5D]'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Header: Unboxed Metadata Kicker + Interactive Favorite Button */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#567B34]">
                        <span className="font-bold uppercase tracking-wider text-[#31491E]">
                          {mill.commune}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Daïra de {mill.daira}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-[#436229]">{systemLabel}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(mill.id, e)}
                        aria-pressed={isFavorite}
                        aria-label={
                          isFavorite
                            ? `Retirer ${mill.name} des favoris`
                            : `Ajouter ${mill.name} aux favoris`
                        }
                        title={
                          isFavorite
                            ? 'Retirer de mes huileries favorites'
                            : 'Ajouter à mes huileries favorites (sauvegardé dans votre navigateur)'
                        }
                        className={`px-2.5 py-1.5 -my-1 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 text-[11px] font-bold shadow-2xs active:scale-95 ${
                          isFavorite
                            ? 'bg-[#AF4D24] border-[#AF4D24] text-white'
                            : 'bg-[#FAF7F2] border-[#E6DEC9] text-[#436229] hover:bg-[#F4EEE1] hover:border-[#AF4D24]/50 hover:text-[#AF4D24]'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-transform ${
                            isFavorite
                              ? 'fill-white text-white scale-110'
                              : 'text-[#AF4D24]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>Favoris</span>
                      </button>
                    </div>

                    {/* Proximity Distance Banner on Card when Geolocation / Reference Point is Active */}
                    {distanceKm !== null && (
                      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#E8F4D9]/75 border border-[#8CBE5D]/50 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-[#18230F] tabular-nums">
                          <Navigation className="w-3.5 h-3.5 text-[#31491E] shrink-0" aria-hidden="true" />
                          <span>À {distanceKm.toFixed(1)} km</span>
                          {estimatedDriveMinutes !== null && distanceKm <= 120 && (
                            <span className="text-[11px] font-medium text-[#436229]">
                              (~{estimatedDriveMinutes} min par route)
                            </span>
                          )}
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${mill.lat},${mill.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-bold text-[#31491E] hover:underline flex items-center gap-1 shrink-0"
                          title={`Ouvrir l'itinéraire routier vers ${mill.name}`}
                        >
                          <span>Itinéraire</span>
                          <ExternalLink className="w-3 h-3" aria-hidden="true" />
                        </a>
                      </div>
                    )}

                    {/* Mill Title & Description */}
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#18230F] group-hover:text-[#31491E] transition-colors">
                        {mill.name}
                      </h3>
                      <p className="text-xs text-[#567B34] mt-1 line-clamp-2 leading-relaxed">
                        {mill.description}
                      </p>
                    </div>

                    {/* Rating and Reviews Control on Card */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMill(mill, 'reviews');
                        }}
                        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer group/rate"
                        title="Consulter les retours d'expérience et avis oléicoles"
                      >
                        <div className="flex items-center gap-1 text-[#18230F] font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#E6AB3C] text-[#E6AB3C]" aria-hidden="true" />
                          <span>{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'Nouveau'}</span>
                        </div>
                        <span className="text-[#567B34] text-[11px] font-semibold underline decoration-dotted">
                          ({stats.totalReviews} avis)
                        </span>
                      </button>

                      {stats.totalReviews > 0 && stats.recommendationPercentage >= 85 && (
                        <span className="text-[11px] text-[#31491E] font-semibold">
                          {stats.recommendationPercentage}% recommandent
                        </span>
                      )}
                    </div>

                    {/* Capacity, Technical Summary & Services Preview */}
                    <div className="space-y-2 pt-2 border-t border-[#E6DEC9] text-xs text-[#436229]">
                      <div className="flex justify-between items-center">
                        <span className="text-[#567B34]">Capacité & Cadence</span>
                        <span className="font-bold text-[#18230F] tabular-nums">
                          {mill.capacityQxPerDay} qx/j · {mill.technicalSpecs.hourlyThroughputKg} kg/h
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#567B34]">Lot min. / Cuverie</span>
                        <span className="font-semibold text-[#18230F] tabular-nums">
                          Dès {mill.technicalSpecs.minBatchKg} kg · {(mill.technicalSpecs.storageCapacityLiters / 1000).toFixed(0)}k L inox
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#567B34]">Services oléicoles</span>
                        <span className="font-semibold text-[#31491E] text-right truncate max-w-[190px]">
                          {mill.services.length} prestations ({mill.services[0].split(' ').slice(0, 2).join(' ')}…)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-5 pt-3 border-t border-[#E6DEC9] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenMill(mill, 'info');
                          }}
                          className="text-xs font-bold text-[#31491E] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Détails & Services</span>
                          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <span className="text-gray-300" aria-hidden="true">|</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenMill(mill, 'reviews');
                          }}
                          className="text-xs font-bold text-[#567B34] hover:text-[#233416] flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                          <span>Avis ({stats.totalReviews})</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedQrMillId((prev) => (prev === mill.id ? null : mill.id));
                          }}
                          aria-expanded={expandedQrMillId === mill.id}
                          aria-label={`Afficher le code QR GPS pour ${mill.name}`}
                          title={`Générer et scanner le code QR GPS de ${mill.name} sur mobile`}
                          className={`p-1.5 px-2.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95 ${
                            expandedQrMillId === mill.id
                              ? 'bg-[#233416] text-white border-[#233416]'
                              : 'bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] border-[#E6DEC9] hover:border-[#8CBE5D]'
                          }`}
                        >
                          <QrCode
                            className={`w-3.5 h-3.5 ${
                              expandedQrMillId === mill.id ? 'text-[#E6AB3C]' : 'text-[#31491E]'
                            }`}
                            aria-hidden="true"
                          />
                          <span>QR GPS</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleShareMill(mill, stats, e)}
                          aria-label={`Partager ${mill.name}`}
                          title={`Partager la fiche de ${mill.name} (Web Share ou copie du lien)`}
                          className="p-1.5 px-2.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                        >
                          {sharedMillId === mill.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#567B34]" aria-hidden="true" />
                              <span>Partagé !</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="w-3 h-3 text-[#31491E]" aria-hidden="true" />
                              <span className="hidden sm:inline">Partager</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const mapEl = document.getElementById('carte-interactive');
                            if (mapEl) {
                              mapEl.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="p-1.5 px-2 rounded-lg bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#233416] text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Localiser sur la carte interactive"
                        >
                          <MapPin className="w-3 h-3 text-[#436229]" aria-hidden="true" />
                          <span className="hidden sm:inline">Carte</span>
                        </button>
                        <a
                          href={`tel:${mill.phone.split('/')[0].trim()}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] transition-colors"
                          title="Appeler l'huilerie"
                          aria-label={`Appeler ${mill.name}`}
                        >
                          <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </div>

                    {/* Inline Scannable GPS QR Code Drawer for this Huilerie */}
                    {expandedQrMillId === mill.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#8CBE5D] space-y-3 animate-in fade-in duration-150"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#18230F]">
                            <Smartphone className="w-4 h-4 text-[#31491E] shrink-0" aria-hidden="true" />
                            <span>Scanner pour ouvrir sur votre GPS mobile</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setExpandedQrMillId(null)}
                            aria-label="Masquer le code QR"
                            className="p-1 rounded-lg hover:bg-white text-[#567B34] hover:text-[#18230F] cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3.5 bg-white p-3 rounded-xl border border-[#E6DEC9]">
                          <div className="p-1.5 rounded-xl bg-white border border-[#31491E]/20 shrink-0">
                            <MillQrSvg
                              value={buildMillMobileMapUrl(mill, 'google_pin', userLocation)}
                              size={116}
                              fgColor="#18230F"
                              bgColor="#FFFFFF"
                              title={`Code QR GPS de ${mill.name} (${mill.commune})`}
                            />
                          </div>
                          <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#18230F] truncate">
                              {mill.name}
                            </p>
                            <p className="text-[11px] text-[#567B34] leading-snug">
                              {mill.address} · {mill.commune}
                            </p>
                            <p className="font-mono text-[11px] font-bold text-[#31491E] tabular-nums">
                              GPS : {mill.lat.toFixed(4)}° N, {mill.lng.toFixed(4)}° E
                            </p>
                            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                              <a
                                href={buildMillMobileMapUrl(mill, 'google_pin', userLocation)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-[#31491E] hover:bg-[#233416] text-white text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                              >
                                <Navigation className="w-3 h-3 text-[#E6AB3C]" aria-hidden="true" />
                                <span>Ouvrir Maps</span>
                              </a>
                              <button
                                type="button"
                                onClick={() => setActiveQrModalMill(mill)}
                                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <QrCode className="w-3 h-3 text-[#AF4D24]" aria-hidden="true" />
                                <span>Agrandir / Waze / PNG</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Direct WhatsApp Recommendation Button */}
                    <a
                      href={buildWhatsAppShareUrl(mill, stats)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Partager ${mill.name} sur WhatsApp`}
                      title={`Recommander ${mill.name} (${mill.commune}) à un oléiculteur sur WhatsApp`}
                      className="w-full py-2 px-3 rounded-xl bg-[#E8F4D9]/70 hover:bg-[#25D366] text-[#1E4620] hover:text-white border border-[#8CBE5D]/50 hover:border-[#25D366] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs group/wa"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 text-[#1E8E3E] group-hover/wa:text-white shrink-0 transition-colors"
                        aria-hidden="true"
                      >
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.126.556 4.124 1.535 5.861l-1.535 5.603 5.736-1.504c1.694.922 3.631 1.448 5.694 1.448 6.627 0 12-5.373 12-12s-5.373-11.408-11.43-11.408z" />
                      </svg>
                      <span>Partager sur WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </div>
        </div>

        {/* Modal: Comprehensive Mill Details, Technical Capacities, Specific Services & Reviews */}
        {activeModalMill && activeMillStats && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-mill-title"
            onClick={() => setActiveModalMill(null)}
            className="mill-modal-print-overlay fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="mill-modal-print-sheet bg-[#FAF7F2] rounded-3xl border border-[#E6DEC9] max-w-4xl w-full p-5 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setActiveModalMill(null)}
                className="mill-modal-no-print absolute top-5 right-5 p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-black transition-colors cursor-pointer shadow-xs"
                title="Fermer la vue (Échap)"
                aria-label="Fermer la fiche de l'huilerie"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                {/* Print-only Institutional Letterhead */}
                <div className="print-only-mill-block hidden pb-3 mb-2 border-b-2 border-[#18230F]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#31491E]">
                        ADOIO Béjaïa · Annuaire Officiel des Huileries & Moulins de Kabylie
                      </p>
                      <p className="text-xs font-semibold text-[#18230F] mt-0.5">
                        Fiche Technique d'Unité de Trituration — Réf. #{activeModalMill.id.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right text-[10px] text-[#31491E]">
                      <p className="font-bold">Wilaya de Béjaïa (06)</p>
                      <p>Édité le {new Date().toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                {/* Header */}
                <div className="pr-10">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34]">
                      <MapPin className="w-4 h-4 text-[#E6AB3C]" aria-hidden="true" />
                      <span>{activeModalMill.commune} · Daïra de {activeModalMill.daira}</span>
                      {activeModalMillDistanceKm !== null && (
                        <span className="text-[11px] font-bold text-[#233416] normal-case tabular-nums">
                          · À {activeModalMillDistanceKm.toFixed(1)} km de votre position
                        </span>
                      )}
                      {activeModalMill.certifiedBio && (
                        <span className="text-[11px] font-bold text-[#31491E] normal-case">
                          · Certifié Bio / Raisonné
                        </span>
                      )}
                      {activeModalMill.igCandidate && (
                        <span className="text-[11px] font-bold text-[#AF4D24] normal-case">
                          · Éligible IGP Kabylie
                        </span>
                      )}
                    </div>

                    <div className="mill-modal-no-print flex flex-wrap items-center gap-2">
                      <a
                        href={buildWhatsAppShareUrl(activeModalMill, activeMillStats)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-[#E8F4D9] text-[#1E4620] border border-[#8CBE5D]/60 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
                        title={`Partager la fiche de ${activeModalMill.name} sur WhatsApp`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-3.5 h-3.5 shrink-0"
                          aria-hidden="true"
                        >
                          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.126.556 4.124 1.535 5.861l-1.535 5.603 5.736-1.504c1.694.922 3.631 1.448 5.694 1.448 6.627 0 12-5.373 12-12s-5.373-11.408-11.43-11.408z" />
                        </svg>
                        <span>Partager sur WhatsApp</span>
                      </a>

                      <button
                        type="button"
                        onClick={(e) => handleShareMill(activeModalMill, activeMillStats, e)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-white text-[#18230F] border border-[#E6DEC9] hover:border-[#31491E] hover:bg-[#E8F4D9]/50 transition-colors cursor-pointer"
                        title="Partager la fiche de cette huilerie via Web Share ou copier le lien direct"
                      >
                        {copiedMillLink ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                            <span>Fiche partagée !</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                            <span>Partager</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveQrModalMill(activeModalMill)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-white text-[#18230F] border border-[#E6DEC9] hover:border-[#31491E] hover:bg-[#E8F4D9]/50 transition-colors cursor-pointer"
                        title="Afficher et télécharger le code QR GPS pour ouvrir cette huilerie sur mobile"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#AF4D24]" aria-hidden="true" />
                        <span>Code QR GPS</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePrintMillSheet}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-white text-[#18230F] border border-[#E6DEC9] hover:border-[#31491E] hover:bg-[#E8F4D9]/50 transition-colors cursor-pointer"
                        title="Imprimer la fiche technique complète au format papier A4"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                        <span>Imprimer la fiche</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(activeModalMill.id, e)}
                        aria-pressed={favoriteIds.includes(activeModalMill.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                          favoriteIds.includes(activeModalMill.id)
                            ? 'bg-[#AF4D24] text-white border-[#AF4D24]'
                            : 'bg-white text-[#233416] border-[#E6DEC9] hover:border-[#AF4D24]'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            favoriteIds.includes(activeModalMill.id)
                              ? 'fill-white text-white'
                              : 'text-[#AF4D24]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>
                          {favoriteIds.includes(activeModalMill.id)
                            ? 'Sauvegardée dans mes favoris'
                            : 'Sauvegarder en favori'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <h3
                    id="modal-mill-title"
                    className="font-serif text-2xl sm:text-3xl font-bold text-[#18230F] mt-1.5"
                  >
                    {activeModalMill.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#567B34]">
                    <span className="font-semibold text-[#233416]">{activeModalMill.typeLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>En activité depuis {activeModalMill.yearEstablished}</span>
                    <span aria-hidden="true">·</span>
                    <div className="flex items-center gap-1 font-bold text-[#18230F]">
                      <Star className="w-3.5 h-3.5 fill-[#E6AB3C] text-[#E6AB3C]" aria-hidden="true" />
                      <span>
                        {activeMillStats.averageRating > 0
                          ? activeMillStats.averageRating.toFixed(1)
                          : 'Nouveau'}
                      </span>
                      <span className="text-[#567B34] font-normal">
                        ({activeMillStats.totalReviews} avis)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tab Selector */}
                <div className="mill-modal-no-print flex items-center border-b border-[#E6DEC9] gap-4 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setModalTab('info')}
                    className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                      modalTab === 'info'
                        ? 'border-[#31491E] text-[#31491E]'
                        : 'border-transparent text-gray-400 hover:text-[#18230F]'
                    }`}
                  >
                    <Cpu className="w-4 h-4" />
                    <span>Capacités Techniques, Services & Coordonnées</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('reviews')}
                    className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 whitespace-nowrap ${
                      modalTab === 'reviews'
                        ? 'border-[#31491E] text-[#31491E]'
                        : 'border-transparent text-gray-400 hover:text-[#18230F]'
                    }`}
                  >
                    <Star className="w-4 h-4 text-[#E6AB3C]" />
                    <span>Avis & Notations des Oléiculteurs ({activeMillStats.totalReviews})</span>
                  </button>
                </div>

                {/* Tab 1: Complete Technical Capacities, Specific Services & Practical Info */}
                {modalTab === 'info' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    {/* Overview & Organoleptic Profile */}
                    <div className="mill-print-section bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F] flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
                          <span>Présentation & Profil Organoleptique</span>
                        </h4>
                        <span className="text-xs font-semibold text-[#567B34]">
                          Marques : <strong className="text-[#18230F]">{activeModalMill.brands.join(', ')}</strong>
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#436229] leading-relaxed">
                        {activeModalMill.description}
                      </p>
                      <div className="p-3 bg-[#E8F4D9] rounded-xl text-xs text-[#233416] flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <strong>Spécialité & Profil sensoriel :</strong> {activeModalMill.speciality}
                        </div>
                        <div className="font-bold text-[#31491E]">
                          Acidité visée : {activeModalMill.technicalSpecs.avgAcidity}
                        </div>
                      </div>
                    </div>

                    {/* Section 1: Capacités Techniques & Chaîne d'Extraction */}
                    <div className="mill-print-section bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F] flex items-center gap-1.5">
                          <Cpu className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
                          <span>Capacités Techniques & Paramètres d'Extraction</span>
                        </h4>
                        <span className="text-[11px] font-semibold text-[#567B34]">
                          Données techniques vérifiées
                        </span>
                      </div>

                      {/* Key Numeric Metrics Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DEC9]">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#567B34] mb-1">
                            <Scale className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                            <span>Capacité / jour</span>
                          </div>
                          <span className="font-serif text-lg font-bold text-[#18230F] tabular-nums block">
                            {activeModalMill.capacityQxPerDay} qx / j
                          </span>
                          <span className="text-[11px] text-[#567B34] tabular-nums">
                            Cadence : {activeModalMill.technicalSpecs.hourlyThroughputKg} kg/h
                          </span>
                        </div>

                        <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DEC9]">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#567B34] mb-1">
                            <Wrench className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                            <span>Lot minimum</span>
                          </div>
                          <span className="font-serif text-lg font-bold text-[#18230F] tabular-nums block">
                            {activeModalMill.technicalSpecs.minBatchKg} kg
                          </span>
                          <span className="text-[11px] text-[#567B34]">
                            Pressage individuel
                          </span>
                        </div>

                        <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DEC9]">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#567B34] mb-1">
                            <Droplets className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                            <span>Cuverie & Garde</span>
                          </div>
                          <span className="font-serif text-lg font-bold text-[#18230F] tabular-nums block">
                            {activeModalMill.technicalSpecs.storageCapacityLiters.toLocaleString('fr-FR')} L
                          </span>
                          <span className="text-[11px] text-[#567B34]">
                            Rendement : {activeModalMill.technicalSpecs.avgYieldRange}
                          </span>
                        </div>

                        <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DEC9]">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#567B34] mb-1">
                            <Thermometer className="w-3.5 h-3.5 text-[#AF4D24]" aria-hidden="true" />
                            <span>Malaxage</span>
                          </div>
                          <span className="font-serif text-sm font-bold text-[#18230F] block leading-snug">
                            {activeModalMill.technicalSpecs.malaxationTemp.split('(')[0].trim()}
                          </span>
                          <span className="text-[11px] text-[#567B34]">
                            Contrôle thermique
                          </span>
                        </div>
                      </div>

                      {/* Detailed Equipment & Process Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9]/80 space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#567B34] block">
                            Équipement & Ligne de Trituration
                          </span>
                          <p className="font-semibold text-[#18230F]">
                            {activeModalMill.technicalSpecs.equipmentBrand}
                          </p>
                          <p className="text-[#436229] text-[11px]">
                            {activeModalMill.technicalSpecs.extractionProcess}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9]/80 space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#567B34] block">
                            Stockage & Maîtrise de l'Oxydation
                          </span>
                          <p className="font-semibold text-[#18230F]">
                            {activeModalMill.technicalSpecs.storageType}
                          </p>
                          <p className="text-[#436229] text-[11px]">
                            Température de malaxage : {activeModalMill.technicalSpecs.malaxationTemp}
                          </p>
                        </div>
                      </div>

                      {/* Byproducts Valorization */}
                      <div className="p-3.5 rounded-xl bg-[#F4EEE1] border border-[#E6DEC9] flex items-start gap-2.5 text-xs text-[#233416]">
                        <Recycle className="w-4 h-4 text-[#31491E] shrink-0 mt-0.5" aria-hidden="true" />
                        <div>
                          <span className="font-bold">Économie circulaire (Grignons & Margines) : </span>
                          <span>{activeModalMill.technicalSpecs.byproductsValorization}</span>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Services Spécifiques Proposés par le Moulin */}
                    <div className="mill-print-section bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F] flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-[#E6AB3C]" aria-hidden="true" />
                          <span>Services Spécifiques Proposés aux Oléiculteurs ({activeModalMill.services.length})</span>
                        </h4>
                        <span className="text-[11px] text-[#567B34]">
                          Prestations disponibles sur place
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {activeModalMill.services.map((service, idx) => (
                          <div
                            key={`${activeModalMill.id}-service-${idx}`}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] text-xs text-[#18230F]"
                          >
                            <CheckCircle2
                              className="w-4 h-4 text-[#31491E] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                            <span className="font-medium leading-snug">{service}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 3: Modalités de Campagne & Coordonnées */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Campaign Reception Info */}
                      <div className="mill-print-section bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-3 text-xs text-[#31491E]">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F] flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
                          <span>Modalités de Réception en Campagne</span>
                        </h4>
                        <div className="space-y-2">
                          <p>
                            <strong className="text-[#18230F]">Horaires d'ouverture :</strong>{' '}
                            {activeModalMill.campaignInfo.openingHours}
                          </p>
                          <p>
                            <strong className="text-[#18230F]">Tarif / Dîme de trituration :</strong>{' '}
                            {activeModalMill.campaignInfo.pricingInfo}
                          </p>
                          <p>
                            <strong className="text-[#18230F]">Délai moyen de passage :</strong>{' '}
                            {activeModalMill.campaignInfo.averageWaitTime}
                          </p>
                          <p>
                            <strong className="text-[#18230F]">Réservation :</strong>{' '}
                            <span className="font-semibold text-[#AF4D24]">
                              {activeModalMill.campaignInfo.appointmentRequired
                                ? 'Rendez-vous téléphonique recommandé avant apport'
                                : 'Réception directe selon ordre d’arrivée'}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Contact, Master Miller & Embedded Scannable GPS QR Code */}
                      <div className="mill-print-section bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-3 text-xs text-[#31491E]">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F] flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#E6AB3C]" aria-hidden="true" />
                            <span>Coordonnées, Maître Moulinier & QR GPS</span>
                          </h4>
                          <button
                            type="button"
                            onClick={() => setActiveQrModalMill(activeModalMill)}
                            className="mill-modal-no-print text-[11px] font-bold text-[#31491E] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5 text-[#AF4D24]" aria-hidden="true" />
                            <span>Options QR</span>
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <p>
                              <strong className="text-[#18230F]">Responsable / Contact :</strong>{' '}
                              {activeModalMill.contactPerson}
                            </p>
                            <p>
                              <strong className="text-[#18230F]">Adresse :</strong>{' '}
                              {activeModalMill.address}
                            </p>
                            <p>
                              <strong className="text-[#18230F]">Téléphone direct :</strong>{' '}
                              <a
                                href={`tel:${activeModalMill.phone.split('/')[0].trim()}`}
                                className="text-[#31491E] underline font-bold"
                              >
                                {activeModalMill.phone}
                              </a>
                            </p>
                            <p>
                              <strong className="text-[#18230F]">Coordonnées GPS :</strong>{' '}
                              <span className="font-mono text-[11px] text-[#567B34] tabular-nums">
                                {activeModalMill.lat.toFixed(4)}° N, {activeModalMill.lng.toFixed(4)}° E
                              </span>
                            </p>
                          </div>

                          {/* Scannable QR Code right inside the mill sheet */}
                          <div className="p-2 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] flex flex-col items-center text-center shrink-0 mx-auto sm:mx-0">
                            <div className="p-1.5 bg-white rounded-xl border border-[#31491E]/15">
                              <MillQrSvg
                                value={buildMillMobileMapUrl(activeModalMill, 'google_pin', userLocation)}
                                size={96}
                                fgColor="#18230F"
                                bgColor="#FFFFFF"
                                title={`Scanner pour ouvrir ${activeModalMill.name} sur Maps`}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-[#18230F] mt-1">
                              Scanner pour GPS
                            </span>
                          </div>
                        </div>

                        <div className="mill-modal-no-print pt-2 flex flex-wrap items-center gap-2">
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${activeModalMill.lat},${activeModalMill.lng}&travelmode=driving`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#18230F] text-xs font-bold border border-[#8CBE5D]/50 transition-colors"
                            title={`Calculer l'itinéraire Google Maps vers ${activeModalMill.name} (${activeModalMill.lat}, ${activeModalMill.lng})`}
                          >
                            <Navigation className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                            <span>Itinéraire Google Maps</span>
                            <ExternalLink className="w-3 h-3 text-[#567B34]" aria-hidden="true" />
                          </a>
                          <button
                            type="button"
                            onClick={() => setActiveQrModalMill(activeModalMill)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EEE1] text-[#233416] text-xs font-bold border border-[#E6DEC9] transition-colors cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5 text-[#AF4D24]" aria-hidden="true" />
                            <span>QR Mobile / Waze / PNG</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveModalMill(null);
                              const mapEl = document.getElementById('carte-interactive');
                              if (mapEl) {
                                mapEl.scrollIntoView({ behavior: 'smooth' });
                              }
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EEE1] text-[#31491E] text-xs font-bold border border-[#E6DEC9] transition-colors cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#AF4D24]" aria-hidden="true" />
                            <span>Voir sur la carte SIG</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Print-only Farmer Field Notes & Batch Tracking Box */}
                    <div className="print-only-mill-block hidden mill-print-section p-4 rounded-xl border border-[#18230F] bg-white space-y-2 text-xs text-[#18230F]">
                      <div className="font-bold uppercase tracking-wider text-[11px] border-b border-gray-300 pb-1">
                        Cadre réservé à l'oléiculteur — Suivi du lot d'olives apporté au moulin
                      </div>
                      <div className="grid grid-cols-4 gap-3 pt-1 text-[11px]">
                        <div className="border border-gray-300 rounded p-2">
                          <span className="font-bold block text-gray-600">Date & Heure de dépôt :</span>
                          <div className="h-5" />
                        </div>
                        <div className="border border-gray-300 rounded p-2">
                          <span className="font-bold block text-gray-600">Poids net apporté (kg / qx) :</span>
                          <div className="h-5" />
                        </div>
                        <div className="border border-gray-300 rounded p-2">
                          <span className="font-bold block text-gray-600">Volume d'huile obtenu (L) :</span>
                          <div className="h-5" />
                        </div>
                        <div className="border border-gray-300 rounded p-2">
                          <span className="font-bold block text-gray-600">Rendement (%) & Lot n° :</span>
                          <div className="h-5" />
                        </div>
                      </div>
                    </div>

                    <div className="mill-modal-no-print p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-amber-950 font-medium">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                        <span>Vous avez déjà fait presser vos olives dans ce moulin ? Partagez votre retour sur le rendement et l'accueil.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalTab('reviews')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                      >
                        Consulter / Donner un avis ({activeMillStats.totalReviews})
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 2: Avis & Notations */}
                {modalTab === 'reviews' && (
                  <div className="mill-modal-no-print animate-in fade-in duration-150">
                    <MillReviewsSection
                      mill={activeModalMill}
                      stats={activeMillStats}
                      reviews={reviews}
                      onReviewAdded={refreshReviews}
                    />
                  </div>
                )}

                {/* Modal Footer */}
                <div className="mill-modal-no-print flex flex-wrap gap-3 pt-2 border-t border-[#E6DEC9]">
                  <a
                    href={`tel:${activeModalMill.phone.split('/')[0].trim()}`}
                    className="flex-1 min-w-[180px] py-3 px-4 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Phone className="w-4 h-4 text-[#E6AB3C]" />
                    <span>Appeler l'huilerie</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeModalMill.lat},${activeModalMill.lng}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[160px] py-3 px-4 rounded-xl bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#18230F] border border-[#8CBE5D]/60 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-xs"
                    title={`Ouvrir l'itinéraire Google Maps vers les coordonnées GPS ${activeModalMill.lat}, ${activeModalMill.lng}`}
                  >
                    <Navigation className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
                    <span>Itinéraire</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#567B34]" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    onClick={handlePrintMillSheet}
                    className="py-3 px-4 rounded-xl bg-white border border-[#E6DEC9] hover:border-[#31491E] hover:bg-[#FAF7F2] text-[#18230F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    title="Imprimer la fiche complète de l'huilerie (format A4 optimisé)"
                  >
                    <Printer className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
                    <span>Imprimer la fiche</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModalMill(null)}
                    className="py-3 px-5 rounded-xl bg-white border border-[#E6DEC9] hover:bg-gray-50 text-[#18230F] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dedicated GPS QR Code Modal for Scanning & Downloading */}
        {activeQrModalMill && (
          <MillQrCodeModal
            mill={activeQrModalMill}
            userOrigin={userLocation}
            onClose={() => setActiveQrModalMill(null)}
          />
        )}

        {/* Camera QR Code Scanner Modal to Scan Physical Huilerie Codes */}
        {isQrScannerOpen && (
          <MillQrScannerModal
            onClose={() => setIsQrScannerOpen(false)}
            onSelectMillDetails={(mill) => {
              setIsQrScannerOpen(false);
              setLastScannedMill(mill);
              window.dispatchEvent(
                new CustomEvent('adoio:focus-mill-on-map', {
                  detail: { millId: mill.id },
                })
              );
              handleOpenMill(mill, 'info');
            }}
            onLocateMillOnMap={(mill) => {
              setIsQrScannerOpen(false);
              setLastScannedMill(mill);
              window.dispatchEvent(
                new CustomEvent('adoio:focus-mill-on-map', {
                  detail: { millId: mill.id },
                })
              );
              const mapEl = document.getElementById('carte-interactive');
              if (mapEl) {
                mapEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        )}
      </div>
    </section>
  );
};

