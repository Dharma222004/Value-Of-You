"use client";

import React from "react";
import { HumanCapitalScoreCard } from "@/components/dashboard/HumanCapitalScoreCard";
import { ProgressRingCard } from "@/components/dashboard/ProgressRingCard";
import { AssessmentStatusCard } from "@/components/dashboard/AssessmentStatusCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { Briefcase, DollarSign, Award, HeartPulse, Brain, ChevronRight, Layers } from "lucide-react";

export default function DashboardPage() {
  const modulePlaceholders = [
    { name: "Module 1: Career Capital", icon: Briefcase, status: "Active Telemetry", score: "84/100", color: "text-sky-400" },
    { name: "Module 2: Financial Health", icon: DollarSign, status: "Active Telemetry", score: "79/100", color: "text-emerald-400" },
    { name: "Module 3: Skills Architecture", icon: Award, status: "Active Telemetry", score: "88/100", color: "text-indigo-400" },
    { name: "Module 4: Health & Lifestyle", icon: HeartPulse, status: "Pending Audit", score: "72/100", color: "text-amber-400" },
    { name: "Module 5: Human Assessments", icon: Brain, status: "Active Telemetry", score: "81/100", color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Welcome back, Alex Vance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Your unified Human Capital Score is running on real-time neural telemetry.
          </p>
        </div>
        <button className="self-start sm:self-auto px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-sky-500/20">
          Run Full Quarterly Audit
        </button>
      </div>

      {/* Main Human Capital Score Display */}
      <HumanCapitalScoreCard />

      {/* Two Column Grid: Progress Ring & Assessment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <ProgressRingCard />
        </div>
        <div className="lg:col-span-7">
          <AssessmentStatusCard />
        </div>
      </div>

      {/* Module Shell Placeholders Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
              MODULE TELEMETRY SHELLS
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Modules 1–5 Shell Placeholders</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {modulePlaceholders.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.name}
                className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <Icon className={`w-4 h-4 ${mod.color}`} />
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{mod.score}</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">{mod.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{mod.status}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <RecentActivityCard />
    </div>
  );
}
