"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export const CallToActionBanner: React.FC = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-[#05070f]">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#3b82f6]/06 blur-[160px] pointer-events-none rounded-full" />

      <div className="grid-container max-w-[1020px] relative z-10">
        
        {/* Card Wrapper */}
        <div className="card-surface p-10 sm:p-14 text-center space-y-8 relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#3b82f6] text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>START YOUR CAPITAL EVALUATION TODAY</span>
          </div>

          <h2 className="hero-headline leading-[1.1]">
            Ready to Measure & Compound <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981]">
              Your Human Capital Worth?
            </span>
          </h2>

          <p className="body-text mx-auto">
            Join thousands of executives, senior engineers, and founders using institutional telemetry to optimize career trajectory and long-term capital independence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.98] transition-all shadow-xl shadow-[#3b82f6]/25"
            >
              <span>Calculate Your Score Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#94a3b8] font-mono pt-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" /> Free Baseline Audit
            </span>
            <span>·</span>
            <span>Zero Credit Card Required</span>
            <span>·</span>
            <span>256-Bit Client Encrypted</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CallToActionBanner;
