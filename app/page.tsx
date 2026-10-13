'use client';

import React, { useState, useEffect } from 'react';
import { translations, Language } from '@/lib/i18n/translations';
import { Navbar } from '@/components/ui/Navbar';
import { WholesalerView } from '@/components/ui/WholesalerView';
import { RetailerView } from '@/components/ui/RetailerView';
import { AdminView } from '@/components/ui/AdminView';
import {
  User,
  Business,
  SupplierProduct,
  PriceHistoryRecord,
  RetailerInventoryItem,
  Order,
  InAppNotification,
  AuditLog,
} from '@/lib/types';

export default function PricePulseApp() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];

  const [activeRole, setActiveRole] = useState<'wholesaler' | 'retailer' | 'admin'>('wholesaler');

  // Live state
  const [users, setUsers] = useState<User[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryRecord[]>([]);
  const [inventory, setInventory] = useState<RetailerInventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      const json = await res.json();
      if (json.success && json.data) {
        setUsers(json.data.users);
        setBusinesses(json.data.businesses);
        setProducts(json.data.products);
        setPriceHistory(json.data.priceHistory);
        setInventory(json.data.inventory);
        setOrders(json.data.orders);
        setNotifications(json.data.notifications);
        setAuditLogs(json.data.auditLogs);
      }
    } catch (err) {
      console.error('Failed to load state', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleResetDemo = async () => {
    if (!confirm('Reset all demo data to pristine competition state?')) return;
    try {
      const res = await fetch('/api/demo/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Demo data successfully restored to original benchmark!');
        await fetchState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar
        lang={lang}
        t={t}
        setLang={setLang}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        onResetDemo={handleResetDemo}
      />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-400 text-sm">
            Loading PricePulse Intelligence...
          </div>
        ) : (
          <>
            {activeRole === 'wholesaler' && (
              <WholesalerView
                t={t}
                products={products}
                priceHistory={priceHistory}
                orders={orders}
                onRefresh={fetchState}
              />
            )}

            {activeRole === 'retailer' && (
              <RetailerView
                t={t}
                businesses={businesses}
                products={products}
                inventory={inventory}
                orders={orders}
                notifications={notifications}
                onRefresh={fetchState}
              />
            )}

            {activeRole === 'admin' && (
              <AdminView auditLogs={auditLogs} />
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700">PricePulse Myanmar • Google AI Builder Cup 2026</p>
        <p className="mt-1">
          Wholesale–Retail Pricing Intelligence • Gemini 1.5/2.0 Flash Extraction • Exact Deterministic Margin Engine
        </p>
      </footer>
    </div>
  );
}