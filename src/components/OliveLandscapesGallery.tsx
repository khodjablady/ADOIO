import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  MapPin, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Mountain, 
  Trees, 
  Droplets, 
  Sun, 
  Compass, 
  Info, 
  Share2,
  Check,
  Calendar,
  Layers,
  Upload,
  ImageIcon,
  RefreshCcw
} from 'lucide-react';

export interface LandscapeItem {
  id: string;
  title: string;
  kabyleTitle: string;
  location: string;
  daira: string;
  altitude: string;
  dominantVariety: string;
  category: 'soummam' | 'terrasses' | 'centenaires' | 'recolte';
  categoryLabel: string;
  description: string;
  agronomicNote: string;
  accentColor: string;
  imageFileName: string;
  imageAlt: string;
  photoCredit: string;
  svgType: 'soummam_valley' | 'mountain_terraces' | 'centennial_tree' | 'harvest_season' | 'aokas_sea' | 'seddouk_plateau';
}

export const LANDSCAPES_DATA: LandscapeItem[] = [
  {
    id: 'paysage-soummam-akbou',
    title: 'La Plaine Oléicole d’Akbou & le Bassin de la Soummam',
    kabyleTitle: 'Iɣzer n Summam · Aqbu',
    location: 'Bassin d’Akbou - Vallée de la Soummam',
    daira: 'Akbou',
    altitude: '180 m',
    dominantVariety: 'Chemlal de Kabylie (85%)',
    category: 'soummam',
    categoryLabel: 'Vallée de la Soummam',
    description: 'Vue sur les rangées d\'oliviers au feuillage argenté et la terre rouge fraîchement labourée en sillons au pied des crêtes de Kabylie. Ce couloir alluvionnaire fertile bénéficie d’un microclimat doux et de brouillards matinaux réguliers favorisant une floraison généreuse.',
    agronomicNote: 'Zone de haute productivité bénéficiant des alluvions riches. Densité moyenne de 120 à 150 arbres par hectare avec plusieurs huileries modernes à chaîne continue.',
    accentColor: '#3B5323',
    imageFileName: '1-Plein-akbou.jpg',
    imageAlt: 'Vue sur les rangées d\'oliviers au feuillage argenté et la terre rouge fraîchement labourée en sillons au pied des crêtes de Kabylie',
    photoCredit: 'Terroir d’Akbou · Vallée de la Soummam',
    svgType: 'soummam_valley'
  },
  {
    id: 'paysage-terrasses-chemini',
    title: 'Les Banquettes & Murets en Pierre Sèche de Chemini',
    kabyleTitle: 'Tirisa n tzemmurt · Cmini',
    location: 'Versants du Djurdjura oriental',
    daira: 'Chemini',
    altitude: '750 m',
    dominantVariety: 'Bouchouk & Aberkane',
    category: 'terrasses',
    categoryLabel: 'Terrasses de Montagne',
    description: 'Ouvrages paysans en terrasses empierrées épousant les versants escarpés avec échappée vers la Méditerranée. Chef-d’œuvre d’ingénierie paysanne kabyle retenant la terre végétale et les pluies d’orage pour une concentration oléique exceptionnelle.',
    agronomicNote: 'Pentes supérieures à 35% protégées de l’érosion hydrique. Arbres rustiques produisant une huile aux notes herbacées intenses et forte teneur en polyphénols.',
    accentColor: '#6B8E23',
    imageFileName: '2-Banquettes.jpg',
    imageAlt: 'Ouvrages paysans en terrasses empierrées épousant les versants escarpés avec échappée vers la Méditerranée',
    photoCredit: 'Terrasses de Chemini · Versants du Djurdjura',
    svgType: 'mountain_terraces'
  },
  {
    id: 'paysage-centenaire-seddouk',
    title: 'Le Verger Multiséculaire de Seddouk Ouffella',
    kabyleTitle: 'Tizemmarin timuqranin · Sedduq',
    location: 'Hauts plateaux de Seddouk',
    daira: 'Seddouk',
    altitude: '490 m',
    dominantVariety: 'Chemlal & Azeradj',
    category: 'centenaires',
    categoryLabel: 'Arbres Centenaires',
    description: 'Tronc torsadé et sculptural d\'un olivier vénérable quadri-centenaire dominant les collines de Seddouk. Malgré les sécheresses et les hivers rigoureux, ces arbres vénérables continuent de porter des récoltes régulières grâce à leur enracinement profond.',
    agronomicNote: 'Système racinaire explorant le sous-sol calcaire jusqu’à 6 mètres de profondeur. Cœur historique du mouvement coopératif oléicole de l’ADOIO.',
    accentColor: '#8CBE5D',
    imageFileName: '3-Verger-Seddouk.jpg',
    imageAlt: 'Tronc torsadé et sculptural d\'un olivier vénérable quadri-centenaire dominant les collines de Seddouk',
    photoCredit: 'Olivier Centenaire · Seddouk Ouffella',
    svgType: 'centennial_tree'
  },
  {
    id: 'paysage-recolte-tazmalt',
    title: 'La Campagne de Cueillette au Filet à Tazmalt',
    kabyleTitle: 'Leqḍa n uzemmur · Tazmalt',
    location: 'Contreforts de l’Akfadou',
    daira: 'Tazmalt',
    altitude: '320 m',
    dominantVariety: 'Chemlal & Limli',
    category: 'recolte',
    categoryLabel: 'Récolte & Traditions',
    description: 'Prise de vue en hauteur de la cueillette traditionnelle avec grand filet ajouré vert déployé sous l\'arbre et caisses de transport. En novembre et décembre, les collines s’animent des chants traditionnels lors de la « Tiwizi » (entraide communautaire).',
    agronomicNote: 'Généralisation des filets et caisses ajourées sous l’impulsion de l’ADOIO pour garantir des taux d’acidité Vierge Extra inférieurs à 0,4%.',
    accentColor: '#B47A16',
    imageFileName: '4-Cueillette.jpg',
    imageAlt: 'Prise de vue en hauteur de la cueillette traditionnelle avec grand filet ajouré vert déployé sous l\'arbre et caisses de transport',
    photoCredit: 'Campagne de récolte sur filets · Tazmalt',
    svgType: 'harvest_season'
  },
  {
    id: 'paysage-maritime-aokas',
    title: 'Les Oliveraies Côtières d’Aokas & du Cap Carbon',
    kabyleTitle: 'Zzemmur n yilel · Aukas',
    location: 'Corniche kabyle & Golfe de Béjaïa',
    daira: 'Aokas',
    altitude: '80 m à 350 m',
    dominantVariety: 'Aberkane & Chemlal',
    category: 'soummam',
    categoryLabel: 'Vallée de la Soummam',
    description: 'Rameaux d\'oliviers plongeant dans le bleu azur de la baie avec la présence du singe magot emblématique des falaises côtières. Les brises marines chargées d’iode apportent une fraîcheur tempérée qui prolonge la maturation des drupes jusqu’à la mi-janvier.',
    agronomicNote: 'Influence maritime réduisant les amplitudes thermiques extrêmes. Huiles douces avec des notes subtiles de pomme verte et d’amande fraîche.',
    accentColor: '#2563EB',
    imageFileName: '5-Olive-cote.jpg',
    imageAlt: 'Rameaux d\'oliviers plongeant dans le bleu azur de la baie avec la présence du singe magot emblématique des falaises côtières',
    photoCredit: 'Corniche de Béjaïa · Aokas & Cap Carbon',
    svgType: 'aokas_sea'
  },
  {
    id: 'paysage-bassin-sidi-aich',
    title: 'Le Plateau Oléicole de Sidi-Aïch & Leflaye',
    kabyleTitle: 'Izaɣaren n Sidi Ɛic',
    location: 'Moyenne Soummam',
    daira: 'Sidi-Aïch',
    altitude: '240 m',
    dominantVariety: 'Chemlal & Bouchouk',
    category: 'terrasses',
    categoryLabel: 'Terrasses de Montagne',
    description: 'Panorama sur les collines et vergers de la moyenne Soummam, les hameaux traditionnels et le pic conique en arrière-plan. Un paysage vallonné où l’olivier cohabite harmonieusement avec le figuier de Barbarie et les amandiers.',
    agronomicNote: 'Densité de 100 arbres/ha conduite en gobelet traditionnel aéré pour maximiser l’interception de la lumière solaire.',
    accentColor: '#436229',
    imageFileName: '6-Verger-sidi-aich.jpg',
    imageAlt: 'Panorama sur les collines et vergers de la moyenne Soummam, les hameaux traditionnels et le pic conique en arrière-plan',
    photoCredit: 'Plateau oléicole de Sidi-Aïch · Moyenne Soummam',
    svgType: 'seddouk_plateau'
  }
];

