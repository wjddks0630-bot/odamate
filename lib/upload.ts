// Design Ref: §2.1 문서 올리기 — 파일 하나를 검사하고 글자를 뽑아 성공·실패 결과로 돌려준다.
// Plan SC: 일부 파일만 실패해도 성공한 파일은 그대로 두고, 실패한 파일만 이름과 이유를 알린다.
import { extractDocument, ExtractError } from "./extract";
import { MAX_FILES, MAX_TOTAL_CHARS } from "./limits";
import { TOO_MANY_CHARS, TOO_MANY_FILES, UNREADABLE } from "./messages";
import type { UploadedDoc } from "./types";
import { checkFile } from "./validate";

function fail(name: string, reason: string): UploadedDoc {
  return { id: crypto.randomUUID(), name, status: "error", reason };
}

// current: 지금까지 성공한 문서들 (개수·글자 수 합계 검사에 쓴다)
export async function processFile(file: File, current: UploadedDoc[]): Promise<UploadedDoc> {
  const okDocs = current.filter((doc) => doc.status === "ok");

  if (okDocs.length >= MAX_FILES) return fail(file.name, TOO_MANY_FILES);

  const check = checkFile(file);
  if (!check.ok) return fail(file.name, check.reason);

  try {
    const { text, pages } = await extractDocument(file, check.extension);

    const totalChars = okDocs.reduce((sum, doc) => sum + doc.text.length, 0);
    if (totalChars + text.length > MAX_TOTAL_CHARS) return fail(file.name, TOO_MANY_CHARS);

    return { id: crypto.randomUUID(), name: file.name, status: "ok", text, pages };
  } catch (error) {
    return fail(file.name, error instanceof ExtractError ? error.message : UNREADABLE);
  }
}
