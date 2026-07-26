"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import { getDashboardTelemetry, DashboardTelemetry } from "@/services/dashboardTelemetry";

export const HumanCapitalScoreCard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<DashboardTelemetry>(() => getDashboardTelemetry());

  useEffect(() => {
    setTelemetry(getDashboardTelemetry());
  }, []);

  if (!telemetry.mounted) {
    return (
      <div className="glass-panel rounded-3xl p-6 border border-[var(--border-color)] space-y-6 animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3"></div>
        <div className="h-24 bg-slate-900 rounded"></div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[var(--border-color)] shadow-2xl relative overflow-hidden space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-main)] font-mono uppercase tracking-wide">
              HUMAN CAPITAL SCORE INDEX
            </h2>
            <span className="text-xs text-[var(--text-muted)]">Unified Multi-Vector Executive Rating</span>
          </div>
        </div>

        {telemetry.isAllCompleted ? (
          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${telemetry.compositeRatingBg}`}>
            {telemetry.compositeRating} CLASSIFICATION
          </span>
        ) : (
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full border bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> ASSESSMENT IN PROGRESS ({telemetry.completedCount}/5 MODULES)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Composite Score Dial Card */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-[var(--border-color)] text-center shadow-inner">
          {telemetry.isAllCompleted && telemetry.compositeHumanCapitalScore !== null ? (
            <>
              <div className="text-6xl font-black font-mono text-[var(--text-main)] tracking-tight">
                {telemetry.compositeHumanCapitalScore}
              </div>
              <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 uppercase tracking-widest mt-1 font-bold">
                OUT OF 100
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
                <TrendingUp className="w-3.5 h-3.5" /> High Human Capital Trajectory
              </div>
            </>
          ) : (
            <>
              <div className="text-4xl font-black font-mono text-slate-400 dark:text-slate-600 tracking-tight">
                -- / 100
              </div>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase tracking-widest mt-1 font-bold">
                EVALUATION INCOMPLETE
              </span>
              <p className="text-[11px] text-[var(--text-muted)] mt-2 max-w-[200px]">
                Complete all 5 required modules to generate index score.
              </p>
            </>
          )}
        </div>

        {/* Financial Net Worth Card */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-[var(--border-color)] space-y-2 text-left flex flex-col justify-between min-h-[140px]">
          <div className="text-xs font-mono text-[var(--text-muted)] uppercase font-bold">NET WORTH ANALYTICS</div>
          {telemetry.financial.isCompleted ? (
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {telemetry.financial.netWorthFormatted}
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                Financial Score: <strong className="text-[var(--text-main)] font-mono">{telemetry.financial.financialScore} / 100</strong>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" /> Financial Health Not Completed
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Complete Module 2 to unlock your net worth & investment analytics.
              </p>
              <Link
                href="/dashboard/financial"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-1"
              >
                Go to Financial Health <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Risk / Strength Profile Card */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-[var(--border-color)] space-y-2 text-left flex flex-col justify-between min-h-[140px]">
          <div className="text-xs font-mono text-[var(--text-muted)] uppercase font-bold">RISK / STRENGTH PROFILE</div>
          {telemetry.isAllCompleted ? (
            <div>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {telemetry.strengthIndex} <span className="text-xs font-normal text-slate-500">/ 100 Index</span>
              </div>
              <div className="text-xs text-[var(--text-muted)] mt-1">
                Risk Index: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{telemetry.riskIndex}</strong> (Optimal range)
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" /> Not Available Yet
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Complete all modules to generate risk profile & growth opportunities.
              </p>
              {telemetry.nextRecommendedModule && (
                <Link
                  href={telemetry.nextRecommendedModule.route}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
                >
                  {telemetry.nextRecommendedModule.buttonText} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HumanCapitalScoreCard;
