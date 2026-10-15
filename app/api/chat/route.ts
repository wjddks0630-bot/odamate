// Design Ref: §2.4 POST /api/chat — 질문과 문서 글자를 받아 답변·출처를 돌려준다.
// Design Ref: §2.2 ③ 서버가 다시 검사한다 (브라우저 검사는 우회할 수 있기 때문).
import { z } from "zod";
import { answerQuestion } from "@/lib/ai";
import {
  MAX_DOC_NAME_CHARS,
  MAX_FILES,
  MAX_QUESTION_CHARS,
  MAX_TOTAL_CHARS,
} from "@/lib/limits";
import { AI_ERROR } from "@/lib/messages";
import { isAuthenticated } from "@/lib/server/auth";

const requestSchema = z.strictObject({
  question: z.string().trim().min(1).max(MAX_QUESTION_CHARS),
  documents: z
    .array(
      z.strictObject({
        name: z.string().min(1).max(MAX_DOC_NAME_CHARS),
        text: z.string().min(1).max(MAX_TOTAL_CHARS),
      }),
    )
    .min(1),
  // 문서 한 개를 요약할 때 그 문서의 이름 (올린 문서 중에 있어야 한다)
  summarize: z.string().min(1).max(MAX_DOC_NAME_CHARS).optional(),
});

// 오류 응답은 고정 문구와 코드만 돌려준다 (내부 오류 내용·문서 글자는 담지 않는다).
function errorResponse(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function POST(request: Request) {
  // 로그인하지 않은 사람은 AI를 쓸 수 없다 (주소를 아는 누구나 비용을 쓰는 것을 막는다).
  if (!isAuthenticated(request)) {
    return errorResponse(401, "unauthorized", "접속이 끊겼습니다. 비밀번호를 다시 입력해 주세요");
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return errorResponse(415, "unsupported_media_type", "요청 형식이 올바르지 않습니다");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "invalid_request", "요청 형식이 올바르지 않습니다");
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(400, "invalid_request", "질문과 문서를 확인해 주세요");
  }

  const { question, documents, summarize } = parsed.data;
  if (summarize !== undefined && !documents.some((doc) => doc.name === summarize)) {
    return errorResponse(400, "invalid_request", "요약할 문서를 확인해 주세요");
  }
  const totalChars = documents.reduce((sum, doc) => sum + doc.text.length, 0);
  if (documents.length > MAX_FILES || totalChars > MAX_TOTAL_CHARS) {
    return errorResponse(413, "too_large", "문서가 너무 많거나 글자 수가 너무 많습니다");
  }

  try {
    return Response.json(await answerQuestion(question, documents, summarize));
  } catch (error) {
    // 오류 객체 전체에는 문서 글자가 담길 수 있어, 종류만 기록한다.
    console.error("[chat] 답변 생성 실패:", error instanceof Error ? error.name : "unknown");
    return errorResponse(502, "ai_failed", AI_ERROR);
  }
}
