"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import SocialButtons from "@/components/auth/SocialButtons";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { User, Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!termsAccepted) {
      setError("You must agree to the Terms of Valuation and Privacy Policy.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess("Account created successfully! Redirecting to your Dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }, 1000);
  };

  return (
    <AuthCard
      title="Create Your Account"
      subtitle="Start measuring, evaluating, and growing your lifetime Human Capital worth"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Full Name Field */}
        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-[var(--foreground)]">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-[var(--subtext)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Vance"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-[var(--foreground)]">Work / Personal Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[var(--subtext)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-[var(--foreground)]">Password</label>
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
          <label className="text-xs font-semibold text-[var(--foreground)]">Confirm Password</label>
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

        {/* Terms Agreement Checkbox */}
        <div className="pt-1 text-left">
          <label className="flex items-start gap-2 text-xs text-[var(--subtext)] cursor-pointer leading-tight">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-[var(--border)] text-blue-600 focus:ring-blue-500"
            />
            <span>
              I agree to the <a href="#" className="underline text-[var(--foreground)]">Terms of Valuation</a> and <a href="#" className="underline text-[var(--foreground)]">Privacy Architecture</a>.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <span>Create Free Account</span>
          )}
        </button>

        {/* Social Logins */}
        <SocialButtons />

        {/* Login Redirect */}
        <div className="text-center pt-4 text-xs text-[var(--subtext)] border-t border-[var(--border)]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 dark:text-cyan-400 font-bold hover:underline">
            Log In
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
