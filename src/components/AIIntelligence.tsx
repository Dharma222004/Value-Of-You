"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, Cpu, TrendingUp, ShieldCheck } from "lucide-react";

export default function AIIntelligence() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEXT-GEN PREDICTIVE VALUATION</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
              Powered by <span className="text-blue-600 dark:text-cyan-400">AI Intelligence</span>
            </h2>

            <p className="text-[var(--subtext)] text-base leading-relaxed">
              Our neural inference engine cross-evaluates global labor market demand curves, skill rarity indexes, and biological stress vectors to deliver real-time predictive human asset intelligence.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-xs text-[var(--subtext)]">
                  <strong className="text-[var(--foreground)]">Macro Talent Demand Maps:</strong> Real-time salary and equity benchmarks across 12,000+ tech and business sectors.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-[var(--subtext)]">
                  <strong className="text-[var(--foreground)]">Skill Scarcity Vector:</strong> Identifies non-commoditized skill stacks with high market premium.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-[var(--subtext)]">
                  <strong className="text-[var(--foreground)]">Burnout Risk Warnings:</strong> Alerts when high cognitive workload outpaces biological HRV recovery.
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Graphic */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-panel rounded-3xl p-8 border border-[var(--border)] shadow-2xl relative space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-blue-600 dark:text-cyan-400">
                  <Cpu className="w-4 h-4 animate-pulse" />
                  <span>NEURAL_INFERENCE_PIPELINE</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                  ACCURACY: 99.4%
                </span>
              </div>

              {/* Simulated Intelligence Graph Cards */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono text-[var(--subtext)]">PREDICTIVE COMPOUND VELOCITY</div>
                    <div className="text-lg font-bold text-emerald-500 font-mono">+18.4% / Year</div>
                  </div>
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>

                <div className="p-4 rounded-xl bg-[var(--background)] border border-[var(--border)] flex justify-between items-center">
                  <div>
                    <div className="text-xs font-mono text-[var(--subtext)]">AUTOMATION RESILIENCE SCORE</div>
                    <div className="text-lg font-bold text-blue-500 dark:text-cyan-400 font-mono">96.8 / 100</div>
                  </div>
                  <Brain className="w-6 h-6 text-blue-500 dark:text-cyan-400" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
