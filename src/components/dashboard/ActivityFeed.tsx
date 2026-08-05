"use client";

import React from "react";
import { Activity, LogIn, CheckCircle2, PlayCircle, Download, UserCheck, Eye } from "lucide-react";
import { ActivityLog } from "@/types/database";

interface ActivityFeedProps {
  activities: ActivityLog[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "login":
        return <LogIn className="w-4 h-4 text-emerald-400" />;
      case "assessment_started":
        return <PlayCircle className="w-4 h-4 text-indigo-400" />;
      case "assessment_completed":
        return <CheckCircle2 className="w-4 h-4 text-teal-400" />;
      case "report_downloaded":
        return <Download className="w-4 h-4 text-purple-400" />;
      case "profile_updated":
        return <UserCheck className="w-4 h-4 text-amber-400" />;
      case "recommendation_viewed":
        return <Eye className="w-4 h-4 text-blue-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" /> Recent Activities
        </h3>
        <span className="text-xs text-slate-400 font-medium">Live Audit Log</span>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">No activity records logged yet.</div>
      ) : (
        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
          {activities.slice(0, 10).map((act) => (
            <div
              key={act.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/30 transition-all duration-200"
            >
              <div className="p-2 rounded-xl bg-slate-900 border border-white/10 shrink-0">
                {getEventIcon(act.event_type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-200 capitalize truncate">
                  {act.event_type.replace(/_/g, " ")}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {(act.metadata as any)?.page || (act.metadata as any)?.module || "System Event"}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 font-mono text-right shrink-0">
                {new Date(act.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
