import { describe, it, expect } from 'vitest';
import {
  VARIETY_BASE_YIELDS,
  calculateSimulatorMetrics,
  calculateCarbonMetrics,
  calculateQuickConversion,
} from '../components/YieldSimulator';

describe('YieldSimulator Core Mathematical Logic & Edge Cases', () => {
  describe('1. Olive Weight & Quintal Calculations (Weight vs Trees Mode)', () => {
    it('computes totalWeight and totalQuintals accurately in weight mode', () => {
      const res = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: 500,
        treeCount: 30,
        kgPerTree: 25,
        selectedVariety: 'chemlal',
        comparedVariety: 'bouchouk',
        harvestPeriod: 'mid',
        extractionType: 'modern',
        delayHours: 'fast',
      });

      expect(res.totalWeight).toBe(500);
      expect(res.totalQuintals).toBe(5);
    });

    it('computes totalWeight and totalQuintals accurately in trees mode (treeCount * kgPerTree)', () => {
      const res = calculateSimulatorMetrics({
        inputMode: 'trees',
        weightKg: 500,
        treeCount: 40,
        kgPerTree: 30,
        selectedVariety: 'chemlal',
        comparedVariety: 'bouchouk',
        harvestPeriod: 'mid',
        extractionType: 'modern',
        delayHours: 'fast',
      });

      expect(res.totalWeight).toBe(1200);
      expect(res.totalQuintals).toBe(12);
    });

    it('handles zero, negative, or NaN weights gracefully without producing negative volumes', () => {
      const zeroRes = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: 0,
        treeCount: 0,
        kgPerTree: 0,
        selectedVariety: 'chemlal',
        harvestPeriod: 'mid',
        extractionType: 'modern',
        delayHours: 'fast',
      });
      expect(zeroRes.totalWeight).toBe(0);
      expect(zeroRes.estimatedOilLiters).toBe(0);
      expect(zeroRes.estimatedValueDZD).toBe(0);

      const negRes = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: -250,
        treeCount: -10,
        kgPerTree: -20,
        selectedVariety: 'chemlal',
        harvestPeriod: 'mid',
        extractionType: 'modern',
        delayHours: 'fast',
      });
      expect(negRes.totalWeight).toBe(0);
      expect(negRes.estimatedOilLiters).toBe(0);

      const nanRes = calculateSimulatorMetrics({
        inputMode: 'trees',
        weightKg: Number.NaN,
        treeCount: Number.NaN,
        kgPerTree: 25,
        selectedVariety: 'chemlal',
        harvestPeriod: 'mid',
        extractionType: 'modern',
        delayHours: 'fast',
      });
      expect(nanRes.totalWeight).toBe(0);
      expect(nanRes.estimatedOilLiters).toBe(0);
    });
  });

  describe('2. Oil Yield Modifiers (Variety, Harvest Period, Extraction Technology)', () => {
    it('applies exact variety base yields, harvest period factors (0.85, 1.0, 1.12), and extraction factors (1.02, 0.96)', () => {
      // Chemlal (18.0) * mid (1.0) * modern (1.02) = 18.36 L/qx -> for 5 qx = round(91.8) = 92 L
      const midModern = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: 500,
        treeCount: 30,
        kgPerTree: 25,
        selectedVariety: 'chemlal',
        harvestPeriod: 'mid',
        extractionType: 'modern',
        delayHours: 'fast',
      });
      expect(midModern.finalYieldPerQuintal).toBeCloseTo(18.36, 2);
      expect(midModern.estimatedOilLiters).toBe(92);

      // Early harvest (0.85) with traditional press (0.96) for Bouchouk (22.5)
      // 22.5 * 0.85 * 0.96 = 18.36 L/qx -> for 10 qx = 184 L
      const earlyTrad = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: 1000,
        treeCount: 30,
        kgPerTree: 25,
        selectedVariety: 'bouchouk',
        harvestPeriod: 'early',
        extractionType: 'traditional',
        delayHours: 'fast',
      });
      expect(earlyTrad.finalYieldPerQuintal).toBeCloseTo(18.36, 2);
      expect(earlyTrad.estimatedOilLiters).toBe(184);

      // Late harvest (1.12) with modern continuous (1.02) for Limli (22.5)
      // 22.5 * 1.12 * 1.02 = 25.704 L/qx -> for 10 qx = 257 L
      const lateModern = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: 1000,
        treeCount: 30,
        kgPerTree: 25,
        selectedVariety: 'limli',
        harvestPeriod: 'late',
        extractionType: 'modern',
        delayHours: 'fast',
      });
      expect(lateModern.finalYieldPerQuintal).toBeCloseTo(25.704, 3);
      expect(lateModern.estimatedOilLiters).toBe(257);
    });

    it('falls back to 20.0 L/qx base yield when an unknown variety ID is passed', () => {
      const unknownVar = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: 100,
        treeCount: 10,
        kgPerTree: 10,
        selectedVariety: 'unknown_cultivar',
        harvestPeriod: 'mid',
        extractionType: 'modern',
        delayHours: 'fast',
      });

      expect(VARIETY_BASE_YIELDS['unknown_cultivar']).toBeUndefined();
      // 20 * 1.0 * 1.02 = 20.4 L/qx
      expect(unknownVar.finalYieldPerQuintal).toBeCloseTo(20.4, 2);
    });
  });

  describe('3. Oleic Acidity, COI Quality Grades & Commercial Valuation', () => {
    it('classifies Extra Virgin Olive Oil (HOVE <= 0.8%) at 1150 DZD/L under optimal conditions', () => {
      // base 0.25 + fast 0.05 = 0.30%
      const hove = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: 500,
        treeCount: 20,
        kgPerTree: 25,
        selectedVariety: 'chemlal',
        harvestPeriod: 'mid',
        extractionType: 'modern',
        delayHours: 'fast',
      });

      expect(hove.estimatedAcidity).toBe(0.3);
      expect(hove.qualityGrade).toBe("Huile d'Olive Vierge Extra (HOVE)");
      expect(hove.pricePerLiter).toBe(1150);
      expect(hove.estimatedValueDZD).toBe(hove.estimatedOilLiters * 1150);
    });

    it('classifies Virgin Olive Oil (0.8% < acidity <= 2.0%) at 850 DZD/L when storage or harvest is delayed', () => {
      // base 0.25 + late 0.25 + traditional 0.20 + medium delay 0.35 = 1.05%
      const vierge = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: 500,
        treeCount: 20,
        kgPerTree: 25,
        selectedVariety: 'chemlal',
        harvestPeriod: 'late',
        extractionType: 'traditional',
        delayHours: 'medium',
      });

      expect(vierge.estimatedAcidity).toBe(1.05);
      expect(vierge.qualityGrade).toBe("Huile d'Olive Vierge");
      expect(vierge.pricePerLiter).toBe(850);
    });

    it('classifies Lampante / Courante (> 2.0% acidity) at 550 DZD/L under slow plastic-bag storage with late traditional press', () => {
      // base 0.25 + late 0.25 + traditional 0.20 + slow 1.30 = 2.00% -> boundary check!
      const boundary20 = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: 500,
        treeCount: 20,
        kgPerTree: 25,
        selectedVariety: 'chemlal',
        harvestPeriod: 'late',
        extractionType: 'traditional',
        delayHours: 'slow',
      });

      // Exactly 2.0% is still Vierge (<= 2.0)
      expect(boundary20.estimatedAcidity).toBe(2.0);
      expect(boundary20.qualityGrade).toBe("Huile d'Olive Vierge");
      expect(boundary20.pricePerLiter).toBe(850);
    });

    it('verifies side-by-side variety comparison deltas (Chemlal vs Bouchouk)', () => {
      const cmp = calculateSimulatorMetrics({
        inputMode: 'weight',
        weightKg: 1000, // 10 qx
        treeCount: 40,
        kgPerTree: 25,
        selectedVariety: 'chemlal', // 18.0
        comparedVariety: 'bouchouk', // 22.5 (+25% base yield)
        harvestPeriod: 'mid',
        extractionType: 'modern',
        delayHours: 'fast',
      });

      expect(cmp.comparedEstimatedOilLiters).toBeGreaterThan(cmp.estimatedOilLiters);
      expect(cmp.litersDiff).toBe(cmp.comparedEstimatedOilLiters - cmp.estimatedOilLiters);
      expect(cmp.yieldDiffPercent).toBe(25);
      expect(cmp.valueDiffDZD).toBe(cmp.litersDiff * cmp.pricePerLiter);
    });
  });

  describe('4. Environmental & Carbon Footprint Balance', () => {
    it('identifies regenerative agro-ecological practices as a net carbon sink (negative footprint per liter)', () => {
      const eco = calculateCarbonMetrics({
        inputMode: 'trees',
        totalWeight: 750,
        treeCount: 30,
        estimatedOilLiters: 150,
        soilPractice: 'enherbe',
        fertPractice: 'organique',
        phytoPractice: 'bio',
        waterPractice: 'pluvial',
        byproductPractice: 'circulaire',
      });

      expect(eco.effectiveTrees).toBe(30);
      expect(eco.isCarbonSink).toBe(true);
      expect(eco.netCarbonSavedKg).toBeGreaterThan(0);
      expect(eco.carbonFootprintPerLiter).toBeLessThan(0);
      expect(eco.roundtripsAlgerBejaia).toBeGreaterThanOrEqual(1);
    });

    it('identifies intensive fossil-heavy practices as net carbon emitters', () => {
      const intensive = calculateCarbonMetrics({
        inputMode: 'trees',
        totalWeight: 750,
        treeCount: 30,
        estimatedOilLiters: 150,
        soilPractice: 'intensif',
        fertPractice: 'chimique',
        phytoPractice: 'conventionnelle',
        waterPractice: 'diesel',
        byproductPractice: 'standard',
      });

      expect(intensive.isCarbonSink).toBe(false);
      expect(intensive.netCarbonSavedKg).toBeLessThan(0);
      expect(intensive.carbonFootprintPerLiter).toBeGreaterThan(0);
    });

    it('guards against division by zero when estimatedOilLiters is 0', () => {
      const zeroOilCarbon = calculateCarbonMetrics({
        inputMode: 'weight',
        totalWeight: 0,
        treeCount: 0,
        estimatedOilLiters: 0,
        soilPractice: 'enherbe',
        fertPractice: 'organique',
        phytoPractice: 'bio',
        waterPractice: 'pluvial',
        byproductPractice: 'circulaire',
      });

      expect(zeroOilCarbon.effectiveTrees).toBeGreaterThanOrEqual(1);
      expect(zeroOilCarbon.carbonFootprintPerLiter).toBe(0);
    });
  });

  describe('5. Express Quick Converter (15% – 25% Configurable Yield)', () => {
    it('calculates liters, 5L bidons, 75cl bottles, and net oil weight (density 0.916 kg/L)', () => {
      const conv = calculateQuickConversion(300, 20);
      expect(conv.quickQuintals).toBe(3);
      expect(conv.quickEstimatedLiters).toBe(60);
      expect(conv.quickBidons5L).toBe(12);
      expect(conv.quickBottles75cl).toBe(80);
      expect(conv.netOilWeightKg).toBe(55.0);
    });

    it('clamps out-of-range yield percentages to [15%, 25%] and negative weights to 0', () => {
      const low = calculateQuickConversion(-100, 5);
      expect(low.safeQuickWeightKg).toBe(0);
      expect(low.clampedYieldPercent).toBe(15);
      expect(low.quickEstimatedLiters).toBe(0);

      const high = calculateQuickConversion(200, 45);
      expect(high.clampedYieldPercent).toBe(25);
      expect(high.quickEstimatedLiters).toBe(50);
    });
  });
});
