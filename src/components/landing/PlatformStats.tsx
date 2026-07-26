"use client";

import React from "react";
import { ShieldCheck, Cpu, Database, Activity, Lock, Award, Server } from "lucide-react";

export const PlatformStats: React.FC = () => {
  return (
    <section id="stats" className="py-20 relative bg-[#080d1a] border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>DATA TELEMETRY</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              240+
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Verified metrics analyzed across 5 capital dimensions.
            </p>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>UNIFIED INDEX</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              0–100
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Composite Human Capital Score standard.
            </p>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>AVG VALUATION</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              ₹4.85Cr
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Projected lifetime earning yield per evaluation.
            </p>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>PRECISION</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              99.4%
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Benchmarked against global institutional data cohorts.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PlatformStats;
