import React, { useEffect, useRef, useState, useCallback } from 'react';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import {
  Camera,
  QrCode,
  X,
  RefreshCw,
  Upload,
  CheckCircle2,
  MapPin,
  Navigation,
  Building2,
  ExternalLink,
  AlertCircle,
  Smartphone,
} from 'lucide-react';
import { REPRESENTATIVE_MILLS, OliveMill } from '../data/bejaiaOliveData';
import { calculateDistanceKm } from './MillsDirectory';
import { buildMillMobileMapUrl } from './MillQrCodeModal';

export interface QrScanMatchResult {
  mill: OliveMill;
  matchMethod: 'id' | 'gps' | 'name';
  matchSummary: string;
  rawPayload: string;
  distanceMeters?: number;
}

/**
 * Parses a scanned QR code string (URL, geo: URI, Google Maps link, Waze link, or mill ID)
 * and resolves it to the corresponding huilerie in REPRESENTATIVE_MILLS.
 */
export function matchQrPayloadToMill(rawInput: string): QrScanMatchResult | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();

  // 1. Check URL query parameter ?mill=mill-id or direct ID match
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const parsedUrl = new URL(trimmed);
      const millParam = parsedUrl.searchParams.get('mill');
      if (millParam) {
        const byParam = REPRESENTATIVE_MILLS.find(
          (m) => m.id.toLowerCase() === millParam.toLowerCase()
        );
        if (byParam) {
          return {
            mill: byParam,
            matchMethod: 'id',
            matchSummary: `Identifiant officiel #${byParam.id.toUpperCase()} détecté dans le lien`,
            rawPayload: trimmed,
          };
        }
      }
    }
  } catch {
    // Continue to regex/coordinate matching
  }

  for (const mill of REPRESENTATIVE_MILLS) {
    const idPattern = new RegExp(`\\b${mill.id.toLowerCase()}\\b`, 'i');
    if (idPattern.test(lower)) {
      return {
        mill,
        matchMethod: 'id',
        matchSummary: `Référence huilerie #${mill.id.toUpperCase()} reconnue`,
        rawPayload: trimmed,
      };
    }
  }

  // 2. Extract GPS coordinates from Google Maps, Waze, geo: URI, or raw "lat, lng"
  // Matches Algerian / Kabylie latitude (35.x - 37.x) and longitude (4.x - 6.x)
  const coordRegex = /(3[567]\.\d{2,7})\s*[,;/\s]\s*([456]\.\d{2,7})/;
  const decodedText = (() => {
    try {
      return decodeURIComponent(trimmed);
    } catch {
      return trimmed;
    }
  })();

  const coordMatch = decodedText.match(coordRegex);
  if (coordMatch) {
    const scannedLat = parseFloat(coordMatch[1]);
    const scannedLng = parseFloat(coordMatch[2]);

    if (!Number.isNaN(scannedLat) && !Number.isNaN(scannedLng)) {
      let closestMill: OliveMill | null = null;
      let minDistanceKm = Infinity;

      for (const mill of REPRESENTATIVE_MILLS) {
        const distKm = calculateDistanceKm(scannedLat, scannedLng, mill.lat, mill.lng);
        if (distKm < minDistanceKm) {
          minDistanceKm = distKm;
          closestMill = mill;
        }
      }

      // Match if within 5 km of a registered huilerie
      if (closestMill && minDistanceKm <= 5) {
        const distanceMeters = Math.round(minDistanceKm * 1000);
        return {
          mill: closestMill,
          matchMethod: 'gps',
          matchSummary:
            distanceMeters <= 50
              ? `Coordonnées GPS exactes (${scannedLat.toFixed(4)}° N, ${scannedLng.toFixed(4)}° E)`
              : `Coordonnées GPS proches à ${distanceMeters} m (${scannedLat.toFixed(4)}° N, ${scannedLng.toFixed(4)}° E)`,
          rawPayload: trimmed,
          distanceMeters,
        };
      }
    }
  }

  // 3. Match by huilerie name, brand, or commune in the decoded QR text
  for (const mill of REPRESENTATIVE_MILLS) {
    if (
      decodedText.toLowerCase().includes(mill.name.toLowerCase()) ||
      mill.brands.some((b) => decodedText.toLowerCase().includes(b.toLowerCase()))
    ) {
      return {
        mill,
        matchMethod: 'name',
        matchSummary: `Nom de l'établissement ou marque reconnu (« ${mill.name} »)`,
        rawPayload: trimmed,
      };
    }
  }

  return null;
}

