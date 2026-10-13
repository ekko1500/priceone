import { describe, it, expect } from 'vitest';
import { parseMessageWithDeterministicFallback } from '../lib/gemini/extractor';
import { SupplierProduct } from '../lib/types';

const mockCatalog: SupplierProduct[] = [
  {
    id: 'prod-w1-oil',
    wholesalerId: 'biz-wholesaler-1',
    name: 'Cooking Oil (စားသုံးဆီ)',
    brand: 'Good Morning (ရွှေကြာ)',
    category: 'Edible Oils',
    packageSize: '1 Liter',
    unit: 'bottle',
    isActive: true,
    currentPrice: 5000,
    lastUpdated: '2026-02-01T00:00:00Z',
  },
  {
    id: 'prod-w1-rice',
    wholesalerId: 'biz-wholesaler-1',
    name: 'Shwebo Pawsan Rice (ရွှေဘိုပေါ်ဆန်းမွှေး)',
    brand: 'Ayeyar',
    category: 'Grains & Rice',
    packageSize: '5 kg',
    unit: 'bag',
    isActive: true,
    currentPrice: 18500,
    lastUpdated: '2026-02-01T00:00:00Z',
  },
];

describe('Gemini Resilient Supplier Message Extraction', () => {
  it('correctly extracts the Section 8 cooking oil specification message', () => {
    const message = 'Starting tomorrow, cooking oil will cost 5,800 MMK per bottle instead of 5,000 MMK.';
    const result = parseMessageWithDeterministicFallback(message, mockCatalog);

    expect(result.productName).toContain('Cooking Oil');
    expect(result.newPrice).toBe(5800);
    expect(result.previousPrice).toBe(5000);
    expect(result.unit).toBe('bottle');
    expect(result.currency).toBe('MMK');
    expect(result.matchedProductId).toBe('prod-w1-oil');
    expect(result.confidence).toBeGreaterThanOrEqual(0.9);
  });

  it('correctly extracts Burmese language rice message', () => {
    const message = 'ရွှေဘိုပေါ်ဆန်းဆန် တစ်အိတ်လျှင် ၂၀,၀၀၀ ကျပ် ဖြစ်ပါမည် (အရင် ၁၈,၅၀၀ ကျပ်အစား)';
    const result = parseMessageWithDeterministicFallback(message, mockCatalog);

    expect(result.productName).toContain('Rice');
    expect(result.unit).toBe('bag');
    expect(result.matchedProductId).toBe('prod-w1-rice');
  });
});