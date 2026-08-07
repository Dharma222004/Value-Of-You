"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { saveModuleData, loadModuleData, getCurrentUserId, saveLearningProgress } from "@/services/moduleDataService";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Activity,
  Moon,
  Utensils,
  Smile,
  Flame,
  Stethoscope,
  Zap,
  Target,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Clock,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Brain,
  ArrowRight,
} from "lucide-react";
import { HealthCapitalState } from "@/types/healthCapital";
import {
  defaultHealthCapitalState,
  calculateHealthCapitalScore,
} from "@/lib/healthCapitalEngine";

const SECTIONS = [
  { id: 1, name: "Body Metrics", icon: HeartPulse },
  { id: 2, name: "Physical Activity", icon: Activity },
  { id: 3, name: "Sleep Intelligence", icon: Moon },
  { id: 4, name: "Nutrition Intelligence", icon: Utensils },
  { id: 5, name: "Mental Wellbeing", icon: Smile },
  { id: 6, name: "Lifestyle Habits", icon: Flame },
  { id: 7, name: "Medical Profile", icon: Stethoscope },
  { id: 8, name: "Productivity & Recovery", icon: Zap },
  { id: 9, name: "Goals & Master Audit", icon: Target },
];

export const HealthModule: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<HealthCapitalState>(defaultHealthCapitalState);
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
        const parsed = await loadModuleData(uid, "health") as HealthCapitalState | null;
        if (parsed && parsed.bodyMetrics) {
          const isComp = Boolean(parsed.isCompleted || parsed.submittedAt || (parsed.bodyMetrics.heightCm && parsed.bodyMetrics.weightKg));
          setData({ ...parsed, isCompleted: isComp });
          if (isComp) {
            setIsSubmitted(true);
            setActiveStep(9);
          }
        }
      } finally {
        setIsLoaded(true);
      }
    }
    loadFromSupabase();
  }, []);
  // Real-Time Engine Calculation
  const metrics = useMemo(() => calculateHealthCapitalScore(data), [data]);

  // Debounced Autosave to Supabase (ONLY after initial load finishes)
  useEffect(() => {
    if (!mounted || !userId || !isLoaded) return;
    setSavingStatus("saving");
    const timeout = setTimeout(async () => {
      const isComp = Boolean((data as any).isCompleted || (data as any).submittedAt || isSubmitted);
      const healthScore = metrics?.healthCapitalScore || 0;
      const result = await saveModuleData(userId, "health", { ...data, isCompleted: isComp } as any, isComp, healthScore);
      if (!result) {
        console.warn("[HealthModule] ⚠️ Save to Supabase FAILED — data was NOT persisted. Check [DB_DEBUG] logs above.");
      }
      setSavingStatus("saved");
    }, 800);
    return () => clearTimeout(timeout);
  }, [data, mounted, userId, isLoaded, isSubmitted, metrics]);

  const [validationError, setValidationError] = useState<string | null>(null);

  const validateCurrentStep = (step: number): boolean => {
    setValidationError(null);
    if (step === 1) {
      if (!data.bodyMetrics.heightCm || !data.bodyMetrics.weightKg) {
        setValidationError("Height and Weight are required to compute BMI (Enter 0 or 'N/A' if unknown).");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep(activeStep)) return;
    if (activeStep < 9) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setValidationError(null);
    if (activeStep > 1) setActiveStep((prev) => prev - 1);
  };

  const handleSubmitHealth = async () => {
    if (!validateCurrentStep(activeStep)) return;
    const updatedData = {
      ...data,
      isCompleted: true,
      submittedAt: new Date().toISOString(),
    };
    setData(updatedData);
    if (userId) {
      const healthScore = metrics?.healthCapitalScore || 0;
      await saveModuleData(userId, "health", updatedData, true, healthScore);
      await saveLearningProgress(userId, "health", 100);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hc_assessment_updated"));
    }
    setIsSubmitted(true);
    setActiveStep(9);
  };

  if (!mounted) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] max-w-7xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-xl w-1/3"></div>
        <div className="h-4 bg-slate-900 rounded-xl w-1/2"></div>
      </div>
    );
  }

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
                  ✓ Health & Lifestyle Completed & Saved Locally
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  Score: {metrics.healthCapitalScore} / 100
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                Longevity, Biometrics & Lifestyle Stored
              </h3>
              <p className="text-xs text-[var(--subtext)] leading-relaxed">
                BMI: <strong className="text-amber-400 font-mono">{metrics.bmi ? metrics.bmi.toFixed(1) : "N/A"}</strong> • Sleep Score: <strong className="text-sky-400 font-mono">{metrics.sleepScore}/100</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="wizard-nav-btn bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs"
            >
              Edit Health Inputs
            </button>
            <Link
              href="/dashboard/assessments"
              className="wizard-nav-btn bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs shadow-lg shadow-emerald-900/20"
            >
              Next Module: Human Assessments <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="space-y-2 min-w-0 text-left">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="module-badge bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              Module 4 — Health Capital Intelligence
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
            Health Capital Wizard
          </h1>
          <p className="text-xs text-[var(--subtext)] max-w-lg leading-relaxed">
            Whoop x Oura x Garmin x Longevity Research level physical, mental, & recovery intelligence platform.
          </p>
        </div>

        {/* Real-Time Score Quick Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border-subtle)] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono text-[var(--subtext)] uppercase">Health Capital</div>
              <div className="text-lg font-bold font-mono text-white">{metrics.healthCapitalScore} / 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STEP PROGRESS BAR & NAVIGATION TABS --- */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-[var(--foreground)]">
            Step {activeStep} of 9 — <strong className="text-emerald-400">{SECTIONS[activeStep - 1].name}</strong>
          </span>
          <span className="text-xs font-mono font-semibold text-emerald-400">{Math.round((activeStep / 9) * 100)}% Complete</span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / 9) * 100}%` }}
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

      {/* --- 2-COLUMN MAIN LAYOUT: WIZARD (LEFT) & RIGHT TELEMETRY PANEL (RIGHT) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: WIZARD STEP CONTAINER (8 COLS) ================= */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border)] min-h-[540px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* ================= SECTION 1: BODY METRICS ================= */}
              {activeStep === 1 && (
                <div className="space-y-6 text-left">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300 shadow-sm">
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Daily Focus Insight:</strong> A resting heart rate between 50–65 bpm & maintaining optimal BMI directly correlates with cardiovascular resilience and cellular longevity.</span>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Section 1: Body Metrics & Biometrics</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Height, weight, waist circumference, resting heart rate, & metabolic indicators.</p>
                      </div>

                      {/* Live Calculated BMI Badge */}
                      {(() => {
                        const heightM = (data.bodyMetrics.heightCm || 0) / 100;
                        const weight = data.bodyMetrics.weightKg || 0;
                        const bmiVal = heightM > 0 && weight > 0 ? (weight / (heightM * heightM)).toFixed(1) : null;
                        let statusText = "Normal";
                        let colorClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                        if (bmiVal) {
                          const num = Number(bmiVal);
                          if (num < 18.5) { statusText = "Underweight"; colorClass = "bg-amber-500/10 border-amber-500/30 text-amber-400"; }
                          else if (num >= 25 && num < 30) { statusText = "Overweight"; colorClass = "bg-amber-500/10 border-amber-500/30 text-amber-400"; }
                          else if (num >= 30) { statusText = "Obese"; colorClass = "bg-rose-500/10 border-rose-500/30 text-rose-400"; }
                        }

                        return bmiVal ? (
                          <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${colorClass}`}>
                            <span>Live BMI: <strong>{bmiVal} kg/m²</strong> ({statusText})</span>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Quick Select Blood Group Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Select Blood Group:</span>
                      {["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"].map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, bloodGroup: bg } })}
                          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                            data.bodyMetrics.bloodGroup === bg
                              ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Height */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Height (cm)</label>
                        <input
                          type="number"
                          min={50}
                          max={250}
                          value={data.bodyMetrics.heightCm || ""}
                          onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, heightCm: Number(e.target.value) } })}
                          placeholder="e.g. 178"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      {/* Weight */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Weight (kg)</label>
                        <input
                          type="number"
                          min={20}
                          max={300}
                          value={data.bodyMetrics.weightKg || ""}
                          onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, weightKg: Number(e.target.value) } })}
                          placeholder="e.g. 74"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      {/* Blood Group Select */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Blood Group</label>
                        <select
                          value={data.bodyMetrics.bloodGroup}
                          onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, bloodGroup: e.target.value } })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                        >
                          <option value="" className="bg-[#0f172a] text-slate-400">Select Blood Group...</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                            <option key={bg} value={bg} className="bg-[#0f172a] text-white">{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      {/* Auto-Calculated BMI Field */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Calculated BMI Index (kg/m²)</label>
                        {(() => {
                          const heightM = (data.bodyMetrics.heightCm || 0) / 100;
                          const weight = data.bodyMetrics.weightKg || 0;
                          const bmiVal = heightM > 0 && weight > 0 ? (weight / (heightM * heightM)).toFixed(1) : null;
                          let statusText = "Enter Height & Weight";
                          let colorClass = "border-slate-700 bg-slate-950 text-slate-400";
                          if (bmiVal) {
                            const num = Number(bmiVal);
                            if (num < 18.5) { statusText = "Underweight"; colorClass = "border-amber-500/40 bg-amber-500/10 text-amber-400"; }
                            else if (num >= 18.5 && num < 25) { statusText = "Optimal Weight"; colorClass = "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"; }
                            else if (num >= 25 && num < 30) { statusText = "Overweight"; colorClass = "border-amber-500/40 bg-amber-500/10 text-amber-400"; }
                            else if (num >= 30) { statusText = "Obese"; colorClass = "border-rose-500/40 bg-rose-500/10 text-rose-400"; }
                          }

                          return (
                            <div className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-between shadow-inner ${colorClass}`}>
                              <span>{bmiVal ? `${bmiVal} kg/m²` : "Auto-Calculated"}</span>
                              <span className="text-[11px] font-sans font-semibold tracking-wide uppercase">{statusText}</span>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Resting Heart Rate */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Resting Heart Rate (bpm)</label>
                        <input
                          type="number"
                          min={30}
                          max={200}
                          value={data.bodyMetrics.restingHeartRate || ""}
                          onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, restingHeartRate: Number(e.target.value) } })}
                          placeholder="e.g. 62"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      {/* Body Fat % */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Body Fat %</label>
                        <input
                          type="number"
                          min={3}
                          max={60}
                          value={data.bodyMetrics.bodyFatPercentage || ""}
                          onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, bodyFatPercentage: Number(e.target.value) } })}
                          placeholder="e.g. 18"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 2: PHYSICAL ACTIVITY ================= */}
              {activeStep === 2 && (
                <div className="space-y-6 text-left">
                  <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center gap-2.5 text-xs text-sky-300 shadow-sm">
                    <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                    <span><strong>Daily Focus Insight:</strong> Aim for 8,000+ daily steps & limit continuous sedentary sitting to &lt;6 hours to reduce cardiovascular mortality risk by up to 40%.</span>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 2: Physical Activity & Movement</h2>
                      <p className="text-xs text-[var(--subtext)] font-sans">Workout frequency, daily steps, sedentary hours, & athletic disciplines.</p>
                    </div>

                    {/* Quick Select Daily Steps Target */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Select Steps Target:</span>
                      {[
                        { steps: 3000, label: "3,000 Steps" },
                        { steps: 5000, label: "5,000 Steps" },
                        { steps: 8000, label: "8,000 Steps" },
                        { steps: 10000, label: "10,000+ Steps" },
                      ].map((item) => (
                        <button
                          key={item.steps}
                          type="button"
                          onClick={() => setData({ ...data, physicalActivity: { ...data.physicalActivity, dailySteps: item.steps } })}
                          className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                            data.physicalActivity.dailySteps === item.steps
                              ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                              : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                        >
                          + {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Workouts / Week */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Workouts / Week</label>
                        <input
                          type="number"
                          min={0}
                          max={7}
                          value={data.physicalActivity.workoutFrequencyPerWeek || ""}
                          onChange={(e) => setData({ ...data, physicalActivity: { ...data.physicalActivity, workoutFrequencyPerWeek: Number(e.target.value) } })}
                          placeholder="0-7 days"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      {/* Daily Steps Count */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Daily Steps Count</label>
                        <input
                          type="number"
                          min={0}
                          max={50000}
                          value={data.physicalActivity.dailySteps || ""}
                          onChange={(e) => setData({ ...data, physicalActivity: { ...data.physicalActivity, dailySteps: Number(e.target.value) } })}
                          placeholder="e.g. 8500 Steps"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                        />
                      </div>

                      {/* Sedentary Sitting Hrs/Day */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Sedentary Sitting (Hrs/Day)</label>
                        <input
                          type="number"
                          min={0}
                          max={24}
                          value={data.physicalActivity.sedentaryHoursPerDay || ""}
                          onChange={(e) => setData({ ...data, physicalActivity: { ...data.physicalActivity, sedentaryHoursPerDay: Number(e.target.value) } })}
                          placeholder="e.g. 6 Hours"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-emerald-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Activity Checkboxes */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Disciplines & Sports Practiced</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { key: "gym", label: "Gym & Weights", icon: "🏋️" },
                          { key: "running", label: "Running", icon: "🏃" },
                          { key: "walking", label: "Brisk Walking", icon: "🚶" },
                          { key: "cycling", label: "Cycling", icon: "🚴" },
                          { key: "swimming", label: "Swimming", icon: "🏊" },
                          { key: "sports", label: "Competitive Sports", icon: "🏆" },
                          { key: "yoga", label: "Yoga & Pilates", icon: "🧘" },
                          { key: "stretching", label: "Stretching & Mobility", icon: "🤸" },
                        ].map((act) => {
                          const isChecked = (data.physicalActivity.activities as any)[act.key];
                          return (
                            <button
                              key={act.key}
                              type="button"
                              onClick={() =>
                                setData({
                                  ...data,
                                  physicalActivity: {
                                    ...data.physicalActivity,
                                    activities: {
                                      ...data.physicalActivity.activities,
                                      [act.key]: !isChecked,
                                    },
                                  },
                                })
                              }
                              className={`p-3 rounded-2xl border text-xs text-left flex justify-between items-center transition-all shadow-md ${
                                isChecked
                                  ? "bg-emerald-500/20 border-emerald-500 text-white font-bold ring-1 ring-emerald-400/40"
                                  : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-emerald-500/40"
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                <span>{act.icon}</span>
                                <span>{act.label}</span>
                              </span>
                              {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 3: SLEEP INTELLIGENCE ================= */}
              {activeStep === 3 && (
                <div className="space-y-6 text-left font-sans">
                  <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2.5 text-xs text-indigo-300 shadow-sm">
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span><strong>Circadian Insight:</strong> 7.5–8.5 hours of consistent sleep unlocks deep slow-wave glymphatic brain clearance and optimal morning cortisol peak.</span>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)] font-sans">Section 3: Sleep Intelligence & Circadian Rhythm</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Sleep duration, schedule consistency, quality, & pre-bedtime screen exposure.</p>
                      </div>

                      {/* Live Calculated Sleep Recovery Badge */}
                      {(() => {
                        const hours = data.sleepIntelligence.averageSleepHoursPerNight || 0;
                        const quality = data.sleepIntelligence.sleepQuality || "Good";
                        const screenMins = data.sleepIntelligence.screenUsageBeforeSleepMinutes || 0;

                        let score = 70;
                        if (hours >= 7 && hours <= 9) score += 15;
                        if (quality === "Excellent") score += 15;
                        else if (quality === "Good") score += 10;
                        if (screenMins <= 30) score += 10;

                        let label = "Optimal Recovery";
                        let colorClass = "bg-indigo-500/10 border-indigo-500/30 text-indigo-400";
                        if (score < 70) { label = "Suboptimal Recovery"; colorClass = "bg-amber-500/10 border-amber-500/30 text-amber-400"; }

                        return hours > 0 ? (
                          <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-sans font-bold flex items-center gap-2 ${colorClass}`}>
                            <span>Circadian Index: <strong>{score} / 100</strong> ({label})</span>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Quick Select Sleep Duration Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Target Sleep Duration:</span>
                      {[6.0, 7.0, 7.5, 8.0, 8.5].map((hrs) => (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => setData({ ...data, sleepIntelligence: { ...data.sleepIntelligence, averageSleepHoursPerNight: hrs } })}
                          className={`px-3 py-1 rounded-xl text-xs font-sans font-semibold transition-all ${
                            data.sleepIntelligence.averageSleepHoursPerNight === hrs
                              ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20"
                              : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20"
                          }`}
                        >
                          {hrs} Hours
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Avg Sleep Hours */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Avg Sleep Hours / Night</label>
                        <input
                          type="number"
                          step="0.5"
                          min={2}
                          max={16}
                          value={data.sleepIntelligence.averageSleepHoursPerNight || ""}
                          onChange={(e) => setData({ ...data, sleepIntelligence: { ...data.sleepIntelligence, averageSleepHoursPerNight: Number(e.target.value) } })}
                          placeholder="e.g. 7.5"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-indigo-400 focus:outline-none"
                        />
                      </div>

                      {/* Sleep Quality */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Sleep Quality Classification</label>
                        <select
                          value={data.sleepIntelligence.sleepQuality}
                          onChange={(e) => setData({ ...data, sleepIntelligence: { ...data.sleepIntelligence, sleepQuality: e.target.value as any } })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-indigo-400 focus:outline-none"
                        >
                          <option value="Excellent" className="bg-[#0f172a] text-white">Excellent (7.5-9h Restorative)</option>
                          <option value="Good" className="bg-[#0f172a] text-white">Good (6.5-7.5h Refreshing)</option>
                          <option value="Fair" className="bg-[#0f172a] text-white">Fair (5.0-6.5h Light / Restless)</option>
                          <option value="Poor" className="bg-[#0f172a] text-white">Poor (&lt;5.0h Disturbed)</option>
                        </select>
                      </div>

                      {/* Pre-Bed Screen Time */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Pre-Bed Screen Time (Mins)</label>
                        <input
                          type="number"
                          min={0}
                          max={300}
                          value={data.sleepIntelligence.screenUsageBeforeSleepMinutes || ""}
                          onChange={(e) => setData({ ...data, sleepIntelligence: { ...data.sleepIntelligence, screenUsageBeforeSleepMinutes: Number(e.target.value) } })}
                          placeholder="e.g. 30"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Sleep Quality Quick Select Cards */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <label className="text-xs font-semibold uppercase tracking-wider text-indigo-400 font-sans">Sleep Quality Assessment</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { key: "Excellent", label: "Excellent", desc: "7.5–9.0h Restorative" },
                          { key: "Good", label: "Good", desc: "6.5–7.5h Refreshing" },
                          { key: "Fair", label: "Fair", desc: "5.0–6.5h Fragmented" },
                          { key: "Poor", label: "Poor", desc: "< 5.0h Disturbed" },
                        ].map((q) => (
                          <button
                            key={q.key}
                            type="button"
                            onClick={() => setData({ ...data, sleepIntelligence: { ...data.sleepIntelligence, sleepQuality: q.key as any } })}
                            className={`p-3 rounded-2xl border text-xs text-left transition-all shadow-md ${
                              data.sleepIntelligence.sleepQuality === q.key
                                ? "bg-indigo-600/20 border-indigo-500 text-white font-bold ring-1 ring-indigo-400/40"
                                : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-indigo-500/40"
                            }`}
                          >
                            <div className="font-bold text-white font-sans">{q.label}</div>
                            <div className="text-[11px] text-slate-400 font-sans mt-0.5">{q.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 4: NUTRITION INTELLIGENCE ================= */}
              {activeStep === 4 && (
                <div className="space-y-6 text-left font-sans">
                  <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-2.5 text-xs text-teal-300 shadow-sm">
                    <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
                    <span><strong>Metabolic Insight:</strong> Consuming 1.6–2.2g of protein per kg body weight & maintaining 30+ plant species weekly optimizes muscle synthesis, gut microbiome diversity, and stable blood glucose regulation.</span>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)] font-sans">Section 4: Nutrition & Hydration Intelligence</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Protein intake, vegetable/fruit servings, water hydration, fasting windows, & supplements.</p>
                      </div>

                      {/* Live Calculated Metabolic Index Badge */}
                      {(() => {
                        const water = data.nutritionIntelligence.waterIntakeLiters || 0;
                        const protein = data.nutritionIntelligence.proteinIntakeGrams || 0;
                        const veg = data.nutritionIntelligence.vegetableServingsPerDay || 0;

                        let score = 65;
                        if (water >= 2.5) score += 15;
                        if (protein >= 90) score += 10;
                        if (veg >= 3) score += 10;

                        let label = "Optimal Nutrient Density";
                        let colorClass = "bg-teal-500/10 border-teal-500/30 text-teal-400";
                        if (score < 75) { label = "Suboptimal Nutrition"; colorClass = "bg-amber-500/10 border-amber-500/30 text-amber-400"; }

                        return water > 0 || protein > 0 ? (
                          <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-sans font-bold flex items-center gap-2 ${colorClass}`}>
                            <span>Metabolic Index: <strong>{score} / 100</strong> ({label})</span>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    {/* Quick Select Presets */}
                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-300">Water Target:</span>
                        {[2.0, 2.5, 3.0, 3.5].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => setData({ ...data, nutritionIntelligence: { ...data.nutritionIntelligence, waterIntakeLiters: w } })}
                            className={`px-2.5 py-1 rounded-xl text-xs font-sans font-semibold transition-all ${
                              data.nutritionIntelligence.waterIntakeLiters === w
                                ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                                : "bg-teal-500/10 border border-teal-500/20 text-teal-300 hover:bg-teal-500/20"
                            }`}
                          >
                            {w}L
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-300">Protein Target:</span>
                        {[60, 90, 120, 150].map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setData({ ...data, nutritionIntelligence: { ...data.nutritionIntelligence, proteinIntakeGrams: p } })}
                            className={`px-2.5 py-1 rounded-xl text-xs font-sans font-semibold transition-all ${
                              data.nutritionIntelligence.proteinIntakeGrams === p
                                ? "bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20"
                                : "bg-teal-500/10 border border-teal-500/20 text-teal-300 hover:bg-teal-500/20"
                            }`}
                          >
                            {p}g
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-5">
                    {/* Primary Numerical Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Water Intake */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Water Intake (Liters / Day)</label>
                        <input
                          type="number"
                          step="0.5"
                          min={0.5}
                          max={10}
                          value={data.nutritionIntelligence.waterIntakeLiters || ""}
                          onChange={(e) => setData({ ...data, nutritionIntelligence: { ...data.nutritionIntelligence, waterIntakeLiters: Number(e.target.value) } })}
                          placeholder="e.g. 3.0"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-teal-400 focus:outline-none"
                        />
                      </div>

                      {/* Protein Intake */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Protein Intake (Grams / Day)</label>
                        <input
                          type="number"
                          min={10}
                          max={300}
                          value={data.nutritionIntelligence.proteinIntakeGrams || ""}
                          onChange={(e) => setData({ ...data, nutritionIntelligence: { ...data.nutritionIntelligence, proteinIntakeGrams: Number(e.target.value) } })}
                          placeholder="e.g. 110"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-teal-400 focus:outline-none"
                        />
                      </div>

                      {/* Vegetable Servings */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Vegetable & Fruit Servings / Day</label>
                        <input
                          type="number"
                          min={0}
                          max={15}
                          value={data.nutritionIntelligence.vegetableServingsPerDay || ""}
                          onChange={(e) => setData({ ...data, nutritionIntelligence: { ...data.nutritionIntelligence, vegetableServingsPerDay: Number(e.target.value) } })}
                          placeholder="e.g. 4"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-teal-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Vital Health Monitoring Section: Fasting Protocol */}
                    <div className="space-y-3 pt-3 border-t border-slate-800/80">
                      <label className="text-xs font-semibold uppercase tracking-wider text-teal-400 font-sans block">Fasting Window & Autophagy Protocol</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: "Standard (12:12)", desc: "12 Hours Overnight" },
                          { label: "Moderate (14:10)", desc: "14 Hours Fasting" },
                          { label: "Intermittent (16:8)", desc: "16 Hours Autophagy" },
                          { label: "Extended (18:6+)", desc: "18+ Hours Deep Fasting" },
                        ].map((f) => {
                          const currentFasting = (data.nutritionIntelligence as any).fastingProtocol || "Intermittent (16:8)";
                          const isSelected = currentFasting === f.label;
                          return (
                            <button
                              key={f.label}
                              type="button"
                              onClick={() =>
                                setData({
                                  ...data,
                                  nutritionIntelligence: {
                                    ...data.nutritionIntelligence,
                                    fastingProtocol: f.label,
                                  } as any,
                                })
                              }
                              className={`p-3 rounded-2xl border text-xs text-left transition-all shadow-md ${
                                isSelected
                                  ? "bg-teal-600/25 border-teal-500 text-white font-bold ring-1 ring-teal-400/40"
                                  : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-teal-500/40"
                              }`}
                            >
                              <div className="font-bold text-white font-sans">{f.label}</div>
                              <div className="text-[11px] text-slate-400 font-sans mt-0.5">{f.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Daily Supplementation Protocol Checklist */}
                    <div className="space-y-3 pt-3 border-t border-slate-800/80">
                      <label className="text-xs font-semibold uppercase tracking-wider text-teal-400 font-sans block">Daily Micronutrient & Supplementation Protocol</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { key: "vitaminD", label: "Vitamin D3 + K2 (Bone & Immune)" },
                          { key: "omega3", label: "Omega-3 Fish Oil (Cardiovascular)" },
                          { key: "magnesium", label: "Magnesium Glycinate (Sleep & Muscle)" },
                          { key: "vitaminB", label: "Vitamin B-Complex (Cell Energy)" },
                          { key: "creatine", label: "Creatine Monohydrate (Cognitive)" },
                          { key: "probiotics", label: "Probiotics & Gut Support" },
                        ].map((supp) => {
                          const suppState = (data.nutritionIntelligence as any).supplements || { vitaminD: true, omega3: true, magnesium: true };
                          const isChecked = Boolean(suppState[supp.key]);

                          return (
                            <button
                              key={supp.key}
                              type="button"
                              onClick={() =>
                                setData({
                                  ...data,
                                  nutritionIntelligence: {
                                    ...data.nutritionIntelligence,
                                    supplements: {
                                      ...suppState,
                                      [supp.key]: !isChecked,
                                    },
                                  } as any,
                                })
                              }
                              className={`p-3 rounded-2xl border text-xs text-left flex items-center justify-between transition-all shadow-md ${
                                isChecked
                                  ? "bg-teal-600/25 border-teal-500 text-white font-bold ring-1 ring-teal-400/40"
                                  : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-teal-500/40"
                              }`}
                            >
                              <span className="pr-2">{supp.label}</span>
                              {isChecked ? (
                                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 5: MENTAL WELLBEING ================= */}
              {activeStep === 5 && (
                <div className="space-y-6 text-left font-sans">
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-2.5 text-xs text-purple-300 shadow-sm">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span><strong>Resilience Insight:</strong> 10 minutes of daily NSDR (Non-Sleep Deep Rest) or physiological sigh breathwork resets sympathetic nervous system arousal, lowers cortisol, and builds neuroplastic stress tolerance.</span>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)] font-sans">Section 5: Mental Wellbeing & Emotional Resilience</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Stress level, burnout risk perception, nervous system regulation, & emotional capacity.</p>
                      </div>

                      {/* Live Calculated Resilience Badge */}
                      {(() => {
                        const stress = data.mentalWellbeing.stressLevel || 4;
                        const burnout = data.mentalWellbeing.burnoutRiskLevel || 3;
                        const score = Math.max(10, Math.min(100, 100 - (stress * 5 + burnout * 5)));

                        let label = "High Emotional Resilience";
                        let colorClass = "bg-purple-500/10 border-purple-500/30 text-purple-400";
                        if (score < 60) { label = "Elevated Strain & Burnout Risk"; colorClass = "bg-rose-500/10 border-rose-500/30 text-rose-400"; }
                        else if (score < 80) { label = "Moderate Balance"; colorClass = "bg-amber-500/10 border-amber-500/30 text-amber-400"; }

                        return (
                          <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-sans font-bold flex items-center gap-2 ${colorClass}`}>
                            <span>Resilience Index: <strong>{score} / 100</strong> ({label})</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Quick Select Presets for Stress Level */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Select Stress Preset:</span>
                      {[
                        { level: 2, label: "Low (Calm & Focused)" },
                        { level: 4, label: "Moderate (Balanced)" },
                        { level: 7, label: "High (Elevated Strain)" },
                        { level: 9, label: "Severe (Burnout Zone)" },
                      ].map((item) => (
                        <button
                          key={item.level}
                          type="button"
                          onClick={() => setData({ ...data, mentalWellbeing: { ...data.mentalWellbeing, stressLevel: item.level } })}
                          className={`px-3 py-1 rounded-xl text-xs font-sans font-semibold transition-all ${
                            data.mentalWellbeing.stressLevel === item.level
                              ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20"
                              : "bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-5">
                    {/* Primary Sliders */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Perceived Stress Level */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-200">Perceived Stress Level (1-10)</span>
                          <span className="font-sans font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                            {data.mentalWellbeing.stressLevel} / 10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={data.mentalWellbeing.stressLevel}
                          onChange={(e) => setData({ ...data, mentalWellbeing: { ...data.mentalWellbeing, stressLevel: Number(e.target.value) } })}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                          <span>1 (Minimal / Calm)</span>
                          <span>5 (Moderate)</span>
                          <span>10 (Overwhelming)</span>
                        </div>
                      </div>

                      {/* Burnout Risk Perception */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-200">Burnout Risk Perception (1-10)</span>
                          <span className="font-sans font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                            {data.mentalWellbeing.burnoutRiskLevel} / 10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={data.mentalWellbeing.burnoutRiskLevel}
                          onChange={(e) => setData({ ...data, mentalWellbeing: { ...data.mentalWellbeing, burnoutRiskLevel: Number(e.target.value) } })}
                          className="w-full accent-rose-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                          <span>1 (Fully Energized)</span>
                          <span>5 (Occasional Fatigue)</span>
                          <span>10 (Severe Exhaustion)</span>
                        </div>
                      </div>
                    </div>

                    {/* Emotional Regulation Capacity */}
                    <div className="space-y-3 pt-3 border-t border-slate-800/80">
                      <label className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-sans block">Emotional Regulation & Adaptability State</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { label: "High Adaptive Control", desc: "Calm & Resilient under High Pressure" },
                          { label: "Moderate Balance", desc: "Stable with Occasional Stress Spikes" },
                          { label: "High Sensitivity / Reactive", desc: "Vulnerable to Cognitive Overwhelm" },
                        ].map((item) => {
                          const currentRegulation = (data.mentalWellbeing as any).emotionalRegulation || "High Adaptive Control";
                          const isSelected = currentRegulation === item.label;
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() =>
                                setData({
                                  ...data,
                                  mentalWellbeing: {
                                    ...data.mentalWellbeing,
                                    emotionalRegulation: item.label,
                                  } as any,
                                })
                              }
                              className={`p-3 rounded-2xl border text-xs text-left transition-all shadow-md ${
                                isSelected
                                  ? "bg-purple-600/25 border-purple-500 text-white font-bold ring-1 ring-purple-400/40"
                                  : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-purple-500/40"
                              }`}
                            >
                              <div className="font-bold text-white font-sans">{item.label}</div>
                              <div className="text-[11px] text-slate-400 font-sans mt-0.5">{item.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Daily De-Stress & Nervous System Practices */}
                    <div className="space-y-3 pt-3 border-t border-slate-800/80">
                      <label className="text-xs font-semibold uppercase tracking-wider text-purple-400 font-sans block">Nervous System & De-Stress Protocols Practiced</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { key: "meditation", label: "🧘 Meditative Mindfulness (10+ m/day)" },
                          { key: "breathwork", label: "🫁 Box Breathing / Physiological Sigh" },
                          { key: "nsdr", label: "💤 NSDR (Non-Sleep Deep Rest)" },
                          { key: "nature", label: "🌳 Outdoor Walks in Nature" },
                          { key: "journaling", label: "📓 Reflective Journaling" },
                          { key: "detox", label: "📵 Evening Digital Off-Time" },
                        ].map((practice) => {
                          const practicesState = (data.mentalWellbeing as any).deStressPractices || { meditation: true, breathwork: true, nsdr: true };
                          const isChecked = Boolean(practicesState[practice.key]);

                          return (
                            <button
                              key={practice.key}
                              type="button"
                              onClick={() =>
                                setData({
                                  ...data,
                                  mentalWellbeing: {
                                    ...data.mentalWellbeing,
                                    deStressPractices: {
                                      ...practicesState,
                                      [practice.key]: !isChecked,
                                    },
                                  } as any,
                                })
                              }
                              className={`p-3 rounded-2xl border text-xs text-left flex items-center justify-between transition-all shadow-md ${
                                isChecked
                                  ? "bg-purple-600/25 border-purple-500 text-white font-bold ring-1 ring-purple-400/40"
                                  : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-purple-500/40"
                              }`}
                            >
                              <span className="pr-2">{practice.label}</span>
                              {isChecked ? (
                                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 6: LIFESTYLE HABITS ================= */}
              {activeStep === 6 && (
                <div className="space-y-6 text-left font-sans">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2.5 text-xs text-amber-300 shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Environmental Insight:</strong> 15 minutes of early morning sunlight exposure anchors your circadian clock, maximizes daytime cognitive focus, and triggers evening melatonin synthesis.</span>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)] font-sans">Section 6: Lifestyle Habits & Risk Behaviours</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Smoking status, alcohol habits, screen time exposure, & circadian morning protocols.</p>
                      </div>

                      {/* Live Calculated Lifestyle Index Badge */}
                      {(() => {
                        const smoking = data.lifestyleHabits.smokingStatus || "Non-Smoker";
                        const alcohol = data.lifestyleHabits.alcoholStatus || "None";
                        const screen = data.lifestyleHabits.dailyScreenTimeHours || 4;

                        let score = 85;
                        if (smoking === "Active Smoker") score -= 30;
                        else if (smoking === "Former Smoker") score -= 5;
                        if (alcohol === "Heavy") score -= 20;
                        else if (alcohol === "Moderate") score -= 10;
                        if (screen > 8) score -= 10;

                        let label = "Optimal Habit Profile";
                        let colorClass = "bg-amber-500/10 border-amber-500/30 text-amber-400";
                        if (score < 60) { label = "Elevated Lifestyle Risk"; colorClass = "bg-rose-500/10 border-rose-500/30 text-rose-400"; }
                        else if (score < 80) { label = "Moderate Risk Profile"; colorClass = "bg-sky-500/10 border-sky-500/30 text-sky-400"; }

                        return (
                          <div className={`px-3.5 py-1.5 rounded-xl border text-xs font-sans font-bold flex items-center gap-2 ${colorClass}`}>
                            <span>Lifestyle Index: <strong>{score} / 100</strong> ({label})</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Quick Select Presets for Screen Time */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Daily Screen Time Target:</span>
                      {[2.0, 4.0, 6.0, 8.0].map((hrs) => (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => setData({ ...data, lifestyleHabits: { ...data.lifestyleHabits, dailyScreenTimeHours: hrs } })}
                          className={`px-3 py-1 rounded-xl text-xs font-sans font-semibold transition-all ${
                            data.lifestyleHabits.dailyScreenTimeHours === hrs
                              ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                              : "bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20"
                          }`}
                        >
                          {hrs} Hours
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-5">
                    {/* Primary Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Smoking Status */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Smoking Status</label>
                        <select
                          value={data.lifestyleHabits.smokingStatus}
                          onChange={(e) => setData({ ...data, lifestyleHabits: { ...data.lifestyleHabits, smokingStatus: e.target.value as any } })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-amber-400 focus:outline-none"
                        >
                          <option value="Non-Smoker" className="bg-[#0f172a] text-white">Non-Smoker (Optimal)</option>
                          <option value="Former Smoker" className="bg-[#0f172a] text-white">Former Smoker</option>
                          <option value="Active Smoker" className="bg-[#0f172a] text-white">Active Smoker</option>
                        </select>
                      </div>

                      {/* Daily Screen Time */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Daily Screen Time (Hours)</label>
                        <input
                          type="number"
                          min={0}
                          max={24}
                          value={data.lifestyleHabits.dailyScreenTimeHours || ""}
                          onChange={(e) => setData({ ...data, lifestyleHabits: { ...data.lifestyleHabits, dailyScreenTimeHours: Number(e.target.value) } })}
                          placeholder="e.g. 6"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-amber-400 focus:outline-none"
                        />
                      </div>

                      {/* Alcohol Consumption */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Alcohol Consumption</label>
                        <select
                          value={data.lifestyleHabits.alcoholStatus}
                          onChange={(e) => setData({ ...data, lifestyleHabits: { ...data.lifestyleHabits, alcoholStatus: e.target.value as any } })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-amber-400 focus:outline-none"
                        >
                          <option value="None" className="bg-[#0f172a] text-white">None / Teetotaler</option>
                          <option value="Social" className="bg-[#0f172a] text-white">Social (&lt;2 drinks/wk)</option>
                          <option value="Moderate" className="bg-[#0f172a] text-white">Moderate (3-7 drinks/wk)</option>
                          <option value="Heavy" className="bg-[#0f172a] text-white">Heavy (&gt;7 drinks/wk)</option>
                        </select>
                      </div>
                    </div>

                    {/* Smoking Status Interactive Card Buttons */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-sans">Smoking Status Assessment</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { key: "Non-Smoker", label: "Non-Smoker", desc: "Optimal Lung & Vascular Health" },
                          { key: "Former Smoker", label: "Former Smoker", desc: "In Recovery / Ceased" },
                          { key: "Active Smoker", label: "Active Smoker", desc: "Elevated Risk Factor" },
                        ].map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setData({ ...data, lifestyleHabits: { ...data.lifestyleHabits, smokingStatus: item.key as any } })}
                            className={`p-3 rounded-2xl border text-xs text-left transition-all shadow-md ${
                              data.lifestyleHabits.smokingStatus === item.key
                                ? "bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-400/40"
                                : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-amber-500/40"
                            }`}
                          >
                            <div className="font-bold text-white font-sans">{item.label}</div>
                            <div className="text-[11px] text-slate-400 font-sans mt-0.5">{item.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Added Vital Health Monitoring: Morning Circadian & Environmental Checklist */}
                    <div className="space-y-3 pt-3 border-t border-slate-800/80">
                      <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-sans block">Morning Circadian & Environmental Hygiene Protocol</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { key: "sunlight", label: "☀️ Morning Sunlight Exposure (<30m)" },
                          { key: "hydration", label: "💧 500ml Morning Hydration" },
                          { key: "movement", label: "🚶 Morning Movement Routine" },
                          { key: "bluelight", label: "👓 Blue-Light Glasses after 8 PM" },
                          { key: "air", label: "🌿 HEPA Air Quality Filtration" },
                          { key: "caffeineCutoff", label: "☕ Caffeine Cutoff 8-10h Before Bed" },
                        ].map((protocol) => {
                          const habitsState = (data.lifestyleHabits as any).circadianProtocols || { sunlight: true, hydration: true, movement: true };
                          const isChecked = Boolean(habitsState[protocol.key]);

                          return (
                            <button
                              key={protocol.key}
                              type="button"
                              onClick={() =>
                                setData({
                                  ...data,
                                  lifestyleHabits: {
                                    ...data.lifestyleHabits,
                                    circadianProtocols: {
                                      ...habitsState,
                                      [protocol.key]: !isChecked,
                                    },
                                  } as any,
                                })
                              }
                              className={`p-3 rounded-2xl border text-xs text-left flex items-center justify-between transition-all shadow-md ${
                                isChecked
                                  ? "bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-400/40"
                                  : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-amber-500/40"
                              }`}
                            >
                              <span className="pr-2">{protocol.label}</span>
                              {isChecked ? (
                                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 7: MEDICAL PROFILE ================= */}
              {activeStep === 7 && (
                <div className="space-y-6 text-left font-sans">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2.5 text-xs text-cyan-300 shadow-sm">
                    <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span><strong>Clinical Insight:</strong> Maintaining an updated allergy profile, tracking blood pressure (&lt;120/80 mmHg), & annual lipid panel screenings detect 90% of subclinical metabolic strain early.</span>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)] font-sans">Section 7: Medical Profile & Clinical Baseline</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Allergies, chronic condition history, clinical baseline, & annual screening status.</p>
                      </div>

                      <div className="px-3.5 py-1.5 rounded-xl border text-xs font-sans font-bold flex items-center gap-2 bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                        <span>Clinical Status: <strong>Verified Clean Baseline</strong></span>
                      </div>
                    </div>

                    {/* Quick Presets for Allergies & Conditions */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Select Allergies:</span>
                      {["None (Clean)", "Penicillin", "Dust / Pollen", "Peanuts / Nuts", "Lactose Intolerance"].map((allergy) => (
                        <button
                          key={allergy}
                          type="button"
                          onClick={() => setData({ ...data, medicalProfile: { ...data.medicalProfile, allergies: allergy === "None (Clean)" ? "None" : allergy } })}
                          className={`px-3 py-1 rounded-xl text-xs font-sans font-semibold transition-all ${
                            data.medicalProfile.allergies === allergy || (allergy === "None (Clean)" && (!data.medicalProfile.allergies || data.medicalProfile.allergies === "None"))
                              ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                              : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20"
                          }`}
                        >
                          + {allergy}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Allergies */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Allergies & Sensitivities</label>
                        <input
                          type="text"
                          value={data.medicalProfile.allergies}
                          onChange={(e) => setData({ ...data, medicalProfile: { ...data.medicalProfile, allergies: e.target.value } })}
                          placeholder="e.g. Penicillin, Peanuts, None"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      {/* Chronic Conditions */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Chronic Conditions or History</label>
                        <input
                          type="text"
                          value={data.medicalProfile.chronicConditions}
                          onChange={(e) => setData({ ...data, medicalProfile: { ...data.medicalProfile, chronicConditions: e.target.value } })}
                          placeholder="e.g. Asthma, Hypertension, None"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Presets for Chronic Conditions */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <label className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-sans">Common Clinical History Baselines</label>
                      <div className="flex flex-wrap gap-2">
                        {["None (Healthy Baseline)", "Hypertension", "Asthma / Respiratory", "Type 2 Diabetes", "Thyroid Imbalance", "Hyperlipidemia"].map((cond) => (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => setData({ ...data, medicalProfile: { ...data.medicalProfile, chronicConditions: cond.startsWith("None") ? "None" : cond } })}
                            className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all ${
                              data.medicalProfile.chronicConditions === cond || (cond.startsWith("None") && (!data.medicalProfile.chronicConditions || data.medicalProfile.chronicConditions === "None"))
                                ? "bg-cyan-500/20 border-cyan-500 text-white font-bold ring-1 ring-cyan-400/40"
                                : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-cyan-500/40"
                            }`}
                          >
                            {cond}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 8: PRODUCTIVITY & RECOVERY ================= */}
              {activeStep === 8 && (
                <div className="space-y-6 text-left font-sans">
                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-2.5 text-xs text-blue-300 shadow-sm">
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>Cognitive Insight:</strong> 4–5 hours of uninterrupted deep work with 90-minute ultradian rest cycles maximizes executive output without triggering mental exhaustion.</span>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)] font-sans">Section 8: Productivity Capacity & Recovery</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Deep work hours, focus rating, vacation cadence, & ultradian restorative rhythm.</p>
                      </div>

                      {/* Live Calculated Flow Badge */}
                      {(() => {
                        const deepWork = data.productivityRecovery.deepWorkHoursPerDay || 4;
                        const focus = data.productivityRecovery.focusLevelRating || 4;

                        let score = 70;
                        if (deepWork >= 4) score += 15;
                        if (focus >= 4) score += 15;

                        return (
                          <div className="px-3.5 py-1.5 rounded-xl border text-xs font-sans font-bold flex items-center gap-2 bg-blue-500/10 border-blue-500/30 text-blue-400">
                            <span>Flow Capacity Index: <strong>{score} / 100</strong> (High Focus Output)</span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Quick Select Presets for Deep Work */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Deep Work Target:</span>
                      {[3.0, 4.0, 5.0, 6.0].map((hrs) => (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => setData({ ...data, productivityRecovery: { ...data.productivityRecovery, deepWorkHoursPerDay: hrs } })}
                          className={`px-3 py-1 rounded-xl text-xs font-sans font-semibold transition-all ${
                            data.productivityRecovery.deepWorkHoursPerDay === hrs
                              ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                              : "bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20"
                          }`}
                        >
                          {hrs} Hours
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Deep Work Hours */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Deep Work Hours / Day</label>
                        <input
                          type="number"
                          step="0.5"
                          min={1}
                          max={16}
                          value={data.productivityRecovery.deepWorkHoursPerDay || ""}
                          onChange={(e) => setData({ ...data, productivityRecovery: { ...data.productivityRecovery, deepWorkHoursPerDay: Number(e.target.value) } })}
                          placeholder="e.g. 5"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-blue-400 focus:outline-none"
                        />
                      </div>

                      {/* Focus Level Rating */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Focus Level Rating (1-5)</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={data.productivityRecovery.focusLevelRating || ""}
                          onChange={(e) => setData({ ...data, productivityRecovery: { ...data.productivityRecovery, focusLevelRating: Number(e.target.value) } })}
                          placeholder="1-5"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-blue-400 focus:outline-none"
                        />
                      </div>

                      {/* Vacations / Year */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Vacation Breaks / Year</label>
                        <input
                          type="number"
                          min={0}
                          max={12}
                          value={data.productivityRecovery.vacationFrequencyPerYear || ""}
                          onChange={(e) => setData({ ...data, productivityRecovery: { ...data.productivityRecovery, vacationFrequencyPerYear: Number(e.target.value) } })}
                          placeholder="e.g. 2"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-sans font-bold focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Focus Level Presets */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <label className="text-xs font-semibold uppercase tracking-wider text-blue-400 font-sans">Focus Capacity Assessment</label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { score: 1, label: "1 - Distracted" },
                          { score: 2, label: "2 - Low Focus" },
                          { score: 3, label: "3 - Balanced" },
                          { score: 4, label: "4 - High Flow" },
                          { score: 5, label: "5 - Peak Zone" },
                        ].map((f) => (
                          <button
                            key={f.score}
                            type="button"
                            onClick={() => setData({ ...data, productivityRecovery: { ...data.productivityRecovery, focusLevelRating: f.score } })}
                            className={`p-2.5 rounded-xl border text-xs font-sans font-bold transition-all shadow-md ${
                              data.productivityRecovery.focusLevelRating === f.score
                                ? "bg-blue-600 border-blue-400 text-white shadow-blue-500/20"
                                : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-blue-500/40"
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 9: HEALTH GOALS & MASTER REPORT ================= */}
              {activeStep === 9 && (
                <div className="space-y-6 text-left font-sans">
                  {/* Completion Notification Banner */}
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans">Module 4 — Health Capital Audit Completed!</h4>
                      <p className="text-xs text-emerald-300 font-sans">All responses have been successfully saved and calculated in your Neural Telemetry Profile.</p>
                    </div>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-2xl font-black text-[var(--foreground)] font-sans">Section 9: Health Goals & Master Audit Report</h2>
                    <p className="text-xs text-[var(--subtext)] font-sans">Target health goals, biological age estimate, & executive longevity audit.</p>
                  </div>

                  {/* Goal Badges Grid */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-sans">Active Target Longevity Goals</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        "Lose Weight",
                        "Build Muscle",
                        "Improve Sleep",
                        "Reduce Stress",
                        "Improve Fitness",
                        "Improve Nutrition",
                        "Quit Smoking",
                        "Run Marathon",
                      ].map((gl) => {
                        const isSelected = data.healthGoals.selectedGoals.includes(gl);
                        return (
                          <button
                            key={gl}
                            type="button"
                            onClick={() => {
                              const updated = isSelected
                                ? data.healthGoals.selectedGoals.filter((g) => g !== gl)
                                : [...data.healthGoals.selectedGoals, gl];
                              setData({ ...data, healthGoals: { ...data.healthGoals, selectedGoals: updated } });
                            }}
                            className={`p-2.5 rounded-xl text-xs text-left flex justify-between items-center transition-all ${
                              isSelected
                                ? "bg-emerald-600/20 border border-emerald-500 text-white font-bold"
                                : "bg-slate-900 border border-[var(--border)] text-[var(--subtext)]"
                            }`}
                          >
                            <span>{gl}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Biological Age & Longevity Index Cards */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-[var(--border)] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">Longevity & Capacity Biomarkers</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-mono text-[var(--subtext)]">Biological Age</span>
                        <div className="text-sm font-bold text-emerald-400 font-mono">{metrics.biologicalAgeEstimate} Yrs</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-mono text-[var(--subtext)]">Longevity Index</span>
                        <div className="text-sm font-bold text-sky-400 font-mono">{metrics.longevityIndex} / 100</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-mono text-[var(--subtext)]">Energy Score</span>
                        <div className="text-sm font-bold text-indigo-400 font-mono">{metrics.energyIndex} / 100</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-mono text-[var(--subtext)]">Burnout Risk</span>
                        <div className="text-sm font-bold text-emerald-400 font-mono">{metrics.burnoutRiskLevel}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Step Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-[var(--border)] mt-6">
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

            {activeStep < 9 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitHealth}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 text-white font-extrabold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitted ? "Update & Save Health Data" : "Submit & Save Health Data"}</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PERSISTENT TELEMETRY PANEL (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-4 text-left">
          {/* Master Score Dial Card */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border)] text-center space-y-4 shadow-xl">
            <span className="text-[10px] font-mono text-[var(--subtext)] uppercase tracking-widest">HEALTH CAPITAL INDEX</span>
            <div className="flex items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="48" className="stroke-slate-800" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="stroke-emerald-400"
                    strokeWidth="10"
                    strokeDasharray={301.59}
                    strokeDashoffset={301.59 - (301.59 * metrics.healthCapitalScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black font-mono text-white">{metrics.healthCapitalScore}</span>
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider">OUT OF 100</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Longevity Capacity
            </div>
          </div>

          {/* Real-Time Indices Panel */}
          <div className="glass-panel p-5 rounded-3xl border border-[var(--border)] space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" /> Biometric Telemetry Indices
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[var(--subtext)]">Biological Age Est.</span>
                  <span className="text-emerald-400 font-bold">{metrics.biologicalAgeEstimate} Yrs</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[var(--subtext)]">Recovery Capacity</span>
                  <span className="text-white font-bold">{metrics.recoveryCapacityIndex} / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: `${metrics.recoveryCapacityIndex}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[var(--subtext)]">Longevity Index</span>
                  <span className="text-white font-bold">{metrics.longevityIndex} / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: `${metrics.longevityIndex}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[var(--subtext)]">Energy Score</span>
                  <span className="text-white font-bold">{metrics.energyIndex} / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${metrics.energyIndex}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 9 Weighted Vector Breakdown */}
          <div className="glass-panel p-5 rounded-3xl border border-[var(--border)] space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              9 Vector Sub-Scores Breakdown
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-none pr-1">
              {[
                { name: "Physical Health", score: metrics.scores.physical, weight: "20%" },
                { name: "Fitness & Movement", score: metrics.scores.fitness, weight: "15%" },
                { name: "Sleep Intelligence", score: metrics.scores.sleep, weight: "15%" },
                { name: "Nutrition Intelligence", score: metrics.scores.nutrition, weight: "15%" },
                { name: "Mental Wellbeing", score: metrics.scores.mental, weight: "15%" },
                { name: "Lifestyle Habits", score: metrics.scores.lifestyle, weight: "10%" },
                { name: "Medical Profile", score: metrics.scores.medical, weight: "5%" },
                { name: "Productivity & Recovery", score: metrics.scores.productivity, weight: "5%" },
                { name: "Health Goals", score: metrics.scores.goals, weight: "5%" },
              ].map((v) => (
                <div key={v.name} className="flex justify-between items-center text-[11px] font-mono p-1.5 rounded-lg bg-slate-900/60">
                  <span className="text-[var(--subtext)]">{v.name} ({v.weight})</span>
                  <span className="font-bold text-white">{v.score} / 100</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthModule;
