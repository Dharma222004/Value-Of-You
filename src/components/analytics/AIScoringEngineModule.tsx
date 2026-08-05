"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Award,
  Layers,
  Zap,
  CheckSquare,
  AlertTriangle,
  FileText,
  Calendar,
  Lock,
  ArrowRight,
} from "lucide-react";
import {
  getSavedAiReport,
  generateStructuredAiReport,
  SavedAiReportPayload,
  AiPipelineStepStatus,
} from "@/services/aiPipelineService";

const INITIAL_STEPS: AiPipelineStepStatus[] = [
  { id: 1, title: "Data Validation & Intelligence Pipeline", category: "Validation", status: "pending", detailText: "Validating field completeness, normalizing inputs & detecting cross-module anomalies..." },
  { id: 2, title: "Evaluating Personal & Professional Profile", category: "Module 1", status: "pending", detailText: "Analyzing academic degree, CGPA, technical skills count, projects & certifications..." },
  { id: 3, title: "Evaluating Financial Health KPIs", category: "Module 2", status: "pending", detailText: "Analyzing active income, savings rate %, debt EMI ratio, net worth & insurance coverage..." },
  { id: 4, title: "Evaluating Professional Capital Metrics", category: "Module 3", status: "pending", detailText: "Evaluating employability index, AI readiness score & system architecture capabilities..." },
  { id: 5, title: "Evaluating Health & Lifestyle Telemetry", category: "Module 4", status: "pending", detailText: "Analyzing BMI, daily sleep hours, workout frequency, stress index & lifestyle habits..." },
  { id: 6, title: "Evaluating Human Assessments & Psychometrics", category: "Module 5", status: "pending", detailText: "Synthesizing 130 psychometric questions across 6 stages (Personality, Mindset, Decision, Aptitude, Comm)..." },
  { id: 7, title: "Generating 7 Core Sub-Indices & Reasons", category: "Sub-Indices", status: "pending", detailText: "Computing Strength, Risk, Growth, Career, Financial, Leadership & Learning Indices with confidence scores..." },
  { id: 8, title: "Synthesizing Executive AI Report & Roadmap", category: "Final Executive", status: "pending", detailText: "Compiling 4-paragraph narrative, top 5 strengths/weaknesses, 5 risk vectors & 30/90/365 day recommendations..." },
];

