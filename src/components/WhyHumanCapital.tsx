"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, ArrowRight, Target, Sparkles } from "lucide-react";

export default function WhyHumanCapital() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono mb-4">
            <Target className="w-3.5 h-3.5" />
            <span>THE PARADIGM SHIFT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight max-w-3xl">
            Why Human Capital <span className="text-blue-600 dark:text-cyan-400">Matters</span>
          </h2>
          <p className="mt-4 text-[var(--subtext)] max-w-2xl text-base">
            Traditional wealth management only looks backward at current net worth. Human Capital evaluates the compounding engine that generates all future value: You.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Traditional Wealth Tools */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel rounded-3xl p-8 border-red-500/20 relative space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">Traditional Wealth Tracking</h3>
                <span className="text-xs font-mono text-red-500 font-semibold">REACTIONARY & INCOMPLETE</span>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-[var(--subtext)]">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span>
                <span>Focuses strictly on existing bank balances, stock portfolios, and real estate debt.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span>
                <span>Ignores your #1 income driver: Your skill stack, career trajectory, and professional network.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span>
                <span>Blind to health burnout risk, cognitive fatigue, and biological longevity erosion.</span>
              </li>
            </ul>
          </motion.div>

          {/* Human Capital Platform */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel rounded-3xl p-8 border-blue-500/30 dark:border-cyan-500/30 relative space-y-6 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">Human Capital Platform</h3>
                <span className="text-xs font-mono text-blue-600 dark:text-cyan-400 font-semibold">PREDICTIVE & MULTI-DIMENSIONAL</span>
              </div>
            </div>

            <ul className="space-y-4 text-sm text-[var(--foreground)]">
              <li className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>Quantifies your future lifetime earning trajectory using institutional AI models.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>Maps monetizable skill stacks and defends against AI market commoditization.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <span>Integrates biological endurance, stress resilience, and mindset EQ into one single score.</span>
              </li>
            </ul>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
