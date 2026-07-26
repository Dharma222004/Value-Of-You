"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, Activity, Sparkles, ShieldCheck } from "lucide-react";

export default function ScorePreview() {
  const [financial, setFinancial] = useState(85);
  const [skills, setSkills] = useState(90);
  const [health, setHealth] = useState(78);
  const [mindset, setMindset] = useState(88);
  const [career, setCareer] = useState(84);

  const compositeScore = Math.round(
    financial * 0.25 + skills * 0.25 + health * 0.15 + mindset * 0.15 + career * 0.2
  );

  return (
    <section id="score-preview" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono mb-4">
            <Sliders className="w-3.5 h-3.5" />
            <span>INTERACTIVE SCORE ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
            Human Capital <span className="text-blue-600 dark:text-cyan-400">Score Preview</span>
          </h2>
          <p className="mt-4 text-[var(--subtext)] max-w-2xl text-base">
            Adjust the sliders below to test how your financial runway, skill architecture, longevity health, mindset, and career trajectory dynamically compound your composite rating.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-[var(--border)] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-[var(--foreground)]">Financial Health & Runway</span>
                  <span className="text-emerald-500 font-bold">{financial} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={financial}
                  onChange={(e) => setFinancial(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-[var(--foreground)]">Skills & Market Edge</span>
                  <span className="text-blue-500 dark:text-cyan-400 font-bold">{skills} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skills}
                  onChange={(e) => setSkills(Number(e.target.value))}
                  className="w-full accent-blue-500 dark:accent-cyan-400 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-[var(--foreground)]">Health & Longevity</span>
                  <span className="text-amber-500 font-bold">{health} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={health}
                  onChange={(e) => setHealth(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-[var(--foreground)]">Mindset & Cognitive EQ</span>
                  <span className="text-violet-500 font-bold">{mindset} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={mindset}
                  onChange={(e) => setMindset(Number(e.target.value))}
                  className="w-full accent-violet-500 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-[var(--foreground)]">Career Trajectory</span>
                  <span className="text-cyan-500 font-bold">{career} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={career}
                  onChange={(e) => setCareer(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

            </div>

            {/* Score Display Ring */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-[var(--background)] rounded-3xl border border-[var(--border)] text-center">
              <div className="relative w-48 h-48 flex items-center justify-center my-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="stroke-slate-200 dark:stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    className="stroke-blue-600 dark:stroke-cyan-400"
                    strokeWidth="8"
                    strokeDasharray={314.159}
                    strokeDashoffset={314.159 - (314.159 * compositeScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    transition={{ duration: 0.3 }}
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black font-mono text-[var(--foreground)]">
                    {compositeScore}
                  </span>
                  <span className="text-[10px] font-mono text-blue-600 dark:text-cyan-400 uppercase tracking-widest mt-1">
                    SCORE INDEX
                  </span>
                </div>
              </div>

              <div className="mt-2 text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                {compositeScore >= 85 ? "APEX ASSET TIER" : "HIGH GROWTH POTENTIAL"}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
