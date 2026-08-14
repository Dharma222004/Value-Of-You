"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import SocialButtons from "@/components/auth/SocialButtons";
import PasswordInput from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { validateEmail } from "@/lib/auth/validation";
import { supabase } from "@/lib/supabase";
import { Mail, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // When error = "Email not verified", we surface a resend link
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    const oauthError = searchParams?.get("error");
    if (oauthError) setError(decodeURIComponent(oauthError));
  }, [searchParams]);

  // Redirect already-authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams?.get("redirect") || "/dashboard";
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUnverifiedEmail(null);

    // ── Validate inputs ──────────────────────────────────────────────────
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError("Invalid email");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setLoading(false);
        const msg = signInError.message.toLowerCase();

        // ── Email not confirmed ───────────────────────────────────────────
        if (msg.includes("email not confirmed") || msg.includes("email_not_confirmed")) {
          setUnverifiedEmail(email.trim());
          setError("Please verify your email before logging in.");
          return;
        }

        // ── Invalid credentials — distinguish "no user" vs "wrong password" ─
        if (
          msg.includes("invalid login credentials") ||
          msg.includes("invalid credentials") ||
          msg.includes("wrong password")
        ) {
          // Check if a profile exists for this email to refine the message
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", email.trim().toLowerCase())
            .maybeSingle();

          if (!profile) {
            setError("No account found with this email address.");
          } else {
            setError("Incorrect password. Please try again.");
          }
          return;
        }

        if (msg.includes("user not found") || msg.includes("no user found")) {
          setError("No account found with this email address.");
          return;
        }

        // ── Network / generic errors ──────────────────────────────────────
        setError(signInError.message);
        return;
      }

      // ── Success ──────────────────────────────────────────────────────────
      if (data.session && data.user) {
        // Set auth cookie for Next.js middleware
        if (typeof document !== "undefined") {
          const secure = window.location.protocol === "https:";
          document.cookie = `sb-auth-token=${data.session.access_token}; path=/; max-age=${
            rememberMe ? 2592000 : 86400
          }; SameSite=Lax;${secure ? " Secure;" : ""}`;
        }

        setSuccess("Authenticated! Redirecting to dashboard…");
        const redirect = searchParams?.get("redirect") || "/dashboard";
        setTimeout(() => router.push(redirect), 800);
      } else {
        setError("Failed to authenticate. Please try again.");
        setLoading(false);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed. Please try again.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Human Values & Financial Intelligence account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <span>{error}</span>
              {/* Deep-link to re-verify when email is unconfirmed */}
              {unverifiedEmail && (
                <Link
                  href={`/auth/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                  className="text-indigo-400 hover:text-indigo-300 underline font-medium text-[11px]"
                >
                  Resend verification email →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="login_email" className="section-label block">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              id="login_email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="input-field text-sm pl-9"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="section-label block">Password</label>
            <Link
              href="/auth/forgot-password"
              className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="login_password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••••"
            label=""
          />
        </div>

        {/* Remember Me */}
        <label className="flex items-center gap-2.5 cursor-pointer select-none group w-fit">
          <div className="relative">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded border transition-all ${
                rememberMe
                  ? "bg-indigo-500 border-indigo-500"
                  : "border-slate-600 bg-transparent group-hover:border-slate-400"
              } flex items-center justify-center`}
            >
              {rememberMe && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-xs text-slate-400">Stay signed in for 30 days</span>
        </label>

        {/* Submit */}
        <button
          id="login_submit_btn"
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-2.5 text-sm"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 divider" />
          <span className="text-[11px] text-slate-500 font-medium">or continue with</span>
          <div className="flex-1 divider" />
        </div>

        <SocialButtons onError={(err) => setError(err)} />

        <p className="text-center text-xs text-slate-500 pt-2 border-t border-white/6">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            Create free account
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
