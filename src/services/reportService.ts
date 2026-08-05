import { supabase } from "@/lib/supabase";

export class ReportService {
  /**
   * Save generated report entry in Supabase reports table
   */
  static async saveReport(userId: string, overallScore: number, pdfUrl?: string, version: string = "1.0") {
    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          user_id: userId,
          overall_score: overallScore,
          pdf_url: pdfUrl || `/reports/report-${userId}-${Date.now()}.pdf`,
          version,
          generated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Fetch user reports filtered by auth.uid()
   */
  static async getUserReports(userId: string) {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", userId)
      .order("generated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
