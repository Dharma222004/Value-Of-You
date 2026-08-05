"use client";

import React, { useState, useEffect } from "react";
import { PieChart } from "lucide-react";
import { getDashboardTelemetry, DashboardTelemetry } from "@/services/dashboardTelemetry";

export const ProgressRingCard: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [telemetry, setTelemetry] = useState<DashboardTelemetry | null>(null);

  useEffect(() => {
    setMounted(true);
    const refresh = () => { getDashboardTelemetry().then(setTelemetry); };
    refresh();

    window.addEventListener("hc_assessment_updated", refresh);
    window.addEventListener("hc_telemetry_updated", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      window.removeEventListener("hc_assessment_updated", refresh);
      window.removeEventListener("hc_telemetry_updated", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  if (!mounted || !telemetry) {
    return (
      <div className="glass-panel rounded-3xl p-6 border border-[var(--border-color)] space-y-4 text-left animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/2"></div>
        <div className="h-32 bg-slate-900 rounded-full w-32 mx-auto"></div>
      </div>
    );
  }

  const dimensions = [
    { label: "Personal & Professional Profile", score: telemetry.modules.module1.completionPercentage, color: "bg-sky-400" },
    { label: "Financial Health", score: telemetry.modules.module2.completionPercentage, color: "bg-emerald-400" },
    { label: "Skills & Professional Capital", score: telemetry.modules.module3.completionPercentage, color: "bg-indigo-400" },
    { label: "Health & Lifestyle", score: telemetry.modules.module4.completionPercentage, color: "bg-amber-400" },
    { label: "Human Assessments", score: telemetry.modules.module5.completionPercentage, color: "bg-purple-400" },
  ];

  const overallPct = telemetry.overallCompletionPercentage;

  return (
    <div className="glass-panel rounded-3xl p-6 border border-[var(--border)] space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-[var(--foreground)] font-mono uppercase tracking-wide">
            DIMENSIONAL PROGRESS RING
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[var(--subtext)]">5 Vector Telemetry</span>
      </div>

      {/* Progress Ring Visual */}
      <div className="flex flex-col items-center py-2">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="48" className="stroke-slate-800" strokeWidth="10" fill="transparent" />
            <circle
              cx="60"
              cy="60"
              r="48"
              className="stroke-sky-400"
              strokeWidth="10"
              strokeDasharray={301.59}
              strokeDashoffset={301.59 - (301.59 * overallPct) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black font-mono text-white">{overallPct}%</span>
            <span className="text-[9px] font-mono text-slate-400 uppercase">COMPLETED</span>
          </div>
        </div>
      </div>

      {/* Dimension Bar List */}
      <div className="space-y-2.5 pt-2">
        {dimensions.map((d) => (
          <div key={d.label} className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">{d.label}</span>
              <span className="text-white font-bold">{d.score}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
              <div className={`h-full rounded-full ${d.color} transition-all duration-500`} style={{ width: `${d.score}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressRingCard;
