"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronLeft,
  Lock,
  Award,
  RotateCcw,
  ArrowRight,
  Layers,
  CheckSquare,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { AssessmentState, AssessmentStage, PersonalityDimension } from "@/types/assessmentEngine";
import {
  PERSONALITY_QUESTION_BANK,
  MINDSET_QUESTION_BANK,
  DECISION_QUESTION_BANK,
  AWARENESS_QUESTION_BANK,
  APTITUDE_QUESTION_BANK,
  COMMUNICATION_QUESTION_BANK,
} from "@/lib/assessmentQuestionBank";
import {
  defaultAssessmentState,
  calculateAssessmentMetrics,
} from "@/lib/assessmentEngine";
import { saveModuleData, loadModuleData, getCurrentUserId, saveHumanValuesTest, saveLearningProgress } from "@/services/moduleDataService";

// Module key for Supabase storage
const MODULE_KEY = "assessments" as const;

export const AssessmentsModule: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<AssessmentState>(defaultAssessmentState);
  const [savingStatus, setSavingStatus] = useState<"saved" | "saving">("saved");

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load Saved Data from Supabase on Mount
  useEffect(() => {
    setMounted(true);
    async function loadFromSupabase() {
      try {
        const uid = await getCurrentUserId();
        setUserId(uid);
        if (!uid) return;
        const parsed = await loadModuleData(uid, MODULE_KEY);
        if (parsed && (parsed as any).answers) {
          setState(parsed as AssessmentState);
        }
      } finally {
        setIsLoaded(true);
      }
    }
    loadFromSupabase();
  }, []);

  // Real-Time Metrics Calculation
  const metrics = useMemo(() => calculateAssessmentMetrics(state), [state]);

  // Centralized Helper Function to Save State to Supabase
  const persistState = useCallback(async (newState: AssessmentState) => {
    if (!userId) return;
    setSavingStatus("saving");
    try {
      const computedMetrics = calculateAssessmentMetrics(newState);

      const isPersonalityDone =
        newState.isPersonalityCompleted ||
        PERSONALITY_QUESTION_BANK.every((q) => Boolean(newState.answers[q.id]?.selectedOptionId));
      const isMindsetDone =
        newState.isMindsetCompleted ||
        MINDSET_QUESTION_BANK.every((q) => Boolean(newState.answers[q.id]?.selectedOptionId));
      const isDecisionDone =
        newState.isDecisionCompleted ||
        DECISION_QUESTION_BANK.every((q) => Boolean(newState.answers[q.id]?.selectedOptionId));
      const isAwarenessDone =
        newState.isAwarenessCompleted ||
        AWARENESS_QUESTION_BANK.every((q) => Boolean(newState.answers[q.id]?.selectedOptionId));
      const isAptitudeDone =
        newState.isAptitudeCompleted ||
        APTITUDE_QUESTION_BANK.every((q) => Boolean(newState.answers[q.id]?.selectedOptionId));
      const isCommunicationDone =
        newState.isCommunicationCompleted ||
        COMMUNICATION_QUESTION_BANK.every((q) => Boolean(newState.answers[q.id]?.selectedOptionId));

      const totalAnswered = Object.keys(newState.answers).length;
      const allCompleted =
        (isPersonalityDone &&
          isMindsetDone &&
          isDecisionDone &&
          isAwarenessDone &&
          isAptitudeDone &&
          isCommunicationDone) ||
        totalAnswered >= 130;

      const payload = {
        ...newState,
        isPersonalityCompleted: isPersonalityDone,
        isMindsetCompleted: isMindsetDone,
        isDecisionCompleted: isDecisionDone,
        isAwarenessCompleted: isAwarenessDone,
        isAptitudeCompleted: isAptitudeDone,
        isCommunicationCompleted: isCommunicationDone,
        lastUpdatedTime: new Date().toISOString(),
        isCompleted: allCompleted,
        metrics: computedMetrics,
      };

      const assessmentScore = computedMetrics?.assessmentScore || 0;
      const saveResult = await saveModuleData(userId, MODULE_KEY, payload, allCompleted, assessmentScore);
      if (!saveResult) {
        console.warn("[AssessmentsModule] ⚠️ Save to Supabase FAILED — data was NOT persisted. Check [DB_DEBUG] logs above.");
      }

      // If all completed, also save to human_values_tests table
      if (allCompleted) {
        const level = assessmentScore >= 85 ? "elite" : assessmentScore >= 70 ? "advanced" : assessmentScore >= 50 ? "intermediate" : "beginner";
        await saveHumanValuesTest(userId, assessmentScore, {
          personality: computedMetrics?.traits || {},
          mindset: computedMetrics?.mindset || {},
          decision: computedMetrics?.decision || {},
          awareness: computedMetrics?.awareness || {},
          aptitude: computedMetrics?.aptitude || {},
          communication: computedMetrics?.communication || {},
        }, level);
        await saveLearningProgress(userId, "assessments", 100);
      }

      // Broadcast custom events for live dashboard updates
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("hc_assessment_updated", { detail: payload }));
        window.dispatchEvent(new CustomEvent("hc_telemetry_updated", { detail: payload }));
      }
      setSavingStatus("saved");
    } catch (e) {
      console.error("Failed to persist assessment data:", e);
      setSavingStatus("saved");
    }
  }, [userId]);

  // Debounced Background Autosave Safety Net
  useEffect(() => {
    if (!mounted) return;
    const timeout = setTimeout(() => {
      persistState(state);
    }, 500);
    return () => clearTimeout(timeout);
  }, [state, mounted, persistState]);

  const activeStage = state.activeStage || "personality";
  const activeBank =
    activeStage === "communication"
      ? COMMUNICATION_QUESTION_BANK
      : activeStage === "aptitude"
      ? APTITUDE_QUESTION_BANK
      : activeStage === "awareness"
      ? AWARENESS_QUESTION_BANK
      : activeStage === "decision"
      ? DECISION_QUESTION_BANK
      : activeStage === "mindset"
      ? MINDSET_QUESTION_BANK
      : PERSONALITY_QUESTION_BANK;

  const currentIndex =
    activeStage === "communication"
      ? state.communicationQuestionIndex || 0
      : activeStage === "aptitude"
      ? state.aptitudeQuestionIndex || 0
      : activeStage === "awareness"
      ? state.awarenessQuestionIndex || 0
      : activeStage === "decision"
      ? state.decisionQuestionIndex || 0
      : activeStage === "mindset"
      ? state.mindsetQuestionIndex || 0
      : state.personalityQuestionIndex || 0;

  const currentQ = activeBank[currentIndex] || activeBank[0];
  const isLastQuestion = currentIndex === activeBank.length - 1;

  const isStageCompleted =
    activeStage === "communication"
      ? state.isCommunicationCompleted
      : activeStage === "aptitude"
      ? state.isAptitudeCompleted
      : activeStage === "awareness"
      ? state.isAwarenessCompleted
      : activeStage === "decision"
      ? state.isDecisionCompleted
      : activeStage === "mindset"
      ? state.isMindsetCompleted
      : state.isPersonalityCompleted;

  const allStagesCompleted =
    state.isPersonalityCompleted &&
    state.isMindsetCompleted &&
    state.isDecisionCompleted &&
    state.isAwarenessCompleted &&
    state.isAptitudeCompleted &&
    state.isCommunicationCompleted;

  const currentAnswer = state.answers[currentQ.id];

  const handleSelectOption = (optionId: string) => {
    if (isStageCompleted || allStagesCompleted) return; // Prevent modification after submission
    setState((prev) => {
      const updatedAnswers = {
        ...prev.answers,
        [currentQ.id]: {
          questionId: currentQ.id,
          selectedOptionId: optionId,
          timeSpentSeconds: (prev.answers[currentQ.id]?.timeSpentSeconds || 0) + 3,
        },
      };

      let nextState: AssessmentState;

      if (activeStage === "communication") {
        const isLast = (prev.communicationQuestionIndex || 0) === COMMUNICATION_QUESTION_BANK.length - 1;
        nextState = {
          ...prev,
          answers: updatedAnswers,
          communicationQuestionIndex: isLast ? (prev.communicationQuestionIndex || 0) : (prev.communicationQuestionIndex || 0) + 1,
        };
      } else if (activeStage === "aptitude") {
        const isLast = (prev.aptitudeQuestionIndex || 0) === APTITUDE_QUESTION_BANK.length - 1;
        nextState = {
          ...prev,
          answers: updatedAnswers,
          aptitudeQuestionIndex: isLast ? (prev.aptitudeQuestionIndex || 0) : (prev.aptitudeQuestionIndex || 0) + 1,
        };
      } else if (activeStage === "awareness") {
        const isLast = (prev.awarenessQuestionIndex || 0) === AWARENESS_QUESTION_BANK.length - 1;
        nextState = {
          ...prev,
          answers: updatedAnswers,
          awarenessQuestionIndex: isLast ? (prev.awarenessQuestionIndex || 0) : (prev.awarenessQuestionIndex || 0) + 1,
        };
      } else if (activeStage === "decision") {
        const isLast = (prev.decisionQuestionIndex || 0) === DECISION_QUESTION_BANK.length - 1;
        nextState = {
          ...prev,
          answers: updatedAnswers,
          decisionQuestionIndex: isLast ? (prev.decisionQuestionIndex || 0) : (prev.decisionQuestionIndex || 0) + 1,
        };
      } else if (activeStage === "mindset") {
        const isLast = prev.mindsetQuestionIndex === MINDSET_QUESTION_BANK.length - 1;
        nextState = {
          ...prev,
          answers: updatedAnswers,
          mindsetQuestionIndex: isLast ? prev.mindsetQuestionIndex : prev.mindsetQuestionIndex + 1,
        };
      } else {
        const isLast = prev.personalityQuestionIndex === PERSONALITY_QUESTION_BANK.length - 1;
        nextState = {
          ...prev,
          answers: updatedAnswers,
          personalityQuestionIndex: isLast ? prev.personalityQuestionIndex : prev.personalityQuestionIndex + 1,
        };
      }

      // Synchronous Instant Persist
      persistState(nextState);
      return nextState;
    });
  };

  const handleNext = () => {
    setState((prev) => {
      let nextState = { ...prev };
      if (!isLastQuestion) {
        if (activeStage === "communication") {
          nextState.communicationQuestionIndex = (prev.communicationQuestionIndex || 0) + 1;
        } else if (activeStage === "aptitude") {
          nextState.aptitudeQuestionIndex = (prev.aptitudeQuestionIndex || 0) + 1;
        } else if (activeStage === "awareness") {
          nextState.awarenessQuestionIndex = (prev.awarenessQuestionIndex || 0) + 1;
        } else if (activeStage === "decision") {
          nextState.decisionQuestionIndex = (prev.decisionQuestionIndex || 0) + 1;
        } else if (activeStage === "mindset") {
          nextState.mindsetQuestionIndex = prev.mindsetQuestionIndex + 1;
        } else {
          nextState.personalityQuestionIndex = prev.personalityQuestionIndex + 1;
        }
      } else {
        if (activeStage === "communication") {
          nextState.isCommunicationCompleted = true;
        } else if (activeStage === "aptitude") {
          nextState.isAptitudeCompleted = true;
        } else if (activeStage === "awareness") {
          nextState.isAwarenessCompleted = true;
        } else if (activeStage === "decision") {
          nextState.isDecisionCompleted = true;
        } else if (activeStage === "mindset") {
          nextState.isMindsetCompleted = true;
        } else {
          nextState.isPersonalityCompleted = true;
        }
      }
      persistState(nextState);
      return nextState;
    });
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setState((prev) => {
        let nextState = { ...prev };
        if (activeStage === "communication") {
          nextState.communicationQuestionIndex = (prev.communicationQuestionIndex || 0) - 1;
        } else if (activeStage === "aptitude") {
          nextState.aptitudeQuestionIndex = (prev.aptitudeQuestionIndex || 0) - 1;
        } else if (activeStage === "awareness") {
          nextState.awarenessQuestionIndex = (prev.awarenessQuestionIndex || 0) - 1;
        } else if (activeStage === "decision") {
          nextState.decisionQuestionIndex = (prev.decisionQuestionIndex || 0) - 1;
        } else if (activeStage === "mindset") {
          nextState.mindsetQuestionIndex = prev.mindsetQuestionIndex - 1;
        } else {
          nextState.personalityQuestionIndex = prev.personalityQuestionIndex - 1;
        }
        persistState(nextState);
        return nextState;
      });
    }
  };

  const handleGoToMindset = () => {
    setState((prev) => {
      const nextState = { ...prev, isPersonalityCompleted: true, activeStage: "mindset" as AssessmentStage };
      persistState(nextState);
      return nextState;
    });
  };

  const handleGoToDecision = () => {
    setState((prev) => {
      const nextState = { ...prev, isMindsetCompleted: true, activeStage: "decision" as AssessmentStage };
      persistState(nextState);
      return nextState;
    });
  };

  const handleGoToAwareness = () => {
    setState((prev) => {
      const nextState = { ...prev, isDecisionCompleted: true, activeStage: "awareness" as AssessmentStage };
      persistState(nextState);
      return nextState;
    });
  };

  const handleGoToAptitude = () => {
    setState((prev) => {
      const nextState = { ...prev, isAwarenessCompleted: true, activeStage: "aptitude" as AssessmentStage };
      persistState(nextState);
      return nextState;
    });
  };

  const handleGoToCommunication = () => {
    setState((prev) => {
      const nextState = { ...prev, isAptitudeCompleted: true, activeStage: "communication" as AssessmentStage };
      persistState(nextState);
      return nextState;
    });
  };

  const handleSwitchStage = (stage: AssessmentStage) => {
    setState((prev) => {
      const nextState = { ...prev, activeStage: stage };
      persistState(nextState);
      return nextState;
    });
  };

  const handleRestart = () => {
    const resetState = {
      ...defaultAssessmentState,
      sessionId: `session_${Date.now()}`,
    };
    setState(resetState);
    persistState(resetState);
  };

  if (!mounted) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] max-w-7xl mx-auto space-y-4 animate-pulse">
        <div className="h-8 bg-slate-800 rounded-xl w-1/3"></div>
        <div className="h-4 bg-slate-900 rounded-xl w-1/2"></div>
      </div>
    );
  }

  // Generate SVG Radar Chart Points for Personality
  const dimensionKeys = Object.keys(metrics.dimensionScores) as PersonalityDimension[];
  const numDimensions = dimensionKeys.length;
  const radius = 100;
  const centerX = 120;
  const centerY = 120;

  const radarPoints = dimensionKeys
    .map((key, i) => {
      const score = metrics.dimensionScores[key];
      const angle = (Math.PI * 2 * i) / numDimensions - Math.PI / 2;
      const r = (score / 100) * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  const totalEarnedMarksSum =
    metrics.personalityMarksEarned +
    metrics.mindset.mindsetMarksEarned +
    metrics.decision.decisionMarksEarned +
    metrics.awareness.awarenessMarksEarned +
    metrics.aptitude.aptitudeMarksEarned +
    metrics.communication.communicationMarksEarned;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* --- TOP HEADER LOCKUP --- */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="space-y-2 min-w-0 text-left">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="module-badge bg-purple-500/10 border border-purple-500/20 text-purple-400">
              Module 5 — Human Assessment Engine
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono">
              {savingStatus === "saving" ? (
                <span className="text-amber-500 animate-pulse flex items-center gap-1 font-bold">
                  <Clock className="w-3.5 h-3.5" /> Saving real-time state...
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All progress saved securely
                </span>
              )}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
            {allStagesCompleted
              ? "Human Capital Master Assessment Report"
              : activeStage === "communication"
              ? "Communication & Learning Agility Assessment"
              : activeStage === "aptitude"
              ? "Aptitude Assessment"
              : activeStage === "awareness"
              ? "General Awareness Assessment"
              : activeStage === "decision"
              ? "Decision Making Assessment"
              : activeStage === "mindset"
              ? "Mindset & Growth Assessment"
              : "Behavioral Personality Assessment"}
          </h1>
          <p className="text-xs text-[var(--subtext)] max-w-xl leading-relaxed">
            {allStagesCompleted
              ? "Comprehensive 6-stage psychometric evaluation results calculated out of 100 Marks."
              : activeStage === "communication"
              ? "15 Questions evaluating reading comprehension, grammar & vocabulary, professional writing, business communication, & learning agility."
              : activeStage === "aptitude"
              ? "10 Questions evaluating numerical ability, logical reasoning, pattern recognition, data interpretation, & analytical thinking."
              : activeStage === "awareness"
              ? "15 Objective knowledge questions evaluating economy, banking, finance, AI literacy, & cybersecurity."
              : activeStage === "decision"
              ? "15 Scenario decision questions evaluating financial judgment, risk assessment, ethics, & long-term vision."
              : activeStage === "mindset"
              ? "25 Questions evaluating growth mindset, discipline, resilience, goal orientation, & financial mindset."
              : "50 Behavioral questions evaluating discipline, integrity, leadership, & financial habits."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border-subtle)] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/25">
              <Brain className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono text-[var(--subtext)] uppercase">Psychometric Score</div>
              <div className="text-lg font-bold font-mono text-white">
                {metrics.overallScore} / 100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 6-STAGE PROGRESS BAR & CHIP SELECTOR --- */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-xs font-medium text-[var(--foreground)]">
            {!allStagesCompleted
              ? `Question ${currentIndex + 1} of ${activeBank.length} — Domain: `
              : "All 6 Psychometric Stages — "}
            <strong className="text-purple-400">
              {!allStagesCompleted ? currentQ.domain : "Evaluation Completed"}
            </strong>
          </span>
          <span className="text-xs font-mono font-semibold text-purple-400">
            {!allStagesCompleted
              ? `${Math.round(((currentIndex + 1) / activeBank.length) * 100)}% Complete`
              : "100% Complete"}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: allStagesCompleted
                ? "100%"
                : `${((currentIndex + 1) / activeBank.length) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* 6-Stage Selector Chips (Horizontal Scroll Fade Container) */}
        <div className="scroll-fade-container">
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 no-scrollbar pr-12">
            {[
              { id: "personality", label: "Personality", marks: "25M", isDone: state.isPersonalityCompleted, num: "1" },
              { id: "mindset", label: "Mindset", marks: "20M", isDone: state.isMindsetCompleted, num: "2" },
              { id: "decision", label: "Decision", marks: "15M", isDone: state.isDecisionCompleted, num: "3" },
              { id: "awareness", label: "Awareness", marks: "15M", isDone: state.isAwarenessCompleted, num: "4" },
              { id: "aptitude", label: "Aptitude", marks: "10M", isDone: state.isAptitudeCompleted, num: "5" },
              { id: "communication", label: "Communication", marks: "15M", isDone: state.isCommunicationCompleted, num: "6" },
            ].map((stg) => {
              const isCurrent = activeStage === stg.id;
              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => handleSwitchStage(stg.id as any)}
                  className={`step-chip ${
                    isCurrent
                      ? "step-chip-active"
                      : stg.isDone
                      ? "step-chip-completed"
                      : ""
                  }`}
                >
                  {stg.isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-mono opacity-70">S{stg.num}</span>
                  )}
                  <span>{stg.label} ({stg.marks})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* --- 2-COLUMN MAIN LAYOUT: QUESTION WIZARD (LEFT) & TELEMETRY PANEL (RIGHT) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: QUESTION INTERACTIVE CONTAINER (8 COLS) ================= */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border)] min-h-[540px] flex flex-col justify-between">
          {!isStageCompleted ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-left"
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-sky-400 text-[10px] font-mono font-bold uppercase">
                      {currentQ.domain} • {currentQ.subDomain}
                    </span>
                  </div>
                </div>

                {/* Scenario / Reading Passage */}
                {currentQ.scenarioText && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-[var(--border)] text-xs text-[var(--foreground)] leading-relaxed italic">
                    <strong className="text-purple-400 font-mono not-italic uppercase block mb-1">Passage / Context:</strong>
                    {currentQ.scenarioText}
                  </div>
                )}

                {/* Question Title */}
                <h3 className="text-lg font-bold text-[var(--foreground)] leading-snug">
                  Q{currentIndex + 1}. {currentQ.questionText}
                </h3>

                {/* Render Question Options */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = currentAnswer?.selectedOptionId === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt.id)}
                        className={`w-full p-4 rounded-2xl border text-xs text-left flex justify-between items-center transition-all ${
                          isSelected
                            ? "bg-purple-600/20 border-purple-500 text-white font-bold shadow-md"
                            : "bg-slate-900/60 border border-[var(--border)] text-[var(--subtext)] hover:border-slate-500"
                        }`}
                      >
                        <span className="leading-relaxed">{opt.text}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            /* ================= COMPLETED MASTER REPORT OR STAGE TRANSITIONS ================= */
            <div className="space-y-6 text-left">
              {!allStagesCompleted ? (
                /* INTERMEDIATE STAGE COMPLETION BANNERS (NO SCORE SHOWN) */
                <div className="space-y-6">
                  {activeStage === "personality" && (
                    <div className="p-6 rounded-3xl bg-purple-950/40 border border-purple-500/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-white">Stage 1: Personality Assessment Completed!</h4>
                          <p className="text-xs text-purple-300">
                            Great work! Progress saved. Proceed to Stage 2 to evaluate your Growth & Discipline Mindset.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoToMindset}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-500 hover:from-purple-500 hover:to-sky-400 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-purple-500/25 flex items-center justify-center gap-2 group"
                      >
                        Go to Next Test: Mindset Assessment
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {activeStage === "mindset" && (
                    <div className="p-6 rounded-3xl bg-indigo-950/40 border border-indigo-500/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-white">Stage 2: Mindset Assessment Completed!</h4>
                          <p className="text-xs text-indigo-300">
                            Great work! Progress saved. Proceed to Stage 3 to evaluate your Situational Decision Making.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoToDecision}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 group"
                      >
                        Go to Next Test: Decision Making Assessment
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {activeStage === "decision" && (
                    <div className="p-6 rounded-3xl bg-sky-950/40 border border-sky-500/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/40">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-white">Stage 3: Decision Making Assessment Completed!</h4>
                          <p className="text-xs text-sky-300">
                            Great work! Progress saved. Proceed to Stage 4 to evaluate your General Awareness.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoToAwareness}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-500 hover:from-sky-500 hover:to-purple-400 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 group"
                      >
                        Go to Next Test: General Awareness Assessment
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {activeStage === "awareness" && (
                    <div className="p-6 rounded-3xl bg-amber-950/40 border border-amber-500/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-white">Stage 4: General Awareness Assessment Completed!</h4>
                          <p className="text-xs text-amber-300">
                            Great work! Progress saved. Proceed to Stage 5 to evaluate your Aptitude & Reasoning.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoToAptitude}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-indigo-600 to-purple-500 hover:from-amber-500 hover:to-purple-400 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 group"
                      >
                        Go to Next Test: Aptitude Assessment
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {activeStage === "aptitude" && (
                    <div className="p-6 rounded-3xl bg-rose-950/40 border border-rose-500/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-white">Stage 5: Aptitude Assessment Completed!</h4>
                          <p className="text-xs text-rose-300">
                            Great work! Progress saved. Proceed to Stage 6 (Final Test) to complete your assessment suite.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoToCommunication}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-500 hover:from-rose-500 hover:to-indigo-400 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 group"
                      >
                        Go to Final Test: Communication & Learning Agility Assessment
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}

                  {activeStage === "communication" && !allStagesCompleted && (
                    <div className="p-6 rounded-3xl bg-emerald-950/40 border border-emerald-500/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-white">Stage 6: Communication Assessment Completed!</h4>
                          <p className="text-xs text-emerald-300">
                            Please ensure all 6 sub-tabs have green completion checkmarks to unlock your full master report.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ================= ALL 6 STAGES COMPLETED FINAL MASTER REPORT ================= */
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-purple-950/80 border border-emerald-500/40 shadow-2xl space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shrink-0">
                        <Award className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white">All 6 Assessment Modules Completed!</h3>
                        <p className="text-xs text-emerald-300">
                          Final Human Capital Assessment results compiled and saved across all 130 psychometric questions.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-[10px] font-mono text-[var(--subtext)] block">TOTAL MARKS</span>
                        <span className="text-xl font-black font-mono text-emerald-400">
                          {Math.round(totalEarnedMarksSum * 10) / 10} / 100
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                        <span className="text-[10px] font-mono text-[var(--subtext)] block">MASTER INDEX</span>
                        <span className="text-xl font-black font-mono text-purple-400">
                          {metrics.assessmentScore} / 100
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-mono text-[var(--subtext)] block">QUESTIONS ANSWERED</span>
                        <span className="text-xl font-black font-mono text-sky-400">
                          130 / 130
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stage-by-Stage Final Marks Breakdown */}
                  <div className="p-6 rounded-3xl bg-slate-900 border border-[var(--border)] space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono flex items-center gap-2">
                      <Layers className="w-4 h-4" /> 6-Stage Marks Breakdown (100 Marks Total)
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-[var(--subtext)]">Stage 1: Personality</span>
                        <span className="font-bold text-white">{metrics.personalityMarksEarned} / 25 Marks</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-[var(--subtext)]">Stage 2: Mindset</span>
                        <span className="font-bold text-white">{metrics.mindset.mindsetMarksEarned} / 20 Marks</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-[var(--subtext)]">Stage 3: Decision Making</span>
                        <span className="font-bold text-white">{metrics.decision.decisionMarksEarned} / 15 Marks</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-[var(--subtext)]">Stage 4: General Awareness</span>
                        <span className="font-bold text-white">{metrics.awareness.awarenessMarksEarned} / 15 Marks</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-[var(--subtext)]">Stage 5: Aptitude</span>
                        <span className="font-bold text-white">{metrics.aptitude.aptitudeMarksEarned} / 10 Marks</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                        <span className="text-[var(--subtext)]">Stage 6: Communication</span>
                        <span className="font-bold text-white">{metrics.communication.communicationMarksEarned} / 15 Marks</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[var(--border-subtle)] mt-6">
            {!isStageCompleted ? (
              <>
                <button
                  onClick={handleBack}
                  disabled={currentIndex === 0}
                  className="wizard-nav-btn bg-[var(--surface-1)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  onClick={handleNext}
                  className="wizard-nav-btn bg-purple-600 text-white text-xs shadow-md shadow-purple-500/25"
                >
                  {isLastQuestion ? "Complete & Calculate Stage" : "Next Question"} <ChevronRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Assessment Completed &amp; Locked</span>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PERSISTENT TELEMETRY PANEL (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-4 text-left">
          {/* Telemetry Card */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border)] text-center space-y-4 shadow-xl">
            <span className="text-[10px] font-mono text-[var(--subtext)] uppercase tracking-widest block">
              {allStagesCompleted ? "FINAL COMPOSITE REPORT" : "ASSESSMENT IN PROGRESS"}
            </span>

            {/* Score Display (Hidden until all 6 stages completed) */}
            {allStagesCompleted ? (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-3xl font-black font-mono text-emerald-400">
                  {Math.round(totalEarnedMarksSum * 10) / 10} / 100
                </div>
                <div className="text-[10px] font-mono text-purple-400 mt-1 uppercase">
                  Master Human Capital Score
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-mono text-xs font-bold">
                  <Lock className="w-4 h-4 shrink-0" /> Scores Locked
                </div>
                <p className="text-[11px] text-[var(--subtext)] leading-relaxed">
                  Final scores and 100-mark trait insights will be revealed upon completing all 6 assessment stages.
                </p>
              </div>
            )}

            {/* Personality Radar SVG if all completed */}
            {allStagesCompleted && (
              <div className="flex items-center justify-center pt-2">
                <svg width="220" height="220" viewBox="0 0 240 240" className="overflow-visible">
                  {[0.25, 0.5, 0.75, 1.0].map((level) => (
                    <circle key={level} cx={centerX} cy={centerY} r={radius * level} className="stroke-slate-800" strokeWidth="1" fill="none" />
                  ))}
                  <polygon points={radarPoints} className="fill-purple-500/25 stroke-purple-400" strokeWidth="2.5" />
                </svg>
              </div>
            )}
          </div>

          {/* Assessment Progress & Stage Completion Status */}
          <div className="glass-panel p-5 rounded-3xl border border-[var(--border)] space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
              6 Assessment Modules Status
            </h3>
            <div className="space-y-2 text-[11px] font-mono">
              {[
                { label: "Stage 1: Personality (25M)", isDone: state.isPersonalityCompleted },
                { label: "Stage 2: Mindset (20M)", isDone: state.isMindsetCompleted },
                { label: "Stage 3: Decision (15M)", isDone: state.isDecisionCompleted },
                { label: "Stage 4: Awareness (15M)", isDone: state.isAwarenessCompleted },
                { label: "Stage 5: Aptitude (10M)", isDone: state.isAptitudeCompleted },
                { label: "Stage 6: Communication (15M)", isDone: state.isCommunicationCompleted },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="text-[var(--subtext)]">{item.label}</span>
                  {item.isDone ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono text-[10px]">Pending</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsModule;
