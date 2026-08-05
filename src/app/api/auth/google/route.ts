import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  // Deprecated: Google OAuth is now handled via Supabase Auth client
  return NextResponse.redirect(`${origin}/auth/login`);
}
