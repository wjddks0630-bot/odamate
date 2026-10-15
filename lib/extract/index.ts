// Design Ref: §2.1 ②③ 글자 뽑기와 내용 검사 — 형식별 도구를 고르고, 쪽 수·빈 문서를 거른다.
import type { AllowedExtension } from "../limits";
import { MAX_PAGES } from "../limits";
import { TOO_MANY_PAGES, UNREADABLE } from "../messages";
import { extractDocx } from "./docx";
import { extractHwpx } from "./hwpx";
import { extractPdf } from "./pdf";
import { ExtractError, type Extracted } from "./types";

export { ExtractError } from "./types";

const extractors: Record<AllowedExtension, (file: File) => Promise<Extracted>> = {
  ".pdf": extractPdf,
  ".docx": extractDocx,
  ".hwpx": extractHwpx,
};

export async function extractDocument(file: File, extension: AllowedExtension): Promise<Extracted> {
  let result: Extracted;
  try {
    result = await extractors[extension](file);
  } catch (error) {
    if (error instanceof ExtractError) throw error;
    // 암호가 걸렸거나 깨진 파일 등 — 내부 오류 내용은 보여주지 않는다.
    throw new ExtractError(UNREADABLE);
  }

  // 스캔 이미지처럼 글자가 하나도 없는 문서
  if (result.text.trim().length === 0) throw new ExtractError(UNREADABLE);
  if (result.pages > MAX_PAGES) throw new ExtractError(TOO_MANY_PAGES);

  return result;
}
