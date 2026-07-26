"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Cpu, Award, LineChart } from "lucide-react";

interface HeroProps {
  onStartAssessment?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment }) => {
  const [score, setScore] = useState(82);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => (prev >= 92 ? 78 : prev + 1));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background Radial Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-emerald-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-sky-600/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Copy & Primary CTAs */}
          <motion.div
            className="lg:col-span-7 text-left space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
              <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-ping" />
              <span className="text-xs font-semibold text-slate-300 font-mono tracking-wide">
                EXECUTIVE HUMAN CAPITAL VALUATION PLATFORM
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Quantify Your Worth. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
                Accelerate Your Trajectory.
              </span>
            </h1>

            {/* Value Proposition Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Synthesize your career velocity, liquid financial runway, technical skill mastery, physical endurance, and decision psychometrics into one unified{" "}
              <strong className="text-white font-semibold">Human Capital Score (0–100)</strong> to engineer your long-term wealth growth.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartAssessment}
                className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-300 hover:from-sky-300 hover:to-emerald-300 shadow-xl shadow-sky-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Calculate Your Score</span>
                <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#visualizer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 transition-all duration-200"
              >
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>Explore Score Simulator</span>
              </a>
            </div>

            {/* Feature Guarantee Pills */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-Bit Telemetry</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Real-Time Engine</span>
              </div>
              <div className="flex items-center gap-2">
                <LineChart className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Institutional Matrix</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Score Terminal Card */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative rounded-2xl p-6 glass-panel border border-slate-700/80 shadow-2xl space-y-6">
              
              {/* Card Top Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <span className="font-mono text-xs text-slate-300 font-bold ml-2">HUMAN CAPITAL TELEMETRY</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                  REALTIME INDEX
                </span>
              </div>

              {/* Main Score Gauge Circle */}
              <div className="relative flex flex-col items-center justify-center py-4">
                
                <div className="relative w-48 h-48 rounded-full flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border-4 border-slate-800 shadow-inner">
                  {/* Conic Ring */}
                  <div
                    className="absolute inset-0 rounded-full transition-all duration-700"
                    style={{
                      background: `conic-gradient(#38bdf8 ${score * 3.6}deg, rgba(30, 41, 59, 0.5) 0deg)`,
                    }}
                  />
                  
                  {/* Inner Dial */}
                  <div className="absolute inset-2.5 bg-[#080d1a] rounded-full flex flex-col items-center justify-center shadow-2xl">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Unified Score</span>
                    <div className="flex items-baseline gap-1 my-1">
                      <span className="text-5xl font-black font-mono tracking-tight text-white transition-all duration-300">
                        {score}
                      </span>
                      <span className="text-xs font-mono text-slate-500">/ 100</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                      <TrendingUp className="w-3 h-3" />
                      <span>Top Tier Growth</span>
                    </div>
                  </div>
                </div>

                {/* Dimension Scores Grid */}
                <div className="w-full grid grid-cols-5 gap-1.5 mt-6 pt-4 border-t border-slate-800/80 text-center font-mono text-[11px]">
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">CAREER</span>
                    <span className="text-sky-400 font-bold">84/100</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">FINANCE</span>
                    <span className="text-emerald-400 font-bold">79/100</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">SKILLS</span>
                    <span className="text-indigo-400 font-bold">88/100</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">HEALTH</span>
                    <span className="text-rose-400 font-bold">75/100</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">EVAL</span>
                    <span className="text-purple-400 font-bold">85/100</span>
                  </div>
                </div>

              </div>

              {/* Status Ticker Footer */}
              <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 font-mono text-xs flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-400" />
                  <span>AI Telemetry: Optimal</span>
                </div>
                <span className="text-slate-400">Yield: ₹4.85Cr</span>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
