"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Zap,
  RotateCcw
} from "lucide-react";

interface QuestionStep {
  id: number;
  section: string;
  question: string;
  subtitle: string;
  options: { label: string; impact: string; score: number }[];
}

const wizardSteps: QuestionStep[] = [
  {
    id: 1,
    section: "Dimension 1: Career Mobility & Executive Authority",
    question: "What is your primary career leverage point?",
    subtitle: "Evaluates market scarcity, title velocity, and executive mobility.",
    options: [
      { label: "Executive / Founder with equity leverage", impact: "+22 pts", score: 95 },
      { label: "Senior Tech / Strategy Leader at high-growth firm", impact: "+18 pts", score: 85 },
      { label: "Mid-level Manager seeking career acceleration", impact: "+12 pts", score: 72 },
      { label: "Specialist exploring optimal pivot", impact: "+8 pts", score: 60 },
    ],
  },
  {
    id: 2,
    section: "Dimension 2: Financial Independence & Liquid Shield",
    question: "How many months of liquid unearned runway do you hold?",
    subtitle: "Determines risk tolerance threshold and capital independence.",
    options: [
      { label: "24+ Months (High Capital Shield)", impact: "+25 pts", score: 96 },
      { label: "12 - 24 Months (Strong Resilience)", impact: "+19 pts", score: 84 },
      { label: "6 - 12 Months (Moderate Safety)", impact: "+12 pts", score: 70 },
      { label: "Less than 6 Months (Active Capital Drag)", impact: "+4 pts", score: 50 },
    ],
  },
  {
    id: 3,
    section: "Dimension 3: Technical Skills & AI Tooling Architecture",
    question: "How integrated are generative AI & automation tools into your daily workflow?",
    subtitle: "Measures 10x output multiplier and technological disruption defense.",
    options: [
      { label: "Expert: Custom agents & automated pipeline workflows", impact: "+20 pts", score: 98 },
      { label: "Advanced: Daily power user for code, writing, & strategy", impact: "+15 pts", score: 82 },
      { label: "Intermediate: Occasional prompts for basic tasks", impact: "+8 pts", score: 65 },
      { label: "Novice: Minimal integration into routine", impact: "+2 pts", score: 45 },
    ],
  },
];

export const AssessmentTeaser: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSaved, setIsSaved] = useState(true);

  const step = wizardSteps[currentStepIndex];

  const handleSelectOption = (score: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [step.id]: score }));
    setIsSaved(false);
    setTimeout(() => {
      setIsSaved(true);
    }, 400);
  };

  const nextStep = () => {
    if (currentStepIndex < wizardSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const resetWizard = () => {
    setCurrentStepIndex(0);
    setSelectedAnswers({});
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1") handleSelectOption(step.options[0].score);
      else if (e.key === "2") handleSelectOption(step.options[1].score);
      else if (e.key === "3") handleSelectOption(step.options[2].score);
      else if (e.key === "4") handleSelectOption(step.options[3].score);
      else if (e.key === "ArrowRight") nextStep();
      else if (e.key === "ArrowLeft") prevStep();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStepIndex, step]);

  const progressPercent = Math.round(((currentStepIndex + 1) / wizardSteps.length) * 100);

  return (
    <section
      id="wizard"
      className="py-24 sm:py-32 relative text-white"
      style={{
        background: "linear-gradient(180deg, #081224 0%, #0C1830 50%, #101C36 100%)",
      }}
    >
      
      {/* Background Spotlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] pointer-events-none rounded-full blur-[95px]"
        style={{
          background: "radial-gradient(circle, rgba(0, 212, 255, 0.15), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 bg-institutional-grid pointer-events-none"
        style={{ opacity: 0.15 }}
      />

      <div className="grid-container max-w-[920px] relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/50 text-xs font-mono font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.35)] backdrop-blur-md">
            <Zap className="w-3.5 h-3.5" />
            <span>INTERACTIVE WIZARD</span>
          </div>
          <h2
            className="section-headline text-white"
            style={{
              color: "rgba(255, 255, 255, 0.95)",
              textShadow: "0 0 20px rgba(0, 212, 255, 0.25)",
            }}
          >
            Experience the{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D4FF, #4F7CFF, #B66DFF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 30px rgba(0, 212, 255, 0.35))",
              }}
            >
              Assessment Engine
            </span>
          </h2>
          <p
            className="body-text mx-auto"
            style={{
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Test a sample 3-question evaluation. Real-time autosave persists your selections.
          </p>
        </div>

        {/* Wizard Glass Container */}
        <div className="card-surface p-8 sm:p-10 space-y-6 bg-gradient-to-b from-[#131f42]/95 via-[#0e1732]/98 to-[#090e20] border border-[#38bdf8]/30 shadow-[0_0_40px_rgba(59,130,246,0.25)] backdrop-blur-xl">
          
          {/* Progress & Autosave Bar */}
          <div className="space-y-3 border-b border-white/[0.12] pb-5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-white font-semibold">
                <span>Question {currentStepIndex + 1} of {wizardSteps.length}</span>
                <span className="text-[#60a5fa]">({progressPercent}% Complete)</span>
              </div>

              <div className="flex items-center gap-3">
                {isSaved ? (
                  <span className="flex items-center gap-1 text-[#10b981] text-[11px] font-semibold bg-[#10b981]/20 px-2.5 py-0.5 rounded border border-[#10b981]/35 font-mono">
                    <Check className="w-3 h-3" /> Autosaved
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#f59e0b] text-[11px] font-semibold bg-[#f59e0b]/20 px-2.5 py-0.5 rounded border border-[#f59e0b]/35 font-mono">
                    Saving...
                  </span>
                )}
                <button
                  onClick={resetWizard}
                  className="text-[#cbd5e1] hover:text-white p-1 transition-colors"
                  title="Reset Answers"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Smooth Animated Progress Bar */}
            <div className="h-1.5 w-full bg-[#0a0f1d] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981] rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question & Options Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#60a5fa] uppercase tracking-wider">
                  {step.section}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {step.question}
                </h3>
                <p className="text-sm text-[#e2e8f0]">{step.subtitle}</p>
              </div>

              {/* Options Radio List */}
              <div className="space-y-3">
                {step.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[step.id] === opt.score;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(opt.score)}
                      className={`w-full p-4 rounded-2xl text-left flex items-center justify-between border transition-all duration-200 ${
                        isSelected
                          ? "bg-[#2563eb]/25 border-[#3b82f6] text-white shadow-lg shadow-[#3b82f6]/20"
                          : "bg-[#182447] border-white/[0.14] text-[#e2e8f0] hover:bg-[#202e5a] hover:border-white/[0.28] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono font-bold shrink-0 border-white/[0.2] bg-[#111a33] text-white">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-semibold">{opt.label}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#10b981] bg-[#10b981]/20 px-2.5 py-1 rounded-md border border-[#10b981]/35">
                        {opt.impact}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.12]">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors ${
                currentStepIndex === 0
                  ? "opacity-30 cursor-not-allowed border-white/[0.05] text-[#94a3b8]"
                  : "border-white/[0.14] bg-[#182447] text-[#cbd5e1] hover:bg-[#202e5a] hover:text-white"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStepIndex < wizardSteps.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#2563eb] hover:bg-[#1d4ed8] text-white flex items-center gap-2 shadow-md shadow-[#3b82f6]/30 border border-[#3b82f6]/40 transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <a
                href="/auth/signup"
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white flex items-center gap-2 shadow-md shadow-[#10b981]/30 border border-emerald-400/40 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Full Assessment →</span>
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AssessmentTeaser;
