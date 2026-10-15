// 접속 비밀번호 로그인. 틀린 시도는 같은 IP에서 10분에 5번까지만 받는다.
import { accessPassword, checkPassword, sessionCookie, sessionToken } from "@/lib/server/auth";
import { clientIp, isLoginBlocked, recordLoginFailure } from "@/lib/server/rate-limit";

// 오류 응답은 고정된 코드만 돌려준다.
const fail = (status: number, code: string) => Response.json({ error: { code } }, { status });

export async function POST(request: Request) {
  if (!accessPassword()) return fail(503, "not_configured");

  const ip = clientIp(request);
  if (isLoginBlocked(ip)) return fail(429, "rate_limited");

  let password: unknown;
  try {
    password = ((await request.json()) as { password?: unknown }).password;
  } catch {
    return fail(400, "invalid_request");
  }

  if (typeof password !== "string" || password.length > 200 || !checkPassword(password)) {
    recordLoginFailure(ip);
    return fail(401, "wrong_password");
  }

  return Response.json({ ok: true }, { headers: { "Set-Cookie": sessionCookie(sessionToken()!) } });
}
