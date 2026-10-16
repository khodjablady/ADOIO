import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  BEJAIA_COMMUNES_DATA, 
  REPRESENTATIVE_MILLS, 
  BEJAIA_COLLECTION_POINTS,
  CommuneStat, 
  OliveMill,
  CollectionPoint
} from '../data/bejaiaOliveData';
import { 
  MapPin, 
  Layers, 
  Trees, 
  Building2, 
  Phone, 
  ExternalLink, 
  Search, 
  Filter, 
  RotateCcw, 
  CheckCircle2, 
  Award,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Scale,
  Clock,
  Warehouse
} from 'lucide-react';

interface InteractiveOliveMapProps {
  onSelectMill?: (mill: OliveMill) => void;
}

export const InteractiveOliveMap: React.FC<InteractiveOliveMapProps> = ({ onSelectMill }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<'all' | 'mills' | 'zones_culture' | 'points_collecte'>('all');
  const [selectedMillType, setSelectedMillType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [selectedItem, setSelectedItem] = useState<{
    type: 'commune' | 'mill' | 'collection_point';
    data: CommuneStat | OliveMill | CollectionPoint;
  } | null>(null);

  // Initial center on Béjaïa Soummam Valley
  const INITIAL_CENTER: [number, number] = [36.58, 4.68];
  const INITIAL_ZOOM = 10;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // CARTO Voyager tiles with clean typography, roads and terroir relief (https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>',
      maxZoom: 19,
      minZoom: 8,
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers when filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layerGroup = markersLayerRef.current;
    layerGroup.clearLayers();

    // 1. Add Communes markers (Zones de culture)
    if (activeLayer === 'all' || activeLayer === 'zones_culture') {
      const filteredCommunes = BEJAIA_COMMUNES_DATA.filter((c) =>
        c.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.daira.toLowerCase().includes(searchTerm.toLowerCase())
      );

      filteredCommunes.forEach((commune) => {
        const isSeddouk = commune.commune === 'Seddouk';

        // Custom HTML marker for communes
        const communeIcon = L.divIcon({
          className: 'custom-commune-marker',
          html: `
            <div style="
              background: ${isSeddouk ? '#b47a16' : '#233416'};
              color: white;
              border: 2px solid white;
              border-radius: 9999px;
              padding: 4px 8px;
              display: flex;
              align-items: center;
              gap: 4px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              font-family: system-ui, sans-serif;
              font-size: 11px;
              font-weight: 700;
              cursor: pointer;
              white-space: nowrap;
              transform: translate(-50%, -50%);
            ">
              <span>🫒</span>
              <span>${commune.commune}</span>
              <span style="
                background: rgba(255,255,255,0.25);
                border-radius: 4px;
                padding: 1px 4px;
                font-size: 9px;
                font-weight: 800;
              ">${(commune.avgProductionLiters / 1000000).toFixed(1)}M L</span>
            </div>
          `,
          iconSize: [120, 30],
          iconAnchor: [60, 15],
        });

        const marker = L.marker([commune.lat, commune.lng], { icon: communeIcon });
        
        // Hover tooltip before clicking
        marker.bindTooltip(
          `
          <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 2px 4px; text-align: left;">
            <div style="font-size: 9px; font-weight: 800; color: #567B34; text-transform: uppercase; letter-spacing: 0.5px;">
              ${isSeddouk ? '⭐ Siège ADOIO' : `Bassin Oléicole · Daïra de ${commune.daira}`}
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #18230F; margin: 1px 0;">
              ${commune.commune}
            </div>
            <div style="font-size: 10px; color: #31491E; font-weight: 600;">
              🫒 ${(commune.avgProductionLiters / 1000000).toFixed(1)}M L · ${commune.millsCount} moulins
            </div>
            <div style="font-size: 9px; color: #7B8B9B; margin-top: 2px;">
              Cliquez pour voir la fiche détaillée
            </div>
          </div>
          `,
          {
            direction: 'top',
            offset: [0, -14],
            opacity: 0.98,
            className: 'custom-map-tooltip',
          }
        );

        marker.on('click', () => {
          setSelectedItem({ type: 'commune', data: commune });
          mapInstanceRef.current?.setView([commune.lat, commune.lng], 12, { animate: true });
        });

        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px;">
            <div style="font-size: 10px; color: #567B34; font-weight: 700; text-transform: uppercase;">
              Bassin Oléicole · Daïra de ${commune.daira}
            </div>
            <div style="font-size: 14px; font-weight: 800; color: #18230F; margin: 2px 0 6px 0;">
              ${commune.commune}
            </div>
            <div style="font-size: 11px; line-height: 1.5; color: #333;">
              <strong>Superficie :</strong> ${commune.hectares.toLocaleString()} ha<br/>
              <strong>Oliviers :</strong> ${commune.treesCount.toLocaleString()} arbres<br/>
              <strong>Huileries actives :</strong> ${commune.millsCount}<br/>
              <strong>Production moy. :</strong> ${(commune.avgProductionLiters / 1000000).toFixed(2)} M Litres
            </div>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // 2. Add Mills markers
    if (activeLayer === 'all' || activeLayer === 'mills') {
      const filteredMills = REPRESENTATIVE_MILLS.filter((mill) => {
        const matchesSearch =
          mill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mill.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mill.brands.some((b) => b.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesType = selectedMillType === 'all' || mill.type === selectedMillType;
        return matchesSearch && matchesType;
      });

      filteredMills.forEach((mill) => {
        const pinColor =
          mill.type === 'modern'
            ? '#31491E'
            : mill.type === 'traditional'
            ? '#AF4D24'
            : mill.type === 'domaine'
            ? '#B47A16'
            : '#2A52BE';

        const millIcon = L.divIcon({
          className: 'custom-mill-marker',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background: ${pinColor};
              border: 2px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg) translate(-50%, -50%);
              box-shadow: 0 3px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <span style="
                transform: rotate(45deg);
                font-size: 12px;
                line-height: 1;
              ">🏭</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
        });

        const marker = L.marker([mill.lat, mill.lng], { icon: millIcon });

        const millTypeBadge =
          mill.type === 'modern'
            ? 'Moderne Continu (Inox)'
            : mill.type === 'traditional'
            ? 'Presse Traditionnelle'
            : mill.type === 'domaine'
            ? 'Domaine Oléicole'
            : 'Coopérative';

        // Hover tooltip before clicking
        marker.bindTooltip(
          `
          <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 2px 4px; text-align: left; min-width: 140px;">
            <div style="font-size: 9px; font-weight: 800; color: ${pinColor}; text-transform: uppercase; letter-spacing: 0.5px;">
              ${millTypeBadge}
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #18230F; margin: 1px 0;">
              ${mill.name}
            </div>
            <div style="font-size: 10px; color: #31491E; font-weight: 600;">
              📍 ${mill.commune} · ${mill.capacityQxPerDay} qx/j
            </div>
            <div style="font-size: 9px; color: #7B8B9B; margin-top: 2px;">
              Cliquez pour afficher la fiche
            </div>
          </div>
          `,
          {
            direction: 'top',
            offset: [0, -20],
            opacity: 0.98,
            className: 'custom-map-tooltip',
          }
        );

        marker.on('click', () => {
          setSelectedItem({ type: 'mill', data: mill });
          mapInstanceRef.current?.setView([mill.lat, mill.lng], 13, { animate: true });
        });

        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 200px;">
            <div style="font-size: 9px; color: #567B34; font-weight: 700; text-transform: uppercase;">
              ${mill.commune} · ${mill.type === 'modern' ? 'Moderne Continu' : mill.type === 'traditional' ? 'Presse Traditionnelle' : mill.type === 'domaine' ? 'Domaine' : 'Coopérative'}
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #18230F; margin: 2px 0 4px 0;">
              ${mill.name}
            </div>
            <div style="font-size: 11px; color: #436229; line-height: 1.4;">
              Capacité : <strong>${mill.capacityQxPerDay} qx/j</strong><br/>
              Tel : <strong>${mill.phone.split('/')[0]}</strong>
            </div>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }

    // 3. Add Collection Points markers (Points de collecte)
    if (activeLayer === 'all' || activeLayer === 'points_collecte') {
      const filteredCPs = BEJAIA_COLLECTION_POINTS.filter((cp) =>
        cp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cp.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cp.daira.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cp.manager.toLowerCase().includes(searchTerm.toLowerCase())
      );

      filteredCPs.forEach((cp) => {
        const cpIcon = L.divIcon({
          className: 'custom-cp-marker',
          html: `
            <div style="
              width: 30px;
              height: 30px;
              background: #D97706;
              border: 2px solid white;
              border-radius: 8px;
              transform: rotate(45deg) translate(-50%, -50%);
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <span style="
                transform: rotate(-45deg);
                font-size: 13px;
                line-height: 1;
              ">⚖️</span>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const marker = L.marker([cp.lat, cp.lng], { icon: cpIcon });

        // Hover tooltip before clicking
        marker.bindTooltip(
          `
          <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; padding: 2px 4px; text-align: left; min-width: 140px;">
            <div style="font-size: 9px; font-weight: 800; color: #D97706; text-transform: uppercase; letter-spacing: 0.5px;">
              Point de Collecte & Pesage
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #18230F; margin: 1px 0;">
              ${cp.name}
            </div>
            <div style="font-size: 10px; color: #31491E; font-weight: 600;">
              📍 ${cp.commune} · Capacité : ${cp.capacityTonnes} Tonnes
            </div>
            <div style="font-size: 9px; color: #7B8B9B; margin-top: 2px;">
              Cliquez pour voir les services
            </div>
          </div>
          `,
          {
            direction: 'top',
            offset: [0, -20],
            opacity: 0.98,
            className: 'custom-map-tooltip',
          }
        );

        marker.on('click', () => {
          setSelectedItem({ type: 'collection_point', data: cp });
          mapInstanceRef.current?.setView([cp.lat, cp.lng], 13, { animate: true });
        });

        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px; max-width: 220px;">
            <div style="font-size: 9px; color: #D97706; font-weight: 700; text-transform: uppercase;">
              Point de Collecte · ${cp.commune}
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #18230F; margin: 2px 0 4px 0;">
              ${cp.name}
            </div>
            <div style="font-size: 11px; color: #436229; line-height: 1.4;">
              Capacité : <strong>${cp.capacityTonnes} Tonnes</strong><br/>
              Gestion : <strong>${cp.manager}</strong><br/>
              Tel : <strong>${cp.phone}</strong>
            </div>
          </div>
        `);

        layerGroup.addLayer(marker);
      });
    }
  }, [activeLayer, selectedMillType, searchTerm]);

  // Center on a specific commune
  const zoomToCommune = (communeName: string) => {
    const commune = BEJAIA_COMMUNES_DATA.find((c) => c.commune === communeName);
    if (commune && mapInstanceRef.current) {
      setSelectedItem({ type: 'commune', data: commune });
      mapInstanceRef.current.setView([commune.lat, commune.lng], 12, { animate: true });
    }
  };

  // Center on Seddouk (ADOIO Headquarters)
  const zoomToSeddouk = () => {
    zoomToCommune('Seddouk');
  };

  // Reset View to Wilaya overview
  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(INITIAL_CENTER, INITIAL_ZOOM, { animate: true });
      setSelectedItem(null);
      setSearchTerm('');
    }
  };

  return (
    <section id="carte-interactive" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <MapPin className="w-4 h-4 text-[#E6AB3C]" />
              <span>Cartographie Géographique & SIG Oléicole</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              Carte Interactive du Bassin Oléicole de Béjaïa
            </h2>
            <p className="mt-2 text-sm text-[#436229] max-w-2xl leading-relaxed">
              Explorez la répartition géographique des bassins oléicoles majeurs et des huileries enregistrées dans la wilaya. Cliquez sur une commune ou un moulin pour afficher sa fiche complète.
            </p>
          </div>

          {/* Quick Stats overview badge */}
          <div className="flex items-center gap-2 bg-[#E8F4D9] px-3.5 py-2 rounded-xl border border-[#8CBE5D]/40 text-xs font-semibold text-[#233416]">
            <span>12 Bassins Majeurs</span>
            <span className="text-[#8CBE5D]">·</span>
            <span>448 Huileries</span>
            <span className="text-[#8CBE5D]">·</span>
            <span className="text-[#B47A16] font-bold">Vallée de la Soummam</span>
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
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeLayer === 'all' ? 'bg-white/20 text-white' : 'bg-[#E6DEC9] text-[#18230F]'
                }`}>
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
                <span>🏭</span>
                <span>Moulins</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeLayer === 'mills' ? 'bg-white/20 text-white' : 'bg-[#E8F4D9] text-[#233416]'
                }`}>
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
                <span>🫒</span>
                <span>Zones de culture</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeLayer === 'zones_culture' ? 'bg-white/20 text-white' : 'bg-[#E8F4D9] text-[#233416]'
                }`}>
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
                <span>⚖️</span>
                <span>Points de collecte</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeLayer === 'points_collecte' ? 'bg-white/20 text-white' : 'bg-[#FEF5DB] text-[#B47A16]'
                }`}>
                  {BEJAIA_COLLECTION_POINTS.length}
                </span>
              </button>
            </div>

            {/* Search Input, Sub-filters & Reset Button */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-60">
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

              <button
                onClick={resetView}
                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] transition-colors cursor-pointer shrink-0"
                title="Recentrer la carte"
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
          {/* Interactive Leaflet Map */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E6DEC9] p-3 shadow-sm relative overflow-hidden flex flex-col min-h-[520px]">
            {/* Map Canvas */}
            <div
              ref={mapContainerRef}
              className="w-full h-full min-h-[480px] rounded-2xl z-10"
              style={{ background: '#e5e3df' }}
            ></div>

            {/* Floating Stylized Legend */}
            <div className="absolute top-6 right-6 z-[400] max-w-[280px] sm:max-w-[300px] transition-all duration-300 pointer-events-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#E6DEC9] shadow-xl p-3 sm:p-3.5 text-xs text-[#242A20]">
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#E6DEC9]/70">
                  <div className="flex items-center gap-1.5 font-bold text-[#18230F]">
                    <Layers className="w-3.5 h-3.5 text-[#E6AB3C]" />
                    <span className="font-serif text-xs font-bold uppercase tracking-wider">Légende des Marqueurs</span>
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
                      1. Bassins Oléicoles (Formes Pilule)
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#233416] text-white text-[10px] font-bold border border-white shadow-xs shrink-0">
                          🫒 Akbou
                        </span>
                        <span className="text-[#31491E]">Commune / Bassin oléicole</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B47A16] text-white text-[10px] font-bold border border-white shadow-xs shrink-0">
                          ⭐ Seddouk
                        </span>
                        <span className="text-[#31491E]">Centre & Siège ADOIO</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E6DEC9]/60 text-[10px] text-[#6F9D44] font-bold uppercase tracking-wider">
                      2. Huileries & Moulins (Pins Orientés)
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-tr-lg rounded-tl-lg rounded-br-lg bg-[#31491E] text-white text-[9px] flex items-center justify-center border border-white shadow-xs shrink-0">
                          🏭
                        </span>
                        <span><strong>Moderne Continu</strong> (Chaîne Inox)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-tr-lg rounded-tl-lg rounded-br-lg bg-[#AF4D24] text-white text-[9px] flex items-center justify-center border border-white shadow-xs shrink-0">
                          🏺
                        </span>
                        <span><strong>Presse Traditionnelle</strong> (Scourtins)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-tr-lg rounded-tl-lg rounded-br-lg bg-[#B47A16] text-white text-[9px] flex items-center justify-center border border-white shadow-xs shrink-0">
                          🏆
                        </span>
                        <span><strong>Domaine Intégré</strong> (Verger & Huilerie)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-tr-lg rounded-tl-lg rounded-br-lg bg-[#2A52BE] text-white text-[9px] flex items-center justify-center border border-white shadow-xs shrink-0">
                          🤝
                        </span>
                        <span><strong>Coopérative</strong> (Mise en commun)</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E6DEC9]/60 text-[10px] text-[#6F9D44] font-bold uppercase tracking-wider">
                      3. Points de Collecte (Losanges Ambrés)
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="w-5 h-5 rounded-md bg-[#D97706] text-white text-[10px] flex items-center justify-center border border-white shadow-xs shrink-0">
                        ⚖️
                      </span>
                      <span><strong>Point de collecte & pesage</strong> (Transit & Réception)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Legend Overlay */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 text-[11px] text-[#436229]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#233416] inline-block border border-white shadow-xs"></span>
                  Zone de culture (Commune)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#31491E] inline-block border border-white shadow-xs"></span>
                  Moulin Continu (Inox)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#AF4D24] inline-block border border-white shadow-xs"></span>
                  Presse Traditionnelle
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-md bg-[#D97706] inline-block border border-white shadow-xs"></span>
                  Point de Collecte (Pesage)
                </span>
              </div>
              <span className="text-gray-400 text-[10px]">
                Données SIG Wilaya de Béjaïa & ADOIO
              </span>
            </div>
          </div>

          {/* Selected Item Detail Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E6DEC9] p-6 shadow-sm flex flex-col justify-between">
            {selectedItem ? (
              selectedItem.type === 'commune' ? (
                // Commune Detail
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
                // Mill Detail
                (() => {
                  const mill = selectedItem.data as OliveMill;
                  return (
                    <div className="space-y-5 animate-in fade-in-50 duration-200">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                            Huilerie Enregistrée
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            mill.type === 'modern'
                              ? 'bg-[#E8F4D9] text-[#233416]'
                              : mill.type === 'traditional'
                              ? 'bg-[#FEF5DB] text-[#B47A16]'
                              : 'bg-[#E6DEC9] text-[#18230F]'
                          }`}>
                            {mill.type === 'modern' ? 'Moderne Continu' : mill.type === 'traditional' ? 'Traditionnel' : 'Domaine'}
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
                        <p><strong>Type d'installation :</strong> {mill.typeLabel}</p>
                        <p><strong>Capacité de trituration :</strong> {mill.capacityQxPerDay} quintaux / jour</p>
                        <p><strong>Marques produites :</strong> {mill.brands.join(', ')}</p>
                        <p><strong>Profil gustatif :</strong> {mill.speciality}</p>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="text-[#567B34]">
                          <strong>Maître moulinier / Contact :</strong> {mill.contactPerson}
                        </p>
                        <p className="text-[#567B34]">
                          <strong>Adresse :</strong> {mill.address}
                        </p>
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
                // Collection Point Detail
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
                          <span className="text-[#6F9D44] block text-[10px] uppercase font-bold">Capacité de réception</span>
                          <span className="font-serif text-lg font-bold text-[#18230F]">{cp.capacityTonnes} Tonnes / saison</span>
                        </div>
                        <div>
                          <span className="text-[#6F9D44] block text-[10px] uppercase font-bold">Gestionnaire de la station</span>
                          <span className="font-semibold text-[#18230F]">{cp.manager}</span>
                        </div>
                        <div>
                          <span className="text-[#6F9D44] block text-[10px] uppercase font-bold">Horaires d'ouverture</span>
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
              // Default state when nothing selected
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E] mx-auto">
                  <MapPin className="w-7 h-7 text-[#567B34]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18230F]">
                    Sélectionnez un Élément sur la Carte
                  </h3>
                  <p className="text-xs text-[#567B34] max-w-xs mx-auto mt-2 leading-relaxed">
                    Cliquez sur un marqueur de commune (pastille verte) ou d'huilerie (icône usine) pour inspecter ses statistiques de production et coordonnées.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6DEC9] text-left text-xs text-[#436229] space-y-2">
                  <strong className="block text-[#18230F]">Repères géographiques clés :</strong>
                  <p>• <strong>Vallée de la Soummam :</strong> Colonne vertébrale oléicole concentrant plus de 75% du verger de la wilaya.</p>
                  <p>• <strong>Seddouk, Tazmalt :</strong> Bassin et centre névralgique de l'olivier de la wilaya.</p>
                  <p>• <strong>Akbou & Sidi Aïch :</strong> Grands pôles de modernisation avec chaînes continues 2 et 3 phases.</p>
                </div>
              </div>
            )}

            {/* Footer tip */}
            <div className="pt-4 border-t border-[#E6DEC9] text-[11px] text-[#567B34] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#8CBE5D] shrink-0" />
              <span>Cartographie actualisée selon les recensements agricoles ADOIO.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
