import React, { useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  MapPin,
  Navigation,
  Copy,
  Check,
  Download,
  ExternalLink,
  Smartphone,
  X,
  Compass,
} from 'lucide-react';
import { OliveMill } from '../data/bejaiaOliveData';

export type MobileMapTarget = 'google_pin' | 'google_route' | 'waze' | 'geo_uri';

export function buildMillMobileMapUrl(
  mill: OliveMill,
  target: MobileMapTarget = 'google_pin',
  userOrigin?: { lat: number; lng: number } | null
): string {
  const lat = mill.lat.toFixed(5);
  const lng = mill.lng.toFixed(5);

  switch (target) {
    case 'google_route': {
      const originParam = userOrigin
        ? `&origin=${userOrigin.lat.toFixed(5)},${userOrigin.lng.toFixed(5)}`
        : '';
      return `https://www.google.com/maps/dir/?api=1${originParam}&destination=${lat},${lng}&travelmode=driving`;
    }
    case 'waze':
      return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    case 'geo_uri': {
      const label = encodeURIComponent(`${mill.name} (${mill.commune})`);
      return `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
    }
    case 'google_pin':
    default:
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
}

interface MillQrSvgProps {
  value: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
  title?: string;
}

/**
 * Synchronous, zero-latency ISO/IEC 18004 SVG QR Code renderer.
 */
export const MillQrSvg: React.FC<MillQrSvgProps> = ({
  value,
  size = 176,
  fgColor = '#18230F',
  bgColor = '#FFFFFF',
  className = '',
  title = 'Code QR de localisation GPS',
}) => {
  const qrData = useMemo(() => {
    try {
      const qr = QRCode.create(value, {
        errorCorrectionLevel: 'M',
      });
      const moduleCount = qr.modules.size;
      const data = qr.modules.data;
      const quietZone = 2;
      const totalSize = moduleCount + quietZone * 2;

      let pathD = '';
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (data[row * moduleCount + col]) {
            const x = col + quietZone;
            const y = row + quietZone;
            pathD += `M${x},${y}h1v1h-1z`;
          }
        }
      }

      return { totalSize, pathD };
    } catch {
      return null;
    }
  }, [value]);

  if (!qrData) {
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${qrData.totalSize} ${qrData.totalSize}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <rect width={qrData.totalSize} height={qrData.totalSize} fill={bgColor} rx={1.5} />
      <path d={qrData.pathD} fill={fgColor} />
    </svg>
  );
};

interface MillQrCodeModalProps {
  mill: OliveMill;
  userOrigin?: { lat: number; lng: number; label?: string } | null;
  onClose: () => void;
}

export const MillQrCodeModal: React.FC<MillQrCodeModalProps> = ({
  mill,
  userOrigin,
  onClose,
}) => {
  const [mapTarget, setMapTarget] = useState<MobileMapTarget>('google_pin');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const encodedMapUrl = useMemo(
    () => buildMillMobileMapUrl(mill, mapTarget, userOrigin),
    [mill, mapTarget, userOrigin]
  );

  const formattedCoords = `${mill.lat.toFixed(4)}° N, ${mill.lng.toFixed(4)}° E`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(encodedMapUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2200);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleCopyCoords = async () => {
    try {
      await navigator.clipboard.writeText(`${mill.lat.toFixed(5)}, ${mill.lng.toFixed(5)}`);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2200);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleDownloadQrPng = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await QRCode.toDataURL(encodedMapUrl, {
        width: 640,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#18230F',
          light: '#FFFFFF',
        },
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `qr-gps-${mill.id}-${mill.commune.toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // Ignore download errors
    } finally {
      setIsDownloading(false);
    }
  };

  const targetOptions: Array<{
    id: MobileMapTarget;
    label: string;
    subtitle: string;
  }> = [
    {
      id: 'google_pin',
      label: 'Google Maps (Point GPS)',
      subtitle: 'Ouvre la fiche et le repère exact sur mobile',
    },
    {
      id: 'google_route',
      label: 'Itinéraire Routier Direct',
      subtitle: userOrigin
        ? `Trajet depuis ${userOrigin.label || 'votre position'}`
        : 'Lance la navigation GPS vers le moulin',
    },
    {
      id: 'waze',
      label: 'Waze Navigation',
      subtitle: 'Guidage routier temps réel en Kabylie',
    },
    {
      id: 'geo_uri',
      label: 'App Cartes Native (geo:)',
      subtitle: 'Compatible Apple Plans, OsmAnd & Android',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-mill-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF7F2] rounded-3xl border border-[#E6DEC9] max-w-lg w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer la fenêtre du code QR"
          className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pr-8 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#31491E]">
            <QrCode className="w-4 h-4 text-[#AF4D24]" aria-hidden="true" />
            <span>Accès Mobile & Géolocalisation QR</span>
          </div>
          <h3
            id="qr-modal-mill-title"
            className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]"
          >
            {mill.name}
          </h3>
          <p className="text-xs text-[#567B34]">
            {mill.address} · Commune de <strong className="text-[#18230F]">{mill.commune}</strong> (Daïra de {mill.daira})
          </p>
        </div>

        {/* Target Map Format Selector */}
        <div className="mt-4 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#567B34] block">
            Application de cartographie mobile cible :
          </span>
          <div className="grid grid-cols-2 gap-2">
            {targetOptions.map((opt) => {
              const active = mapTarget === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMapTarget(opt.id)}
                  aria-pressed={active}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-[#233416] text-white border-[#233416] shadow-2xs'
                      : 'bg-white text-[#18230F] border-[#E6DEC9] hover:border-[#8CBE5D]'
                  }`}
                >
                  <span className="text-xs font-bold block leading-tight">{opt.label}</span>
                  <span
                    className={`text-[10px] block mt-0.5 line-clamp-1 ${
                      active ? 'text-[#E8F4D9]' : 'text-[#567B34]'
                    }`}
                  >
                    {opt.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Scannable QR Card */}
        <div className="mt-5 bg-white rounded-2xl border border-[#E6DEC9] p-5 flex flex-col items-center text-center space-y-3 shadow-2xs">
          <div className="p-3 rounded-2xl bg-white border-2 border-[#31491E]/20 shadow-xs">
            <MillQrSvg
              value={encodedMapUrl}
              size={208}
              fgColor="#18230F"
              bgColor="#FFFFFF"
              title={`Code QR GPS pour ${mill.name} (${mill.commune})`}
            />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18230F]">
              <Smartphone className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
              <span>Scannez avec l'appareil photo de votre smartphone</span>
            </div>
            <p className="text-[11px] text-[#567B34] max-w-sm">
              Ouvre automatiquement l'emplacement exact de l'huilerie dans votre application GPS mobile pour vous guider jusqu'au moulin.
            </p>
          </div>

          {/* Coordinates & Copy Row */}
          <div className="w-full pt-3 border-t border-[#E6DEC9] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#233416]">
              <Compass className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
              <span className="font-mono font-bold tabular-nums">{formattedCoords}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyCoords}
              className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copiedCoords ? (
                <>
                  <Check className="w-3 h-3 text-[#31491E]" aria-hidden="true" />
                  <span>Coordonnées copiées</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#567B34]" aria-hidden="true" />
                  <span>Copier GPS</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <a
            href={encodedMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-[#31491E] hover:bg-[#233416] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
            <span>Ouvrir sur Maps</span>
            <ExternalLink className="w-3 h-3 opacity-80" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={handleCopyUrl}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#E8F4D9]/60 text-[#18230F] border border-[#E6DEC9] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                <span>Lien GPS copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                <span>Copier le lien GPS</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadQrPng}
            disabled={isDownloading}
            className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#F4EEE1] text-[#18230F] border border-[#E6DEC9] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#AF4D24]" aria-hidden="true" />
            <span>{isDownloading ? 'Export PNG…' : 'Télécharger PNG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
