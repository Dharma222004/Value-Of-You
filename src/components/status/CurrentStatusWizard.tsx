"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { saveModuleData, loadModuleData, getCurrentUserId, saveLearningProgress } from "@/services/moduleDataService";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  Briefcase,
  Rocket,
  Building2,
  GraduationCap,
  TrendingUp,
  Award,
  Target,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Save,
  Sparkles,
  ShieldCheck,
  Building,
  Globe,
  Star,
  Laptop,
  FileText,
  Search,
  BookOpen,
  Code,
  Layers,
  User,
  Mail,
  Phone,
  Linkedin,
  Github,
  Link as LinkIcon,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Compass,
  Zap,
  HelpCircle,
} from "lucide-react";
import {
  MasterProfileState,
  PrimaryRoleOption,
  CareerInterestCategory,
  CareerMotivationOption,
  AvailabilityOption,
} from "@/types/masterProfile";
import {
  calculateAgeFromDOB,
  evaluateMasterProfileCompleteness,
  generateAIProfileSummary,
} from "@/lib/masterProfileEngine";

const DEFAULT_MASTER_STATE: MasterProfileState = {
  primaryRole: "Student",
  personalProfile: {
    firstName: "",
    lastName: "",
    preferredName: "",
    dateOfBirth: "",
    calculatedAge: 0,
    gender: "Male",
    country: "",
    stateOrProvince: "",
    city: "",
    nationality: "",
    timezone: "(UTC-08:00) Pacific Time",
    preferredLanguage: "English",
  },
  contactInformation: {
    email: "",
    mobileNumber: "",
    linkedInUrl: "",
    gitHubUrl: "",
    portfolioUrl: "",
    personalWebsiteUrl: "",
  },
  studentData: {
    studentCategory: "Undergraduate",
    degree: "",
    specialization: "",
    department: "",
    college: "",
    university: "",
    collegeType: "Government",
    modeOfStudy: "Full Time",
    currentYear: "1st Year",
    currentSemester: "1st Semester",
    expectedGraduationYear: "",
    cgpaOrPercentage: "",
    academicRank: "",
    hasScholarship: false,
    placementEligibility: true,
    housingType: "Day Scholar",
    currentPlacementStatus: "Applied",
  },
  employeeData: {
    company: "",
    designation: "",
    department: "",
    industry: "",
    employmentType: "Full Time",
    yearsOfExperience: 0,
    currentSalaryBand: "",
    teamSizeManaged: "",
    noticePeriod: "",
    hasManagerialResponsibility: false,
  },
  founderData: {
    startupName: "",
    industry: "",
    yearsRunning: 0,
    startupStage: "Ideation",
    employeeCount: "",
    revenueStage: "",
    fundingStage: "Bootstrapped",
    ownershipPercentage: "",
    websiteUrl: "",
  },
  freelancerData: {
    primaryService: "",
    yearsExperience: 0,
    clientsServed: "",
    avgMonthlyProjects: 0,
    platformsUsed: [],
  },
  careerInterests: [],
  careerPreferences: {
    preferredIndustry: "",
    preferredCompanyType: "Startup",
    preferredWorkStyle: "Hybrid",
    preferredCountry: "",
    relocationPreference: "Yes",
    openToInternationalOpportunities: true,
  },
  careerMotivations: [],
  currentAvailability: "Open to Work",
  goals: {
    shortTermGoal1Yr: "",
    mediumTermGoal3Yr: "",
    longTermGoal5To10Yr: "",
  },
  aiSummary: {
    currentStageBadge: "Profile Initializing",
    summaryBullets: [],
    profileCompletenessPercentage: 0,
    aiConfidencePercentage: 85,
  },
};

