"use client";

import React from "react";
import { ShieldCheck, Database, Activity, Award } from "lucide-react";

export const PlatformStats: React.FC = () => {
  return (
    <section id="stats" className="py-24 relative bg-[#090d1a]">
      <div className="grid-container relative z-10">
        
        {/* Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#3b82f6] font-mono text-xs font-semibold uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>DATA TELEMETRY</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              240+
            </div>
            <p className="text-xs text-[#94a3b8] font-medium">
              Verified variables audited across 5 capital dimensions.
            </p>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#10b981] font-mono text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>UNIFIED INDEX</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              0–100
            </div>
            <p className="text-xs text-[#94a3b8] font-medium">
              Composite Human Capital Score standard.
            </p>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#06b6d4] font-mono text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>AVG VALUATION</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              ₹5.42Cr
            </div>
            <p className="text-xs text-[#94a3b8] font-medium">
              Projected lifetime Net Present Value per evaluation.
            </p>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#f59e0b] font-mono text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>PRECISION</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              99.4%
            </div>
            <p className="text-xs text-[#94a3b8] font-medium">
              Benchmarked against global institutional cohort data.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PlatformStats;
