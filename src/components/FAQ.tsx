"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

const FAQS = [
  {
    q: "What is a Human Value Score?",
    a: "It is a unified 0–100 score that evaluates your current position and growth potential across 5 core dimensions: Education & Career, Financial Well-Being, Skills & Employability, Health & Wellness, and Behavioral Intelligence.",
  },
  {
    q: "How does the platform help me improve my score?",
    a: "Our AI analysis identifies your highest-growth opportunities and generates personalized action plans structured into 30-day quick wins, 90-day skill development milestones, 1-year transformation goals, and 5-year mastery horizons.",
  },
  {
    q: "Is my personal data kept private and secure?",
    a: "Yes, 100% private. Your data is encrypted during storage and transit. We operate on a privacy-first model: your data is never sold, rented, or shared with third-party advertisers or recruiters.",
  },
  {
    q: "How often should I retake or update my assessment?",
    a: "We recommend updating your assessment every 30–90 days as you complete new courses, certifications, wellness milestones, or financial literacy goals.",
  },
  {
    q: "Who is the Human Value framework designed for?",
    a: "The framework is designed for students, ambitious early-career professionals, and lifelong learners looking for structured, data-driven clarity on their growth trajectory.",
  },
  {
    q: "How does the AI provide personalized recommendations?",
    a: "The scoring engine benchmarks your inputs across all 5 dimensions against holistic cohort benchmarks to pinpoint high-impact leverage points for your specific goals.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      id="faq"
      className="py-24 relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(180deg, #081224 0%, #0C1830 50%, #101C36 100%)",
      }}
    >
      
      {/* Background Accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none rounded-full blur-[95px]"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 bg-institutional-grid pointer-events-none"
        style={{ opacity: 0.15 }}
      />

      <div className="grid-container max-w-[760px] relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-3 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#00D4FF]/50 text-[#00D4FF] text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.35)] backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
            style={{
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 0 20px rgba(0, 212, 255, 0.25)",
            }}
          >
            Frequently Asked Questions
          </h2>
          <p
            className="text-sm max-w-md mx-auto"
            style={{
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Everything you need to know about the platform and scoring engine.
          </p>

          {/* Search Bar */}
          <div className="pt-3 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#00D4FF] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0C1830]/90 border border-[#00D4FF]/35 focus:border-[#00D4FF] rounded-xl text-sm text-white placeholder-[rgba(255,255,255,0.5)] outline-none transition-all shadow-[0_0_20px_rgba(0,0,0,0.4)] focus:shadow-[0_0_25px_rgba(0,212,255,0.35)] backdrop-blur-md"
            />
          </div>
        </motion.div>

        {/* Compact Accordion Items */}
        <motion.div
          className="space-y-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <motion.div
                  key={faq.q}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  className="bg-gradient-to-b from-[#131f42]/95 to-[#0e1732]/98 border border-[#38bdf8]/25 hover:border-[#38bdf8]/60 rounded-xl overflow-hidden transition-all shadow-lg backdrop-blur-xl"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 focus:outline-none group"
                  >
                    <span className="font-semibold text-sm text-white group-hover:text-[#60a5fa] transition-colors">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ChevronDown className={`w-4 h-4 ${isOpen ? "text-[#60a5fa]" : "text-[#cbd5e1]"} shrink-0`} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-1 text-xs text-[#e2e8f0] leading-relaxed border-t border-white/[0.08]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-[#cbd5e1] font-mono">
              No matching questions found.
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
