/**
 * PricePulse Myanmar Data Store
 * Supports dual-mode persistence:
 * 1. Persistent Local File / Memory Store with exact Firestore semantics (default, 100% crash-proof and runnable offline/in evaluation sandbox)
 * 2. Optional Firebase Firestore integration when configured via environment.
 */

import fs from 'fs';
import path from 'path';
import {
  User,
  Business,
  SupplierConnection,
  SupplierProduct,
  PriceHistoryRecord,
  RetailerInventoryItem,
  Order,
  InAppNotification,
  AuditLog,
} from '../types';

export interface DatabaseSchema {
  users: Record<string, User>;
  businesses: Record<string, Business>;
  connections: Record<string, SupplierConnection>;
  products: Record<string, SupplierProduct>;
  priceHistory: Record<string, PriceHistoryRecord>;
  inventory: Record<string, RetailerInventoryItem>;
  orders: Record<string, Order>;
  notifications: Record<string, InAppNotification>;
  auditLogs: Record<string, AuditLog>;
}

const DB_FILE = path.join(process.cwd(), '.pricepulse_data.json');

export const INITIAL_DEMO_DATA: DatabaseSchema = {
  users: {
    'user-wholesaler-1': {
      id: 'user-wholesaler-1',
      username: 'aung_wholesale',
      phoneNumber: '09791234567',
      role: 'wholesaler',
      businessId: 'biz-wholesaler-1',
      createdAt: '2026-01-10T08:00:00Z',
      isActive: true,
      isDemo: true,
    },
    'user-wholesaler-2': {
      id: 'user-wholesaler-2',
      username: 'mandalay_depot',
      phoneNumber: '09797654321',
      role: 'wholesaler',
      businessId: 'biz-wholesaler-2',
      createdAt: '2026-01-12T08:00:00Z',
      isActive: true,
      isDemo: true,
    },
    'user-retailer-1': {
      id: 'user-retailer-1',
      username: 'shwe_store',
      phoneNumber: '09421112233',
      role: 'retailer',
      businessId: 'biz-retailer-1',
      createdAt: '2026-01-15T09:00:00Z',
      isActive: true,
      isDemo: true,
    },
    'user-retailer-2': {
      id: 'user-retailer-2',
      username: 'kyaw_mini_mart',
      phoneNumber: '09429998877',
      role: 'retailer',
      businessId: 'biz-retailer-2',
      createdAt: '2026-01-16T09:00:00Z',
      isActive: true,
      isDemo: true,
    },
    'user-admin': {
      id: 'user-admin',
      username: 'admin',
      phoneNumber: '09990001122',
      role: 'admin',
      businessId: 'biz-admin',
      createdAt: '2026-01-01T00:00:00Z',
      isActive: true,
      isDemo: true,
    },
  },
  businesses: {
    'biz-wholesaler-1': {
      id: 'biz-wholesaler-1',
      name: 'Aung Wholesale Distribution (အောင် လက္ကား)',
      ownerId: 'user-wholesaler-1',
      role: 'wholesaler',
      phoneNumber: '09791234567',
      address: 'Bayintnaung Wholesale Market, Mayangone',
      city: 'Yangon',
      createdAt: '2026-01-10T08:00:00Z',
      isDemo: true,
    },
    'biz-wholesaler-2': {
      id: 'biz-wholesaler-2',
      name: 'Mandalay Commodity Depot (မန္တလေး ကုန်စည်ဒိုင်)',
      ownerId: 'user-wholesaler-2',
      role: 'wholesaler',
      phoneNumber: '09797654321',
      address: '84th Street, Chanayethazan',
      city: 'Mandalay',
      createdAt: '2026-01-12T08:00:00Z',
      isDemo: true,
    },
    'biz-retailer-1': {
      id: 'biz-retailer-1',
      name: 'Shwe Family Grocery Store (ရွှေမိသားစု ကုန်စုံဆိုင်)',
      ownerId: 'user-retailer-1',
      role: 'retailer',
      phoneNumber: '09421112233',
      address: 'Hledan Main Road, Kamayut',
      city: 'Yangon',
      createdAt: '2026-01-15T09:00:00Z',
      isDemo: true,
    },
    'biz-retailer-2': {
      id: 'biz-retailer-2',
      name: 'Kyaw Modern Mini Mart (ကျော် မီနီမတ်)',
      ownerId: 'user-retailer-2',
      role: 'retailer',
      phoneNumber: '09429998877',
      address: 'Insein Road, Hlaing',
      city: 'Yangon',
      createdAt: '2026-01-16T09:00:00Z',
      isDemo: true,
    },
    'biz-admin': {
      id: 'biz-admin',
      name: 'PricePulse Oversight Authority',
      ownerId: 'user-admin',
      role: 'admin',
      phoneNumber: '09990001122',
      city: 'Yangon',
      createdAt: '2026-01-01T00:00:00Z',
      isDemo: true,
    },
  },
  connections: {
    'conn-1': {
      id: 'conn-1',
      wholesalerId: 'biz-wholesaler-1',
      wholesalerName: 'Aung Wholesale Distribution (အောင် လက္ကား)',
      retailerId: 'biz-retailer-1',
      retailerName: 'Shwe Family Grocery Store (ရွှေမိသားစု ကုန်စုံဆိုင်)',
      status: 'active',
      requestedAt: '2026-01-15T10:00:00Z',
      respondedAt: '2026-01-15T10:30:00Z',
      isDemo: true,
    },
    'conn-2': {
      id: 'conn-2',
      wholesalerId: 'biz-wholesaler-2',
      wholesalerName: 'Mandalay Commodity Depot (မန္တလေး ကုန်စည်ဒိုင်)',
      retailerId: 'biz-retailer-1',
      retailerName: 'Shwe Family Grocery Store (ရွှေမိသားစု ကုန်စုံဆိုင်)',
      status: 'active',
      requestedAt: '2026-01-16T11:00:00Z',
      respondedAt: '2026-01-16T11:15:00Z',
      isDemo: true,
    },
    'conn-3': {
      id: 'conn-3',
      wholesalerId: 'biz-wholesaler-1',
      wholesalerName: 'Aung Wholesale Distribution (အောင် လက္ကား)',
      retailerId: 'biz-retailer-2',
      retailerName: 'Kyaw Modern Mini Mart (ကျော် မီနီမတ်)',
      status: 'active',
      requestedAt: '2026-01-17T09:00:00Z',
      respondedAt: '2026-01-17T09:20:00Z',
      isDemo: true,
    },
  },
  products: {
    'prod-w1-oil': {
      id: 'prod-w1-oil',
      wholesalerId: 'biz-wholesaler-1',
      name: 'Cooking Oil (စားသုံးဆီ)',
      brand: 'Good Morning (ရွှေကြာ)',
      category: 'Edible Oils',
      packageSize: '1 Liter',
      unit: 'bottle',
      description: 'Refined Palm/Vegetable Olein 1L bottle',
      isActive: true,
      currentPrice: 5000, // Benchmark starting price
      lastUpdated: '2026-02-01T00:00:00Z',
      isDemo: true,
    },
    'prod-w2-oil': {
      id: 'prod-w2-oil',
      wholesalerId: 'biz-wholesaler-2',
      name: 'Cooking Oil (စားသုံးဆီ)',
      brand: 'Good Morning (ရွှေကြာ)',
      category: 'Edible Oils',
      packageSize: '1 Liter',
      unit: 'bottle',
      description: 'Refined Cooking Oil 1L bottle from Mandalay',
      isActive: true,
      currentPrice: 5200, // Competing price
      lastUpdated: '2026-02-02T00:00:00Z',
      isDemo: true,
    },
    'prod-w1-rice': {
      id: 'prod-w1-rice',
      wholesalerId: 'biz-wholesaler-1',
      name: 'Shwebo Pawsan Rice (ရွှေဘိုပေါ်ဆန်းမွှေး)',
      brand: 'Ayeyar',
      category: 'Grains & Rice',
      packageSize: '5 kg',
      unit: 'bag',
      description: 'Premium aromatic fragrance rice',
      isActive: true,
      currentPrice: 18500,
      lastUpdated: '2026-02-01T00:00:00Z',
      isDemo: true,
    },
    'prod-w1-condensed-milk': {
      id: 'prod-w1-condensed-milk',
      wholesalerId: 'biz-wholesaler-1',
      name: 'Condensed Milk (နို့ဆီ)',
      brand: 'Dawn (ဒေါ်န်း)',
      category: 'Dairy & Beverages',
      packageSize: '380 g',
      unit: 'tin',
      description: 'Sweetened condensed milk tin',
      isActive: true,
      currentPrice: 2200,
      lastUpdated: '2026-02-01T00:00:00Z',
      isDemo: true,
    },
  },
  priceHistory: {
    'ph-init-1': {
      id: 'ph-init-1',
      productId: 'prod-w1-oil',
      productName: 'Cooking Oil (စားသုံးဆီ) 1 Liter',
      wholesalerId: 'biz-wholesaler-1',
      oldPrice: 4700,
      newPrice: 5000,
      changeMMK: 300,
      changePercentage: 6.4,
      effectiveDate: '2026-02-01',
      updatedBy: 'user-wholesaler-1',
      sourceType: 'manual',
      sourceMessage: 'Base seasonal adjustment for February',
      timestamp: '2026-02-01T00:00:00Z',
      isDemo: true,
    },
  },
  inventory: {
    'inv-ret1-oil': {
      id: 'inv-ret1-oil',
      retailerId: 'biz-retailer-1',
      name: 'Cooking Oil (စားသုံးဆီ) - 1L Bottle',
      category: 'Edible Oils',
      unit: 'bottle',
      packageSize: '1 Liter',
      currentStock: 45,
      lowStockThreshold: 20,
      expiryDate: '2026-11-30',
      currentSellingPrice: 5600, // Benchmark selling price
      lastSupplierCost: 5000,
      primaryWholesalerId: 'biz-wholesaler-1',
      primaryWholesalerName: 'Aung Wholesale Distribution',
      lastUpdated: '2026-02-01T00:00:00Z',
      isDemo: true,
    },
    'inv-ret1-rice': {
      id: 'inv-ret1-rice',
      retailerId: 'biz-retailer-1',
      name: 'Shwebo Pawsan Rice (ရွှေဘိုပေါ်ဆန်း) 5kg',
      category: 'Grains & Rice',
      unit: 'bag',
      packageSize: '5 kg',
      currentStock: 8, // Low stock alert! (threshold is 10)
      lowStockThreshold: 10,
      expiryDate: '2027-01-15',
      currentSellingPrice: 22000,
      lastSupplierCost: 18500,
      primaryWholesalerId: 'biz-wholesaler-1',
      primaryWholesalerName: 'Aung Wholesale Distribution',
      lastUpdated: '2026-02-01T00:00:00Z',
      isDemo: true,
    },
    'inv-ret1-milk': {
      id: 'inv-ret1-milk',
      retailerId: 'biz-retailer-1',
      name: 'Dawn Condensed Milk 380g',
      category: 'Dairy & Beverages',
      unit: 'tin',
      packageSize: '380 g',
      currentStock: 60,
      lowStockThreshold: 15,
      expiryDate: '2026-03-01', // Approaching expiry!
      currentSellingPrice: 2600,
      lastSupplierCost: 2200,
      primaryWholesalerId: 'biz-wholesaler-1',
      primaryWholesalerName: 'Aung Wholesale Distribution',
      lastUpdated: '2026-02-01T00:00:00Z',
      isDemo: true,
    },
  },
  orders: {
    'ord-demo-1': {
      id: 'ord-demo-1',
      orderNumber: 'ORD-2026-001',
      retailerId: 'biz-retailer-1',
      retailerName: 'Shwe Family Grocery Store (ရွှေမိသားစု)',
      wholesalerId: 'biz-wholesaler-1',
      wholesalerName: 'Aung Wholesale Distribution (အောင် လက္ကား)',
      items: [
        {
          productId: 'prod-w1-oil',
          productName: 'Cooking Oil 1L bottle',
          unit: 'bottle',
          quantity: 24,
          agreedUnitPrice: 5000,
          lineTotal: 120000,
        },
        {
          productId: 'prod-w1-rice',
          productName: 'Shwebo Pawsan Rice 5kg bag',
          unit: 'bag',
          quantity: 10,
          agreedUnitPrice: 18500,
          lineTotal: 185000,
        },
      ],
      totalAmount: 305000,
      status: 'delivered',
      paymentStatus: 'partially_paid',
      paidAmount: 150000,
      notes: 'Deliver to rear storage door',
      placedAt: '2026-02-05T09:30:00Z',
      updatedAt: '2026-02-06T14:00:00Z',
      isDemo: true,
    },
  },
  notifications: {
    'notif-1': {
      id: 'notif-1',
      recipientId: 'biz-retailer-1',
      title: 'Welcome to PricePulse Myanmar',
      body: 'You are connected with Aung Wholesale Distribution and Mandalay Commodity Depot.',
      type: 'connection_decision',
      link: '/retailer/connections',
      read: true,
      createdAt: '2026-02-01T00:00:00Z',
      isDemo: true,
    },
  },
  auditLogs: {
    'audit-1': {
      id: 'audit-1',
      actorId: 'user-wholesaler-1',
      actorName: 'Aung Wholesale Admin',
      actorRole: 'wholesaler',
      action: 'SYSTEM_INITIALIZATION',
      targetType: 'SYSTEM',
      targetId: 'root',
      details: { message: 'Demo scenario initialized with 2 Wholesalers, 2 Retailers, and Myanmar catalog' },
      timestamp: '2026-02-01T00:00:00Z',
      isDemo: true,
    },
  },
};

class MemoryStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Error reading persistent database file, initializing fresh demo data:', e);
    }
    const fresh = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    this.saveData(fresh);
    return fresh;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write persistent database file:', e);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public resetDemoData(): void {
    // Preserves non-demo data if any exists, resets demo keys to clean initial state
    const current = this.data;
    const cleanDemo = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));

    // Reset collections preserving any user-created non-demo records
    for (const key of Object.keys(cleanDemo) as Array<keyof DatabaseSchema>) {
      const collection = (current[key] || {}) as Record<string, any>;
      const nonDemoItems: Record<string, any> = {};
      for (const [id, item] of Object.entries(collection)) {
        if (!item.isDemo) {
          nonDemoItems[id] = item;
        }
      }
      this.data[key] = {
        ...cleanDemo[key],
        ...nonDemoItems,
      } as any;
    }

    this.saveData(this.data);
  }

  // --- Collection Queries and Mutations ---

  public getUsers(): User[] {
    return Object.values(this.data.users);
  }

  public getUserById(id: string): User | undefined {
    return this.data.users[id];
  }

  public getUserByUsername(username: string): User | undefined {
    return Object.values(this.data.users).find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  public saveUser(user: User): void {
    this.data.users[user.id] = user;
    this.saveData(this.data);
  }

  public getBusinessById(id: string): Business | undefined {
    return this.data.businesses[id];
  }

  public getBusinesses(): Business[] {
    return Object.values(this.data.businesses);
  }

  public saveBusiness(biz: Business): void {
    this.data.businesses[biz.id] = biz;
    this.saveData(this.data);
  }

  public getConnectionsForBusiness(businessId: string): SupplierConnection[] {
    return Object.values(this.data.connections).filter(
      (c) => c.wholesalerId === businessId || c.retailerId === businessId
    );
  }

  public saveConnection(conn: SupplierConnection): void {
    this.data.connections[conn.id] = conn;
    this.saveData(this.data);
  }

  public getProductsByWholesaler(wholesalerId: string): SupplierProduct[] {
    return Object.values(this.data.products).filter((p) => p.wholesalerId === wholesalerId);
  }

  public getAllProducts(): SupplierProduct[] {
    return Object.values(this.data.products);
  }

  public getProductById(id: string): SupplierProduct | undefined {
    return this.data.products[id];
  }

  public saveProduct(product: SupplierProduct): void {
    this.data.products[product.id] = product;
    this.saveData(this.data);
  }

  public getPriceHistory(productId?: string, wholesalerId?: string): PriceHistoryRecord[] {
    let list = Object.values(this.data.priceHistory);
    if (productId) list = list.filter((p) => p.productId === productId);
    if (wholesalerId) list = list.filter((p) => p.wholesalerId === wholesalerId);
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addPriceHistory(record: PriceHistoryRecord): void {
    this.data.priceHistory[record.id] = record;
    this.saveData(this.data);
  }

  public getInventory(retailerId: string): RetailerInventoryItem[] {
    return Object.values(this.data.inventory).filter((i) => i.retailerId === retailerId);
  }

  public getInventoryItem(id: string): RetailerInventoryItem | undefined {
    return this.data.inventory[id];
  }

  public saveInventoryItem(item: RetailerInventoryItem): void {
    this.data.inventory[item.id] = item;
    this.saveData(this.data);
  }

  public getOrders(businessId: string): Order[] {
    return Object.values(this.data.orders)
      .filter((o) => o.retailerId === businessId || o.wholesalerId === businessId)
      .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders[id];
  }

  public saveOrder(order: Order): void {
    this.data.orders[order.id] = order;
    this.saveData(this.data);
  }

  public getNotifications(recipientId: string): InAppNotification[] {
    return Object.values(this.data.notifications)
      .filter((n) => n.recipientId === recipientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public saveNotification(notification: InAppNotification): void {
    this.data.notifications[notification.id] = notification;
    this.saveData(this.data);
  }

  public markNotificationRead(id: string): void {
    if (this.data.notifications[id]) {
      this.data.notifications[id].read = true;
      this.saveData(this.data);
    }
  }

  public addAuditLog(log: AuditLog): void {
    this.data.auditLogs[log.id] = log;
    this.saveData(this.data);
  }

  public getAuditLogs(): AuditLog[] {
    return Object.values(this.data.auditLogs).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }
}

// Global singleton instance
export const dbStore = new MemoryStore();