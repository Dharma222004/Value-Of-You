"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Target,
  Sparkles,
  Zap,
  Shield,
  ArrowRight,
  TrendingUp,
  Cpu,
  BarChart3,
  Layers,
  Award,
  DollarSign
} from "lucide-react";

export default function WhyHumanCapital() {

  const benefits = [
    {
      id: "human-value",
      icon: Target,
      tag: "Behavioral Capital",
      title: "Human Value Index",
      badge: "94.2 Human Value Score",
      badgeClass: "bg-[#3b82f6]/10 text-[#60a5fa] border-[#3b82f6]/25 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
      iconColor: "text-[#3b82f6]",
      iconBg: "bg-[#3b82f6]/15 border-[#3b82f6]/30",
      desc: "Evaluate your education, skills, financial literacy, health, and personal development through a unified Human Value framework that measures your current position and future potential.",
      metricLabel: "Human Value Assessment",
      metricVal: "94.2 Score",
      detail: "Evaluates education, skills, financial literacy, health, and personal development through unified scoring.",
      progress: 94,
      progressColor: "from-[#3b82f6] to-[#60a5fa]",
      shadowColor: "rgba(59,130,246,0.4)",
      dimension: "Human Value Score",
      colSpan: "lg:col-span-2"
    },
    {
      id: "skill-career",
      icon: Award,
      tag: "Skill & Education Capital",
      title: "Skill & Career Intelligence",
      badge: "92% Future Readiness",
      badgeClass: "bg-[#06b6d4]/10 text-[#22d3ee] border-[#06b6d4]/25 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
      iconColor: "text-[#06b6d4]",
      iconBg: "bg-[#06b6d4]/15 border-[#06b6d4]/30",
      desc: "Identify your strongest competencies, uncover skill gaps, and receive personalized recommendations to improve employability and long-term career growth.",
      metricLabel: "Future Readiness Score",
      metricVal: "92% Readiness",
      detail: "Identifies top competencies, skill gaps, and personalized recommendations for career growth.",
      progress: 92,
      progressColor: "from-[#06b6d4] to-[#22d3ee]",
      shadowColor: "rgba(6,182,212,0.4)",
      dimension: "Employability Score",
      colSpan: "lg:col-span-2"
    },
    {
      id: "health-performance",
      icon: Zap,
      tag: "Health Capital",
      title: "Health & Performance Capital",
      badge: "86/100 Wellness Score",
      badgeClass: "bg-[#10b981]/10 text-[#34d399] border-[#10b981]/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
      iconColor: "text-[#10b981]",
      iconBg: "bg-[#10b981]/15 border-[#10b981]/30",
      desc: "Measure the relationship between physical health, mental well-being, energy, productivity, and performance to build sustainable personal growth.",
      metricLabel: "Wellness Assessment",
      metricVal: "86/100 Wellness",
      detail: "Measures physical health, mental well-being, energy, and productivity correlation.",
      progress: 86,
      progressColor: "from-[#10b981] to-[#34d399]",
      shadowColor: "rgba(16,185,129,0.4)",
      dimension: "Wellness Score",
      colSpan: "lg:col-span-2"
    },
    {
      id: "financial-capital",
      icon: DollarSign,
      tag: "Financial Capital",
      title: "Financial Independence & Runway",
      badge: "88/100 Stability Score",
      badgeClass: "bg-[#f59e0b]/10 text-[#fbbf24] border-[#f59e0b]/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
      iconColor: "text-[#f59e0b]",
      iconBg: "bg-[#f59e0b]/15 border-[#f59e0b]/30",
      desc: "Quantify unearned liquid runway, savings compounding rate, passive yield streams, and net worth growth velocity to achieve sustainable financial stability.",
      metricLabel: "Financial Stability Score",
      metricVal: "88/100 Stability",
      detail: "Quantifies liquid runway, savings compounding velocity, and net worth protection.",
      progress: 88,
      progressColor: "from-[#f59e0b] to-[#fbbf24]",
      shadowColor: "rgba(245,158,11,0.4)",
      dimension: "Financial Stability Score",
      colSpan: "lg:col-span-3"
    },
    {
      id: "privacy-ai",
      icon: Shield,
      tag: "Ethical AI & Protection",
      title: "Privacy & Ethical AI",
      badge: "100% Data Protection",
      badgeClass: "bg-[#8b5cf6]/10 text-[#a78bfa] border-[#8b5cf6]/25 shadow-[0_0_12px_rgba(139,92,246,0.15)]",
      iconColor: "text-[#8b5cf6]",
      iconBg: "bg-[#8b5cf6]/15 border-[#8b5cf6]/30",
      desc: "Your data belongs to you. Every assessment is protected through secure processing, transparent analytics, and privacy-first AI principles.",
      metricLabel: "Privacy Protection",
      metricVal: "100% Secure",
      detail: "Protected through secure processing, transparent analytics, and privacy-first AI principles.",
      progress: 100,
      progressColor: "from-[#8b5cf6] to-[#a78bfa]",
      shadowColor: "rgba(139,92,246,0.4)",
      dimension: "Data Protection",
      colSpan: "lg:col-span-3"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section
      id="about"
      className="py-28 sm:py-36 relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(180deg, #081224 0%, #0C1830 50%, #101C36 100%)",
      }}
    >

      {/* Radiant Multi-Color Ambient Glows */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3, 0.45, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] pointer-events-none rounded-full blur-[95px]"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-10 right-[5%] w-[450px] h-[450px] pointer-events-none rounded-full blur-[85px]"
        style={{
          background: "radial-gradient(circle, rgba(79, 124, 255, 0.15), transparent 70%)",
        }}
      />
      <div
        className="absolute top-10 left-[5%] w-[400px] h-[400px] pointer-events-none rounded-full blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(182, 109, 255, 0.15), transparent 70%)",
        }}
      />

      {/* Grid Pattern overlay: opacity 0.15 */}
      <div
        className="absolute inset-0 bg-institutional-grid pointer-events-none"
        style={{ opacity: 0.15 }}
      />

      <div className="grid-container relative z-10 space-y-16">

        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#00D4FF]/50 text-[#00D4FF] text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.35)] backdrop-blur-md">
              <Target className="w-3.5 h-3.5 text-[#00D4FF] animate-pulse" />
              <span>THE HUMAN VALUE FRAMEWORK</span>
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="section-headline text-white"
            style={{
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 0 20px rgba(0, 212, 255, 0.25)",
            }}
          >
            Why Human Capital <br className="hidden sm:inline" />
            <span
              style={{
                background: "linear-gradient(135deg, #00D4FF, #4F7CFF, #B66DFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.35))",
              }}
            >
              Redefines Financial Intelligence
            </span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="body-text mx-auto text-base sm:text-lg"
            style={{
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Stop measuring only what you've accumulated. Start measuring the compounding potential that powers everything you'll achieve.
          </motion.p>
        </motion.div>

        {/* 1. Side-by-Side Paradigm Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">

          {/* Traditional Card (Legacy) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.5 }}
            className="relative rounded-2xl p-7 sm:p-8 bg-gradient-to-b from-[#151c35]/90 to-[#0d1326]/95 border border-white/[0.18] flex flex-col justify-between space-y-6 hover:border-[#f59e0b]/60 transition-all duration-300 group shadow-2xl backdrop-blur-md"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/35 flex items-center justify-center text-[#f59e0b] shadow-inner group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h3 className="card-title text-white group-hover:text-[#fde68a] transition-colors">Traditional Wealth Tracking</h3>
                    <span className="text-[11px] font-mono text-[#f59e0b] font-bold tracking-wider uppercase">
                      REACTIONARY & INCOMPLETE
                    </span>
                  </div>
                </div>
              </div>

              {/* Penalty Highlight Box */}
              <div className="p-3.5 rounded-xl bg-[#1f1606]/80 border border-[#f59e0b]/40 flex items-center justify-between font-mono text-xs">
                <span className="text-[#fbbf24] font-medium flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#f59e0b]" />
                  Future Value Visibility:
                </span>
                <span className="text-[#f59e0b] font-bold bg-[#f59e0b]/15 px-2.5 py-0.5 rounded border border-[#f59e0b]/30">0% (Static)</span>
              </div>

              <ul className="space-y-4 text-sm text-[#e2e8f0]">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0 mt-1.5 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="leading-relaxed">Only measures existing liquid bank balances and static real estate equity.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0 mt-1.5 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="leading-relaxed">Ignores your primary wealth compounding driver: skills, title velocity, and market mobility.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b] shrink-0 mt-1.5 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  <span className="leading-relaxed">Blind to biological stamina, HRV recovery depth, and executive burnout drag.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Human Capital Card (Institutional Standard) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative rounded-2xl p-7 sm:p-8 bg-[#111a33] border border-[#3b82f6]/50 flex flex-col justify-between space-y-6 shadow-2xl shadow-[#3b82f6]/20 hover:border-[#06b6d4]/90 transition-all duration-300 group"
          >
            {/* Animated Gradient Top Highlight Bar */}
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981] bg-[length:200%_auto] rounded-t-2xl"
            />

            {/* Glowing backdrop mesh */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3b82f6]/20 to-[#10b981]/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-90 transition-opacity pointer-events-none -z-10" />

            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/35 flex items-center justify-center text-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-5.5 h-5.5 text-[#06b6d4]" />
                  </div>
                  <div>
                    <h3 className="card-title text-white group-hover:text-[#93c5fd] transition-colors">Human Value AI Platform</h3>
                    <span className="text-[11px] font-mono text-[#10b981] font-bold tracking-wider uppercase">
                      PREDICTIVE & HOLISTIC
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/15 px-3 py-1 rounded-full border border-[#10b981]/30 font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  RECOMMENDED
                </span>
              </div>

              {/* Reward Highlight Box */}
              <div className="p-3.5 rounded-xl bg-[#061e1a]/80 border border-[#10b981]/40 flex items-center justify-between font-mono text-xs shadow-inner">
                <span className="text-[#34d399] font-medium flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
                  Future Value Visibility:
                </span>
                <span className="text-[#10b981] font-bold bg-[#10b981]/15 px-2.5 py-0.5 rounded border border-[#10b981]/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">100% (Multidimensional)</span>
              </div>

              <ul className="space-y-4 text-sm text-white">
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] shrink-0 mt-0.5 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed text-[#f1f5f9]">Quantifies future earning and personal growth trajectory using multidimensional models.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] shrink-0 mt-0.5 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed text-[#f1f5f9]">Maps high-value skill stacks and provides personalized roadmap recommendations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded bg-[#06b6d4]/15 border border-[#06b6d4]/30 text-[#06b6d4] shrink-0 mt-0.5 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed text-[#f1f5f9]">Integrates health stamina, financial literacy, and behavioral decision intelligence.</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>

        {/* 2. Platform Capabilities 5 Dimensions Balanced Bento Grid */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-mono text-white flex items-center gap-2 tracking-tight">
              <Cpu className="w-5 h-5 text-[#3b82f6]" />
              <span>THE 5 CAPITAL DIMENSIONS</span>
            </h3>
            <span className="text-xs font-mono text-[#cbd5e1] hidden sm:block">AI-POWERED HOLISTIC TELEMETRY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`relative rounded-2xl p-6 sm:p-7 border transition-all duration-300 group flex flex-col justify-between space-y-5 overflow-hidden bg-[#111a33] border-white/[0.16] hover:border-white/[0.32] hover:bg-[#152042] shadow-xl hover:shadow-2xl ${b.colSpan}`}
                >
                  {/* Subtle top hover accent glow */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${b.progressColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  {/* Header: Icon + Title + Tag */}
                  <div className="relative z-10 flex items-start gap-3.5">
                    <div className={`p-3 rounded-xl border transition-transform group-hover:scale-105 ${b.iconBg} ${b.iconColor} shadow-inner`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <h4 className="text-base font-bold text-white group-hover:text-[#93c5fd] transition-colors leading-snug">
                        {b.title}
                      </h4>
                      <span className="text-[11px] font-mono font-semibold text-[#06b6d4] block">
                        {b.tag}
                      </span>
                    </div>
                  </div>

                  {/* Glowing Badge Pill */}
                  <div className="relative z-10">
                    <span className={`inline-block text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${b.badgeClass}`}>
                      {b.badge}
                    </span>
                  </div>

                  {/* Card Description */}
                  <p className="relative z-10 text-xs sm:text-sm text-[#e2e8f0] leading-relaxed line-clamp-3 font-normal">
                    {b.desc}
                  </p>

                  {/* Animated Progress Bar */}
                  <div className="relative z-10 space-y-2 pt-1">
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <span className="text-[#cbd5e1]">{b.metricLabel}</span>
                      <span className="text-white font-bold">{b.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#0a0f1d] rounded-full overflow-hidden p-0.5 border border-white/[0.1]">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${b.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${b.progressColor} rounded-full`}
                        style={{ boxShadow: `0 0 10px ${b.shadowColor}` }}
                      />
                    </div>
                  </div>

                  {/* Bottom Footer Info */}
                  <div className="relative z-10 pt-3 border-t border-white/[0.1] flex items-center justify-between text-xs font-mono text-[#cbd5e1]">
                    <span className="flex items-center gap-1.5 text-[#60a5fa] font-semibold">
                      <Layers className="w-3.5 h-3.5 text-[#3b82f6]" />
                      <span>{b.dimension}</span>
                    </span>
                    <span className="text-[#3b82f6] group-hover:text-[#60a5fa] flex items-center gap-1 group-hover:translate-x-1 transition-transform font-medium">
                      <span>Explore detail</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
