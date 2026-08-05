"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { saveModuleData, loadModuleData, getCurrentUserId, saveLearningProgress } from "@/services/moduleDataService";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Code,
  Briefcase,
  Laptop,
  Globe,
  Award,
  FolderGit2,
  Users,
  Trophy,
  BookOpen,
  Target,
  Sparkles,
  Check,
  Plus,
  Trash2,
  Clock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Brain,
  ShieldCheck,
  Zap,
  Download,
  Flame,
  ArrowRight,
} from "lucide-react";
import {
  ProfessionalCapitalState,
  SkillLevelOption,
  LanguageProficiencyOption,
  WorkStyleOption,
  CertCategoryOption,
  ProjectCategoryOption,
} from "@/types/professionalCapital";
import {
  defaultProfessionalCapitalState,
  calculateProfessionalCapitalScore,
} from "@/lib/professionalCapitalEngine";

const SECTIONS = [
  { id: 1, name: "Academic Capital", icon: GraduationCap },
  { id: 2, name: "Technical Skills", icon: Code },
  { id: 3, name: "Industry Expertise", icon: Briefcase },
  { id: 4, name: "Digital Competencies", icon: Laptop },
  { id: 5, name: "Communication & Languages", icon: Globe },
  { id: 6, name: "Certifications", icon: Award },
  { id: 7, name: "Projects & Portfolio", icon: FolderGit2 },
  { id: 8, name: "Work Experience", icon: Briefcase },
  { id: 9, name: "Leadership & Impact", icon: Users },
  { id: 10, name: "Sports & Extracurricular", icon: Trophy },
  { id: 11, name: "Awards & Recognition", icon: Award },
  { id: 12, name: "Continuous Learning", icon: BookOpen },
  { id: 13, name: "Career Vision & Audit", icon: Target },
];

