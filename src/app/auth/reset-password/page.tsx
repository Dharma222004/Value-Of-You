"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || password.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setResetDone(true);
    }, 1200);
  };

  return (
    <AuthCard
      title="Create New Password"
      subtitle="Set a new high-security password for your Human Capital account"
    >
      {!resetDone ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* New Password Field */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-[var(--foreground)]">New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--subtext)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            <PasswordStrengthMeter password={password} />
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-[var(--foreground)]">Confirm New Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[var(--subtext)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-bold text-[var(--foreground)]">Password Successfully Reset</h2>

          <p className="text-xs text-[var(--subtext)] leading-relaxed">
            Your password has been updated. You can now log in with your new credentials.
          </p>

          <Link
            href="/auth/login"
            className="w-full py-3 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md inline-block"
          >
            Proceed to Login
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
