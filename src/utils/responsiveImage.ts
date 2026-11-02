/**
 * Responsive Image Optimization & Client-Side Compression Utility
 * ---------------------------------------------------------------
 * Generates browser-native `srcset` and `sizes` attributes for `<picture>`,
 * `<source>`, and `<img>` elements in the OliveLandscapesGallery component,
 * and automatically compresses user-uploaded photos into multi-breakpoint
 * WebP variants to improve mobile PageSpeed / LCP / bandwidth metrics.
 */

export type ResponsiveImageVariant = 'card' | 'featured' | 'lightbox' | 'thumbnail';

export interface ResponsiveCustomImageBundle {
  /** Primary default source (typically 960w or 1200w WebP data URL) */
  src: string;
  /** Mobile 480w compressed WebP data URL */
  sm?: string;
  /** Tablet 768w compressed WebP data URL */
  md?: string;
  /** Desktop 1200w compressed WebP data URL */
  lg?: string;
  /** Original file size in bytes before compression */
  originalBytes?: number;
  /** Compressed primary asset size in bytes */
  compressedBytes?: number;
  /** Percentage of bytes saved compared to original upload */
  savingsPercent?: number;
  /** Output MIME format used ('image/webp' | 'image/jpeg') */
  format?: string;
}

export interface ResponsiveImageOptions {
  /** Layout context to compute accurate `sizes` and dimensions */
  variant?: ResponsiveImageVariant;
  /** When enabled, restricts `srcset` to mobile-optimized 480w assets for 2G/3G links */
  lowBandwidthMode?: boolean;
  /** Optional custom uploaded image (either a raw data URL string or a multi-size bundle) */
  customImage?: string | ResponsiveCustomImageBundle;
}

export interface ResponsiveImageAttributes {
  /** Resolved fallback/default `src` attribute for `<img>` */
  src: string;
  /** Browser-native `srcset` for `<source type="image/webp">` */
  webpSrcSet: string | null;
  /** Browser-native `srcset` for the `<img>` element */
  imgSrcSet: string | undefined;
  /** Browser-native `sizes` attribute matching the layout breakpoint slot */
  sizes: string;
  /** Intrinsic width hint to prevent Cumulative Layout Shift (CLS) */
  width: number;
  /** Intrinsic height hint to prevent Cumulative Layout Shift (CLS) */
  height: number;
  /** Resolved mobile 480w WebP URL if available */
  smWebp: string | null;
  /** Resolved desktop 960w WebP URL if available */
  lgWebp: string | null;
  /** Estimated mobile transfer size in KB for UI feedback */
  estimatedMobileKb: number;
  /** Estimated bandwidth savings percentage on mobile viewports */
  estimatedSavingsPct: number;
}

