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
  Play,
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from "lucide-react";

interface HeroProps {
  onStartAssessment?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment }) => {
  const [score, setScore] = useState(86);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => (prev >= 92 ? 80 : prev + 1));
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const subScores = [
    { label: "Education & Career", val: 88, color: "#3b82f6", progressGrad: "from-[#3b82f6] to-[#60a5fa]", shadow: "rgba(59,130,246,0.5)", Icon: Briefcase },
    { label: "Financial Capital",  val: 82, color: "#10b981", progressGrad: "from-[#10b981] to-[#34d399]", shadow: "rgba(16,185,129,0.5)", Icon: DollarSign },
    { label: "Skills & AI Stack",  val: 91, color: "#06b6d4", progressGrad: "from-[#06b6d4] to-[#22d3ee]", shadow: "rgba(6,182,212,0.5)",  Icon: Award },
    { label: "Health & Stamina",   val: 76, color: "#f43f5e", progressGrad: "from-[#f43f5e] to-[#fb7185]", shadow: "rgba(244,63,94,0.5)",  Icon: HeartPulse },
    { label: "Behavioral EQ",      val: 85, color: "#8b5cf6", progressGrad: "from-[#8b5cf6] to-[#a78bfa]", shadow: "rgba(139,92,246,0.5)", Icon: Brain },
  ];

  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36 overflow-hidden text-white bg-[#0a0f1d]">

      {/* Floating ambient luminous orbs — crisp, vibrant lighting */}
      <div className="orb-1 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-radial from-[#3b82f6]/28 via-[#06b6d4]/16 to-transparent blur-[70px] pointer-events-none rounded-full" />
      <div className="orb-2 absolute top-1/4 right-[8%] w-[300px] h-[300px] bg-[#8b5cf6]/20 blur-[55px] pointer-events-none rounded-full" />
      <div className="orb-3 absolute bottom-1/4 left-[6%] w-[260px] h-[260px] bg-[#10b981]/20 blur-[55px] pointer-events-none rounded-full" />

      {/* Institutional Grid Background Overlay */}
      <div className="absolute inset-0 bg-institutional-grid opacity-75 pointer-events-none" />

      <div className="grid-container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
              <span className="hero-line-1 block text-white">
                Quantify Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] animate-gradient-text">
                  Human Value.
                </span>
              </span>
              <span className="hero-line-2 block text-white">
                Construct Your Future
              </span>
              <span className="hero-line-3 block text-white">
                Potential.
              </span>
            </h1>

            {/* Body text */}
            <p className="hero-body-anim body-text text-base sm:text-lg text-[#cbd5e1] max-w-xl leading-relaxed">
              Measure who you are today and discover your future potential through a unified framework built from your education, skills, finance, health, and behavioral intelligence.
            </p>

            {/* CTAs */}
            <div className="hero-cta-anim flex flex-wrap items-center gap-4 pt-2 font-mono text-sm">
              <motion.button
                onClick={onStartAssessment}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-white bg-[#2563eb] hover:bg-[#1d4ed8] transition-colors shadow-xl shadow-[#3b82f6]/35 border border-[#3b82f6]/60"
              >
                <span>Calculate Human Value</span>
                <ArrowRight className="w-4 h-4 arrow-bounce" />
              </motion.button>

              <a
                href="#visualizer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-[#e2e8f0] hover:text-white bg-[#111a33] hover:bg-[#182447] border border-white/[0.16] hover:border-white/[0.3] transition-all shadow-md"
              >
                <Play className="w-4 h-4 text-[#06b6d4] fill-[#06b6d4]" />
                <span>Explore Simulator</span>
              </a>
            </div>

          </div>

          {/* Right Column: Dashboard card */}
          <div className="lg:col-span-5 hero-card-anim">
            <motion.div
              whileHover={{ scale: 1.012, y: -5 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl p-6 sm:p-7 bg-[#111a33] border border-white/[0.18] shadow-2xl shadow-black/80 hover:border-white/[0.3] transition-colors duration-300 group overflow-hidden"
            >
              {/* Top highlight line */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#3b82f6]/90 to-transparent rounded-t-2xl" />

              {/* Scan line */}
              <div className="scan-line absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#06b6d4]/50 to-transparent pointer-events-none" />

              {/* Ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#3b82f6]/20 via-[#06b6d4]/20 to-[#10b981]/20 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />

              {/* Terminal header */}
              <div className="flex items-center justify-between border-b border-white/[0.12] pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <span className="font-mono text-xs text-white font-bold tracking-wider ml-2 uppercase">
                    EXECUTIVE TELEMETRY
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#10b981]/20 px-2.5 py-1 rounded-full border border-[#10b981]/40 shadow-[0_0_12px_rgba(16,185,129,0.3)] glow-pulse-green">
                  <span className="blink-dot w-2 h-2 rounded-full bg-[#10b981]" />
                  <span className="text-[10px] font-mono font-bold text-[#34d399] tracking-wider uppercase">
                    LIVE INDEX
                  </span>
                </div>
              </div>

              {/* Gauge + bars grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">

                {/* Radial gauge */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center relative py-1">
                  <div className="relative w-44 h-44 rounded-full flex items-center justify-center bg-[#070a14] border border-white/[0.1] shadow-inner shadow-black/90 p-1">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.05)" strokeWidth="5.5" fill="transparent" />
                      <circle
                        cx="50" cy="50" r="44"
                        stroke="url(#heroGaugeGrad)"
                        strokeWidth="6"
                        strokeDasharray={276.46}
                        strokeDashoffset={276.46 - (276.46 * score) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                      />
                      <defs>
                        <linearGradient id="heroGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%"   stopColor="#3b82f6" />
                          <stop offset="50%"  stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 space-y-1">
                      <span className="text-[9px] font-mono font-bold text-[#94a3b8] uppercase tracking-widest leading-none">Human Value</span>
                      <div className="flex items-baseline justify-center gap-0.5">
                        <motion.span
                          key={score}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight drop-shadow-md"
                        >
                          {score}
                        </motion.span>
                        <span className="text-xs font-mono text-[#64748b] font-semibold">/100</span>
                      </div>
                      <span className="inline-block text-[9px] font-mono font-bold text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded-full border border-[#10b981]/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] whitespace-nowrap">
                        Top 5% Cohort
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-score bars */}
                <div className="sm:col-span-7 space-y-2.5 font-mono text-xs">
                  {subScores.map((s, i) => {
                    const SubIcon = s.Icon;
                    return (
                      <div
                        key={s.label}
                        className="space-y-1 p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="flex items-center gap-1.5 font-semibold text-[#e2e8f0]">
                            <SubIcon className="w-3.5 h-3.5" style={{ color: s.color }} />
                            <span>{s.label}</span>
                          </span>
                          <span className="text-white font-bold">{s.val}/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#0a0f1d] rounded-full overflow-hidden border border-white/[0.1]">
                          <div
                            className={`h-full bg-gradient-to-r ${s.progressGrad} rounded-full bar-fill`}
                            style={{
                              width: `${s.val}%`,
                              boxShadow: `0 0 8px ${s.shadow}`,
                              animationDelay: `${0.7 + i * 0.1}s`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
