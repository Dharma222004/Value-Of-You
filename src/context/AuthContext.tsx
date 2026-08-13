"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, AuthSession } from "@/types/auth";
import { supabase } from "@/lib/supabase";
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

/**
 * Maps the raw provider string from Supabase app_metadata to the
 * typed union declared in User. Falls back to 'google' for unknown
 * providers (e.g. OAuth providers added later in the Supabase dashboard).
 */
const KNOWN_PROVIDERS = ["credentials", "google", "github", "microsoft", "apple"] as const;
type KnownProvider = (typeof KNOWN_PROVIDERS)[number];

function parseProvider(raw: string | undefined): KnownProvider {
  if (raw && (KNOWN_PROVIDERS as readonly string[]).includes(raw)) {
    return raw as KnownProvider;
  }
  return "google";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync the Supabase access token into the middleware cookie.
  // NOTE: this cookie cannot be HttpOnly — Supabase's JS client and the Next.js
  // middleware both read it from the browser. Adding `Secure` (on HTTPS) and
  // `SameSite=Lax` limits exfiltration over plain HTTP and cross-site sends.
  const setAuthCookie = (token?: string | null) => {
    if (typeof document === "undefined") return;
    if (token) {
      const secure = typeof window !== "undefined" && window.location.protocol === "https:";
      document.cookie = `sb-auth-token=${token}; path=/; max-age=2592000; SameSite=Lax;${secure ? " Secure;" : ""}`;
    } else {
      document.cookie = "sb-auth-token=; path=/; max-age=0; SameSite=Lax;";
    }
  };

  const fetchSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setSession(null);
        setUser(null);
        return;
      }

      const sbSession = data.session;
      if (sbSession && sbSession.user) {
        const userPayload: User = {
          id: sbSession.user.id,
          email: sbSession.user.email || "",
          name:
            sbSession.user.user_metadata?.full_name ||
            sbSession.user.user_metadata?.name ||
            sbSession.user.email?.split("@")[0] ||
            "User",
          image: sbSession.user.user_metadata?.avatar_url || sbSession.user.user_metadata?.picture,
          provider: parseProvider(sbSession.user.app_metadata?.provider),
          emailVerified: true,
          createdAt: sbSession.user.created_at || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const authSession: AuthSession = {
          user: userPayload,
          token: sbSession.access_token,
          expiresAt: new Date((sbSession.expires_at || Date.now() / 1000 + 3600) * 1000).toISOString(),
          rememberMe: true,
        };

        setSession(authSession);
        setUser(userPayload);

        // Set auth cookie for Next.js middleware
        if (sbSession.access_token) {
          setAuthCookie(sbSession.access_token);
        }

        // Sync profile to database
        await syncSupabaseProfile(sbSession.user);
      } else {
        setSession(null);
        setUser(null);
        if (typeof document !== "undefined") {
          setAuthCookie(null);
        }
      }
    } catch (err) {
      console.error("[Supabase Auth Fetch Error]:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    fetchSession();

    // Subscribe to Supabase auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, sbSession) => {
      if (sbSession && sbSession.user && isMounted) {
        const userPayload: User = {
          id: sbSession.user.id,
          email: sbSession.user.email || "",
          name:
            sbSession.user.user_metadata?.full_name ||
            sbSession.user.user_metadata?.name ||
            sbSession.user.email?.split("@")[0] ||
            "User",
          image: sbSession.user.user_metadata?.avatar_url || sbSession.user.user_metadata?.picture,
          provider: parseProvider(sbSession.user.app_metadata?.provider),
          emailVerified: true,
          createdAt: sbSession.user.created_at || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const newAuthSession: AuthSession = {
          user: userPayload,
          token: sbSession.access_token,
          expiresAt: new Date((sbSession.expires_at || Date.now() / 1000 + 3600) * 1000).toISOString(),
          rememberMe: true,
        };

        setSession(newAuthSession);
        setUser(userPayload);

        // Set auth cookie for Next.js middleware
        if (sbSession.access_token) {
          setAuthCookie(sbSession.access_token);
        }

        // Synchronize to profiles table
        await syncSupabaseProfile(sbSession.user);
      } else if (event === "SIGNED_OUT" && isMounted) {
        setSession(null);
        setUser(null);
        if (typeof document !== "undefined") {
          setAuthCookie(null);
        }
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Supabase Email & Password Login
   */
  const loginWithCredentials = async (email: string, pass: string, rememberMe: boolean) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        const userPayload: User = {
          id: data.user.id,
          email: data.user.email || "",
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "User",
          image: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
          provider: "credentials",
          emailVerified: true,
          createdAt: data.user.created_at || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const authSession: AuthSession = {
          user: userPayload,
          token: data.session.access_token,
          expiresAt: new Date((data.session.expires_at || Date.now() / 1000 + 3600) * 1000).toISOString(),
          rememberMe,
        };

        setSession(authSession);
        setUser(userPayload);
        await syncSupabaseProfile(data.user);
        setLoading(false);
        return { success: true, user: userPayload };
      }

      setLoading(false);
      return { success: false, error: "Failed to authenticate session" };
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : "Authentication failed.";
      return { success: false, error: message };
    }
  };

  /**
   * Supabase Email & Password Signup
   */
  const signupWithCredentials = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: name,
          },
        },
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

        await syncSupabaseProfile(data.user);

        if (data.session) {
          const authSession: AuthSession = {
            user: userPayload,
            token: data.session.access_token,
            expiresAt: new Date((data.session.expires_at || Date.now() / 1000 + 3600) * 1000).toISOString(),
            rememberMe: true,
          };
          setSession(authSession);
          setUser(userPayload);
        }

        setLoading(false);
        return { success: true, user: userPayload };
      }

      setLoading(false);
      return { success: false, error: "Signup failed: no user was returned. Please try again or contact support." };
    } catch (err: unknown) {
      setLoading(false);
      const message = err instanceof Error ? err.message : "Signup failed.";
      return { success: false, error: message };
    }
  };

  /**
   * Complete User Profile & Update Supabase Profiles Table
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
        const { error } = await supabase
          .from("profiles")
          .upsert({
            id: activeUser.id,
            full_name: fullName,
            email: activeUser.email,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;

        if (user) {
          setUser({ ...user, name: fullName || user.name });
        }
      }
      return { success: true };
    } catch (err: unknown) {
      console.error("[completeUserProfile Error]:", err);
      const message = err instanceof Error ? err.message : "Failed to update profile.";
      return { success: false, error: message };
    }
  };

  /**
   * Google OAuth Login via Supabase SDK ONLY
   */
  const loginWithGoogle = async (): Promise<void> => {
    const redirectUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : "http://localhost:3000/auth/callback";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.error("[Supabase OAuth Error]:", error.message);
      throw error;
    }
  };

  /**
   * Sign out via Supabase SDK ONLY
   */
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err: unknown) {
      // signOut errors are non-fatal — the local session is cleared regardless.
      console.error("[Supabase signOut Error]:", err);
    }
    if (typeof document !== "undefined") {
      setAuthCookie(null);
    }
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
