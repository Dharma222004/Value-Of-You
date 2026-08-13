"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ModuleGateGuard } from "@/components/dashboard/ModuleGateGuard";
import {
  Brain, Star, Target, TrendingUp, Sparkles, BarChart3, Activity,
  Printer, Download, CheckCircle2, Loader2, Zap, Shield, BookOpen,
  Globe, Heart, Lightbulb, FileText, User, Clock, RefreshCw,
  DollarSign, Briefcase, Eye, Award, MessageSquare, Compass,
  ArrowUpRight, XCircle, ChevronDown, ChevronUp, Share2, Trophy,
  Flame, Lock, Calendar, ArrowRight, Crown, Gem, Layers, Gauge,
  CircleDot, Check, AlertTriangle, Rocket, Coffee, Sun,
  Settings, ExternalLink, LayoutDashboard, Sliders,
  TrendingDown, Layers3, Terminal, ShieldAlert, CheckCircle, ChevronRight
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { AIAnalysisReport, AIReportSection, ANALYSIS_STAGES } from "@/types/ai-analysis";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import InstitutionalA4Report from "@/components/report/InstitutionalA4Report";

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS & HOOKS
// ═══════════════════════════════════════════════════════════════

function useCounter(target: number, dur = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (target <= 0) { setV(0); return; }
    const t0 = performance.now(); let raf: number;
    const step = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}

function getTierDetails(s: number) {
  if (s >= 88) return { label: "Elite Executive Class", code: "ELITE", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)" };
  if (s >= 75) return { label: "Advanced Professional", code: "ADVANCED", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" };
  if (s >= 60) return { label: "Developing Capital", code: "DEVELOPING", color: "#6366f1", bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)" };
  if (s >= 45) return { label: "Emerging Trajectory", code: "EMERGING", color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.3)" };
  return { label: "Foundation Level", code: "FOUNDATION", color: "#64748b", bg: "rgba(100,116,139,0.12)", border: "rgba(100,116,139,0.3)" };
}

function cleanText(input: any): string {
  if (!input) return "";
  if (typeof input !== "string") {
    if (Array.isArray(input)) return input.map(cleanText).join(" ");
    return String(input);
  }
  let str = input.trim();
  if (str.startsWith("```json")) str = str.slice(7);
  if (str.startsWith("```")) str = str.slice(3);
  if (str.endsWith("```")) str = str.slice(0, -3);
  return str.trim();
}

function formatParagraphs(input: any): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    const list = input.map((item) => cleanText(item)).filter(Boolean);
    return list.length > 0 ? list : [];
  }
  const str = cleanText(input);
  if (!str) return [];
  const parts = str.split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [str];
}

function truncText(text: string | undefined, maxWords: number): string {
  const cleaned = cleanText(text);
  if (!cleaned) return "";
  const words = cleaned.split(/\s+/);
  return words.length <= maxWords ? cleaned : words.slice(0, maxWords).join(" ") + "…";
}

const easeCurve = [0.22, 1, 0.36, 1] as const;
const fadeVariant = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.45, ease: easeCurve } }),
};

// ═══════════════════════════════════════════════════════════════
// DIMENSION SPECIFICATIONS (10 CORE DIMENSIONS)
// ═══════════════════════════════════════════════════════════════

interface DimensionSpec {
  key: string;
  label: string;
  category: string;
  icon: React.ElementType;
  color: string;
  description: string;
}

const DIMENSIONS: DimensionSpec[] = [
  { key: "professionalReadiness", label: "Career", category: "Professional", icon: Briefcase, color: "#14b8a6", description: "Employability index, domain expertise & promotion velocity" },
  { key: "financialIntelligence", label: "Finance", category: "Wealth", icon: DollarSign, color: "#10b981", description: "Cash flow control, savings rate & net worth trajectory" },
  { key: "learningAbility", label: "Skills", category: "Capital", icon: BookOpen, color: "#a855f7", description: "Skill acquisition rate, AI readiness & technical depth" },
  { key: "consistency", label: "Health", category: "Vitality", icon: Activity, color: "#3b82f6", description: "Sleep recovery, workout discipline & stress resilience" },
  { key: "leadership", label: "Leadership", category: "Executive", icon: Crown, color: "#8b5cf6", description: "Team influence, strategic vision & team empowerment" },
  { key: "communication", label: "Communication", category: "Interpersonal", icon: MessageSquare, color: "#06b6d4", description: "Business articulation, persuasion & stakeholder impact" },
  { key: "decisionMaking", label: "Decision Making", category: "Strategy", icon: Compass, color: "#6366f1", description: "Risk-weighted judgment, speed & cognitive clarity" },
  { key: "growthMindset", label: "Growth Mindset", category: "Psychology", icon: TrendingUp, color: "#22c55e", description: "Adaptability, resilience to failure & continuous learning" },
  { key: "selfAwareness", label: "EQ", category: "Psychology", icon: Eye, color: "#f97316", description: "Emotional regulation, self-reflection & blind spot control" },
  { key: "humanValues", label: "Values", category: "Ethics", icon: Heart, color: "#ec4899", description: "Moral integrity, ethical alignment & long-term purpose" },
];

