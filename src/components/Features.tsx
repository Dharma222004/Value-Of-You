"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Cpu, Activity, BarChart3, FileText } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Multi-Vector Score Engine",
    desc: "Synthesizes 5 core life pillars into a unified 0–100 Human Capital Index.",
  },
  {
    icon: BarChart3,
    title: "Financial Runway Indexing",
    desc: "Calculates exact burn months and freedom capital ratios for high-upside career moves.",
  },
  {
    icon: Cpu,
    title: "AI Skill Scarcity Benchmark",
    desc: "Evaluates your skill stack against market commoditization and AI automation risk.",
  },
  {
    icon: Activity,
    title: "Biological Endurance Sync",
    desc: "Connects biometric inputs to quantify sleep recovery, HRV, and physical stamina.",
  },
  {
    icon: Shield,
    title: "Zero-Knowledge Encryption",
    desc: "Your sensitive financial and biological diagnostic data is encrypted client-side.",
  },
  {
    icon: FileText,
    title: "Executive Action Roadmaps",
    desc: "Generates step-by-step quarterly strategic milestones to elevate your net asset score.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[var(--card-bg)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>PLATFORM CAPABILITIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
            Engineered for <span className="text-blue-600 dark:text-cyan-400">Peak Performance</span>
          </h2>
          <p className="mt-4 text-[var(--subtext)] max-w-2xl text-base">
            Every feature is crafted with Apple clarity, Stripe precision, and Linear speed to give you actionable leverage over your human asset trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="glass-panel glass-panel-interactive rounded-3xl p-6 space-y-4 text-left"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-cyan-500/10 flex items-center justify-center text-blue-600 dark:text-cyan-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--foreground)]">{feat.title}</h3>
                <p className="text-xs text-[var(--subtext)] leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
