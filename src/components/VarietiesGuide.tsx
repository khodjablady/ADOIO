import React, { useState, useEffect } from 'react';
import { OLIVE_VARIETIES, OliveVariety } from '../data/bejaiaOliveData';
import { 
  Droplets, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Utensils, 
  Check, 
  ArrowRight,
  Info,
  Share2
} from 'lucide-react';
import { ShareVarietyModal } from './ShareVarietyModal';

export const VarietiesGuide: React.FC = () => {
  const [selectedVariety, setSelectedVariety] = useState<OliveVariety>(OLIVE_VARIETIES[0]);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [varietyToShare, setVarietyToShare] = useState<OliveVariety>(OLIVE_VARIETIES[0]);

  // Read URL hash or search param to automatically select shared variety
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#varietes-')) {
        const id = hash.replace('#varietes-', '');
        const found = OLIVE_VARIETIES.find((v) => v.id === id);
        if (found) setSelectedVariety(found);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenShare = (variety?: OliveVariety) => {
    const target = variety || selectedVariety;
    setVarietyToShare(target);
    setIsShareModalOpen(true);
    // Keep URL in sync with selected variety
    window.history.replaceState(null, '', `#varietes-${target.id}`);
  };

  return (
    <section id="varietes" className="py-16 sm:py-24 bg-[#F4EEE1] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
            <Droplets className="w-4 h-4 text-[#E6AB3C]" />
            <span>Patrimoine Génétique & Variétal de Kabylie</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
            Les Variétés d'Oliviers de la Région
          </h2>
          <p className="mt-3 text-base text-[#436229] leading-relaxed">
            Façonnées par des siècles de sélection paysanne dans les monts du Djurdjura et de la Soummam, les variétés de Béjaïa offrent une palette aromatique unique et une remarquable résistance aux aléas climatiques.
          </p>
        </div>

        {/* Variety Selection Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {OLIVE_VARIETIES.map((v) => {
            const isSelected = selectedVariety.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVariety(v)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#233416] text-[#FAF7F2] shadow-md -translate-y-0.5'
                    : 'bg-white text-[#242A20] border border-[#E6DEC9] hover:border-[#8CBE5D]'
                }`}
              >
                <span>{v.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-[#FAF7F2]/15 text-[#E6AB3C]' : 'bg-[#FAF7F2] text-[#567B34]'
                }`}>
                  {v.category === 'oil' ? 'À Huile' : 'Huile & Table'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Variety Detail Card */}
        <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 lg:p-10 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left overview */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-mono text-xs font-bold text-[#567B34] bg-[#E8F4D9] px-2.5 py-1 rounded">
                      Nom en Tamazight : {selectedVariety.kabyleName}
                    </span>
                    <span className="text-xs text-[#6F9D44] font-medium">
                      {selectedVariety.proportionKabylie}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenShare(selectedVariety)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D] text-xs font-bold transition-all shadow-xs hover:shadow-sm cursor-pointer group"
                    title={`Partager la fiche de ${selectedVariety.name}`}
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#E6AB3C] group-hover:scale-110 transition-transform" />
                    <span>Partager la fiche</span>
                  </button>
                </div>
                <h3 className="font-serif text-3xl font-bold text-[#18230F] mt-2">
                  {selectedVariety.name}
                </h3>
                <p className="text-sm text-[#436229] leading-relaxed mt-3">
                  {selectedVariety.description}
                </p>
              </div>

              {/* Flavor Profile Pills */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#18230F] block">
                  Signature Aromatique & Gustative :
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedVariety.flavorProfile.map((flavor) => (
                    <span
                      key={flavor}
                      className="px-3 py-1 rounded-lg bg-[#FEF5DB] border border-[#E6AB3C]/30 text-[#B47A16] text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#E6AB3C]" />
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Characteristics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E6DEC9] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#31491E]">
                    <Droplets className="w-4 h-4 text-[#E6AB3C]" />
                    <span>Rendement en Huile</span>
                  </div>
                  <p className="text-sm font-semibold text-[#18230F]">{selectedVariety.oilYieldPercent}</p>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E6DEC9] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#31491E]">
                    <Calendar className="w-4 h-4 text-[#E6AB3C]" />
                    <span>Fenêtre de Récolte</span>
                  </div>
                  <p className="text-sm font-semibold text-[#18230F]">{selectedVariety.harvestWindow}</p>
                </div>
              </div>

              {/* Culinary use */}
              <div className="p-4 rounded-xl bg-[#E8F4D9] border border-[#8CBE5D]/30 flex items-start gap-3">
                <Utensils className="w-5 h-5 text-[#31491E] shrink-0 mt-0.5" />
                <div className="text-xs text-[#233416]">
                  <strong className="block text-sm font-bold text-[#18230F] mb-1">
                    Conseil Culinaire ADOIO :
                  </strong>
                  {selectedVariety.bestUse}
                </div>
              </div>
            </div>

            {/* Right agronomic card */}
            <div className="lg:col-span-5 bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6DEC9] space-y-5">
              <h4 className="font-serif text-lg font-bold text-[#18230F] pb-3 border-b border-[#E6DEC9]">
                Fiche Morphologique & Agronomique
              </h4>

              <div className="space-y-4 text-xs text-[#436229]">
                <div>
                  <span className="font-bold text-[#18230F] block mb-1">Morphologie du fruit :</span>
                  <p className="leading-relaxed bg-white p-3 rounded-lg border border-[#E6DEC9]">
                    {selectedVariety.fruitCharacteristics}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#18230F] block mb-1">Rusticité & Comportement :</span>
                  <p className="leading-relaxed bg-white p-3 rounded-lg border border-[#E6DEC9]">
                    {selectedVariety.resistance}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-lg border border-[#E6DEC9] space-y-2">
                  <span className="font-bold text-[#18230F] block">Aptitude industrielle :</span>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#567B34]" />
                      <span>Extraction continue à froid : Excellente</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#567B34]" />
                      <span>Richesse en antioxydants : Très élevée</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#567B34]" />
                      <span>Stabilité oxydative : Remarquable (&gt; 18 mois)</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Social Share Bar */}
                <div className="pt-3 border-t border-[#E6DEC9] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#18230F]">
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-[#E6AB3C]" />
                      <span>Partager cette fiche technique :</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenShare(selectedVariety)}
                      className="text-[11px] font-bold text-[#31491E] hover:text-[#567B34] underline cursor-pointer"
                    >
                      Plus d'options
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Fiche Oléicole : ${selectedVariety.name} (${selectedVariety.kabyleName}) · Rendement : ${selectedVariety.oilYieldPercent}\n${typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#varietes-${selectedVariety.id}` : ''}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                      title="Partager sur WhatsApp"
                    >
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}#varietes-${selectedVariety.id}` : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2 rounded-xl bg-[#1877F2] hover:bg-[#1464D2] text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                      title="Partager sur Facebook"
                    >
                      <span>Facebook</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleOpenShare(selectedVariety)}
                      className="py-2 px-2 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
                      title="Copier le lien & options"
                    >
                      <Share2 className="w-3 h-3 text-[#E6AB3C]" />
                      <span>Diffuser</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Variety Comparison Matrix */}
        <div className="bg-white rounded-3xl border border-[#E6DEC9] p-6 sm:p-8 shadow-sm">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]">
                Tableau Comparatif des Variétés de la Wilaya
              </h3>
              <p className="text-xs text-[#567B34] mt-1">
                Repères techniques pour les oléiculteurs et pépiniéristes de Béjaïa
              </p>
            </div>
            <span className="text-[11px] text-[#6F9D44] font-medium">
              Cliquez sur l'icône de partage pour diffuser une variété
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#242A20]">
              <thead className="bg-[#FAF7F2] text-[#31491E] font-bold border-b border-[#E6DEC9]">
                <tr>
                  <th className="py-3 px-4">Variété</th>
                  <th className="py-3 px-4">Tamazight</th>
                  <th className="py-3 px-4">Proportion</th>
                  <th className="py-3 px-4">Rendement Huile</th>
                  <th className="py-3 px-4">Période Récolte</th>
                  <th className="py-3 px-4">Profil Principal</th>
                  <th className="py-3 px-4 text-center">Partager</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DEC9]">
                {OLIVE_VARIETIES.map((v) => (
                  <tr
                    key={v.id}
                    onClick={() => setSelectedVariety(v)}
                    className="hover:bg-[#FAF7F2] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-[#18230F]">{v.name}</td>
                    <td className="py-3.5 px-4 font-serif italic text-[#567B34]">{v.kabyleName}</td>
                    <td className="py-3.5 px-4 font-semibold">{v.proportionKabylie}</td>
                    <td className="py-3.5 px-4 font-bold text-[#E6AB3C]">{v.oilYieldPercent}</td>
                    <td className="py-3.5 px-4">{v.harvestWindow}</td>
                    <td className="py-3.5 px-4 text-[#436229]">{v.flavorProfile[0]}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenShare(v);
                        }}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] hover:border-[#8CBE5D] transition-colors cursor-pointer inline-flex items-center justify-center shadow-2xs"
                        title={`Partager la fiche de ${v.name}`}
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#E6AB3C]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Social Share Modal */}
        <ShareVarietyModal
          variety={varietyToShare}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      </div>
    </section>
  );
};
