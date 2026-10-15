// Design Ref: §3.2 unpdf — PDF의 글자와 쪽 수를 브라우저에서 읽는다.
import { MAX_PAGES } from "../limits";
import { TOO_MANY_PAGES } from "../messages";
import { ExtractError, type Extracted } from "./types";

export async function extractPdf(file: File): Promise<Extracted> {
  const { getDocumentProxy, extractText } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));

  // 글자를 뽑기 전에 쪽 수부터 확인해 큰 문서를 일찍 거른다.
  if (pdf.numPages > MAX_PAGES) throw new ExtractError(TOO_MANY_PAGES);

  const { totalPages, text } = await extractText(pdf, { mergePages: true });
  return { text, pages: totalPages };
}
