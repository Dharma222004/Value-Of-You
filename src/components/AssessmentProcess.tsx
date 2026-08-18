"use client";

import React from "react";
import { motion } from "framer-motion";
import { ListOrdered, ArrowRight, ShieldCheck, Cpu, LineChart, Award } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Complete 5-Min Assessment",
    desc: "Input your education, skills, financial habits, and wellness habits into our secure interactive assessment.",
    icon: ShieldCheck,
  },
  {
    step: "02",
    title: "AI Synthesis & Analysis",
    desc: "Our machine intelligence algorithms evaluate your profile across the 5 core dimensions against cohort benchmarks.",
    icon: Cpu,
  },
  {
    step: "03",
    title: "Generate Human Value Score",
    desc: "Receive your unified 0–100 Human Value Index with full dimension breakdowns and strength radar analysis.",
    icon: Award,
  },
  {
    step: "04",
    title: "Execute Growth Roadmap",
    desc: "Deploy personalized action recommendations across 30-day, 90-day, 1-year, and 5-year milestones to compound your potential.",
    icon: LineChart,
  },
];

export default function AssessmentProcess() {
  return (
    <section
      id="process"
      className="py-24 sm:py-28 lg:py-32 relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(180deg, #081224 0%, #0C1830 50%, #101C36 100%)",
      }}
    >
      
      {/* Ambient Glowing Background Spotlights */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] pointer-events-none rounded-full blur-[95px]"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 bg-institutional-grid pointer-events-none"
        style={{ opacity: 0.15 }}
      />

      <div className="grid-container relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#00D4FF]/50 text-[#00D4FF] text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.35)] backdrop-blur-md">
            <ListOrdered className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span>STREAMLINED WORKFLOW</span>
          </div>
          <h2
            className="section-headline text-white"
            style={{
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 0 20px rgba(0, 212, 255, 0.25)",
            }}
          >
            How The Human Value <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00D4FF, #4F7CFF, #B66DFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.35))",
              }}
            >
              Assessment Engine Works
            </span>
          </h2>
          <p
            className="body-text mx-auto"
            style={{
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            A seamless 4-step path from initial baseline assessment to lifelong personal growth.
          </p>
        </motion.div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="card-surface card-hover-lift flex flex-col justify-between group cursor-default bg-gradient-to-b from-[#131f42]/95 via-[#0e1732]/98 to-[#090e20] border-[#38bdf8]/30 hover:border-[#38bdf8]/70 shadow-[0_0_25px_rgba(59,130,246,0.15)] hover:shadow-[0_0_35px_rgba(56,189,248,0.3)] backdrop-blur-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-mono text-[#38bdf8] group-hover:text-[#22d3ee] transition-colors drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">
                      {s.step}
                    </span>
                    <div className="p-3 rounded-xl bg-[#18264d] border border-white/[0.18] text-[#38bdf8] group-hover:text-[#34d399] transition-colors shadow-inner group-hover:border-[#38bdf8]/60">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#60a5fa] transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-sm text-[#e2e8f0] leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.1] flex items-center gap-1.5 text-xs font-mono text-[#cbd5e1] group-hover:text-white transition-colors">
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
