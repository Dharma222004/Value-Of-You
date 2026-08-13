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
  Check,
  Clock,
  Layers,
  Award,
  BookOpen,
  Target,
  ShieldAlert,
  Compass,
  Briefcase,
  Download,
  Info,
  Home,
  ShoppingBag,
  HeartHandshake,
} from "lucide-react";

function getLiabilityCategoryMeta(cat: string) {
  switch (cat) {
    case "Credit Card Outstanding":
      return {
        nameLabel: "Credit Card Issuer / Bank",
        namePlaceholder: "e.g. HDFC Regalia / ICICI Coral Credit Card",
        outLabel: "Total Card Dues (₹)",
        emiLabel: "Minimum Due / Monthly Pay (₹)",
        interestLabel: "APR Interest %",
      };
    case "Vehicle Loan":
      return {
        nameLabel: "Auto Loan Provider / Bank",
        namePlaceholder: "e.g. Axis Bank Car Loan / TVS Auto Credit",
        outLabel: "Outstanding Principal (₹)",
        emiLabel: "Monthly EMI (₹)",
        interestLabel: "Interest Rate % p.a.",
      };
    case "Education Loan":
      return {
        nameLabel: "Education Loan Scheme",
        namePlaceholder: "e.g. Vidya Lakshmi SBI Education Loan",
        outLabel: "Loan Principal (₹)",
        emiLabel: "Monthly EMI / Repayment (₹)",
        interestLabel: "Interest Rate % p.a.",
      };
    case "Buy Now Pay Later":
      return {
        nameLabel: "BNPL Platform / Provider",
        namePlaceholder: "e.g. Simpl / LazyPay / Amazon Pay Later",
        outLabel: "Total Pending Due (₹)",
        emiLabel: "Monthly Repayment (₹)",
        interestLabel: "Late Interest / Penalty %",
      };
    case "Home Loan":
    default:
      return {
        nameLabel: "Loan Name / Bank",
        namePlaceholder: "e.g. HDFC Housing Loan / SBI Home Loan",
        outLabel: "Outstanding Principal (₹)",
        emiLabel: "Monthly EMI (₹)",
        interestLabel: "Interest Rate % p.a.",
      };
  }
}

function getInsuranceCategoryMeta(cat: string) {
  switch (cat) {
    case "Life Insurance":
      return {
        nameLabel: "Term Life Plan / Insurer",
        namePlaceholder: "e.g. Tata AIA Maha Life / ICICI Pru iProtect",
        sumLabel: "Life Cover Sum Assured (₹)",
        premLabel: "Annual Premium (₹/yr)",
      };
    case "Accident Insurance":
      return {
        nameLabel: "Personal Accident Policy",
        namePlaceholder: "e.g. Star Health Personal Accident Plan",
        sumLabel: "Accidental Sum Assured (₹)",
        premLabel: "Annual Premium (₹/yr)",
      };
    case "Vehicle Insurance":
      return {
        nameLabel: "Motor Insurer & Vehicle",
        namePlaceholder: "e.g. ACKO Motor Insurance / Bajaj Car Shield",
        sumLabel: "Insured Declared Value (IDV ₹)",
        premLabel: "Annual Premium (₹/yr)",
      };
    case "Home Insurance":
    case "Business Insurance":
      return {
        nameLabel: "Property / Asset Policy",
        namePlaceholder: "e.g. ICICI Lombard Home Shield",
        sumLabel: "Property Sum Insured (₹)",
        premLabel: "Annual Premium (₹/yr)",
      };
    case "Health Insurance":
    default:
      return {
        nameLabel: "Insurer & Policy Name",
        namePlaceholder: "e.g. HDFC ERGO Optima Secure / Care Supreme",
        sumLabel: "Health Sum Insured (₹)",
        premLabel: "Annual Premium (₹/yr)",
      };
  }
}
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

function getInvestmentCategoryMeta(cat: string) {
  switch (cat) {
    case "Stocks":
      return {
        nameLabel: "Stock Name / Ticker Symbol",
        namePlaceholder: "e.g. Reliance Industries / TCS / AAPL",
        contribLabel: "Annual Stock Addition (₹/yr)",
      };
    case "Gold & Silver":
      return {
        nameLabel: "Gold Asset / SGB Scheme",
        namePlaceholder: "e.g. Sovereign Gold Bond (SGB) / Physical Gold",
        contribLabel: "Annual Gold Accumulation (₹/yr)",
      };
    case "Cryptocurrency":
      return {
        nameLabel: "Crypto Asset / Token",
        namePlaceholder: "e.g. Bitcoin (BTC) / Ethereum (ETH)",
        contribLabel: "Annual DCA Contribution (₹/yr)",
      };
    case "Real Estate":
    case "REIT":
      return {
        nameLabel: "Real Estate Property / REIT Scheme",
        namePlaceholder: "e.g. Embassy Office Parks REIT / Land Investment",
        contribLabel: "Annual Capital Addition (₹/yr)",
      };
    case "PPF":
    case "EPF":
    case "NPS":
    case "Government Bonds":
    case "Corporate Bonds":
      return {
        nameLabel: "Account / Scheme Name",
        namePlaceholder: "e.g. SBI Public Provident Fund / HDFC NPS Tier 1",
        contribLabel: "Annual Contribution (₹/yr)",
      };
    case "Startup Investments":
      return {
        nameLabel: "Startup / Company Equity",
        namePlaceholder: "e.g. Angel Seed Investment / Private Equity",
        contribLabel: "Annual Follow-on Capital (₹/yr)",
      };
    case "Mutual Funds":
    case "Index Funds":
    case "ETF":
    default:
      return {
        nameLabel: "Mutual Fund / Scheme Name",
        namePlaceholder: "e.g. Parag Parikh Flexi Cap Fund / Nifty 50 ETF",
        contribLabel: "Annual SIP / Contribution (₹/yr)",
      };
  }
}

function getAssetCategoryMeta(cat: string) {
  switch (cat) {
    case "Vehicles":
      return {
        descLabel: "Vehicle Make, Model & Year",
        descPlaceholder: "e.g. Hyundai Creta / BMW 3 Series",
        priceLabel: "Purchase Price (₹)",
        marketLabel: "Resale Market Value (₹)",
      };
    case "Electronics & Hardware":
      return {
        descLabel: "Device Name & Specs",
        descPlaceholder: "e.g. MacBook Pro M3 Max / Workstation",
        priceLabel: "Purchase Price (₹)",
        marketLabel: "Current Depreciated Value (₹)",
      };
    case "Jewellery":
    case "Luxury Assets":
      return {
        descLabel: "Jewellery / Asset Description",
        descPlaceholder: "e.g. 24K Gold Sovereign Coins / Diamond Necklace",
        priceLabel: "Purchase Cost (₹)",
        marketLabel: "Current Bullion Value (₹)",
      };
    case "Business Assets":
      return {
        descLabel: "Business / Enterprise Asset Description",
        descPlaceholder: "e.g. Company Machinery / SaaS Platform IP Equity",
        priceLabel: "Capital Expenditure (₹)",
        marketLabel: "Valuation Equity Share (₹)",
      };
    case "Residential Property":
    case "Commercial Property":
    case "Land":
    default:
      return {
        descLabel: "Asset Description & Location",
        descPlaceholder: "e.g. 3BHK Apartment in Chennai / Plot in Coimbatore",
        priceLabel: "Purchase Price (₹)",
        marketLabel: "Current Market Value (₹)",
      };
  }
}

