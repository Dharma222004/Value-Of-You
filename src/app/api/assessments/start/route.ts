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
    const { module } = body;

    if (!module) {
      return NextResponse.json({ success: false, error: "Module name is required" }, { status: 400 });
    }

    // Calculate next attempt count from Supabase assessments table for this user
    const { data: existingAttempts } = await supabase
      .from("assessments")
      .select("id")
      .eq("user_id", user.id)
      .eq("module", module);

    const attemptNumber = (existingAttempts?.length || 0) + 1;

    const assessmentPayload = {
      user_id: user.id,
      module,
      attempt: attemptNumber,
      status: "STARTED",
      started_at: new Date().toISOString(),
    };

    const { data: assessment, error } = await supabase
      .from("assessments")
      .insert([assessmentPayload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Upsert module progress
    await supabase.from("progress").upsert(
      {
        user_id: user.id,
        module,
        completion_percentage: 0.0,
        current_question: 1,
        status: "IN_PROGRESS",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,module" }
    );

    // Log telemetry event
    await logSupabaseActivity("assessment_started", {
      module,
      attempt: attemptNumber,
      assessment_id: assessment.id,
    });

    return NextResponse.json({ success: true, assessment });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
