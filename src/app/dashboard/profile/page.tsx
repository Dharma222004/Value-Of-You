"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  User, Mail, Save, Loader2, CheckCircle2, AlertCircle,
  Globe, Phone, Linkedin, Github, Star,
  Briefcase, Sparkles, Check, Image as ImageIcon,
  GraduationCap, Building2, Rocket, Laptop, Target, School,
  Award, BookOpen, Layers, Calendar, MapPin
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { loadModuleData, saveModuleData, loadAiRecommendations } from "@/services/moduleDataService";
import { evaluateMasterProfileCompleteness, calculateAgeFromDOB } from "@/lib/masterProfileEngine";
import { PrimaryRoleOption } from "@/types/masterProfile";
import { sanitizePlainText, isSafeHttpUrl } from "@/lib/security";
import { trackEvent } from "@/lib/tracking";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }
  }),
};

function getScoreTier(score: number) {
  if (score >= 88) return { label: "Elite Tier", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)" };
  if (score >= 75) return { label: "Advanced Tier", color: "#10b981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)" };
  if (score >= 60) return { label: "Developing Tier", color: "#6366f1", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.3)" };
  if (score >= 45) return { label: "Emerging Tier", color: "#f97316", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)" };
  return { label: "Foundation Tier", color: "#64748b", bg: "rgba(100,116,139,0.15)", border: "rgba(100,116,139,0.3)" };
}

