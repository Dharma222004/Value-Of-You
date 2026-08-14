"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { supabase } from "@/lib/supabase";
import { getAppUrl } from "@/lib/auth/config";
import { Mail, RefreshCw, Loader2, CheckCircle2 } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get("email") || "";

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (!emailParam || resending || cooldown > 0) return;
    setResending(true);
    setResendError(null);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: emailParam,
        options: {
          emailRedirectTo: `${getAppUrl()}/auth/callback`,
        },
      });

      if (error) {
        setResendError(error.message);
      } else {
        setResent(true);
        // 60-second cooldown
        let secs = 60;
        setCooldown(secs);
        const id = setInterval(() => {
          secs -= 1;
          setCooldown(secs);
          if (secs <= 0) clearInterval(id);
        }, 1000);
      }
    } catch (err: unknown) {
      setResendError(err instanceof Error ? err.message : "Failed to resend email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthCard
      title="Check your email"
      subtitle="We've sent a verification link to confirm your account"
    >
      <div className="space-y-5">
        {/* Email display */}
        <div className="flex flex-col items-center gap-3 py-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)", border: "1px solid rgba(99,102,241,0.25)" }}
          >
            <Mail className="w-7 h-7 text-indigo-400" />
          </div>

          {emailParam && (
            <p className="text-xs text-center text-[var(--subtext)] leading-relaxed">
              We sent a verification link to{" "}
              <span className="font-semibold text-[var(--foreground)]">{emailParam}</span>
            </p>
          )}

          <p className="text-[11px] text-center text-slate-500 leading-relaxed max-w-xs">
            Click the link in the email to verify your account and access your dashboard.
            The link expires in 24 hours.
          </p>
        </div>

        {/* Resent confirmation */}
        {resent && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Verification email resent successfully.</span>
          </div>
        )}

        {/* Resend error */}
        {resendError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {resendError}
          </div>
        )}

        {/* Resend button */}
        {emailParam && (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="w-full py-2.5 rounded-xl border border-[var(--border)] text-xs font-medium text-[var(--foreground)] hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
            ) : cooldown > 0 ? (
              `Resend available in ${cooldown}s`
            ) : (
              <><RefreshCw className="w-3.5 h-3.5" /> Resend verification email</>
            )}
          </button>
        )}

        {/* Divider */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-white/6" />
          <span className="text-[11px] text-slate-500">or</span>
          <div className="flex-1 h-px bg-white/6" />
        </div>

        {/* Back to login */}
        <p className="text-center text-xs text-slate-500">
          Already verified?{" "}
          <Link
            href="/auth/login"
            className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-[11px] text-slate-600">
          Wrong email?{" "}
          <Link
            href="/auth/signup"
            className="text-slate-500 hover:text-slate-300 transition-colors underline"
          >
            Start over
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
