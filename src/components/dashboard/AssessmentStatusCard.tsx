"use client";

import React from "react";
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";

export const AssessmentStatusCard: React.FC = () => {
  const modules = [
    { title: "Module 1: Career Capital Audit", status: "Completed", date: "Just now", color: "text-emerald-400" },
    { title: "Module 2: Financial Runway Sync", status: "Completed", date: "2 days ago", color: "text-emerald-400" },
    { title: "Module 3: Skills Architecture", status: "Completed", date: "1 week ago", color: "text-emerald-400" },
    { title: "Module 4: Health & Biometrics", status: "Pending Review", date: "Due in 3 days", color: "text-amber-400" },
    { title: "Module 5: Human Psychometrics", status: "Completed", date: "2 weeks ago", color: "text-emerald-400" },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
          ASSESSMENT MODULE STATUS
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          4 / 5 Complete
        </span>
      </div>

      <div className="space-y-3">
        {modules.map((m) => (
          <div
            key={m.title}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
          >
            <div className="flex items-center gap-2.5">
              {m.status === "Completed" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="font-semibold text-slate-200">{m.title}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`font-mono font-bold text-[11px] ${m.color}`}>{m.status}</span>
              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">{m.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
