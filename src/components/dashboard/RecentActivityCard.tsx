"use client";

import React, { useState, useEffect } from "react";
import { Activity, ArrowUpRight, Cpu, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { getDashboardTelemetry, DashboardTelemetry } from "@/services/dashboardTelemetry";

export const RecentActivityCard: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [telemetry, setTelemetry] = useState<DashboardTelemetry | null>(null);

  useEffect(() => {
    setMounted(true);
    getDashboardTelemetry().then(setTelemetry);
  }, []);

  if (!mounted || !telemetry) {
    return (
      <div className="glass-panel rounded-3xl p-6 border border-[var(--border-color)] space-y-4 text-left animate-pulse">
        <div className="h-6 bg-slate-800 rounded w-1/3"></div>
        <div className="h-28 bg-slate-900 rounded"></div>
      </div>
    );
  }

  const activities: Array<{ title: string; desc: string; time: string; icon: any; iconColor: string }> = [];

  if (telemetry.modules.module1.status === "completed") {
    activities.push({
      title: "Master Profile Verified",
      desc: "Personal & Professional baseline active in Neural Cloud.",
      time: "Recent",
      icon: ShieldCheck,
      iconColor: "text-sky-400",
    });
  }

  if (telemetry.modules.module2.status === "completed") {
    activities.push({
      title: "Financial Runway Telemetry Synced",
      desc: `Net Worth calculated at ${telemetry.financial.netWorthFormatted}. Score: ${telemetry.financial.financialScore}/100.`,
      time: "Recent",
      icon: ArrowUpRight,
      iconColor: "text-emerald-400",
    });
  }

  if (telemetry.modules.module3.status === "completed") {
    activities.push({
      title: "Professional Capital Audit Completed",
      desc: `Professional Score: ${telemetry.professional.professionalCapitalScore}/100. AI Readiness: ${telemetry.professional.aiReadinessScore}%.`,
      time: "Recent",
      icon: Cpu,
      iconColor: "text-indigo-400",
    });
  }

  if (telemetry.modules.module4.status === "completed") {
    activities.push({
      title: "Health & Lifestyle Telemetry Synced",
      desc: `Biometrics & lifestyle score recorded at ${telemetry.health.healthScore}/100.`,
      time: "Recent",
      icon: Zap,
      iconColor: "text-amber-400",
    });
  }

  if (telemetry.modules.module5.status === "completed") {
    activities.push({
      title: "Psychometric Assessment Audit Complete",
      desc: `Cognitive mindset score calculated at ${telemetry.assessment.assessmentScore}/100.`,
      time: "Recent",
      icon: Sparkles,
      iconColor: "text-purple-400",
    });
  }

  // Onboarding fallback if no modules completed
  if (activities.length === 0) {
    activities.push(
      {
        title: "Neural Telemetry Session Initialized",
        desc: "Ready to log your first Human Capital vector. Complete Module 1 to begin.",
        time: "Just now",
        icon: Sparkles,
        iconColor: "text-sky-400",
      },
      {
        title: "Zero-Knowledge Encryption Active",
        desc: "All module responses are stored strictly in client local storage.",
        time: "System",
        icon: ShieldCheck,
        iconColor: "text-emerald-400",
      }
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-6 border border-[var(--border)] space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-[var(--foreground)] font-mono uppercase tracking-wide">
            RECENT TELEMETRY ACTIVITY
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[var(--subtext)]">Live Audit Feed</span>
      </div>

      <div className="space-y-2.5">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.title}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-950/80 border border-[var(--border)] text-xs"
            >
              <div className={`p-2 rounded-xl bg-slate-900 border border-[var(--border)] ${act.iconColor} shrink-0 mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{act.title}</span>
                  <span className="text-[10px] font-mono text-[var(--subtext)]">{act.time}</span>
                </div>
                <p className="text-[11px] text-[var(--subtext)] leading-relaxed">{act.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityCard;
