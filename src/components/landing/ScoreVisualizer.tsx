"use client";

import React, { useState } from "react";
import { Sliders, Cpu, Sparkles, TrendingUp, AlertTriangle, RefreshCw, Award } from "lucide-react";

export const ScoreVisualizer: React.FC = () => {
  const [scores, setScores] = useState({
    career: 88,
    finance: 82,
    skills: 91,
    health: 76,
    assessments: 85,
  });

  const handleSlider = (key: keyof typeof scores, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const totalScore = Math.round(
    scores.career * 0.25 +
    scores.finance * 0.25 +
    scores.skills * 0.20 +
    scores.health * 0.15 +
    scores.assessments * 0.15
  );

  const getTier = (s: number) => {
    if (s >= 88) return { label: "EXECUTIVE ASSET TIER", color: "#10b981", bg: "bg-[#10b981]/10 border-[#10b981]/30" };
    if (s >= 75) return { label: "HIGH CAPITAL ACCELERATION", color: "#3b82f6", bg: "bg-[#3b82f6]/10 border-[#3b82f6]/30" };
    if (s >= 60) return { label: "EMERGING TRAJECTORY", color: "#f59e0b", bg: "bg-[#f59e0b]/10 border-[#f59e0b]/30" };
    return { label: "OPTIMIZATION REQUIRED", color: "#ef4444", bg: "bg-rose-500/10 border-rose-500/30" };
  };

  const tier = getTier(totalScore);

  const resetScores = () => {
    setScores({ career: 88, finance: 82, skills: 91, health: 76, assessments: 85 });
  };

  const estimatedNPV = (totalScore * 0.065).toFixed(2);

  return (
    <section id="visualizer" className="py-32 relative bg-[#090d1a]">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#3b82f6]/04 blur-[160px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-xs font-mono font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>SHOWCASE ENGINE</span>
          </div>
          <h2 className="section-headline">
            Interactive AI Score <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]">
              Simulator & Value Engine
            </span>
          </h2>
          <p className="body-text mx-auto">
            Adjust dimension sliders to simulate how changes in financial runway, skill architecture, or health stamina directly compound your lifetime asset valuation.
          </p>
        </div>

        {/* Showcase Glass Terminal Container */}
        <div className="card-surface p-8 sm:p-10 space-y-8">

          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                <Sliders className="w-5 h-5 text-[#3b82f6]" />
              </div>
              <div>
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wide">
                  HUMAN_CAPITAL_SCORING_SIMULATOR_v3.0
                </h3>
                <p className="text-xs text-[#94a3b8]">Drag dimension sliders to compute live index</p>
              </div>
            </div>

            <button
              onClick={resetScores}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#090d1a] hover:bg-[#111827] border border-white/[0.08] text-xs font-mono text-[#94a3b8] hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span>Reset Values</span>
            </button>
          </div>

          {/* Grid Layout: Sliders Left (7 Cols), Live Analytics Right (5 Cols) */}
          <div className="grid lg:grid-cols-12 gap-8 items-center">

            {/* Sliders List */}
            <div className="lg:col-span-7 space-y-4">

              {/* Slider 1: Career */}
              <div className="space-y-3 bg-[#090d1a] p-4.5 rounded-2xl border border-white/[0.08] hover:border-white/[0.15] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    1. Career Trajectory & Title Mobility <span className="text-xs text-[#94a3b8] font-normal">(25% Weight)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#3b82f6] bg-[#3b82f6]/10 px-2.5 py-1 rounded-md border border-[#3b82f6]/20">
                    {scores.career} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.career}
                  onChange={(e) => handleSlider("career", parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                  <span>30 (Min Baseline)</span>
                  <span>100 (Peak Trajectory)</span>
                </div>
              </div>

              {/* Slider 2: Finance */}
              <div className="space-y-3 bg-[#090d1a] p-4.5 rounded-2xl border border-white/[0.08] hover:border-white/[0.15] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    2. Financial Independence & Runway <span className="text-xs text-[#94a3b8] font-normal">(25% Weight)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded-md border border-[#10b981]/20">
                    {scores.finance} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.finance}
                  onChange={(e) => handleSlider("finance", parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                  <span>30 (Min Runway)</span>
                  <span>100 (High Independence)</span>
                </div>
              </div>

              {/* Slider 3: Skills */}
              <div className="space-y-3 bg-[#090d1a] p-4.5 rounded-2xl border border-white/[0.08] hover:border-white/[0.15] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    3. Skills Architecture & Tech Mastery <span className="text-xs text-[#94a3b8] font-normal">(20% Weight)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#06b6d4] bg-[#06b6d4]/10 px-2.5 py-1 rounded-md border border-[#06b6d4]/20">
                    {scores.skills} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.skills}
                  onChange={(e) => handleSlider("skills", parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                  <span>30 (Novice Stack)</span>
                  <span>100 (AI Architecture Mastery)</span>
                </div>
              </div>

              {/* Slider 4: Health */}
              <div className="space-y-3 bg-[#090d1a] p-4.5 rounded-2xl border border-white/[0.08] hover:border-white/[0.15] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    4. Health & Biological Stamina <span className="text-xs text-[#94a3b8] font-normal">(15% Weight)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#f59e0b] bg-[#f59e0b]/10 px-2.5 py-1 rounded-md border border-[#f59e0b]/20">
                    {scores.health} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.health}
                  onChange={(e) => handleSlider("health", parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                  <span>30 (Low Recovery)</span>
                  <span>100 (Optimal HRV/Stamina)</span>
                </div>
              </div>

              {/* Slider 5: Psychometrics */}
              <div className="space-y-3 bg-[#090d1a] p-4.5 rounded-2xl border border-white/[0.08] hover:border-white/[0.15] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    5. Psychometric EQ & Decision Velocity <span className="text-xs text-[#94a3b8] font-normal">(15% Weight)</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded-md border border-purple-400/20">
                    {scores.assessments} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={scores.assessments}
                  onChange={(e) => handleSlider("assessments", parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#64748b]">
                  <span>30 (Baseline Focus)</span>
                  <span>100 (Executive Velocity)</span>
                </div>
              </div>

            </div>

            {/* Live Analytics Outcome (5 Cols) */}
            <div className="lg:col-span-5 bg-[#090d1a] p-8 rounded-2xl border border-white/[0.08] text-center space-y-6">
              <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-widest block font-bold">
                COMPUTED HUMAN CAPITAL SCORE
              </span>

              {/* Score & Tier Badge */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-baseline justify-center gap-1 font-mono">
                  <span className="text-6xl font-black text-white tracking-tight">
                    {totalScore}
                  </span>
                  <span className="text-sm font-semibold text-[#94a3b8]">/100</span>
                </div>

                <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border ${tier.bg}`} style={{ color: tier.color }}>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{tier.label}</span>
                </div>
              </div>

              {/* Live Real-time Insights */}
              <div className="text-left space-y-3 pt-4 border-t border-white/[0.08] text-xs">
                <div className="flex items-start gap-2 text-white">
                  <TrendingUp className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                  <span>
                    Highest Strength: <strong className="text-[#06b6d4]">{scores.skills > scores.career ? "Skills Architecture" : "Career Mobility"}</strong> ({Math.max(scores.skills, scores.career)} pts).
                  </span>
                </div>
                <div className="flex items-start gap-2 text-white">
                  <AlertTriangle className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5" />
                  <span>
                    Weakest Area: <strong className="text-[#f59e0b]">{scores.health < scores.finance ? "Health & Stamina" : "Financial Runway"}</strong> ({Math.min(scores.health, scores.finance)} pts).
                  </span>
                </div>
                <div className="flex items-start gap-2 text-white">
                  <Award className="w-4 h-4 text-[#3b82f6] shrink-0 mt-0.5" />
                  <span>
                    Estimated Lifetime Value: <strong className="text-[#10b981] font-mono font-bold">₹{estimatedNPV} Cr NPV</strong>.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#wizard"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#3b82f6] hover:bg-[#2563eb] transition-colors shadow-lg shadow-[#3b82f6]/20"
                >
                  <span>Lock In Your Score via Assessment →</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ScoreVisualizer;
