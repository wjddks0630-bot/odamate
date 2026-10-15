// Design Ref: §3.2 jszip + DOMParser — .hwpx는 압축 파일이라 먼저 풀고 본문 XML에서 글자를 읽는다.
import { CHARS_PER_PAGE } from "../limits";
import type { Extracted } from "./types";
import { collectParagraphText } from "./xml";

export async function extractHwpx(file: File): Promise<Extracted> {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(await file.arrayBuffer());

  // 본문은 Contents/section0.xml, section1.xml … 에 들어 있다. 번호 순서대로 읽는다.
  const sections = Object.keys(zip.files)
    .map((name) => ({ name, match: /^Contents\/section(\d+)\.xml$/i.exec(name) }))
    .filter((entry) => entry.match)
    .sort((a, b) => Number(a.match![1]) - Number(b.match![1]));

  const parts: string[] = [];
  for (const { name } of sections) {
    parts.push(collectParagraphText(await zip.files[name].async("string")));
  }

  const text = parts.join("\n");
  // 쪽 수는 글자 수로 근사한다.
  return { text, pages: Math.ceil(text.length / CHARS_PER_PAGE) };
}
