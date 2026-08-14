"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, AuthSession } from "@/types/auth";
import { supabase } from "@/lib/supabase";
import { getAppUrl } from "@/lib/auth/config";
import { syncSupabaseProfile } from "@/services/supabaseProfileService";

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginWithCredentials: (email: string, pass: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string; user?: User }>;
  signupWithCredentials: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  completeUserProfile: (data: { displayName?: string; status?: string; country?: string; timezone?: string; completedOnboarding?: boolean }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const KNOWN_PROVIDERS = ["credentials", "google", "github", "microsoft", "apple"] as const;
type KnownProvider = (typeof KNOWN_PROVIDERS)[number];

function parseProvider(raw: string | undefined): KnownProvider {
  if (raw && (KNOWN_PROVIDERS as readonly string[]).includes(raw)) {
    return raw as KnownProvider;
  }
  return "google";
}

// Writes or clears the sb-auth-token cookie used by Next.js middleware.
// Cannot be HttpOnly because both Supabase JS SDK and middleware read it.
function setAuthCookie(token?: string | null, rememberMe = true) {
  if (typeof document === "undefined") return;
  if (token) {
    const secure = typeof window !== "undefined" && window.location.protocol === "https:";
    const maxAge = rememberMe ? 2592000 : 86400; // 30 days or 1 day
    document.cookie = `sb-auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax;${secure ? " Secure;" : ""}`;
  } else {
    document.cookie = "sb-auth-token=; path=/; max-age=0; SameSite=Lax;";
  }
}

function mapSupabaseUser(sbUser: any, sbSession: any): { user: User; authSession: AuthSession } {
  const userPayload: User = {
    id: sbUser.id,
    email: sbUser.email || "",
    name:
      sbUser.user_metadata?.full_name ||
      sbUser.user_metadata?.name ||
      sbUser.email?.split("@")[0] ||
      "User",
    image: sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture,
    provider: parseProvider(sbUser.app_metadata?.provider),
    emailVerified: Boolean(sbUser.email_confirmed_at),
    createdAt: sbUser.created_at || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const authSession: AuthSession = {
    user: userPayload,
    token: sbSession.access_token,
    expiresAt: new Date(
      (sbSession.expires_at || Math.floor(Date.now() / 1000) + 3600) * 1000
    ).toISOString(),
    rememberMe: true,
  };

  return { user: userPayload, authSession };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session?.user) {
        setSession(null);
        setUser(null);
        setAuthCookie(null);
        return;
      }

      const sbSession = data.session;
      const { user: userPayload, authSession } = mapSupabaseUser(sbSession.user, sbSession);

      setSession(authSession);
      setUser(userPayload);
      setAuthCookie(sbSession.access_token);

      await syncSupabaseProfile(sbSession.user);
    } catch (err) {
      console.error("[AuthContext fetchSession]:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, sbSession) => {
      if (!isMounted) return;

      if (sbSession?.user) {
        const { user: userPayload, authSession } = mapSupabaseUser(sbSession.user, sbSession);
        setSession(authSession);
        setUser(userPayload);
        setAuthCookie(sbSession.access_token);
        await syncSupabaseProfile(sbSession.user);
      } else if (event === "SIGNED_OUT") {
        setSession(null);
        setUser(null);
        setAuthCookie(null);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Email & Password Login
   */
  const loginWithCredentials = async (email: string, pass: string, rememberMe: boolean) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        const { user: userPayload, authSession } = mapSupabaseUser(data.user, data.session);
        authSession.rememberMe = rememberMe;
        setSession(authSession);
        setUser(userPayload);
        setAuthCookie(data.session.access_token, rememberMe);
        await syncSupabaseProfile(data.user);
        setLoading(false);
        return { success: true, user: userPayload };
      }

      setLoading(false);
      return { success: false, error: "Failed to authenticate session" };
    } catch (err: unknown) {
      setLoading(false);
      return { success: false, error: err instanceof Error ? err.message : "Authentication failed." };
    }
  };

  /**
   * Email & Password Signup — does NOT create a session.
   * Session is established only after OTP verification.
   */
  const signupWithCredentials = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: { data: { full_name: name } },
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userPayload: User = {
          id: data.user.id,
          email: data.user.email || "",
          name,
          provider: "credentials",
          emailVerified: Boolean(data.user.email_confirmed_at),
          createdAt: data.user.created_at || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setLoading(false);
        return { success: true, user: userPayload };
      }

      setLoading(false);
      return { success: false, error: "Signup failed: no user returned." };
    } catch (err: unknown) {
      setLoading(false);
      return { success: false, error: err instanceof Error ? err.message : "Signup failed." };
    }
  };

  /**
   * Update user profile fields in the profiles table.
   */
  const completeUserProfile = async (data: {
    displayName?: string;
    status?: string;
    country?: string;
    timezone?: string;
    completedOnboarding?: boolean;
  }) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const activeUser = sessionData.session?.user;
      if (activeUser) {
        const fullName = data.displayName || user?.name || activeUser.email?.split("@")[0];
        const { error } = await supabase.from("profiles").upsert({
          id: activeUser.id,
          full_name: fullName,
          email: activeUser.email,
          updated_at: new Date().toISOString(),
        });
        if (error) throw error;
        if (user) setUser({ ...user, name: fullName || user.name });
      }
      return { success: true };
    } catch (err: unknown) {
      console.error("[completeUserProfile Error]:", err);
      return { success: false, error: err instanceof Error ? err.message : "Failed to update profile." };
    }
  };

  /**
   * Google OAuth — uses dynamic origin (no localhost fallback)
   */
  const loginWithGoogle = async (): Promise<void> => {
    const redirectUrl = `${getAppUrl()}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: { access_type: "offline", prompt: "select_account" },
      },
    });

    if (error) {
      console.error("[Supabase OAuth Error]:", error.message);
      throw error;
    }
  };

  /**
   * Secure Logout — clears session, cookie, and redirects to /login
   */
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err: unknown) {
      console.error("[Supabase signOut Error]:", err);
    }
    setAuthCookie(null);
    setSession(null);
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user,
        loginWithCredentials,
        signupWithCredentials,
        completeUserProfile,
        loginWithGoogle,
        logout,
        refreshSession: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
