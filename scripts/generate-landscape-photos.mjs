import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';

const W = 960;
const H = 540;

function setPixel(buf, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const idx = (y * W + x) * 4;
  buf[idx] = Math.max(0, Math.min(255, Math.round(r)));
  buf[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
  buf[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
  buf[idx + 3] = Math.max(0, Math.min(255, Math.round(a)));
}

function noise(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

// 1. Akbou Olive Plain with tilled red soil and olive trees
function generateAkbou(buf) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ny = y / H;
      const nx = x / W;
      let r, g, b;

      if (ny < 0.42) {
        // Sky with soft gradient
        const skyT = ny / 0.42;
        r = 90 + skyT * 85;
        g = 150 + skyT * 60;
        b = 230 - skyT * 20;

        // Clouds
        const c1 = noise(nx * 8, ny * 15);
        if (ny > 0.1 && ny < 0.35 && c1 > 0.45) {
          const cloudBlend = (c1 - 0.45) * 1.6;
          r = r * (1 - cloudBlend) + 245 * cloudBlend;
          g = g * (1 - cloudBlend) + 248 * cloudBlend;
          b = b * (1 - cloudBlend) + 255 * cloudBlend;
        }

        // Distant mountains
        const mountainH = 0.38 + Math.sin(nx * 4) * 0.04 + Math.cos(nx * 7) * 0.02;
        if (ny > mountainH) {
          const mBlend = (ny - mountainH) / (0.42 - mountainH);
          r = 130 * mBlend + r * (1 - mBlend);
          g = 145 * mBlend + g * (1 - mBlend);
          b = 175 * mBlend + b * (1 - mBlend);
        }
      } else {
        // Tilled furrowed reddish-brown soil
        const soilT = (ny - 0.42) / 0.58;
        // Furrow wave patterns curving in perspective
        const furrow = Math.sin((nx - 0.5) * (15 + soilT * 40) + soilT * 12);
        const furrowShade = 0.75 + furrow * 0.25;

        // Base red-brown clay earth
        const baseR = 155 - soilT * 25 + noise(x, y) * 20;
        const baseG = 85 - soilT * 20 + noise(x * 2, y * 2) * 15;
        const baseB = 45 - soilT * 15 + noise(y, x) * 10;

        r = baseR * furrowShade;
        g = baseG * furrowShade;
        b = baseB * furrowShade;
      }
      setPixel(buf, x, y, r, g, b);
    }
  }

  // Draw olive trees rows
  const trees = [
    { x: 120, y: 280, size: 85 },
    { x: 260, y: 310, size: 105 },
    { x: 490, y: 330, size: 120 },
    { x: 730, y: 300, size: 110 },
    { x: 900, y: 340, size: 140 },
    { x: 380, y: 260, size: 65 },
    { x: 610, y: 250, size: 60 },
    { x: 80, y: 240, size: 50 },
  ];

  trees.forEach(t => {
    // Trunk
    for (let ty = 0; ty < t.size * 0.55; ty++) {
      const trunkW = (t.size * 0.12) * (1 - ty / (t.size * 0.8));
      for (let tx = -trunkW; tx <= trunkW; tx++) {
        setPixel(buf, t.x + tx, t.y + ty, 65 + noise(tx, ty) * 25, 45 + noise(tx, ty) * 20, 25);
      }
    }
    // Foliage canopy
    const cy = t.y - t.size * 0.45;
    const rx = t.size * 0.85;
    const ry = t.size * 0.65;
    for (let dy = -ry; dy <= ry; dy++) {
      for (let dx = -rx; dx <= rx; dx++) {
        const d = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
        if (d <= 1 + noise(dx * 0.2, dy * 0.2) * 0.3) {
          const sunLight = 1.15 - (dx / rx) * 0.35 - (dy / ry) * 0.25;
          const leafR = (65 + noise(dx, dy) * 35) * sunLight;
          const leafG = (115 + noise(dy, dx) * 45) * sunLight;
          const leafB = (45 + noise(dx, dy) * 30) * sunLight;
          setPixel(buf, t.x + dx, cy + dy, leafR, leafG, leafB);
        }
      }
    }
  });
}

