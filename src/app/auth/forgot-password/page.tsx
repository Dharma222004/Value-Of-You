"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import { Mail, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <AuthCard
      title="Reset Your Password"
      subtitle="Enter your email to receive a secure 256-bit password recovery link"
    >
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-[var(--foreground)]">Account Email Address</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <span>Send Recovery Link</span>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--subtext)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-bold text-[var(--foreground)]">Recovery Email Sent</h2>

          <p className="text-xs text-[var(--subtext)] leading-relaxed">
            We sent a password reset link to <strong className="text-[var(--foreground)]">{email}</strong>. Check your inbox and follow the instructions to update your credentials.
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/auth/reset-password"
              className="w-full py-2.5 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md"
            >
              Demo: Proceed to Reset Password
            </Link>

            <button
              onClick={() => setSent(false)}
              className="text-xs text-[var(--subtext)] hover:underline"
            >
              Didn't get the email? Try again
            </button>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
