"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ExecutiveAiSummaryCard } from "@/components/dashboard/ExecutiveAiSummaryCard";
import { HumanCapitalScoreCard } from "@/components/dashboard/HumanCapitalScoreCard";
import { ProgressRingCard } from "@/components/dashboard/ProgressRingCard";
import { AssessmentStatusCard } from "@/components/dashboard/AssessmentStatusCard";
import { RecentActivityCard } from "@/components/dashboard/RecentActivityCard";
import { getDashboardTelemetry, DashboardTelemetry } from "@/services/dashboardTelemetry";
import { Briefcase, DollarSign, Award, HeartPulse, Brain, Layers, ArrowRight, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [telemetry, setTelemetry] = useState<DashboardTelemetry>(() => getDashboardTelemetry());

  useEffect(() => {
    setMounted(true);
    setTelemetry(getDashboardTelemetry());
  }, []);

  if (!mounted) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-xl w-1/3"></div>
        <div className="h-4 bg-slate-900 rounded-xl w-1/2"></div>
      </div>
    );
  }

  const moduleItems = [
    { ...telemetry.modules.module1, icon: Briefcase, color: "text-sky-400" },
    { ...telemetry.modules.module2, icon: DollarSign, color: "text-emerald-400" },
    { ...telemetry.modules.module3, icon: Award, color: "text-indigo-400" },
    { ...telemetry.modules.module4, icon: HeartPulse, color: "text-amber-400" },
    { ...telemetry.modules.module5, icon: Brain, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-[var(--border)] backdrop-blur-md text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Welcome back{telemetry.userName !== "User" ? `, ${telemetry.userName}` : ""}
          </h2>
          <p className="text-xs text-[var(--subtext)] mt-1">
            {telemetry.completedCount === 0
              ? "Complete your first module to initialize your Human Capital Neural Telemetry."
              : `Your profile is ${telemetry.overallCompletionPercentage}% optimized across ${telemetry.completedCount} of 5 modules.`}
          </p>
        </div>

        {telemetry.nextRecommendedModule ? (
          <Link
            href={telemetry.nextRecommendedModule.route}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 shrink-0"
          >
            {telemetry.nextRecommendedModule.buttonText} <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> All 5 Modules Active
          </div>
        )}
      </div>

      {/* 3-Layer AI Executive Summary Card */}
      <ExecutiveAiSummaryCard />

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

      {/* Dynamic Module Shells Grid */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-[var(--foreground)] font-mono uppercase tracking-wide">
              MODULE TELEMETRY SHELLS
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[var(--subtext)]">Real-Time Data Streams</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {moduleItems.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.name}
                href={mod.route}
                className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3 hover:border-indigo-500/50 transition-all block group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-900 border border-[var(--border)]">
                    <Icon className={`w-4 h-4 ${mod.color}`} />
                  </div>
                  <span className="text-xs font-mono font-bold text-white">
                    {mod.score !== null ? `${mod.score}/100` : "--/100"}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight group-hover:text-sky-300 transition-colors">
                    Module {mod.id}: {mod.shortName}
                  </div>
                  <div className="text-[10px] text-[var(--subtext)] font-mono mt-1">
                    {mod.status === "completed"
                      ? "✓ Completed"
                      : mod.status === "in-progress"
                      ? `🟡 In Progress (${mod.completionPercentage}%)`
                      : "⚪ Not Started"}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <RecentActivityCard />
    </div>
  );
}
