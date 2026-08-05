import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (sessionErr || !user) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      // Return structured profile from user metadata if table record pending
      return NextResponse.json({
        success: true,
        profile: {
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0],
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          phone: user.phone || null,
          language: "English",
          theme: "dark",
          created_at: user.created_at,
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json();

    if ("email" in body || "id" in body) {
      return NextResponse.json(
        { success: false, error: "Email and User ID cannot be edited." },
        { status: 400 }
      );
    }

    const updatePayload = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