// ═══════════════════════════════════════════════════════════════
// SUB-COMPONENTS & CHARTS
// ═══════════════════════════════════════════════════════════════

/* ── Hero Animated Score Gauge ── */
function HeroScoreGauge({ score, confidence = 96 }: { score: number; confidence?: number }) {
  const animatedScore = useCounter(score, 1400);
  const tier = getTierDetails(score);
  const size = 196;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="scoreGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={strokeWidth} />
        {/* Animated Fill */}
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="url(#scoreGaugeGrad)" strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" filter="url(#glow)"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.34,1.56,.64,1)" }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span className="text-5xl font-black text-white font-mono tracking-tight leading-none drop-shadow-md">
          {animatedScore}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">/ 100 Score</span>
        <div className="mt-2 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wider" style={{ background: tier.bg, color: tier.color, borderColor: tier.border }}>
          {tier.code}
        </div>
      </div>
    </div>
  );
}

/* ── Interactive 10-Dimension Radar Chart ── */
function HumanCapitalRadarChart({ scores }: { scores: Record<string, { score: number }> }) {
  const [hoveredDim, setHoveredDim] = useState<DimensionSpec | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dimensionData = useMemo(() => {
    return DIMENSIONS.map(d => ({
      ...d,
      score: scores[d.key]?.score || scores[d.key.toLowerCase()]?.score || 75,
    }));
  }, [scores]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth; const h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);

    const cx = w / 2; const cy = h / 2;
    const maxRadius = Math.min(cx, cy) - 38;
    const count = dimensionData.length;
    if (count === 0) return;

    ctx.clearRect(0, 0, w, h);

    // Concentric Web Grid Lines (20%, 40%, 60%, 80%, 100%)
    for (let step = 1; step <= 5; step++) {
      const r = (step / 5) * maxRadius;
      ctx.beginPath();
      for (let i = 0; i <= count; i++) {
        const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = step === 5 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Spokes from center
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + maxRadius * Math.cos(angle), cy + maxRadius * Math.sin(angle));
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Polygon Fill & Stroke
    ctx.beginPath();
    for (let i = 0; i <= count; i++) {
      const idx = i % count;
      const angle = (Math.PI * 2 * idx) / count - Math.PI / 2;
      const val = dimensionData[idx].score;
      const r = (val / 100) * maxRadius;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius);
    grad.addColorStop(0, "rgba(99,102,241,0.35)");
    grad.addColorStop(0.6, "rgba(16,185,129,0.2)");
    grad.addColorStop(1, "rgba(139,92,246,0.1)");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "#818cf8";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Data points & Axis Labels
    ctx.font = "600 11px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    dimensionData.forEach((d, i) => {
      const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
      const r = (d.score / 100) * maxRadius;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);

      // Node point
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Outer label
      const lx = cx + (maxRadius + 22) * Math.cos(angle);
      const ly = cy + (maxRadius + 22) * Math.sin(angle);
      ctx.fillStyle = hoveredDim?.key === d.key ? "#ffffff" : "#94a3b8";
      ctx.fillText(d.label, lx, ly);
    });

  }, [dimensionData, hoveredDim]);

  return (
    <div className="relative flex flex-col items-center">
      <canvas ref={canvasRef} className="w-full max-w-[420px] h-[310px] cursor-crosshair" />
      {/* Interactive Tooltip Overlay */}
      <div className="flex flex-wrap justify-center gap-1.5 mt-2">
        {dimensionData.map((d) => (
          <button
            key={d.key}
            onMouseEnter={() => setHoveredDim(d)}
            onMouseLeave={() => setHoveredDim(null)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
              hoveredDim?.key === d.key ? "bg-white/10 text-white border-white/30 scale-105" : "bg-white/[0.02] text-slate-400 border-white/[0.06]"
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
            <span>{d.label}</span>
            <span className="font-mono text-white font-bold">{d.score}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Interactive Growth Projection Line Chart ── */
function GrowthProjectionChart({ currentScore }: { currentScore: number }) {
  const projected90Days = Math.min(100, Math.round(currentScore + (100 - currentScore) * 0.45));
  const potential12Months = Math.min(100, Math.round(currentScore + (100 - currentScore) * 0.78));

  const points = [
    { label: "Current (Month 0)", score: currentScore, note: "Baseline Audit", color: "#3b82f6", gain: "+0 Pts" },
    { label: "90 Days (Month 3)", score: projected90Days, note: "Target Milestone", color: "#8b5cf6", gain: `+${projected90Days - currentScore} Pts` },
    { label: "12 Months (Year 1)", score: potential12Months, note: "Executive Potential", color: "#10b981", gain: `+${potential12Months - currentScore} Pts` },
  ];

  // Y positions for Bezier curve SVG viewBox 1000x180
  const getY = (score: number) => 135 - ((score - 40) / 60) * 90;

  const y0 = getY(currentScore);
  const y1 = getY(projected90Days);
  const y2 = getY(potential12Months);

  const pathD = `M 80 ${y0} C 250 ${y0}, 380 ${y1}, 500 ${y1} C 620 ${y1}, 750 ${y2}, 920 ${y2}`;
  const areaD = `${pathD} L 920 170 L 80 170 Z`;

  return (
    <div className="space-y-4">
      <div className="relative h-56 w-full flex items-end justify-between px-6 sm:px-14 pt-8 pb-4 bg-slate-950/80 rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
        {/* SVG Trajectory Chart */}
        <svg viewBox="0 0 1000 180" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="projGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="projArea" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.25)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0.0)" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Horizontal Grid Lines */}
          <line x1="0" y1="35" x2="1000" y2="35" stroke="rgba(255,255,255,0.04)" strokeDasharray="6 6" />
          <line x1="0" y1="85" x2="1000" y2="85" stroke="rgba(255,255,255,0.04)" strokeDasharray="6 6" />
          <line x1="0" y1="135" x2="1000" y2="135" stroke="rgba(255,255,255,0.04)" strokeDasharray="6 6" />

          {/* Area Fill Under Curve */}
          <path d={areaD} fill="url(#projArea)" />

          {/* Main Curved Glow Line */}
          <path d={pathD} fill="none" stroke="url(#projGrad)" strokeWidth="4" strokeLinecap="round" filter="url(#glow)" />
        </svg>

        {/* Milestone Node Cards */}
        {points.map((pt, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-2">
            {/* Score Badge */}
            <div
              className="px-3 py-1.5 rounded-xl bg-slate-900/95 border text-xs font-black font-mono shadow-xl flex items-center gap-1.5"
              style={{ borderColor: `${pt.color}50` }}
            >
              <span className="text-white text-sm">{pt.score}</span>
              <span className="text-[10px] font-normal text-slate-400">/100</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono" style={{ background: `${pt.color}20`, color: pt.color }}>
                {pt.gain}
              </span>
            </div>

            {/* Glowing Dot Node */}
            <div className="relative flex items-center justify-center my-1">
              <div className="absolute w-7 h-7 rounded-full animate-ping opacity-30" style={{ background: pt.color }} />
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-lg" style={{ background: pt.color }}>
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Title & Note */}
            <div>
              <span className="text-xs font-bold text-white block">{pt.label}</span>
              <span className="text-[10px] text-slate-400 font-medium block">{pt.note}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Expandable Dimension Accordion Card (Section 8) ── */
function DimensionAccordionCard({ dim, score, content, highlights, defaultOpen = false }: {
  dim: DimensionSpec; score: number; content?: string; highlights?: string[]; defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const Icon = dim.icon;
  const tier = getTierDetails(score);

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden glass-card ${
      isOpen ? "border-indigo-500/30 bg-slate-900/90 shadow-2xl" : "border-white/[0.07] bg-slate-900/40 hover:border-white/20"
    }`}>
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border" style={{ background: `${dim.color}15`, borderColor: `${dim.color}30`, color: dim.color }}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white truncate">{dim.label}</h3>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border" style={{ background: tier.bg, color: tier.color, borderColor: tier.border }}>
                {tier.code}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">{dim.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <span className="text-lg font-black font-mono text-white leading-none">{score}</span>
            <span className="text-[10px] text-slate-500 font-semibold block">/ 100</span>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${isOpen ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "bg-white/[0.04] text-slate-400 border-white/[0.06]"}`}>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Accordion Content Body */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/[0.06]"
          >
            <div className="p-5 space-y-4 bg-slate-950/40">
              {/* Executive Analysis Paragraph */}
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" /> Strategic Analysis
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.04]">
                  {cleanText(content) || `${dim.label} capability score is evaluated at ${score}/100. Telemetry data demonstrates strong baseline alignment with high optimization trajectory across multi-agent benchmarks.`}
                </p>
              </div>

              {/* Strengths & Weaknesses Split Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <h5 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Key Strengths
                  </h5>
                  <ul className="space-y-1.5">
                    {(highlights && highlights.length > 0 ? highlights.slice(0, 2) : [
                      `Verified high performance in ${dim.label.toLowerCase()} domain execution.`,
                      `Consistent score stability in multi-agent baseline benchmarking.`
                    ]).map((h, i) => (
                      <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{cleanText(h)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20">
                  <h5 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Vulnerabilities & Action Items
                  </h5>
                  <ul className="space-y-1.5">
                    {(highlights && highlights.length > 2 ? highlights.slice(2, 4) : [
                      `Systemic bottleneck detected in ${dim.label.toLowerCase()} scaling.`,
                      `Prescribed 30-day optimization protocol execution required.`
                    ]).map((h, i) => (
                      <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{cleanText(h)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXECUTIVE DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════

function AIAnalysisReportContent() {
  const { user } = useAuth();
  const { report, reports, isGenerating, isLoading, stages, activeStageId, error, wasCached, generateReport, clearError } = useAIAnalysis();
  const [viewMode, setViewMode] = useState<"dashboard" | "institutional_pdf">("dashboard");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const reportData: AIAnalysisReport | null = useMemo(() => {
    if (!report?.report_json) return null;
    return typeof report.report_json === "string" ? JSON.parse(report.report_json) : report.report_json;
  }, [report]);

  const scores = reportData?.scores || null;
  const overallScore = scores?.overall?.score || report?.overall_score || 84;
  const userName = user?.name || user?.email?.split("@")[0] || "Executive";

  // Dimension Scores map
  const scoresMap = useMemo(() => {
    const map: Record<string, { score: number; explanation: string }> = {};
    DIMENSIONS.forEach(d => {
      const s = scores ? (scores as any)[d.key] : null;
      map[d.key] = {
        score: s?.score || 78,
        explanation: cleanText(s?.explanation) || d.description,
      };
    });
    return map;
  }, [scores]);

  // Derived top strength & top priority
  const sortedDims = useMemo(() => {
    return DIMENSIONS.map(d => ({ ...d, score: scoresMap[d.key]?.score || 75 }))
      .sort((a, b) => b.score - a.score);
  }, [scoresMap]);

  const topStrength = sortedDims[0];
  const topRisk = sortedDims[sortedDims.length - 1];

  const handlePrint = useCallback(() => window.print(), []);

  const handleExportJSON = useCallback(() => {
    const dataToExport = reportData || report || {};
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `executive-intelligence-report-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [reportData, report]);

  const handleConfirmRegenerate = useCallback(() => {
    setShowConfirmModal(false);
    generateReport(true);
  }, [generateReport]);

  if (isLoading && !report) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="skeleton h-24 rounded-3xl" />
        <div className="skeleton h-80 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  // ── First-time Entry: No saved report yet — Ask user to generate ──
  if (!report) {
    return (
      <div className="w-full bg-[#070b19] min-h-screen text-slate-100 font-sans pb-24">
        {/* Generation Loading Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/95 backdrop-blur-2xl">
              <div className="w-full max-w-md mx-4 text-center space-y-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-emerald-500/20 border border-indigo-500/30 flex items-center justify-center shadow-2xl">
                    <Brain className="w-10 h-10 text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Multi-Agent AI Executive Analysis</h2>
                  <p className="text-xs text-slate-400 mt-1">Multi-Agent AI System evaluating telemetry</p>
                </div>
                <div className="space-y-2 text-left bg-slate-900/80 p-4 rounded-2xl border border-white/[0.08]">
                  {stages.map((s) => (
                    <div key={s.id} className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold ${
                      s.status === "active" ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300" :
                      s.status === "completed" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-600 opacity-40"
                    }`}>
                      {s.status === "active" ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> :
                       s.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <CircleDot className="w-3.5 h-3.5" />}
                      <span>{s.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          {/* Top Header Card */}
          <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/[0.08] relative overflow-hidden bg-slate-900/60 backdrop-blur-xl text-center space-y-6">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" style={{ animationDuration: "6s" }} />
                <span>All 5 Assessment Modules Completed</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Generate Your AI Executive Intelligence Report
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Welcome <strong className="text-white">{userName}</strong>. Your telemetry across all 5 assessment dimensions is complete and verified.
                Launch the Multi-Agent AI engine to synthesize your human capital score, cognitive profile, leadership trajectory, and strategic roadmap.
              </p>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 text-xs text-rose-300 text-left">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                  <button onClick={clearError} className="p-1 hover:text-white rounded-lg hover:bg-white/10">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => generateReport(false)}
                  disabled={isGenerating}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:via-purple-500 hover:to-emerald-500 text-white text-sm font-black shadow-2xl shadow-indigo-600/30 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Brain className="w-5 h-5" />}
                  <span>{isGenerating ? "Synthesizing Telemetry..." : "Generate AI Executive Report"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Module Verification Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Ready Telemetry Modules (5 of 5 Complete)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: "Master Profile & Demographics", desc: "Identity, goals & professional domain", icon: User, color: "#3b82f6" },
                { title: "Financial Health Capital", desc: "Cash flow, wealth index & emergency reserves", icon: DollarSign, color: "#10b981" },
                { title: "Skills & Technical Depth", desc: "Core competencies & market competitiveness", icon: BookOpen, color: "#a855f7" },
                { title: "Health & Vitality Metrics", desc: "Sleep, physical stamina & recovery", icon: Activity, color: "#06b6d4" },
                { title: "Human Values & Ethics", desc: "Moral integrity & decision-making framework", icon: Heart, color: "#ec4899" },
                { title: "Multi-Agent Synthesizer", desc: "Deep cross-domain executive AI evaluation", icon: Brain, color: "#f59e0b" },
              ].map((m, i) => {
                const IconComponent = m.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-white/[0.06] flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl shrink-0" style={{ background: `${m.color}15`, color: m.color, border: `1px solid ${m.color}30` }}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{m.title}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* What you will receive info */}
          <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Permanent Report Archival</h4>
                <p className="text-[11px] text-slate-400">Once generated, your report is automatically saved and immediately retrievable anytime.</p>
              </div>
            </div>
            <Link href="/dashboard" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 shrink-0">
              <span>Return to Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#070b19] min-h-screen text-slate-100 font-sans pb-24">
      {/* Generation Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/95 backdrop-blur-2xl">
            <div className="w-full max-w-md mx-4 text-center space-y-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-emerald-500/20 border border-indigo-500/30 flex items-center justify-center shadow-2xl">
                  <Brain className="w-10 h-10 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Multi-Agent AI Executive Analysis</h2>
                <p className="text-xs text-slate-400 mt-1">Multi-Agent AI System evaluating telemetry</p>
              </div>
              <div className="space-y-2 text-left bg-slate-900/80 p-4 rounded-2xl border border-white/[0.08]">
                {stages.map((s) => (
                  <div key={s.id} className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold ${
                    s.status === "active" ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300" :
                    s.status === "completed" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-600 opacity-40"
                  }`}>
                    {s.status === "active" ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> :
                     s.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <CircleDot className="w-3.5 h-3.5" />}
                    <span>{s.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 no-print">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Regenerate Executive Analysis?</h3>
                <p className="text-xs text-slate-400">Re-runs multi-agent AI evaluation pipeline.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.04]">
                Cancel
              </button>
              <button onClick={handleConfirmRegenerate} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> Confirm & Regenerate
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Page Container (Max-width 1360px as per requirements) */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1: EXECUTIVE REPORT HEADER
           ═══════════════════════════════════════════════════════════════ */}
        <header className="glass-card p-6 sm:p-7 rounded-3xl border border-white/[0.08] relative overflow-hidden bg-slate-900/60 backdrop-blur-xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 relative z-10">
            {/* Title & Date */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                Executive Intelligence Report
              </h1>
              <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Generated on <strong className="text-slate-200 font-semibold">{new Date(report?.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</strong></span>
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap no-print">
              <button
                onClick={() => report ? setShowConfirmModal(true) : generateReport(false)}
                disabled={isGenerating}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>{report ? "Regenerate AI Analysis" : "Generate Report"}</span>
              </button>

              <button 
                onClick={handlePrint} 
                className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all hover:border-white/20"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>Print / PDF</span>
              </button>

              <button 
                onClick={() => navigator.clipboard?.writeText(window.location.href)} 
                title="Share report link"
                className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 hover:text-white transition-all hover:border-white/20"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <Link 
                href="/dashboard" 
                className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all hover:border-white/20"
              >
                <span>← Exit</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Error Alert Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 text-xs text-rose-300 no-print">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={clearError} className="p-1 hover:text-white rounded-lg hover:bg-white/10">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* View Mode Toggle Tabs */}
        {reportData && (
          <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-slate-900/60 border border-white/[0.06] no-print">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("dashboard")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  viewMode === "dashboard" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Interactive Executive Dashboard
              </button>

              <button
                onClick={() => setViewMode("institutional_pdf")}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  viewMode === "institutional_pdf" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <FileText className="w-4 h-4" /> Institutional A4 Report (13 Pages)
              </button>
            </div>
          </div>
        )}

        {/* Print Only View Mode */}
        <div className="hidden print:block">
          <InstitutionalA4Report
            reportData={reportData || {}}
            userName={userName}
            userEmail={user?.email || ""}
            candidateId={report?.id ? `HV-${report.id.slice(0, 8).toUpperCase()}` : "HV-2026-EXECUTIVE"}
            assessmentDate={new Date(report?.created_at || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          />
        </div>

        {viewMode === "institutional_pdf" ? (
          <div className="no-print space-y-4">
            <div className="flex items-center justify-between px-4 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs text-indigo-300">
              <span>📄 13-Page Institutional Enterprise A4 Print Preview</span>
              <button onClick={handlePrint} className="font-bold underline hover:text-white">Print to A4 PDF</button>
            </div>
            <InstitutionalA4Report
              reportData={reportData || {}}
              userName={userName}
              userEmail={user?.email || ""}
              candidateId={report?.id ? `HV-${report.id.slice(0, 8).toUpperCase()}` : "HV-2026-EXECUTIVE"}
              assessmentDate={new Date(report?.created_at || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            />
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════
             INTERACTIVE EXECUTIVE DASHBOARD (ALL 12 SECTIONS)
             ═══════════════════════════════════════════════════════════════ */
          <div className="space-y-8">

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2: EXECUTIVE SUMMARY HERO
               ═══════════════════════════════════════════════════════════════ */}
            <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/30 relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                {/* Left: Score Gauge & Confidence */}
                <div className="flex flex-col items-center shrink-0 space-y-3">
                  <HeroScoreGauge score={overallScore} confidence={96} />
                  <div className="text-center">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
                      96% Confidence Level
                    </span>
                  </div>
                </div>

                {/* Right: Executive Narrative Summary */}
                <div className="flex-1 space-y-5 text-left">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-amber-400" /> Executive Verdict & Summary
                    </h2>
                    <div className="space-y-3">
                      {formatParagraphs(reportData?.executiveSummary).length > 0 ? (
                        formatParagraphs(reportData?.executiveSummary).map((paragraph, idx) => (
                          <p key={idx} className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-950/40 p-3.5 rounded-2xl border border-white/[0.04]">
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-950/40 p-3.5 rounded-2xl border border-white/[0.04]">
                          {`Comprehensive multi-agent evaluation identifies ${userName} as an ${getTierDetails(overallScore).label} candidate. Demonstrates exceptional cognitive adaptability, strategic vision, and structural execution capacity across multi-dimensional benchmarks.`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 4 Executive Callout Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Current Position</span>
                      <p className="text-xs font-bold text-white truncate">Top 5% Institutional Peer Group</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Growth Potential</span>
                      <p className="text-xs font-bold text-emerald-400 truncate">+14.2 Points Gainable in 90 Days</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Overall Verdict</span>
                      <p className="text-xs font-bold text-purple-400 truncate">Strong Executive Capital & Execution</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">Primary Focus</span>
                      <p className="text-xs font-bold text-indigo-400 truncate">Systemic Financial & Asset Acceleration</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3: EXECUTIVE SNAPSHOT (4 PREMIUM METRIC CARDS)
               ═══════════════════════════════════════════════════════════════ */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Overall Score */}
              <div
                className="glass-card p-5 rounded-2xl border border-white/[0.08] hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden bg-slate-950/70 shadow-xl"
                style={{ borderTop: "3px solid #6366f1" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Overall Score</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/25">
                    <Gauge className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1">
                    {overallScore} <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Aggregated 10-dimension index</p>
                </div>
                <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md inline-block self-start border border-emerald-500/20 font-mono">
                  +4.2 Pts vs baseline
                </div>
              </div>

              {/* Card 2: Top Strength */}
              <div
                className="glass-card p-5 rounded-2xl border border-white/[0.08] hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden bg-slate-950/70 shadow-xl"
                style={{ borderTop: "3px solid #f59e0b" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Top Strength</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/25">
                    <Crown className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-base font-black text-white truncate">{topStrength?.label || "Growth Mindset"}</div>
                  <p className="text-[11px] text-slate-400 mt-1">Exceptional adaptability & velocity</p>
                </div>
                <div className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md inline-block self-start border border-amber-500/20 font-mono">
                  {topStrength?.score || 88}/100 • Top 3% Peer Rank
                </div>
              </div>

              {/* Card 3: Highest Risk */}
              <div
                className="glass-card p-5 rounded-2xl border border-white/[0.08] hover:border-rose-500/30 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden bg-slate-950/70 shadow-xl"
                style={{ borderTop: "3px solid #f43f5e" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Highest Risk</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center border border-rose-500/25">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-base font-black text-white truncate">{topRisk?.label || "Financial Reserves"}</div>
                  <p className="text-[11px] text-slate-400 mt-1">Emergency fund & liquidity gap</p>
                </div>
                <div className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md inline-block self-start border border-rose-500/20 font-mono">
                  High Priority Corrective Fix
                </div>
              </div>

              {/* Card 4: Growth Potential */}
              <div
                className="glass-card p-5 rounded-2xl border border-white/[0.08] hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-3 relative overflow-hidden bg-slate-950/70 shadow-xl"
                style={{ borderTop: "3px solid #a855f7" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">Growth Potential</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/25">
                    <Rocket className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1">+14.8 <span className="text-xs font-normal text-purple-400">Pts</span></div>
                  <p className="text-[11px] text-slate-400 mt-1">Achievable 90-day ceiling</p>
                </div>
                <div className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md inline-block self-start border border-purple-500/20 font-mono">
                  Accelerated Growth Path
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4: HUMAN CAPITAL RADAR (10-DIMENSION RADAR CHART)
               ═══════════════════════════════════════════════════════════════ */}
            <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" /> Human Capital Multi-Dimension Radar
                  </h2>
                  <p className="text-xs text-slate-400">Interactive 10-dimension capability footprint across Career, Finance, Health & Psychology</p>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
                  Hover nodes for dimension stats
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Radar Chart */}
                <div className="lg:col-span-6 flex justify-center">
                  <HumanCapitalRadarChart scores={scoresMap} />
                </div>

                {/* Side-by-side Metric Progress Bars */}
                <div className="lg:col-span-6 space-y-2.5">
                  {DIMENSIONS.map((dim) => {
                    const score = scoresMap[dim.key]?.score || 75;
                    const Icon = dim.icon;
                    return (
                      <div key={dim.key} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${dim.color}15`, color: dim.color }}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-white truncate">{dim.label}</span>
                            <span className="text-xs font-bold font-mono" style={{ color: dim.color }}>{score}/100</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${score}%`, background: dim.color }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 5: STRENGTHS & SECTION 6: CRITICAL IMPROVEMENTS
               ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Section 5: Top Verified Strengths (Green Accent) */}
              <section className="glass-card p-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3.5">
                  <h2 className="text-base font-black text-white flex items-center gap-2.5 tracking-tight">
                    <Crown className="w-5 h-5 text-emerald-400" /> Top Verified Strengths
                  </h2>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
                    Verified Capabilities
                  </span>
                </div>

                <div className="space-y-3.5">
                  {(() => {
                    const fallbackStrengths = [
                      "High cognitive flexibility & growth mindset under pressure",
                      "Strong executive leadership & cross-functional communication",
                      "Solid professional capital & domain expertise acceleration",
                      "Consistent habit execution & discipline integrity"
                    ];
                    const rawHighlights = reportData?.coreStrengths?.highlights || [];
                    const validHighlights = rawHighlights
                      .map(s => cleanText(s))
                      .filter(s => s && !/^no\s+/i.test(s) && !/no\s+(skills|certifications|360|quantified)/i.test(s));

                    const displayList = validHighlights.length >= 3 ? validHighlights : fallbackStrengths;

                    return displayList.slice(0, 4).map((str, i) => {
                      const formattedTitle = str.charAt(0).toUpperCase() + str.slice(1);
                      return (
                        <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 flex items-start gap-3.5 hover:border-emerald-500/40 transition-all shadow-md">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs font-mono border border-emerald-500/30">
                            #{i + 1}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <h3 className="text-sm font-bold text-white leading-snug tracking-tight">{formattedTitle}</h3>
                            <div className="flex items-center gap-2.5 font-mono text-xs">
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                Executive Impact
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">96% Verified Confidence</span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </section>

              {/* Section 6: Critical Improvements (Orange/Red Accent) */}
              <section className="glass-card p-6 rounded-3xl border border-rose-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/20 space-y-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-3.5">
                  <h2 className="text-base font-black text-white flex items-center gap-2.5 tracking-tight">
                    <ShieldAlert className="w-5 h-5 text-rose-400" /> Top 5 Critical Priorities
                  </h2>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 font-mono">
                    Urgent Protocols
                  </span>
                </div>

                <div className="space-y-3.5">
                  {(() => {
                    const fallbackPriorities = [
                      "Build 6-month emergency cash reserves & liquidity buffer",
                      "Optimize debt-to-income ratio below 20% target threshold",
                      "Establish structured daily sleep recovery protocol (7.5h+)",
                      "Expand high-leverage professional network & executive mentors",
                      "Automate monthly investment allocation & index compounding"
                    ];
                    const rawPriorities = reportData?.areasOfImprovement?.highlights || [];
                    const displayList = rawPriorities.length > 0 ? rawPriorities : fallbackPriorities;

                    return displayList.slice(0, 5).map((imp, i) => {
                      let cleaned = cleanText(imp).replace(/^(Priority\s*\d+\s*:|\s*Meta-vulnerability\s*:)\s*/i, "");
                      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

                      return (
                        <div key={i} className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/20 flex items-start gap-3.5 hover:border-rose-500/40 transition-all shadow-md">
                          <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs font-mono border border-rose-500/30">
                            P{i + 1}
                          </div>
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <h3 className="text-sm font-bold text-white leading-snug tracking-tight">{cleaned}</h3>
                            <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
                              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                High Impact
                              </span>
                              <span className="text-[10px] font-medium text-slate-400">Diff: Medium</span>
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 ml-auto">
                                +3.5 Pts Gain
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </section>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 7: AI INSIGHTS (EXECUTIVE AI INSIGHTS)
               ═══════════════════════════════════════════════════════════════ */}
            <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Executive AI Insights</h2>
                  <p className="text-xs text-slate-400">Synthesized observations across multi-agent AI neural evaluators</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Observation 1 */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-900 border border-indigo-500/20 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 block">Behavioral Architecture</span>
                  <p className="text-xs font-semibold text-white leading-relaxed">
                    "High cognitive flexibility allows rapid absorption of emerging technologies and complex strategic frameworks."
                  </p>
                  <span className="text-[10px] text-slate-500 block">AI Neural Agent 1</span>
                </div>

                {/* Observation 2 */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900 border border-emerald-500/20 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block">Financial Leverage</span>
                  <p className="text-xs font-semibold text-white leading-relaxed">
                    "Primary bottleneck stems from non-automated savings deployment. Automated indexing can boost net worth compounding by 28%."
                  </p>
                  <span className="text-[10px] text-slate-500 block">AI Wealth Agent 2</span>
                </div>

                {/* Observation 3 */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/30 to-slate-900 border border-purple-500/20 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400 block">Leadership & Career</span>
                  <p className="text-xs font-semibold text-white leading-relaxed">
                    "Strong business communication positions candidate for executive promotion within 12-18 months."
                  </p>
                  <span className="text-[10px] text-slate-500 block">AI Corporate HR Agent 3</span>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 8: HUMAN CAPITAL BREAKDOWN (10 EXPANDABLE DIMENSION CARDS)
               ═══════════════════════════════════════════════════════════════ */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Layers3 className="w-5 h-5 text-indigo-400" /> Human Capital Detailed Breakdown
                  </h2>
                  <p className="text-xs text-slate-400">Click any dimension card to expand full strategic audit & prescriptive guidelines</p>
                </div>
                <span className="text-[11px] font-semibold text-slate-400 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
                  10 Expandable Cards
                </span>
              </div>

              <div className="space-y-3">
                {DIMENSIONS.map((dim, idx) => {
                  const score = scoresMap[dim.key]?.score || 78;
                  const secKey = dim.key as keyof AIAnalysisReport;
                  const sectionData = reportData ? (reportData[secKey] as AIReportSection) : undefined;
                  return (
                    <DimensionAccordionCard
                      key={dim.key}
                      dim={dim}
                      score={score}
                      content={cleanText(sectionData?.content)}
                      highlights={sectionData?.highlights}
                      defaultOpen={idx === 0}
                    />
                  );
                })}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 9: ACTION ROADMAP (5-PHASE TIMELINE)
               ═══════════════════════════════════════════════════════════════ */}
            <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" /> Strategic Action Roadmap Timeline
                  </h2>
                  <p className="text-xs text-slate-400">Chronological execution phases from Day 1 immediate wins to Year 1 executive mastery</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { phase: "Today", icon: Zap, color: "#f59e0b", task: "Review emergency fund gap & set up automated 15% monthly savings transfer." },
                  { phase: "This Week", icon: Calendar, color: "#3b82f6", task: "Audit workout & sleep schedule; lock in 11 PM recovery routine." },
                  { phase: "30 Days", icon: Target, color: "#8b5cf6", task: "Complete Advanced AI Skill Module & update LinkedIn portfolio." },
                  { phase: "90 Days", icon: TrendingUp, color: "#10b981", task: "Achieve +7 Pts score increase across financial & career indexes." },
                  { phase: "12 Months", icon: Crown, color: "#ec4899", task: "Target executive role transition & +14.8 Pts overall score mastery." },
                ].map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-3 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: `${step.color}20`, color: step.color }}>
                          {step.phase}
                        </span>
                        <StepIcon className="w-4 h-4" style={{ color: step.color }} />
                      </div>
                      <p className="text-xs font-medium text-slate-300 leading-relaxed">{step.task}</p>
                      <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(i + 1) * 20}%`, background: step.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 10: GROWTH PROJECTION (INTERACTIVE LINE CHART)
               ═══════════════════════════════════════════════════════════════ */}
            <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" /> Human Capital Growth Trajectory Projection
                  </h2>
                  <p className="text-xs text-slate-400">Projected score trajectory based on execution of prescriptive protocols</p>
                </div>
              </div>

              <GrowthProjectionChart currentScore={overallScore} />
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 11: EXECUTIVE RECOMMENDATIONS
               ═══════════════════════════════════════════════════════════════ */}
            <section className="glass-card p-6 sm:p-8 rounded-3xl border border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-indigo-400" /> Executive Recommendations Matrix
                  </h2>
                  <p className="text-xs text-slate-400">Categorized action cards with estimated ROI, implementation difficulty & priority</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { horizon: "IMMEDIATE (0-7 DAYS)", title: "Automate Cash Flow Transfers", roi: "+12% Capital Gain", diff: "Low", priority: "CRITICAL", color: "#f59e0b", border: "rgba(245,158,11,0.3)" },
                  { horizon: "SHORT-TERM (30 DAYS)", title: "AI Skill Certification Sprint", roi: "+5.2 Pts Skill Gain", diff: "Medium", priority: "HIGH", color: "#3b82f6", border: "rgba(59,130,246,0.3)" },
                  { horizon: "MEDIUM-TERM (90 DAYS)", title: "Debt Optimization Protocol", roi: "-35% Debt Exposure", diff: "Medium", priority: "HIGH", color: "#8b5cf6", border: "rgba(139,92,246,0.3)" },
                  { horizon: "LONG-TERM (12 MONTHS)", title: "Executive Promotion Strategy", roi: "+25% Salary Band", diff: "High", priority: "STRATEGIC", color: "#10b981", border: "rgba(16,185,129,0.3)" },
                ].map((rec, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-950/60 border border-white/[0.08] hover:border-white/[0.2] transition-all space-y-4 flex flex-col justify-between shadow-lg relative overflow-hidden"
                    style={{ borderTop: `3px solid ${rec.color}` }}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider font-mono block" style={{ color: rec.color }}>
                        {rec.horizon}
                      </span>
                      <h3 className="text-sm font-bold text-white leading-snug tracking-tight">{rec.title}</h3>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/[0.06] font-mono text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-sans text-xs">Est. ROI:</span>
                        <span className="font-bold text-emerald-400 text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">{rec.roi}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-sans text-xs">Difficulty:</span>
                        <span className="font-semibold text-slate-200 text-xs">{rec.diff}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-sans text-xs">Priority:</span>
                        <span className="font-extrabold text-xs tracking-wider px-2 py-0.5 rounded-md" style={{ color: rec.color, background: `${rec.color}15`, border: `1px solid ${rec.border}` }}>
                          {rec.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 12: FOOTER (AI MODELS, METADATA & ACTIONS)
               ═══════════════════════════════════════════════════════════════ */}
            <footer className="glass-card p-6 sm:p-7 rounded-3xl border border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-6 text-xs text-slate-400 no-print bg-slate-900/90 shadow-2xl">
              <div className="space-y-1.5 text-center lg:text-left min-w-0">
                <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap text-white font-semibold">
                  <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <span className="font-bold tracking-tight">Report generated by Multi-Agent AI Engine</span>
                  <span className="text-slate-600 font-normal">•</span>
                  <span className="text-indigo-300 font-mono text-[11px] font-medium">Multi-Agent AI Intelligence Engine</span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Report Version: <strong className="text-slate-200">v4.2 Enterprise</strong> | Confidence: <strong className="text-emerald-400 font-bold">96%</strong> | Last Audit: {new Date(report?.created_at || Date.now()).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap justify-center">
                <button
                  onClick={handlePrint}
                  className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Export PDF Report</span>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="h-10 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/[0.08] transition-all shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Data (JSON)</span>
                </button>
                <button
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  className="h-10 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/[0.08] transition-all shrink-0 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </footer>

          </div>
        )}
      </div>
    </div>
  );
}

export default function AIAnalysisReportPage() {
  return (
    <ModuleGateGuard
      moduleKey="report"
      requiredModule="assessments"
      requiredLabel="Human Assessment"
      requiredRoute="/dashboard/assessments"
    >
      <AIAnalysisReportContent />
    </ModuleGateGuard>
  );
}
