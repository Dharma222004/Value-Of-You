"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05070f] border-t border-white/[0.07] text-[#94a3b8] py-20 text-xs font-mono">
      <div className="grid-container space-y-12">
        
        {/* Top Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Column (2 Cols) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#090d1a] border border-white/[0.1] flex items-center justify-center text-[#3b82f6]">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                Human Capital
              </span>
            </div>
            
            <p className="text-[#94a3b8] text-xs max-w-sm leading-relaxed">
              The Executive Intelligence Terminal for Human Capital. Measure, analyze, and optimize your career trajectory, liquid financial runway, technical skill architecture, longevity stamina, and decision psychometrics.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#090d1a] border border-white/[0.08] font-mono text-[11px] text-[#10b981]">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span>All Systems Operational (99.99% Uptime)</span>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider block">
              PLATFORM
            </span>
            <ul className="space-y-2 text-[#94a3b8]">
              <li><a href="#about" className="hover:text-white transition-colors">Why Human Capital</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">5 Core Dimensions</a></li>
              <li><a href="#career-detail" className="hover:text-white transition-colors">Career Intelligence</a></li>
              <li><a href="#visualizer" className="hover:text-white transition-colors">Score Simulator</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">How It Works</a></li>
              <li><Link href="/dashboard" className="hover:text-[#3b82f6] text-[#3b82f6] transition-colors">Executive Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3: Core Dimensions */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider block">
              5 DIMENSIONS
            </span>
            <ul className="space-y-2 text-[#94a3b8]">
              <li><a href="#dimensions" className="hover:text-white transition-colors">1. Career Trajectory</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">2. Financial Independence</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">3. Skills Architecture</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">4. Health & Stamina</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">5. Psychometric EQ</a></li>
            </ul>
          </div>

          {/* Column 4: Security & Legal */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider block">
              SECURITY & LEGAL
            </span>
            <ul className="space-y-2 text-[#94a3b8] font-mono">
              <li className="flex items-center gap-1.5 text-[#10b981]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit Encrypted</span>
              </li>
              <li>SOC2 Type II Compliant</li>
              <li>Zero Data Selling Guarantee</li>
              <li>GDPR Privacy Protocol</li>
              <li>Version 3.4.0 (Enterprise)</li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#94a3b8]">
          <div>
            &copy; {new Date().getFullYear()} Human Capital AI Platform Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Telemetry</span>
            <span className="hover:text-white cursor-pointer">Security Compliance</span>
            <span className="hover:text-white cursor-pointer">System Status</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
