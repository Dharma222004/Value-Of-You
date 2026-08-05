"use client";

import React, { useState } from "react";
import { User, Mail, Calendar, Clock, Lock, UserCheck, Phone, Globe, Moon, Edit3, Save } from "lucide-react";
import { Profile } from "@/types/database";
import { Toast } from "@/components/ui/Toast";

interface UserProfileCardProps {
  profile: Profile;
  onUpdate: (payload: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const [formData, setFormData] = useState({
    full_name: profile.full_name || "",
    phone: (profile as any).phone || "",
    language: (profile as any).language || "English",
    theme: profile.theme || "system",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await onUpdate(formData);
    setSaving(false);

    if (result.success) {
      setIsEditing(false);
      setToast({ show: true, message: "Profile updated successfully!", type: "success" });
    } else {
      setToast({ show: true, message: result.error || "Failed to update profile", type: "error" });
    }
  };

  const displayName = profile.full_name || profile.email.split("@")[0];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Main Glassmorphic Profile Header Card */}
      <div className="relative rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-indigo-950/40 backdrop-blur-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Picture */}
          <div className="relative group">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500/30 shadow-xl group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-indigo-500/30">
                {displayName ? displayName.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <div className="absolute bottom-1 right-1 bg-emerald-500 border-2 border-slate-900 w-5 h-5 rounded-full" title="Active Account" />
          </div>

          {/* Core Info Summary */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                  {displayName}
                  <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-medium">
                    {profile.provider ? profile.provider.toUpperCase() : "AUTHENTICATED"}
                  </span>
                </h1>
                <p className="text-sm text-slate-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail className="w-4 h-4 text-indigo-400" /> {profile.email}
                </p>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg ${
                  isEditing
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-white/10"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25"
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>

            {/* Read-Only Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 mt-4 border-t border-white/10">
              <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-white/5">
                <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-medium">Created At</div>
                  <div className="text-xs font-semibold text-slate-200">
                    {new Date(profile.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-white/5">
                <Clock className="w-5 h-5 text-purple-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-medium">Human Value Score</div>
                  <div className="text-xs font-bold text-emerald-400">
                    {profile.human_value_score > 0 ? `${profile.human_value_score} pts` : "N/A"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-white/5">
                <Lock className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-medium">Supabase User ID</div>
                  <div className="text-xs font-mono font-semibold text-slate-300 truncate max-w-[120px]">
                    {profile.id}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Fields Form */}
      <div className="rounded-3xl p-8 border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-400" /> Personal Details & Preferences
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                  required
                />
              </div>
            </div>

            {/* Read-Only Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Email Address</span>
                <span className="text-[10px] text-amber-400 font-normal flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Cannot be edited
                </span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 font-mono text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  disabled={!isEditing}
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                />
              </div>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Preferred Language
              </label>
              <div className="relative">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  disabled={!isEditing}
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                </select>
              </div>
            </div>

            {/* Theme Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Theme Preference
              </label>
              <div className="relative">
                <Moon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  disabled={!isEditing}
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700/60 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  <option value="dark">Dark Mode (Glassmorphism)</option>
                  <option value="light">Light Mode</option>
                  <option value="system">System Default</option>
                </select>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
