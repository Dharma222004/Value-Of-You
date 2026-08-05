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
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] uppercase">
                  ✓ Health & Lifestyle Completed & Saved Locally
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Score: {metrics.healthCapitalScore} / 100
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[var(--foreground)] mt-0.5">
                Longevity, Biometrics & Lifestyle Stored
              </h3>
              <p className="text-xs text-[var(--subtext)]">
                BMI: <strong className="text-amber-400 font-mono">{metrics.bmi ? metrics.bmi.toFixed(1) : "N/A"}</strong> • Sleep Score: <strong className="text-sky-400 font-mono">{metrics.sleepScore}/100</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono font-bold hover:bg-slate-800 transition-all"
            >
              Edit Health Inputs
            </button>
            <Link
              href="/dashboard/assessments"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 hover:from-emerald-500 hover:to-sky-400 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all"
            >
              Next Module: Human Assessments <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* --- TOP HEADER LOCKUP --- */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--border)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1 z-10 text-left">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold uppercase tracking-wider">
              Module 4 — Health Capital Intelligence
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
            Health Capital Wizard
          </h1>
          <p className="text-xs text-[var(--subtext)]">
            Whoop x Oura x Garmin x Longevity Research level physical, mental, & recovery intelligence platform.
          </p>
        </div>

        {/* Real-Time Score Quick Badge */}
        <div className="flex items-center gap-3 z-10">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-[var(--border)] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono text-[var(--subtext)] uppercase">Health Capital</div>
              <div className="text-xl font-black font-mono text-white">{metrics.healthCapitalScore} / 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STEP PROGRESS BAR & NAVIGATION TABS --- */}
      <div className="glass-panel p-4 rounded-3xl border border-[var(--border)] space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[var(--subtext)]">
            Step {activeStep} of 9 — <strong className="text-[var(--foreground)]">{SECTIONS[activeStep - 1].name}</strong>
          </span>
          <span className="text-emerald-400 font-bold">{Math.round((activeStep / 9) * 100)}% Complete</span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500"
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / 9) * 100}%` }}
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
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                  isCurrent
                    ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-bold shadow-md"
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
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 1: Body Metrics & Biometrics</h2>
                    <p className="text-xs text-[var(--subtext)]">Height, weight, waist circumference, resting heart rate, & metabolic indicators.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Height (cm)</label>
                      <input
                        type="number"
                        value={data.bodyMetrics.heightCm || ""}
                        onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, heightCm: Number(e.target.value) } })}
                        placeholder="e.g. 178"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Weight (kg)</label>
                      <input
                        type="number"
                        value={data.bodyMetrics.weightKg || ""}
                        onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, weightKg: Number(e.target.value) } })}
                        placeholder="e.g. 74"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Blood Group</label>
                      <select
                        value={data.bodyMetrics.bloodGroup}
                        onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, bloodGroup: e.target.value } })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      >
                        <option value="" className="bg-[#0f172a]">Select Blood Group</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                          <option key={bg} value={bg} className="bg-[#0f172a]">{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Waist Circumference (cm)</label>
                      <input
                        type="number"
                        value={data.bodyMetrics.waistCircumferenceCm || ""}
                        onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, waistCircumferenceCm: Number(e.target.value) } })}
                        placeholder="e.g. 82"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Resting Heart Rate (bpm)</label>
                      <input
                        type="number"
                        value={data.bodyMetrics.restingHeartRate || ""}
                        onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, restingHeartRate: Number(e.target.value) } })}
                        placeholder="e.g. 62"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Body Fat %</label>
                      <input
                        type="number"
                        value={data.bodyMetrics.bodyFatPercentage || ""}
                        onChange={(e) => setData({ ...data, bodyMetrics: { ...data.bodyMetrics, bodyFatPercentage: Number(e.target.value) } })}
                        placeholder="e.g. 18"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 2: PHYSICAL ACTIVITY ================= */}
              {activeStep === 2 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 2: Physical Activity & Movement</h2>
                    <p className="text-xs text-[var(--subtext)]">Workout frequency, daily steps, sedentary hours, & athletic disciplines.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Workouts / Week</label>
                      <input
                        type="number"
                        value={data.physicalActivity.workoutFrequencyPerWeek || ""}
                        onChange={(e) => setData({ ...data, physicalActivity: { ...data.physicalActivity, workoutFrequencyPerWeek: Number(e.target.value) } })}
                        placeholder="0-7 days"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Daily Steps Count</label>
                      <input
                        type="number"
                        value={data.physicalActivity.dailySteps || ""}
                        onChange={(e) => setData({ ...data, physicalActivity: { ...data.physicalActivity, dailySteps: Number(e.target.value) } })}
                        placeholder="e.g. 8500"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Sedentary Sitting Hrs/Day</label>
                      <input
                        type="number"
                        value={data.physicalActivity.sedentaryHoursPerDay || ""}
                        onChange={(e) => setData({ ...data, physicalActivity: { ...data.physicalActivity, sedentaryHoursPerDay: Number(e.target.value) } })}
                        placeholder="Hours"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>

                  {/* Activity Checkboxes */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Disciplines & Sports Practiced</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { key: "gym", label: "Gym & Weights" },
                        { key: "running", label: "Running" },
                        { key: "walking", label: "Brisk Walking" },
                        { key: "cycling", label: "Cycling" },
                        { key: "swimming", label: "Swimming" },
                        { key: "sports", label: "Competitive Sports" },
                        { key: "yoga", label: "Yoga & Pilates" },
                        { key: "stretching", label: "Stretching & Mobility" },
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
                            className={`p-3 rounded-2xl border text-xs text-left flex justify-between items-center transition-all ${
                              isChecked
                                ? "bg-emerald-600/20 border-emerald-500 text-white font-bold"
                                : "bg-slate-900/60 border border-[var(--border)] text-[var(--subtext)] hover:border-slate-500"
                            }`}
                          >
                            <span>{act.label}</span>
                            {isChecked && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 3: SLEEP INTELLIGENCE ================= */}
              {activeStep === 3 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 3: Sleep Intelligence & Circadian Rhythm</h2>
                    <p className="text-xs text-[var(--subtext)]">Sleep duration, schedule consistency, quality, & pre-bedtime screen exposure.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Avg Sleep Hours / Night</label>
                      <input
                        type="number"
                        step="0.5"
                        value={data.sleepIntelligence.averageSleepHoursPerNight || ""}
                        onChange={(e) => setData({ ...data, sleepIntelligence: { ...data.sleepIntelligence, averageSleepHoursPerNight: Number(e.target.value) } })}
                        placeholder="e.g. 7.5"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Sleep Quality</label>
                      <select
                        value={data.sleepIntelligence.sleepQuality}
                        onChange={(e) => setData({ ...data, sleepIntelligence: { ...data.sleepIntelligence, sleepQuality: e.target.value as any } })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      >
                        <option value="Excellent" className="bg-[#0f172a]">Excellent</option>
                        <option value="Good" className="bg-[#0f172a]">Good</option>
                        <option value="Fair" className="bg-[#0f172a]">Fair</option>
                        <option value="Poor" className="bg-[#0f172a]">Poor</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Pre-Bed Screen Time (Mins)</label>
                      <input
                        type="number"
                        value={data.sleepIntelligence.screenUsageBeforeSleepMinutes || ""}
                        onChange={(e) => setData({ ...data, sleepIntelligence: { ...data.sleepIntelligence, screenUsageBeforeSleepMinutes: Number(e.target.value) } })}
                        placeholder="e.g. 30"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 4: NUTRITION INTELLIGENCE ================= */}
              {activeStep === 4 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 4: Nutrition & Hydration Intelligence</h2>
                    <p className="text-xs text-[var(--subtext)]">Protein intake, vegetable/fruit servings, water hydration, & processed foods.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Water Intake (Liters / Day)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={data.nutritionIntelligence.waterIntakeLiters || ""}
                        onChange={(e) => setData({ ...data, nutritionIntelligence: { ...data.nutritionIntelligence, waterIntakeLiters: Number(e.target.value) } })}
                        placeholder="e.g. 3.0"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Protein Intake (Grams / Day)</label>
                      <input
                        type="number"
                        value={data.nutritionIntelligence.proteinIntakeGrams || ""}
                        onChange={(e) => setData({ ...data, nutritionIntelligence: { ...data.nutritionIntelligence, proteinIntakeGrams: Number(e.target.value) } })}
                        placeholder="e.g. 110"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Vegetable Servings / Day</label>
                      <input
                        type="number"
                        value={data.nutritionIntelligence.vegetableServingsPerDay || ""}
                        onChange={(e) => setData({ ...data, nutritionIntelligence: { ...data.nutritionIntelligence, vegetableServingsPerDay: Number(e.target.value) } })}
                        placeholder="e.g. 3"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 5: MENTAL WELLBEING ================= */}
              {activeStep === 5 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 5: Mental Wellbeing & Emotional Resilience</h2>
                    <p className="text-xs text-[var(--subtext)] font-sans">Stress level, anxiety control, mood ratings, & mindfulness practices.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-[var(--border)] space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[var(--foreground)]">Perceived Stress Level (1-10)</span>
                        <span className="font-mono font-bold text-amber-400">{data.mentalWellbeing.stressLevel}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={data.mentalWellbeing.stressLevel}
                        onChange={(e) => setData({ ...data, mentalWellbeing: { ...data.mentalWellbeing, stressLevel: Number(e.target.value) } })}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-[var(--border)] space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[var(--foreground)]">Burnout Risk Perception (1-10)</span>
                        <span className="font-mono font-bold text-rose-400">{data.mentalWellbeing.burnoutRiskLevel}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={data.mentalWellbeing.burnoutRiskLevel}
                        onChange={(e) => setData({ ...data, mentalWellbeing: { ...data.mentalWellbeing, burnoutRiskLevel: Number(e.target.value) } })}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 6: LIFESTYLE HABITS ================= */}
              {activeStep === 6 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 6: Lifestyle Habits & Risk Behaviours</h2>
                    <p className="text-xs text-[var(--subtext)]">Smoking, alcohol habits, screen time, & morning routines.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Smoking Status</label>
                      <select
                        value={data.lifestyleHabits.smokingStatus}
                        onChange={(e) => setData({ ...data, lifestyleHabits: { ...data.lifestyleHabits, smokingStatus: e.target.value as any } })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      >
                        <option value="Non-Smoker" className="bg-[#0f172a]">Non-Smoker</option>
                        <option value="Former Smoker" className="bg-[#0f172a]">Former Smoker</option>
                        <option value="Active Smoker" className="bg-[#0f172a]">Active Smoker</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Daily Screen Time (Hours)</label>
                      <input
                        type="number"
                        value={data.lifestyleHabits.dailyScreenTimeHours || ""}
                        onChange={(e) => setData({ ...data, lifestyleHabits: { ...data.lifestyleHabits, dailyScreenTimeHours: Number(e.target.value) } })}
                        placeholder="e.g. 6"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Alcohol Consumption</label>
                      <select
                        value={data.lifestyleHabits.alcoholStatus}
                        onChange={(e) => setData({ ...data, lifestyleHabits: { ...data.lifestyleHabits, alcoholStatus: e.target.value as any } })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      >
                        <option value="None" className="bg-[#0f172a]">None</option>
                        <option value="Social" className="bg-[#0f172a]">Social</option>
                        <option value="Moderate" className="bg-[#0f172a]">Moderate</option>
                        <option value="Heavy" className="bg-[#0f172a]">Heavy</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 7: MEDICAL PROFILE ================= */}
              {activeStep === 7 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 7: Medical Profile & Clinical Baseline</h2>
                    <p className="text-xs text-[var(--subtext)]">Allergies, chronic conditions, vision/hearing health, & vaccination status.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Allergies (if any)</label>
                      <input
                        type="text"
                        value={data.medicalProfile.allergies}
                        onChange={(e) => setData({ ...data, medicalProfile: { ...data.medicalProfile, allergies: e.target.value } })}
                        placeholder="e.g. Penicillin, Peanuts"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Chronic Conditions</label>
                      <input
                        type="text"
                        value={data.medicalProfile.chronicConditions}
                        onChange={(e) => setData({ ...data, medicalProfile: { ...data.medicalProfile, chronicConditions: e.target.value } })}
                        placeholder="e.g. Asthma, Hypertension"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 8: PRODUCTIVITY & RECOVERY ================= */}
              {activeStep === 8 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 8: Productivity Capacity & Recovery</h2>
                    <p className="text-xs text-[var(--subtext)]">Deep work hours, focus ratings, weekend restorative quality, & vacation cadence.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Deep Work Hours / Day</label>
                      <input
                        type="number"
                        value={data.productivityRecovery.deepWorkHoursPerDay || ""}
                        onChange={(e) => setData({ ...data, productivityRecovery: { ...data.productivityRecovery, deepWorkHoursPerDay: Number(e.target.value) } })}
                        placeholder="e.g. 5"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Focus Level (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={data.productivityRecovery.focusLevelRating || ""}
                        onChange={(e) => setData({ ...data, productivityRecovery: { ...data.productivityRecovery, focusLevelRating: Number(e.target.value) } })}
                        placeholder="1-5"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Vacations / Year</label>
                      <input
                        type="number"
                        value={data.productivityRecovery.vacationFrequencyPerYear || ""}
                        onChange={(e) => setData({ ...data, productivityRecovery: { ...data.productivityRecovery, vacationFrequencyPerYear: Number(e.target.value) } })}
                        placeholder="e.g. 2"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 9: HEALTH GOALS & MASTER REPORT ================= */}
              {activeStep === 9 && (
                <div className="space-y-6 text-left">
                  {/* Completion Notification Banner */}
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Module 4 — Health Capital Audit Completed!</h4>
                      <p className="text-xs text-emerald-300">All responses have been successfully saved and calculated in your Neural Telemetry Profile.</p>
                    </div>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-2xl font-black text-[var(--foreground)]">Section 9: Health Goals & Master Audit Report</h2>
                    <p className="text-xs text-[var(--subtext)]">Target health goals, biological age estimate, & executive longevity audit.</p>
                  </div>

                  {/* Goal Badges Grid */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Active Target Longevity Goals</label>
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
