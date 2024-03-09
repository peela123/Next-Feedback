import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("cmu-oauth-example-token"); // Example: Replace 'authToken' with your actual cookie/session key

  // List of paths that require authentication
  const protectedPaths = [
    "/Analyze",
    "/UploadFile",
    "/me",
    "/cmuOAuthCallback",
  ];

  const url = request.nextUrl.clone(); // Clone the URL object to modify it

  // Check if the current path is protected and if the authToken (or cmuAccount) is not present
  if (
    protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path)) &&
    !authToken
  ) {
    url.pathname = "/"; // Redirect to home if not authenticated
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/Analyze/:path*",
    "/UploadFile/:path*",
    "/me/:path*",
    // "/cmuOAuthCallback/:path*",
  ], // Adjust this if you have more specific path requirements
};
