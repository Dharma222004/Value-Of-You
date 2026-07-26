"use client";

import React, { useState, useEffect } from "react";
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
  RotateCcw,
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
} from "lucide-react";

export type PrimaryStatus =
  | "Student"
  | "Working Professional"
  | "Founder / Entrepreneur"
  | "Business Owner"
  | "Freelancer"
  | "Self-Employed"
  | "Government Employee"
  | "Job Seeker"
  | "Intern"
  | "Research Scholar / PhD"
  | "Homemaker"
  | "Retired"
  | "Other";

export interface CompleteCurrentStatusData {
  primaryStatus: PrimaryStatus;
  
  // Student Specific
  studentRole: string;
  collegeName: string;
  degree: string;
  department: string;
  yearOfStudy: string;
  cgpaPercentage: string;
  expectedGraduation: string;
  placementStatus: string;
  internshipExperience: string;
  studentProjects: string;
  studentSkills: string;
  studentClubsLeadership: string;
  studentGoal: string;

  // Working Professional Specific
  professionalRole: string;
  companyName: string;
  professionalIndustry: string;
  professionalDepartment: string;
  employmentType: string;
  yearsOfExperience: string;
  currentCompanyTenure: string;
  totalCompaniesWorked: string;
  careerLevel: string;
  teamSizeManaged: string;
  leadershipExperience: string;
  noticePeriod: string;
  workMode: string;
  targetSalaryBand: string;
  professionalGoal: string;

  // Founder / Entrepreneur Specific
  founderRole: string;
  founderCompanyName: string;
  founderIndustry: string;
  startupStage: string;
  numberOfEmployees: string;
  yearsInBusiness: string;
  annualRevenueRange: string;
  fundingStage: string;
  equityOwnership: string;
  founderBottleneck: string;
  founderMilestone: string;

  // Business Owner Specific
  businessType: string;
  businessName: string;
  businessIndustry: string;
  businessYearsOperating: string;
  businessEmployees: string;
  businessAnnualRevenue: string;
  businessGoal: string;

  // Freelancer / Self-Employed Specific
  freelancerRole: string;
  freelancerPlatforms: string;
  freelancerYearsExp: string;
  freelancerMonthlyClients: string;
  freelancerMonthlyRevenue: string;
  freelancerHourlyRate: string;
  freelancerGoal: string;

  // Government Employee Specific
  govtDepartment: string;
  govtDesignation: string;
  govtGrade: string;
  govtYearsService: string;

  // Job Seeker Specific
  jobSeekerTargetRole: string;
  jobSeekerQualification: string;
  jobSeekerTargetIndustry: string;
  jobSeekerExpectedSalary: string;
  jobSeekerPastExp: string;

  // Homemaker / Retired / Other
  homemakerFocus: string;
  homemakerPriorExp: string;
}

const initialEmptyData: CompleteCurrentStatusData = {
  primaryStatus: "Student",

  studentRole: "Undergraduate Student",
  collegeName: "",
  degree: "",
  department: "",
  yearOfStudy: "3rd Year",
  cgpaPercentage: "",
  expectedGraduation: "",
  placementStatus: "Actively Preparing / Campus Drives",
  internshipExperience: "",
  studentProjects: "",
  studentSkills: "",
  studentClubsLeadership: "",
  studentGoal: "Get Campus Placement / First Software Role",

  professionalRole: "Senior Engineer",
  companyName: "",
  professionalIndustry: "Information Technology",
  professionalDepartment: "",
  employmentType: "Full-Time",
  yearsOfExperience: "",
  currentCompanyTenure: "",
  totalCompaniesWorked: "",
  careerLevel: "Senior",
  teamSizeManaged: "",
  leadershipExperience: "",
  noticePeriod: "30 Days",
  workMode: "Hybrid",
  targetSalaryBand: "",
  professionalGoal: "Promotion to Tech Lead / Director Tier",

  founderRole: "Founder / CEO",
  founderCompanyName: "",
  founderIndustry: "Artificial Intelligence",
  startupStage: "Revenue Stage",
  numberOfEmployees: "",
  yearsInBusiness: "",
  annualRevenueRange: "",
  fundingStage: "Bootstrapped",
  equityOwnership: "",
  founderBottleneck: "Hiring Top Technical Talent",
  founderMilestone: "Reach ₹1 Crore ARR",

  businessType: "Service Business",
  businessName: "",
  businessIndustry: "Finance & Advisory",
  businessYearsOperating: "",
  businessEmployees: "",
  businessAnnualRevenue: "",
  businessGoal: "Scale Operations & Digital Expansion",

  freelancerRole: "Software Developer",
  freelancerPlatforms: "",
  freelancerYearsExp: "",
  freelancerMonthlyClients: "",
  freelancerMonthlyRevenue: "",
  freelancerHourlyRate: "",
  freelancerGoal: "Scale to Productized Agency",

  govtDepartment: "",
  govtDesignation: "",
  govtGrade: "Class-I Gazetted",
  govtYearsService: "",

  jobSeekerTargetRole: "",
  jobSeekerQualification: "",
  jobSeekerTargetIndustry: "Information Technology",
  jobSeekerExpectedSalary: "",
  jobSeekerPastExp: "",

  homemakerFocus: "",
  homemakerPriorExp: "",
};

