"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SocialButtonsProps {
  onSocialLogin?: (provider: string) => void;
}

export default function SocialButtons({ onSocialLogin }: SocialButtonsProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleProviderClick = (provider: string) => {
    setLoadingProvider(provider);
    if (onSocialLogin) {
      onSocialLogin(provider);
    }

    if (provider === "Google") {
      // Trigger production Google OAuth Flow
      loginWithGoogle();
      return;
    }

    // Secondary Providers Simulation (GitHub, Microsoft, Apple)
    setTimeout(() => {
      setLoadingProvider(null);
      router.push(`/auth/complete-profile?provider=${provider.toLowerCase()}&name=Enterprise+User&email=user%40${provider.toLowerCase()}.com`);
    }, 1000);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="border-t border-[var(--border)] w-full"></div>
        <span className="bg-[var(--card-bg)] px-3 text-[11px] font-mono text-[var(--subtext)] uppercase tracking-wider shrink-0 border border-[var(--border)] rounded-full py-0.5">
          Or Continue With
        </span>
        <div className="border-t border-[var(--border)] w-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Google Login */}
        <button
          type="button"
          onClick={() => handleProviderClick("Google")}
          disabled={!!loadingProvider}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:border-blue-500/50 text-[var(--foreground)] text-xs font-semibold hover:bg-[var(--glass-bg)] transition-all shadow-sm disabled:opacity-50 group"
        >
          {loadingProvider === "Google" ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span className="truncate">Google SSO</span>
        </button>

        {/* GitHub Login */}
        <button
          type="button"
          onClick={() => handleProviderClick("GitHub")}
          disabled={!!loadingProvider}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:border-blue-500/50 text-[var(--foreground)] text-xs font-semibold hover:bg-[var(--glass-bg)] transition-all shadow-sm disabled:opacity-50 group"
        >
          {loadingProvider === "GitHub" ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            <svg className="w-4 h-4 fill-current shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          )}
          <span className="truncate">GitHub</span>
        </button>

        {/* Microsoft Login */}
        <button
          type="button"
          onClick={() => handleProviderClick("Microsoft")}
          disabled={!!loadingProvider}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:border-blue-500/50 text-[var(--foreground)] text-xs font-semibold hover:bg-[var(--glass-bg)] transition-all shadow-sm disabled:opacity-50 group"
        >
          {loadingProvider === "Microsoft" ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
          )}
          <span className="truncate">Microsoft</span>
        </button>

        {/* Apple Login */}
        <button
          type="button"
          onClick={() => handleProviderClick("Apple")}
          disabled={!!loadingProvider}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] hover:border-blue-500/50 text-[var(--foreground)] text-xs font-semibold hover:bg-[var(--glass-bg)] transition-all shadow-sm disabled:opacity-50 group"
        >
          {loadingProvider === "Apple" ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            <svg className="w-4 h-4 fill-current shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.33.13-9.17-1.92-14.51-6.15-3.23-2.65-7.14-7.27-11.75-13.88-7.85-11.2-13.91-23.75-18.17-37.66-4.26-13.9-6.39-26.86-6.39-38.86 0-16.14 3.99-29.47 11.96-40 7.97-10.52 17.95-15.86 29.93-16.02 5.09 0 10.63 1.34 16.63 4.02 6.01 2.69 10.23 4.04 12.67 4.04 2.18 0 6.53-1.4 13.06-4.2 6.53-2.8 12.01-4.07 16.44-3.8 13.14.77 23.63 5.48 31.47 14.13-11.53 6.95-17.15 16.7-16.88 29.25.32 10.35 4.41 18.89 12.28 25.62 4.43 3.86 9.4 6.64 14.92 8.35-2.61 7.63-6.17 15.65-10.69 24.08zM119.22 31.86c0-7.39 2.66-14.65 7.98-21.78 5.32-7.13 12.04-11.44 20.16-12.93.26 1.48.39 2.76.39 3.84 0 7.4-2.69 14.72-8.08 21.96-5.39 7.24-12.18 11.64-20.37 13.2-0.08-.85-.08-2.28-.08-4.29z" />
            </svg>
          )}
          <span className="truncate">Apple ID</span>
        </button>
      </div>
    </div>
  );
}
