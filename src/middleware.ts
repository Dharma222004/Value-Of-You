import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Inspect Supabase auth token cookies across standard cookie names
  const allCookies = request.cookies.getAll();
  const supabaseAuthCookie = allCookies.find((c) =>
    c.name.includes("auth-token") ||
    c.name.includes("access-token") ||
    (c.name.startsWith("sb-") && c.value.length > 10)
  );

  const isAuthenticated = Boolean(supabaseAuthCookie && supabaseAuthCookie.value.length > 10);

  // Protected Dashboard Routes
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protected Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
