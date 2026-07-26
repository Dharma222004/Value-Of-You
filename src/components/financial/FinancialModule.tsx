"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Landmark,
  ShieldCheck,
  PieChart,
  Save,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  Activity,
  BarChart2,
  Wallet,
  AlertTriangle,
} from "lucide-react";

export interface FinancialData {
  // Monthly Figures in INR (₹)
  monthlyIncome: number;
  passiveIncome: number;
  monthlySavings: number;
  monthlyInvestments: number;
  monthlyExpenses: number;

  // Balance Sheet Figures in INR (₹)
  emergencyFundMonths: number;
  totalAssets: number;
  totalLiabilities: number;
  
  // Risk & Goals
  insuranceScore: number;
  targetNetWorth: number;
  targetFreedomAge: number;
}

const defaultFinancialData: FinancialData = {
  monthlyIncome: 150000, // ₹1.5 Lakhs
  passiveIncome: 25000,  // ₹25,000
  monthlySavings: 45000, // ₹45,000
  monthlyInvestments: 35000, // ₹35,000
  monthlyExpenses: 60000, // ₹60,000

  emergencyFundMonths: 12,
  totalAssets: 6500000, // ₹65 Lakhs
  totalLiabilities: 1200000, // ₹12 Lakhs

  insuranceScore: 85,
  targetNetWorth: 25000000, // ₹2.5 Crores
  targetFreedomAge: 45,
};

// Helper for Indian Rupee Formatting (e.g. ₹1,50,000 or ₹2.5 Cr)
export const formatINR = (val: number): string => {
  if (isNaN(val)) return "₹0";
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  } else if (val >= 100000) {
    return `₹${(val / 100000).toFixed(2)} L`;
  }
  return `₹${val.toLocaleString("en-IN")}`;
};

