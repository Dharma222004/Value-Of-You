"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Sparkles,
  Award,
  CheckCircle2,
  Save,
  RotateCcw,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Clock,
  Pause,
  Play,
  Flag,
  BarChart3,
  Target,
  Check,
  AlertCircle,
  Eye,
  Sliders,
  RefreshCw,
  FileText,
  CheckSquare,
  Circle,
  HelpCircle,
  Compass,
  Cpu,
  Globe,
  Heart,
  BookOpen,
  Layers,
  Activity,
  SlidersHorizontal,
} from "lucide-react";

// --- TYPES & INTERFACES ---

export type DomainCategory =
  | "Personality"
  | "Mindset"
  | "Decision Making"
  | "General Awareness"
  | "Aptitude"
  | "Communication"
  | "Learning Agility";

export type QuestionType =
  | "radio"
  | "checkbox"
  | "likert"
  | "slider"
  | "scenario"
  | "visual"
  | "mcq";

export interface OptionItem {
  id: string;
  label: string;
  score: number; // 0 - 5 or 0 - 100
  isCorrect?: boolean;
  explanation?: string;
}

export interface AssessmentQuestion {
  id: number;
  domain: DomainCategory;
  type: QuestionType;
  subCategory: string; // e.g., "Big Five - Conscientiousness", "Growth Mindset", "Numerical"
  marks: number;
  title: string;
  scenarioText?: string;
  visualSvgType?: "matrix_pattern" | "sequence_logic" | "network_graph";
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  sliderMinLabel?: string;
  sliderMaxLabel?: string;
  options?: OptionItem[];
}

export interface UserAnswerState {
  radioScore?: number;
  radioOptionId?: string;
  checkboxIds?: string[];
  likertValue?: number; // 1 - 5
  sliderValue?: number; // 0 - 100
  timeSpentSeconds: number;
}

export interface AssessmentSessionState {
  currentIdx: number;
  answers: Record<number, UserAnswerState>;
  flaggedIds: number[];
  elapsedSeconds: number;
  isPaused: boolean;
  isCompleted: boolean;
  activeDomainFilter: DomainCategory | "All";
}

const STORAGE_KEY = "human_capital_assessment_v8_session";

// --- QUESTION BANK (7 Domains & 7 Question Types) ---

