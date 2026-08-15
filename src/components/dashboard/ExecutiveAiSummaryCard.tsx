"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  Sparkles,
  ShieldAlert,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Calendar,
  Lock,
  ArrowRight,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getSavedAiReport, SavedAiReportPayload } from "@/services/aiPipelineService";

export const ExecutiveAiSummaryCard: React.FC = () => {
  const [report, setReport] = useState<SavedAiReportPayload | null>(null);

  useEffect(() => {
    async function loadReport() {
      const saved = await getSavedAiReport();
      if (saved) setReport(saved);
    }
    loadReport();

    const handleUpdate = async (e: any) => {
      if (e.detail) setReport(e.detail);
      else {
        const saved = await getSavedAiReport();
        setReport(saved);
      }
    };

    window.addEventListener("hc_ai_report_updated", handleUpdate);
    return () => window.removeEventListener("hc_ai_report_updated", handleUpdate);
  }, []);

  if (!report) {
    return (
      <div className="rounded-3xl p-6 sm:p-8 bg-[#090d1a]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl space-y-4 text-left relative overflow-hidden">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              AI Human Capital Evaluation Pending
            </h3>
            <p className="text-xs text-[#94a3b8] mt-0.5 leading-relaxed">
              Complete all five modules to unlock your Enterprise AI Human Capital Evaluation &amp; Executive Report.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/dashboard/analytics"
            className="btn-micro inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 transition-all"
          >
            <span>Run AI Processing Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const subIndexList = Object.values(report.subIndices);

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-[#090d1a]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl space-y-6 text-left relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/25 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono font-semibold uppercase tracking-wider">
                Enterprise AI Engine
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${report.classificationBadgeBg}`}>
                {report.classification}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-heading tracking-tight mt-1">
              AI Executive Report Summary
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#94a3b8] bg-[#050814] px-3.5 py-1.5 rounded-xl border border-white/[0.08]">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>Report Version: {report.reportVersion}</span>
        </div>
      </div>

      {/* AI Narrative Executive Summary Paragraph 1 */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#050814]/80 border border-white/[0.06] text-xs sm:text-sm text-[#cbd5e1] leading-relaxed shadow-inner">
        {typeof report.executiveSummaryNarrative?.[0] === "string" 
          ? report.executiveSummaryNarrative[0].replace(/```json/g, "").replace(/```/g, "").trim()
          : "Enterprise AI evaluation completes comprehensive multi-dimensional telemetry analysis."}
      </div>

      {/* 7 AI Core Sub-Indices Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
            7 Synthesized Core Sub-Indices
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono">
          {subIndexList.map((item) => (
            <div key={item.name} className="p-3.5 rounded-2xl bg-[#050814]/90 border border-white/[0.06] hover:border-purple-500/40 text-center space-y-1.5 transition-all">
              <span className="text-[10px] text-[#94a3b8] block truncate leading-tight font-medium">{item.name}</span>
              <span className="text-xl font-bold text-[#10b981] block">{item.score}</span>
              <span className="text-[9px] text-purple-300 block truncate font-semibold">{item.confidence}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Column Matrix: Strengths, Weaknesses, Risk Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="p-5 rounded-2xl bg-[#050814]/80 border border-emerald-500/30 space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
            <CheckCircle2 className="w-4 h-4" /> Top Discovered Strengths
          </div>
          <ul className="space-y-2 text-xs text-[#cbd5e1]">
            {report.topStrengths.slice(0, 3).map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-5 rounded-2xl bg-[#050814]/80 border border-amber-500/30 space-y-3 shadow-inner">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
            <AlertTriangle className="w-4 h-4" /> Top Improvement Areas
          </div>
          <ul className="space-y-2 text-xs text-[#cbd5e1]">
            {report.topWeaknesses.slice(0, 3).map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5 Risk Vectors */}
        <div className="p-5 rounded-2xl bg-[#050814]/80 border border-rose-500/30 space-y-3 font-mono text-xs shadow-inner">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase">
            <ShieldAlert className="w-4 h-4" /> Risk Vectors Matrix
          </div>
          <div className="space-y-2 pt-1">
            {Object.entries(report.riskVectors).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center text-[11px]">
                <span className="text-[#94a3b8]">{key.replace("Risk", "")} Risk</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${value.level === "High" ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : value.level === "Medium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"}`}>
                  {value.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveAiSummaryCard;