// 2. Chemini Terraces / Banquettes
function generateBanquettes(buf) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ny = y / H;
      const nx = x / W;
      let r, g, b;

      if (nx > 0.55 && ny < 0.45) {
        // Mediterranean Sea in distance right
        const seaDepth = ny / 0.45;
        r = 30 + seaDepth * 30;
        g = 100 + seaDepth * 50;
        b = 180 + seaDepth * 40;
      } else if (ny < 0.3) {
        // Mountain sky
        r = 130 + ny * 60;
        g = 180 + ny * 40;
        b = 235;
      } else {
        // Sloping terraced mountainside
        const terraceIdx = Math.floor((ny * 6 + nx * 2) % 6);
        const isWall = (y % 65) < 18;

        if (isWall) {
          // Dry stone retaining wall
          const stoneVar = noise(x * 0.3, y * 0.3) * 40;
          r = 150 + stoneVar;
          g = 145 + stoneVar;
          b = 135 + stoneVar;
        } else {
          // Earth and olive vegetation
          const veg = noise(x * 0.1, y * 0.1);
          r = 75 + veg * 30;
          g = 110 + veg * 40;
          b = 40 + veg * 20;
        }
      }
      setPixel(buf, x, y, r, g, b);
    }
  }

  // Scattered terrace olive trees
  for (let i = 0; i < 18; i++) {
    const tx = 60 + (i * 52) % 860 + (noise(i, 1) - 0.5) * 40;
    const ty = 160 + (i * 22) + (noise(i, 2) - 0.5) * 30;
    const rad = 25 + (ty / H) * 40;
    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        if (dx * dx + dy * dy < rad * rad) {
          setPixel(buf, Math.round(tx + dx), Math.round(ty + dy), 60 + noise(dx, dy) * 30, 95 + noise(dy, dx) * 40, 40);
        }
      }
    }
  }
}

// 3. Seddouk Centennial Olive Tree
function generateSeddouk(buf) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ny = y / H;
      const nx = x / W;
      let r, g, b;

      if (ny < 0.5) {
        // Warm sunny sky and distant Djurdjura peaks
        r = 135 + ny * 60;
        g = 185 + ny * 40;
        b = 235;
        // Distant mountains
        const mH = 0.42 + Math.sin(nx * 5) * 0.05;
        if (ny > mH) {
          r = 140; g = 145; b = 170;
        }
      } else {
        // Green grassy meadow hill
        const grass = noise(x * 0.2, y * 0.2) * 30;
        r = 100 + grass * 0.8;
        g = 145 + grass;
        b = 55 + grass * 0.5;
      }
      setPixel(buf, x, y, r, g, b);
    }
  }

  // Massive centennial tree in center/right
  const cx = 580;
  const cy = 250;

  // Huge sculptural gnarled trunk
  for (let ty = 140; ty < 310; ty++) {
    const w = 90 + Math.sin(ty * 0.04) * 25 + (ty > 260 ? (ty - 260) * 1.8 : 0);
    for (let tx = -w; tx <= w; tx++) {
      const barkNoise = noise(tx * 0.2, ty * 0.2) * 40;
      const shadow = (tx / w) * 20;
      const isHollow = Math.abs(tx) < 25 && ty > 190 && ty < 280;
      if (isHollow) {
        setPixel(buf, cx + tx, cy + ty - 60, 30, 25, 18);
      } else {
        setPixel(buf, cx + tx, cy + ty - 60, 75 + barkNoise - shadow, 60 + barkNoise - shadow, 45);
      }
    }
  }

  // Sprawling ancient foliage
  const canopyRadX = 260;
  const canopyRadY = 170;
  for (let dy = -canopyRadY; dy <= canopyRadY; dy++) {
    for (let dx = -canopyRadX; dx <= canopyRadX; dx++) {
      const dist = (dx * dx) / (canopyRadX * canopyRadX) + (dy * dy) / (canopyRadY * canopyRadY);
      if (dist < 1 + noise(dx * 0.1, dy * 0.1) * 0.35) {
        const sun = 1.1 - (dx / canopyRadX) * 0.3 - (dy / canopyRadY) * 0.3;
        setPixel(buf, cx + dx, cy + dy - 90, (70 + noise(dx, dy) * 30) * sun, (120 + noise(dy, dx) * 40) * sun, (50 + noise(dx, dy) * 25) * sun);
      }
    }
  }
}

