import { NextRequest, NextResponse } from "next/server";

import { Routes } from "@src/constants";
import { CookiesKeys } from "@utils";

// 1. Specify protected and public routes
const protectedRoutes = [Routes.setting.default];
const publicRoutes = [Routes.auth.signin, Routes.home.default];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const accessToken = req.cookies.get(CookiesKeys.access_token)?.value;

  // 4. Redirect to /login if the user is not authenticated
  if (
    isProtectedRoute &&
    (accessToken === undefined || accessToken.trim() === "")
  ) {
    return NextResponse.redirect(new URL(Routes.auth.signin, req.nextUrl));
  }

  if (isPublicRoute && !!accessToken && path == Routes.auth.signin) {
    return NextResponse.redirect(new URL(Routes.home.default, req.nextUrl));
  }
  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
