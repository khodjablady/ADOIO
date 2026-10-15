import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  BEJAIA_COMMUNES_DATA, 
  REPRESENTATIVE_MILLS, 
  CommuneStat, 
  OliveMill 
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
  Info
} from 'lucide-react';

interface InteractiveOliveMapProps {
  onSelectMill?: (mill: OliveMill) => void;
}

export const InteractiveOliveMap: React.FC<InteractiveOliveMapProps> = ({ onSelectMill }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<'all' | 'mills' | 'communes'>('all');
  const [selectedMillType, setSelectedMillType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<{
    type: 'commune' | 'mill';
    data: CommuneStat | OliveMill;
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

    // Warm, highly readable CartoDB Voyager tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 18,
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

    // 1. Add Communes markers
    if (activeLayer === 'all' || activeLayer === 'communes') {
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

        {/* Controls Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6DEC9] shadow-xs mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 text-[#6F9D44] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrer la carte (commune, huilerie, daïra)..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2]"
              />
            </div>

            {/* Layer Filter (All, Mills, Communes) */}
            <div className="md:col-span-4 flex bg-[#FAF7F2] p-1 rounded-xl border border-[#E6DEC9]">
              <button
                onClick={() => setActiveLayer('all')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLayer === 'all'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'text-[#31491E] hover:text-[#18230F]'
                }`}
              >
                Tout afficher
              </button>
              <button
                onClick={() => setActiveLayer('mills')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLayer === 'mills'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'text-[#31491E] hover:text-[#18230F]'
                }`}
              >
                Huileries
              </button>
              <button
                onClick={() => setActiveLayer('communes')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeLayer === 'communes'
                    ? 'bg-[#31491E] text-white shadow-xs'
                    : 'text-[#31491E] hover:text-[#18230F]'
                }`}
              >
                Communes
              </button>
            </div>

            {/* Mill Type Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedMillType}
                onChange={(e) => setSelectedMillType(e.target.value)}
                disabled={activeLayer === 'communes'}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-medium text-[#18230F] disabled:opacity-40"
              >
                <option value="all">Tous les types de moulins</option>
                <option value="modern">Moderne Continu (Inox)</option>
                <option value="traditional">Presse Traditionnelle</option>
                <option value="domaine">Domaine Intégré</option>
                <option value="cooperative">Coopérative</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="md:col-span-1 flex justify-end">
              <button
                onClick={resetView}
                className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] transition-colors cursor-pointer"
                title="Recentrer la carte sur la wilaya"
              >
                <RotateCcw className="w-4 h-4" />
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
              className="px-2.5 py-1 rounded-lg bg-[#FEF5DB] border border-[#E6AB3C]/40 text-[#B47A16] font-bold hover:bg-[#E6AB3C] hover:text-white transition-colors cursor-pointer"
            >
              ⭐ Seddouk (Siège ADOIO)
            </button>
            {['Akbou', 'Tazmalt', 'Sidi Aïch', 'El Kseur', 'Amizour', 'Adekar', 'Ouzellaguen'].map((c) => (
              <button
                key={c}
                onClick={() => zoomToCommune(c)}
                className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9] text-[#242A20] font-medium hover:border-[#8CBE5D] hover:bg-[#E8F4D9] transition-colors cursor-pointer"
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

            {/* Map Legend Overlay */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-2 text-[11px] text-[#436229]">
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#233416] inline-block border border-white shadow-xs"></span>
                  Commune Oléicole
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#31491E] inline-block border border-white shadow-xs"></span>
                  Moulin Moderne Continu
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#AF4D24] inline-block border border-white shadow-xs"></span>
                  Presse Traditionnelle
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-3 h-3 rounded-full bg-[#B47A16] inline-block border border-white shadow-xs"></span>
                  Domaine Oléicole
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
              ) : (
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
              )
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
