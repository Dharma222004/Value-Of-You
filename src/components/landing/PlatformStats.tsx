"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Database, Activity, Award } from "lucide-react";

export const PlatformStats: React.FC = () => {
  return (
    <section id="stats" className="py-24 sm:py-28 relative bg-[#090d1a] border-y border-white/[0.06]">
      <div className="grid-container relative z-10">
        
        {/* Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-2 text-center md:text-left"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2 text-center md:text-left"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2 text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#06b6d4] font-mono text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>AVG GROWTH GAIN</span>
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              +18.4 pts
            </div>
            <p className="text-xs text-[#94a3b8] font-medium">
              Average score improvement measured across active learner cohorts.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-2 text-center md:text-left"
          >
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
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default PlatformStats;

