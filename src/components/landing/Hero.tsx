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
  CheckCircle2
} from "lucide-react";

interface HeroProps {
  onStartAssessment?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment }) => {
  const [score, setScore] = useState(87);

  useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => (prev >= 92 ? 82 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const subScores = [
    { label: "Education & Career", val: 88, color: "#60a5fa", bgGrad: "from-[#2563EB] to-[#00D4FF]", glow: "rgba(0, 212, 255, 0.8)", Icon: Briefcase },
    { label: "Financial Capital",  val: 82, color: "#34d399", bgGrad: "from-[#10b981] to-[#34d399]", glow: "rgba(52, 211, 153, 0.8)", Icon: DollarSign },
    { label: "Skills & AI Stack",  val: 91, color: "#00D4FF", bgGrad: "from-[#00D4FF] to-[#4F7CFF]", glow: "rgba(0, 212, 255, 0.85)",  Icon: Award },
    { label: "Health & Stamina",   val: 76, color: "#fb7185", bgGrad: "from-[#f43f5e] to-[#fb7185]", glow: "rgba(251, 113, 133, 0.8)",  Icon: HeartPulse },
    { label: "Behavioral EQ",      val: 85, color: "#B66DFF", bgGrad: "from-[#8b5cf6] to-[#B66DFF]", glow: "rgba(182, 109, 255, 0.8)", Icon: Brain },
  ];

  return (
    <section
      className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 lg:pt-48 lg:pb-36 overflow-hidden text-white"
      style={{
        background: "linear-gradient(180deg, #081224 0%, #0C1830 50%, #101C36 100%)",
      }}
    >
      {/* ── Ambient Lighting: Point 9 (Left: rgba(0, 212, 255, 0.15), Right: rgba(79, 124, 255, 0.15)) ── */}
      <div
        className="absolute top-1/3 -left-20 w-[650px] h-[650px] pointer-events-none rounded-full blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-20 w-[650px] h-[650px] pointer-events-none rounded-full blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(79, 124, 255, 0.15), transparent 70%)",
        }}
      />

      {/* ── Brightened Grid Background: Point 2 (opacity: 0.15 with center glow) ── */}
      <div
        className="absolute inset-0 bg-institutional-grid pointer-events-none"
        style={{ opacity: 0.15 }}
      />

      <div className="grid-container relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* ── Left Column: Headline & CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >

            {/* Live Telemetry Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#2563EB]/25 via-[#00D4FF]/20 to-[#34d399]/25 border border-[#00D4FF]/45 shadow-[0_0_25px_rgba(0,212,255,0.35)] backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D4FF]" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                HUMAN CAPITAL INTELLIGENCE 2.0
              </span>
              <span className="text-[#00D4FF] font-bold text-xs">· LIVE</span>
            </div>

            {/* Headline: Point 3 */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]"
              style={{
                color: "rgba(255, 255, 255, 0.95)",
                textShadow: "0 0 20px rgba(0, 212, 255, 0.25)",
              }}
            >
              <span className="block">
                Quantify Your{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #00D4FF, #4F7CFF, #B66DFF)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.45))",
                  }}
                >
                  Human Value.
                </span>
              </span>
              <span className="block mt-1">
                Construct Your Future Potential.
              </span>
            </h1>

            {/* Body text: Point 4 (color: rgba(255, 255, 255, 0.82), line-height: 1.7, font-weight: 400) */}
            <p
              className="body-text text-base sm:text-lg max-w-xl"
              style={{
                color: "rgba(255, 255, 255, 0.82)",
                lineHeight: 1.7,
                fontWeight: 400,
              }}
            >
              Measure who you are today and unlock your future compounding potential through a unified, data-driven framework built across education, skills, finance, health, and behavioral intelligence.
            </p>

            {/* CTAs: Point 7 */}
            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-sm">
              <motion.button
                onClick={onStartAssessment}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white border border-[#00D4FF]/60 cursor-pointer"
                style={{
                  background: "linear-gradient(90deg, #2563EB, #00D4FF)",
                  boxShadow: "0 10px 40px rgba(0, 212, 255, 0.4)",
                  transition: "filter 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1.0)";
                }}
              >
                <span>Calculate Human Value</span>
                <ArrowRight className="w-4 h-4 arrow-bounce" />
              </motion.button>

              <a
                href="#visualizer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-white transition-all backdrop-blur-md hover:bg-white/[0.14] hover:border-[#00D4FF]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.25)]"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <Play className="w-4 h-4 text-[#00D4FF] fill-[#00D4FF]" />
                <span>Explore Simulator</span>
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-mono" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
              <span className="flex items-center gap-1.5 text-[#34d399] font-medium">
                <CheckCircle2 className="w-4 h-4" /> 5-Min Assessment
              </span>
              <span className="flex items-center gap-1.5 text-[#00D4FF] font-medium">
                <CheckCircle2 className="w-4 h-4" /> Instant Verified Score
              </span>
              <span className="flex items-center gap-1.5 text-[#B66DFF] font-medium">
                <ShieldCheck className="w-4 h-4" /> 100% Private
              </span>
            </div>

          </motion.div>

          {/* ── Right Column: Point 5 Stronger Glassmorphism Dashboard Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div
              className="relative rounded-2xl p-6 sm:p-7 transition-all duration-300 group overflow-hidden"
              style={{
                background: "rgba(20, 40, 80, 0.7)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                boxShadow: "0 25px 80px rgba(0, 212, 255, 0.25)",
              }}
            >
              {/* Top Specular Neon Highlight */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D4FF] to-transparent rounded-t-2xl" />

              {/* Scan line effect */}
              <div className="scan-line absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00D4FF]/90 to-transparent pointer-events-none" />

              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/[0.14] pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="font-mono text-xs font-bold tracking-wider ml-2 uppercase" style={{ color: "rgba(255, 255, 255, 0.95)" }}>
                    EXECUTIVE TELEMETRY
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-[#10b981]/25 px-3 py-1 rounded-full border border-[#10b981]/50 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <span className="blink-dot w-2 h-2 rounded-full bg-[#10b981]" />
                  <span className="text-[10px] font-mono font-bold text-[#34d399] tracking-wider uppercase">
                    LIVE INDEX
                  </span>
                </div>
              </div>

              {/* Gauge + Bars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">

                {/* Radial Gauge with Point 6 Glow (box-shadow: 0 0 60px rgba(0, 212, 255, 0.45)) */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center relative py-1">
                  <div
                    className="relative w-44 h-44 rounded-full flex items-center justify-center bg-gradient-to-b from-[#102046] to-[#081224] border border-[#00D4FF]/40 p-1"
                    style={{
                      boxShadow: "0 0 60px rgba(0, 212, 255, 0.45)",
                    }}
                  >
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background track */}
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="6"
                        fill="transparent"
                      />
                      {/* Animated glowing arc */}
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        stroke="url(#heroGaugeGradHigh)"
                        strokeWidth="6.5"
                        strokeDasharray={276.46}
                        strokeDashoffset={276.46 - (276.46 * score) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out drop-shadow-[0_0_15px_rgba(0,212,255,0.9)]"
                      />
                      <defs>
                        <linearGradient id="heroGaugeGradHigh" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%"   stopColor="#00D4FF" />
                          <stop offset="50%"  stopColor="#4F7CFF" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 space-y-1">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest leading-none" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                        Human Value
                      </span>
                      <div className="flex items-baseline justify-center gap-0.5">
                        <motion.span
                          key={score}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-4xl font-extrabold font-mono text-white tracking-tight drop-shadow-[0_0_16px_rgba(0,212,255,0.65)]"
                        >
                          {score}
                        </motion.span>
                        <span className="text-xs font-mono font-bold" style={{ color: "rgba(255, 255, 255, 0.65)" }}>/100</span>
                      </div>
                      <span className="inline-block text-[9px] font-mono font-bold text-[#34d399] bg-[#10b981]/25 px-2.5 py-0.5 rounded-full border border-[#10b981]/50 shadow-[0_0_14px_rgba(16,185,129,0.4)] whitespace-nowrap">
                        Top 5% Cohort
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-Score Bars: Point 6 increased brightness by 25% */}
                <div className="sm:col-span-7 space-y-3 font-mono text-xs">
                  {subScores.map((s, i) => {
                    const SubIcon = s.Icon;
                    return (
                      <div
                        key={s.label}
                        className="space-y-1.5 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#00D4FF]/40 transition-all"
                      >
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="flex items-center gap-1.5 font-semibold text-white">
                            <SubIcon className="w-3.5 h-3.5" style={{ color: s.color }} />
                            <span>{s.label}</span>
                          </span>
                          <span className="text-white font-bold tracking-tight">{s.val}/100</span>
                        </div>
                        <div className="h-2 w-full bg-[#081224] rounded-full overflow-hidden border border-white/[0.14] p-[1px]">
                          <div
                            className={`h-full bg-gradient-to-r ${s.bgGrad} rounded-full bar-fill`}
                            style={{
                              width: `${s.val}%`,
                              boxShadow: `0 0 12px ${s.glow}`,
                              animationDelay: `${0.3 + i * 0.1}s`,
                            }}
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
