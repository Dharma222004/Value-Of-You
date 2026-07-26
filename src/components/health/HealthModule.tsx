"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  Activity,
  Moon,
  Apple,
  Brain,
  Zap,
  Save,
  Smile,
  ShieldAlert,
  Flame,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  Clock,
  Dumbbell,
  Droplets,
  Cigarette,
  Wine,
  Stethoscope,
  Target,
  BarChart3,
  Check,
  AlertCircle,
  Sun,
  BookOpen,
  PieChart as PieIcon,
  Shield,
  Layers,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Coffee,
  Bed,
  CheckSquare,
} from "lucide-react";

export interface HealthModuleData {
  // Section 1: Basic Information
  heightCm: number;
  weightKg: number;
  bloodGroup: string;

  // Section 2: Physical Activity
  exerciseFrequency: string;
  workoutTypes: string[];
  dailySteps: number;
  workoutDurationMin: number;

  // Section 3: Sleep
  sleepHours: number;
  bedTime: string;
  wakeTime: string;
  sleepQuality: string;
  afternoonNap: string;

  // Section 4: Nutrition
  waterIntakeLiters: number;
  fruitsFrequency: string;
  vegetablesFrequency: string;
  proteinIntake: string;
  fastFoodFrequency: string;
  sugaryDrinksFrequency: string;
  junkFoodFrequency: string;
  supplements: string[];

  // Section 5: Mental Wellbeing
  stressLevel: number; // 1 - 10
  anxietyLevel: string;
  happinessLevel: number; // 1 - 10
  burnoutRisk: string;
  workLifeBalance: string;
  meditationFrequency: string;
  journalingFrequency: string;
  mindfulnessPractice: string;

  // Section 6: Lifestyle Habits
  readingHabit: string;
  learningHabit: string;
  morningRoutine: string;
  stretchingRoutine: string;
  smoking: string;
  alcohol: string;
  tobacco: string;
  drugs: string;
  gambling: string;
  screenTimeHours: number;
  lateNightSleeping: string;

  // Section 7: Medical Information (Optional)
  chronicDiseases: string[];
  allergies: string[];
  medications: string;
  disabilities: string;

  // Section 8: Daily Routine
  routineWakeTime: string;
  routineWorkHours: number;
  routineStudyHours: number;
  routineBreaksMins: number;
  routineFamilyHours: number;
  routineLearningHours: number;
  routineSleepTime: string;

  // Section 9: Productivity
  deepWorkHours: number;
  learningHours: number;
  readingHabitRating: string;
  goalReviewFrequency: string;
  planningHabit: string;
}

const defaultHealthData: HealthModuleData = {
  // 1. Basic Info
  heightCm: 175,
  weightKg: 72,
  bloodGroup: "O+",

  // 2. Physical Activity
  exerciseFrequency: "3-4 days/week",
  workoutTypes: ["Gym / Weightlifting", "Walking", "Yoga / Pilates"],
  dailySteps: 8500,
  workoutDurationMin: 45,

  // 3. Sleep
  sleepHours: 7.5,
  bedTime: "22:30",
  wakeTime: "06:30",
  sleepQuality: "Good",
  afternoonNap: "Power Nap (15-30 mins)",

  // 4. Nutrition
  waterIntakeLiters: 2.8,
  fruitsFrequency: "Daily",
  vegetablesFrequency: "Daily",
  proteinIntake: "High (1.2-1.6g/kg)",
  fastFoodFrequency: "1-2 times/week",
  sugaryDrinksFrequency: "Occasionally",
  junkFoodFrequency: "Occasionally",
  supplements: ["Multivitamins", "Omega-3 / Fish Oil"],

  // 5. Mental Wellbeing
  stressLevel: 4,
  anxietyLevel: "Low / None",
  happinessLevel: 8,
  burnoutRisk: "None",
  workLifeBalance: "Good",
  meditationFrequency: "1-2 days/week",
  journalingFrequency: "Occasionally",
  mindfulnessPractice: "Weekly",

  // 6. Lifestyle Habits
  readingHabit: "15-30 mins/day",
  learningHabit: "30-60 mins/day",
  morningRoutine: "Structured & Consistent",
  stretchingRoutine: "Occasionally",
  smoking: "Never",
  alcohol: "Occasional",
  tobacco: "Never",
  drugs: "Never",
  gambling: "Never",
  screenTimeHours: 6,
  lateNightSleeping: "Sometimes (1-2x/wk)",

  // 7. Medical Info
  chronicDiseases: ["None"],
  allergies: ["None"],
  medications: "Daily Multivitamin & Omega 3",
  disabilities: "None",

  // 8. Daily Routine
  routineWakeTime: "06:30 AM",
  routineWorkHours: 8,
  routineStudyHours: 2,
  routineBreaksMins: 45,
  routineFamilyHours: 2,
  routineLearningHours: 1,
  routineSleepTime: "10:30 PM",

  // 9. Productivity
  deepWorkHours: 5,
  learningHours: 1.5,
  readingHabitRating: "Consistent Daily",
  goalReviewFrequency: "Weekly",
  planningHabit: "Daily Structured",
};

const LOCAL_STORAGE_KEY = "human_capital_health_module_v6";

