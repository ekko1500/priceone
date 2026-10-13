import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { PriceHistoryRecord, InAppNotification, AuditLog } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      wholesalerId,
      newPrice,
      effectiveDate,
      sourceType,
      sourceMessage,
      userId,
    } = body;

    if (!productId || !wholesalerId || typeof newPrice !== 'number' || newPrice <= 0) {
      return NextResponse.json({ error: 'Invalid product or positive new price required' }, { status: 400 });
    }

    const product = dbStore.getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found in catalog' }, { status: 404 });
    }

    if (product.wholesalerId !== wholesalerId) {
      return NextResponse.json({ error: 'Unauthorized: Wholesaler does not own this product' }, { status: 403 });
    }

    const oldPrice = product.currentPrice;
    const changeMMK = newPrice - oldPrice;
    const changePercentage = oldPrice > 0 ? Math.round(((newPrice - oldPrice) / oldPrice) * 1000) / 10 : 0;
    const nowISO = new Date().toISOString();

    // 1. Update product
    product.currentPrice = newPrice;
    product.lastUpdated = nowISO;
    dbStore.saveProduct(product);

    // 2. Append immutable price history record
    const historyId = `ph-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const historyRecord: PriceHistoryRecord = {
      id: historyId,
      productId: product.id,
      productName: product.name,
      wholesalerId,
      oldPrice,
      newPrice,
      changeMMK,
      changePercentage,
      effectiveDate: effectiveDate || nowISO.split('T')[0],
      updatedBy: userId || 'wholesaler_admin',
      sourceType: sourceType || 'manual',
      sourceMessage,
      timestamp: nowISO,
      isDemo: product.isDemo,
    };
    dbStore.addPriceHistory(historyRecord);

    // 3. Find connected retailers and dispatch targeted notifications
    const connections = dbStore.getConnectionsForBusiness(wholesalerId);
    const activeRetailerConnections = connections.filter(
      (c) => c.wholesalerId === wholesalerId && c.status === 'active'
    );

    const wholesalerBiz = dbStore.getBusinessById(wholesalerId);
    const wholesalerName = wholesalerBiz?.name || 'Connected Wholesaler';

    const notificationsSent: InAppNotification[] = [];

    for (const conn of activeRetailerConnections) {
      const notifId = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      const sign = changeMMK >= 0 ? '+' : '';
      const notif: InAppNotification = {
        id: notifId,
        recipientId: conn.retailerId,
        title: `Wholesale Price Change: ${product.name}`,
        body: `${wholesalerName} updated price to ${newPrice.toLocaleString()} MMK (${sign}${changeMMK.toLocaleString()} MMK, ${sign}${changePercentage}%). Check retail margin impact.`,
        type: 'price_change',
        link: '/retailer/pricing',
        data: {
          productId: product.id,
          wholesalerId,
          oldPrice,
          newPrice,
          changeMMK,
          changePercentage,
        },
        read: false,
        createdAt: nowISO,
        isDemo: product.isDemo,
      };
      dbStore.saveNotification(notif);
      notificationsSent.push(notif);
    }

    // 4. Audit Log
    const auditId = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const auditEntry: AuditLog = {
      id: auditId,
      actorId: userId || wholesalerId,
      actorName: wholesalerName,
      actorRole: 'wholesaler',
      action: 'PUBLISH_WHOLESALE_PRICE',
      targetType: 'PRODUCT_PRICE',
      targetId: product.id,
      details: {
        productName: product.name,
        oldPrice,
        newPrice,
        changeMMK,
        changePercentage,
        retailersNotifiedCount: notificationsSent.length,
      },
      timestamp: nowISO,
      isDemo: product.isDemo,
    };
    dbStore.addAuditLog(auditEntry);

    return NextResponse.json({
      success: true,
      product,
      historyRecord,
      notifiedRetailersCount: notificationsSent.length,
    });
  } catch (error: any) {
    console.error('API publish price error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}