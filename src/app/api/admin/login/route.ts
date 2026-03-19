import { NextResponse, type NextRequest } from "next/server";
import { verifyToken, hashToken, checkRateLimit } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }
  const { password } = await request.json();
  if (!password || !verifyToken(password)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_token", hashToken(password), {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "strict", maxAge: 60 * 60 * 24, path: "/admin",
  });
  return response;
}
