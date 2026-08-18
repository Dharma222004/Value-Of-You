"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  DollarSign,
  Briefcase,
  HeartPulse,
  Brain,
  CheckCircle2,
  TrendingUp,
  Layers
} from "lucide-react";

const dimensions = [
  {
    id: "education",
    title: "1. Academic & Education Capital",
    shortName: "Education Capital",
    shortDesc: "Degrees, certifications, learning velocity, and knowledge acquisition.",
    icon: GraduationCap,
    color: "#3b82f6",
    badge: "ACADEMIC CAPITAL",
    scoreWeight: "25% Weight",
    description: "Evaluates formal education degrees, technical certifications, continuous learning velocity, and academic achievement trajectory.",
    metrics: [
      "Degrees, Certifications & Credentials",
      "Learning Velocity & Knowledge Acquisition",
      "Skill Adaptability & Growth Mindset",
      "Intellectual Capital Multiplier",
    ],
    sampleScore: 88,
  },
  {
    id: "finance",
    title: "2. Financial Well-being & Stability",
    shortName: "Financial Capital",
    shortDesc: "Income stability, financial literacy, savings, and long-term financial health.",
    icon: DollarSign,
    color: "#10b981",
    badge: "FINANCIAL STABILITY",
    scoreWeight: "20% Weight",
    description: "Measures income stability, liquid financial runway, savings compounding rate, passive asset yield, and wealth protection.",
    metrics: [
      "Income Stability & Savings Velocity",
      "Financial Literacy & Asset Allocation",
      "Passive Income & Equity Growth",
      "Long-term Financial Runway & Security",
    ],
    sampleScore: 82,
  },
  {
    id: "skills",
    title: "3. Technical Skills & Future Employability",
    shortName: "Skills & Employability",
    shortDesc: "Technical expertise, practical abilities, employability, and future readiness.",
    icon: Briefcase,
    color: "#06b6d4",
    badge: "SKILLS & EMPLOYABILITY",
    scoreWeight: "25% Weight",
    description: "Quantifies technical expertise, practical tooling mastery, AI integration resilience, and long-term market employability.",
    metrics: [
      "Technical Expertise & Practical Mastery",
      "AI Tooling & Modern Tech Stack",
      "Future Market Employability Index",
      "Upskilling & Domain Versatility",
    ],
    sampleScore: 91,
  },
  {
    id: "health",
    title: "4. Physical Health & Mental Well-being",
    shortName: "Health & Wellness",
    shortDesc: "Physical health, mental well-being, energy, and lifestyle.",
    icon: HeartPulse,
    color: "#f59e0b",
    badge: "HEALTH & WELLNESS",
    scoreWeight: "15% Weight",
    description: "Tracks physical stamina, sleep architecture, HRV recovery depth, stress biomarker resilience, and overall wellness.",
    metrics: [
      "Physical Fitness & Metabolic Energy",
      "Mental Well-being & Stress Resilience",
      "Sleep Quality & HRV Recovery",
      "Lifestyle Balance & Vitality",
    ],
    sampleScore: 76,
  },
  {
    id: "behavioral",
    title: "5. Behavioral & Emotional Intelligence",
    shortName: "Behavioral Intelligence",
    shortDesc: "Decision-making, emotional intelligence, adaptability, and cognitive patterns.",
    icon: Brain,
    color: "#8b5cf6",
    badge: "BEHAVIORAL INTELLIGENCE",
    scoreWeight: "15% Weight",
    description: "Deep psychometric evaluation of decision-making velocity, emotional intelligence, risk discipline, and cognitive focus patterns.",
    metrics: [
      "Decision-making Velocity & Risk Discipline",
      "Emotional Intelligence & Leadership Drive",
      "Cognitive Adaptability & Focus Depth",
      "Personal Development & Habit Persistence",
    ],
    sampleScore: 85,
  },
];

