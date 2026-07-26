"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Save,
  Check,
  ShieldAlert,
  Zap,
  HelpCircle,
  RotateCcw,
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
    section: "Dimension 1: Career Trajectory & Mobility",
    question: "What is your primary career trajectory leverage point?",
    subtitle: "Evaluates market scarcity, title velocity, and executive mobility.",
    options: [
      { label: "Executive / Founder with equity leverage", impact: "+22 pts", score: 95 },
      { label: "Senior Tech / Strategy IC at high-growth firm", impact: "+18 pts", score: 85 },
      { label: "Mid-level Manager seeking career acceleration", impact: "+12 pts", score: 72 },
      { label: "Early-stage Specialist exploring optimal pivot", impact: "+8 pts", score: 60 },
    ],
  },
  {
    id: 2,
    section: "Dimension 2: Financial Runway & Independence",
    question: "How many months of liquid runway (unearned income) do you hold?",
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
    section: "Dimension 3: Technical Skills Architecture",
    question: "How integrated are generative AI & automation tools into your daily output?",
    subtitle: "Measures 10x output multiplier and technological disruption defense.",
    options: [
      { label: "Expert: Automated workflow pipelines & custom agents", impact: "+20 pts", score: 98 },
      { label: "Advanced: Daily power user for writing, code, & strategy", impact: "+15 pts", score: 82 },
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

  const progressPercent = Math.round(((currentStepIndex + 1) / wizardSteps.length) * 100);

  return (
    <section id="wizard" className="py-24 relative bg-[#060a14] border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Assessment Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience the Assessment Wizard
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Test a sample 3-question evaluation. Real-time autosave persists your answers across evaluation steps.
          </p>
        </div>

        {/* Wizard Card Container */}
        <div className="glass-panel rounded-3xl border border-slate-700/80 p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-300 font-bold">
              <span>Question {currentStepIndex + 1} of {wizardSteps.length}</span>
              <span className="text-slate-500">({progressPercent}% Complete)</span>
            </div>

            <div className="flex items-center gap-3">
              {isSaved ? (
                <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                  <Check className="w-3 h-3" /> Autosaved
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400 text-[11px] font-semibold bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
                  Saving...
                </span>
              )}
              <button
                onClick={resetWizard}
                className="text-slate-400 hover:text-white p-1 transition-colors"
                title="Reset Answers"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step Category Badge & Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                  {step.section}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {step.question}
                </h3>
                <p className="text-xs text-slate-300">{step.subtitle}</p>
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
                          ? "bg-sky-500/10 border-sky-500/60 text-white shadow-lg shadow-sky-500/10"
                          : "bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? "border-sky-400 bg-sky-400 text-slate-950" : "border-slate-700 bg-slate-900"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-sm font-semibold">{opt.label}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
                        {opt.impact}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors ${
                currentStepIndex === 0
                  ? "opacity-40 cursor-not-allowed border-slate-800 text-slate-600"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStepIndex < wizardSteps.length - 1 ? (
              <button
                onClick={nextStep}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <a
                href="/auth/signup"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-sky-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
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
