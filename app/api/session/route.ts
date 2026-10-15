// 로그인 상태 확인(GET)과 로그아웃(DELETE).
import { accessPassword, clearedSessionCookie, isAuthenticated } from "@/lib/server/auth";

export async function GET(request: Request) {
  return Response.json(
    { configured: accessPassword() !== undefined, authenticated: isAuthenticated(request) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function DELETE() {
  return Response.json({ ok: true }, { headers: { "Set-Cookie": clearedSessionCookie() } });
}
