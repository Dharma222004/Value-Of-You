"use client";

import React, { useState } from "react";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { Bug, ChevronUp, ChevronDown, Check, X, RefreshCw } from "lucide-react";

export const DebugProgressPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const { progress, loading, refreshProgress } = useModuleProgress();

  if (process.env.NODE_ENV === "production" || !process.env.NEXT_PUBLIC_ENABLE_DEBUG) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 font-mono text-xs">
      <div className="bg-slate-950/95 border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md max-w-sm text-slate-200">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-4 py-2.5 bg-indigo-950/40 hover:bg-indigo-900/50 flex items-center justify-between gap-3 text-indigo-300 font-bold border-b border-indigo-500/20"
        >
          <div className="flex items-center gap-2">
            <Bug className="w-4 h-4 text-emerald-400" />
            <span>PROGRESS ENGINE DEBUG</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
              {progress.completedCount}/5 COMPLETED
            </span>
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </button>

        {expanded && (
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">Engine Loading:</span>
              <span className={loading ? "text-amber-400" : "text-emerald-400"}>
                {loading ? "FETCHING..." : "SYNCED"}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Platform Journey:</span>
                <span className="font-bold text-white">{progress.platformJourney}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Human Value Score:</span>
                <span className="font-bold text-emerald-400">{progress.overallScore} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">AI Report Ready:</span>
                <span className={progress.aiReportReady ? "text-emerald-400 font-bold" : "text-slate-500"}>
                  {progress.aiReportReady ? "YES" : "NO"}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-2 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                MODULE COMPLETION MAP
              </span>
              {Object.entries(progress.modules).map(([key, mod]) => (
                <div key={key} className="flex items-center justify-between py-0.5">
                  <span className="text-slate-300 truncate max-w-[150px]">{mod.shortLabel}:</span>
                  <div className="flex items-center gap-1.5">
                    {mod.completed ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Check className="w-3 h-3" /> Done
                      </span>
                    ) : mod.inProgress ? (
                      <span className="text-amber-400 font-bold">In Progress</span>
                    ) : (
                      <span className="text-slate-600">Not Started</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => refreshProgress()}
              className="w-full py-1.5 mt-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-all text-[11px]"
            >
              <RefreshCw className="w-3 h-3" /> Refresh Progress State
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
