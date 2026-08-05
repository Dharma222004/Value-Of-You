import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Redirect to client-side callback page where code exchange is performed ONCE
  if (error) {
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(errorDescription || error)}`);
  }

  if (code) {
    return NextResponse.redirect(`${origin}/auth/callback?code=${encodeURIComponent(code)}`);
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