// High-fidelity artistic vector illustration renderer for each terroir landscape
const LandscapeArtwork: React.FC<{ type: LandscapeItem['svgType']; title: string }> = ({ type, title }) => {
  switch (type) {
    case 'soummam_valley':
      return (
        <svg viewBox="0 0 800 450" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title}>
          <defs>
            <linearGradient id="sky-soummam" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D9E6D0" />
              <stop offset="50%" stopColor="#EFE8D6" />
              <stop offset="100%" stopColor="#F9DFB0" />
            </linearGradient>
            <linearGradient id="mountain-back" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A6146" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#2D3D2B" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="mountain-mid" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3E5429" />
              <stop offset="100%" stopColor="#253518" />
            </linearGradient>
            <linearGradient id="river-soummam" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#96C2DB" />
              <stop offset="50%" stopColor="#6C9FB8" />
              <stop offset="100%" stopColor="#4D7F9B" />
            </linearGradient>
            <linearGradient id="grove-field" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4C682A" />
              <stop offset="100%" stopColor="#1C2712" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="url(#sky-soummam)" />
          {/* Sun */}
          <circle cx="620" cy="110" r="50" fill="#FCE9BD" opacity="0.8" />
          <circle cx="620" cy="110" r="70" fill="#FCE9BD" opacity="0.3" />
          {/* Distant Djurdjura peaks */}
          <path d="M0 240 L120 180 L230 210 L340 160 L480 220 L610 170 L720 210 L800 175 L800 450 L0 450 Z" fill="url(#mountain-back)" />
          {/* Mid-range olive hills */}
          <path d="M0 280 Q180 220 380 270 T800 250 L800 450 L0 450 Z" fill="url(#mountain-mid)" opacity="0.9" />
          {/* Soummam River meandering */}
          <path d="M210 450 Q310 380 430 360 T600 310 Q680 290 730 270 L760 270 Q710 295 620 320 T440 375 Q320 400 240 450 Z" fill="url(#river-soummam)" />
          {/* Foreground groves */}
          <path d="M0 340 Q250 310 460 380 T800 360 L800 450 L0 450 Z" fill="url(#grove-field)" />
          {/* Olive tree clusters (stylized silhouettes with silver highlights) */}
          {[
            { x: 70, y: 360, s: 1.1 }, { x: 130, y: 375, s: 1.3 }, { x: 200, y: 355, s: 0.9 },
            { x: 320, y: 390, s: 1.4 }, { x: 420, y: 400, s: 1.2 }, { x: 520, y: 370, s: 1.0 },
            { x: 640, y: 350, s: 1.1 }, { x: 720, y: 365, s: 1.3 }, { x: 770, y: 380, s: 0.9 }
          ].map((t, i) => (
            <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
              <path d="M0 0 Q-2 -18 0 -26 Q2 -18 0 0" stroke="#1A2010" strokeWidth="3.5" fill="none" />
              <ellipse cx="0" cy="-28" rx="14" ry="10" fill="#2E431B" />
              <ellipse cx="-4" cy="-30" rx="9" ry="7" fill="#587A36" opacity="0.8" />
              <ellipse cx="4" cy="-27" rx="8" ry="6" fill="#8EA865" opacity="0.7" />
            </g>
          ))}
          <text x="30" y="420" fill="#FAF7F2" opacity="0.85" fontSize="13" fontWeight="600" fontFamily="sans-serif">
            Vallée de la Soummam · Bassin d'Akbou (Béjaïa)
          </text>
        </svg>
      );
    case 'mountain_terraces':
      return (
        <svg viewBox="0 0 800 450" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title}>
          <defs>
            <linearGradient id="sky-terrace" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C9DBC3" />
              <stop offset="100%" stopColor="#F4ECE1" />
            </linearGradient>
            <linearGradient id="stone-wall" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8A8574" />
              <stop offset="100%" stopColor="#5E5848" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="url(#sky-terrace)" />
          {/* Mountain slope with terraced contours */}
          <path d="M0 160 Q300 190 800 130 L800 450 L0 450 Z" fill="#3A4D27" />
          {/* Terrace wall 1 */}
          <path d="M0 240 Q400 270 800 210 L800 255 Q400 315 0 285 Z" fill="url(#stone-wall)" />
          <path d="M0 280 Q400 310 800 250 L800 450 L0 450 Z" fill="#2E3F1F" />
          {/* Terrace wall 2 */}
          <path d="M0 340 Q380 375 800 310 L800 360 Q380 425 0 390 Z" fill="url(#stone-wall)" />
          <path d="M0 380 Q380 415 800 350 L800 450 L0 450 Z" fill="#243317" />
          {/* Olive trees stationed on terraces */}
          {[
            { x: 90, y: 220, s: 1.1 }, { x: 260, y: 235, s: 1.2 }, { x: 500, y: 195, s: 1.0 }, { x: 690, y: 170, s: 1.3 },
            { x: 140, y: 320, s: 1.4 }, { x: 380, y: 340, s: 1.3 }, { x: 620, y: 290, s: 1.5 },
            { x: 80, y: 410, s: 1.6 }, { x: 450, y: 420, s: 1.6 }
          ].map((t, i) => (
            <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
              <path d="M0 0 Q-3 -15 0 -22 Q3 -15 0 0" stroke="#221C11" strokeWidth="3" fill="none" />
              <ellipse cx="0" cy="-24" rx="13" ry="9" fill="#3D5325" />
              <ellipse cx="-3" cy="-26" rx="8" ry="6" fill="#6A8B42" opacity="0.8" />
              <ellipse cx="3" cy="-23" rx="7" ry="5" fill="#99B56F" opacity="0.7" />
            </g>
          ))}
          <text x="30" y="420" fill="#FAF7F2" opacity="0.85" fontSize="13" fontWeight="600" fontFamily="sans-serif">
            Terrasses de Chemini & Banquettes Antierosives (Kabylie)
          </text>
        </svg>
      );
    case 'centennial_tree':
      return (
        <svg viewBox="0 0 800 450" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title}>
          <defs>
            <linearGradient id="sky-tree" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DFE7DC" />
              <stop offset="100%" stopColor="#F9F5EC" />
            </linearGradient>
            <linearGradient id="trunk-wood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2B2117" />
              <stop offset="35%" stopColor="#4A3B2C" />
              <stop offset="70%" stopColor="#36291C" />
              <stop offset="100%" stopColor="#1D150E" />
            </linearGradient>
            <radialGradient id="sunbeam" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFF2D6" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="450" fill="url(#sky-tree)" />
          {/* Golden glow */}
          <circle cx="400" cy="180" r="260" fill="url(#sunbeam)" />
          {/* Ground mound */}
          <path d="M0 380 Q400 340 800 380 L800 450 L0 450 Z" fill="#314221" />
          {/* Grand Centennial Twisted Trunk */}
          <path d="M350 420 C340 350 360 270 340 230 C320 200 260 170 210 160 C240 180 290 195 320 230 C310 260 270 290 290 380 C310 400 330 415 350 420 Z" fill="url(#trunk-wood)" />
          <path d="M450 420 C460 350 440 260 470 220 C500 180 570 150 620 140 C580 165 520 185 480 230 C500 270 530 310 510 390 C490 405 470 418 450 420 Z" fill="url(#trunk-wood)" />
          <path d="M380 430 C370 340 385 240 370 180 C350 140 300 120 250 110 C290 125 340 145 375 190 C410 220 430 200 435 150 C440 110 490 90 530 85 C490 105 450 125 435 180 C420 240 430 340 420 430 Z" fill="url(#trunk-wood)" />
          {/* Massive Canopy of silver-green foliage */}
          <ellipse cx="280" cy="130" rx="90" ry="55" fill="#3D5325" opacity="0.95" />
          <ellipse cx="400" cy="90" rx="110" ry="65" fill="#4B662E" opacity="0.95" />
          <ellipse cx="530" cy="120" rx="95" ry="55" fill="#3B5024" opacity="0.95" />
          <ellipse cx="330" cy="80" rx="70" ry="40" fill="#6C8C44" opacity="0.8" />
          <ellipse cx="460" cy="70" rx="75" ry="45" fill="#88A85D" opacity="0.7" />
          <ellipse cx="410" cy="115" rx="65" ry="35" fill="#A8C380" opacity="0.6" />
          {/* Hanging fruit drupes */}
          {[
            { cx: 260, cy: 160 }, { cx: 290, cy: 180 }, { cx: 370, cy: 150 },
            { cx: 440, cy: 145 }, { cx: 500, cy: 165 }, { cx: 560, cy: 150 }
          ].map((d, i) => (
            <ellipse key={i} cx={d.cx} cy={d.cy} rx="5" ry="7" fill="#4A254B" />
          ))}
          <text x="30" y="420" fill="#FAF7F2" opacity="0.85" fontSize="13" fontWeight="600" fontFamily="sans-serif">
            Olivier Multiséculaire (400+ ans) · Seddouk Ouffella
          </text>
        </svg>
      );
    case 'harvest_season':
      return (
        <svg viewBox="0 0 800 450" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title}>
          <defs>
            <linearGradient id="sky-harvest" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DFE8D7" />
              <stop offset="70%" stopColor="#F6EDDA" />
              <stop offset="100%" stopColor="#EED9B2" />
            </linearGradient>
            <linearGradient id="net-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#558B2F" />
              <stop offset="100%" stopColor="#33691E" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="url(#sky-harvest)" />
          {/* Orchard ground */}
          <path d="M0 300 Q400 270 800 310 L800 450 L0 450 Z" fill="#42572C" />
          {/* Green Harvest Nets laid on the ground */}
          <polygon points="120,440 380,330 680,340 760,450" fill="url(#net-green)" opacity="0.85" />
          {/* Grid pattern on the net */}
          <path d="M160,430 L390,340 M220,435 L430,342 M280,440 L480,343 M340,442 L540,344 M420,445 L600,345" stroke="#7CB342" strokeWidth="1.5" opacity="0.6" />
          {/* Harvest crates */}
          <rect x="220" y="380" width="55" height="35" rx="4" fill="#C67D28" stroke="#8D5514" strokeWidth="2" />
          <ellipse cx="247" cy="382" rx="24" ry="8" fill="#3E2723" />
          <rect x="290" y="390" width="60" height="38" rx="4" fill="#C67D28" stroke="#8D5514" strokeWidth="2" />
          <ellipse cx="320" cy="392" rx="26" ry="9" fill="#1B5E20" />
          {/* Olive tree arching over the nets */}
          <path d="M560 450 Q540 320 500 220 Q480 160 410 130" stroke="#372619" strokeWidth="16" fill="none" strokeLinecap="round" />
          <ellipse cx="390" cy="110" rx="140" ry="75" fill="#3D5325" />
          <ellipse cx="440" cy="80" rx="90" ry="50" fill="#6A8B42" opacity="0.8" />
          <ellipse cx="340" cy="115" rx="75" ry="40" fill="#99B56F" opacity="0.7" />
          {/* Falling olives into the net */}
          {[
            { cx: 360, cy: 220 }, { cx: 400, cy: 240 }, { cx: 440, cy: 230 }, { cx: 470, cy: 260 }
          ].map((o, i) => (
            <ellipse key={i} cx={o.cx} cy={o.cy} rx="4" ry="6" fill="#311B92" />
          ))}
          <text x="30" y="420" fill="#FAF7F2" opacity="0.85" fontSize="13" fontWeight="600" fontFamily="sans-serif">
            Cueillette au Filet & Récolte en Caisses Ajourées (Tazmalt)
          </text>
        </svg>
      );
    case 'aokas_sea':
      return (
        <svg viewBox="0 0 800 450" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title}>
          <defs>
            <linearGradient id="sky-aokas" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#B3D4E5" />
              <stop offset="60%" stopColor="#D8E8EE" />
              <stop offset="100%" stopColor="#F9DFB8" />
            </linearGradient>
            <linearGradient id="sea-med" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E5C7B" />
              <stop offset="50%" stopColor="#154359" />
              <stop offset="100%" stopColor="#0B2B3A" />
            </linearGradient>
          </defs>
          <rect width="800" height="450" fill="url(#sky-aokas)" />
          {/* Distant Cape / Mountains */}
          <path d="M0 210 Q200 170 420 200 L800 180 L800 270 L0 270 Z" fill="#4B6358" opacity="0.6" />
          {/* Mediterranean Sea */}
          <rect y="210" width="800" height="130" fill="url(#sea-med)" />
          {/* Sea reflections */}
          <ellipse cx="500" cy="240" rx="160" ry="8" fill="#5890A9" opacity="0.5" />
          {/* Coastal olive cliff */}
          <path d="M0 270 Q300 260 520 320 T800 290 L800 450 L0 450 Z" fill="#2E431B" />
          {/* Wind-shaped maritime olive trees */}
          {[
            { x: 120, y: 310, s: 1.4 }, { x: 280, y: 340, s: 1.5 }, { x: 490, y: 360, s: 1.3 }, { x: 700, y: 320, s: 1.6 }
          ].map((t, i) => (
            <g key={i} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
              <path d="M0 0 Q10 -15 15 -25 Q12 -12 0 0" stroke="#1F1A13" strokeWidth="4" fill="none" />
              <ellipse cx="20" cy="-28" rx="16" ry="9" fill="#3F5528" transform="rotate(-15 20 -28)" />
              <ellipse cx="24" cy="-30" rx="10" ry="6" fill="#719349" opacity="0.8" transform="rotate(-15 24 -30)" />
            </g>
          ))}
          <text x="30" y="420" fill="#FAF7F2" opacity="0.85" fontSize="13" fontWeight="600" fontFamily="sans-serif">
            Oliveraies Côtières d'Aokas & Vue sur la Méditerranée
          </text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 800 450" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label={title}>
          <rect width="800" height="450" fill="#2C3D1F" />
          <circle cx="400" cy="225" r="140" fill="#3D5325" opacity="0.8" />
          <text x="400" y="235" textAnchor="middle" fill="#FAF7F2" fontSize="20" fontWeight="bold">
            {title}
          </text>
        </svg>
      );
  }
};

