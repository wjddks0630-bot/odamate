// 만들어진 보고서를 파일로 저장한다 (브라우저 안에서만 만들어지고 서버로 가지 않는다).
// Word(.docx): 문서를 압축 파일(zip)로 묶는 형식이라 jszip으로 만든다. 텍스트(.txt): UTF-8 글자 파일.
import type { ReportLanguage } from "./report-options";

// Word가 쓰는 언어 표시 (동아시아 글자의 글꼴·줄바꿈 규칙을 알맞게 고르는 데 쓰인다)
const WORD_LANG: Record<ReportLanguage, { latin: string; eastAsia: string }> = {
  ko: { latin: "ko-KR", eastAsia: "ko-KR" },
  en: { latin: "en-US", eastAsia: "ko-KR" },
  zh: { latin: "zh-CN", eastAsia: "zh-CN" },
  ja: { latin: "ja-JP", eastAsia: "ja-JP" },
};

// XML에 넣을 수 없는 제어 문자를 지우고 특수문자를 바꾼다.
function escapeXml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function buildDocxParagraphs(text: string, language: ReportLanguage): string {
  const lang = WORD_LANG[language];
  const langXml = `<w:lang w:val="${lang.latin}" w:eastAsia="${lang.eastAsia}"/>`;
  const lines = text.replace(/\r\n?/g, "\n").split("\n");

  // 첫 줄(제목)은 굵고 크게, 나머지는 보통 글자로 한 줄이 한 문단이 되게 한다.
  const firstContent = lines.findIndex((line) => line.trim() !== "");
  return lines
    .map((line, index) => {
      const isTitle = index === firstContent;
      const props = `<w:rPr>${isTitle ? "<w:b/>" : ""}${langXml}${isTitle ? '<w:sz w:val="32"/>' : ""}</w:rPr>`;
      const spacing = `<w:pPr><w:spacing w:after="${isTitle ? 240 : 80}"/></w:pPr>`;
      if (line.trim() === "") return `<w:p>${spacing}</w:p>`;
      return `<w:p>${spacing}<w:r>${props}<w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`;
    })
    .join("");
}

export async function buildDocx(text: string, language: ReportLanguage): Promise<Blob> {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  // 압축 파일 안에 폴더 항목을 따로 만들지 않는다 (Word가 인식하는 부품만 담는다).
  const add = (name: string, content: string) => zip.file(name, content, { createFolders: false });
  add(
    "[Content_Types].xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`,
  );
  add(
    "_rels/.rels",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`,
  );
  add(
    "word/document.xml",
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${buildDocxParagraphs(text, language)}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`,
  );
  const bytes = await zip.generateAsync({ type: "uint8array", compression: "DEFLATE" });
  return new Blob([bytes as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

// 윈도우 메모장 등 어떤 편집기에서도 한글·한자·일본어가 깨지지 않도록 UTF-8 표시(BOM)를 앞에 붙인다.
const UTF8_BOM = "﻿";

export function buildTextFile(text: string): Blob {
  return new Blob([UTF8_BOM, text.replace(/\r\n?|\n/g, "\r\n")], { type: "text/plain;charset=utf-8" });
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// 파일 이름: 보고서_공문_영어_20261015.docx
export function reportFileName(
  purposeKo: string,
  languageKo: string,
  extension: "docx" | "txt",
  now = new Date(),
): string {
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  return `보고서_${purposeKo.replace(/\s+/g, "")}_${languageKo}_${stamp}.${extension}`;
}
