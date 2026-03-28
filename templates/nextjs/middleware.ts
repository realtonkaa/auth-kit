// AUTH-KIT TEMPLATE: Next.js Auth Middleware
// Target: src/middleware.ts (or middleware.ts at project root)
// Requires: npm install better-auth

import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Paths that require an authenticated session. Any request whose pathname
// starts with one of these prefixes will be checked for a valid session
// cookie. Unauthenticated visitors are redirected to /login.
// ---------------------------------------------------------------------------
const PROTECTED_PREFIXES = ["/dashboard", "/settings", "/account"];

// ---------------------------------------------------------------------------
// Public paths that should never be blocked by auth middleware even if they
// match a protected prefix (e.g. /api/auth/* must remain accessible).
// ---------------------------------------------------------------------------
const PUBLIC_PREFIXES = ["/api/auth"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public paths through.
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Only gate protected paths.
  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  // -----------------------------------------------------------------------
  // Check for the Better Auth session cookie. The default cookie name used
  // by Better Auth is "better-auth.session_token". If you customised the
  // cookie name in your auth config, update this value accordingly.
  // -----------------------------------------------------------------------
  // Check both prefixed (HTTPS) and unprefixed cookie names.
  const sessionToken =
    request.cookies.get("__Secure-better-auth.session_token") ||
    request.cookies.get("better-auth.session_token");

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the originally requested URL so we can redirect back after
    // a successful login.
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If a session cookie exists, let the request through. The actual session
  // validation (expiry, revocation, etc.) is handled by Better Auth on the
  // server side when the page or API route calls auth.api.getSession().
  return NextResponse.next();
}

// ---------------------------------------------------------------------------
// Next.js matcher configuration. Only run this middleware on paths that could
// be protected. Static assets and internal Next.js routes are excluded.
// ---------------------------------------------------------------------------
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/account/:path*",
  ],
};
