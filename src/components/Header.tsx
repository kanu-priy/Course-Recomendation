"use client";

import React from "react";
import {
  GraduationCap,
  Sparkles,
  Share2,
  Bot,
  Columns3,
  ShieldCheck,
  Target,
  Rocket,
  Zap,
  Coins,
  ChevronDown,
} from "lucide-react";
import { CurrencyCode } from "@/lib/currencyConverter";

interface HeaderProps {
  totalMatches: number;
  safeCount: number;
  modCount: number;
  reachCount: number;
  compareCount: number;
  shortlistCount: number;
  onOpenCompareSection: () => void;
  onOpenExport: () => void;
  onToggleAiDrawer: () => void;
  isAiOpen: boolean;
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
}

const CURRENCIES: { code: CurrencyCode; label: string; flag: string }[] = [
  { code: "USD", label: "USD ($)", flag: "🇺🇸" },
  { code: "INR", label: "INR (₹ Lakhs)", flag: "🇮🇳" },
  { code: "EUR", label: "EUR (€)", flag: "🇪🇺" },
  { code: "GBP", label: "GBP (£)", flag: "🇬🇧" },
  { code: "CAD", label: "CAD (CA$)", flag: "🇨🇦" },
  { code: "AUD", label: "AUD (A$)", flag: "🇦🇺" },
];

export const Header: React.FC<HeaderProps> = ({
  totalMatches,
  safeCount,
  modCount,
  reachCount,
  compareCount,
  shortlistCount,
  onOpenCompareSection,
  onOpenExport,
  onToggleAiDrawer,
  isAiOpen,
  currency,
  onCurrencyChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl px-3 sm:px-6 lg:px-8 py-2.5 transition-all">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 max-w-7xl mx-auto">
        
        {/* Left Branding & Live Status */}
        <div className="flex items-center justify-between lg:justify-start gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-950"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  GradGuide <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Co-Pilot</span>
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Meet Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Study Abroad Decision Assistant & Live Meeting Co-Pilot
              </p>
            </div>
          </div>

          {/* Mobile Status Tag */}
          <div className="sm:hidden flex items-center gap-1.5">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live
            </span>
          </div>
        </div>

        {/* Center Live Metric Counters (Responsive horizontal scroll on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs overflow-x-auto scrollbar-none justify-start lg:justify-center">
          <div className="px-2.5 py-1 rounded-lg bg-slate-950/70 text-slate-300 font-medium border border-slate-800 flex items-center gap-1.5 whitespace-nowrap">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px]">Total: <strong className="text-white font-bold">{totalMatches}</strong></span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/25 flex items-center gap-1 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[11px]">Safe: <strong className="font-bold">{safeCount}</strong></span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/25 flex items-center gap-1 whitespace-nowrap">
            <Target className="w-3.5 h-3.5" />
            <span className="text-[11px]">Moderate: <strong className="font-bold">{modCount}</strong></span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/25 flex items-center gap-1 whitespace-nowrap">
            <Rocket className="w-3.5 h-3.5" />
            <span className="text-[11px]">Reach: <strong className="font-bold">{reachCount}</strong></span>
          </div>
        </div>

        {/* Right Actions & Multi-Currency Switcher */}
        <div className="flex items-center gap-2 justify-between lg:justify-end flex-wrap">
          {/* Multi-Currency Dropdown */}
          <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold shadow-inner">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="bg-transparent text-slate-100 focus:outline-none cursor-pointer text-xs font-bold appearance-none pr-4"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-slate-100">
                  {c.flag} {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
          </div>

          {/* Compare Button */}
          <button
            onClick={onOpenCompareSection}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              compareCount > 0
                ? "bg-indigo-600/20 border-indigo-500/60 text-indigo-300 hover:bg-indigo-600/30 shadow-sm shadow-indigo-500/20"
                : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Columns3 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Compare</span>
            {compareCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </button>

          {/* AI Drawer Toggle */}
          <button
            onClick={onToggleAiDrawer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isAiOpen
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/20"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/90 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            title="Export Call Summary"
          >
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