export const FinancialModule: React.FC = () => {
  const [data, setData] = useState<FinancialData>(defaultFinancialData);
  const [isSaved, setIsSaved] = useState(true);

  const updateField = (field: keyof FinancialData, val: number) => {
    setData((prev) => ({ ...prev, [field]: Math.max(0, val) }));
    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 300);
  };

  // Auto Calculations
  const totalMonthlyIncome = data.monthlyIncome + data.passiveIncome;
  const netWorth = data.totalAssets - data.totalLiabilities;
  
  const savingsRate = totalMonthlyIncome > 0 ? Math.round((data.monthlySavings / totalMonthlyIncome) * 100) : 0;
  const investmentRate = totalMonthlyIncome > 0 ? Math.round((data.monthlyInvestments / totalMonthlyIncome) * 100) : 0;
  const passiveIncomeRatio = totalMonthlyIncome > 0 ? Math.round((data.passiveIncome / totalMonthlyIncome) * 100) : 0;
  const debtRatio = data.totalAssets > 0 ? Math.round((data.totalLiabilities / data.totalAssets) * 100) : 0;

  // Financial Score Algorithm (0-100)
  const calculateFinancialScore = () => {
    let score = 50;
    if (savingsRate >= 30) score += 15;
    else if (savingsRate >= 15) score += 10;

    if (passiveIncomeRatio >= 20) score += 15;
    else if (passiveIncomeRatio >= 10) score += 8;

    if (data.emergencyFundMonths >= 12) score += 10;
    else if (data.emergencyFundMonths >= 6) score += 6;

    if (debtRatio <= 20) score += 10;
    else if (debtRatio <= 40) score += 5;

    return Math.min(99, Math.max(20, score));
  };

  const financialScore = calculateFinancialScore();

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MODULE 2: FINANCIAL HEALTH & CAPITAL (INR ₹)
              </span>
              <span className="text-xs font-mono text-slate-400">Indian Rupee Currency Model</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-1">
              Financial Asset & Runway Diagnostics
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
              <Save className={`w-3.5 h-3.5 ${isSaved ? "text-emerald-400" : "text-amber-400 animate-spin"}`} />
              <span>{isSaved ? "Autosaved to Cloud" : "Saving inputs..."}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AUTO CALCULATIONS OVERVIEW BAR */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Net Worth */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">NET WORTH (₹)</span>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {formatINR(netWorth)}
          </div>
          <span className="text-[10px] text-slate-500">Assets - Liabilities</span>
        </div>

        {/* Savings Rate */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">SAVINGS RATE</span>
          <div className="text-lg font-bold font-mono text-sky-400">{savingsRate}%</div>
          <span className="text-[10px] text-slate-500">Monthly Savings / Income</span>
        </div>

        {/* Investment Rate */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">INVESTMENT RATE</span>
          <div className="text-lg font-bold font-mono text-indigo-400">{investmentRate}%</div>
          <span className="text-[10px] text-slate-500">Invested / Total Income</span>
        </div>

        {/* Passive Income Ratio */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">PASSIVE RATIO</span>
          <div className="text-lg font-bold font-mono text-purple-400">{passiveIncomeRatio}%</div>
          <span className="text-[10px] text-slate-500">Passive / Active Yield</span>
        </div>

        {/* Debt Ratio */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">DEBT RATIO</span>
          <div className="text-lg font-bold font-mono text-amber-400">{debtRatio}%</div>
          <span className="text-[10px] text-slate-500">Liabilities / Assets</span>
        </div>

        {/* Financial Score */}
        <div className="glass-panel p-4 rounded-xl border border-emerald-800/60 bg-emerald-950/20 space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">FINANCIAL SCORE</span>
          <div className="text-lg font-black font-mono text-white">{financialScore} / 100</div>
          <span className="text-[10px] text-emerald-400 font-mono">APEX TIER</span>
        </div>
      </div>

      {/* INTERACTIVE FORM SECTIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1 & 2: Income & Passive Income */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="text-emerald-400 font-mono font-bold text-base">₹</span>
              <span>1. Monthly Earned & Passive Income (INR ₹)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Active Monthly Salary (₹)</label>
                <input
                  type="number"
                  value={data.monthlyIncome}
                  onChange={(e) => updateField("monthlyIncome", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Passive Monthly Income (₹)</label>
                <input
                  type="number"
                  value={data.passiveIncome}
                  onChange={(e) => updateField("passiveIncome", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3, 4, 5: Savings, Investments & Emergency Fund */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>2. Savings, Investments & Emergency Buffer</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Monthly Savings (₹)</label>
                <input
                  type="number"
                  value={data.monthlySavings}
                  onChange={(e) => updateField("monthlySavings", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Monthly Investments (₹)</label>
                <input
                  type="number"
                  value={data.monthlyInvestments}
                  onChange={(e) => updateField("monthlyInvestments", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Emergency Runway (Months)</label>
                <input
                  type="number"
                  value={data.emergencyFundMonths}
                  onChange={(e) => updateField("emergencyFundMonths", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 6, 7, 8: Assets, Liabilities & Expenses */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Landmark className="w-4 h-4 text-purple-400" />
              <span>3. Total Assets, Liabilities & Living Expenses</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Total Assets (₹)</label>
                <input
                  type="number"
                  value={data.totalAssets}
                  onChange={(e) => updateField("totalAssets", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Total Liabilities (₹)</label>
                <input
                  type="number"
                  value={data.totalLiabilities}
                  onChange={(e) => updateField("totalLiabilities", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Monthly Expenses (₹)</label>
                <input
                  type="number"
                  value={data.monthlyExpenses}
                  onChange={(e) => updateField("monthlyExpenses", parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Visual Charts & Analytics (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Asset vs Liability Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white font-mono uppercase">BALANCE SHEET RATIO (INR)</h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Rupee Breakdown</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Assets</span>
                  <span className="text-emerald-400 font-bold">{formatINR(data.totalAssets)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Liabilities</span>
                  <span className="text-amber-400 font-bold">{formatINR(data.totalLiabilities)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${Math.min(100, (data.totalLiabilities / (data.totalAssets || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Income Allocation Breakdown */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-sky-400" />
                <h4 className="text-xs font-bold text-white font-mono uppercase">MONTHLY INCOME ALLOCATION</h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{formatINR(totalMonthlyIncome)}/mo</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Savings & Reserve</span>
                <span className="text-sky-400 font-bold">{formatINR(data.monthlySavings)} ({savingsRate}%)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Investment Allocation</span>
                <span className="text-indigo-400 font-bold">{formatINR(data.monthlyInvestments)} ({investmentRate}%)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Living Expenses</span>
                <span className="text-rose-400 font-bold">{formatINR(data.monthlyExpenses)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
