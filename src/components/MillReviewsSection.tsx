import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  MessageSquarePlus, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  ChevronDown, 
  AlertCircle,
  Droplets,
  Scale,
  Clock,
  Award
} from 'lucide-react';
import { 
  MillReview, 
  MillStats, 
  addProducerReview, 
  toggleReviewHelpful 
} from '../data/millReviewsData';
import { 
  createMillReviewInFirestore, 
  updateMillReviewHelpfulInFirestore 
} from '../firebase';
import { OliveMill } from '../data/bejaiaOliveData';

interface MillReviewsSectionProps {
  mill: OliveMill;
  stats: MillStats;
  reviews: MillReview[];
  onReviewAdded: () => void;
}

export const MillReviewsSection: React.FC<MillReviewsSectionProps> = ({
  mill,
  stats,
  reviews,
  onReviewAdded,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('Oléiculteur Récoltant');
  const [communeOrigin, setCommuneOrigin] = useState(mill.commune);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [extractionYield, setExtractionYield] = useState(5);
  const [turnaroundTime, setTurnaroundTime] = useState(5);
  const [hygiene, setHygiene] = useState(5);
  const [reception, setReception] = useState(5);
  const [volumeQuintals, setVolumeQuintals] = useState<string>('');
  const [varietyBrought, setVarietyBrought] = useState('Chemlal de Kabylie');
  const [comment, setComment] = useState('');
  const [recommended, setRecommended] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || authorName.trim().length < 2) {
      setFormError('Veuillez renseigner votre nom ou nom d’exploitation (au moins 2 caractères).');
      return;
    }
    if (!comment.trim() || comment.trim().length < 15) {
      setFormError('Veuillez rédiger un commentaire d’au moins 15 caractères sur votre expérience de pressage.');
      return;
    }

    setIsSubmittingReview(true);
    setFormError(null);

    const created = addProducerReview({
      millId: mill.id,
      authorName: authorName.trim(),
      authorRole,
      communeOrigin: communeOrigin.trim() || mill.commune,
      rating,
      serviceRatings: {
        extractionYield,
        turnaroundTime,
        hygiene,
        reception,
      },
      volumeBroughtQuintals: volumeQuintals ? parseFloat(volumeQuintals) : undefined,
      varietyBrought: varietyBrought || undefined,
      comment: comment.trim(),
      recommended,
    });

    onReviewAdded();

    try {
      await createMillReviewInFirestore(created);
    } catch (err) {
      console.warn('Firestore mill review sync warning (saved locally):', err);
    } finally {
      setIsSubmittingReview(false);
    }

    setIsSuccess(true);
    onReviewAdded();

    // Reset form after short delay
    setTimeout(() => {
      setAuthorName('');
      setComment('');
      setVolumeQuintals('');
      setShowAddForm(false);
      setIsSuccess(false);
    }, 2000);
  };

  const handleHelpfulClick = async (reviewId: string) => {
    const delta = toggleReviewHelpful(reviewId);
    onReviewAdded();
    try {
      await updateMillReviewHelpfulInFirestore(reviewId, delta);
    } catch {
      // Local helpful vote still preserved
    }
  };

  // Filter & Sort reviews
  const millReviews = reviews.filter((r) => r.millId === mill.id);
  const filteredReviews = millReviews.filter((r) => {
    if (filterRating === 'all') return true;
    return Math.round(r.rating) === filterRating;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'helpful') return b.likesCount - a.likesCount;
    return 0; // default recent
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E6DEC9] p-5 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E6DEC9]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-1">
            <Award className="w-4 h-4 text-[#E6AB3C]" />
            <span>Retours d'Expérience & Qualité de Trituration</span>
          </div>
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F] flex items-center gap-2">
            <span>Avis des Oléiculteurs</span>
            <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-[#E8F4D9] text-[#233416] border border-[#8CBE5D]/40">
              {stats.totalReviews} avis
            </span>
          </h4>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setIsSuccess(false);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#E6AB3C]" />
          <span>{showAddForm ? 'Fermer le formulaire' : 'Déposer un avis de pressage'}</span>
        </button>
      </div>

      {/* Global Rating & Criteria Breakdown Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#FAF7F2] p-5 rounded-2xl border border-[#E6DEC9]">
        {/* Left: Overall Score (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-white rounded-xl border border-[#E6DEC9]/60 shadow-2xs">
          <span className="text-xs text-[#567B34] font-semibold uppercase tracking-wider">Note Globale</span>
          <div className="flex items-baseline gap-1 my-2">
            <span className="font-serif text-4xl sm:text-5xl font-black text-[#18230F]">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
            </span>
            <span className="text-sm font-bold text-[#6F9D44]">/ 5</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(stats.averageRating)
                    ? 'fill-[#E6AB3C] text-[#E6AB3C]'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-[#436229] font-medium">
            Basé sur <strong>{stats.totalReviews}</strong> retour{stats.totalReviews > 1 ? 's' : ''} de producteurs
          </p>

          {stats.totalReviews > 0 && (
            <div className="mt-3 pt-3 border-t border-[#E6DEC9] w-full flex items-center justify-center gap-1.5 text-xs text-emerald-800 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{stats.recommendationPercentage}% recommandent ce moulin</span>
            </div>
          )}
        </div>

        {/* Right: Specific Milling Service Criteria (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-3">
          <span className="text-xs font-bold text-[#18230F] uppercase tracking-wider block">
            Évaluation des Prestations de Pressage :
          </span>

          {/* Criteria 1: Rendement */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#436229] flex items-center gap-1.5 font-medium">
                <Droplets className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Rendement & Pureté d'extraction</span>
              </span>
              <span className="font-bold text-[#18230F]">
                {stats.criteriaAverages.extractionYield > 0 ? `${stats.criteriaAverages.extractionYield.toFixed(1)} / 5` : '—'}
              </span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E6DEC9]/60">
              <div 
                className="bg-[#2563EB] h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.criteriaAverages.extractionYield / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Criteria 2: Délais */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#436229] flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#E6AB3C]" />
                <span>Délai de trituration post-récolte</span>
              </span>
              <span className="font-bold text-[#18230F]">
                {stats.criteriaAverages.turnaroundTime > 0 ? `${stats.criteriaAverages.turnaroundTime.toFixed(1)} / 5` : '—'}
              </span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E6DEC9]/60">
              <div 
                className="bg-[#E6AB3C] h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.criteriaAverages.turnaroundTime / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Criteria 3: Hygiène */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#436229] flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Propreté des lignes & cuves inox</span>
              </span>
              <span className="font-bold text-[#18230F]">
                {stats.criteriaAverages.hygiene > 0 ? `${stats.criteriaAverages.hygiene.toFixed(1)} / 5` : '—'}
              </span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E6DEC9]/60">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.criteriaAverages.hygiene / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Criteria 4: Pesée & Accueil */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#436229] flex items-center gap-1.5 font-medium">
                <Scale className="w-3.5 h-3.5 text-[#31491E]" />
                <span>Accueil, pesée & transparence</span>
              </span>
              <span className="font-bold text-[#18230F]">
                {stats.criteriaAverages.reception > 0 ? `${stats.criteriaAverages.reception.toFixed(1)} / 5` : '—'}
              </span>
            </div>
            <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E6DEC9]/60">
              <div 
                className="bg-[#31491E] h-full rounded-full transition-all duration-500"
                style={{ width: `${(stats.criteriaAverages.reception / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Review Form */}
      {showAddForm && (
        <form onSubmit={handleSubmitReview} className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#8CBE5D]/50 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h5 className="font-serif text-lg font-bold text-[#18230F] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E6AB3C]" />
              <span>Partager votre Retour d'Expérience sur ce Moulin</span>
            </h5>
            <span className="text-[11px] text-[#567B34] font-medium">* Champs obligatoires</span>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-300 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Votre avis a été enregistré avec succès et sera partagé avec la communauté oléicole !</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Author Name */}
            <div>
              <label className="text-xs font-bold text-[#18230F] block mb-1">
                Nom ou Nom de l'Exploitation *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ex. : Da Meziane Ait-Ali"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6DEC9] focus:outline-none focus:border-[#31491E]"
              />
            </div>

            {/* Author Role */}
            <div>
              <label className="text-xs font-bold text-[#18230F] block mb-1">
                Votre Statut d'Oléiculteur
              </label>
              <select
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6DEC9] focus:outline-none focus:border-[#31491E]"
              >
                <option value="Oléiculteur Récoltant">Oléiculteur Récoltant</option>
                <option value="Coopérateur Villageois">Coopérateur Villageois</option>
                <option value="Domaine Oléicole Familial">Domaine Oléicole Familial</option>
                <option value="Producteur Particulier">Producteur Particulier (Jardin d'oliviers)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Commune Origin */}
            <div>
              <label className="text-xs font-bold text-[#18230F] block mb-1">
                Commune du Verger
              </label>
              <input
                type="text"
                value={communeOrigin}
                onChange={(e) => setCommuneOrigin(e.target.value)}
                placeholder="Ex. : Seddouk, Akbou, Chemini..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6DEC9] focus:outline-none focus:border-[#31491E]"
              />
            </div>

            {/* Volume Brought */}
            <div>
              <label className="text-xs font-bold text-[#18230F] block mb-1">
                Volume d'Olives Apporté (Quintaux)
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={volumeQuintals}
                onChange={(e) => setVolumeQuintals(e.target.value)}
                placeholder="Ex. : 35"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6DEC9] focus:outline-none focus:border-[#31491E]"
              />
            </div>

            {/* Variety Brought */}
            <div>
              <label className="text-xs font-bold text-[#18230F] block mb-1">
                Variété Principale
              </label>
              <select
                value={varietyBrought}
                onChange={(e) => setVarietyBrought(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6DEC9] focus:outline-none focus:border-[#31491E]"
              >
                <option value="Chemlal de Kabylie">Chemlal de Kabylie</option>
                <option value="Bouchouk El Ghalia">Bouchouk El Ghalia</option>
                <option value="Aberkane Noire">Aberkane Noire</option>
                <option value="Limli">Limli</option>
                <option value="Azeradj / Adjeraz">Azeradj / Adjeraz</option>
                <option value="Assemblage Traditionnel">Assemblage Traditionnel</option>
              </select>
            </div>
          </div>

          {/* Interactive Global Star Rating */}
          <div className="p-3.5 bg-white rounded-xl border border-[#E6DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#18230F] block">Note Globale de la Prestation *</span>
              <span className="text-[11px] text-[#567B34]">Cliquez pour sélectionner de 1 à 5 étoiles</span>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating ?? rating)
                        ? 'fill-[#E6AB3C] text-[#E6AB3C]'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-[#18230F] ml-2 w-8">
                {rating} / 5
              </span>
            </div>
          </div>

          {/* Criteria Specific Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#436229] font-medium">Rendement d'extraction :</span>
                <span className="font-bold text-[#18230F]">{extractionYield} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={extractionYield}
                onChange={(e) => setExtractionYield(parseInt(e.target.value))}
                className="w-full accent-[#233416] cursor-pointer"
              />
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#436229] font-medium">Délai de prise en charge :</span>
                <span className="font-bold text-[#18230F]">{turnaroundTime} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={turnaroundTime}
                onChange={(e) => setTurnaroundTime(parseInt(e.target.value))}
                className="w-full accent-[#233416] cursor-pointer"
              />
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#436229] font-medium">Propreté des lignes & inox :</span>
                <span className="font-bold text-[#18230F]">{hygiene} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={hygiene}
                onChange={(e) => setHygiene(parseInt(e.target.value))}
                className="w-full accent-[#233416] cursor-pointer"
              />
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#E6DEC9]">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#436229] font-medium">Accueil & pesée transparente :</span>
                <span className="font-bold text-[#18230F]">{reception} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={reception}
                onChange={(e) => setReception(parseInt(e.target.value))}
                className="w-full accent-[#233416] cursor-pointer"
              />
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="text-xs font-bold text-[#18230F] block mb-1">
              Votre Commentaire & Détails du Pressage *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Décrivez la qualité de l'huile obtenue, le respect des températures à froid, la rapidité du service, etc."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6DEC9] focus:outline-none focus:border-[#31491E] leading-relaxed"
            />
          </div>

          {/* Recommendation Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recommendCheckbox"
              checked={recommended}
              onChange={(e) => setRecommended(e.target.checked)}
              className="w-4 h-4 rounded text-[#233416] focus:ring-[#8CBE5D] cursor-pointer"
            />
            <label htmlFor="recommendCheckbox" className="text-xs font-bold text-[#18230F] cursor-pointer">
              Je recommande cette huilerie aux autres oléiculteurs de la région
            </label>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-white border border-[#E6DEC9] hover:bg-gray-50 text-xs font-bold text-[#18230F] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] text-xs font-bold shadow-xs cursor-pointer"
            >
              Publier l'avis
            </button>
          </div>
        </form>
      )}

      {/* Filter and Sort Bar for Reviews */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-[#567B34] font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtrer :</span>
          </span>
          <button
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterRating === 'all'
                ? 'bg-[#31491E] text-white'
                : 'bg-[#FAF7F2] text-[#436229] hover:bg-[#E8F4D9]'
            }`}
          >
            Tous ({millReviews.length})
          </button>
          {[5, 4, 3].map((star) => {
            const count = millReviews.filter((r) => Math.round(r.rating) === star).length;
            if (count === 0 && star < 5) return null;
            return (
              <button
                key={star}
                onClick={() => setFilterRating(star)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  filterRating === star
                    ? 'bg-[#31491E] text-white'
                    : 'bg-[#FAF7F2] text-[#436229] hover:bg-[#E8F4D9]'
                }`}
              >
                <span>{star}★</span>
                <span className="text-[10px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#567B34] font-medium">Trier par :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9] text-xs font-semibold text-[#18230F] cursor-pointer"
          >
            <option value="recent">Plus récents</option>
            <option value="rating">Meilleures notes</option>
            <option value="helpful">Plus utiles</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3.5">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF7F2] rounded-2xl border border-[#E6DEC9] space-y-2">
            <MessageSquarePlus className="w-8 h-8 text-[#8CBE5D] mx-auto opacity-70" />
            <p className="text-xs text-[#567B34] font-semibold">
              Aucun avis ne correspond à ce filtre pour le moment.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-xs text-[#31491E] font-bold underline cursor-pointer"
            >
              Soyez le premier oléiculteur à donner votre avis !
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-3 transition-all hover:border-[#8CBE5D]/60"
            >
              {/* Review Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E8F4D9] text-[#233416] font-bold flex items-center justify-center text-xs border border-[#8CBE5D]/40">
                    {rev.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-[#18230F]">{rev.authorName}</span>
                      {rev.recommended && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Recommande</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#567B34] block">
                      {rev.authorRole} · {rev.communeOrigin}
                    </span>
                  </div>
                </div>

                {/* Rating & Date */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(rev.rating)
                            ? 'fill-[#E6AB3C] text-[#E6AB3C]'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#18230F]">{rev.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-gray-400">· {rev.date}</span>
                </div>
              </div>

              {/* Volume & Variety Pills if present */}
              {(rev.volumeBroughtQuintals || rev.varietyBrought) && (
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  {rev.volumeBroughtQuintals && (
                    <span className="px-2.5 py-0.5 rounded-md bg-white text-[#233416] font-semibold border border-[#E6DEC9]">
                      📦 {rev.volumeBroughtQuintals} quintaux triturés
                    </span>
                  )}
                  {rev.varietyBrought && (
                    <span className="px-2.5 py-0.5 rounded-md bg-white text-[#567B34] font-semibold border border-[#E6DEC9]">
                      🌿 Variété : {rev.varietyBrought}
                    </span>
                  )}
                </div>
              )}

              {/* Comment Content */}
              <p className="text-xs sm:text-sm text-[#436229] leading-relaxed bg-white p-3.5 rounded-xl border border-[#E6DEC9]/60">
                "{rev.comment}"
              </p>

              {/* Sub-Criteria Mini Scores & Helpful Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-[#567B34]">
                <div className="flex flex-wrap items-center gap-3">
                  <span>Rendement: <strong>{rev.serviceRatings?.extractionYield || 5}/5</strong></span>
                  <span>·</span>
                  <span>Délai: <strong>{rev.serviceRatings?.turnaroundTime || 5}/5</strong></span>
                  <span>·</span>
                  <span>Inox/Hygiène: <strong>{rev.serviceRatings?.hygiene || 5}/5</strong></span>
                </div>

                {/* Helpful Button */}
                <button
                  onClick={() => handleHelpfulClick(rev.id)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Cet avis a été utile"
                >
                  <ThumbsUp className="w-3 h-3 text-[#567B34]" />
                  <span>Utile ({rev.likesCount})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
