"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, Cpu, HeartPulse, Brain, Briefcase, ChevronRight, Layers } from "lucide-react";

const MODULES = [
  {
    id: "financial",
    icon: Landmark,
    title: "1. Financial Health & Runway",
    desc: "Evaluates unencumbered liquid reserves, debt leverage ratios, investment compounding velocity, and freedom runway.",
    details: ["Runway calculation in months", "Capital efficiency modeling", "Risk resilience threshold"],
    accent: "text-emerald-500",
  },
  {
    id: "skills",
    icon: Cpu,
    title: "2. Skills Architecture & Edge",
    desc: "Indexes your stackable technical competencies, rare skill combinations, and defense against AI automation.",
    details: ["Skill scarcity scoring", "AI displacement defense", "Domain stack monetization"],
    accent: "text-blue-500 dark:text-cyan-400",
  },
  {
    id: "health",
    icon: HeartPulse,
    title: "3. Health & Longevity Endurance",
    desc: "Tracks biological age deltas, HRV stress recovery rates, sleep quality, and physical stamina parameters.",
    details: ["Biometric biomarker sync", "Cognitive burnout defense", "Longevity optimization"],
    accent: "text-amber-500",
  },
  {
    id: "mindset",
    icon: Brain,
    title: "4. Mindset & Cognitive EQ",
    desc: "Quantifies grit, decision velocity under risk, emotional composure, and executive leadership traits.",
    details: ["Psychometric grit index", "Decision speed scoring", "Leadership clarity"],
    accent: "text-violet-500",
  },
  {
    id: "career",
    icon: Briefcase,
    title: "5. Career Status & Trajectory",
    desc: "Analyzes industry demand curves, promotion velocity, network leverage density, and compensation growth.",
    details: ["Market leverage score", "Network node density", "Compensation upside"],
    accent: "text-cyan-500",
  },
];

export default function FiveModules() {
  const [activeId, setActiveId] = useState(MODULES[0].id);
  const activeModule = MODULES.find((m) => m.id === activeId) || MODULES[0];

  return (
    <section id="modules" className="py-24 relative overflow-hidden bg-[var(--card-bg)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>5 CORE PLATFORM MODULES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
            Five Platform <span className="text-blue-600 dark:text-cyan-400">Modules</span>
          </h2>
          <p className="mt-4 text-[var(--subtext)] max-w-2xl text-base">
            Each module provides granular diagnostic tools to measure and optimize specific dimensions of your human asset potential.
          </p>
        </div>

        {/* Interactive Module Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Module List */}
          <div className="lg:col-span-5 space-y-3">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const isActive = mod.id === activeId;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveId(mod.id)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isActive
                      ? "bg-[var(--background)] border-blue-500/40 shadow-lg scale-[1.01]"
                      : "bg-[var(--glass-bg)] border-[var(--border)] opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl bg-blue-500/10 ${mod.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`font-bold text-sm ${isActive ? "text-[var(--foreground)]" : "text-[var(--subtext)]"}`}>
                      {mod.title}
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "translate-x-1 text-blue-500" : "text-[var(--subtext)]"}`} />
                </button>
              );
            })}
          </div>

          {/* Module Details Display */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-3xl p-8 border border-[var(--border)] space-y-6 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl bg-blue-500/10 ${activeModule.accent}`}>
                    <activeModule.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-[var(--foreground)]">{activeModule.title}</h3>
                </div>

                <p className="text-[var(--subtext)] text-base leading-relaxed">
                  {activeModule.desc}
                </p>

                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono text-[var(--subtext)] font-semibold uppercase tracking-wider">
                    MODULE DIAGNOSTIC CAPABILITIES
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {activeModule.details.map((item) => (
                      <div
                        key={item}
                        className="p-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)]"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
