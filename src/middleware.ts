import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/login",
  "/admin/login",
  "/api/admin/refresh",
  "/api/admin/login",
  "/api/admin/logout",
  "/api/auth",
  "/api/checkout",
  "/api/webhooks",
  "/api/coupons",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Admin routes — token cookie auth
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const cookie = request.cookies.get("admin_token");
    if (!cookie?.value) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Customer routes — NextAuth JWT session
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/api/agents") ||
    pathname.startsWith("/api/billing")
  ) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
    });
    if (!token) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      // Redirect to sign-in; after auth, come back to original page
      const signInUrl = new URL("/api/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/login",
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/api/agents/:path*",
    "/api/billing/:path*",
  ],
};
