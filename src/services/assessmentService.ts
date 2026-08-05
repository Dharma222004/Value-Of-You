import { supabase } from "@/lib/supabase";
import { Assessment, AssessmentQuestion, AssessmentAnswer, AssessmentResult } from "@/types/database";

export class AssessmentService {
  /**
   * Start a new assessment for user
   */
  static async startAssessment(userId: string, moduleCount: number = 5): Promise<Assessment> {
    const { data, error } = await supabase
      .from("assessments")
      .insert([
        {
          user_id: userId,
          status: "STARTED",
          progress: 0,
          module_count: moduleCount,
          started_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as Assessment;
  }

  /**
   * Get active assessment by ID
   */
  static async getAssessmentById(assessmentId: string): Promise<Assessment | null> {
    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", assessmentId)
      .single();

    if (error) return null;
    return data as Assessment;
  }

  /**
   * Get all assessments for a user
   */
  static async getUserAssessments(userId: string): Promise<Assessment[]> {
    const { data, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("user_id", userId)
      .order("started_at", { ascending: false });

    if (error) throw error;
    return (data || []) as Assessment[];
  }

  /**
   * Submit an answer to an assessment question
   */
  static async submitAnswer(
    assessmentId: string,
    questionId: string,
    answer: Record<string, any>,
    score: number = 0
  ): Promise<AssessmentAnswer> {
    const { data, error } = await supabase
      .from("assessment_answers")
      .insert([
        {
          assessment_id: assessmentId,
          question_id: questionId,
          answer,
          score,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data as AssessmentAnswer;
  }

  /**
   * Update assessment status and progress
   */
  static async updateAssessmentProgress(
    assessmentId: string,
    progress: number,
    status: "STARTED" | "IN_PROGRESS" | "COMPLETED" = "IN_PROGRESS"
  ): Promise<Assessment> {
    const updatePayload: any = {
      progress,
      status,
    };
    if (status === "COMPLETED") {
      updatePayload.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from("assessments")
      .update(updatePayload)
      .eq("id", assessmentId)
      .select()
      .single();

    if (error) throw error;
    return data as Assessment;
  }

  /**
   * Save assessment final results
   */
  static async saveResult(result: Omit<AssessmentResult, "id" | "generated_at">): Promise<AssessmentResult> {
    const { data, error } = await supabase
      .from("assessment_results")
      .insert([
        {
          ...result,
          generated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Update profile score and completed flag
    await supabase
      .from("profiles")
      .update({
        human_value_score: result.overall_score,
        assessment_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", result.user_id);

    return data as AssessmentResult;
  }

  /**
   * Delete an assessment attempt
   */
  static async deleteAssessment(assessmentId: string): Promise<boolean> {
    const { error } = await supabase.from("assessments").delete().eq("id", assessmentId);
    if (error) throw error;
    return true;
  }
}
