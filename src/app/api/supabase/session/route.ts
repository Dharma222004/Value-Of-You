import { NextResponse } from "next/server";
import { getSupabaseSession, supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { session, user, error } = await getSupabaseSession();

    return NextResponse.json({
      success: true,
      connected: true,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "configured",
      authenticated: Boolean(session),
      session: session ? {
        access_token: session.access_token ? "present" : null,
        expires_at: session.expires_at,
        user: {
          id: user?.id,
          email: user?.email,
          role: user?.role,
        },
      } : null,
      error: error ? error.message : null,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        connected: false,
        error: err.message || "Failed to connect to Supabase",
      },
      { status: 500 }
    );
  }
}