// 4. Tazmalt Olive Harvest with Net
function generateCueillette(buf) {
  // Aerial / elevated perspective of dry ground with green net
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ny = y / H;
      const nx = x / W;
      // Dry earthy ground
      const groundN = noise(x * 0.15, y * 0.15) * 35;
      let r = 185 - groundN;
      let g = 155 - groundN;
      let b = 115 - groundN;

      // Large dark green collection net spread under tree (polygon area)
      const inNet = nx > 0.15 && nx < 0.85 && ny > 0.45 && ny < 0.92;
      if (inNet) {
        // Mesh weave pattern
        const mesh = (x % 4 === 0 || y % 4 === 0) ? 25 : 0;
        r = 35 + mesh + noise(x, y) * 15;
        g = 75 + mesh + noise(x, y) * 20;
        b = 45 + mesh;
      }

      setPixel(buf, x, y, r, g, b);
    }
  }

  // Central olive tree viewed from high angle
  const tx = 480;
  const ty = 340;
  const rad = 170;
  for (let dy = -rad; dy <= rad; dy++) {
    for (let dx = -rad; dx <= rad; dx++) {
      if (dx * dx + dy * dy < rad * rad * (1 + noise(dx * 0.1, dy * 0.1) * 0.25)) {
        setPixel(buf, tx + dx, ty + dy - 70, 65 + noise(dx, dy) * 35, 105 + noise(dy, dx) * 45, 45 + noise(dx, dy) * 20);
      }
    }
  }

  // Workers / pickers / crates markers
  const spots = [
    { x: 390, y: 390, color: [220, 220, 230] }, // white shirt
    { x: 570, y: 410, color: [40, 80, 160] },  // blue jacket
    { x: 520, y: 460, color: [180, 70, 40] },  // red crate
    { x: 340, y: 440, color: [30, 30, 30] },   // black crate
  ];
  spots.forEach(s => {
    for (let dy = -8; dy <= 8; dy++) {
      for (let dx = -8; dx <= 8; dx++) {
        setPixel(buf, s.x + dx, s.y + dy, s.color[0], s.color[1], s.color[2]);
      }
    }
  });
}

// 5. Aokas / Cap Carbon Coast with Barbary Macaque
function generateOliveCote(buf) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ny = y / H;
      const nx = x / W;
      let r, g, b;

      if (ny < 0.45 && nx > 0.15) {
        // Turquoise Mediterranean Sea
        const seaT = ny / 0.45;
        r = 10 + seaT * 30;
        g = 135 + seaT * 30;
        b = 210 - seaT * 20;
      } else if (ny < 0.35) {
        // Sky
        r = 95 + ny * 80;
        g = 165 + ny * 50;
        b = 245;
      } else {
        // Coastal hills and olive vegetation
        const hillN = noise(x * 0.1, y * 0.1) * 40;
        r = 85 + hillN;
        g = 125 + hillN;
        b = 55 + hillN * 0.5;
      }
      setPixel(buf, x, y, r, g, b);
    }
  }

  // Olive branches in foreground left and right
  for (let i = 0; i < 350; i++) {
    const lx = Math.floor(noise(i, 1) * 320);
    const ly = Math.floor(noise(i, 2) * 480);
    for (let dy = -12; dy <= 12; dy++) {
      for (let dx = -18; dx <= 18; dx++) {
        if (dx * dx * 1.5 + dy * dy * 4 < 180) {
          setPixel(buf, lx + dx, ly + dy, 75 + noise(dx, dy) * 30, 125 + noise(dy, dx) * 35, 55);
        }
      }
    }
  }

  // Barbary Macaque perched on right branch
  const mx = 720;
  const my = 280;
  // Macaque fur body
  for (let dy = -60; dy <= 60; dy++) {
    for (let dx = -35; dx <= 35; dx++) {
      if ((dx * dx) / 1200 + (dy * dy) / 3600 < 1) {
        const fur = noise(dx * 0.4, dy * 0.4) * 35;
        setPixel(buf, mx + dx, my + dy, 150 + fur, 110 + fur * 0.8, 70 + fur * 0.5);
      }
    }
  }
  // Macaque head
  for (let dy = -30; dy <= 0; dy++) {
    for (let dx = -25; dx <= 25; dx++) {
      if (dx * dx + (dy + 15) * (dy + 15) < 550) {
        const fur = noise(dx * 0.5, dy * 0.5) * 30;
        setPixel(buf, mx + dx, my - 65 + dy, 140 + fur, 100 + fur, 65);
      }
    }
  }
}

