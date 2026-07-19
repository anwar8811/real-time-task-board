import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard"];
const authOnlyRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = request.cookies.has("accessToken");

  if (protectedRoutes.includes(pathname) && !hasAccessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (authOnlyRoutes.includes(pathname) && hasAccessToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login", "/register"],
};
