"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";


export const CallToActionBanner: React.FC = () => {
  return (
    <section
      className="py-24 sm:py-28 lg:py-32 relative overflow-hidden text-white"
      style={{
        background: "linear-gradient(180deg, #081224 0%, #0C1830 50%, #101C36 100%)",
      }}
    >
      
      {/* Background Ambient Glows */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] pointer-events-none rounded-full blur-[95px]"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 bg-institutional-grid pointer-events-none"
        style={{ opacity: 0.15 }}
      />

      <div className="grid-container max-w-[1020px] relative z-10">
        
        {/* Card Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -80px 0px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="card-surface p-10 sm:p-14 text-center space-y-8 relative overflow-hidden"
          style={{
            background: "rgba(20, 40, 80, 0.7)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            border: "1px solid rgba(0, 212, 255, 0.3)",
            boxShadow: "0 25px 80px rgba(0, 212, 255, 0.25)",
          }}
        >
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2563EB]/20 border border-[#00D4FF]/50 text-[#00D4FF] text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,212,255,0.35)] backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-[#00D4FF]" />
            <span>START YOUR HUMAN VALUE ASSESSMENT TODAY</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="section-headline leading-[1.15] text-white"
            style={{
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 0 20px rgba(0, 212, 255, 0.25)",
            }}
          >
            Ready to Measure &amp; Grow <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00D4FF, #4F7CFF, #B66DFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.35))",
              }}
            >
              Your Human Value Potential?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="body-text mx-auto text-base sm:text-lg"
            style={{
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
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
            <motion.div
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-white border border-[#00D4FF]/60 cursor-pointer"
                style={{
                  background: "linear-gradient(90deg, #2563EB, #00D4FF)",
                  boxShadow: "0 10px 40px rgba(0, 212, 255, 0.4)",
                  transition: "filter 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "brightness(1.0)";
                }}
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