// 6. Sidi-Aïch & Leflaye Plateau
function generateSidiAich(buf) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const ny = y / H;
      const nx = x / W;
      let r, g, b;

      if (ny < 0.4) {
        // Sky
        r = 130 + ny * 70;
        g = 180 + ny * 50;
        b = 240;

        // Distinctive conical mountain peak in center background
        const peakDist = Math.abs(nx - 0.52);
        const peakH = 0.18 + peakDist * 0.7;
        if (ny > peakH) {
          const mFade = (ny - peakH) / (0.4 - peakH);
          r = 95 * mFade + r * (1 - mFade);
          g = 115 * mFade + g * (1 - mFade);
          b = 145 * mFade + b * (1 - mFade);
        }
      } else if (ny < 0.55) {
        // Village buildings and houses nestled in valley
        const houseN = noise(Math.floor(x / 14), Math.floor(y / 10));
        if (houseN > 0.6) {
          r = 210; g = 205; b = 195; // light stucco walls
        } else if (houseN > 0.45) {
          r = 180; g = 100; b = 65;  // terracotta tile roof
        } else {
          r = 95; g = 135; b = 65;
        }
      } else {
        // Foreground lush green olive meadows
        const meadowN = noise(x * 0.15, y * 0.15) * 35;
        r = 80 + meadowN * 0.7;
        g = 130 + meadowN;
        b = 50 + meadowN * 0.4;
      }
      setPixel(buf, x, y, r, g, b);
    }
  }

  // Foreground olive trees
  const sidiTrees = [
    { x: 100, y: 380, rad: 55 },
    { x: 220, y: 420, rad: 65 },
    { x: 380, y: 440, rad: 50 },
    { x: 740, y: 410, rad: 75 },
    { x: 890, y: 390, rad: 70 },
  ];
  sidiTrees.forEach(t => {
    for (let dy = -t.rad; dy <= t.rad; dy++) {
      for (let dx = -t.rad; dx <= t.rad; dx++) {
        if (dx * dx + dy * dy < t.rad * t.rad * (1 + noise(dx * 0.1, dy * 0.1) * 0.25)) {
          setPixel(buf, t.x + dx, t.y + dy, 60 + noise(dx, dy) * 30, 110 + noise(dy, dx) * 40, 45);
        }
      }
    }
  });
}

const landscapes = [
  { name: '1-Plein-akbou.jpg', gen: generateAkbou },
  { name: '2-Banquettes.jpg', gen: generateBanquettes },
  { name: '3-Verger-Seddouk.jpg', gen: generateSeddouk },
  { name: '4-Cueillette.jpg', gen: generateCueillette },
  { name: '5-Olive-cote.jpg', gen: generateOliveCote },
  { name: '6-Verger-sidi-aich.jpg', gen: generateSidiAich }
];

const publicPaysagesDir = path.resolve('public/images/paysages');
const publicDir = path.resolve('public');
fs.mkdirSync(publicPaysagesDir, { recursive: true });

landscapes.forEach(({ name, gen }) => {
  const rawData = Buffer.alloc(W * H * 4);
  gen(rawData);

  const jpegData = jpeg.encode({
    data: rawData,
    width: W,
    height: H
  }, 88);

  // Write both in /public/images/paysages/ and /public/
  const target1 = path.join(publicPaysagesDir, name);
  const target2 = path.join(publicDir, name);

  fs.writeFileSync(target1, jpegData.data);
  fs.writeFileSync(target2, jpegData.data);
  console.log(`Generated: ${target1} (${jpegData.data.length} bytes)`);
});

console.log('All 6 landscape images successfully created!');
