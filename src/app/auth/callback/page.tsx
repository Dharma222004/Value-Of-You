"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createVerifiedProfile } from "@/services/supabaseProfileService";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRun = useRef(false);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    async function handleCallback() {
      // 1. Error forwarded in query params (OAuth error, expired link, etc.)
      const oauthError =
        searchParams?.get("error") || searchParams?.get("error_description");
      if (oauthError) {
        setStatus("error");
        setErrorMsg(decodeURIComponent(oauthError));
        setTimeout(() => {
          router.replace(
            `/auth/login?error=${encodeURIComponent(oauthError)}`
          );
        }, 2000);
        return;
      }

      try {
        let sessionUser = null;
        let sessionToken: string | null = null;

        // 2. PKCE code exchange (email confirmation link & Google OAuth)
        const code = searchParams?.get("code");
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          sessionUser = data.session?.user || null;
          sessionToken = data.session?.access_token || null;
        }

        // 3. Fallback: session may already be present (implicit grant / hash fragment)
        if (!sessionUser) {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          sessionUser = sessionData.session?.user || null;
          sessionToken = sessionData.session?.access_token || null;
        }

        // 4. If still no session, listen for the SDK to process the hash
        if (!sessionUser) {
          await new Promise<void>((resolve, reject) => {
            const { data: listener } = supabase.auth.onAuthStateChange(
              async (event, session) => {
                if (session?.user) {
                  sessionUser = session.user;
                  sessionToken = session.access_token;
                  listener.subscription.unsubscribe();
                  resolve();
                }
              }
            );
            // Timeout after 4 seconds
            setTimeout(() => {
              listener.subscription.unsubscribe();
              reject(new Error("Session timeout. Please click the link again or re-register."));
            }, 4000);
          });
        }

        if (!sessionUser) {
          throw new Error("No session established. Please try again.");
        }

        // 5. Set auth cookie for Next.js middleware
        if (sessionToken && typeof document !== "undefined") {
          const secure = window.location.protocol === "https:";
          document.cookie = `sb-auth-token=${sessionToken}; path=/; max-age=2592000; SameSite=Lax;${secure ? " Secure;" : ""}`;
        }

        // 6. Create / upsert profile with values_completed = false
        //    createVerifiedProfile uses ON CONFLICT (id) DO UPDATE so it's idempotent
        await createVerifiedProfile(
          sessionUser.id,
          sessionUser.email || "",
          sessionUser.user_metadata?.full_name ||
            sessionUser.user_metadata?.name ||
            (sessionUser.email || "").split("@")[0]
        );

        setStatus("success");
        setTimeout(() => {
          router.replace("/dashboard");
        }, 800);
      } catch (err: any) {
        console.error("[AuthCallback Error]:", err);
        const message = err?.message || "Authentication failed. Please try again.";
        setStatus("error");
        setErrorMsg(message);
        setTimeout(() => {
          router.replace(`/auth/login?error=${encodeURIComponent(message)}`);
        }, 2000);
      }
    }

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-base)] p-4">
      <div
        className="p-8 rounded-3xl max-w-sm w-full text-center space-y-4"
        style={{
          background: "rgba(13,17,23,0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}
      >
        {status === "loading" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-base font-bold text-white">Verifying your email…</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Setting up your account. This only takes a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white">Email Verified!</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Account confirmed. Redirecting to your dashboard…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white">Verification Failed</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
            <p className="text-[11px] text-slate-500">Redirecting to login…</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#060a12]">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
