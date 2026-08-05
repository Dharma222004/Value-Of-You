"use client";

import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Sparkles, Activity } from "lucide-react";

export const CareerDetail: React.FC = () => {
  return (
    <section id="career-detail" className="py-32 relative bg-[#05070f]">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#3b82f6]/04 blur-[140px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-xs font-mono font-semibold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            <span>EXECUTIVE CAREER TELEMETRY</span>
          </div>
          <h2 className="section-headline">
            Career Mobility & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]">
              Executive Intelligence Dashboard
            </span>
          </h2>
          <p className="body-text mx-auto">
            Real-time telemetry tracking title velocity, market scarcity premium, AI disruption shielding, and executive team leverage.
          </p>
        </div>

        {/* Dashboard Glass Container */}
        <div className="card-surface p-8 sm:p-10 space-y-8">
          
          {/* Header Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">CAREER_MOBILITY_ENGINE_v4.2</h3>
                <span className="text-[#94a3b8]">Audited against Fortune 500 & Unicorn benchmarks</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#10b981] font-semibold bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">
                ● 98.4th Percentile Velocity
              </span>
            </div>
          </div>

          {/* Grid Layout: Gauge + Trend Line + AI Recs */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Column 1: Career Score Gauge & Metrics (4 Cols) */}
            <div className="lg:col-span-4 bg-[#090d1a] rounded-2xl p-6 border border-white/[0.08] space-y-6 text-center">
              <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider block font-semibold">
                CAREER TRAJECTORY INDEX
              </span>

              <div className="relative w-40 h-40 mx-auto rounded-full flex flex-col items-center justify-center border-4 border-[#3b82f6]/30 bg-[#05070f]">
                <div className="text-4xl font-black font-mono text-white tracking-tight">88</div>
                <span className="text-xs font-mono text-[#94a3b8]">/100</span>
              </div>

              <div className="space-y-3 text-left font-mono text-xs">
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Title Velocity</span>
                  <span className="text-[#10b981] font-bold">+2.4 yrs ahead</span>
                </div>
                <div className="flex justify-between text-[#94a3b8]">
                  <span>Market Scarcity</span>
                  <span className="text-[#3b82f6] font-bold">Top 3% Rare</span>
                </div>
                <div className="flex justify-between text-[#94a3b8]">
                  <span>AI Disruption Shield</span>
                  <span className="text-[#06b6d4] font-bold">High Defense (94%)</span>
                </div>
              </div>
            </div>

            {/* Column 2: Benchmarks & Trend Line (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#090d1a] rounded-2xl p-6 border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#94a3b8] font-bold">5-YEAR TRAJECTORY PROJECTION</span>
                  <span className="text-[#10b981] font-bold">+42% Growth</span>
                </div>

                {/* Simulated Chart Bars */}
                <div className="h-32 flex items-end gap-3 pt-4">
                  <div className="flex-1 bg-[#111827] rounded-t h-[40%] transition-all group relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#94a3b8]">2023</span>
                  </div>
                  <div className="flex-1 bg-[#111827] rounded-t h-[55%] transition-all group relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#94a3b8]">2024</span>
                  </div>
                  <div className="flex-1 bg-[#3b82f6]/60 rounded-t h-[70%] transition-all relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white font-bold">2025</span>
                  </div>
                  <div className="flex-1 bg-gradient-to-t from-[#3b82f6] to-[#06b6d4] rounded-t h-[90%] transition-all relative">
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-[#10b981] font-bold">2026</span>
                  </div>
                </div>

                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Target trajectory indicates executive promotion readiness within 12–18 months.
                </p>
              </div>

              {/* Benchmarks Card */}
              <div className="bg-[#090d1a] rounded-2xl p-5 border border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-[#94a3b8] block">COHORT BENCHMARK</span>
                  <span className="text-white font-bold">Staff / Principal IC & VP Trajectory</span>
                </div>
                <span className="text-[#3b82f6] font-bold bg-[#3b82f6]/10 px-2.5 py-1 rounded border border-[#3b82f6]/20">
                  TOP 5%
                </span>
              </div>
            </div>

            {/* Column 3: AI Recommendations & Action Plan (4 Cols) */}
            <div className="lg:col-span-4 bg-[#090d1a] rounded-2xl p-6 border border-white/[0.08] space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#06b6d4]">
                <Sparkles className="w-4 h-4" />
                <span>AI EXECUTIVE RECOMMENDATIONS</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-[#05070f] border border-white/[0.08] space-y-1">
                  <span className="font-bold text-white block">1. Expand Equity Leverage</span>
                  <p className="text-[#94a3b8]">Negotiate performance-indexed equity grants or profit-share allocations in Q3.</p>
                </div>

                <div className="p-3 rounded-xl bg-[#05070f] border border-white/[0.08] space-y-1">
                  <span className="font-bold text-white block">2. Public Technical Scarcity</span>
                  <p className="text-[#94a3b8]">Publish 2 industry case studies on AI automation architecture to boost board visibility.</p>
                </div>

                <div className="p-3 rounded-xl bg-[#05070f] border border-white/[0.08] space-y-1">
                  <span className="font-bold text-white block">3. Board Advisory Path</span>
                  <p className="text-[#94a3b8]">Secure 1 early-stage startup advisory seat to diversify professional influence.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CareerDetail;
