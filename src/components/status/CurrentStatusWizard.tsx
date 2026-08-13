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
  Upload,
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
    preferredCompanyType: "",
    preferredWorkStyle: "",
    preferredCountry: "",
    relocationPreference: "",
    openToInternationalOpportunities: true,
  },
  careerMotivations: [],
  currentAvailability: "",
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

const INTEREST_OPTIONS: string[] = [
  "Artificial Intelligence & Machine Learning",
  "Data Science & Big Data Analytics",
  "Cybersecurity & Digital Forensics",
  "Cloud Computing & DevOps",
  "Full Stack & Web Development",
  "Mobile App Development (iOS/Android)",
  "Blockchain & Web3 Technologies",
  "AR / VR & Gaming Development",
  "Robotics & Automation Engineering",
  "Embedded Systems & IoT",
  "Semiconductor & Core VLSI",
  "Finance & FinTech",
  "Healthcare & HealthTech",
  "EdTech & E-Learning",
  "E-Commerce & Retail Tech",
  "Product Management",
  "UI/UX & Digital Product Design",
  "Marketing & Growth Operations",
  "Sales & Business Development",
  "Human Resources & Talent Management",
  "Renewable Energy & CleanTech",
  "Aerospace & Defense Engineering",
  "Logistics & Supply Chain Management",
  "Law & Intellectual Property",
  "Government & Public Sector",
  "Agriculture & AgTech",
  "Research & Academia",
  "Media, Content & Journalism",
  "Other",
];

const COMPANY_TYPE_OPTIONS = [
  "Startup (Early Stage / Seed)",
  "Scale-up / High Growth Tech",
  "MNC / Enterprise Corporate",
  "Mid-Sized Business (SME)",
  "Government / Public Sector Enterprise",
  "PSU (Public Sector Undertaking)",
  "Research Lab / Defense R&D",
  "Consulting & Professional Services",
  "NGO / Non-Profit / Social Enterprise",
  "Freelance / Independent Agency",
  "Other",
];

const WORK_STYLE_OPTIONS = [
  "Remote First / Fully Remote",
  "Hybrid (Flexible Home & Office)",
  "On Site / In Office",
  "Field Work / Site Operations",
  "Flexible / Outcome Based",
  "Other",
];

const RELOCATION_OPTIONS = [
  "Yes, willing to relocate nationally",
  "Yes, willing to relocate internationally",
  "No, local city only",
  "Maybe for the right opportunity",
  "Open to Remote relocation only",
  "Other",
];

const TARGET_INDUSTRY_OPTIONS = [
  "Information Technology & Software",
  "Artificial Intelligence & Tech Services",
  "Banking, Financial Services & Insurance (BFSI)",
  "Healthcare, Pharma & Biotechnology",
  "Automotive & Electric Vehicles",
  "Aerospace & Defense Engineering",
  "E-Commerce & Retail Tech",
  "Education & EdTech",
  "Energy, Oil & Renewable CleanTech",
  "Telecommunications & Networking",
  "Manufacturing & Heavy Engineering",
  "Media, Entertainment & Gaming",
  "Other",
];

const MOTIVATION_OPTIONS: string[] = [
  "Competitive Compensation & Wealth Building",
  "Financial Freedom & Independence",
  "Leadership & Team Management",
  "Entrepreneurship & Startup Creation",
  "Research & Scientific Innovation",
  "Cutting-Edge Technology & Building Products",
  "Continuous Learning & Skill Mastery",
  "Work-Life Balance & Personal Wellbeing",
  "Job Security & Long-Term Stability",
  "Social Impact & Community Contribution",
  "Industry Recognition & Authority",
  "Global Mobility & International Exposure",
  "Autonomy & Creative Freedom",
  "Fast-Track Promotions & Career Growth",
  "Mentorship & Developing Talent",
  "Other",
];

const AVAILABILITY_OPTIONS: string[] = [
  "Actively Seeking Full-Time Job Roles",
  "Actively Seeking Internship / Co-op",
  "Actively Seeking Campus Placement",
  "Open to Opportunities (Casually Exploring)",
  "Seeking Co-Founder / Business Partner",
  "Seeking Angel / Seed Investors",
  "Currently Employed & Open to Advisory / Freelance",
  "Currently Studying (Not Looking for Jobs Yet)",
  "Not Available / Not Looking",
  "Other",
];

const DEGREE_OPTIONS = [
  "B.Tech - Bachelor of Technology",
  "B.E. - Bachelor of Engineering",
  "B.Sc - Bachelor of Science",
  "B.C.A. - Bachelor of Computer Applications",
  "B.B.A. - Bachelor of Business Administration",
  "B.Com - Bachelor of Commerce",
  "B.A. - Bachelor of Arts",
  "B.Arch - Bachelor of Architecture",
  "B.Pharm - Bachelor of Pharmacy",
  "MBBS - Bachelor of Medicine",
  "LL.B. - Bachelor of Laws",
  "M.Tech - Master of Technology",
  "M.E. - Master of Engineering",
  "M.Sc - Master of Science",
  "M.C.A. - Master of Computer Applications",
  "M.B.A. - Master of Business Administration",
  "M.Com - Master of Commerce",
  "M.A. - Master of Arts",
  "Ph.D. / Doctorate",
  "Diploma Program",
  "Other",
];