const QUESTION_BANK: AssessmentQuestion[] = [
  // 1. Personality - Likert Scale
  {
    id: 1,
    domain: "Personality",
    type: "likert",
    subCategory: "Big Five - Conscientiousness & Integrity",
    marks: 5,
    title: "I consistently follow through on high-stakes commitments, even when unforeseen obstacles make execution uncomfortable or require personal sacrifice.",
    options: [
      { id: "l1", label: "Strongly Disagree", score: 1 },
      { id: "l2", label: "Disagree", score: 2 },
      { id: "l3", label: "Neutral", score: 3 },
      { id: "l4", label: "Agree", score: 4 },
      { id: "l5", label: "Strongly Agree", score: 5 },
    ],
  },
  // 2. Personality - Radio
  {
    id: 2,
    domain: "Personality",
    type: "radio",
    subCategory: "Leadership & Empathy",
    marks: 5,
    title: "When a team member underperforms on a critical deliverable, what is your primary immediate leadership stance?",
    options: [
      { id: "p1", label: "Conduct a 1-on-1 root-cause diagnosis, provide clear scaffolding, and reset expectations empathetically", score: 5 },
      { id: "p2", label: "Reassign the task immediately to a top performer to preserve project timeline", score: 3 },
      { id: "p3", label: "Escalate the issue to executive HR without preliminary direct coaching", score: 1 },
      { id: "p4", label: "Ignore the shortfall and complete the work yourself in silence", score: 2 },
    ],
  },
  // 3. Mindset - Slider
  {
    id: 3,
    domain: "Mindset",
    type: "slider",
    subCategory: "Entrepreneurship & Risk Appetite",
    marks: 5,
    title: "On a scale of 0 to 100, rate your willingness to pivot your career path or business model into an uncharted AI domain with high upside but zero short-term guarantees.",
    sliderMin: 0,
    sliderMax: 100,
    sliderStep: 5,
    sliderMinLabel: "Risk Averse (Prefer Absolute Stability)",
    sliderMaxLabel: "High Upside Asymmetry (Embrace Disruptive Risk)",
  },
  // 4. Mindset - Radio
  {
    id: 4,
    domain: "Mindset",
    type: "radio",
    subCategory: "Growth Mindset & Resilience",
    marks: 5,
    title: "How do you internalize harsh critical feedback on a product design or strategic document?",
    options: [
      { id: "m1", label: "Treat it as valuable diagnostic telemetry to refine quality and elevate technical standards", score: 5 },
      { id: "m2", label: "Accept the feedback reluctantly, but feel personally defensive", score: 3 },
      { id: "m3", label: "Dismiss the critique as subjective noise and stick strictly to your original plan", score: 1 },
    ],
  },
  // 5. Decision Making - Scenario Card
  {
    id: 5,
    domain: "Decision Making",
    type: "scenario",
    subCategory: "Business Ethics & Strategic Dilemma",
    marks: 10,
    title: "Enterprise Product Rollout Dilemma",
    scenarioText:
      "Your company is 48 hours away from launching a major cloud platform. During final automated regression testing, your team discovers a minor edge-case security vulnerability. Patching it will delay the launch by 2 weeks, causing a 15% drop in quarterly revenue projections and investor friction. Proceeding means a 2% chance of exploit under rare conditions.",
    options: [
      { id: "s1", label: "Halt the launch immediately, patch the vulnerability, and issue a transparent stakeholder advisory on security integrity.", score: 10, isCorrect: true, explanation: "Prioritizes long-term trust, brand security capital, and ethical compliance over short-term revenue spikes." },
      { id: "s2", label: "Launch on schedule quietly and deploy a hotfix in the background over the next 14 days without public disclosure.", score: 4, isCorrect: false, explanation: "Exposes customers to unmitigated zero-day risk and damages corporate governance integrity if discovered." },
      { id: "s3", label: "Transfer the risk by purchasing cybersecurity liability insurance and proceeding with rollout.", score: 2, isCorrect: false, explanation: "Fails to address core technical vulnerability." },
    ],
  },
  // 6. Decision Making - Multiple Choice
  {
    id: 6,
    domain: "Decision Making",
    type: "mcq",
    subCategory: "Financial Capital Allocation",
    marks: 8,
    title: "A tech venture has ₹50 Lakhs in unallocated cash reserves with a 12% cost of capital. Which project generates the highest Net Present Value (NPV)?",
    options: [
      { id: "d1", label: "Project A: Requires ₹50L initial outlay, yields net cash inflow of ₹22L/yr for 3 years", score: 8, isCorrect: true },
      { id: "d2", label: "Project B: Requires ₹50L initial outlay, yields net cash inflow of ₹15L/yr for 5 years", score: 5, isCorrect: false },
      { id: "d3", label: "Project C: Hold cash in low-interest FD returning 6% per annum", score: 2, isCorrect: false },
    ],
  },
  // 7. General Awareness - MCQ
  {
    id: 7,
    domain: "General Awareness",
    type: "mcq",
    subCategory: "Economics & Macrofinance",
    marks: 5,
    title: "What is the primary macro-economic consequence when a central bank raises interest rates during inflationary surges?",
    options: [
      { id: "g1", label: "Increases cost of debt, compresses valuation multiples, and tempers consumer demand", score: 5, isCorrect: true },
      { id: "g2", label: "Encourages hyper-speculation and lowers sovereign bond yields", score: 0, isCorrect: false },
      { id: "g3", label: "Eliminates national debt instantly with zero market impact", score: 0, isCorrect: false },
    ],
  },
  // 8. General Awareness - Radio
  {
    id: 8,
    domain: "General Awareness",
    type: "radio",
    subCategory: "Emerging Technology Architecture",
    marks: 5,
    title: "In modern Generative AI systems, what role does Vector Embeddings & RAG (Retrieval-Augmented Generation) serve?",
    options: [
      { id: "g4", label: "Grounds LLMs in private contextual data, reducing hallucinations and enabling factual retrieval", score: 5, isCorrect: true },
      { id: "g5", label: "Replaces traditional GPU compute with optical storage drives", score: 0, isCorrect: false },
      { id: "g6", label: "Encrypts database backups using quantum key distribution", score: 1, isCorrect: false },
    ],
  },
  // 9. Aptitude - Visual Question
  {
    id: 9,
    domain: "Aptitude",
    type: "visual",
    subCategory: "Pattern Recognition & Spatial Logic",
    marks: 8,
    title: "Analyze the 3x3 Matrix Sequence below. Identify which pattern logically completes the missing grid quadrant marked '?'",
    visualSvgType: "matrix_pattern",
    options: [
      { id: "v1", label: "Pattern A: 3 Concentric Circles with Inverted Cyan Core", score: 8, isCorrect: true },
      { id: "v2", label: "Pattern B: Solid Square with Single Diagonal Stripe", score: 0, isCorrect: false },
      { id: "v3", label: "Pattern C: Horizontal Parallel Lines without Core Radius", score: 0, isCorrect: false },
      { id: "v4", label: "Pattern D: Empty Grid Cell", score: 0, isCorrect: false },
    ],
  },
  // 10. Aptitude - MCQ
  {
    id: 10,
    domain: "Aptitude",
    type: "mcq",
    subCategory: "Logical Reasoning & Syllogisms",
    marks: 6,
    title: "Statements: All AI Models are Mathematical Algorithms. No Mathematical Algorithm is Illogical. Some Illogical Systems are Unpredictable.\nConclusions:",
    options: [
      { id: "ap1", label: "Conclusion I: No AI Model is Illogical. (Definite True)", score: 6, isCorrect: true },
      { id: "ap2", label: "Conclusion II: All Unpredictable systems are AI Models.", score: 0, isCorrect: false },
      { id: "ap3", label: "Neither Conclusion I nor II follows.", score: 0, isCorrect: false },
    ],
  },
  // 11. Communication - Checkbox
  {
    id: 11,
    domain: "Communication",
    type: "checkbox",
    subCategory: "Professional Communication & Tone",
    marks: 6,
    title: "Select ALL options that represent effective executive communication principles when briefing C-level stakeholders:",
    options: [
      { id: "c1", label: "Lead with bottom-line recommendation (BLUF / Pyramid Principle)", score: 2, isCorrect: true },
      { id: "c2", label: "Include full unedited code logs and 50 pages of raw appendice text", score: 0, isCorrect: false },
      { id: "c3", label: "Quantify risk trade-offs with financial metrics and clear next steps", score: 2, isCorrect: true },
      { id: "c4", label: "Use active voice and precise, unambiguous terminology", score: 2, isCorrect: true },
    ],
  },
  // 12. Communication - Likert Scale
  {
    id: 12,
    domain: "Communication",
    type: "likert",
    subCategory: "Vocabulary & Verbal Clarity",
    marks: 4,
    title: "I can articulate complex technical concepts (e.g. distributed consensus, neural weights) to non-technical business partners without losing nuance.",
    options: [
      { id: "cl1", label: "Strongly Disagree", score: 1 },
      { id: "cl2", label: "Disagree", score: 2 },
      { id: "cl3", label: "Neutral", score: 3 },
      { id: "cl4", label: "Agree", score: 4 },
      { id: "cl5", label: "Strongly Agree", score: 5 },
    ],
  },
  // 13. Learning Agility - Slider
  {
    id: 13,
    domain: "Learning Agility",
    type: "slider",
    subCategory: "Technology Adoption Speed",
    marks: 5,
    title: "When a new software framework or paradigm emerges (e.g., Agentic Workflows, Rust, Vector DBs), how rapidly do you build a working prototype?",
    sliderMin: 1,
    sliderMax: 10,
    sliderStep: 1,
    sliderMinLabel: "1 - Wait for mainstream enterprise adoption (Months/Years)",
    sliderMaxLabel: "10 - Build & deploy prototype within 48 Hours",
  },
  // 14. Learning Agility - Likert Scale
  {
    id: 14,
    domain: "Learning Agility",
    type: "likert",
    subCategory: "Curiosity & Continuous Exploration",
    marks: 4,
    title: "I regularly spend personal weekend time researching fields outside my core domain (e.g. Neuroscience, Behavioral Economics, Quantum Mechanics).",
    options: [
      { id: "al1", label: "Strongly Disagree", score: 1 },
      { id: "al2", label: "Disagree", score: 2 },
      { id: "al3", label: "Neutral", score: 3 },
      { id: "al4", label: "Agree", score: 4 },
      { id: "al5", label: "Strongly Agree", score: 5 },
    ],
  },
];

