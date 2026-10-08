import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes – no session required
const PUBLIC_PATHS = ["/prihlaseni", "/api/auth", "/api/dev-login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths, API routes, and static assets
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js" ||
    pathname.match(/\.(png|ico|svg|jpg|jpeg|webp)$/)
  ) {
    return NextResponse.next();
  }

  // Check for Auth.js session cookie (HTTP dev or HTTPS prod)
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/prihlaseni", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
