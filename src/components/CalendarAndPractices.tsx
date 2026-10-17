import React, { useState } from 'react';
import { AGRICULTURAL_CALENDAR } from '../data/bejaiaOliveData';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  AlertTriangle, 
  BookOpen, 
  Leaf, 
  Clock, 
  Download,
  ArrowRight 
} from 'lucide-react';
import { BejaiaHarvestWeatherWidget } from './BejaiaHarvestWeatherWidget';
import { WeatherAlertCenter } from './WeatherAlertCenter';

export const CalendarAndPractices: React.FC = () => {
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState<number>(0);
  const currentSeason = AGRICULTURAL_CALENDAR[selectedSeasonIdx];

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <section id="pratiques" className="py-16 sm:py-24 bg-[#F4EEE1] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <BookOpen className="w-4 h-4 text-[#E6AB3C]" />
              <span>Guide Technique & Vulgarisation ADOIO</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              Calendrier Saisonnier & Bonnes Pratiques Oléicoles
            </h2>
            <p className="mt-2 text-sm text-[#436229] max-w-2xl leading-relaxed">
              Pour obtenir une huile d'olive Vierge Extra d'exception tout en préservant la longévité de nos oliviers centenaires, suivez les préconisations saisonnières de nos agronomes.
            </p>
          </div>

          <button
            onClick={handlePrintSummary}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E6DEC9] text-[#18230F] text-xs font-bold flex items-center gap-2 shadow-xs hover:bg-[#FAF7F2] transition-colors cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-[#567B34]" />
            <span>Imprimer le Guide Synthétique</span>
          </button>
        </div>

        {/* Real-time Agricultural Weather Widget for Harvest Planning */}
        <BejaiaHarvestWeatherWidget />

        {/* Agricultural Weather & Push Notification Alerts Center */}
        <WeatherAlertCenter className="mb-10" />

        {/* 4 Seasons Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {AGRICULTURAL_CALENDAR.map((season, idx) => {
            const isSelected = selectedSeasonIdx === idx;
            return (
              <button
                key={season.season}
                onClick={() => setSelectedSeasonIdx(idx)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#233416] text-[#FAF7F2] border-[#233416] shadow-md -translate-y-0.5'
                    : 'bg-white text-[#242A20] border-[#E6DEC9] hover:border-[#8CBE5D]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    isSelected ? 'text-[#E6AB3C]' : 'text-[#6F9D44]'
                  }`}>
                    Étape 0{idx + 1}
                  </span>
                  <span className="font-serif italic text-xs opacity-80">
                    {season.kabyleTerm}
                  </span>
                </div>
                <h3 className="font-serif text-base font-bold leading-tight">
                  {season.action}
                </h3>
                <p className={`text-xs mt-1 ${isSelected ? 'text-[#E8F4D9]/80' : 'text-[#567B34]'}`}>
                  {season.season.split('(')[0]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Season Detail Panel */}
        <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-xs mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-6 border-b border-[#E6DEC9]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#567B34]">
                Focus Opérationnel : {currentSeason.season}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#18230F] mt-1">
                {currentSeason.action}
              </h3>
            </div>
            <span className="font-serif italic text-sm text-[#31491E] bg-[#E8F4D9] px-3 py-1 rounded-full">
              Terme kabyle : {currentSeason.kabyleTerm}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F]">
                Interventions prioritaires recommandées par l'ADOIO :
              </h4>
              <ul className="space-y-3">
                {currentSeason.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-3 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DEC9]">
                    <CheckCircle2 className="w-5 h-5 text-[#567B34] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#242A20] leading-relaxed font-medium">
                      {task}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Do's and Don'ts comparison card */}
            <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6DEC9] space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#18230F]">
                Ce qu'il faut faire vs À proscrire absolument :
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2 text-[#233416]">
                  <CheckCircle2 className="w-4 h-4 text-[#567B34] shrink-0 mt-0.5" />
                  <span><strong>À privilégier :</strong> Récolte sur filets propres suspendus ou déroulés, peignes électriques légers, transport sous 24h.</span>
                </div>
                <div className="flex items-start gap-2 text-[#AF4D24]">
                  <XCircle className="w-4 h-4 text-[#AF4D24] shrink-0 mt-0.5" />
                  <span><strong>À bannir :</strong> Le gaulage violent au gourdin qui brise les bourgeons floraux de l'année suivante et favorise l'alternance biennale.</span>
                </div>
                <div className="flex items-start gap-2 text-[#AF4D24]">
                  <XCircle className="w-4 h-4 text-[#AF4D24] shrink-0 mt-0.5" />
                  <span><strong>À bannir :</strong> L'entassement des olives dans des sacs en polyéthylène hermétiques qui accélère la montée en température et l'acidité.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental sustainability & by-products valorization */}
        <div className="bg-gradient-to-br from-[#233416] to-[#18230F] text-[#FAF7F2] rounded-3xl p-6 sm:p-8 border border-[#8CBE5D]/30 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8CBE5D]/20 flex items-center justify-center text-[#8CBE5D]">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#FAF7F2]">
                Écologie Oléicole & Économie Circulaire
              </h3>
              <p className="text-xs text-[#B0D984]">Gestion durable des sous-produits de l'olivier à Béjaïa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#E8F4D9]">
            <div className="bg-[#FAF7F2]/10 p-4 rounded-xl border border-[#FAF7F2]/10 space-y-2">
              <span className="font-bold text-[#E6AB3C] block">1. Valorisation des Grignons</span>
              <p className="leading-relaxed">
                Les résidus solides (pulpe et noyau broyé) sont séchés et transformés en pellets combustibles écologiques pour les chaudières ou valorisés en briquettes de chauffage.
              </p>
            </div>

            <div className="bg-[#FAF7F2]/10 p-4 rounded-xl border border-[#FAF7F2]/10 space-y-2">
              <span className="font-bold text-[#E6AB3C] block">2. Traitement des Margines</span>
              <p className="leading-relaxed">
                Les eaux de végétation acides sont dirigées vers des bassins d'évaporation contrôlés afin de prévenir toute pollution des nappes et des cours d'eau de la Soummam.
              </p>
            </div>

            <div className="bg-[#FAF7F2]/10 p-4 rounded-xl border border-[#FAF7F2]/10 space-y-2 flex flex-col justify-between">
              <div>
                <span className="font-bold text-[#E6AB3C] block">3. Compostage & Fertilisation</span>
                <p className="leading-relaxed">
                  Mélangés aux fumiers locaux et aux feuilles d'olivier, les grignons épuisés créent un compost riche en humus restitué aux oliveraies pour régénérer les sols.
                </p>
              </div>
              <a
                href="#fertilisation"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8CBE5D] hover:text-[#FAF7F2] transition-colors mt-2"
              >
                <span>Calculer vos doses de compost</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
