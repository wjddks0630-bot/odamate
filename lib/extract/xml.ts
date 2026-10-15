// docx·hwpx 공통: 압축 파일(zip) 안의 XML에서 글자 조각(<w:t>, <hp:t>)을 문단별로 모은다.

// 글자를 담는 요소 이름(t)을 문단 요소 이름(p)별로 묶어 줄바꿈으로 잇는다.
export function collectParagraphText(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.getElementsByTagName("parsererror").length > 0) return "";

  const lines: string[] = [];
  let currentParagraph: Element | null = null;

  for (const el of Array.from(doc.getElementsByTagName("*"))) {
    if (el.localName !== "t") continue;

    // 표 안의 문단이 바깥 문단에 중복되어 세어지지 않도록 가장 가까운 문단만 기준으로 삼는다.
    let paragraph: Element | null = el.parentElement;
    while (paragraph && paragraph.localName !== "p") paragraph = paragraph.parentElement;

    if (paragraph !== currentParagraph || lines.length === 0) {
      lines.push("");
      currentParagraph = paragraph;
    }
    lines[lines.length - 1] += el.textContent ?? "";
  }

  return lines.join("\n");
}
