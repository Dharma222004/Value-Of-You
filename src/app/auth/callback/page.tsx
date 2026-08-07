"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { syncSupabaseProfile } from "@/services/supabaseProfileService";
import { Loader2, AlertCircle } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasExchanged = useRef(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (hasExchanged.current) return;

    async function handleAuthCallback() {
      hasExchanged.current = true;

      // 1. Check for error in query params
      const oauthError = searchParams?.get("error") || searchParams?.get("error_description");
      if (oauthError) {
        console.error("[OAuth Redirect Error]:", oauthError);
        router.replace(`/auth/login?error=${encodeURIComponent(oauthError)}`);
        return;
      }

      // 2. Check for PKCE 'code' query param
      const code = searchParams?.get("code");

      try {
        let sessionUser = null;

        if (code) {
          // Exchange authorization code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          sessionUser = data.session?.user || null;
        } else {
          // Fallback: check if session is already active (implicit grant or existing session)
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;
          sessionUser = sessionData.session?.user || null;
        }

        if (sessionUser) {
          // Set auth cookie for Next.js middleware
          const { data: currentSession } = await supabase.auth.getSession();
          if (typeof document !== "undefined" && currentSession.session?.access_token) {
            const secure = typeof window !== "undefined" && window.location.protocol === "https:";
            document.cookie = `sb-auth-token=${currentSession.session.access_token}; path=/; max-age=2592000; SameSite=Lax;${secure ? " Secure;" : ""}`;
          }
          // Synchronize user profile into public.profiles table
          await syncSupabaseProfile(sessionUser);
          router.replace("/dashboard");
        } else {
          // Listen for auth state change if hash fragment is being processed asynchronously by Supabase SDK
          const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              if (typeof document !== "undefined" && session.access_token) {
                const secure = typeof window !== "undefined" && window.location.protocol === "https:";
                document.cookie = `sb-auth-token=${session.access_token}; path=/; max-age=2592000; SameSite=Lax;${secure ? " Secure;" : ""}`;
              }
              await syncSupabaseProfile(session.user);
              authListener.subscription.unsubscribe();
              router.replace("/dashboard");
            }
          });

          // Timeout fallback if no session is established within 3.5 seconds
          setTimeout(() => {
            authListener.subscription.unsubscribe();
            router.replace("/auth/login?error=Authentication%20timed%20out.%20Please%20try%20signing%20in%20again.");
          }, 3500);
        }
      } catch (err: any) {
        console.error("[Supabase OAuth Processing Exception]:", err);
        const message = err?.message || "Failed to complete Google authentication.";
        setErrorMsg(message);
        setTimeout(() => {
          router.replace(`/auth/login?error=${encodeURIComponent(message)}`);
        }, 1500);
      }
    }

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-base)] text-slate-200 p-4">
      <div className="glass-card p-8 rounded-3xl max-w-sm w-full text-center space-y-4">
        {errorMsg ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white">Authentication Failed</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
            <p className="text-[11px] text-slate-500">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-base font-bold text-white">Completing Sign In</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verifying your Google session with Supabase...
            </p>
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#060a12] text-slate-200">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
