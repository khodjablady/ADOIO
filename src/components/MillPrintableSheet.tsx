import React from 'react';
import { createPortal } from 'react-dom';
import {
  Phone,
  MapPin,
  Navigation,
  Cpu,
  CheckCircle2,
  Compass,
  Award,
} from 'lucide-react';
import { OliveMill } from '../data/bejaiaOliveData';
import { MillStats } from '../data/millReviewsData';
import { MillQrSvg, buildMillMobileMapUrl } from './MillQrCodeModal';

/**
 * Formats decimal latitude/longitude into Degrees, Minutes, Seconds (DMS)
 * for agricultural & topographic field sheets.
 */
export function formatCoordToDms(decimal: number, isLat: boolean): string {
  const dir = isLat ? (decimal >= 0 ? 'N' : 'S') : decimal >= 0 ? 'E' : 'W';
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = ((minutesFloat - minutes) * 60).toFixed(1);
  return `${degrees}° ${minutes}' ${seconds}" ${dir}`;
}

interface MillPrintableSheetProps {
  mill: OliveMill;
  stats?: MillStats | null;
  distanceKm?: number | null;
  userLocationLabel?: string | null;
  onTriggerPrint?: () => void;
}

/**
 * Clean, structured A4 Technical, Contact & Location Sheet content.
 * Used both inside the on-screen Print Preview tab of a mill's detail modal
 * and inside the root body portal for @media print.
 */
