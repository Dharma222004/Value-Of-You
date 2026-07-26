"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What is a Human Capital Score?",
    a: "Your Human Capital Score is a unified 0–100 composite index that measures your lifetime asset valuation potential across 5 core dimensions: Financial Health, Career Status, Skills Architecture, Longevity Health, and Mindset EQ.",
  },
  {
    q: "How is my Lifetime Asset Value calculated?",
    a: "We combine your active income trajectory, projected compounding yield, skill scarcity premium, and years of physical high-performance capacity to generate an estimated NPV (Net Present Value) of your total human capital asset base.",
  },
  {
    q: "Is my personal financial and biological data private?",
    a: "Yes. All data inputs are protected by client-side 256-bit encryption. We never sell, monetize, or expose your diagnostic metrics to third-party advertisers.",
  },
  {
    q: "How often should I re-evaluate my Human Capital score?",
    a: "We recommend a quarterly review. As you acquire new skills, adjust liquid runway, or improve health biomarkers, your score dynamically updates to reflect your compounding asset growth.",
  },
  {
    q: "Does Human Capital offer enterprise plans for executive teams?",
    a: "Yes. Our Enterprise tier offers aggregate team capability mapping, executive burnout risk alerts, and specialized talent stack optimization for high-growth companies.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden bg-[var(--card-bg)] border-t border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-400 text-xs font-mono mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] tracking-tight">
            Got Questions? <span className="text-blue-600 dark:text-cyan-400">We Have Answers</span>
          </h2>
          <p className="mt-4 text-[var(--subtext)] max-w-xl text-base">
            Everything you need to know about the platform and scoring engine.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="glass-panel rounded-2xl border border-[var(--border)] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-base text-[var(--foreground)]">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--subtext)] transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-blue-600 dark:text-cyan-400" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-sm text-[var(--subtext)] leading-relaxed border-t border-[var(--border)] pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
