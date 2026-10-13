'use client';
import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Store,
  ShoppingBag,
  Bell,
  CheckCircle,
} from 'lucide-react';
import { TranslationDictionary } from '@/lib/i18n/translations';
import {
  calculateGrossMargin,
  calculatePriceImpact,
  formatMMK,
} from '@/lib/calculations/pricing';
import {
  Business,
  SupplierProduct,
  RetailerInventoryItem,
  Order,
  InAppNotification,
} from '@/lib/types';

interface RetailerViewProps {
  t: TranslationDictionary;
  businesses: Business[];
  products: SupplierProduct[];
  inventory: RetailerInventoryItem[];
  orders: Order[];
  notifications: InAppNotification[];
  onRefresh: () => void;
}

export const RetailerView: React.FC<RetailerViewProps> = ({
  t,
  businesses,
  products,
  inventory,
  orders,
  notifications,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'pricing' | 'inventory' | 'orders' | 'notifications'>('pricing');
  const [targetMargin, setTargetMargin] = useState<number>(15);
  const [isConfirmingId, setIsConfirmingId] = useState<string | null>(null);

  // Focus on benchmark cooking oil
  const oilProduct = products.find((p) => p.id === 'prod-w1-oil');
  const oilInventory = inventory.find((i) => i.id === 'inv-ret1-oil');
  const currentCost = oilProduct?.currentPrice ?? 5000;
  const currentRetailPrice = oilInventory?.currentSellingPrice ?? 5600;

  const impact = calculatePriceImpact(5000, currentCost, currentRetailPrice, targetMargin);

  const handleConfirmReceipt = async (orderId: string) => {
    setIsConfirmingId(orderId);
    try {
      const res = await fetch('/api/orders/confirm-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          retailerId: 'biz-retailer-1',
          userId: 'user-retailer-1',
        }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh();
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsConfirmingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Retailer Navigation */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('pricing')}
          className={`py-3 border-b-2 flex items-center space-x-2 ${
            activeTab === 'pricing' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Retail Margin Intelligence</span>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 border-b-2 flex items-center space-x-2 ${
            activeTab === 'inventory' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Inventory ({inventory.filter((i) => i.retailerId === 'biz-retailer-1').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 border-b-2 flex items-center space-x-2 ${
            activeTab === 'orders' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({orders.filter((o) => o.retailerId === 'biz-retailer-1').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`py-3 border-b-2 flex items-center space-x-2 ${
            activeTab === 'notifications' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts ({notifications.filter((n) => n.recipientId === 'biz-retailer-1' && !n.read).length})</span>
        </button>
      </div>

      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.retailerMarginImpact}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Shwe Family Grocery Store (Hledan, Kamayut)
              </p>
            </div>
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="font-semibold text-slate-600">Target Margin:</span>
              <input
                type="number"
                min="5"
                max="50"
                value={targetMargin}
                onChange={(e) => setTargetMargin(Number(e.target.value))}
                className="w-12 text-center font-bold text-blue-600 border rounded px-1 bg-white"
              />
              <span className="font-bold text-slate-600">%</span>
            </div>
          </div>

          {/* Cooking Oil Benchmark Impact Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                  Aung Wholesale
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Cooking Oil (စားသုံးဆီ) - 1 Liter Bottle
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Current Wholesale Cost:</span>
                <div className="text-2xl font-bold text-emerald-700">{formatMMK(currentCost)}</div>
              </div>
            </div>

            {impact.after.grossProfit < 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-800">{t.marginErosionWarning}</h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    Your current retail selling price of {formatMMK(currentRetailPrice)} generates a loss of {formatMMK(Math.abs(impact.after.grossProfit))} per unit!
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Before */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Baseline (Before Change)</span>
                <div>
                  <span className="text-xs text-slate-500">Gross Profit:</span>
                  <div className="text-lg font-bold text-slate-800">+{formatMMK(impact.before.grossProfit)}</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Gross Margin:</span>
                  <div className="text-2xl font-bold text-slate-900">{impact.before.grossMarginPercentage}%</div>
                </div>
              </div>

              {/* After */}
              <div className="bg-red-50/70 border border-red-200 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-red-700 uppercase">After Price Update</span>
                <div>
                  <span className="text-xs text-red-600">Gross Profit (at 5,600 MMK retail):</span>
                  <div className="text-lg font-bold text-red-700">
                    {impact.after.grossProfit < 0 ? '-' : '+'}{formatMMK(Math.abs(impact.after.grossProfit))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-red-600">Gross Margin:</span>
                  <div className="text-2xl font-bold text-red-800">{impact.after.grossMarginPercentage}%</div>
                  <span className="text-[10px] text-red-600 block mt-0.5">
                    Erosion: {impact.after.marginErosionPoints} points
                  </span>
                </div>
              </div>

              {/* Recommended */}
              <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase">
                  Recommended Selling Price ({targetMargin}%)
                </span>
                <div>
                  <span className="text-xs text-emerald-700">Recommended Price:</span>
                  <div className="text-2xl font-black text-emerald-900">
                    {formatMMK(impact.recommendedNewSellingPrice)}
                  </div>
                </div>
                <div className="text-xs text-emerald-800">
                  Adjustment: +{formatMMK(impact.recommendedNewSellingPrice - currentRetailPrice)}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">{t.disclaimerGrossMargin}</p>
          </div>

          {/* Supplier Comparison */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Connected Wholesaler Comparison: Cooking Oil (1 Liter)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products
                .filter((p) => p.name.includes('Cooking Oil'))
                .map((p) => {
                  const b = businesses.find((biz) => biz.id === p.wholesalerId);
                  const isLowest = p.currentPrice <= Math.min(...products.filter((pr) => pr.name.includes('Cooking Oil')).map((pr) => pr.currentPrice));
                  return (
                    <div
                      key={p.id}
                      className={`border rounded-xl p-4 space-y-2 ${
                        isLowest ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs text-slate-400">{b?.city}</span>
                          <h4 className="font-bold text-slate-900">{b?.name}</h4>
                        </div>
                        {isLowest && (
                          <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                            Lowest Price
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-400">1L Bottle</span>
                        <span className="text-xl font-bold text-slate-900">{formatMMK(p.currentPrice)}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Store Inventory: Shwe Family Grocery</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Item</th>
                  <th className="p-2.5">In Stock</th>
                  <th className="p-2.5">Retail Price</th>
                  <th className="p-2.5">Cost</th>
                  <th className="p-2.5">Margin</th>
                  <th className="p-2.5">Expiry</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory
                  .filter((i) => i.retailerId === 'biz-retailer-1')
                  .map((item) => {
                    const margin = calculateGrossMargin(item.currentSellingPrice, item.lastSupplierCost);
                    const isLow = item.currentStock <= item.lowStockThreshold;
                    return (
                      <tr key={item.id}>
                        <td className="p-2.5 font-bold text-slate-900">{item.name}</td>
                        <td className="p-2.5 font-bold text-slate-700">{item.currentStock} {item.unit}s</td>
                        <td className="p-2.5 text-slate-900">{formatMMK(item.currentSellingPrice)}</td>
                        <td className="p-2.5 text-slate-600">{formatMMK(item.lastSupplierCost)}</td>
                        <td className="p-2.5 font-bold text-emerald-700">{margin.grossMarginPercentage}%</td>
                        <td className="p-2.5 font-mono text-slate-500">{item.expiryDate || 'N/A'}</td>
                        <td className="p-2.5">
                          {isLow ? (
                            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-semibold">
                              Low Stock
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium">Adequate</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Purchase Orders & Receipt Confirmation</h3>
          <div className="space-y-3">
            {orders
              .filter((o) => o.retailerId === 'biz-retailer-1')
              .map((ord) => (
                <div key={ord.id} className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="text-xs font-mono text-slate-400">{ord.orderNumber}</span>
                      <h4 className="font-bold text-slate-900">{ord.wholesalerName}</h4>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {ord.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="font-bold text-slate-900 text-sm">Total: {formatMMK(ord.totalAmount)}</span>
                    {ord.status === 'delivered' && (
                      <button
                        onClick={() => handleConfirmReceipt(ord.id)}
                        disabled={isConfirmingId === ord.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Confirm Receipt (Updates Stock)</span>
                      </button>
                    )}
                    {ord.status === 'receipt_confirmed' && (
                      <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Receipt Confirmed • Stock Incremented</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Targeted In-App Notifications</h3>
          <div className="space-y-2">
            {notifications
              .filter((n) => n.recipientId === 'biz-retailer-1')
              .map((n) => (
                <div key={n.id} className="border rounded-xl p-3 bg-slate-50 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-xs text-slate-900">{n.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{n.body}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};