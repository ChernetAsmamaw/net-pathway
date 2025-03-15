import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("token")?.value || getTokenFromHeader(request);
  const path = request.nextUrl.pathname;

  // Check if the route is an auth route
  const isAuthRoute = path.startsWith("/auth");

  // Check if the route is a protected route
  const isProtectedRoute =
    !isAuthRoute &&
    !path.startsWith("/api") &&
    !path.startsWith("/_next") &&
    path !== "/" &&
    !path.startsWith("/about") &&
    !path.startsWith("/services") &&
    !path.startsWith("/contact") &&
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

// Helper function to extract token from authorization header
function getTokenFromHeader(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}
export const config = {
  matcher: [
    // Match all paths except static files, api routes, etc.
    "/((?!_next/static|_next/image|favicon.ico|logo|assets).*)",
  ],
};
