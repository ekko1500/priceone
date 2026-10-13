import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('businessId');
    const role = searchParams.get('role');

    const data = dbStore.getData();

    return NextResponse.json({
      success: true,
      data: {
        users: Object.values(data.users),
        businesses: Object.values(data.businesses),
        connections: Object.values(data.connections),
        products: Object.values(data.products),
        priceHistory: Object.values(data.priceHistory),
        inventory: Object.values(data.inventory),
        orders: Object.values(data.orders),
        notifications: Object.values(data.notifications),
        auditLogs: Object.values(data.auditLogs),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}