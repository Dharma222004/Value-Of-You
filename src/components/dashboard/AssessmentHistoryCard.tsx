"use client";

import React from "react";
import { History, Award, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { Assessment } from "@/types/database";

interface AssessmentHistoryCardProps {
  history: Assessment[];
}

export const AssessmentHistoryCard: React.FC<AssessmentHistoryCardProps> = ({ history }) => {
  return (
    <div className="rounded-3xl p-6 border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" /> Assessment History
        </h3>
        <span className="text-xs text-slate-400 font-medium">{history.length} Total Attempts</span>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">No assessment attempts recorded yet.</div>
      ) : (
        <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
          {history.map((asm) => (
            <div
              key={asm.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-purple-500/30 transition-all duration-200"
            >
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  Assessment
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-medium">
                    {asm.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(asm.started_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>

              <div className="text-right">
                {asm.status === "COMPLETED" ? (
                  <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Done
                  </div>
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-medium flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" /> {asm.progress}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
