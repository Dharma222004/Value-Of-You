"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/database";
import { syncSupabaseProfile } from "@/services/supabaseProfileService";
import { trackEvent } from "@/lib/tracking";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileForUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: dbError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (dbError || !data) {
        // Profile doesn't exist yet — sync from auth metadata
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          const synced = await syncSupabaseProfile(sessionData.session.user);
          setProfile(synced);
        }
      } else {
        setProfile(data as Profile);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentProfile() {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (user && isMounted) {
        await fetchProfileForUser(user.id);
      } else if (isMounted) {
        setProfile(null);
        setLoading(false);
      }
    }

    loadCurrentProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && isMounted) {
        await fetchProfileForUser(session.user.id);
      } else if (event === "SIGNED_OUT" && isMounted) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfileForUser]);

  const updateProfile = async (payload: Partial<Profile>) => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        throw new Error("User is not authenticated");
      }

      const updateData = {
        ...payload,
        updated_at: new Date().toISOString(),
      };

      delete (updateData as any).id;
      delete (updateData as any).email;

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setProfile(data as Profile);
      trackEvent("profile_updated", { fields: Object.keys(payload) });
      return { success: true, profile: data as Profile };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, refresh: () => profile?.id && fetchProfileForUser(profile.id), updateProfile };
}
