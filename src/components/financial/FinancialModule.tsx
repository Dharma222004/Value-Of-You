"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { saveModuleData, loadModuleData, getCurrentUserId, saveFinancialProfile, saveLearningProgress } from "@/services/moduleDataService";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Landmark,
  ShieldCheck,
  PieChart,
  Save,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  BarChart2,
  Wallet,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  BookOpen,
  Target,
  ShieldAlert,
  Compass,
  Download,
  Info,
} from "lucide-react";
import {
  FinancialModuleState,
  EmploymentTypeOption,
  RiskLevelOption,
  OwnershipTypeOption,
  LikertScale,
} from "@/types/financial";
import {
  defaultFinancialModuleState,
  calculateFinancialHealthMetrics,
  formatINR,
} from "@/lib/financialEngine";

const SECTIONS = [
  { id: 1, name: "Income Profile", icon: DollarSign },
  { id: 2, name: "Savings & Cash", icon: Wallet },
  { id: 3, name: "Investments", icon: TrendingUp },
  { id: 4, name: "Assets", icon: Landmark },
  { id: 5, name: "Liabilities & Debt", icon: AlertTriangle },
  { id: 6, name: "Monthly Expenses", icon: PieChart },
  { id: 7, name: "Insurance Protection", icon: ShieldCheck },
  { id: 8, name: "Financial Behaviour", icon: Activity },
  { id: 9, name: "Financial Goals", icon: Target },
  { id: 10, name: "Risk Profile", icon: Compass },
  { id: 11, name: "Financial Literacy", icon: BookOpen },
  { id: 12, name: "AI Wealth Summary", icon: Sparkles },
];