export interface CompressionTargetSpec {
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

export const RESPONSIVE_BREAKPOINTS = {
  thumbnail: 160,
  mobileSm: 480,
  tabletMd: 768,
  desktopLg: 960,
  lightboxHd: 1280,
} as const;

/**
 * Normalizes a landscape image filename or path into a canonical public path.
 */
export function resolveGalleryImagePath(
  fileNameOrPath: string,
  customImage?: string | ResponsiveCustomImageBundle
): string {
  if (customImage) {
    return typeof customImage === 'string' ? customImage : customImage.src;
  }
  const trimmed = (fileNameOrPath || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('data:') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return trimmed.startsWith('/') ? trimmed : `/images/paysages/${trimmed}`;
}

/**
 * Extracts `.webp` and `-sm.webp` companion paths from a standard `.jpg`/`.jpeg`/`.png` path.
 * Returns null for enhanced `/assets/aistudio/` and `/images/paysages/` master JPEGs so the
 * high-definition enhanced photographic files are served directly without stale WebP overrides.
 */
export function getWebpCompanionSources(
  imagePath: string
): { smWebp: string; lgWebp: string; originalPath: string } | null {
  if (
    !imagePath ||
    imagePath.startsWith('data:') ||
    imagePath.startsWith('blob:') ||
    imagePath.startsWith('/assets/aistudio/') ||
    imagePath.startsWith('/images/paysages/') ||
    !/\.(jpe?g|png|webp)$/i.test(imagePath)
  ) {
    return null;
  }

  // Strip any existing -sm.webp, .webp, .jpg, .jpeg, .png suffix to get the stem
  const stem = imagePath
    .replace(/-sm\.webp$/i, '')
    .replace(/\.(jpe?g|png|webp)$/i, '');

  return {
    smWebp: `${stem}-sm.webp`,
    lgWebp: `${stem}.webp`,
    originalPath: imagePath,
  };
}

/**
 * Computes the optimal `sizes` attribute string for a given gallery layout variant.
 */
export function getResponsiveSizesAttribute(
  variant: ResponsiveImageVariant = 'card',
  lowBandwidthMode = false
): string {
  if (lowBandwidthMode) {
    return variant === 'thumbnail' ? '80px' : '480px';
  }

  switch (variant) {
    case 'thumbnail':
      return '(max-width: 640px) 64px, 80px';
    case 'featured':
      return '(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 92vw, 66vw';
    case 'lightbox':
      return '(max-width: 640px) 100vw, (max-width: 1280px) 92vw, 1280px';
    case 'card':
    default:
      return '(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(50vw - 36px), 384px';
  }
}

/**
 * Builds complete responsive image attributes (`src`, `webpSrcSet`, `imgSrcSet`, `sizes`, `width`, `height`)
 * for browser-native responsive delivery across mobile, tablet, and desktop devices.
 */
export function buildResponsiveImageAttrs(
  fileNameOrPath: string,
  options: ResponsiveImageOptions = {}
): ResponsiveImageAttributes {
  const { variant = 'card', lowBandwidthMode = false, customImage } = options;

  const dimensionsByVariant: Record<ResponsiveImageVariant, { width: number; height: number }> = {
    thumbnail: { width: 80, height: 56 },
    card: { width: 960, height: 600 },
    featured: { width: 960, height: 600 },
    lightbox: { width: 1280, height: 800 },
  };

  const { width, height } = dimensionsByVariant[variant];
  const sizes = getResponsiveSizesAttribute(variant, lowBandwidthMode);

  // Case 1: Custom user-uploaded image (multi-breakpoint bundle or raw data URL)
  if (customImage) {
    if (typeof customImage === 'object' && customImage !== null) {
      const sm = customImage.sm || customImage.src;
      const md = customImage.md || customImage.src;
      const lg = customImage.lg || customImage.src;

      const srcSet = lowBandwidthMode
        ? `${sm} 480w`
        : variant === 'thumbnail'
          ? `${sm} 480w`
          : `${sm} 480w, ${md} 768w, ${lg} 1200w`;

      const preferredSrc = lowBandwidthMode || variant === 'thumbnail' ? sm : customImage.src;

      return {
        src: preferredSrc,
        webpSrcSet: srcSet,
        imgSrcSet: srcSet,
        sizes,
        width,
        height,
        smWebp: sm,
        lgWebp: lg,
        estimatedMobileKb: customImage.compressedBytes
          ? Math.max(8, Math.round((customImage.compressedBytes * 0.45) / 1024))
          : 28,
        estimatedSavingsPct: customImage.savingsPercent ?? 72,
      };
    }

    // Legacy single data URL string
    return {
      src: customImage,
      webpSrcSet: null,
      imgSrcSet: undefined,
      sizes,
      width,
      height,
      smWebp: null,
      lgWebp: null,
      estimatedMobileKb: Math.max(10, Math.round(estimateDataUrlBytes(customImage) / 1024)),
      estimatedSavingsPct: 0,
    };
  }

  // Case 2: Static gallery asset
  const resolvedPath = resolveGalleryImagePath(fileNameOrPath);
  const companions = getWebpCompanionSources(resolvedPath);

  if (!companions) {
    return {
      src: resolvedPath,
      webpSrcSet: null,
      imgSrcSet: undefined,
      sizes,
      width,
      height,
      smWebp: null,
      lgWebp: null,
      estimatedMobileKb: 45,
      estimatedSavingsPct: 0,
    };
  }

  const { smWebp, lgWebp, originalPath } = companions;

  let webpSrcSet: string;
  let imgSrcSet: string;
  let defaultSrc: string;

  if (lowBandwidthMode || variant === 'thumbnail') {
    webpSrcSet = `${smWebp} 480w`;
    imgSrcSet = `${smWebp} 480w, ${lgWebp} 960w`;
    defaultSrc = variant === 'thumbnail' ? smWebp : originalPath;
  } else if (variant === 'lightbox') {
    webpSrcSet = `${smWebp} 480w, ${lgWebp} 960w`;
    imgSrcSet = `${smWebp} 480w, ${lgWebp} 960w, ${originalPath} 1280w`;
    defaultSrc = originalPath;
  } else {
    webpSrcSet = `${smWebp} 480w, ${lgWebp} 960w`;
    imgSrcSet = `${smWebp} 480w, ${lgWebp} 960w, ${originalPath} 1280w`;
    defaultSrc = originalPath;
  }

  return {
    src: defaultSrc,
    webpSrcSet,
    imgSrcSet,
    sizes,
    width,
    height,
    smWebp,
    lgWebp,
    estimatedMobileKb: 24,
    estimatedSavingsPct: 76,
  };
}

/**
 * Pure helper: calculates proportional target width and height within a bounding box
 * without ever upscaling smaller images.
 */
export function calculateTargetDimensions(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number = maxWidth
): { width: number; height: number; scale: number } {
  if (srcWidth <= 0 || srcHeight <= 0) {
    return { width: Math.max(1, maxWidth), height: Math.max(1, maxHeight), scale: 1 };
  }

  const widthRatio = maxWidth / srcWidth;
  const heightRatio = maxHeight / srcHeight;
  const scale = Math.min(1, widthRatio, heightRatio);

  return {
    width: Math.max(1, Math.round(srcWidth * scale)),
    height: Math.max(1, Math.round(srcHeight * scale)),
    scale,
  };
}

/**
 * Estimates the binary payload size in bytes of a Base64 Data URL.
 */
export function estimateDataUrlBytes(dataUrl: string): number {
  if (!dataUrl || typeof dataUrl !== 'string') return 0;
  const commaIdx = dataUrl.indexOf(',');
  const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

export interface PhotoEnhancementOptions {
  exposureGain?: number;
  contrastStrength?: number;
  sharpenAmount?: number;
  sharpenThreshold?: number;
  vibrance?: number;
}

/**
 * Photographic Luminance (YCbCr) Enhancement Pipeline for uploaded images:
 * Preserves 100% of subject identity, geometry, and composition while improving
 * dynamic range, luminous exposure, S-curve contrast, and micro-detail sharpness
 * without introducing chromatic or compression artifacts.
 */
export function enhanceImageDataPhotographic(
  imageData: ImageData,
  options: PhotoEnhancementOptions = {}
): ImageData {
  const {
    exposureGain = 1.055,
    contrastStrength = 1.13,
    sharpenAmount = 0.62,
    sharpenThreshold = 3.5,
    vibrance = 1.07,
  } = options;

  const { data, width, height } = imageData;
  const pixelCount = width * height;
  const Y = new Float32Array(pixelCount);
  const Cb = new Float32Array(pixelCount);
  const Cr = new Float32Array(pixelCount);
  const hist = new Uint32Array(256);

  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    if (data[idx + 3] < 10) continue;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    const yVal = 0.299 * r + 0.587 * g + 0.114 * b;
    Y[i] = yVal;
    Cb[i] = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    Cr[i] = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
    hist[Math.max(0, Math.min(255, Math.round(yVal)))]++;
  }

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

  const blackPoint = Math.min(16, Math.max(0, minLuma * 0.6));
  const whitePoint = Math.max(240, Math.min(255, 255 - (255 - maxLuma) * 0.6));
  const lumaSpan = Math.max(1, whitePoint - blackPoint);

  const YMapped = new Float32Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    let norm = (Y[i] - blackPoint) / lumaSpan;
    norm = Math.max(0, Math.min(1, norm));
    norm = Math.pow(norm, 1 / exposureGain);
    const centered = norm - 0.5;
    const contrasted = 0.5 + centered * contrastStrength * (1 - 0.32 * centered * centered);
    YMapped[i] = Math.max(0, Math.min(255, contrasted * 255));
  }

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
      const absDetail = Math.abs(detail);
      let boost = 0;
      if (absDetail > sharpenThreshold) {
        const effectiveDetail = Math.sign(detail) * (absDetail - sharpenThreshold * 0.5);
        const haloGuard = 1 - Math.pow(center / 127.5 - 1, 4) * 0.55;
        boost = effectiveDetail * sharpenAmount * Math.max(0.25, haloGuard);
      }
      YSharpened[y1 + x1] = Math.max(0, Math.min(255, center + boost));
    }
  }

  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    if (data[idx + 3] < 10) continue;
    const yFinal = YSharpened[i];
    const cbOffset = Cb[i] - 128;
    const crOffset = Cr[i] - 128;

    const chromaMag = Math.sqrt(cbOffset * cbOffset + crOffset * crOffset) / 128;
    const vibFactor = 1 + (vibrance - 1) * (1 - Math.min(1, chromaMag * 1.4));

    const cbFinal = cbOffset * vibFactor;
    const crFinal = crOffset * vibFactor;

    data[idx] = Math.max(0, Math.min(255, Math.round(yFinal + 1.402 * crFinal)));
    data[idx + 1] = Math.max(0, Math.min(255, Math.round(yFinal - 0.344136 * cbFinal - 0.714136 * crFinal)));
    data[idx + 2] = Math.max(0, Math.min(255, Math.round(yFinal + 1.772 * cbFinal)));
  }

  return imageData;
}

