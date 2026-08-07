import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Platform-wide analytics for the admin dashboard.
// PROTECTED: only an authenticated ADMIN may read these metrics.
export async function GET(request: Request) {
  try {
    // 1) Extract the Supabase access token from cookies. The SPA sets
    //    `sb-auth-token` (non-HttpOnly); Supabase also writes its own
    //    `sb-*-auth-token` cookies. Read the raw JWT and validate it
    //    against Supabase auth so a tampered/expired cookie is rejected.
    const cookies = request.headers.get("cookie") || "";
    const cookieNames = ["sb-auth-token", "sb-access-token"];
    let accessToken: string | null = null;

    for (const name of cookieNames) {
      const m = cookies.match(new RegExp(`(?:^|;)\\s*${name}=([^;]+)`));
      if (m) {
        accessToken = decodeURIComponent(m[1]);
        break;
      }
    }

    // Supabase's own auth cookie name has the form: sb-<ref>-auth-token
    if (!accessToken) {
      const sbCookie = cookies.match(/sb-[a-z0-9]+-auth-token=([^;]+)/);
      if (sbCookie) accessToken = decodeURIComponent(sbCookie[1]);
    }

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized — a valid session is required." },
        { status: 401 }
      );
    }

    // 2) Validate the token server-side (signature + expiry) and resolve
    //    the user. A forged or expired token fails here.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "";
    const sb = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
    });

    const {
      data: { user },
      error: userError,
    } = await sb.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized — session is invalid or expired." },
        { status: 401 }
      );
    }

    // 3) Verify the caller is an admin. Prefers the profiles.role column
    //    (when present), falls back to app_metadata.role so the check is
    //    not dependent on a column that may not exist in older schemas.
    let isAdmin = user.app_metadata?.role === "ADMIN";
    if (!isAdmin) {
      const { data: profile } = await sb
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      isAdmin = profile?.role === "ADMIN";
    }

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden — admin privileges required." },
        { status: 403 }
      );
    }

    const { AdminAnalyticsService } = await import("@/services/adminAnalyticsService");
    const metrics = await AdminAnalyticsService.getAnalyticsMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    console.error("[AdminAnalytics] Failed to fetch metrics:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load analytics. Please try again." },
      { status: 500 }
    );
  }
}