interface LandscapePhotoProps {
  item: LandscapeItem;
  className?: string;
  isLarge?: boolean;
  customSrc?: string;
}

const LandscapePhoto: React.FC<LandscapePhotoProps> = ({ 
  item, 
  className = '', 
  isLarge = false,
  customSrc 
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const primaryPath = customSrc || `/images/paysages/${item.imageFileName}`;
  const [currentPath, setCurrentPath] = useState(primaryPath);

  useEffect(() => {
    setCurrentPath(customSrc || `/images/paysages/${item.imageFileName}`);
    setHasError(false);
    setIsLoaded(false);
  }, [item.imageFileName, customSrc]);

  const handleImageError = () => {
    if (currentPath === `/images/paysages/${item.imageFileName}` && !customSrc) {
      setCurrentPath(`/${item.imageFileName}`);
    } else {
      setHasError(true);
    }
  };

  if (hasError && !customSrc) {
    return (
      <div className="w-full h-full relative">
        <LandscapeArtwork type={item.svgType} title={item.title} />
        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#18230F]/80 text-[#FAF7F2] text-[10px] backdrop-blur-xs flex items-center gap-1 border border-white/10">
          <ImageIcon className="w-3 h-3 text-[#E6AB3C]" />
          <span>Illustration terroir</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative overflow-hidden bg-[#18230F] ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#233416] animate-pulse flex items-center justify-center">
          <Camera className="w-6 h-6 text-[#8CBE5D]/40" />
        </div>
      )}
      <img
        src={currentPath}
        alt={item.imageAlt}
        className={`w-full h-full object-cover transition-transform duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${!isLarge ? 'group-hover:scale-105' : ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={handleImageError}
        referrerPolicy="no-referrer"
        loading={isLarge ? 'eager' : 'lazy'}
      />
    </div>
  );
};

export const OliveLandscapesGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'soummam' | 'terrasses' | 'centenaires' | 'recolte'>('all');
  const [activeLandscape, setActiveLandscape] = useState<LandscapeItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('adoio_custom_landscape_photos');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleCustomImageUpload = (landscapeId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setCustomImages(prev => {
          const next = { ...prev, [landscapeId]: dataUrl };
          try {
            localStorage.setItem('adoio_custom_landscape_photos', JSON.stringify(next));
          } catch {
            // storage quota fallback
          }
          return next;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredLandscapes = LANDSCAPES_DATA.filter(
    item => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleNext = () => {
    if (!activeLandscape) return;
    const currentIndex = filteredLandscapes.findIndex(l => l.id === activeLandscape.id);
    const nextIndex = (currentIndex + 1) % filteredLandscapes.length;
    setActiveLandscape(filteredLandscapes[nextIndex]);
  };

  const handlePrev = () => {
    if (!activeLandscape) return;
    const currentIndex = filteredLandscapes.findIndex(l => l.id === activeLandscape.id);
    const prevIndex = (currentIndex - 1 + filteredLandscapes.length) % filteredLandscapes.length;
    setActiveLandscape(filteredLandscapes[prevIndex]);
  };

  const handleShare = (landscape: LandscapeItem) => {
    const url = `${window.location.origin}${window.location.pathname}#galerie-${landscape.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(landscape.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <section id="galerie-paysages" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E6DEC9] relative scroll-mt-28">
      {/* Background motif */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#3B5323_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F4D9] text-[#233416] text-xs font-bold uppercase tracking-wider mb-3 border border-[#8CBE5D]/30">
              <Camera className="w-4 h-4 text-[#436229]" />
              <span>Patrimoine Naturel & Terroirs de la Wilaya</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#18230F] tracking-tight">
              Les Paysages Oléicoles de Béjaïa
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#436229] leading-relaxed">
              De la vallée alluviale de la Soummam aux banquettes suspendues du Djurdjura et aux falaises côtières d’Aokas, découvrez la mosaïque de terroirs façonnée par des siècles d’oléiculture kabyle.
            </p>
          </div>

          {/* Quick Counter */}
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#E6DEC9] shadow-xs flex items-center gap-3 shrink-0">
            <Mountain className="w-5 h-5 text-[#E6AB3C]" />
            <div className="text-xs">
              <span className="font-bold text-[#18230F] block">57 400 Hectares</span>
              <span className="text-[#567B34]">Verger oléicole préservé</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-2 rounded-2xl border border-[#E6DEC9] shadow-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'bg-transparent text-[#233416] hover:bg-[#E8F4D9]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tous les terroirs ({LANDSCAPES_DATA.length})</span>
          </button>

          <button
            onClick={() => setSelectedCategory('soummam')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'soummam'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'bg-transparent text-[#233416] hover:bg-[#E8F4D9]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Vallée de la Soummam</span>
          </button>

          <button
            onClick={() => setSelectedCategory('terrasses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'terrasses'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'bg-transparent text-[#233416] hover:bg-[#E8F4D9]'
            }`}
          >
            <Mountain className="w-3.5 h-3.5 text-[#E6AB3C]" />
            <span>Terrasses de Montagne</span>
          </button>

          <button
            onClick={() => setSelectedCategory('centenaires')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'centenaires'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'bg-transparent text-[#233416] hover:bg-[#E8F4D9]'
            }`}
          >
            <Trees className="w-3.5 h-3.5 text-[#567B34]" />
            <span>Arbres Centenaires</span>
          </button>

          <button
            onClick={() => setSelectedCategory('recolte')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'recolte'
                ? 'bg-[#31491E] text-white shadow-xs'
                : 'bg-transparent text-[#233416] hover:bg-[#E8F4D9]'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-[#B47A16]" />
            <span>Récolte & Traditions</span>
          </button>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredLandscapes.map((landscape) => {
            const isCopied = copiedId === landscape.id;
            return (
              <div
                key={landscape.id}
                className="group bg-white rounded-3xl border border-[#E6DEC9] overflow-hidden shadow-xs hover:shadow-md hover:border-[#8CBE5D] transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Photo Thumbnail */}
                <div 
                  className="relative aspect-[16/10] overflow-hidden cursor-pointer bg-[#233416]"
                  onClick={() => setActiveLandscape(landscape)}
                >
                  <LandscapePhoto 
                    item={landscape} 
                    customSrc={customImages[landscape.id]} 
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-[#18230F]/80 backdrop-blur-md text-[#FAF7F2] text-[11px] font-semibold border border-white/20">
                      {landscape.categoryLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#E6AB3C] text-[#18230F] text-[11px] font-bold shadow-xs">
                      {landscape.altitude}
                    </span>
                  </div>

                  {/* Hover Overlay with Magnify Button & Quick Replace Photo */}
                  <div className="absolute inset-0 bg-[#18230F]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-white text-[#18230F] text-xs font-bold flex items-center gap-1.5 shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition-transform">
                      <Maximize2 className="w-3.5 h-3.5 text-[#31491E]" />
                      <span>Agrandir</span>
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById(`upload-${landscape.id}`)?.click();
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-[#233416]/90 hover:bg-[#233416] text-[#FAF7F2] text-xs font-bold shadow-lg border border-[#8CBE5D]/30 transition-all flex items-center gap-1.5 cursor-pointer transform -translate-y-1 group-hover:translate-y-0"
                      title="Remplacer par une autre photo locale"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#E6AB3C]" />
                      <span className="text-[11px]">Remplacer</span>
                    </button>
                    <input
                      id={`upload-${landscape.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleCustomImageUpload(landscape.id, e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#567B34] font-medium mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E6AB3C]" />
                      <span>{landscape.location}</span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#18230F] group-hover:text-[#31491E] transition-colors leading-snug">
                      {landscape.title}
                    </h3>
                    <p className="text-xs text-[#6F9D44] font-serif italic mt-0.5">
                      « {landscape.kabyleTitle} »
                    </p>

                    <p className="mt-2 text-xs text-[#436229] line-clamp-3 leading-relaxed">
                      {landscape.description}
                    </p>
                  </div>

                  {/* Agronomic Specs Strip */}
                  <div className="pt-3 border-t border-[#E6DEC9] text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#6F9D44] font-medium">Cépage dominant :</span>
                      <span className="font-bold text-[#18230F] truncate max-w-[170px]">{landscape.dominantVariety}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#6F9D44] font-medium">Daïra :</span>
                      <span className="font-bold text-[#31491E]">{landscape.daira}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => setActiveLandscape(landscape)}
                      className="text-xs font-bold text-[#31491E] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Fiche terroir</span>
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleShare(landscape)}
                      className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#E8F4D9] text-[#31491E] border border-[#E6DEC9] transition-colors cursor-pointer"
                      title="Copier le lien direct vers ce paysage"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-[#567B34]" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5 text-[#567B34]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Territoire Preservation Pledge Banner */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6DEC9] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#E8F4D9] text-[#31491E] shrink-0">
              <Trees className="w-6 h-6 text-[#567B34]" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#18230F]">
                Préservation du Paysage Oléicole & Démarche d'Indication Géographique (IG)
              </h4>
              <p className="text-xs sm:text-sm text-[#436229] mt-1 leading-relaxed max-w-2xl">
                Ces paysages emblématiques font l'objet d'un inventaire mené par l'ADOIO en collaboration avec la Chambre d'Agriculture de Béjaïa pour inscrire l'Huile d'Olive de Kabylie au patrimoine agronomique et territorial national.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                const mapEl = document.getElementById('carte-interactive');
                if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-[#31491E] hover:bg-[#233416] text-[#FAF7F2] text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Voir la carte des bassins
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeLandscape && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-[#FAF7F2] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col border border-[#E6DEC9] shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#233416] text-[#FAF7F2] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E6AB3C] text-[#18230F] text-xs font-bold">
                  {activeLandscape.categoryLabel}
                </span>
                <span className="text-xs text-[#E8F4D9]/80 hidden sm:inline">
                  {activeLandscape.location}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => document.getElementById(`upload-modal-${activeLandscape.id}`)?.click()}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Importer ou remplacer cette photo par une image locale"
                >
                  <Camera className="w-3.5 h-3.5 text-[#E6AB3C]" />
                  <span className="hidden sm:inline">Changer la photo</span>
                </button>
                <input
                  id={`upload-modal-${activeLandscape.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleCustomImageUpload(activeLandscape.id, e.target.files[0]);
                    }
                  }}
                />
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] transition-colors cursor-pointer"
                  title="Paysage précédent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] transition-colors cursor-pointer"
                  title="Paysage suivant"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveLandscape(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF7F2] transition-colors cursor-pointer ml-1"
                  title="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1">
              {/* Photo Full Display */}
              <div className="w-full aspect-[16/9] sm:aspect-[21/9] bg-[#18230F] relative">
                <LandscapePhoto 
                  item={activeLandscape} 
                  customSrc={customImages[activeLandscape.id]} 
                  isLarge 
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  <div className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs flex items-center gap-2 border border-white/10">
                    <Camera className="w-3.5 h-3.5 text-[#E6AB3C]" />
                    <span>{activeLandscape.photoCredit}</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/80 bg-black/40 px-2.5 py-0.5 rounded-lg backdrop-blur-xs">
                    {activeLandscape.imageFileName}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#567B34] font-medium mb-1">
                    <MapPin className="w-4 h-4 text-[#E6AB3C]" />
                    <span>{activeLandscape.location}</span>
                    <span>·</span>
                    <span>Altitude : {activeLandscape.altitude}</span>
                    <span>·</span>
                    <span>Daïra : {activeLandscape.daira}</span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#18230F]">
                    {activeLandscape.title}
                  </h3>
                  <p className="text-sm text-[#567B34] font-serif italic mt-0.5">
                    « {activeLandscape.kabyleTitle} »
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Description */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#18230F] flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-[#31491E]" />
                      <span>Récit du Terroir & Géographie</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-[#436229] leading-relaxed bg-white p-4 rounded-2xl border border-[#E6DEC9]">
                      {activeLandscape.description}
                    </p>
                  </div>

                  {/* Right: Agronomic profile */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#18230F] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#E6AB3C]" />
                      <span>Caractérisation Agronomique ADOIO</span>
                    </h4>
                    <div className="bg-[#E8F4D9]/60 p-4 rounded-2xl border border-[#8CBE5D]/30 space-y-2 text-xs text-[#233416]">
                      <p className="leading-relaxed">
                        {activeLandscape.agronomicNote}
                      </p>
                      <div className="pt-2 border-t border-[#8CBE5D]/20 flex justify-between items-center font-semibold">
                        <span>Variété dominante :</span>
                        <span className="text-[#31491E] font-bold">{activeLandscape.dominantVariety}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-[#E6DEC9] flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShare(activeLandscape)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-[#E8F4D9] text-[#18230F] font-bold border border-[#E6DEC9] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#567B34]" />
                      <span>Partager ce paysage</span>
                    </button>
                    {copiedId === activeLandscape.id && (
                      <span className="text-[#567B34] font-semibold text-xs">Lien copié dans le presse-papier !</span>
                    )}
                  </div>

                  <button
                    onClick={() => setActiveLandscape(null)}
                    className="px-5 py-2 rounded-xl bg-[#31491E] hover:bg-[#233416] text-white font-bold transition-colors cursor-pointer"
                  >
                    Fermer la vue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
