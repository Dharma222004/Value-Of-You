"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  User, Mail, Save, Loader2, CheckCircle2, AlertCircle,
  Camera, Shield, Globe, Phone, Linkedin, Github,
  Trophy, Activity, Calendar, TrendingUp, Star, Lock,
  ArrowUpRight, Edit3, RefreshCw, Briefcase, FileText, Sparkles,
  Check, ExternalLink, Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useProfile } from "@/hooks/useProfile";
import { useModuleProgress } from "@/hooks/useModuleProgress";
import { loadModuleData, saveModuleData, loadFinancialProfile, loadAiRecommendations } from "@/services/moduleDataService";
import { sanitizePlainText, isSafeHttpUrl } from "@/lib/security";
import { trackEvent } from "@/lib/tracking";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }
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

  // Form State
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [bio, setBio] = useState("");

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
        if (masterData.contactInformation?.phone) setPhone(masterData.contactInformation.phone);
        if (masterData.contactInformation?.linkedInUrl) setLinkedinUrl(masterData.contactInformation.linkedInUrl);
        if (masterData.contactInformation?.gitHubUrl) setGithubUrl(masterData.contactInformation.gitHubUrl);
        if (masterData.contactInformation?.portfolioUrl) setWebsiteUrl(masterData.contactInformation.portfolioUrl);
        if (masterData.employeeData?.designation) setDesignation(masterData.employeeData.designation);
        if (masterData.personalProfile?.bio) setBio(masterData.personalProfile.bio);
      }

      // Load AI recommendations
      const recs = await loadAiRecommendations(uid, 4);
      setRecommendations(recs);
    }

    loadFullProfileData();
  }, [profile]);

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
          personalProfile: {
            ...(existingMaster.personalProfile || {}),
            firstName: fullName.split(" ")[0] || fullName,
            lastName: fullName.split(" ").slice(1).join(" ") || "",
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
          employeeData: {
            ...(existingMaster.employeeData || {}),
            designation: designation.trim(),
          },
        };

        await saveModuleData(uid, "master_profile", updatedMaster);
      }

      setSaveSuccess(true);
      await trackEvent("profile_updated", { fields: ["full_name", "avatar_url", "contact"] });
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
            My Executive Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage your identity, professional contact details & track evaluation progress</p>
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

            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white tracking-tight">{fullName || profile?.full_name || "User Profile"}</h2>
              {designation && <p className="text-xs text-indigo-400 font-mono font-semibold">{designation}</p>}
              <p className="text-xs text-slate-400 truncate max-w-[220px]">{profile?.email}</p>
            </div>

            <div className="pt-2 w-full border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Member Since</span>
              <span className="font-bold text-slate-200">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "July 2026"}
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
            </div>

            {/* Assessment Checklist */}
            <div className="pt-3 border-t border-white/[0.06] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">Module Status</span>
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

        {/* ── Right Column: Edit Forms & Contact Details (8 cols) ── */}
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
                <span className="font-semibold">Profile and contact details saved & synchronized successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSave} className="space-y-6">

            {/* Section 1: Identity & Primary Info */}
            <ProfileSection title="Personal & Professional Identity" subtitle="Update your primary details displayed on your Executive AI Reports" icon={User} delay={2}>
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
                  label="Primary Role / Title" id="profile_designation"
                  value={designation} onChange={setDesignation}
                  placeholder="e.g. Senior Software Engineer / Founder" icon={Briefcase}
                  hint="Displayed on official AI Executive Evaluation Reports."
                />
                <FormField
                  label="Phone Number" id="profile_phone"
                  value={phone} onChange={setPhone}
                  placeholder="+1 (555) 000-0000" icon={Phone}
                />
              </div>

              {/* Bio / Summary */}
              <div className="space-y-1.5 text-left pt-1">
                <label htmlFor="profile_bio" className="text-xs font-bold text-slate-300 uppercase tracking-wider block font-mono">
                  Executive Bio / Summary
                </label>
                <textarea
                  id="profile_bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief summary of your professional background and career goals..."
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 border border-slate-700/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl px-4 py-3 text-xs sm:text-sm font-medium transition-all shadow-inner outline-none resize-none"
                />
              </div>
            </ProfileSection>

            {/* Section 2: Avatar & Online Presence */}
            <ProfileSection title="Avatar & Online Presence" subtitle="Connect your social URLs & digital portfolio" icon={Globe} delay={3}>
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

            {/* Save Changes Action Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Profile Changes</>
                )}
              </button>
            </div>
          </form>

          {/* Section 3: AI Recommendations */}
          {recommendations.length > 0 && (
            <ProfileSection title="AI Executive Recommendations" icon={Sparkles} delay={4}>
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
