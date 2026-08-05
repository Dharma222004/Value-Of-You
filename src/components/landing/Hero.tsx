"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Lock,
  Activity,
  Briefcase,
  DollarSign,
  HeartPulse,
  Award,
  Sparkles,
  Play
} from "lucide-react";

interface HeroProps {
  onStartAssessment?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment }) => {
  const [score, setScore] = useState(84);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => (prev >= 92 ? 79 : prev + 1));
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-36 pb-24 lg:pt-44 lg:pb-32 overflow-hidden bg-institutional-grid">
      
      {/* Soft Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial from-[#3b82f6]/10 via-[#06b6d4]/04 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Headline, Supporting Copy, CTAs, Customer Metrics, Trust Badges (55% / 7 cols) */}
          <motion.div
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >

            {/* Headline: 60-68px typography */}
            <h1 className="hero-headline">
              Quantify Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]">
                Human Capital.
              </span>
              <br />
              Engineer Future Wealth.
            </h1>

            {/* Body Text limited width ~520px */}
            <p className="body-text">
              Synthesize your career trajectory, liquid runway, skill architecture, biological stamina, and decision psychometrics into one unified, real-time index.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartAssessment}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-sm font-semibold text-white bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.98] transition-all shadow-xl shadow-[#3b82f6]/20"
              >
                <span>Calculate Human Capital</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#visualizer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-white bg-[#0f1526] hover:bg-[#151c33] border border-white/[0.08] hover:border-white/[0.16] transition-all"
              >
                <Play className="w-3.5 h-3.5 text-[#06b6d4] fill-[#06b6d4]" />
                <span>View Live Demo</span>
              </a>
            </div>

            {/* Small Customer Metrics / Stats */}
            <div className="flex items-center gap-6 pt-2 font-mono text-xs text-[#94a3b8]">
              <div>
                <span className="text-white font-bold text-base block">₹4,850 Cr+</span>
                <span>Assets Evaluated</span>
              </div>
              <div className="w-[1px] h-8 bg-white/[0.08]" />
              <div>
                <span className="text-white font-bold text-base block">99.4%</span>
                <span>Model Precision</span>
              </div>
              <div className="w-[1px] h-8 bg-white/[0.08]" />
              <div>
                <span className="text-white font-bold text-base block">12,500+</span>
                <span>Active Executives</span>
              </div>
            </div>

            {/* Trust Badges Below Buttons & Metrics */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/[0.07] text-xs font-medium text-[#94a3b8]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#10b981] shrink-0" />
                <span>AES-256 Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3b82f6] shrink-0" />
                <span>AI Benchmarking</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#06b6d4] shrink-0" />
                <span>100% Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <span>Real-time Telemetry</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Executive Dashboard Centerpiece (45% / 5 cols) */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="card-surface relative space-y-6">
              
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b]" />
                  <span className="font-mono text-xs text-[#94a3b8] font-semibold ml-2">EXECUTIVE TELEMETRY</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/20">
                    LIVE INDEX
                  </span>
                </div>
              </div>

              {/* Main Radial Gauge & Sub-Score Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                
                {/* Radial Gauge */}
                <div className="sm:col-span-6 flex flex-col items-center justify-center relative py-2">
                  <div className="relative w-40 h-40 rounded-full flex items-center justify-center bg-[#090d1a] border border-white/[0.08]">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="url(#heroGaugeGradient)"
                        strokeWidth="8"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * score) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                      <defs>
                        <linearGradient id="heroGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-wider">Human Capital</span>
                      <div className="flex items-baseline gap-0.5 my-0.5">
                        <span className="text-3xl font-black font-mono text-white tracking-tight">
                          {score}
                        </span>
                        <span className="text-xs font-mono text-[#94a3b8]">/100</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded-full border border-[#10b981]/20">
                        Top 5% Cohort
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-Score Bars */}
                <div className="sm:col-span-6 space-y-3 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[#94a3b8]">
                      <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3 text-[#3b82f6]" /> Career</span>
                      <span className="text-white font-semibold">88/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#090d1a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#3b82f6] rounded-full w-[88%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[#94a3b8]">
                      <span className="flex items-center gap-1.5"><DollarSign className="w-3 h-3 text-[#10b981]" /> Finance</span>
                      <span className="text-white font-semibold">82/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#090d1a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#10b981] rounded-full w-[82%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[#94a3b8]">
                      <span className="flex items-center gap-1.5"><Award className="w-3 h-3 text-[#06b6d4]" /> Skills</span>
                      <span className="text-white font-semibold">91/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#090d1a] rounded-full overflow-hidden">
                      <div className="h-full bg-[#06b6d4] rounded-full w-[91%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[#94a3b8]">
                      <span className="flex items-center gap-1.5"><HeartPulse className="w-3 h-3 text-rose-400" /> Health</span>
                      <span className="text-white font-semibold">76/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#090d1a] rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full w-[76%]" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Sparkline Footer */}
              <div className="p-3 bg-[#090d1a] rounded-xl border border-white/[0.08] flex items-center justify-between font-mono text-xs text-[#94a3b8]">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#10b981]" />
                  <span>Projected Yield:</span>
                  <span className="text-white font-bold">₹5.42 Cr NPV</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#10b981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  <span>Optimal Trajectory</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
