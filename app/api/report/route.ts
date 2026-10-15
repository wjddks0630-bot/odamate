// POST /api/report — 목적·언어·원하는 내용을 받아 보고서 초안을 만들어 돌려준다. 로그인한 사람만 쓸 수 있다.
import { z } from "zod";
import { writeReport } from "@/lib/report-ai";
import { MAX_REPORT_CONTENT_CHARS, REPORT_LANGUAGES, REPORT_PURPOSES } from "@/lib/report-options";
import { isAuthenticated } from "@/lib/server/auth";
import { clientIp, takeRequest } from "@/lib/server/rate-limit";

const requestSchema = z.strictObject({
  purpose: z.enum(REPORT_PURPOSES.map((item) => item.code) as [string, ...string[]]),
  language: z.enum(REPORT_LANGUAGES.map((item) => item.code) as [string, ...string[]]),
  content: z.string().trim().min(1).max(MAX_REPORT_CONTENT_CHARS),
});

// 오류 응답은 고정된 코드만 돌려준다 (내부 오류 내용·사용자가 쓴 글은 담지 않는다).
const fail = (status: number, code: string) => Response.json({ error: { code } }, { status });

export async function POST(request: Request) {
  if (!isAuthenticated(request)) return fail(401, "unauthorized");
  // 같은 IP에서 10분에 20번까지
  if (!takeRequest("report", clientIp(request), 20, 10 * 60 * 1000)) return fail(429, "rate_limited");

  if (!request.headers.get("content-type")?.includes("application/json")) return fail(415, "unsupported_media_type");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "invalid_request");
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return fail(400, "invalid_request");

  try {
    const report = await writeReport(parsed.data as Parameters<typeof writeReport>[0]);
    return Response.json({ report }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    // 오류 객체에는 사용자가 쓴 글이 담길 수 있어, 종류만 기록한다.
    console.error("[report] 보고서 작성 실패:", error instanceof Error ? error.name : "unknown");
    return fail(502, "ai_failed");
  }
}
