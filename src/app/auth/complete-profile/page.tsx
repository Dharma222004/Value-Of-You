"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { useAuth } from "@/context/AuthContext";
import { UserStatus } from "@/types/auth";
import { User, Briefcase, Globe, Clock, Loader2, CheckCircle2 } from "lucide-react";

const STATUS_OPTIONS: UserStatus[] = [
  "Student",
  "Employee",
  "Founder",
  "Freelancer",
  "Business Owner",
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "India",
  "Singapore",
  "Japan",
  "France",
  "Brazil",
];

const TIMEZONES = [
  "(UTC-08:00) Pacific Time (US & Canada)",
  "(UTC-05:00) Eastern Time (US & Canada)",
  "(UTC+00:00) UTC / Greenwich Mean Time",
  "(UTC+01:00) Central European Time",
  "(UTC+05:30) India Standard Time",
  "(UTC+08:00) Singapore / China Standard Time",
  "(UTC+09:00) Japan Standard Time",
  "(UTC+10:00) Australian Eastern Time",
];

function CompleteProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, completeUserProfile } = useAuth();

  const [displayName, setDisplayName] = useState(user?.name || "");
  const [status, setStatus] = useState<UserStatus>("Employee");
  const [country, setCountry] = useState("United States");
  const [timezone, setTimezone] = useState("(UTC-05:00) Eastern Time (US & Canada)");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const nameParam = searchParams?.get("name");
    if (nameParam) {
      setDisplayName(nameParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await completeUserProfile({
        name: displayName,
        status,
        country,
        timezone,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Profile Completed!" subtitle="Redirecting to your dashboard...">
        <div className="py-8 flex flex-col items-center justify-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
          <p className="text-xs font-medium text-[var(--subtext)]">Setting up your personal workspace...</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Complete Your Profile" subtitle="Help us personalize your Human Values intelligence dashboard">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-[var(--foreground)]">Display Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-[var(--subtext)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Morgan"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-[var(--foreground)]">Current Status / Role</label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-[var(--subtext)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors appearance-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[var(--card-bg)] text-[var(--foreground)]">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-[var(--foreground)]">Country</label>
          <div className="relative">
            <Globe className="w-4 h-4 text-[var(--subtext)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors appearance-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c} className="bg-[var(--card-bg)] text-[var(--foreground)]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-[var(--foreground)]">Timezone</label>
          <div className="relative">
            <Clock className="w-4 h-4 text-[var(--subtext)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors appearance-none truncate"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz} className="bg-[var(--card-bg)] text-[var(--foreground)]">
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <span>Complete Setup & Enter Dashboard</span>
          )}
        </button>
      </form>
    </AuthCard>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading profile setup...</div>}>
      <CompleteProfileForm />
    </Suspense>
  );
}
