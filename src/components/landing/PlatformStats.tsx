"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, Database, Activity, Award } from "lucide-react";

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { ref, value };
}

function StatItem({
  Icon, color, label, desc, delay,
  staticDisplay, target, prefix, suffix, divide,
}: {
  Icon: React.FC<{ className?: string }>;
  color: string;
  label: string;
  desc: string;
  delay: number;
  staticDisplay?: string;
  target?: number;
  prefix?: string;
  suffix?: string;
  divide?: number;
}) {
  const { ref, value } = useCountUp(target ?? 0);

  const display = staticDisplay
    ? staticDisplay
    : `${prefix ?? ""}${divide ? (value / divide).toFixed(1) : value}${suffix ?? ""}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-2 text-center md:text-left"
    >
      <div className="flex items-center justify-center md:justify-start gap-2 font-mono text-xs font-semibold uppercase tracking-wider" style={{ color }}>
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">
        {display}
      </div>
      <p className="text-xs text-[#e2e8f0] font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export const PlatformStats: React.FC = () => {
  return (
    <section
      id="stats"
      className="py-24 sm:py-28 relative border-y border-[#00D4FF]/25"
      style={{
        background: "linear-gradient(180deg, #081224 0%, #0C1830 50%, #101C36 100%)",
        boxShadow: "0 0 50px rgba(0, 212, 255, 0.15)",
      }}
    >
      <div className="grid-container relative z-10">
        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D4FF]" />
          </span>
          <span className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-widest bg-[#2563EB]/20 px-3 py-1 rounded-full border border-[#00D4FF]/40 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
            Live Platform Telemetry Metrics
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          <StatItem Icon={Database} color="#4F7CFF" label="DATA TELEMETRY" delay={0}
            target={240} suffix="+"
            desc="Verified variables audited across 5 capital dimensions." />

          <StatItem Icon={Award} color="#34d399" label="UNIFIED INDEX" delay={0.1}
            staticDisplay="0–100"
            desc="Composite Human Capital Score standard." />

          <StatItem Icon={Activity} color="#00D4FF" label="AVG GROWTH GAIN" delay={0.2}
            target={184} prefix="+" suffix=" pts" divide={10}
            desc="Average score improvement measured across active learner cohorts." />

          <StatItem Icon={ShieldCheck} color="#fbbf24" label="PRECISION" delay={0.3}
            target={994} suffix="%" divide={10}
            desc="Benchmarked against global institutional cohort data." />

        </div>
      </div>
    </section>
  );
};

export default PlatformStats;


