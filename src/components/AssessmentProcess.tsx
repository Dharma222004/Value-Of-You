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
    <section id="process" className="py-24 sm:py-28 lg:py-32 relative overflow-hidden bg-[#05070f]">
      
      {/* Subtle Glowing Radial Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#3b82f6]/06 via-[#06b6d4]/04 to-[#10b981]/06 blur-[160px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#60a5fa] text-xs font-mono font-semibold uppercase tracking-wider">
            <ListOrdered className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>STREAMLINED WORKFLOW</span>
          </div>
          <h2 className="section-headline">
            How The Human Value <br />
            <span className="aurora-gradient-text">
              Assessment Engine Works
            </span>
          </h2>
          <p className="body-text mx-auto text-[#94a3b8]">
            A seamless 4-step path from initial baseline assessment to lifelong personal growth.
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
