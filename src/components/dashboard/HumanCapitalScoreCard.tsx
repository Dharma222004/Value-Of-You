"use client";

import React, { useMemo } from "react";
import { TrendingUp, ShieldCheck, Sparkles } from "lucide-react";
import { calculateHumanCapitalScore } from "@/services/scoringEngine";

export const HumanCapitalScoreCard: React.FC = () => {
  const result = useMemo(() => {
    return calculateHumanCapitalScore();
  }, []);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20">
            <Sparkles className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              HUMAN CAPITAL SCORE INDEX
            </h2>
            <span className="text-xs text-slate-400">Unified 0–100 Multi-Vector Neural Telemetry</span>
          </div>
        </div>

        <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${result.ratingBadgeBg}`}>
          {result.overallRating.toUpperCase()} CLASSIFICATION
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Score Dial */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
          <div className="text-6xl font-black font-mono text-white tracking-tight">
            {result.humanCapitalScore}
          </div>
          <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest mt-1">
            OUT OF 100
          </span>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +4.2 pts this quarter
          </div>
        </div>

        {/* Projected Lifetime Valuation in INR */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-left">
          <div className="text-xs font-mono text-slate-400">ESTIMATED ASSET WORTH (INR)</div>
          <div className="text-3xl font-extrabold text-white font-mono">{result.lifetimeValuationINR}</div>
          <div className="text-xs text-slate-400">Compounding earn trajectory & capital yield</div>
        </div>

        {/* Peer Benchmark */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-left">
          <div className="text-xs font-mono text-slate-400 font-bold uppercase">RISK / STRENGTH PROFILE</div>
          <div className="text-2xl font-extrabold text-indigo-400 font-mono">
            {result.strengthIndex} <span className="text-xs font-normal text-slate-500">/ 100 Index</span>
          </div>
          <div className="text-xs text-slate-400">Risk Index: <strong className="text-rose-400 font-mono">{result.riskIndex}</strong> (Lower is better)</div>
        </div>
      </div>
    </div>
  );
};

export default HumanCapitalScoreCard;
