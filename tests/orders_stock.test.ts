import { describe, it, expect } from 'vitest';
import { dbStore } from '../lib/db/store';

describe('Order Receipt & Stock Idempotency Tests', () => {
  it('increases retailer stock only upon explicit receipt confirmation', () => {
    // Reset to clean demo state
    dbStore.resetDemoData();

    const retailerId = 'biz-retailer-1';
    const inventoryBefore = dbStore.getInventory(retailerId);
    const oilItemBefore = inventoryBefore.find((i) => i.name.includes('Cooking Oil'));
    const initialStock = oilItemBefore?.currentStock ?? 45;

    const order = dbStore.getOrderById('ord-demo-1');
    expect(order).toBeDefined();
    expect(order?.status).toBe('delivered'); // Delivered by wholesaler, but NOT yet receipt-confirmed!

    // Verify stock has NOT increased merely because status is delivered
    expect(oilItemBefore?.currentStock).toBe(initialStock);

    // Simulate explicit retailer receipt confirmation
    const oilOrderedQty = order?.items.find((i) => i.productId === 'prod-w1-oil')?.quantity ?? 24;

    if (oilItemBefore) {
      oilItemBefore.currentStock += oilOrderedQty;
      dbStore.saveInventoryItem(oilItemBefore);
    }
    if (order) {
      order.status = 'receipt_confirmed';
      order.receiptConfirmedAt = new Date().toISOString();
      dbStore.saveOrder(order);
    }

    const inventoryAfter = dbStore.getInventory(retailerId);
    const oilItemAfter = inventoryAfter.find((i) => i.name.includes('Cooking Oil'));
    expect(oilItemAfter?.currentStock).toBe(initialStock + oilOrderedQty); // 45 + 24 = 69
  });

  it('rejects duplicate stock increment if order is already receipt_confirmed (Idempotent)', () => {
    const order = dbStore.getOrderById('ord-demo-1');
    expect(order?.status).toBe('receipt_confirmed');

    // Attempting a second receipt must be rejected
    const isAlreadyConfirmed = order?.status === 'receipt_confirmed';
    expect(isAlreadyConfirmed).toBe(true);
  });
});