// 틀린 비밀번호를 계속 넣어 보는 시도를 막는다 (서버 전용). 같은 IP에서 10분에 5번까지만 받는다.
// 한계: 메모리에만 기록하므로 서버가 다시 시작되거나 여러 대로 나뉘면 기록이 초기화된다.

const registry = globalThis as unknown as { __loginFailures?: Map<string, number[]> };

const MAX_FAILURES = 5;
const WINDOW_MS = 10 * 60 * 1000;

function recent(ip: string): number[] {
  registry.__loginFailures ??= new Map();
  const now = Date.now();
  const list = (registry.__loginFailures.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  registry.__loginFailures.set(ip, list);
  return list;
}

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function isLoginBlocked(ip: string): boolean {
  return recent(ip).length >= MAX_FAILURES;
}

export function recordLoginFailure(ip: string): void {
  recent(ip).push(Date.now());
}
