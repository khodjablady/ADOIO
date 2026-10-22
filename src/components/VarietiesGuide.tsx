import React, { useState, useEffect } from 'react';
import { OLIVE_VARIETIES, OliveVariety } from '../data/bejaiaOliveData';
import { 
  Droplets, 
  Sparkles, 
  Calendar, 
  Utensils, 
  Check, 
  ArrowRight,
  Share2,
  Copy
} from 'lucide-react';
import { ShareVarietyModal } from './ShareVarietyModal';

export const VarietiesGuide: React.FC = () => {
  const [selectedVariety, setSelectedVariety] = useState<OliveVariety>(OLIVE_VARIETIES[0]);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [varietyToShare, setVarietyToShare] = useState<OliveVariety>(OLIVE_VARIETIES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const getVarietyShareData = (variety: OliveVariety) => {
    const baseUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : 'https://olive-bejaia.dz/';
    const url = `${baseUrl}#varietes-${variety.id}`;
    const title = `Variété d'olive de Kabylie : ${variety.name} (${variety.kabyleName})`;
    const summary = `${title} — Proportion : ${variety.proportionKabylie} | Rendement en huile : ${variety.oilYieldPercent} | Arômes : ${variety.flavorProfile.slice(0, 3).join(', ')}. Guide Variétal ADOIO Béjaïa :`;

    return {
      url,
      whatsappUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${summary}\n${url}`)}`,
      facebookUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(summary)}`,
      twitterUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(summary)}&url=${encodeURIComponent(url)}&hashtags=OliveBejaia,HuileDOliveKabylie,ADOIO`,
      copyText: `${summary}\n${url}`,
    };
  };

  const handleCopyVarietyLink = async (variety: OliveVariety) => {
    const { copyText } = getVarietyShareData(variety);
    try {
      await navigator.clipboard.writeText(copyText);
      setCopiedId(variety.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      setCopiedId(variety.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleOpenShare = (variety?: OliveVariety) => {
    const target = variety || selectedVariety;
    setVarietyToShare(target);
    setIsShareModalOpen(true);
    window.history.replaceState(null, '', `#varietes-${target.id}`);
  };

  const activeShare = getVarietyShareData(selectedVariety);

  return (
    <section id="varietes" className="py-16 sm:py-24 bg-[#F4EEE1] border-b border-[#E6DEC9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Global Guide Social Share Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#567B34] mb-2">
              <Droplets className="w-4 h-4 text-[#E6AB3C]" />
              <span>Patrimoine Génétique & Variétal de Kabylie</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#18230F] tracking-tight">
              Guide des Variétés d'Oliviers de la Région
            </h2>
            <p className="mt-3 text-base text-[#436229] leading-relaxed">
              Façonnées par des siècles de sélection paysanne dans les monts du Djurdjura et de la Soummam, les variétés de Béjaïa offrent une palette aromatique unique et une remarquable résistance aux aléas climatiques.
            </p>
          </div>

          {/* Direct Social Share Bar in Section Header */}
          <div className="bg-white/90 backdrop-blur-xs border border-[#E6DEC9] rounded-2xl p-3.5 shadow-xs shrink-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#31491E] mb-2 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-[#E6AB3C]" />
              <span>Partager la variété ({selectedVariety.name}) :</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={activeShare.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Partager ${selectedVariety.name} sur WhatsApp`}
                title={`Partager ${selectedVariety.name} sur WhatsApp`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold shadow-2xs transition-transform active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.115-.515-1.745-.718-2.884-2.483-2.97-2.6-.088-.114-.717-.954-.717-1.821 0-.867.452-1.294.613-1.467.161-.173.351-.217.468-.217.117 0 .234.001.336.006.107.005.25-.041.391.298.144.348.491 1.199.534 1.286.044.087.073.189.015.305-.058.115-.088.188-.175.289-.088.102-.185.228-.264.306-.088.087-.18.182-.077.359.102.176.455.751.977 1.216.671.597 1.236.782 1.412.87.175.087.278.073.38-.044.103-.116.44-.514.557-.69.117-.175.234-.145.394-.087.161.058 1.02.481 1.195.568.176.088.293.131.336.205.044.072.044.419-.1.824z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.662 1.448 5.178L2.05 21.95l4.893-1.365C8.423 21.492 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.666 0-3.21-.52-4.484-1.411l-.322-.224-2.91.812.815-2.873-.243-.349A8.006 8.006 0 014 12c0-4.411 3.589-8.05 8-8.05 4.411 0 8 3.639 8 8.05 0 4.411-3.589 8.05-8 8.05z" />
                </svg>
                <span>WhatsApp</span>
              </a>

              <a
                href={activeShare.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Partager ${selectedVariety.name} sur Facebook`}
                title={`Partager ${selectedVariety.name} sur Facebook`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#1464D2] text-white text-xs font-bold shadow-2xs transition-transform active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Facebook</span>
              </a>

              <a
                href={activeShare.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Partager ${selectedVariety.name} sur Twitter / X`}
                title={`Partager ${selectedVariety.name} sur Twitter / X`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1419] hover:bg-[#272C30] text-white text-xs font-bold shadow-2xs transition-transform active:scale-95"
              >
                <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Twitter</span>
              </a>
            </div>
          </div>
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
                    title={`Ouvrir toutes les options de partage pour ${selectedVariety.name}`}
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

                {/* Quick Social Share Bar (WhatsApp, Facebook, Twitter + Copy) */}
                <div className="pt-3 border-t border-[#E6DEC9] space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#18230F]">
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-[#E6AB3C]" />
                      <span>Partager cette fiche technique :</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyVarietyLink(selectedVariety)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#31491E] hover:text-[#567B34] cursor-pointer"
                      title="Copier le lien direct et le résumé"
                    >
                      {copiedId === selectedVariety.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#25D366]" />
                          <span>Lien copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#E6AB3C]" />
                          <span>Copier le lien</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={activeShare.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                      title={`Partager ${selectedVariety.name} sur WhatsApp`}
                    >
                      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.115-.515-1.745-.718-2.884-2.483-2.97-2.6-.088-.114-.717-.954-.717-1.821 0-.867.452-1.294.613-1.467.161-.173.351-.217.468-.217.117 0 .234.001.336.006.107.005.25-.041.391.298.144.348.491 1.199.534 1.286.044.087.073.189.015.305-.058.115-.088.188-.175.289-.088.102-.185.228-.264.306-.088.087-.18.182-.077.359.102.176.455.751.977 1.216.671.597 1.236.782 1.412.87.175.087.278.073.38-.044.103-.116.44-.514.557-.69.117-.175.234-.145.394-.087.161.058 1.02.481 1.195.568.176.088.293.131.336.205.044.072.044.419-.1.824z" />
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.662 1.448 5.178L2.05 21.95l4.893-1.365C8.423 21.492 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.666 0-3.21-.52-4.484-1.411l-.322-.224-2.91.812.815-2.873-.243-.349A8.006 8.006 0 014 12c0-4.411 3.589-8.05 8-8.05 4.411 0 8 3.639 8 8.05 0 4.411-3.589 8.05-8 8.05z" />
                      </svg>
                      <span>WhatsApp</span>
                    </a>

                    <a
                      href={activeShare.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-[#1877F2] hover:bg-[#1464D2] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                      title={`Partager ${selectedVariety.name} sur Facebook`}
                    >
                      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Facebook</span>
                    </a>

                    <a
                      href={activeShare.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2.5 rounded-xl bg-[#0F1419] hover:bg-[#272C30] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                      title={`Partager ${selectedVariety.name} sur Twitter / X`}
                    >
                      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span>Twitter</span>
                    </a>
                  </div>
                </div>

                {/* Cross-linking to Yield Simulator */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const simEl = document.getElementById('simulateur');
                      if (simEl) {
                        simEl.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#233416] text-xs font-bold border border-[#8CBE5D]/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Simuler le rendement de la {selectedVariety.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#436229]" />
                  </button>
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
              Partage direct sur WhatsApp, Facebook ou Twitter pour chaque variété
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
                  <th className="py-3 px-4 text-center">Partage Social</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DEC9]">
                {OLIVE_VARIETIES.map((v) => {
                  const rowShare = getVarietyShareData(v);
                  return (
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
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center justify-center gap-1.5">
                          <a
                            href={rowShare.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Partager ${v.name} sur WhatsApp`}
                            title={`Partager ${v.name} sur WhatsApp`}
                            className="p-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.115-.515-1.745-.718-2.884-2.483-2.97-2.6-.088-.114-.717-.954-.717-1.821 0-.867.452-1.294.613-1.467.161-.173.351-.217.468-.217.117 0 .234.001.336.006.107.005.25-.041.391.298.144.348.491 1.199.534 1.286.044.087.073.189.015.305-.058.115-.088.188-.175.289-.088.102-.185.228-.264.306-.088.087-.18.182-.077.359.102.176.455.751.977 1.216.671.597 1.236.782 1.412.87.175.087.278.073.38-.044.103-.116.44-.514.557-.69.117-.175.234-.145.394-.087.161.058 1.02.481 1.195.568.176.088.293.131.336.205.044.072.044.419-.1.824z" />
                              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.662 1.448 5.178L2.05 21.95l4.893-1.365C8.423 21.492 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.666 0-3.21-.52-4.484-1.411l-.322-.224-2.91.812.815-2.873-.243-.349A8.006 8.006 0 014 12c0-4.411 3.589-8.05 8-8.05 4.411 0 8 3.639 8 8.05 0 4.411-3.589 8.05-8 8.05z" />
                            </svg>
                          </a>
                          <a
                            href={rowShare.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Partager ${v.name} sur Facebook`}
                            title={`Partager ${v.name} sur Facebook`}
                            className="p-1.5 rounded-lg bg-[#1877F2]/15 hover:bg-[#1877F2] text-[#1877F2] hover:text-white transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                          <a
                            href={rowShare.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Partager ${v.name} sur Twitter / X`}
                            title={`Partager ${v.name} sur Twitter / X`}
                            className="p-1.5 rounded-lg bg-gray-900/10 hover:bg-gray-900 text-gray-800 hover:text-white transition-colors"
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenShare(v)}
                            className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] hover:border-[#8CBE5D] transition-colors cursor-pointer"
                            title={`Plus d'options de partage pour ${v.name}`}
                          >
                            <Share2 className="w-3.5 h-3.5 text-[#E6AB3C]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
