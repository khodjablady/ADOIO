import React, { useState, useEffect, useMemo } from 'react';
import { 
  REPRESENTATIVE_MILLS, 
  OliveMill 
} from '../data/bejaiaOliveData';
import { 
  Search, 
  MapPin, 
  Phone, 
  Building2, 
  Sparkles, 
  CheckCircle, 
  Filter, 
  X,
  ExternalLink,
  Droplets,
  Calendar,
  Layers,
  Star,
  MessageSquare,
  Award,
  SlidersHorizontal,
  Clock,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { 
  getStoredReviews, 
  calculateMillStats, 
  MillReview,
  MillStats
} from '../data/millReviewsData';
import { MillReviewsSection } from './MillReviewsSection';

interface MillsDirectoryProps {
  initialSearch?: string;
}

export const MillsDirectory: React.FC<MillsDirectoryProps> = ({ initialSearch = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCommune, setSelectedCommune] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyBio, setOnlyBio] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'reviews' | 'capacity'>('default');
  
  // Reviews state (persisted via localStorage)
  const [reviews, setReviews] = useState<MillReview[]>(() => getStoredReviews());
  const [activeModalMill, setActiveModalMill] = useState<OliveMill | null>(null);
  const [modalTab, setModalTab] = useState<'info' | 'reviews'>('info');

  const refreshReviews = () => {
    setReviews(getStoredReviews());
  };

  // Sync when search initiated from Hero
  useEffect(() => {
    if (initialSearch) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  // Communes list from data
  const communes = useMemo(() => {
    return ['all', ...Array.from(new Set(REPRESENTATIVE_MILLS.map((m) => m.commune)))];
  }, []);

  // Compute stats for each mill
  const millsWithStats = useMemo(() => {
    return REPRESENTATIVE_MILLS.map((mill) => {
      const stats = calculateMillStats(mill.id, reviews);
      return { mill, stats };
    });
  }, [reviews]);

  // Filtered and sorted mills
  const filteredMills = useMemo(() => {
    return millsWithStats
      .filter(({ mill, stats }) => {
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

        return matchesSearch && matchesCommune && matchesType && matchesBio && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.stats.averageRating - a.stats.averageRating;
        if (sortBy === 'reviews') return b.stats.totalReviews - a.stats.totalReviews;
        if (sortBy === 'capacity') return b.mill.capacityQxPerDay - a.mill.capacityQxPerDay;
        return 0; // default order
      });
  }, [millsWithStats, searchTerm, selectedCommune, selectedType, onlyBio, minRating, sortBy]);

  const handleOpenMill = (mill: OliveMill, tab: 'info' | 'reviews' = 'info') => {
    setActiveModalMill(mill);
    setModalTab(tab);
  };

  const activeMillStats: MillStats | null = useMemo(() => {
    if (!activeModalMill) return null;
    return calculateMillStats(activeModalMill.id, reviews);
  }, [activeModalMill, reviews]);

  return (
    <section id="annuaire" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9] scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <MapPin className="w-4 h-4 text-[#E6AB3C]" />
              <span>Répertoire Professionnel des Moulins & Domaines</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              Annuaire des Huileries de Béjaïa
            </h2>
            <p className="mt-2 text-sm text-[#436229] max-w-2xl leading-relaxed">
              Consultez les huileries modernes à chaîne continue et moulins traditionnels en activité. Consultez les avis vérifiés des oléiculteurs sur les rendements, les délais et la propreté de trituration.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#567B34] font-semibold bg-[#E8F4D9] px-3.5 py-1.5 rounded-full border border-[#8CBE5D]/30">
              {filteredMills.length} unité{filteredMills.length > 1 ? 's' : ''} affichée{filteredMills.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E6DEC9] shadow-xs mb-8 space-y-3.5">
          {/* Row 1: Search, Commune, Type, Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <Search className="w-4 h-4 text-[#6F9D44] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, commune, marque ou spécialité..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] bg-[#FAF7F2] font-bold text-[#233416] cursor-pointer"
              >
                <option value="default">Trier : Par défaut</option>
                <option value="rating">★ Mieux notés par les oléiculteurs</option>
                <option value="reviews">💬 Plus d'avis déposés</option>
                <option value="capacity">⚡ Plus forte capacité (qx/j)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Secondary Filters & Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E6DEC9]/60">
            <div className="flex flex-wrap items-center gap-3">
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
                  onClick={() => setMinRating(4.5)}
                  className={`px-2.5 py-0.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    minRating === 4.5
                      ? 'bg-[#31491E] text-white shadow-2xs'
                      : 'text-[#436229] hover:bg-white'
                  }`}
                >
                  <Star className="w-3 h-3 fill-[#E6AB3C] text-[#E6AB3C]" />
                  <span>4.5+</span>
                </button>
                <button
                  onClick={() => setMinRating(4.0)}
                  className={`px-2.5 py-0.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    minRating === 4.0
                      ? 'bg-[#31491E] text-white shadow-2xs'
                      : 'text-[#436229] hover:bg-white'
                  }`}
                >
                  <Star className="w-3 h-3 fill-[#E6AB3C] text-[#E6AB3C]" />
                  <span>4.0+</span>
                </button>
              </div>
            </div>

            {/* Reset Filters */}
            {(searchTerm || selectedCommune !== 'all' || selectedType !== 'all' || onlyBio || minRating !== 'all' || sortBy !== 'default') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCommune('all');
                  setSelectedType('all');
                  setOnlyBio(false);
                  setMinRating('all');
                  setSortBy('default');
                }}
                className="text-xs text-[#AF4D24] hover:underline font-semibold cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {/* Mills Grid */}
        {filteredMills.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E6DEC9] space-y-3">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-[#18230F]">
              Aucune huilerie ne correspond à vos critères
            </h3>
            <p className="text-xs text-[#567B34] max-w-md mx-auto">
              Essayez d'assouplir vos filtres ou de chercher une autre commune (ex. : Seddouk, Akbou, Chemini).
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCommune('all');
                setSelectedType('all');
                setOnlyBio(false);
                setMinRating('all');
                setSortBy('default');
              }}
              className="mt-2 px-4 py-2 bg-[#31491E] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMills.map(({ mill, stats }) => (
              <div
                key={mill.id}
                onClick={() => handleOpenMill(mill, 'info')}
                className="bg-white rounded-3xl border border-[#E6DEC9] p-6 shadow-xs hover:shadow-md hover:border-[#8CBE5D] transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-4">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#567B34]">
                      {mill.commune} · Daïra de {mill.daira}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      mill.type === 'modern'
                        ? 'bg-[#E8F4D9] text-[#233416]'
                        : mill.type === 'traditional'
                        ? 'bg-[#FEF5DB] text-[#B47A16]'
                        : 'bg-[#E6DEC9] text-[#18230F]'
                    }`}>
                      {mill.type === 'modern' ? 'Moderne 2/3 Ph.' : mill.type === 'traditional' ? 'Traditionnel' : mill.type === 'domaine' ? 'Domaine' : 'Coopérative'}
                    </span>
                  </div>

                  {/* Mill Title & Description */}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#18230F] group-hover:text-[#31491E] transition-colors">
                      {mill.name}
                    </h3>
                    <p className="text-xs text-[#567B34] mt-1 line-clamp-2 leading-relaxed">
                      {mill.description}
                    </p>
                  </div>

                  {/* Rating and Reviews Badge on Card */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMill(mill, 'reviews');
                      }}
                      className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer group/rate"
                      title="Consulter les retours d'expérience et avis oléicoles"
                    >
                      <div className="flex items-center gap-1 text-[#E6AB3C] bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80 font-bold shadow-2xs group-hover/rate:bg-amber-100">
                        <Star className="w-3.5 h-3.5 fill-[#E6AB3C]" />
                        <span>{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'Nouveau'}</span>
                      </div>
                      <span className="text-[#567B34] text-[11px] font-semibold underline decoration-dotted">
                        ({stats.totalReviews} avis)
                      </span>
                    </button>

                    {stats.totalReviews > 0 && stats.recommendationPercentage >= 85 && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 font-bold">
                        {stats.recommendationPercentage}% recommandent
                      </span>
                    )}
                  </div>

                  {/* Capacity, Brands, Speciality */}
                  <div className="space-y-2 pt-2 border-t border-[#E6DEC9] text-xs text-[#436229]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#6F9D44]">Capacité</span>
                      <span className="font-bold text-[#18230F]">{mill.capacityQxPerDay} qx / jour</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6F9D44]">Marques</span>
                      <span className="font-semibold text-[#18230F] text-right truncate max-w-[180px]">
                        {mill.brands.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6F9D44]">Spécialité</span>
                      <span className="font-semibold text-[#E6AB3C] text-right truncate max-w-[180px]">
                        {mill.speciality}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-5 pt-3 border-t border-[#E6DEC9] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenMill(mill, 'info')}
                      className="text-xs font-bold text-[#31491E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Fiche</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMill(mill, 'reviews');
                      }}
                      className="text-xs font-bold text-[#567B34] hover:text-[#233416] flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#E6AB3C]" />
                      <span>Avis ({stats.totalReviews})</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
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
                      <MapPin className="w-3 h-3 text-[#436229]" />
                      <span className="hidden sm:inline">Sur la carte</span>
                    </button>
                    <a
                      href={`tel:${mill.phone.split('/')[0].trim()}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] transition-colors"
                      title="Appeler l'huilerie"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Mill Details & Reviews System */}
        {activeModalMill && activeMillStats && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
            <div className="bg-[#FAF7F2] rounded-3xl border border-[#E6DEC9] max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
              <button
                onClick={() => setActiveModalMill(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-black transition-colors cursor-pointer shadow-xs"
                title="Fermer la vue"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34]">
                    <MapPin className="w-4 h-4 text-[#E6AB3C]" />
                    <span>{activeModalMill.commune} · Wilaya de Béjaïa</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18230F] mt-1">
                    {activeModalMill.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[#6F9D44]">
                    <span className="font-medium">{activeModalMill.typeLabel}</span>
                    <span>·</span>
                    <span>Établie en {activeModalMill.yearEstablished}</span>
                    <span>·</span>
                    <div className="flex items-center gap-1 font-bold text-[#E6AB3C]">
                      <Star className="w-3.5 h-3.5 fill-[#E6AB3C]" />
                      <span>{activeMillStats.averageRating > 0 ? activeMillStats.averageRating.toFixed(1) : 'Nouveau'}</span>
                      <span className="text-[#567B34] font-normal">({activeMillStats.totalReviews} avis)</span>
                    </div>
                  </div>
                </div>

                {/* Tab Selector */}
                <div className="flex items-center border-b border-[#E6DEC9] gap-4">
                  <button
                    type="button"
                    onClick={() => setModalTab('info')}
                    className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                      modalTab === 'info'
                        ? 'border-[#31491E] text-[#31491E]'
                        : 'border-transparent text-gray-400 hover:text-[#18230F]'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Fiche & Coordonnées</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalTab('reviews')}
                    className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer border-b-2 ${
                      modalTab === 'reviews'
                        ? 'border-[#31491E] text-[#31491E]'
                        : 'border-transparent text-gray-400 hover:text-[#18230F]'
                    }`}
                  >
                    <Star className="w-4 h-4 text-[#E6AB3C]" />
                    <span>Avis & Notations des Oléiculteurs ({activeMillStats.totalReviews})</span>
                  </button>
                </div>

                {/* Tab 1: Informations & Procédés */}
                {modalTab === 'info' && (
                  <div className="space-y-6 animate-in fade-in duration-150">
                    <div className="bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F]">
                        Description & Procédé de Trituration
                      </h4>
                      <p className="text-xs sm:text-sm text-[#436229] leading-relaxed">
                        {activeModalMill.description}
                      </p>
                      <div className="p-3 bg-[#E8F4D9] rounded-xl text-xs text-[#233416]">
                        <strong>Profil organoleptique :</strong> {activeModalMill.speciality}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-xl border border-[#E6DEC9]">
                        <span className="text-[11px] text-[#6F9D44] block">Capacité Journalière</span>
                        <span className="font-serif text-lg font-bold text-[#18230F]">
                          {activeModalMill.capacityQxPerDay} quintaux / jour
                        </span>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-[#E6DEC9]">
                        <span className="text-[11px] text-[#6F9D44] block">Marques Commerciales</span>
                        <span className="font-serif text-sm font-bold text-[#E6AB3C] block truncate">
                          {activeModalMill.brands.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-[#E6DEC9] space-y-3 text-xs text-[#31491E]">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F]">
                        Coordonnées & Maître Moulinier
                      </h4>
                      <div className="space-y-2">
                        <p>
                          <strong>Responsable / Contact :</strong> {activeModalMill.contactPerson}
                        </p>
                        <p>
                          <strong>Localisation exacte :</strong> {activeModalMill.address}
                        </p>
                        <p>
                          <strong>Téléphone :</strong>{' '}
                          <a href={`tel:${activeModalMill.phone}`} className="text-[#31491E] underline font-semibold">
                            {activeModalMill.phone}
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-amber-950 font-medium">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                        <span>Vous avez déjà fait presser vos olives dans ce moulin ?</span>
                      </div>
                      <button
                        onClick={() => setModalTab('reviews')}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                      >
                        Donner votre avis
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 2: Avis & Notations */}
                {modalTab === 'reviews' && (
                  <div className="animate-in fade-in duration-150">
                    <MillReviewsSection
                      mill={activeModalMill}
                      stats={activeMillStats}
                      reviews={reviews}
                      onReviewAdded={refreshReviews}
                    />
                  </div>
                )}

                {/* Modal Footer */}
                <div className="flex flex-wrap gap-3 pt-2 border-t border-[#E6DEC9]">
                  <a
                    href={`tel:${activeModalMill.phone.split('/')[0].trim()}`}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <Phone className="w-4 h-4 text-[#E6AB3C]" />
                    <span>Appeler l'huilerie</span>
                  </a>
                  <button
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
      </div>
    </section>
  );
};
