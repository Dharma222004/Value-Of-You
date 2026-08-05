import { supabase } from "@/lib/supabase";
import { AiEvaluation } from "@/types/database";

export class AiEvaluationService {
  /**
   * Save AI evaluation report for user
   */
  static async createEvaluation(
    evaluation: Omit<AiEvaluation, "id" | "created_at">
  ): Promise<AiEvaluation> {
    const { data, error } = await supabase
      .from("ai_evaluations")
      .insert([
        {
          ...evaluation,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as AiEvaluation;
  }

  /**
   * Get latest AI evaluation for user
   */
  static async getLatestEvaluation(userId: string): Promise<AiEvaluation | null> {
    const { data, error } = await supabase
      .from("ai_evaluations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as AiEvaluation | null;
  }

  /**
   * Delete AI evaluation
   */
  static async deleteEvaluation(evaluationId: string): Promise<boolean> {
    const { error } = await supabase.from("ai_evaluations").delete().eq("id", evaluationId);
    if (error) throw error;
    return true;
  }
}
