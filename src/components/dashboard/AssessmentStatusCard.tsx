"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Clock, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getDashboardTelemetry, DashboardTelemetry } from "@/services/dashboardTelemetry";

export const AssessmentStatusCard: React.FC = () => {
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
        <div className="h-6 bg-slate-800 rounded w-1/3"></div>
        <div className="h-40 bg-slate-900 rounded"></div>
      </div>
    );
  }

  const moduleList = [
    telemetry.modules.module1,
    telemetry.modules.module2,
    telemetry.modules.module3,
    telemetry.modules.module4,
    telemetry.modules.module5,
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-[var(--border)] space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <h3 className="text-xs font-bold text-[var(--foreground)] font-mono uppercase tracking-wide">
          ASSESSMENT MODULE STATUS
        </h3>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
          {telemetry.completedCount} / 5 Modules Completed
        </span>
      </div>

      <div className="space-y-2.5">
        {moduleList.map((m) => {
          let statusText = "⚪ Not Started";
          let statusClass = "text-slate-400 bg-slate-900 border-slate-800";
          let Icon = Circle;

          if (m.status === "completed") {
            statusText = `✓ Completed (${m.completionPercentage}%)`;
            statusClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
            Icon = CheckCircle2;
          } else if (m.status === "in-progress") {
            statusText = `🟡 In Progress (${m.completionPercentage}%)`;
            statusClass = "text-amber-400 bg-amber-500/10 border-amber-500/30";
            Icon = Clock;
          }

          return (
            <Link
              key={m.id}
              href={m.route}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/80 border border-[var(--border)] text-xs hover:border-indigo-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 shrink-0 ${m.status === "completed" ? "text-emerald-400" : m.status === "in-progress" ? "text-amber-400" : "text-slate-500"}`} />
                <div>
                  <span className="font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                    Module {m.id}: {m.name}
                  </span>
                  {m.score !== null && (
                    <span className="text-[10px] font-mono text-indigo-400 ml-2 font-bold">
                      Score: {m.score}/100
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full border ${statusClass}`}>
                  {statusText}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentStatusCard;
