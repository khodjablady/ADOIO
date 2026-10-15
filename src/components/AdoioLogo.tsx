import React from 'react';

interface AdoioLogoProps {
  className?: string;
  size?: number | string;
}

export const AdoioLogo: React.FC<AdoioLogoProps> = ({ className = '', size = 52 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-md select-none ${className}`}
      role="img"
      aria-label="Logo officiel ADOIO Béjaïa"
    >
      <defs>
        {/* Outer Gold Gradient */}
        <linearGradient id="goldRimGrad" x1="50" y1="50" x2="450" y2="450" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="20%" stopColor="#DFB04B" />
          <stop offset="45%" stopColor="#9C6B19" />
          <stop offset="65%" stopColor="#F9E28C" />
          <stop offset="85%" stopColor="#C4922F" />
          <stop offset="100%" stopColor="#754E0C" />
        </linearGradient>

        {/* Inner Gold Gradient */}
        <linearGradient id="innerGoldGrad" x1="100" y1="100" x2="400" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFEAA7" />
          <stop offset="50%" stopColor="#D4A034" />
          <stop offset="100%" stopColor="#87580C" />
        </linearGradient>

        {/* Enamel Ring Gradient */}
        <radialGradient id="enamelRingGrad" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="#354922" />
          <stop offset="85%" stopColor="#243316" />
          <stop offset="100%" stopColor="#16200D" />
        </radialGradient>

        {/* Sky / Dawn Sunburst Radial Gradient */}
        <radialGradient id="sunburstGrad" cx="62%" cy="58%" r="48%">
          <stop offset="0%" stopColor="#FFF7CC" />
          <stop offset="25%" stopColor="#FFD952" />
          <stop offset="55%" stopColor="#B38928" />
          <stop offset="85%" stopColor="#556938" />
          <stop offset="100%" stopColor="#31431D" />
        </radialGradient>

        {/* Olive Green Leaf Gradient */}
        <linearGradient id="leafGrad1" x1="120" y1="130" x2="230" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A8CF53" />
          <stop offset="40%" stopColor="#5B8724" />
          <stop offset="85%" stopColor="#2F4C10" />
          <stop offset="100%" stopColor="#1C3009" />
        </linearGradient>

        <linearGradient id="leafGrad2" x1="180" y1="190" x2="280" y2="350" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BEDF68" />
          <stop offset="35%" stopColor="#719F29" />
          <stop offset="85%" stopColor="#385612" />
          <stop offset="100%" stopColor="#20340A" />
        </linearGradient>

        {/* Golden Olives Gradients */}
        <radialGradient id="oliveGrad1" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFDC9" />
          <stop offset="20%" stopColor="#E9DE57" />
          <stop offset="55%" stopColor="#9E991C" />
          <stop offset="85%" stopColor="#5C600B" />
          <stop offset="100%" stopColor="#343805" />
        </radialGradient>

        <radialGradient id="oliveGrad2" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFFDC9" />
          <stop offset="25%" stopColor="#E0D24B" />
          <stop offset="60%" stopColor="#968E1B" />
          <stop offset="90%" stopColor="#55580B" />
          <stop offset="100%" stopColor="#2D3004" />
        </radialGradient>

        {/* Ribbon Green Gradient */}
        <linearGradient id="ribbonGrad" x1="170" y1="110" x2="350" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1B3F1B" />
          <stop offset="40%" stopColor="#386E2E" />
          <stop offset="70%" stopColor="#4F893E" />
          <stop offset="100%" stopColor="#214A1C" />
        </linearGradient>

        {/* Text Paths for Circular Typography */}
        <path id="textPathArabic" d="M 105 340 A 195 195 0 0 1 205 65" fill="none" />
        <path id="textPathEnglish" d="M 235 60 A 195 195 0 0 1 315 440" fill="none" />

        {/* Drop shadow filter */}
        <filter id="medalShadow" x="-10%" y="-10%" width="125%" height="125%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0F180A" floodOpacity="0.45" />
        </filter>
        <filter id="innerGleam" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Base Group */}
      <g filter="url(#medalShadow)">
        {/* Outer Stepped Gold Rim */}
        <circle cx="250" cy="250" r="242" fill="url(#goldRimGrad)" stroke="#674306" strokeWidth="4" />
        <circle cx="250" cy="250" r="234" fill="none" stroke="#FFF7C2" strokeWidth="2" opacity="0.8" />
        <circle cx="250" cy="250" r="226" fill="none" stroke="#7E540D" strokeWidth="3" />

        {/* Dark Olive-Green Enamel Ring for Inscriptions */}
        <circle cx="250" cy="250" r="222" fill="url(#enamelRingGrad)" stroke="#DFB04B" strokeWidth="2" />

        {/* Outer Circular Inscriptions in Gold Relief */}
        {/* Arabic Inscription (top-left) */}
        <text fill="url(#goldRimGrad)" fontSize="18.5" fontWeight="bold" letterSpacing="1.2">
          <textPath href="#textPathArabic" startOffset="50%" textAnchor="middle">
            جمعية لتنمية زراعة الزيتون و صناعة الزيتون
          </textPath>
        </text>

        {/* Separation Gold Beads */}
        <circle cx="220" cy="54" r="3.5" fill="url(#goldRimGrad)" stroke="#4A3105" strokeWidth="1" />
        <circle cx="295" cy="445" r="3.5" fill="url(#goldRimGrad)" stroke="#4A3105" strokeWidth="1" />

        {/* English Inscription (right) */}
        <text fill="url(#goldRimGrad)" fontSize="11.5" fontWeight="800" letterSpacing="1.8" fontFamily="system-ui, sans-serif">
          <textPath href="#textPathEnglish" startOffset="50%" textAnchor="middle">
            ASSOCIATION FOR THE DEVELOPMENT OF THE OLIVE GROWING AND OLIVE INDUSTRIES
          </textPath>
        </text>

        {/* Inner Gold Beaded Border */}
        <circle cx="250" cy="250" r="168" fill="url(#goldRimGrad)" stroke="#533706" strokeWidth="2" />
        <circle cx="250" cy="250" r="162" fill="none" stroke="#FFF5B8" strokeWidth="1.5" />
        <circle cx="250" cy="250" r="158" fill="url(#sunburstGrad)" stroke="#4D360B" strokeWidth="2.5" />

        {/* Sunburst Rays radiating from the rising sun */}
        <g opacity="0.65">
          <line x1="305" y1="285" x2="305" y2="160" stroke="#FFE978" strokeWidth="3.5" />
          <line x1="305" y1="285" x2="250" y2="175" stroke="#FFE978" strokeWidth="3" />
          <line x1="305" y1="285" x2="210" y2="205" stroke="#FFE978" strokeWidth="3" />
          <line x1="305" y1="285" x2="360" y2="175" stroke="#FFE978" strokeWidth="3.5" />
          <line x1="305" y1="285" x2="400" y2="215" stroke="#FFE978" strokeWidth="3" />
          <line x1="305" y1="285" x2="415" y2="265" stroke="#FFE978" strokeWidth="2.5" />
          <line x1="305" y1="285" x2="275" y2="165" stroke="#FFE978" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="305" y1="285" x2="335" y2="165" stroke="#FFE978" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="305" y1="285" x2="380" y2="190" stroke="#FFE978" strokeWidth="2" strokeDasharray="4 2" />
        </g>

        {/* Rising Sun Disk */}
        <ellipse cx="305" cy="285" rx="30" ry="24" fill="#FFF280" stroke="#E6A817" strokeWidth="2" />
        <ellipse cx="305" cy="285" rx="22" ry="17" fill="#FFE042" />

        {/* Rolling Terraced Landscape & Furrowed Fields */}
        <path
          d="M 130 330 Q 200 280 305 295 Q 360 300 410 320 L 410 405 A 158 158 0 0 1 125 365 Z"
          fill="#445826"
        />
        {/* Golden Furrowed Terrace Stripes */}
        <path
          d="M 230 360 Q 300 325 405 340 L 400 355 Q 295 340 220 375 Z"
          fill="#D6AA3A"
          stroke="#976E1A"
          strokeWidth="1"
        />
        <path
          d="M 205 375 Q 280 345 390 365 L 380 380 Q 275 360 190 395 Z"
          fill="#DFB748"
          stroke="#976E1A"
          strokeWidth="1"
        />
        <path
          d="M 180 395 Q 260 368 360 390 L 350 402 Q 250 380 170 410 Z"
          fill="#E7C55C"
          stroke="#976E1A"
          strokeWidth="1"
        />

        {/* Background Sculpted Olive Trees */}
        {/* Left Tree */}
        <g transform="translate(260, 295) scale(0.65)">
          <path d="M 20 50 Q 22 30 18 20 Q 25 10 32 20 Q 28 35 30 50 Z" fill="#4B3312" />
          <ellipse cx="25" cy="18" rx="22" ry="16" fill="#3D5620" stroke="#B1CA4A" strokeWidth="1.5" />
          <ellipse cx="14" cy="14" rx="12" ry="10" fill="#4C6C26" />
          <ellipse cx="35" cy="15" rx="14" ry="11" fill="#587E2C" />
        </g>
        {/* Right Tree */}
        <g transform="translate(325, 270) scale(0.8)">
          <path d="M 20 50 Q 24 32 18 20 Q 26 8 34 20 Q 28 35 30 50 Z" fill="#4B3312" />
          <ellipse cx="26" cy="16" rx="26" ry="18" fill="#3A521D" stroke="#BED953" strokeWidth="1.5" />
          <ellipse cx="15" cy="12" rx="15" ry="11" fill="#4A6924" />
          <ellipse cx="36" cy="14" rx="16" ry="12" fill="#5E872F" />
        </g>

        {/* Foreground: Sculpted Olive Leaves */}
        {/* Leftmost Erect Leaf */}
        <g>
          <path
            d="M 148 340 C 130 290 100 200 152 120 C 185 180 170 280 148 340 Z"
            fill="url(#leafGrad1)"
            stroke="url(#innerGoldGrad)"
            strokeWidth="3.5"
          />
          {/* Leaf Central Vein Highlight */}
          <path
            d="M 148 335 Q 140 240 152 125"
            stroke="#FFE885"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Central Arching Leaf */}
        <g>
          <path
            d="M 165 345 C 160 270 175 200 268 180 C 275 250 215 320 165 345 Z"
            fill="url(#leafGrad2)"
            stroke="url(#innerGoldGrad)"
            strokeWidth="3.5"
          />
          <path
            d="M 170 340 Q 210 275 265 185"
            stroke="#FFEAA0"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Smaller Right Supporting Leaf */}
        <g>
          <path
            d="M 220 310 C 225 280 245 250 285 250 C 275 285 250 310 220 310 Z"
            fill="url(#leafGrad1)"
            stroke="url(#innerGoldGrad)"
            strokeWidth="2.5"
          />
        </g>

        {/* Foreground: Two Plump Golden Olives */}
        {/* Primary Large Olive */}
        <g>
          {/* Outer Gold Bezel */}
          <ellipse
            cx="180"
            cy="365"
            rx="48"
            ry="40"
            transform="rotate(-25 180 365)"
            fill="#754E0C"
          />
          <ellipse
            cx="180"
            cy="365"
            rx="44"
            ry="36"
            transform="rotate(-25 180 365)"
            fill="url(#oliveGrad1)"
            stroke="url(#innerGoldGrad)"
            strokeWidth="4"
          />
          {/* Glossy Reflection Highlight */}
          <ellipse
            cx="165"
            cy="350"
            rx="18"
            ry="9"
            transform="rotate(-35 165 350)"
            fill="#FFFFFF"
            opacity="0.6"
          />
          {/* Olive Apex Navel */}
          <path
            d="M 215 385 Q 220 395 210 398 Q 205 390 215 385 Z"
            fill="#3B4F1A"
            stroke="url(#innerGoldGrad)"
            strokeWidth="1.5"
          />
        </g>

        {/* Secondary Right Olive */}
        <g>
          <ellipse
            cx="235"
            cy="360"
            rx="36"
            ry="30"
            transform="rotate(-20 235 360)"
            fill="#754E0C"
          />
          <ellipse
            cx="235"
            cy="360"
            rx="33"
            ry="27"
            transform="rotate(-20 235 360)"
            fill="url(#oliveGrad2)"
            stroke="url(#innerGoldGrad)"
            strokeWidth="3.5"
          />
          <ellipse
            cx="225"
            cy="350"
            rx="12"
            ry="6"
            transform="rotate(-30 225 350)"
            fill="#FFFFFF"
            opacity="0.55"
          />
        </g>

        {/* Top Floating Ribbon Banner: "ADOIO - BEJAIA" */}
        <g filter="url(#innerGleam)">
          {/* Left and Right Ribbon Fold Tails */}
          <path
            d="M 160 145 L 180 135 L 180 160 L 160 170 L 168 157 Z"
            fill="#1E4519"
            stroke="url(#innerGoldGrad)"
            strokeWidth="2"
          />
          <path
            d="M 345 135 L 365 145 L 358 157 L 365 170 L 345 160 Z"
            fill="#1E4519"
            stroke="url(#innerGoldGrad)"
            strokeWidth="2"
          />

          {/* Main Central Banner Ribbon */}
          <path
            d="M 175 140 Q 260 115 348 140 L 345 165 Q 260 140 175 165 Z"
            fill="url(#ribbonGrad)"
            stroke="url(#innerGoldGrad)"
            strokeWidth="3"
          />

          {/* Ribbon Inscription: ADOIO - BEJAIA */}
          <text
            x="261"
            y="156"
            textAnchor="middle"
            fill="url(#goldRimGrad)"
            fontSize="18.5"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="2"
            stroke="#4A3408"
            strokeWidth="0.6"
          >
            ADOIO - BEJAIA
          </text>

          {/* Small Golden Olive Sprig Crest atop Ribbon */}
          <path
            d="M 235 118 Q 260 108 285 118"
            stroke="url(#innerGoldGrad)"
            strokeWidth="2"
            fill="none"
          />
          <ellipse cx="248" cy="113" rx="4" ry="2.5" transform="rotate(-20 248 113)" fill="#E9DE57" stroke="#9E991C" strokeWidth="0.8" />
          <ellipse cx="272" cy="113" rx="4" ry="2.5" transform="rotate(20 272 113)" fill="#E9DE57" stroke="#9E991C" strokeWidth="0.8" />
        </g>
      </g>
    </svg>
  );
};