export const HealthModule: React.FC = () => {
  const [data, setData] = useState<HealthModuleData>(defaultHealthData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaved, setIsSaved] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState<string>("Just now");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 9;

  // Load from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setData((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (e) {
      console.error("Failed to load health telemetry from storage", e);
    }
  }, []);

  const updateField = (field: keyof HealthModuleData, val: any) => {
    setData((prev) => {
      const updated = { ...prev, [field]: val };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (e) {
        console.error("Failed to save health telemetry", e);
      }
      return updated;
    });
    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 350);
  };

  const toggleArrayItem = (field: "workoutTypes" | "supplements" | "chronicDiseases" | "allergies", item: string) => {
    const currentList = data[field] || [];
    let updated: string[];
    
    if (item === "None") {
      updated = ["None"];
    } else {
      const filtered = currentList.filter((i) => i !== "None");
      if (filtered.includes(item)) {
        updated = filtered.filter((i) => i !== item);
        if (updated.length === 0) updated = ["None"];
      } else {
        updated = [...filtered, item];
      }
    }
    updateField(field, updated);
  };

  // BMI Calculation
  const heightM = data.heightCm > 0 ? data.heightCm / 100 : 1;
  const rawBmi = data.weightKg > 0 ? data.weightKg / (heightM * heightM) : 0;
  const bmi = rawBmi > 0 ? parseFloat(rawBmi.toFixed(1)) : 0;

  const getBMICategory = (val: number) => {
    if (val === 0) return { label: "Invalid Inputs", color: "text-slate-400", bg: "bg-slate-900", border: "border-slate-800" };
    if (val < 18.5) return { label: "Underweight", color: "text-amber-400", bg: "bg-amber-950/40", border: "border-amber-800/60" };
    if (val <= 24.9) return { label: "Normal Weight (Optimal)", color: "text-emerald-400", bg: "bg-emerald-950/40", border: "border-emerald-800/60" };
    if (val <= 29.9) return { label: "Overweight", color: "text-amber-400", bg: "bg-amber-950/40", border: "border-amber-800/60" };
    return { label: "Obese Category", color: "text-rose-400", bg: "bg-rose-950/40", border: "border-rose-800/60" };
  };

  const bmiMeta = getBMICategory(bmi);

  // Score Algorithms (0 - 100)
  const fitnessScore = (() => {
    let score = 0;
    if (data.dailySteps >= 10000) score += 40;
    else if (data.dailySteps >= 7500) score += 32;
    else if (data.dailySteps >= 5000) score += 22;
    else score += Math.round((data.dailySteps / 5000) * 15);

    if (data.exerciseFrequency === "Daily") score += 30;
    else if (data.exerciseFrequency === "5-6 days/week") score += 28;
    else if (data.exerciseFrequency === "3-4 days/week") score += 22;
    else if (data.exerciseFrequency === "1-2 days/week") score += 12;

    if (data.workoutDurationMin >= 45) score += 15;
    else if (data.workoutDurationMin >= 30) score += 10;
    else if (data.workoutDurationMin >= 15) score += 5;

    if (data.workoutTypes.length >= 3 && !data.workoutTypes.includes("None")) score += 15;
    else if (data.workoutTypes.length === 2) score += 10;
    else if (data.workoutTypes.length === 1 && !data.workoutTypes.includes("None")) score += 5;

    return Math.min(100, Math.max(0, score));
  })();

  const sleepScore = (() => {
    let hourScore = 0;
    if (data.sleepHours >= 7 && data.sleepHours <= 8.5) hourScore = 100;
    else if (data.sleepHours >= 6 && data.sleepHours < 7) hourScore = 80;
    else if (data.sleepHours > 8.5 && data.sleepHours <= 9.5) hourScore = 85;
    else if (data.sleepHours >= 5 && data.sleepHours < 6) hourScore = 55;
    else hourScore = 35;

    let qualityScore = 70;
    if (data.sleepQuality.includes("Optimal")) qualityScore = 100;
    else if (data.sleepQuality === "Good") qualityScore = 85;
    else if (data.sleepQuality === "Fair") qualityScore = 60;
    else qualityScore = 35;

    let napBonus = 0;
    if (data.afternoonNap.includes("Power Nap")) napBonus = 5;
    else if (data.afternoonNap.includes("Long Nap")) napBonus = -5;

    const score = Math.round(hourScore * 0.6 + qualityScore * 0.4 + napBonus);
    return Math.min(100, Math.max(0, score));
  })();

  const nutritionScore = (() => {
    let score = 50;
    if (data.waterIntakeLiters >= 2.5 && data.waterIntakeLiters <= 4) score += 20;
    else if (data.waterIntakeLiters >= 1.8) score += 12;
    else score += 5;

    if (data.fruitsFrequency === "Daily") score += 10;
    else if (data.fruitsFrequency.includes("3-5")) score += 7;
    if (data.vegetablesFrequency === "Daily") score += 10;
    else if (data.vegetablesFrequency.includes("3-5")) score += 7;

    if (data.proteinIntake.includes("Optimal")) score += 15;
    else if (data.proteinIntake.includes("High")) score += 12;
    else if (data.proteinIntake.includes("Moderate")) score += 8;

    if (data.fastFoodFrequency.includes("Daily")) score -= 20;
    else if (data.fastFoodFrequency.includes("3-4")) score -= 12;
    else if (data.fastFoodFrequency.includes("1-2")) score -= 5;

    if (data.sugaryDrinksFrequency === "Daily") score -= 15;
    else if (data.sugaryDrinksFrequency === "Occasionally") score -= 5;

    if (data.junkFoodFrequency === "Daily") score -= 15;
    else if (data.junkFoodFrequency === "Weekly") score -= 5;

    if (data.supplements.length > 0 && !data.supplements.includes("None")) score += 5;

    return Math.min(100, Math.max(0, score));
  })();

  const mentalScore = (() => {
    const stressPts = (10 - data.stressLevel) * 10;
    const happinessPts = data.happinessLevel * 10;

    let anxietyPts = 80;
    if (data.anxietyLevel.includes("Low")) anxietyPts = 100;
    else if (data.anxietyLevel === "Moderate") anxietyPts = 70;
    else if (data.anxietyLevel === "High") anxietyPts = 40;
    else anxietyPts = 15;

    let burnoutPts = 80;
    if (data.burnoutRisk === "None") burnoutPts = 100;
    else if (data.burnoutRisk === "Mild") burnoutPts = 75;
    else if (data.burnoutRisk === "Moderate") burnoutPts = 45;
    else burnoutPts = 15;

    let wlbPts = 70;
    if (data.workLifeBalance === "Excellent") wlbPts = 100;
    else if (data.workLifeBalance === "Good") wlbPts = 80;
    else if (data.workLifeBalance === "Average") wlbPts = 55;
    else wlbPts = 30;

    let mindfulnessBonus = 0;
    if (data.meditationFrequency === "Daily") mindfulnessBonus += 5;
    if (data.journalingFrequency === "Daily") mindfulnessBonus += 5;

    const composite = Math.round(
      stressPts * 0.25 +
      happinessPts * 0.25 +
      anxietyPts * 0.15 +
      burnoutPts * 0.15 +
      wlbPts * 0.2 +
      mindfulnessBonus
    );

    return Math.min(100, Math.max(0, composite));
  })();

  const lifestyleScore = (() => {
    let score = 85;

    if (data.smoking === "Heavy") score -= 35;
    else if (data.smoking === "Regularly") score -= 25;
    else if (data.smoking === "Socially") score -= 10;

    if (data.alcohol === "Heavy") score -= 30;
    else if (data.alcohol === "Moderate") score -= 15;
    else if (data.alcohol === "Occasional") score -= 5;

    if (data.tobacco === "Regular") score -= 25;
    else if (data.tobacco === "Occasional") score -= 12;

    if (data.drugs === "Regular") score -= 40;
    else if (data.drugs === "Occasional") score -= 20;

    if (data.gambling === "Regular") score -= 25;

    if (data.lateNightSleeping === "Always") score -= 18;
    else if (data.lateNightSleeping.includes("Frequently")) score -= 10;
    else if (data.lateNightSleeping.includes("Sometimes")) score -= 4;

    if (data.screenTimeHours > 8) score -= 12;
    else if (data.screenTimeHours > 6) score -= 6;

    if (data.morningRoutine.includes("Structured")) score += 8;
    else if (data.morningRoutine.includes("Basic")) score += 4;

    if (data.readingHabit !== "No") score += 5;
    if (data.learningHabit !== "No") score += 5;
    if (data.stretchingRoutine === "Daily") score += 5;

    return Math.min(100, Math.max(0, score));
  })();

  const productivityScore = (() => {
    let score = 0;

    if (data.deepWorkHours >= 5) score += 40;
    else if (data.deepWorkHours >= 4) score += 35;
    else if (data.deepWorkHours >= 2.5) score += 25;
    else score += Math.round((data.deepWorkHours / 2.5) * 20);

    if (data.learningHours >= 1.5) score += 20;
    else if (data.learningHours >= 1) score += 15;
    else if (data.learningHours >= 0.5) score += 10;

    if (data.planningHabit.includes("Daily Structured")) score += 20;
    else if (data.planningHabit.includes("Weekly")) score += 15;
    else if (data.planningHabit.includes("Ad-hoc")) score += 8;

    if (data.goalReviewFrequency === "Daily") score += 20;
    else if (data.goalReviewFrequency === "Weekly") score += 16;
    else if (data.goalReviewFrequency === "Monthly") score += 10;

    return Math.min(100, Math.max(0, score));
  })();

  const overallHealthScore = Math.round(
    fitnessScore * 0.20 +
    sleepScore * 0.20 +
    nutritionScore * 0.18 +
    mentalScore * 0.18 +
    lifestyleScore * 0.14 +
    productivityScore * 0.10
  );

  // Validation Check per step
  const validateStep = (stepNum: number): boolean => {
    const errs: Record<string, string> = {};
    if (stepNum === 1) {
      if (data.heightCm < 100 || data.heightCm > 250) errs.heightCm = "Height must be between 100cm and 250cm";
      if (data.weightKg < 30 || data.weightKg > 300) errs.weightKg = "Weight must be between 30kg and 300kg";
    }
    if (stepNum === 2) {
      if (data.dailySteps < 0 || data.dailySteps > 100000) errs.dailySteps = "Invalid steps count";
      if (data.workoutDurationMin < 0 || data.workoutDurationMin > 360) errs.workoutDurationMin = "Duration 0 - 360 mins";
    }
    if (stepNum === 3) {
      if (data.sleepHours < 2 || data.sleepHours > 16) errs.sleepHours = "Sleep hours between 2 and 16";
    }
    if (stepNum === 4) {
      if (data.waterIntakeLiters < 0.5 || data.waterIntakeLiters > 10) errs.waterIntakeLiters = "Water intake between 0.5L and 10L";
    }
    if (stepNum === 6) {
      if (data.screenTimeHours < 0 || data.screenTimeHours > 24) errs.screenTimeHours = "Screen time between 0 and 24 hours";
    }
    if (stepNum === 8) {
      if (data.routineWorkHours < 0 || data.routineWorkHours > 24) errs.routineWorkHours = "Work hours 0 - 24";
    }
    if (stepNum === 9) {
      if (data.deepWorkHours < 0 || data.deepWorkHours > 16) errs.deepWorkHours = "Deep work 0 - 16 hours";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 10) setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const stepTitles = [
    { title: "Basic Information", icon: UserCheck, desc: "Biometrics & Blood Group" },
    { title: "Physical Activity", icon: Activity, desc: "Exercise & Daily Steps" },
    { title: "Sleep Architecture", icon: Moon, desc: "Hours & Rest Quality" },
    { title: "Nutrition & Hydration", icon: Apple, desc: "Diet & Water Intake" },
    { title: "Mental Wellbeing", icon: Smile, desc: "Stress, Happiness & WLB" },
    { title: "Lifestyle Habits", icon: Sun, desc: "Positive & Risk Factors" },
    { title: "Medical Information", icon: Stethoscope, desc: "Optional Health Records" },
    { title: "Daily Routine", icon: Clock, desc: "24-Hour Time Distribution" },
    { title: "Productivity", icon: Flame, desc: "Deep Work & Habit Review" },
    { title: "Longevity Dashboard", icon: Award, desc: "Full Telemetry Audit" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PHASE 6 — HEALTH & LIFESTYLE MODULE
              </span>
              <span className="text-xs font-mono text-slate-400 hidden sm:inline">Biometric & Telemetry Engine</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-rose-400" />
              <span>Biological Longevity & Productivity Diagnostics</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
              <Save className={`w-3.5 h-3.5 ${isSaved ? "text-emerald-400" : "text-amber-400 animate-spin"}`} />
              <span>{isSaved ? `Autosaved (${lastSavedTime})` : "Saving changes..."}</span>
            </div>

            {currentStep === 10 ? (
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>Re-estimate Wizard</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(10)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-bold text-sky-400 transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View Full Telemetry Dashboard</span>
              </button>
            )}
          </div>
        </div>

        {/* Wizard Progress & Interactive Steps Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Wizard Step <span className="text-white font-bold">{Math.min(currentStep, 9)}</span> of 9
              {currentStep === 10 ? " (Overview Dashboard)" : ""}
            </span>
            <span className="text-sky-400 font-bold">
              {currentStep === 10 ? 100 : Math.round((currentStep / 9) * 100)}% Completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${currentStep === 10 ? 100 : (currentStep / 9) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step Pill Icons Navigation Bar */}
          <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5 pt-2">
            {stepTitles.map((st, idx) => {
              const stepNum = idx + 1;
              const Icon = st.icon;
              const isActive = currentStep === stepNum;
              const isPast = currentStep > stepNum;
              return (
                <button
                  key={st.title}
                  onClick={() => {
                    if (validateStep(currentStep)) setCurrentStep(stepNum);
                  }}
                  title={`${stepNum}. ${st.title} — ${st.desc}`}
                  className={`flex flex-col items-center p-2 rounded-xl border text-[10px] font-mono transition-all ${
                    isActive
                      ? "bg-sky-500/10 border-sky-500 text-sky-400 shadow-md shadow-sky-500/10"
                      : isPast
                      ? "bg-slate-900/90 border-slate-700 text-emerald-400"
                      : "bg-slate-950/60 border-slate-850 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full mb-1 bg-slate-900 border border-slate-800">
                    {isPast ? <Check className="w-3 h-3 text-emerald-400" /> : <Icon className="w-3 h-3" />}
                  </div>
                  <span className="truncate max-w-full font-sans text-[10px] font-medium hidden sm:inline">
                    {stepNum === 10 ? "Dashboard" : `S${stepNum}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI TELEMETRY SCORE SUMMARY STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">FITNESS SCORE</span>
          <div className="text-lg font-bold font-mono text-sky-400">{fitnessScore} / 100</div>
          <span className="text-[9px] text-slate-500 truncate block">{data.dailySteps.toLocaleString()} steps</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">SLEEP SCORE</span>
          <div className="text-lg font-bold font-mono text-indigo-400">{sleepScore} / 100</div>
          <span className="text-[9px] text-slate-500 truncate block">{data.sleepHours} hrs rest</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">NUTRITION</span>
          <div className="text-lg font-bold font-mono text-emerald-400">{nutritionScore} / 100</div>
          <span className="text-[9px] text-slate-500 truncate block">{data.waterIntakeLiters}L water/day</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">MENTAL HEALTH</span>
          <div className="text-lg font-bold font-mono text-purple-400">{mentalScore} / 100</div>
          <span className="text-[9px] text-slate-500 truncate block">Happiness & WLB</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">LIFESTYLE</span>
          <div className="text-lg font-bold font-mono text-amber-400">{lifestyleScore} / 100</div>
          <span className="text-[9px] text-slate-500 truncate block">Habits & Balance</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase">PRODUCTIVITY</span>
          <div className="text-lg font-bold font-mono text-cyan-400">{productivityScore} / 100</div>
          <span className="text-[9px] text-slate-500 truncate block">{data.deepWorkHours}h deep work</span>
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-slate-900 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">HEALTH SCORE</span>
          <div className="text-lg font-black font-mono text-white">{overallHealthScore} / 100</div>
          <span className="text-[9px] text-amber-400 font-mono block truncate">OVERALL INDEX</span>
        </div>
      </div>

      {/* DYNAMIC WIZARD STEP CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-sky-400" />
                    <span>Section 1: Basic Information & Biometrics</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Physical measures used for body mass index calculations and clinical baseline metrics.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Step 1 of 9
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Height */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Height (cm)</label>
                  <input
                    type="number"
                    value={data.heightCm}
                    onChange={(e) => updateField("heightCm", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. 175"
                  />
                  {errors.heightCm && <span className="text-[11px] text-rose-400 font-mono">{errors.heightCm}</span>}
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Weight (kg)</label>
                  <input
                    type="number"
                    value={data.weightKg}
                    onChange={(e) => updateField("weightKg", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. 70"
                  />
                  {errors.weightKg && <span className="text-[11px] text-rose-400 font-mono">{errors.weightKg}</span>}
                </div>

                {/* BMI Auto Calculated */}
                <div className={`p-4 rounded-xl border space-y-1 ${bmiMeta.bg} ${bmiMeta.border}`}>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">BMI (AUTO CALCULATED)</span>
                  <div className="text-2xl font-black font-mono text-white">{bmi}</div>
                  <span className={`text-xs font-bold font-mono ${bmiMeta.color}`}>{bmiMeta.label}</span>
                </div>

                {/* Blood Group (Optional) */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Blood Group (Optional)</label>
                  <select
                    value={data.bloodGroup}
                    onChange={(e) => updateField("bloodGroup", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown / Prefer not to say"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Physical Activity */}
          {currentStep === 2 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    <span>Section 2: Physical Activity & Exercise</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Track daily steps, workout frequency, duration, and exercise disciplines.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Step 2 of 9
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exercise Frequency */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Exercise Frequency</label>
                  <select
                    value={data.exerciseFrequency}
                    onChange={(e) => updateField("exerciseFrequency", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Never", "1-2 days/week", "3-4 days/week", "5-6 days/week", "Daily"].map((freq) => (
                      <option key={freq} value={freq}>{freq}</option>
                    ))}
                  </select>
                </div>

                {/* Workout Duration */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Workout Duration (Minutes / Session)</label>
                  <input
                    type="number"
                    value={data.workoutDurationMin}
                    onChange={(e) => updateField("workoutDurationMin", parseInt(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. 45"
                  />
                  {errors.workoutDurationMin && <span className="text-[11px] text-rose-400 font-mono">{errors.workoutDurationMin}</span>}
                </div>

                {/* Daily Steps */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-200">Average Daily Steps</label>
                    <span className="text-xs font-mono font-bold text-sky-400">{data.dailySteps.toLocaleString()} Steps</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="25000"
                    step="500"
                    value={data.dailySteps}
                    onChange={(e) => updateField("dailySteps", parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-950 rounded-lg cursor-pointer accent-sky-400"
                  />
                </div>

                {/* Workout Types (Multi Select Pills) */}
                <div className="space-y-3 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-200">Workout Types & Disciplines (Select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Gym / Weightlifting",
                      "Walking",
                      "Running",
                      "Cycling",
                      "Swimming",
                      "Sports / Games",
                      "Yoga / Pilates",
                    ].map((wt) => {
                      const isSelected = data.workoutTypes.includes(wt);
                      return (
                        <button
                          key={wt}
                          type="button"
                          onClick={() => toggleArrayItem("workoutTypes", wt)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{wt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Sleep */}
          {currentStep === 3 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Moon className="w-5 h-5 text-indigo-400" />
                    <span>Section 3: Sleep Architecture</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Circadian alignment, sleep duration, sleep quality index, and afternoon rest patterns.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Step 3 of 9
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Sleep Hours */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Sleep Hours / Night</label>
                  <input
                    type="number"
                    step="0.5"
                    value={data.sleepHours}
                    onChange={(e) => updateField("sleepHours", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. 7.5"
                  />
                  {errors.sleepHours && <span className="text-[11px] text-rose-400 font-mono">{errors.sleepHours}</span>}
                </div>

                {/* Bed Time */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Target Bed Time</label>
                  <input
                    type="text"
                    value={data.bedTime}
                    onChange={(e) => updateField("bedTime", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. 10:30 PM"
                  />
                </div>

                {/* Wake Time */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Target Wake Time</label>
                  <input
                    type="text"
                    value={data.wakeTime}
                    onChange={(e) => updateField("wakeTime", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. 06:30 AM"
                  />
                </div>

                {/* Sleep Quality */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Perceived Sleep Quality</label>
                  <select
                    value={data.sleepQuality}
                    onChange={(e) => updateField("sleepQuality", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Poor", "Fair", "Good", "Optimal / Deep Rest"].map((sq) => (
                      <option key={sq} value={sq}>{sq}</option>
                    ))}
                  </select>
                </div>

                {/* Afternoon Nap */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-200">Afternoon Nap Habits</label>
                  <select
                    value={data.afternoonNap}
                    onChange={(e) => updateField("afternoonNap", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["No Nap", "Power Nap (15-30 mins)", "Long Nap (30-60+ mins)"].map((nap) => (
                      <option key={nap} value={nap}>{nap}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Nutrition */}
          {currentStep === 4 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Apple className="w-5 h-5 text-emerald-400" />
                    <span>Section 4: Nutrition & Hydration</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Water intake, whole foods, protein balance, fast food frequencies, and dietary supplements.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Step 4 of 9
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Water Intake */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Water Intake (Liters / Day)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={data.waterIntakeLiters}
                    onChange={(e) => updateField("waterIntakeLiters", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. 2.8"
                  />
                  {errors.waterIntakeLiters && <span className="text-[11px] text-rose-400 font-mono">{errors.waterIntakeLiters}</span>}
                </div>

                {/* Fruits Frequency */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Fruits Intake</label>
                  <select
                    value={data.fruitsFrequency}
                    onChange={(e) => updateField("fruitsFrequency", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Daily", "3-5 times/week", "1-2 times/week", "Rarely / Never"].map((ff) => (
                      <option key={ff} value={ff}>{ff}</option>
                    ))}
                  </select>
                </div>

                {/* Vegetables Frequency */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Vegetables Intake</label>
                  <select
                    value={data.vegetablesFrequency}
                    onChange={(e) => updateField("vegetablesFrequency", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Daily", "3-5 times/week", "1-2 times/week", "Rarely / Never"].map((vf) => (
                      <option key={vf} value={vf}>{vf}</option>
                    ))}
                  </select>
                </div>

                {/* Protein Intake */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Protein Intake Level</label>
                  <select
                    value={data.proteinIntake}
                    onChange={(e) => updateField("proteinIntake", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Low (<0.8g/kg)", "Moderate (0.8-1.2g/kg)", "High (1.2-1.6g/kg)", "Optimal (>1.6g/kg)"].map((pi) => (
                      <option key={pi} value={pi}>{pi}</option>
                    ))}
                  </select>
                </div>

                {/* Fast Food Frequency */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Fast Food Frequency</label>
                  <select
                    value={data.fastFoodFrequency}
                    onChange={(e) => updateField("fastFoodFrequency", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Never / Rarely", "1-2 times/week", "3-4 times/week", "Daily"].map((fff) => (
                      <option key={fff} value={fff}>{fff}</option>
                    ))}
                  </select>
                </div>

                {/* Sugary Drinks */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Sugary Drinks & Sodas</label>
                  <select
                    value={data.sugaryDrinksFrequency}
                    onChange={(e) => updateField("sugaryDrinksFrequency", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Never", "Occasionally", "Daily"].map((sdf) => (
                      <option key={sdf} value={sdf}>{sdf}</option>
                    ))}
                  </select>
                </div>

                {/* Junk Food */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Junk Food Frequency</label>
                  <select
                    value={data.junkFoodFrequency}
                    onChange={(e) => updateField("junkFoodFrequency", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Never", "Occasionally", "Weekly", "Daily"].map((jff) => (
                      <option key={jff} value={jff}>{jff}</option>
                    ))}
                  </select>
                </div>

                {/* Supplements Multi-select */}
                <div className="space-y-3 lg:col-span-2">
                  <label className="text-xs font-semibold text-slate-200">Daily Supplements (Select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Multivitamins",
                      "Omega-3 / Fish Oil",
                      "Protein Powder",
                      "Vitamin D",
                      "Creatine",
                      "Magnesium",
                      "Probiotics",
                      "None",
                    ].map((sup) => {
                      const isSelected = data.supplements.includes(sup);
                      return (
                        <button
                          key={sup}
                          type="button"
                          onClick={() => toggleArrayItem("supplements", sup)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-md shadow-sky-500/10"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{sup}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Mental Wellbeing */}
          {currentStep === 5 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span>Section 5: Mental Wellbeing</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assess psychological resilience, anxiety, happiness levels, burnout risks, and mindfulness practices.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Step 5 of 9
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stress Level */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-200">Stress Level (1 - 10)</label>
                    <span className="text-xs font-mono font-bold text-amber-400">{data.stressLevel} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={data.stressLevel}
                    onChange={(e) => updateField("stressLevel", parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-900 rounded-lg cursor-pointer accent-amber-400"
                  />
                  <span className="text-[10px] text-slate-500 block">1 = Completely Relaxed, 10 = High Pressure</span>
                </div>

                {/* Happiness Level */}
                <div className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-200">Happiness & Fulfillment (1 - 10)</label>
                    <span className="text-xs font-mono font-bold text-emerald-400">{data.happinessLevel} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={data.happinessLevel}
                    onChange={(e) => updateField("happinessLevel", parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-900 rounded-lg cursor-pointer accent-emerald-400"
                  />
                  <span className="text-[10px] text-slate-500 block">1 = Unsatisfied, 10 = Peak Joy</span>
                </div>

                {/* Anxiety Level */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Anxiety Level</label>
                  <select
                    value={data.anxietyLevel}
                    onChange={(e) => updateField("anxietyLevel", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Low / None", "Moderate", "High", "Severe"].map((al) => (
                      <option key={al} value={al}>{al}</option>
                    ))}
                  </select>
                </div>

                {/* Burnout Risk */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Burnout Risk Status</label>
                  <select
                    value={data.burnoutRisk}
                    onChange={(e) => updateField("burnoutRisk", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["None", "Mild", "Moderate", "Severe"].map((br) => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </select>
                </div>

                {/* Work-Life Balance */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Work-Life Balance Rating</label>
                  <select
                    value={data.workLifeBalance}
                    onChange={(e) => updateField("workLifeBalance", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Poor", "Average", "Good", "Excellent"].map((wlb) => (
                      <option key={wlb} value={wlb}>{wlb}</option>
                    ))}
                  </select>
                </div>

                {/* Meditation */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Meditation Practice</label>
                  <select
                    value={data.meditationFrequency}
                    onChange={(e) => updateField("meditationFrequency", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Never", "1-2 days/week", "3-4 days/week", "Daily"].map((mf) => (
                      <option key={mf} value={mf}>{mf}</option>
                    ))}
                  </select>
                </div>

                {/* Journaling */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Journaling Habit</label>
                  <select
                    value={data.journalingFrequency}
                    onChange={(e) => updateField("journalingFrequency", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Never", "Occasionally", "Daily"].map((jf) => (
                      <option key={jf} value={jf}>{jf}</option>
                    ))}
                  </select>
                </div>

                {/* Mindfulness */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Mindfulness Exercises</label>
                  <select
                    value={data.mindfulnessPractice}
                    onChange={(e) => updateField("mindfulnessPractice", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["No", "Weekly", "Daily"].map((mp) => (
                      <option key={mp} value={mp}>{mp}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Lifestyle Habits */}
          {currentStep === 6 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-400" />
                    <span>Section 6: Positive & Risk Lifestyle Habits</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluate routines, screen time, reading, learning, and potential health risk behaviors.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Step 6 of 9
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Positive Habits Container */}
                <div className="space-y-4 p-5 rounded-xl bg-slate-950/80 border border-emerald-900/40">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Positive Habits</span>
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Reading Habit</label>
                      <select
                        value={data.readingHabit}
                        onChange={(e) => updateField("readingHabit", e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        {["No", "15-30 mins/day", "30-60 mins/day", "60+ mins/day"].map((rh) => (
                          <option key={rh} value={rh}>{rh}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Continuous Learning</label>
                      <select
                        value={data.learningHabit}
                        onChange={(e) => updateField("learningHabit", e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        {["No", "15-30 mins/day", "30-60 mins/day", "60+ mins/day"].map((lh) => (
                          <option key={lh} value={lh}>{lh}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Morning Routine</label>
                      <select
                        value={data.morningRoutine}
                        onChange={(e) => updateField("morningRoutine", e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        {["None", "Basic Routine", "Structured & Consistent"].map((mr) => (
                          <option key={mr} value={mr}>{mr}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Daily Mobility / Stretching</label>
                      <select
                        value={data.stretchingRoutine}
                        onChange={(e) => updateField("stretchingRoutine", e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        {["Never", "Occasionally", "Daily"].map((sr) => (
                          <option key={sr} value={sr}>{sr}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Risk / Negative Factors Container */}
                <div className="space-y-4 p-5 rounded-xl bg-slate-950/80 border border-rose-900/40">
                  <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Risk Factors & Lifestyle Exposure</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300">Smoking</label>
                      <select
                        value={data.smoking}
                        onChange={(e) => updateField("smoking", e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        {["Never", "Socially", "Regularly", "Heavy"].map((sm) => (
                          <option key={sm} value={sm}>{sm}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Alcohol</label>
                      <select
                        value={data.alcohol}
                        onChange={(e) => updateField("alcohol", e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        {["Never", "Occasional", "Moderate", "Heavy"].map((alc) => (
                          <option key={alc} value={alc}>{alc}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Tobacco</label>
                      <select
                        value={data.tobacco}
                        onChange={(e) => updateField("tobacco", e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        {["Never", "Occasional", "Regular"].map((tob) => (
                          <option key={tob} value={tob}>{tob}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Substances / Drugs</label>
                      <select
                        value={data.drugs}
                        onChange={(e) => updateField("drugs", e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        {["Never", "Occasional", "Regular"].map((dr) => (
                          <option key={dr} value={dr}>{dr}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Gambling</label>
                      <select
                        value={data.gambling}
                        onChange={(e) => updateField("gambling", e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        {["Never", "Occasional", "Regular"].map((gm) => (
                          <option key={gm} value={gm}>{gm}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300">Late Night Sleeping</label>
                      <select
                        value={data.lateNightSleeping}
                        onChange={(e) => updateField("lateNightSleeping", e.target.value)}
                        className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none"
                      >
                        {["Never", "Sometimes (1-2x/wk)", "Frequently (3-5x/wk)", "Always"].map((ln) => (
                          <option key={ln} value={ln}>{ln}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Daily Screen Time (Hours)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={data.screenTimeHours}
                      onChange={(e) => updateField("screenTimeHours", parseFloat(e.target.value) || 0)}
                      className="w-full mt-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                      placeholder="e.g. 6"
                    />
                    {errors.screenTimeHours && <span className="text-[11px] text-rose-400 font-mono">{errors.screenTimeHours}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Medical Information */}
          {currentStep === 7 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-rose-400" />
                    <span>Section 7: Medical Information (Optional)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Document chronic conditions, allergies, current medications, or physical accommodations.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  Step 7 of 9
                </span>
              </div>

              <div className="space-y-6">
                {/* Chronic Diseases */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-200">Chronic Diseases / Pre-existing Conditions</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "None",
                      "Diabetes",
                      "Hypertension",
                      "Asthma",
                      "Thyroid",
                      "Heart Condition",
                      "PCOS / PCOD",
                      "GERD / Acid Reflux",
                      "Arthritis",
                      "Other",
                    ].map((cd) => {
                      const isSelected = data.chronicDiseases.includes(cd);
                      return (
                        <button
                          key={cd}
                          type="button"
                          onClick={() => toggleArrayItem("chronicDiseases", cd)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-md shadow-rose-500/10"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{cd}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Allergies */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-200">Known Allergies & Sensitivities</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "None",
                      "Food Allergies",
                      "Dust / Pollen",
                      "Medication Allergies",
                      "Lactose Intolerance",
                      "Gluten Sensitivity",
                      "Other",
                    ].map((alg) => {
                      const isSelected = data.allergies.includes(alg);
                      return (
                        <button
                          key={alg}
                          type="button"
                          onClick={() => toggleArrayItem("allergies", alg)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-md shadow-amber-500/10"
                              : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{alg}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Medications */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-200">Current Medications (Optional)</label>
                    <input
                      type="text"
                      value={data.medications}
                      onChange={(e) => updateField("medications", e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-500"
                      placeholder="e.g. Daily Multivitamin, Metformin"
                    />
                  </div>

                  {/* Disabilities */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-200">Disabilities / Physical Limitations</label>
                    <input
                      type="text"
                      value={data.disabilities}
                      onChange={(e) => updateField("disabilities", e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-sky-500"
                      placeholder="e.g. None or Mild Knee Strain"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Daily Routine */}
          {currentStep === 8 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sky-400" />
                    <span>Section 8: Daily Routine & 24-Hour Allocation</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Structure your typical 24-hour day across work, study, rest, family, and learning.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Step 8 of 9
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Daily Wake Time</label>
                  <input
                    type="text"
                    value={data.routineWakeTime}
                    onChange={(e) => updateField("routineWakeTime", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                    placeholder="e.g. 06:30 AM"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Work Hours / Day</label>
                  <input
                    type="number"
                    step="0.5"
                    value={data.routineWorkHours}
                    onChange={(e) => updateField("routineWorkHours", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                    placeholder="e.g. 8"
                  />
                  {errors.routineWorkHours && <span className="text-[11px] text-rose-400 font-mono">{errors.routineWorkHours}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Study / Upskilling Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={data.routineStudyHours}
                    onChange={(e) => updateField("routineStudyHours", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                    placeholder="e.g. 2"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Daily Breaks & Rest (Minutes)</label>
                  <input
                    type="number"
                    value={data.routineBreaksMins}
                    onChange={(e) => updateField("routineBreaksMins", parseInt(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                    placeholder="e.g. 45"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Family & Leisure Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={data.routineFamilyHours}
                    onChange={(e) => updateField("routineFamilyHours", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                    placeholder="e.g. 2.5"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Dedicated Sleep Time</label>
                  <input
                    type="text"
                    value={data.routineSleepTime}
                    onChange={(e) => updateField("routineSleepTime", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none"
                    placeholder="e.g. 10:30 PM"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: Productivity */}
          {currentStep === 9 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <span>Section 9: Productivity & Deep Work Habits</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Evaluate focus depth, continuous learning, goal tracking, and daily planning consistency.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Step 9 of 9
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Deep Work Hours */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Deep Work Hours / Day</label>
                  <input
                    type="number"
                    step="0.5"
                    value={data.deepWorkHours}
                    onChange={(e) => updateField("deepWorkHours", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. 5"
                  />
                  {errors.deepWorkHours && <span className="text-[11px] text-rose-400 font-mono">{errors.deepWorkHours}</span>}
                </div>

                {/* Learning Hours */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Learning & Upskilling Hours / Day</label>
                  <input
                    type="number"
                    step="0.5"
                    value={data.learningHours}
                    onChange={(e) => updateField("learningHours", parseFloat(e.target.value) || 0)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-none focus:border-sky-500"
                    placeholder="e.g. 1.5"
                  />
                </div>

                {/* Reading Habit Rating */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Reading Habit Consistency</label>
                  <select
                    value={data.readingHabitRating}
                    onChange={(e) => updateField("readingHabitRating", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Consistent Daily", "Occasional", "None"].map((rhr) => (
                      <option key={rhr} value={rhr}>{rhr}</option>
                    ))}
                  </select>
                </div>

                {/* Goal Review */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-200">Goal Review Cadence</label>
                  <select
                    value={data.goalReviewFrequency}
                    onChange={(e) => updateField("goalReviewFrequency", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Daily", "Weekly", "Monthly", "Never"].map((grf) => (
                      <option key={grf} value={grf}>{grf}</option>
                    ))}
                  </select>
                </div>

                {/* Planning Habit */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-200">Planning & Execution Structure</label>
                  <select
                    value={data.planningHabit}
                    onChange={(e) => updateField("planningHabit", e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {["Daily Structured", "Weekly Overview", "Ad-hoc", "Never"].map((ph) => (
                      <option key={ph} value={ph}>{ph}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 10: COMPLETE TELEMETRY DASHBOARD & LONGEVITY AUDIT */}
          {currentStep === 10 && (
            <div className="space-y-6">
              {/* Dashboard Banner */}
              <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                      COMPLETED HEALTH TELEMETRY DIAGNOSTICS
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                    Biological Longevity & Human Capital Readiness
                  </h2>
                  <p className="text-xs text-slate-400 max-w-2xl mt-1">
                    Comprehensive composite score based on physical biometrics, sleep architecture, nutrition, mental health, positive lifestyle habits, routine, and deep work focus.
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 shrink-0">
                  <div className="text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">HEALTH SCORE</span>
                    <span className="text-4xl font-black font-mono text-amber-400">{overallHealthScore}</span>
                    <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">S-Tier Endurance</span>
                  </div>
                </div>
              </div>

              {/* Score breakdown radar/bar grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 6 Sub-scores visual cards (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-sky-400" />
                      <span>Sub-Score Telemetry Matrix</span>
                    </h3>
                    <span className="text-xs font-mono text-slate-500">6 Domain Metrics</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "Fitness Score", score: fitnessScore, color: "from-sky-500 to-blue-600", text: "text-sky-400", desc: `${data.dailySteps.toLocaleString()} steps | ${data.exerciseFrequency}` },
                      { name: "Sleep Score", score: sleepScore, color: "from-indigo-500 to-purple-600", text: "text-indigo-400", desc: `${data.sleepHours} hrs avg sleep | ${data.sleepQuality}` },
                      { name: "Nutrition Score", score: nutritionScore, color: "from-emerald-500 to-teal-600", text: "text-emerald-400", desc: `${data.waterIntakeLiters}L water | ${data.proteinIntake}` },
                      { name: "Mental Health", score: mentalScore, color: "from-purple-500 to-pink-600", text: "text-purple-400", desc: `Stress: ${data.stressLevel}/10 | Joy: ${data.happinessLevel}/10` },
                      { name: "Lifestyle Score", score: lifestyleScore, color: "from-amber-500 to-orange-600", text: "text-amber-400", desc: `Smoking: ${data.smoking} | Alcohol: ${data.alcohol}` },
                      { name: "Productivity", score: productivityScore, color: "from-cyan-500 to-sky-600", text: "text-cyan-400", desc: `${data.deepWorkHours}h deep work | ${data.planningHabit}` },
                    ].map((m) => (
                      <div key={m.name} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white">{m.name}</span>
                          <span className={`text-sm font-mono font-bold ${m.text}`}>{m.score} / 100</span>
                        </div>
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div className={`h-full bg-gradient-to-r ${m.color}`} style={{ width: `${m.score}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono block truncate">{m.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SVG Visual Health Radar & Key Highlights (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                      <PieIcon className="w-4 h-4 text-emerald-400" />
                      <span>Biometric Radar & Domain Breakdown</span>
                    </h3>

                    {/* SVG Hexagon Radar Display */}
                    <div className="flex justify-center items-center py-2">
                      <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-md">
                        {/* Background Web Rings */}
                        <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" fill="none" stroke="#1e293b" strokeWidth="1" />
                        <polygon points="100,45 147,72 147,128 100,155 53,128 53,72" fill="none" stroke="#1e293b" strokeWidth="1" />
                        <polygon points="100,70 125,85 125,115 100,130 75,115 75,85" fill="none" stroke="#1e293b" strokeWidth="1" />

                        {/* Axis Lines */}
                        <line x1="100" y1="100" x2="100" y2="20" stroke="#334155" strokeWidth="1" />
                        <line x1="100" y1="100" x2="170" y2="60" stroke="#334155" strokeWidth="1" />
                        <line x1="100" y1="100" x2="170" y2="140" stroke="#334155" strokeWidth="1" />
                        <line x1="100" y1="100" x2="100" y2="180" stroke="#334155" strokeWidth="1" />
                        <line x1="100" y1="100" x2="30" y2="140" stroke="#334155" strokeWidth="1" />
                        <line x1="100" y1="100" x2="30" y2="60" stroke="#334155" strokeWidth="1" />

                        {/* Radar Data Polygon */}
                        {(() => {
                          const r1 = (fitnessScore / 100) * 80;
                          const r2 = (sleepScore / 100) * 80;
                          const r3 = (nutritionScore / 100) * 80;
                          const r4 = (mentalScore / 100) * 80;
                          const r5 = (lifestyleScore / 100) * 80;
                          const r6 = (productivityScore / 100) * 80;

                          const p1 = `${100},${100 - r1}`;
                          const p2 = `${100 + r2 * 0.866},${100 - r2 * 0.5}`;
                          const p3 = `${100 + r3 * 0.866},${100 + r3 * 0.5}`;
                          const p4 = `${100},${100 + r4}`;
                          const p5 = `${100 - r5 * 0.866},${100 + r5 * 0.5}`;
                          const p6 = `${100 - r6 * 0.866},${100 - r6 * 0.5}`;

                          return (
                            <polygon
                              points={`${p1} ${p2} ${p3} ${p4} ${p5} ${p6}`}
                              fill="rgba(56, 189, 248, 0.25)"
                              stroke="#38bdf8"
                              strokeWidth="2"
                            />
                          );
                        })()}
                      </svg>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300 font-mono pt-2 border-t border-slate-800">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Body Mass Index (BMI):</span>
                        <span className={`font-bold ${bmiMeta.color}`}>{bmi} ({bmiMeta.label})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Daily Routine Allocation:</span>
                        <span className="text-white font-bold">{data.routineWorkHours}h Work | {data.routineStudyHours}h Study</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Active Supplements:</span>
                        <span className="text-sky-400 truncate max-w-[160px]">{data.supplements.join(", ")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* WIZARD BOTTOM NAVIGATION BAR */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 1}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            currentStep === 1
              ? "bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed"
              : "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-xs font-mono text-slate-400 hidden sm:block">
          {currentStep === 10 ? (
            <span className="text-emerald-400 font-bold">Telemetry Complete</span>
          ) : (
            <span>Step {currentStep} of 9 — {stepTitles[currentStep - 1].title}</span>
          )}
        </div>

        {currentStep < 9 ? (
          <button
            onClick={handleNextStep}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-sky-500/20"
          >
            <span>Next Section</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : currentStep === 9 ? (
          <button
            onClick={() => {
              if (validateStep(9)) setCurrentStep(10);
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Generate Health Audit</span>
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
          >
            <RotateCcw className="w-4 h-4 text-sky-400" />
            <span>Edit Information</span>
          </button>
        )}
      </div>
    </div>
  );
};
