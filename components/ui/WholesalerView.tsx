'use client';
import React, { useState } from 'react';
import { Sparkles, FileText, CheckCircle, TrendingUp, Clock, Boxes, ShoppingBag, ShieldCheck } from 'lucide-react';
import { TranslationDictionary } from '@/lib/i18n/translations';
import { formatMMK } from '@/lib/calculations/pricing';
import { SupplierProduct, PriceHistoryRecord, Order, GeminiExtractedDraft } from '@/lib/types';

interface WholesalerViewProps {
  t: TranslationDictionary;
  products: SupplierProduct[];
  priceHistory: PriceHistoryRecord[];
  orders: Order[];
  onRefresh: () => void;
}

export const WholesalerView: React.FC<WholesalerViewProps> = ({
  t,
  products,
  priceHistory,
  orders,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'pricing' | 'catalog' | 'orders'>('pricing');
  const [pastedMessage, setPastedMessage] = useState<string>(
    'Starting tomorrow, cooking oil will cost 5,800 MMK per bottle instead of 5,000 MMK.'
  );
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractedDraft, setExtractedDraft] = useState<GeminiExtractedDraft | null>(null);
  const [manualNewPrice, setManualNewPrice] = useState<number>(5800);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  const handleExtractWithGemini = async () => {
    setIsExtracting(true);
    setPublishSuccessMsg(null);
    try {
      const res = await fetch('/api/gemini/extract-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: pastedMessage, wholesalerId: 'biz-wholesaler-1' }),
      });
      const data = await res.json();
      if (data.success && data.draft) {
        setExtractedDraft(data.draft);
        setManualNewPrice(data.draft.newPrice);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePublishPrice = async () => {
    if (!extractedDraft) return;
    setIsPublishing(true);
    try {
      const res = await fetch('/api/prices/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: extractedDraft.matchedProductId || 'prod-w1-oil',
          wholesalerId: 'biz-wholesaler-1',
          newPrice: manualNewPrice,
          effectiveDate: extractedDraft.effectiveDate,
          sourceType: 'gemini_extraction',
          sourceMessage: pastedMessage,
          userId: 'user-wholesaler-1',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPublishSuccessMsg(
          `Successfully published new wholesale price: ${manualNewPrice.toLocaleString()} MMK! Connected retailers have been notified.`
        );
        setExtractedDraft(null);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('pricing')}
          className={`py-3 border-b-2 flex items-center space-x-2 ${
            activeTab === 'pricing' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Gemini Price Publishing</span>
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3 border-b-2 flex items-center space-x-2 ${
            activeTab === 'catalog' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Catalog ({products.filter((p) => p.wholesalerId === 'biz-wholesaler-1').length})</span>
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 border-b-2 flex items-center space-x-2 ${
            activeTab === 'orders' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Incoming Orders ({orders.filter((o) => o.wholesalerId === 'biz-wholesaler-1').length})</span>
        </button>
      </div>

      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t.updateWholesalePrice}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Aung Wholesale Distribution (Bayintnaung Market, Yangon)
              </p>
            </div>
            <div className="flex items-center space-x-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Human-in-the-Loop Confirmation Required</span>
            </div>
          </div>

          {publishSuccessMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold">{publishSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>{t.pasteSupplierMessage}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Step A: Input</span>
              </div>

              <textarea
                rows={4}
                value={pastedMessage}
                onChange={(e) => setPastedMessage(e.target.value)}
                className="w-full text-sm p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPastedMessage('Starting tomorrow, cooking oil will cost 5,800 MMK per bottle instead of 5,000 MMK.')}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded border border-slate-300"
                >
                  Section 8 Cooking Oil Benchmark
                </button>
                <button
                  onClick={() => setPastedMessage('မနက်ဖြန်မှစပြီး စားသုံးဆီ တစ်ပုလင်း ၅,၈၀၀ ကျပ် ဖြစ်ပါမည် (အရင် ၅,၀၀၀ ကျပ်အစား)')}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded border border-slate-300"
                >
                  Burmese Language Message
                </button>
              </div>

              <button
                onClick={handleExtractWithGemini}
                disabled={isExtracting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow flex items-center justify-center space-x-2 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isExtracting ? t.extracting : t.extractWithGemini}</span>
              </button>
            </div>

            {/* Extracted Review Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{t.extractedDetails}</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Step D: Review</span>
              </div>

              {!extractedDraft ? (
                <div className="h-48 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs">
                  <span>Extract a supplier message on the left to review the draft.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-600">Product:</span>
                      <span className="font-bold text-slate-900">{extractedDraft.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-600">Unit:</span>
                      <span>{extractedDraft.packageSize} / {extractedDraft.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-600">Previous Price:</span>
                      <span className="font-semibold">{formatMMK(extractedDraft.previousPrice ?? 5000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-600">New Proposed Wholesale Price:</span>
                      <input
                        type="number"
                        step="100"
                        value={manualNewPrice}
                        onChange={(e) => setManualNewPrice(Number(e.target.value))}
                        className="w-24 text-right font-bold text-emerald-800 border rounded px-1.5 py-0.5 bg-white"
                      />
                    </div>
                    <div className="flex justify-between pt-1 border-t border-emerald-200">
                      <span className="font-bold text-slate-600">Difference:</span>
                      <span className="font-bold text-red-600">
                        +{formatMMK(manualNewPrice - (extractedDraft.previousPrice ?? 5000))}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePublishPrice}
                    disabled={isPublishing}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow flex items-center justify-center space-x-2 transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isPublishing ? t.publishing : t.confirmAndPublish}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Published Price Timeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Published Price History (Aung Wholesale)</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Product</th>
                    <th className="p-2.5">Old Price</th>
                    <th className="p-2.5">New Price</th>
                    <th className="p-2.5">Difference</th>
                    <th className="p-2.5">Effective</th>
                    <th className="p-2.5">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priceHistory
                    .filter((ph) => ph.wholesalerId === 'biz-wholesaler-1')
                    .map((ph) => (
                      <tr key={ph.id}>
                        <td className="p-2.5 font-bold text-slate-900">{ph.productName}</td>
                        <td className="p-2.5 text-slate-600">{formatMMK(ph.oldPrice)}</td>
                        <td className="p-2.5 font-bold text-emerald-700">{formatMMK(ph.newPrice)}</td>
                        <td className="p-2.5 font-bold text-red-600">+{formatMMK(ph.changeMMK)}</td>
                        <td className="p-2.5 font-mono text-slate-500">{ph.effectiveDate}</td>
                        <td className="p-2.5 font-mono text-slate-400">{ph.sourceType}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Aung Wholesale Product Catalog</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products
              .filter((p) => p.wholesalerId === 'biz-wholesaler-1')
              .map((p) => (
                <div key={p.id} className="border border-slate-200 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 uppercase font-bold">
                    {p.category}
                  </span>
                  <h4 className="font-bold text-slate-900">{p.name}</h4>
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-400">{p.packageSize}</span>
                    <span className="text-base font-bold text-emerald-700">{formatMMK(p.currentPrice)}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Incoming Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Order #</th>
                  <th className="p-2.5">Retailer</th>
                  <th className="p-2.5">Total</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders
                  .filter((o) => o.wholesalerId === 'biz-wholesaler-1')
                  .map((ord) => (
                    <tr key={ord.id}>
                      <td className="p-2.5 font-bold font-mono text-slate-900">{ord.orderNumber}</td>
                      <td className="p-2.5 text-slate-700">{ord.retailerName}</td>
                      <td className="p-2.5 font-bold text-slate-900">{formatMMK(ord.totalAmount)}</td>
                      <td className="p-2.5 font-semibold text-emerald-700">{ord.status}</td>
                      <td className="p-2.5 text-slate-500">{ord.paymentStatus}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};