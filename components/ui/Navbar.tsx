'use client';
import React from 'react';
import { Store, Boxes, ShieldCheck, RefreshCw } from 'lucide-react';
import { Language, TranslationDictionary } from '@/lib/i18n/translations';

interface NavbarProps {
  lang: Language;
  t: TranslationDictionary;
  setLang: (l: Language) => void;
  activeRole: 'wholesaler' | 'retailer' | 'admin';
  setActiveRole: (r: 'wholesaler' | 'retailer' | 'admin') => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  t,
  setLang,
  activeRole,
  setActiveRole,
  onResetDemo,
}) => {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-900 text-xl shadow">
            P
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight">{t.appName}</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-medium">
                Google AI Builder Cup 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">{t.tagline}</p>
          </div>
        </div>

        {/* Persona Switcher */}
        <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveRole('wholesaler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              activeRole === 'wholesaler'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Wholesaler (Aung)</span>
          </button>

          <button
            onClick={() => setActiveRole('retailer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              activeRole === 'retailer'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Retailer (Shwe)</span>
          </button>

          <button
            onClick={() => setActiveRole('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
              activeRole === 'admin'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Language & Demo Reset */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setLang(lang === 'en' ? 'my' : 'en')}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          >
            {lang === 'en' ? 'မြန်မာစာ' : 'English'}
          </button>

          <button
            onClick={onResetDemo}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 flex items-center space-x-1 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{t.resetDemoData}</span>
          </button>
        </div>
      </div>
    </header>
  );
};