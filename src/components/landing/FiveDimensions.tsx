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
  ChevronRight,
  TrendingUp,
  Sliders,
  Layers,
} from "lucide-react";

const dimensions = [
  {
    id: "career",
    title: "1. Current Status & Career Mobility",
    shortName: "Personal & Professional Profile",
    icon: Briefcase,
    color: "sky",
    badge: "CAREER MOBILITY",
    scoreWeight: "10% Weight",
    description: "Evaluates role seniority, company leverage, domain momentum, title velocity, and market demand for your professional trajectory.",
    metrics: [
      "Role Seniority & Executive Authority Index",
      "Company Growth & Leverage Multiplier",
      "Industry Tailwinds & Disruption Shield",
      "Executive Network Breadth & Reach",
      "Promotion & Title Velocity Telemetry",
    ],
    sampleScore: 84,
  },
  {
    id: "finance",
    title: "2. Financial Health & Independence",
    shortName: "Financial Capital",
    icon: DollarSign,
    color: "emerald",
    badge: "FINANCIAL INDEPENDENCE",
    scoreWeight: "25% Weight",
    description: "Measures liquid runway, savings rate, asset diversification, net worth compounding rate, and high-yield capital allocation.",
    metrics: [
      "Net Worth Velocity & Savings Rate",
      "Liquid Runway (Months of Financial Independence)",
      "Passive Asset Yield & Equity Growth",
      "High-Yield Capital Allocation",
      "Debt Optimization & Wealth Protection",
    ],
    sampleScore: 79,
  },
  {
    id: "skills",
    title: "3. Skills Architecture & Tech Stack",
    shortName: "Skills Capital",
    icon: Award,
    color: "indigo",
    badge: "SKILLS ARCHITECTURE",
    scoreWeight: "20% Weight",
    description: "Quantifies technical mastery, AI tool automation fluency, rare skill stack combinations, and rapid continuous learning velocity.",
    metrics: [
      "AI & Automation Tooling Mastery",
      "Technical Depth & System Architecture",
      "Rare Skill Synergy Index",
      "Continuous Upskilling Velocity",
      "Problem-Solving Telemetry",
    ],
    sampleScore: 88,
  },
  {
    id: "health",
    title: "4. Health & Physical Endurance",
    shortName: "Health Capital",
    icon: HeartPulse,
    color: "rose",
    badge: "HEALTH ENDURANCE",
    scoreWeight: "15% Weight",
    description: "Tracks sleep optimization, physical stamina, metabolic efficiency, stress resilience, and long-term cognitive endurance.",
    metrics: [
      "Sleep Architecture & HRV Recovery",
      "Metabolic Efficiency & Physical Stamina",
      "Cognitive Endurance & Peak Focus Hours",
      "Stress Biomarker Resilience",
      "Longevity & Physical Baseline",
    ],
    sampleScore: 75,
  },
  {
    id: "assessments",
    title: "5. Human Assessment & Psychometrics",
    shortName: "Psychometrics",
    icon: Brain,
    color: "purple",
    badge: "PSYCHOMETRIC RESILIENCE",
    scoreWeight: "30% Weight",
    description: "Deep psychometric evaluation of decision-making velocity, risk tolerance, leadership drive, integrity, and focus depth.",
    metrics: [
      "Decision Velocity & Bias Shield",
      "High-Stakes Risk Tolerance Matrix",
      "Emotional Intelligence & Leadership Drive",
      "Deep Work Focus & Stamina",
      "Strategic Scenario Alignment",
    ],
    sampleScore: 85,
  },
];

export const FiveDimensions: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const active = dimensions[activeTab];
  const Icon = active.icon;

  return (
    <section id="dimensions" className="py-24 relative bg-[#080d1a]/80 border-t border-slate-800/80">
      {/* Background Section Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>Unified 360° Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            The 5 Core Dimensions of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400">
              Human Capital Intelligence
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            A complete synthesis combining hard career data, liquid financial assets, health endurance indicators, and psychometric decision scenario evaluations.
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {dimensions.map((dim, idx) => {
            const DimIcon = dim.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={dim.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                    ? "bg-slate-800 text-white border border-sky-500/40 shadow-lg shadow-sky-500/10"
                    : "bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800/60"
                  }`}
              >
                <DimIcon className={`w-4 h-4 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                <span>{dim.shortName}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                  {dim.scoreWeight}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Detailed Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-12 gap-8 items-center glass-panel rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl"
          >
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase font-bold tracking-widest px-3 py-1 rounded-md bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {active.badge}
                </span>
                <span className="text-xs font-mono text-slate-300 font-semibold">{active.scoreWeight}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Icon className="w-8 h-8 text-sky-400" />
                <span>{active.title}</span>
              </h3>

              <p className="text-slate-300 text-base leading-relaxed">{active.description}</p>

              {/* Measured Telemetry Variables Checklist */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Audited Telemetry Variables:
                </span>
                <div className="grid sm:grid-cols-2 gap-3">
                  {active.metrics.map((metric, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-medium text-slate-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Telemetry Dial & Sample Score */}
            <div className="lg:col-span-5 bg-slate-950/90 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">DIMENSION BENCHMARK INDEX</span>
              <div className="text-6xl font-black font-mono text-white tracking-tight">
                {active.sampleScore}
                <span className="text-base text-slate-500 font-normal"> / 100</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                <TrendingUp className="w-4 h-4" />
                <span>Optimal Capital Trajectory</span>
              </div>
              <p className="text-xs text-slate-400 max-w-xs">
                Evaluated in real-time by the Phase 9 AI Scoring Engine using multi-vector neural weights.
              </p>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};

export default FiveDimensions;
