"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer,
  Share2,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  Target,
  Zap,
  Lock,
  ArrowRight,
  ShieldAlert,
  Brain,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getSavedAiReport, SavedAiReportPayload } from "@/services/aiPipelineService";
import Link from "next/link";

export const HumanCapitalReportModule: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [report, setReport] = useState<SavedAiReportPayload | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeModuleAccordion, setActiveModuleAccordion] = useState<string | null>("financial");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const saved = getSavedAiReport();
      if (saved) {
        setReport(saved);
      }
    }

    const handleUpdate = (e: any) => {
      if (e.detail) setReport(e.detail);
      else setReport(getSavedAiReport());
    };

    window.addEventListener("hc_ai_report_updated", handleUpdate);
    return () => window.removeEventListener("hc_ai_report_updated", handleUpdate);
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage("Report link copied to clipboard!");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  if (!mounted) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-[var(--border-color)] max-w-7xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-xl w-1/3"></div>
        <div className="h-4 bg-slate-900 rounded-xl w-1/2"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="glass-panel p-12 rounded-3xl border border-[var(--border-color)] max-w-4xl mx-auto text-center space-y-6 my-12">
        <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-500 border border-amber-500/20 inline-block">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2>AI Executive Report Locked</h2>
          <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
            Please run the AI Evaluation Pipeline to analyze all completed modules and generate your persistent Executive Report.
          </p>
        </div>

        <Link
          href="/dashboard/analytics"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-xl shadow-purple-500/20 transition-all"
        >
          Go to AI Scoring Engine <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20 text-left">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO HEADER WITH HUMAN CAPITAL SCORE */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[var(--border-color)] relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border-color)] pb-6">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-mono font-bold uppercase tracking-wider">
              Executive AI Report Dossier
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] mt-2 tracking-tight">
              Human Capital Master Evaluation
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
              Generated on {new Date(report.timestamp).toLocaleDateString()} via {report.aiEngineVersion}
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-lg shadow-purple-500/20 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" /> Share Report
            </button>
          </div>
        </div>

        {/* Score Dial & Classification Hero Lockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-[var(--border-color)] text-center space-y-2">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest block font-bold">HUMAN CAPITAL SCORE</span>
            <div className="text-6xl font-black font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">{report.humanCapitalScore}</div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${report.classificationBadgeBg}`}>
              {report.classification} Rating
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-[var(--border-color)] space-y-3 col-span-2 text-xs font-mono">
            <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">AI EVALUATION DOSSIER SUMMARY</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>Profile Completion: <strong className="text-sky-600 dark:text-sky-400">{report.validationMeta.completionPercentage}% Optimized</strong></div>
              <div>Data Integrity Score: <strong className="text-emerald-600 dark:text-emerald-400">{report.validationMeta.dataIntegrityScore}/100</strong></div>
              <div>Report Version: <strong className="text-[var(--text-main)]">{report.reportVersion}</strong></div>
              <div>Fields Analyzed: <strong className="text-purple-600 dark:text-purple-400">{report.validationMeta.totalFieldsValidated} Inputs</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DOCUMENT-STYLE EXECUTIVE SUMMARY (READABLE WIDTH MAX 750PX) */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[var(--border-color)] space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-main)]">🧠 AI Executive Summary</h2>
            <p className="text-xs text-[var(--text-muted)]">Synthesized cross-module behavioral & financial narrative</p>
          </div>
        </div>

        {/* Readable Width Maximum 750px */}
        <div className="max-w-[750px] mx-auto space-y-5 text-sm sm:text-base text-[var(--text-main)] leading-relaxed font-sans">
          {report.executiveSummaryNarrative.map((para, idx) => (
            <p key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-[var(--border-color)]">
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* 3. 7 CORE INDICES (HORIZONTAL CARDS WITH DETAILS) */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[var(--border-color)] space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--border-color)] pb-4">
          <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-main)]">7 Core Sub-Indices Analysis</h2>
            <p className="text-xs text-[var(--text-muted)]">Scores, analytical reasons, and confidence ratings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(report.subIndices).map((item) => (
            <div key={item.name} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-[var(--border-color)] space-y-2">
              <div className="flex justify-between items-center font-mono">
                <h3 className="font-bold text-[var(--text-main)] text-sm">{item.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] font-bold">
                    {item.confidence}
                  </span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{item.score}/100</span>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.reason}</p>
              <div className="text-xs font-mono text-sky-600 dark:text-sky-400 font-semibold pt-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {item.summary}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. DISCOVERED STRENGTHS & IMPROVEMENT AREAS (COLORED ACCENT BORDERS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths Card */}
        <div className="card-accent-left-success p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-[var(--text-main)]">Top Discovered Strengths</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-[var(--text-main)]">
            {report.topStrengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Areas Card */}
        <div className="card-accent-left-warning p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-[var(--text-main)]">Top Improvement Areas</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-[var(--text-main)]">
            {report.topWeaknesses.map((wk, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">⚠</span>
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. RISK VECTORS ANALYSIS (COLORED LEFT BORDER CARD) */}
      <div className="card-accent-left-risk p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">5-Vector Risk Matrix Analysis</h3>
            <p className="text-xs text-[var(--text-muted)]">Financial, Career, Health, Learning, & Burnout Risks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
          {Object.entries(report.riskVectors).map(([key, value]) => (
            <div key={key} className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-[var(--border-color)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-[var(--text-muted)] font-bold uppercase">{key.replace("Risk", "")}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${value.level === "High" ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40" : value.level === "Medium" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"}`}>
                  {value.level} Risk
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-main)] font-sans leading-snug">{value.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. STRATEGIC RECOMMENDATIONS & 30/90/365 ROADMAP */}
      <div className="card-accent-left-info p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">30 / 90 / 365 Day Strategic Action Plan</h3>
            <p className="text-xs text-[var(--text-muted)]">Prioritized roadmap across Career, Finance, Health & Learning</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-[var(--border-color)] space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold text-[10px] uppercase">
              Immediate Focus
            </span>
            {report.recommendations.immediate.map((rec, i) => (
              <div key={i} className="space-y-1">
                <h4 className="font-bold text-[var(--text-main)] leading-tight">{rec.title}</h4>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-[var(--border-color)] space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-[10px] uppercase">
              30-Day Milestone
            </span>
            {report.recommendations.thirtyDays.map((rec, i) => (
              <div key={i} className="space-y-1">
                <h4 className="font-bold text-[var(--text-main)] leading-tight">{rec.title}</h4>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-[var(--border-color)] space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono font-bold text-[10px] uppercase">
              90-Day Objective
            </span>
            {report.recommendations.ninetyDays.map((rec, i) => (
              <div key={i} className="space-y-1">
                <h4 className="font-bold text-[var(--text-main)] leading-tight">{rec.title}</h4>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-[var(--border-color)] space-y-3">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-[10px] uppercase">
              1-Year Vision
            </span>
            {report.recommendations.oneYear.map((rec, i) => (
              <div key={i} className="space-y-1">
                <h4 className="font-bold text-[var(--text-main)] leading-tight">{rec.title}</h4>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. EXPANDABLE MODULE BREAKDOWN ACCORDIONS */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-color)] space-y-4">
        <h3 className="text-base font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">
          Detailed Module Breakdown Accordions
        </h3>

        <div className="space-y-3">
          {[
            { id: "career", title: "Career & Professional Suggestions", items: report.categorySuggestions.careerSuggestions },
            { id: "financial", title: "Financial & Asset Suggestions", items: report.categorySuggestions.financialSuggestions },
            { id: "learning", title: "Learning & Skill Development Suggestions", items: report.categorySuggestions.learningSuggestions },
          ].map((acc) => {
            const isOpen = activeModuleAccordion === acc.id;
            return (
              <div key={acc.id} className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-[var(--border-color)] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveModuleAccordion(isOpen ? null : acc.id)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-[var(--text-main)] flex justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <span>{acc.title}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-purple-600 dark:text-purple-400" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
                </button>

                {isOpen && (
                  <div className="p-4 border-t border-[var(--border-color)] space-y-2 text-xs text-[var(--text-muted)] font-sans">
                    {acc.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400 font-bold">•</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HumanCapitalReportModule;
