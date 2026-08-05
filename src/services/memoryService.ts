import { supabase } from "@/lib/supabase";

export class MemoryService {
  /**
   * Set or update AI memory entry in Supabase memory table
   */
  static async setMemory(userId: string, key: string, value: string, confidence: number = 1.0) {
    const { data, error } = await supabase
      .from("memory")
      .upsert(
        {
          user_id: userId,
          key,
          value,
          confidence,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,key" }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Fetch user memories filtered by auth.uid()
   */
  static async getUserMemories(userId: string) {
    const { data, error } = await supabase
      .from("memory")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  }
}
