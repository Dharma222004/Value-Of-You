"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { validateOtp } from "@/lib/auth/validation";
import { supabase } from "@/lib/supabase";
import { Loader2, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams?.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue && value !== "") return;

    const char = cleanValue.length > 0 ? cleanValue[cleanValue.length - 1] : "";
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullOtp = otp.join("");
    const validationError = validateOtp(fullOtp);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      if (emailParam) {
        const { error: verifyErr } = await supabase.auth.verifyOtp({
          email: emailParam,
          token: fullOtp,
          type: "email",
        });

        if (verifyErr) {
          setError(verifyErr.message || "Invalid or expired verification code.");
          setLoading(false);
          return;
        }
      }

      setVerified(true);
      setTimeout(() => {
        router.push("/auth/complete-profile");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to verify email code.");
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !emailParam) return;
    setCanResend(false);
    setResendTimer(60);
    setError(null);

    try {
      await supabase.auth.resend({
        type: "signup",
        email: emailParam,
      });
    } catch {
      // Ignored
    }
  };

  if (verified) {
    return (
      <AuthCard title="Email Verified!" subtitle="Redirecting to profile setup...">
        <div className="py-8 flex flex-col items-center justify-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-emerald-500 animate-bounce" />
          <p className="text-xs font-medium text-[var(--subtext)]">Your email identity has been confirmed.</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Verify Your Email"
      subtitle={
        emailParam ? (
          <>
            We sent a 6-digit code to <span className="font-semibold text-[var(--foreground)]">{emailParam}</span>
          </>
        ) : (
          "Enter the 6-digit verification code sent to your email"
        )
      }
    >
      <form onSubmit={handleVerify} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-xs text-red-500">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between items-center gap-1.5 sm:gap-2" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-10 h-12 sm:w-12 sm:h-14 text-center text-base sm:text-lg font-bold rounded-xl bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-400/20 transition-all"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join("").length < 6}
          className="w-full py-3 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <span>Verify & Continue</span>
          )}
        </button>

        <div className="pt-2 text-center text-xs text-[var(--subtext)] space-y-2">
          <p>
            Didn&apos;t receive the code?{" "}
            {canResend ? (
              <button
                type="button"
                onClick={handleResendCode}
                className="font-bold text-blue-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Resend Code
              </button>
            ) : (
              <span className="text-[var(--subtext)] font-mono">Resend in {resendTimer}s</span>
            )}
          </p>
          <div>
            <Link href="/auth/login" className="text-[11px] hover:underline text-[var(--subtext)]">
              Back to Login
            </Link>
          </div>
        </div>
      </form>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading email verification...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
