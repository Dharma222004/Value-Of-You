/**
 * AI Analysis Report History — Server-Side API Route
 *
 * GET /api/ai-analysis/reports
 *
 * Returns the authenticated user's AI analysis report history.
 * Respects Supabase RLS — users can only see their own reports.
 * Fast local JWT authentication (< 1ms).
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function createAuthenticatedClient(accessToken: string) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "placeholder-anon-key";

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

function parseJwtUserId(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    const payload = JSON.parse(jsonPayload);
    return payload.sub || payload.user_id || payload.id || null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  try {
    // Authenticate
    const authHeader = request.headers.get("Authorization");
    const accessToken = authHeader?.replace("Bearer ", "");

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized", reports: [] },
        { status: 401 }
      );
    }

    // Verified-first identity: signature-checked getUser() before local decode
    // so a forged token cannot select another user's report rows. RLS backstops.
    let userId: string | null = null;
    const supabase = createAuthenticatedClient(accessToken);
    try {
      const { data: userData } = await supabase.auth.getUser(accessToken);
      if (userData?.user?.id) userId = userData.user.id;
    } catch {}
    if (!userId) userId = parseJwtUserId(accessToken);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Invalid session", reports: [] },
        { status: 401 }
      );
    }

    // Parse query params for pagination
    const { searchParams } = new URL(request.url);
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10", 10));
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Fetch AI report from module_data (module_key = 'ai_report')
    let reportsList: any[] = [];
    try {
      const { data: row, error } = await supabase
        .from("module_data")
        .select("*")
        .eq("user_id", userId)
        .eq("module_key", "ai_report")
        .maybeSingle();

      if (!error && row?.data) {
        // Extract summary fields from the stored report record
        const r = row.data;
        reportsList = [{
          id: row.id,
          user_id: r.user_id || userId,
          executive_summary: r.executive_summary,
          overall_score: r.overall_score,
          scores_json: r.scores_json,
          model_name: r.model_name,
          report_version: r.report_version,
          data_hash: r.data_hash,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }];
      }
    } catch {}

    return NextResponse.json({
      success: true,
      reports: reportsList,
    });
  } catch (err: any) {
    console.error("[AI Reports API] Unhandled error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred", reports: [] },
      { status: 500 }
    );
  }
}
