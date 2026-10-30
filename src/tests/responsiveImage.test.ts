import { describe, it, expect } from 'vitest';
import {
  resolveGalleryImagePath,
  getWebpCompanionSources,
  getResponsiveSizesAttribute,
  buildResponsiveImageAttrs,
  calculateTargetDimensions,
  estimateDataUrlBytes,
  type ResponsiveCustomImageBundle,
} from '../utils/responsiveImage';

describe('responsiveImage utility (OliveLandscapesGallery)', () => {
  it('resolves relative filenames to /images/paysages/ and preserves absolute paths', () => {
    expect(resolveGalleryImagePath('1-Plein-akbou.jpg')).toBe('/images/paysages/1-Plein-akbou.jpg');
    expect(resolveGalleryImagePath('/assets/aistudio/6-Verger-sidi-aich2_4fd7f2ad.jpg')).toBe(
      '/assets/aistudio/6-Verger-sidi-aich2_4fd7f2ad.jpg'
    );
  });

  it('extracts mobile (-sm.webp) and desktop (.webp) companion paths', () => {
    const companions = getWebpCompanionSources('/images/paysages/1-Plein-akbou.jpg');
    expect(companions).toEqual({
      smWebp: '/images/paysages/1-Plein-akbou-sm.webp',
      lgWebp: '/images/paysages/1-Plein-akbou.webp',
      originalPath: '/images/paysages/1-Plein-akbou.jpg',
    });
  });

  it('generates browser-native srcset and sizes attributes for gallery cards and mobile viewports', () => {
    const cardAttrs = buildResponsiveImageAttrs('3-Verger-Seddouk.jpg', {
      variant: 'card',
      lowBandwidthMode: false,
    });

    expect(cardAttrs.src).toBe('/images/paysages/3-Verger-Seddouk.jpg');
    expect(cardAttrs.webpSrcSet).toBe(
      '/images/paysages/3-Verger-Seddouk-sm.webp 480w, /images/paysages/3-Verger-Seddouk.webp 960w'
    );
    expect(cardAttrs.imgSrcSet).toContain('/images/paysages/3-Verger-Seddouk-sm.webp 480w');
    expect(cardAttrs.imgSrcSet).toContain('/images/paysages/3-Verger-Seddouk.webp 960w');
    expect(cardAttrs.sizes).toContain('(max-width: 640px)');
    expect(cardAttrs.width).toBe(960);
    expect(cardAttrs.height).toBe(600);
  });

  it('restricts srcset to 480w mobile WebP in lowBandwidthMode (2G/3G)', () => {
    const ecoAttrs = buildResponsiveImageAttrs('4-Cueillette.jpg', {
      variant: 'card',
      lowBandwidthMode: true,
    });

    expect(ecoAttrs.webpSrcSet).toBe('/images/paysages/4-Cueillette-sm.webp 480w');
    expect(ecoAttrs.sizes).toBe('480px');
  });

  it('serves compact 480w WebP as default src for lightbox thumbnails', () => {
    const thumbAttrs = buildResponsiveImageAttrs('5-Olive-cote.jpg', {
      variant: 'thumbnail',
    });

    expect(thumbAttrs.src).toBe('/images/paysages/5-Olive-cote-sm.webp');
    expect(thumbAttrs.sizes).toBe(getResponsiveSizesAttribute('thumbnail', false));
    expect(thumbAttrs.width).toBe(80);
    expect(thumbAttrs.height).toBe(56);
  });

  it('supports multi-breakpoint compressed custom image bundles', () => {
    const bundle: ResponsiveCustomImageBundle = {
      src: 'data:image/webp;base64,TEc=',
      sm: 'data:image/webp;base64,U00=',
      md: 'data:image/webp;base64,TUQ=',
      lg: 'data:image/webp;base64,TEc=',
      originalBytes: 120000,
      compressedBytes: 28000,
      savingsPercent: 77,
      format: 'image/webp',
    };

    const customAttrs = buildResponsiveImageAttrs('1-Plein-akbou.jpg', {
      variant: 'card',
      customImage: bundle,
    });

    expect(customAttrs.webpSrcSet).toBe(
      'data:image/webp;base64,U00= 480w, data:image/webp;base64,TUQ= 768w, data:image/webp;base64,TEc= 1200w'
    );
    expect(customAttrs.estimatedSavingsPct).toBe(77);
  });

  it('calculates proportional target dimensions without upscaling smaller images', () => {
    const downscaled = calculateTargetDimensions(2400, 1600, 480, 360);
    expect(downscaled.width).toBe(480);
    expect(downscaled.height).toBe(320);

    const noUpscale = calculateTargetDimensions(320, 200, 960, 600);
    expect(noUpscale.width).toBe(320);
    expect(noUpscale.height).toBe(200);
    expect(noUpscale.scale).toBe(1);
  });

  it('estimates binary byte size from Base64 Data URLs accurately', () => {
    const sample = 'data:image/webp;base64,SGVsbG8='; // "Hello" -> 5 bytes
    expect(estimateDataUrlBytes(sample)).toBe(5);
  });
});
