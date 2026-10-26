import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Award, 
  MapPin, 
  Phone, 
  Mail, 
  Send,
  User,
  Building,
  Trees
} from 'lucide-react';
import { ADOIO_INFO } from '../data/bejaiaOliveData';

interface AdhesionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdhesionModal: React.FC<AdhesionModalProps> = ({ isOpen, onClose }) => {
  const [profileType, setProfileType] = useState<string>('oleiculteur');
  const [fullName, setFullName] = useState<string>('');
  const [farmName, setFarmName] = useState<string>('');
  const [commune, setCommune] = useState<string>('Seddouk');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [detailsCount, setDetailsCount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [referenceId, setReferenceId] = useState<string>('');

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `ADOIO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceId(generatedRef);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFullName('');
    setFarmName('');
    setPhone('');
    setEmail('');
    setDetailsCount('');
    setMessage('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="adhesion-modal-title"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] rounded-3xl border border-[#E6DEC9] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-black transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F4D9] flex items-center justify-center text-[#31491E] mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#567B34]" />
            </div>
            <h3 id="adhesion-modal-title" className="font-serif text-2xl font-bold text-[#18230F]">
              Demande Enregistrée avec Succès !
            </h3>
            <p className="text-xs sm:text-sm text-[#436229] max-w-md mx-auto leading-relaxed">
              Merci <strong>{fullName}</strong>. Votre dossier d'adhésion / prise de contact a été transmis au bureau de l'ADOIO ({ADOIO_INFO.headquarters}).
            </p>

            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC9] max-w-xs mx-auto text-left text-xs space-y-1">
              <span className="text-[10px] text-[#6F9D44] uppercase tracking-wider block font-bold">
                Numéro de Référence :
              </span>
              <span className="font-mono text-base font-bold text-[#31491E] block">
                {referenceId}
              </span>
              <span className="text-[11px] text-[#567B34] block pt-1 border-t border-[#E6DEC9]">
                Commune de raccordement : {commune}
              </span>
            </div>

            <div className="text-xs text-[#567B34] max-w-sm mx-auto">
              Un représentant de l'association prendra contact avec vous au <strong>{phone}</strong> pour finaliser votre affiliation ou convenir d'un rendez-vous technique.
            </div>

            <div className="pt-4">
              <button
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl bg-[#31491E] text-white text-xs font-bold shadow-md hover:bg-[#233416] transition-colors"
              >
                Terminer et Revenir au Portail
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34]">
                <Award className="w-4 h-4 text-[#E6AB3C]" />
                <span>Affiliation & Contact Officiel</span>
              </div>
              <h3 id="adhesion-modal-title" className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                Rejoindre l'Association ADOIO
              </h3>
              <p className="text-xs text-[#436229] mt-1">
                Participez activement au développement de l'oléiculture de la wilaya de Béjaïa et bénéficiez de nos formations, analyses et kits d'aide.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Type */}
              <div className="space-y-1" role="group" aria-labelledby="adhesion-profile-label">
                <span id="adhesion-profile-label" className="text-xs font-bold text-[#18230F] block">
                  Votre profil :
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'oleiculteur', label: 'Oléiculteur / Planteur' },
                    { id: 'moulinier', label: 'Huilerie / Moulinier' },
                    { id: 'cooperative', label: 'Coopérative' },
                    { id: 'conditionneur', label: 'Conditionneur / Négociant' },
                    { id: 'chercheur', label: 'Agronome / Étudiant' },
                    { id: 'amateur', label: 'Amateur d\'Huile' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={profileType === p.id}
                      onClick={() => setProfileType(p.id)}
                      className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                        profileType === p.id
                          ? 'border-[#31491E] bg-[#31491E] text-white'
                          : 'border-[#E6DEC9] bg-white text-[#242A20] hover:border-[#8CBE5D]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Farm Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="adhesion-fullname" className="text-xs font-semibold text-[#18230F]">
                    Nom & Prénom *
                  </label>
                  <input
                    id="adhesion-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex. Daoud Meziane"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-white focus:outline-none focus:border-[#31491E]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="adhesion-farmname" className="text-xs font-semibold text-[#18230F]">
                    Nom de l'exploitation / Huilerie (si applicable)
                  </label>
                  <input
                    id="adhesion-farmname"
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="Ex. Verger Soummam Bio"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-white focus:outline-none focus:border-[#31491E]"
                  />
                </div>
              </div>

              {/* Commune & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="adhesion-commune" className="text-xs font-semibold text-[#18230F]">
                    Commune (Wilaya de Béjaïa) *
                  </label>
                  <select
                    id="adhesion-commune"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-white focus:outline-none focus:border-[#31491E]"
                  >
                    {[
                      'Seddouk', 'Akbou', 'Tazmalt', 'Sidi Aïch', 'Ouzellaguen', 
                      'El Kseur', 'Amizour', 'Timezrit', 'Adekar', 'Chemini', 
                      'Ighzer Amokrane', 'Darguina', 'Béjaïa Ville', 'Autre commune'
                    ].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="adhesion-phone" className="text-xs font-semibold text-[#18230F]">
                    Téléphone *
                  </label>
                  <input
                    id="adhesion-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="06 XX XX XX XX / 05 XX XX XX XX"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-white focus:outline-none focus:border-[#31491E]"
                  />
                </div>
              </div>

              {/* Email & Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="adhesion-email" className="text-xs font-semibold text-[#18230F]">
                    Adresse Email (optionnelle)
                  </label>
                  <input
                    id="adhesion-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-white focus:outline-none focus:border-[#31491E]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="adhesion-details" className="text-xs font-semibold text-[#18230F]">
                    Nombre d'arbres ou capacité (facultatif)
                  </label>
                  <input
                    id="adhesion-details"
                    type="text"
                    value={detailsCount}
                    onChange={(e) => setDetailsCount(e.target.value)}
                    placeholder="Ex. 150 oliviers ou 40 qx/j"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-white focus:outline-none focus:border-[#31491E]"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label htmlFor="adhesion-message" className="text-xs font-semibold text-[#18230F]">
                  Message ou besoins spécifiques :
                </label>
                <textarea
                  id="adhesion-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Précisez votre demande : adhésion formelle, participation à la Fête de l'Olivier, demande de formation à la taille, fourniture de caisses ajourées..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DEC9] bg-white focus:outline-none focus:border-[#31491E]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4 text-[#E6AB3C]" />
                  <span>Envoyer ma demande à l'ADOIO</span>
                </button>
              </div>

              <div className="text-[11px] text-center text-[#567B34] flex items-center justify-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#E6AB3C]" />
                <span>Siège ADOIO : {ADOIO_INFO.headquarters}</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