const ROLES: { id: PrimaryRoleOption; title: string; desc: string; icon: any }[] = [
  { id: "Student", title: "Student", desc: "Undergraduate, Graduate, or High School student", icon: GraduationCap },
  { id: "Employee", title: "Employee / Professional", desc: "Working full-time, part-time, or contract", icon: Briefcase },
  { id: "Founder", title: "Founder / Entrepreneur", desc: "Building a startup or venture", icon: Rocket },
  { id: "Business Owner", title: "Business Owner", desc: "Running an established SME or business", icon: Building2 },
  { id: "Freelancer", title: "Freelancer / Consultant", desc: "Providing independent services", icon: Laptop },
  { id: "Government Employee", title: "Government Employee", desc: "Civil services or public sector", icon: Building },
  { id: "Research Scholar", title: "Research Scholar / PhD", desc: "Academic or scientific research", icon: BookOpen },
  { id: "Job Seeker", title: "Job Seeker", desc: "Actively searching for new roles", icon: Search },
  { id: "Self Employed", title: "Self Employed", desc: "Solo practice or professional services", icon: UserCheck },
  { id: "Retired", title: "Retired", desc: "Post-career advisory or leisure", icon: Award },
  { id: "Homemaker", title: "Homemaker", desc: "Managing home & family endeavors", icon: Star },
  { id: "Other", title: "Other Mode", desc: "Unique career pathway", icon: Compass },
];

const INTEREST_OPTIONS: CareerInterestCategory[] = [
  "Artificial Intelligence",
  "Finance",
  "Healthcare",
  "Cybersecurity",
  "Cloud",
  "Marketing",
  "Sales",
  "Business",
  "Education",
  "Research",
  "Manufacturing",
  "Robotics",
  "Data Science",
  "Product Management",
  "Design",
  "Law",
  "Government",
  "Agriculture",
  "Other",
];

const MOTIVATION_OPTIONS: CareerMotivationOption[] = [
  "High Salary",
  "Financial Freedom",
  "Leadership",
  "Entrepreneurship",
  "Research",
  "Innovation",
  "Learning",
  "Work Life Balance",
  "Job Security",
  "Social Impact",
  "Recognition",
];

const AVAILABILITY_OPTIONS: AvailabilityOption[] = [
  "Student",
  "Working",
  "Open to Work",
  "Looking for Internship",
  "Looking for Placement",
  "Looking for Co-Founder",
  "Looking for Investors",
  "Not Looking",
];

const MASTER_STEPS = [
  { id: 1, title: "Primary Role" },
  { id: 2, title: "Personal Profile & Contact" },
  { id: 3, title: "Role Specifics" },
  { id: 4, title: "Career Interests" },
  { id: 5, title: "Preferences" },
  { id: 6, title: "Motivations" },
  { id: 7, title: "Availability" },
  { id: 8, title: "Three-Horizon Goals" },
  { id: 9, title: "AI Master Summary" },
];

