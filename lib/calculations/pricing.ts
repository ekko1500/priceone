/**
 * Exact, deterministic pricing and profit calculations for PricePulse Myanmar.
 * All arithmetic here is strictly non-AI and unit-tested.
 * Currency: MMK (Myanmar Kyat)
 */

export interface MarginCalculationResult {
  sellingPrice: number;
  wholesaleCost: number;
  grossProfit: number;
  grossMarginPercentage: number | null; // null if selling price <= 0
  isNegativeMargin: boolean;
  isValid: boolean;
}

export interface RecommendedPriceResult {
  wholesaleCost: number;
  targetMarginPercentage: number;
  exactRecommendedPrice: number;
  roundedRecommendedPrice: number; // Rounded UP to next 100 MMK
  priceDiffFromCurrent: number | null;
  isValid: boolean;
}

export interface PriceImpactComparison {
  oldWholesaleCost: number;
  newWholesaleCost: number;
  costDiffMMK: number;
  costChangePercentage: number;
  currentSellingPrice: number;
  
  before: {
    grossProfit: number;
    grossMarginPercentage: number | null;
  };
  
  after: {
    grossProfit: number;
    grossMarginPercentage: number | null;
    marginErosionPoints: number | null; // e.g. dropped from 10.7% to -3.6% -> -14.3 points
  };
  
  recommendedNewSellingPrice: number; // at target margin (default 15%), rounded up to next 100 MMK
  targetMarginPercentage: number;
}

/**
 * Calculates Gross Profit and Gross Margin Percentage
 * Gross Profit per unit = selling price - wholesale purchase cost
 * Gross Margin % = ((selling price - wholesale purchase cost) / selling price) * 100
 */
export function calculateGrossMargin(
  sellingPrice: number,
  wholesaleCost: number
): MarginCalculationResult {
  if (typeof sellingPrice !== 'number' || typeof wholesaleCost !== 'number' || isNaN(sellingPrice) || isNaN(wholesaleCost)) {
    return {
      sellingPrice: 0,
      wholesaleCost: 0,
      grossProfit: 0,
      grossMarginPercentage: null,
      isNegativeMargin: false,
      isValid: false,
    };
  }

  const grossProfit = sellingPrice - wholesaleCost;

  if (sellingPrice <= 0) {
    return {
      sellingPrice,
      wholesaleCost,
      grossProfit,
      grossMarginPercentage: null,
      isNegativeMargin: grossProfit < 0,
      isValid: false,
    };
  }

  const rawMargin = (grossProfit / sellingPrice) * 100;
  // Round to 1 decimal place for display/stability
  const grossMarginPercentage = Math.round(rawMargin * 10) / 10;

  return {
    sellingPrice,
    wholesaleCost,
    grossProfit,
    grossMarginPercentage,
    isNegativeMargin: grossProfit < 0,
    isValid: true,
  };
}

/**
 * Round UP to the next 100 MMK.
 * If already a multiple of 100 MMK, keeps it unchanged.
 */
export function roundUpToNext100MMK(value: number): number {
  if (value <= 0 || isNaN(value)) return 0;
  return Math.ceil(value / 100) * 100;
}

/**
 * Calculates recommended retail selling price for a target gross margin.
 * Formula: wholesale purchase cost / (1 - target margin as a decimal)
 * Default target gross margin: 15% (0.15)
 * Rounded UP to the next 100 MMK.
 */
export function calculateRecommendedSellingPrice(
  wholesaleCost: number,
  targetMarginPercentage: number = 15,
  currentSellingPrice?: number
): RecommendedPriceResult {
  if (wholesaleCost <= 0 || isNaN(wholesaleCost) || targetMarginPercentage >= 100 || targetMarginPercentage < 0) {
    return {
      wholesaleCost,
      targetMarginPercentage,
      exactRecommendedPrice: 0,
      roundedRecommendedPrice: 0,
      priceDiffFromCurrent: null,
      isValid: false,
    };
  }

  const targetDecimal = targetMarginPercentage / 100;
  const exact = wholesaleCost / (1 - targetDecimal);
  const rounded = roundUpToNext100MMK(exact);

  const priceDiffFromCurrent = typeof currentSellingPrice === 'number' && currentSellingPrice > 0
    ? rounded - currentSellingPrice
    : null;

  return {
    wholesaleCost,
    targetMarginPercentage,
    exactRecommendedPrice: exact,
    roundedRecommendedPrice: rounded,
    priceDiffFromCurrent,
    isValid: true,
  };
}

/**
 * Calculates comprehensive price impact of a wholesale price change.
 * Implements the exact specification benchmark:
 * Old wholesale: 5,000 MMK, New wholesale: 5,800 MMK, Current retail: 5,600 MMK
 * Before: Profit = 600 MMK, Margin = 10.7%
 * After: Profit = -200 MMK, Margin = -3.6%
 * Target 15%: 5,800 / (1 - 0.15) = 6,823.53 -> Rounded to 6,900 MMK
 */
export function calculatePriceImpact(
  oldWholesaleCost: number,
  newWholesaleCost: number,
  currentSellingPrice: number,
  targetMarginPercentage: number = 15
): PriceImpactComparison {
  const costDiffMMK = newWholesaleCost - oldWholesaleCost;
  const costChangePercentage = oldWholesaleCost > 0
    ? Math.round(((newWholesaleCost - oldWholesaleCost) / oldWholesaleCost) * 1000) / 10
    : 0;

  const beforeCalc = calculateGrossMargin(currentSellingPrice, oldWholesaleCost);
  const afterCalc = calculateGrossMargin(currentSellingPrice, newWholesaleCost);

  const marginErosionPoints = (beforeCalc.grossMarginPercentage !== null && afterCalc.grossMarginPercentage !== null)
    ? Math.round((afterCalc.grossMarginPercentage - beforeCalc.grossMarginPercentage) * 10) / 10
    : null;

  const rec = calculateRecommendedSellingPrice(newWholesaleCost, targetMarginPercentage, currentSellingPrice);

  return {
    oldWholesaleCost,
    newWholesaleCost,
    costDiffMMK,
    costChangePercentage,
    currentSellingPrice,
    before: {
      grossProfit: beforeCalc.grossProfit,
      grossMarginPercentage: beforeCalc.grossMarginPercentage,
    },
    after: {
      grossProfit: afterCalc.grossProfit,
      grossMarginPercentage: afterCalc.grossMarginPercentage,
      marginErosionPoints,
    },
    recommendedNewSellingPrice: rec.roundedRecommendedPrice,
    targetMarginPercentage,
  };
}

/**
 * Format MMK currency with commas (e.g. 5,800 MMK)
 */
export function formatMMK(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 MMK';
  return `${amount.toLocaleString('en-US')} MMK`;
}
