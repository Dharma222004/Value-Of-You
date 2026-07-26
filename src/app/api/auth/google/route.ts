import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "513524891808-e7c6ue20s6fpb5hc8smp3r91kc8lsbch.apps.googleusercontent.com";
  
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/callback/google`;
  const scope = encodeURIComponent("openid profile email");
  const state = Math.random().toString(36).substring(7);

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&state=${state}&prompt=select_account&access_type=offline`;

  return NextResponse.redirect(googleAuthUrl);
}