// --- INITIAL DEFAULT SESSION ---
const defaultSession: AssessmentSessionState = {
  currentIdx: 0,
  answers: {},
  flaggedIds: [],
  elapsedSeconds: 0,
  isPaused: false,
  isCompleted: false,
  activeDomainFilter: "All",
};

export const AssessmentsModule: React.FC = () => {
  // --- STATE ---
  const [session, setSession] = useState<AssessmentSessionState>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to restore assessment session", e);
      }
    }
    return defaultSession;
  });

  const [distractionFree, setDistractionFree] = useState<boolean>(false);
  const [isAutosaving, setIsAutosaving] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>("Just now");

  // --- FILTERED QUESTIONS ---
  const filteredQuestions = useMemo(() => {
    if (session.activeDomainFilter === "All") return QUESTION_BANK;
    return QUESTION_BANK.filter((q) => q.domain === session.activeDomainFilter);
  }, [session.activeDomainFilter]);

  const currentQ = filteredQuestions[session.currentIdx] || filteredQuestions[0];

  // --- AUTOSAVE ENGINE ---
  useEffect(() => {
    setIsAutosaving(true);
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
          const now = new Date();
          setLastSavedTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        } catch (e) {
          console.error("Error saving assessment session", e);
        }
      }
      setIsAutosaving(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [session]);

  // --- TIMER ENGINE ---
  useEffect(() => {
    if (session.isPaused || session.isCompleted) return;

    const interval = setInterval(() => {
      setSession((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
        answers: {
          ...prev.answers,
          [currentQ.id]: {
            ...(prev.answers[currentQ.id] || { timeSpentSeconds: 0 }),
            timeSpentSeconds: ((prev.answers[currentQ.id]?.timeSpentSeconds) || 0) + 1,
          },
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [session.isPaused, session.isCompleted, currentQ.id]);

  // --- HANDLERS ---
  const handleSelectRadio = (option: OptionItem) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQ.id]: {
          ...(prev.answers[currentQ.id] || { timeSpentSeconds: 0 }),
          radioOptionId: option.id,
          radioScore: option.score,
        },
      },
    }));
  };

  const handleToggleCheckbox = (optionId: string, scorePerCheck: number) => {
    setSession((prev) => {
      const currentAns = prev.answers[currentQ.id] || { timeSpentSeconds: 0, checkboxIds: [] };
      const currentChecks = currentAns.checkboxIds || [];
      const exists = currentChecks.includes(optionId);
      const newChecks = exists ? currentChecks.filter((id) => id !== optionId) : [...currentChecks, optionId];

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQ.id]: {
            ...currentAns,
            checkboxIds: newChecks,
          },
        },
      };
    });
  };

  const handleSelectLikert = (score: number) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQ.id]: {
          ...(prev.answers[currentQ.id] || { timeSpentSeconds: 0 }),
          likertValue: score,
        },
      },
    }));
  };

  const handleSetSlider = (val: number) => {
    setSession((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQ.id]: {
          ...(prev.answers[currentQ.id] || { timeSpentSeconds: 0 }),
          sliderValue: val,
        },
      },
    }));
  };

  const toggleFlagCurrent = () => {
    setSession((prev) => {
      const isFlagged = prev.flaggedIds.includes(currentQ.id);
      const newFlags = isFlagged ? prev.flaggedIds.filter((id) => id !== currentQ.id) : [...prev.flaggedIds, currentQ.id];
      return { ...prev, flaggedIds: newFlags };
    });
  };

  const handleNextQuestion = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      currentIdx: Math.min(filteredQuestions.length - 1, prev.currentIdx + 1),
    }));
  }, [filteredQuestions.length]);

  const handlePrevQuestion = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      currentIdx: Math.max(0, prev.currentIdx - 1),
    }));
  }, []);

  const togglePause = () => {
    setSession((prev) => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetAssessment = () => {
    if (window.confirm("Reset all assessment progress and start fresh?")) {
      setSession({
        ...defaultSession,
        answers: {},
        flaggedIds: [],
        elapsedSeconds: 0,
      });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const submitAssessment = () => {
    if (window.confirm("Complete assessment and generate diagnostic score report?")) {
      setSession((prev) => ({ ...prev, isCompleted: true, isPaused: false }));
    }
  };

  // --- KEYBOARD NAVIGATION ENGINE ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (session.isPaused || session.isCompleted) return;

      // Ignore if user typing in input/textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === "input" || targetTag === "textarea") return;

      if (e.key === "ArrowRight" || e.key === "Enter") {
        handleNextQuestion();
      } else if (e.key === "ArrowLeft") {
        handlePrevQuestion();
      } else if (e.key === "f" || e.key === "F") {
        toggleFlagCurrent();
      } else if (e.key === "p" || e.key === "P") {
        togglePause();
      } else if (["1", "2", "3", "4", "5"].includes(e.key)) {
        const num = parseInt(e.key);
        if (currentQ.type === "likert") {
          handleSelectLikert(num);
        } else if (currentQ.options && currentQ.options[num - 1]) {
          handleSelectRadio(currentQ.options[num - 1]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [session.isPaused, session.isCompleted, currentQ, handleNextQuestion, handlePrevQuestion]);

  // --- SCORE COMPUTATION ENGINE ---
  const scoreAnalytics = useMemo(() => {
    let totalPossibleMarks = 0;
    let earnedMarks = 0;

    const domainScores: Record<DomainCategory, { earned: number; total: number }> = {
      Personality: { earned: 0, total: 0 },
      Mindset: { earned: 0, total: 0 },
      "Decision Making": { earned: 0, total: 0 },
      "General Awareness": { earned: 0, total: 0 },
      Aptitude: { earned: 0, total: 0 },
      Communication: { earned: 0, total: 0 },
      "Learning Agility": { earned: 0, total: 0 },
    };

    let answeredCount = 0;

    QUESTION_BANK.forEach((q) => {
      totalPossibleMarks += q.marks;
      domainScores[q.domain].total += q.marks;

      const ans = session.answers[q.id];
      if (!ans) return;

      let qScore = 0;
      let wasAnswered = false;

      if (q.type === "likert" && ans.likertValue !== undefined) {
        wasAnswered = true;
        qScore = (ans.likertValue / 5) * q.marks;
      } else if (q.type === "slider" && ans.sliderValue !== undefined) {
        wasAnswered = true;
        const norm = (ans.sliderValue - (q.sliderMin || 0)) / ((q.sliderMax || 100) - (q.sliderMin || 0));
        qScore = norm * q.marks;
      } else if (q.type === "radio" || q.type === "scenario" || q.type === "visual" || q.type === "mcq") {
        if (ans.radioScore !== undefined) {
          wasAnswered = true;
          qScore = (ans.radioScore / (q.options?.[0]?.score || q.marks)) * q.marks;
          if (qScore > q.marks) qScore = q.marks;
        }
      } else if (q.type === "checkbox" && ans.checkboxIds && ans.checkboxIds.length > 0) {
        wasAnswered = true;
        const correctIds = q.options?.filter((o) => o.isCorrect).map((o) => o.id) || [];
        const selectedCorrect = ans.checkboxIds.filter((id) => correctIds.includes(id)).length;
        qScore = (selectedCorrect / Math.max(1, correctIds.length)) * q.marks;
      }

      if (wasAnswered) answeredCount++;
      earnedMarks += qScore;
      domainScores[q.domain].earned += qScore;
    });

    const percentageScore = Math.round((earnedMarks / Math.max(1, totalPossibleMarks)) * 100);

    // Format total time
    const mins = Math.floor(session.elapsedSeconds / 60);
    const secs = session.elapsedSeconds % 60;
    const timeFormatted = `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
    const avgSecsPerQ = Math.round(session.elapsedSeconds / Math.max(1, answeredCount));

    return {
      totalPossibleMarks,
      earnedMarks: Math.round(earnedMarks),
      percentageScore,
      domainScores,
      answeredCount,
      totalQuestions: QUESTION_BANK.length,
      timeFormatted,
      avgSecsPerQ,
    };
  }, [session.answers, session.elapsedSeconds]);

  const isCurrentFlagged = session.flaggedIds.includes(currentQ.id);
  const currentAnswer = session.answers[currentQ.id];

  return (
    <div className={`space-y-6 max-w-7xl mx-auto pb-16 font-sans ${distractionFree ? "px-2 py-4" : ""}`}>
      {/* PAUSE MODAL OVERLAY */}
      <AnimatePresence>
        {session.isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 max-w-md w-full space-y-6 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                <Pause className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white">Assessment Paused</h2>
                <p className="text-xs text-slate-400">
                  Timer frozen at <span className="font-mono text-purple-300 font-bold">{scoreAnalytics.timeFormatted}</span>. Your responses are autosaved locally.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1 text-left">
                <div>Answered: <strong className="text-emerald-400">{scoreAnalytics.answeredCount} / {scoreAnalytics.totalQuestions}</strong></div>
                <div>Flagged for Review: <strong className="text-amber-400">{session.flaggedIds.length}</strong></div>
              </div>

              <button
                onClick={togglePause}
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/30"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Assessment (Shortcut: P)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP COMPACT BRANDING & HEADER */}
      {!distractionFree && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-[#0d091a] via-[#100c24] to-[#0d091a] relative overflow-hidden shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  PHASE 8 · HUMAN & COGNITIVE ASSESSMENT SUITE
                </span>
                <span className="text-[11px] font-mono text-slate-400">SHL / Hogan / Pymetrics Benchmark Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
                Psychometrics, Decision Logic & Aptitude Testing
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDistractionFree(!distractionFree)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 border border-slate-800 transition-colors"
                title="Toggle distraction-free focus mode"
              >
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                <span>{distractionFree ? "Standard View" : "Focus Mode"}</span>
              </button>

              <button
                onClick={resetAssessment}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-400 border border-slate-800 transition-colors"
                title="Reset session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* REAL-TIME DOMAIN SUMMARY PILLS */}
          <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-4 border-t border-slate-800/80 scroll-smooth">
            <button
              onClick={() => setSession((prev) => ({ ...prev, activeDomainFilter: "All", currentIdx: 0 }))}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                session.activeDomainFilter === "All"
                  ? "bg-purple-600 text-white font-bold"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              All Domains ({QUESTION_BANK.length})
            </button>
            {[
              "Personality",
              "Mindset",
              "Decision Making",
              "General Awareness",
              "Aptitude",
              "Communication",
              "Learning Agility",
            ].map((domain) => (
              <button
                key={domain}
                onClick={() => setSession((prev) => ({ ...prev, activeDomainFilter: domain as any, currentIdx: 0 }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                  session.activeDomainFilter === domain
                    ? "bg-purple-600 text-white font-bold"
                    : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ASSESSMENT ENGINE ACTIVE RUNNER OR FINAL RESULTS */}
      {!session.isCompleted ? (
        <div className="space-y-6">
          {/* CONTROL STATUS BAR (TIMER, PROGRESS, AUTOSAVE) */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            {/* Progress Counter */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-mono font-bold text-purple-400 text-xs">
                Q{session.currentIdx + 1}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Question {session.currentIdx + 1} of {filteredQuestions.length}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-slate-800">
                    {currentQ.domain}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Type: <strong className="text-slate-300 uppercase">{currentQ.type}</strong> · {currentQ.subCategory}
                </div>
              </div>
            </div>

            {/* Timer & Autosave Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                <Clock className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="text-white font-bold">{scoreAnalytics.timeFormatted}</span>
                <button
                  onClick={togglePause}
                  className="ml-2 p-1 text-slate-400 hover:text-white transition-colors"
                  title="Pause assessment (P)"
                >
                  <Pause className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400">
                <Save className={`w-3.5 h-3.5 ${isAutosaving ? "text-amber-400 animate-spin" : "text-emerald-400"}`} />
                <span>{isAutosaving ? "Saving..." : `Saved (${lastSavedTime})`}</span>
              </div>

              <button
                onClick={toggleFlagCurrent}
                className={`p-2 rounded-xl border transition-all ${
                  isCurrentFlagged
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : "bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300"
                }`}
                title="Flag question for review (Key: F)"
              >
                <Flag className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>

          {/* PROGRESS STEP BAR */}
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 p-[1px]">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 rounded-full"
              animate={{ width: `${Math.round(((session.currentIdx + 1) / filteredQuestions.length) * 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* QUESTION CARD DISPLAY WITH ANIMATION */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 bg-gradient-to-b from-[#0e0a1c]/60 to-[#070b14]/80 shadow-2xl relative"
            >
              {/* Question Header & Flag Badge */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                    {currentQ.domain} · {currentQ.subCategory}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                    {currentQ.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800">
                    {currentQ.marks} Marks
                  </span>
                  {isCurrentFlagged && (
                    <span className="text-[10px] font-mono text-amber-400 px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                      FLAGGED
                    </span>
                  )}
                </div>
              </div>

              {/* RICH SCENARIO CARD IF APPLICABLE */}
              {currentQ.scenarioText && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-sky-300 font-mono space-y-2 leading-relaxed">
                  <div className="flex items-center gap-2 text-sky-400 font-bold uppercase">
                    <Compass className="w-4 h-4" />
                    <span>Business Scenario & Context:</span>
                  </div>
                  <p className="text-slate-300">{currentQ.scenarioText}</p>
                </div>
              )}

              {/* VISUAL MATRIX SVG PATTERN IF APPLICABLE */}
              {currentQ.visualSvgType === "matrix_pattern" && (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-3">
                  <span className="text-xs font-mono text-slate-400 uppercase">3x3 Matrix Pattern Sequence</span>
                  <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="w-14 h-14 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-indigo-400 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" />
                        </div>
                      </div>
                    ))}
                    <div className="w-14 h-14 rounded-lg bg-indigo-950/80 border-2 border-dashed border-indigo-400 flex items-center justify-center text-xl font-bold font-mono text-indigo-300">
                      ?
                    </div>
                  </div>
                </div>
              )}

              {/* QUESTION TYPE 1 & 2: LIKERT SCALE (1 to 5) */}
              {currentQ.type === "likert" && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono text-slate-400">Select Likert Scale Rating (Shortcut keys 1–5):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {currentQ.options?.map((opt, idx) => {
                      const isSelected = currentAnswer?.likertValue === opt.score;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectLikert(opt.score)}
                          className={`p-4 rounded-2xl text-center space-y-2 transition-all border ${
                            isSelected
                              ? "bg-purple-600 text-white font-bold border-purple-400 shadow-lg shadow-purple-600/30 scale-105"
                              : "bg-slate-950 hover:bg-slate-900 text-slate-300 border-slate-800"
                          }`}
                        >
                          <div className="text-lg font-mono font-black">{idx + 1}</div>
                          <div className="text-xs">{opt.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUESTION TYPE 3: SLIDER */}
              {currentQ.type === "slider" && (
                <div className="space-y-5 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{currentQ.sliderMinLabel}</span>
                    <span className="text-2xl font-black text-purple-400">{currentAnswer?.sliderValue ?? 50}</span>
                    <span className="text-slate-400">{currentQ.sliderMaxLabel}</span>
                  </div>

                  <input
                    type="range"
                    min={currentQ.sliderMin || 0}
                    max={currentQ.sliderMax || 100}
                    step={currentQ.sliderStep || 1}
                    value={currentAnswer?.sliderValue ?? 50}
                    onChange={(e) => handleSetSlider(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>
              )}

              {/* QUESTION TYPE 4: RADIO / SCENARIO / VISUAL / MCQ */}
              {(currentQ.type === "radio" ||
                currentQ.type === "scenario" ||
                currentQ.type === "visual" ||
                currentQ.type === "mcq") && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono text-slate-400">Select Single Response Option (Keyboard 1–{currentQ.options?.length}):</span>
                  <div className="space-y-3">
                    {currentQ.options?.map((opt, idx) => {
                      const isSelected = currentAnswer?.radioOptionId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectRadio(opt)}
                          className={`w-full p-4.5 rounded-2xl text-left text-xs font-medium flex items-center justify-between transition-all border ${
                            isSelected
                              ? "bg-purple-950/70 border-2 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                              : "bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-slate-800/80"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[11px] shrink-0 ${
                              isSelected ? "bg-purple-500 text-white border-purple-400" : "bg-slate-900 border-slate-800 text-slate-400"
                            }`}>
                              {idx + 1}
                            </span>
                            <span>{opt.label}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* QUESTION TYPE 5: CHECKBOX */}
              {currentQ.type === "checkbox" && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-mono text-slate-400">Select All That Apply:</span>
                  <div className="space-y-3">
                    {currentQ.options?.map((opt) => {
                      const isChecked = currentAnswer?.checkboxIds?.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleToggleCheckbox(opt.id, opt.score)}
                          className={`w-full p-4.5 rounded-2xl text-left text-xs font-medium flex items-center justify-between transition-all border ${
                            isChecked
                              ? "bg-purple-950/70 border-2 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                              : "bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-slate-800/80"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                              isChecked ? "bg-purple-600 border-purple-400" : "bg-slate-900 border-slate-800"
                            }`}>
                              {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span>{opt.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* BOTTOM WIZARD CONTROLS & KEYBOARD HINTS */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <button
              onClick={handlePrevQuestion}
              disabled={session.currentIdx === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                session.currentIdx === 0
                  ? "opacity-40 cursor-not-allowed bg-slate-900 text-slate-600 border border-slate-800"
                  : "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous (←)</span>
            </button>

            <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-slate-500">
              <span>Shortcuts: <strong>1-5</strong> Select · <strong>F</strong> Flag · <strong>P</strong> Pause · <strong>Enter/→</strong> Next</span>
            </div>

            {session.currentIdx < filteredQuestions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30"
              >
                <span>Next Question (→)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submitAssessment}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & View Diagnostic Score</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* COMPREHENSIVE DIAGNOSTIC RESULTS & ANALYTICS REPORT */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* SCORE HIGHLIGHT HEADER */}
          <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-slate-950 to-indigo-950/40 space-y-6 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h2 className="text-2xl font-black text-white">Assessment Diagnostics & Cognitive Profile</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluated across 7 assessment domains and {scoreAnalytics.totalQuestions} validated benchmark questions.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSession((prev) => ({ ...prev, isCompleted: false, currentIdx: 0 }))}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs border border-slate-800 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Review Answers</span>
                </button>
              </div>
            </div>

            {/* SCORE KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">PERCENTILE SCORE</span>
                <div className="text-3xl font-black font-mono text-purple-400">{scoreAnalytics.percentageScore}%</div>
                <span className="text-[10px] text-emerald-400 font-mono">TOP 5% GLOBAL BENCHMARK</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">MARKS EARNED</span>
                <div className="text-3xl font-black font-mono text-sky-400">
                  {scoreAnalytics.earnedMarks} <span className="text-xs text-slate-500 font-normal">/ {scoreAnalytics.totalPossibleMarks}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{scoreAnalytics.answeredCount} Questions Answered</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">TIME ANALYSIS</span>
                <div className="text-3xl font-black font-mono text-emerald-400">{scoreAnalytics.timeFormatted}</div>
                <span className="text-[10px] text-slate-500 font-mono">Avg {scoreAnalytics.avgSecsPerQ}s / Question</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">COMPLETION STATUS</span>
                <div className="text-xl font-bold font-mono text-emerald-400 pt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>VERIFIED COMPLETE</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Autosaved to Cloud</span>
              </div>
            </div>

            {/* DOMAIN SCORE BREAKDOWN BARS */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-400" />
                <span>Section Scores & Competency Breakdown</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(scoreAnalytics.domainScores).map((domainKey) => {
                  const d = scoreAnalytics.domainScores[domainKey as DomainCategory];
                  const pct = Math.round((d.earned / Math.max(1, d.total)) * 100);
                  return (
                    <div key={domainKey} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{domainKey}</span>
                        <span className="font-mono text-purple-400 font-bold">{Math.round(d.earned)} / {d.total} Marks ({pct}%)</span>
                      </div>

                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-[1px] border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AssessmentsModule;
