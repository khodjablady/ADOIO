import React, { useEffect, useRef, useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  BEJAIA_COMMUNES_DATA,
  REPRESENTATIVE_MILLS,
  BEJAIA_COLLECTION_POINTS,
  CommuneStat,
  OliveMill,
  CollectionPoint,
} from '../data/bejaiaOliveData';
import {
  MapPin,
  Layers,
  Phone,
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  Award,
  Info,
  ChevronDown,
  ChevronUp,
  Scale,
  Clock,
  Navigation,
  Route,
  LocateFixed,
  Car,
  Globe,
  Mountain,
  Map as MapIcon,
} from 'lucide-react';

// Distance calculation fallback (Haversine formula in km)
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export type OliveIconVariant =
  | 'bassin-branch'
  | 'adoio-wreath'
  | 'mill-modern'
  | 'mill-traditional'
  | 'mill-domaine'
  | 'mill-cooperative'
  | 'collection-harvest';

// Custom SVG Olive-Themed Icons reflecting the agricultural identity of Béjaïa (Azemmur & Zzit Uzemmur)
const OliveThemeIcon: React.FC<{ variant: OliveIconVariant; className?: string }> = ({
  variant,
  className = 'w-4 h-4',
}) => {
  switch (variant) {
    case 'bassin-branch':
      // Botanical Olive Branch with Leaves & Drupes (Verger / Zone de culture)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M3.5 19.5C8.5 15.5 14 10.5 20.5 4.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <path
            d="M14.5 9.5C13.5 6.3 10.2 5.2 7.5 6.8C9.1 9.5 11.8 10.5 14.5 9.5Z"
            fill="currentColor"
          />
          <path
            d="M18.5 6.2C17.8 3.5 15 2.7 12.6 4C13.9 6.3 16.2 7.1 18.5 6.2Z"
            fill="currentColor"
          />
          <path
            d="M11 13C12.2 15.8 15.3 16.9 18 15.3C16.4 12.7 13.7 11.9 11 13Z"
            fill="currentColor"
          />
          <ellipse cx="9.2" cy="14.8" rx="2.4" ry="3.1" transform="rotate(-28 9.2 14.8)" fill="#E6AB3C" />
          <ellipse cx="14.8" cy="10.2" rx="2" ry="2.6" transform="rotate(24 14.8 10.2)" fill="#8CBE5D" />
        </svg>
      );

    case 'adoio-wreath':
      // Golden Olive Wreath & Crowned Olive Drupe (Siège ADOIO Seddouk)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M7 19C4.2 16.2 3.5 11.5 5.8 7.5C7 5.5 8.8 4.2 10.5 3.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M17 19C19.8 16.2 20.5 11.5 18.2 7.5C17 5.5 15.2 4.2 13.5 3.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <ellipse cx="12" cy="12.5" rx="3.4" ry="4.4" fill="#FAF7F2" />
          <circle cx="12" cy="11.2" r="1.2" fill="#B47A16" />
          <path d="M5.5 12.5L3.5 11M18.5 12.5L20.5 11M6.8 8.5L5 7M17.2 8.5L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'mill-modern':
      // Olive Oil Golden Drop + Botanical Leaf & Millstone Gear (Huilerie Moderne Continue)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3.2C12 3.2 6.2 10.1 6.2 14.5C6.2 17.8 8.8 20.5 12 20.5C15.2 20.5 17.8 17.8 17.8 14.5C17.8 10.1 12 3.2 12 3.2Z"
            fill="#E6AB3C"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12.2 8.5C14.8 8.5 16.5 6.4 16.8 4C14.3 4.2 12.4 5.9 12.2 8.5Z"
            fill="currentColor"
          />
          <circle cx="12" cy="14.8" r="2.7" stroke="#18230F" strokeWidth="1.5" fill="#FAF7F2" />
          <circle cx="12" cy="14.8" r="0.9" fill="#18230F" />
        </svg>
      );

    case 'mill-traditional':
      // Traditional Kabyle Millstone & Terracotta Olive Amphora (Taâssart / Presse Traditionnelle)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M9 3.5H15M10 3.5V6.2C7.6 7.5 6.5 10.2 6.8 13.2C7.1 16.5 9.2 19.5 12 20.5C14.8 19.5 16.9 16.5 17.2 13.2C17.5 10.2 16.4 7.5 14 6.2V3.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.8 9C5 8.8 4 10.2 4.5 11.8C5 13 6.2 13.4 7 13.2M17.2 9C19 8.8 20 10.2 19.5 11.8C19 13 17.8 13.4 17 13.2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <ellipse cx="12" cy="12.8" rx="2.3" ry="3" fill="#E6AB3C" />
          <path d="M12 9.5C13.2 8.3 14.8 8.3 15.4 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );

    case 'mill-domaine':
      // Estate Olive Branch & Medallion Droplet (Domaine Oléicole Intégré)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3.5L14.1 7.6L18.6 8.2L15.3 11.4L16.1 15.9L12 13.7L7.9 15.9L8.7 11.4L5.4 8.2L9.9 7.6L12 3.5Z"
            fill="#FAF7F2"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <ellipse cx="12" cy="10.8" rx="2.1" ry="2.8" fill="#31491E" />
          <path
            d="M6.5 19.2C9.5 17.6 14.5 17.6 17.5 19.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'mill-cooperative':
      // Cooperative Twin Olive Branches & Shared Olive Drupes
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4.5 17.5C6.5 12.5 10 8.5 16.5 5.5M19.5 17.5C17.5 12.5 14 8.5 7.5 5.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <ellipse cx="9.5" cy="13.5" rx="2.2" ry="2.9" transform="rotate(-18 9.5 13.5)" fill="#E6AB3C" />
          <ellipse cx="14.5" cy="13.5" rx="2.2" ry="2.9" transform="rotate(18 14.5 13.5)" fill="#8CBE5D" />
          <circle cx="12" cy="7.5" r="2" fill="#FAF7F2" />
        </svg>
      );

    case 'collection-harvest':
      // Olive Harvest Basket / Crate with Olives & Weighing Beam (Point de Collecte)
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4.5 11.5H19.5L17.8 19.2C17.6 20 16.9 20.5 16 20.5H8C7.1 20.5 6.4 20 6.2 19.2L4.5 11.5Z"
            fill="#FAF7F2"
             fillOpacity="0.22"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <ellipse cx="9" cy="9.2" rx="2.1" ry="2.6" transform="rotate(-15 9 9.2)" fill="#8CBE5D" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="12.5" cy="8.5" rx="2.2" ry="2.8" fill="#31491E" stroke="currentColor" strokeWidth="1.2" />
          <ellipse cx="15.5" cy="9.5" rx="2" ry="2.5" transform="rotate(18 15.5 9.5)" fill="#E6AB3C" stroke="currentColor" strokeWidth="1.2" />
          <path d="M8.5 15.5H15.5M12 13.5V17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
  }
};

