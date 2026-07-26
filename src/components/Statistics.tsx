"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Zap, Globe } from "lucide-react";

const STATS = [
  {
    icon: TrendingUp,
    value: "$4.8M",
    label: "Avg. Lifetime Worth",
    description: "Calculated across career trajectory & financial compounding runway.",
  },
  {
    icon: ShieldCheck,
    value: "99.4%",
    label: "Scoring Accuracy",
    description: "Validated by institutional risk and talent allocation algorithms.",
  },
  {
    icon: Zap,
    value: "5 Vectors",
    label: "Holistic Dimensions",
    description: "Financial, Career, Skills, Longevity Health, and Mindset EQ.",
  },
  {
    icon: Globe,
    value: "50,000+",
    label: "Valuations Analyzed",
    description: "Empowering tech leaders, founders, and executives worldwide.",
  },
];

export default function Statistics() {
  return (
    <section className="py-16 border-y border-[var(--border)] bg-[var(--card-bg)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-2 text-left"
              >
                <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-mono text-xs font-semibold">
                  <Icon className="w-4 h-4" />
                  <span>METRIC {idx + 1}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[var(--foreground)]">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-[var(--foreground)]">{stat.label}</div>
                <div className="text-xs text-[var(--subtext)] leading-relaxed">{stat.description}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
