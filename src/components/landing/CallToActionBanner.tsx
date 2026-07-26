"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export const CallToActionBanner: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#080d1a] to-[#040710] border-t border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>START YOUR CAPITAL EVALUATION TODAY</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Ready to Measure & Compound <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-emerald-300 to-indigo-400">
            Your Human Capital Worth?
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Join thousands of executives, senior engineers, and founders using institutional telemetry to optimize career velocity and long-term capital independence.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/auth/signup"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-slate-950 bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-300 hover:from-sky-300 hover:to-emerald-300 shadow-2xl shadow-sky-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Calculate Your Score Now</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-mono pt-4">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Free Baseline Audit
          </span>
          <span>·</span>
          <span>Zero Credit Card Required</span>
          <span>·</span>
          <span>256-Bit Encrypted</span>
        </div>

      </div>
    </section>
  );
};

export default CallToActionBanner;
