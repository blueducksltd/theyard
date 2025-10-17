// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  const isAuthenticated = !!token;
  const isAuthPage = request.nextUrl.pathname.startsWith("/admin/auth");

  // Redirect to login if not authenticated and trying to access protected route
  if (!isAuthenticated && !isAuthPage) {
    const loginUrl = new URL("/admin/auth", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if authenticated and trying to access auth pages
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// Specify which routes to protect
export const config = {
  matcher: ["/admin/:path*"],
};
