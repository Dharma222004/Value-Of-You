"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Target, Sparkles, Zap, Shield } from "lucide-react";

export default function WhyHumanCapital() {
  const benefits = [
    {
      icon: Target,
      title: "Predictive Human Asset Valuation",
      desc: "Traditional wealth trackers only look backward at past bank balances. Human Capital calculates your Net Present Value (NPV) based on future earning power.",
    },
    {
      icon: Sparkles,
      title: "AI Skill Commodity Defense",
      desc: "Audits your skill architecture against AI market displacement vectors, pinpointing non-commoditizable leverage areas.",
    },
    {
      icon: Zap,
      title: "Biometrical & Health Capital Alignment",
      desc: "Integrates physical stamina, HRV recovery, and cognitive focus depth to prevent executive burnout drag on wealth compounding.",
    },
    {
      icon: Shield,
      title: "Institutional-Grade Anonymized Telemetry",
      desc: "Zero data selling, AES-256 client encryption, and zero-knowledge cryptographic proof cohort benchmarking.",
    },
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden bg-[#05070f]">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#3b82f6]/04 blur-[140px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-xs font-mono font-semibold uppercase tracking-wider">
            <Target className="w-3.5 h-3.5" />
            <span>THE PARADIGM SHIFT</span>
          </div>
          <h2 className="section-headline">
            Why Human Capital <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]">
              Redefines Financial Intelligence
            </span>
          </h2>
          <p className="body-text mx-auto">
            Traditional wealth management tracks backward-facing static balances. We evaluate the compounding engine that generates all future capital: <strong className="text-white">You.</strong>
          </p>
        </div>

        {/* 1. Side-by-Side Paradigm Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          
          {/* Traditional Card (Legacy) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="card-surface flex flex-col justify-between space-y-6 opacity-80 hover:opacity-100 transition-opacity"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center text-[#f59e0b]">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="card-title">Traditional Wealth Tracking</h3>
                    <span className="text-xs font-mono text-[#f59e0b] font-semibold">REACTIONARY & INCOMPLETE</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3.5 text-sm text-[#94a3b8]">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0 mt-2" />
                  <span>Only measures existing liquid bank balances and static real estate equity.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0 mt-2" />
                  <span>Ignores your primary wealth compounding driver: skills, title velocity, and market mobility.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shrink-0 mt-2" />
                  <span>Blind to biological stamina, HRV recovery depth, and executive burnout drag.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Human Capital Card (Institutional Standard) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card-surface border-[#3b82f6]/40 flex flex-col justify-between space-y-6 shadow-xl"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="card-title">Human Capital AI Platform</h3>
                    <span className="text-xs font-mono text-[#10b981] font-semibold">PREDICTIVE & INSTITUTIONAL</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#3b82f6] bg-[#3b82f6]/10 px-2.5 py-1 rounded-md border border-[#3b82f6]/20 font-semibold">
                  RECOMMENDED
                </span>
              </div>

              <ul className="space-y-3.5 text-sm text-white">
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#06b6d4] shrink-0 mt-1" />
                  <span>Quantifies future lifetime earning trajectory using neural benchmark models.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#06b6d4] shrink-0 mt-1" />
                  <span>Maps monetizable skill stacks and defends against AI market commoditization.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#06b6d4] shrink-0 mt-1" />
                  <span>Integrates health stamina, HRV recovery, and psychometric decision velocity.</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>

        {/* 2. Platform Capabilities 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch pt-4">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="card-surface p-6 flex items-start gap-4 group"
              >
                <div className="p-3 rounded-xl bg-[#090d1a] border border-white/[0.08] text-[#3b82f6] group-hover:text-[#06b6d4] group-hover:border-[#3b82f6]/30 transition-colors shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-white group-hover:text-[#3b82f6] transition-colors">
                    {b.title}
                  </h4>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
