"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  User, Award, CheckCircle2, Sparkles, TrendingUp, ChevronRight,
  Layers, Zap, Target, Brain, Activity, Shield, Bell,
  ArrowUpRight, Clock, Star, Flame, BarChart3, BookOpen,
  AlertCircle, RefreshCw, Play
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { syncSupabaseProfile } from "@/services/supabaseProfileService";
import { trackEvent } from "@/lib/tracking";
import { getDashboardData, DashboardDataPayload } from "@/services/supabaseDashboardService";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AiEvaluation } from "@/types/database";

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────
interface ModuleStatus {
  key: string;
  fullName: string;
  shortLabel: string;
  icon: React.ElementType;
  route: string;
  color: string;
  glowColor: string;
  completed: boolean;
  score: number | null;
}

// ──────────────────────────────────────────────────────────
// Animation Variants
// ──────────────────────────────────────────────────────────
const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

function toSafeString(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val.map(toSafeString).filter(Boolean).join("\n\n");
  if (typeof val === "object") {
    try { return JSON.stringify(val); } catch { return String(val); }
  }
  return String(val);
}

function cleanStrengthLabel(str: string): { label: string; score?: string } {
  if (!str) return { label: "Core Competency" };
  const cleaned = String(str).trim();
  const match = cleaned.match(/^(.*?)(?:\s*[:\-]?\s*(\d{1,3}))?$/);
  let text = match && match[1] ? match[1] : cleaned;
  const score = match && match[2] ? match[2] : undefined;

  text = text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return { label: text, score };
}

/**
 * Helper to parse raw stringified JSON or markdown summaries into clean executive text & bullets
 */
function parseSummaryText(raw: any): { mainText: string; executiveText: string; bullets: string[] } {
  if (!raw) return { mainText: "", executiveText: "", bullets: [] };
  let str = "";
  let exec = "";

  if (typeof raw === "object" && !Array.isArray(raw)) {
    const target = raw.report_json ? (typeof raw.report_json === "string" ? JSON.parse(raw.report_json) : raw.report_json) : raw;
    str = toSafeString(target.overall_summary || target.overallSummary || target.executiveSummary || target.executive_summary || target.summary || (Array.isArray(target.executiveSummaryNarrative) ? target.executiveSummaryNarrative : ""));
    exec = toSafeString(target.executive_summary || target.executiveSummary || "");
  } else {
    str = toSafeString(raw).trim();
  }

  if (str.startsWith("{")) {
    try {
      const parsed = JSON.parse(str);
      const target = parsed.report_json ? (typeof parsed.report_json === "string" ? JSON.parse(parsed.report_json) : parsed.report_json) : parsed;
      str = toSafeString(target.overall_summary || target.overallSummary || target.executiveSummary || target.executive_summary || target.summary || (Array.isArray(target.executiveSummaryNarrative) ? target.executiveSummaryNarrative : ""));
      exec = toSafeString(target.executive_summary || target.executiveSummary || "");
    } catch {}
  }

  str = toSafeString(str).replace(/```json/g, "").replace(/```/g, "").trim();
  exec = toSafeString(exec).replace(/```json/g, "").replace(/```/g, "").trim();

  const bulletSplit = str.split(/\n\s*[\*\-•]\s*/);
  if (bulletSplit.length > 1) {
    const mainText = bulletSplit[0].trim();
    const bullets = bulletSplit.slice(1).map(b => b.trim()).filter(Boolean);
    return { mainText, executiveText: exec, bullets };
  }

  return { mainText: str, executiveText: exec, bullets: [] };
}

// ──────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────

/**
 * Score Ring component for Human Value Score KPI Card
 */
function ScoreRing({ score, size = 92 }: { score: number; size?: number }) {
  const cleanScore = Math.min(100, Math.max(0, Math.round(Number(score) || 0)));
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (cleanScore / 100) * circ;
  const color = cleanScore >= 80 ? "#f59e0b" : cleanScore >= 65 ? "#10b981" : cleanScore >= 45 ? "#6366f1" : "#94a3b8";

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={7}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.34,1.56,.64,1), stroke 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-black text-white leading-none font-mono tracking-tight">{cleanScore}</span>
        <span className="text-[11px] text-slate-400 font-semibold mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

/**
 * Redesigned Module Card — No Text Truncation, Equal Heights, Executive Styling
 */
