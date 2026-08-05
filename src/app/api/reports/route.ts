import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { logSupabaseActivity } from "@/services/supabaseActivityService";

export async function GET() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: reports, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("generated_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, reports: reports || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { overallScore, pdfUrl, version } = body;

    if (overallScore === undefined) {
      return NextResponse.json({ success: false, error: "overallScore is required" }, { status: 400 });
    }

    const reportPayload = {
      user_id: user.id,
      overall_score: overallScore,
      pdf_url: pdfUrl || `/reports/report-${user.id}-${Date.now()}.pdf`,
      version: version || "1.0",
      generated_at: new Date().toISOString(),
    };

    const { data: report, error } = await supabase
      .from("reports")
      .insert([reportPayload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // Track report download event in activities
    await logSupabaseActivity("report_downloaded", {
      reportId: report.id,
      score: overallScore,
    });

    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
