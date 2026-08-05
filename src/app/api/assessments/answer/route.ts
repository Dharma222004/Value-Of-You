import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { assessment_id, question_id, question, answer, time_taken } = body;

    if (!assessment_id || !question_id || !answer) {
      return NextResponse.json(
        { success: false, error: "assessment_id, question_id, and answer are required" },
        { status: 400 }
      );
    }

    // Verify assessment belongs to auth.uid()
    const { data: assessment } = await supabase
      .from("assessments")
      .select("id, user_id")
      .eq("id", assessment_id)
      .eq("user_id", user.id)
      .single();

    if (!assessment) {
      return NextResponse.json({ success: false, error: "Assessment attempt not found or unauthorized" }, { status: 404 });
    }

    const answerPayload = {
      assessment_id,
      question_id,
      question: question || `Question ${question_id}`,
      answer,
      time_taken: time_taken || null,
    };

    const { data: answerRecord, error } = await supabase
      .from("assessment_answers")
      .insert([answerPayload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Update assessment status to IN_PROGRESS
    await supabase.from("assessments").update({ status: "IN_PROGRESS" }).eq("id", assessment_id);

    return NextResponse.json({ success: true, answer: answerRecord });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
