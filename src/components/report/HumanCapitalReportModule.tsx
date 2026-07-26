"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Printer,
  Share2,
  Download,
  History,
  GitCompare,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Award,
  Briefcase,
  DollarSign,
  HeartPulse,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Target,
  BarChart3,
  Calendar,
  Zap,
  ChevronRight,
  X,
  Check,
  Copy,
} from "lucide-react";
import {
  calculateHumanCapitalScore,
  HumanCapitalCalculationResult,
} from "@/services/scoringEngine";

// Historical Report Snapshots for History & Comparison
const HISTORICAL_SNAPSHOTS = [
  {
    id: "q1_2026",
    period: "Q1 2026 (Current Audit)",
    score: 88,
    rating: "Excellent",
    valuation: "₹4.85 Crores",
    careerReadiness: 89,
    financialReadiness: 82,
    leadershipReadiness: 84,
    learningReadiness: 91,
    netWorth: "₹1.45 Crores",
    runwayMonths: 14,
    date: "July 2026",
  },
  {
    id: "q4_2025",
    period: "Q4 2025 (Previous Audit)",
    score: 84,
    rating: "Excellent",
    valuation: "₹4.35 Crores",
    careerReadiness: 85,
    financialReadiness: 78,
    leadershipReadiness: 80,
    learningReadiness: 86,
    netWorth: "₹1.20 Crores",
    runwayMonths: 11,
    date: "October 2025",
  },
  {
    id: "q3_2025",
    period: "Q3 2025 (Baseline Audit)",
    score: 79,
    rating: "Strong",
    valuation: "₹3.80 Crores",
    careerReadiness: 80,
    financialReadiness: 72,
    leadershipReadiness: 75,
    learningReadiness: 81,
    netWorth: "₹95 Lakhs",
    runwayMonths: 8,
    date: "July 2025",
  },
];

