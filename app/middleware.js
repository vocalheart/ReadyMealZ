// middleware.js (Next.js)
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token");
  if (!token && req.nextUrl.pathname.startsWith("/menu")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}