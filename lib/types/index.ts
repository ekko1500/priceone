export type UserRole = 'retailer' | 'wholesaler' | 'admin';

export interface User {
  id: string;
  username: string;
  phoneNumber: string;
  role: UserRole;
  businessId: string;
  createdAt: string;
  isActive: boolean;
  isDemo?: boolean;
}

export interface Business {
  id: string;
  name: string;
  ownerId: string;
  role: UserRole;
  phoneNumber: string;
  address?: string;
  city?: string;
  createdAt: string;
  isDemo?: boolean;
}

export type ConnectionStatus = 'pending' | 'active' | 'rejected' | 'suspended';

export interface SupplierConnection {
  id: string;
  wholesalerId: string;
  wholesalerName: string;
  retailerId: string;
  retailerName: string;
  status: ConnectionStatus;
  requestedAt: string;
  respondedAt?: string;
  isDemo?: boolean;
}

export interface SupplierProduct {
  id: string;
  wholesalerId: string;
  name: string;
  brand?: string;
  category: string;
  packageSize?: string;
  unit: string;
  description?: string;
  isActive: boolean;
  currentPrice: number;
  lastUpdated: string;
  isDemo?: boolean;
}

export interface PriceHistoryRecord {
  id: string;
  productId: string;
  productName: string;
  wholesalerId: string;
  oldPrice: number;
  newPrice: number;
  changeMMK: number;
  changePercentage: number;
  effectiveDate: string;
  updatedBy: string;
  sourceType: 'manual' | 'gemini_extraction' | 'csv_import';
  sourceMessage?: string;
  timestamp: string;
  isDemo?: boolean;
}

export interface RetailerInventoryItem {
  id: string;
  retailerId: string;
  name: string;
  category: string;
  unit: string;
  packageSize?: string;
  currentStock: number;
  lowStockThreshold: number;
  expiryDate?: string;
  currentSellingPrice: number;
  lastSupplierCost: number;
  primaryWholesalerId?: string;
  primaryWholesalerName?: string;
  lastUpdated: string;
  isDemo?: boolean;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered' | 'receipt_confirmed' | 'rejected' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid';

export interface OrderItem {
  productId: string;
  productName: string;
  unit: string;
  quantity: number;
  agreedUnitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  retailerId: string;
  retailerName: string;
  wholesalerId: string;
  wholesalerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paidAmount?: number;
  notes?: string;
  placedAt: string;
  updatedAt: string;
  receiptConfirmedAt?: string;
  receiptConfirmedBy?: string;
  isDemo?: boolean;
}

export interface InAppNotification {
  id: string;
  recipientId: string;
  title: string;
  body: string;
  type: 'price_change' | 'connection_request' | 'connection_decision' | 'order_update' | 'low_stock' | 'expiry_alert';
  link?: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
  isDemo?: boolean;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: string;
  targetId: string;
  details?: Record<string, any>;
  timestamp: string;
  isDemo?: boolean;
}

export interface GeminiExtractedDraft {
  productName: string;
  brand?: string;
  packageSize?: string;
  unit: string;
  previousPrice?: number;
  newPrice: number;
  currency: 'MMK';
  effectiveDate?: string;
  confidence: number;
  matchedProductId?: string;
  missingFields: string[];
  notes?: string;
  rawMessage: string;
}