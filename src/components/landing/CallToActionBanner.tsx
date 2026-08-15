"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export const CallToActionBanner: React.FC = () => {
  return (
    <section className="py-24 sm:py-28 lg:py-32 relative overflow-hidden bg-[#05070f]">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#3b82f6]/10 via-[#06b6d4]/08 to-[#10b981]/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="grid-container max-w-[1020px] relative z-10">
        
        {/* Card Wrapper */}
        <div className="card-surface p-10 sm:p-14 text-center space-y-8 relative overflow-hidden">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#60a5fa] text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#06b6d4]" />
            <span>START YOUR HUMAN VALUE ASSESSMENT TODAY</span>
          </div>

          <h2 className="section-headline leading-[1.15]">
            Ready to Measure &amp; Grow <br />
            <span className="aurora-gradient-text">
              Your Human Value Potential?
            </span>
          </h2>

          <p className="body-text mx-auto text-base sm:text-lg text-[#94a3b8]">
            Join thousands of students, professionals, and lifelong learners using our multidimensional framework to optimize their skills, health, finances, and career growth.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/auth/signup"
              className="btn-micro inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-[#3b82f6] shadow-xl shadow-[#3b82f6]/25"
            >
              <span>Calculate Your Human Value Score</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#94a3b8] font-mono pt-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" /> Free Baseline Assessment
            </span>
            <span>·</span>
            <span>Zero Credit Card Required</span>
            <span>·</span>
            <span>100% Privacy Protected</span>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CallToActionBanner;