export const HumanCapitalReportModule: React.FC = () => {
  // State for active snapshot / historical view
  const [activeSnapshotId, setActiveSnapshotId] = useState<string>("q1_2026");
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Compute current live telemetry
  const liveResult: HumanCapitalCalculationResult = useMemo(() => {
    return calculateHumanCapitalScore();
  }, []);

  const activeSnapshot = HISTORICAL_SNAPSHOTS.find((s) => s.id === activeSnapshotId) || HISTORICAL_SNAPSHOTS[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Executive Human Capital Report - Alex Vance",
          text: `Human Capital Score: ${liveResult.humanCapitalScore}/100 (${liveResult.overallRating})`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Report shareable link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 font-sans print:p-0 print:m-0 print:bg-white print:text-black">
      {/* TOAST FEEDBACK ALERT */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-emerald-600 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP TOOLBAR & REPORT CONTROLS (Hidden during print) */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-[#070b14] via-[#0e1324] to-[#070b14] flex flex-wrap items-center justify-between gap-4 print:hidden shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
              PHASE 10 · EXECUTIVE HUMAN CAPITAL REPORT
            </span>
            <span className="text-[11px] font-mono text-slate-400">Institutional Grade Telemetry</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Comprehensive Valuation & Capability Report
          </h1>
        </div>

        {/* Action Buttons: Print, PDF, Share, History, Compare */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono font-bold text-sky-400 border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Audits</span>
          </button>

          <button
            onClick={() => setShowHistoryModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span>History ({activeSnapshot.date})</span>
          </button>

          <button
            onClick={handleShare}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Share</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold font-mono flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {/* PRINT STYLES ENFORCEMENT */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .glass-panel {
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
          text, h1, h2, h3, h4, p, span, div {
            color: #000000 !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* --- SECTION 1: OVERALL HUMAN CAPITAL SCORE & EXECUTIVE HEADER --- */}
      <div className="glass-panel p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#0c091a] via-[#080c17] to-[#120a24] shadow-2xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider">
              SUBJECT: ALEX VANCE · SENIOR AI SOLUTIONS ARCHITECT
            </span>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Human Capital Score: {liveResult.humanCapitalScore} / 100
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Audit Date: {activeSnapshot.date} · Methodology: Multi-Vector Capital Synthesis v9.2
            </p>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <span className={`px-4 py-2 rounded-2xl border font-mono font-black text-sm ${liveResult.ratingBadgeBg}`}>
              RATING: {liveResult.overallRating.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-emerald-400">BENCHMARK: TOP 2.8% GLOBAL PEER GROUP</span>
          </div>
        </div>

        {/* THREE HERO METRIC DIALS & PROGRESS RINGS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Circular SVG Progress Ring */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#6366f1"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - liveResult.humanCapitalScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono font-black text-2xl text-white">{liveResult.humanCapitalScore}</span>
            </div>
            <div>
              <div className="text-xs font-mono text-indigo-400 font-bold uppercase">CAPITAL INDEX DIAL</div>
              <div className="text-sm font-bold text-white">Composite Telemetry</div>
              <div className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +4 pts vs Q4 2025
              </div>
            </div>
          </div>

          {/* Lifetime Asset Worth in INR */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">PROJECTED LIFETIME ASSET WORTH</span>
            <div className="text-3xl font-black text-white font-mono">{liveResult.lifetimeValuationINR}</div>
            <span className="text-[10px] text-slate-400">Compounding capital yield trajectory over 25 yrs</span>
          </div>

          {/* Strength / Risk Balance */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">STRENGTH VS RISK BALANCE</span>
            <div className="text-xl font-bold font-mono text-white">
              Strength: <span className="text-indigo-400">{liveResult.strengthIndex}</span> / Risk: <span className="text-rose-400">{liveResult.riskIndex}</span>
            </div>
            <span className="text-[10px] text-emerald-400">Low Vulnerability Ratio (8.2/10)</span>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: EXECUTIVE SUMMARY & C-SUITE SYNTHESIS --- */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <FileText className="w-5 h-5 text-sky-400" />
          <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
            Executive Summary & Strategic Synthesis
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The subject, <strong>Alex Vance</strong>, presents an exceptional human capital profile scoring <strong>{liveResult.humanCapitalScore}/100 ({liveResult.overallRating})</strong>, placing them in the <strong>Top 2.8%</strong> of global engineering and technology leadership cohorts. The subject exhibits strong synergy between high technical execution (AI/ML models, cloud architecture) and decision-making resilience under high-stakes scenarios. Financial runway remains solid at 14 months with a 42% net savings rate, providing ample capital buffer to pursue high-upside venture opportunities and aggressive skill upskilling.
        </p>
      </div>

      {/* --- SECTION 3: 5 INPUT MODULE TELEMETRY SUMMARIES & SVG RADAR CHART --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 5 Module Summaries */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Input Module Telemetry Summaries</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">5 Audited Modules</span>
          </div>

          <div className="space-y-3">
            {/* 1. Current Status */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> 1. Current Status Summary (10% Weight)
                </span>
                <span className="font-mono font-bold text-white">{liveResult.moduleScores.currentStatus} / 100</span>
              </div>
              <p className="text-xs text-slate-300">Senior AI Solutions Engineer · 6 Years Experience · Apex Nexus AI Labs · Employee of the Year 2025.</p>
            </div>

            {/* 2. Financial */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> 2. Financial Health Summary (25% Weight)
                </span>
                <span className="font-mono font-bold text-white">{liveResult.moduleScores.financial} / 100</span>
              </div>
              <p className="text-xs text-slate-300">Net Worth: ₹1.45 Crores · Liquid Runway: 14 Months · Savings Rate: 42% · Zero High-Interest Debt.</p>
            </div>

            {/* 3. Health */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-400 flex items-center gap-2">
                  <HeartPulse className="w-4 h-4" /> 3. Health & Lifestyle Summary (15% Weight)
                </span>
                <span className="font-mono font-bold text-white">{liveResult.moduleScores.health} / 100</span>
              </div>
              <p className="text-xs text-slate-300">Sleep: 7.2 hrs/night · Workouts: 4x/wk · Marathon Runner & Competitive Chess (1890 FIDE) · Low Burnout Risk.</p>
            </div>

            {/* 4. Skills */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-400 flex items-center gap-2">
                  <Award className="w-4 h-4" /> 4. Skills Architecture Summary (20% Weight)
                </span>
                <span className="font-mono font-bold text-white">{liveResult.moduleScores.skills} / 100</span>
              </div>
              <p className="text-xs text-slate-300">Expertise: Python, PyTorch, LLMs, Next.js, Kubernetes · 12 Digital Tools · AWS Professional & OpenAI Certified.</p>
            </div>

            {/* 5. Assessment */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-400 flex items-center gap-2">
                  <Brain className="w-4 h-4" /> 5. Human Assessment Summary (30% Weight)
                </span>
                <span className="font-mono font-bold text-white">{liveResult.moduleScores.assessment} / 100</span>
              </div>
              <p className="text-xs text-slate-300">Psychometrics: Big Five High Conscientiousness · Decision Scenario: 100% Integrity · Aptitude: Top 3% Syllogisms.</p>
            </div>
          </div>
        </div>

        {/* Right Column: 5-Axis SVG Radar Chart & Peer Comparison */}
        <div className="lg:col-span-5 flex flex-col justify-between glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">5-AXIS RADAR TELEMETRY</span>
            <h4 className="text-sm font-bold text-white">Module Capability Distribution</h4>
          </div>

          {/* SVG RADAR CHART */}
          <div className="flex items-center justify-center p-2">
            <svg viewBox="0 0 300 300" className="w-full max-w-[260px] h-auto">
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((r, idx) => (
                <polygon
                  key={idx}
                  points={[
                    [150, 150 - 110 * r],
                    [150 + 104 * r, 150 - 34 * r],
                    [150 + 64 * r, 150 + 89 * r],
                    [150 - 64 * r, 150 + 89 * r],
                    [150 - 104 * r, 150 - 34 * r],
                  ]
                    .map((p) => p.join(","))
                    .join(" ")}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="1"
                />
              ))}

              {[
                [150, 40],
                [254, 116],
                [214, 239],
                [86, 239],
                [46, 116],
              ].map((p, idx) => (
                <line key={idx} x1="150" y1="150" x2={p[0]} y2={p[1]} stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              ))}

              {(() => {
                const s = liveResult.moduleScores;
                const pts = [
                  [150, 150 - 110 * (s.currentStatus / 100)],
                  [150 + 104 * (s.financial / 100), 150 - 34 * (s.financial / 100)],
                  [150 + 64 * (s.health / 100), 150 + 89 * (s.health / 100)],
                  [150 - 64 * (s.skills / 100), 150 + 89 * (s.skills / 100)],
                  [150 - 104 * (s.assessment / 100), 150 - 34 * (s.assessment / 100)],
                ];
                const pointsString = pts.map((p) => p.join(",")).join(" ");
                return (
                  <g>
                    <polygon points={pointsString} fill="rgba(99, 102, 241, 0.4)" stroke="#818cf8" strokeWidth="2.5" />
                    {pts.map((p, idx) => (
                      <circle key={idx} cx={p[0]} cy={p[1]} r="4" fill="#a5b4fc" stroke="#4338ca" strokeWidth="2" />
                    ))}
                  </g>
                );
              })()}

              <text x="150" y="25" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">STATUS</text>
              <text x="260" y="115" textAnchor="start" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">FINANCIAL</text>
              <text x="220" y="255" textAnchor="start" fill="#fb7185" fontSize="9" fontWeight="bold" fontFamily="monospace">HEALTH</text>
              <text x="80" y="255" textAnchor="end" fill="#a78bfa" fontSize="9" fontWeight="bold" fontFamily="monospace">SKILLS</text>
              <text x="40" y="115" textAnchor="end" fill="#c084fc" fontSize="9" fontWeight="bold" fontFamily="monospace">EVALUATION</text>
            </svg>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 text-center">
            Symmetrical strength polygon with zero critical performance structural collapse.
          </div>
        </div>
      </div>

      {/* --- SECTION 4: READINESS QUADRANTS & BAR CHARTS --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">4 Capital Readiness Quadrants</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Domain Preparedness</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-400 font-mono">1. CAREER READINESS</span>
              <span className="font-mono text-base font-black text-white">{liveResult.careerReadiness} / 100</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-[1px] border border-slate-800">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${liveResult.careerReadiness}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">High portfolio project readiness & AI model fine-tuning expertise.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 font-mono">2. FINANCIAL READINESS</span>
              <span className="font-mono text-base font-black text-white">{liveResult.financialStability} / 100</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-[1px] border border-slate-800">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${liveResult.financialStability}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">14-month liquid runway enables high-upside career transitions.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 font-mono">3. LEADERSHIP READINESS</span>
              <span className="font-mono text-base font-black text-white">{liveResult.leadershipPotential} / 100</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-[1px] border border-slate-800">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${liveResult.leadershipPotential}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">High emotional intelligence, council leadership & team mentoring.</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 font-mono">4. LEARNING READINESS</span>
              <span className="font-mono text-base font-black text-white">{liveResult.learningPotential} / 100</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-[1px] border border-slate-800">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${liveResult.learningPotential}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">12 hrs/wk upskilling velocity & 22 books annual reading volume.</p>
          </div>
        </div>
      </div>

      {/* --- SECTION 5: STRENGTHS, WEAKNESSES & RISK ANALYSIS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Capital Strengths</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Generative AI & Agentic Microservices Mastery</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>14 Months Liquid Debt-Free Runway</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>High Psychometric Integrity & Conscientiousness</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Consistent Physical Discipline (Marathons / Chess)</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm border-b border-slate-800 pb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>Weaknesses & Optimization Areas</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300 font-mono">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">⚠</span>
              <span>Moderate Public Speaking Frequency (2 events/yr)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">⚠</span>
              <span>Single-Industry Revenue Concentration (AI SaaS)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">⚠</span>
              <span>Occasional Sleep Variations on Crunch Deadlines</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm border-b border-slate-800 pb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Risk Matrix Analysis</span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Financial Deficit Risk</span>
              <strong className="text-emerald-400">LOW (12%)</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Skill Obsolescence Risk</span>
              <strong className="text-emerald-400">LOW (15%)</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
              <span className="text-slate-400">Burnout & Health Risk</span>
              <strong className="text-emerald-400">VERY LOW (8%)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 6: AI ROADMAP (30, 90, 180 Days & 1 Year) --- */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              AI Strategic Growth Roadmap (4 Horizon Timelines)
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-400">Action Plan</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 30 Days */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-xs font-mono font-bold text-sky-400">30 DAYS HORIZON</span>
              <span className="text-[10px] font-mono text-slate-500">Immediate</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-sky-400 font-bold">1.</span>
                <span>Lock 14-month liquid reserves into high-yield debt funds.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-sky-400 font-bold">2.</span>
                <span>Establish mandatory 7.5 hr sleep floor during sprint weeks.</span>
              </li>
            </ul>
          </div>

          {/* 90 Days */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-xs font-mono font-bold text-emerald-400">90 DAYS HORIZON</span>
              <span className="text-[10px] font-mono text-slate-500">Quarterly</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">1.</span>
                <span>Complete AWS Machine Learning Specialty Certification.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">2.</span>
                <span>Publish 2 open-source Agentic RAG microservice repositories.</span>
              </li>
            </ul>
          </div>

          {/* 180 Days */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-xs font-mono font-bold text-purple-400">180 DAYS HORIZON</span>
              <span className="text-[10px] font-mono text-slate-500">Mid-Year</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">1.</span>
                <span>Keynote speaker at 2 international AI summits.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">2.</span>
                <span>Expand TechStars mentor role to 25+ founders.</span>
              </li>
            </ul>
          </div>

          {/* 1 Year */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400">1 YEAR HORIZON</span>
              <span className="text-[10px] font-mono text-slate-500">Annual Vision</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">1.</span>
                <span>Achieve VP of AI Engineering / Founder Equity stake.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">2.</span>
                <span>Elevate Human Capital Score to 94+ (Elite Apex Tier).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- HISTORY SNAPSHOT MODAL --- */}
      <AnimatePresence>
        {showHistoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 print:hidden"
          >
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-xl w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-400" />
                  <span>Select Historical Audit Snapshot</span>
                </h3>
                <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {HISTORICAL_SNAPSHOTS.map((snap) => (
                  <button
                    key={snap.id}
                    onClick={() => {
                      setActiveSnapshotId(snap.id);
                      setShowHistoryModal(false);
                      showToast(`Switched report view to ${snap.period}`);
                    }}
                    className={`w-full p-4 rounded-2xl text-left flex items-center justify-between border transition-all ${
                      activeSnapshotId === snap.id
                        ? "bg-purple-950/60 border-purple-500 text-white"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm">{snap.period}</div>
                      <div className="text-xs text-slate-400 font-mono">Net Worth: {snap.netWorth} · Runway: {snap.runwayMonths} mos</div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-lg font-black text-purple-400">{snap.score} / 100</div>
                      <div className="text-[10px] text-slate-400">{snap.date}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SIDE-BY-SIDE AUDIT COMPARISON MODAL --- */}
      <AnimatePresence>
        {showCompareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 print:hidden"
          >
            <div className="glass-panel p-8 rounded-3xl border border-sky-500/30 max-w-3xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-sky-400 font-bold font-mono">
                  <GitCompare className="w-5 h-5" />
                  <span className="text-base text-white">Quarterly Audit Score Comparison</span>
                </div>
                <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="p-3">Metric Dimension</th>
                      <th className="p-3">Q3 2025 (Baseline)</th>
                      <th className="p-3">Q4 2025 (Previous)</th>
                      <th className="p-3">Q1 2026 (Current)</th>
                      <th className="p-3 text-right">Total Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-3 font-bold text-white">Human Capital Score</td>
                      <td className="p-3 text-slate-400">79 / 100</td>
                      <td className="p-3 text-slate-400">84 / 100</td>
                      <td className="p-3 font-bold text-sky-400">88 / 100</td>
                      <td className="p-3 text-right font-bold text-emerald-400">+9 pts</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Asset Valuation (INR)</td>
                      <td className="p-3 text-slate-400">₹3.80 Cr</td>
                      <td className="p-3 text-slate-400">₹4.35 Cr</td>
                      <td className="p-3 font-bold text-sky-400">₹4.85 Cr</td>
                      <td className="p-3 text-right font-bold text-emerald-400">+₹1.05 Cr</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Career Readiness</td>
                      <td className="p-3 text-slate-400">80 / 100</td>
                      <td className="p-3 text-slate-400">85 / 100</td>
                      <td className="p-3 font-bold text-sky-400">89 / 100</td>
                      <td className="p-3 text-right font-bold text-emerald-400">+9 pts</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Financial Readiness</td>
                      <td className="p-3 text-slate-400">72 / 100</td>
                      <td className="p-3 text-slate-400">78 / 100</td>
                      <td className="p-3 font-bold text-emerald-400">82 / 100</td>
                      <td className="p-3 text-right font-bold text-emerald-400">+10 pts</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Liquid Runway</td>
                      <td className="p-3 text-slate-400">8 Months</td>
                      <td className="p-3 text-slate-400">11 Months</td>
                      <td className="p-3 font-bold text-emerald-400">14 Months</td>
                      <td className="p-3 text-right font-bold text-emerald-400">+6 Months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HumanCapitalReportModule;
