"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import PasswordStrengthMeter from "@/components/auth/PasswordStrengthMeter";
import { validatePassword } from "@/lib/auth/validation";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase sends the user here with a recovery token in the URL hash.
  // The Supabase JS client auto-detects it and emits PASSWORD_RECOVERY,
  // establishing a temporary session the user can use to update their password.
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    // Also check if there's already an active session (page reload case)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passErr = validatePassword(password);
    if (passErr) {
      setError(passErr);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      // Sign out after password reset so user logs in fresh
      await supabase.auth.signOut();
      if (typeof document !== "undefined") {
        document.cookie = "sb-auth-token=; path=/; max-age=0; SameSite=Lax;";
      }

      setResetDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create New Password"
      subtitle="Set a new high-security password for your Human Capital account"
    >
      {!resetDone ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* New Password Field */}
          <div className="space-y-1">
            <PasswordInput
              id="reset_new_password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••••••"
              label="New Password"
              autoComplete="new-password"
            />
            <PasswordStrengthMeter password={password} showRules={true} />
          </div>

          {/* Confirm New Password Field */}
          <div className="space-y-1">
            <PasswordInput
              id="reset_confirm_password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="••••••••••••"
              label="Confirm New Password"
              autoComplete="new-password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-[11px] text-red-500 font-medium pt-0.5">Passwords do not match</p>
            )}
          </div>

          <button
            id="reset_submit_btn"
            type="submit"
            disabled={loading || !sessionReady}
            className="btn-primary w-full justify-center py-2.5 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>

          {!sessionReady && (
            <p className="text-center text-[11px] text-amber-400">
              Waiting for recovery session... Make sure you clicked the link from your email.
            </p>
          )}
        </form>
      ) : (
        <div className="text-center space-y-4 py-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Password Successfully Reset</h2>
            <p className="text-xs text-[var(--subtext)] leading-relaxed">
              Your password has been updated. You can now log in with your new credentials.
            </p>
          </div>

          <Link
            href="/auth/login"
            className="btn-primary w-full justify-center py-2.5 text-sm inline-flex"
          >
            Proceed to Login
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
