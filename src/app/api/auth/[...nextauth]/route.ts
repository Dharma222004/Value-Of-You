import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    name: "Human Capital Auth Engine",
    status: "online",
    version: "2.0.0",
    supportedProviders: ["credentials", "google", "github", "microsoft", "apple"],
    googleClientIdConfigured: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password } = body;

    if (action === "login") {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: `usr_${Date.now()}`,
          email,
          name: email.split("@")[0],
          provider: "credentials",
        },
        token: `jwt_token_${Date.now()}`,
      });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server Error" }, { status: 500 });
  }
}
