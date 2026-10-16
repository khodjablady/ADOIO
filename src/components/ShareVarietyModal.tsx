import React, { useState } from 'react';
import { OliveVariety } from '../data/bejaiaOliveData';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Droplets, 
  Calendar, 
  ExternalLink,
  MessageCircle,
  Send
} from 'lucide-react';

interface ShareVarietyModalProps {
  variety: OliveVariety;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareVarietyModal: React.FC<ShareVarietyModalProps> = ({
  variety,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [shareSuccessMessage, setShareSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Construct sharing URL pointing directly to this variety
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#varietes-${variety.id}`
    : `https://olive-bejaia.dz/#varietes-${variety.id}`;

  const shareTitle = `Fiche Oléicole : ${variety.name} (${variety.kabyleName}) · Wilaya de Béjaïa`;
  const shareText = `Découvrez la fiche technique de la variété d'olive "${variety.name}" (${variety.kabyleName}) de Kabylie : rendement en huile ${variety.oilYieldPercent}, arômes (${variety.flavorProfile.slice(0, 2).join(', ')}). Portail officiel ADOIO Béjaïa.`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareTitle}\n\n${shareText}\n\nConsulter la fiche : ${shareUrl}`);
      setCopied(true);
      setShareSuccessMessage('Lien et résumé technique copiés dans le presse-papiers !');
      setTimeout(() => {
        setCopied(false);
        setShareSuccessMessage(null);
      }, 3500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch {
        // User cancelled or share failed
      }
    } else {
      copyToClipboard();
    }
  };

  // Social Sharing URLs
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${shareTitle}\n${shareText}`);

  const socialLinks = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n\n${shareText}\n${shareUrl}`)}`,
      bgColor: 'bg-[#25D366] hover:bg-[#1EBE5D]',
      textColor: 'text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.115-.515-1.745-.718-2.884-2.483-2.97-2.6-.088-.114-.717-.954-.717-1.821 0-.867.452-1.294.613-1.467.161-.173.351-.217.468-.217.117 0 .234.001.336.006.107.005.25-.041.391.298.144.348.491 1.199.534 1.286.044.087.073.189.015.305-.058.115-.088.188-.175.289-.088.102-.185.228-.264.306-.088.087-.18.182-.077.359.102.176.455.751.977 1.216.671.597 1.236.782 1.412.87.175.087.278.073.38-.044.103-.116.44-.514.557-.69.117-.175.234-.145.394-.087.161.058 1.02.481 1.195.568.176.088.293.131.336.205.044.072.044.419-.1.824z" />
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.662 1.448 5.178L2.05 21.95l4.893-1.365C8.423 21.492 10.154 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.666 0-3.21-.52-4.484-1.411l-.322-.224-2.91.812.815-2.873-.243-.349A8.006 8.006 0 014 12c0-4.411 3.589-8.05 8-8.05 4.411 0 8 3.639 8 8.05 0 4.411-3.589 8.05-8 8.05z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bgColor: 'bg-[#1877F2] hover:bg-[#1464D2]',
      textColor: 'text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'X (Twitter)',
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=OliveBejaia,HuileDeKabylie,ADOIO`,
      bgColor: 'bg-black hover:bg-neutral-800',
      textColor: 'text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(shareTitle)}`,
      bgColor: 'bg-[#229ED9] hover:bg-[#1D8BC0]',
      textColor: 'text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bgColor: 'bg-[#0A66C2] hover:bg-[#084E96]',
      textColor: 'text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6z" />
        </svg>
      )
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E6DEC9] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with olive pattern gradient */}
        <div className="bg-gradient-to-r from-[#233416] via-[#31491E] to-[#18230F] p-6 text-[#FAF7F2] relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F2] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E6AB3C] mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Partager la Fiche Technique</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#FAF7F2]">
            {variety.name}
          </h3>
          <p className="text-xs text-[#B0D984] mt-0.5 font-serif italic">
            {variety.kabyleName} · {variety.proportionKabylie}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Card preview badge */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E6DEC9] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#567B34] font-semibold">
              <span>Aperçu de la fiche partagée :</span>
              <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#E6DEC9]">
                Réf. ADOIO
              </span>
            </div>

            <p className="text-xs text-[#242A20] line-clamp-2 leading-relaxed">
              {variety.description}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E6DEC9] text-xs">
              <div className="flex items-center gap-1.5 text-[#31491E]">
                <Droplets className="w-3.5 h-3.5 text-[#E6AB3C] shrink-0" />
                <span>Rendement : <strong>{variety.oilYieldPercent}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-[#31491E]">
                <Calendar className="w-3.5 h-3.5 text-[#E6AB3C] shrink-0" />
                <span>Récolte : <strong>{variety.harvestWindow}</strong></span>
              </div>
            </div>
          </div>

          {/* Social Platform Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#18230F] block">
              Diffuser sur vos réseaux :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {socialLinks.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xs ${platform.bgColor} ${platform.textColor} cursor-pointer`}
                >
                  {platform.icon}
                  <span>{platform.name}</span>
                </a>
              ))}

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] transition-transform active:scale-95 shadow-xs cursor-pointer col-span-2 sm:col-span-1"
                >
                  <Share2 className="w-4 h-4 text-[#E6AB3C]" />
                  <span>Plus d'options</span>
                </button>
              )}
            </div>
          </div>

          {/* Direct Link Copy */}
          <div className="space-y-2 pt-2 border-t border-[#E6DEC9]">
            <span className="text-xs font-bold text-[#18230F] block">
              Copier le lien direct de cette variété :
            </span>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#FAF7F2] px-3 py-2 rounded-xl border border-[#E6DEC9] text-xs font-mono text-[#567B34] truncate select-all">
                {shareUrl}
              </div>
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-4 py-2 rounded-xl bg-[#233416] hover:bg-[#18230F] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#8CBE5D]" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#E6AB3C]" />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>

            {shareSuccessMessage && (
              <p className="text-xs text-[#2E7D32] bg-[#E8F5E9] p-2.5 rounded-xl border border-[#A5D6A7] font-medium animate-in fade-in flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2E7D32] shrink-0" />
                <span>{shareSuccessMessage}</span>
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#FAF7F2] px-6 py-3 border-t border-[#E6DEC9] flex items-center justify-between text-[11px] text-[#567B34]">
          <span>Portail Oléicole de Béjaïa · ADOIO</span>
          <button
            onClick={onClose}
            className="font-bold text-[#18230F] hover:underline cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
