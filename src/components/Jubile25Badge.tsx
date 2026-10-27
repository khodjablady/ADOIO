import React, { useState, useEffect, useRef } from 'react';
import { Jubile25Logo } from './Jubile25Logo';
import { Upload, Sparkles, Check } from 'lucide-react';
import regeneratedBadgeImg from '../assets/images/regenerated_image_1793101513723.png';

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
  const [imageSrc, setImageSrc] = useState<string | null>(regeneratedBadgeImg);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const removeOuterBackground = (src: string, onDone: (transparentDataUrl: string) => void) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        if (!w || !h) return;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        // Check top-left corner pixel as background reference
        const r0 = data[0];
        const g0 = data[1];
        const b0 = data[2];
        const a0 = data[3];

        // If corner is already transparent, no flood-fill needed
        if (a0 < 15) return;

        const total = w * h;
        const visited = new Uint8Array(total);
        const queue = new Int32Array(total);
        let head = 0;
        let tail = 0;

        const colorDist = (idx4: number) => {
          const dr = data[idx4] - r0;
          const dg = data[idx4 + 1] - g0;
          const db = data[idx4 + 2] - b0;
          return Math.sqrt(dr * dr + dg * dg + db * db);
        };

        const threshold = 48;
        const softThreshold = 90;

        const tryEnqueue = (x: number, y: number) => {
          const pos = y * w + x;
          if (visited[pos]) return;
          const idx4 = pos * 4;
          if (data[idx4 + 3] < 15 || colorDist(idx4) <= threshold) {
            visited[pos] = 1;
            queue[tail++] = pos;
          }
        };

        // Seed from all 4 image borders
        for (let x = 0; x < w; x++) {
          tryEnqueue(x, 0);
          tryEnqueue(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          tryEnqueue(0, y);
          tryEnqueue(w - 1, y);
        }

        // Flood-fill outer background
        while (head < tail) {
          const pos = queue[head++];
          const idx4 = pos * 4;
          data[idx4 + 3] = 0; // Make fully transparent

          const x = pos % w;
          const y = (pos - x) / w;

          const neighbors = [
            x > 0 ? pos - 1 : -1,
            x < w - 1 ? pos + 1 : -1,
            y > 0 ? pos - w : -1,
            y < h - 1 ? pos + w : -1,
          ];

          for (let i = 0; i < 4; i++) {
            const nPos = neighbors[i];
            if (nPos === -1 || visited[nPos]) continue;
            const nIdx4 = nPos * 4;
            const dist = colorDist(nIdx4);
            if (data[nIdx4 + 3] < 15 || dist <= threshold) {
              visited[nPos] = 1;
              queue[tail++] = nPos;
            } else if (dist < softThreshold) {
              // Feather anti-aliased edge pixel
              const factor = (dist - threshold) / (softThreshold - threshold);
              data[nIdx4 + 3] = Math.round(data[nIdx4 + 3] * factor);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
        onDone(canvas.toDataURL('image/png'));
      } catch {
        // Fallback to original src if canvas processing fails
      }
    };
    img.src = src;
  };

  useEffect(() => {
    try {
      localStorage.removeItem('adoio_jubile_25_logo');
    } catch {
      // Ignore storage errors
    }
    removeOuterBackground(regeneratedBadgeImg, (transparentUrl) => {
      setImageSrc(transparentUrl);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          removeOuterBackground(base64, (transparentUrl) => {
            setImageSrc(transparentUrl);
            localStorage.setItem('adoio_jubile_25_logo', transparentUrl);
          });
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
          removeOuterBackground(base64, (transparentUrl) => {
            setImageSrc(transparentUrl);
            localStorage.setItem('adoio_jubile_25_logo', transparentUrl);
          });
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
            className="w-full h-full object-contain drop-shadow-xl select-none bg-transparent"
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
