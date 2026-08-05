import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/database";

export class ProfileService {
  /**
   * Get user profile by ID
   */
  static async getProfileById(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as Profile;
  }

  /**
   * Create profile (Upsert)
   */
  static async upsertProfile(profile: Partial<Profile> & { id: string; email: string }): Promise<Profile> {
    const payload = {
      ...profile,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  /**
   * Update profile fields
   */
  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    delete (payload as any).id;
    delete (payload as any).email;

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  }

  /**
   * Delete profile
   */
  static async deleteProfile(userId: string): Promise<boolean> {
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) throw error;
    return true;
  }
}