// ──────────────────────────────────────────────────────────
// Section Wrapper Component
// ──────────────────────────────────────────────────────────
function ProfileSection({
  title, subtitle, icon: Icon, children, delay = 0
}: {
  title: string; subtitle?: string; icon: React.ElementType; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div custom={delay} initial="hidden" animate="visible" variants={fadeUp}
      className="glass-card p-6 sm:p-7 rounded-3xl border border-white/[0.08] space-y-5 bg-slate-900/60 shadow-xl">
      <div className="flex items-center gap-3 pb-4 border-b border-white/[0.06]">
        <div className="p-2.5 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────
// Reusable Dark Form Field Component
// ──────────────────────────────────────────────────────────
function FormField({
  label, id, type = "text", value, onChange, placeholder, icon: Icon, disabled, hint
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
  icon?: React.ElementType; disabled?: boolean; hint?: string;
}) {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-slate-950/80 text-white placeholder-slate-500 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-all shadow-inner outline-none ${
            Icon ? "pl-10" : ""
          } ${disabled ? "opacity-60 cursor-not-allowed bg-slate-900/40" : ""}`}
        />
      </div>
      {hint && <p className="text-[11px] text-slate-500 font-medium">{hint}</p>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Reusable Select Field Component
// ──────────────────────────────────────────────────────────
function SelectField({
  label, id, value, onChange, options, icon: Icon, hint
}: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[]; icon?: React.ElementType; hint?: string;
}) {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        )}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-slate-950/80 text-white border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium transition-all shadow-inner outline-none appearance-none cursor-pointer ${
            Icon ? "pl-10" : ""
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {hint && <p className="text-[11px] text-slate-500 font-medium">{hint}</p>}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Stat Pill Component
// ──────────────────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color = "text-indigo-400" }: {
  icon: React.ElementType; label: string; value: string | number; color?: string;
}) {
  return (
    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
      <div className={`p-2.5 rounded-xl bg-white/[0.04] ${color} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">{label}</p>
        <p className="text-sm font-black text-white truncate font-mono mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Main My Profile Page
// ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { progress } = useModuleProgress();

  // Primary Role & Category
  const [primaryRole, setPrimaryRole] = useState<PrimaryRoleOption>("Employee");

  // Core Identity State
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  // Social & Digital Presence State
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // ── Student Role Specific State ──
  const [studentCategory, setStudentCategory] = useState("Undergraduate"); // School Student, Undergraduate, Postgraduate, Doctorate
  const [schoolOrUniversity, setSchoolOrUniversity] = useState("");
  const [degreeOrClass, setDegreeOrClass] = useState("");
  const [specializationOrStream, setSpecializationOrStream] = useState("");
  const [currentGradeOrYear, setCurrentGradeOrYear] = useState("");
  const [expectedGraduationYear, setExpectedGraduationYear] = useState("");
  const [cgpaOrPercentage, setCgpaOrPercentage] = useState("");
  const [studentGoal, setStudentGoal] = useState("Campus Placement");

  // ── Employee Role Specific State ──
  const [designation, setDesignation] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(3);
  const [employmentType, setEmploymentType] = useState("Full Time");

  // ── Founder Role Specific State ──
  const [startupName, setStartupName] = useState("");
  const [startupIndustry, setStartupIndustry] = useState("");
  const [startupStage, setStartupStage] = useState("MVP");
  const [fundingStage, setFundingStage] = useState("Bootstrapped");
  const [teamSize, setTeamSize] = useState("1-10");

  // ── Freelancer Role Specific State ──
  const [freelanceService, setFreelanceService] = useState("");
  const [freelanceYears, setFreelanceYears] = useState<number>(2);
  const [freelancePlatforms, setFreelancePlatforms] = useState("");

  // ── Business Owner Role Specific State ──
  const [businessName, setBusinessName] = useState("");
  const [businessIndustry, setBusinessIndustry] = useState("");
  const [businessModel, setBusinessModel] = useState("B2B");

  // ── Job Seeker Role Specific State ──
  const [targetRole, setTargetRole] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("");

  // ── Horizon Goals ──
  const [shortTermGoal1Yr, setShortTermGoal1Yr] = useState("");
  const [mediumTermGoal3Yr, setMediumTermGoal3Yr] = useState("");
  const [longTermGoal5To10Yr, setLongTermGoal5To10Yr] = useState("");

  // UI States
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [imgError, setImgError] = useState(false);

  // Populate form when profile & master_profile load
  useEffect(() => {
    async function loadFullProfileData() {
      if (!profile) return;
      setFullName(profile.full_name || "");
      setAvatarUrl(profile.avatar_url || "");

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) return;
      const uid = sessionData.session.user.id;

      // Load extended profile telemetry from master_profile module
      const masterData = await loadModuleData(uid, "master_profile");
      if (masterData) {
        if (masterData.primaryRole) setPrimaryRole(masterData.primaryRole);

        // Personal profile
        if (masterData.personalProfile) {
          if (masterData.personalProfile.dateOfBirth) setDateOfBirth(masterData.personalProfile.dateOfBirth);
          if (masterData.personalProfile.country) setCountry(masterData.personalProfile.country);
          if (masterData.personalProfile.city) setCity(masterData.personalProfile.city);
          if (masterData.personalProfile.bio) setBio(masterData.personalProfile.bio);
        }

        // Contact info
        if (masterData.contactInformation) {
          if (masterData.contactInformation.phone) setPhone(masterData.contactInformation.phone);
          if (masterData.contactInformation.linkedInUrl) setLinkedinUrl(masterData.contactInformation.linkedInUrl);
          if (masterData.contactInformation.gitHubUrl) setGithubUrl(masterData.contactInformation.gitHubUrl);
          if (masterData.contactInformation.portfolioUrl) setWebsiteUrl(masterData.contactInformation.portfolioUrl);
        }

        // Student Data
        if (masterData.studentData) {
          if (masterData.studentData.studentCategory) setStudentCategory(masterData.studentData.studentCategory);
          if (masterData.studentData.university || masterData.studentData.college)
            setSchoolOrUniversity(masterData.studentData.university || masterData.studentData.college || "");
          if (masterData.studentData.degree) setDegreeOrClass(masterData.studentData.degree);
          if (masterData.studentData.specialization) setSpecializationOrStream(masterData.studentData.specialization);
          if (masterData.studentData.currentYear) setCurrentGradeOrYear(masterData.studentData.currentYear);
          if (masterData.studentData.expectedGraduationYear) setExpectedGraduationYear(masterData.studentData.expectedGraduationYear);
          if (masterData.studentData.cgpaOrPercentage) setCgpaOrPercentage(masterData.studentData.cgpaOrPercentage);
          if (masterData.studentData.currentPlacementStatus) setStudentGoal(masterData.studentData.currentPlacementStatus);
        }

        // Employee Data
        if (masterData.employeeData) {
          if (masterData.employeeData.designation) setDesignation(masterData.employeeData.designation);
          if (masterData.employeeData.company) setCompany(masterData.employeeData.company);
          if (masterData.employeeData.industry) setIndustry(masterData.employeeData.industry);
          if (masterData.employeeData.yearsOfExperience !== undefined) setYearsOfExperience(masterData.employeeData.yearsOfExperience);
          if (masterData.employeeData.employmentType) setEmploymentType(masterData.employeeData.employmentType);
        }

        // Founder Data
        if (masterData.founderData) {
          if (masterData.founderData.startupName) setStartupName(masterData.founderData.startupName);
          if (masterData.founderData.industry) setStartupIndustry(masterData.founderData.industry);
          if (masterData.founderData.startupStage) setStartupStage(masterData.founderData.startupStage);
          if (masterData.founderData.fundingStage) setFundingStage(masterData.founderData.fundingStage);
          if (masterData.founderData.employeeCount) setTeamSize(masterData.founderData.employeeCount);
        }

        // Freelancer Data
        if (masterData.freelancerData) {
          if (masterData.freelancerData.primaryService) setFreelanceService(masterData.freelancerData.primaryService);
          if (masterData.freelancerData.yearsExperience !== undefined) setFreelanceYears(masterData.freelancerData.yearsExperience);
          if (Array.isArray(masterData.freelancerData.platformsUsed)) setFreelancePlatforms(masterData.freelancerData.platformsUsed.join(", "));
        }

        // Goals
        if (masterData.goals) {
          if (masterData.goals.shortTermGoal1Yr) setShortTermGoal1Yr(masterData.goals.shortTermGoal1Yr);
          if (masterData.goals.mediumTermGoal3Yr) setMediumTermGoal3Yr(masterData.goals.mediumTermGoal3Yr);
          if (masterData.goals.longTermGoal5To10Yr) setLongTermGoal5To10Yr(masterData.goals.longTermGoal5To10Yr);
        }
      }

      // Load AI recommendations
      const recs = await loadAiRecommendations(uid, 4);
      setRecommendations(recs);
    }

    loadFullProfileData();
  }, [profile]);

  // Derived Title / Stage Badge
  const stageBadge = useMemo(() => {
    if (primaryRole === "Student") {
      if (studentCategory === "School Student") {
        return `School Student ${degreeOrClass ? `(${degreeOrClass})` : ""}`;
      }
      return `${currentGradeOrYear || "College"} Student ${degreeOrClass ? `(${degreeOrClass})` : ""}`;
    }
    if (primaryRole === "Employee") {
      return designation ? `${designation} ${company ? `@ ${company}` : ""}` : "Corporate Professional";
    }
    if (primaryRole === "Founder") {
      return startupName ? `Founder @ ${startupName}` : "Startup Founder";
    }
    if (primaryRole === "Freelancer") {
      return freelanceService ? `Freelancer (${freelanceService})` : "Independent Consultant";
    }
    if (primaryRole === "Business Owner") {
      return businessName ? `Owner @ ${businessName}` : "Business Enterprise Owner";
    }
    return "Career Explorer";
  }, [primaryRole, studentCategory, degreeOrClass, currentGradeOrYear, designation, company, startupName, freelanceService, businessName]);

  // Calculate age from Date of Birth
  const calculatedAge = useMemo(() => calculateAgeFromDOB(dateOfBirth), [dateOfBirth]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    if (!fullName.trim()) {
      setSaveError("Full Name is required.");
      return;
    }

    setSaving(true);
    try {
      // 1. Update Core Profile table
      const cleanAvatar = avatarUrl.trim() ? isSafeHttpUrl(avatarUrl.trim()) : null;
      if (avatarUrl.trim() && !cleanAvatar) {
        setSaveError("Avatar URL must be a valid http(s) link.");
        setSaving(false);
        return;
      }

      const result = await updateProfile({
        full_name: sanitizePlainText(fullName.trim(), 120),
        avatar_url: cleanAvatar,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Failed to update profile record");
      }

      // 2. Update extended telemetry in master_profile module
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user) {
        const uid = sessionData.session.user.id;
        const existingMaster = (await loadModuleData(uid, "master_profile")) || {};

        const updatedMaster = {
          ...existingMaster,
          primaryRole,
          personalProfile: {
            ...(existingMaster.personalProfile || {}),
            firstName: fullName.split(" ")[0] || fullName,
            lastName: fullName.split(" ").slice(1).join(" ") || "",
            dateOfBirth,
            calculatedAge,
            country,
            city,
            bio: bio.trim(),
          },
          contactInformation: {
            ...(existingMaster.contactInformation || {}),
            email: profile?.email || "",
            phone: phone.trim(),
            linkedInUrl: linkedinUrl.trim(),
            gitHubUrl: githubUrl.trim(),
            portfolioUrl: websiteUrl.trim(),
          },
          studentData: {
            ...(existingMaster.studentData || {}),
            studentCategory,
            university: schoolOrUniversity.trim(),
            degree: degreeOrClass.trim(),
            specialization: specializationOrStream.trim(),
            currentYear: currentGradeOrYear.trim(),
            expectedGraduationYear: expectedGraduationYear.trim(),
            cgpaOrPercentage: cgpaOrPercentage.trim(),
            currentPlacementStatus: studentGoal,
          },
          employeeData: {
            ...(existingMaster.employeeData || {}),
            designation: designation.trim(),
            company: company.trim(),
            industry: industry.trim(),
            yearsOfExperience: Number(yearsOfExperience) || 0,
            employmentType,
          },
          founderData: {
            ...(existingMaster.founderData || {}),
            startupName: startupName.trim(),
            industry: startupIndustry.trim(),
            startupStage,
            fundingStage,
            employeeCount: teamSize,
          },
          freelancerData: {
            ...(existingMaster.freelancerData || {}),
            primaryService: freelanceService.trim(),
            yearsExperience: Number(freelanceYears) || 0,
            platformsUsed: freelancePlatforms.split(",").map((s) => s.trim()).filter(Boolean),
          },
          goals: {
            shortTermGoal1Yr: shortTermGoal1Yr.trim(),
            mediumTermGoal3Yr: mediumTermGoal3Yr.trim(),
            longTermGoal5To10Yr: longTermGoal5To10Yr.trim(),
          },
        };

        await saveModuleData(uid, "master_profile", updatedMaster);
      }

      setSaveSuccess(true);
      await trackEvent("profile_updated", { role: primaryRole, fields: ["full_name", "avatar_url", "role_data"] });
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const completedModules = Math.min(5, Math.max(0, progress.completedCount));
  const overallScore = Math.min(100, Math.max(0, Math.round(progress.overallScore)));
  const scoreTier = getScoreTier(overallScore);

  if (profileLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="skeleton h-24 rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="skeleton h-96 rounded-3xl" />
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-64 rounded-3xl" />
            <div className="skeleton h-64 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-slate-100">

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            My Adaptive Career Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage your status, academic & professional milestones, and executive telemetry</p>
        </div>
        <Link href="/dashboard" className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold border border-white/[0.08] transition-all">
          ← Back to Dashboard
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left Column: Avatar & Overview (4 cols) ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Avatar & User Info Card */}
          <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="glass-card p-6 rounded-3xl border border-white/[0.08] flex flex-col items-center gap-4 text-center bg-slate-900/80 shadow-xl relative overflow-hidden">
            
            <div className="relative group">
              {avatarUrl && (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://") || avatarUrl.startsWith("/")) && !imgError ? (
                <img
                  src={avatarUrl ?? undefined}
                  alt={fullName || "User Avatar"}
                  onError={() => setImgError(true)}
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-2xl transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-4xl font-black text-white border-2 border-indigo-500/40 shadow-2xl select-none"
                  style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}>
                  {(fullName || profile?.email || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold" title="Active Account">
                ✓
              </span>
            </div>

            <div className="space-y-1 w-full">
              <h2 className="text-xl font-extrabold text-white tracking-tight">{fullName || profile?.full_name || "User Profile"}</h2>
              
              {/* Dynamic Stage Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold max-w-full truncate">
                {primaryRole === "Student" && <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                {primaryRole === "Employee" && <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                {primaryRole === "Founder" && <Rocket className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                {primaryRole === "Freelancer" && <Laptop className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                <span className="truncate">{stageBadge}</span>
              </div>

              <p className="text-xs text-slate-400 truncate max-w-[240px] mx-auto pt-1">{profile?.email}</p>
            </div>

            <div className="pt-2 w-full border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Member Since</span>
              <span className="font-bold text-slate-200">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "August 2026"}
              </span>
            </div>
          </motion.div>

          {/* Performance Overview Card */}
          <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="glass-card p-6 rounded-3xl border border-white/[0.08] space-y-4 bg-slate-900/60 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Performance Overview</span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border" style={{ background: scoreTier.bg, color: scoreTier.color, borderColor: scoreTier.border }}>
                {scoreTier.label}
              </span>
            </div>

            <div className="space-y-3">
              <StatPill icon={Star} label="Human Value Score"
                value={overallScore > 0 ? `${overallScore}/100` : "Pending"} color="text-amber-400" />
              
              <StatPill icon={CheckCircle2} label="Modules Completed"
                value={`${completedModules}/5`} color="text-emerald-400" />

              {calculatedAge > 0 && (
                <StatPill icon={Calendar} label="Calculated Age"
                  value={`${calculatedAge} Years`} color="text-cyan-400" />
              )}
            </div>

            {/* Assessment Checklist */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">Evaluation Telemetry</span>
              {[
                { label: "Personal Profile", route: "/dashboard/career", done: progress.modules.master_profile?.completed },
                { label: "Financial Health", route: "/dashboard/financial", done: progress.modules.financial?.completed },
                { label: "Professional Skills", route: "/dashboard/skills", done: progress.modules.skills?.completed },
                { label: "Health & Lifestyle", route: "/dashboard/health", done: progress.modules.health?.completed },
                { label: "Human Assessments", route: "/dashboard/assessments", done: progress.modules.assessments?.completed },
              ].map((m, i) => (
                <Link key={i} href={m.route} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all text-xs group">
                  <span className="text-slate-300 group-hover:text-white font-medium">{m.label}</span>
                  {m.done ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 flex items-center gap-1">
                      In Progress →
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right Column: Edit Forms & Dynamic Role Sections (8 cols) ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Form Banner Feedback Messages */}
          <AnimatePresence>
            {saveError && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span className="font-semibold">{saveError}</span>
              </motion.div>
            )}
            {saveSuccess && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold">Profile and adaptive career details synchronized successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSave} className="space-y-6">

            {/* Section 1: Primary Career Path & Status Switcher */}
            <ProfileSection
              title="Primary Career Path & Status"
              subtitle="Tailors your evaluation parameters based on whether you are a School/College Student, Corporate Professional, or Founder"
              icon={Target}
              delay={2}
            >
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Select Primary Status / Pathway *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "Student", label: "Student", icon: GraduationCap, desc: "School or College" },
                    { id: "Employee", label: "Employee", icon: Briefcase, desc: "Corporate / Org" },
                    { id: "Founder", label: "Founder", icon: Rocket, desc: "Startup / Venture" },
                    { id: "Freelancer", label: "Freelancer", icon: Laptop, desc: "Independent Contractor" },
                    { id: "Business Owner", label: "Business Owner", icon: Building2, desc: "Enterprise Owner" },
                    { id: "Job Seeker", label: "Job Seeker", icon: SearchIcon, desc: "Career Switcher" },
                  ].map((roleOpt) => {
                    const isSelected = primaryRole === roleOpt.id;
                    const IconComp = roleOpt.icon;
                    return (
                      <button
                        key={roleOpt.id}
                        type="button"
                        onClick={() => setPrimaryRole(roleOpt.id as PrimaryRoleOption)}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <IconComp className={`w-4 h-4 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 font-bold" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{roleOpt.label}</p>
                          <p className="text-[10px] text-slate-500 font-normal">{roleOpt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Dynamic Form Fields Based on Selected Primary Role ── */}
              <div className="pt-4 border-t border-white/[0.06] space-y-4">
                
                {/* 🎓 STUDENT TAILORED FORM FIELDS */}
                {primaryRole === "Student" && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2 font-mono">
                      <GraduationCap className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span>Student Academic Profile — Customized for K-12 School & University Students</span>
                    </div>

                    <SelectField
                      label="Student Level / Category *"
                      id="student_category"
                      value={studentCategory}
                      onChange={setStudentCategory}
                      icon={School}
                      options={[
                        { label: "School Student (High School / Secondary / K-12)", value: "School Student" },
                        { label: "Undergraduate (College / University Student)", value: "Undergraduate" },
                        { label: "Postgraduate / Master's Candidate", value: "Postgraduate" },
                        { label: "Doctorate / PhD / Research Scholar", value: "Doctorate" },
                      ]}
                      hint="Determines whether school subjects or degree metrics are evaluated."
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label={studentCategory === "School Student" ? "School Name *" : "College / University Name *"}
                        id="student_institution"
                        value={schoolOrUniversity}
                        onChange={setSchoolOrUniversity}
                        placeholder={studentCategory === "School Student" ? "e.g. St. Jude High School / Delhi Public School" : "e.g. Stanford University / IIT Delhi"}
                        icon={Building2}
                      />

                      <FormField
                        label={studentCategory === "School Student" ? "Class / Grade *" : "Degree Program *"}
                        id="student_degree_or_class"
                        value={degreeOrClass}
                        onChange={setDegreeOrClass}
                        placeholder={studentCategory === "School Student" ? "e.g. Grade 10 / 12th Standard" : "e.g. B.Tech / B.Sc / BBA / MBA"}
                        icon={BookOpen}
                      />

                      <FormField
                        label={studentCategory === "School Student" ? "Stream / Major Subject" : "Specialization / Major"}
                        id="student_stream"
                        value={specializationOrStream}
                        onChange={setSpecializationOrStream}
                        placeholder={studentCategory === "School Student" ? "e.g. Science (PCM) / Commerce / Arts" : "e.g. Computer Science & AI / Finance"}
                        icon={Layers}
                      />

                      <FormField
                        label={studentCategory === "School Student" ? "Current Academic Year" : "Current Year / Semester"}
                        id="student_year"
                        value={currentGradeOrYear}
                        onChange={setCurrentGradeOrYear}
                        placeholder={studentCategory === "School Student" ? "e.g. 2025-2026 Academic Session" : "e.g. 3rd Year / 6th Semester"}
                        icon={Calendar}
                      />

                      <FormField
                        label="Expected Completion / Passing Year"
                        id="student_grad_year"
                        value={expectedGraduationYear}
                        onChange={setExpectedGraduationYear}
                        placeholder="e.g. 2027"
                        icon={Calendar}
                      />

                      <FormField
                        label={studentCategory === "School Student" ? "Performance / Marks / Percentage" : "CGPA or Percentage"}
                        id="student_performance"
                        value={cgpaOrPercentage}
                        onChange={setCgpaOrPercentage}
                        placeholder={studentCategory === "School Student" ? "e.g. 94% / Grade A+" : "e.g. 3.9 / 4.0 or 88%"}
                        icon={Award}
                      />
                    </div>

                    <SelectField
                      label="Primary Near-Term Goal"
                      id="student_goal"
                      value={studentGoal}
                      onChange={setStudentGoal}
                      icon={Target}
                      options={[
                        { label: "Board Exams & College Entrance", value: "Board Exams & College Entrance" },
                        { label: "Campus Placements & Job Offers", value: "Campus Placement" },
                        { label: "Higher Studies / Master's / PhD", value: "Higher Studies" },
                        { label: "Summer Internships", value: "Summer Internships" },
                        { label: "Entrepreneurship & Projects", value: "Entrepreneurship" },
                      ]}
                    />
                  </motion.div>
                )}

                {/* 💼 EMPLOYEE TAILORED FORM FIELDS */}
                {primaryRole === "Employee" && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2 font-mono">
                      <Briefcase className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span>Professional Employee Profile — Customized for Corporate & Organizational Growth</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="Primary Role / Job Title *"
                        id="employee_designation"
                        value={designation}
                        onChange={setDesignation}
                        placeholder="e.g. Senior Software Engineer / Product Manager"
                        icon={Briefcase}
                      />

                      <FormField
                        label="Current Company / Organization *"
                        id="employee_company"
                        value={company}
                        onChange={setCompany}
                        placeholder="e.g. Google / Microsoft / Acme Corp"
                        icon={Building2}
                      />

                      <FormField
                        label="Industry / Domain"
                        id="employee_industry"
                        value={industry}
                        onChange={setIndustry}
                        placeholder="e.g. Information Technology / Fintech"
                        icon={Layers}
                      />

                      <FormField
                        label="Years of Professional Experience"
                        id="employee_exp"
                        type="number"
                        value={yearsOfExperience.toString()}
                        onChange={(v) => setYearsOfExperience(Number(v) || 0)}
                        placeholder="e.g. 5"
                        icon={Award}
                      />
                    </div>

                    <SelectField
                      label="Employment Mode"
                      id="employee_type"
                      value={employmentType}
                      onChange={setEmploymentType}
                      icon={Laptop}
                      options={[
                        { label: "Full Time", value: "Full Time" },
                        { label: "Part Time", value: "Part Time" },
                        { label: "Contract", value: "Contract" },
                        { label: "Remote", value: "Remote" },
                        { label: "Hybrid", value: "Hybrid" },
                        { label: "On Site", value: "On Site" },
                      ]}
                    />
                  </motion.div>
                )}

                {/* 🚀 FOUNDER TAILORED FORM FIELDS */}
                {primaryRole === "Founder" && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2 font-mono">
                      <Rocket className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span>Entrepreneur & Founder Profile — Venture Stage & Capital Growth Parameters</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="Startup / Venture Name *"
                        id="founder_startup_name"
                        value={startupName}
                        onChange={setStartupName}
                        placeholder="e.g. NeuroTech AI"
                        icon={Rocket}
                      />

                      <FormField
                        label="Industry / Sector"
                        id="founder_industry"
                        value={startupIndustry}
                        onChange={setStartupIndustry}
                        placeholder="e.g. Artificial Intelligence / SaaS"
                        icon={Layers}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <SelectField
                        label="Venture Stage"
                        id="founder_stage"
                        value={startupStage}
                        onChange={setStartupStage}
                        options={[
                          { label: "Ideation", value: "Ideation" },
                          { label: "MVP / Prototype", value: "MVP" },
                          { label: "Early Revenue", value: "Early Revenue" },
                          { label: "Scaling", value: "Scaling" },
                          { label: "Established", value: "Established" },
                        ]}
                      />

                      <SelectField
                        label="Funding Status"
                        id="founder_funding"
                        value={fundingStage}
                        onChange={setFundingStage}
                        options={[
                          { label: "Bootstrapped", value: "Bootstrapped" },
                          { label: "Pre-Seed", value: "Pre-Seed" },
                          { label: "Seed", value: "Seed" },
                          { label: "Series A+", value: "Series A+" },
                          { label: "Profitable", value: "Profitable" },
                        ]}
                      />

                      <FormField
                        label="Team Size"
                        id="founder_team"
                        value={teamSize}
                        onChange={setTeamSize}
                        placeholder="e.g. 1-10 employees"
                        icon={Building2}
                      />
                    </div>
                  </motion.div>
                )}

                {/* 💻 FREELANCER TAILORED FORM FIELDS */}
                {primaryRole === "Freelancer" && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2 font-mono">
                      <Laptop className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span>Freelance & Independent Contractor Profile — Portfolio & Service Capacity</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="Primary Service / Domain *"
                        id="freelance_service"
                        value={freelanceService}
                        onChange={setFreelanceService}
                        placeholder="e.g. UI/UX Design & Frontend Engineering"
                        icon={Laptop}
                      />

                      <FormField
                        label="Years of Freelancing Experience"
                        id="freelance_years"
                        type="number"
                        value={freelanceYears.toString()}
                        onChange={(v) => setFreelanceYears(Number(v) || 0)}
                        placeholder="e.g. 3"
                        icon={Award}
                      />
                    </div>

                    <FormField
                      label="Key Client Platforms & Marketplaces"
                      id="freelance_platforms"
                      value={freelancePlatforms}
                      onChange={setFreelancePlatforms}
                      placeholder="e.g. Upwork, Direct B2B Contracts, Substack"
                      icon={Globe}
                      hint="Separate multiple platforms with commas."
                    />
                  </motion.div>
                )}

                {/* 🏢 BUSINESS OWNER TAILORED FORM FIELDS */}
                {primaryRole === "Business Owner" && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2 font-mono">
                      <Building2 className="w-4 h-4 shrink-0 text-indigo-400" />
                      <span>Business Enterprise Owner Profile</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="Business Enterprise Name *"
                        id="business_name"
                        value={businessName}
                        onChange={setBusinessName}
                        placeholder="e.g. Apex Trading & Logistics"
                        icon={Building2}
                      />

                      <FormField
                        label="Industry / Sector"
                        id="business_industry"
                        value={businessIndustry}
                        onChange={setBusinessIndustry}
                        placeholder="e.g. Retail & Supply Chain"
                        icon={Layers}
                      />
                    </div>
                  </motion.div>
                )}

              </div>
            </ProfileSection>

            {/* Section 2: Personal Identity & Contact */}
            <ProfileSection title="Personal Identity & Contact Information" subtitle="Basic identity and verification details" icon={User} delay={3}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Full Name *" id="profile_full_name"
                  value={fullName} onChange={setFullName}
                  placeholder="Enter your full name" icon={User}
                />

                <FormField
                  label="Email Address (Locked)" id="profile_email"
                  type="email" value={profile?.email || ""} onChange={() => {}}
                  placeholder="your@email.com" icon={Mail} disabled
                  hint="Email is tied to your login authentication account."
                />

                <FormField
                  label="Date of Birth" id="profile_dob" type="date"
                  value={dateOfBirth} onChange={setDateOfBirth}
                  icon={Calendar}
                  hint={calculatedAge > 0 ? `Calculated Age: ${calculatedAge} Years Old` : "Used for lifetime trajectory forecasting."}
                />

                <FormField
                  label="Phone Number" id="profile_phone"
                  value={phone} onChange={setPhone}
                  placeholder="+1 (555) 000-0000" icon={Phone}
                />

                <FormField
                  label="Country of Residence" id="profile_country"
                  value={country} onChange={setCountry}
                  placeholder="e.g. United States / India" icon={Globe}
                />

                <FormField
                  label="City / Region" id="profile_city"
                  value={city} onChange={setCity}
                  placeholder="e.g. San Francisco / Bengaluru" icon={MapPin}
                />
              </div>

              {/* Bio / Summary */}
              <div className="space-y-1.5 text-left pt-1">
                <label htmlFor="profile_bio" className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Personal & Professional Summary / Bio
                </label>
                <textarea
                  id="profile_bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief summary of your academic or professional background, interests, and career trajectory..."
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium transition-all shadow-inner outline-none resize-none"
                />
              </div>
            </ProfileSection>

            {/* Section 3: Avatar & Digital Presence */}
            <ProfileSection title="Avatar & Online Presence" subtitle="Connect your social URLs & digital portfolio" icon={Globe} delay={4}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Avatar Image URL" id="profile_avatar_url"
                  value={avatarUrl} onChange={setAvatarUrl}
                  placeholder="https://example.com/avatar.jpg" icon={ImageIcon}
                  hint="Paste a direct image link to customize your profile picture."
                />
                <FormField
                  label="LinkedIn Profile URL" id="profile_linkedin"
                  value={linkedinUrl} onChange={setLinkedinUrl}
                  placeholder="https://linkedin.com/in/username" icon={Linkedin}
                />
                <FormField
                  label="GitHub Profile URL" id="profile_github"
                  value={githubUrl} onChange={setGithubUrl}
                  placeholder="https://github.com/username" icon={Github}
                />
                <FormField
                  label="Portfolio / Personal Website" id="profile_website"
                  value={websiteUrl} onChange={setWebsiteUrl}
                  placeholder="https://yourwebsite.com" icon={Globe}
                />
              </div>
            </ProfileSection>

            {/* Section 4: Strategic Career Horizons & Goals */}
            <ProfileSection title="Strategic Career Horizons & Goals" subtitle="Define your 1-Year, 3-Year, and 5-10 Year trajectory milestones" icon={Target} delay={5}>
              <div className="space-y-4">
                <FormField
                  label="Short-Term Horizon (1-Year Goal)"
                  id="goal_1yr"
                  value={shortTermGoal1Yr}
                  onChange={setShortTermGoal1Yr}
                  placeholder={primaryRole === "Student" ? "e.g. Achieve 90%+ in Board Exams / Secure Tech Internship" : "e.g. Master AI Engineering & Lead System Migration"}
                  icon={Target}
                />

                <FormField
                  label="Medium-Term Horizon (3-Year Goal)"
                  id="goal_3yr"
                  value={mediumTermGoal3Yr}
                  onChange={setMediumTermGoal3Yr}
                  placeholder={primaryRole === "Student" ? "e.g. Graduate with Honors & Transition to Senior AI Engineer Role" : "e.g. Scale Startup to Seed Round / Transition to Lead Architect"}
                  icon={Target}
                />

                <FormField
                  label="Long-Term Horizon (5-10 Year Goal)"
                  id="goal_5yr"
                  value={longTermGoal5To10Yr}
                  onChange={setLongTermGoal5To10Yr}
                  placeholder="e.g. Build an Independent Tech Enterprise & Achieve Complete Capital Freedom"
                  icon={Target}
                />
              </div>
            </ProfileSection>

            {/* Save Changes Action Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Synchronizing Profile...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Profile & Telemetry</>
                )}
              </button>
            </div>
          </form>

          {/* Section 5: AI Executive Recommendations */}
          {recommendations.length > 0 && (
            <ProfileSection title="AI Adaptive Recommendations" icon={Sparkles} delay={6}>
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div key={rec.id || i}
                    className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 flex gap-3.5 items-start">
                    <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 shrink-0 mt-0.5">
                      <Star className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">{rec.recommendation}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1.5">
                        Generated: {new Date(rec.generated_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

        </div>
      </div>
    </div>
  );
}

// Icon helper
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}
