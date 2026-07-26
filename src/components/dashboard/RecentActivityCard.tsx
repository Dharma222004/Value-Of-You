"use client";

import React from "react";
import { Activity, ArrowUpRight, Cpu, ShieldCheck, Zap } from "lucide-react";

export const RecentActivityCard: React.FC = () => {
  const activities = [
    {
      title: "Skills Scarcity Index Updated",
      desc: "Added Generative AI Agent Architecture to skill stack.",
      time: "2 hours ago",
      icon: Cpu,
      iconColor: "text-sky-400",
    },
    {
      title: "Financial Runway Recalculated",
      desc: "Liquid runway extended from 18 to 24 months.",
      time: "Yesterday",
      icon: ArrowUpRight,
      iconColor: "text-emerald-400",
    },
    {
      title: "Biometric HRV Telemetry Synced",
      desc: "Recovery index score increased +5.2%.",
      time: "3 days ago",
      icon: Zap,
      iconColor: "text-amber-400",
    },
    {
      title: "Security Telemetry Verification",
      desc: "SOC-2 Client-side Zero Knowledge key rotated.",
      time: "1 week ago",
      icon: ShieldCheck,
      iconColor: "text-purple-400",
    },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
            RECENT TELEMETRY ACTIVITY
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Live Audit Feed</span>
      </div>

      <div className="space-y-3">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.title}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
            >
              <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${act.iconColor} shrink-0 mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{act.title}</span>
                  <span className="text-[10px] font-mono text-slate-500">{act.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{act.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