const SPECIALIZATION_OPTIONS = [
  "Computer Science & Engineering (CSE)",
  "Information Technology (IT)",
  "Artificial Intelligence & Data Science (AI & DS)",
  "Artificial Intelligence & Machine Learning (AI & ML)",
  "Cyber Security & Digital Forensics",
  "Electronics & Communication Engineering (ECE)",
  "Electrical & Electronics Engineering (EEE)",
  "Mechanical Engineering",
  "Civil Engineering",
  "Robotics & Automation Engineering",
  "Biotechnology / Biomedical Engineering",
  "Aeronautical & Aerospace Engineering",
  "Chemical Engineering",
  "Data Science & Big Data Analytics",
  "Software Engineering & Cloud Computing",
  "VLSI Design & Embedded Systems",
  "Automobile Engineering",
  "Mechatronics Engineering",
  "Business Administration & Management",
  "Finance & Banking",
  "Marketing & Digital Communications",
  "Commerce & Accounting",
  "Physics / Applied Physics",
  "Chemistry / Biochemistry",
  "Mathematics & Statistics",
  "Design / UI-UX / Interactive Media",
  "Other",
];

const TAMIL_NADU_INSTITUTIONS = [
  "RMD Engineering College, Thiruvallur",
  "RMK Engineering College, Thiruvallur",
  "Anna University, Chennai",
  "Indian Institute of Technology (IIT) Madras, Chennai",
  "National Institute of Technology (NIT) Tiruchirappalli",
  "PSG College of Technology, Coimbatore",
  "Sri Sivasubramaniya Nadar (SSN) College of Engineering, Chennai",
  "Vellore Institute of Technology (VIT), Vellore",
  "SRM Institute of Science and Technology, Kattankulathur",
  "SASTRA Deemed University, Thanjavur",
  "Amrita Vishwa Vidyapeetham, Coimbatore",
  "College of Engineering Guindy (CEG), Anna University",
  "Madras Institute of Technology (MIT Campus), Anna University",
  "Coimbatore Institute of Technology (CIT), Coimbatore",
  "Thiagarajar College of Engineering (TCE), Madurai",
  "Rajalakshmi Engineering College (REC), Chennai",
  "St. Joseph's College of Engineering, Chennai",
  "Sri Venkateswara College of Engineering (SVCE), Sriperumbudur",
  "Easwari Engineering College, Chennai",
  "KCG College of Technology, Chennai",
  "Saveetha Engineering College, Chennai",
  "Loyola College, Chennai",
  "Madras Christian College (MCC), Chennai",
  "Presidency College, Chennai",
  "Kumaraguru College of Technology (KCT), Coimbatore",
  "Sri Krishna College of Engineering and Technology (SKCET), Coimbatore",
  "Bannari Amman Institute of Technology (BIT), Sathyamangalam",
  "Mepco Schlenk Engineering College, Sivakasi",
  "Government College of Technology (GCT), Coimbatore",
  "Government College of Engineering, Salem",
  "Government College of Engineering, Bargur",
  "Government College of Engineering, Tirunelveli",
  "Alagappa College of Technology (ACT Campus), Anna University",
  "Alagappa University, Karaikudi",
  "Bharathidasan University, Tiruchirappalli",
  "Bharathiar University, Coimbatore",
  "Madurai Kamaraj University, Madurai",
  "Annamalai University, Chidambaram",
  "Tamil Nadu Agricultural University (TNAU), Coimbatore",
  "Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology",
  "Hindustan Institute of Technology and Science (HITS), Chennai",
  "Sathyabama Institute of Science and Technology, Chennai",
  "KSR College of Technology, Tiruchengode",
  "Kongu Engineering College, Perundurai",
  "National Engineering College, Kovilpatti",
  "Other",
];

function matchOption(options: string[], value: string): string {
  if (!value) return "";
  const vUpper = value.trim().toUpperCase();
  const exact = options.find((o) => o.toUpperCase() === vUpper);
  if (exact) return exact;
  const partial = options.find((o) => {
    const oUpper = o.toUpperCase();
    return (
      oUpper.startsWith(vUpper) ||
      vUpper.startsWith(oUpper.split(" ")[0]) ||
      (vUpper.length > 2 && oUpper.includes(vUpper))
    );
  });
  if (partial) return partial;
  return "Other";
}

const MASTER_STEPS = [
  { id: 1, title: "Primary Role" },
  { id: 2, title: "Personal Profile & Contact" },
  { id: 3, title: "Role Specifics" },
  { id: 4, title: "Career Interests" },
  { id: 5, title: "Preferences" },
  { id: 6, title: "Motivations" },
  { id: 7, title: "Availability" },
  { id: 8, title: "Three-Horizon Goals" },
  { id: 9, title: "Master Summary" },
];

