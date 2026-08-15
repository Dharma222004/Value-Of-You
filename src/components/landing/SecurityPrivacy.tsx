"use client";

import React from "react";
import { ShieldCheck, Lock, EyeOff, Key, Sparkles } from "lucide-react";

export const SecurityPrivacy: React.FC = () => {
  return (
    <section id="security" className="py-28 sm:py-36 relative bg-[#05070f] overflow-hidden text-white">
      
      {/* Radial Dark Shield Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#10b981]/05 blur-[160px] pointer-events-none rounded-full" />

      <div className="grid-container relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PRIVACY & DATA PROTECTION</span>
          </div>
          <h2 className="section-headline">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] via-[#06b6d4] to-[#3b82f6]">
              Your Data. Your Control.
            </span>
          </h2>
          <p className="body-text mx-auto text-[#94a3b8]">
            We believe human value data is deeply personal. Your information remains private, secure, and completely under your control.
          </p>
        </div>

        {/* Security Shield Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Hero Lock Visualization (5 Cols) */}
          <div className="lg:col-span-5 card-surface p-8 flex flex-col items-center justify-between text-center space-y-6 h-full border-[#10b981]/30">
            <div className="w-full flex justify-center">
              <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 px-3.5 py-1 rounded-full border border-[#10b981]/25 font-bold uppercase tracking-wider">
                PRIVACY-FIRST HUMAN VALUE ENGINE
              </span>
            </div>

            <div className="relative w-36 h-36 rounded-full flex items-center justify-center border border-[#10b981]/40 bg-[#05070f] shadow-inner my-auto">
              <div className="absolute inset-0 rounded-full border border-[#10b981]/20 animate-pulse" />
              <Lock className="w-12 h-12 text-[#10b981]" />
            </div>

            <div className="space-y-3 w-full">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
                YOUR HUMAN VALUE DATA STAYS YOURS
              </span>
              <p className="text-xs text-[#94a3b8] leading-relaxed max-w-xs mx-auto">
                Your assessments, scores, and personal insights are processed securely to ensure your information remains protected and accessible only to you.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 font-mono text-[10px] text-[#10b981]">
                <span className="px-2.5 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/20 font-bold">Privacy Protected</span>
                <span className="px-2.5 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/20 font-bold">User Controlled</span>
                <span className="px-2.5 py-1 rounded bg-[#10b981]/10 border border-[#10b981]/20 font-bold">No Third-Party Sharing</span>
              </div>
            </div>
          </div>

          {/* Right 4 Feature Cards in 2x2 Grid (7 Cols) */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6 items-stretch">
            
            {/* Top-Right Card 1 */}
            <div className="card-surface p-6 flex flex-col justify-between space-y-4 h-full border-white/[0.08] hover:border-[#10b981]/40 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center text-[#10b981]">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Secure Data Protection</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Your assessment data is encrypted during storage and transmission to protect your personal information.
                </p>
              </div>
            </div>

            {/* Top-Right Card 2 */}
            <div className="card-surface p-6 flex flex-col justify-between space-y-4 h-full border-white/[0.08] hover:border-[#3b82f6]/40 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6]">
                  <EyeOff className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">100% User Data Ownership</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Your information is never sold, rented, or shared with advertisers, recruiters, or external organizations.
                </p>
              </div>
            </div>

            {/* Bottom-Left Card 3 */}
            <div className="card-surface p-6 flex flex-col justify-between space-y-4 h-full border-white/[0.08] hover:border-[#06b6d4]/40 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#06b6d4]/10 border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4]">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Anonymous Community Insights</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Compare your Human Value Score with community benchmarks while keeping your identity completely anonymous.
                </p>
              </div>
            </div>

            {/* Bottom-Right Card 4 */}
            <div className="card-surface p-6 flex flex-col justify-between space-y-4 h-full border-white/[0.08] hover:border-purple-400/40 transition-colors">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Transparent & Ethical AI</h3>
                <p className="text-xs text-[#94a3b8] leading-relaxed">
                  Our AI is designed to provide fair, transparent, and privacy-focused recommendations that support personal growth.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default SecurityPrivacy;

