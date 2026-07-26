"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ShieldCheck, Cpu, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050811] border-t border-slate-800/80 text-slate-400 py-16 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-600 p-[1px]">
                <div className="w-full h-full bg-[#090d16] rounded-[7px] flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-sky-400" />
                </div>
              </div>
              <span className="font-bold text-base text-white tracking-tight font-mono">
                HUMAN CAPITAL
              </span>
            </div>
            
            <p className="text-slate-300 text-xs max-w-sm leading-relaxed">
              The Executive Intelligence Terminal for Human Capital. Measure, analyze, and optimize your career, financial health, skills, endurance, and psychometric trajectory.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 font-mono text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI Scoring Engine Active</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
              PLATFORM
            </span>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#about" className="hover:text-white transition-colors">Why Human Capital</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">5 Core Dimensions</a></li>
              <li><a href="#visualizer" className="hover:text-white transition-colors">Score Simulator</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">How It Works</a></li>
              <li><Link href="/dashboard" className="hover:text-sky-400 text-sky-400 transition-colors">Executive Dashboard</Link></li>
            </ul>
          </div>

          {/* 5 Core Dimensions */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
              5 DIMENSIONS
            </span>
            <ul className="space-y-2 text-slate-300">
              <li><a href="#dimensions" className="hover:text-white transition-colors">1. Career Trajectory</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">2. Financial Independence</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">3. Skills Architecture</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">4. Health & Endurance</a></li>
              <li><a href="#dimensions" className="hover:text-white transition-colors">5. Psychometric Evaluation</a></li>
            </ul>
          </div>

          {/* Security & Compliance */}
          <div className="space-y-3">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
              SECURITY & LEGAL
            </span>
            <ul className="space-y-2 text-slate-300 font-mono">
              <li className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>256-Bit Encrypted Telemetry</span>
              </li>
              <li>SOC2 Compliance Guidelines</li>
              <li>Zero Data Selling Guarantee</li>
              <li>GDPR Privacy Protections</li>
              <li>System Status: 99.99% Operational</li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Human Capital Platform. Measure. Improve. Grow.
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
