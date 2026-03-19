import { NextResponse, type NextRequest } from "next/server";
import { verifyRefreshToken } from "@/lib/admin/auth";
import { refreshAll } from "@/lib/admin/refresh";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("Authorization");
  const token = auth?.replace("Bearer ", "");
  if (!token || !verifyRefreshToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await refreshAll();
    return NextResponse.json({ status: "ok", errors: result.errors, timestamp: new Date().toISOString() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
