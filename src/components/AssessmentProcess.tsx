"use client";

import { motion } from "framer-motion";
import { ListOrdered, CheckCircle2, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Complete 5-Min Assessment",
    desc: "Input your career status, financial runway, skill architecture, and health metrics.",
  },
  {
    step: "02",
    title: "AI Neural Synthesis",
    desc: "Our machine intelligence algorithms evaluate your data against global benchmark models.",
  },
  {
    step: "03",
    title: "Generate Composite Score",
    desc: "Receive your unified 0–100 Human Capital Score along with your lifetime valuation estimate.",
  },
  {
    step: "04",
    title: "Execute Action Roadmap",
    desc: "Follow personalized quarterly milestones to compound your net human asset worth.",
  },
];

export default function AssessmentProcess() {
  return (
    <section className="py-24 relative overflow-hidden bg-[var(--card-bg)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono mb-4">
            <ListOrdered className="w-3.5 h-3.5" />
            <span>STREAMLINED WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
            The Assessment <span className="text-blue-600 dark:text-cyan-400">Process</span>
          </h2>
          <p className="mt-4 text-[var(--subtext)] max-w-2xl text-base">
            A frictionless 4-step path from initial audit to quarterly human asset optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-panel rounded-3xl p-6 space-y-4 text-left relative overflow-hidden"
            >
              <div className="text-3xl font-black font-mono text-blue-600 dark:text-cyan-400">{s.step}</div>
              <h3 className="text-lg font-bold text-[var(--foreground)]">{s.title}</h3>
              <p className="text-xs text-[var(--subtext)] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
