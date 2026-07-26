"use client";

import React from "react";
import { PieChart, Sliders } from "lucide-react";

export const ProgressRingCard: React.FC = () => {
  const dimensions = [
    { label: "Career Capital", score: 84, color: "bg-sky-400" },
    { label: "Financial Health", score: 79, color: "bg-emerald-400" },
    { label: "Skills Architecture", score: 88, color: "bg-indigo-400" },
    { label: "Health & Lifestyle", score: 72, color: "bg-amber-400" },
    { label: "Human Assessments", score: 81, color: "bg-purple-400" },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
            DIMENSIONAL PROGRESS RING
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">5 Vector Distribution</span>
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
              strokeDashoffset={301.59 - (301.59 * 0.81)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black font-mono text-white">81%</span>
            <span className="text-[9px] font-mono text-slate-400 uppercase">OPTIMIZATION</span>
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
              <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.score}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
