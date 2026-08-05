import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { logSupabaseActivity } from "@/services/supabaseActivityService";

export async function POST(request: Request) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { assessment_id, score, duration } = body;

    if (!assessment_id || score === undefined) {
      return NextResponse.json({ success: false, error: "assessment_id and score are required" }, { status: 400 });
    }

    const now = new Date().toISOString();

    const { data: updatedAssessment, error } = await supabase
      .from("assessments")
      .update({
        score,
        duration: duration || null,
        completed_at: now,
        status: "COMPLETED",
        updated_at: now,
      })
      .eq("id", assessment_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error || !updatedAssessment) {
      return NextResponse.json({ success: false, error: error?.message || "Assessment not found" }, { status: 400 });
    }

    // Update progress to 100% completed
    await supabase.from("progress").upsert(
      {
        user_id: user.id,
        module: updatedAssessment.module,
        completion_percentage: 100.0,
        current_question: 100,
        status: "COMPLETED",
        updated_at: now,
      },
      { onConflict: "user_id,module" }
    );

    // Log completion activity
    await logSupabaseActivity("assessment_completed", {
      module: updatedAssessment.module,
      score: updatedAssessment.score,
      duration: updatedAssessment.duration,
      attempt: updatedAssessment.attempt,
    });

    return NextResponse.json({ success: true, assessment: updatedAssessment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
