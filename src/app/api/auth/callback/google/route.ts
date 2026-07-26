import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/auth/login?error=Google login was cancelled or failed.`);
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    const redirectUri = `${origin}/api/auth/callback/google`;

    // Exchange authorization code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Google token exchange error:", tokenData);
      return NextResponse.redirect(`${origin}/auth/login?error=Failed to exchange code with Google.`);
    }

    // Fetch user profile info from Google UserInfo endpoint
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!userResponse.ok || !googleUser.email) {
      return NextResponse.redirect(`${origin}/auth/login?error=Failed to fetch profile from Google.`);
    }

    // Create session cookie
    const token = `jwt_goog_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    const userPayload = {
      id: googleUser.id,
      name: googleUser.name || googleUser.email.split("@")[0],
      email: googleUser.email,
      image: googleUser.picture,
      provider: "google",
      emailVerified: true,
    };

    const response = NextResponse.redirect(`${origin}/auth/complete-profile?oauth=google&name=${encodeURIComponent(userPayload.name)}&email=${encodeURIComponent(userPayload.email)}`);

    // Attach secure cookie
    response.cookies.set({
      name: "hc_auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      sameSite: "lax",
    });

    return response;
  } catch (err: any) {
    console.error("OAuth callback processing exception:", err);
    return NextResponse.redirect(`${origin}/auth/login?error=Authentication server exception occurred.`);
  }
}
