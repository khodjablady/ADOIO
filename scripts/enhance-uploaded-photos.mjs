import fs from 'fs';
import path from 'path';
import jpeg from 'jpeg-js';

/**
 * Photographic Luminance (YCbCr) Enhancement Pipeline:
 * - Preserves 100% of original subject, geometry, and composition
 * - Improves dynamic range (shadow recovery + luminous midtone exposure + highlight protection)
 * - Applies S-curve contrast in Luminance space
 * - Applies thresholded Unsharp Mask (USM) on Luminance channel only (zero color artifacts)
 * - Applies subtle natural vibrance on Chroma channels
 */
function enhanceRgbaBuffer(data, width, height, opts = {}) {
  const {
    exposureGain = 1.055,    // +5.5% luminous exposure lift
    contrastStrength = 1.14, // +14% midtone S-curve contrast
    sharpenAmount = 0.68,    // Crisp micro-detail unsharp mask
    sharpenThreshold = 3.5,  // Prevents grain/artifact amplification in smooth sky/sea gradients
    vibrance = 1.08,         // Subtle natural color depth
  } = opts;

  const pixelCount = width * height;
  const Y = new Float32Array(pixelCount);
  const Cb = new Float32Array(pixelCount);
  const Cr = new Float32Array(pixelCount);

  // 1. Convert RGB to YCbCr and compute Luminance histogram percentiles (1% and 99%)
  const hist = new Uint32Array(256);
  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    const yVal = 0.299 * r + 0.587 * g + 0.114 * b;
    const cbVal = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const crVal = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

    Y[i] = yVal;
    Cb[i] = cbVal;
    Cr[i] = crVal;

    const bin = Math.max(0, Math.min(255, Math.round(yVal)));
    hist[bin]++;
  }

  // Find 0.5% black point and 99.5% white point for gentle dynamic range normalization
  let cumulative = 0;
  let minLuma = 0;
  let maxLuma = 255;
  const lowTarget = pixelCount * 0.004;
  const highTarget = pixelCount * 0.996;

  for (let b = 0; b < 256; b++) {
    cumulative += hist[b];
    if (cumulative <= lowTarget) minLuma = b;
    if (cumulative <= highTarget) maxLuma = b;
  }

  // Clamp black/white stretch so we never clip or distort natural tones
  const blackPoint = Math.min(18, Math.max(0, minLuma * 0.65));
  const whitePoint = Math.max(238, Math.min(255, 255 - (255 - maxLuma) * 0.65));
  const lumaSpan = Math.max(1, whitePoint - blackPoint);

  // 2. Apply Dynamic Range Expansion, Exposure Gamma Lift & S-Curve Contrast on Y
  const YMapped = new Float32Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    // Normalize to [0, 1]
    let norm = (Y[i] - blackPoint) / lumaSpan;
    norm = Math.max(0, Math.min(1, norm));

    // Gentle shadow recovery + luminous exposure curve (gamma ~ 0.94 + highlight rolloff)
    norm = Math.pow(norm, 1 / exposureGain);

    // Filmic S-curve contrast centered at 0.5
    const centered = norm - 0.5;
    const contrasted = 0.5 + centered * contrastStrength * (1 - 0.32 * centered * centered);
    YMapped[i] = Math.max(0, Math.min(255, contrasted * 255));
  }

  // 3. Compute 3x3 Gaussian blur of YMapped for Micro-Detail Unsharp Mask (USM)
  // Kernel: [1, 2, 1; 2, 4, 2; 1, 2, 1] / 16
  const YSharpened = new Float32Array(pixelCount);
  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - 1) * width;
    const y1 = y * width;
    const y2 = Math.min(height - 1, y + 1) * width;

    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - 1);
      const x1 = x;
      const x2 = Math.min(width - 1, x + 1);

      const blur =
        (YMapped[y0 + x0] + 2 * YMapped[y0 + x1] + YMapped[y0 + x2] +
          2 * YMapped[y1 + x0] + 4 * YMapped[y1 + x1] + 2 * YMapped[y1 + x2] +
          YMapped[y2 + x0] + 2 * YMapped[y2 + x1] + YMapped[y2 + x2]) / 16;

      const center = YMapped[y1 + x1];
      const detail = center - blur;

      // Soft threshold gating so smooth gradients remain 100% artifact-free
      const absDetail = Math.abs(detail);
      let boost = 0;
      if (absDetail > sharpenThreshold) {
        const effectiveDetail = Math.sign(detail) * (absDetail - sharpenThreshold * 0.5);
        // Protect extreme highlights/shadows from haloing
        const haloGuard = 1 - Math.pow((center / 127.5) - 1, 4) * 0.55;
        boost = effectiveDetail * sharpenAmount * Math.max(0.25, haloGuard);
      }

      YSharpened[y1 + x1] = Math.max(0, Math.min(255, center + boost));
    }
  }

  // 4. Convert back to RGB with subtle natural vibrance
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    const yFinal = YSharpened[i];
    const cbOffset = Cb[i] - 128;
    const crOffset = Cr[i] - 128;

    // Vibrance boosts less-saturated pixels more than already-saturated ones
    const chromaMag = Math.sqrt(cbOffset * cbOffset + crOffset * crOffset) / 128;
    const vibFactor = 1 + (vibrance - 1) * (1 - Math.min(1, chromaMag * 1.4));

    const cbFinal = cbOffset * vibFactor;
    const crFinal = crOffset * vibFactor;

    const r = yFinal + 1.402 * crFinal;
    const g = yFinal - 0.344136 * cbFinal - 0.714136 * crFinal;
    const b = yFinal + 1.772 * cbFinal;

    out[idx] = Math.max(0, Math.min(255, Math.round(r)));
    out[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
    out[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
    out[idx + 3] = data[idx + 3];
  }

  return out;
}

const TARGET_FILES = [
  'public/assets/aistudio/2-Banquettes3_39b8ccd4.jpg',
  'public/assets/aistudio/6-Verger-sidi-aich2_4fd7f2ad.jpg',
  'public/images/paysages/1-Plein-akbou.jpg',
  'public/images/paysages/2-Banquettes.jpg',
  'public/images/paysages/3-Verger-Seddouk.jpg',
  'public/images/paysages/4-Cueillette.jpg',
  'public/images/paysages/5-Olive-cote.jpg',
  'public/images/paysages/6-Verger-sidi-aich.jpg',
];

for (const relPath of TARGET_FILES) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping missing file: ${relPath}`);
    continue;
  }

  const rawBuf = fs.readFileSync(fullPath);
  const decoded = jpeg.decode(rawBuf, { useTArray: true, maxMemoryUsageInMB: 512 });
  const enhancedData = enhanceRgbaBuffer(decoded.data, decoded.width, decoded.height, {
    exposureGain: 1.055,
    contrastStrength: 1.14,
    sharpenAmount: 0.68,
    sharpenThreshold: 3.5,
    vibrance: 1.08,
  });

  const encoded = jpeg.encode(
    {
      data: enhancedData,
      width: decoded.width,
      height: decoded.height,
    },
    95
  );

  fs.writeFileSync(fullPath, encoded.data);

  // If companion .webp files exist for /assets/aistudio/6-Verger-sidi-aich2_4fd7f2ad.jpg or /images/paysages/,
  // remove stale .webp files if they were previously raw copies so the browser loads the enhanced high-res image,
  // or keep them synced.
  console.log(`Enhanced ${relPath} (${decoded.width}x${decoded.height}) -> ${(encoded.data.length / 1024).toFixed(1)} KB`);
}