export const SkillsModule: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<ProfessionalCapitalState>(defaultProfessionalCapitalState);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [savingStatus, setSavingStatus] = useState<"saved" | "saving">("saved");

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    async function loadFromSupabase() {
      try {
        const uid = await getCurrentUserId();
        setUserId(uid);
        if (!uid) return;
        const parsed = await loadModuleData(uid, "skills");
        if (parsed && (parsed as any).academic) {
          const mergedData = {
            ...defaultProfessionalCapitalState,
            ...parsed,
            academic: { ...defaultProfessionalCapitalState.academic, ...((parsed as any).academic || {}) },
            workExperience: { ...defaultProfessionalCapitalState.workExperience, ...((parsed as any).workExperience || {}) },
            continuousLearning: { ...defaultProfessionalCapitalState.continuousLearning, ...((parsed as any).continuousLearning || {}) },
            careerVision: { ...defaultProfessionalCapitalState.careerVision, ...((parsed as any).careerVision || {}) },
          };
          const isComp = Boolean((parsed as any).isCompleted || (parsed as any).submittedAt || (mergedData.academic && mergedData.academic.degree));
          setData({ ...mergedData, isCompleted: isComp } as ProfessionalCapitalState);
          if (isComp) {
            setIsSubmitted(true);
            setActiveStep(13);
          }
        }
      } finally {
        setIsLoaded(true);
      }
    }
    loadFromSupabase();
  }, []);
  // Real-Time Engine Calculation
  const metrics = useMemo(() => calculateProfessionalCapitalScore(data), [data]);

  // Debounced Autosave to Supabase (ONLY after initial load finishes)
  useEffect(() => {
    if (!mounted || !userId || !isLoaded) return;
    setSavingStatus("saving");
    const timeout = setTimeout(async () => {
      const isComp = Boolean((data as any).isCompleted || (data as any).submittedAt || isSubmitted);
      const skillsScore = metrics?.professionalCapitalScore || 0;
      const result = await saveModuleData(userId, "skills", { ...data, isCompleted: isComp } as any, isComp, skillsScore);
      if (!result) {
        console.warn("[SkillsModule] ⚠️ Save to Supabase FAILED — data was NOT persisted. Check [DB_DEBUG] logs above.");
      }
      setSavingStatus("saved");
    }, 800);
    return () => clearTimeout(timeout);
  }, [data, mounted, userId, isLoaded, isSubmitted, metrics]);

  const [validationError, setValidationError] = useState<string | null>(null);

  const validateCurrentStep = (step: number): boolean => {
    setValidationError(null);
    if (step === 1) {
      if (!data.academic.degree.trim()) {
        setValidationError("Degree Level is required (Enter 'N/A' if not applicable).");
        return false;
      }
    } else if (step === 2) {
      if (!data.technicalSkills || data.technicalSkills.length === 0) {
        setValidationError("Please add at least 1 Technical Skill to proceed (Enter 'N/A' if none).");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep(activeStep)) return;
    if (activeStep < 13) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setValidationError(null);
    if (activeStep > 1) setActiveStep((prev) => prev - 1);
  };

  const handleSubmitSkills = async () => {
    if (!validateCurrentStep(activeStep)) return;
    const updatedData = {
      ...data,
      isCompleted: true,
      submittedAt: new Date().toISOString(),
    };
    setData(updatedData);
    if (userId) {
      const skillScore = metrics?.professionalCapitalScore || 0;
      await saveModuleData(userId, "skills", updatedData as any, true, skillScore);
      await saveLearningProgress(userId, "skills", 100);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hc_assessment_updated"));
    }
    setSavingStatus("saved");
    setIsSubmitted(true);
    setActiveStep(13);
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* SUBMITTED COMPLETION STATUS BANNER */}
      {isSubmitted && (
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl text-left">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] uppercase">
                  ✓ Skills Capital Completed & Saved Locally
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Score: {metrics.professionalCapitalScore} / 100
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[var(--foreground)] mt-0.5">
                Technical Mastery & Professional Capital Stored
              </h3>
              <p className="text-xs text-[var(--subtext)]">
                AI Readiness: <strong className="text-indigo-400 font-mono">{metrics.aiReadinessScore}%</strong> • Employability Index: <strong className="text-sky-400 font-mono">{metrics.employabilityIndex}/100</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono font-bold hover:bg-slate-800 transition-all"
            >
              Edit Skills Inputs
            </button>
            <Link
              href="/dashboard/health"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 hover:from-emerald-500 hover:to-sky-400 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all"
            >
              Next Module: Health & Lifestyle <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* --- TOP HEADER LOCKUP --- */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--border)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-mono font-bold uppercase tracking-wider">
              Module 3 — Professional Capital Intelligence
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--subtext)]">
              {savingStatus === "saving" ? (
                <span className="text-amber-500 animate-pulse flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Autosaving...
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All changes saved
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Professional Capital Wizard
          </h1>
          <p className="text-xs text-[var(--subtext)]">
            LinkedIn Premium x Coursera x GitHub level career valuation, technical mastery, & AI readiness platform.
          </p>
        </div>

        {/* Real-Time Score Quick Badge */}
        <div className="flex items-center gap-3 z-10">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-[var(--border)] flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[var(--subtext)] uppercase">Capital Score</div>
              <div className="text-xl font-black font-mono text-white">{metrics.professionalCapitalScore} / 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STEP PROGRESS BAR & NAVIGATION TABS --- */}
      <div className="glass-panel p-4 rounded-3xl border border-[var(--border)] space-y-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-[var(--subtext)]">
            Step {activeStep} of 13 — <strong className="text-[var(--foreground)]">{SECTIONS[activeStep - 1].name}</strong>
          </span>
          <span className="text-sky-400 font-bold">{Math.round((activeStep / 13) * 100)}% Complete</span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / 13) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Tab Quick Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 scrollbar-none">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isCurrent = activeStep === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveStep(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                  isCurrent
                    ? "bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-bold shadow-md"
                    : "bg-slate-900/60 border border-[var(--border)] text-[var(--subtext)] hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.id}. {sec.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- 2-COLUMN MAIN LAYOUT: WIZARD (LEFT) & RIGHT TELEMETRY PANEL (RIGHT) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= LEFT COLUMN: WIZARD STEP CONTAINER (8 COLS) ================= */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border)] min-h-[540px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* ================= SECTION 1: ACADEMIC CAPITAL ================= */}
              {activeStep === 1 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 1: Academic & Educational Capital</h2>
                    <p className="text-xs text-[var(--subtext)] font-sans">Degrees, university prestige, CGPA, research publications, & patents.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Highest Qualification</label>
                      <input
                        type="text"
                        value={data.academic.highestQualification}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, highestQualification: e.target.value } })}
                        placeholder="e.g. Master of Science"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Degree Title & Major</label>
                      <input
                        type="text"
                        value={data.academic.degree}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, degree: e.target.value } })}
                        placeholder="e.g. B.S. Computer Science & AI"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">University / Institution</label>
                      <input
                        type="text"
                        value={data.academic.university}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, university: e.target.value } })}
                        placeholder="e.g. Stanford University"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">College / School</label>
                      <input
                        type="text"
                        value={data.academic.college}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, college: e.target.value } })}
                        placeholder="e.g. School of Engineering"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">CGPA / GPA</label>
                      <input
                        type="text"
                        value={data.academic.cgpa}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, cgpa: e.target.value } })}
                        placeholder="e.g. 3.9 / 4.0"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Graduation Year</label>
                      <input
                        type="text"
                        value={data.academic.graduationYear}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, graduationYear: e.target.value } })}
                        placeholder="e.g. 2025"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Research Publications Count</label>
                      <input
                        type="number"
                        value={data.academic.researchPublicationsCount || ""}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, researchPublicationsCount: Number(e.target.value) } })}
                        placeholder="0"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Patents Count</label>
                      <input
                        type="number"
                        value={data.academic.patentsCount || ""}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, patentsCount: Number(e.target.value) } })}
                        placeholder="0"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 2: TECHNICAL SKILLS ================= */}
              {activeStep === 2 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 2: Technical Skills Intelligence</h2>
                      <p className="text-xs text-[var(--subtext)]">Track tech stack, level, years experience, confidence, & AI demand.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newItem = {
                          id: `skill_${Date.now()}`,
                          name: "",
                          category: "AI/ML" as const,
                          level: "Advanced" as const,
                          yearsExp: 2,
                          projectsCount: 3,
                          lastUsedYear: "2026",
                          confidenceScore: 4,
                          marketDemand: "High" as const,
                          learningStatus: "Active" as const,
                          maturityScore: 85,
                          relevanceScore: 90,
                          futureDemandScore: 95,
                        };
                        setData({ ...data, technicalSkills: [...data.technicalSkills, newItem] });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Skill
                    </button>
                  </div>

                  {data.technicalSkills.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3">
                      <Code className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
                      <div className="text-xs font-semibold text-[var(--foreground)]">No technical skills added yet</div>
                      <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                        Add skills like Python, Next.js, PyTorch, Kubernetes, or SQL to calculate technical capital.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.technicalSkills.map((sk, idx) => (
                        <div key={sk.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Skill Name</label>
                            <input
                              type="text"
                              value={sk.name}
                              onChange={(e) => {
                                const updated = [...data.technicalSkills];
                                updated[idx].name = e.target.value;
                                setData({ ...data, technicalSkills: updated });
                              }}
                              placeholder="e.g. PyTorch"
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Category</label>
                            <select
                              value={sk.category}
                              onChange={(e) => {
                                const updated = [...data.technicalSkills];
                                updated[idx].category = e.target.value as any;
                                setData({ ...data, technicalSkills: updated });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            >
                              {["AI/ML", "Frontend", "Backend", "Cloud/DevOps", "Data & Analytics", "Cybersecurity", "Mobile", "Other"].map((cat) => (
                                <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                              ))}
                            </select>
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Level</label>
                            <select
                              value={sk.level}
                              onChange={(e) => {
                                const updated = [...data.technicalSkills];
                                updated[idx].level = e.target.value as SkillLevelOption;
                                setData({ ...data, technicalSkills: updated });
                              }}
                              className="w-full px-2 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            >
                              <option value="Beginner" className="bg-[#0f172a]">Beginner</option>
                              <option value="Intermediate" className="bg-[#0f172a]">Intermediate</option>
                              <option value="Advanced" className="bg-[#0f172a]">Advanced</option>
                              <option value="Expert" className="bg-[#0f172a]">Expert</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Years Exp</label>
                            <input
                              type="number"
                              value={sk.yearsExp || ""}
                              onChange={(e) => {
                                const updated = [...data.technicalSkills];
                                updated[idx].yearsExp = Number(e.target.value);
                                setData({ ...data, technicalSkills: updated });
                              }}
                              placeholder="Yrs"
                              className="w-full px-2 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>

                          <div className="sm:col-span-2 flex items-center justify-end pt-3 sm:pt-0">
                            <button
                              onClick={() => {
                                const updated = data.technicalSkills.filter((_, i) => i !== idx);
                                setData({ ...data, technicalSkills: updated });
                              }}
                              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= SECTION 3: INDUSTRY EXPERTISE ================= */}
              {activeStep === 3 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 3: Industry Expertise</h2>
                      <p className="text-xs text-[var(--subtext)]">Domain experience across AI, FinTech, Healthcare, Cloud, SaaS, etc.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newItem = {
                          id: `ind_${Date.now()}`,
                          industryDomain: "Artificial Intelligence",
                          yearsExp: 3,
                          projectsCount: 5,
                          expertiseLevel: "Advanced" as const,
                        };
                        setData({ ...data, industryExpertise: [...data.industryExpertise, newItem] });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Domain
                    </button>
                  </div>

                  {data.industryExpertise.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3">
                      <Briefcase className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
                      <div className="text-xs font-semibold text-[var(--foreground)]">No industry domains added</div>
                      <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                        Add domain expertise like AI & Deep Learning, FinTech, Healthcare, Cloud Infrastructure, or E-Commerce.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.industryExpertise.map((item, idx) => (
                        <div key={item.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-5 space-y-1">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Domain Name</label>
                            <input
                              type="text"
                              value={item.industryDomain}
                              onChange={(e) => {
                                const updated = [...data.industryExpertise];
                                updated[idx].industryDomain = e.target.value;
                                setData({ ...data, industryExpertise: updated });
                              }}
                              placeholder="e.g. Artificial Intelligence"
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Years Experience</label>
                            <input
                              type="number"
                              value={item.yearsExp || ""}
                              onChange={(e) => {
                                const updated = [...data.industryExpertise];
                                updated[idx].yearsExp = Number(e.target.value);
                                setData({ ...data, industryExpertise: updated });
                              }}
                              placeholder="Yrs"
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Expertise Level</label>
                            <select
                              value={item.expertiseLevel}
                              onChange={(e) => {
                                const updated = [...data.industryExpertise];
                                updated[idx].expertiseLevel = e.target.value as SkillLevelOption;
                                setData({ ...data, industryExpertise: updated });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            >
                              <option value="Beginner" className="bg-[#0f172a]">Beginner</option>
                              <option value="Intermediate" className="bg-[#0f172a]">Intermediate</option>
                              <option value="Advanced" className="bg-[#0f172a]">Advanced</option>
                              <option value="Expert" className="bg-[#0f172a]">Expert</option>
                            </select>
                          </div>

                          <div className="sm:col-span-1 flex items-center justify-end pt-3 sm:pt-0">
                            <button
                              onClick={() => {
                                const updated = data.industryExpertise.filter((_, i) => i !== idx);
                                setData({ ...data, industryExpertise: updated });
                              }}
                              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= SECTION 4: DIGITAL COMPETENCIES ================= */}
              {activeStep === 4 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 4: Digital Competencies & Tools</h2>
                    <p className="text-xs text-[var(--subtext)]">Select tool suites (Excel, Figma, GitHub, Docker, ChatGPT, Notion, VS Code).</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.digitalCompetencies.map((tool, idx) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => {
                          const updated = [...data.digitalCompetencies];
                          updated[idx].selected = !updated[idx].selected;
                          setData({ ...data, digitalCompetencies: updated });
                        }}
                        className={`p-3.5 rounded-2xl border text-xs text-left flex justify-between items-center transition-all ${
                          tool.selected
                            ? "bg-indigo-600/20 border-indigo-500 text-[var(--foreground)] font-bold shadow-md"
                            : "bg-slate-900/60 border border-[var(--border)] text-[var(--subtext)] hover:border-slate-500"
                        }`}
                      >
                        <div>
                          <div className="font-bold">{tool.name}</div>
                          <span className="text-[10px] font-mono text-[var(--subtext)]">{tool.category}</span>
                        </div>
                        {tool.selected && <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= SECTION 5: COMMUNICATION & LANGUAGES ================= */}
              {activeStep === 5 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 5: Communication & Languages</h2>
                      <p className="text-xs text-[var(--subtext)]">Multilingual capabilities, public speaking, & presentation ratings.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newItem = {
                          id: `lang_${Date.now()}`,
                          language: "English",
                          read: true,
                          write: true,
                          speak: true,
                          proficiency: "Native" as const,
                        };
                        setData({ ...data, languages: [...data.languages, newItem] });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Language
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.languages.map((lng, idx) => (
                      <div key={lng.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <input
                          type="text"
                          value={lng.language}
                          onChange={(e) => {
                            const updated = [...data.languages];
                            updated[idx].language = e.target.value;
                            setData({ ...data, languages: updated });
                          }}
                          placeholder="e.g. English"
                          className="px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        />
                        <select
                          value={lng.proficiency}
                          onChange={(e) => {
                            const updated = [...data.languages];
                            updated[idx].proficiency = e.target.value as LanguageProficiencyOption;
                            setData({ ...data, languages: updated });
                          }}
                          className="px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        >
                          <option value="Native" className="bg-[#0f172a]">Native</option>
                          <option value="Professional" className="bg-[#0f172a]">Professional</option>
                          <option value="Intermediate" className="bg-[#0f172a]">Intermediate</option>
                          <option value="Basic" className="bg-[#0f172a]">Basic</option>
                        </select>
                        <button
                          onClick={() => {
                            const updated = data.languages.filter((_, i) => i !== idx);
                            setData({ ...data, languages: updated });
                          }}
                          className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Communication Rating Sliders */}
                  <div className="pt-2 space-y-3 border-t border-[var(--border)]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">Communication Skills Self-Rating (1-5)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: "communicationConfidence", label: "General Communication Confidence" },
                        { key: "presentationSkills", label: "Executive Presentation Skills" },
                        { key: "publicSpeaking", label: "Public Speaking & Keynote Ability" },
                        { key: "businessWriting", label: "Business Writing & Tech Specs" },
                      ].map((item) => {
                        const val = (data.communication as any)[item.key] || 3;
                        return (
                          <div key={item.key} className="p-3.5 rounded-2xl bg-slate-900/60 border border-[var(--border)] space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="font-semibold text-[var(--foreground)]">{item.label}</span>
                              <span className="font-mono font-bold text-sky-400">{val}/5</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() =>
                                    setData({
                                      ...data,
                                      communication: { ...data.communication, [item.key]: lvl },
                                    })
                                  }
                                  className={`flex-1 py-1 rounded-xl text-xs font-bold transition-all ${
                                    val === lvl
                                      ? "bg-sky-500 text-slate-950"
                                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--subtext)] hover:text-white"
                                  }`}
                                >
                                  {lvl}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 6: CERTIFICATIONS ================= */}
              {activeStep === 6 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 6: Professional Certifications</h2>
                      <p className="text-xs text-[var(--subtext)]">AWS, Google Cloud, CFA, PMP, DeepLearning.AI, & verified credentials.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newItem = {
                          id: `cert_${Date.now()}`,
                          name: "",
                          provider: "Amazon Web Services",
                          category: "Cloud & DevOps" as const,
                          issueDate: "2024",
                          expiryDate: "Lifetime",
                          credentialId: "",
                          verificationUrl: "",
                        };
                        setData({ ...data, certifications: [...data.certifications, newItem] });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Certification
                    </button>
                  </div>

                  {data.certifications.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3">
                      <Award className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
                      <div className="text-xs font-semibold text-[var(--foreground)]">No certifications added</div>
                      <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                        Add cloud, AI, finance, or management certifications to boost your professional capital score.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.certifications.map((crt, idx) => (
                        <div key={crt.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-4 space-y-1">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Certification Name</label>
                            <input
                              type="text"
                              value={crt.name}
                              onChange={(e) => {
                                const updated = [...data.certifications];
                                updated[idx].name = e.target.value;
                                setData({ ...data, certifications: updated });
                              }}
                              placeholder="e.g. AWS Solutions Architect"
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>

                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Issuing Provider</label>
                            <input
                              type="text"
                              value={crt.provider}
                              onChange={(e) => {
                                const updated = [...data.certifications];
                                updated[idx].provider = e.target.value;
                                setData({ ...data, certifications: updated });
                              }}
                              placeholder="e.g. Amazon Web Services"
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>

                          <div className="sm:col-span-4 space-y-1">
                            <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Verification Link</label>
                            <input
                              type="text"
                              value={crt.verificationUrl}
                              onChange={(e) => {
                                const updated = [...data.certifications];
                                updated[idx].verificationUrl = e.target.value;
                                setData({ ...data, certifications: updated });
                              }}
                              placeholder="https://..."
                              className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>

                          <div className="sm:col-span-1 flex items-center justify-end pt-3 sm:pt-0">
                            <button
                              onClick={() => {
                                const updated = data.certifications.filter((_, i) => i !== idx);
                                setData({ ...data, certifications: updated });
                              }}
                              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= SECTION 7: PROJECTS & PORTFOLIO ================= */}
              {activeStep === 7 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 7: Projects & Portfolio</h2>
                      <p className="text-xs text-[var(--subtext)] font-sans">Open-source software, research systems, YC startup apps, & hackathons.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newItem = {
                          id: `proj_${Date.now()}`,
                          name: "",
                          role: "Lead Architect",
                          durationMonths: 6,
                          category: "Professional" as const,
                          techStack: [],
                          description: "",
                          teamSize: 3,
                          impact: "",
                          githubUrl: "",
                          liveDemoUrl: "",
                        };
                        setData({ ...data, projects: [...data.projects, newItem] });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Project
                    </button>
                  </div>

                  {data.projects.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-dashed border-[var(--border)] text-center space-y-3">
                      <FolderGit2 className="w-8 h-8 text-sky-400 mx-auto opacity-70" />
                      <div className="text-xs font-semibold text-[var(--foreground)]">No projects added yet</div>
                      <p className="text-[11px] text-[var(--subtext)] max-w-sm mx-auto">
                        Add production projects, research apps, or open-source repositories with GitHub and Live demo links.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.projects.map((prj, idx) => (
                        <div key={prj.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            <div className="sm:col-span-4 space-y-1">
                              <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Project Name</label>
                              <input
                                type="text"
                                value={prj.name}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[idx].name = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                placeholder="e.g. Human Capital Platform"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                              />
                            </div>

                            <div className="sm:col-span-4 space-y-1">
                              <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Role / Responsibility</label>
                              <input
                                type="text"
                                value={prj.role}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[idx].role = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                placeholder="e.g. Lead Fullstack Architect"
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Category</label>
                              <select
                                value={prj.category}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[idx].category = e.target.value as ProjectCategoryOption;
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                              >
                                {["Research", "Open Source", "Hackathon", "Professional", "Startup", "Academic"].map((cat) => (
                                  <option key={cat} value={cat} className="bg-[#0f172a]">{cat}</option>
                                ))}
                              </select>
                            </div>

                            <div className="sm:col-span-1 flex items-center justify-end pt-3 sm:pt-0">
                              <button
                                onClick={() => {
                                  const updated = data.projects.filter((_, i) => i !== idx);
                                  setData({ ...data, projects: updated });
                                }}
                                className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={prj.githubUrl || ""}
                              onChange={(e) => {
                                const updated = [...data.projects];
                                updated[idx].githubUrl = e.target.value;
                                setData({ ...data, projects: updated });
                              }}
                              placeholder="GitHub Repository URL"
                              className="px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                            <input
                              type="text"
                              value={prj.liveDemoUrl || ""}
                              onChange={(e) => {
                                const updated = [...data.projects];
                                updated[idx].liveDemoUrl = e.target.value;
                                setData({ ...data, projects: updated });
                              }}
                              placeholder="Live Production Demo URL"
                              className="px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= SECTION 8: WORK EXPERIENCE ================= */}
              {activeStep === 8 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 8: Work Experience & Career History</h2>
                    <p className="text-xs text-[var(--subtext)]">Student internships, full-time employment, founder startup, or freelance practice.</p>
                  </div>

                  <div className="flex gap-2">
                    {(["Employee", "Student", "Founder", "Freelancer"] as const).map((persona) => (
                      <button
                        key={persona}
                        type="button"
                        onClick={() =>
                          setData({
                            ...data,
                            workExperience: { ...data.workExperience, persona },
                          })
                        }
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          data.workExperience.persona === persona
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-slate-900 border border-[var(--border)] text-[var(--subtext)]"
                        }`}
                      >
                        {persona} Mode
                      </button>
                    ))}
                  </div>

                  {data.workExperience.persona === "Employee" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Company Name</label>
                        <input
                          type="text"
                          value={data.workExperience.employee.company}
                          onChange={(e) =>
                            setData({
                              ...data,
                              workExperience: {
                                ...data.workExperience,
                                employee: { ...data.workExperience.employee, company: e.target.value },
                              },
                            })
                          }
                          placeholder="e.g. Apex Systems"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Current Role / Designation</label>
                        <input
                          type="text"
                          value={data.workExperience.employee.role}
                          onChange={(e) =>
                            setData({
                              ...data,
                              workExperience: {
                                ...data.workExperience,
                                employee: { ...data.workExperience.employee, role: e.target.value },
                              },
                            })
                          }
                          placeholder="e.g. Senior AI Solutions Architect"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Total Years Experience</label>
                        <input
                          type="number"
                          value={data.workExperience.employee.totalYearsExp || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              workExperience: {
                                ...data.workExperience,
                                employee: { ...data.workExperience.employee, totalYearsExp: Number(e.target.value) },
                              },
                            })
                          }
                          placeholder="Years"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Promotions Earned</label>
                        <input
                          type="number"
                          value={data.workExperience.employee.promotionsCount || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              workExperience: {
                                ...data.workExperience,
                                employee: { ...data.workExperience.employee, promotionsCount: Number(e.target.value) },
                              },
                            })
                          }
                          placeholder="0"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        />
                      </div>
                    </div>
                  )}

                  {data.workExperience.persona === "Student" && (
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Internships & Work Training</label>
                        <input
                          type="text"
                          value={data.workExperience.student.internships}
                          onChange={(e) =>
                            setData({
                              ...data,
                              workExperience: {
                                ...data.workExperience,
                                student: { ...data.workExperience.student, internships: e.target.value },
                              },
                            })
                          }
                          placeholder="e.g. Software Engineering Intern at Meta"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        />
                      </div>
                    </div>
                  )}

                  {data.workExperience.persona === "Founder" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Startup Name</label>
                        <input
                          type="text"
                          value={data.workExperience.founder.startupName}
                          onChange={(e) =>
                            setData({
                              ...data,
                              workExperience: {
                                ...data.workExperience,
                                founder: { ...data.workExperience.founder, startupName: e.target.value },
                              },
                            })
                          }
                          placeholder="e.g. ValuationAI"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Revenue / ARR Stage</label>
                        <input
                          type="text"
                          value={data.workExperience.founder.revenueStage}
                          onChange={(e) =>
                            setData({
                              ...data,
                              workExperience: {
                                ...data.workExperience,
                                founder: { ...data.workExperience.founder, revenueStage: e.target.value },
                              },
                            })
                          }
                          placeholder="e.g. $500k ARR"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= SECTION 9: LEADERSHIP & IMPACT ================= */}
              {activeStep === 9 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 9: Leadership & Social Impact</h2>
                    <p className="text-xs text-[var(--subtext)]">Team management, Toastmasters, volunteering, mentoring, & community impact.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Leadership & Team Scope</label>
                      <input
                        type="text"
                        value={data.leadership.leadershipPositions}
                        onChange={(e) => setData({ ...data, leadership: { ...data.leadership, leadershipPositions: e.target.value } })}
                        placeholder="e.g. Managed squad of 8 engineers"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Community & Volunteer Mentoring</label>
                      <input
                        type="text"
                        value={data.leadership.mentoringExperience}
                        onChange={(e) => setData({ ...data, leadership: { ...data.leadership, mentoringExperience: e.target.value } })}
                        placeholder="e.g. Mentored 20+ junior developers"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 10: SPORTS ================= */}
              {activeStep === 10 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 10: Sports & Extracurricular</h2>
                    <p className="text-xs text-[var(--subtext)]">Competitive sports, state/national representation, captaincy, & fitness.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Sport Discipline</label>
                      <input
                        type="text"
                        value={data.sports.sportName}
                        onChange={(e) => setData({ ...data, sports: { ...data.sports, sportName: e.target.value } })}
                        placeholder="e.g. Basketball / Tennis"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Competition Level</label>
                      <select
                        value={data.sports.competitionLevel}
                        onChange={(e) => setData({ ...data, sports: { ...data.sports, competitionLevel: e.target.value as any } })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold"
                      >
                        <option value="College / Local" className="bg-[#0f172a]">College / Local</option>
                        <option value="State Level" className="bg-[#0f172a]">State Level</option>
                        <option value="National Level" className="bg-[#0f172a]">National Level</option>
                        <option value="International Level" className="bg-[#0f172a]">International Level</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 11: AWARDS ================= */}
              {activeStep === 11 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 11: Awards & Recognition</h2>
                      <p className="text-xs text-[var(--subtext)]">Industry honors, hackathon victories, & excellence awards.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newItem = {
                          id: `awd_${Date.now()}`,
                          name: "",
                          year: "2025",
                          organization: "Ministry of Technology",
                          category: "Innovation",
                          description: "",
                        };
                        setData({ ...data, awards: [...data.awards, newItem] });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" /> Add Award
                    </button>
                  </div>

                  <div className="space-y-3">
                    {data.awards.map((aw, idx) => (
                      <div key={aw.id} className="p-4 rounded-2xl bg-slate-900/70 border border-[var(--border)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-5 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Award Title</label>
                          <input
                            type="text"
                            value={aw.name}
                            onChange={(e) => {
                              const updated = [...data.awards];
                              updated[idx].name = e.target.value;
                              setData({ ...data, awards: updated });
                            }}
                            placeholder="e.g. National Innovation Excellence Award"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-4 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Issuing Organization</label>
                          <input
                            type="text"
                            value={aw.organization}
                            onChange={(e) => {
                              const updated = [...data.awards];
                              updated[idx].organization = e.target.value;
                              setData({ ...data, awards: updated });
                            }}
                            placeholder="e.g. Google AI Hackathon"
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[10px] text-[var(--subtext)] uppercase font-mono">Year</label>
                          <input
                            type="text"
                            value={aw.year}
                            onChange={(e) => {
                              const updated = [...data.awards];
                              updated[idx].year = e.target.value;
                              setData({ ...data, awards: updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                          />
                        </div>

                        <div className="sm:col-span-1 flex items-center justify-end pt-3 sm:pt-0">
                          <button
                            onClick={() => {
                              const updated = data.awards.filter((_, i) => i !== idx);
                              setData({ ...data, awards: updated });
                            }}
                            className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= SECTION 12: CONTINUOUS LEARNING ================= */}
              {activeStep === 12 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4">
                    <h2 className="text-xl font-bold text-[var(--foreground)]">Section 12: Continuous Learning & Velocity</h2>
                    <p className="text-xs text-[var(--subtext)]">Learning hours/week, books, courses, conferences, & tech research velocity.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Learning Hours / Week</label>
                      <input
                        type="number"
                        value={data.continuousLearning.learningHoursPerWeek || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            continuousLearning: { ...data.continuousLearning, learningHoursPerWeek: Number(e.target.value) },
                          })
                        }
                        placeholder="Hours"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Courses Completed / Year</label>
                      <input
                        type="number"
                        value={data.continuousLearning.coursesCompleted || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            continuousLearning: { ...data.continuousLearning, coursesCompleted: Number(e.target.value) },
                          })
                        }
                        placeholder="Courses"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Books Read / Year</label>
                      <input
                        type="number"
                        value={data.continuousLearning.booksPerYear || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            continuousLearning: { ...data.continuousLearning, booksPerYear: Number(e.target.value) },
                          })
                        }
                        placeholder="Books"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Hackathons Attended</label>
                      <input
                        type="number"
                        value={data.continuousLearning.hackathonsAttended || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            continuousLearning: { ...data.continuousLearning, hackathonsAttended: Number(e.target.value) },
                          })
                        }
                        placeholder="Count"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 13: CAREER VISION & AI REPORT ================= */}
              {activeStep === 13 && (
                <div className="space-y-6 text-left">
                  {/* Success Completion Notification Banner */}
                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Module 3 — Professional Capital Audit Completed!</h4>
                      <p className="text-xs text-emerald-300">All responses have been successfully saved and calculated in your Neural Telemetry Profile.</p>
                    </div>
                  </div>

                  <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-black text-[var(--foreground)]">Section 13: Career Vision & Executive Audit Report</h2>
                      <p className="text-xs text-[var(--subtext)]">10-Year career goals and full Professional Capital Audit Report.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Dream Target Role</label>
                      <input
                        type="text"
                        value={data.careerVision?.dreamRole || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            careerVision: { ...(data.careerVision || defaultProfessionalCapitalState.careerVision), dreamRole: e.target.value },
                          })
                        }
                        placeholder="e.g. Chief AI Officer / VP Engineering"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--foreground)]">Dream Target Company</label>
                      <input
                        type="text"
                        value={data.careerVision?.dreamCompany || ""}
                        onChange={(e) =>
                          setData({
                            ...data,
                            careerVision: { ...(data.careerVision || defaultProfessionalCapitalState.careerVision), dreamCompany: e.target.value },
                          })
                        }
                        placeholder="e.g. OpenAI / Google DeepMind"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                      />
                    </div>
                  </div>

                  {/* Readiness Badges */}
                  <div className="p-4 rounded-2xl bg-slate-900 border border-[var(--border)] space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">AI Career Readiness Classifications</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-mono text-[var(--subtext)]">Promotion</span>
                        <div className="text-xs font-bold text-emerald-400">{metrics.promotionReadiness}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-mono text-[var(--subtext)]">Startup</span>
                        <div className="text-xs font-bold text-sky-400">{metrics.startupReadiness}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-mono text-[var(--subtext)]">Leadership</span>
                        <div className="text-xs font-bold text-indigo-400">{metrics.leadershipReadiness}</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] font-mono text-[var(--subtext)]">Global Mobility</span>
                        <div className="text-xs font-bold text-purple-400">{metrics.internationalEmployability}</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Strategic Insights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase">
                        <CheckCircle2 className="w-4 h-4" /> Top Strengths Identified
                      </div>
                      <ul className="space-y-1 text-xs text-[var(--foreground)] list-disc list-inside">
                        {metrics.topStrengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono uppercase">
                        <Sparkles className="w-4 h-4" /> Recommended Skill Gaps & Upskilling
                      </div>
                      <ul className="space-y-1 text-xs text-[var(--foreground)] list-disc list-inside">
                        {metrics.skillGaps.map((sg, i) => (
                          <li key={i}>{sg}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Step Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-[var(--border)] mt-6">
            <button
              onClick={handleBack}
              disabled={activeStep === 1}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeStep === 1
                  ? "opacity-40 cursor-not-allowed bg-slate-900 text-[var(--subtext)]"
                  : "bg-slate-900 hover:bg-slate-800 text-white border border-[var(--border)]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous Step
            </button>

            {activeStep < 13 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all"
              >
                Next Step <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitSkills}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 text-white font-extrabold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitted ? "Update & Save Skills Data" : "Submit & Save Skills Data"}</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PERSISTENT TELEMETRY PANEL (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Master Score Dial Card */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border)] text-center space-y-4 shadow-xl">
            <span className="text-[10px] font-mono text-[var(--subtext)] uppercase tracking-widest">PROFESSIONAL CAPITAL INDEX</span>
            <div className="flex items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="48" className="stroke-slate-800" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    className="stroke-indigo-400"
                    strokeWidth="10"
                    strokeDasharray={301.59}
                    strokeDashoffset={301.59 - (301.59 * metrics.professionalCapitalScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black font-mono text-white">{metrics.professionalCapitalScore}</span>
                  <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider">OUT OF 100</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Career Growth Trajectory
            </div>
          </div>

          {/* Real-Time Indices Panel */}
          <div className="glass-panel p-5 rounded-3xl border border-[var(--border)] space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" /> Real-Time Telemetry Indices
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[var(--subtext)]">Employability Index</span>
                  <span className="text-white font-bold">{metrics.employabilityIndex} / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${metrics.employabilityIndex}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[var(--subtext)]">AI Readiness Score</span>
                  <span className="text-white font-bold">{metrics.aiReadinessScore} / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: `${metrics.aiReadinessScore}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[var(--subtext)]">Learning Velocity Index</span>
                  <span className="text-white font-bold">{metrics.learningIndex} / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${metrics.learningIndex}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[var(--subtext)]">Leadership & Impact</span>
                  <span className="text-white font-bold">{metrics.leadershipIndex} / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${metrics.leadershipIndex}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[var(--subtext)]">Future Market Demand</span>
                  <span className="text-white font-bold">{metrics.futureDemandIndex} / 100</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${metrics.futureDemandIndex}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 12 Weighted Vector Breakdown Accordion */}
          <div className="glass-panel p-5 rounded-3xl border border-[var(--border)] space-y-3 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
              12 Vector Sub-Scores Breakdown
            </h3>
            <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-none pr-1">
              {[
                { name: "Academic Capital", score: metrics.scores.academic, weight: "10%" },
                { name: "Technical Skills", score: metrics.scores.technical, weight: "20%" },
                { name: "Industry Expertise", score: metrics.scores.industry, weight: "10%" },
                { name: "Projects & Portfolio", score: metrics.scores.projects, weight: "10%" },
                { name: "Work Experience", score: metrics.scores.experience, weight: "10%" },
                { name: "Leadership Impact", score: metrics.scores.leadership, weight: "10%" },
                { name: "Communication", score: metrics.scores.communication, weight: "10%" },
                { name: "Certifications", score: metrics.scores.certifications, weight: "10%" },
                { name: "Continuous Learning", score: metrics.scores.learning, weight: "5%" },
                { name: "Awards & Honors", score: metrics.scores.awards, weight: "5%" },
                { name: "Sports & Extracurricular", score: metrics.scores.sports, weight: "5%" },
                { name: "Career Vision", score: metrics.scores.vision, weight: "5%" },
              ].map((v) => (
                <div key={v.name} className="flex justify-between items-center text-[11px] font-mono p-1.5 rounded-lg bg-slate-900/60">
                  <span className="text-[var(--subtext)]">{v.name} ({v.weight})</span>
                  <span className="font-bold text-white">{v.score} / 100</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsModule;