export const MillPrintableDocumentContent: React.FC<MillPrintableSheetProps> = ({
  mill,
  stats,
  distanceKm,
  userLocationLabel,
}) => {
  const mapUrl = buildMillMobileMapUrl(mill, 'google_pin');
  const dmsCoords = `${formatCoordToDms(mill.lat, true)}, ${formatCoordToDms(mill.lng, false)}`;
  const decimalCoords = `${mill.lat.toFixed(5)}° N, ${mill.lng.toFixed(5)}° E`;
  const editionDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white text-[#18230F] p-5 sm:p-7 rounded-2xl border border-[#D8CEB8] space-y-5 font-sans">
      {/* 1. Official Institutional Header */}
      <div className="border-b-2 border-[#18230F] pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#31491E]">
            ADOIO Béjaïa · Répertoire Officiel des Huileries & Moulins de Kabylie
          </p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#18230F] mt-1">
            {mill.name}
          </h2>
          <p className="text-xs font-semibold text-[#436229] mt-0.5">
            {mill.typeLabel} · En activité depuis {mill.yearEstablished}
            {mill.certifiedBio ? ' · Certifié Agriculture Biologique / Raisonnée' : ''}
            {mill.igCandidate ? ' · Éligible IGP Huile d’Olive de Kabylie' : ''}
          </p>
        </div>

        <div className="sm:text-right text-xs text-[#233416] shrink-0 bg-[#FAF7F2] px-3.5 py-2 rounded-xl border border-[#E6DEC9]">
          <p className="font-mono font-bold text-[#18230F]">
            Réf. #{mill.id.toUpperCase()} · Wilaya de Béjaïa (06)
          </p>
          <p className="text-[11px] text-[#567B34]">
            Commune de {mill.commune} (Daïra de {mill.daira})
          </p>
          <p className="text-[10px] text-[#567B34] mt-0.5">Fiche éditée le {editionDate}</p>
        </div>
      </div>

      {/* 2. Primary Contact Information & Geographical Location Data (Highlighted for Print) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* Contact & Campaign Reception Block */}
        <div className="md:col-span-5 p-4 rounded-xl bg-[#FAF7F2] border border-[#D8CEB8] flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18230F] flex items-center gap-1.5 border-b border-[#E6DEC9] pb-1.5">
              <Phone className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
              <span>Coordonnées de Contact & Accueil</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] block">
                  Responsable / Maître Moulinier
                </span>
                <span className="font-bold text-[#18230F] text-sm">{mill.contactPerson}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] block">
                  Téléphone Direct (Réception & Rendez-vous)
                </span>
                <span className="font-mono font-extrabold text-sm text-[#18230F] tabular-nums">
                  {mill.phone}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] block">
                  Horaires de Campagne (Octobre – Février)
                </span>
                <span className="font-semibold text-[#18230F]">
                  {mill.campaignInfo.openingHours}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] block">
                  Modalités de Réception & Tarif
                </span>
                <p className="text-[#233416] leading-snug">
                  {mill.campaignInfo.pricingInfo} · Délai moyen :{' '}
                  <strong>{mill.campaignInfo.averageWaitTime}</strong>
                </p>
                <p className="text-[11px] font-bold text-[#AF4D24] mt-0.5">
                  {mill.campaignInfo.appointmentRequired
                    ? '✓ Prise de rendez-vous téléphonique recommandée avant apport'
                    : '✓ Réception directe selon ordre d’arrivée des lots'}
                </p>
              </div>
            </div>
          </div>

          {stats && stats.totalReviews > 0 && (
            <div className="pt-2 border-t border-[#E6DEC9] flex items-center justify-between text-[11px] text-[#31491E]">
              <span className="font-semibold">Appréciation oléiculteurs :</span>
              <span className="font-bold text-[#18230F] tabular-nums">
                ★ {stats.averageRating.toFixed(1)} / 5 ({stats.totalReviews} avis ·{' '}
                {stats.recommendationPercentage}% recommandent)
              </span>
            </div>
          )}
        </div>

        {/* Location, Road Access & GPS Coordinates Block */}
        <div className="md:col-span-7 p-4 rounded-xl bg-[#FAF7F2] border border-[#D8CEB8] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2.5 flex-1 w-full">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18230F] flex items-center gap-1.5 border-b border-[#E6DEC9] pb-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#AF4D24]" aria-hidden="true" />
              <span>Localisation Géographique & Accès Routier</span>
            </h3>

            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] block">
                  Adresse & Localité
                </span>
                <p className="font-bold text-[#18230F] text-sm">{mill.address}</p>
                <p className="text-[#233416] font-medium">
                  Commune de <strong>{mill.commune}</strong> · Daïra de{' '}
                  <strong>{mill.daira}</strong> · Wilaya de Béjaïa
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-lg bg-white border border-[#E6DEC9]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#31491E]" aria-hidden="true" />
                    <span>GPS Décimal (WGS84)</span>
                  </span>
                  <span className="font-mono text-xs font-extrabold text-[#18230F] tabular-nums block mt-0.5">
                    {decimalCoords}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-white border border-[#E6DEC9]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-[#31491E]" aria-hidden="true" />
                    <span>Coordonnées DMS</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#18230F] tabular-nums block mt-0.5">
                    {dmsCoords}
                  </span>
                </div>
              </div>

              {distanceKm !== null && distanceKm !== undefined && (
                <p className="text-[11px] font-bold text-[#31491E] bg-[#E8F4D9] px-2.5 py-1 rounded-lg border border-[#8CBE5D]/50 tabular-nums">
                  Distance estimée : À {distanceKm.toFixed(1)} km{' '}
                  {userLocationLabel ? `depuis ${userLocationLabel}` : 'de votre position'} (~
                  {Math.max(3, Math.round(distanceKm * 1.45))} min par route)
                </p>
              )}

              <p className="text-[10px] text-[#567B34] font-mono break-all pt-0.5">
                Itinéraire : https://maps.google.com/?q={mill.lat.toFixed(5)},{mill.lng.toFixed(5)}
              </p>
            </div>
          </div>

          {/* High-Contrast QR Code for Paper Sheet Scanning */}
          <div className="p-2.5 rounded-xl bg-white border border-[#D8CEB8] flex flex-col items-center text-center shrink-0">
            <MillQrSvg
              value={mapUrl}
              size={112}
              fgColor="#18230F"
              bgColor="#FFFFFF"
              title={`Code QR GPS de ${mill.name}`}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#18230F] mt-1.5">
              Scanner pour GPS
            </span>
            <span className="text-[9px] font-mono text-[#567B34] tabular-nums">
              {mill.lat.toFixed(4)}, {mill.lng.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Technical Specifications & Extraction Line Summary */}
      <div className="p-4 rounded-xl bg-white border border-[#D8CEB8] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6DEC9] pb-1.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#18230F] flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#31491E]" aria-hidden="true" />
            <span>Caractéristiques Techniques & Capacités de Trituration</span>
          </h3>
          <span className="text-[11px] font-semibold text-[#567B34]">
            Marques : <strong className="text-[#18230F]">{mill.brands.join(', ')}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9]">
            <span className="text-[10px] text-[#567B34] block">Capacité & Cadence</span>
            <span className="font-bold text-[#18230F] tabular-nums">
              {mill.capacityQxPerDay} qx/j ({mill.technicalSpecs.hourlyThroughputKg} kg/h)
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9]">
            <span className="text-[10px] text-[#567B34] block">Lot minimum accepté</span>
            <span className="font-bold text-[#18230F] tabular-nums">
              Dès {mill.technicalSpecs.minBatchKg} kg (individuel)
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9]">
            <span className="text-[10px] text-[#567B34] block">Cuverie & Rendement</span>
            <span className="font-bold text-[#18230F] tabular-nums">
              {mill.technicalSpecs.storageCapacityLiters.toLocaleString('fr-FR')} L ·{' '}
              {mill.technicalSpecs.avgYieldRange}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9]">
            <span className="text-[10px] text-[#567B34] block">Malaxage & Acidité</span>
            <span className="font-bold text-[#18230F]">
              {mill.technicalSpecs.malaxationTemp.split('(')[0].trim()} ·{' '}
              {mill.technicalSpecs.avgAcidity}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
          <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] block">
              Ligne d'extraction & Procédé
            </span>
            <p className="font-semibold text-[#18230F] mt-0.5">
              {mill.technicalSpecs.equipmentBrand} — {mill.technicalSpecs.extractionProcess}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E6DEC9]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#567B34] block">
              Spécialité Variétale & Stockage
            </span>
            <p className="font-semibold text-[#18230F] mt-0.5">
              {mill.speciality} ({mill.technicalSpecs.storageType})
            </p>
          </div>
        </div>
      </div>

      {/* 4. Services Offered */}
      <div className="p-4 rounded-xl bg-white border border-[#D8CEB8] space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#18230F] flex items-center gap-1.5 border-b border-[#E6DEC9] pb-1.5">
          <Award className="w-3.5 h-3.5 text-[#E6AB3C]" aria-hidden="true" />
          <span>Prestations & Services Oléicoles ({mill.services.length})</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {mill.services.map((service, index) => (
            <div key={index} className="flex items-start gap-2 text-[#18230F]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#31491E] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{service}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Farmer Batch Tracking & Reception Slip (For Field Use) */}
      <div className="p-3.5 rounded-xl border border-[#18230F] bg-[#FAF7F2] space-y-2 text-xs text-[#18230F]">
        <div className="flex items-center justify-between border-b border-[#D8CEB8] pb-1">
          <span className="font-bold uppercase tracking-wider text-[10px]">
            Bordereau Oléiculteur — Suivi du Lot d'Olives Apporté à l'Huilerie
          </span>
          <span className="text-[10px] text-[#567B34]">À compléter lors de la réception au moulin</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-[11px]">
          <div className="bg-white border border-[#D8CEB8] rounded-lg p-2">
            <span className="font-bold block text-[#567B34] text-[10px]">Date & Heure de dépôt :</span>
            <div className="h-5" />
          </div>
          <div className="bg-white border border-[#D8CEB8] rounded-lg p-2">
            <span className="font-bold block text-[#567B34] text-[10px]">Poids net apporté (kg / qx) :</span>
            <div className="h-5" />
          </div>
          <div className="bg-white border border-[#D8CEB8] rounded-lg p-2">
            <span className="font-bold block text-[#567B34] text-[10px]">Volume d'huile obtenu (L) :</span>
            <div className="h-5" />
          </div>
          <div className="bg-white border border-[#D8CEB8] rounded-lg p-2">
            <span className="font-bold block text-[#567B34] text-[10px]">Rendement (L/qx) & N° Lot :</span>
            <div className="h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Portal mounted directly onto document.body when an individual mill is open or being printed.
 * Guarantees 100% clean A4 print isolation across all browsers without any parent layout artifacts.
 */
export const MillPrintPortal: React.FC<MillPrintableSheetProps> = (props) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div id="mill-printable-sheet" className="hidden print:block bg-white text-[#18230F]">
      <MillPrintableDocumentContent {...props} />
    </div>,
    document.body
  );
};
