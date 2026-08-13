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
  DigitalCompetencyItem,
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
        let mergedData = {
          ...defaultProfessionalCapitalState,
          ...parsed,
          academic: { ...defaultProfessionalCapitalState.academic, ...((parsed as any)?.academic || {}) },
          workExperience: { ...defaultProfessionalCapitalState.workExperience, ...((parsed as any)?.workExperience || {}) },
          continuousLearning: { ...defaultProfessionalCapitalState.continuousLearning, ...((parsed as any)?.continuousLearning || {}) },
          careerVision: { ...defaultProfessionalCapitalState.careerVision, ...((parsed as any)?.careerVision || {}) },
        };

        // Auto-prefill from master_profile (Personal Info) if academic fields are empty
        const masterProf = await loadModuleData(uid, "master_profile");
        if (masterProf) {
          const st = (masterProf as any)?.studentData || (masterProf as any)?.student;
          if (st) {
            if (!mergedData.academic.degree && (st.degree || st.specialization)) {
              mergedData.academic.degree = st.degree ? `${st.degree} (${st.specialization || ''})`.trim() : st.specialization;
            }
            if (!mergedData.academic.highestQualification && st.studentCategory) {
              mergedData.academic.highestQualification = st.studentCategory;
            }
            if (!mergedData.academic.university && st.university) {
              mergedData.academic.university = st.university;
            }
            if (!mergedData.academic.college && st.college) {
              mergedData.academic.college = st.college;
            }
            if (!mergedData.academic.cgpa && st.cgpaOrPercentage) {
              mergedData.academic.cgpa = st.cgpaOrPercentage;
            }
            if (!mergedData.academic.graduationYear && st.expectedGraduationYear) {
              mergedData.academic.graduationYear = st.expectedGraduationYear;
            }
          }
        }

        const isComp = Boolean((parsed as any)?.isCompleted || (parsed as any)?.submittedAt || (mergedData.academic && mergedData.academic.degree));
        setData({ ...mergedData, isCompleted: isComp } as ProfessionalCapitalState);
        if (isComp) {
          setIsSubmitted(true);
          setActiveStep(13);
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
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="module-badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  ✓ Skills Capital Completed & Saved Locally
                </span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  Score: {metrics.professionalCapitalScore} / 100
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)]">
                Technical Mastery & Professional Capital Stored
              </h3>
              <p className="text-xs text-[var(--subtext)] leading-relaxed">
                AI Readiness: <strong className="text-indigo-400 font-mono">{metrics.aiReadinessScore}%</strong> • Employability Index: <strong className="text-sky-400 font-mono">{metrics.employabilityIndex}/100</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="wizard-nav-btn bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs"
            >
              Edit Skills Inputs
            </button>
            <Link
              href="/dashboard/health"
              className="wizard-nav-btn bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs shadow-lg shadow-emerald-900/20"
            >
              Next Module: Health & Lifestyle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="module-badge bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              Module 3 — Professional Capital Intelligence
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono">
              {savingStatus === "saving" ? (
                <span className="text-amber-500 animate-pulse flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Autosaving...
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> All changes saved
                </span>
              )}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
            Professional Capital Wizard
          </h1>
          <p className="text-xs text-[var(--subtext)] max-w-lg leading-relaxed">
            LinkedIn Premium x Coursera x GitHub level career valuation, technical mastery, & AI readiness platform.
          </p>
        </div>

        {/* Real-Time Score Quick Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2.5 rounded-xl bg-[var(--surface-1)] border border-[var(--border-subtle)] flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-[var(--subtext)] uppercase">Capital Score</div>
              <div className="text-lg font-bold font-mono text-white">{metrics.professionalCapitalScore} / 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- STEP PROGRESS BAR & NAVIGATION TABS --- */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-[var(--foreground)]">
            Step {activeStep} of 13 — <strong className="text-indigo-400">{SECTIONS[activeStep - 1].name}</strong>
          </span>
          <span className="text-xs font-mono font-semibold text-indigo-400">{Math.round((activeStep / 13) * 100)}% Complete</span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(activeStep / 13) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Tab Quick Selector */}
        <div className="scroll-fade-container">
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 no-scrollbar pr-12">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isCurrent = activeStep === sec.id;
              const isCompleted = sec.id < activeStep;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveStep(sec.id)}
                  className={`step-chip ${
                    isCurrent
                      ? "step-chip-active"
                      : isCompleted
                      ? "step-chip-completed"
                      : ""
                  }`}
                >
                  {isCompleted ? <Check className="w-3 h-3" /> : <Icon className="w-3.5 h-3.5" />}
                  <span>{sec.id}. {sec.name}</span>
                </button>
              );
            })}
          </div>
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
                  <div className="border-b border-[var(--border)] pb-4 space-y-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 1: Academic & Educational Capital</h2>
                      
                      {/* 1-Click Quick Presets for Academic Degrees */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-mono text-[var(--subtext)] mr-1">Quick Select:</span>
                        {[
                          { label: "B.Tech CS", qual: "Bachelor of Technology", degree: "B.Tech Computer Science & AI" },
                          { label: "M.S. AI", qual: "Master of Science", degree: "M.S. Data Science & Artificial Intelligence" },
                          { label: "MBA", qual: "Master of Business Administration", degree: "MBA Finance & Strategy" },
                          { label: "Ph.D.", qual: "Doctor of Philosophy (Ph.D.)", degree: "Ph.D. Computer Vision & ML" },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setData((prev) => ({
                                ...prev,
                                academic: {
                                  ...prev.academic,
                                  highestQualification: preset.qual,
                                  degree: preset.degree,
                                },
                              }));
                            }}
                            className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 text-[11px] font-medium transition-all"
                          >
                            + {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[var(--subtext)] font-sans">Degrees, university prestige, CGPA, research publications, & patents.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Highest Qualification */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">Highest Qualification</label>
                      <select
                        value={data.academic.highestQualification}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, highestQualification: e.target.value } })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                      >
                        <option value="" className="bg-[#0f172a] text-slate-400">Select Highest Qualification...</option>
                        <option value="High School (10th/12th)" className="bg-[#0f172a]">High School / Senior Secondary (10th / 12th)</option>
                        <option value="Diploma / Vocational" className="bg-[#0f172a]">Diploma / Vocational Program</option>
                        <option value="Bachelor of Technology" className="bg-[#0f172a]">Bachelor of Technology (B.Tech / B.E.)</option>
                        <option value="Bachelor of Science" className="bg-[#0f172a]">Bachelor of Science (B.S. / B.Sc)</option>
                        <option value="Bachelor of Computer Applications" className="bg-[#0f172a]">Bachelor of Computer Applications (B.C.A.)</option>
                        <option value="Bachelor of Business Administration" className="bg-[#0f172a]">Bachelor of Business Administration (B.B.A. / B.Com)</option>
                        <option value="Master of Science" className="bg-[#0f172a]">Master of Science (M.S. / M.Sc)</option>
                        <option value="Master of Technology" className="bg-[#0f172a]">Master of Technology (M.Tech / M.E.)</option>
                        <option value="Master of Business Administration" className="bg-[#0f172a]">Master of Business Administration (MBA)</option>
                        <option value="Master of Computer Applications" className="bg-[#0f172a]">Master of Computer Applications (M.C.A.)</option>
                        <option value="Doctor of Philosophy (Ph.D.)" className="bg-[#0f172a]">Doctor of Philosophy (Ph.D. / Doctorate)</option>
                        <option value="Post-Doctorate" className="bg-[#0f172a]">Post-Doctorate Fellowship</option>
                        <option value="Professional Certification" className="bg-[#0f172a]">Professional Degree (CA / CS / CFA / MBBS / Law)</option>
                        <option value="Other Qualification" className="bg-[#0f172a]">Other Qualification</option>
                      </select>
                    </div>

                    {/* Degree Title & Major */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">Degree Title & Major</label>
                      <select
                        value={data.academic.degree}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, degree: e.target.value } })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                      >
                        <option value="" className="bg-[#0f172a] text-slate-400">Select Degree & Major...</option>
                        <option value="B.Tech Artificial Intelligence & Machine Learning" className="bg-[#0f172a]">B.Tech Artificial Intelligence & Machine Learning (AI & ML)</option>
                        <option value="B.Tech Artificial Intelligence & Data Science" className="bg-[#0f172a]">B.Tech Artificial Intelligence & Data Science (AI & DS)</option>
                        <option value="B.Tech Computer Science & AI" className="bg-[#0f172a]">B.Tech Computer Science & AI</option>
                        <option value="B.Tech Information Technology" className="bg-[#0f172a]">B.Tech Information Technology (IT)</option>
                        <option value="B.Tech Electronics & Communication" className="bg-[#0f172a]">B.Tech Electronics & Communication (ECE)</option>
                        <option value="B.Tech Mechanical Engineering" className="bg-[#0f172a]">B.Tech Mechanical Engineering</option>
                        <option value="B.S. Data Science & AI" className="bg-[#0f172a]">B.S. Data Science & AI</option>
                        <option value="B.C.A. Computer Applications" className="bg-[#0f172a]">B.C.A. Computer Applications</option>
                        <option value="M.S. Artificial Intelligence & Machine Learning" className="bg-[#0f172a]">M.S. Artificial Intelligence & Machine Learning</option>
                        <option value="M.S. Data Science & Artificial Intelligence" className="bg-[#0f172a]">M.S. Data Science & AI</option>
                        <option value="M.Tech Software Engineering" className="bg-[#0f172a]">M.Tech Software Engineering</option>
                        <option value="MBA Finance & Strategy" className="bg-[#0f172a]">MBA Finance & Strategy</option>
                        <option value="MBA Marketing & Product Management" className="bg-[#0f172a]">MBA Marketing & Product Management</option>
                        <option value="Ph.D. Artificial Intelligence & Machine Learning" className="bg-[#0f172a]">Ph.D. Artificial Intelligence & Machine Learning</option>
                        <option value="Other Major / Custom Degree" className="bg-[#0f172a]">Other Major / Custom Degree</option>
                      </select>
                      {/* If custom is selected or typed */}
                      {(![
                        "",
                        "B.Tech Artificial Intelligence & Machine Learning",
                        "B.Tech Artificial Intelligence & Data Science",
                        "B.Tech Computer Science & AI",
                        "B.Tech Information Technology",
                        "B.Tech Electronics & Communication",
                        "B.Tech Mechanical Engineering",
                        "B.S. Data Science & AI",
                        "B.C.A. Computer Applications",
                        "M.S. Artificial Intelligence & Machine Learning",
                        "M.S. Data Science & Artificial Intelligence",
                        "M.Tech Software Engineering",
                        "MBA Finance & Strategy",
                        "MBA Marketing & Product Management",
                        "Ph.D. Artificial Intelligence & Machine Learning"
                      ].includes(data.academic.degree)) && (
                        <input
                          type="text"
                          value={data.academic.degree}
                          onChange={(e) => setData({ ...data, academic: { ...data.academic, degree: e.target.value } })}
                          placeholder="Or type custom degree title & major..."
                          className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-indigo-400 focus:outline-none"
                        />
                      )}
                    </div>

                    {/* University / Institution */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">University / Institution</label>
                      <select
                        value={data.academic.university}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, university: e.target.value } })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                      >
                        <option value="" className="bg-[#0f172a] text-slate-400">Select University / Institution...</option>
                        <option value="Stanford University" className="bg-[#0f172a]">Stanford University</option>
                        <option value="Massachusetts Institute of Technology (MIT)" className="bg-[#0f172a]">Massachusetts Institute of Technology (MIT)</option>
                        <option value="Carnegie Mellon University (CMU)" className="bg-[#0f172a]">Carnegie Mellon University (CMU)</option>
                        <option value="Harvard University" className="bg-[#0f172a]">Harvard University</option>
                        <option value="Indian Institute of Technology (IIT)" className="bg-[#0f172a]">Indian Institute of Technology (IIT)</option>
                        <option value="National Institute of Technology (NIT)" className="bg-[#0f172a]">National Institute of Technology (NIT)</option>
                        <option value="BITS Pilani" className="bg-[#0f172a]">Birla Institute of Technology & Science (BITS Pilani)</option>
                        <option value="Anna University" className="bg-[#0f172a]">Anna University</option>
                        <option value="Delhi University (DU)" className="bg-[#0f172a]">Delhi University (DU)</option>
                        <option value="Vellore Institute of Technology (VIT)" className="bg-[#0f172a]">Vellore Institute of Technology (VIT)</option>
                        <option value="SRM Institute of Science & Technology" className="bg-[#0f172a]">SRM Institute of Science & Technology</option>
                        <option value="Manipal Academy of Higher Education" className="bg-[#0f172a]">Manipal Academy of Higher Education</option>
                        <option value="Other Institution" className="bg-[#0f172a]">Other Institution / University</option>
                      </select>
                      {(![
                        "",
                        "Stanford University",
                        "Massachusetts Institute of Technology (MIT)",
                        "Carnegie Mellon University (CMU)",
                        "Harvard University",
                        "Indian Institute of Technology (IIT)",
                        "National Institute of Technology (NIT)",
                        "BITS Pilani",
                        "Anna University",
                        "Delhi University (DU)",
                        "Vellore Institute of Technology (VIT)",
                        "SRM Institute of Science & Technology",
                        "Manipal Academy of Higher Education"
                      ].includes(data.academic.university)) && (
                        <input
                          type="text"
                          value={data.academic.university}
                          onChange={(e) => setData({ ...data, academic: { ...data.academic, university: e.target.value } })}
                          placeholder="Or type custom university name..."
                          className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-indigo-400 focus:outline-none"
                        />
                      )}
                    </div>

                    {/* College / School */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">College / Department School</label>
                      <input
                        type="text"
                        value={data.academic.college}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, college: e.target.value } })}
                        placeholder="e.g. School of Computer Engineering"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-indigo-400 focus:outline-none"
                      />
                    </div>

                    {/* CGPA / GPA */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">CGPA / GPA</label>
                      <input
                        type="text"
                        value={data.academic.cgpa}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, cgpa: e.target.value } })}
                        placeholder="e.g. 3.9 / 4.0 or 9.2 / 10"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-indigo-400 focus:outline-none"
                      />
                    </div>

                    {/* Graduation Year */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">Graduation Year</label>
                      <select
                        value={data.academic.graduationYear}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, graduationYear: e.target.value } })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                      >
                        <option value="" className="bg-[#0f172a] text-slate-400">Select Graduation Year...</option>
                        {["2030 (Expected)", "2029 (Expected)", "2028 (Expected)", "2027 (Expected)", "2026 (Expected)", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018 & Earlier"].map((yr) => (
                          <option key={yr} value={yr} className="bg-[#0f172a]">{yr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--border)]/50">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">Research Publications Count</label>
                      <input
                        type="number"
                        value={data.academic.researchPublicationsCount || ""}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, researchPublicationsCount: Number(e.target.value) } })}
                        placeholder="0"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-indigo-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">Patents Count</label>
                      <input
                        type="number"
                        value={data.academic.patentsCount || ""}
                        onChange={(e) => setData({ ...data, academic: { ...data.academic, patentsCount: Number(e.target.value) } })}
                        placeholder="0"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-mono focus:border-indigo-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 2: TECHNICAL SKILLS ================= */}
              {activeStep === 2 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Section 2: Technical Skills Intelligence</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Select technical courses/skills and manually enter your years of experience & project count.</p>
                      </div>
                      <button
                        onClick={() => {
                          const newItem = {
                            id: `skill_${Date.now()}`,
                            name: "Python",
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
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add Technical Skill
                      </button>
                    </div>

                    {/* Quick Add Preset Course Pills */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Add Course / Stack:</span>
                      {[
                        { name: "Python & AI", cat: "AI/ML" },
                        { name: "Machine Learning & PyTorch", cat: "AI/ML" },
                        { name: "React & Next.js", cat: "Frontend" },
                        { name: "Node.js & Backend", cat: "Backend" },
                        { name: "SQL & PostgreSQL", cat: "Data & Analytics" },
                        { name: "Docker & Kubernetes", cat: "Cloud/DevOps" },
                        { name: "AWS Cloud Architecture", cat: "Cloud/DevOps" },
                        { name: "Cybersecurity", cat: "Cybersecurity" },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            const newItem = {
                              id: `skill_${Date.now()}`,
                              name: preset.name,
                              category: preset.cat as any,
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
                          className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20 text-xs font-medium transition-all"
                        >
                          + {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.technicalSkills.length === 0 ? (
                    <div className="p-10 rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/40 text-center space-y-4 shadow-xl">
                      <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit mx-auto">
                        <Code className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">No technical skills or courses added yet</div>
                        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                          Click <strong>+ Add Technical Skill</strong> or select any of the quick-add courses above (e.g., Python, Machine Learning, Next.js, AWS) to calculate your technical capital.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.technicalSkills.map((sk, idx) => (
                        <div key={sk.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 hover:border-sky-500/40 transition-all shadow-xl space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
                            {/* Skill / Course Selector */}
                            <div className="sm:col-span-4 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Course / Tech Stack</label>
                              <select
                                value={sk.name}
                                onChange={(e) => {
                                  const updated = [...data.technicalSkills];
                                  updated[idx].name = e.target.value;
                                  setData({ ...data, technicalSkills: updated });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-indigo-400 focus:outline-none"
                              >
                                <option value="" className="bg-[#0f172a] text-slate-400">Select Tech Course / Stack...</option>
                                <option value="Python & AI" className="bg-[#0f172a]">Python & Artificial Intelligence</option>
                                <option value="Machine Learning & PyTorch" className="bg-[#0f172a]">Machine Learning & PyTorch</option>
                                <option value="Deep Learning & Computer Vision" className="bg-[#0f172a]">Deep Learning & Computer Vision</option>
                                <option value="React & Next.js" className="bg-[#0f172a]">React & Next.js Full-Stack</option>
                                <option value="Node.js & Express" className="bg-[#0f172a]">Node.js & Express Backend</option>
                                <option value="TypeScript & JavaScript" className="bg-[#0f172a]">TypeScript & JavaScript</option>
                                <option value="Java & Spring Boot" className="bg-[#0f172a]">Java & Spring Boot</option>
                                <option value="C++ & Systems Engineering" className="bg-[#0f172a]">C++ & Systems Engineering</option>
                                <option value="SQL & PostgreSQL" className="bg-[#0f172a]">SQL & PostgreSQL Database</option>
                                <option value="Docker & Kubernetes" className="bg-[#0f172a]">Docker & Kubernetes DevOps</option>
                                <option value="AWS Cloud Architecture" className="bg-[#0f172a]">AWS Cloud Architecture</option>
                                <option value="Cybersecurity & Ethical Hacking" className="bg-[#0f172a]">Cybersecurity & Ethical Hacking</option>
                                <option value="Custom Skill" className="bg-[#0f172a]">Custom Tech Skill...</option>
                              </select>
                              {(![
                                "",
                                "Python & AI",
                                "Machine Learning & PyTorch",
                                "Deep Learning & Computer Vision",
                                "React & Next.js",
                                "Node.js & Express",
                                "TypeScript & JavaScript",
                                "Java & Spring Boot",
                                "C++ & Systems Engineering",
                                "SQL & PostgreSQL",
                                "Docker & Kubernetes",
                                "AWS Cloud Architecture",
                                "Cybersecurity & Ethical Hacking"
                              ].includes(sk.name)) && (
                                <input
                                  type="text"
                                  value={sk.name}
                                  onChange={(e) => {
                                    const updated = [...data.technicalSkills];
                                    updated[idx].name = e.target.value;
                                    setData({ ...data, technicalSkills: updated });
                                  }}
                                  placeholder="Type custom skill name..."
                                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-indigo-400 focus:outline-none"
                                />
                              )}
                            </div>

                            {/* Category */}
                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Category</label>
                              <select
                                value={sk.category}
                                onChange={(e) => {
                                  const updated = [...data.technicalSkills];
                                  updated[idx].category = e.target.value as any;
                                  setData({ ...data, technicalSkills: updated });
                                }}
                                className="w-full px-3 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                              >
                                {["AI/ML", "Frontend", "Backend", "Cloud/DevOps", "Data & Analytics", "Cybersecurity", "Mobile", "Other"].map((cat) => (
                                  <option key={cat} value={cat} className="bg-[#0f172a] text-slate-100">{cat}</option>
                                ))}
                              </select>
                            </div>

                            {/* Proficiency Level */}
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Proficiency</label>
                              <select
                                value={sk.level}
                                onChange={(e) => {
                                  const updated = [...data.technicalSkills];
                                  updated[idx].level = e.target.value as SkillLevelOption;
                                  setData({ ...data, technicalSkills: updated });
                                }}
                                className="w-full px-2.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                              >
                                <option value="Beginner" className="bg-[#0f172a]">Beginner</option>
                                <option value="Intermediate" className="bg-[#0f172a]">Intermediate</option>
                                <option value="Advanced" className="bg-[#0f172a]">Advanced</option>
                                <option value="Expert" className="bg-[#0f172a]">Expert</option>
                              </select>
                            </div>

                            {/* Manual Years of Experience Input */}
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Years Experience</label>
                              <input
                                type="number"
                                min={0}
                                max={40}
                                value={sk.yearsExp || ""}
                                onChange={(e) => {
                                  const updated = [...data.technicalSkills];
                                  updated[idx].yearsExp = Number(e.target.value);
                                  setData({ ...data, technicalSkills: updated });
                                }}
                                placeholder="e.g. 2 Yrs"
                                className="w-full px-3 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                              />
                            </div>

                            {/* Delete Button */}
                            <div className="sm:col-span-1 flex items-center justify-end pb-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = data.technicalSkills.filter((_, i) => i !== idx);
                                  setData({ ...data, technicalSkills: updated });
                                }}
                                className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                                title="Remove Skill"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Secondary Row: Projects & Confidence Score */}
                          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-300 font-medium">Projects Built:</span>
                              <input
                                type="number"
                                min={0}
                                value={sk.projectsCount || ""}
                                onChange={(e) => {
                                  const updated = [...data.technicalSkills];
                                  updated[idx].projectsCount = Number(e.target.value);
                                  setData({ ...data, technicalSkills: updated });
                                }}
                                placeholder="0"
                                className="w-16 px-2.5 py-1 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                              />
                            </div>

                            {/* Confidence Rating (1-5 pills) */}
                            <div className="flex items-center gap-2">
                              <span className="text-slate-300 font-medium">Confidence Score:</span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => {
                                      const updated = [...data.technicalSkills];
                                      updated[idx].confidenceScore = star;
                                      setData({ ...data, technicalSkills: updated });
                                    }}
                                    className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${
                                      (sk.confidenceScore || 0) >= star
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300"
                                    }`}
                                  >
                                    {star}
                                  </button>
                                ))}
                              </div>
                            </div>
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
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Section 3: Industry Expertise</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Select industry domains and manually enter your years of experience & project count.</p>
                      </div>
                      <button
                        onClick={() => {
                          const newItem = {
                            id: `ind_${Date.now()}`,
                            industryDomain: "Artificial Intelligence & Deep Learning",
                            yearsExp: 3,
                            projectsCount: 5,
                            expertiseLevel: "Advanced" as const,
                          };
                          setData({ ...data, industryExpertise: [...data.industryExpertise, newItem] });
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add Domain
                      </button>
                    </div>

                    {/* Quick Add Domain Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Add Domain:</span>
                      {[
                        "Artificial Intelligence & Deep Learning",
                        "FinTech & Banking Systems",
                        "Healthcare & MedTech",
                        "E-Commerce & Digital Retail",
                        "Cloud Infrastructure & SaaS",
                        "Cybersecurity & Data Privacy",
                        "EdTech & Learning Platforms",
                      ].map((domainName) => (
                        <button
                          key={domainName}
                          type="button"
                          onClick={() => {
                            const newItem = {
                              id: `ind_${Date.now()}`,
                              industryDomain: domainName,
                              yearsExp: 3,
                              projectsCount: 5,
                              expertiseLevel: "Advanced" as const,
                            };
                            setData({ ...data, industryExpertise: [...data.industryExpertise, newItem] });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20 text-xs font-medium transition-all"
                        >
                          + {domainName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.industryExpertise.length === 0 ? (
                    <div className="p-10 rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/40 text-center space-y-4 shadow-xl">
                      <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit mx-auto">
                        <Briefcase className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">No industry domains added yet</div>
                        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                          Click <strong>+ Add Domain</strong> or select any of the quick-add domains above (e.g., AI & Deep Learning, FinTech, Healthcare, Cloud SaaS) to calculate domain capital.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.industryExpertise.map((item, idx) => (
                        <div key={item.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 hover:border-sky-500/40 transition-all shadow-xl space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
                            {/* Industry Domain Select */}
                            <div className="sm:col-span-5 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Industry Domain</label>
                              <select
                                value={item.industryDomain}
                                onChange={(e) => {
                                  const updated = [...data.industryExpertise];
                                  updated[idx].industryDomain = e.target.value;
                                  setData({ ...data, industryExpertise: updated });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-indigo-400 focus:outline-none"
                              >
                                <option value="" className="bg-[#0f172a] text-slate-400">Select Industry Domain...</option>
                                <option value="Artificial Intelligence & Deep Learning" className="bg-[#0f172a]">Artificial Intelligence & Deep Learning</option>
                                <option value="FinTech & Banking Systems" className="bg-[#0f172a]">FinTech & Banking Systems</option>
                                <option value="Healthcare & MedTech" className="bg-[#0f172a]">Healthcare & MedTech</option>
                                <option value="E-Commerce & Digital Retail" className="bg-[#0f172a]">E-Commerce & Digital Retail</option>
                                <option value="Cloud Infrastructure & SaaS" className="bg-[#0f172a]">Cloud Infrastructure & SaaS</option>
                                <option value="Cybersecurity & Data Privacy" className="bg-[#0f172a]">Cybersecurity & Data Privacy</option>
                                <option value="EdTech & Learning Platforms" className="bg-[#0f172a]">EdTech & Learning Platforms</option>
                                <option value="Automotive & Electric Vehicles" className="bg-[#0f172a]">Automotive & Electric Vehicles</option>
                                <option value="Gaming & Interactive Media" className="bg-[#0f172a]">Gaming & Interactive Media</option>
                                <option value="Supply Chain & Logistics" className="bg-[#0f172a]">Supply Chain & Logistics</option>
                                <option value="Custom Domain" className="bg-[#0f172a]">Custom Industry Domain...</option>
                              </select>
                              {(![
                                "",
                                "Artificial Intelligence & Deep Learning",
                                "FinTech & Banking Systems",
                                "Healthcare & MedTech",
                                "E-Commerce & Digital Retail",
                                "Cloud Infrastructure & SaaS",
                                "Cybersecurity & Data Privacy",
                                "EdTech & Learning Platforms",
                                "Automotive & Electric Vehicles",
                                "Gaming & Interactive Media",
                                "Supply Chain & Logistics"
                              ].includes(item.industryDomain)) && (
                                <input
                                  type="text"
                                  value={item.industryDomain}
                                  onChange={(e) => {
                                    const updated = [...data.industryExpertise];
                                    updated[idx].industryDomain = e.target.value;
                                    setData({ ...data, industryExpertise: updated });
                                  }}
                                  placeholder="Type custom industry domain name..."
                                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-indigo-400 focus:outline-none"
                                />
                              )}
                            </div>

                            {/* Expertise Level */}
                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Expertise Level</label>
                              <select
                                value={item.expertiseLevel}
                                onChange={(e) => {
                                  const updated = [...data.industryExpertise];
                                  updated[idx].expertiseLevel = e.target.value as SkillLevelOption;
                                  setData({ ...data, industryExpertise: updated });
                                }}
                                className="w-full px-3 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                              >
                                <option value="Beginner" className="bg-[#0f172a]">Beginner</option>
                                <option value="Intermediate" className="bg-[#0f172a]">Intermediate</option>
                                <option value="Advanced" className="bg-[#0f172a]">Advanced</option>
                                <option value="Expert" className="bg-[#0f172a]">Expert</option>
                              </select>
                            </div>

                            {/* Manual Years of Experience Input */}
                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Years Experience</label>
                              <input
                                type="number"
                                min={0}
                                max={40}
                                value={item.yearsExp || ""}
                                onChange={(e) => {
                                  const updated = [...data.industryExpertise];
                                  updated[idx].yearsExp = Number(e.target.value);
                                  setData({ ...data, industryExpertise: updated });
                                }}
                                placeholder="e.g. 3 Yrs"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                              />
                            </div>

                            {/* Delete Button */}
                            <div className="sm:col-span-1 flex items-center justify-end pb-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = data.industryExpertise.filter((_, i) => i !== idx);
                                  setData({ ...data, industryExpertise: updated });
                                }}
                                className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                                title="Remove Domain"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Section 4: Digital Competencies & Tools</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Select tool suites you use and set your proficiency level for each digital tool.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newTool: DigitalCompetencyItem = {
                            id: `custom_tool_${Date.now()}`,
                            name: "Custom Software Tool",
                            category: "Productivity",
                            selected: true,
                            proficiency: "Advanced",
                          };
                          setData({ ...data, digitalCompetencies: [...data.digitalCompetencies, newTool] });
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add Custom Tool
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Ensure default list includes expanded toolset if not present */}
                    {(() => {
                      const expandedDefaults: { id: string; name: string; category: DigitalCompetencyItem["category"] }[] = [
                        { id: "d1", name: "Microsoft Excel & Data Analysis", category: "Productivity" },
                        { id: "d2", name: "Figma & UI Prototyping", category: "Design" },
                        { id: "d3", name: "Git & GitHub Workflow", category: "Code & Version" },
                        { id: "d4", name: "ChatGPT & LLM Prompt Engineering", category: "AI Tools" },
                        { id: "d4_2", name: "Claude & Cursor Agentic Coding", category: "AI Tools" },
                        { id: "d5", name: "VS Code & Agentic Workflows", category: "Code & Version" },
                        { id: "d6", name: "Notion Workspaces & Docs", category: "Productivity" },
                        { id: "d7", name: "Docker & Containerization", category: "Cloud & Containers" },
                        { id: "d8", name: "Jira & Agile Work Tracking", category: "Management" },
                        { id: "d9", name: "Postman & API Testing", category: "Code & Version" },
                        { id: "d10", name: "Slack & Modern Collaboration", category: "Productivity" },
                        { id: "d11", name: "Tableau & PowerBI Visualizations", category: "Productivity" },
                      ];

                      // Merge defaults into state list if missing
                      const existingIds = new Set(data.digitalCompetencies.map((t) => t.id));
                      const missingDefaults: DigitalCompetencyItem[] = expandedDefaults.filter((d) => !existingIds.has(d.id)).map((d) => ({
                        ...d,
                        selected: false,
                        proficiency: "Intermediate",
                      }));

                      const displayList = [...data.digitalCompetencies, ...missingDefaults];

                      return displayList.map((tool) => {
                        const idx = data.digitalCompetencies.findIndex((t) => t.id === tool.id);
                        const isExisting = idx !== -1;
                        const isSelected = isExisting ? data.digitalCompetencies[idx].selected : false;
                        const currentProficiency = isExisting ? data.digitalCompetencies[idx].proficiency || "Intermediate" : "Intermediate";

                        return (
                          <div
                            key={tool.id}
                            className={`p-4 rounded-2xl border text-xs transition-all shadow-md space-y-2.5 ${
                              isSelected
                                ? "bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border-indigo-400 text-white font-bold ring-1 ring-indigo-400/40"
                                : "bg-slate-900/80 border-slate-700/60 text-slate-300 hover:border-sky-500/40"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="space-y-0.5 min-w-0">
                                {isExisting && tool.id.startsWith("custom_tool_") ? (
                                  <input
                                    type="text"
                                    value={tool.name}
                                    onChange={(e) => {
                                      const updated = [...data.digitalCompetencies];
                                      updated[idx].name = e.target.value;
                                      setData({ ...data, digitalCompetencies: updated });
                                    }}
                                    placeholder="Tool name..."
                                    className="px-2 py-1 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs text-white font-bold focus:border-indigo-400 focus:outline-none"
                                  />
                                ) : (
                                  <div className="font-bold text-sm text-white">{tool.name}</div>
                                )}
                                <span className="text-[11px] font-medium text-slate-400 block">{tool.category}</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  if (isExisting) {
                                    const updated = [...data.digitalCompetencies];
                                    updated[idx].selected = !updated[idx].selected;
                                    setData({ ...data, digitalCompetencies: updated });
                                  } else {
                                    const newItem: DigitalCompetencyItem = {
                                      ...tool,
                                      selected: true,
                                      proficiency: "Intermediate",
                                    };
                                    setData({ ...data, digitalCompetencies: [...data.digitalCompetencies, newItem] });
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0 ${
                                  isSelected
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                                }`}
                              >
                                {isSelected ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Selected
                                  </>
                                ) : (
                                  "+ Select"
                                )}
                              </button>
                            </div>

                            {/* Inline Proficiency Selector when tool is selected */}
                            {isSelected && (
                              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                                <span className="text-slate-300 font-medium shrink-0">Proficiency:</span>
                                <div className="flex items-center gap-1 flex-wrap">
                                  {(["Beginner", "Intermediate", "Advanced", "Expert"] as const).map((lvl) => (
                                    <button
                                      key={lvl}
                                      type="button"
                                      onClick={() => {
                                        if (isExisting) {
                                          const updated = [...data.digitalCompetencies];
                                          updated[idx].proficiency = lvl;
                                          setData({ ...data, digitalCompetencies: updated });
                                        }
                                      }}
                                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                                        currentProficiency === lvl
                                          ? "bg-indigo-600 text-white shadow-sm"
                                          : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
                                      }`}
                                    >
                                      {lvl}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* ================= SECTION 5: COMMUNICATION & LANGUAGES ================= */}
              {activeStep === 5 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Section 5: Communication & Languages</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Multilingual capabilities, public speaking, & executive presentation ratings.</p>
                      </div>
                      <button
                        type="button"
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
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add Language
                      </button>
                    </div>

                    {/* Quick Add Language Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Add Language:</span>
                      {[
                        { name: "English", prof: "Native" },
                        { name: "Hindi", prof: "Native" },
                        { name: "Spanish", prof: "Professional" },
                        { name: "German", prof: "Intermediate" },
                        { name: "French", prof: "Intermediate" },
                        { name: "Japanese", prof: "Intermediate" },
                        { name: "Tamil", prof: "Native" },
                        { name: "Telugu", prof: "Native" },
                      ].map((langPreset) => (
                        <button
                          key={langPreset.name}
                          type="button"
                          onClick={() => {
                            const newItem = {
                              id: `lang_${Date.now()}`,
                              language: langPreset.name,
                              read: true,
                              write: true,
                              speak: true,
                              proficiency: langPreset.prof as any,
                            };
                            setData({ ...data, languages: [...data.languages, newItem] });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20 text-xs font-medium transition-all"
                        >
                          + {langPreset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multilingual Capabilities List */}
                  {data.languages.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-200">Multilingual Fluency & Capabilities</h3>
                      {data.languages.map((lng, idx) => (
                        <div key={lng.id} className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
                          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            {/* Language Name Dropdown / Input */}
                            <select
                              value={lng.language}
                              onChange={(e) => {
                                const updated = [...data.languages];
                                updated[idx].language = e.target.value;
                                setData({ ...data, languages: updated });
                              }}
                              className="px-3.5 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-bold focus:border-indigo-400 focus:outline-none"
                            >
                              <option value="English" className="bg-[#0f172a]">English</option>
                              <option value="Hindi" className="bg-[#0f172a]">Hindi</option>
                              <option value="Spanish" className="bg-[#0f172a]">Spanish</option>
                              <option value="German" className="bg-[#0f172a]">German</option>
                              <option value="French" className="bg-[#0f172a]">French</option>
                              <option value="Japanese" className="bg-[#0f172a]">Japanese</option>
                              <option value="Mandarin Chinese" className="bg-[#0f172a]">Mandarin Chinese</option>
                              <option value="Tamil" className="bg-[#0f172a]">Tamil</option>
                              <option value="Telugu" className="bg-[#0f172a]">Telugu</option>
                              <option value="Kannada" className="bg-[#0f172a]">Kannada</option>
                              <option value="Malayalam" className="bg-[#0f172a]">Malayalam</option>
                              <option value="Bengali" className="bg-[#0f172a]">Bengali</option>
                              <option value="Custom Language" className="bg-[#0f172a]">Custom Language...</option>
                            </select>

                            <select
                              value={lng.proficiency}
                              onChange={(e) => {
                                const updated = [...data.languages];
                                updated[idx].proficiency = e.target.value as LanguageProficiencyOption;
                                setData({ ...data, languages: updated });
                              }}
                              className="px-3.5 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-slate-200 font-semibold focus:border-indigo-400 focus:outline-none"
                            >
                              <option value="Native" className="bg-[#0f172a]">Native / Bilingual</option>
                              <option value="Professional" className="bg-[#0f172a]">Professional Fluent</option>
                              <option value="Intermediate" className="bg-[#0f172a]">Intermediate / Conversational</option>
                              <option value="Basic" className="bg-[#0f172a]">Basic / Elementary</option>
                            </select>
                          </div>

                          {/* Read / Write / Speak Toggles */}
                          <div className="flex items-center gap-2">
                            {[
                              { key: "read", label: "Read" },
                              { key: "write", label: "Write" },
                              { key: "speak", label: "Speak" },
                            ].map((cap) => {
                              const isActive = (lng as any)[cap.key];
                              return (
                                <button
                                  key={cap.key}
                                  type="button"
                                  onClick={() => {
                                    const updated = [...data.languages];
                                    (updated[idx] as any)[cap.key] = !isActive;
                                    setData({ ...data, languages: updated });
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                                    isActive
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                      : "bg-slate-950 text-slate-500 border border-slate-800 hover:text-slate-300"
                                  }`}
                                >
                                  ✓ {cap.label}
                                </button>
                              );
                            })}

                            <button
                              type="button"
                              onClick={() => {
                                const updated = data.languages.filter((_, i) => i !== idx);
                                setData({ ...data, languages: updated });
                              }}
                              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all ml-1"
                              title="Remove Language"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Communication Self-Assessment Ratings */}
                  <div className="pt-3 space-y-3.5 border-t border-[var(--border)]">
                    <h3 className="text-xs font-bold text-slate-200">Communication & Interpersonal Self-Assessment</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { key: "communicationConfidence", label: "General Communication Confidence" },
                        { key: "presentationSkills", label: "Executive Presentation Skills" },
                        { key: "publicSpeaking", label: "Public Speaking & Keynote Ability" },
                        { key: "businessWriting", label: "Business Writing & Tech Specs" },
                      ].map((item) => {
                        const val = (data.communication as any)[item.key] || 3;
                        return (
                          <div key={item.key} className="p-4 rounded-3xl bg-slate-900/90 border border-slate-700/60 space-y-2.5 shadow-lg">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-slate-200">{item.label}</span>
                              <span className="font-mono font-bold text-sky-400 text-xs">{val} / 5</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((lvl) => {
                                let pillColor = "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white";
                                if (val === lvl) {
                                  if (lvl >= 5) pillColor = "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg";
                                  else if (lvl === 4) pillColor = "bg-indigo-600 text-white font-bold shadow-md";
                                  else if (lvl === 3) pillColor = "bg-sky-500/20 text-sky-300 border border-sky-400/40 font-bold";
                                  else pillColor = "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold";
                                }

                                return (
                                  <button
                                    key={lvl}
                                    type="button"
                                    onClick={() =>
                                      setData({
                                        ...data,
                                        communication: { ...data.communication, [item.key]: lvl },
                                      })
                                    }
                                    className={`flex-1 py-1.5 rounded-xl text-xs transition-all ${pillColor}`}
                                  >
                                    {lvl}
                                  </button>
                                );
                              })}
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
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Section 6: Professional Certifications</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Select verified credentials (AWS, Google Cloud, CFA, PMP, DeepLearning.AI, Meta).</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newItem = {
                            id: `cert_${Date.now()}`,
                            name: "AWS Certified Solutions Architect",
                            provider: "Amazon Web Services (AWS)",
                            category: "Cloud & DevOps" as const,
                            issueDate: "2026",
                            expiryDate: "Lifetime",
                            credentialId: "",
                            verificationUrl: "",
                          };
                          setData({ ...data, certifications: [...data.certifications, newItem] });
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add Certification
                      </button>
                    </div>

                    {/* Quick Add Certification Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Add Certification:</span>
                      {[
                        { name: "AWS Certified Solutions Architect", provider: "Amazon Web Services (AWS)", cat: "Cloud & DevOps" },
                        { name: "Google Cloud Data Engineer", provider: "Google Cloud (GCP)", cat: "AI & Data" },
                        { name: "DeepLearning.AI ML Specialization", provider: "DeepLearning.AI / Coursera", cat: "AI & Data" },
                        { name: "Meta Front-End Developer", provider: "Meta", cat: "Software Engineering" },
                        { name: "PMP Project Management", provider: "PMI", cat: "Finance & Management" },
                        { name: "CFA Chartered Financial Analyst", provider: "CFA Institute", cat: "Finance & Management" },
                        { name: "CompTIA Security+", provider: "CompTIA", cat: "Cybersecurity" },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            const newItem = {
                              id: `cert_${Date.now()}`,
                              name: preset.name,
                              provider: preset.provider,
                              category: preset.cat as any,
                              issueDate: "2026",
                              expiryDate: "Lifetime",
                              credentialId: "",
                              verificationUrl: "",
                            };
                            setData({ ...data, certifications: [...data.certifications, newItem] });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20 text-xs font-medium transition-all"
                        >
                          + {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.certifications.length === 0 ? (
                    <div className="p-10 rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/40 text-center space-y-4 shadow-xl">
                      <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit mx-auto">
                        <Award className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">No certifications added yet</div>
                        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                          Click <strong>+ Add Certification</strong> or select any of the quick-add presets above (e.g., AWS, GCP, DeepLearning.AI, PMP) to boost your capital score.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.certifications.map((crt, idx) => (
                        <div key={crt.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 hover:border-sky-500/40 transition-all shadow-xl space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
                            {/* Certification Name Dropdown / Custom Text */}
                            <div className="sm:col-span-4 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Certification Title</label>
                              <select
                                value={crt.name}
                                onChange={(e) => {
                                  const updated = [...data.certifications];
                                  updated[idx].name = e.target.value;
                                  setData({ ...data, certifications: updated });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-indigo-400 focus:outline-none"
                              >
                                <option value="" className="bg-[#0f172a] text-slate-400">Select Certification...</option>
                                <option value="AWS Certified Solutions Architect" className="bg-[#0f172a]">AWS Certified Solutions Architect</option>
                                <option value="Google Cloud Professional Data Engineer" className="bg-[#0f172a]">Google Cloud Professional Data Engineer</option>
                                <option value="DeepLearning.AI Machine Learning Specialization" className="bg-[#0f172a]">DeepLearning.AI Machine Learning Specialization</option>
                                <option value="Meta Front-End Developer Professional Certificate" className="bg-[#0f172a]">Meta Front-End Developer Professional Certificate</option>
                                <option value="PMP Project Management Professional" className="bg-[#0f172a]">PMP Project Management Professional</option>
                                <option value="CFA Chartered Financial Analyst" className="bg-[#0f172a]">CFA Chartered Financial Analyst</option>
                                <option value="CompTIA Security+ Certification" className="bg-[#0f172a]">CompTIA Security+ Certification</option>
                                <option value="Microsoft Certified: Azure Administrator" className="bg-[#0f172a]">Microsoft Certified: Azure Administrator</option>
                                <option value="Certified Ethical Hacker (CEH)" className="bg-[#0f172a]">Certified Ethical Hacker (CEH)</option>
                                <option value="Custom Certification" className="bg-[#0f172a]">Custom Certification...</option>
                              </select>
                              {(![
                                "",
                                "AWS Certified Solutions Architect",
                                "Google Cloud Professional Data Engineer",
                                "DeepLearning.AI Machine Learning Specialization",
                                "Meta Front-End Developer Professional Certificate",
                                "PMP Project Management Professional",
                                "CFA Chartered Financial Analyst",
                                "CompTIA Security+ Certification",
                                "Microsoft Certified: Azure Administrator",
                                "Certified Ethical Hacker (CEH)"
                              ].includes(crt.name)) && (
                                <input
                                  type="text"
                                  value={crt.name}
                                  onChange={(e) => {
                                    const updated = [...data.certifications];
                                    updated[idx].name = e.target.value;
                                    setData({ ...data, certifications: updated });
                                  }}
                                  placeholder="Type custom certification title..."
                                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-indigo-400 focus:outline-none"
                                />
                              )}
                            </div>

                            {/* Issuing Provider Dropdown / Input */}
                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Issuing Provider</label>
                              <select
                                value={crt.provider}
                                onChange={(e) => {
                                  const updated = [...data.certifications];
                                  updated[idx].provider = e.target.value;
                                  setData({ ...data, certifications: updated });
                                }}
                                className="w-full px-3 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                              >
                                <option value="Amazon Web Services (AWS)" className="bg-[#0f172a]">Amazon Web Services (AWS)</option>
                                <option value="Google Cloud Platform (GCP)" className="bg-[#0f172a]">Google Cloud Platform (GCP)</option>
                                <option value="DeepLearning.AI / Coursera" className="bg-[#0f172a]">DeepLearning.AI / Coursera</option>
                                <option value="Project Management Institute (PMI)" className="bg-[#0f172a]">Project Management Institute (PMI)</option>
                                <option value="CFA Institute" className="bg-[#0f172a]">CFA Institute</option>
                                <option value="Microsoft" className="bg-[#0f172a]">Microsoft</option>
                                <option value="Meta" className="bg-[#0f172a]">Meta</option>
                                <option value="CompTIA" className="bg-[#0f172a]">CompTIA</option>
                                <option value="Custom Provider" className="bg-[#0f172a]">Custom Provider...</option>
                              </select>
                            </div>

                            {/* Issue Year */}
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Issue Year</label>
                              <select
                                value={crt.issueDate || "2026"}
                                onChange={(e) => {
                                  const updated = [...data.certifications];
                                  updated[idx].issueDate = e.target.value;
                                  setData({ ...data, certifications: updated });
                                }}
                                className="w-full px-2.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                              >
                                {["2026", "2025", "2024", "2023", "2022", "2021 & Earlier"].map((yr) => (
                                  <option key={yr} value={yr} className="bg-[#0f172a]">{yr}</option>
                                ))}
                              </select>
                            </div>

                            {/* Verification Link / Credential ID */}
                            <div className="sm:col-span-2 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Verification URL</label>
                              <input
                                type="text"
                                value={crt.verificationUrl}
                                onChange={(e) => {
                                  const updated = [...data.certifications];
                                  updated[idx].verificationUrl = e.target.value;
                                  setData({ ...data, certifications: updated });
                                }}
                                placeholder="https://..."
                                className="w-full px-3 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono focus:border-indigo-400 focus:outline-none"
                              />
                            </div>

                            {/* Delete Button */}
                            <div className="sm:col-span-1 flex items-center justify-end pb-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = data.certifications.filter((_, i) => i !== idx);
                                  setData({ ...data, certifications: updated });
                                }}
                                className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                                title="Remove Certification"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Section 7: Projects & Portfolio</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Open-source software, AI systems, full-stack apps, & production repos.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newItem = {
                            id: `proj_${Date.now()}`,
                            name: "AI Agent & RAG System",
                            role: "Lead Architect",
                            durationMonths: 6,
                            category: "Professional" as const,
                            techStack: ["Next.js", "PyTorch", "Supabase"],
                            description: "",
                            teamSize: 3,
                            impact: "",
                            githubUrl: "",
                            liveDemoUrl: "",
                          };
                          setData({ ...data, projects: [...data.projects, newItem] });
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add Project
                      </button>
                    </div>

                    {/* Quick Add Project Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Add Project:</span>
                      {[
                        { name: "AI Agent & RAG System", role: "Lead AI Architect", cat: "Research" },
                        { name: "Full-Stack E-Commerce App", role: "Lead Fullstack Architect", cat: "Professional" },
                        { name: "FinTech Wealth Dashboard", role: "Frontend Engineer", cat: "Startup" },
                        { name: "Real-Time Chat Platform", role: "Backend Developer", cat: "Open Source" },
                        { name: "Computer Vision Classifier", role: "ML Engineer", cat: "Hackathon" },
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            const newItem = {
                              id: `proj_${Date.now()}`,
                              name: preset.name,
                              role: preset.role,
                              durationMonths: 6,
                              category: preset.cat as any,
                              techStack: [],
                              description: "",
                              teamSize: 3,
                              impact: "",
                              githubUrl: "",
                              liveDemoUrl: "",
                            };
                            setData({ ...data, projects: [...data.projects, newItem] });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20 text-xs font-medium transition-all"
                        >
                          + {preset.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.projects.length === 0 ? (
                    <div className="p-10 rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/40 text-center space-y-4 shadow-xl">
                      <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit mx-auto">
                        <FolderGit2 className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">No projects added yet</div>
                        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                          Click <strong>+ Add Project</strong> or select any of the quick-add presets above (e.g., AI RAG System, E-Commerce App, FinTech Dashboard) to showcase your portfolio.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {data.projects.map((prj, idx) => (
                        <div key={prj.id} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 hover:border-sky-500/40 transition-all shadow-xl space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
                            {/* Project Name Selector */}
                            <div className="sm:col-span-4 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Project Title</label>
                              <select
                                value={prj.name}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[idx].name = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-indigo-400 focus:outline-none"
                              >
                                <option value="" className="bg-[#0f172a] text-slate-400">Select Project Title...</option>
                                <option value="AI Agent & RAG System" className="bg-[#0f172a]">AI Agent & RAG System</option>
                                <option value="Full-Stack E-Commerce Platform" className="bg-[#0f172a]">Full-Stack E-Commerce Platform</option>
                                <option value="FinTech Wealth Dashboard" className="bg-[#0f172a]">FinTech Wealth Dashboard</option>
                                <option value="Real-Time Chat & Collaboration App" className="bg-[#0f172a]">Real-Time Chat & Collaboration App</option>
                                <option value="Computer Vision Object Classifier" className="bg-[#0f172a]">Computer Vision Object Classifier</option>
                                <option value="Mobile Fitness & Health Tracker" className="bg-[#0f172a]">Mobile Fitness & Health Tracker</option>
                                <option value="Custom Project" className="bg-[#0f172a]">Custom Project...</option>
                              </select>
                              {(![
                                "",
                                "AI Agent & RAG System",
                                "Full-Stack E-Commerce Platform",
                                "FinTech Wealth Dashboard",
                                "Real-Time Chat & Collaboration App",
                                "Computer Vision Object Classifier",
                                "Mobile Fitness & Health Tracker"
                              ].includes(prj.name)) && (
                                <input
                                  type="text"
                                  value={prj.name}
                                  onChange={(e) => {
                                    const updated = [...data.projects];
                                    updated[idx].name = e.target.value;
                                    setData({ ...data, projects: updated });
                                  }}
                                  placeholder="Type custom project title..."
                                  className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-indigo-400 focus:outline-none"
                                />
                              )}
                            </div>

                            {/* Role Dropdown / Input */}
                            <div className="sm:col-span-4 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Role / Responsibility</label>
                              <select
                                value={prj.role}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[idx].role = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                              >
                                <option value="Lead Fullstack Architect" className="bg-[#0f172a]">Lead Fullstack Architect</option>
                                <option value="Lead AI/ML Engineer" className="bg-[#0f172a]">Lead AI/ML Engineer</option>
                                <option value="Backend Developer" className="bg-[#0f172a]">Backend Developer</option>
                                <option value="Frontend Developer" className="bg-[#0f172a]">Frontend Developer</option>
                                <option value="Solo Founder / Creator" className="bg-[#0f172a]">Solo Founder / Creator</option>
                                <option value="Custom Role" className="bg-[#0f172a]">Custom Role...</option>
                              </select>
                            </div>

                            {/* Category */}
                            <div className="sm:col-span-3 space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Category</label>
                              <select
                                value={prj.category}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[idx].category = e.target.value as ProjectCategoryOption;
                                  setData({ ...data, projects: updated });
                                }}
                                className="w-full px-3 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-semibold focus:border-indigo-400 focus:outline-none"
                              >
                                {["Professional", "Open Source", "Research", "Startup", "Hackathon", "Academic"].map((cat) => (
                                  <option key={cat} value={cat} className="bg-[#0f172a]">{cat}</option>
                                ))}
                              </select>
                            </div>

                            {/* Delete Button */}
                            <div className="sm:col-span-1 flex items-center justify-end pb-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = data.projects.filter((_, i) => i !== idx);
                                  setData({ ...data, projects: updated });
                                }}
                                className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                                title="Remove Project"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* GitHub & Live Demo URL Inputs */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">GitHub Repository URL</label>
                              <input
                                type="text"
                                value={prj.githubUrl || ""}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[idx].githubUrl = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                placeholder="https://github.com/..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono focus:border-indigo-400 focus:outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-300 block">Live Production Demo URL</label>
                              <input
                                type="text"
                                value={prj.liveDemoUrl || ""}
                                onChange={(e) => {
                                  const updated = [...data.projects];
                                  updated[idx].liveDemoUrl = e.target.value;
                                  setData({ ...data, projects: updated });
                                }}
                                placeholder="https://..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono focus:border-indigo-400 focus:outline-none"
                              />
                            </div>
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
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 8: Work Experience & Career History</h2>
                      <p className="text-xs text-[var(--subtext)] font-sans">Select your primary career persona: Employee, Student, Founder, or Freelancer.</p>
                    </div>

                    {/* Persona Mode Tabs */}
                    <div className="flex flex-wrap gap-2 pt-1">
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
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                            data.workExperience.persona === persona
                              ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/50"
                              : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-sky-500/40"
                          }`}
                        >
                          {persona} Mode
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.workExperience.persona === "Employee" && (
                    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Company Name Select / Input */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 block">Company / Organization Name</label>
                          <select
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
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-indigo-400 focus:outline-none"
                          >
                            <option value="" className="bg-[#0f172a] text-slate-400">Select Company or Government Dept...</option>
                            <optgroup label="Government & Public Sector (PSU)" className="bg-[#0f172a] text-sky-400 font-bold">
                              <option value="Indian Government Job (Central / State Dept)" className="bg-[#0f172a] text-white">Indian Government Job (Central / State Dept)</option>
                              <option value="Public Sector Undertaking (PSU / ISRO / DRDO / BHEL / ONGC / NTPC)" className="bg-[#0f172a] text-white">Public Sector Undertaking (PSU / ISRO / DRDO / BHEL / ONGC / NTPC)</option>
                              <option value="Public Sector Bank (SBI / PNB / Bank PO)" className="bg-[#0f172a] text-white">Public Sector Bank (SBI / PNB / Bank PO)</option>
                            </optgroup>
                            <optgroup label="Indian IT & Tech Leaders" className="bg-[#0f172a] text-indigo-400 font-bold">
                              <option value="Tata Consultancy Services (TCS)" className="bg-[#0f172a] text-white">Tata Consultancy Services (TCS)</option>
                              <option value="Infosys" className="bg-[#0f172a] text-white">Infosys</option>
                              <option value="Wipro" className="bg-[#0f172a] text-white">Wipro</option>
                              <option value="HCLTech" className="bg-[#0f172a] text-white">HCLTech</option>
                              <option value="Tech Mahindra" className="bg-[#0f172a] text-white">Tech Mahindra</option>
                              <option value="LTIMindtree" className="bg-[#0f172a] text-white">LTIMindtree</option>
                              <option value="Zoho Corporation" className="bg-[#0f172a] text-white">Zoho Corporation</option>
                              <option value="Freshworks" className="bg-[#0f172a] text-white">Freshworks</option>
                            </optgroup>
                            <optgroup label="Indian Conglomerates & Unicorns" className="bg-[#0f172a] text-emerald-400 font-bold">
                              <option value="Reliance Industries / Jio" className="bg-[#0f172a] text-white">Reliance Industries / Jio</option>
                              <option value="Tata Group / Tata Motors" className="bg-[#0f172a] text-white">Tata Group / Tata Motors</option>
                              <option value="Adani Group" className="bg-[#0f172a] text-white">Adani Group</option>
                              <option value="Flipkart" className="bg-[#0f172a] text-white">Flipkart</option>
                              <option value="Zomato / Swiggy" className="bg-[#0f172a] text-white">Zomato / Swiggy</option>
                              <option value="Paytm / Razorpay" className="bg-[#0f172a] text-white">Paytm / Razorpay</option>
                              <option value="HDFC Bank / ICICI Bank / Axis Bank" className="bg-[#0f172a] text-white">HDFC Bank / ICICI Bank / Axis Bank</option>
                            </optgroup>
                            <optgroup label="Global Tech MNCs" className="bg-[#0f172a] text-amber-400 font-bold">
                              <option value="Google India" className="bg-[#0f172a] text-white">Google India</option>
                              <option value="Microsoft India" className="bg-[#0f172a] text-white">Microsoft India</option>
                              <option value="Amazon India / AWS" className="bg-[#0f172a] text-white">Amazon India / AWS</option>
                              <option value="Meta / Apple / NVIDIA" className="bg-[#0f172a] text-white">Meta / Apple / NVIDIA</option>
                              <option value="Accenture India / Cognizant" className="bg-[#0f172a] text-white">Accenture India / Cognizant</option>
                            </optgroup>
                            <option value="Custom Company / Government Dept" className="bg-[#0f172a] text-slate-300">Custom Company / Government Dept...</option>
                          </select>
                          {(![
                            "",
                            "Tata Consultancy Services (TCS)",
                            "Infosys",
                            "Wipro",
                            "HCLTech",
                            "Tech Mahindra",
                            "LTIMindtree",
                            "Zoho Corporation",
                            "Freshworks",
                            "Reliance Industries / Jio",
                            "Tata Group / Tata Motors",
                            "Adani Group",
                            "Flipkart",
                            "Zomato / Swiggy",
                            "Paytm / Razorpay",
                            "HDFC Bank / ICICI Bank / Axis Bank",
                            "Google India",
                            "Microsoft India",
                            "Amazon India / AWS",
                            "Meta / Apple / NVIDIA",
                            "Accenture India / Cognizant"
                          ].includes(data.workExperience.employee.company)) && (
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
                              placeholder="Type Govt Dept / Ministry / Company name..."
                              className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-bold focus:border-indigo-400 focus:outline-none"
                            />
                          )}
                        </div>

                        {/* Current Role / Designation */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 block">Current Role / Designation</label>
                          <select
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
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-indigo-400 focus:outline-none"
                          >
                            <option value="" className="bg-[#0f172a] text-slate-400">Select Role / Designation...</option>
                            <option value="Senior AI Solutions Architect" className="bg-[#0f172a]">Senior AI Solutions Architect</option>
                            <option value="Software Development Engineer (SDE)" className="bg-[#0f172a]">Software Development Engineer (SDE)</option>
                            <option value="Staff Full-Stack Engineer" className="bg-[#0f172a]">Staff Full-Stack Engineer</option>
                            <option value="Data Scientist & ML Lead" className="bg-[#0f172a]">Data Scientist & ML Lead</option>
                            <option value="Product Manager" className="bg-[#0f172a]">Product Manager</option>
                            <option value="Financial Analyst" className="bg-[#0f172a]">Financial Analyst</option>
                            <option value="Custom Designation" className="bg-[#0f172a]">Custom Designation...</option>
                          </select>
                          {(![
                            "",
                            "Senior AI Solutions Architect",
                            "Software Development Engineer (SDE)",
                            "Staff Full-Stack Engineer",
                            "Data Scientist & ML Lead",
                            "Product Manager",
                            "Financial Analyst"
                          ].includes(data.workExperience.employee.role)) && (
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
                              placeholder="Type custom role title..."
                              className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-indigo-400 focus:outline-none"
                            />
                          )}
                        </div>

                        {/* Total Years Experience */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 block">Total Years Experience</label>
                          <input
                            type="number"
                            min={0}
                            max={50}
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
                            placeholder="e.g. 4 Yrs"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                          />
                        </div>

                        {/* Promotions Earned */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 block">Promotions Earned</label>
                          <input
                            type="number"
                            min={0}
                            max={20}
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
                            placeholder="e.g. 2"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {data.workExperience.persona === "Student" && (
                    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Internships & Industrial Training</label>
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
                          placeholder="e.g. Software Engineering Intern at TCS / Infosys / ISRO (3 Months)"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-bold focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {data.workExperience.persona === "Founder" && (
                    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 block">Startup / Company Name</label>
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
                            placeholder="e.g. ValuationAI India"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-bold focus:border-indigo-400 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 block">Revenue / ARR Stage (INR ₹)</label>
                          <select
                            value={data.workExperience.founder.revenueStage || "Pre-Revenue"}
                            onChange={(e) =>
                              setData({
                                ...data,
                                workExperience: {
                                  ...data.workExperience,
                                  founder: { ...data.workExperience.founder, revenueStage: e.target.value },
                                },
                              })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-semibold focus:border-indigo-400 focus:outline-none"
                          >
                            <option value="Pre-Revenue" className="bg-[#0f172a]">Pre-Revenue / Idea Stage</option>
                            <option value="₹10 Lakh - ₹50 Lakh ARR" className="bg-[#0f172a]">₹10 Lakh - ₹50 Lakh ARR</option>
                            <option value="₹50 Lakh - ₹2 Crore ARR" className="bg-[#0f172a]">₹50 Lakh - ₹2 Crore ARR</option>
                            <option value="₹2 Crore - ₹10 Crore ARR" className="bg-[#0f172a]">₹2 Crore - ₹10 Crore ARR</option>
                            <option value="₹10 Crore+ Scaleup ARR" className="bg-[#0f172a]">₹10 Crore+ Scaleup ARR</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {data.workExperience.persona === "Freelancer" && (
                    <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-300 block">Client Projects Delivered</label>
                          <input
                            type="number"
                            min={0}
                            value={data.workExperience.freelancer.projectsCompleted || ""}
                            onChange={(e) =>
                              setData({
                                ...data,
                                workExperience: {
                                  ...data.workExperience,
                                  freelancer: { ...data.workExperience.freelancer, projectsCompleted: Number(e.target.value) },
                                },
                              })
                            }
                            placeholder="e.g. 15 Projects"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ================= SECTION 9: LEADERSHIP & IMPACT ================= */}
              {activeStep === 9 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Section 9: Leadership & Social Impact</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Add leadership positions (Class Rep, Dept President/VP, Club Lead, Team Lead) one by one.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          // Parse or add to roles list
                          let roles: any[] = [];
                          try {
                            roles = JSON.parse(data.leadership.leadershipPositions || "[]");
                            if (!Array.isArray(roles)) roles = [];
                          } catch {
                            roles = data.leadership.leadershipPositions ? [{ id: "l1", title: data.leadership.leadershipPositions, org: "", teamSize: 50, tenure: "2025 - 2026" }] : [];
                          }

                          const newRole = {
                            id: `lead_${Date.now()}`,
                            title: "Class Representative (CR)",
                            org: "Department of Computer Science",
                            teamSize: 60,
                            tenure: "2025 - 2026",
                          };

                          const updatedRoles = [...roles, newRole];
                          setData({
                            ...data,
                            leadership: {
                              ...data.leadership,
                              leadershipPositions: JSON.stringify(updatedRoles),
                            },
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add Leadership Role
                      </button>
                    </div>

                    {/* Quick Add Leadership Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Add Role:</span>
                      {[
                        { title: "Class Representative (CR)", size: 60 },
                        { title: "Department President", size: 300 },
                        { title: "Department Vice-President", size: 300 },
                        { title: "Sports Captain / Football Captain", size: 30 },
                        { title: "Student Council Secretary", size: 500 },
                        { title: "Technical Club Lead / Head", size: 45 },
                        { title: "Cultural Fest Coordinator", size: 120 },
                        { title: "Engineering Team Lead", size: 8 },
                      ].map((preset) => (
                        <button
                          key={preset.title}
                          type="button"
                          onClick={() => {
                            let roles: any[] = [];
                            try {
                              roles = JSON.parse(data.leadership.leadershipPositions || "[]");
                              if (!Array.isArray(roles)) roles = [];
                            } catch {
                              roles = [];
                            }

                            const newRole = {
                              id: `lead_${Date.now()}`,
                              title: preset.title,
                              org: "College / Organization",
                              teamSize: preset.size,
                              tenure: "2025 - 2026",
                            };

                            const updatedRoles = [...roles, newRole];
                            setData({
                              ...data,
                              leadership: {
                                ...data.leadership,
                                leadershipPositions: JSON.stringify(updatedRoles),
                              },
                            });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20 text-xs font-medium transition-all"
                        >
                          + {preset.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Render Added Leadership Roles List */}
                  {(() => {
                    let roles: any[] = [];
                    try {
                      roles = JSON.parse(data.leadership.leadershipPositions || "[]");
                      if (!Array.isArray(roles)) {
                        roles = data.leadership.leadershipPositions ? [{ id: "l1", title: data.leadership.leadershipPositions, org: "", teamSize: 50, tenure: "2025 - 2026" }] : [];
                      }
                    } catch {
                      roles = data.leadership.leadershipPositions ? [{ id: "l1", title: data.leadership.leadershipPositions, org: "", teamSize: 50, tenure: "2025 - 2026" }] : [];
                    }

                    if (roles.length === 0) {
                      return (
                        <div className="p-10 rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/40 text-center space-y-4 shadow-xl">
                          <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 w-fit mx-auto">
                            <Users className="w-8 h-8" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-white">No leadership roles added yet</div>
                            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                              Click <strong>+ Add Leadership Role</strong> or select any preset above (e.g. Class Representative, Department President, Vice-President, Football Captain, Club Lead).
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {roles.map((roleItem, idx) => (
                          <div key={roleItem.id || idx} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 hover:border-sky-500/40 transition-all shadow-xl space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
                              {/* Role Title Selector / Input */}
                              <div className="sm:col-span-5 space-y-1">
                                <label className="text-xs font-medium text-slate-300 block">Leadership Title / Position</label>
                                <select
                                  value={roleItem.title}
                                  onChange={(e) => {
                                    const updated = [...roles];
                                    updated[idx].title = e.target.value;
                                    setData({ ...data, leadership: { ...data.leadership, leadershipPositions: JSON.stringify(updated) } });
                                  }}
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-indigo-400 focus:outline-none"
                                >
                                  <option value="" className="bg-[#0f172a] text-slate-400">Select Leadership Position...</option>
                                  <option value="Class Representative (CR)" className="bg-[#0f172a]">Class Representative (CR)</option>
                                  <option value="Department President" className="bg-[#0f172a]">Department President</option>
                                  <option value="Department Vice-President" className="bg-[#0f172a]">Department Vice-President</option>
                                  <option value="Student Council General Secretary" className="bg-[#0f172a]">Student Council General Secretary</option>
                                  <option value="Sports Captain / Football Captain" className="bg-[#0f172a]">Sports Captain / Football Captain</option>
                                  <option value="Technical Club Lead / Head" className="bg-[#0f172a]">Technical Club Lead / Head</option>
                                  <option value="Cultural Fest Student Coordinator" className="bg-[#0f172a]">Cultural Fest Student Coordinator</option>
                                  <option value="NSS / NCC Student Leader" className="bg-[#0f172a]">NSS / NCC Student Leader</option>
                                  <option value="Engineering Team Lead / Manager" className="bg-[#0f172a]">Engineering Team Lead / Manager</option>
                                  <option value="Community Mentor / Volunteer Lead" className="bg-[#0f172a]">Community Mentor / Volunteer Lead</option>
                                  <option value="Custom Leadership Role" className="bg-[#0f172a]">Custom Leadership Role...</option>
                                </select>
                                {(![
                                  "",
                                  "Class Representative (CR)",
                                  "Department President",
                                  "Department Vice-President",
                                  "Student Council General Secretary",
                                  "Sports Captain / Football Captain",
                                  "Technical Club Lead / Head",
                                  "Cultural Fest Student Coordinator",
                                  "NSS / NCC Student Leader",
                                  "Engineering Team Lead / Manager",
                                  "Community Mentor / Volunteer Lead"
                                ].includes(roleItem.title)) && (
                                  <input
                                    type="text"
                                    value={roleItem.title}
                                    onChange={(e) => {
                                      const updated = [...roles];
                                      updated[idx].title = e.target.value;
                                      setData({ ...data, leadership: { ...data.leadership, leadershipPositions: JSON.stringify(updated) } });
                                    }}
                                    placeholder="Type custom leadership position..."
                                    className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-indigo-400 focus:outline-none"
                                  />
                                )}
                              </div>

                              {/* Institution / Organization */}
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-xs font-medium text-slate-300 block">Department / Institution</label>
                                <input
                                  type="text"
                                  value={roleItem.org || ""}
                                  onChange={(e) => {
                                    const updated = [...roles];
                                    updated[idx].org = e.target.value;
                                    setData({ ...data, leadership: { ...data.leadership, leadershipPositions: JSON.stringify(updated) } });
                                  }}
                                  placeholder="e.g. Computer Science Dept"
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-semibold focus:border-indigo-400 focus:outline-none"
                                />
                              </div>

                              {/* Members / Students Managed */}
                              <div className="sm:col-span-3 space-y-1">
                                <label className="text-xs font-medium text-slate-300 block">Members / Students Managed</label>
                                <input
                                  type="number"
                                  min={0}
                                  value={roleItem.teamSize || ""}
                                  onChange={(e) => {
                                    const updated = [...roles];
                                    updated[idx].teamSize = Number(e.target.value);
                                    setData({ ...data, leadership: { ...data.leadership, leadershipPositions: JSON.stringify(updated) } });
                                  }}
                                  placeholder="e.g. 60 Students"
                                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                                />
                              </div>

                              {/* Delete Button */}
                              <div className="sm:col-span-1 flex items-center justify-end pb-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = roles.filter((_, i) => i !== idx);
                                    setData({ ...data, leadership: { ...data.leadership, leadershipPositions: JSON.stringify(updated) } });
                                  }}
                                  className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                                  title="Remove Role"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Community & Mentoring Additional Inputs */}
                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-300 block">Community & Volunteer Mentoring</label>
                      <input
                        type="text"
                        value={data.leadership.mentoringExperience}
                        onChange={(e) => setData({ ...data, leadership: { ...data.leadership, mentoringExperience: e.target.value } })}
                        placeholder="e.g. Mentored 20+ junior developers & college students"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-bold focus:border-indigo-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 10: SPORTS ================= */}
              {activeStep === 10 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 10: Sports & Extracurricular</h2>
                      <p className="text-xs text-[var(--subtext)] font-sans">Competitive sports, state/national representation, captaincy, & athletic achievements.</p>
                    </div>

                    {/* Quick Add Sport Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Select Sport:</span>
                      {[
                        "Cricket",
                        "Football / Soccer",
                        "Badminton",
                        "Basketball",
                        "Athletics",
                        "Table Tennis",
                        "Chess",
                        "Swimming",
                        "Kabaddi",
                        "Lawn Tennis",
                      ].map((sport) => (
                        <button
                          key={sport}
                          type="button"
                          onClick={() => setData({ ...data, sports: { ...data.sports, sportName: sport } })}
                          className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                            data.sports.sportName === sport
                              ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                              : "bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20"
                          }`}
                        >
                          + {sport}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Sport Discipline Selector / Input */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Sport Discipline</label>
                        <select
                          value={data.sports.sportName}
                          onChange={(e) => setData({ ...data, sports: { ...data.sports, sportName: e.target.value } })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] font-bold focus:border-indigo-400 focus:outline-none"
                        >
                          <option value="" className="bg-[#0f172a] text-slate-400">Select Sport Discipline...</option>
                          <option value="Cricket" className="bg-[#0f172a]">Cricket</option>
                          <option value="Football / Soccer" className="bg-[#0f172a]">Football / Soccer</option>
                          <option value="Badminton" className="bg-[#0f172a]">Badminton</option>
                          <option value="Basketball" className="bg-[#0f172a]">Basketball</option>
                          <option value="Athletics / Track & Field" className="bg-[#0f172a]">Athletics / Track & Field</option>
                          <option value="Table Tennis" className="bg-[#0f172a]">Table Tennis</option>
                          <option value="Chess" className="bg-[#0f172a]">Chess</option>
                          <option value="Swimming" className="bg-[#0f172a]">Swimming</option>
                          <option value="Kabaddi" className="bg-[#0f172a]">Kabaddi</option>
                          <option value="Lawn Tennis" className="bg-[#0f172a]">Lawn Tennis</option>
                          <option value="Volleyball" className="bg-[#0f172a]">Volleyball</option>
                          <option value="Martial Arts / Karate" className="bg-[#0f172a]">Martial Arts / Karate</option>
                          <option value="Custom Sport" className="bg-[#0f172a]">Custom Sport...</option>
                        </select>
                        {(![
                          "",
                          "Cricket",
                          "Football / Soccer",
                          "Badminton",
                          "Basketball",
                          "Athletics / Track & Field",
                          "Table Tennis",
                          "Chess",
                          "Swimming",
                          "Kabaddi",
                          "Lawn Tennis",
                          "Volleyball",
                          "Martial Arts / Karate"
                        ].includes(data.sports.sportName)) && (
                          <input
                            type="text"
                            value={data.sports.sportName}
                            onChange={(e) => setData({ ...data, sports: { ...data.sports, sportName: e.target.value } })}
                            placeholder="Type custom sport discipline..."
                            className="w-full mt-1.5 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-bold focus:border-indigo-400 focus:outline-none"
                          />
                        )}
                      </div>

                      {/* Years Played */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Years Played / Practiced</label>
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={data.sports.yearsPlayed || ""}
                          onChange={(e) => setData({ ...data, sports: { ...data.sports, yearsPlayed: Number(e.target.value) } })}
                          placeholder="e.g. 4 Years"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Competition Level Selector Pills */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-300 block">Highest Competition Level Reached</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { level: "College / Local", label: "College / University" },
                          { level: "State Level", label: "State Championship" },
                          { level: "National Level", label: "National Level" },
                          { level: "International Level", label: "International / Asian Games" },
                        ].map((item) => (
                          <button
                            key={item.level}
                            type="button"
                            onClick={() => setData({ ...data, sports: { ...data.sports, competitionLevel: item.level as any } })}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                              data.sports.competitionLevel === item.level
                                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/50"
                                : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-sky-500/40"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Captaincy Toggle & Key Achievements */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Leadership & Captaincy</label>
                        <button
                          type="button"
                          onClick={() => setData({ ...data, sports: { ...data.sports, wasCaptain: !data.sports.wasCaptain } })}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                            data.sports.wasCaptain
                              ? "bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30"
                              : "bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:border-slate-500"
                          }`}
                        >
                          🏆 {data.sports.wasCaptain ? "Team Captain / Squad Lead" : "Member / Athlete"}
                        </button>
                      </div>

                      <div className="sm:col-span-8 space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Key Medals & Achievements</label>
                        <input
                          type="text"
                          value={data.sports.achievements || ""}
                          onChange={(e) => setData({ ...data, sports: { ...data.sports, achievements: e.target.value } })}
                          placeholder="e.g. Gold Medalist in Inter-College Tournament 2024"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-semibold focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= SECTION 11: AWARDS ================= */}
              {activeStep === 11 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h2 className="text-xl font-bold text-[var(--foreground)]">Section 11: Awards & Recognition</h2>
                        <p className="text-xs text-[var(--subtext)] font-sans">Industry honors, hackathon victories, academic excellence, & spot awards.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newItem = {
                            id: `awd_${Date.now()}`,
                            name: "Smart India Hackathon Winner",
                            year: "2025",
                            organization: "Ministry of Education / Tech Council",
                            category: "Innovation",
                            description: "",
                          };
                          setData({ ...data, awards: [...data.awards, newItem] });
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-sky-500/20 transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" /> Add Award
                      </button>
                    </div>

                    {/* Quick Add Award Presets */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Quick Add Honor:</span>
                      {[
                        "Smart India Hackathon Winner",
                        "Best Academic Performer",
                        "Spot Excellence Award",
                        "Star Employee of the Year",
                        "Dean's Honor Roll List",
                        "National Innovation Winner",
                      ].map((presetAward) => (
                        <button
                          key={presetAward}
                          type="button"
                          onClick={() => {
                            const newItem = {
                              id: `awd_${Date.now()}`,
                              name: presetAward,
                              year: "2025",
                              organization: "University / Employer",
                              category: "Excellence",
                              description: "",
                            };
                            setData({ ...data, awards: [...data.awards, newItem] });
                          }}
                          className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20 text-xs font-medium transition-all"
                        >
                          + {presetAward}
                        </button>
                      ))}
                    </div>
                  </div>

                  {data.awards.length === 0 ? (
                    <div className="p-10 rounded-3xl border border-dashed border-slate-700/80 bg-slate-900/40 text-center space-y-4 shadow-xl">
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit mx-auto">
                        <Award className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">No awards or honors added yet</div>
                        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                          Click <strong>+ Add Award</strong> or select any preset above (e.g. Smart India Hackathon Winner, Spot Award, Dean's List).
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.awards.map((aw, idx) => (
                        <div key={aw.id} className="p-4 rounded-3xl bg-slate-900/90 border border-slate-700/60 hover:border-sky-500/40 transition-all shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                          <div className="sm:col-span-5 space-y-1">
                            <label className="text-xs font-medium text-slate-300 block">Award Title / Honor</label>
                            <input
                              type="text"
                              value={aw.name}
                              onChange={(e) => {
                                const updated = [...data.awards];
                                updated[idx].name = e.target.value;
                                setData({ ...data, awards: updated });
                              }}
                              placeholder="e.g. National Innovation Excellence Award"
                              className="w-full px-3.5 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-bold focus:border-indigo-400 focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-4 space-y-1">
                            <label className="text-xs font-medium text-slate-300 block">Issuing Institution / Organization</label>
                            <input
                              type="text"
                              value={aw.organization}
                              onChange={(e) => {
                                const updated = [...data.awards];
                                updated[idx].organization = e.target.value;
                                setData({ ...data, awards: updated });
                              }}
                              placeholder="e.g. Ministry of Education / Google AI"
                              className="w-full px-3.5 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-semibold focus:border-indigo-400 focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-xs font-medium text-slate-300 block">Year Awarded</label>
                            <input
                              type="text"
                              value={aw.year}
                              onChange={(e) => {
                                const updated = [...data.awards];
                                updated[idx].year = e.target.value;
                                setData({ ...data, awards: updated });
                              }}
                              placeholder="2025"
                              className="w-full px-3.5 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-1 flex items-center justify-end pt-2 sm:pt-0">
                            <button
                              type="button"
                              onClick={() => {
                                const updated = data.awards.filter((_, i) => i !== idx);
                                setData({ ...data, awards: updated });
                              }}
                              className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                              title="Delete Award"
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

              {/* ================= SECTION 12: CONTINUOUS LEARNING ================= */}
              {activeStep === 12 && (
                <div className="space-y-6 text-left">
                  <div className="border-b border-[var(--border)] pb-4 space-y-3">
                    <div>
                      <h2 className="text-xl font-bold text-[var(--foreground)]">Section 12: Continuous Learning & Velocity</h2>
                      <p className="text-xs text-[var(--subtext)] font-sans">Learning commitment, books read, certifications completed, & hackathon velocity.</p>
                    </div>

                    {/* Interactive Learning Commitment Velocity Tiers */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-xs font-medium text-slate-300 mr-1">Select Learning Velocity Target:</span>
                      {[
                        { hours: 5, label: "🌱 Casual Learner (5 Hrs/wk)" },
                        { hours: 10, label: "⚡ Active Practitioner (10 Hrs/wk)" },
                        { hours: 15, label: "🔥 Fast-Track Scholar (15 Hrs/wk)" },
                        { hours: 25, label: "🚀 Intensive Builder (25+ Hrs/wk)" },
                      ].map((tier) => (
                        <button
                          key={tier.hours}
                          type="button"
                          onClick={() =>
                            setData({
                              ...data,
                              continuousLearning: {
                                ...data.continuousLearning,
                                learningHoursPerWeek: tier.hours,
                              },
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            data.continuousLearning.learningHoursPerWeek === tier.hours
                              ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold shadow-lg shadow-sky-500/20 ring-1 ring-sky-400/50"
                              : "bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:border-sky-500/40"
                          }`}
                        >
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Learning Hours / Week */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Weekly Upskilling Commitment</label>
                        <input
                          type="number"
                          min={1}
                          max={80}
                          value={data.continuousLearning.learningHoursPerWeek || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              continuousLearning: { ...data.continuousLearning, learningHoursPerWeek: Number(e.target.value) },
                            })
                          }
                          placeholder="e.g. 10 Hrs/wk"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                        />
                        <span className="text-[10px] text-sky-400 block font-mono">
                          ~{(data.continuousLearning.learningHoursPerWeek || 0) * 52} Hours / Year
                        </span>
                      </div>

                      {/* Courses Completed / Year */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Courses Completed / Year</label>
                        <input
                          type="number"
                          min={0}
                          max={50}
                          value={data.continuousLearning.coursesCompleted || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              continuousLearning: { ...data.continuousLearning, coursesCompleted: Number(e.target.value) },
                            })
                          }
                          placeholder="e.g. 6 Courses"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                        />
                        <span className="text-[10px] text-indigo-400 block font-mono">Coursera, Udemy, edX, etc.</span>
                      </div>

                      {/* Books Read / Year */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Books Read / Year</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={data.continuousLearning.booksPerYear || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              continuousLearning: { ...data.continuousLearning, booksPerYear: Number(e.target.value) },
                            })
                          }
                          placeholder="e.g. 12 Books"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                        />
                        <span className="text-[10px] text-emerald-400 block font-mono">Tech & Business Literature</span>
                      </div>

                      {/* Hackathons Attended */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Hackathons Attended</label>
                        <input
                          type="number"
                          min={0}
                          max={30}
                          value={data.continuousLearning.hackathonsAttended || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              continuousLearning: { ...data.continuousLearning, hackathonsAttended: Number(e.target.value) },
                            })
                          }
                          placeholder="e.g. 4 Hackathons"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-mono font-bold focus:border-indigo-400 focus:outline-none"
                        />
                        <span className="text-[10px] text-amber-400 block font-mono">National & Global Sprints</span>
                      </div>
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

                  {/* Career Goals Input Card */}
                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-4">
                    {/* Quick Select Target Presets */}
                    <div className="space-y-2 pb-2 border-b border-slate-800/80">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-slate-300 mr-1">Quick Select Target Company:</span>
                        {[
                          "TCS",
                          "Infosys",
                          "Google India",
                          "Microsoft India",
                          "Reliance Jio",
                          "Flipkart",
                          "ISRO",
                        ].map((company) => (
                          <button
                            key={company}
                            type="button"
                            onClick={() =>
                              setData({
                                ...data,
                                careerVision: { ...(data.careerVision || defaultProfessionalCapitalState.careerVision), dreamCompany: company },
                              })
                            }
                            className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                              data.careerVision?.dreamCompany === company
                                ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                                : "bg-sky-500/10 border border-sky-500/20 text-sky-300 hover:bg-sky-500/20"
                            }`}
                          >
                            + {company}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs font-medium text-slate-300 mr-1">Quick Select Target Role:</span>
                        {[
                          "Senior AI Solutions Architect",
                          "Software Engineer (SDE-III)",
                          "Data Scientist & ML Lead",
                          "Vice President of Engineering",
                          "Product Director",
                        ].map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() =>
                              setData({
                                ...data,
                                careerVision: { ...(data.careerVision || defaultProfessionalCapitalState.careerVision), dreamRole: role },
                              })
                            }
                            className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                              data.careerVision?.dreamRole === role
                                ? "bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/20"
                                : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20"
                            }`}
                          >
                            + {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Dream Target Role */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Dream Target Role</label>
                        <input
                          type="text"
                          value={data.careerVision?.dreamRole || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              careerVision: { ...(data.careerVision || defaultProfessionalCapitalState.careerVision), dreamRole: e.target.value },
                            })
                          }
                          placeholder="e.g. Senior AI Solutions Architect / Software Engineer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-bold focus:border-indigo-400 focus:outline-none"
                        />
                      </div>

                      {/* Dream Target Company */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-300 block">Dream Target Company / Organization</label>
                        <input
                          type="text"
                          value={data.careerVision?.dreamCompany || ""}
                          onChange={(e) =>
                            setData({
                              ...data,
                              careerVision: { ...(data.careerVision || defaultProfessionalCapitalState.careerVision), dreamCompany: e.target.value },
                            })
                          }
                          placeholder="e.g. TCS / Infosys / Google India / Reliance Jio / Flipkart"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-white font-bold focus:border-indigo-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Readiness Classifications Badges */}
                  <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-700/60 shadow-xl space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-2">
                      <Zap className="w-4 h-4 text-indigo-400" /> AI Career Readiness Classifications
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-1 shadow-md">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">🚀 Promotion</span>
                        <div className="text-sm font-black text-emerald-400">{metrics.promotionReadiness}</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-sky-500/30 space-y-1 shadow-md">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">⚡ Startup</span>
                        <div className="text-sm font-black text-sky-400">{metrics.startupReadiness}</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-1 shadow-md">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">👑 Leadership</span>
                        <div className="text-sm font-black text-indigo-400">{metrics.leadershipReadiness}</div>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-1 shadow-md">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">🌐 Global Mobility</span>
                        <div className="text-sm font-black text-purple-400">{metrics.internationalEmployability}</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Strategic Insights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono uppercase tracking-wider">
                        <CheckCircle2 className="w-4.5 h-4.5" /> Top Strengths Identified
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside font-medium leading-relaxed">
                        {metrics.topStrengths.map((str, i) => (
                          <li key={i}>{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-3 shadow-xl">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono uppercase tracking-wider">
                        <Sparkles className="w-4.5 h-4.5" /> Recommended Skill Gaps & Upskilling
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-200 list-disc list-inside font-medium leading-relaxed">
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

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  if (!userId) return;
                  setSavingStatus("saving");
                  const skillsScore = metrics?.professionalCapitalScore || 0;
                  await saveModuleData(userId, "skills", data as any, isSubmitted, skillsScore);
                  setSavingStatus("saved");
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Save Data
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
        </div>

        {/* ================= RIGHT COLUMN: PERSISTENT TELEMETRY PANEL (4 COLS) ================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Master Score Dial Card */}
          <div className="glass-panel p-6 rounded-3xl border border-[var(--border)] text-center space-y-4 shadow-xl">
            <span className="text-xs font-semibold text-slate-300 block">Professional Capital Index</span>
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
                  <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-wider">OUT OF 100</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Career Growth Trajectory
            </div>
          </div>

          {/* Real-Time Indices Panel */}
          <div className="glass-panel p-5 rounded-3xl border border-[var(--border)] space-y-3.5 text-left shadow-lg">
            <h3 className="text-xs font-bold text-sky-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" /> Real-Time Career Telemetry
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { label: "Employability Index", score: metrics.employabilityIndex, color: "bg-emerald-400" },
                { label: "AI Readiness Score", score: metrics.aiReadinessScore, color: "bg-sky-400" },
                { label: "Learning Velocity Index", score: metrics.learningIndex, color: "bg-purple-400" },
                { label: "Leadership & Impact", score: metrics.leadershipIndex, color: "bg-indigo-400" },
                { label: "Future Market Demand", score: metrics.futureDemandIndex, color: "bg-amber-400" },
              ].map((idxItem) => (
                <div key={idxItem.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200 font-medium">{idxItem.label}</span>
                    <span className="text-white font-bold font-mono">{idxItem.score}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                    <div className={`h-full ${idxItem.color} rounded-full`} style={{ width: `${idxItem.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 12 Vector Sub-Scores Breakdown Accordion */}
          <div className="glass-panel p-5 rounded-3xl border border-[var(--border)] space-y-3 text-left shadow-lg">
            <h3 className="text-xs font-bold text-indigo-300">
              12 Pillar Sub-Scores Breakdown
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-none pr-1">
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
              ].map((v) => {
                let scoreColor = "text-sky-300";
                if (v.score >= 70) scoreColor = "text-emerald-300";
                else if (v.score < 40) scoreColor = "text-amber-300";

                return (
                  <div key={v.name} className="flex justify-between items-center text-xs p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-200 font-medium">{v.name}</span>
                    <span className={`font-mono font-bold ${scoreColor}`}>{v.score}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsModule;