export const FinancialModule: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<FinancialModuleState>(defaultFinancialModuleState);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [savingStatus, setSavingStatus] = useState<"saved" | "saving">("saved");

  const [userId, setUserId] = useState<string | null>(null);
  const [showSection8Popup, setShowSection8Popup] = useState<boolean>(true);

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
        expenses: metrics?.totalMonthlyExpenses || 0,
        savings: metrics?.totalSavingsBalance || 0,
        investments: metrics?.totalPortfolioValue || 0,
        liabilities: metrics?.totalLiabilitiesAmount || 0,
        net_worth: metrics?.netWorth || 0,
        savings_rate: metrics?.savingsRate || 0,
        debt_to_income_ratio: metrics?.debtToIncomeRatio || 0,
        emergency_fund_months: metrics?.emergencyCoverageMonths || 0,
        has_health_insurance: updatedState.insuranceProtection?.some(i => i.category === "Health Insurance") ?? false,
        has_life_insurance: updatedState.insuranceProtection?.some(i => i.category === "Life Insurance") ?? false,
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
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="module-badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  ✓ Financial Health Completed & Saved Locally
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  Score: {metrics.financialHealthScore} / 100
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                Financial Runway & Net Worth Parameters Stored
              </h3>
              <p className="text-xs text-[var(--subtext)] leading-relaxed">
                Net Worth: <strong className="text-emerald-400 font-mono">{formatINR(metrics.netWorth)}</strong> • Savings Rate: <strong className="text-sky-400 font-mono">{metrics.savingsRate}%</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="wizard-nav-btn bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs"
            >
              Edit Financial Inputs
            </button>
            <Link
              href="/dashboard/skills"
              className="wizard-nav-btn bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs shadow-lg shadow-emerald-900/20"
            >
              Next Module: Skills Capital <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* --- TOP MODULE HEADER & LIVE TELEMETRY BAR --- */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="module-badge bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              Module 2 — Financial Health Intelligence
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono">
              {savingStatus === "saving" ? (
                <span className="text-amber-500 animate-pulse flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Autosaving...
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All changes saved
                </span>
              )}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
            Financial Health Wizard
          </h1>
          <p className="text-xs text-[var(--subtext)] max-w-lg leading-relaxed">
            Bloomberg x Wealthfront level financial strength, liquidity, portfolio, & capital valuation engine.
          </p>
        </div>

        {/* Real-time Dashboard Telemetry Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 w-full md:w-auto">
          {/* Net Worth Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 space-y-1.5 shadow-lg shadow-emerald-950/20 hover:scale-[1.02] hover:border-emerald-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400/90 uppercase flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Net Worth
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-300 truncate">
              {formatINR(metrics.netWorth)}
            </div>
          </div>

          {/* Monthly Income Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent border border-cyan-500/30 space-y-1.5 shadow-lg shadow-cyan-950/20 hover:scale-[1.02] hover:border-cyan-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400/90 uppercase flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Monthly Income
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-cyan-300 truncate">
              {formatINR(metrics.totalMonthlyIncome)}
            </div>
          </div>

          {/* Savings Rate Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-transparent border border-purple-500/30 space-y-1.5 shadow-lg shadow-purple-950/20 hover:scale-[1.02] hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400/90 uppercase flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-purple-400 shrink-0" /> Savings Rate
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-purple-300">
              {metrics.savingsRate}%
            </div>
          </div>

          {/* Financial Score Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 space-y-1.5 shadow-lg shadow-amber-950/20 hover:scale-[1.02] hover:border-amber-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400/90 uppercase flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Financial Score
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
            </div>
            <div className="text-base sm:text-lg font-extrabold font-mono text-amber-300 flex items-baseline gap-1">
              <span>{metrics.financialHealthScore}</span>
              <span className="text-xs font-normal text-amber-400/60 font-mono">/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- STEP PROGRESS BAR & NAVIGATION TABS --- */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-[var(--foreground)]">
            Step {activeStep} of 12 — <strong className="text-sky-400">{SECTIONS[activeStep - 1].name}</strong>
          </span>
          <span className="text-xs font-mono font-semibold text-sky-400">{Math.round((activeStep / 12) * 100)}% Complete</span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / 12) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Tab Quick Selector */}
        <div className="scroll-fade-container">
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 no-scrollbar pr-12">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isCurrent = activeStep === sec.id;
              const isCompleted = sec.id < activeStep;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveStep(sec.id)}
                  className={`step-chip ${
                    isCurrent
                      ? "step-chip-active"
                      : isCompleted
                      ? "step-chip-completed"
                      : ""
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : <Icon className="w-3.5 h-3.5" />}
                  <span>{sec.id}. {sec.name}</span>
                </button>
              );
            })}
          </div>
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

                {/* Card 1: Occupation & Employment */}
                <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-sky-400" /> Primary Career & Employment Status
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Primary Income Source / Occupation</label>
                      <input
                        type="text"
                        value={state.incomeProfile.primarySource}
                        onChange={(e) => updateIncomeField("primarySource", e.target.value)}
                        placeholder="e.g. Senior Software Architect / Student"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-sky-400 focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Employment Type</label>
                      <select
                        value={state.incomeProfile.employmentType}
                        onChange={(e) => updateIncomeField("employmentType", e.target.value as EmploymentTypeOption)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none transition-all"
                      >
                        <option value="Full-Time Salaried" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Full-Time Salaried</option>
                        <option value="Part-Time Salaried" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Part-Time Salaried</option>
                        <option value="Self-Employed / Business Owner" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Self-Employed / Business Owner</option>
                        <option value="Freelancer / Independent Contractor" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Freelancer / Independent Contractor</option>
                        <option value="Gig Worker" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Gig Worker</option>
                        <option value="Unemployed / Looking for Work" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Unemployed / Looking for Work</option>
                        <option value="Retired" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Retired</option>
                        <option value="Student" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Student</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Card 2: Active Income Streams */}
                <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" /> Monthly Active Income Streams (₹)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                    {[
                      { key: "monthlyActiveIncome", label: "Base Active Salary / Take Home" },
                      { key: "monthlyBonusIncome", label: "Monthly Bonus / Incentive" },
                      { key: "monthlyFreelanceIncome", label: "Freelance & Consulting" },
                      { key: "monthlyBusinessIncome", label: "Business Profit Draw" },
                    ].map((item) => (
                      <div key={item.key} className="space-y-1.5">
                        <label className="text-[11px] font-medium text-[var(--subtext)]">{item.label}</label>
                        <input
                          type="number"
                          value={(state.incomeProfile as any)[item.key] || ""}
                          onChange={(e) => updateIncomeField(item.key as any, Number(e.target.value))}
                          placeholder="₹0"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-cyan-400 focus:outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Passive Income Streams */}
                <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Monthly Passive & Investment Streams (₹)
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {[
                      { key: "monthlyRentalIncome", label: "Rental Income" },
                      { key: "monthlyDividendIncome", label: "Dividends Income" },
                      { key: "monthlyInterestIncome", label: "Interest & FD Yields" },
                      { key: "monthlyRoyaltyIncome", label: "Royalties & IP Yield" },
                      { key: "monthlyPassiveIncome", label: "Automated Digital Revenue" },
                      { key: "monthlyOtherIncome", label: "Other Recurring Yield" },
                    ].map((item) => (
                      <div key={item.key} className="space-y-1.5">
                        <label className="text-[11px] font-medium text-[var(--subtext)]">{item.label}</label>
                        <input
                          type="number"
                          value={(state.incomeProfile as any)[item.key] || ""}
                          onChange={(e) => updateIncomeField(item.key as any, Number(e.target.value))}
                          placeholder="₹0"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-emerald-400 focus:outline-none transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] font-mono tracking-wider text-emerald-400/80 uppercase block">Total Monthly Income</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-300">{formatINR(metrics.totalMonthlyIncome)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                    <span className="text-[10px] font-mono tracking-wider text-cyan-400/80 uppercase block">Annual Income</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-cyan-300">{formatINR(metrics.annualIncome)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                    <span className="text-[10px] font-mono tracking-wider text-sky-400/80 uppercase block">Income Stability</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-sky-300">{metrics.scores.incomeStability} <span className="text-xs font-normal text-sky-400/60">/ 100</span></div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <span className="text-[10px] font-mono tracking-wider text-indigo-400/80 uppercase block">Passive Ratio</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-indigo-300">{metrics.passiveIncomeRatio}%</div>
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

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] font-mono tracking-wider text-emerald-400/80 uppercase block">Total Liquid Savings</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-300">{formatINR(metrics.totalSavingsBalance)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                    <span className="text-[10px] font-mono tracking-wider text-sky-400/80 uppercase block">Emergency Coverage</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-sky-300">{metrics.emergencyCoverageMonths} Months Burn</div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <span className="text-[10px] font-mono tracking-wider text-indigo-400/80 uppercase block">Liquidity Score</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-indigo-300">{metrics.liquidityScore} <span className="text-xs font-normal text-indigo-400/60">/ 100</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 3: INVESTMENTS ================= */}
            {activeStep === 3 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 3: Investment Portfolio</h2>
                      <p className="text-xs text-[var(--subtext)]">Stocks, mutual funds, index funds, REITs, bonds, PPF, & crypto.</p>
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
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Investment
                    </button>
                  </div>

                  {/* 1-Click Quick Add Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-[var(--subtext)] mr-1">Quick Add:</span>
                    {[
                      { label: "+ Nifty 50 SIP", cat: "Mutual Funds", risk: "Moderate" },
                      { label: "+ Tech Stocks", cat: "Stocks", risk: "High" },
                      { label: "+ Gold ETF", cat: "Gold & Silver", risk: "Low" },
                      { label: "+ PPF / EPF", cat: "PPF", risk: "Low" },
                      { label: "+ Crypto Holding", cat: "Cryptocurrency", risk: "Very High" },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          const newItem = {
                            id: `inv_${Date.now()}`,
                            category: preset.cat as any,
                            name: preset.label.replace("+ ", ""),
                            currentValue: 0,
                            annualContribution: 0,
                            riskLevel: preset.risk as any,
                          };
                          setState((prev) => ({ ...prev, investments: [...prev.investments, newItem] }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 text-[11px] font-mono font-medium transition-all"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {state.investments.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3 bg-[var(--background)]/40">
                    <TrendingUp className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[var(--foreground)]">No investments added yet</div>
                    <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                      Add your stocks, mutual funds, index funds, real estate, or NPS holdings to evaluate portfolio diversification. Click any quick add preset above to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {state.investments.map((inv, idx) => {
                      const meta = getInvestmentCategoryMeta(inv.category);
                      return (
                        <div key={inv.id} className="p-4 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)] space-y-3 hover:border-sky-500/30 transition-all shadow-md">
                          {/* Header Row: Category, Name, & Delete Button */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="w-full sm:w-2/5 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Asset Category</label>
                              <select
                                value={inv.category}
                                onChange={(e) => {
                                  const updated = [...state.investments];
                                  updated[idx].category = e.target.value as any;
                                  setState({ ...state, investments: updated });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none"
                              >
                                {["Stocks", "Mutual Funds", "Index Funds", "ETF", "Gold & Silver", "Real Estate", "REIT", "Government Bonds", "Corporate Bonds", "PPF", "EPF", "NPS", "Cryptocurrency", "Startup Investments", "Other Investments"].map((cat) => (
                                  <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                                ))}
                              </select>
                            </div>

                            <div className="flex-1 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.nameLabel}</label>
                              <input
                                type="text"
                                value={inv.name}
                                onChange={(e) => {
                                  const updated = [...state.investments];
                                  updated[idx].name = e.target.value;
                                  setState({ ...state, investments: updated });
                                }}
                                placeholder={meta.namePlaceholder}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <button
                              onClick={() => {
                                const updated = state.investments.filter((_, i) => i !== idx);
                                setState({ ...state, investments: updated });
                              }}
                              title="Remove Investment"
                              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all shrink-0 self-end sm:self-center sm:mt-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Values Row: Current Value, Annual Contribution, Risk Level */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--border)]/50">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Current Value (₹)</label>
                              <input
                                type="number"
                                value={inv.currentValue || ""}
                                onChange={(e) => {
                                  const updated = [...state.investments];
                                  updated[idx].currentValue = Number(e.target.value);
                                  setState({ ...state, investments: updated });
                                }}
                                placeholder="₹0"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.contribLabel}</label>
                              <input
                                type="number"
                                value={inv.annualContribution || ""}
                                onChange={(e) => {
                                  const updated = [...state.investments];
                                  updated[idx].annualContribution = Number(e.target.value);
                                  setState({ ...state, investments: updated });
                                }}
                                placeholder="₹0/yr"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Risk Level</label>
                              <select
                                value={inv.riskLevel}
                                onChange={(e) => {
                                  const updated = [...state.investments];
                                  updated[idx].riskLevel = e.target.value as any;
                                  setState({ ...state, investments: updated });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none"
                              >
                                <option value="Low" className="bg-[#0f172a] text-emerald-400">Low Risk</option>
                                <option value="Moderate" className="bg-[#0f172a] text-sky-400">Moderate Risk</option>
                                <option value="High" className="bg-[#0f172a] text-amber-400">High Risk</option>
                                <option value="Very High" className="bg-[#0f172a] text-rose-400">Very High Risk</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Total Investment Portfolio</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-300">{formatINR(metrics.totalPortfolioValue)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Investment Rate</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-sky-300">{metrics.investmentRate}% Annual</div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Diversification Score</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-indigo-300">{metrics.portfolioDiversificationScore} <span className="text-xs font-normal text-indigo-400/60">/ 100</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 4: ASSETS ================= */}
            {activeStep === 4 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 space-y-3">
                  <div className="flex justify-between items-center">
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
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Asset
                    </button>
                  </div>

                  {/* 1-Click Quick Add Presets for Real Assets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-[var(--subtext)] mr-1">Quick Add:</span>
                    {[
                      { label: "+ 3BHK Flat", cat: "Residential Property", own: "Sole Owner" },
                      { label: "+ Land / Plot", cat: "Land", own: "Sole Owner" },
                      { label: "+ Personal Car", cat: "Vehicles", own: "Sole Owner" },
                      { label: "+ Business Equity", cat: "Business Assets", own: "Sole Owner" },
                      { label: "+ Gold Jewellery", cat: "Jewellery", own: "Family Owned" },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          const newItem = {
                            id: `ast_${Date.now()}`,
                            category: preset.cat as any,
                            name: preset.label.replace("+ ", ""),
                            purchaseValue: 0,
                            currentMarketValue: 0,
                            ownershipType: preset.own as any,
                          };
                          setState((prev) => ({ ...prev, assets: [...prev.assets, newItem] }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 text-[11px] font-mono font-medium transition-all"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {state.assets.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3 bg-[var(--background)]/40">
                    <Landmark className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[var(--foreground)]">No assets listed yet</div>
                    <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                      Add properties, vehicle equity, land, or business equity to calculate true asset worth and appreciation. Click any quick add preset above to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {state.assets.map((ast, idx) => {
                      const meta = getAssetCategoryMeta(ast.category);
                      return (
                        <div key={ast.id} className="p-4 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)] space-y-3 hover:border-sky-500/30 transition-all shadow-md">
                          {/* Header Row: Category, Description, & Delete Button */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="w-full sm:w-2/5 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Asset Category</label>
                              <select
                                value={ast.category}
                                onChange={(e) => {
                                  const updated = [...state.assets];
                                  updated[idx].category = e.target.value as any;
                                  setState({ ...state, assets: updated });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none"
                              >
                                {["Residential Property", "Commercial Property", "Land", "Vehicles", "Business Assets", "Electronics & Hardware", "Jewellery", "Luxury Assets", "Other Assets"].map((cat) => (
                                  <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                                ))}
                              </select>
                            </div>

                            <div className="flex-1 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.descLabel}</label>
                              <input
                                type="text"
                                value={ast.name}
                                onChange={(e) => {
                                  const updated = [...state.assets];
                                  updated[idx].name = e.target.value;
                                  setState({ ...state, assets: updated });
                                }}
                                placeholder={meta.descPlaceholder}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <button
                              onClick={() => {
                                const updated = state.assets.filter((_, i) => i !== idx);
                                setState({ ...state, assets: updated });
                              }}
                              title="Remove Asset"
                              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all shrink-0 self-end sm:self-center sm:mt-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Values Row: Purchase Price, Market Value, Ownership */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--border)]/50">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.priceLabel}</label>
                              <input
                                type="number"
                                value={ast.purchaseValue || ""}
                                onChange={(e) => {
                                  const updated = [...state.assets];
                                  updated[idx].purchaseValue = Number(e.target.value);
                                  setState({ ...state, assets: updated });
                                }}
                                placeholder="₹0"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.marketLabel}</label>
                              <input
                                type="number"
                                value={ast.currentMarketValue || ""}
                                onChange={(e) => {
                                  const updated = [...state.assets];
                                  updated[idx].currentMarketValue = Number(e.target.value);
                                  setState({ ...state, assets: updated });
                                }}
                                placeholder="₹0"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Ownership Status</label>
                              <select
                                value={ast.ownershipType}
                                onChange={(e) => {
                                  const updated = [...state.assets];
                                  updated[idx].ownershipType = e.target.value as any;
                                  setState({ ...state, assets: updated });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none"
                              >
                                <option value="Sole Owner" className="bg-[#0f172a]">Sole Owner</option>
                                <option value="Joint Owner" className="bg-[#0f172a]">Joint Owner</option>
                                <option value="Family Owned" className="bg-[#0f172a]">Family Owned</option>
                                <option value="Leased" className="bg-[#0f172a]">Leased</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Total Market Asset Value</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-300">{formatINR(metrics.totalAssetValue)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Asset Score Index</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-indigo-300">{metrics.scores.assets} <span className="text-xs font-normal text-indigo-400/60">/ 100</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 5: LIABILITIES ================= */}
            {activeStep === 5 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 space-y-3">
                  <div className="flex justify-between items-center">
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
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Liability
                    </button>
                  </div>

                  {/* 1-Click Quick Add Presets for Liabilities */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-[var(--subtext)] mr-1">Quick Add:</span>
                    {[
                      { label: "+ HDFC Home Loan", cat: "Home Loan", rate: 8.5 },
                      { label: "+ SBI Car Loan", cat: "Vehicle Loan", rate: 9.0 },
                      { label: "+ Credit Card Dues", cat: "Credit Card Outstanding", rate: 42.0 },
                      { label: "+ ICICI Personal Loan", cat: "Personal Loan", rate: 12.5 },
                      { label: "+ Education Loan", cat: "Education Loan", rate: 9.5 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          const newItem = {
                            id: `lia_${Date.now()}`,
                            category: preset.cat as any,
                            name: preset.label.replace("+ ", ""),
                            outstandingAmount: 0,
                            interestRate: preset.rate,
                            monthlyEMI: 0,
                            remainingTenureMonths: 60,
                          };
                          setState((prev) => ({ ...prev, liabilities: [...prev.liabilities, newItem] }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 text-[11px] font-mono font-medium transition-all"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {state.liabilities.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3 bg-[var(--background)]/40">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[var(--foreground)]">Zero debt liabilities listed</div>
                    <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                      If you have no outstanding loans or credit card debt, your debt score is optimal at 100/100! Click any quick add preset above if you hold active loans or EMIs.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {state.liabilities.map((lia, idx) => {
                      const meta = getLiabilityCategoryMeta(lia.category);
                      return (
                        <div key={lia.id} className="p-4 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)] space-y-3 hover:border-sky-500/30 transition-all shadow-md">
                          {/* Header Row: Category, Name, & Delete Button */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="w-full sm:w-2/5 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Debt Type</label>
                              <select
                                value={lia.category}
                                onChange={(e) => {
                                  const updated = [...state.liabilities];
                                  updated[idx].category = e.target.value as any;
                                  setState({ ...state, liabilities: updated });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none"
                              >
                                {["Home Loan", "Education Loan", "Personal Loan", "Business Loan", "Vehicle Loan", "Gold Loan", "Credit Card Outstanding", "Buy Now Pay Later", "Other Debt"].map((cat) => (
                                  <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                                ))}
                              </select>
                            </div>

                            <div className="flex-1 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.nameLabel}</label>
                              <input
                                type="text"
                                value={lia.name}
                                onChange={(e) => {
                                  const updated = [...state.liabilities];
                                  updated[idx].name = e.target.value;
                                  setState({ ...state, liabilities: updated });
                                }}
                                placeholder={meta.namePlaceholder}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <button
                              onClick={() => {
                                const updated = state.liabilities.filter((_, i) => i !== idx);
                                setState({ ...state, liabilities: updated });
                              }}
                              title="Remove Liability"
                              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all shrink-0 self-end sm:self-center sm:mt-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Values Row: Outstanding, EMI, Interest */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--border)]/50">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.outLabel}</label>
                              <input
                                type="number"
                                value={lia.outstandingAmount || ""}
                                onChange={(e) => {
                                  const updated = [...state.liabilities];
                                  updated[idx].outstandingAmount = Number(e.target.value);
                                  setState({ ...state, liabilities: updated });
                                }}
                                placeholder="₹0"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.emiLabel}</label>
                              <input
                                type="number"
                                value={lia.monthlyEMI || ""}
                                onChange={(e) => {
                                  const updated = [...state.liabilities];
                                  updated[idx].monthlyEMI = Number(e.target.value);
                                  setState({ ...state, liabilities: updated });
                                }}
                                placeholder="₹0/mo"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.interestLabel}</label>
                              <input
                                type="number"
                                value={lia.interestRate || ""}
                                onChange={(e) => {
                                  const updated = [...state.liabilities];
                                  updated[idx].interestRate = Number(e.target.value);
                                  setState({ ...state, liabilities: updated });
                                }}
                                placeholder="%"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Total Outstanding Liabilities</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-rose-300">{formatINR(metrics.totalLiabilitiesAmount)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Debt-to-Income (DTI)</span>
                    <div className={`text-base sm:text-lg font-extrabold font-mono ${metrics.debtToIncomeRatio > 40 ? "text-rose-400" : "text-emerald-300"}`}>
                      {metrics.debtToIncomeRatio}%
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Liabilities Score</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-indigo-300">{metrics.scores.liabilities} <span className="text-xs font-normal text-indigo-400/60">/ 100</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 6: MONTHLY EXPENSES ================= */}
            {activeStep === 6 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 6: Monthly Expenses & Burn Rate</h2>
                    <p className="text-xs text-[var(--subtext)]">Housing, food, utilities, healthcare, lifestyle, & recurring commitments.</p>
                  </div>

                  {/* Quick Auto-Fill Presets */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-[var(--subtext)]">Fast Fill:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setState((prev) => ({
                          ...prev,
                          expenses: {
                            housing: 12000,
                            food: 6000,
                            transportation: 2500,
                            utilities: 2000,
                            healthcare: 1500,
                            insurance: 1000,
                            education: 0,
                            entertainment: 2000,
                            shopping: 1500,
                            travel: 1000,
                            subscriptions: 500,
                            familySupport: 0,
                            taxes: 0,
                            miscellaneous: 1000,
                          },
                        }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-all"
                    >
                      ⚡ Essential (~₹30k)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setState((prev) => ({
                          ...prev,
                          expenses: {
                            housing: 22000,
                            food: 12000,
                            transportation: 5000,
                            utilities: 3500,
                            healthcare: 3000,
                            insurance: 2500,
                            education: 3000,
                            entertainment: 5000,
                            shopping: 4000,
                            travel: 3000,
                            subscriptions: 1200,
                            familySupport: 2000,
                            taxes: 2000,
                            miscellaneous: 1800,
                          },
                        }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 text-xs font-semibold transition-all"
                    >
                      ⚡ Moderate (~₹70k)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setState((prev) => ({
                          ...prev,
                          expenses: {
                            housing: 0,
                            food: 0,
                            transportation: 0,
                            utilities: 0,
                            healthcare: 0,
                            insurance: 0,
                            education: 0,
                            entertainment: 0,
                            shopping: 0,
                            travel: 0,
                            subscriptions: 0,
                            familySupport: 0,
                            taxes: 0,
                            miscellaneous: 0,
                          },
                        }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition-all"
                    >
                      🧹 Clear All
                    </button>
                  </div>
                </div>

                {/* 3 Grouped Expense Cards with 2-Column Inputs */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Card 1: Essential Needs & Utilities */}
                  <div className="p-5 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)] space-y-4 hover:border-sky-500/30 transition-all shadow-md">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)] text-sky-400">
                      <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
                        <Home className="w-4 h-4 text-sky-400" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-100">Essential Needs & Utilities</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        { key: "housing", label: "Rent & Housing" },
                        { key: "food", label: "Groceries & Food" },
                        { key: "transportation", label: "Fuel & Transit" },
                        { key: "utilities", label: "Electricity & Wifi" },
                        { key: "healthcare", label: "Medical & Health" },
                        { key: "taxes", label: "Tax Reserve" },
                      ].map((item) => (
                        <div key={item.key} className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 block">{item.label}</label>
                          <input
                            type="number"
                            value={(state.expenses as any)[item.key] || ""}
                            onChange={(e) => updateExpenseField(item.key as any, Number(e.target.value))}
                            placeholder="₹0"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: Lifestyle, Outings & Subscriptions */}
                  <div className="p-5 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)] space-y-4 hover:border-purple-500/30 transition-all shadow-md">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)] text-purple-400">
                      <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <ShoppingBag className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-100">Lifestyle & Leisure</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        { key: "entertainment", label: "Dining & Outings" },
                        { key: "shopping", label: "Apparel & Shopping" },
                        { key: "travel", label: "Vacations & Travel" },
                        { key: "subscriptions", label: "SaaS & Subscriptions" },
                      ].map((item) => (
                        <div key={item.key} className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 block">{item.label}</label>
                          <input
                            type="number"
                            value={(state.expenses as any)[item.key] || ""}
                            onChange={(e) => updateExpenseField(item.key as any, Number(e.target.value))}
                            placeholder="₹0"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-purple-400 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 3: Commitments & Growth */}
                  <div className="p-5 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)] space-y-4 hover:border-emerald-500/30 transition-all shadow-md">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border)] text-emerald-400">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <HeartHandshake className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-100">Family & Future Growth</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {[
                        { key: "insurance", label: "Insurance Premiums" },
                        { key: "education", label: "Tuition & Upskilling" },
                        { key: "familySupport", label: "Family Support" },
                        { key: "miscellaneous", label: "Misc Daily Burn" },
                      ].map((item) => (
                        <div key={item.key} className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 block">{item.label}</label>
                          <input
                            type="number"
                            value={(state.expenses as any)[item.key] || ""}
                            onChange={(e) => updateExpenseField(item.key as any, Number(e.target.value))}
                            placeholder="₹0"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-emerald-400 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Total Monthly Expense Burn</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-amber-300">{formatINR(metrics.totalMonthlyExpenses)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Expense Ratio</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-sky-300">{metrics.expenseRatio}% of Income</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Monthly Net Cash Flow</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-300">{formatINR(metrics.totalMonthlyCashFlow)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 7: INSURANCE PROTECTION ================= */}
            {activeStep === 7 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 space-y-3">
                  <div className="flex justify-between items-center">
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
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Policy
                    </button>
                  </div>

                  {/* 1-Click Quick Add Presets for Insurance */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-[var(--subtext)] mr-1">Quick Add:</span>
                    {[
                      { label: "+ Term Life (₹1 Cr)", cat: "Life Insurance", sum: 10000000, prem: 12000 },
                      { label: "+ Health Care (₹10L)", cat: "Health Insurance", sum: 1000000, prem: 15000 },
                      { label: "+ Accident Cover (₹25L)", cat: "Accident Insurance", sum: 2500000, prem: 3500 },
                      { label: "+ Motor Vehicle", cat: "Vehicle Insurance", sum: 500000, prem: 8000 },
                      { label: "+ Property Shield", cat: "Home Insurance", sum: 5000000, prem: 5000 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          const newItem = {
                            id: `ins_${Date.now()}`,
                            category: preset.cat as any,
                            name: preset.label.replace("+ ", ""),
                            coverageAmount: preset.sum,
                            annualPremium: preset.prem,
                          };
                          setState((prev) => ({ ...prev, insuranceProtection: [...prev.insuranceProtection, newItem] }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 text-[11px] font-mono font-medium transition-all"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {state.insuranceProtection.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3 bg-[var(--background)]/40">
                    <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[var(--foreground)]">No insurance policies added</div>
                    <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                      Add term life and medical health insurance to insulate your net worth from emergency medical shocks. Click any quick add preset above to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {state.insuranceProtection.map((ins, idx) => {
                      const meta = getInsuranceCategoryMeta(ins.category);
                      return (
                        <div key={ins.id} className="p-4 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)] space-y-3 hover:border-sky-500/30 transition-all shadow-md">
                          {/* Header Row: Category, Provider, & Delete Button */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="w-full sm:w-2/5 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Policy Type</label>
                              <select
                                value={ins.category}
                                onChange={(e) => {
                                  const updated = [...state.insuranceProtection];
                                  updated[idx].category = e.target.value as any;
                                  setState({ ...state, insuranceProtection: updated });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none"
                              >
                                {["Health Insurance", "Life Insurance", "Accident Insurance", "Vehicle Insurance", "Home Insurance", "Business Insurance"].map((cat) => (
                                  <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                                ))}
                              </select>
                            </div>

                            <div className="flex-1 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.nameLabel}</label>
                              <input
                                type="text"
                                value={ins.name}
                                onChange={(e) => {
                                  const updated = [...state.insuranceProtection];
                                  updated[idx].name = e.target.value;
                                  setState({ ...state, insuranceProtection: updated });
                                }}
                                placeholder={meta.namePlaceholder}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <button
                              onClick={() => {
                                const updated = state.insuranceProtection.filter((_, i) => i !== idx);
                                setState({ ...state, insuranceProtection: updated });
                              }}
                              title="Remove Policy"
                              className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all shrink-0 self-end sm:self-center sm:mt-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Values Row: Sum Assured, Premium */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border)]/50">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.sumLabel}</label>
                              <input
                                type="number"
                                value={ins.coverageAmount || ""}
                                onChange={(e) => {
                                  const updated = [...state.insuranceProtection];
                                  updated[idx].coverageAmount = Number(e.target.value);
                                  setState({ ...state, insuranceProtection: updated });
                                }}
                                placeholder="₹0"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">{meta.premLabel}</label>
                              <input
                                type="number"
                                value={ins.annualPremium || ""}
                                onChange={(e) => {
                                  const updated = [...state.insuranceProtection];
                                  updated[idx].annualPremium = Number(e.target.value);
                                  setState({ ...state, insuranceProtection: updated });
                                }}
                                placeholder="₹0/yr"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Protection Score Index</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-300">{metrics.protectionScore} <span className="text-xs font-normal text-emerald-400/60">/ 100</span></div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Estimated Coverage Gap</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-amber-300">{formatINR(metrics.coverageGapINR)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Financial Runway</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-indigo-300">{metrics.emergencyCoverageMonths} <span className="text-xs font-normal text-indigo-400/60">Months Burn</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 8: FINANCIAL BEHAVIOUR ================= */}
            {activeStep === 8 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 space-y-2">
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Section 8: Financial Behaviour & Discipline</h2>
                  <p className="text-xs text-[var(--subtext)]">Likert scale assessment measuring budget discipline, tax timeliness, and payment history.</p>
                </div>

                {/* Entrance Popup Banner */}
                {showSection8Popup && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/90 via-slate-900/90 to-indigo-950/90 border border-sky-500/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-sky-500/20 border border-sky-500/30 shrink-0 mt-0.5">
                        <Sparkles className="w-5 h-5 text-sky-400" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs sm:text-sm font-bold text-sky-200">Financial Discipline Assessment Notice</h4>
                        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                          Please select your <strong>authentic, original daily financial habits</strong> for each question below. Selecting accurate options ensures your calculated Financial Health Score and Behavioral Rating are 100% genuine.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSection8Popup(false)}
                      className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-md self-end sm:self-center"
                    >
                      Got it, Start Assessment
                    </button>
                  </div>
                )}

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
                    <div key={item.key} className="p-4 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-sky-500/30 transition-all shadow-sm">
                      <span className="text-xs font-semibold text-slate-100">{item.q}</span>
                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        {(["Always", "Often", "Sometimes", "Rarely", "Never"] as LikertScale[]).map((val) => {
                          const isSelected = (state.behaviour as any)[item.key] === val;
                          
                          let activeStyle = "bg-sky-600 text-white font-bold";
                          if (isSelected) {
                            if (val === "Always") activeStyle = "bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-400 scale-[1.03]";
                            else if (val === "Often") activeStyle = "bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 font-black shadow-lg shadow-sky-500/25 ring-2 ring-sky-300 scale-[1.03]";
                            else if (val === "Sometimes") activeStyle = "bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-300 scale-[1.03]";
                            else if (val === "Rarely") activeStyle = "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25 ring-2 ring-amber-300 scale-[1.03]";
                            else if (val === "Never") activeStyle = "bg-gradient-to-r from-rose-500 to-rose-600 text-white font-black shadow-lg shadow-rose-500/25 ring-2 ring-rose-300 scale-[1.03]";
                          }

                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => updateBehaviourField(item.key as any, val)}
                              className={`px-3 py-1.5 rounded-xl text-xs transition-all ${
                                isSelected
                                  ? activeStyle
                                  : "bg-[var(--background)] border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800/40 font-medium"
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

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Behavioral Rating</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-sky-300">{metrics.disciplineRating}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Discipline Score</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-300">{metrics.scores.behaviour} <span className="text-xs font-normal text-emerald-400/60">/ 100</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 9: FINANCIAL GOALS ================= */}
            {activeStep === 9 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 space-y-3">
                  <div className="flex justify-between items-center">
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
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Goal
                    </button>
                  </div>

                  {/* 1-Click Quick Add Presets for Financial Goals */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-mono text-[var(--subtext)] mr-1">Quick Add:</span>
                    {[
                      { label: "+ FI/RE Target (₹1 Cr)", cat: "Financial Independence", target: 10000000, year: 2035, prog: 500000 },
                      { label: "+ Home Buying (₹75L)", cat: "Home Purchase", target: 7500000, year: 2030, prog: 1000000 },
                      { label: "+ Children Education (₹30L)", cat: "Children Education", target: 3000000, year: 2032, prog: 300000 },
                      { label: "+ Emergency Fund (₹10L)", cat: "Emergency Fund", target: 1000000, year: 2026, prog: 200000 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          const newItem = {
                            id: `goal_${Date.now()}`,
                            goalType: preset.cat as any,
                            name: preset.label.replace("+ ", ""),
                            targetAmount: preset.target,
                            targetYear: preset.year,
                            currentProgress: preset.prog,
                          };
                          setState((prev) => ({ ...prev, goals: [...prev.goals, newItem] }));
                        }}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 hover:bg-sky-500/20 text-[11px] font-mono font-medium transition-all"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {state.goals.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3 bg-[var(--background)]/40">
                    <Target className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
                    <div className="text-xs font-semibold text-[var(--foreground)]">No financial goals defined yet</div>
                    <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                      Define concrete goal targets (e.g. Retirement Corpus, Home Buying, Higher Studies) to measure milestone progress. Click any quick add preset above to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {state.goals.map((gol, idx) => (
                      <div key={gol.id} className="p-4 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)] space-y-3 hover:border-sky-500/30 transition-all shadow-md">
                        {/* Header Row: Category, Name, & Delete Button */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          <div className="w-full sm:w-2/5 space-y-1">
                            <label className="text-xs font-medium text-slate-300 block">Goal Category</label>
                            <select
                              value={gol.goalType}
                              onChange={(e) => {
                                const updated = [...state.goals];
                                updated[idx].goalType = e.target.value as any;
                                setState({ ...state, goals: updated });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none"
                            >
                              {["Emergency Fund", "Home Purchase", "Vehicle Purchase", "Marriage", "Children Education", "Higher Studies", "Business Capital", "Financial Independence", "Retirement Corpus", "Travel & Experience", "Other Goal"].map((cat) => (
                                <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex-1 space-y-1">
                            <label className="text-xs font-medium text-slate-300 block">Goal Target Name</label>
                            <input
                              type="text"
                              value={gol.name}
                              onChange={(e) => {
                                const updated = [...state.goals];
                                updated[idx].name = e.target.value;
                                setState({ ...state, goals: updated });
                              }}
                              placeholder="e.g. FI/RE Retirement Corpus"
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-sky-400 focus:outline-none"
                            />
                          </div>

                          <button
                            onClick={() => {
                              const updated = state.goals.filter((_, i) => i !== idx);
                              setState({ ...state, goals: updated });
                            }}
                            title="Remove Goal"
                            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all shrink-0 self-end sm:self-center sm:mt-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Values Row: Target Amount, Current Progress, Target Year */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[var(--border)]/50">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300 block">Target Corpus (₹)</label>
                            <input
                              type="number"
                              value={gol.targetAmount || ""}
                              onChange={(e) => {
                                const updated = [...state.goals];
                                updated[idx].targetAmount = Number(e.target.value);
                                setState({ ...state, goals: updated });
                              }}
                              placeholder="₹0"
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300 block">Current Saved / Invested (₹)</label>
                            <input
                              type="number"
                              value={gol.currentProgress || ""}
                              onChange={(e) => {
                                const updated = [...state.goals];
                                updated[idx].currentProgress = Number(e.target.value);
                                setState({ ...state, goals: updated });
                              }}
                              placeholder="₹0"
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-300 block">Target Year</label>
                            <input
                              type="number"
                              value={gol.targetYear || ""}
                              onChange={(e) => {
                                const updated = [...state.goals];
                                updated[idx].targetYear = Number(e.target.value);
                                setState({ ...state, goals: updated });
                              }}
                              placeholder="e.g. 2035"
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Goal Completion Index</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-emerald-300">{metrics.scores.goals} <span className="text-xs font-normal text-emerald-400/60">/ 100</span></div>
                  </div>
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Financial Independence (FI/RE)</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-sky-300">{metrics.financialIndependenceProgress}% Achieved</div>
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
                    <label className="text-xs font-medium text-slate-300 block">Risk Appetite</label>
                    <select
                      value={state.riskProfile.riskAppetite}
                      onChange={(e) =>
                        setState({
                          ...state,
                          riskProfile: { ...state.riskProfile, riskAppetite: e.target.value as any },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none"
                    >
                      <option value="Conservative" className="bg-[#0f172a]">Conservative (Capital Preservation Focus)</option>
                      <option value="Moderate" className="bg-[#0f172a]">Moderate (Balanced Growth & Yield)</option>
                      <option value="Aggressive" className="bg-[#0f172a]">Aggressive (High Growth Equity / Venture)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300 block">Investment Horizon</label>
                    <select
                      value={state.riskProfile.investmentHorizon}
                      onChange={(e) =>
                        setState({
                          ...state,
                          riskProfile: { ...state.riskProfile, investmentHorizon: e.target.value as any },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none"
                    >
                      <option value="Short Term (< 3 Yrs)" className="bg-[#0f172a]">Short Term (&lt; 3 Years)</option>
                      <option value="Medium Term (3 - 7 Yrs)" className="bg-[#0f172a]">Medium Term (3 - 7 Years)</option>
                      <option value="Long Term (> 7 Yrs)" className="bg-[#0f172a]">Long Term (&gt; 7 Years)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300 block">Job & Revenue Security</label>
                    <select
                      value={state.riskProfile.jobSecurityRating}
                      onChange={(e) =>
                        setState({
                          ...state,
                          riskProfile: { ...state.riskProfile, jobSecurityRating: e.target.value as any },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-sky-400 focus:outline-none"
                    >
                      <option value="Very Secure" className="bg-[#0f172a]">Very Secure (High Moat / Government / MNC)</option>
                      <option value="Secure" className="bg-[#0f172a]">Secure (Established Market Role)</option>
                      <option value="Moderate" className="bg-[#0f172a]">Moderate (Cyclical Sector)</option>
                      <option value="Vulnerable" className="bg-[#0f172a]">Vulnerable (Early Startup / Unpredictable)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-300 block">Number of Financial Dependents</label>
                    <input
                      type="number"
                      value={state.riskProfile.dependentsCount}
                      onChange={(e) =>
                        setState({
                          ...state,
                          riskProfile: { ...state.riskProfile, dependentsCount: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-sky-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Risk Rating Index</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-amber-300">{metrics.riskRating}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Financial Risk Index</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-indigo-300">{metrics.financialRiskIndex} <span className="text-xs font-normal text-indigo-400/60">/ 100</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 11: FINANCIAL LITERACY ================= */}
            {activeStep === 11 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 space-y-2">
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
                    const getLevelLabel = (lvl: number) => {
                      if (lvl === 1) return "1 Novice";
                      if (lvl === 2) return "2 Basic";
                      if (lvl === 3) return "3 Competent";
                      if (lvl === 4) return "4 Advanced";
                      return "5 Expert";
                    };

                    return (
                      <div key={item.key} className="p-4 rounded-2xl bg-[var(--background)]/80 border border-[var(--border)] space-y-3 hover:border-sky-500/30 transition-all shadow-md">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-100">{item.label}</span>
                          <span className="font-mono font-bold text-sky-400">{currentVal} / 5</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((lvl) => {
                            let activeBg = "bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 font-black shadow-md ring-2 ring-sky-300";
                            if (currentVal === lvl) {
                              if (lvl >= 5) activeBg = "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md ring-2 ring-emerald-300";
                              else if (lvl === 4) activeBg = "bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black shadow-md ring-2 ring-indigo-300";
                              else if (lvl <= 2) activeBg = "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-md ring-2 ring-amber-300";
                            }

                            return (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => updateLiteracyField(item.key as any, lvl)}
                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  currentVal === lvl
                                    ? activeBg
                                    : "bg-[var(--background)] border border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500 font-medium"
                                }`}
                              >
                                {lvl}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Executive Section Summary Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-700/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center shadow-xl">
                  <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Literacy Rating Index</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-sky-300">
                      {metrics.scores.literacy >= 80 ? "Advanced Wealth Literacy" : "Competent Financial Literacy"}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <span className="text-xs font-medium text-slate-300 block">Financial Literacy Score</span>
                    <div className="text-base sm:text-lg font-extrabold font-mono text-indigo-300">{metrics.scores.literacy} <span className="text-xs font-normal text-indigo-400/60">/ 100</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 12: MASTER WEALTH HEALTH SUMMARY ================= */}
            {activeStep === 12 && (
              <div className="space-y-6 text-left">
                <div className="border-b border-[var(--border)] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 text-xs font-bold shadow-sm">
                        {metrics.financialStageBadge}
                      </span>
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight mt-2">
                      Financial Health & Wealth Summary
                    </h2>
                  </div>
                </div>

                {/* 1. Composite Master Score Dial & Key Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/60 flex flex-col items-center justify-center text-center space-y-1.5 shadow-2xl">
                    <span className="text-xs font-semibold text-slate-300 block">Financial Health Score</span>
                    <div className="text-6xl font-black font-mono text-white tracking-tight">
                      {metrics.financialHealthScore}
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono tracking-wider">OUT OF 100</span>
                    <div className="mt-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-md">
                      {metrics.stabilityRating}
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/60 space-y-4 shadow-2xl">
                    <span className="text-xs font-semibold text-slate-300 block">Net Worth & Cash Flow</span>
                    <div className="space-y-1">
                      <div className="text-3xl font-black font-mono text-white tracking-tight">{formatINR(metrics.netWorth)}</div>
                      <div className="text-xs font-medium text-slate-400">Total Net Asset Worth</div>
                    </div>
                    <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">Monthly Surplus:</span>
                      <span className={`font-mono font-bold px-2.5 py-1 rounded-lg ${metrics.totalMonthlyCashFlow >= 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                        {formatINR(metrics.totalMonthlyCashFlow)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700/60 space-y-4 shadow-2xl">
                    <span className="text-xs font-semibold text-slate-300 block">Liquidity & FI/RE Progress</span>
                    <div className="space-y-1">
                      <div className="text-3xl font-black font-mono text-sky-300 tracking-tight">{metrics.financialRunwayMonths} Months</div>
                      <div className="text-xs font-medium text-slate-400">Emergency Financial Runway</div>
                    </div>
                    <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-medium">FI/RE Milestone:</span>
                      <span className="font-mono font-bold text-sky-300 px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30">
                        {metrics.financialIndependenceProgress}% Achieved
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Financial Pillar Health Scores */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">Financial Pillar Health Scores</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
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
                    ].map((vector) => {
                      let barColor = "from-sky-400 to-blue-500";
                      let textColor = "text-sky-300 font-bold";
                      if (vector.score >= 70) {
                        barColor = "from-emerald-400 to-teal-500";
                        textColor = "text-emerald-300 font-bold";
                      } else if (vector.score < 40) {
                        barColor = "from-rose-500 to-amber-500";
                        textColor = "text-rose-300 font-bold";
                      }

                      return (
                        <div key={vector.name} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 space-y-2 hover:border-sky-500/40 transition-all shadow-md">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-100 font-semibold">{vector.name}</span>
                            <span className={`font-mono text-xs ${textColor}`}>
                              {vector.score}%
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                            <div className={`h-full rounded-full bg-gradient-to-r ${barColor}`} style={{ width: `${vector.score}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Strengths & Priority Focus Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3 shadow-xl">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Key Financial Strengths
                    </div>
                    <ul className="space-y-2 text-xs text-slate-100 font-medium list-disc list-inside leading-relaxed">
                      {metrics.topStrengths.map((str, i) => (
                        <li key={i} className="text-slate-200">{str}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3 shadow-xl">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                      <AlertTriangle className="w-5 h-5 text-rose-400" /> Priority Focus Areas & Risks
                    </div>
                    <ul className="space-y-2 text-xs text-slate-100 font-medium list-disc list-inside leading-relaxed">
                      {metrics.topWeaknesses.map((wk, i) => (
                        <li key={i} className="text-slate-200">{wk}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 4. Strategic Financial Roadmap */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">Strategic Wealth Action Plan</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {metrics.improvementRoadmap.map((item) => (
                      <div key={item.step} className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700/60 space-y-2 text-left hover:border-sky-500/40 transition-all shadow-lg">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black px-3 py-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-slate-950 shadow-md">
                            Step {item.step}
                          </span>
                          <span className="text-xs font-bold text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 shadow-sm">
                            {item.impact}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white pt-1">{item.title}</h4>
                        <p className="text-xs text-slate-200 leading-relaxed font-normal">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* --- STEP NAVIGATION CONTROLS --- */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--border-subtle)]">
          <button
            onClick={handleBack}
            disabled={activeStep === 1}
            className="wizard-nav-btn bg-[var(--surface-1)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>

          {activeStep < 12 ? (
            <button
              onClick={handleNext}
              className="wizard-nav-btn bg-sky-500 text-slate-950 text-xs shadow-md shadow-sky-500/20"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitFinancial}
              className="wizard-nav-btn bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs shadow-lg shadow-emerald-900/25"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitted ? "Update & Save Financial Data" : "Submit & Save Financial Data"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialModule;
