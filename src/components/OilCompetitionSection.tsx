import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Award, 
  Medal, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  MapPin, 
  FlaskConical, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Printer, 
  Download, 
  Send, 
  Phone, 
  Mail, 
  Building2, 
  Check, 
  Share2,
  Info
} from 'lucide-react';
import { CompetitionMedalsChartSection } from './CompetitionMedalsChartSection';
import { ArticleAudioReader } from './ArticleAudioReader';

export interface ContestRegistration {
  id: string;
  fullName: string;
  companyName: string;
  address: string;
  email: string;
  dialCode: string;
  phoneNumber: string;
  submissionDate: string;
  category: 'Fruité Vert' | 'Fruité Mûr' | 'Fruité Goût à l\'ancienne';
  sampleCount: 'Trois' | 'Quatre' | 'Cinq';
  varietyName?: string;
  lotVolumeLitres?: number;
  communeOrigin?: string;
  feeDza: number;
  submittedAt: string;
  registrationNumber: string;
}

const STORAGE_KEY = 'olive_bejaia_contest_registrations_2026';

export const OilCompetitionSection: React.FC = () => {
  // Form State matching the uploaded form image exactly
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState('DZ (+213)');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submissionDate, setSubmissionDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [category, setCategory] = useState<'Fruité Vert' | 'Fruité Mûr' | 'Fruité Goût à l\'ancienne'>('Fruité Vert');
  const [sampleCount, setSampleCount] = useState<'Trois' | 'Quatre' | 'Cinq'>('Cinq');
  
  // Optional terroir metadata to enrich the dossier
  const [varietyName, setVarietyName] = useState('Chemlal');
  const [lotVolume, setLotVolume] = useState<number>(500);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<ContestRegistration | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [myRegistrations, setMyRegistrations] = useState<ContestRegistration[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'presentation' | 'form' | 'reglement' | 'criteres'>('presentation');

  // Save registrations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myRegistrations));
    } catch (e) {
      console.warn('Could not save contest registrations to localStorage', e);
    }
  }, [myRegistrations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!fullName.trim()) {
      setFormError('Veuillez renseigner votre nom et prénom.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Veuillez renseigner une adresse e-mail valide.');
      return;
    }
    if (!phoneNumber.trim()) {
      setFormError('Veuillez renseigner votre numéro de téléphone.');
      return;
    }
    if (!submissionDate) {
      setFormError('Veuillez sélectionner une date de dépôt ou de prélèvement.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const regNumber = `ADOIO-2026-HO-${String(myRegistrations.length + 1).padStart(3, '0')}`;
      const newRegistration: ContestRegistration = {
        id: `reg-${Date.now()}`,
        fullName: fullName.trim(),
        companyName: companyName.trim() || 'Producteur Particulier',
        address: address.trim() || 'Wilaya de Béjaïa',
        email: email.trim(),
        dialCode,
        phoneNumber: phoneNumber.trim(),
        submissionDate,
        category,
        sampleCount,
        varietyName,
        lotVolumeLitres: lotVolume,
        feeDza: 1000,
        submittedAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        registrationNumber: regNumber
      };

      setMyRegistrations(prev => [newRegistration, ...prev]);
      setSubmissionSuccess(newRegistration);
      setIsSubmitting(false);

      // Scroll to confirmation card
      const el = document.getElementById('confirmation-recu');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  const handleResetForm = () => {
    setFullName('');
    setCompanyName('');
    setAddress('');
    setEmail('');
    setPhoneNumber('');
    setSubmissionSuccess(null);
    setFormError(null);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <section id="concours" className="py-16 sm:py-24 bg-[#F4EEE1] border-b border-[#E6DEC9] scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
            <Trophy className="w-4 h-4 text-[#E6AB3C]" />
            <span>Événement Officiel Annuel · Fête de l'Olive de Béjaïa</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18230F] tracking-tight">
            Concours de la meilleure huile d'olive
          </h2>
          <p className="mt-3 text-base text-[#436229] leading-relaxed">
            L’Association de l’oléiculture et des industries oléicoles de Bejaia, en collaboration avec la Direction des Services Agricoles de la wilaya, organise chaque année à l'occasion de la Fête de l'Olive, le concours de la meilleure huile d'olive de la saison. Ce concours est ouvert à tous les professionnels du secteur oléicole algérien.
          </p>
          <div className="mt-4">
            <ArticleAudioReader
              sectionId="concours"
              title="Concours Annuel de la Meilleure Huile d'Olive de Béjaïa"
              text="L'Association de l'oléiculture et des industries oléicoles de Béjaïa (ADOIO), en collaboration avec la Direction des Services Agricoles de la wilaya, organise chaque année à l'occasion de la Fête de l'Olive le concours de la meilleure huile d'olive de la saison. Trois catégories officielles sont ouvertes aux producteurs et mouliniers : Catégorie 1, meilleure huile d'olive monovariétale Fruité Vert issue d'une récolte précoce à mi-véraison. Catégorie 2, meilleure huile d'olive monovariétale Fruité Mûr issue d'olives à maturité complète. Catégorie 3, meilleure huile d'olive Fruité Goût à l'ancienne valorisant le savoir-faire traditionnel kabyle. Conditions de participation : le lot homogène présenté doit être d'au moins 300 litres d'huile d'olive de la campagne en cours, avec dépôt de deux échantillons de 75 centilitres pour analyse physico-chimique et dégustation à l'aveugle par un jury agréé selon le référentiel du Conseil Oléicole International."
            />
          </div>
        </div>

        {/* 3 Categories Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border-2 border-[#18230F] shadow-[4px_4px_0px_0px_#18230F] relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-full bg-[#E8F4D9] text-[#233416] font-bold text-sm flex items-center justify-center border border-[#31491E]">
                1
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#31491E] text-white text-[11px] font-bold uppercase tracking-wider">
                Catégorie 1
              </span>
            </div>
            <div className="text-xs uppercase font-bold text-[#567B34] tracking-wider mb-1">
              Monovariétale Vierge Extra
            </div>
            <h3 className="font-serif text-xl font-bold text-[#18230F] leading-snug">
              1. Concours de la meilleure huile d'olive monovariétale "Fruité Vert" 2026
            </h3>
            <p className="text-xs text-[#436229] mt-2 leading-relaxed">
              Récolte précoce à mi-véraison (olives vertes tournantes). Arômes vifs d’artichaut cru, d'herbe fraîche coupée et ardence équilibrée avec forte teneur en polyphénols.
            </p>
            <div className="mt-4 pt-3 border-t border-[#E6DEC9] flex items-center justify-between text-[11px] font-semibold text-[#31491E]">
              <span>Cépages phares : Chemlal, Azeradj</span>
              <Award className="w-4 h-4 text-[#E6AB3C]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-[#18230F] shadow-[4px_4px_0px_0px_#18230F] relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-full bg-[#FEF5DB] text-[#B47A16] font-bold text-sm flex items-center justify-center border border-[#B47A16]">
                2
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E6AB3C] text-[#18230F] text-[11px] font-bold uppercase tracking-wider">
                Catégorie 2
              </span>
            </div>
            <div className="text-xs uppercase font-bold text-[#B47A16] tracking-wider mb-1">
              Monovariétale Vierge Extra
            </div>
            <h3 className="font-serif text-xl font-bold text-[#18230F] leading-snug">
              2. Concours de la meilleure huile d'olive monovariétale "Fruité Mûr" 2026
            </h3>
            <p className="text-xs text-[#436229] mt-2 leading-relaxed">
              Récolte à maturité complète (fruits noirs). Profil soyeux, rond en bouche, notes d’amande douce, de pomme mûre et de fruits secs, sans amertume agressive.
            </p>
            <div className="mt-4 pt-3 border-t border-[#E6DEC9] flex items-center justify-between text-[11px] font-semibold text-[#31491E]">
              <span>Cépages phares : Aberkane, Limli</span>
              <Award className="w-4 h-4 text-[#E6AB3C]" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border-2 border-[#18230F] shadow-[4px_4px_0px_0px_#18230F] relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-full bg-[#FAF0EA] text-[#AF4D24] font-bold text-sm flex items-center justify-center border border-[#AF4D24]">
                3
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#AF4D24] text-white text-[11px] font-bold uppercase tracking-wider">
                Catégorie 3
              </span>
            </div>
            <div className="text-xs uppercase font-bold text-[#AF4D24] tracking-wider mb-1">
              Tradition & Terroir Kabyle
            </div>
            <h3 className="font-serif text-xl font-bold text-[#18230F] leading-snug">
              3. Concours de la meilleure huile d'olive "Fruité Goût à l'ancienne" 2026
            </h3>
            <p className="text-xs text-[#436229] mt-2 leading-relaxed">
              Élaborée selon le procédé traditionnel kabyle respectant une maturation contrôlée sans oxydation. Notes de sous-bois, pâte d’olive noire confite et pain chaud.
            </p>
            <div className="mt-4 pt-3 border-t border-[#E6DEC9] flex items-center justify-between text-[11px] font-semibold text-[#31491E]">
              <span>Pressoirs traditionnels & moulins villageois</span>
              <Award className="w-4 h-4 text-[#E6AB3C]" />
            </div>
          </div>
        </div>

        {/* Main Content Split: Form on Left/Center + Official Specifications & Rules on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          {/* ========================================================= */}
          {/* LEFT / CENTER : CANDIDATE REGISTRATION FORM (Exact Style) */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 bg-[#EBEFEA] p-6 sm:p-10 rounded-3xl border-2 border-[#18230F] shadow-[6px_6px_0px_0px_#18230F] relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18230F] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider mb-3">
                Pour participer, remplir le formulaire ci-dessous :
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#18230F] tracking-tight leading-snug max-w-md mx-auto">
                Je participe au concours de la meilleure huile d'olive 2026.
              </h3>
              <p className="text-xs text-[#567B34] mt-2 font-medium">
                Formulaire officiel d'inscription des échantillons · ADOIO & Direction des Services Agricoles (DSA) de Béjaïa
              </p>
            </div>

            {formError && (
              <div className="mb-6 p-3.5 bg-red-50 border-2 border-red-700 rounded-xl text-red-900 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Nom & prénom */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#18230F] block">
                  Nom & prénom
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ex: Rachid Ait-Mansour"
                    className="w-full px-4 py-3 bg-white text-[#18230F] text-sm font-medium border-2 border-[#18230F] shadow-[3px_3px_0px_0px_#18230F] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[1px_1px_0px_0px_#18230F] transition-all"
                  />
                </div>
              </div>

              {/* Raison sociale */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#18230F] block">
                  Raison sociale
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ex: Huilerie Moderne de Seddouk / Domaine Blady"
                  className="w-full px-4 py-3 bg-white text-[#18230F] text-sm font-medium border-2 border-[#18230F] shadow-[3px_3px_0px_0px_#18230F] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[1px_1px_0px_0px_#18230F] transition-all"
                />
              </div>

              {/* Adresse */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#18230F] block">
                  Adresse
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ex: Village Amalou, Commune de Seddouk, W. Béjaïa"
                  className="w-full px-4 py-3 bg-white text-[#18230F] text-sm font-medium border-2 border-[#18230F] shadow-[3px_3px_0px_0px_#18230F] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[1px_1px_0px_0px_#18230F] transition-all"
                />
              </div>

              {/* E-mail * */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#18230F] block">
                  E-mail *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@domaine-kabylie.dz"
                  className="w-full px-4 py-3 bg-white text-[#18230F] text-sm font-medium border-2 border-[#18230F] shadow-[3px_3px_0px_0px_#18230F] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[1px_1px_0px_0px_#18230F] transition-all"
                />
              </div>

              {/* Indicatif * & Téléphone * */}
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-5 sm:col-span-4 space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[#18230F] block truncate">
                    Indicatif *
                  </label>
                  <select
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                    className="w-full px-3 py-3 bg-white text-[#18230F] text-sm font-medium border-2 border-[#18230F] shadow-[3px_3px_0px_0px_#18230F] focus:outline-none cursor-pointer"
                  >
                    <option value="DZ (+213)">DZ (+213)</option>
                    <option value="FR (+33)">FR (+33)</option>
                    <option value="TN (+216)">TN (+216)</option>
                    <option value="MA (+212)">MA (+212)</option>
                  </select>
                </div>

                <div className="col-span-7 sm:col-span-8 space-y-1.5">
                  <label className="text-xs sm:text-sm font-semibold text-[#18230F] block">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0661 23 45 67"
                    className="w-full px-4 py-3 bg-white text-[#18230F] text-sm font-medium border-2 border-[#18230F] shadow-[3px_3px_0px_0px_#18230F] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[1px_1px_0px_0px_#18230F] transition-all"
                  />
                </div>
              </div>

              {/* Sélectionnez une date */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#18230F] block">
                  Sélectionnez une date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white text-[#18230F] text-sm font-medium border-2 border-[#18230F] shadow-[3px_3px_0px_0px_#18230F] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Je participe au concours 2026 */}
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-[#18230F] block">
                  Je participe au concours 2026
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white text-[#18230F] text-sm font-semibold border-2 border-[#18230F] shadow-[3px_3px_0px_0px_#18230F] focus:outline-none cursor-pointer"
                >
                  <option value="Fruité Vert">1. Concours de la meilleure huile d'olive monovariétale "Fruité Vert" 2026</option>
                  <option value="Fruité Mûr">2. Concours de la meilleure huile d'olive monovariétale "Fruité Mûr" 2026</option>
                  <option value="Fruité Goût à l'ancienne">3. Concours de la meilleure huile d'olive "Fruité Goût à l'ancienne" 2026</option>
                </select>
              </div>

              {/* Nombre d'échantillons ? */}
              <div className="space-y-2 pt-1">
                <label className="text-xs sm:text-sm font-semibold text-[#18230F] block">
                  Nombre d'échantillons ?
                </label>
                <div className="space-y-2 pt-1">
                  {(['Trois', 'Quatre', 'Cinq'] as const).map((count) => {
                    const isSelected = sampleCount === count;
                    return (
                      <label
                        key={count}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={`w-5 h-5 rounded-full border-2 border-[#18230F] flex items-center justify-center transition-all ${
                          isSelected ? 'bg-white' : 'bg-transparent'
                        }`}>
                          {isSelected && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#18230F]" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="sampleCount"
                          value={count}
                          checked={isSelected}
                          onChange={() => setSampleCount(count)}
                          className="hidden"
                        />
                        <span className="text-sm font-medium text-[#18230F]">
                          {count}
                        </span>
                        {count === 'Cinq' && (
                          <span className="text-[11px] text-[#567B34] font-semibold">
                            (Conforme règlement COI · 5x 500 ml)
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Optional Terroir Additions */}
              <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[#18230F] block mb-1">Cépage de l'huile :</label>
                  <select
                    value={varietyName}
                    onChange={(e) => setVarietyName(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-[#18230F] text-xs font-medium"
                  >
                    <option value="Chemlal">Chemlal de Kabylie (Pur)</option>
                    <option value="Bouchouk">Bouchouk</option>
                    <option value="Aberkane">Aberkane</option>
                    <option value="Limli">Limli</option>
                    <option value="Azeradj">Azeradj</option>
                    <option value="Assemblage">Assemblage Terroir</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#18230F] block mb-1">Volume du lot (L) :</label>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    value={lotVolume}
                    onChange={(e) => setLotVolume(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-white border border-[#18230F] text-xs font-medium"
                  />
                </div>
              </div>

              {/* Participation Fee Notice & Submit Button */}
              <div className="pt-3 space-y-4">
                <p className="text-xs text-[#18230F]/90 font-medium leading-relaxed">
                  Les frais de participation pour ce concours sont de <strong>1000 DZA</strong> par huile présentée.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 bg-black hover:bg-neutral-800 text-white font-bold text-base tracking-wide border-2 border-black transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Traitement de l'inscription en cours...</span>
                  ) : (
                    <span>S'inscrire</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ========================================================= */}
          {/* RIGHT : CAHIER DES CHARGES & RÈGLEMENT OFFICIEL DU PRIX   */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Rules Container Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E6DEC9] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC9]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34] block">
                    Normes Internationales COI & Analyses
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                    Cahier des charges du concours
                  </h4>
                  <p className="text-xs text-[#436229] font-semibold mt-1">
                    Les huiles admises aux concours doivent être conformes au cahier des charges suivant :
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FEF5DB] flex items-center justify-center text-[#B47A16] shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              {/* The 7 Official Rules stated by the organizer */}
              <ol className="space-y-3.5 text-xs text-[#242A20] leading-relaxed">
                <li className="flex items-start gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC9]">
                  <span className="w-6 h-6 rounded-full bg-[#31491E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-[#18230F] block mb-0.5">Huiles admises :</strong>
                    Seules sont admises au Prix les huiles d’olive monovariétales vierges extra de la campagne oléicole en cours et répondant aux exigences de la norme commerciale applicable à l’huile d’olive et à l’huile de grignons d’olive adoptée par le Conseil oléicole international (COI).
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC9]">
                  <span className="w-6 h-6 rounded-full bg-[#31491E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-[#18230F] block mb-0.5">Pluralité des candidatures :</strong>
                    Chaque participant peut présenter plusieurs huiles d’olive monovariétales vierge extra pour cette compétition (ex: Chemlal, Bouchouk, Aberkane).
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC9]">
                  <span className="w-6 h-6 rounded-full bg-[#31491E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-[#18230F] block mb-0.5">Droits d'inscription :</strong>
                    Chaque participant paiera <strong>1 000 DA</strong> comme droit d’inscription pour chaque huile présentée pour le concours.
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC9]">
                  <span className="w-6 h-6 rounded-full bg-[#31491E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <strong className="text-[#18230F] block mb-0.5">Échantillonnage obligatoire :</strong>
                    Le nombre d’échantillons nécessaires pour chaque huile objet du concours est de <strong>5 échantillons de produits d’un volume de 500 ml chacun</strong>, remplis dans des bouteilles en verre coloré (protection anti-UV).
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC9]">
                  <span className="w-6 h-6 rounded-full bg-[#31491E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    5
                  </span>
                  <div>
                    <strong className="text-[#18230F] block mb-0.5">Analyses physico-chimiques préalables :</strong>
                    Les huiles objet du concours vont être soumises aux analyses chimiques des critères de qualité en laboratoire agréé, à savoir <strong>l’acidité libre, les indices spectrophotométriques K232 et K270</strong> et la composition en acides gras avant l’analyse sensorielle.
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC9]">
                  <span className="w-6 h-6 rounded-full bg-[#31491E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    6
                  </span>
                  <div>
                    <strong className="text-[#18230F] block mb-0.5">Jury sensoriel agréé COI :</strong>
                    Un jury de dégustation agréé par le Conseil oléicole international sélectionne les huiles qui présentent les meilleures caractéristiques organoleptiques dans trois catégories suivant la fiche d’évaluation établie pour ce concours.
                  </div>
                </li>

                <li className="flex items-start gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E6DEC9]">
                  <span className="w-6 h-6 rounded-full bg-[#31491E] text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    7
                  </span>
                  <div>
                    <strong className="text-[#18230F] block mb-0.5">Palmarès & Médailles :</strong>
                    Pour les meilleures huiles d’olive sélectionnées, le jury décerne trois types de médailles : <strong>Médailles d’Or, Médailles d’Argent et Médailles de Bronze</strong> pour quatre types de fruité : <em>fruité mûr, fruité vert léger, fruité vert moyen et fruité vert intense</em>, suivant la note globale attribuée à l’huile.
                  </div>
                </li>
              </ol>

              {/* Deposition point banner */}
              <div className="p-4 bg-[#E8F4D9] rounded-2xl border border-[#8CBE5D]/50 text-xs text-[#233416] space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-sm text-[#18230F]">
                  <MapPin className="w-4 h-4 text-[#567B34]" />
                  <span>Dépôt des échantillons :</span>
                </span>
                <p className="leading-relaxed">
                  Chambre d’Agriculture de la Wilaya de Béjaïa (CAW) · Siège de l'ADOIO, Boulevard Krim Belkacem, 06000 Béjaïa.
                  Permanence assurée du dimanche au jeudi de 9h00 à 16h30.
                </p>
              </div>
            </div>

            {/* Medals Showcase Card */}
            <div className="bg-gradient-to-br from-[#233416] to-[#18230F] text-[#FAF7F2] p-6 sm:p-8 rounded-3xl border border-[#8CBE5D]/30 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-[#E6AB3C]" />
                  <h4 className="font-serif text-lg font-bold text-[#FAF7F2]">
                    Grille des Distinctions · Palmarès Fête de l'Olive
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-[#B0D984]">
                  Session 2026
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex flex-col items-center">
                  <img
                    src="/images/medailles/medaille-or.svg"
                    alt="Médaille d'Or"
                    className="w-12 h-12 object-contain mx-auto mb-1.5 drop-shadow-md hover:scale-110 transition-transform"
                  />
                  <span className="font-bold text-xs text-white block">Médaille d'Or</span>
                  <span className="text-[10px] text-[#E8F4D9]/80">Note &ge; 85/100</span>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex flex-col items-center">
                  <img
                    src="/images/medailles/medaille-argent.svg"
                    alt="Médaille d'Argent"
                    className="w-12 h-12 object-contain mx-auto mb-1.5 drop-shadow-md hover:scale-110 transition-transform"
                  />
                  <span className="font-bold text-xs text-white block">Médaille d'Argent</span>
                  <span className="text-[10px] text-[#E8F4D9]/80">Note 80 à 84</span>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex flex-col items-center">
                  <img
                    src="/images/medailles/medaille-bronze.svg"
                    alt="Médaille de Bronze"
                    className="w-12 h-12 object-contain mx-auto mb-1.5 drop-shadow-md hover:scale-110 transition-transform"
                  />
                  <span className="font-bold text-xs text-white block">Médaille de Bronze</span>
                  <span className="text-[10px] text-[#E8F4D9]/80">Note 75 à 79</span>
                </div>
              </div>

              <p className="text-[11px] text-[#E8F4D9]/80 leading-relaxed italic">
                Les lauréats bénéficient d’une mise en avant sur le portail officiel de l'ADOIO, d'un macaron millésimé officiel pour leurs étiquettes et d'un accompagnement à l'export vers les marchés internationaux.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CONFIRMATION CARD / ATTESTATION DE DÉPÔT (After Submit)   */}
        {/* ========================================================= */}
        {submissionSuccess && (
          <div id="confirmation-recu" className="bg-white rounded-3xl border-2 border-[#31491E] p-6 sm:p-10 shadow-xl mb-12 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DEC9]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E]">
                  <CheckCircle2 className="w-7 h-7 text-[#567B34]" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#567B34] block">
                    Inscription Validée avec Succès
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-[#18230F]">
                    Bordereau Officiel de Participation #{submissionSuccess.registrationNumber}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F4EEE1] border border-[#E6DEC9] text-[#18230F] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#567B34]" />
                  <span>Imprimer le Récépissé</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2 rounded-xl bg-[#31491E] text-white text-xs font-bold hover:bg-[#233416] transition-colors cursor-pointer"
                >
                  Nouvelle Inscription
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-[#E6DEC9] text-xs">
              <div className="space-y-1">
                <span className="text-[#6F9D44] font-semibold block">Candidat / Exploitant :</span>
                <strong className="text-sm font-bold text-[#18230F] block">{submissionSuccess.fullName}</strong>
                <span className="text-[#436229]">{submissionSuccess.companyName}</span>
                <p className="text-[#567B34]">{submissionSuccess.address}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[#6F9D44] font-semibold block">Catégorie du Concours :</span>
                <span className="px-3 py-1 rounded-full bg-[#E8F4D9] text-[#233416] font-bold inline-block text-xs">
                  {submissionSuccess.category}
                </span>
                <span className="block text-[#436229] mt-1">
                  Variété : <strong>{submissionSuccess.varietyName}</strong>
                </span>
                <span className="block text-[#567B34]">
                  Volume du lot en cuve : <strong>{submissionSuccess.lotVolumeLitres} Litres</strong>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[#6F9D44] font-semibold block">Instructions pour le Dépôt :</span>
                <strong className="text-[#18230F] block">{submissionSuccess.sampleCount} bouteilles de 500 ml en verre teinté</strong>
                <span className="text-[#AF4D24] font-bold block">Frais : {submissionSuccess.feeDza} DA à régler au dépôt</span>
                <span className="text-[#567B34] block">Date prévue : {submissionSuccess.submissionDate}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#567B34]">
              <p>
                Conservez ce récépissé avec vos 5 échantillons lors de la remise au secrétariat de l'ADOIO (Chambre d'Agriculture de Béjaïa).
              </p>
              <span className="font-mono text-[11px] text-[#18230F]">
                Enregistré le {submissionSuccess.submittedAt}
              </span>
            </div>
          </div>
        )}

        {/* Existing Registrations List if any */}
        {myRegistrations.length > 0 && !submissionSuccess && (
          <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 shadow-sm mb-12">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6DEC9] mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#567B34]" />
                <h4 className="font-serif text-lg font-bold text-[#18230F]">
                  Vos Inscriptions en Cours pour le Concours 2026 ({myRegistrations.length})
                </h4>
              </div>
              <span className="text-xs text-[#567B34]">Historique local</span>
            </div>

            <div className="space-y-3">
              {myRegistrations.map((reg) => (
                <div key={reg.id} className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E6DEC9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-[#18230F] bg-white px-2 py-0.5 rounded border border-[#E6DEC9]">
                        {reg.registrationNumber}
                      </span>
                      <span className="font-bold text-[#31491E]">{reg.category}</span>
                      <span className="text-[#6F9D44]">· Cépage {reg.varietyName}</span>
                    </div>
                    <span className="text-[#436229]">
                      Candidat : <strong>{reg.fullName}</strong> ({reg.companyName}) · {reg.phoneNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-[#AF4D24]">{reg.feeDza} DA</span>
                    <span className="px-2.5 py-1 rounded-lg bg-[#E8F4D9] text-[#233416] font-semibold text-[11px]">
                      {reg.sampleCount} flacons
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recharts Historical 5-Year Medals Evolution & Official 3 Medals Showcase */}
        <CompetitionMedalsChartSection />

      </div>
    </section>
  );
};
