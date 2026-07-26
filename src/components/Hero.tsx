"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Shield, Cpu, Activity, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden hero-grid">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[var(--hero-glow)] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)] text-xs font-mono mb-8 shadow-sm backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span className="font-semibold">AI-POWERED HUMAN CAPITAL VALUATION</span>
            <span className="w-1 h-1 rounded-full bg-[var(--subtext)]"></span>
            <span className="text-[var(--subtext)]">v2.0 REVISE ENGINE</span>
          </motion.div>

          {/* Exact Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--foreground)] max-w-5xl leading-[1.1]"
          >
            Know Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Human Capital
            </span>
          </motion.h1>

          {/* Exact Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-2xl text-[var(--subtext)] max-w-3xl font-light leading-relaxed"
          >
            Measure your financial health, skills, health, mindset, and career with one AI-powered Human Capital Score.
          </motion.p>

          {/* Primary & Secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)] font-semibold text-sm hover:border-blue-500/40 transition-all"
            >
              <Play className="w-4 h-4 text-blue-500 dark:text-cyan-400 fill-current" />
              <span>See Demo</span>
            </a>
          </motion.div>

          {/* Hero Visual Showcase Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 w-full max-w-5xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="ml-3 text-xs font-mono text-[var(--subtext)]">HUMAN_CAPITAL_SCORE_CARD // PREVIEW</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 dark:text-cyan-400 font-semibold">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>REAL-TIME ENGINE ACTIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-2">
                <div className="text-xs font-mono text-[var(--subtext)]">COMPOSITE RATING</div>
                <div className="text-4xl font-extrabold text-blue-600 dark:text-cyan-400 font-mono">88.5 / 100</div>
                <div className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +4.2 pts vs last quarter
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-2">
                <div className="text-xs font-mono text-[var(--subtext)]">PROJECTED ASSET VALUE</div>
                <div className="text-4xl font-extrabold text-[var(--foreground)] font-mono">$4,850,000</div>
                <div className="text-xs text-[var(--subtext)]">Lifetime compounding model</div>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-2">
                <div className="text-xs font-mono text-[var(--subtext)]">TIER CLASSIFICATION</div>
                <div className="text-2xl font-bold text-amber-500 dark:text-amber-400 font-mono">S-Tier Strategic</div>
                <div className="text-xs text-[var(--subtext)]">Top 2.5% global benchmark</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
