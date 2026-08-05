import { supabase } from "@/lib/supabase";
import { SupabaseProfile, syncSupabaseProfile } from "@/services/supabaseProfileService";

export class UserService {
  /**
   * Sync User Profile after Supabase Google Auth login
   */
  static async upsertGoogleUser(user: any): Promise<SupabaseProfile | null> {
    return syncSupabaseProfile(user);
  }

  /**
   * Fetch User Profile by ID using auth.uid()
   */
  static async getUserById(userId: string): Promise<SupabaseProfile | null> {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    return data as SupabaseProfile | null;
  }

  /**
   * Update Editable Profile Fields in Supabase profiles table
   */
  static async updateUserProfile(userId: string, data: Partial<SupabaseProfile>): Promise<SupabaseProfile> {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    delete (updateData as any).id;
    delete (updateData as any).email;

    const { data: updated, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return updated as SupabaseProfile;
  }

  /**
   * List all user profiles from Supabase
   */
  static async getAllUsers(): Promise<SupabaseProfile[]> {
    const { data } = await supabase.from("profiles").select("*");
    return (data || []) as SupabaseProfile[];
  }
}