export const FinancialModule: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<FinancialModuleState>(defaultFinancialModuleState);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [savingStatus, setSavingStatus] = useState<"saved" | "saving">("saved");

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    async function loadFromSupabase() {
      try {
        const uid = await getCurrentUserId();
        setUserId(uid);
        if (!uid) return;
        const parsed = await loadModuleData(uid, "financial") as FinancialModuleState | null;
        if (parsed && parsed.incomeProfile) {
          const isComp = Boolean(parsed.isCompleted || parsed.submittedAt || parsed.incomeProfile.monthlyActiveIncome > 0);
          setState({ ...parsed, isCompleted: isComp });
          if (isComp) {
            setIsSubmitted(true);
            setActiveStep(12);
          }
        }
      } finally {
        setIsLoaded(true);
      }
    }
    loadFromSupabase();
  }, []);
  // Real-Time Engine Calculation
  const metrics = useMemo(() => calculateFinancialHealthMetrics(state), [state]);

  // Debounced Autosave to Supabase (ONLY after initial load finishes)
  useEffect(() => {
    if (!mounted || !userId || !isLoaded) return;
    setSavingStatus("saving");
    const timeout = setTimeout(async () => {
      const isComp = Boolean(state.isCompleted || state.submittedAt || isSubmitted);
      const finScore = metrics?.financialHealthScore || 0;
      const result = await saveModuleData(userId, "financial", { ...state, isCompleted: isComp } as any, isComp, finScore);
      if (!result) {
        console.warn("[FinancialModule] ⚠️ Save to Supabase FAILED — data was NOT persisted. Check [DB_DEBUG] logs above.");
      }
      setSavingStatus("saved");
    }, 800);
    return () => clearTimeout(timeout);
  }, [state, mounted, userId, isLoaded, isSubmitted, metrics]);

  const [validationError, setValidationError] = useState<string | null>(null);

  const validateCurrentStep = (step: number): boolean => {
    setValidationError(null);
    if (step === 1) {
      if (state.incomeProfile.monthlyActiveIncome === undefined || state.incomeProfile.monthlyActiveIncome === null) {
        setValidationError("Active Primary Income is required (Enter 0 or 'N/A' if not applicable).");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep(activeStep)) return;
    if (activeStep < 12) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setValidationError(null);
    if (activeStep > 1) setActiveStep((prev) => prev - 1);
  };

  const handleSubmitFinancial = async () => {
    if (!validateCurrentStep(activeStep)) return;
    const updatedState = {
      ...state,
      isCompleted: true,
      submittedAt: new Date().toISOString(),
    };
    setState(updatedState);
    if (userId) {
      const finScore = metrics?.financialHealthScore || 0;
      await saveModuleData(userId, "financial", updatedState as any, true, finScore);
      // Also save structured financial profile
      await saveFinancialProfile(userId, {
        income: metrics?.totalMonthlyIncome || 0,
        expenses: updatedState.expenseProfile?.monthlyEssentialExpenses || 0,
        savings: metrics?.totalSavingsBalance || 0,
        investments: metrics?.totalInvestments || 0,
        liabilities: metrics?.totalLiabilities || 0,
        net_worth: metrics?.netWorth || 0,
        savings_rate: metrics?.savingsRate || 0,
        debt_to_income_ratio: metrics?.debtToIncomeRatio || 0,
        emergency_fund_months: metrics?.emergencyFundMonths || 0,
        has_health_insurance: Boolean(updatedState.riskInsurance?.hasHealthInsurance),
        has_life_insurance: Boolean(updatedState.riskInsurance?.hasLifeInsurance),
        financial_score: finScore,
      });
      await saveLearningProgress(userId, "financial", 100);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hc_assessment_updated"));
    }
    setIsSubmitted(true);
    setActiveStep(12);
  };

  if (!mounted) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] max-w-7xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-xl w-1/3"></div>
        <div className="h-4 bg-slate-900 rounded-xl w-1/2"></div>
      </div>
    );
  }

  // Helper for numeric input changes
  const updateIncomeField = (field: keyof typeof state.incomeProfile, val: any) => {
    setState((prev) => ({
      ...prev,
      incomeProfile: { ...prev.incomeProfile, [field]: val },
    }));
  };

  const updateSavingsField = (field: keyof typeof state.savingsPosition, val: number) => {
    setState((prev) => ({
      ...prev,
      savingsPosition: { ...prev.savingsPosition, [field]: Math.max(0, val) },
    }));
  };

  const updateExpenseField = (field: keyof typeof state.expenses, val: number) => {
    setState((prev) => ({
      ...prev,
      expenses: { ...prev.expenses, [field]: Math.max(0, val) },
    }));
  };

  const updateBehaviourField = (field: keyof typeof state.behaviour, val: LikertScale) => {
    setState((prev) => ({
      ...prev,
      behaviour: { ...prev.behaviour, [field]: val },
    }));
  };

  const updateLiteracyField = (field: keyof typeof state.literacy, val: number) => {
    setState((prev) => ({
      ...prev,
      literacy: { ...prev.literacy, [field]: val },
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* SUBMITTED COMPLETION STATUS BANNER */}
      {isSubmitted && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] uppercase">
                  ✓ Financial Health Completed & Saved Locally
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Score: {metrics.financialHealthScore} / 100
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[var(--foreground)] mt-0.5">
                Financial Runway & Net Worth Parameters Stored
              </h3>
              <p className="text-xs text-[var(--subtext)]">
                Net Worth: <strong className="text-emerald-400 font-mono">{formatINR(metrics.netWorth)}</strong> • Savings Rate: <strong className="text-sky-400 font-mono">{metrics.savingsRate}%</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono font-bold hover:bg-slate-800 transition-all"
            >
              Edit Financial Inputs
            </button>
            <Link
              href="/dashboard/skills"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 hover:from-emerald-500 hover:to-sky-400 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all"
            >
              Next Module: Skills Capital <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* --- TOP MODULE HEADER & LIVE TELEMETRY BAR --- */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--border)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider">
              Module 2 — Financial Health Intelligence
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--subtext)]">
              {savingStatus === "saving" ? (
                <span className="text-amber-500 animate-pulse flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Autosaving...
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All changes saved
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Financial Health Wizard
          </h1>
          <p className="text-xs text-[var(--subtext)]">
            Bloomberg x Wealthfront level financial strength, liquidity, portfolio, & capital valuation engine.
          </p>
        </div>

        {/* Real-time Dashboard Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 z-10 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-[var(--border)] text-left space-y-0.5">
            <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Net Worth</span>
            <div className="text-sm font-extrabold font-mono text-white truncate">
              {formatINR(metrics.netWorth)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-[var(--border)] text-left space-y-0.5">
            <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Monthly Income</span>
            <div className="text-sm font-extrabold font-mono text-emerald-400 truncate">
              {formatINR(metrics.totalMonthlyIncome)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-[var(--border)] text-left space-y-0.5">
            <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Savings Rate</span>
            <div className="text-sm font-extrabold font-mono text-sky-400">
              {metrics.savingsRate}%
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900/90 border border-[var(--border)] text-left space-y-0.5">
            <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Financial Score</span>
            <div className="text-sm font-extrabold font-mono text-indigo-400">
              {metrics.financialHealthScore} / 100
            </div>
          </div>
        </div>
      </div>

      {/* --- STEP PROGRESS BAR & NAVIGATION TABS --- */}
      <div className="glass-panel p-4 rounded-3xl border border-[var(--border)] space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[var(--subtext)]">
            Step {activeStep} of 12 — <strong className="text-[var(--foreground)]">{SECTIONS[activeStep - 1].name}</strong>
          </span>
          <span className="text-sky-400 font-bold">{Math.round((activeStep / 12) * 100)}% Complete</span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / 12) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Tab Quick Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isCurrent = activeStep === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveStep(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                  isCurrent
                    ? "bg-sky-500/15 border border-sky-500/40 text-sky-400 font-bold shadow-md"
                    : "bg-slate-900/60 border border-[var(--border)] text-[var(--subtext)] hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.id}. {sec.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- MAIN WIZARD CONTENT STEP CONTAINER --- */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border)] min-h-[480px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* ================= SECTION 1: INCOME PROFILE ================= */}
            {activeStep === 1 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4">
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Section 1: Income Profile</h2>
                  <p className="text-xs text-[var(--subtext)]">Collect primary income sources, employment, and active/passive revenue streams.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--foreground)]">Primary Income Source / Occupation</label>
                    <input
                      type="text"
                      value={state.incomeProfile.primarySource}
                      onChange={(e) => updateIncomeField("primarySource", e.target.value)}
                      placeholder="e.g. Senior Software Architect"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--foreground)]">Employment Type</label>
                    <select
                      value={state.incomeProfile.employmentType}
                      onChange={(e) => updateIncomeField("employmentType", e.target.value as EmploymentTypeOption)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold"
                    >
                      <option value="Full-Time Salaried" className="bg-[#0f172a] text-slate-100">Full-Time Salaried</option>
                      <option value="Part-Time Salaried" className="bg-[#0f172a] text-slate-100">Part-Time Salaried</option>
                      <option value="Self-Employed / Business Owner" className="bg-[#0f172a] text-slate-100">Self-Employed / Business Owner</option>
                      <option value="Freelancer / Independent Contractor" className="bg-[#0f172a] text-slate-100">Freelancer / Independent Contractor</option>
                      <option value="Gig Worker" className="bg-[#0f172a] text-slate-100">Gig Worker</option>
                      <option value="Unemployed / Looking for Work" className="bg-[#0f172a] text-slate-100">Unemployed / Looking for Work</option>
                      <option value="Retired" className="bg-[#0f172a] text-slate-100">Retired</option>
                      <option value="Student" className="bg-[#0f172a] text-slate-100">Student</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono mb-3">Monthly Active Income Streams (₹)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { key: "monthlyActiveIncome", label: "Base Active Salary / Take Home" },
                      { key: "monthlyBonusIncome", label: "Monthly Bonus / Incentive" },
                      { key: "monthlyFreelanceIncome", label: "Freelance & Consulting" },
                      { key: "monthlyBusinessIncome", label: "Business Profit Draw" },
                    ].map((item) => (
                      <div key={item.key} className="space-y-1">
                        <label className="text-[11px] text-[var(--subtext)]">{item.label}</label>
                        <input
                          type="number"
                          value={(state.incomeProfile as any)[item.key] || ""}
                          onChange={(e) => updateIncomeField(item.key as any, Number(e.target.value))}
                          placeholder="₹0"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono mb-3">Monthly Passive & Investment Streams (₹)</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { key: "monthlyRentalIncome", label: "Rental Income" },
                      { key: "monthlyDividendIncome", label: "Dividends Income" },
                      { key: "monthlyInterestIncome", label: "Interest & FD Yields" },
                      { key: "monthlyRoyaltyIncome", label: "Royalties & IP Yield" },
                      { key: "monthlyPassiveIncome", label: "Automated Digital Revenue" },
                      { key: "monthlyOtherIncome", label: "Other Recurring Yield" },
                    ].map((item) => (
                      <div key={item.key} className="space-y-1">
                        <label className="text-[11px] text-[var(--subtext)]">{item.label}</label>
                        <input
                          type="number"
                          value={(state.incomeProfile as any)[item.key] || ""}
                          onChange={(e) => updateIncomeField(item.key as any, Number(e.target.value))}
                          placeholder="₹0"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Total Monthly Income</span>
                    <div className="text-base font-black font-mono text-emerald-400">{formatINR(metrics.totalMonthlyIncome)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Annual Income</span>
                    <div className="text-base font-black font-mono text-white">{formatINR(metrics.annualIncome)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Income Stability</span>
                    <div className="text-base font-black font-mono text-sky-400">{metrics.scores.incomeStability} / 100</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Passive Ratio</span>
                    <div className="text-base font-black font-mono text-indigo-400">{metrics.passiveIncomeRatio}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 2: SAVINGS & CASH POSITION ================= */}
            {activeStep === 2 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4">
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Section 2: Savings & Cash Position</h2>
                  <p className="text-xs text-[var(--subtext)]">Liquid bank reserves, emergency cash buffers, and fixed deposit balances.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: "cashInHand", label: "Physical Cash in Hand", desc: "Physical currency" },
                    { key: "savingsAccountBalance", label: "Primary Savings Account", desc: "Liquid bank balance" },
                    { key: "currentAccountBalance", label: "Current / Operating Balance", desc: "Business / checking account" },
                    { key: "emergencyFundBalance", label: "Dedicated Emergency Fund", desc: "Instantly accessible buffer" },
                    { key: "fixedDeposits", label: "Fixed Deposits (FD)", desc: "Locked liquidity" },
                    { key: "recurringDeposits", label: "Recurring Deposits (RD)", desc: "Monthly deposit pool" },
                    { key: "foreignCurrencySavings", label: "Foreign Currency Savings", desc: "USD, EUR, etc in INR" },
                  ].map((item) => (
                    <div key={item.key} className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">{item.label}</label>
                      <input
                        type="number"
                        value={(state.savingsPosition as any)[item.key] || ""}
                        onChange={(e) => updateSavingsField(item.key as any, Number(e.target.value))}
                        placeholder="₹0"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                      <span className="text-[10px] text-[var(--subtext)]">{item.desc}</span>
                    </div>
                  ))}
                </div>

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Total Liquid Savings</span>
                    <div className="text-base font-black font-mono text-emerald-400">{formatINR(metrics.totalSavingsBalance)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Emergency Coverage</span>
                    <div className="text-base font-black font-mono text-sky-400">{metrics.emergencyCoverageMonths} Months Burn</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Liquidity Score</span>
                    <div className="text-base font-black font-mono text-indigo-400">{metrics.liquidityScore} / 100</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 3: INVESTMENTS ================= */}
            {activeStep === 3 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 3: Investment Portfolio</h2>
                    <p className="text-xs text-[var(--subtext)]">Track stocks, mutual funds, gold, real estate, PPF/NPS, crypto, and startups.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newItem = {
                        id: `inv_${Date.now()}`,
                        category: "Mutual Funds" as const,
                        name: "",
                        currentValue: 0,
                        annualContribution: 0,
                        riskLevel: "Moderate" as const,
                      };
                      setState((prev) => ({ ...prev, investments: [...prev.investments, newItem] }));
                    }}
                    className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Investment
                  </button>
                </div>

                {state.investments.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3">
                    <TrendingUp className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[var(--foreground)]">No investments added yet</div>
                    <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                      Add your stocks, mutual funds, index funds, real estate, or NPS holdings to evaluate portfolio diversification.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.investments.map((inv, idx) => (
                      <div key={inv.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Category</label>
                          <select
                            value={inv.category}
                            onChange={(e) => {
                              const updated = [...state.investments];
                              updated[idx].category = e.target.value as any;
                              setState({ ...state, investments: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          >
                            {["Stocks", "Mutual Funds", "Index Funds", "ETF", "Gold & Silver", "Real Estate", "REIT", "Government Bonds", "Corporate Bonds", "PPF", "EPF", "NPS", "Cryptocurrency", "Startup Investments", "Other Investments"].map((cat) => (
                              <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Asset Name</label>
                          <input
                            type="text"
                            value={inv.name}
                            onChange={(e) => {
                              const updated = [...state.investments];
                              updated[idx].name = e.target.value;
                              setState({ ...state, investments: updated });
                            }}
                            placeholder="e.g. Nifty 50 Index Fund"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Current Value (₹)</label>
                          <input
                            type="number"
                            value={inv.currentValue || ""}
                            onChange={(e) => {
                              const updated = [...state.investments];
                              updated[idx].currentValue = Number(e.target.value);
                              setState({ ...state, investments: updated });
                            }}
                            placeholder="₹0"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Annual Contribution</label>
                          <input
                            type="number"
                            value={inv.annualContribution || ""}
                            onChange={(e) => {
                              const updated = [...state.investments];
                              updated[idx].annualContribution = Number(e.target.value);
                              setState({ ...state, investments: updated });
                            }}
                            placeholder="₹0/yr"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-3 sm:pt-0">
                          <select
                            value={inv.riskLevel}
                            onChange={(e) => {
                              const updated = [...state.investments];
                              updated[idx].riskLevel = e.target.value as any;
                              setState({ ...state, investments: updated });
                            }}
                            className="w-full px-2 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          >
                            <option value="Low" className="bg-[#0f172a]">Low Risk</option>
                            <option value="Moderate" className="bg-[#0f172a]">Moderate</option>
                            <option value="High" className="bg-[#0f172a]">High Risk</option>
                            <option value="Very High" className="bg-[#0f172a]">Very High</option>
                          </select>
                          <button
                            onClick={() => {
                              const updated = state.investments.filter((_, i) => i !== idx);
                              setState({ ...state, investments: updated });
                            }}
                            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Total Investment Portfolio</span>
                    <div className="text-base font-black font-mono text-emerald-400">{formatINR(metrics.totalPortfolioValue)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Investment Rate</span>
                    <div className="text-base font-black font-mono text-sky-400">{metrics.investmentRate}% Annual</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Diversification Score</span>
                    <div className="text-base font-black font-mono text-indigo-400">{metrics.portfolioDiversificationScore} / 100</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 4: ASSETS ================= */}
            {activeStep === 4 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 4: Real Assets</h2>
                    <p className="text-xs text-[var(--subtext)]">Properties, land, vehicles, business assets, jewellery, & electronics.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newItem = {
                        id: `ast_${Date.now()}`,
                        category: "Residential Property" as const,
                        name: "",
                        purchaseValue: 0,
                        currentMarketValue: 0,
                        ownershipType: "Sole Owner" as const,
                      };
                      setState((prev) => ({ ...prev, assets: [...prev.assets, newItem] }));
                    }}
                    className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Asset
                  </button>
                </div>

                {state.assets.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3">
                    <Landmark className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[var(--foreground)]">No assets listed yet</div>
                    <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                      Add properties, vehicle equity, land, or business equity to calculate true asset worth and appreciation.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.assets.map((ast, idx) => (
                      <div key={ast.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Category</label>
                          <select
                            value={ast.category}
                            onChange={(e) => {
                              const updated = [...state.assets];
                              updated[idx].category = e.target.value as any;
                              setState({ ...state, assets: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          >
                            {["Residential Property", "Commercial Property", "Land", "Vehicles", "Business Assets", "Electronics & Hardware", "Jewellery", "Luxury Assets", "Other Assets"].map((cat) => (
                              <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Asset Description</label>
                          <input
                            type="text"
                            value={ast.name}
                            onChange={(e) => {
                              const updated = [...state.assets];
                              updated[idx].name = e.target.value;
                              setState({ ...state, assets: updated });
                            }}
                            placeholder="e.g. 3BHK Apartment in City"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Purchase Value (₹)</label>
                          <input
                            type="number"
                            value={ast.purchaseValue || ""}
                            onChange={(e) => {
                              const updated = [...state.assets];
                              updated[idx].purchaseValue = Number(e.target.value);
                              setState({ ...state, assets: updated });
                            }}
                            placeholder="₹0"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Current Value (₹)</label>
                          <input
                            type="number"
                            value={ast.currentMarketValue || ""}
                            onChange={(e) => {
                              const updated = [...state.assets];
                              updated[idx].currentMarketValue = Number(e.target.value);
                              setState({ ...state, assets: updated });
                            }}
                            placeholder="₹0"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-3 sm:pt-0">
                          <select
                            value={ast.ownershipType}
                            onChange={(e) => {
                              const updated = [...state.assets];
                              updated[idx].ownershipType = e.target.value as any;
                              setState({ ...state, assets: updated });
                            }}
                            className="w-full px-2 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          >
                            <option value="Sole Owner" className="bg-[#0f172a]">Sole Owner</option>
                            <option value="Joint Owner" className="bg-[#0f172a]">Joint Owner</option>
                            <option value="Family Owned" className="bg-[#0f172a]">Family Owned</option>
                            <option value="Leased" className="bg-[#0f172a]">Leased</option>
                          </select>
                          <button
                            onClick={() => {
                              const updated = state.assets.filter((_, i) => i !== idx);
                              setState({ ...state, assets: updated });
                            }}
                            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Total Market Asset Value</span>
                    <div className="text-base font-black font-mono text-emerald-400">{formatINR(metrics.totalAssetValue)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Asset Score Index</span>
                    <div className="text-base font-black font-mono text-indigo-400">{metrics.scores.assets} / 100</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 5: LIABILITIES ================= */}
            {activeStep === 5 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 5: Liabilities & Debt Burden</h2>
                    <p className="text-xs text-[var(--subtext)]">Home loans, personal loans, car loans, credit card balances, & EMIs.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newItem = {
                        id: `lia_${Date.now()}`,
                        category: "Home Loan" as const,
                        name: "",
                        outstandingAmount: 0,
                        interestRate: 8.5,
                        monthlyEMI: 0,
                        remainingTenureMonths: 120,
                      };
                      setState((prev) => ({ ...prev, liabilities: [...prev.liabilities, newItem] }));
                    }}
                    className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Liability
                  </button>
                </div>

                {state.liabilities.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[var(--foreground)]">Zero debt liabilities listed</div>
                    <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                      If you have no outstanding loans or credit card debt, your debt score is optimal at 100/100!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.liabilities.map((lia, idx) => (
                      <div key={lia.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Debt Type</label>
                          <select
                            value={lia.category}
                            onChange={(e) => {
                              const updated = [...state.liabilities];
                              updated[idx].category = e.target.value as any;
                              setState({ ...state, liabilities: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          >
                            {["Home Loan", "Education Loan", "Personal Loan", "Business Loan", "Vehicle Loan", "Gold Loan", "Credit Card Outstanding", "Buy Now Pay Later", "Other Debt"].map((cat) => (
                              <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Loan Name / Bank</label>
                          <input
                            type="text"
                            value={lia.name}
                            onChange={(e) => {
                              const updated = [...state.liabilities];
                              updated[idx].name = e.target.value;
                              setState({ ...state, liabilities: updated });
                            }}
                            placeholder="e.g. HDFC Housing Loan"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Outstanding (₹)</label>
                          <input
                            type="number"
                            value={lia.outstandingAmount || ""}
                            onChange={(e) => {
                              const updated = [...state.liabilities];
                              updated[idx].outstandingAmount = Number(e.target.value);
                              setState({ ...state, liabilities: updated });
                            }}
                            placeholder="₹0"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Monthly EMI (₹)</label>
                          <input
                            type="number"
                            value={lia.monthlyEMI || ""}
                            onChange={(e) => {
                              const updated = [...state.liabilities];
                              updated[idx].monthlyEMI = Number(e.target.value);
                              setState({ ...state, liabilities: updated });
                            }}
                            placeholder="₹0/mo"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-3 sm:pt-0">
                          <div className="space-y-1 w-full">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Interest %</label>
                            <input
                              type="number"
                              value={lia.interestRate || ""}
                              onChange={(e) => {
                                const updated = [...state.liabilities];
                                updated[idx].interestRate = Number(e.target.value);
                                setState({ ...state, liabilities: updated });
                              }}
                              placeholder="%"
                              className="w-full px-2 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const updated = state.liabilities.filter((_, i) => i !== idx);
                              setState({ ...state, liabilities: updated });
                            }}
                            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Total Outstanding Liabilities</span>
                    <div className="text-base font-black font-mono text-rose-400">{formatINR(metrics.totalLiabilitiesAmount)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Debt-to-Income (DTI)</span>
                    <div className={`text-base font-black font-mono ${metrics.debtToIncomeRatio > 40 ? "text-rose-400" : "text-emerald-400"}`}>
                      {metrics.debtToIncomeRatio}%
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Liabilities Score</span>
                    <div className="text-base font-black font-mono text-indigo-400">{metrics.scores.liabilities} / 100</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 6: MONTHLY EXPENSES ================= */}
            {activeStep === 6 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4">
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Section 6: Monthly Expenses & Burn Rate</h2>
                  <p className="text-xs text-[var(--subtext)]">Housing, food, utilities, healthcare, lifestyle, & recurring commitments.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { key: "housing", label: "Rent / Housing Maintenance" },
                    { key: "food", label: "Groceries & Food" },
                    { key: "transportation", label: "Fuel, Transit, & Vehicle" },
                    { key: "utilities", label: "Electricity, Wifi, Water, Gas" },
                    { key: "healthcare", label: "Medical & Health Wellness" },
                    { key: "insurance", label: "Insurance Premiums (Monthly)" },
                    { key: "education", label: "Tuition & Upskilling" },
                    { key: "entertainment", label: "Dining, Leisure, Outings" },
                    { key: "shopping", label: "Apparel & Personal Shopping" },
                    { key: "travel", label: "Vacations & Travel Fund" },
                    { key: "subscriptions", label: "SaaS & Media Subscriptions" },
                    { key: "familySupport", label: "Family Support & Remittances" },
                    { key: "taxes", label: "Monthly Income Tax Reserve" },
                    { key: "miscellaneous", label: "Miscellaneous Daily Burn" },
                  ].map((item) => (
                    <div key={item.key} className="space-y-1">
                      <label className="text-[11px] font-semibold text-[var(--foreground)]">{item.label}</label>
                      <input
                        type="number"
                        value={(state.expenses as any)[item.key] || ""}
                        onChange={(e) => updateExpenseField(item.key as any, Number(e.target.value))}
                        placeholder="₹0"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  ))}
                </div>

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Monthly Expense Burn</span>
                    <div className="text-base font-black font-mono text-rose-400">{formatINR(metrics.totalMonthlyExpenses)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Expense Ratio</span>
                    <div className="text-base font-black font-mono text-sky-400">{metrics.expenseRatio}% of Income</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Monthly Net Cash Flow</span>
                    <div className={`text-base font-black font-mono ${metrics.totalMonthlyCashFlow >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {formatINR(metrics.totalMonthlyCashFlow)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 7: INSURANCE PROTECTION ================= */}
            {activeStep === 7 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 7: Insurance & Protection Shield</h2>
                    <p className="text-xs text-[var(--subtext)]">Health, term life, accident, vehicle, & property insurance policies.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newItem = {
                        id: `ins_${Date.now()}`,
                        category: "Health Insurance" as const,
                        name: "",
                        coverageAmount: 1000000,
                        annualPremium: 15000,
                      };
                      setState((prev) => ({ ...prev, insuranceProtection: [...prev.insuranceProtection, newItem] }));
                    }}
                    className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Policy
                  </button>
                </div>

                {state.insuranceProtection.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3">
                    <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[var(--foreground)]">No insurance policies added</div>
                    <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                      Add term life and medical health insurance to insulate your net worth from emergency medical shocks.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.insuranceProtection.map((ins, idx) => (
                      <div key={ins.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Type</label>
                          <select
                            value={ins.category}
                            onChange={(e) => {
                              const updated = [...state.insuranceProtection];
                              updated[idx].category = e.target.value as any;
                              setState({ ...state, insuranceProtection: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          >
                            {["Health Insurance", "Life Insurance", "Accident Insurance", "Vehicle Insurance", "Home Insurance", "Business Insurance"].map((cat) => (
                              <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Policy Provider / Name</label>
                          <input
                            type="text"
                            value={ins.name}
                            onChange={(e) => {
                              const updated = [...state.insuranceProtection];
                              updated[idx].name = e.target.value;
                              setState({ ...state, insuranceProtection: updated });
                            }}
                            placeholder="e.g. HDFC ERGO Optima Secure"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Coverage Sum (₹)</label>
                          <input
                            type="number"
                            value={ins.coverageAmount || ""}
                            onChange={(e) => {
                              const updated = [...state.insuranceProtection];
                              updated[idx].coverageAmount = Number(e.target.value);
                              setState({ ...state, insuranceProtection: updated });
                            }}
                            placeholder="₹0"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-3 flex items-center justify-between gap-2 pt-3 sm:pt-0">
                          <div className="space-y-1 w-full">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Annual Premium (₹)</label>
                            <input
                              type="number"
                              value={ins.annualPremium || ""}
                              onChange={(e) => {
                                const updated = [...state.insuranceProtection];
                                updated[idx].annualPremium = Number(e.target.value);
                                setState({ ...state, insuranceProtection: updated });
                              }}
                              placeholder="₹0/yr"
                              className="w-full px-2 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const updated = state.insuranceProtection.filter((_, i) => i !== idx);
                              setState({ ...state, insuranceProtection: updated });
                            }}
                            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Protection Score</span>
                    <div className="text-base font-black font-mono text-emerald-400">{metrics.protectionScore} / 100</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Coverage Gap</span>
                    <div className="text-base font-black font-mono text-amber-400">{formatINR(metrics.coverageGapINR)}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Financial Runway</span>
                    <div className="text-base font-black font-mono text-sky-400">{metrics.financialRunwayMonths} Months</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 8: FINANCIAL BEHAVIOUR ================= */}
            {activeStep === 8 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4">
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Section 8: Financial Behaviour & Discipline</h2>
                  <p className="text-xs text-[var(--subtext)]">Likert scale assessment measuring budget discipline, tax timeliness, and payment history.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: "maintainMonthlyBudget", q: "Do you maintain a written or digital monthly budget?" },
                    { key: "trackExpensesRegularly", q: "Do you track your daily or monthly expenses?" },
                    { key: "investFrequency", q: "How consistently do you execute monthly investments / SIPs?" },
                    { key: "reviewInvestmentsFrequency", q: "How frequently do you review your asset portfolio?" },
                    { key: "fileTaxesOnTime", q: "Do you file tax returns and pay liabilities strictly on time?" },
                    { key: "hasEmergencyFundSetAside", q: "Do you maintain an isolated emergency fund?" },
                    { key: "missedEmiPayments", q: "Have you ever missed or delayed loan EMI payments?" },
                    { key: "missedCreditCardPayments", q: "Have you ever missed credit card bill payments?" },
                    { key: "hasClearFinancialGoals", q: "Do you have quantified, time-bound financial goals?" },
                  ].map((item) => (
                    <div key={item.key} className="p-3.5 rounded-2xl bg-slate-900/60 border border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <span className="text-xs font-semibold text-[var(--foreground)]">{item.q}</span>
                      <div className="flex items-center gap-1.5">
                        {(["Always", "Often", "Sometimes", "Rarely", "Never"] as LikertScale[]).map((val) => {
                          const isSelected = (state.behaviour as any)[item.key] === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => updateBehaviourField(item.key as any, val)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                                isSelected
                                  ? "bg-blue-600 text-white shadow-md font-bold"
                                  : "bg-[var(--background)] border border-[var(--border)] text-[var(--subtext)] hover:text-white"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Behavioral Rating</span>
                    <div className="text-base font-extrabold text-white font-mono">{metrics.disciplineRating}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Discipline Score</span>
                    <div className="text-xl font-black text-emerald-400 font-mono">{metrics.scores.behaviour} / 100</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 9: FINANCIAL GOALS ================= */}
            {activeStep === 9 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 9: Financial Goals & Target Corpus</h2>
                    <p className="text-xs text-[var(--subtext)]">Track milestone targets like home buying, retirement, FIRE, or business seed capital.</p>
                  </div>
                  <button
                    onClick={() => {
                      const newItem = {
                        id: `goal_${Date.now()}`,
                        goalType: "Financial Independence" as const,
                        name: "",
                        targetAmount: 10000000,
                        targetYear: 2035,
                        currentProgress: 500000,
                      };
                      setState((prev) => ({ ...prev, goals: [...prev.goals, newItem] }));
                    }}
                    className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4" /> Add Goal
                  </button>
                </div>

                {state.goals.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3">
                    <Target className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[var(--foreground)]">No financial goals defined yet</div>
                    <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                      Define concrete goal targets (e.g. Retirement Corpus, Home Buying, Higher Studies) to measure milestone progress.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {state.goals.map((gol, idx) => (
                      <div key={gol.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Goal Type</label>
                          <select
                            value={gol.goalType}
                            onChange={(e) => {
                              const updated = [...state.goals];
                              updated[idx].goalType = e.target.value as any;
                              setState({ ...state, goals: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          >
                            {["Emergency Fund", "Home Purchase", "Vehicle Purchase", "Marriage", "Children Education", "Higher Studies", "Business Capital", "Financial Independence", "Retirement Corpus", "Travel & Experience", "Other Goal"].map((cat) => (
                              <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-3 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Goal Name</label>
                          <input
                            type="text"
                            value={gol.name}
                            onChange={(e) => {
                              const updated = [...state.goals];
                              updated[idx].name = e.target.value;
                              setState({ ...state, goals: updated });
                            }}
                            placeholder="e.g. FI/RE Corpus Target"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Target Amount (₹)</label>
                          <input
                            type="number"
                            value={gol.targetAmount || ""}
                            onChange={(e) => {
                              const updated = [...state.goals];
                              updated[idx].targetAmount = Number(e.target.value);
                              setState({ ...state, goals: updated });
                            }}
                            placeholder="₹0"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Current Progress (₹)</label>
                          <input
                            type="number"
                            value={gol.currentProgress || ""}
                            onChange={(e) => {
                              const updated = [...state.goals];
                              updated[idx].currentProgress = Number(e.target.value);
                              setState({ ...state, goals: updated });
                            }}
                            placeholder="₹0"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-3 sm:pt-0">
                          <div className="space-y-1 w-full">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Target Year</label>
                            <input
                              type="number"
                              value={gol.targetYear || ""}
                              onChange={(e) => {
                                const updated = [...state.goals];
                                updated[idx].targetYear = Number(e.target.value);
                                setState({ ...state, goals: updated });
                              }}
                              className="w-full px-2 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>
                          <button
                            onClick={() => {
                              const updated = state.goals.filter((_, i) => i !== idx);
                              setState({ ...state, goals: updated });
                            }}
                            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Goal Completion Index</span>
                    <div className="text-base font-black font-mono text-emerald-400">{metrics.scores.goals} / 100</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Financial Independence (FI/RE)</span>
                    <div className="text-base font-black font-mono text-sky-400">{metrics.financialIndependenceProgress}% Achieved</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 10: RISK PROFILE ================= */}
            {activeStep === 10 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4">
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Section 10: Risk Profile & Appetite</h2>
                  <p className="text-xs text-[var(--subtext)]">Evaluate investment horizon, risk tolerance, job security, and dependents.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--foreground)]">Risk Appetite</label>
                    <select
                      value={state.riskProfile.riskAppetite}
                      onChange={(e) =>
                        setState({
                          ...state,
                          riskProfile: { ...state.riskProfile, riskAppetite: e.target.value as any },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    >
                      <option value="Conservative" className="bg-[#0f172a]">Conservative (Capital Preservation Focus)</option>
                      <option value="Moderate" className="bg-[#0f172a]">Moderate (Balanced Growth & Yield)</option>
                      <option value="Aggressive" className="bg-[#0f172a]">Aggressive (High Growth Equity / Venture)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--foreground)]">Investment Horizon</label>
                    <select
                      value={state.riskProfile.investmentHorizon}
                      onChange={(e) =>
                        setState({
                          ...state,
                          riskProfile: { ...state.riskProfile, investmentHorizon: e.target.value as any },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    >
                      <option value="Short Term (< 3 Yrs)" className="bg-[#0f172a]">Short Term (&lt; 3 Years)</option>
                      <option value="Medium Term (3 - 7 Yrs)" className="bg-[#0f172a]">Medium Term (3 - 7 Years)</option>
                      <option value="Long Term (> 7 Yrs)" className="bg-[#0f172a]">Long Term (&gt; 7 Years)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--foreground)]">Job / Revenue Security</label>
                    <select
                      value={state.riskProfile.jobSecurityRating}
                      onChange={(e) =>
                        setState({
                          ...state,
                          riskProfile: { ...state.riskProfile, jobSecurityRating: e.target.value as any },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    >
                      <option value="Very Secure" className="bg-[#0f172a]">Very Secure (High Moat / Government / MNC)</option>
                      <option value="Secure" className="bg-[#0f172a]">Secure (Established Market Role)</option>
                      <option value="Moderate" className="bg-[#0f172a]">Moderate (Cyclical Sector)</option>
                      <option value="Vulnerable" className="bg-[#0f172a]">Vulnerable (Early Startup / Unpredictable)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--foreground)]">Number of Financial Dependents</label>
                    <input
                      type="number"
                      value={state.riskProfile.dependentsCount}
                      onChange={(e) =>
                        setState({
                          ...state,
                          riskProfile: { ...state.riskProfile, dependentsCount: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                    />
                  </div>
                </div>

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Risk Rating</span>
                    <div className="text-base font-extrabold text-white font-mono">{metrics.riskRating}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Financial Risk Index</span>
                    <div className="text-xl font-black text-amber-400 font-mono">{metrics.financialRiskIndex} / 100</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 11: FINANCIAL LITERACY ================= */}
            {activeStep === 11 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4">
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Section 11: Financial Literacy Self-Assessment</h2>
                  <p className="text-xs text-[var(--subtext)]">Rate your conceptual knowledge across core personal finance domains (1 = Novice, 5 = Expert).</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "budgeting", label: "Budgeting & Cashflow Management" },
                    { key: "investing", label: "Equity, Mutual Funds, & Asset Allocation" },
                    { key: "taxation", label: "Tax Optimization & Compliance" },
                    { key: "insurance", label: "Risk Mitigation & Pure Protection Policy" },
                    { key: "retirementPlanning", label: "Retirement & FI/RE Wealth Compounding" },
                    { key: "debtManagement", label: "Debt Structuring & Refinancing" },
                    { key: "riskManagement", label: "Tail-Risk Management & Hedging" },
                    { key: "personalFinance", label: "Macro Economics & Wealth Preservation" },
                  ].map((item) => {
                    const currentVal = (state.literacy as any)[item.key] || 3;
                    return (
                      <div key={item.key} className="p-4 rounded-2xl bg-slate-900/60 border border-[var(--border)] space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-[var(--foreground)]">{item.label}</span>
                          <span className="font-mono font-bold text-sky-400">Score: {currentVal} / 5</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => updateLiteracyField(item.key as any, lvl)}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                currentVal === lvl
                                  ? "bg-sky-500 text-slate-950 shadow-md"
                                  : "bg-[var(--background)] border border-[var(--border)] text-[var(--subtext)] hover:text-white"
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Auto Calculated Summary Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] flex justify-between items-center text-left">
                  <div>
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Literacy Rating</span>
                    <div className="text-base font-extrabold text-white font-mono">
                      {metrics.scores.literacy >= 80 ? "Advanced Wealth Literacy" : "Competent Financial Literacy"}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase">Financial Literacy Score</span>
                    <div className="text-xl font-black text-indigo-400 font-mono">{metrics.scores.literacy} / 100</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 12: AI WEALTH SUMMARY & DASHBOARD ================= */}
            {activeStep === 12 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold uppercase">
                        {metrics.financialStageBadge}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-[var(--foreground)] mt-1">
                      Financial Health Telemetry Report
                    </h2>
                  </div>
                </div>

                {/* 1. Composite Master Score Dial & Key Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 rounded-3xl bg-slate-900 border border-[var(--border)] flex flex-col items-center justify-center text-center space-y-1">
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase tracking-widest">FINANCIAL HEALTH INDEX</span>
                    <div className="text-6xl font-black font-mono text-white tracking-tight">
                      {metrics.financialHealthScore}
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono uppercase">OUT OF 100</span>
                    <div className="mt-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      {metrics.stabilityRating}
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900 border border-[var(--border)] space-y-3">
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase tracking-widest">NET WORTH & CASH FLOW</span>
                    <div className="space-y-1">
                      <div className="text-2xl font-black font-mono text-white">{formatINR(metrics.netWorth)}</div>
                      <div className="text-xs text-[var(--subtext)] font-mono">Net Asset Worth</div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono">
                      <span className="text-[var(--subtext)]">Monthly Cash Flow:</span>
                      <span className="text-emerald-400 font-bold">{formatINR(metrics.totalMonthlyCashFlow)}</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900 border border-[var(--border)] space-y-3">
                    <span className="text-[10px] font-mono text-[var(--subtext)] uppercase tracking-widest">RESILIENCE & FI/RE</span>
                    <div className="space-y-1">
                      <div className="text-2xl font-black font-mono text-sky-400">{metrics.financialRunwayMonths} Months</div>
                      <div className="text-xs text-[var(--subtext)] font-mono">Financial Runway</div>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono">
                      <span className="text-[var(--subtext)]">FI/RE Progress:</span>
                      <span className="text-indigo-400 font-bold">{metrics.financialIndependenceProgress}%</span>
                    </div>
                  </div>
                </div>

                {/* 2. 11 Sub-Scores Progress Breakdown Grid */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">11 Weighted Vector Sub-Scores</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { name: "Income Stability", score: metrics.scores.incomeStability, weight: "10%" },
                      { name: "Savings Buffer", score: metrics.scores.savings, weight: "10%" },
                      { name: "Investments Yield", score: metrics.scores.investments, weight: "15%" },
                      { name: "Real Asset Worth", score: metrics.scores.assets, weight: "10%" },
                      { name: "Liabilities Health", score: metrics.scores.liabilities, weight: "10%" },
                      { name: "Expense Control", score: metrics.scores.expenses, weight: "10%" },
                      { name: "Insurance Protection", score: metrics.scores.insurance, weight: "5%" },
                      { name: "Financial Behaviour", score: metrics.scores.behaviour, weight: "10%" },
                      { name: "Goal Achievement", score: metrics.scores.goals, weight: "10%" },
                      { name: "Financial Literacy", score: metrics.scores.literacy, weight: "10%" },
                      { name: "Risk Management", score: metrics.scores.riskManagement, weight: "10%" },
                    ].map((vector) => (
                      <div key={vector.name} className="p-3 rounded-2xl bg-slate-900/60 border border-[var(--border)] space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-[var(--subtext)]">{vector.name} ({vector.weight})</span>
                          <span className="font-bold text-white">{vector.score}/100</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                          <div className="h-full bg-sky-400 rounded-full" style={{ width: `${vector.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Strengths, Weaknesses, Risks, Opportunities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
                      <CheckCircle2 className="w-4 h-4" /> Key Financial Strengths
                    </div>
                    <ul className="space-y-1 text-xs text-[var(--foreground)] list-disc list-inside">
                      {metrics.topStrengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono uppercase">
                      <AlertTriangle className="w-4 h-4" /> Financial Weaknesses & Risks
                    </div>
                    <ul className="space-y-1 text-xs text-[var(--foreground)] list-disc list-inside">
                      {metrics.topWeaknesses.map((wk, i) => (
                        <li key={i}>{wk}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 4. Strategic Financial Roadmap */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">Personalized Financial Improvement Roadmap</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {metrics.improvementRoadmap.map((item) => (
                      <div key={item.step} className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] space-y-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase">
                            Step {item.step}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">{item.impact}</span>
                        </div>
                        <div className="text-xs font-bold text-white pt-1">{item.title}</div>
                        <p className="text-[11px] text-[var(--subtext)]">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* --- STEP NAVIGATION CONTROLS --- */}
        <div className="flex items-center justify-between pt-8 border-t border-[var(--border)]">
          <button
            onClick={handleBack}
            disabled={activeStep === 1}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeStep === 1
                ? "opacity-40 cursor-not-allowed bg-slate-900 text-[var(--subtext)]"
                : "bg-slate-900 hover:bg-slate-800 text-white border border-[var(--border)]"
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>

          {activeStep < 12 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitFinancial}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 text-white font-extrabold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitted ? "Update & Save Financial Data" : "Submit & Save Financial Data"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialModule;
