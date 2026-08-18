"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer
      className="border-t py-16 sm:py-20 text-xs font-mono"
      style={{
        background: "#081224",
        borderColor: "rgba(0, 212, 255, 0.2)",
        color: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <div className="grid-container space-y-12">
        
        {/* Top Link Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand Column (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#102046] to-[#081224] border border-[#00D4FF]/50 flex items-center justify-center text-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                <Terminal className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-white tracking-tight font-sans leading-none">
                  Human Value
                </span>
                <span className="text-[10px] font-mono text-[#00D4FF] tracking-wider uppercase font-semibold">
                  Intelligence
                </span>
              </div>
            </div>
            
            <p className="text-xs max-w-sm leading-relaxed font-sans" style={{ color: "rgba(255, 255, 255, 0.82)" }}>
              A multidimensional framework that evaluates education, skills, financial literacy, health, and behavioral intelligence to measure your position and future potential.
            </p>
          </div>

          {/* Column 2: Platform (2 Cols) */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
              PLATFORM
            </span>
            <ul className="space-y-2" style={{ color: "rgba(255, 255, 255, 0.75)" }}>
              <li><a href="#about" className="hover:text-white transition-colors">Why Human Value</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">5 Dimensions</a></li>
              <li><a href="#growth-dashboard" className="hover:text-white transition-colors">Growth Engine</a></li>
              <li><a href="#visualizer" className="hover:text-white transition-colors">Score Simulator</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Privacy & Control</a></li>
              <li><Link href="/dashboard" className="hover:text-[#00D4FF] text-[#4F7CFF] transition-colors flex items-center gap-1 font-semibold"><span>Growth Dashboard</span> <Sparkles className="w-3 h-3 text-[#00D4FF]" /></Link></li>
            </ul>
          </div>

          {/* Column 3: 5 Dimensions (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
              5 CORE DIMENSIONS
            </span>
            <ul className="space-y-2 text-[#cbd5e1]">
              <li><a href="#dimensions" className="hover:text-white transition-colors">1. Education & Career Growth</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">2. Financial Well-Being</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">3. Skills & Employability</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">4. Health & Wellness</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">5. Behavioral Intelligence</a></li>
            </ul>
          </div>

          {/* Column 4: Security & Privacy (2 Cols) */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
              PRIVACY & TRUST
            </span>
            <ul className="space-y-2 text-[#cbd5e1] font-mono">
              <li className="flex items-center gap-1.5 text-[#10b981] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Privacy Protected</span>
              </li>
              <li>100% Data Ownership</li>
              <li>Anonymous Insights</li>
              <li>No Third-Party Selling</li>
              <li>Ethical AI Engine</li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-white/[0.1] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#cbd5e1]">
          <div>
            &copy; {new Date().getFullYear()} Human Value Intelligence Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#security" className="hover:text-white transition-colors">Privacy & Control</a>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security Overview</span>
            <span className="hover:text-white cursor-pointer transition-colors">System Status</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

