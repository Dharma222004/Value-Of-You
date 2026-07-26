"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import { Loader2, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setVerified(true);
    }, 1200);
  };

  return (
    <AuthCard
      title="Verify Your Email"
      subtitle="Enter the 6-digit security code sent to your registered email"
    >
      {!verified ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 6-Digit OTP Inputs */}
          <div className="flex justify-between items-center gap-2 my-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-bold font-mono rounded-xl bg-[var(--background)] border border-[var(--border)] focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors"
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

          <div className="text-center text-xs text-[var(--subtext)]">
            Didn't receive code?{" "}
            <button
              type="button"
              onClick={() => alert("New verification code sent to your email!")}
              className="text-blue-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              Resend Code
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-lg font-bold text-[var(--foreground)]">Email Verified!</h2>

          <p className="text-xs text-[var(--subtext)] leading-relaxed">
            Your identity has been authenticated with 256-bit zero-knowledge encryption.
          </p>

          <Link
            href="/auth/login"
            className="w-full py-3 rounded-xl bg-blue-600 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md inline-block"
          >
            Proceed to Login
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
