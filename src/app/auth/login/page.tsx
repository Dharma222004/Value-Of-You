"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import SocialButtons from "@/components/auth/SocialButtons";
import PasswordInput from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { validateEmail } from "@/lib/auth/validation";
import { Mail, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithCredentials, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check URL params for OAuth error messages
  useEffect(() => {
    const oauthError = searchParams?.get("error");
    if (oauthError) {
      setError(oauthError);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    const result = await loginWithCredentials(email, password, rememberMe);

    if (result.success) {
      setSuccess("Authentication successful! Redirecting to your Dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    } else {
      setError(result.error || "Invalid credentials provided.");
    }
    setLoading(false);
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to access your Human Capital Dashboard and lifetime valuation engine"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Notification Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1 text-left">
          <label className="text-xs font-semibold text-[var(--foreground)]">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[var(--subtext)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <PasswordInput
            id="login_password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••••••"
            label="Password"
          />
          <div className="flex justify-end pt-0.5">
            <Link
              href="/auth/forgot-password"
              className="text-xs text-blue-600 dark:text-cyan-400 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-[var(--subtext)] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-[var(--border)] text-blue-600 focus:ring-blue-500"
            />
            <span>Remember me for 30 days</span>
          </label>
        </div>

        {/* Submit CTA Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In to Dashboard</span>
          )}
        </button>

        {/* Social SSO Logins */}
        <SocialButtons />

        {/* Signup Redirect Link */}
        <div className="text-center pt-4 text-xs text-[var(--subtext)] border-t border-[var(--border)]">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 dark:text-cyan-400 font-bold hover:underline">
            Create Free Account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
