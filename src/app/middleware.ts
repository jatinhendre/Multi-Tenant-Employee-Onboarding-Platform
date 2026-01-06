import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Agar token nahi hai aur protected page hai -> Login bhejo
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/my-tasks')) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}