const LOCAL_STORAGE_KEY = "human_capital_current_status_v4";

export const CurrentStatusWizard: React.FC = () => {
  const [formData, setFormData] = useState<CompleteCurrentStatusData>(initialEmptyData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaved, setIsSaved] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSteps = 5;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load local telemetry", e);
    }
  }, []);

  const updateField = (field: keyof CompleteCurrentStatusData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save telemetry locally", e);
      }
      return updated;
    });
    setIsSaved(false);
    setTimeout(() => setIsSaved(true), 350);
  };

  const getAICareerStage = () => {
    const status = formData.primaryStatus;
    if (status === "Student" || status === "Intern" || status === "Research Scholar / PhD") {
      return { stage: "🌱 Student Explorer", color: "text-emerald-400 bg-emerald-950/60 border-emerald-800", desc: "Building foundational degree capital, technical projects & campus placement readiness." };
    }
    if (status === "Founder / Entrepreneur") {
      return { stage: "🦄 Startup Founder", color: "text-purple-400 bg-purple-950/60 border-purple-800", desc: "Scaling high-upside startup equity, managing enterprise product vision & team growth." };
    }
    if (status === "Business Owner") {
      return { stage: "🏢 Business Owner", color: "text-amber-400 bg-amber-950/60 border-amber-800", desc: "Operating profitable revenue business asset with established commercial cashflows." };
    }
    if (status === "Freelancer" || status === "Self-Employed") {
      return { stage: "⚡ Solopreneur / Independent", color: "text-sky-400 bg-sky-950/60 border-sky-800", desc: "Managing direct enterprise client retainers and high hourly leverage." };
    }
    return { stage: "💼 Experienced Professional", color: "text-indigo-400 bg-indigo-950/60 border-indigo-800", desc: "Corporate domain leader driving high-value enterprise output." };
  };

  const aiStage = getAICareerStage();

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const isStudentType =
    formData.primaryStatus === "Student" ||
    formData.primaryStatus === "Intern" ||
    formData.primaryStatus === "Research Scholar / PhD";

  const isProfessionalType = formData.primaryStatus === "Working Professional";
  const isFounderType = formData.primaryStatus === "Founder / Entrepreneur";
  const isBusinessOwnerType = formData.primaryStatus === "Business Owner";
  const isFreelancerType = formData.primaryStatus === "Freelancer" || formData.primaryStatus === "Self-Employed";

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                MODULE 1: CURRENT STATUS & CAREER
              </span>
              <span className="text-xs font-mono text-slate-400">Step {currentStep} of {totalSteps}</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-3">
              <span>{formData.primaryStatus.toUpperCase()} Diagnostic Wizard</span>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${aiStage.color}`}>
                {aiStage.stage}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
              <Save className={`w-3.5 h-3.5 ${isSaved ? "text-emerald-400" : "text-amber-400 animate-spin"}`} />
              <span>{isSaved ? "Autosaved Locally" : "Saving inputs..."}</span>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setFormData(initialEmptyData);
                setCurrentStep(1);
                setIsCompleted(false);
              }}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              title="Clear Saved Telemetry"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Tailored Path: {formData.primaryStatus.toUpperCase()}</span>
            <span className="text-sky-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-400 rounded-full"
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: PRIMARY STATUS SELECTION */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-sky-400" />
                    <span>1. Select Your Primary Role Status</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Your choice dynamically customizes all subsequent steps specifically for your role.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "Student",
                    "Working Professional",
                    "Founder / Entrepreneur",
                    "Business Owner",
                    "Freelancer",
                    "Self-Employed",
                    "Government Employee",
                    "Job Seeker",
                    "Intern",
                    "Research Scholar / PhD",
                    "Homemaker",
                    "Retired",
                    "Other",
                  ].map((status) => {
                    const isSelected = formData.primaryStatus === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => updateField("primaryStatus", status as PrimaryStatus)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-sky-950/70 border-2 border-sky-400 text-white shadow-lg shadow-sky-500/10"
                            : "bg-slate-950/80 hover:bg-slate-900 border-slate-800 text-slate-300"
                        }`}
                      >
                        <span>{status}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: TAILORED CORE DETAILS */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-400" />
                    <span>2. Core Details [{formData.primaryStatus}]</span>
                  </h2>
                </div>

                {/* STUDENT BRANCH */}
                {isStudentType && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Student Category</label>
                        <select
                          value={formData.studentRole}
                          onChange={(e) => updateField("studentRole", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                        >
                          <option>School Student</option>
                          <option>Diploma Student</option>
                          <option>Undergraduate Student</option>
                          <option>Postgraduate Student</option>
                          <option>PhD Scholar</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">College / University Name</label>
                        <input
                          type="text"
                          placeholder="e.g. XYZ College / University"
                          value={formData.collegeName}
                          onChange={(e) => updateField("collegeName", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Degree & Major</label>
                        <input
                          type="text"
                          placeholder="e.g. B.Tech Computer Science"
                          value={formData.degree}
                          onChange={(e) => updateField("degree", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Department</label>
                        <input
                          type="text"
                          placeholder="e.g. Computer Science & AI"
                          value={formData.department}
                          onChange={(e) => updateField("department", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Year of Study</label>
                        <select
                          value={formData.yearOfStudy}
                          onChange={(e) => updateField("yearOfStudy", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                        >
                          <option>1st Year</option>
                          <option>2nd Year</option>
                          <option>3rd Year</option>
                          <option>4th Year / Final Year</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* WORKING PROFESSIONAL BRANCH */}
                {isProfessionalType && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Current Role Title</label>
                        <select
                          value={formData.professionalRole}
                          onChange={(e) => updateField("professionalRole", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                        >
                          <option>Associate</option>
                          <option>Analyst</option>
                          <option>Engineer</option>
                          <option>Senior Engineer</option>
                          <option>Consultant</option>
                          <option>Team Lead</option>
                          <option>Manager</option>
                          <option>Senior Manager</option>
                          <option>Director</option>
                          <option>Vice President</option>
                          <option>C-Level Executive</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Company Name</label>
                        <input
                          type="text"
                          placeholder="e.g. ABC Tech Solutions"
                          value={formData.companyName}
                          onChange={(e) => updateField("companyName", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* FOUNDER BRANCH */}
                {isFounderType && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Founder Role</label>
                        <select
                          value={formData.founderRole}
                          onChange={(e) => updateField("founderRole", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                        >
                          <option>Founder / CEO</option>
                          <option>Co-Founder / CTO</option>
                          <option>Managing Director</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Startup Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Apex AI Labs"
                          value={formData.founderCompanyName}
                          onChange={(e) => updateField("founderCompanyName", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* OTHER PERSONA BRANCHES */}
                {!isStudentType && !isProfessionalType && !isFounderType && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-white">Configured Attributes for {formData.primaryStatus}</div>
                    <p className="text-[11px] text-slate-400">Standard domain questions will follow in the next steps.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 3: ROLE-SPECIFIC DEEP TELEMETRY */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" />
                    <span>3. Role-Specific Deep Telemetry [{formData.primaryStatus}]</span>
                  </h2>
                </div>

                {/* STUDENT SPECIFIC: CGPA, GRADUATION, PROJECTS & SKILLS */}
                {isStudentType && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">CGPA / Percentage</label>
                        <input
                          type="text"
                          placeholder="e.g. 8.8 / 10 CGPA"
                          value={formData.cgpaPercentage}
                          onChange={(e) => updateField("cgpaPercentage", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Expected Graduation Date</label>
                        <input
                          type="text"
                          placeholder="e.g. May 2026"
                          value={formData.expectedGraduation}
                          onChange={(e) => updateField("expectedGraduation", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Campus Placement Status</label>
                        <select
                          value={formData.placementStatus}
                          onChange={(e) => updateField("placementStatus", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                        >
                          <option>Campus Placed</option>
                          <option>Actively Preparing / Campus Drives</option>
                          <option>Seeking Off-Campus Jobs</option>
                          <option>Planning Higher Studies</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Technical / Academic Projects Built</label>
                      <input
                        type="text"
                        placeholder="e.g. Full-Stack E-Commerce, Machine Learning Classifier"
                        value={formData.studentProjects}
                        onChange={(e) => updateField("studentProjects", e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>
                )}

                {/* WORKING PROFESSIONAL SPECIFIC: TENURE, EXPERIENCE & TEAM SIZE */}
                {isProfessionalType && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Total Years of Experience</label>
                        <input
                          type="text"
                          placeholder="e.g. 5 Years"
                          value={formData.yearsOfExperience}
                          onChange={(e) => updateField("yearsOfExperience", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Current Company Tenure</label>
                        <input
                          type="text"
                          placeholder="e.g. 2.5 Years"
                          value={formData.currentCompanyTenure}
                          onChange={(e) => updateField("currentCompanyTenure", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Team Size Managed</label>
                        <input
                          type="text"
                          placeholder="e.g. 8 Engineers / Direct Reports"
                          value={formData.teamSizeManaged}
                          onChange={(e) => updateField("teamSizeManaged", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* FOUNDER SPECIFIC: TRACTION, REVENUE & FUNDING */}
                {isFounderType && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Annual Revenue (INR ₹)</label>
                        <input
                          type="text"
                          placeholder="e.g. ₹50 Lakhs ARR"
                          value={formData.annualRevenueRange}
                          onChange={(e) => updateField("annualRevenueRange", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Funding Stage</label>
                        <select
                          value={formData.fundingStage}
                          onChange={(e) => updateField("fundingStage", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
                        >
                          <option>Bootstrapped</option>
                          <option>Angel Raised</option>
                          <option>Seed Stage (₹5 Cr+)</option>
                          <option>Series A+</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Equity Ownership %</label>
                        <input
                          type="text"
                          placeholder="e.g. 75%"
                          value={formData.equityOwnership}
                          onChange={(e) => updateField("equityOwnership", e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 4: ROLE-SPECIFIC TARGET GOALS & OBJECTIVES */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    <span>4. Target Objectives [{formData.primaryStatus}]</span>
                  </h2>
                </div>

                {isStudentType && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Primary Student Goal (12-Month Horizon)</label>
                    <select
                      value={formData.studentGoal}
                      onChange={(e) => updateField("studentGoal", e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option>Get Campus Placement / First Software Role</option>
                      <option>Secure High-Stipend Summer Internship</option>
                      <option>Admit to Tier-1 Masters / PhD Program</option>
                      <option>Launch Campus Startup / Venture</option>
                    </select>
                  </div>
                )}

                {isProfessionalType && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Primary Professional Goal</label>
                    <select
                      value={formData.professionalGoal}
                      onChange={(e) => updateField("professionalGoal", e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                    >
                      <option>Promotion to Tech Lead / Director Tier</option>
                      <option>Achieve 50%+ Compensation Increase</option>
                      <option>Transition to High-Growth Startup</option>
                      <option>Transition to Founder / Independent Advisory</option>
                    </select>
                  </div>
                )}

                {isFounderType && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">12-Month Startup Milestone</label>
                    <input
                      type="text"
                      placeholder="e.g. Reach ₹1 Crore ARR & Expand Product Team"
                      value={formData.founderMilestone}
                      onChange={(e) => updateField("founderMilestone", e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* STEP 5: AI CLASSIFICATION & FINAL SUMMARY */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 text-left"
              >
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sky-400" />
                    <span>5. AI Stage Classification Review</span>
                  </h2>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 uppercase">CLASSIFIED CAREER STAGE</span>
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${aiStage.color}`}>
                      {aiStage.stage}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{aiStage.desc}</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Controls Bar */}
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-800">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                currentStep === 1
                  ? "text-slate-600 cursor-not-allowed"
                  : "text-slate-300 hover:text-white bg-slate-900 border border-slate-800"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-300 hover:from-sky-300 hover:to-emerald-300 transition-all shadow-lg shadow-sky-500/20"
            >
              <span>{currentStep === totalSteps ? "Lock Local Telemetry" : "Next Step"}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      ) : (
        /* SAVED REPORT CARD */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="glass-panel rounded-2xl p-8 border border-slate-800 text-center space-y-6 shadow-2xl"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
              LOCAL TELEMETRY SAVED IN BROWSER
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              AI Stage: <span className="font-mono text-sky-400">{aiStage.stage}</span>
            </h2>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            All tailored attributes for persona <strong className="text-white">{formData.primaryStatus.toUpperCase()}</strong> have been locked locally in browser storage.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setIsCompleted(false);
                setCurrentStep(1);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Edit Persona Telemetry
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
