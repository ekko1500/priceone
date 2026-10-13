import { describe, it, expect } from 'vitest';
import {
  calculateGrossMargin,
  calculateRecommendedSellingPrice,
  roundUpToNext100MMK,
  calculatePriceImpact,
  formatMMK,
} from '../lib/calculations/pricing';

describe('Pricing and Margin Calculations', () => {
  describe('Rounding to next 100 MMK', () => {
    it('rounds non-multiples up to the next 100 MMK', () => {
      expect(roundUpToNext100MMK(6823.53)).toBe(6900);
      expect(roundUpToNext100MMK(5001)).toBe(5100);
      expect(roundUpToNext100MMK(10)).toBe(100);
    });

    it('keeps exact multiples of 100 MMK unchanged', () => {
      expect(roundUpToNext100MMK(5000)).toBe(5000);
      expect(roundUpToNext100MMK(6900)).toBe(6900);
      expect(roundUpToNext100MMK(100)).toBe(100);
    });

    it('handles zero and negative values safely', () => {
      expect(roundUpToNext100MMK(0)).toBe(0);
      expect(roundUpToNext100MMK(-50)).toBe(0);
    });
  });

  describe('Gross Margin Calculation', () => {
    it('computes positive gross profit and margin accurately', () => {
      // 5,600 retail - 5,000 wholesale = 600 profit; margin = 600 / 5600 * 100 = 10.714% -> 10.7%
      const result = calculateGrossMargin(5600, 5000);
      expect(result.isValid).toBe(true);
      expect(result.grossProfit).toBe(600);
      expect(result.grossMarginPercentage).toBe(10.7);
      expect(result.isNegativeMargin).toBe(false);
    });

    it('computes negative gross profit and negative margin accurately', () => {
      // 5,600 retail - 5,800 wholesale = -200 profit; margin = -200 / 5600 * 100 = -3.57% -> -3.6%
      const result = calculateGrossMargin(5600, 5800);
      expect(result.isValid).toBe(true);
      expect(result.grossProfit).toBe(-200);
      expect(result.grossMarginPercentage).toBe(-3.6);
      expect(result.isNegativeMargin).toBe(true);
    });

    it('handles zero or invalid selling prices gracefully without dividing by zero', () => {
      const result = calculateGrossMargin(0, 5000);
      expect(result.isValid).toBe(false);
      expect(result.grossMarginPercentage).toBeNull();
      expect(result.grossProfit).toBe(-5000);
    });
  });

  describe('Recommended Selling Price Calculation', () => {
    it('computes 15% target margin for 5,800 MMK wholesale cost', () => {
      // 5800 / (1 - 0.15) = 6823.529... -> rounds up to 6900 MMK
      const result = calculateRecommendedSellingPrice(5800, 15, 5600);
      expect(result.isValid).toBe(true);
      expect(Math.round(result.exactRecommendedPrice * 100) / 100).toBe(6823.53);
      expect(result.roundedRecommendedPrice).toBe(6900);
      expect(result.priceDiffFromCurrent).toBe(1300); // 6900 - 5600
    });

    it('computes custom target margins (e.g. 20%)', () => {
      // 4000 / (1 - 0.20) = 5000 -> already multiple of 100 -> 5000
      const result = calculateRecommendedSellingPrice(4000, 20);
      expect(result.roundedRecommendedPrice).toBe(5000);
    });
  });

  describe('Specification Cooking-Oil Benchmark Impact', () => {
    it('matches exact Section 9 illustrative requirements end-to-end', () => {
      const impact = calculatePriceImpact(5000, 5800, 5600, 15);
      expect(impact.costDiffMMK).toBe(800);
      expect(impact.costChangePercentage).toBe(16); // +16%
      expect(impact.before.grossProfit).toBe(600);
      expect(impact.before.grossMarginPercentage).toBe(10.7);
      expect(impact.after.grossProfit).toBe(-200);
      expect(impact.after.grossMarginPercentage).toBe(-3.6);
      expect(impact.recommendedNewSellingPrice).toBe(6900);
      expect(impact.after.marginErosionPoints).toBe(-14.3);
    });
  });

  describe('Formatting Utilities', () => {
    it('formats MMK with thousands separator', () => {
      expect(formatMMK(5800)).toBe('5,800 MMK');
      expect(formatMMK(1500000)).toBe('1,500,000 MMK');
      expect(formatMMK(0)).toBe('0 MMK');
    });
  });
});
