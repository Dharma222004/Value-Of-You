import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Decode a JWT payload without verifying the signature.
 * Used ONLY for cheap, non-authoritative checks in middleware (expiry, role
 * hint). Middleware runs on the edge and cannot perform a network call to
 * Supabase on every request, so the REAL authorization decision is enforced
 * server-side in each route handler / RLS. This guard just avoids serving the
 * protected shell to obviously-unauthenticated or expired requests.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getAccessToken(request: NextRequest): string | null {
  // App-set cookie
  const direct = request.cookies.get("sb-auth-token")?.value;
  if (direct) return direct;

  // Supabase's own cookie: sb-<ref>-auth-token (may be JSON-encoded array)
  const sbCookie = request.cookies
    .getAll()
    .find((c) => /^sb-.*-auth-token$/.test(c.name));
  if (sbCookie?.value) {
    try {
      const parsed = JSON.parse(sbCookie.value);
      if (Array.isArray(parsed) && typeof parsed[0] === "string") return parsed[0];
      if (parsed?.access_token) return parsed.access_token;
    } catch {
      return sbCookie.value;
    }
    return sbCookie.value;
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = getAccessToken(request);
  const payload = token ? decodeJwtPayload(token) : null;

  // Treat as authenticated only if we have a JWT that has not expired.
  const nowSec = Math.floor(Date.now() / 1000);
  const isAuthenticated = Boolean(payload && (!payload.exp || payload.exp > nowSec));

  const redirectToLogin = () => {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  };

  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) return redirectToLogin();
  }

  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) return redirectToLogin();
    // Role hint only — authoritative admin check is enforced in the
    // /api/admin/* route handlers via a validated token + role lookup.
    const roleHint = payload?.app_metadata?.role || payload?.role;
    if (roleHint && roleHint !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
