"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  DollarSign,
  HeartPulse,
  Award,
  Brain,
  Play
} from "lucide-react";

interface HeroProps {
  onStartAssessment?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment }) => {
  const [score, setScore] = useState(85);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => (prev >= 92 ? 80 : prev + 1));
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const subScores = [
    { label: "Education & Career", val: 88, color: "#3b82f6", progressGrad: "from-[#3b82f6] to-[#60a5fa]", shadow: "rgba(59,130,246,0.5)", Icon: Briefcase },
    { label: "Financial Capital", val: 82, color: "#10b981", progressGrad: "from-[#10b981] to-[#34d399]", shadow: "rgba(16,185,129,0.5)", Icon: DollarSign },
    { label: "Skills & AI Stack", val: 91, color: "#06b6d4", progressGrad: "from-[#06b6d4] to-[#22d3ee]", shadow: "rgba(6,182,212,0.5)", Icon: Award },
    { label: "Health & Stamina", val: 76, color: "#f43f5e", progressGrad: "from-[#f43f5e] to-[#fb7185]", shadow: "rgba(244,63,94,0.5)", Icon: HeartPulse },
    { label: "Behavioral EQ", val: 85, color: "#8b5cf6", progressGrad: "from-[#8b5cf6] to-[#a78bfa]", shadow: "rgba(139,92,246,0.5)", Icon: Brain },
  ];

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36 overflow-hidden bg-institutional-grid text-white">

      {/* Soft Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] bg-radial from-[#3b82f6]/12 via-[#06b6d4]/05 to-transparent blur-[150px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Headline, Supporting Copy, CTAs (55% / 7 cols) */}
          <motion.div
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Headline */}
            <h1 className="hero-headline text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Quantify Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]">
                Human Value.
              </span>
              <br />
              Construct Your Future Potential.
            </h1>

            {/* Body Text */}
            <p className="body-text text-base sm:text-lg text-[#94a3b8] max-w-xl leading-relaxed">
              Measure who you are today and discover your future potential through a unified framework built from your education, skills, finance, health, and behavioral intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-sm">
              <button
                onClick={onStartAssessment}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.98] transition-all shadow-xl shadow-[#3b82f6]/25 border border-[#3b82f6]/40"
              >
                <span>Calculate Human Value</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#visualizer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-white bg-[#0f1526] hover:bg-[#151c33] border border-white/[0.1] hover:border-white/[0.22] transition-all"
              >
                <Play className="w-3.5 h-3.5 text-[#06b6d4] fill-[#06b6d4]" />
                <span>Explore Simulator</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Executive Dashboard Centerpiece (45% / 5 cols) */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="relative rounded-2xl p-6 sm:p-7 bg-[#0b1021]/85 backdrop-blur-2xl border border-white/[0.1] shadow-2xl shadow-black/80 hover:border-white/[0.18] transition-all duration-300 group">
              {/* Top Highlight line */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#3b82f6]/60 to-transparent rounded-t-2xl" />

              {/* Background ambient glow behind card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#3b82f6]/10 via-[#06b6d4]/10 to-[#10b981]/10 rounded-2xl blur-xl opacity-50 group-hover:opacity-90 transition-opacity pointer-events-none -z-10" />

              {/* Terminal Window Header */}
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]/70" />
                  <span className="font-mono text-xs text-[#94a3b8] font-bold tracking-wider ml-2 uppercase">
                    EXECUTIVE TELEMETRY
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#10b981]/10 px-2.5 py-1 rounded-full border border-[#10b981]/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-[#10b981] tracking-wider uppercase">
                    LIVE INDEX
                  </span>
                </div>
              </div>

              {/* Main Radial Gauge & Sub-Score Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">

                {/* Radial Gauge */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center relative py-1">
                  <div className="relative w-44 h-44 rounded-full flex items-center justify-center bg-[#070a14] border border-white/[0.1] shadow-inner shadow-black/90 p-1">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background track circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="5.5"
                        fill="transparent"
                      />
                      {/* Gauge progress arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        stroke="url(#heroGaugeGradient)"
                        strokeWidth="6"
                        strokeDasharray={276.46}
                        strokeDashoffset={276.46 - (276.46 * score) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                      />
                      <defs>
                        <linearGradient id="heroGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 space-y-1">
                      <span className="text-[9px] font-mono font-bold text-[#94a3b8] uppercase tracking-widest leading-none">
                        Human Value
                      </span>

                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight drop-shadow-md">
                          {score}
                        </span>
                        <span className="text-xs font-mono text-[#64748b] font-semibold">/100</span>
                      </div>

                      <span className="inline-block text-[9px] font-mono font-bold text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-full border border-[#10b981]/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] whitespace-nowrap">
                        Top 5% Cohort
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-Score Bars (All 5 Dimensions) */}
                <div className="sm:col-span-7 space-y-2.5 font-mono text-xs">
                  {subScores.map((s) => {
                    const SubIcon = s.Icon;
                    return (
                      <div key={s.label} className="space-y-1 p-1.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                        <div className="flex justify-between items-center text-[#94a3b8] text-[11px]">
                          <span className="flex items-center gap-1.5 font-medium text-[#cbd5e1]">
                            <SubIcon className="w-3.5 h-3.5" style={{ color: s.color }} />
                            <span>{s.label}</span>
                          </span>
                          <span className="text-white font-bold font-mono">{s.val}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#050814] rounded-full overflow-hidden p-0.5 border border-white/[0.05]">
                          <div
                            className={`h-full bg-gradient-to-r ${s.progressGrad} rounded-full`}
                            style={{ width: `${s.val}%`, boxShadow: `0 0 8px ${s.shadow}` }}
                          />
                        </div>
                      </div>
                    );
                  })}
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

