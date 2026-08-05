"use client";

import React from "react";
import { motion } from "framer-motion";
import { ListOrdered, ArrowRight, ShieldCheck, Cpu, LineChart, Award } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Complete 5-Min Audit",
    desc: "Input your career status, liquid financial runway, skill architecture, and health metrics into our secure telemetry wizard.",
    icon: ShieldCheck,
  },
  {
    step: "02",
    title: "AI Neural Synthesis",
    desc: "Our institutional machine intelligence algorithms benchmark your inputs against global top 5% talent cohort models.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Compute Composite Score",
    desc: "Receive your unified 0–100 Human Capital Index along with your estimated 10-year Net Present Value (NPV) yield.",
    icon: Award,
  },
  {
    step: "04",
    title: "Execute Action Roadmap",
    desc: "Deploy personalized quarterly milestones to defend against AI displacement and compound your net human asset worth.",
    icon: LineChart,
  },
];

export default function AssessmentProcess() {
  return (
    <section id="process" className="py-32 relative overflow-hidden bg-[#05070f]">
      
      {/* Subtle Glowing Radial Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#3b82f6]/04 blur-[140px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-xs font-mono font-semibold uppercase tracking-wider">
            <ListOrdered className="w-3.5 h-3.5" />
            <span>STREAMLINED WORKFLOW</span>
          </div>
          <h2 className="section-headline">
            How The Human Capital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]">
              Evaluation Engine Works
            </span>
          </h2>
          <p className="body-text mx-auto">
            A frictionless 4-step path from baseline telemetry audit to quarterly asset compounding.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="card-surface flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-[#3b82f6] group-hover:text-[#06b6d4] transition-colors">
                      {s.step}
                    </span>
                    <div className="p-3 rounded-xl bg-[#090d1a] border border-white/[0.08] text-[#3b82f6] group-hover:text-[#10b981] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#3b82f6] transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-sm text-[#94a3b8] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center gap-1.5 text-xs font-mono text-[#94a3b8] group-hover:text-white transition-colors">
                  <span>Step {idx + 1} Protocol</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#3b82f6] group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