export function CurrentStatusWizard() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<MasterProfileState>(DEFAULT_MASTER_STATE);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [savingStatus, setSavingStatus] = useState<"saved" | "saving">("saved");

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    async function loadFromSupabase() {
      try {
        const uid = await getCurrentUserId();
        setUserId(uid);
        if (!uid) return;
        const parsed = await loadModuleData(uid, "master_profile") as MasterProfileState | null;
        if (parsed && parsed.personalProfile) {
          const isComp = Boolean(parsed.isCompleted || parsed.submittedAt || (parsed.personalProfile.firstName && parsed.personalProfile.lastName));
          setState({ ...parsed, isCompleted: isComp });
          if (isComp) {
            setIsSubmitted(true);
            setActiveStep(9);
          }
        }
      } finally {
        setIsLoaded(true);
      }
    }
    loadFromSupabase();
  }, []);

  // Automatically update age when Date of Birth changes
  useEffect(() => {
    if (state.personalProfile.dateOfBirth) {
      const age = calculateAgeFromDOB(state.personalProfile.dateOfBirth);
      setState((prev) => ({
        ...prev,
        personalProfile: { ...prev.personalProfile, calculatedAge: age },
      }));
    }
  }, [state.personalProfile.dateOfBirth]);

  // Debounced autosave to Supabase (ONLY after initial load finishes)
  useEffect(() => {
    if (!mounted || !userId || !isLoaded) return;
    setSavingStatus("saving");
    const timeout = setTimeout(async () => {
      const isComp = Boolean(state.isCompleted || state.submittedAt || isSubmitted);
      const result = await saveModuleData(userId, "master_profile", { ...state, isCompleted: isComp } as any, isComp, 88);
      if (!result) {
        console.warn("[CurrentStatusWizard] ⚠️ Save to Supabase FAILED — data was NOT persisted. Check [DB_DEBUG] logs above.");
      }
      setSavingStatus("saved");
    }, 800);
    return () => clearTimeout(timeout);
  }, [state, mounted, userId, isLoaded, isSubmitted]);

  const [validationError, setValidationError] = useState<string | null>(null);

  // Evaluate AI summary in real-time
  const aiSummaryData = useMemo(() => generateAIProfileSummary(state), [state]);

  // Validate active step mandatory fields
  const validateCurrentStep = (step: number): boolean => {
    setValidationError(null);
    if (step === 1) {
      if (!state.primaryRole) {
        setValidationError("Please select your Primary Role to proceed.");
        return false;
      }
    } else if (step === 2) {
      if (!state.personalProfile.firstName.trim()) {
        setValidationError("First Name is required (Enter 'N/A' if not applicable).");
        return false;
      }
      if (!state.personalProfile.lastName.trim()) {
        setValidationError("Last Name is required (Enter 'N/A' if not applicable).");
        return false;
      }
      if (!state.contactInformation.email.trim()) {
        setValidationError("Email Address is required (Enter 'N/A' if not applicable).");
        return false;
      }
    } else if (step === 3) {
      if (state.primaryRole === "Student") {
        const collegeOrUniv = (state.studentData.university || state.studentData.college || "").trim();
        if (!state.studentData.degree.trim()) {
          setValidationError("Degree / Major is required (Enter 'N/A' if not applicable).");
          return false;
        }
        if (!collegeOrUniv) {
          setValidationError("University / Institution Name is required (Enter 'N/A' if not applicable).");
          return false;
        }
      } else if (state.primaryRole === "Working Professional") {
        if (!state.employeeData.jobTitle.trim()) {
          setValidationError("Job Title is required (Enter 'N/A' if not applicable).");
          return false;
        }
        if (!state.employeeData.companyName.trim()) {
          setValidationError("Company Name is required (Enter 'N/A' if not applicable).");
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep(activeStep)) return;
    if (activeStep < 9) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setValidationError(null);
    if (activeStep > 1) setActiveStep((prev) => prev - 1);
  };

  const handleSubmitProfile = async () => {
    if (!validateCurrentStep(activeStep)) return;
    const updatedState = {
      ...state,
      isCompleted: true,
      submittedAt: new Date().toISOString(),
    };
    setState(updatedState);
    if (userId) {
      await saveModuleData(userId, "master_profile", updatedState as any, true, 88);
      await saveLearningProgress(userId, "master_profile", 100);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hc_assessment_updated"));
    }
    setIsSubmitted(true);
    setActiveStep(9);
  };

  if (!mounted) {
    return (
      <div className="glass-panel p-8 rounded-3xl border border-[var(--border)] max-w-7xl mx-auto space-y-6 animate-pulse">
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
                  ✓ Profile Submitted & Saved Locally
                </span>
              </div>
              <h3 className="text-base font-extrabold text-[var(--foreground)] mt-0.5">
                Personal & Professional Parameters Stored
              </h3>
              <p className="text-xs text-[var(--subtext)]">
                Your profile parameters are saved and active for Human Capital valuation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono font-bold hover:bg-slate-800 transition-all"
            >
              Edit Profile Parameters
            </button>
            <Link
              href="/dashboard/financial"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 hover:from-emerald-500 hover:to-sky-400 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all"
            >
              Next Module: Financial Health <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* HEADER LOCKUP */}
      <div className="glass-panel p-6 rounded-3xl border border-[var(--border)] relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-cyan-400 text-[11px] font-mono font-bold uppercase tracking-wider">
              Phase 3 — Master Profile Engine
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--subtext)]">
              {savingStatus === "saving" ? (
                <span className="text-amber-500 animate-pulse flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Autosaving...
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <Check className="w-3 h-3" /> All changes saved
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
            Personal & Professional Profile
          </h1>
          <p className="text-xs sm:text-sm text-[var(--subtext)] max-w-xl leading-relaxed">
            The foundational Master Profile powering your Human Capital Score, career recommendations, and financial assessments.
          </p>
        </div>

        {/* Profile Completeness Pill & Quick Edit Action */}
        <div className="flex items-center gap-3 z-10 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setActiveStep(1);
            }}
            className="px-4 py-3 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-xs hover:bg-indigo-600/25 hover:text-white transition-all flex items-center gap-2 shadow-sm"
          >
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span>Edit Profile</span>
          </button>

          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-600/10 border border-blue-500/20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white font-extrabold text-lg flex items-center justify-center shadow-lg">
              {aiSummaryData.profileCompletenessPercentage}%
            </div>
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--subtext)]">
                Master Completeness
              </div>
              <div className="text-xs font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Sensitive IDs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP PROGRESS NAVIGATION */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-[var(--foreground)]">
            Step {activeStep} of 9: <strong className="text-blue-600 dark:text-cyan-400">{MASTER_STEPS[activeStep - 1].title}</strong>
          </span>
          <span className="font-mono text-[var(--subtext)]">{Math.round((activeStep / 9) * 100)}% Processed</span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
            animate={{ width: `${(activeStep / 9) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {MASTER_STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all ${
                activeStep === step.id
                  ? "bg-blue-600 text-white font-bold shadow-md"
                  : step.id < activeStep
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                  : "bg-[var(--background)] text-[var(--subtext)] border border-[var(--border)]"
              }`}
            >
              <span>{step.id}. {step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* STEP CONTENT SWITCHER */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border)] min-h-[500px]"
        >
          {/* STEP 1: PRIMARY ROLE */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="text-left space-y-1">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 1: Primary Career Status</h2>
                <p className="text-xs text-[var(--subtext)]">Select your primary role. This dynamically configures your master evaluation engine.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const selected = state.primaryRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setState({ ...state, primaryRole: r.id })}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                        selected
                          ? "bg-blue-600/15 border-blue-500 text-[var(--foreground)] shadow-lg scale-[1.02]"
                          : "bg-[var(--background)] border-[var(--border)] text-[var(--subtext)] hover:border-blue-500/40"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selected ? "bg-blue-600 text-white" : "bg-slate-800/40 text-slate-400"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {selected && <CheckCircle2 className="w-5 h-5 text-blue-500 dark:text-cyan-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[var(--foreground)]">{r.title}</h3>
                        <p className="text-[11px] text-[var(--subtext)] leading-tight">{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL PROFILE & CONTACT */}
          {activeStep === 2 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 2: Personal Profile & Contact Information</h2>
                <p className="text-xs text-[var(--subtext)]">Non-sensitive identity parameters and communication handles.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">First Name *</label>
                  <input
                    type="text"
                    value={state.personalProfile.firstName}
                    onChange={(e) =>
                      setState({
                        ...state,
                        personalProfile: { ...state.personalProfile, firstName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Last Name *</label>
                  <input
                    type="text"
                    value={state.personalProfile.lastName}
                    onChange={(e) =>
                      setState({
                        ...state,
                        personalProfile: { ...state.personalProfile, lastName: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Preferred Name (Optional)</label>
                  <input
                    type="text"
                    value={state.personalProfile.preferredName || ""}
                    onChange={(e) =>
                      setState({
                        ...state,
                        personalProfile: { ...state.personalProfile, preferredName: e.target.value },
                      })
                    }
                    placeholder="e.g. Alex"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                </div>
              </div>

              {/* DOB & Auto-Age Calculation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Date of Birth *</label>
                  <input
                    type="date"
                    value={state.personalProfile.dateOfBirth}
                    onChange={(e) =>
                      setState({
                        ...state,
                        personalProfile: { ...state.personalProfile, dateOfBirth: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Calculated Age</label>
                  <div className="px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs font-mono font-bold text-blue-500 dark:text-cyan-400">
                    {state.personalProfile.calculatedAge} Years Old
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Gender</label>
                  <select
                    value={state.personalProfile.gender}
                    onChange={(e) =>
                      setState({
                        ...state,
                        personalProfile: { ...state.personalProfile, gender: e.target.value as any },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                  </select>
                </div>
              </div>

              {/* Location & Timezone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Country *</label>
                  <input
                    type="text"
                    value={state.personalProfile.country}
                    onChange={(e) =>
                      setState({
                        ...state,
                        personalProfile: { ...state.personalProfile, country: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">State / Province</label>
                  <input
                    type="text"
                    value={state.personalProfile.stateOrProvince}
                    onChange={(e) =>
                      setState({
                        ...state,
                        personalProfile: { ...state.personalProfile, stateOrProvince: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">City</label>
                  <input
                    type="text"
                    value={state.personalProfile.city}
                    onChange={(e) =>
                      setState({
                        ...state,
                        personalProfile: { ...state.personalProfile, city: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                </div>
              </div>

              {/* Contact Information & Social Handles */}
              <div className="pt-2 border-t border-[var(--border)] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--subtext)] font-mono">Contact Handles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--subtext)] font-semibold">
                      Email Address <span className="text-rose-500">*</span> <span className="text-[10px] opacity-75 font-normal">(Required — Enter "N/A" if not applicable)</span>
                    </label>
                    <input
                      type="email"
                      value={state.contactInformation.email || ""}
                      onChange={(e) =>
                        setState({
                          ...state,
                          contactInformation: { ...state.contactInformation, email: e.target.value },
                        })
                      }
                      placeholder="e.g. alex@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--subtext)]">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={state.contactInformation.linkedInUrl || ""}
                      onChange={(e) =>
                        setState({
                          ...state,
                          contactInformation: { ...state.contactInformation, linkedInUrl: e.target.value },
                        })
                      }
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--subtext)]">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={state.contactInformation.gitHubUrl || ""}
                      onChange={(e) =>
                        setState({
                          ...state,
                          contactInformation: { ...state.contactInformation, gitHubUrl: e.target.value },
                        })
                      }
                      placeholder="https://github.com/username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-[var(--subtext)]">Personal Portfolio Website</label>
                    <input
                      type="text"
                      value={state.contactInformation.portfolioUrl || ""}
                      onChange={(e) =>
                        setState({
                          ...state,
                          contactInformation: { ...state.contactInformation, portfolioUrl: e.target.value },
                        })
                      }
                      placeholder="https://alexvance.dev"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC ROLE SPECIFICS */}
          {activeStep === 3 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 3: {state.primaryRole} Specification</h2>
                <p className="text-xs text-[var(--subtext)]">Dynamic parameters calibrated for {state.primaryRole} status.</p>
              </div>

              {state.primaryRole === "Student" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground)]">Degree Program</label>
                      <input
                        type="text"
                        value={state.studentData.degree}
                        onChange={(e) =>
                          setState({
                            ...state,
                            studentData: { ...state.studentData, degree: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground)]">Specialization / Major</label>
                      <input
                        type="text"
                        value={state.studentData.specialization}
                        onChange={(e) =>
                          setState({
                            ...state,
                            studentData: { ...state.studentData, specialization: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground)]">University / Institution</label>
                      <input
                        type="text"
                        value={state.studentData.university}
                        onChange={(e) =>
                          setState({
                            ...state,
                            studentData: { ...state.studentData, university: e.target.value, college: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground)]">College Type</label>
                      <select
                        value={state.studentData.collegeType}
                        onChange={(e) =>
                          setState({
                            ...state,
                            studentData: { ...state.studentData, collegeType: e.target.value as any },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                      >
                        <option value="Government" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Government</option>
                        <option value="Private" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Private</option>
                        <option value="Autonomous" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Autonomous</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground)]">CGPA / Percentage</label>
                      <input
                        type="text"
                        value={state.studentData.cgpaOrPercentage}
                        onChange={(e) =>
                          setState({
                            ...state,
                            studentData: { ...state.studentData, cgpaOrPercentage: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground)]">Placement Status</label>
                      <select
                        value={state.studentData.currentPlacementStatus}
                        onChange={(e) =>
                          setState({
                            ...state,
                            studentData: { ...state.studentData, currentPlacementStatus: e.target.value as any },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                      >
                        <option value="Applied" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Applied</option>
                        <option value="Interviewing" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Interviewing</option>
                        <option value="Placed" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Placed</option>
                        <option value="Higher Studies" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Higher Studies</option>
                        <option value="Not Applied" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Not Applied</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {state.primaryRole === "Employee" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground)]">Company Name</label>
                      <input
                        type="text"
                        value={state.employeeData.company}
                        onChange={(e) =>
                          setState({
                            ...state,
                            employeeData: { ...state.employeeData, company: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground)]">Designation / Title</label>
                      <input
                        type="text"
                        value={state.employeeData.designation}
                        onChange={(e) =>
                          setState({
                            ...state,
                            employeeData: { ...state.employeeData, designation: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[var(--foreground)]">Years of Experience</label>
                      <input
                        type="number"
                        value={state.employeeData.yearsOfExperience}
                        onChange={(e) =>
                          setState({
                            ...state,
                            employeeData: { ...state.employeeData, yearsOfExperience: Number(e.target.value) },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {state.primaryRole !== "Student" && state.primaryRole !== "Employee" && (
                <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] text-center text-xs text-[var(--subtext)]">
                  Standard master parameters loaded for <strong>{state.primaryRole}</strong> role. Proceed to next step to configure career interests and preferences.
                </div>
              )}
            </div>
          )}

          {/* STEP 4: CAREER INTERESTS */}
          {activeStep === 4 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 4: Career Interests & Focus Domains</h2>
                <p className="text-xs text-[var(--subtext)]">Select the sectors and disciplines you want your AI model to prioritize.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {INTEREST_OPTIONS.map((interest) => {
                  const selected = state.careerInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => {
                        const updated = selected
                          ? state.careerInterests.filter((i) => i !== interest)
                          : [...state.careerInterests, interest];
                        setState({ ...state, careerInterests: updated });
                      }}
                      className={`p-3 rounded-2xl border text-xs text-left flex justify-between items-center transition-all ${
                        selected
                          ? "bg-blue-600/15 border-blue-500 text-[var(--foreground)] font-bold shadow-md"
                          : "bg-[var(--background)] border-[var(--border)] text-[var(--subtext)] hover:border-slate-500"
                      }`}
                    >
                      <span>{interest}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: CAREER PREFERENCES */}
          {activeStep === 5 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 5: Career Preferences & Work Style</h2>
                <p className="text-xs text-[var(--subtext)]">Target company types, remote/hybrid preferences, and international mobility.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Preferred Company Type</label>
                  <select
                    value={state.careerPreferences.preferredCompanyType}
                    onChange={(e) =>
                      setState({
                        ...state,
                        careerPreferences: { ...state.careerPreferences, preferredCompanyType: e.target.value as any },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  >
                    <option value="Startup" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Startup</option>
                    <option value="MNC" className="bg-[#0f172a] text-slate-100 font-semibold py-2">MNC / Corporate</option>
                    <option value="Government" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Government / Public Sector</option>
                    <option value="Research" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Research Lab</option>
                    <option value="NGO" className="bg-[#0f172a] text-slate-100 font-semibold py-2">NGO / Non-Profit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Preferred Work Style</label>
                  <select
                    value={state.careerPreferences.preferredWorkStyle}
                    onChange={(e) =>
                      setState({
                        ...state,
                        careerPreferences: { ...state.careerPreferences, preferredWorkStyle: e.target.value as any },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  >
                    <option value="Remote" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Remote First</option>
                    <option value="Hybrid" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Hybrid</option>
                    <option value="On Site" className="bg-[#0f172a] text-slate-100 font-semibold py-2">On Site</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Relocation Willingness</label>
                  <select
                    value={state.careerPreferences.relocationPreference}
                    onChange={(e) =>
                      setState({
                        ...state,
                        careerPreferences: { ...state.careerPreferences, relocationPreference: e.target.value as any },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  >
                    <option value="Yes" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Yes, willing to relocate</option>
                    <option value="No" className="bg-[#0f172a] text-slate-100 font-semibold py-2">No, local only</option>
                    <option value="Maybe" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Maybe for right offer</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CAREER MOTIVATION */}
          {activeStep === 6 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 6: Primary Career Motivations</h2>
                <p className="text-xs text-[var(--subtext)]">What drives your decision making and career commitment?</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MOTIVATION_OPTIONS.map((motivation) => {
                  const selected = state.careerMotivations.includes(motivation);
                  return (
                    <button
                      key={motivation}
                      type="button"
                      onClick={() => {
                        const updated = selected
                          ? state.careerMotivations.filter((m) => m !== motivation)
                          : [...state.careerMotivations, motivation];
                        setState({ ...state, careerMotivations: updated });
                      }}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                        selected
                          ? "bg-blue-600/15 border-blue-500 text-[var(--foreground)] font-bold shadow-md"
                          : "bg-[var(--background)] border-[var(--border)] text-[var(--subtext)] hover:border-slate-500"
                      }`}
                    >
                      <span className="text-xs">{motivation}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: CURRENT AVAILABILITY */}
          {activeStep === 7 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 7: Current Availability Status</h2>
                <p className="text-xs text-[var(--subtext)]">Indicate your readiness for immediate opportunities or networking.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABILITY_OPTIONS.map((option) => {
                  const selected = state.currentAvailability === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setState({ ...state, currentAvailability: option })}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                        selected
                          ? "bg-blue-600/15 border-blue-500 text-[var(--foreground)] font-bold shadow-md"
                          : "bg-[var(--background)] border-[var(--border)] text-[var(--subtext)] hover:border-slate-500"
                      }`}
                    >
                      <span className="text-xs font-semibold">{option}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-cyan-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: THREE-HORIZON GOALS */}
          {activeStep === 8 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 8: Three-Horizon Career Goals</h2>
                <p className="text-xs text-[var(--subtext)]">Define your short, medium, and long-term milestones.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Short-Term Goal (1 Year)</label>
                  <input
                    type="text"
                    value={state.goals.shortTermGoal1Yr}
                    onChange={(e) =>
                      setState({
                        ...state,
                        goals: { ...state.goals, shortTermGoal1Yr: e.target.value },
                      })
                    }
                    placeholder="e.g. Secure campus placement or 30% promotion"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Medium-Term Goal (3 Years)</label>
                  <input
                    type="text"
                    value={state.goals.mediumTermGoal3Yr}
                    onChange={(e) =>
                      setState({
                        ...state,
                        goals: { ...state.goals, mediumTermGoal3Yr: e.target.value },
                      })
                    }
                    placeholder="e.g. Lead an engineering squad or complete higher studies"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[var(--foreground)]">Long-Term Goal (5–10 Years)</label>
                  <input
                    type="text"
                    value={state.goals.longTermGoal5To10Yr}
                    onChange={(e) =>
                      setState({
                        ...state,
                        goals: { ...state.goals, longTermGoal5To10Yr: e.target.value },
                      })
                    }
                    placeholder="e.g. Achieve financial independence or become Chief AI Officer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: AI MASTER PROFILE SUMMARY */}
          {activeStep === 9 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Step 9: Master Profile AI Synthesis</h2>
                  <p className="text-xs text-[var(--subtext)]">Live profile card and confidence score.</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono font-bold">
                  AI Confidence: {aiSummaryData.aiConfidencePercentage}%
                </span>
              </div>

              {/* Master AI Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-transparent border border-blue-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white font-black text-xl flex items-center justify-center shadow-md">
                      {state.personalProfile.firstName[0]}
                      {state.personalProfile.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-[var(--foreground)]">
                        {state.personalProfile.firstName} {state.personalProfile.lastName}
                      </h3>
                      <span className="text-xs font-mono text-blue-500 dark:text-cyan-400 font-semibold">
                        {aiSummaryData.currentStageBadge}
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-[var(--subtext)]">
                    <div>{state.personalProfile.city}, {state.personalProfile.country}</div>
                    <div>Age {state.personalProfile.calculatedAge}</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--subtext)] font-mono">
                    Executive Profile Highlights
                  </div>
                  <ul className="space-y-1.5 text-xs text-[var(--foreground)]">
                    {aiSummaryData.summaryBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* VALIDATION ERROR BANNER */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-mono font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>⚠️ {validationError}</span>
          </div>
          <span className="text-[10px] opacity-80">(Enter "N/A" if not applicable)</span>
        </div>
      )}

      {/* FOOTER WIZARD NAVIGATION BUTTONS */}
      <div className="flex justify-between items-center pt-2">
        <button
          onClick={handleBack}
          disabled={activeStep === 1}
          className="px-5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs font-bold text-[var(--foreground)] disabled:opacity-40 flex items-center gap-1.5 hover:bg-[var(--glass-bg)] transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        {activeStep < 9 ? (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-500 transition-all flex items-center gap-1.5"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmitProfile}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 text-white font-extrabold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitted ? "Update & Save Profile" : "Submit & Save Profile"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
