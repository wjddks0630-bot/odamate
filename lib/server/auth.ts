// 접속 비밀번호 확인 (서버 전용). 비밀번호는 .env의 ACCESS_PASSWORD에서 읽고, 브라우저에는 나가지 않는다.
// 로그인에 성공하면 비밀번호에서 만든 서명 값을 HttpOnly 쿠키로 준다. 비밀번호를 바꾸면 기존 로그인은 모두 끊긴다.
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "intern_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7일

export function accessPassword(): string | undefined {
  const password = process.env.ACCESS_PASSWORD;
  return password && password.length > 0 ? password : undefined;
}

function digest(key: string, message: string): Buffer {
  return createHmac("sha256", key).update(message).digest();
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

// 입력한 비밀번호가 맞는지 (길이·시간 차이로 알아내지 못하게 해시끼리 비교한다)
export function checkPassword(input: string): boolean {
  const password = accessPassword();
  if (!password) return false;
  return safeEqual(digest("compare", input), digest("compare", password));
}

export function sessionToken(): string | undefined {
  const password = accessPassword();
  return password ? digest(password, "intern-helper-session-v1").toString("hex") : undefined;
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return undefined;
}

// 요청에 올바른 로그인 쿠키가 있는지. 비밀번호가 설정되지 않았으면 아무도 통과하지 못한다.
export function isAuthenticated(request: Request): boolean {
  const expected = sessionToken();
  const given = readCookie(request, SESSION_COOKIE);
  if (!expected || !given) return false;
  return safeEqual(Buffer.from(given), Buffer.from(expected));
}

export function sessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secure}`;
}

export function clearedSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}
