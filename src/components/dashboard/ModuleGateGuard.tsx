"use client";

import React from "react";
import Link from "next/link";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * ModuleGateGuard
 * ===============
 * Wraps a dashboard module page. If the module is locked (prerequisite not completed),
 * renders a friendly "locked" screen instead of the module content.
 *
 * Usage:
 *   <ModuleGateGuard moduleKey="financial" requiredModule="master_profile" requiredLabel="Profile">
 *     <FinancialModule />
 *   </ModuleGateGuard>
 */

interface ModuleGateGuardProps {
  /** The key of the module this page represents */
  moduleKey: "financial" | "skills" | "health" | "assessments" | "report";
  /** The key of the module that must be completed first */
  requiredModule: "master_profile" | "financial" | "skills" | "health" | "assessments";
  /** Human-readable label of the required module */
  requiredLabel: string;
  /** Route to the required module */
  requiredRoute: string;
  /** The actual module content to show when unlocked */
  children: React.ReactNode;
}

const MODULE_ORDER = [
  { key: "master_profile", label: "Profile", route: "/dashboard/career" },
  { key: "financial",      label: "Financial Health", route: "/dashboard/financial" },
  { key: "skills",         label: "Skills Capital", route: "/dashboard/skills" },
  { key: "health",         label: "Health Capital", route: "/dashboard/health" },
  { key: "assessments",    label: "Human Assessment", route: "/dashboard/assessments" },
  { key: "report",         label: "AI Analysis Report", route: "/dashboard/report" },
];

export function ModuleGateGuard({
  moduleKey,
  requiredModule,
  requiredLabel,
  requiredRoute,
  children,
}: ModuleGateGuardProps) {
  const { progress, loading } = useModuleProgress();

  // While progress is loading, render nothing (avoids flicker)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine if this module is unlocked
  const isUnlocked = (() => {
    switch (moduleKey) {
      case "financial":  return progress.financialUnlocked;
      case "skills":     return progress.skillsUnlocked;
      case "health":     return progress.healthUnlocked;
      case "assessments":return progress.assessmentsUnlocked;
      case "report":     return progress.executiveReportUnlocked;
      default:           return true;
    }
  })();

  if (isUnlocked) {
    return <>{children}</>;
  }

  // Calculate how many modules are done
  const completedCount = progress.completedCount;
  const currentIndex = MODULE_ORDER.findIndex((m) => m.key === moduleKey);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] px-4 text-center">
      {/* Lock Icon */}
      <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-xl">
        <Lock className="w-9 h-9 text-slate-400" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-2">Module Locked</h1>
      <p className="text-slate-400 text-sm mb-8 max-w-md leading-relaxed">
        To access <span className="text-white font-semibold">{MODULE_ORDER.find(m => m.key === moduleKey)?.label}</span>,
        you must first complete{" "}
        <span className="text-indigo-400 font-semibold">{requiredLabel}</span>.
        {" "}Each module builds on the data from the previous one to ensure your AI evaluation is accurate and complete.
      </p>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-10 flex-wrap justify-center">
        {MODULE_ORDER.slice(0, currentIndex + 1).map((step, idx) => {
          const isStepCompleted = (() => {
            switch (step.key) {
              case "master_profile": return progress.profileCompleted;
              case "financial":      return progress.financialCompleted;
              case "skills":         return progress.skillsCompleted;
              case "health":         return progress.healthCompleted;
              case "assessments":    return progress.assessmentsCompleted;
              default:               return false;
            }
          })();
          const isCurrentStep = step.key === moduleKey;

          return (
            <React.Fragment key={step.key}>
              {idx > 0 && (
                <div className={`w-8 h-[2px] rounded-full ${isStepCompleted || idx <= completedCount ? "bg-indigo-500" : "bg-slate-700"}`} />
              )}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                isCurrentStep
                  ? "bg-slate-800 border-slate-600 text-slate-300"
                  : isStepCompleted
                  ? "bg-emerald-900/30 border-emerald-500/40 text-emerald-400"
                  : "bg-slate-900 border-slate-700 text-slate-500"
              }`}>
                {isStepCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                ) : isCurrentStep ? (
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-current shrink-0" />
                )}
                {step.label}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* CTA */}
      <Link
        href={requiredRoute}
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
      >
        Go to {requiredLabel}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
