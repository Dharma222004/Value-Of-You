"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Award,
  Zap,
  Sliders,
  RotateCcw,
  Briefcase,
  DollarSign,
  HeartPulse,
  Brain,
  ChevronRight,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Info,
  Save,
  Layers,
} from "lucide-react";
import {
  calculateHumanCapitalScore,
  DEFAULT_WEIGHTAGE,
  WeightageConfig,
  HumanCapitalCalculationResult,
} from "@/services/scoringEngine";

export const AIScoringEngineModule: React.FC = () => {
  // State for customizable weightages
  const [weightages, setWeightages] = useState<WeightageConfig>(DEFAULT_WEIGHTAGE);
  const [customScores, setCustomScores] = useState({
    currentStatus: 84,
    financial: 79,
    health: 75,
    skills: 88,
    assessment: 85,
  });

  // Calculate live results using reusable service
  const result: HumanCapitalCalculationResult = useMemo(() => {
    return calculateHumanCapitalScore(customScores, weightages);
  }, [customScores, weightages]);

  // Total weight sum helper
  const totalWeightPercent = Math.round(
    (weightages.currentStatus +
      weightages.financial +
      weightages.health +
      weightages.skills +
      weightages.assessment) *
      100
  );

  const resetWeightages = () => {
    setWeightages(DEFAULT_WEIGHTAGE);
  };

  const applyPreset = (preset: "standard" | "skills" | "financial" | "leadership") => {
    if (preset === "standard") {
      setWeightages({ currentStatus: 0.1, financial: 0.25, health: 0.15, skills: 0.2, assessment: 0.3 });
    } else if (preset === "skills") {
      setWeightages({ currentStatus: 0.1, financial: 0.15, health: 0.1, skills: 0.4, assessment: 0.25 });
    } else if (preset === "financial") {
      setWeightages({ currentStatus: 0.1, financial: 0.5, health: 0.1, skills: 0.15, assessment: 0.15 });
    } else if (preset === "leadership") {
      setWeightages({ currentStatus: 0.15, financial: 0.15, health: 0.1, skills: 0.25, assessment: 0.35 });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* HEADER BANNER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0a0d1a] via-[#10152b] to-[#0a0d1a] relative overflow-hidden shadow-2xl">
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                PHASE 9 · AI SCORING ENGINE
              </span>
              <span className="text-[11px] font-mono text-slate-400">Modular Multi-Vector Capital Valuation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Unified Human Capital Score & 7-Index Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Aggregates telemetry across Current Status (10%), Financial (25%), Health (15%), Skills (20%), and Assessment (30%).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetWeightages}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Weightages</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRIMARY SCORE & CLASSIFICATION HIGHLIGHT CARD */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/30 shadow-2xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
                HUMAN CAPITAL SCORE INDEX
              </h2>
              <span className="text-xs text-slate-400">Unified 0–100 Multi-Vector Neural Telemetry</span>
            </div>
          </div>

          {/* Classification Badge */}
          <div className={`px-4 py-2 rounded-2xl border font-mono font-black text-sm flex items-center gap-2 ${result.ratingBadgeBg}`}>
            <ShieldCheck className="w-4 h-4" />
            <span>CLASSIFICATION: {result.overallRating.toUpperCase()}</span>
          </div>
        </div>

        {/* Core KPI Trio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main 0-100 Score Dial */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="text-6xl sm:text-7xl font-black font-mono text-white tracking-tight">
              {result.humanCapitalScore}
            </div>
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest mt-1">
              COMPOSITE SCORE (0 - 100)
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mt-3 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-800">
              <TrendingUp className="w-4 h-4" /> +4.2 PTS THIS QUARTER
            </div>
          </div>

          {/* Asset Valuation Projection */}
          <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">PROJECTED ASSET WORTH (INR)</span>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">{result.lifetimeValuationINR}</div>
            <p className="text-xs text-slate-400">Compounding capital yield based on skills, health runway, and cognitive agility.</p>
          </div>

          {/* Global Percentile */}
          <div className="p-6 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">GLOBAL BENCHMARK PERCENTILE</span>
            <div className="text-3xl sm:text-4xl font-black text-sky-400 font-mono">TOP 2.8%</div>
            <p className="text-xs text-slate-400">Validated against institutional human capital data sets.</p>
          </div>
        </div>
      </div>

      {/* 7 CALCULATED SUB-INDICES METRICS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white tracking-tight">7 Core Human Capital Sub-Indices</h2>
          </div>
          <span className="text-xs font-mono text-slate-500">Modular Component Index Metrics</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">1. STRENGTH INDEX</span>
            <div className="text-2xl font-black font-mono text-indigo-400">{result.strengthIndex} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${result.strengthIndex}%` }} />
            </div>
            <span className="text-[10px] text-slate-400">Skills & Cognitive core depth</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">2. RISK INDEX</span>
            <div className="text-2xl font-black font-mono text-rose-400">{result.riskIndex} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-400 h-full rounded-full" style={{ width: `${result.riskIndex}%` }} />
            </div>
            <span className="text-[10px] text-slate-400">Vulnerability (Lower is better)</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">3. GROWTH POTENTIAL</span>
            <div className="text-2xl font-black font-mono text-sky-400">{result.growthPotential} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${result.growthPotential}%` }} />
            </div>
            <span className="text-[10px] text-slate-400">Upskilling velocity & trajectory</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">4. CAREER READINESS</span>
            <div className="text-2xl font-black font-mono text-amber-400">{result.careerReadiness} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${result.careerReadiness}%` }} />
            </div>
            <span className="text-[10px] text-slate-400">Degree, portfolio & experience</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">5. FINANCIAL STABILITY</span>
            <div className="text-2xl font-black font-mono text-emerald-400">{result.financialStability} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${result.financialStability}%` }} />
            </div>
            <span className="text-[10px] text-slate-400">Runway, savings & debt ratio</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">6. LEADERSHIP POTENTIAL</span>
            <div className="text-2xl font-black font-mono text-purple-400">{result.leadershipPotential} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${result.leadershipPotential}%` }} />
            </div>
            <span className="text-[10px] text-slate-400">Decision ethics & team EQ</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 sm:col-span-2 lg:col-span-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">7. LEARNING POTENTIAL</span>
            <div className="text-2xl font-black font-mono text-cyan-400">{result.learningPotential} <span className="text-xs text-slate-500 font-normal">/ 100</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${result.learningPotential}%` }} />
            </div>
            <span className="text-[10px] text-slate-400">Tech adoption speed & annual reading volume</span>
          </div>
        </div>
      </div>

      {/* INPUT MODULE TELEMETRY & WEIGHTAGE TUNING CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Module Telemetry Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Input Module Telemetry Breakdown</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">5 Input Modules</span>
          </div>

          <div className="space-y-3">
            {[
              { key: "currentStatus", name: "1. Current Status", weight: weightages.currentStatus, icon: Briefcase, color: "text-sky-400" },
              { key: "financial", name: "2. Financial Health", weight: weightages.financial, icon: DollarSign, color: "text-emerald-400" },
              { key: "health", name: "3. Health & Lifestyle", weight: weightages.health, icon: HeartPulse, color: "text-rose-400" },
              { key: "skills", name: "4. Skills Architecture", weight: weightages.skills, icon: Award, color: "text-indigo-400" },
              { key: "assessment", name: "5. Human Assessments", weight: weightages.assessment, icon: Brain, color: "text-purple-400" },
            ].map((m) => {
              const Icon = m.icon;
              const scoreVal = result.moduleScores[m.key as keyof typeof result.moduleScores];
              const contrib = Math.round(scoreVal * m.weight);
              return (
                <div key={m.key} className="glass-panel p-4.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <Icon className={`w-5 h-5 ${m.color}`} />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{m.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Weight: <strong className="text-slate-200">{Math.round(m.weight * 100)}%</strong> · Contribution: <strong className="text-indigo-300">+{contrib} pts</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-lg font-black text-white">{scoreVal} / 100</div>
                    <span className="text-[10px] text-emerald-400">Active Telemetry</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Weightage Tuning & Presets */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white tracking-tight">Weightage Tuning Controls</h3>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-bold">Sum: {totalWeightPercent}%</span>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
            <span className="text-xs font-mono text-slate-400">Quick Strategy Presets:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyPreset("standard")}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-200 border border-slate-800"
              >
                Standard (10/25/15/20/30)
              </button>
              <button
                onClick={() => applyPreset("skills")}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-200 border border-slate-800"
              >
                Skills Focus (40% Tech)
              </button>
              <button
                onClick={() => applyPreset("financial")}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-200 border border-slate-800"
              >
                Financial Focus (50% Fin)
              </button>
              <button
                onClick={() => applyPreset("leadership")}
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-200 border border-slate-800"
              >
                Leadership Focus (35% Eval)
              </button>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-800">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Current Status Weightage</span>
                  <span className="text-sky-400 font-bold">{Math.round(weightages.currentStatus * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={weightages.currentStatus}
                  onChange={(e) => setWeightages({ ...weightages, currentStatus: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Financial Health Weightage</span>
                  <span className="text-emerald-400 font-bold">{Math.round(weightages.financial * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={weightages.financial}
                  onChange={(e) => setWeightages({ ...weightages, financial: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Health & Lifestyle Weightage</span>
                  <span className="text-rose-400 font-bold">{Math.round(weightages.health * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={weightages.health}
                  onChange={(e) => setWeightages({ ...weightages, health: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Skills Architecture Weightage</span>
                  <span className="text-indigo-400 font-bold">{Math.round(weightages.skills * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={weightages.skills}
                  onChange={(e) => setWeightages({ ...weightages, skills: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Human Assessments Weightage</span>
                  <span className="text-purple-400 font-bold">{Math.round(weightages.assessment * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={weightages.assessment}
                  onChange={(e) => setWeightages({ ...weightages, assessment: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIAGNOSTIC STRENGTHS, RISK FACTORS & STRATEGIC ACTION ITEMS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Key Capital Strengths</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            {result.strengthsList.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Risk Factors & Vulnerabilities</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            {result.riskFactorsList.map((r, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">⚠</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>Quarterly Action Plan</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 font-mono">
            {result.actionItems.map((a, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">→</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIScoringEngineModule;
