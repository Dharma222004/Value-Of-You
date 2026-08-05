"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  DollarSign,
  Award,
  HeartPulse,
  Brain,
  CheckCircle2,
  TrendingUp,
  Layers
} from "lucide-react";

const dimensions = [
  {
    id: "career",
    title: "1. Personal & Professional Trajectory",
    shortName: "Career Profile",
    icon: Briefcase,
    color: "#3b82f6",
    badge: "CAREER MOBILITY",
    scoreWeight: "25% Weight",
    description: "Evaluates role seniority, company leverage, domain momentum, title velocity, and executive market scarcity.",
    metrics: [
      "Role Seniority & Executive Authority Index",
      "Company Growth & Capital Multiplier",
      "Industry Disruption Shielding",
      "Promotion & Title Velocity Telemetry",
    ],
    sampleScore: 88,
  },
  {
    id: "finance",
    title: "2. Financial Independence & Runway",
    shortName: "Financial Capital",
    icon: DollarSign,
    color: "#10b981",
    badge: "FINANCIAL INDEPENDENCE",
    scoreWeight: "25% Weight",
    description: "Measures unearned liquid runway, savings compounding rate, passive yield streams, and net worth growth velocity.",
    metrics: [
      "Net Worth Velocity & Savings Rate",
      "Liquid Runway (Months of Independence)",
      "Passive Asset Yield & Equity Growth",
      "Debt Optimization & Wealth Protection",
    ],
    sampleScore: 82,
  },
  {
    id: "skills",
    title: "3. Skills Architecture & Tech Stack",
    shortName: "Skills Capital",
    icon: Award,
    color: "#06b6d4",
    badge: "SKILLS ARCHITECTURE",
    scoreWeight: "20% Weight",
    description: "Quantifies technical mastery, AI automation tool integration, rare skill combinations, and continuous learning velocity.",
    metrics: [
      "AI & Automation Tooling Mastery",
      "Technical Depth & Architecture",
      "Rare Skill Synergy Index",
      "Continuous Upskilling Velocity",
    ],
    sampleScore: 91,
  },
  {
    id: "health",
    title: "4. Health & Biological Stamina",
    shortName: "Health Capital",
    icon: HeartPulse,
    color: "#f59e0b",
    badge: "HEALTH STAMINA",
    scoreWeight: "15% Weight",
    description: "Tracks sleep optimization, physical endurance, HRV recovery resilience, and cognitive focus peak hours.",
    metrics: [
      "Sleep Architecture & HRV Recovery",
      "Metabolic Efficiency & Physical Stamina",
      "Cognitive Endurance & Peak Hours",
      "Stress Biomarker Resilience",
    ],
    sampleScore: 76,
  },
  {
    id: "assessments",
    title: "5. Mindset EQ & Psychometrics",
    shortName: "Psychometrics",
    icon: Brain,
    color: "#8b5cf6",
    badge: "PSYCHOMETRIC EQ",
    scoreWeight: "15% Weight",
    description: "Deep psychometric evaluation of decision-making velocity, risk tolerance matrix, leadership drive, and focus depth.",
    metrics: [
      "Decision Velocity & Bias Shield",
      "High-Stakes Risk Tolerance Matrix",
      "Emotional Intelligence & Leadership",
      "Deep Work Focus & Stamina",
    ],
    sampleScore: 85,
  },
];

export const FiveDimensions: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const active = dimensions[activeTab];
  const ActiveIcon = active.icon;

  return (
    <section id="dimensions" className="py-32 relative bg-[#090d1a]">
      
      {/* Radial Background Accent */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#3b82f6]/04 blur-[140px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/20 text-[#06b6d4] text-xs font-mono font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>UNIFIED 360° ARCHITECTURE</span>
          </div>
          <h2 className="section-headline">
            The 5 Core Dimensions of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]">
              Human Capital Intelligence
            </span>
          </h2>
          <p className="body-text mx-auto">
            An institutional synthesis combining career mobility, liquid financial runway, technical skill mastery, biological stamina, and decision psychometrics.
          </p>
        </div>

        {/* Interactive Cards Nav Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {dimensions.map((dim, idx) => {
            const DimIcon = dim.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={dim.id}
                onClick={() => setActiveTab(idx)}
                className={`p-5 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                  isActive
                    ? "bg-[#0f1526] border-[#3b82f6] shadow-lg shadow-[#3b82f6]/10"
                    : "card-surface opacity-75 hover:opacity-100"
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4]" />
                )}

                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/[0.1]"
                    style={{ backgroundColor: `${dim.color}15`, color: dim.color }}
                  >
                    <DimIcon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[11px] font-mono text-[#94a3b8] font-semibold">
                    {dim.scoreWeight}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-semibold text-white block truncate">
                    {dim.shortName}
                  </span>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.06]">
                    <span className="text-[10px] font-mono text-[#94a3b8]">INDEX</span>
                    <span className="text-xs font-mono font-bold" style={{ color: dim.color }}>
                      {dim.sampleScore}/100
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="card-surface p-8 sm:p-10 grid lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Column: Description & Verified Metrics */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-md bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/20">
                  {active.badge}
                </span>
                <span className="text-xs font-mono text-[#94a3b8] font-semibold">{active.scoreWeight}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#05070f] border border-white/[0.1]" style={{ color: active.color }}>
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <span>{active.title}</span>
              </h3>

              <p className="text-[#94a3b8] text-base leading-relaxed">{active.description}</p>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider block font-semibold">
                  Audited Telemetry Metrics:
                </span>
                <div className="grid sm:grid-cols-2 gap-3">
                  {active.metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[#090d1a] border border-white/[0.08] text-xs font-medium text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0 mt-0.5" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Score Gauge & Summary */}
            <div className="lg:col-span-5 bg-[#090d1a] rounded-2xl p-8 border border-white/[0.08] flex flex-col items-center justify-center text-center space-y-5">
              <span className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider">DIMENSION BENCHMARK INDEX</span>
              
              <div className="relative w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 border-white/[0.08]" style={{ borderColor: `${active.color}30` }}>
                <div className="text-4xl font-black font-mono text-white tracking-tight">
                  {active.sampleScore}
                </div>
                <span className="text-xs font-mono text-[#94a3b8]">/100</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10b981] bg-[#10b981]/10 px-3 py-1 rounded-full border border-[#10b981]/20">
                <TrendingUp className="w-4 h-4" />
                <span>Top Tier Performance</span>
              </div>

              <p className="text-xs text-[#94a3b8] max-w-xs leading-relaxed">
                Audited in real-time by the Human Capital AI Engine using neural cohort benchmarks.
              </p>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default FiveDimensions;
