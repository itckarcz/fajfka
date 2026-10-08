import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes – no auth required
const PUBLIC_PATHS = [
  "/prihlaseni",
  "/api/auth",
];

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;

  // Allow public paths and static assets
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js" ||
    pathname.match(/\.(png|ico|svg|jpg|jpeg|webp)$/)
  ) {
    return NextResponse.next();
  }

  const session = (req as { auth?: { user?: { id?: string } } }).auth;

  // Not logged in → redirect to login
  if (!session?.user) {
    return NextResponse.redirect(new URL("/prihlaseni", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
