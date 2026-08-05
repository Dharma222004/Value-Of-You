import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { logSupabaseActivity } from "@/services/supabaseActivityService";
import { EventType } from "@/types/telemetry";

export async function POST(request: Request) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { event, page, metadata } = body;

    if (!event) {
      return NextResponse.json({ success: false, error: "Event name is required" }, { status: 400 });
    }

    const activity = await logSupabaseActivity(event as EventType, metadata, page);

    return NextResponse.json({ success: true, activity });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
