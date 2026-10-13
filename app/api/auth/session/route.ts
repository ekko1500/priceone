import { NextRequest, NextResponse } from 'next/server';
import { dbStore } from '@/lib/db/store';
import { User, Business } from '@/lib/types';

export async function GET(req: NextRequest) {
  // Query param or cookie simulation for demo user
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'user-retailer-1';

  const user = dbStore.getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const business = dbStore.getBusinessById(user.businessId);

  return NextResponse.json({
    user,
    business,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, username, password, phoneNumber, businessName, role } = body;

    if (action === 'demo_switch') {
      const targetUser = dbStore.getUserById(body.userId);
      if (!targetUser) return NextResponse.json({ error: 'Demo user not found' }, { status: 404 });
      const business = dbStore.getBusinessById(targetUser.businessId);
      return NextResponse.json({ success: true, user: targetUser, business });
    }

    if (action === 'login') {
      const existing = dbStore.getUserByUsername(username);
      if (!existing) {
        return NextResponse.json({ error: 'Invalid username or credentials' }, { status: 401 });
      }
      const business = dbStore.getBusinessById(existing.businessId);
      return NextResponse.json({ success: true, user: existing, business });
    }

    if (action === 'register') {
      if (!username || !phoneNumber || !businessName || !role) {
        return NextResponse.json({ error: 'All registration fields are required' }, { status: 400 });
      }

      if (role !== 'retailer' && role !== 'wholesaler') {
        return NextResponse.json({ error: 'Invalid role. Normal users cannot register as admin.' }, { status: 403 });
      }

      const existing = dbStore.getUserByUsername(username);
      if (existing) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }

      const nowISO = new Date().toISOString();
      const userId = `user-${Date.now()}`;
      const businessId = `biz-${Date.now()}`;

      const newBiz: Business = {
        id: businessId,
        name: businessName,
        ownerId: userId,
        role,
        phoneNumber,
        createdAt: nowISO,
        isDemo: false,
      };
      dbStore.saveBusiness(newBiz);

      const newUser: User = {
        id: userId,
        username,
        phoneNumber,
        role,
        businessId,
        createdAt: nowISO,
        isActive: true,
        isDemo: false,
      };
      dbStore.saveUser(newUser);

      return NextResponse.json({ success: true, user: newUser, business: newBiz });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Session API error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}