"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import SocialButtons from "@/components/auth/SocialButtons";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { useAuth } from "@/context/AuthContext";
import { validateEmail, validatePassword } from "@/lib/auth/validation";
import { User, Mail, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signupWithCredentials } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    const passErr = validatePassword(password);
    if (passErr) {
      setError(passErr);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError("You must accept the Terms of Service and Privacy Architecture to proceed.");
      return;
    }

    setLoading(true);

    const result = await signupWithCredentials(fullName, email, password);

    if (result.success) {
      setSuccess("Account created! Check your email for the verification code.");
      setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }, 700);
    } else {
      setError(result.error || "Failed to create account. Please try again.");
    }
    setLoading(false);
  };

  return (
    <AuthCard
      title="Create Free Account"
      subtitle="Start measuring, evaluating, and growing your lifetime Human Capital worth"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Notification Banners */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Full Name Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="signup_name" className="section-label block">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="signup_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              autoComplete="name"
              className="input-field text-sm pl-9"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1.5 text-left">
          <label htmlFor="signup_email" className="section-label block">Email address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="signup_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="input-field text-sm pl-9"
            />
          </div>
        </div>

        {/* Password Input with Live Requirements */}
        <div className="space-y-1">
          <PasswordInput
            id="signup_password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••••••"
            label="Password"
            autoComplete="new-password"
          />
          <PasswordStrengthMeter password={password} showRules={true} />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <PasswordInput
            id="signup_confirm_password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••••••"
            label="Confirm Password"
            autoComplete="new-password"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-[11px] text-red-500 font-medium pt-0.5">Passwords do not match</p>
          )}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="pt-1 text-left">
          <label className="flex items-start gap-2 text-xs text-[var(--subtext)] cursor-pointer leading-tight select-none">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-[var(--border)] text-blue-600 focus:ring-blue-500"
            />
            <span>
              I agree to the{" "}
              <a href="#" className="underline text-[var(--foreground)] hover:text-blue-500">
                Terms of Valuation
              </a>{" "}
              and{" "}
              <a href="#" className="underline text-[var(--foreground)] hover:text-blue-500">
                Privacy Architecture
              </a>
              .
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          id="signup_submit_btn"
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-2.5 text-sm"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
          ) : (
            "Create Free Account"
          )}
        </button>

        {/* Social SSO Logins */}
        <SocialButtons />

        {/* Login Redirect */}
        <p className="text-center text-xs text-slate-500 pt-2 border-t border-white/6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