/**
 * Renders an HTMLImageElement onto an offscreen canvas at the target max dimensions,
 * applies photographic luminance enhancement (exposure, contrast, unsharp mask),
 * and encodes it as compressed WebP (falling back to JPEG if WebP encoding is unsupported).
 */
function encodeResizedVariant(
  img: HTMLImageElement,
  spec: CompressionTargetSpec
): { dataUrl: string; format: string; bytes: number } {
  const naturalW = img.naturalWidth || img.width || 960;
  const naturalH = img.naturalHeight || img.height || 600;
  const { width, height } = calculateTargetDimensions(
    naturalW,
    naturalH,
    spec.maxWidth,
    spec.maxHeight
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    enhanceImageDataPhotographic(imgData);
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Ignore CORS taint if any external image is drawn
  }

  // Attempt WebP compression first
  let dataUrl = canvas.toDataURL('image/webp', spec.quality);
  let format = 'image/webp';

  // Fallback to JPEG if browser returned PNG or doesn't support WebP canvas export
  if (!dataUrl.startsWith('data:image/webp')) {
    dataUrl = canvas.toDataURL('image/jpeg', spec.quality);
    format = 'image/jpeg';
  }

  return {
    dataUrl,
    format,
    bytes: estimateDataUrlBytes(dataUrl),
  };
}