interface MillQrScannerModalProps {
  onClose: () => void;
  onSelectMillDetails: (mill: OliveMill) => void;
  onLocateMillOnMap: (mill: OliveMill) => void;
}

export const MillQrScannerModal: React.FC<MillQrScannerModalProps> = ({
  onClose,
  onSelectMillDetails,
  onLocateMillOnMap,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraState, setCameraState] = useState<'starting' | 'active' | 'error' | 'stopped'>('starting');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [autoOpenOnScan, setAutoOpenOnScan] = useState<boolean>(true);
  const [scanResult, setScanResult] = useState<QrScanMatchResult | null>(null);
  const [unrecognizedPayload, setUnrecognizedPayload] = useState<string | null>(null);
  const [isDecodingFile, setIsDecodingFile] = useState<boolean>(false);

  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleDecodedPayload = useCallback(
    (payload: string, fromLiveCamera: boolean) => {
      const matched = matchQrPayloadToMill(payload);
      if (matched) {
        setScanResult(matched);
        setUnrecognizedPayload(null);
        stopCameraStream();
        setCameraState('stopped');

        if (fromLiveCamera && autoOpenOnScan) {
          onSelectMillDetails(matched.mill);
        }
      } else {
        setUnrecognizedPayload(payload);
      }
    },
    [autoOpenOnScan, onSelectMillDetails, stopCameraStream]
  );

  // Start camera stream
  const startCamera = useCallback(
    async (preferredFacing: 'environment' | 'user') => {
      stopCameraStream();
      setCameraError(null);
      setCameraState('starting');

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraState('error');
        setCameraError(
          "L'accès caméra (getUserMedia) n'est pas disponible sur ce navigateur. Utilisez l'import d'image QR ou le simulateur d'étiquette terrain ci-dessous."
        );
        return;
      }

      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: preferredFacing },
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
            audio: false,
          });
        } catch {
          // Fallback to any available video camera
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setCameraState('active');
      } catch {
        setCameraState('error');
        setCameraError(
          "Autorisation caméra refusée ou aucune caméra détectée. Vous pouvez importer une photo/image de code QR ou tester le lecteur avec une étiquette d'huilerie ci-dessous."
        );
      }
    },
    [stopCameraStream]
  );

  useEffect(() => {
    void startCamera(facingMode);
    return () => {
      stopCameraStream();
    };
  }, [facingMode, startCamera, stopCameraStream]);

  // Real-time QR frame scanning loop using jsQR
  useEffect(() => {
    if (cameraState !== 'active' || scanResult) return;

    const intervalId = window.setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;
      if (width === 0 || height === 0) return;

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (code && code.data) {
        handleDecodedPayload(code.data, true);
      }
    }, 160);

    return () => window.clearInterval(intervalId);
  }, [cameraState, scanResult, handleDecodedPayload]);

  // Decode a QR code from an uploaded image file (.png, .jpg, .webp)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDecodingFile(true);
    setUnrecognizedPayload(null);

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });
          setIsDecodingFile(false);
          if (code && code.data) {
            handleDecodedPayload(code.data, false);
          } else {
            setUnrecognizedPayload(
              "Aucun code QR lisible n'a été détecté dans cette image. Vérifiez la netteté du code QR."
            );
          }
        } else {
          setIsDecodingFile(false);
        }
      };
      img.onerror = () => {
        setIsDecodingFile(false);
        setUnrecognizedPayload("Impossible de lire le fichier image sélectionné.");
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Real QR generation + jsQR optical decoding test for field labels
  const handleSimulatePhysicalQrScan = async (mill: OliveMill) => {
    try {
      const qrUrl = buildMillMobileMapUrl(mill, 'google_pin');
      const tempCanvas = document.createElement('canvas');
      await QRCode.toCanvas(tempCanvas, qrUrl, {
        width: 260,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const decoded = jsQR(imageData.data, imageData.width, imageData.height);
        if (decoded && decoded.data) {
          handleDecodedPayload(decoded.data, false);
          return;
        }
      }
      handleDecodedPayload(qrUrl, false);
    } catch {
      handleDecodedPayload(buildMillMobileMapUrl(mill, 'google_pin'), false);
    }
  };

  const toggleFacingMode = () => {
    setScanResult(null);
    setUnrecognizedPayload(null);
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-scanner-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF7F2] rounded-3xl border border-[#E6DEC9] max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-5"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer le lecteur de code QR"
          className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pr-8 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#31491E]">
            <Camera className="w-4 h-4 text-[#AF4D24]" aria-hidden="true" />
            <span>Lecteur Optique QR · Identification Terrain des Huileries</span>
          </div>
          <h3
            id="qr-scanner-modal-title"
            className="font-serif text-xl sm:text-2xl font-bold text-[#18230F]"
          >
            Scanner le Code QR d'une Huilerie
          </h3>
          <p className="text-xs text-[#567B34] leading-relaxed">
            Pointez votre caméra vers le code QR d'un moulin (fiche technique imprimée, caisse d'olives, bidon ou panneau d'entrée) pour ouvrir instantanément sa fiche et sa localisation dans l'annuaire.
          </p>
        </div>

        {/* Camera Controls & Auto-Open Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-[#E6DEC9]">
          <label className="flex items-center gap-2 text-xs font-semibold text-[#18230F] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoOpenOnScan}
              onChange={(e) => setAutoOpenOnScan(e.target.checked)}
              className="rounded border-[#8CBE5D] text-[#31491E] focus:ring-[#31491E] w-3.5 h-3.5 cursor-pointer"
            />
            <span>Ouvrir automatiquement la fiche dès détection caméra</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFacingMode}
              className="px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Basculer entre la caméra arrière et la caméra frontale"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
              <span>Caméra {facingMode === 'environment' ? 'Arrière' : 'Frontale'}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isDecodingFile}
              className="px-2.5 py-1.5 rounded-xl bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#18230F] border border-[#8CBE5D]/60 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Importer une photo ou un fichier PNG de code QR"
            >
              <Upload className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
              <span>{isDecodingFile ? 'Lecture…' : 'Importer image QR'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Hidden Canvas for jsQR Optical Frame Analysis */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Live Camera Viewfinder or Scan Result Card */}
        {scanResult ? (
          <div className="bg-white rounded-2xl border-2 border-[#31491E] p-5 space-y-4 shadow-sm animate-in fade-in duration-150">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F4D9] border border-[#8CBE5D] flex items-center justify-center text-[#31491E] shrink-0">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#31491E] block">
                    Code QR Huilerie Identifié avec Succès
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-[#18230F]">
                    {scanResult.mill.name}
                  </h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setScanResult(null);
                  void startCamera(facingMode);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Camera className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                <span>Nouveau scan</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DEC9] space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-[#233416]">
                  📍 {scanResult.mill.address} · Commune de {scanResult.mill.commune} (Daïra de {scanResult.mill.daira})
                </span>
                <span className="font-mono text-[11px] font-bold text-[#31491E] tabular-nums">
                  {scanResult.mill.lat.toFixed(4)}° N, {scanResult.mill.lng.toFixed(4)}° E
                </span>
              </div>
              <p className="text-[#567B34]">
                {scanResult.mill.typeLabel} · Capacité <strong className="text-[#18230F] tabular-nums">{scanResult.mill.capacityQxPerDay} qx/j</strong> (lot min. {scanResult.mill.technicalSpecs.minBatchKg} kg) · Tél : <strong className="text-[#18230F]">{scanResult.mill.phone}</strong>
              </p>
              <p className="text-[11px] text-[#31491E] font-semibold">
                ✓ {scanResult.matchSummary}
              </p>
            </div>

            {/* Instant Actions for the Scanned Huilerie */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => onSelectMillDetails(scanResult.mill)}
                className="py-2.5 px-3.5 rounded-xl bg-[#31491E] hover:bg-[#233416] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Building2 className="w-4 h-4 text-[#E6AB3C]" aria-hidden="true" />
                <span>Ouvrir la fiche complète</span>
              </button>

              <button
                type="button"
                onClick={() => onLocateMillOnMap(scanResult.mill)}
                className="py-2.5 px-3.5 rounded-xl bg-[#E8F4D9] hover:bg-[#D4E8BF] text-[#18230F] border border-[#8CBE5D] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-[#AF4D24]" aria-hidden="true" />
                <span>Localiser sur la carte SIG</span>
              </button>

              <a
                href={buildMillMobileMapUrl(scanResult.mill, 'google_route')}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3.5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#18230F] border border-[#E6DEC9] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                <span>Itinéraire Google Maps</span>
                <ExternalLink className="w-3 h-3 text-[#567B34]" aria-hidden="true" />
              </a>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-[#18230F] border-2 border-[#31491E] aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraState === 'active' ? 'opacity-100' : 'opacity-20'}`}
            />

            {/* Viewfinder Target Reticle Overlay */}
            {cameraState === 'active' && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl border-2 border-[#E6AB3C] shadow-[0_0_0_9999px_rgba(24,35,15,0.45)] relative flex items-center justify-center">
                  <div className="w-4/5 h-0.5 bg-[#E6AB3C]/80 animate-pulse" />
                </div>
                <span className="mt-3 px-3 py-1 rounded-full bg-black/65 text-[#FAF7F2] text-[11px] font-semibold flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
                  <span>Placez le code QR de l'huilerie dans le cadre</span>
                </span>
              </div>
            )}

            {cameraState === 'starting' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-[#FAF7F2] space-y-2">
                <Camera className="w-8 h-8 text-[#E6AB3C] animate-pulse" aria-hidden="true" />
                <p className="text-xs font-bold">Initialisation du flux vidéo caméra…</p>
                <p className="text-[11px] text-[#E8F4D9]/80">
                  Veuillez autoriser l'accès à la caméra dans votre navigateur.
                </p>
              </div>
            )}

            {cameraState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-[#FAF7F2] space-y-3 bg-[#18230F]/95">
                <AlertCircle className="w-8 h-8 text-[#E6AB3C]" aria-hidden="true" />
                <p className="text-xs font-bold max-w-md leading-relaxed">{cameraError}</p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => void startCamera(facingMode)}
                    className="px-3.5 py-2 rounded-xl bg-[#31491E] hover:bg-[#436229] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Réessayer la caméra</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-[#E6AB3C] hover:bg-[#D49524] text-[#18230F] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Importer une image de code QR</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Unrecognized QR Warning */}
        {unrecognizedPayload && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="font-bold block">Code QR détecté mais non rattaché à une huilerie :</span>
              <span className="font-mono text-[11px] break-all">{unrecognizedPayload}</span>
            </div>
          </div>
        )}

        {/* Quick Field QR Tag Simulator (Generates & optically decodes a real QR code via jsQR) */}
        <div className="p-4 rounded-2xl bg-white border border-[#E6DEC9] space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#18230F]">
              <Smartphone className="w-4 h-4 text-[#31491E]" aria-hidden="true" />
              <span>Tester la reconnaissance optique QR sur une étiquette d'huilerie :</span>
            </div>
            <span className="text-[11px] text-[#567B34]">
              Décodage réel via jsQR
            </span>
          </div>
          <p className="text-[11px] text-[#567B34]">
            Pas d'étiquette imprimée devant votre caméra ? Cliquez sur une huilerie ci-dessous pour générer son code QR physique et le décoder instantanément :
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {REPRESENTATIVE_MILLS.slice(0, 6).map((mill) => (
              <button
                key={`sim-qr-${mill.id}`}
                type="button"
                onClick={() => void handleSimulatePhysicalQrScan(mill)}
                className="px-2.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#233416] border border-[#E6DEC9] hover:border-[#8CBE5D] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
                <span>{mill.commune} · {mill.name.split('—')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
