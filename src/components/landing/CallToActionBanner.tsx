"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";


export const CallToActionBanner: React.FC = () => {
  return (
    <section className="py-24 sm:py-28 lg:py-32 relative overflow-hidden bg-[#0a0f1d]">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[400px] bg-gradient-to-tr from-[#3b82f6]/24 via-[#06b6d4]/16 to-[#10b981]/18 blur-[75px] pointer-events-none rounded-full" />

      <div className="grid-container max-w-[1020px] relative z-10">
        
        {/* Card Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="card-surface p-10 sm:p-14 text-center space-y-8 relative overflow-hidden bg-[#111a33] border border-white/[0.18] shadow-2xl"
        >
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3b82f6]/15 border border-[#3b82f6]/40 text-[#60a5fa] text-xs font-mono font-semibold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.25)]"
          >
            <Sparkles className="w-4 h-4 text-[#06b6d4]" />
            <span>START YOUR HUMAN VALUE ASSESSMENT TODAY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="section-headline leading-[1.15] text-white"
          >
            Ready to Measure &amp; Grow <br />
            <span className="aurora-gradient-text">
              Your Human Value Potential?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="body-text mx-auto text-base sm:text-lg text-[#e2e8f0]"
          >
            Join thousands of students, professionals, and lifelong learners using our multidimensional framework to optimize their skills, health, finances, and career growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 280, damping: 18 }}>
              <Link
                href="/auth/signup"
                className="btn-spring inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-xl shadow-[#3b82f6]/30 glow-pulse-blue border border-[#3b82f6]/50"
              >
                <span>Calculate Your Human Value Score</span>
                <span className="arrow-bounce"><ArrowRight className="w-4 h-4" /></span>
              </Link>
            </motion.div>
          </motion.div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#cbd5e1] font-mono pt-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" /> Free Baseline Assessment
            </span>
            <span>·</span>
            <span>Zero Credit Card Required</span>
            <span>·</span>
            <span>Instant Results</span>
          </div>

        </motion.div>

      </div>
    </section>
  );
};

export default CallToActionBanner;


