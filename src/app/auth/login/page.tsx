"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import SocialButtons from "@/components/auth/SocialButtons";
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    // Simulate authentication processing & redirect to Dashboard
    setTimeout(() => {
      setLoading(false);
      setSuccess("Authentication successful! Redirecting to your Dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    }, 1000);
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to access your Human Capital Dashboard and valuation insights"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Notification Banner */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Banner */}
        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1 text-left">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-[var(--foreground)]">Password</label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-blue-600 dark:text-cyan-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
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
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-[var(--subtext)] cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-[var(--border)] text-blue-600 focus:ring-blue-500"
            />
            <span>Remember me for 30 days</span>
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
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>

        {/* Social Logins */}
        <SocialButtons />

        {/* Signup Redirect Link */}
        <div className="text-center pt-4 text-xs text-[var(--subtext)] border-t border-[var(--border)]">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 dark:text-cyan-400 font-bold hover:underline">
            Create Account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