// Sculpted Olive-Themed Teardrop Pin for Map Markers
const OliveMapPin: React.FC<{
  color: string;
  accentColor?: string;
  variant: OliveIconVariant;
  isSelected?: boolean;
}> = ({ color, accentColor = '#E6AB3C', variant, isSelected = false }) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group-hover:-translate-y-1 group-hover:scale-120 ${
        isSelected ? '-translate-y-1 scale-125' : ''
      }`}
    >
      {/* Decorative top olive leaf sprig on pin */}
      <svg
        viewBox="0 0 28 12"
        className="w-6 h-2.5 -mb-1 z-20 drop-shadow-xs pointer-events-none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M14 10C10.5 9.2 7.5 6.5 6.5 2.5C10.2 3.2 12.8 5.8 14 10Z"
          fill="#8CBE5D"
          stroke="#FFFFFF"
          strokeWidth="1"
        />
        <path
          d="M14 10C17.5 9.2 20.5 6.5 21.5 2.5C17.8 3.2 15.2 5.8 14 10Z"
          fill="#567B34"
          stroke="#FFFFFF"
          strokeWidth="1"
        />
      </svg>

      {/* Main Sculpted Olive Drop Pin Body */}
      <div className="relative w-9 h-11 flex items-center justify-center">
        <svg
          viewBox="0 0 36 44"
          className="w-full h-full drop-shadow-md"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M18 2C9.16 2 2 9.16 2 18C2 28.2 14.8 39.4 17.1 41.3C17.6 41.7 18.4 41.7 18.9 41.3C21.2 39.4 34 28.2 34 18C34 9.16 26.84 2 18 2Z"
            fill={color}
            stroke={isSelected ? accentColor : '#FFFFFF'}
            strokeWidth={isSelected ? '3' : '2.2'}
          />
          <circle
            cx="18"
            cy="17.5"
            r="11.5"
            fill="#18230F"
            fillOpacity="0.22"
            stroke={accentColor}
            strokeOpacity={isSelected ? '0.95' : '0.55'}
            strokeWidth="1.2"
          />
        </svg>

        {/* Inner Botanical / Olive Mill Icon */}
        <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-5 h-5 flex items-center justify-center text-white">
          <OliveThemeIcon variant={variant} className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
};

// Camera Controller for smooth Google Maps programmatic pan & zoom
interface MapCameraControllerProps {
  targetCenter: { lat: number; lng: number } | null;
  targetZoom: number | null;
  focusTrigger: number;
  resetTrigger: number;
  initialCenter: { lat: number; lng: number };
  initialZoom: number;
}

const MapCameraController: React.FC<MapCameraControllerProps> = ({
  targetCenter,
  targetZoom,
  focusTrigger,
  resetTrigger,
  initialCenter,
  initialZoom,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !targetCenter) return;
    map.panTo(targetCenter);
    if (typeof targetZoom === 'number') {
      const currentZoom = map.getZoom();
      if (currentZoom !== targetZoom) {
        map.setZoom(targetZoom);
      }
    }
  }, [map, targetCenter, targetZoom, focusTrigger]);

  useEffect(() => {
    if (!map || resetTrigger === 0) return;
    map.panTo(initialCenter);
    map.setZoom(initialZoom);
  }, [map, resetTrigger, initialCenter, initialZoom]);

  return null;
};

// Modern Google Maps Routes API Polyline & Viewport Renderer
// Reference: https://developers.google.com/maps/documentation/javascript/routes?utm_campaign=gmp_mcp_codeassist_v1_aistudio
interface RouteRendererProps {
  origin: { lat: number; lng: number } | null;
  destinationMill: OliveMill | null;
  onRouteCalculated: (info: { millName: string; distanceKm: number; durationMin: number } | null) => void;
}

interface MapPolylineInstance {
  setMap: (map: unknown) => void;
  setOptions: (options: Record<string, unknown>) => void;
}

const RouteRenderer: React.FC<RouteRendererProps> = ({
  origin,
  destinationMill,
  onRouteCalculated,
}) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<MapPolylineInstance[]>([]);

  useEffect(() => {
    // Cleanup previous polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    if (!map || !origin || !destinationMill) {
      return;
    }

    const fallbackDist = calculateDistanceKm(
      origin.lat,
      origin.lng,
      destinationMill.lat,
      destinationMill.lng
    );
    const fallbackDuration = Math.max(5, Math.round((fallbackDist / 45) * 60));

    if (!routesLib || !(routesLib as any).Route) {
      onRouteCalculated({
        millName: destinationMill.name,
        distanceKm: fallbackDist,
        durationMin: fallbackDuration,
      });
      return;
    }

    const request = {
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destinationMill.lat, lng: destinationMill.lng },
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    };

    ((routesLib as any).Route as any)
      .computeRoutes(request)
      .then(({ routes }: { routes?: any[] }) => {
        const primaryRoute = routes?.[0];
        if (!primaryRoute) {
          onRouteCalculated({
            millName: destinationMill.name,
            distanceKm: fallbackDist,
            durationMin: fallbackDuration,
          });
          return;
        }

        if (typeof primaryRoute.createPolylines === 'function') {
          const newPolylines: MapPolylineInstance[] = primaryRoute.createPolylines();
          newPolylines.forEach((polyline: MapPolylineInstance) => {
            polyline.setOptions({
              strokeColor: '#31491E',
              strokeWeight: 5,
              strokeOpacity: 0.9,
            });
            polyline.setMap(map);
          });
          polylinesRef.current = newPolylines;
        }

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport, 60);
        }

        const distanceKm = primaryRoute.distanceMeters
          ? Math.round((primaryRoute.distanceMeters / 1000) * 10) / 10
          : fallbackDist;
        const durationMin = primaryRoute.durationMillis
          ? Math.max(1, Math.round(primaryRoute.durationMillis / 60000))
          : fallbackDuration;

        onRouteCalculated({
          millName: destinationMill.name,
          distanceKm,
          durationMin,
        });
      })
      .catch((err: unknown) => {
        const errMsg = String(err);
        if (
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('OVER_QUERY_LIMIT') ||
          errMsg.includes('OverQuota') ||
          errMsg.includes('429')
        ) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onRouteCalculated({
          millName: destinationMill.name,
          distanceKm: fallbackDist,
          durationMin: fallbackDuration,
        });
      });

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, routesLib, origin, destinationMill]);

  return null;
};

interface InteractiveOliveMapProps {
  onSelectMill?: (mill: OliveMill) => void;
}

export const InteractiveOliveMap: React.FC<InteractiveOliveMapProps> = ({ onSelectMill }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const [activeLayer, setActiveLayer] = useState<'all' | 'mills' | 'zones_culture' | 'points_collecte'>('all');
  const [selectedMillType, setSelectedMillType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mapTypeId, setMapTypeId] = useState<'terrain' | 'roadmap' | 'hybrid' | 'satellite'>('terrain');
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [routeOrigin, setRouteOrigin] = useState<{ lat: number; lng: number } | null>(null);
  const [routeTargetMill, setRouteTargetMill] = useState<OliveMill | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ millName: string; distanceKm: number; durationMin: number } | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(true);
  const [cameraTarget, setCameraTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [cameraZoom, setCameraZoom] = useState<number | null>(null);
  const [focusCounter, setFocusCounter] = useState<number>(0);
  const [resetCounter, setResetCounter] = useState<number>(0);

  const [selectedItem, setSelectedItem] = useState<{
    type: 'commune' | 'mill' | 'collection_point';
    data: CommuneStat | OliveMill | CollectionPoint;
  } | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);

  // Initial center on Béjaïa Soummam Valley
  const INITIAL_CENTER = { lat: 36.58, lng: 4.68 };
  const INITIAL_ZOOM = 10;
  const MILL_FOCUS_ZOOM = 15;

  // Center and zoom the map onto a specific mill marker
  const focusOnMill = (mill: OliveMill, zoomLevel = MILL_FOCUS_ZOOM) => {
    setSelectedItem({ type: 'mill', data: mill });
    setInfoWindowOpen(true);
    setCameraTarget({ lat: mill.lat, lng: mill.lng });
    setCameraZoom(zoomLevel);
    setFocusCounter((c) => c + 1);
    if (onSelectMill) onSelectMill(mill);
  };

  // Filtered datasets
  const filteredCommunes =
    activeLayer === 'all' || activeLayer === 'zones_culture'
      ? BEJAIA_COMMUNES_DATA.filter(
          (c) =>
            c.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.daira.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  const filteredMills =
    activeLayer === 'all' || activeLayer === 'mills'
      ? REPRESENTATIVE_MILLS.filter((mill) => {
          const matchesSearch =
            mill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mill.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mill.brands.some((b) => b.toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesType = selectedMillType === 'all' || mill.type === selectedMillType;
          return matchesSearch && matchesType;
        })
      : [];

  const filteredCPs =
    activeLayer === 'all' || activeLayer === 'points_collecte'
      ? BEJAIA_COLLECTION_POINTS.filter(
          (cp) =>
            cp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cp.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cp.daira.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cp.manager.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

  // Request user geolocation and optionally calculate Google Maps route to mill
  const locateUser = (targetMill?: OliveMill) => {
    if (!navigator.geolocation) {
      if (targetMill) {
        // Fallback origin: Seddouk (ADOIO HQ) if geolocation unavailable
        const seddoukOrigin = { lat: 36.5472, lng: 4.6861 };
        setRouteOrigin(seddoukOrigin);
        setRouteTargetMill(targetMill);
      }
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userCoords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(userCoords);
        const originObj = { lat: userCoords[0], lng: userCoords[1] };

        if (targetMill) {
          setRouteOrigin(originObj);
          setRouteTargetMill(targetMill);
        } else {
          setCameraTarget(originObj);
          setCameraZoom(13);
          setFocusCounter((c) => c + 1);
        }
      },
      () => {
        setIsLocating(false);
        if (targetMill) {
          // Use Seddouk (Siège ADOIO) as default reference point in Béjaïa if GPS permission is declined
          const seddoukOrigin = { lat: 36.5472, lng: 4.6861 };
          setRouteOrigin(seddoukOrigin);
          setRouteTargetMill(targetMill);
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Center on a specific commune
  const zoomToCommune = (communeName: string) => {
    const commune = BEJAIA_COMMUNES_DATA.find((c) => c.commune === communeName);
    if (commune) {
      setSelectedItem({ type: 'commune', data: commune });
      setInfoWindowOpen(true);
      setCameraTarget({ lat: commune.lat, lng: commune.lng });
      setCameraZoom(12);
      setFocusCounter((c) => c + 1);
    }
  };

  // Center on Seddouk (ADOIO Headquarters)
  const zoomToSeddouk = () => {
    zoomToCommune('Seddouk');
  };

  // Reset View to Wilaya overview
  const resetView = () => {
    setSelectedItem(null);
    setInfoWindowOpen(false);
    setSearchTerm('');
    setRouteOrigin(null);
    setRouteTargetMill(null);
    setRouteInfo(null);
    setCameraTarget(null);
    setCameraZoom(null);
    setResetCounter((c) => c + 1);
  };

  return (
    <section id="carte-interactive" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <MapPin className="w-4 h-4 text-[#E6AB3C]" />
              <span>Google Maps Platform · Cartographie Géographique & SIG Oléicole</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              Carte Google Maps du Bassin Oléicole de Béjaïa
            </h2>
            <p className="mt-2 text-sm text-[#436229] max-w-2xl leading-relaxed">
              Explorez sur Google Maps (Relief, Satellite ou Hybride) la répartition géographique des bassins oléicoles majeurs, des huileries enregistrées et des points de collecte dans la wilaya de Béjaïa.
            </p>
          </div>

          {/* Quick Stats overview badge */}
          <div className="flex items-center gap-2 bg-[#E8F4D9] px-3.5 py-2 rounded-xl border border-[#8CBE5D]/40 text-xs font-semibold text-[#233416]">
            <span>12 Bassins Majeurs</span>
            <span className="text-[#8CBE5D]">·</span>
            <span>448 Huileries</span>
            <span className="text-[#8CBE5D]">·</span>
            <span className="text-[#B47A16] font-bold">Google Maps SIG</span>
          </div>
        </div>

        {/* Thematic Filter Bar Above the Map */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#E6DEC9] shadow-sm mb-6 space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Primary Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#18230F] mr-1 hidden sm:inline-flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#E6AB3C]" />
                Afficher :
              </span>

              {/* Tous les repères */}
              <button
                type="button"
                onClick={() => setActiveLayer('all')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeLayer === 'all'
                    ? 'bg-[#18230F] text-white shadow-md scale-[1.02]'
                    : 'bg-[#FAF7F2] text-[#436229] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#E6AB3C]" />
                <span>Tous les repères</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeLayer === 'all' ? 'bg-white/20 text-white' : 'bg-[#E6DEC9] text-[#18230F]'
                  }`}
                >
                  {BEJAIA_COMMUNES_DATA.length + REPRESENTATIVE_MILLS.length + BEJAIA_COLLECTION_POINTS.length}
                </span>
              </button>

              {/* Moulins */}
              <button
                type="button"
                onClick={() => setActiveLayer('mills')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeLayer === 'mills'
                    ? 'bg-[#31491E] text-white shadow-md scale-[1.02]'
                    : 'bg-[#FAF7F2] text-[#31491E] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                }`}
              >
                <OliveThemeIcon variant="mill-modern" className="w-4 h-4 text-[#E6AB3C]" />
                <span>Moulins</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeLayer === 'mills' ? 'bg-white/20 text-white' : 'bg-[#E8F4D9] text-[#233416]'
                  }`}
                >
                  {REPRESENTATIVE_MILLS.length}
                </span>
              </button>

              {/* Zones de culture */}
              <button
                type="button"
                onClick={() => setActiveLayer('zones_culture')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeLayer === 'zones_culture'
                    ? 'bg-[#233416] text-white shadow-md scale-[1.02]'
                    : 'bg-[#FAF7F2] text-[#233416] hover:bg-[#E8F4D9] border border-[#E6DEC9]'
                }`}
              >
                <OliveThemeIcon variant="bassin-branch" className="w-4 h-4 text-[#8CBE5D]" />
                <span>Zones de culture</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeLayer === 'zones_culture' ? 'bg-white/20 text-white' : 'bg-[#E8F4D9] text-[#233416]'
                  }`}
                >
                  {BEJAIA_COMMUNES_DATA.length}
                </span>
              </button>

              {/* Points de collecte */}
              <button
                type="button"
                onClick={() => setActiveLayer('points_collecte')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeLayer === 'points_collecte'
                    ? 'bg-[#B45309] text-white shadow-md scale-[1.02]'
                    : 'bg-[#FAF7F2] text-[#B45309] hover:bg-[#FEF5DB] border border-[#E6DEC9]'
                }`}
              >
                <OliveThemeIcon variant="collection-harvest" className="w-4 h-4 text-[#E6AB3C]" />
                <span>Points de collecte</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeLayer === 'points_collecte' ? 'bg-white/20 text-white' : 'bg-[#FEF5DB] text-[#B47A16]'
                  }`}
                >
                  {BEJAIA_COLLECTION_POINTS.length}
                </span>
              </button>
            </div>

            {/* Search Input, Map Mode Switcher & Geolocation Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-52">
                <Search className="w-3.5 h-3.5 text-[#6F9D44] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher moulin, bassin..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2]"
                />
              </div>

              {activeLayer === 'mills' && (
                <select
                  value={selectedMillType}
                  onChange={(e) => setSelectedMillType(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-medium text-[#18230F]"
                >
                  <option value="all">Tous types</option>
                  <option value="modern">Continu (Inox)</option>
                  <option value="traditional">Traditionnel</option>
                  <option value="domaine">Domaine</option>
                  <option value="cooperative">Coopérative</option>
                </select>
              )}

              {/* Google Maps Type Selector */}
              <div className="inline-flex items-center rounded-xl border border-[#E6DEC9] bg-[#FAF7F2] p-0.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setMapTypeId('terrain')}
                  className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                    mapTypeId === 'terrain'
                      ? 'bg-[#31491E] text-white shadow-2xs'
                      : 'text-[#436229] hover:text-[#18230F]'
                  }`}
                  title="Vue Relief & Topographie"
                >
                  <Mountain className="w-3 h-3" />
                  <span>Relief</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMapTypeId('hybrid')}
                  className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                    mapTypeId === 'hybrid'
                      ? 'bg-[#31491E] text-white shadow-2xs'
                      : 'text-[#436229] hover:text-[#18230F]'
                  }`}
                  title="Vue Satellite Hybride avec routes"
                >
                  <Globe className="w-3 h-3" />
                  <span>Satellite</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMapTypeId('roadmap')}
                  className={`px-2 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                    mapTypeId === 'roadmap'
                      ? 'bg-[#31491E] text-white shadow-2xs'
                      : 'text-[#436229] hover:text-[#18230F]'
                  }`}
                  title="Plan routier Google Maps"
                >
                  <MapIcon className="w-3 h-3" />
                  <span>Plan</span>
                </button>
              </div>

              {/* Geolocation Button */}
              <button
                type="button"
                onClick={() => locateUser()}
                className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 flex items-center gap-1.5 text-xs font-semibold ${
                  userLocation
                    ? 'bg-[#E8F4D9] border-[#8CBE5D] text-[#233416] shadow-2xs'
                    : 'bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border-[#E6DEC9]'
                }`}
                title={userLocation ? 'Position GPS active' : 'Détecter ma position actuelle'}
              >
                <LocateFixed
                  className={`w-3.5 h-3.5 ${
                    isLocating ? 'animate-spin text-[#E6AB3C]' : userLocation ? 'text-[#567B34]' : 'text-[#31491E]'
                  }`}
                />
                <span className="hidden sm:inline">
                  {isLocating ? 'Recherche GPS...' : userLocation ? 'GPS actif' : 'Ma position'}
                </span>
              </button>

              <button
                onClick={resetView}
                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] transition-colors cursor-pointer shrink-0"
                title="Recentrer la carte Google Maps"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Commune Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E6DEC9] text-xs">
            <span className="font-bold text-[#18230F] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#E6AB3C]" />
              Accès rapide :
            </span>
            <button
              onClick={zoomToSeddouk}
              className="px-2.5 py-1 rounded-lg bg-[#FEF5DB] border border-[#E6AB3C]/40 text-[#B47A16] font-bold hover:bg-[#E6AB3C] hover:text-white hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              ⭐ Seddouk (Siège ADOIO)
            </button>
            {['Akbou', 'Tazmalt', 'Sidi Aïch', 'El Kseur', 'Amizour', 'Adekar', 'Ouzellaguen'].map((c) => (
              <button
                key={c}
                onClick={() => zoomToCommune(c)}
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9] text-[#242A20] font-medium hover:border-[#8CBE5D] hover:bg-[#E8F4D9] hover:scale-105 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container + Details Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Interactive Google Maps Container */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E6DEC9] p-3 shadow-sm relative overflow-hidden flex flex-col min-h-[540px]">
            {/* Google Maps Canvas */}
            <div className="w-full h-[500px] rounded-2xl overflow-hidden relative z-10 border border-[#E6DEC9]/60">
              <APIProvider apiKey={apiKey} language="fr" region="DZ">
                <Map
                  style={{ width: '100%', height: '100%' }}
                  defaultCenter={INITIAL_CENTER}
                  defaultZoom={INITIAL_ZOOM}
                  mapId="DEMO_MAP_ID"
                  mapTypeId={mapTypeId}
                  gestureHandling="greedy"
                  mapTypeControl={false}
                  streetViewControl={true}
                  fullscreenControl={true}
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                >
                  <MapCameraController
                    targetCenter={cameraTarget}
                    targetZoom={cameraZoom}
                    focusTrigger={focusCounter}
                    resetTrigger={resetCounter}
                    initialCenter={INITIAL_CENTER}
                    initialZoom={INITIAL_ZOOM}
                  />

                  <RouteRenderer
                    origin={routeOrigin}
                    destinationMill={routeTargetMill}
                    onRouteCalculated={setRouteInfo}
                  />

                  {/* 1. Communes / Zones de culture Markers */}
                  {filteredCommunes.map((commune) => {
                    const isSeddouk = commune.commune === 'Seddouk';
                    const markerId = `commune-${commune.commune}`;
                    const isHovered = hoveredMarkerId === markerId;
                    const isSelected =
                      selectedItem?.type === 'commune' &&
                      (selectedItem.data as CommuneStat).commune === commune.commune;
                    const showTooltip = isHovered && !(isSelected && infoWindowOpen);

                    return (
                      <AdvancedMarker
                        key={markerId}
                        position={{ lat: commune.lat, lng: commune.lng }}
                        clickable={true}
                        title={`Bassin Oléicole de ${commune.commune} (${(
                          commune.avgProductionLiters / 1000000
                        ).toFixed(1)}M L)`}
                        zIndex={isHovered ? 100 : isSelected ? 40 : isSeddouk ? 30 : 20}
                        onClick={() => {
                          setSelectedItem({ type: 'commune', data: commune });
                          setInfoWindowOpen(true);
                          setCameraTarget({ lat: commune.lat, lng: commune.lng });
                          setCameraZoom(12);
                          setFocusCounter((c) => c + 1);
                        }}
                      >
                        <div
                          onMouseEnter={() => setHoveredMarkerId(markerId)}
                          onMouseLeave={() =>
                            setHoveredMarkerId((prev) => (prev === markerId ? null : prev))
                          }
                          onFocus={() => setHoveredMarkerId(markerId)}
                          onBlur={() =>
                            setHoveredMarkerId((prev) => (prev === markerId ? null : prev))
                          }
                          aria-label={`Commune de ${commune.commune}`}
                          className="group relative flex items-center justify-center"
                        >
                          {/* Hover Tooltip */}
                          <div
                            role="tooltip"
                            className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 px-3 py-1.5 rounded-xl bg-[#18230F]/95 text-[#FAF7F2] shadow-xl border border-[#8CBE5D]/40 whitespace-nowrap transition-all duration-200 delay-75 ${
                              showTooltip
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-1 scale-95'
                            }`}
                          >
                            <div className="text-[11px] font-bold tracking-wide leading-tight flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8CBE5D] shrink-0" />
                              <span>Commune de {commune.commune}</span>
                            </div>
                            <div className="text-[9px] text-[#E6DEC9]/90 font-medium mt-0.5">
                              Daïra de {commune.daira} · {commune.millsCount} huileries
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#18230F]/95" />
                          </div>

                          <div className="flex flex-col items-center">
                            <div
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[11px] font-bold border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-[#E6AB3C]/80 cursor-pointer whitespace-nowrap ${
                                isSeddouk ? 'bg-[#B47A16]' : 'bg-[#233416]'
                              } ${isSelected ? 'ring-2 ring-[#E6AB3C] scale-110' : ''}`}
                            >
                              <span className="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center shrink-0">
                                <OliveThemeIcon
                                  variant={isSeddouk ? 'adoio-wreath' : 'bassin-branch'}
                                  className="w-3.5 h-3.5 text-white"
                                />
                              </span>
                              <span>{commune.commune}</span>
                              <span className="bg-white/25 rounded px-1 py-0.2 text-[9px] font-extrabold">
                                {(commune.avgProductionLiters / 1000000).toFixed(1)}M L
                              </span>
                            </div>
                            {/* Olive stem pin tip */}
                            <div
                              className={`w-2 h-2 rotate-45 -mt-1 border-r-2 border-b-2 border-white shadow-xs ${
                                isSeddouk ? 'bg-[#B47A16]' : 'bg-[#233416]'
                              }`}
                            />
                          </div>
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* 2. Olive Mills Markers */}
                  {filteredMills.map((mill) => {
                    const pinColor =
                      mill.type === 'modern'
                        ? '#31491E'
                        : mill.type === 'traditional'
                        ? '#AF4D24'
                        : mill.type === 'domaine'
                        ? '#B47A16'
                        : '#2A52BE';

                    const pinVariant: OliveIconVariant =
                      mill.type === 'modern'
                        ? 'mill-modern'
                        : mill.type === 'traditional'
                        ? 'mill-traditional'
                        : mill.type === 'domaine'
                        ? 'mill-domaine'
                        : 'mill-cooperative';

                    const markerId = `mill-${mill.id}`;
                    const isHovered = hoveredMarkerId === markerId;
                    const isSelected =
                      selectedItem?.type === 'mill' && (selectedItem.data as OliveMill).id === mill.id;
                    const showTooltip = isHovered && !(isSelected && infoWindowOpen);

                    return (
                      <AdvancedMarker
                        key={markerId}
                        position={{ lat: mill.lat, lng: mill.lng }}
                        clickable={true}
                        title={`${mill.name} (${mill.commune}) — Cliquer pour centrer et zoomer`}
                        zIndex={isHovered ? 100 : isSelected ? 55 : 25}
                        onClick={() => focusOnMill(mill)}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            focusOnMill(mill);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              focusOnMill(mill);
                            }
                          }}
                          onMouseEnter={() => setHoveredMarkerId(markerId)}
                          onMouseLeave={() =>
                            setHoveredMarkerId((prev) => (prev === markerId ? null : prev))
                          }
                          onFocus={() => setHoveredMarkerId(markerId)}
                          onBlur={() =>
                            setHoveredMarkerId((prev) => (prev === markerId ? null : prev))
                          }
                          aria-label={`Centrer la carte sur ${mill.name} (${mill.commune})`}
                          className="group relative flex items-center justify-center focus:outline-none"
                        >
                          {/* Hover Tooltip */}
                          <div
                            role="tooltip"
                            className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 px-3 py-1.5 rounded-xl bg-[#18230F]/95 text-[#FAF7F2] shadow-xl border border-[#E6AB3C]/40 whitespace-nowrap transition-all duration-200 delay-75 ${
                              showTooltip
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-1 scale-95'
                            }`}
                          >
                            <div className="text-[11px] font-bold tracking-wide leading-tight flex items-center gap-1.5">
                              <span
                                className="w-2 h-2 rounded-full border border-white/60 shrink-0"
                                style={{ backgroundColor: pinColor }}
                              />
                              <span>{mill.name}</span>
                            </div>
                            <div className="text-[9px] text-[#E6DEC9]/90 font-medium mt-0.5">
                              Commune de {mill.commune} · {mill.capacityQxPerDay} qx/j
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#18230F]/95" />
                          </div>

                          {/* Pulsing ring when mill is selected and centered */}
                          {isSelected && (
                            <span
                              className="pointer-events-none absolute top-1.5 w-9 h-9 rounded-full opacity-55 animate-ping"
                              style={{ backgroundColor: '#E6AB3C' }}
                            />
                          )}

                          <OliveMapPin
                            color={pinColor}
                            variant={pinVariant}
                            isSelected={isSelected}
                          />
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* 3. Collection Points Markers */}
                  {filteredCPs.map((cp) => {
                    const markerId = `cp-${cp.id}`;
                    const isHovered = hoveredMarkerId === markerId;
                    const isSelected =
                      selectedItem?.type === 'collection_point' &&
                      (selectedItem.data as CollectionPoint).id === cp.id;
                    const showTooltip = isHovered && !(isSelected && infoWindowOpen);

                    return (
                      <AdvancedMarker
                        key={markerId}
                        position={{ lat: cp.lat, lng: cp.lng }}
                        clickable={true}
                        title={`${cp.name} (${cp.commune})`}
                        zIndex={isHovered ? 100 : isSelected ? 45 : 15}
                        onClick={() => {
                          setSelectedItem({ type: 'collection_point', data: cp });
                          setInfoWindowOpen(true);
                          setCameraTarget({ lat: cp.lat, lng: cp.lng });
                          setCameraZoom(14);
                          setFocusCounter((c) => c + 1);
                        }}
                      >
                        <div
                          onMouseEnter={() => setHoveredMarkerId(markerId)}
                          onMouseLeave={() =>
                            setHoveredMarkerId((prev) => (prev === markerId ? null : prev))
                          }
                          onFocus={() => setHoveredMarkerId(markerId)}
                          onBlur={() =>
                            setHoveredMarkerId((prev) => (prev === markerId ? null : prev))
                          }
                          aria-label={`${cp.name} (${cp.commune})`}
                          className="group relative flex items-center justify-center"
                        >
                          {/* Hover Tooltip */}
                          <div
                            role="tooltip"
                            className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 px-3 py-1.5 rounded-xl bg-[#18230F]/95 text-[#FAF7F2] shadow-xl border border-[#D97706]/50 whitespace-nowrap transition-all duration-200 delay-75 ${
                              showTooltip
                                ? 'opacity-100 translate-y-0 scale-100'
                                : 'opacity-0 translate-y-1 scale-95'
                            }`}
                          >
                            <div className="text-[11px] font-bold tracking-wide leading-tight flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                              <span>{cp.name}</span>
                            </div>
                            <div className="text-[9px] text-[#E6DEC9]/90 font-medium mt-0.5">
                              Commune de {cp.commune} · {cp.capacityTonnes} T
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#18230F]/95" />
                          </div>

                          <OliveMapPin
                            color="#D97706"
                            accentColor="#FEF5DB"
                            variant="collection-harvest"
                            isSelected={isSelected}
                          />
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* 4. User GPS Location Marker */}
                  {userLocation && (
                    <AdvancedMarker
                      position={{ lat: userLocation[0], lng: userLocation[1] }}
                      title="Votre position GPS actuelle"
                      zIndex={60}
                    >
                      <div className="relative w-6 h-6 flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-600 rounded-full opacity-40 animate-ping"></div>
                        <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-md"></div>
                      </div>
                    </AdvancedMarker>
                  )}

                  {/* Active InfoWindow on Map */}
                  {selectedItem && infoWindowOpen && (
                    <InfoWindow
                      position={{
                        lat: selectedItem.data.lat,
                        lng: selectedItem.data.lng,
                      }}
                      pixelOffset={[0, -22]}
                      maxWidth={270}
                      disableAutoPan={true}
                      onCloseClick={() => setInfoWindowOpen(false)}
                    >
                      {selectedItem.type === 'commune' ? (
                        (() => {
                          const c = selectedItem.data as CommuneStat;
                          return (
                            <div className="p-1 text-left font-sans">
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#567B34]">
                                {c.commune === 'Seddouk'
                                  ? '⭐ Siège Officiel ADOIO'
                                  : `Bassin Oléicole · Daïra de ${c.daira}`}
                              </div>
                              <div className="text-sm font-bold text-[#18230F] mt-0.5 mb-1.5">
                                Commune de {c.commune}
                              </div>
                              <div className="text-xs text-[#242A20] space-y-0.5">
                                <div>
                                  <strong>Superficie :</strong> {c.hectares.toLocaleString()} ha
                                </div>
                                <div>
                                  <strong>Oliviers :</strong> {c.treesCount.toLocaleString()} arbres
                                </div>
                                <div>
                                  <strong>Huileries :</strong> {c.millsCount} moulins
                                </div>
                                <div>
                                  <strong>Production moy. :</strong>{' '}
                                  {(c.avgProductionLiters / 1000000).toFixed(2)} M Litres
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      ) : selectedItem.type === 'mill' ? (
                        (() => {
                          const m = selectedItem.data as OliveMill;
                          const googleDirUrl = userLocation
                            ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${m.lat},${m.lng}&travelmode=driving`
                            : `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}&travelmode=driving`;
                          return (
                            <div className="p-1 text-left font-sans min-w-[200px]">
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#567B34]">
                                {m.commune} · {m.typeLabel}
                              </div>
                              <div className="text-sm font-bold text-[#18230F] mt-0.5 mb-1">
                                {m.name}
                              </div>
                              <div className="text-xs text-[#31491E] space-y-0.5 mb-2">
                                <div>
                                  Capacité : <strong>{m.capacityQxPerDay} qx/j</strong>
                                </div>
                                <div>
                                  Tél : <strong>{m.phone.split('/')[0]}</strong>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => locateUser(m)}
                                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#31491E] hover:bg-[#233416] text-white text-[11px] font-bold text-center cursor-pointer"
                                >
                                  🧭 Tracer l'itinéraire
                                </button>
                                <button
                                  type="button"
                                  onClick={() => focusOnMill(m, 17)}
                                  className="py-1.5 px-2 rounded-lg bg-[#FEF5DB] text-[#B47A16] border border-[#E6AB3C]/40 text-[11px] font-bold hover:bg-[#E6AB3C] hover:text-white transition-colors cursor-pointer"
                                  title="Zoom rapproché sur le site du moulin"
                                >
                                  🔍 +
                                </button>
                                <a
                                  href={googleDirUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="py-1.5 px-2 rounded-lg bg-[#E8F4D9] text-[#233416] text-[11px] font-bold hover:bg-[#8CBE5D]/40"
                                  title="Ouvrir dans Google Maps"
                                >
                                  GPS
                                </a>
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        (() => {
                          const cp = selectedItem.data as CollectionPoint;
                          return (
                            <div className="p-1 text-left font-sans">
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#D97706]">
                                Point de Collecte · {cp.commune}
                              </div>
                              <div className="text-sm font-bold text-[#18230F] mt-0.5 mb-1">
                                {cp.name}
                              </div>
                              <div className="text-xs text-[#31491E] space-y-0.5">
                                <div>
                                  Capacité : <strong>{cp.capacityTonnes} Tonnes</strong>
                                </div>
                                <div>
                                  Gestion : <strong>{cp.manager}</strong>
                                </div>
                                <div>
                                  Tél : <strong>{cp.phone}</strong>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      )}
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            </div>

            {/* Active Itinerary Banner (Google Maps Routes API) */}
            {routeInfo && (
              <div className="absolute top-6 left-6 z-20 max-w-sm bg-white/95 backdrop-blur-md rounded-2xl border border-[#8CBE5D] shadow-xl p-3 text-xs pointer-events-auto animate-in fade-in">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#E8F4D9] text-[#31491E] flex items-center justify-center shrink-0">
                      <Navigation className="w-4 h-4 text-[#567B34]" />
                    </div>
                    <div>
                      <strong className="block text-[#18230F] font-bold text-xs">{routeInfo.millName}</strong>
                      <span className="text-[#567B34] text-[11px]">
                        Itinéraire Google Maps : <strong>{routeInfo.distanceKm} km</strong> (~{routeInfo.durationMin} min)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRouteOrigin(null);
                      setRouteTargetMill(null);
                      setRouteInfo(null);
                    }}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
                    title="Effacer l'itinéraire"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Floating Stylized Legend */}
            <div className="absolute top-6 right-16 z-20 max-w-[260px] sm:max-w-[280px] transition-all duration-300 pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#E6DEC9] shadow-xl p-3 text-xs text-[#242A20]">
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#E6DEC9]/70">
                  <div className="flex items-center gap-1.5 font-bold text-[#18230F]">
                    <Layers className="w-3.5 h-3.5 text-[#E6AB3C]" />
                    <span className="font-serif text-xs font-bold uppercase tracking-wider">Légende des Repères</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLegendOpen(!isLegendOpen)}
                    className="p-1 rounded-md text-[#567B34] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    title={isLegendOpen ? 'Masquer la légende' : 'Afficher la légende'}
                  >
                    {isLegendOpen ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {isLegendOpen && (
                  <div className="space-y-2 animate-in fade-in-50 duration-200">
                    <div className="text-[10px] text-[#6F9D44] font-bold uppercase tracking-wider">
                      1. Bassins Oléicoles (Azemmur)
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#233416] text-white text-[10px] font-bold border border-white shadow-xs shrink-0">
                          <OliveThemeIcon variant="bassin-branch" className="w-3 h-3 text-white" />
                          <span>Akbou</span>
                        </span>
                        <span className="text-[#31491E]">Rameau d'olivier · Bassin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B47A16] text-white text-[10px] font-bold border border-white shadow-xs shrink-0">
                          <OliveThemeIcon variant="adoio-wreath" className="w-3 h-3 text-white" />
                          <span>Seddouk</span>
                        </span>
                        <span className="text-[#31491E]">Couronne d'olivier · Siège ADOIO</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E6DEC9]/60 text-[10px] text-[#6F9D44] font-bold uppercase tracking-wider">
                      2. Huileries & Moulins (Zzit Uzemmur)
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#31491E] text-white flex items-center justify-center border border-white shadow-xs shrink-0">
                          <OliveThemeIcon variant="mill-modern" className="w-3.5 h-3.5 text-white" />
                        </span>
                        <span>
                          <strong>Goutte d'Or & Meule</strong> · Continu Inox
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#AF4D24] text-white flex items-center justify-center border border-white shadow-xs shrink-0">
                          <OliveThemeIcon variant="mill-traditional" className="w-3.5 h-3.5 text-white" />
                        </span>
                        <span>
                          <strong>Amphore & Taâssart</strong> · Traditionnel
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#B47A16] text-white flex items-center justify-center border border-white shadow-xs shrink-0">
                          <OliveThemeIcon variant="mill-domaine" className="w-3.5 h-3.5 text-white" />
                        </span>
                        <span>
                          <strong>Médaille d'Olivier</strong> · Domaine Intégré
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#2A52BE] text-white flex items-center justify-center border border-white shadow-xs shrink-0">
                          <OliveThemeIcon variant="mill-cooperative" className="w-3.5 h-3.5 text-white" />
                        </span>
                        <span>
                          <strong>Rameaux Croisés</strong> · Coopérative
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E6DEC9]/60 text-[10px] text-[#6F9D44] font-bold uppercase tracking-wider">
                      3. Points de Collecte
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-5 h-5 rounded-full bg-[#D97706] text-white flex items-center justify-center border border-white shadow-xs shrink-0">
                        <OliveThemeIcon variant="collection-harvest" className="w-3.5 h-3.5 text-white" />
                      </span>
                      <span>
                        <strong>Couffin de Récolte</strong> · Collecte & pesage
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Footer Legend Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 text-[11px] text-[#436229]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-4 h-4 rounded-full bg-[#233416] text-white inline-flex items-center justify-center border border-white shadow-xs">
                    <OliveThemeIcon variant="bassin-branch" className="w-2.5 h-2.5 text-white" />
                  </span>
                  Rameau d'olivier (Bassin)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-4 h-4 rounded-full bg-[#31491E] text-white inline-flex items-center justify-center border border-white shadow-xs">
                    <OliveThemeIcon variant="mill-modern" className="w-2.5 h-2.5 text-white" />
                  </span>
                  Moulin Continu (Goutte d'Or)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-4 h-4 rounded-full bg-[#AF4D24] text-white inline-flex items-center justify-center border border-white shadow-xs">
                    <OliveThemeIcon variant="mill-traditional" className="w-2.5 h-2.5 text-white" />
                  </span>
                  Presse Traditionnelle (Amphore)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-4 h-4 rounded-full bg-[#D97706] text-white inline-flex items-center justify-center border border-white shadow-xs">
                    <OliveThemeIcon variant="collection-harvest" className="w-2.5 h-2.5 text-white" />
                  </span>
                  Point de Collecte (Couffin d'olives)
                </span>
              </div>
              <span className="text-gray-400 text-[10px]">
                Google Maps Platform · Données SIG Wilaya de Béjaïa & ADOIO
              </span>
            </div>
          </div>

          {/* Selected Item Detail Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E6DEC9] p-6 shadow-sm flex flex-col justify-between">
            {selectedItem ? (
              selectedItem.type === 'commune' ? (
                (() => {
                  const commune = selectedItem.data as CommuneStat;
                  return (
                    <div className="space-y-5 animate-in fade-in-50 duration-200">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                            Bassin Oléicole
                          </span>
                          <span className="text-[10px] font-mono bg-[#E8F4D9] text-[#233416] px-2 py-0.5 rounded font-bold">
                            Daïra de {commune.daira}
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                          Commune de {commune.commune}
                        </h3>
                        {commune.commune === 'Seddouk' && (
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FEF5DB] text-[#B47A16] text-xs font-bold">
                            <Award className="w-3.5 h-3.5 text-[#E6AB3C]" />
                            <span>Siège Officiel de l'ADOIO</span>
                          </div>
                        )}
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DEC9]">
                          <span className="text-[#6F9D44] block text-[10px] uppercase font-bold">
                            Superficie Oléicole
                          </span>
                          <span className="font-serif text-lg font-bold text-[#18230F]">
                            {commune.hectares.toLocaleString()} ha
                          </span>
                        </div>

                        <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DEC9]">
                          <span className="text-[#6F9D44] block text-[10px] uppercase font-bold">
                            Nombre d'Arbres
                          </span>
                          <span className="font-serif text-lg font-bold text-[#18230F]">
                            {(commune.treesCount / 1000).toFixed(0)}k oliviers
                          </span>
                        </div>

                        <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DEC9]">
                          <span className="text-[#6F9D44] block text-[10px] uppercase font-bold">
                            Huileries Actives
                          </span>
                          <span className="font-serif text-lg font-bold text-[#18230F]">
                            {commune.millsCount} moulins
                          </span>
                        </div>

                        <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DEC9]">
                          <span className="text-[#6F9D44] block text-[10px] uppercase font-bold">
                            Production Moyenne
                          </span>
                          <span className="font-serif text-lg font-bold text-[#E6AB3C]">
                            {(commune.avgProductionLiters / 1000000).toFixed(2)} M L
                          </span>
                        </div>
                      </div>

                      {/* Varieties */}
                      <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DEC9] space-y-1.5">
                        <span className="text-xs font-bold text-[#18230F] block">
                          Variétés dominantes dans ce terroir :
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {commune.mainVarieties.map((v) => (
                            <span
                              key={v}
                              className="px-2 py-0.5 rounded bg-white text-[#233416] text-xs font-semibold border border-[#E6DEC9]"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-[#567B34] bg-[#E8F4D9] p-3 rounded-xl leading-relaxed">
                        🌱 <strong>Spécificité :</strong> Terroir réputé pour la richesse en polyphénols de ses fruits et sa méthode de récolte au filet.
                      </div>
                    </div>
                  );
                })()
              ) : selectedItem.type === 'mill' ? (
                (() => {
                  const mill = selectedItem.data as OliveMill;
                  return (
                    <div className="space-y-5 animate-in fade-in-50 duration-200">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                            Huilerie Enregistrée
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              mill.type === 'modern'
                                ? 'bg-[#E8F4D9] text-[#233416]'
                                : mill.type === 'traditional'
                                ? 'bg-[#FEF5DB] text-[#B47A16]'
                                : 'bg-[#E6DEC9] text-[#18230F]'
                            }`}
                          >
                            {mill.type === 'modern'
                              ? 'Moderne Continu'
                              : mill.type === 'traditional'
                              ? 'Traditionnel'
                              : 'Domaine'}
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                          {mill.name}
                        </h3>
                        <p className="text-xs text-[#567B34] mt-0.5">
                          {mill.commune} · Daïra de {mill.daira}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs text-[#31491E] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DEC9]">
                        <p>
                          <strong>Type d'installation :</strong> {mill.typeLabel}
                        </p>
                        <p>
                          <strong>Capacité de trituration :</strong> {mill.capacityQxPerDay} quintaux / jour
                        </p>
                        <p>
                          <strong>Marques produites :</strong> {mill.brands.join(', ')}
                        </p>
                        <p>
                          <strong>Profil gustatif :</strong> {mill.speciality}
                        </p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="text-[#567B34]">
                          <strong>Maître moulinier / Contact :</strong> {mill.contactPerson}
                        </p>
                        <p className="text-[#567B34]">
                          <strong>Adresse :</strong> {mill.address}
                        </p>
                      </div>

                      {/* Itinéraire Google Maps Routes API */}
                      <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DEC9] space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#18230F] flex items-center gap-1.5">
                            <Navigation className="w-3.5 h-3.5 text-[#E6AB3C]" />
                            <span>Itinéraire Google Maps</span>
                          </span>
                          <span className="text-[10px] font-mono text-[#567B34] bg-white px-2 py-0.5 rounded border border-[#E6DEC9]">
                            {mill.lat.toFixed(4)}°N, {mill.lng.toFixed(4)}°E
                          </span>
                        </div>

                        {userLocation ? (
                          <div className="flex items-center justify-between text-xs text-[#31491E] bg-[#E8F4D9] p-2.5 rounded-lg border border-[#8CBE5D]/30">
                            <span className="flex items-center gap-1.5 font-semibold">
                              <Car className="w-4 h-4 text-[#567B34]" />
                              <span>Depuis votre position :</span>
                            </span>
                            <strong className="font-mono text-xs text-[#18230F]">
                              {calculateDistanceKm(userLocation[0], userLocation[1], mill.lat, mill.lng)} km (~
                              {Math.round(
                                (calculateDistanceKm(userLocation[0], userLocation[1], mill.lat, mill.lng) / 45) * 60
                              )}{' '}
                              min)
                            </strong>
                          </div>
                        ) : (
                          <p className="text-[11px] text-[#567B34] leading-tight">
                            Calcul d'itinéraire routier via Google Maps Routes API depuis votre position GPS (ou depuis Seddouk par défaut).
                          </p>
                        )}

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span className="text-[11px] font-semibold text-[#567B34]">
                            Cadrage sur le site :
                          </span>
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => focusOnMill(mill, 15)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                cameraZoom === 15
                                  ? 'bg-[#31491E] text-white border-[#31491E]'
                                  : 'bg-white text-[#31491E] border-[#E6DEC9] hover:bg-[#E8F4D9]'
                              }`}
                              title="Centrer et zoomer sur le moulin (Zoom ×15)"
                            >
                              Moulin (×15)
                            </button>
                            <button
                              type="button"
                              onClick={() => focusOnMill(mill, 17)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                                cameraZoom === 17
                                  ? 'bg-[#31491E] text-white border-[#31491E]'
                                  : 'bg-white text-[#31491E] border-[#E6DEC9] hover:bg-[#E8F4D9]'
                              }`}
                              title="Zoom très rapproché sur l'accès du moulin (Zoom ×17)"
                            >
                              Site précis (×17)
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={
                              userLocation
                                ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${mill.lat},${mill.lng}&travelmode=driving`
                                : `https://www.google.com/maps/dir/?api=1&destination=${mill.lat},${mill.lng}&travelmode=driving`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-2 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Navigation className="w-3.5 h-3.5 text-[#E6AB3C]" />
                            <span>GPS Direct</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => locateUser(mill)}
                            className="py-2.5 px-2 rounded-xl bg-white hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] hover:border-[#8CBE5D] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          >
                            <Route className="w-3.5 h-3.5 text-[#567B34]" />
                            <span>Tracer Carte</span>
                          </button>
                        </div>
                      </div>

                      <a
                        href={`tel:${mill.phone.split('/')[0].trim()}`}
                        className="w-full py-3 px-4 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-md"
                      >
                        <Phone className="w-4 h-4 text-[#E6AB3C]" />
                        <span>Contacter : {mill.phone.split('/')[0]}</span>
                      </a>
                    </div>
                  );
                })()
              ) : selectedItem.type === 'collection_point' ? (
                (() => {
                  const cp = selectedItem.data as CollectionPoint;
                  return (
                    <div className="space-y-5 animate-in fade-in-50 duration-200">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#D97706] flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5 text-[#D97706]" />
                            Point de Collecte & Pesage
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF5DB] text-[#B47A16]">
                            {cp.capacityTonnes} Tonnes
                          </span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                          {cp.name}
                        </h3>
                        <p className="text-xs text-[#567B34] mt-0.5">
                          {cp.commune} · Daïra de {cp.daira}
                        </p>
                      </div>

                      <div className="space-y-2.5 text-xs bg-[#FAF7F2] p-4 rounded-xl border border-[#E6DEC9]">
                        <div>
                          <span className="text-[#6F9D44] block text-[10px] uppercase font-bold">
                            Capacité de réception
                          </span>
                          <span className="font-serif text-lg font-bold text-[#18230F]">
                            {cp.capacityTonnes} Tonnes / saison
                          </span>
                        </div>
                        <div>
                          <span className="text-[#6F9D44] block text-[10px] uppercase font-bold">
                            Gestionnaire de la station
                          </span>
                          <span className="font-semibold text-[#18230F]">{cp.manager}</span>
                        </div>
                        <div>
                          <span className="text-[#6F9D44] block text-[10px] uppercase font-bold">
                            Horaires d'ouverture
                          </span>
                          <span className="text-[#31491E] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-[#E6AB3C]" />
                            {cp.operatingDays}
                          </span>
                        </div>
                      </div>

                      {/* Equipment Features */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-[#18230F] block">
                          Équipements & Services disponibles :
                        </span>
                        <div className="space-y-1">
                          {cp.features.map((feat, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#31491E]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#567B34] shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-[#567B34] leading-relaxed bg-[#E8F4D9]/60 p-3 rounded-xl border border-[#8CBE5D]/20">
                        {cp.description}
                      </p>

                      <a
                        href={`tel:${cp.phone.split('/')[0].trim()}`}
                        className="w-full py-3 px-4 rounded-xl bg-[#D97706] hover:bg-[#B45309] text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                      >
                        <Phone className="w-4 h-4 text-white" />
                        <span>Appeler la station : {cp.phone.split('/')[0]}</span>
                      </a>
                    </div>
                  );
                })()
              ) : null
            ) : (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E] mx-auto">
                  <MapPin className="w-7 h-7 text-[#567B34]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18230F]">
                    Sélectionnez un Repère sur Google Maps
                  </h3>
                  <p className="text-xs text-[#567B34] max-w-xs mx-auto mt-2 leading-relaxed">
                    Cliquez sur un marqueur de commune (pastille verte), d'huilerie (icône moulin) ou de point de collecte pour inspecter ses statistiques et calculer un itinéraire routier.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6DEC9] text-left text-xs text-[#436229] space-y-2">
                  <strong className="block text-[#18230F]">Repères géographiques clés :</strong>
                  <p>
                    • <strong>Vallée de la Soummam :</strong> Colonne vertébrale oléicole concentrant plus de 75% du verger de la wilaya.
                  </p>
                  <p>
                    • <strong>Seddouk, Tazmalt :</strong> Bassin et centre névralgique de l'olivier de la wilaya.
                  </p>
                  <p>
                    • <strong>Akbou & Sidi Aïch :</strong> Grands pôles de modernisation avec chaînes continues 2 et 3 phases.
                  </p>
                </div>
              </div>
            )}

            {/* Footer tip */}
            <div className="pt-4 border-t border-[#E6DEC9] text-[11px] text-[#567B34] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#8CBE5D] shrink-0" />
              <span>Cartographie Google Maps actualisée selon les recensements agricoles ADOIO.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
