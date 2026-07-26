"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, Cpu, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";

export const ScoreVisualizer: React.FC = () => {
  const [scores, setScores] = useState({
    career: 80,
    finance: 75,
    skills: 85,
    health: 70,
    assessments: 78,
  });

  const handleSlider = (key: keyof typeof scores, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  // Weighted calculation for 0-100 score
  const totalScore = Math.round(
    scores.career * 0.25 +
    scores.finance * 0.25 +
    scores.skills * 0.2 +
    scores.health * 0.15 +
    scores.assessments * 0.15
  );

  const getTier = (s: number) => {
    if (s >= 85) return { label: "EXECUTIVE CAPITAL", color: "text-emerald-400", bg: "bg-emerald-950/60 border-emerald-800" };
    if (s >= 70) return { label: "HIGH POTENTIAL", color: "text-sky-400", bg: "bg-sky-950/60 border-sky-800" };
    if (s >= 55) return { label: "EMERGING TRAJECTORY", color: "text-amber-400", bg: "bg-amber-950/60 border-amber-800" };
    return { label: "GROWTH REQUIRED", color: "text-rose-400", bg: "bg-rose-950/60 border-rose-800" };
  };

  const tier = getTier(totalScore);

  const resetScores = () => {
    setScores({ career: 80, finance: 75, skills: 85, health: 70, assessments: 78 });
  };

  return (
    <section id="visualizer" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive AI Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Test the Unified <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-300 to-indigo-400">
              Human Capital Simulator
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Adjust your input metrics across the 5 dimensions to simulate how changes in your financial, health, or Personal & Professional Profile directly impact your unified score.
          </p>
        </div>

        {/* Terminal Container */}
        <div className="glass-panel rounded-2xl border border-slate-700/80 p-6 sm:p-10 shadow-2xl space-y-8">

          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20">
                <Sliders className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wide">
                  HUMAN_CAPITAL_SCORING_ENGINE_v1.0
                </h3>
                <p className="text-xs text-slate-400">Drag sliders to test dimension impact</p>
              </div>
            </div>

            <button
              onClick={resetScores}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Values</span>
            </button>
          </div>

          {/* Grid Layout: Sliders Left, Result Right */}
          <div className="grid lg:grid-cols-12 gap-8 items-center">

            {/* Sliders Area (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Slider 1: Career */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">1. Personal & Professional Profile (25%)</span>
                  <span className="text-sky-400 font-bold">{scores.career}/100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={scores.career}
                  onChange={(e) => handleSlider("career", parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              {/* Slider 2: Finance */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">2. FINANCIAL HEALTH (25%)</span>
                  <span className="text-emerald-400 font-bold">{scores.finance}/100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={scores.finance}
                  onChange={(e) => handleSlider("finance", parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Slider 3: Skills */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">3. SKILLS CAPITAL (20%)</span>
                  <span className="text-indigo-400 font-bold">{scores.skills}/100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={scores.skills}
                  onChange={(e) => handleSlider("skills", parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
                />
              </div>

              {/* Slider 4: Health */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">4. HEALTH & LIFESTYLE (15%)</span>
                  <span className="text-amber-400 font-bold">{scores.health}/100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={scores.health}
                  onChange={(e) => handleSlider("health", parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Slider 5: Psychometrics */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">5. PSYCHOMETRIC ASSESSMENTS (15%)</span>
                  <span className="text-purple-400 font-bold">{scores.assessments}/100</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={scores.assessments}
                  onChange={(e) => handleSlider("assessments", parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>

            </div>

            {/* Live Result Display (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 rounded-xl border border-slate-800 text-center space-y-6">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
                COMPUTED HUMAN CAPITAL SCORE
              </span>

              <div className="relative inline-flex items-center justify-center">
                <div className="text-6xl font-black font-mono tracking-tight text-white transition-all duration-200">
                  {totalScore}
                </div>
                <span className="text-sm font-mono text-slate-500 absolute -right-8 bottom-2">/ 100</span>
              </div>

              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border ${tier.bg} ${tier.color}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tier.label}</span>
              </div>

              {/* Dynamic Insights */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-900 text-xs">
                <div className="flex items-start gap-2 text-slate-300">
                  <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Highest Leverage area: <strong className="text-sky-400">{scores.skills > scores.career ? "Skills Capital" : "Personal & Professional Profile"}</strong>.
                  </span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Primary Drag Factor: <strong className="text-amber-400">{scores.health < 75 ? "Health & Lifestyle stamina" : "Financial Liquidity"}</strong>.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#wizard"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-lg shadow-sky-600/20"
                >
                  <span>Take Full Assessment to Lock Score</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
