"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import SocialButtons from "@/components/auth/SocialButtons";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { validateEmail, validatePassword } from "@/lib/auth/validation";
import { supabase } from "@/lib/supabase";
import { getAppUrl } from "@/lib/auth/config";
import { User, Mail, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // ── Client-side validation ───────────────────────────────────────────
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
      setError("You must accept the Terms of Valuation and Privacy Architecture to proceed.");
      return;
    }

    setLoading(true);

    try {
      // ── Step 1: Check whether the email already exists ───────────────────
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email.toLowerCase().trim())
        .maybeSingle();

      if (existingProfile) {
        setError("An account already exists with this email address.");
        setLoading(false);
        return;
      }

      // ── Step 2: Create account via Supabase Auth ─────────────────────────
      // emailRedirectTo points to our /auth/callback which:
      //   • exchanges the code for a session
      //   • upserts the profile record
      //   • redirects to /dashboard
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: `${getAppUrl()}/auth/callback`,
        },
      });

      if (signUpError) {
        if (
          signUpError.message.toLowerCase().includes("user already registered") ||
          signUpError.message.toLowerCase().includes("already been registered")
        ) {
          setError("An account already exists with this email address.");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError("Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      // ── Step 3: Redirect to "check your email" waiting page ──────────────
      setSuccess("Account created! Redirecting…");
      setTimeout(() => {
        router.push(
          `/auth/verify-email?email=${encodeURIComponent(email.trim())}`
        );
      }, 700);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create account. Please try again.";
      setError(message);
      setLoading(false);
    }
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

        {/* Full Name */}
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

        {/* Email */}
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

        {/* Password */}
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

        {/* Confirm Password */}
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

        {/* Terms */}
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
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-[var(--foreground)] hover:text-blue-500">
                Terms of Valuation
              </Link>{" "}
              and{" "}
              <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-[var(--foreground)] hover:text-blue-500">
                Privacy Architecture
              </Link>
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

        <SocialButtons />

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
