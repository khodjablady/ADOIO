import fs from 'fs';
import path from 'path';

function generateMedalSvg(type) {
  const configs = {
    or: {
      id: 'gold',
      metalName: "Médaille d'Or",
      rimLight: '#FFF5B8',
      rimBase: '#D89F15',
      rimDark: '#785507',
      ringBg: '#F3C33D',
      ringShine: '#FFFBE8',
      textFill: '#593D03',
      textShadow: '#FFE885',
      beadFill: '#FFE57F',
      beadShadow: '#8C6207',
      ribbonBg: '#1B5E20',
      ribbonText: '#FFE57F',
      sunColor: '#FFD54F',
      sunRays: '#FFF9C4',
      skyBg: '#FFFDE7',
      hillFar: '#A5D6A7',
      hillNear: '#81C784',
      fieldYellow: '#FFF176',
      oliveGreen: '#558B2F',
      oliveLight: '#8BC34A',
      oliveOutline: '#1B5E20',
      coinGlint: 'rgba(255, 255, 255, 0.45)'
    },
    argent: {
      id: 'silver',
      metalName: "Médaille d'Argent",
      rimLight: '#FFFFFF',
      rimBase: '#B8C2CC',
      rimDark: '#5E6773',
      ringBg: '#D1D8E0',
      ringShine: '#F8FAFC',
      textFill: '#2E3842',
      textShadow: '#FFFFFF',
      beadFill: '#F1F5F9',
      beadShadow: '#64748B',
      ribbonBg: '#1B5E20',
      ribbonText: '#F1F5F9',
      sunColor: '#FFF176',
      sunRays: '#FFF9C4',
      skyBg: '#F8FAFC',
      hillFar: '#94A3B8',
      hillNear: '#64748B',
      fieldYellow: '#FDE047',
      oliveGreen: '#4D7C0F',
      oliveLight: '#84CC16',
      oliveOutline: '#14532D',
      coinGlint: 'rgba(255, 255, 255, 0.6)'
    },
    bronze: {
      id: 'bronze',
      metalName: "Médaille de Bronze",
      rimLight: '#E8B588',
      rimBase: '#A56D3B',
      rimDark: '#53341A',
      ringBg: '#BA804C',
      ringShine: '#E2B289',
      textFill: '#38200F',
      textShadow: '#E8B588',
      beadFill: '#E2B289',
      beadShadow: '#53341A',
      ribbonBg: '#1B5E20',
      ribbonText: '#E2B289',
      sunColor: '#F59E0B',
      sunRays: '#FEF3C7',
      skyBg: '#FEF9EE',
      hillFar: '#854D0E',
      hillNear: '#713F12',
      fieldYellow: '#FCD34D',
      oliveGreen: '#3F6212',
      oliveLight: '#65A30D',
      oliveOutline: '#14532D',
      coinGlint: 'rgba(255, 255, 255, 0.35)'
    }
  };

  const cfg = configs[type];
  const size = 600;
  const center = size / 2; // 300
  const outerRadius = 285;
  const beadRadius = 275;
  const ringOuterRadius = 265;
  const ringInnerRadius = 205;
  const innerDiscRadius = 200;

  // Generate beads (64 beads around outer perimeter)
  const numBeads = 68;
  const beads = [];
  for (let i = 0; i < numBeads; i++) {
    const angle = (i * 2 * Math.PI) / numBeads;
    const bx = center + beadRadius * Math.cos(angle);
    const by = center + beadRadius * Math.sin(angle);
    beads.push({ x: bx, y: by });
  }

  // Generate sunburst rays
  const numRays = 22;
  const rays = [];
  for (let i = 0; i < numRays; i++) {
    const angle = (Math.PI * 0.95) + (i * Math.PI * 1.1 / numRays);
    const r1 = 45;
    const r2 = 190;
    const x1 = center + r1 * Math.cos(angle);
    const y1 = center + 20 + r1 * Math.sin(angle);
    const x2 = center + r2 * Math.cos(angle - 0.04);
    const y2 = center + 20 + r2 * Math.sin(angle - 0.04);
    const x3 = center + r2 * Math.cos(angle + 0.04);
    const y3 = center + 20 + r2 * Math.sin(angle + 0.04);
    rays.push(`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <!-- Metallic rim gradients -->
    <radialGradient id="rimGrad-${cfg.id}" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="${cfg.rimLight}" />
      <stop offset="45%" stop-color="${cfg.rimBase}" />
      <stop offset="85%" stop-color="${cfg.rimDark}" />
      <stop offset="100%" stop-color="${cfg.rimBase}" />
    </radialGradient>

    <!-- Ring gradient -->
    <linearGradient id="ringGrad-${cfg.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${cfg.ringShine}" />
      <stop offset="25%" stop-color="${cfg.ringBg}" />
      <stop offset="60%" stop-color="${cfg.rimLight}" />
      <stop offset="85%" stop-color="${cfg.ringBg}" />
      <stop offset="100%" stop-color="${cfg.rimDark}" />
    </linearGradient>

    <!-- Bevel light highlight -->
    <linearGradient id="bevelLight-${cfg.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0.6" />
    </linearGradient>

    <!-- Sun rays gradient -->
    <radialGradient id="sunGrad-${cfg.id}" cx="50%" cy="60%" r="50%">
      <stop offset="0%" stop-color="${cfg.sunColor}" />
      <stop offset="70%" stop-color="${cfg.sunRays}" />
      <stop offset="100%" stop-color="${cfg.skyBg}" />
    </radialGradient>

    <!-- Text Paths for circular coin typography -->
    <!-- Top Arc: ADOIO-BEJAIA -->
    <path id="pathTopArc-${cfg.id}" d="M 120 230 A 235 235 0 0 1 480 230" fill="none" />
    
    <!-- Left Arc: 24e Fête de l'Olive -->
    <path id="pathLeftArc-${cfg.id}" d="M 68 320 A 235 235 0 0 1 125 125" fill="none" />
    
    <!-- Right Arc: Arabic Text -->
    <path id="pathRightArc-${cfg.id}" d="M 475 125 A 235 235 0 0 1 532 320" fill="none" />
    
    <!-- Bottom Arc: 6 avril 2026 - Béjaïa -->
    <path id="pathBottomArc-${cfg.id}" d="M 135 375 A 235 235 0 0 0 465 375" fill="none" />

    <!-- Drop shadow for relief -->
    <filter id="medalShadow-${cfg.id}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="3" dy="5" stdDeviation="6" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <filter id="embossFilter-${cfg.id}">
      <feDropShadow dx="1" dy="1" stdDeviation="0.8" flood-color="#FFFFFF" flood-opacity="0.7"/>
      <feDropShadow dx="-1" dy="-1" stdDeviation="0.8" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Base outer drop shadow -->
  <circle cx="${center}" cy="${center + 2}" r="${outerRadius}" fill="#000000" opacity="0.25" filter="blur(6px)" />

  <!-- Outer Metallic Beaded Rim -->
  <circle cx="${center}" cy="${center}" r="${outerRadius}" fill="url(#rimGrad-${cfg.id})" stroke="${cfg.rimDark}" stroke-width="3" />
  <circle cx="${center}" cy="${center}" r="${outerRadius - 2}" fill="none" stroke="${cfg.rimLight}" stroke-width="1.5" opacity="0.8" />

  <!-- Beaded circular pearl border -->
  <g id="beads-${cfg.id}">
    ${beads.map(b => `
      <circle cx="${b.x.toFixed(1)}" cy="${b.y.toFixed(1)}" r="4.2" fill="${cfg.beadFill}" stroke="${cfg.beadShadow}" stroke-width="1.2" />
      <circle cx="${(b.x - 1).toFixed(1)}" cy="${(b.y - 1).toFixed(1)}" r="1.5" fill="#ffffff" opacity="0.75" />
    `).join('')}
  </g>

  <!-- Inner Coin Ring (Contains the official inscriptions) -->
  <circle cx="${center}" cy="${center}" r="${ringOuterRadius}" fill="none" stroke="${cfg.rimDark}" stroke-width="2" />
  <circle cx="${center}" cy="${center}" r="${ringOuterRadius - 1}" fill="url(#ringGrad-${cfg.id})" stroke="${cfg.rimLight}" stroke-width="1" />
  <circle cx="${center}" cy="${center}" r="${ringInnerRadius}" fill="none" stroke="${cfg.rimDark}" stroke-width="2.5" />
  <circle cx="${center}" cy="${center}" r="${ringInnerRadius + 2}" fill="none" stroke="${cfg.rimLight}" stroke-width="1.2" opacity="0.9" />

  <!-- Concentric fine coin grooves on the ring -->
  <circle cx="${center}" cy="${center}" r="${(ringOuterRadius + ringInnerRadius) / 2 + 12}" fill="none" stroke="${cfg.rimDark}" stroke-width="0.75" opacity="0.3" />
  <circle cx="${center}" cy="${center}" r="${(ringOuterRadius + ringInnerRadius) / 2 - 12}" fill="none" stroke="${cfg.rimDark}" stroke-width="0.75" opacity="0.3" />

  <!-- CIRCULAR INSCRIPTIONS -->
  <!-- Top: ADOIO-BEJAIA -->
  <text font-family="'Playfair Display', Georgia, serif" font-size="28" font-weight="900" fill="${cfg.textFill}" letter-spacing="4" text-anchor="middle" filter="url(#embossFilter-${cfg.id})">
    <textPath href="#pathTopArc-${cfg.id}" startOffset="50%" text-anchor="middle">
      ADOIO-BEJAIA
    </textPath>
  </text>

  <!-- Left: 24e Fête de l'Olive -->
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="800" fill="${cfg.textFill}" letter-spacing="1.5" filter="url(#embossFilter-${cfg.id})">
    <textPath href="#pathLeftArc-${cfg.id}" startOffset="50%" text-anchor="middle">
      24ᵉ Fête de l'Olive
    </textPath>
  </text>

  <!-- Right: عيد الرابع والعشرين للزيتون (Arabic) -->
  <text font-family="'Amiri', 'Traditional Arabic', 'Scheherazade New', serif" font-size="23" font-weight="bold" fill="${cfg.textFill}" letter-spacing="1" filter="url(#embossFilter-${cfg.id})">
    <textPath href="#pathRightArc-${cfg.id}" startOffset="50%" text-anchor="middle">
      عيد الرابع والعشرين للزيتون
    </textPath>
  </text>

  <!-- Bottom: 6 avril 2026 - Béjaïa -->
  <text font-family="'Plus Jakarta Sans', sans-serif" font-size="21" font-weight="800" fill="${cfg.textFill}" letter-spacing="2" filter="url(#embossFilter-${cfg.id})">
    <textPath href="#pathBottomArc-${cfg.id}" startOffset="50%" text-anchor="middle">
      6 avril 2026 • Béjaïa
    </textPath>
  </text>

  <!-- Separator Stars/Bullets on outer ring -->
  <circle cx="98" cy="270" r="3.5" fill="${cfg.textFill}" />
  <circle cx="502" cy="270" r="3.5" fill="${cfg.textFill}" />

  <!-- ======================================================== -->
  <!-- INNER MEDALLION DISC : TERROIR LANDSCAPE & ADOIO EMBLEM -->
  <!-- ======================================================== -->
  <g clip-path="url(#innerClip-${cfg.id})">
    <clipPath id="innerClip-${cfg.id}">
      <circle cx="${center}" cy="${center}" r="${innerDiscRadius}" />
    </clipPath>

    <!-- Sky Background with radiant sun -->
    <rect x="${center - innerDiscRadius}" y="${center - innerDiscRadius}" width="${innerDiscRadius * 2}" height="${innerDiscRadius * 2}" fill="${cfg.skyBg}" />
    
    <!-- Radiating Sunburst Rays -->
    <g id="sunburst-${cfg.id}">
      ${rays.map(r => `<path d="${r}" fill="${cfg.sunColor}" opacity="0.85" />`).join('')}
    </g>

    <!-- Rising Sun on Horizon -->
    <ellipse cx="${center}" cy="${center + 35}" rx="52" ry="42" fill="#FFFFFF" opacity="0.9" />
    <ellipse cx="${center}" cy="${center + 35}" rx="46" ry="36" fill="${cfg.sunColor}" />

    <!-- Mountain Ridges of Djurdjura / Soummam (Soft background hills) -->
    <path d="M 90 320 Q 180 270 260 295 T 410 280 T 510 320 L 510 510 L 90 510 Z" fill="${cfg.hillFar}" />
    <path d="M 90 340 Q 220 305 320 335 T 510 330 L 510 510 L 90 510 Z" fill="${cfg.hillNear}" />

    <!-- Terraced cultivated agricultural fields (Golden-yellow & green striped bands) -->
    <path d="M 90 355 Q 260 330 510 365 L 510 510 L 90 510 Z" fill="${cfg.fieldYellow}" opacity="0.85" />
    <path d="M 90 380 Q 280 355 510 395 L 510 510 L 90 510 Z" fill="#E8D568" />
    
    <!-- Terraced field furrows / murets -->
    <path d="M 120 375 Q 300 350 480 390" stroke="#B8860B" stroke-width="2.5" fill="none" opacity="0.6" />
    <path d="M 110 395 Q 290 370 490 410" stroke="#8B6508" stroke-width="2" fill="none" opacity="0.5" />
    <path d="M 100 420 Q 300 395 500 435" stroke="#556B2F" stroke-width="3" fill="none" opacity="0.5" />

    <!-- Small Olive Trees in landscape -->
    <g transform="translate(370, 310) scale(0.6)">
      <path d="M 0 0 L 0 -18" stroke="#3E2723" stroke-width="4" />
      <circle cx="0" cy="-22" r="14" fill="#2E4A1F" />
      <circle cx="-6" cy="-24" r="10" fill="#4B6F2D" />
      <circle cx="6" cy="-22" r="9" fill="#6B9638" />
    </g>
    <g transform="translate(430, 325) scale(0.75)">
      <path d="M 0 0 L 0 -22" stroke="#3E2723" stroke-width="4" />
      <circle cx="0" cy="-26" r="16" fill="#2E4A1F" />
      <circle cx="-7" cy="-28" r="11" fill="#4B6F2D" />
      <circle cx="7" cy="-25" r="10" fill="#6B9638" />
    </g>
    <g transform="translate(300, 335) scale(0.55)">
      <path d="M 0 0 L 0 -16" stroke="#3E2723" stroke-width="4" />
      <circle cx="0" cy="-20" r="13" fill="#2E4A1F" />
      <circle cx="-5" cy="-22" r="9" fill="#5E8339" />
    </g>

    <!-- ======================================================== -->
    <!-- FOREGROUND EMBLEM : OLIVE BRANCH & 2 STYLIZED OLIVES     -->
    <!-- ======================================================== -->
    <!-- Central Large Olive Leaf Left -->
    <path d="M 175 110 C 145 155 120 250 145 320 C 185 320 220 225 180 110 Z" fill="${cfg.oliveOutline}" />
    <path d="M 172 118 C 148 160 128 245 148 310 C 180 310 210 225 176 118 Z" fill="${cfg.oliveGreen}" />
    <path d="M 172 125 C 158 175 142 245 152 295" stroke="#FFFFFF" stroke-width="2.5" stroke-opacity="0.35" fill="none" />

    <!-- Center Olive Leaves Cluster -->
    <path d="M 195 210 C 230 195 320 210 335 295 C 295 330 210 280 195 210 Z" fill="${cfg.oliveOutline}" />
    <path d="M 200 215 C 232 202 312 215 325 290 C 290 320 215 275 200 215 Z" fill="${cfg.oliveGreen}" />
    
    <!-- Small Leaf Right -->
    <path d="M 250 250 C 280 235 340 255 350 310 C 315 330 265 295 250 250 Z" fill="${cfg.oliveOutline}" />
    <path d="M 253 254 C 278 242 332 258 340 305 C 310 322 267 292 253 254 Z" fill="${cfg.oliveLight}" />

    <!-- Two Iconic Foreground Olives (Curved spiral drops) -->
    <!-- Front Olive 1 (Left & Central) -->
    <g transform="translate(145, 305) scale(1.05)">
      <!-- Outer dark green spiral shell -->
      <path d="M 40 45 C 10 70 5 110 35 135 C 75 160 120 135 125 90 C 130 50 85 20 50 30 C 35 35 30 45 40 55 C 50 65 65 60 70 50 C 75 35 55 30 45 40 Z" fill="${cfg.oliveOutline}" />
      <!-- Inner vibrant olive green meat -->
      <ellipse cx="68" cy="85" rx="42" ry="48" fill="${cfg.oliveLight}" stroke="${cfg.oliveOutline}" stroke-width="5" transform="rotate(-15, 68, 85)" />
      <!-- Light reflection on olive skin -->
      <ellipse cx="58" cy="68" rx="16" ry="24" fill="#FFFFFF" opacity="0.3" transform="rotate(-25, 58, 68)" />
    </g>

    <!-- Front Olive 2 (Right smaller) -->
    <g transform="translate(230, 335) scale(0.85)">
      <path d="M 35 40 C 10 65 5 100 32 125 C 70 150 110 125 115 85 C 120 50 80 20 45 30 C 30 35 25 45 35 55 Z" fill="${cfg.oliveOutline}" />
      <ellipse cx="62" cy="78" rx="36" ry="42" fill="${cfg.oliveLight}" stroke="${cfg.oliveOutline}" stroke-width="4.5" transform="rotate(-10, 62, 78)" />
      <ellipse cx="52" cy="62" rx="13" ry="20" fill="#FFFFFF" opacity="0.3" transform="rotate(-20, 52, 62)" />
    </g>

    <!-- ======================================================== -->
    <!-- TOP ARCHED GREEN RIBBON : "ADOIO - BEJAIA"               -->
    <!-- ======================================================== -->
    <g transform="translate(180, 75)">
      <!-- Ribbon tail left -->
      <path d="M 25 35 L 5 45 L 20 20 L 5 0 L 30 10 Z" fill="#0D3812" />
      <!-- Ribbon tail right -->
      <path d="M 215 35 L 235 45 L 220 20 L 235 0 L 210 10 Z" fill="#0D3812" />
      
      <!-- Main curved banner -->
      <path d="M 20 18 Q 120 -5 220 18 Q 225 38 215 48 Q 120 25 25 48 Z" fill="${cfg.ribbonBg}" stroke="${cfg.rimLight}" stroke-width="1.8" />
      <!-- Gold banner trim border -->
      <path d="M 23 20 Q 120 -2 217 20" stroke="${cfg.ribbonText}" stroke-width="1.2" fill="none" />
      <path d="M 27 45 Q 120 23 213 45" stroke="${cfg.ribbonText}" stroke-width="1.2" fill="none" />

      <!-- Text on ribbon -->
      <text x="120" y="32" font-family="'Playfair Display', Georgia, serif" font-size="16" font-weight="900" fill="${cfg.ribbonText}" letter-spacing="3" text-anchor="middle">
        ADOIO - BEJAIA
      </text>
    </g>

    <!-- Bevel light overlay on inner medallion -->
    <circle cx="${center}" cy="${center}" r="${innerDiscRadius}" fill="none" stroke="${cfg.rimDark}" stroke-width="4" opacity="0.6" />
    <circle cx="${center}" cy="${center}" r="${innerDiscRadius - 1}" fill="url(#bevelLight-${cfg.id})" opacity="0.3" />
  </g>

  <!-- Specular glint on top-left edge -->
  <ellipse cx="160" cy="120" rx="90" ry="25" fill="${cfg.coinGlint}" transform="rotate(-35, 160, 120)" />
</svg>`;
}

const outDir = '/app/applet/public/images/medailles';
fs.mkdirSync(outDir, { recursive: true });

const types = ['or', 'argent', 'bronze'];
types.forEach(t => {
  const svg = generateMedalSvg(t);
  const filePath = path.join(outDir, `medaille-${t}.svg`);
  fs.writeFileSync(filePath, svg, 'utf-8');
  console.log(`Generated ${filePath}`);
});
