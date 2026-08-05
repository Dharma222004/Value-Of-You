import { NextResponse } from "next/server";
import { generateStructuredAiReport } from "@/services/aiPipelineService";

export async function POST() {
  try {
    console.log("[API /api/reports/evaluate] Triggering Groq AI Evaluation Engine...");
    const report = await generateStructuredAiReport();
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    console.error("[API /api/reports/evaluate] Evaluation error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate AI evaluation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("[API /api/reports/evaluate] Triggering Groq AI Evaluation Engine via GET...");
    const report = await generateStructuredAiReport();
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    console.error("[API /api/reports/evaluate] Evaluation error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate AI evaluation" },
      { status: 500 }
    );
  }
}
