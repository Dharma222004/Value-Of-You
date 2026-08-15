"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff, Key, Sparkles } from "lucide-react";


export const SecurityPrivacy: React.FC = () => {
  return (
    <section id="security" className="py-28 sm:py-36 relative bg-[#0a0f1d] overflow-hidden text-white">
      
      {/* Radial Dark Shield Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#10b981]/16 blur-[75px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10 space-y-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/35 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.25)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PRIVACY & DATA PROTECTION</span>
          </div>
          <h2 className="section-headline text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-[#3b82f6]">
              Your Data. Your Control.
            </span>
          </h2>
          <p className="body-text mx-auto text-[#e2e8f0]">
            We believe human value data is deeply personal. Your information remains private, secure, and completely under your control.
          </p>
        </motion.div>

        {/* Security Shield Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Hero Lock Visualization (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
            className="lg:col-span-5 card-surface p-8 flex flex-col items-center justify-between text-center space-y-6 h-full border-[#10b981]/50 bg-[#111a33] shadow-2xl"
          >
            <div className="w-full flex justify-center">
              <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/20 px-3.5 py-1 rounded-full border border-[#10b981]/35 font-bold uppercase tracking-wider">
                PRIVACY-FIRST HUMAN VALUE ENGINE
              </span>
            </div>

            <div className="relative w-36 h-36 rounded-full flex items-center justify-center border border-[#10b981]/45 bg-[#0a0f1d] shadow-inner my-auto">
              <div className="pulse-ring-1 absolute inset-0 rounded-full border border-[#10b981]/35" />
              <div className="pulse-ring-2 absolute inset-0 rounded-full border-2 border-[#10b981]/20" />
              <Lock className="w-12 h-12 text-[#10b981]" />
            </div>

            <div className="space-y-3 w-full">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
                YOUR HUMAN VALUE DATA STAYS YOURS
              </span>
              <p className="text-xs text-[#e2e8f0] leading-relaxed max-w-xs mx-auto">
                Your assessments, scores, and personal insights are processed securely to ensure your information remains protected and accessible only to you.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 font-mono text-[10px] text-[#10b981]">
                <span className="px-2.5 py-1 rounded bg-[#10b981]/20 border border-[#10b981]/35 font-bold">Privacy Protected</span>
                <span className="px-2.5 py-1 rounded bg-[#10b981]/20 border border-[#10b981]/35 font-bold">User Controlled</span>
                <span className="px-2.5 py-1 rounded bg-[#10b981]/20 border border-[#10b981]/35 font-bold">No Third-Party Sharing</span>
              </div>
            </div>
          </motion.div>

          {/* Right 4 Feature Cards in 2x2 Grid (7 Cols) */}
          <motion.div
            className="lg:col-span-7 grid sm:grid-cols-2 gap-6 items-stretch"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "0px 0px -60px 0px" }}
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
          >
            
            {/* Top-Right Card 1 */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              whileHover={{ scale: 1.025, y: -3 }}
              transition={{ duration: 0.3 }}
              className="card-surface p-6 flex flex-col justify-between space-y-4 h-full bg-[#111a33] border-white/[0.16] hover:border-[#10b981]/60 transition-colors shadow-lg"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center text-[#10b981]">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Secure Data Protection</h3>
                <p className="text-xs text-[#e2e8f0] leading-relaxed">
                  Your assessment data is encrypted during storage and transmission to protect your personal information.
                </p>
              </div>
            </motion.div>

            {/* Top-Right Card 2 */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              whileHover={{ scale: 1.025, y: -3 }}
              transition={{ duration: 0.3 }}
              className="card-surface p-6 flex flex-col justify-between space-y-4 h-full bg-[#111a33] border-white/[0.16] hover:border-[#3b82f6]/60 transition-colors shadow-lg"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/20 border border-[#3b82f6]/40 flex items-center justify-center text-[#3b82f6]">
                  <EyeOff className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">100% User Data Ownership</h3>
                <p className="text-xs text-[#e2e8f0] leading-relaxed">
                  Your information is never sold, rented, or shared with advertisers, recruiters, or external organizations.
                </p>
              </div>
            </motion.div>

            {/* Bottom-Left Card 3 */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              whileHover={{ scale: 1.025, y: -3 }}
              transition={{ duration: 0.3 }}
              className="card-surface p-6 flex flex-col justify-between space-y-4 h-full bg-[#111a33] border-white/[0.16] hover:border-[#06b6d4]/60 transition-colors shadow-lg"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/20 border border-[#06b6d4]/40 flex items-center justify-center text-[#06b6d4]">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Anonymous Community Insights</h3>
                <p className="text-xs text-[#e2e8f0] leading-relaxed">
                  Compare your Human Value Score with community benchmarks while keeping your identity completely anonymous.
                </p>
              </div>
            </motion.div>

            {/* Bottom-Right Card 4 */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              whileHover={{ scale: 1.025, y: -3 }}
              transition={{ duration: 0.3 }}
              className="card-surface p-6 flex flex-col justify-between space-y-4 h-full bg-[#111a33] border-white/[0.16] hover:border-[#8b5cf6]/60 transition-colors shadow-lg"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-400/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Ethical AI Architecture</h3>
                <p className="text-xs text-[#e2e8f0] leading-relaxed">
                  Our evaluation models focus purely on helping you grow — not ranking, sorting, or labeling you for third-party platforms.
                </p>
              </div>
            </motion.div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default SecurityPrivacy;