export function CurrentStatusWizard() {
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState<MasterProfileState>(DEFAULT_MASTER_STATE);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [savingStatus, setSavingStatus] = useState<"saved" | "saving">("saved");

  const [customDegreeActive, setCustomDegreeActive] = useState<boolean>(false);
  const [customSpecActive, setCustomSpecActive] = useState<boolean>(false);
  const [customUnivActive, setCustomUnivActive] = useState<boolean>(false);

  const [customInterestInput, setCustomInterestInput] = useState<string>("");
  const [customCompTypeActive, setCustomCompTypeActive] = useState<boolean>(false);
  const [customWorkStyleActive, setCustomWorkStyleActive] = useState<boolean>(false);
  const [customRelocActive, setCustomRelocActive] = useState<boolean>(false);
  const [customIndustryActive, setCustomIndustryActive] = useState<boolean>(false);

  const [customMotivationInput, setCustomMotivationInput] = useState<string>("");
  const [customAvailInput, setCustomAvailInput] = useState<string>("");
  const [customAvailActive, setCustomAvailActive] = useState<boolean>(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setState((prev) => ({
          ...prev,
          personalProfile: { ...prev.personalProfile, profilePhotoUrl: base64String },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

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

  // Derived option matches for Student dropdowns
  const matchedDegree = useMemo(() => matchOption(DEGREE_OPTIONS, state.studentData.degree), [state.studentData.degree]);
  const isDegreeOther = customDegreeActive || (Boolean(state.studentData.degree) && matchedDegree === "Other");

  const matchedSpec = useMemo(() => matchOption(SPECIALIZATION_OPTIONS, state.studentData.specialization), [state.studentData.specialization]);
  const isSpecOther = customSpecActive || (Boolean(state.studentData.specialization) && matchedSpec === "Other");

  const matchedUniv = useMemo(() => matchOption(TAMIL_NADU_INSTITUTIONS, state.studentData.university || state.studentData.college), [state.studentData.university, state.studentData.college]);
  const isUnivOther = customUnivActive || (Boolean(state.studentData.university || state.studentData.college) && matchedUniv === "Other");

  // Derived option matches for Step 5 Preferences dropdowns
  const matchedCompType = useMemo(() => matchOption(COMPANY_TYPE_OPTIONS, state.careerPreferences.preferredCompanyType), [state.careerPreferences.preferredCompanyType]);
  const isCompTypeOther = customCompTypeActive || (Boolean(state.careerPreferences.preferredCompanyType) && matchedCompType === "Other");

  const matchedWorkStyle = useMemo(() => matchOption(WORK_STYLE_OPTIONS, state.careerPreferences.preferredWorkStyle), [state.careerPreferences.preferredWorkStyle]);
  const isWorkStyleOther = customWorkStyleActive || (Boolean(state.careerPreferences.preferredWorkStyle) && matchedWorkStyle === "Other");

  const matchedRelocation = useMemo(() => matchOption(RELOCATION_OPTIONS, state.careerPreferences.relocationPreference), [state.careerPreferences.relocationPreference]);
  const isRelocationOther = customRelocActive || (Boolean(state.careerPreferences.relocationPreference) && matchedRelocation === "Other");

  const matchedIndustry = useMemo(() => matchOption(TARGET_INDUSTRY_OPTIONS, state.careerPreferences.preferredIndustry), [state.careerPreferences.preferredIndustry]);
  const isIndustryOther = customIndustryActive || (Boolean(state.careerPreferences.preferredIndustry) && matchedIndustry === "Other");

  const matchedAvailability = useMemo(() => matchOption(AVAILABILITY_OPTIONS, state.currentAvailability), [state.currentAvailability]);
  const isAvailabilityOther = customAvailActive || (Boolean(state.currentAvailability) && matchedAvailability === "Other");

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
      } else if (state.primaryRole === "Employee") {
        if (!state.employeeData.designation?.trim()) {
          setValidationError("Job Title is required (Enter 'N/A' if not applicable).");
          return false;
        }
        if (!state.employeeData.company?.trim()) {
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
      {/* UNIFIED HEADER LOCKUP */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-[var(--border)] flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            {isSubmitted ? (
              <span className="module-badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                ✓ Profile Submitted & Saved
              </span>
            ) : (
              <span className="module-badge bg-blue-500/10 border border-blue-500/20 text-cyan-400">
                Phase 3 — Master Profile Engine
              </span>
            )}

            <span className="flex items-center gap-1 text-[11px] font-mono">
              {savingStatus === "saving" ? (
                <span className="text-amber-500 animate-pulse flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Autosaving...
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <Check className="w-3 h-3" /> All changes saved
                </span>
              )}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
            Personal & Professional Profile
          </h1>
          <p className="text-xs text-[var(--subtext)] max-w-lg leading-relaxed">
            {isSubmitted
              ? "Your profile parameters are saved and active for Human Capital valuation."
              : "The foundational Master Profile powering your Human Capital Score, career recommendations, and financial assessments."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setActiveStep(1);
            }}
            className="wizard-nav-btn bg-[var(--surface-2)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs hover:border-slate-500 transition-all"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Edit Profile
          </button>

          {isSubmitted && (
            <Link
              href="/dashboard/financial"
              className="wizard-nav-btn bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs shadow-lg shadow-emerald-900/20 hover:opacity-95 transition-all"
            >
              Next Module: Financial Health <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* STEP PROGRESS NAVIGATION */}
      <div className="glass-panel p-4 rounded-2xl border border-[var(--border)] space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-[var(--foreground)]">
            Step {activeStep} of 9: <strong className="text-cyan-400">{MASTER_STEPS[activeStep - 1].title}</strong>
          </span>
          <span className="text-xs font-mono font-semibold text-cyan-400">{Math.round((activeStep / 9) * 100)}% Processed</span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 rounded-full"
            animate={{ width: `${(activeStep / 9) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Step Chips */}
        <div className="scroll-fade-container">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar pr-12">
            {MASTER_STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`step-chip ${
                  activeStep === step.id
                    ? "step-chip-active"
                    : step.id < activeStep
                    ? "step-chip-completed"
                    : ""
                }`}
              >
                {step.id < activeStep && <Check className="w-3 h-3" />}
                <span>{step.id}. {step.title}</span>
              </button>
            ))}
          </div>
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
                <p className="text-xs text-[var(--subtext)]">Non-sensitive identity parameters, profile picture, and communication handles.</p>
              </div>

              {/* Profile Photo Uploader Card */}
              <div className="p-4 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] flex items-center gap-4">
                <div className="relative group shrink-0">
                  {state.personalProfile.profilePhotoUrl ? (
                    <img
                      src={state.personalProfile.profilePhotoUrl}
                      alt="Profile Avatar"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white font-black text-xl flex items-center justify-center shadow-md">
                      {state.personalProfile.firstName?.[0] || "D"}
                      {state.personalProfile.lastName?.[0] || "K"}
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-[10px] text-white font-bold">
                    {state.personalProfile.profilePhotoUrl ? "Change" : "Upload"}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-[var(--foreground)]">Profile Picture / Avatar</div>
                  <p className="text-[11px] text-[var(--subtext)]">Upload your profile image picture. It will display on your DK profile card.</p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-medium cursor-pointer hover:bg-blue-500/20 transition-all">
                    <Upload className="w-3.5 h-3.5" />
                    {state.personalProfile.profilePhotoUrl ? "Change Picture" : "Upload Picture"}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
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
                <div className="space-y-6">
                  {/* Banner / Info Header */}
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent border border-blue-500/20 text-xs">
                    <GraduationCap className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">Student Academic Specification</h3>
                      <p className="text-[var(--subtext)] text-[11px]">Select your degree, specialization, and institution (featuring top Tamil Nadu colleges). If your option is not in the dropdown, select "Other" to enter it manually.</p>
                    </div>
                  </div>

                  {/* Section 1: Academic Programs & Institution */}
                  <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-mono">
                      <BookOpen className="w-3.5 h-3.5" /> Academic Programs & Institution
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Degree Program */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)] flex items-center justify-between">
                          <span>Degree Program <span className="text-rose-500">*</span></span>
                          {isDegreeOther && <span className="text-[10px] text-cyan-400 font-mono">Custom Course</span>}
                        </label>
                        <select
                          value={isDegreeOther ? "Other" : matchedDegree}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Other") {
                              setCustomDegreeActive(true);
                              if (matchOption(DEGREE_OPTIONS, state.studentData.degree) !== "Other") {
                                setState((prev) => ({
                                  ...prev,
                                  studentData: { ...prev.studentData, degree: "" },
                                }));
                              }
                            } else {
                              setCustomDegreeActive(false);
                              setState((prev) => ({
                                ...prev,
                                studentData: { ...prev.studentData, degree: val },
                              }));
                            }
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-all"
                        >
                          <option value="" disabled className="bg-[#0f172a] text-slate-400">Select Degree Program...</option>
                          {DEGREE_OPTIONS.map((deg) => (
                            <option key={deg} value={deg} className="bg-[#0f172a] text-slate-100 font-semibold py-2">
                              {deg}
                            </option>
                          ))}
                        </select>

                        {isDegreeOther && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pt-1 space-y-1"
                          >
                            <input
                              type="text"
                              value={state.studentData.degree === "Other" ? "" : state.studentData.degree}
                              onChange={(e) =>
                                setState((prev) => ({
                                  ...prev,
                                  studentData: { ...prev.studentData, degree: e.target.value },
                                }))
                              }
                              placeholder="Type your course / degree program..."
                              className="w-full px-3.5 py-2.5 rounded-xl bg-blue-950/20 border border-blue-500/40 text-xs text-[var(--foreground)] placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* Specialization / Major */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)] flex items-center justify-between">
                          <span>Specialization / Major</span>
                          {isSpecOther && <span className="text-[10px] text-cyan-400 font-mono">Custom Specialization</span>}
                        </label>
                        <select
                          value={isSpecOther ? "Other" : matchedSpec}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Other") {
                              setCustomSpecActive(true);
                              if (matchOption(SPECIALIZATION_OPTIONS, state.studentData.specialization) !== "Other") {
                                setState((prev) => ({
                                  ...prev,
                                  studentData: { ...prev.studentData, specialization: "" },
                                }));
                              }
                            } else {
                              setCustomSpecActive(false);
                              setState((prev) => ({
                                ...prev,
                                studentData: { ...prev.studentData, specialization: val },
                              }));
                            }
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-all"
                        >
                          <option value="" disabled className="bg-[#0f172a] text-slate-400">Select Specialization / Major...</option>
                          {SPECIALIZATION_OPTIONS.map((spec) => (
                            <option key={spec} value={spec} className="bg-[#0f172a] text-slate-100 font-semibold py-2">
                              {spec}
                            </option>
                          ))}
                        </select>

                        {isSpecOther && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pt-1 space-y-1"
                          >
                            <input
                              type="text"
                              value={state.studentData.specialization === "Other" ? "" : state.studentData.specialization}
                              onChange={(e) =>
                                setState((prev) => ({
                                  ...prev,
                                  studentData: { ...prev.studentData, specialization: e.target.value },
                                }))
                              }
                              placeholder="Type your specialization (e.g., Robotics & AI)"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-blue-950/20 border border-blue-500/40 text-xs text-[var(--foreground)] placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* University / Institution */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)] flex items-center justify-between">
                          <span>University / Institution (TN) <span className="text-rose-500">*</span></span>
                          {isUnivOther && <span className="text-[10px] text-cyan-400 font-mono">Custom Institution</span>}
                        </label>
                        <select
                          value={isUnivOther ? "Other" : matchedUniv}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Other") {
                              setCustomUnivActive(true);
                              if (matchOption(TAMIL_NADU_INSTITUTIONS, state.studentData.university || state.studentData.college) !== "Other") {
                                setState((prev) => ({
                                  ...prev,
                                  studentData: { ...prev.studentData, university: "", college: "" },
                                }));
                              }
                            } else {
                              setCustomUnivActive(false);
                              setState((prev) => ({
                                ...prev,
                                studentData: { ...prev.studentData, university: val, college: val },
                              }));
                            }
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-all"
                        >
                          <option value="" disabled className="bg-[#0f172a] text-slate-400">Select Institution / College...</option>
                          {TAMIL_NADU_INSTITUTIONS.map((inst) => (
                            <option key={inst} value={inst} className="bg-[#0f172a] text-slate-100 font-semibold py-2">
                              {inst}
                            </option>
                          ))}
                        </select>

                        {isUnivOther && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pt-1 space-y-1"
                          >
                            <input
                              type="text"
                              value={(state.studentData.university === "Other" || state.studentData.college === "Other") ? "" : (state.studentData.university || state.studentData.college || "")}
                              onChange={(e) => {
                                const val = e.target.value;
                                setState((prev) => ({
                                  ...prev,
                                  studentData: { ...prev.studentData, university: val, college: val },
                                }));
                              }}
                              placeholder="Type your institution name"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-blue-950/20 border border-blue-500/40 text-xs text-[var(--foreground)] placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Performance & Placement Status */}
                  <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-mono">
                      <Award className="w-3.5 h-3.5" /> Performance & Placement Status
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">College Type</label>
                        <select
                          value={state.studentData.collegeType}
                          onChange={(e) =>
                            setState({
                              ...state,
                              studentData: { ...state.studentData, collegeType: e.target.value as any },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        >
                          <option value="Government" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Government</option>
                          <option value="Private" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Private</option>
                          <option value="Autonomous" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Autonomous</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
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
                          placeholder="e.g. 8.5 CGPA or 85%"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Placement Status</label>
                        <select
                          value={state.studentData.currentPlacementStatus}
                          onChange={(e) =>
                            setState({
                              ...state,
                              studentData: { ...state.studentData, currentPlacementStatus: e.target.value as any },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
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

                  {/* Section 3: Academic Category & Timeline */}
                  <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-mono">
                      <Clock className="w-3.5 h-3.5" /> Academic Category & Timeline
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Student Category</label>
                        <select
                          value={state.studentData.studentCategory || "Undergraduate"}
                          onChange={(e) =>
                            setState({
                              ...state,
                              studentData: { ...state.studentData, studentCategory: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        >
                          <option value="Undergraduate" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Undergraduate (UG)</option>
                          <option value="Postgraduate" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Postgraduate (PG)</option>
                          <option value="Doctorate" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Doctorate (Ph.D.)</option>
                          <option value="Diploma" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Diploma / Polytechnic</option>
                          <option value="High School" className="bg-[#0f172a] text-slate-100 font-semibold py-2">High School / Higher Secondary</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Current Year of Study</label>
                        <select
                          value={state.studentData.currentYear || "1st Year"}
                          onChange={(e) =>
                            setState({
                              ...state,
                              studentData: { ...state.studentData, currentYear: e.target.value },
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                        >
                          <option value="1st Year" className="bg-[#0f172a] text-slate-100 font-semibold py-2">1st Year</option>
                          <option value="2nd Year" className="bg-[#0f172a] text-slate-100 font-semibold py-2">2nd Year</option>
                          <option value="3rd Year" className="bg-[#0f172a] text-slate-100 font-semibold py-2">3rd Year</option>
                          <option value="4th Year" className="bg-[#0f172a] text-slate-100 font-semibold py-2">4th Year</option>
                          <option value="5th Year" className="bg-[#0f172a] text-slate-100 font-semibold py-2">5th Year</option>
                          <option value="Graduated" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Graduated</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[var(--foreground)]">Expected Graduation Year</label>
                        <input
                          type="text"
                          value={state.studentData.expectedGraduationYear || ""}
                          onChange={(e) =>
                            setState({
                              ...state,
                              studentData: { ...state.studentData, expectedGraduationYear: e.target.value },
                            })
                          }
                          placeholder="e.g. 2026"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none"
                        />
                      </div>
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
              <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Step 4: Career Interests & Focus Domains</h2>
                  <p className="text-xs text-[var(--subtext)]">Select target career domains one by one. Click to select or deselect.</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400">
                  {state.careerInterests.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
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
                          ? "bg-blue-600/20 border-blue-500 text-[var(--foreground)] font-bold shadow-md scale-[1.01]"
                          : "bg-[var(--background)] border-[var(--border)] text-[var(--subtext)] hover:border-slate-500 hover:text-[var(--foreground)]"
                      }`}
                    >
                      <span className="leading-tight">{interest}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {state.careerInterests.includes("Other") && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2"
                >
                  <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Specify Custom Career Interests / Domains
                  </label>
                  <input
                    type="text"
                    value={customInterestInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomInterestInput(val);
                      const filtered = state.careerInterests.filter((i) => i !== "Other" && !i.startsWith("Other: "));
                      const updated = val.trim() ? [...filtered, `Other: ${val.trim()}`] : [...filtered, "Other"];
                      setState((prev) => ({ ...prev, careerInterests: updated }));
                    }}
                    placeholder="Type custom focus domain (e.g. Quantum Computing, BioInformatics)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-cyan-400 focus:outline-none"
                  />
                </motion.div>
              )}
            </div>
          )}

          {/* STEP 5: CAREER PREFERENCES */}
          {activeStep === 5 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 5: Career Preferences & Work Style</h2>
                <p className="text-xs text-[var(--subtext)]">Target company types, remote/hybrid preferences, and international mobility.</p>
              </div>

              {/* Card 1: Company Type & Work Setup */}
              <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-mono">
                  <Building2 className="w-3.5 h-3.5" /> Organization & Work Environment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Preferred Company Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--foreground)] flex items-center justify-between">
                      <span>Preferred Company Type</span>
                      {isCompTypeOther && <span className="text-[10px] text-cyan-400 font-mono">Custom Input</span>}
                    </label>
                    <select
                      value={isCompTypeOther ? "Other" : matchedCompType}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Other") {
                          setCustomCompTypeActive(true);
                          if (matchOption(COMPANY_TYPE_OPTIONS, state.careerPreferences.preferredCompanyType) !== "Other") {
                            setState((prev) => ({
                              ...prev,
                              careerPreferences: { ...prev.careerPreferences, preferredCompanyType: "" },
                            }));
                          }
                        } else {
                          setCustomCompTypeActive(false);
                          setState((prev) => ({
                            ...prev,
                            careerPreferences: { ...prev.careerPreferences, preferredCompanyType: val },
                          }));
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="" disabled className="bg-[#0f172a] text-slate-400">Select Preferred Company Type...</option>
                      {COMPANY_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type} className="bg-[#0f172a] text-slate-100 font-semibold py-2">
                          {type}
                        </option>
                      ))}
                    </select>

                    {isCompTypeOther && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
                        <input
                          type="text"
                          value={state.careerPreferences.preferredCompanyType === "Other" ? "" : state.careerPreferences.preferredCompanyType}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              careerPreferences: { ...prev.careerPreferences, preferredCompanyType: e.target.value },
                            }))
                          }
                          placeholder="Type custom company type..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-blue-950/20 border border-blue-500/40 text-xs text-[var(--foreground)] placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Preferred Work Style */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--foreground)] flex items-center justify-between">
                      <span>Preferred Work Style</span>
                      {isWorkStyleOther && <span className="text-[10px] text-cyan-400 font-mono">Custom Input</span>}
                    </label>
                    <select
                      value={isWorkStyleOther ? "Other" : matchedWorkStyle}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Other") {
                          setCustomWorkStyleActive(true);
                          if (matchOption(WORK_STYLE_OPTIONS, state.careerPreferences.preferredWorkStyle) !== "Other") {
                            setState((prev) => ({
                              ...prev,
                              careerPreferences: { ...prev.careerPreferences, preferredWorkStyle: "" },
                            }));
                          }
                        } else {
                          setCustomWorkStyleActive(false);
                          setState((prev) => ({
                            ...prev,
                            careerPreferences: { ...prev.careerPreferences, preferredWorkStyle: val },
                          }));
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="" disabled className="bg-[#0f172a] text-slate-400">Select Preferred Work Style...</option>
                      {WORK_STYLE_OPTIONS.map((ws) => (
                        <option key={ws} value={ws} className="bg-[#0f172a] text-slate-100 font-semibold py-2">
                          {ws}
                        </option>
                      ))}
                    </select>

                    {isWorkStyleOther && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
                        <input
                          type="text"
                          value={state.careerPreferences.preferredWorkStyle === "Other" ? "" : state.careerPreferences.preferredWorkStyle}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              careerPreferences: { ...prev.careerPreferences, preferredWorkStyle: e.target.value },
                            }))
                          }
                          placeholder="Type custom work style..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-blue-950/20 border border-blue-500/40 text-xs text-[var(--foreground)] placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Relocation Willingness */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--foreground)] flex items-center justify-between">
                      <span>Relocation Willingness</span>
                      {isRelocationOther && <span className="text-[10px] text-cyan-400 font-mono">Custom Input</span>}
                    </label>
                    <select
                      value={isRelocationOther ? "Other" : matchedRelocation}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Other") {
                          setCustomRelocActive(true);
                          if (matchOption(RELOCATION_OPTIONS, state.careerPreferences.relocationPreference) !== "Other") {
                            setState((prev) => ({
                              ...prev,
                              careerPreferences: { ...prev.careerPreferences, relocationPreference: "" },
                            }));
                          }
                        } else {
                          setCustomRelocActive(false);
                          setState((prev) => ({
                            ...prev,
                            careerPreferences: { ...prev.careerPreferences, relocationPreference: val },
                          }));
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="" disabled className="bg-[#0f172a] text-slate-400">Select Relocation Preference...</option>
                      {RELOCATION_OPTIONS.map((rel) => (
                        <option key={rel} value={rel} className="bg-[#0f172a] text-slate-100 font-semibold py-2">
                          {rel}
                        </option>
                      ))}
                    </select>

                    {isRelocationOther && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
                        <input
                          type="text"
                          value={state.careerPreferences.relocationPreference === "Other" ? "" : state.careerPreferences.relocationPreference}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              careerPreferences: { ...prev.careerPreferences, relocationPreference: e.target.value },
                            }))
                          }
                          placeholder="Type custom relocation preference..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-blue-950/20 border border-blue-500/40 text-xs text-[var(--foreground)] placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Industry Sector & Global Mobility */}
              <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-mono">
                  <Globe className="w-3.5 h-3.5" /> Target Sector & International Mobility
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Preferred Industry Sector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--foreground)] flex items-center justify-between">
                      <span>Target Industry / Sector</span>
                      {isIndustryOther && <span className="text-[10px] text-cyan-400 font-mono">Custom Input</span>}
                    </label>
                    <select
                      value={isIndustryOther ? "Other" : matchedIndustry}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "Other") {
                          setCustomIndustryActive(true);
                          if (matchOption(TARGET_INDUSTRY_OPTIONS, state.careerPreferences.preferredIndustry) !== "Other") {
                            setState((prev) => ({
                              ...prev,
                              careerPreferences: { ...prev.careerPreferences, preferredIndustry: "" },
                            }));
                          }
                        } else {
                          setCustomIndustryActive(false);
                          setState((prev) => ({
                            ...prev,
                            careerPreferences: { ...prev.careerPreferences, preferredIndustry: val },
                          }));
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="" disabled className="bg-[#0f172a] text-slate-400">Select Target Industry...</option>
                      {TARGET_INDUSTRY_OPTIONS.map((ind) => (
                        <option key={ind} value={ind} className="bg-[#0f172a] text-slate-100 font-semibold py-2">
                          {ind}
                        </option>
                      ))}
                    </select>

                    {isIndustryOther && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="pt-1">
                        <input
                          type="text"
                          value={state.careerPreferences.preferredIndustry === "Other" ? "" : state.careerPreferences.preferredIndustry}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              careerPreferences: { ...prev.careerPreferences, preferredIndustry: e.target.value },
                            }))
                          }
                          placeholder="Type custom industry / sector..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-blue-950/20 border border-blue-500/40 text-xs text-[var(--foreground)] placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* International Opportunities & Visas */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--foreground)]">International Opportunities & Visa Preference</label>
                    <select
                      value={state.careerPreferences.openToInternationalOpportunities ? "Yes" : "No"}
                      onChange={(e) =>
                        setState({
                          ...state,
                          careerPreferences: { ...state.careerPreferences, openToInternationalOpportunities: e.target.value === "Yes" },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-all"
                    >
                      <option value="Yes" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Open to International Roles (Visa Sponsorship Required)</option>
                      <option value="No" className="bg-[#0f172a] text-slate-100 font-semibold py-2">Domestic / Local Opportunities Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: CAREER MOTIVATION */}
          {activeStep === 6 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Step 6: Primary Career Motivations</h2>
                  <p className="text-xs text-[var(--subtext)]">What drives your decision making and career commitment? Select your key drivers one by one.</p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400">
                  {state.careerMotivations.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                      className={`p-3.5 rounded-2xl border text-xs text-left flex justify-between items-center transition-all ${
                        selected
                          ? "bg-blue-600/20 border-blue-500 text-[var(--foreground)] font-bold shadow-md scale-[1.01]"
                          : "bg-[var(--background)] border-[var(--border)] text-[var(--subtext)] hover:border-slate-500 hover:text-[var(--foreground)]"
                      }`}
                    >
                      <span className="leading-snug">{motivation}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {state.careerMotivations.includes("Other") && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2"
                >
                  <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Specify Custom Career Motivation
                  </label>
                  <input
                    type="text"
                    value={customMotivationInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomMotivationInput(val);
                      const filtered = state.careerMotivations.filter((m) => m !== "Other" && !m.startsWith("Other: "));
                      const updated = val.trim() ? [...filtered, `Other: ${val.trim()}`] : [...filtered, "Other"];
                      setState((prev) => ({ ...prev, careerMotivations: updated }));
                    }}
                    placeholder="Type custom motivation (e.g. Early Retirement FIRE, Open Source Impact)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-cyan-400 focus:outline-none"
                  />
                </motion.div>
              )}
            </div>
          )}

          {/* STEP 7: CURRENT AVAILABILITY */}
          {activeStep === 7 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 7: Current Availability Status</h2>
                <p className="text-xs text-[var(--subtext)]">Indicate your readiness for immediate opportunities or networking. Select one by one.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABILITY_OPTIONS.map((option) => {
                  const selected = state.currentAvailability === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        if (option === "Other") {
                          setCustomAvailActive(true);
                        } else {
                          setCustomAvailActive(false);
                        }
                        setState({ ...state, currentAvailability: option });
                      }}
                      className={`p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                        selected
                          ? "bg-blue-600/20 border-blue-500 text-[var(--foreground)] font-bold shadow-md scale-[1.01]"
                          : "bg-[var(--background)] border-[var(--border)] text-[var(--subtext)] hover:border-slate-500 hover:text-[var(--foreground)]"
                      }`}
                    >
                      <span className="text-xs font-semibold leading-tight">{option}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>

              {(isAvailabilityOther || state.currentAvailability === "Other") && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-2"
                >
                  <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Specify Custom Availability Status
                  </label>
                  <input
                    type="text"
                    value={customAvailInput}
                    onChange={(e) => {
                      setCustomAvailInput(e.target.value);
                      setState((prev) => ({ ...prev, currentAvailability: e.target.value }));
                    }}
                    placeholder="Type custom availability status (e.g. Sabbatical, Starting Studies Next Semester)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-cyan-400 focus:outline-none"
                  />
                </motion.div>
              )}
            </div>
          )}

          {/* STEP 8: THREE-HORIZON GOALS */}
          {activeStep === 8 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-xl font-bold text-[var(--foreground)]">Step 8: Three-Horizon Career Goals</h2>
                <p className="text-xs text-[var(--subtext)]">Define your short, medium, and long-term milestones. Tap quick suggestion tags or type your custom goals.</p>
              </div>

              <div className="space-y-5">
                {/* Horizon 1: Short-Term Goal */}
                <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-mono">
                      <Target className="w-4 h-4 text-cyan-400" /> Short-Term Goal (1 Year)
                    </label>
                    <span className="text-[10px] text-[var(--subtext)] font-mono">12-Month Horizon</span>
                  </div>

                  <input
                    type="text"
                    value={state.goals.shortTermGoal1Yr}
                    onChange={(e) =>
                      setState({
                        ...state,
                        goals: { ...state.goals, shortTermGoal1Yr: e.target.value },
                      })
                    }
                    placeholder="e.g. Secure campus placement or master AI/Full Stack development"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-cyan-400 focus:outline-none transition-all"
                  />

                  {/* Suggestion Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-[var(--subtext)] font-mono">Suggestions:</span>
                    {[
                      "🚀 Secure Campus Placement",
                      "💻 Master Full Stack & AI Skills",
                      "📈 Achieve 30% Promotion/Growth",
                      "🎓 Complete GRE / GATE Exams",
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() =>
                          setState({
                            ...state,
                            goals: { ...state.goals, shortTermGoal1Yr: chip.replace(/^[^\s]+\s/, "") },
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-cyan-300 hover:bg-blue-500/20 transition-all"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horizon 2: Medium-Term Goal */}
                <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-mono">
                      <TrendingUp className="w-4 h-4 text-cyan-400" /> Medium-Term Goal (3 Years)
                    </label>
                    <span className="text-[10px] text-[var(--subtext)] font-mono">36-Month Horizon</span>
                  </div>

                  <input
                    type="text"
                    value={state.goals.mediumTermGoal3Yr}
                    onChange={(e) =>
                      setState({
                        ...state,
                        goals: { ...state.goals, mediumTermGoal3Yr: e.target.value },
                      })
                    }
                    placeholder="e.g. Lead an engineering team or complete Master's degree"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-cyan-400 focus:outline-none transition-all"
                  />

                  {/* Suggestion Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-[var(--subtext)] font-mono">Suggestions:</span>
                    {[
                      "👨‍💻 Become Senior Engineer / Tech Lead",
                      "📚 Complete Higher Degree / MS",
                      "🚀 Launch Seed-Funded Startup",
                      "💼 Transition into Product Management",
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() =>
                          setState({
                            ...state,
                            goals: { ...state.goals, mediumTermGoal3Yr: chip.replace(/^[^\s]+\s/, "") },
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-cyan-300 hover:bg-blue-500/20 transition-all"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horizon 3: Long-Term Goal */}
                <div className="p-5 rounded-2xl bg-[var(--background)]/60 border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2 font-mono">
                      <Award className="w-4 h-4 text-cyan-400" /> Long-Term Goal (5–10 Years)
                    </label>
                    <span className="text-[10px] text-[var(--subtext)] font-mono">Visionary Horizon</span>
                  </div>

                  <input
                    type="text"
                    value={state.goals.longTermGoal5To10Yr}
                    onChange={(e) =>
                      setState({
                        ...state,
                        goals: { ...state.goals, longTermGoal5To10Yr: e.target.value },
                      })
                    }
                    placeholder="e.g. Become Chief AI Officer or achieve financial independence"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-cyan-400 focus:outline-none transition-all"
                  />

                  {/* Suggestion Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-[var(--subtext)] font-mono">Suggestions:</span>
                    {[
                      "🏆 Chief Technology Officer (CTO)",
                      "💰 Achieve Financial Freedom (FIRE)",
                      "🌐 Recognized Global Specialist",
                      "🏢 Founder & Managing Director",
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() =>
                          setState({
                            ...state,
                            goals: { ...state.goals, longTermGoal5To10Yr: chip.replace(/^[^\s]+\s/, "") },
                          })
                        }
                        className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-cyan-300 hover:bg-blue-500/20 transition-all"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: MASTER PROFILE SUMMARY */}
          {activeStep === 9 && (
            <div className="space-y-6 text-left">
              <div className="border-b border-[var(--border)] pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">Step 9: Master Profile Summary</h2>
                  <p className="text-xs text-[var(--subtext)]">Executive profile card summary.</p>
                </div>
              </div>

              {/* Master Profile Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-transparent border border-blue-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative group shrink-0">
                      {state.personalProfile.profilePhotoUrl ? (
                        <img
                          src={state.personalProfile.profilePhotoUrl}
                          alt={`${state.personalProfile.firstName} ${state.personalProfile.lastName}`}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white font-black text-xl flex items-center justify-center shadow-md">
                          {state.personalProfile.firstName?.[0] || "D"}
                          {state.personalProfile.lastName?.[0] || "K"}
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-[10px] text-white font-bold">
                        {state.personalProfile.profilePhotoUrl ? "Change" : "Upload"}
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
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
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
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
      <div className="flex justify-between items-center pt-3">
        <button
          onClick={handleBack}
          disabled={activeStep === 1}
          className="wizard-nav-btn bg-[var(--surface-1)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Step
        </button>

        {activeStep < 9 ? (
          <button
            onClick={handleNext}
            className="wizard-nav-btn bg-blue-600 text-white text-xs shadow-md shadow-blue-900/30"
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmitProfile}
            className="wizard-nav-btn bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs shadow-lg shadow-emerald-900/25"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isSubmitted ? "Update & Save Profile" : "Submit & Save Profile"}
          </button>
        )}
      </div>
    </div>
  );
}
