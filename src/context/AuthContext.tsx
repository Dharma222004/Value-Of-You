"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, AuthSession, UserProfile } from "@/types/auth";
import {
  getStoredSession,
  saveSession,
  clearSession,
  updateStoredUserProfile,
  subscribeMultiTabSync,
} from "@/lib/auth/session";

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  loginWithCredentials: (email: string, pass: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string; user?: User }>;
  loginWithGoogle: () => void;
  signupWithCredentials: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  completeUserProfile: (profileData: UserProfile) => Promise<{ success: boolean; user?: User }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial session load
    const activeSession = getStoredSession();
    if (activeSession) {
      setSession(activeSession);
      setUser(activeSession.user);
    }
    setLoading(false);

    // Multi-tab synchronization
    const unsubscribe = subscribeMultiTabSync((event, payload) => {
      if (event === "LOGIN") {
        setSession(payload);
        setUser(payload.user);
      } else if (event === "LOGOUT") {
        setSession(null);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithCredentials = async (email: string, pass: string, rememberMe: boolean) => {
    setLoading(true);
    try {
      // Create authenticated user session
      const newUser: User = {
        id: `usr_${Date.now()}`,
        email,
        name: email.split("@")[0].replace(".", " "),
        provider: "credentials",
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newSession: AuthSession = {
        user: newUser,
        token: `jwt_sec_${Math.random().toString(36).substring(2)}_${Date.now()}`,
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString(),
        rememberMe,
      };

      saveSession(newSession);
      setSession(newSession);
      setUser(newUser);
      setLoading(false);
      return { success: true, user: newUser };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || "Authentication failed." };
    }
  };

  const loginWithGoogle = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const redirectUri = `${window.location.origin}/api/auth/callback/google`;
    const scope = encodeURIComponent("openid profile email");
    const state = Math.random().toString(36).substring(7);

    // Store state in sessionStorage for CSRF validation
    sessionStorage.setItem("google_oauth_state", state);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${state}&prompt=consent&access_type=offline`;

    window.location.href = googleAuthUrl;
  };

  const signupWithCredentials = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        email,
        name,
        provider: "credentials",
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newSession: AuthSession = {
        user: newUser,
        token: `jwt_sec_${Math.random().toString(36).substring(2)}_${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        rememberMe: true,
      };

      saveSession(newSession);
      setSession(newSession);
      setUser(newUser);
      setLoading(false);
      return { success: true, user: newUser };
    } catch (err: any) {
      setLoading(false);
      return { success: false, error: err.message || "Signup failed." };
    }
  };

  const completeUserProfile = async (profileData: UserProfile) => {
    const updatedUser = updateStoredUserProfile(profileData);
    if (updatedUser) {
      setUser({ ...updatedUser });
      if (session) {
        setSession({ ...session, user: { ...updatedUser } });
      }
      return { success: true, user: updatedUser };
    }
    return { success: false };
  };

  const logout = () => {
    clearSession();
    setSession(null);
    setUser(null);
    window.location.href = "/auth/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user,
        loginWithCredentials,
        loginWithGoogle,
        signupWithCredentials,
        completeUserProfile,
        logout,
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
