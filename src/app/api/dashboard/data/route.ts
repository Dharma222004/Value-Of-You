import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getDashboardData } from "@/services/supabaseDashboardService";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get("userId");

    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id || null;
    }

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const data = await getDashboardData(userId);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
