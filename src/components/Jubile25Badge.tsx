import React, { useState, useEffect, useRef } from 'react';
import { Jubile25Logo } from './Jubile25Logo';
import { Upload, Sparkles, Check } from 'lucide-react';

interface Jubile25BadgeProps {
  className?: string;
  size?: number;
  onClick?: () => void;
  showCaption?: boolean;
}

export const Jubile25Badge: React.FC<Jubile25BadgeProps> = ({
  className = '',
  size = 150,
  onClick,
  showCaption = true,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check localStorage first for user-uploaded custom logo
    const stored = localStorage.getItem('adoio_jubile_25_logo');
    if (stored) {
      setImageSrc(stored);
      return;
    }

    // Try loading /25e-jubilé5.png or /25e-jubile.png
    const candidates = ['/25e-jubilé5.png', '/25e-jubile5.png', '/25e-jubile.png', '/jubile25.png'];
    let found = false;

    for (const url of candidates) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (!found) {
          found = true;
          setImageSrc(url);
        }
      };
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setImageSrc(base64);
          localStorage.setItem('adoio_jubile_25_logo', base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setImageSrc(base64);
          localStorage.setItem('adoio_jubile_25_logo', base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`shrink-0 flex flex-col items-center group relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
      />

      {/* Main Medallion Container */}
      <div
        onClick={onClick}
        className="relative rounded-full p-1 bg-gradient-to-br from-[#E6AB3C]/40 via-[#FAF7F2]/10 to-transparent border border-[#E6AB3C]/50 shadow-2xl backdrop-blur-sm group-hover:scale-105 group-hover:border-[#E6AB3C] transition-all duration-300 cursor-pointer"
        style={{ width: size, height: size }}
        title="25e Jubilé d'Argent ADOIO · 24e Fête de l'Olive de Béjaïa (6 au 8 avril 2026)"
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="Logo officiel 25e Jubilé d'Argent ADOIO"
            className="w-full h-full object-contain drop-shadow-xl select-none"
            referrerPolicy="no-referrer"
            onError={() => setImageSrc(null)}
          />
        ) : (
          <Jubile25Logo size={size - 8} />
        )}

        {/* Quick upload button on hover */}
        {isHovered && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="absolute -top-1 -right-1 p-1.5 rounded-full bg-[#18230F] text-[#E6AB3C] hover:bg-[#233416] border border-[#E6AB3C] shadow-lg transition-all scale-90 hover:scale-100 cursor-pointer z-10"
            title="Remplacer par le fichier 25e-jubilé5.png de votre ordinateur"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showCaption && (
        <div className="mt-1.5 text-center">
          <span className="block text-[11px] font-bold text-[#E6AB3C] tracking-wide">
            25ᵉ Jubilé d'Argent
          </span>
          <span className="block text-[10px] text-[#FAF7F2]/75">
            Fête de l'Olive · 6-8 Avril 2026
          </span>
        </div>
      )}
    </div>
  );
};
