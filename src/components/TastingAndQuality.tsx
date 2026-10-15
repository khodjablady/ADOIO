import React, { useState } from 'react';
import { 
  TASTING_GUIDE, 
  CULINARY_PAIRINGS 
} from '../data/bejaiaOliveData';
import { 
  Award, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle, 
  Utensils, 
  AlertCircle,
  Eye,
  Wind,
  Heart,
  Droplets
} from 'lucide-react';

export const TastingAndQuality: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attributes' | 'grades' | 'pairings' | 'storage'>('attributes');

  return (
    <section id="degustation" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
            <Award className="w-4 h-4 text-[#E6AB3C]" />
            <span>Guide Sensoriel & Normes Internationales COI</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
            L'Huile d'Olive de Kabylie : Dégustation & Qualité
          </h2>
          <p className="mt-3 text-base text-[#436229] leading-relaxed">
            Reconnue pour son fruité chaleureux et sa haute teneur en polyphénols antioxydants, l'huile de Béjaïa répond aux exigences les plus rigoureuses du Conseil Oléicole International (COI).
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-[#F4EEE1] p-1.5 rounded-2xl border border-[#E6DEC9] max-w-2xl">
          <button
            onClick={() => setActiveTab('attributes')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'attributes'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'text-[#31491E] hover:text-[#18230F]'
            }`}
          >
            Les 3 Attributs Majeurs
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'grades'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'text-[#31491E] hover:text-[#18230F]'
            }`}
          >
            Grades Officiels COI
          </button>
          <button
            onClick={() => setActiveTab('pairings')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pairings'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'text-[#31491E] hover:text-[#18230F]'
            }`}
          >
            Accords Gastronomiques
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'storage'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'text-[#31491E] hover:text-[#18230F]'
            }`}
          >
            Conservation Idéale
          </button>
        </div>

        {/* Tab 1: The 3 Attributes */}
        {activeTab === 'attributes' && (
          <div className="space-y-8 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TASTING_GUIDE.positiveAttributes.map((attr, idx) => (
                <div
                  key={attr.name}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E6DEC9] shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#E8F4D9] flex items-center justify-center text-[#31491E]">
                      {idx === 0 ? <Wind className="w-6 h-6 text-[#567B34]" /> : idx === 1 ? <Eye className="w-6 h-6 text-[#E6AB3C]" /> : <Heart className="w-6 h-6 text-[#AF4D24]" />}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#18230F]">
                        {attr.name}
                      </h3>
                      <p className="text-xs text-[#567B34] mt-2 leading-relaxed">
                        {attr.definition}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E6DEC9] bg-[#FAF7F2] p-3.5 rounded-xl">
                    <span className="text-[11px] font-bold text-[#18230F] block mb-1">
                      Dans le terroir de Béjaïa :
                    </span>
                    <p className="text-xs text-[#436229] leading-relaxed">
                      {attr.kabyleNotes}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* How to taste like a professional panelist */}
            <div className="bg-[#233416] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#8CBE5D]/30">
              <h3 className="font-serif text-xl font-bold text-[#FAF7F2] mb-4">
                Le Protocole de Dégustation Professionnel (Panel Test)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-[#E8F4D9]">
                <div className="space-y-1">
                  <span className="font-mono text-[#E6AB3C] font-bold block">Étape 01 · Chauffer</span>
                  <p>Tenir le petit verre bleu ou ambré dans la paume de la main pour amener l'huile à ~28°C et libérer les molécules volatiles.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[#E6AB3C] font-bold block">Étape 02 · Olfaction</span>
                  <p>Inspirer profondément en tournoyant le verre pour évaluer le fruité (vert d'herbe ou mûr de fruits) et vérifier l'absence de défauts.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[#E6AB3C] font-bold block">Étape 03 · Strippagio</span>
                  <p>Prendre une gorgée d'huile et aspirer de l'air vivement entre les lèvres pour tapisser l'ensemble des récepteurs de la cavité buccale.</p>
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[#E6AB3C] font-bold block">Étape 04 · Déglutition</span>
                  <p>Avaler lentement pour ressentir l'ardence (picotement au fond de la gorge caractéristique de l'oléocanthal bénéfique pour la santé).</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: COI Grades */}
        {activeTab === 'grades' && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TASTING_GUIDE.coiCategories.map((cat, idx) => (
                <div
                  key={cat.grade}
                  className={`bg-white rounded-2xl p-6 sm:p-7 border shadow-xs space-y-4 ${
                    idx === 0 ? 'border-[#8CBE5D] ring-2 ring-[#8CBE5D]/30' : 'border-[#E6DEC9]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      idx === 0 ? 'bg-[#E8F4D9] text-[#233416]' : idx === 1 ? 'bg-[#FEF5DB] text-[#B47A16]' : 'bg-red-50 text-red-700'
                    }`}>
                      {idx === 0 ? 'Élite Terroir' : idx === 1 ? 'Qualité Vierge' : 'Non commerciale en l\'état'}
                    </span>
                    {idx === 0 && <ShieldCheck className="w-5 h-5 text-[#567B34]" />}
                  </div>

                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#18230F]">
                      {cat.grade}
                    </h3>
                    <p className="text-xs text-[#E6AB3C] font-mono font-bold mt-1">
                      {cat.acidity}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-[#436229] pt-3 border-t border-[#E6DEC9]">
                    <p><strong>Peroxydes :</strong> {cat.peroxide}</p>
                    <p><strong>Caractéristiques :</strong> {cat.tastingNotes}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E6DEC9] text-xs text-[#436229] leading-relaxed">
              <strong>Engagement Qualité ADOIO :</strong> L'association soutient les oléiculteurs de Béjaïa dans l'acquisition de réfractomètres et kits d'acidité rapide afin de classer chaque lot d'huile dès la sortie du décanteur centrifuge.
            </div>
          </div>
        )}

        {/* Tab 3: Culinary Pairings */}
        {activeTab === 'pairings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in-50 duration-200">
            {CULINARY_PAIRINGS.map((item) => (
              <div
                key={item.dish}
                className="bg-white rounded-2xl p-6 border border-[#E6DEC9] shadow-xs space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#E6AB3C]" />
                  <h3 className="font-serif text-lg font-bold text-[#18230F]">
                    {item.dish}
                  </h3>
                </div>
                <div className="inline-block px-2.5 py-1 rounded bg-[#E8F4D9] text-[#233416] text-xs font-semibold">
                  Type conseillé : {item.oilType}
                </div>
                <p className="text-xs sm:text-sm text-[#436229] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Storage */}
        {activeTab === 'storage' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] shadow-xs space-y-6 animate-in fade-in-50 duration-200">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
              Les 4 Ennemis de l'Huile d'Olive & Règles de Conservation
            </h3>
            <p className="text-xs sm:text-sm text-[#436229]">
              L'huile d'olive est un pur jus de fruit frais : elle ne vieillit pas comme le vin et doit être protégée pour préserver ses vitamines et ses composés phénoliques.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TASTING_GUIDE.storageAdvice.map((advice, i) => (
                <div
                  key={i}
                  className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E6DEC9] flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-[#567B34] shrink-0 mt-0.5" />
                  <span className="text-xs text-[#242A20] leading-relaxed font-medium">
                    {advice}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
