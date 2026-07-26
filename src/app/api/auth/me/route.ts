import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/hc_auth_token=([^;]+)/);

  if (!tokenMatch) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: "usr_active",
      email: "user@humancapital.ai",
      name: "Authenticated User",
      provider: "session_cookie",
    },
  });
}
