"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

const FAQS = [
  {
    q: "What is a Human Capital Score?",
    a: "It is a single 0–100 score that measures your total earning potential across 5 areas: Career Momentum, Financial Runway, Skill Architecture, Health Stamina, and Mindset EQ. Think of it as a comprehensive health-and-wealth score for your career.",
  },
  {
    q: "How is my Lifetime Asset Value (NPV) calculated?",
    a: "We estimate your future earning power by combining your career velocity, liquid savings runway, skill market demand, and peak high-performance years ahead into a projected Net Present Value.",
  },
  {
    q: "Is my personal financial and biological data private?",
    a: "100% private. Your data is encrypted on your device using bank-grade 256-bit AES encryption. We never sell your personal information to recruiters, advertisers, or third parties.",
  },
  {
    q: "How often should I re-evaluate my Human Capital score?",
    a: "We recommend a quick quarterly check-in, or whenever you change roles, master a key new skill, or significantly increase your financial savings runway.",
  },
  {
    q: "Does Human Capital offer enterprise plans for teams?",
    a: "Yes. Enterprise plans allow companies, venture funds, and leadership teams to map talent capabilities, identify skill gaps, and prevent executive burnout.",
  },
  {
    q: "How does the AI defend against skill displacement?",
    a: "Our model audits your skill set against real-time AI automation trends, highlighting your rare, high-value skills that cannot easily be commoditized.",
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
    <section id="faq" className="py-24 relative overflow-hidden bg-[#05070f]">
      
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#3b82f6]/04 blur-[140px] pointer-events-none rounded-full" />

      <div className="grid-container max-w-[720px] relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/20 text-[#3b82f6] text-xs font-mono font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#94a3b8] max-w-md mx-auto">
            Everything you need to know about the platform and scoring engine.
          </p>

          {/* Search Bar */}
          <div className="pt-2 max-w-sm mx-auto relative">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#090d1a] border border-white/[0.08] focus:border-[#3b82f6] rounded-xl text-xs text-white placeholder-[#94a3b8] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Compact Accordion Items */}
        <div className="space-y-2.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-[#090d1a] border border-white/[0.08] hover:border-white/[0.15] rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 focus:outline-none group"
                  >
                    <span className="font-semibold text-sm text-white group-hover:text-[#3b82f6] transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#94a3b8] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#3b82f6]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-4 text-xs sm:text-sm text-[#94a3b8] leading-relaxed border-t border-white/[0.06] pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-xs font-mono text-[#94a3b8]">
              No questions found matching &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