/**
 * Automatically compresses and resizes a user-uploaded image `File` into a multi-breakpoint
 * responsive WebP bundle (`sm` 480w, `md` 768w, `lg` 1200w) suitable for `srcset` delivery.
 */
export async function compressImageToResponsiveSet(
  file: File
): Promise<ResponsiveCustomImageBundle> {
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read image file'));
      }
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });

  const originalBytes = file.size || estimateDataUrlBytes(rawDataUrl);

  // In non-DOM or headless environments without Image/Canvas support, return raw fallback
  if (typeof document === 'undefined' || typeof Image === 'undefined') {
    return {
      src: rawDataUrl,
      sm: rawDataUrl,
      md: rawDataUrl,
      lg: rawDataUrl,
      originalBytes,
      compressedBytes: originalBytes,
      savingsPercent: 0,
      format: file.type || 'image/jpeg',
    };
  }

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const imageEl = new Image();
      imageEl.onload = () => resolve(imageEl);
      imageEl.onerror = () => reject(new Error('Image decode failed'));
      imageEl.src = rawDataUrl;
    });

    const smResult = encodeResizedVariant(img, {
      maxWidth: RESPONSIVE_BREAKPOINTS.mobileSm,
      maxHeight: 360,
      quality: 0.74,
    });

    const mdResult = encodeResizedVariant(img, {
      maxWidth: RESPONSIVE_BREAKPOINTS.tabletMd,
      maxHeight: 540,
      quality: 0.79,
    });

    const lgResult = encodeResizedVariant(img, {
      maxWidth: 1200,
      maxHeight: 840,
      quality: 0.83,
    });

    const compressedBytes = mdResult.bytes;
    const savingsPercent =
      originalBytes > 0
        ? Math.max(0, Math.min(98, Math.round(((originalBytes - smResult.bytes) / originalBytes) * 100)))
        : 70;

    return {
      src: lgResult.dataUrl,
      sm: smResult.dataUrl,
      md: mdResult.dataUrl,
      lg: lgResult.dataUrl,
      originalBytes,
      compressedBytes,
      savingsPercent,
      format: lgResult.format,
    };
  } catch {
    return {
      src: rawDataUrl,
      sm: rawDataUrl,
      md: rawDataUrl,
      lg: rawDataUrl,
      originalBytes,
      compressedBytes: originalBytes,
      savingsPercent: 0,
      format: file.type || 'image/jpeg',
    };
  }
}