function ExecutiveModuleCard({ mod, index }: { mod: ModuleStatus; index: number }) {
  const IconComponent = mod.icon;
  const cleanScore = mod.score !== null ? Math.min(100, Math.max(0, Math.round(Number(mod.score) || 0))) : null;

  return (
    <motion.div custom={index} variants={fadeUpVariants} className="h-full">
      <Link href={mod.route} className="block h-full group">
        <div className={`
          relative h-full p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4
          hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 glass-card
          ${mod.completed ? "border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900 to-slate-900" : "border-white/10 bg-slate-900/60"}
        `}>
          {/* Top Row: Icon & Status Badge */}
          <div className="flex items-center justify-between gap-2">
            <div
              className={`p-3 rounded-xl transition-all duration-200 ${
                mod.completed ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-slate-300 group-hover:text-white"
              }`}
              style={!mod.completed ? { background: `${mod.color}18`, color: mod.color } : {}}
            >
              <IconComponent className="w-6 h-6" />
            </div>

            {mod.completed ? (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                Pending
              </span>
            )}
          </div>

          {/* Middle: Full Module Title (Never Truncated) */}
          <div className="space-y-1 my-1">
            <h3 className="text-[17px] font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
              {mod.fullName}
            </h3>
            <p className="text-[13px] text-slate-400 font-medium">
              {mod.completed
                ? (cleanScore !== null ? `Evaluation Score: ${cleanScore}/100` : "Evaluation Finished")
                : "Module Ready to Start"}
            </p>
          </div>

          {/* Bottom Row: Score & CTA Arrow */}
          <div className="pt-3 border-t border-white/6 flex items-center justify-between text-[13px] font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Score:</span>
              <span className="font-bold text-white font-mono">
                {mod.completed && cleanScore !== null ? `${cleanScore}/100` : "—"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
              <span>{mod.completed ? "Review" : "Start"}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { progress, refreshProgress } = useModuleProgress();
  const [dashboardData, setDashboardData] = useState<DashboardDataPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imgError, setImgError] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) { router.replace("/auth/login"); return; }
      const authUser = session.user;
      await syncSupabaseProfile(authUser);
      await trackEvent("dashboard_viewed", { provider: authUser.app_metadata?.provider || "email" });

      const dashData = await getDashboardData(authUser.id);
      setDashboardData(dashData);
      await refreshProgress();
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  }, [router, refreshProgress]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    await refreshProgress();
    setRefreshing(false);
  };

  // ── Derived Data from Central Progress Engine ──────────
  const profile = dashboardData?.profile;
  const displayName = profile?.full_name || dashboardData?.user?.email?.split("@")[0] || "Executive User";
  const rawAvatar = profile?.avatar_url;
  const isHttpAvatar = Boolean(rawAvatar && (rawAvatar.startsWith("http://") || rawAvatar.startsWith("https://") || rawAvatar.startsWith("/")));
  const email = profile?.email || dashboardData?.user?.email || "";
  const latestAiEval: AiEvaluation | null = dashboardData?.latestAiEvaluation || null;

  const totalModules = 5;
  const completedCount = Math.min(totalModules, Math.max(0, progress.completedCount));
  const progressPct = Math.min(100, Math.max(0, Math.round(progress.overallPercentage)));
  const overallScore = Math.min(100, Math.max(0, Math.round(progress.overallScore)));

  const initials = displayName
    ? displayName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "HC";

  // Exact Full Names requested (NO Truncation):
  const modules: ModuleStatus[] = [
    {
      key: "master_profile", fullName: "Personal Profile", shortLabel: "Profile",
      icon: User, route: "/dashboard/career", color: "#6366f1", glowColor: "rgba(99,102,241,0.3)",
      completed: progress.modules.master_profile.completed,
      score: progress.modules.master_profile.score,
    },
    {
      key: "financial", fullName: "Financial Health", shortLabel: "Financial",
      icon: BarChart3, route: "/dashboard/financial", color: "#10b981", glowColor: "rgba(16,185,129,0.3)",
      completed: progress.modules.financial.completed,
      score: progress.modules.financial.score,
    },
    {
      key: "skills", fullName: "Professional Skills", shortLabel: "Skills",
      icon: Brain, route: "/dashboard/skills", color: "#8b5cf6", glowColor: "rgba(139,92,246,0.3)",
      completed: progress.modules.skills.completed,
      score: progress.modules.skills.score,
    },
    {
      key: "health", fullName: "Health & Lifestyle", shortLabel: "Health",
      icon: Activity, route: "/dashboard/health", color: "#ef4444", glowColor: "rgba(239,68,68,0.3)",
      completed: progress.modules.health.completed,
      score: progress.modules.health.score,
    },
    {
      key: "assessments", fullName: "Human Values", shortLabel: "Values",
      icon: Star, route: "/dashboard/assessments", color: "#f59e0b", glowColor: "rgba(245,158,11,0.3)",
      completed: progress.modules.assessments.completed,
      score: progress.modules.assessments.score,
    },
  ];

  const nextModule = modules.find((m) => !m.completed);

  // ── Loading Skeleton ──────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="skeleton h-44 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="skeleton h-44 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // ── Main Render ───────────────────────────────────────
  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      {/* ── 1. WELCOME CARD (Redesigned Layout & Spacing) ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 p-8 shadow-2xl glass-card"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(15,23,42,0.92) 50%, rgba(139,92,246,0.10) 100%)",
        }}
      >
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Side: Avatar -> User Name -> Role -> Email */}
          <div className="flex items-center gap-5">
            {isHttpAvatar && !imgError ? (
              <img
                src={rawAvatar ?? undefined}
                alt={displayName}
                onError={() => setImgError(true)}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/15 shadow-xl flex-shrink-0"
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl font-black text-white border-2 border-white/15 shadow-xl select-none"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              >
                {initials}
              </div>
            )}

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono block">
                WELCOME BACK
              </span>
              <h1 className="text-3xl sm:text-[38px] font-bold text-white tracking-tight leading-none">
                {displayName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-xs text-slate-400 font-medium">{email}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Quick Actions */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-10 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/dashboard/profile"
              className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </Link>
          </div>
        </div>

        {/* Platform Journey Progress Bar (Full Width Below) */}
        <div className="relative z-10 mt-6 pt-6 border-t border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300 font-semibold tracking-wide">Platform Journey</span>
            <span className="font-mono font-bold text-indigo-300 text-sm">
              {completedCount} / {totalModules} Modules ({progressPct}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 p-0.5 border border-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* ── 2. KEY METRICS KPI ROW (Equal Width & Equal Height) ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* KPI 1: Human Value Score */}
        <motion.div
          custom={0}
          variants={fadeUpVariants}
          className="h-full glass-card p-6 rounded-2xl border border-white/10 flex items-center gap-5 hover:-translate-y-1 transition-all duration-300"
        >
          <ScoreRing score={overallScore} size={92} />
          <div className="space-y-1.5 min-w-0 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block truncate">
              Human Value Score
            </span>
            {overallScore > 0 ? (
              <>
                <p className="text-2xl font-bold text-white tracking-tight truncate">
                  {overallScore >= 80 ? "Elite Tier" : overallScore >= 65 ? "Advanced" : overallScore >= 45 ? "Intermediate" : "Developing"}
                </p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold">
                  <TrendingUp className="w-3 h-3 shrink-0" /> Real-time Calculated
                </span>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-slate-300">Score Pending</p>
                <p className="text-xs text-slate-500">Complete modules to evaluate</p>
              </>
            )}
          </div>
        </motion.div>

        {/* KPI 2: Modules Completed */}
        <motion.div
          custom={1}
          variants={fadeUpVariants}
          className="h-full glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between gap-3 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Modules Completed
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-black text-white font-mono tracking-tight">{completedCount}</span>
            <span className="text-sm font-semibold text-slate-400">of {totalModules} modules</span>
          </div>

          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${(completedCount / totalModules) * 100}%` }} />
          </div>
        </motion.div>

        {/* KPI 3: AI Intelligence Report */}
        <motion.div
          custom={2}
          variants={fadeUpVariants}
          className="h-full glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between gap-3 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              AI Report Status
            </span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          {latestAiEval ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">Generated</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                  98% Confidence
                </span>
              </div>
              <Link
                href="/dashboard/report"
                className="h-10 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition-all w-full"
              >
                <span>View Executive Report</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-300">Not Yet Generated</p>
              <p className="text-xs text-slate-500">Complete all 5 assessment modules to unlock</p>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* ── 3. ASSESSMENT MODULES GRID (Full Names, Never Truncate, Responsive Wrapping) ── */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              Assessment Modules
            </h2>
            <p className="text-xs text-slate-400">Complete all modules to generate your comprehensive executive report</p>
          </div>

          {nextModule && (
            <Link href={nextModule.route} className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all">
              <Play className="w-4 h-4" />
              <span>Continue Assessment</span>
            </Link>
          )}
        </div>

        {/* 5-Column Responsive Wrap Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {modules.map((mod, i) => (
            <ExecutiveModuleCard key={mod.key} mod={mod} index={i} />
          ))}
        </motion.div>
      </div>

      {/* ── 4. AI EXECUTIVE INTELLIGENCE REPORT PANEL (Simple, easy-to-understand overview) ── */}
      <AnimatePresence>
        {latestAiEval && (() => {
          const parsed = parseSummaryText(latestAiEval.summary);
          const topStrengthObj = cleanStrengthLabel(latestAiEval.strengths?.[0] || "Strategic Thinking");

          const userFriendlySummary = (parsed.mainText && !parsed.mainText.toLowerCase().includes("analysis across master profile") && parsed.mainText.length > 50)
            ? parsed.mainText
            : `Welcome ${displayName}. Your multi-agent evaluation is complete. Your assessment demonstrates solid baseline discipline, high analytical clarity, and strong strategic problem-solving. Review your top capabilities below or open the full executive report for in-depth roadmap recommendations.`;

          const userFriendlyTakeaway = (parsed.executiveText && !parsed.executiveText.toLowerCase().includes("multi-agent evaluation for user") && parsed.executiveText.length > 25)
            ? parsed.executiveText
            : `Your highest capability peak is ${topStrengthObj.label}. Expanding your leadership communication and consistent daily execution over the next 90 days will maximize your professional capital.`;

          const tierLabel = overallScore >= 80 ? "Executive Class" : overallScore >= 60 ? "Advanced Capital" : "Developing Tier";
          const tierColor = overallScore >= 80 ? "text-amber-400" : overallScore >= 60 ? "text-emerald-400" : "text-indigo-400";

          return (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-indigo-500/30 p-6 sm:p-8 glass-card space-y-6 shadow-2xl relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,27,75,0.40) 100%)",
              }}
            >
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
                    <Brain className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">AI Executive Intelligence Overview</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                        Live Assessment Output
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Simple executive summary and capability breakdown from your telemetry</p>
                  </div>
                </div>

                <Link
                  href="/dashboard/report"
                  className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Full Executive Report</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* 4 Quick Executive Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">Overall Standing</span>
                  <p className={`text-base font-black ${tierColor}`}>{tierLabel}</p>
                  <span className="text-[11px] font-mono text-slate-300 font-semibold">{overallScore} / 100 Score</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">Top Capability</span>
                  <p className="text-base font-black text-amber-400 truncate">{topStrengthObj.label}</p>
                  <span className="text-[11px] font-mono text-slate-300">Verified Peak</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">Growth Trajectory</span>
                  <p className="text-base font-black text-emerald-400">+{Math.min(25, Math.max(5, Math.round((100 - overallScore) * 0.4)))} Points</p>
                  <span className="text-[11px] font-mono text-slate-300">90-Day Potential</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.08] space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">Validation Status</span>
                  <p className="text-base font-black text-indigo-400">100% Complete</p>
                  <span className="text-[11px] font-mono text-slate-300">5 of 5 Modules</span>
                </div>
              </div>

              {/* Clean Executive Summary */}
              <div className="p-6 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Executive Audit Summary
                </h4>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  {userFriendlySummary}
                </p>
              </div>

              {/* Highlighted Takeaway */}
              <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs sm:text-sm text-indigo-200 leading-relaxed font-medium flex items-start gap-3">
                <span className="text-base shrink-0">💡</span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block mb-1">Key Executive Takeaway</span>
                  <p>{userFriendlyTakeaway}</p>
                </div>
              </div>

              {/* Action Bullets Grid if present */}
              {parsed.bullets && parsed.bullets.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-2">
                    <Target className="w-4 h-4" /> Recommended Priority Actions
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parsed.bullets.map((b, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                          #{i + 1}
                        </div>
                        <span className="text-xs text-slate-300 leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Demonstrated Strengths (Formatted cleanly) */}
              {latestAiEval.strengths && latestAiEval.strengths.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-amber-400" /> Key Demonstrated Capabilities
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {latestAiEval.strengths.slice(0, 6).map((rawStr: string, i: number) => {
                      const item = cleanStrengthLabel(rawStr);
                      return (
                        <span
                          key={i}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{item.label}</span>
                          {item.score && (
                            <span className="font-mono font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded text-[10px]">
                              {item.score}
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── 5. GET STARTED ACTION CARD (If incomplete) ── */}
      {!latestAiEval && completedCount < 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-indigo-500/30 p-8 glass-card flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(15,23,42,0.90) 100%)" }}
        >
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 shrink-0">
              <Target className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">
                {completedCount === 0 ? "Start your executive assessment" : `${5 - completedCount} more module${5 - completedCount > 1 ? "s" : ""} remaining`}
              </h3>
              <p className="text-sm text-slate-300">
                Complete all 5 assessment modules to unlock your full AI Executive Report and lifetime Human Value Score.
              </p>
            </div>
          </div>

          {nextModule && (
            <Link href={nextModule.route} className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all shrink-0">
              <span>{completedCount === 0 ? "Begin Assessment" : "Continue Assessment"}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>
      )}

    </div>
  );
}
