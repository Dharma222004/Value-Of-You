import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  // Deprecated: Google OAuth callback is now handled at /auth/callback via Supabase
  return NextResponse.redirect(`${origin}/auth/callback`);
}
