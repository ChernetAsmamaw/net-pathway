import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const path = request.nextUrl.pathname;

  // Check if the route is an auth route
  const isAuthRoute = path.startsWith("/auth");

  // Check if the route is a protected route
  // All routes that aren't /auth/* or explicitly public are protected
  const isProtectedRoute =
    !isAuthRoute &&
    !path.startsWith("/api") &&
    !path.startsWith("/_next") &&
    path !== "/" &&
    !path.match(/\.(ico|png|jpg|jpeg|svg|css|js)$/);

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect to dashboard if accessing auth routes with valid token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, api routes, etc.
    "/((?!_next/static|_next/image|favicon.ico|logo|assets).*)",
  ],
};
