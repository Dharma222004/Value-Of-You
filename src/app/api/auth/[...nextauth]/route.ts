import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Legacy NextAuth-style endpoint.
 *
 * SECURITY: The previous POST handler was a MOCK that accepted ANY email +
 * password and returned `{ success: true, token: "jwt_token_<ts>" }`. That is a
 * complete authentication bypass — any caller could obtain a "valid" success
 * response and a fabricated token without credentials being verified against
 * any store. Authentication is now handled exclusively by Supabase Auth on the
 * client (email/password + Google OAuth). This route no longer issues tokens.
 *
 * The GET handler is retained as a harmless capability probe (no secrets).
 */
export async function GET() {
  return NextResponse.json({
    name: "Human Capital Auth Engine",
    status: "online",
    version: "2.0.0",
    provider: "supabase",
    googleClientIdConfigured: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });
}

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        "This endpoint is disabled. Authenticate via Supabase Auth (email/password or Google OAuth).",
    },
    { status: 410 }
  );
}
