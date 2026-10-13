import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { AuditLog, RetailerInventoryItem } from '@/lib/types';

/**
 * Atomic Retailer Order Receipt Confirmation Handler
 * CRITICAL STOCK RULE:
 * 1. Stock increases ONLY when retailer explicitly confirms goods received.
 * 2. Idempotent: If order is already 'receipt_confirmed', return error/noop and never double count.
 * 3. Atomic inventory upsert for the retailer.
 * 4. Logs full audit record.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, retailerId, userId } = body;

    if (!orderId || !retailerId) {
      return NextResponse.json({ error: 'Order ID and retailer ID are required' }, { status: 400 });
    }

    const order = dbStore.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.retailerId !== retailerId) {
      return NextResponse.json({ error: 'Unauthorized: Only the purchasing retailer can confirm receipt' }, { status: 403 });
    }

    // Idempotency check: Cannot confirm receipt twice
    if (order.status === 'receipt_confirmed') {
      return NextResponse.json(
        { error: 'Order receipt already confirmed. Duplicate stock increment blocked.', order },
        { status: 409 }
      );
    }

    // Cannot confirm rejected or cancelled orders
    if (order.status === 'rejected' || order.status === 'cancelled') {
      return NextResponse.json(
        { error: `Cannot receive order with status '${order.status}'` },
        { status: 400 }
      );
    }

    const nowISO = new Date().toISOString();

    // 1. Update Inventory for each order item atomically
    const inventoryUpdates: RetailerInventoryItem[] = [];
    const retailerInventory = dbStore.getInventory(retailerId);

    for (const item of order.items) {
      // Find matching inventory item by name/product
      let invItem = retailerInventory.find(
        (i) => i.name.toLowerCase().includes(item.productName.toLowerCase()) ||
               item.productName.toLowerCase().includes(i.name.toLowerCase())
      );

      if (invItem) {
        invItem.currentStock += item.quantity;
        invItem.lastSupplierCost = item.agreedUnitPrice;
        invItem.primaryWholesalerId = order.wholesalerId;
        invItem.primaryWholesalerName = order.wholesalerName;
        invItem.lastUpdated = nowISO;
        dbStore.saveInventoryItem(invItem);
        inventoryUpdates.push(invItem);
      } else {
        // Create new inventory item
        const newInvId = `inv-${retailerId}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
        const newItem: RetailerInventoryItem = {
          id: newInvId,
          retailerId,
          name: item.productName,
          category: 'General',
          unit: item.unit,
          currentStock: item.quantity,
          lowStockThreshold: 10,
          currentSellingPrice: Math.ceil((item.agreedUnitPrice * 1.15) / 100) * 100, // default 15% margin
          lastSupplierCost: item.agreedUnitPrice,
          primaryWholesalerId: order.wholesalerId,
          primaryWholesalerName: order.wholesalerName,
          lastUpdated: nowISO,
          isDemo: order.isDemo,
        };
        dbStore.saveInventoryItem(newItem);
        inventoryUpdates.push(newItem);
      }
    }

    // 2. Transition order status
    order.status = 'receipt_confirmed';
    order.receiptConfirmedAt = nowISO;
    order.receiptConfirmedBy = userId || retailerId;
    order.updatedAt = nowISO;
    dbStore.saveOrder(order);

    // 3. Audit log
    const auditId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const auditLog: AuditLog = {
      id: auditId,
      actorId: userId || retailerId,
      actorName: order.retailerName,
      actorRole: 'retailer',
      action: 'ORDER_RECEIPT_CONFIRMED',
      targetType: 'ORDER',
      targetId: order.id,
      details: {
        orderNumber: order.orderNumber,
        itemsReceived: order.items.map((i) => ({ name: i.productName, qty: i.quantity, unitPrice: i.agreedUnitPrice })),
        stockIncremented: true,
      },
      timestamp: nowISO,
      isDemo: order.isDemo,
    };
    dbStore.addAuditLog(auditLog);

    return NextResponse.json({
      success: true,
      order,
      inventoryUpdates,
    });
  } catch (error: any) {
    console.error('API confirm receipt error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}