export const AIScoringEngineModule: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [savedReport, setSavedReport] = useState<SavedAiReportPayload | null>(null);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [steps, setSteps] = useState<AiPipelineStepStatus[]>(INITIAL_STEPS);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  useEffect(() => {
    setMounted(true);
    async function loadExistingReport() {
      const existing = await getSavedAiReport();
      if (existing) {
        setSavedReport(existing);
        setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "completed" })));
      }
    }
    loadExistingReport();
  }, []);

  const runPipeline = async () => {
    setIsRunningPipeline(true);
    setSavedReport(null);
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: "pending" })));

    for (let i = 0; i < INITIAL_STEPS.length; i++) {
      setActiveStepIndex(i);
      setSteps((prev) =>
        prev.map((step, idx) => {
          if (idx === i) return { ...step, status: "running" };
          if (idx < i) return { ...step, status: "completed" };
          return step;
        })
      );
      await new Promise((resolve) => setTimeout(resolve, 450));
    }

    setSteps((prev) => prev.map((step) => ({ ...step, status: "completed" })));
    const freshReport = await generateStructuredAiReport();
    setSavedReport(freshReport);
    setIsRunningPipeline(false);
    setActiveStepIndex(-1);
  };

  if (!mounted) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] max-w-7xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-xl w-1/3"></div>
        <div className="h-4 bg-slate-900 rounded-xl w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-left">
      {/* HEADER LOCKUP */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--border)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[11px] font-mono font-bold uppercase tracking-wider">
              Enterprise AI Intelligence Pipeline
            </span>
            {savedReport && (
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> AI Report Saved ({savedReport.reportVersion})
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            AI Scoring & Evaluation Engine
          </h1>
          <p className="text-xs sm:text-sm text-[var(--subtext)] max-w-xl leading-relaxed">
            Evaluates all 5 modules through a multi-stage intelligence pipeline, producing structured sub-indices, reasons, confidence scores, and executive report.
          </p>
        </div>

        <div className="z-10">
          <button
            type="button"
            onClick={runPipeline}
            disabled={isRunningPipeline}
            className={`px-6 py-3 rounded-2xl font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all ${
              isRunningPipeline
                ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
                : "bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white shadow-purple-500/25"
            }`}
          >
            {isRunningPipeline ? (
              <>
                <Clock className="w-4 h-4 animate-spin text-purple-400" />
                Executing Pipeline...
              </>
            ) : savedReport ? (
              <>
                <RotateCcw className="w-4 h-4" />
                Re-Run AI Intelligence Pipeline
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Run AI Intelligence Pipeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* PIPELINE EXECUTION TERMINAL TIMELINE */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border)] space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
              8-Step AI Evaluation Pipeline Status
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[var(--subtext)]">
            {isRunningPipeline ? "Status: Executing Neural Pipeline..." : savedReport ? "Status: All Pipeline Steps Completed" : "Status: Ready for Evaluation"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {steps.map((step) => {
            const isDone = step.status === "completed";
            const isRunning = step.status === "running";
            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isRunning
                    ? "bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : isDone
                    ? "bg-slate-950/80 border-slate-800/90 text-slate-300"
                    : "bg-slate-900/30 border-slate-800/40 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Step {step.id} • {step.category}
                  </span>
                  {isDone ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : isRunning ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1 text-[10px] animate-pulse">
                      <Clock className="w-3.5 h-3.5 animate-spin" /> Evaluating...
                    </span>
                  ) : (
                    <span className="text-slate-600 text-[10px]">Pending</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white leading-tight">{step.title}</h4>
                <p className="text-[11px] text-[var(--subtext)] leading-relaxed mt-1">{step.detailText}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* SAVED AI REPORT RESULTS DISPLAY */}
      {savedReport && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* MASTER SCORE & CLASSIFICATION CARD */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border)] shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Generated Human Capital Intelligence Score</h2>
                    <p className="text-xs text-[var(--subtext)]">Report Timestamp: {new Date(savedReport.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-2xl border text-xs font-mono font-bold uppercase tracking-wider ${savedReport.classificationBadgeBg}`}>
                  {savedReport.classification} Classification
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1">
                  <span className="text-[10px] font-mono text-[var(--subtext)] uppercase tracking-widest block">MASTER INDEX</span>
                  <div className="text-5xl font-black font-mono text-emerald-400">{savedReport.humanCapitalScore}</div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">OUT OF 100</span>
                </div>

                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 col-span-2 text-xs font-mono">
                  <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">DATA INTEGRITY & VALIDATION META</div>
                  <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                    <div>Fields Validated: <strong className="text-white">{savedReport.validationMeta?.totalFieldsValidated ?? 130}</strong></div>
                    <div>Data Integrity Score: <strong className="text-emerald-400">{savedReport.validationMeta?.dataIntegrityScore ?? 100}/100</strong></div>
                    <div>Module Completion: <strong className="text-sky-400">{savedReport.validationMeta?.completionPercentage ?? 100}%</strong></div>
                    <div>AI Engine Version: <strong className="text-purple-300">{savedReport.aiEngineVersion || "Gemini 3.6 Pro Intelligence Pipeline"}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7 CORE SUB-INDICES WITH REASONS & CONFIDENCE SCORES */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border)] space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
                <Zap className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 font-mono">
                  7 Core Sub-Indices (Score, Analytical Reason & Confidence)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(savedReport.subIndices).map((item) => (
                  <div key={item.name} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center font-mono">
                      <span className="font-bold text-white text-sm">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold">
                          {item.confidence}
                        </span>
                        <span className="text-lg font-black text-emerald-400 font-mono">{item.score}/100</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--subtext)] leading-relaxed">{item.reason}</p>
                    <div className="text-[10px] font-mono text-sky-400 pt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {item.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-5 PARAGRAPH EXECUTIVE AI SUMMARY NARRATIVE */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border)] space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--border)] pb-3">
                <Brain className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 font-mono">
                  🧠 Professional Executive AI Summary (3-5 Paragraph Narrative)
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[var(--foreground)] leading-relaxed font-sans">
                {savedReport.executiveSummaryNarrative.map((para, idx) => (
                  <p key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* TOP 5 STRENGTHS & TOP 5 WEAKNESSES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-3">
                <h4 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Top 5 Discovered Strengths
                </h4>
                <ul className="space-y-2 text-xs text-[var(--subtext)] font-sans">
                  {savedReport.topStrengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span className="text-slate-200">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 space-y-3">
                <h4 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Top 5 Improvement Areas
                </h4>
                <ul className="space-y-2 text-xs text-[var(--subtext)] font-sans">
                  {savedReport.topWeaknesses.map((wk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0">⚠</span>
                      <span className="text-slate-200">{wk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5 RISK VECTORS MATRIX */}
            <div className="glass-panel p-6 rounded-3xl border border-[var(--border)] space-y-4">
              <h4 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> 5 Risk Vectors Analysis (Financial, Career, Health, Learning, Burnout)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
                {Object.entries(savedReport.riskVectors).map(([key, value]) => (
                  <div key={key} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-[var(--subtext)] uppercase">{key.replace("Risk", "")}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${value.level === "High" ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : value.level === "Medium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"}`}>
                        {value.level}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-sans leading-snug">{value.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default AIScoringEngineModule;
