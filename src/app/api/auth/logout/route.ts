import { NextResponse } from "next/server";
import { ActivityService } from "@/services/activityService";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { sessionId } = body;

    if (sessionId) {
      await ActivityService.endSession(sessionId);
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    response.cookies.set("hc_auth_token", "", { maxAge: 0, path: "/" });
    response.cookies.set("hc_user_session", "", { maxAge: 0, path: "/" });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