export const FiveDimensions: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const active = dimensions[activeTab];
  const ActiveIcon = active.icon;

  return (
    <section
      id="dimensions"
      className="py-24 sm:py-32 relative text-white"
      style={{
        background: "linear-gradient(180deg, #081224 0%, #0C1830 50%, #101C36 100%)",
      }}
    >

      {/* Ambient background glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] pointer-events-none rounded-full blur-[90px]"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/4 right-[10%] w-[380px] h-[380px] pointer-events-none rounded-full blur-[75px]"
        style={{
          background: "radial-gradient(circle, rgba(79, 124, 255, 0.15), transparent 70%)",
        }}
      />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 bg-institutional-grid pointer-events-none"
        style={{ opacity: 0.15 }}
      />

      <div className="grid-container relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#00D4FF]/50 text-[#00D4FF] text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.35)] backdrop-blur-md">
            <Layers className="w-3.5 h-3.5" />
            <span>HUMAN VALUE FRAMEWORK</span>
          </div>
          <h2
            className="section-headline text-white"
            style={{
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 0 20px rgba(0, 212, 255, 0.25)",
            }}
          >
            The 5 Core Dimensions of <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00D4FF, #4F7CFF, #B66DFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.35))",
              }}
            >
              Human Value
            </span>
          </h2>
          <p
            className="body-text mx-auto"
            style={{
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            A multidimensional framework that evaluates education, financial well-being, skills, health, and behavioral intelligence to create a comprehensive Human Value Score.
          </p>
        </motion.div>

        {/* Interactive Cards Nav Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }}
        >
          {dimensions.map((dim, idx) => {
            const DimIcon = dim.icon;
            const isActive = activeTab === idx;
            return (
              <motion.button
                key={dim.id}
                onClick={() => setActiveTab(idx)}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className={`p-5 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden flex flex-col justify-between cursor-pointer backdrop-blur-md ${
                  isActive
                    ? "bg-gradient-to-b from-[#162248] to-[#0c142c] border-[#38bdf8] shadow-[0_0_30px_rgba(56,189,248,0.35)] ring-1 ring-[#38bdf8]/60"
                    : "bg-[#111933]/85 border-white/[0.14] hover:border-white/[0.3] hover:bg-[#162248]/90 shadow-lg"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#34d399]" />
                )}

                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.14] shadow-inner"
                    style={{ backgroundColor: `${dim.color}25`, color: dim.color }}
                  >
                    <DimIcon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[11px] font-mono text-[#cbd5e1] font-semibold">
                    {dim.scoreWeight}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-sm font-bold text-white block leading-snug">
                    {dim.shortName}
                  </span>
                  <p className="text-[11px] text-[#cbd5e1] leading-relaxed line-clamp-3">
                    {dim.shortDesc}
                  </p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.1]">
                    <span className="text-[10px] font-mono text-[#cbd5e1]">INDEX</span>
                    <span className="text-xs font-mono font-bold" style={{ color: dim.color }}>
                      {dim.sampleScore}/100
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Active Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="card-surface p-8 sm:p-10 grid lg:grid-cols-12 gap-8 items-center bg-[#111a33] border border-white/[0.18]"
          >
            {/* Left Column: Description & Verified Metrics */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-md bg-[#3b82f6]/15 text-[#60a5fa] border border-[#3b82f6]/35 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                  {active.badge}
                </span>
                <span className="text-xs font-mono text-[#cbd5e1] font-semibold">{active.scoreWeight}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0a0f1d] border border-white/[0.16] shadow-inner" style={{ color: active.color }}>
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <span>{active.title}</span>
              </h3>

              <p className="text-[#e2e8f0] text-base leading-relaxed">{active.description}</p>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono text-[#cbd5e1] uppercase tracking-wider block font-semibold">
                  Audited Telemetry Metrics:
                </span>
                <div className="grid sm:grid-cols-2 gap-3">
                  {active.metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#182447] border border-white/[0.14] text-xs font-medium text-white shadow-inner"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Score Gauge & Summary */}
            <div className="lg:col-span-5 bg-[#182447] rounded-2xl p-8 border border-white/[0.14] flex flex-col items-center justify-center text-center space-y-5 shadow-2xl">
              <span className="text-xs font-mono text-[#cbd5e1] uppercase tracking-wider font-semibold">DIMENSION BENCHMARK INDEX</span>
              
              <div className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 border-white/[0.14]" style={{ borderColor: `${active.color}50` }}>
                <div className="text-4xl font-black font-mono text-white tracking-tight">
                  {active.sampleScore}
                </div>
                <span className="text-xs font-mono text-[#cbd5e1]">/100</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10b981] bg-[#10b981]/20 px-3 py-1 rounded-full border border-[#10b981]/35 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <TrendingUp className="w-4 h-4" />
                <span>Top Tier Performance</span>
              </div>

              <p className="text-xs text-[#cbd5e1] max-w-xs leading-relaxed">
                Audited in real-time by the Human Value Engine using neural cohort benchmarks.
              </p>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default FiveDimensions;
