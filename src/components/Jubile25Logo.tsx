import React from 'react';

interface Jubile25LogoProps {
  className?: string;
  size?: number | string;
  showShadow?: boolean;
}

export const Jubile25Logo: React.FC<Jubile25LogoProps> = ({
  className = '',
  size = 145,
  showShadow = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 620 620"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-300 ${showShadow ? 'drop-shadow-2xl' : ''} ${className}`}
      role="img"
      aria-label="Logo officiel du 25e Jubilé d'Argent de l'ADOIO - Fête de l'Olive de Béjaïa 2026"
    >
      <defs>
        {/* Silver Relief Gradients */}
        <linearGradient id="silverBevelOuter" x1="40" y1="40" x2="580" y2="580" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="12%" stopColor="#E2E7ED" />
          <stop offset="25%" stopColor="#A8B4C0" />
          <stop offset="42%" stopColor="#5D6975" />
          <stop offset="60%" stopColor="#FFFFFF" />
          <stop offset="78%" stopColor="#9CAAB8" />
          <stop offset="92%" stopColor="#CBD5DF" />
          <stop offset="100%" stopColor="#6C7884" />
        </linearGradient>

        <linearGradient id="silverInnerRim" x1="90" y1="90" x2="530" y2="530" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#CBD5DF" />
          <stop offset="65%" stopColor="#F0F4F8" />
          <stop offset="100%" stopColor="#7E8A96" />
        </linearGradient>

        {/* Polished Gold Gradients */}
        <linearGradient id="goldRelief" x1="100" y1="100" x2="520" y2="520" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9D2" />
          <stop offset="22%" stopColor="#E4B753" />
          <stop offset="48%" stopColor="#98681A" />
          <stop offset="72%" stopColor="#FEE68C" />
          <stop offset="90%" stopColor="#CA9634" />
          <stop offset="100%" stopColor="#7B500C" />
        </linearGradient>

        <linearGradient id="numberGoldFill" x1="180" y1="210" x2="440" y2="390" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFCE5" />
          <stop offset="20%" stopColor="#FAD36E" />
          <stop offset="45%" stopColor="#C48E25" />
          <stop offset="70%" stopColor="#FBE996" />
          <stop offset="90%" stopColor="#B37B1B" />
          <stop offset="100%" stopColor="#784E0C" />
        </linearGradient>

        <linearGradient id="numberSilverOutline" x1="160" y1="200" x2="450" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#D5DEE5" />
          <stop offset="60%" stopColor="#6E7D8A" />
          <stop offset="85%" stopColor="#EBF0F5" />
          <stop offset="100%" stopColor="#8A99A6" />
        </linearGradient>

        {/* Emerald Green Ribbon Gradient */}
        <linearGradient id="ribbonGreenGrad" x1="140" y1="120" x2="480" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1B381B" />
          <stop offset="25%" stopColor="#2D5A2C" />
          <stop offset="50%" stopColor="#437740" />
          <stop offset="75%" stopColor="#2A5629" />
          <stop offset="100%" stopColor="#183418" />
        </linearGradient>

        {/* Antique Ivory Parchment Field */}
        <radialGradient id="parchmentField" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="55%" stopColor="#FAF5E8" />
          <stop offset="85%" stopColor="#F0E6D0" />
          <stop offset="100%" stopColor="#DECDB1" />
        </radialGradient>

        {/* 3D Drop Shadows */}
        <filter id="medalDropShadow" x="-12%" y="-12%" width="128%" height="128%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0C1408" floodOpacity="0.45" />
        </filter>

        <filter id="number3DShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#3B2605" floodOpacity="0.55" />
        </filter>

        <filter id="ribbonGlow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#0E1E0F" floodOpacity="0.4" />
        </filter>

        {/* Arched Text Paths */}
        <path id="pathArabicCalligraphy" d="M 120 195 A 215 215 0 0 1 500 195" fill="none" />
        <path id="pathJubileArgent" d="M 170 215 Q 310 145 450 215" fill="none" />
        <path id="path25Excellence" d="M 195 212 Q 310 172 425 212" fill="none" />
        <path id="pathLowerDevise" d="M 135 558 Q 310 610 485 558" fill="none" />
      </defs>

      {/* ================= MEDAL CONTAINER & SHADOW ================= */}
      <g filter="url(#medalDropShadow)">
        {/* Outer Circular Silver Beveled Border */}
        <circle cx="310" cy="310" r="290" fill="url(#silverBevelOuter)" stroke="#4A5663" strokeWidth="2" />
        
        {/* Beaded Numismatic Rim */}
        <circle cx="310" cy="310" r="278" fill="none" stroke="#717E8C" strokeWidth="4.5" strokeDasharray="3 5" />
        <circle cx="310" cy="310" r="270" fill="url(#silverInnerRim)" />
        <circle cx="310" cy="310" r="256" fill="#F3EBDD" stroke="url(#goldRelief)" strokeWidth="3" />

        {/* Central Antique Parchment Background */}
        <circle cx="310" cy="310" r="248" fill="url(#parchmentField)" />
        <circle cx="310" cy="310" r="242" fill="none" stroke="#D8C9AA" strokeWidth="1.2" strokeDasharray="4 4" />
      </g>

      {/* ================= TOP CREST: ALGERIAN FLAG ROUNDEL ================= */}
      <g transform="translate(310, 48)">
        {/* Ornate Scalloped Silver Cartouche */}
        <path
          d="M -46 8 C -52 -12 -35 -34 0 -38 C 35 -34 52 -12 46 8 C 42 22 28 32 0 34 C -28 32 -42 22 -46 8 Z"
          fill="url(#silverBevelOuter)"
          stroke="#4D5966"
          strokeWidth="2"
        />
        {/* Inner Gold Frame */}
        <circle cx="0" cy="0" r="32" fill="#FFFFFF" stroke="url(#goldRelief)" strokeWidth="2.5" />
        
        {/* Green Half (Left) */}
        <path d="M -30 0 A 30 30 0 0 1 0 -30 L 0 30 A 30 30 0 0 1 -30 0 Z" fill="#006633" />
        {/* White Half (Right) */}
        <path d="M 30 0 A 30 30 0 0 0 0 -30 L 0 30 A 30 30 0 0 0 30 0 Z" fill="#FFFFFF" />

        {/* Red Crescent & Star */}
        <path
          d="M 6 -13 A 14 14 0 1 0 6 13 A 11 11 0 1 1 6 -13 Z"
          fill="#D21034"
        />
        <path
          d="M 4 -1 L 6 -5 L 8 -1 L 12 -1 L 9 2 L 10 6 L 6 3 L 2 6 L 3 2 L 0 -1 Z"
          fill="#D21034"
        />
        {/* Gloss Reflection */}
        <ellipse cx="-8" cy="-10" rx="14" ry="7" fill="#FFFFFF" fillOpacity="0.4" transform="rotate(-25 -8 -10)" />
      </g>

      {/* ================= ARABIC CALLIGRAPHY (UPPER RING) ================= */}
      {/* "جمعية تنمية زراعة الزيتون وصناعته" */}
      <text
        fill="#152110"
        fontSize="22"
        fontFamily="'Traditional Arabic', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', Georgia, serif"
        fontWeight="bold"
        letterSpacing="1"
      >
        <textPath href="#pathArabicCalligraphy" startOffset="50%" textAnchor="middle">
          جمعية تنمية زراعة الزيتون وصناعته
        </textPath>
      </text>

      {/* ================= GREEN & GOLD RIBBON BANNER ================= */}
      <g filter="url(#ribbonGlow)">
        {/* Folded ribbon tails on left & right */}
        <path d="M 125 240 L 150 170 L 175 220 L 155 252 Z" fill="#132B14" stroke="#A8822E" strokeWidth="1" />
        <path d="M 495 240 L 470 170 L 445 220 L 465 252 Z" fill="#132B14" stroke="#A8822E" strokeWidth="1" />
        <path d="M 112 232 L 148 198 L 134 256 Z" fill="url(#goldRelief)" />
        <path d="M 508 232 L 472 198 L 486 256 Z" fill="url(#goldRelief)" />

        {/* Main Arched Green Ribbon */}
        <path
          d="M 142 225 Q 310 140 478 225 L 465 170 Q 310 95 155 170 Z"
          fill="url(#ribbonGreenGrad)"
          stroke="url(#goldRelief)"
          strokeWidth="3.5"
        />

        {/* Golden Inset Accent Line */}
        <path
          d="M 152 214 Q 310 138 468 214"
          stroke="#FEE68C"
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="4 2"
        />

        {/* Text: JUBILÉ D'ARGENT */}
        <text
          fill="#FFFDF0"
          stroke="#0F240E"
          strokeWidth="0.8"
          fontSize="27"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="900"
          letterSpacing="4"
          filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.65))"
        >
          <textPath href="#pathJubileArgent" startOffset="50%" textAnchor="middle">
            JUBILÉ D'ARGENT
          </textPath>
        </text>

        {/* White / Gold Under-Ribbon Panel for "25 ANS D'EXCELLENCE" */}
        <path
          d="M 188 225 Q 310 178 432 225 L 424 200 Q 310 156 196 200 Z"
          fill="#FFFDF6"
          stroke="url(#goldRelief)"
          strokeWidth="1.8"
        />
        <text
          fill="#172611"
          fontSize="13"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          fontWeight="800"
          letterSpacing="2.5"
        >
          <textPath href="#path25Excellence" startOffset="50%" textAnchor="middle">
            25 ANS D'EXCELLENCE
          </textPath>
        </text>
      </g>

      {/* ================= FLANKING LAUREL & OLIVE WREATH ================= */}
      {/* Left Laurel & Olive Branch */}
      <g transform="translate(70, 145)">
        <path d="M 42 45 Q 16 150 38 270" stroke="#8A9AA8" strokeWidth="2.8" fill="none" />
        
        {/* Leaves alternating Silver and Gold */}
        <path d="M 42 45 Q 22 28 12 50 Q 28 60 42 45 Z" fill="url(#silverInnerRim)" stroke="#4E5A66" strokeWidth="0.8" />
        <path d="M 34 82 Q 9 74 6 98 Q 24 100 34 82 Z" fill="url(#goldRelief)" stroke="#8A6315" strokeWidth="0.8" />
        <path d="M 30 124 Q 3 118 1 144 Q 22 144 30 124 Z" fill="url(#silverInnerRim)" stroke="#4E5A66" strokeWidth="0.8" />
        <path d="M 27 166 Q -1 162 -2 190 Q 20 186 27 166 Z" fill="url(#goldRelief)" stroke="#8A6315" strokeWidth="0.8" />
        <path d="M 28 208 Q 3 208 6 235 Q 24 229 28 208 Z" fill="url(#silverInnerRim)" stroke="#4E5A66" strokeWidth="0.8" />
        <path d="M 35 248 Q 14 252 22 276 Q 38 265 35 248 Z" fill="url(#goldRelief)" stroke="#8A6315" strokeWidth="0.8" />

        {/* Olives */}
        <ellipse cx="29" cy="105" rx="8.5" ry="13" fill="url(#silverBevelOuter)" stroke="#45515C" strokeWidth="1" transform="rotate(-25 29 105)" />
        <ellipse cx="22" cy="188" rx="8.5" ry="13" fill="url(#silverBevelOuter)" stroke="#45515C" strokeWidth="1" transform="rotate(-15 22 188)" />
        <ellipse cx="36" cy="232" rx="7.5" ry="12" fill="url(#goldRelief)" stroke="#74510B" strokeWidth="1" transform="rotate(-30 36 232)" />
      </g>

      {/* Right Laurel & Olive Branch (Mirrored) */}
      <g transform="translate(550, 145) scale(-1, 1)">
        <path d="M 42 45 Q 16 150 38 270" stroke="#8A9AA8" strokeWidth="2.8" fill="none" />
        
        <path d="M 42 45 Q 22 28 12 50 Q 28 60 42 45 Z" fill="url(#silverInnerRim)" stroke="#4E5A66" strokeWidth="0.8" />
        <path d="M 34 82 Q 9 74 6 98 Q 24 100 34 82 Z" fill="url(#goldRelief)" stroke="#8A6315" strokeWidth="0.8" />
        <path d="M 30 124 Q 3 118 1 144 Q 22 144 30 124 Z" fill="url(#silverInnerRim)" stroke="#4E5A66" strokeWidth="0.8" />
        <path d="M 27 166 Q -1 162 -2 190 Q 20 186 27 166 Z" fill="url(#goldRelief)" stroke="#8A6315" strokeWidth="0.8" />
        <path d="M 28 208 Q 3 208 6 235 Q 24 229 28 208 Z" fill="url(#silverInnerRim)" stroke="#4E5A66" strokeWidth="0.8" />
        <path d="M 35 248 Q 14 252 22 276 Q 38 265 35 248 Z" fill="url(#goldRelief)" stroke="#8A6315" strokeWidth="0.8" />

        <ellipse cx="29" cy="105" rx="8.5" ry="13" fill="url(#silverBevelOuter)" stroke="#45515C" strokeWidth="1" transform="rotate(-25 29 105)" />
        <ellipse cx="22" cy="188" rx="8.5" ry="13" fill="url(#silverBevelOuter)" stroke="#45515C" strokeWidth="1" transform="rotate(-15 22 188)" />
        <ellipse cx="36" cy="232" rx="7.5" ry="12" fill="url(#goldRelief)" stroke="#74510B" strokeWidth="1" transform="rotate(-30 36 232)" />
      </g>

      {/* ================= CENTRAL NUMERALS "25" (RELIEF 3D) ================= */}
      <g filter="url(#number3DShadow)">
        {/* Numeral "2" with ornate classical curve & serifs */}
        <path
          d="M 244 248 
             C 222 237 194 244 178 264 
             C 161 285 163 312 180 330 
             C 195 345 220 362 246 380 
             L 274 400 
             L 168 400 
             C 168 389 157 386 152 386
             L 152 418 
             L 284 418 
             L 284 396 
             C 256 374 228 353 206 333 
             C 193 320 191 300 202 285 
             C 213 272 230 268 247 277 
             C 260 285 266 299 260 312 
             L 282 319 
             C 291 297 282 266 258 253 Z"
          fill="url(#numberGoldFill)"
          stroke="url(#numberSilverOutline)"
          strokeWidth="6"
        />

        {/* Inner Highlight Reflection on 2 */}
        <path
          d="M 183 270 C 196 257 222 253 241 262 C 259 271 267 291 259 308"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.85"
        />

        {/* Numeral "5" with horizontal flag, vertical neck and wide sculpted loop */}
        <path
          d="M 344 248 
             L 432 248 
             L 432 272 
             L 368 272 
             L 358 310 
             C 372 303 390 301 408 308 
             C 432 317 449 341 448 370 
             C 446 398 424 420 393 420 
             C 366 420 346 407 335 389 
             L 355 374 
             C 362 385 375 394 391 394 
             C 409 394 422 380 423 365 
             C 424 350 413 334 395 332 
             C 380 330 364 337 357 346 
             L 335 340 
             Z"
          fill="url(#numberGoldFill)"
          stroke="url(#numberSilverOutline)"
          strokeWidth="6"
        />

        {/* Inner Highlight Reflection on 5 */}
        <path
          d="M 350 255 L 426 255"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 440 364 C 438 387 420 411 393 411"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.85"
        />
      </g>

      {/* ================= CENTER TITLE: FÊTE DE L'OLIVE DE BÉJAÏA ================= */}
      <g transform="translate(310, 460)">
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fill="#131E0C"
          fontSize="26"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="900"
          letterSpacing="4"
        >
          FÊTE DE L'OLIVE
        </text>
        <text
          x="0"
          y="30"
          textAnchor="middle"
          fill="#131E0C"
          fontSize="25"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="900"
          letterSpacing="5"
        >
          DE BÉJAÏA
        </text>
      </g>

      {/* ================= LOWER BANNER WITH ADOIO SEAL & DATES ================= */}
      <g filter="url(#ribbonGlow)">
        {/* Arched Silver & Gold Ribbon Base */}
        <path
          d="M 98 515 Q 310 580 522 515 L 538 558 Q 310 630 82 558 Z"
          fill="url(#silverInnerRim)"
          stroke="url(#goldRelief)"
          strokeWidth="2.8"
        />

        {/* Left Inscription: 24e Fête de l'Olive */}
        <text
          x="198"
          y="550"
          fill="#14210D"
          fontSize="15"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="bold"
          fontStyle="italic"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          24ᵉ Fête de l'Olive
        </text>

        {/* Right Inscription: 6 au 8 avril 2026 */}
        <text
          x="422"
          y="550"
          fill="#14210D"
          fontSize="15"
          fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
          fontWeight="800"
          textAnchor="middle"
          letterSpacing="0.8"
        >
          6 au 8 avril 2026
        </text>

        {/* Central Round ADOIO Seal Medallion */}
        <g transform="translate(310, 550)">
          <circle cx="0" cy="0" r="30" fill="url(#silverBevelOuter)" stroke="#4A5663" strokeWidth="2" filter="url(#number3DShadow)" />
          <circle cx="0" cy="0" r="26" fill="#FFFDF5" stroke="url(#goldRelief)" strokeWidth="1.2" />
          
          {/* Olive Branch in Seal */}
          <path d="M -13 3 Q 0 -13 13 -4" stroke="#3D5A1E" strokeWidth="1.8" fill="none" />
          <ellipse cx="-6" cy="-8" rx="4" ry="6" fill="#5E8A34" transform="rotate(-30 -6 -8)" />
          <ellipse cx="7" cy="-6" rx="4" ry="6" fill="#5E8A34" transform="rotate(35 7 -6)" />
          <circle cx="-1" cy="1" rx="3.5" ry="4.5" fill="#6B4B0A" />
          
          {/* ADOIO Text */}
          <text
            x="0"
            y="17"
            textAnchor="middle"
            fill="#15210F"
            fontSize="10.5"
            fontFamily="'Plus Jakarta Sans', sans-serif"
            fontWeight="900"
            letterSpacing="1"
          >
            ADOIO
          </text>
        </g>
      </g>

      {/* ================= BOTTOM SCROLL: « Pour un secteur oléicole renouvelé et compétitif » ================= */}
      <g>
        <path
          d="M 120 572 Q 310 635 500 572 L 495 602 Q 310 660 125 602 Z"
          fill="#FAF4E4"
          stroke="url(#goldRelief)"
          strokeWidth="1.8"
        />
        {/* Ribbon Fold Details */}
        <path d="M 120 572 L 100 592 L 125 602 Z" fill="#614713" />
        <path d="M 500 572 L 520 592 L 495 602 Z" fill="#614713" />

        <text
          fill="#172611"
          fontSize="12.5"
          fontFamily="'Playfair Display', Georgia, serif"
          fontWeight="bold"
          fontStyle="italic"
        >
          <textPath href="#pathLowerDevise" startOffset="50%" textAnchor="middle">
            « Pour un secteur oléicole renouvelé et compétitif »
          </textPath>
        </text>
      </g>
    </svg>
  );
};
