// Design Ref: §3.2 mammoth — Word(.docx)에서 글자만 브라우저에서 꺼낸다.
import { CHARS_PER_PAGE } from "../limits";
import type { Extracted } from "./types";

export async function extractDocx(file: File): Promise<Extracted> {
  const mammoth = await import("mammoth/mammoth.browser");
  const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });

  // 쪽 수는 글자 수로 근사한다.
  return { text: value, pages: Math.ceil(value.length / CHARS_PER_PAGE) };
}
