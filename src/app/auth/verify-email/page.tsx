"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import { validateOtp } from "@/lib/auth/validation";
import { Loader2, ShieldCheck, AlertCircle, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  // Resend Countdown Timer (60s)
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
    // Single digit input
    const cleanValue = value.replace(/[^0-9]/g, "");
    if (!cleanValue && value !== "") return;

    const char = cleanValue.length > 0 ? cleanValue[cleanValue.length - 1] : "";
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto-advance focus to next cell
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

    // Focus last filled input or last box
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;
    setOtp(["", "", "", "", "", ""]);
    setResendTimer(60);
    setCanResend(false);
    setError(null);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const otpErr = validateOtp(otp);
    if (otpErr) {
      setError(otpErr);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => {
        router.push("/auth/complete-profile");
      }, 900);
    }, 1100);
  };

  return (
    <AuthCard
      title="Verify Your Email"
      subtitle="Enter the 6-digit security code sent to your registered email address"
    >
      {!verified ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 6-Digit OTP Inputs */}
          <div className="flex justify-between items-center gap-1.5 sm:gap-2 my-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-all shadow-inner"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validating Security Code...</span>
              </>
            ) : (
              <span>Verify Security Code</span>
            )}
          </button>

          {/* Resend Timer & Button */}
          <div className="text-center text-xs text-[var(--subtext)] flex items-center justify-center gap-1.5">
            <span>Didn't receive code?</span>
            {canResend ? (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend Code</span>
              </button>
            ) : (
              <span className="font-mono text-[var(--foreground)] opacity-80">
                Resend in {resendTimer}s
              </span>
            )}
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Email Verified!</h2>
            <p className="text-xs text-[var(--subtext)] leading-relaxed">
              Your identity has been authenticated. Redirecting to profile setup...
            </p>
          </div>

          <Link
            href="/auth/complete-profile"
            className="w-full py-3 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md text-center inline-block"
          >
            Continue to Profile Setup
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
