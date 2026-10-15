// 문서 공유(내보내기·가져오기) — 서버를 거치지 않는다. 올린 문서의 글자를 파일(.json)로 내려받고,
// 다른 사람이 그 파일을 앱에 올리면 같은 문서로 쓸 수 있다. 파일은 사용자가 직접 주고받는다 (메신저·메일 등).
// 가져오는 파일은 믿을 수 없는 입력이므로 모양·크기를 모두 다시 검사한다.
import {
  MAX_DOC_NAME_CHARS,
  MAX_FILE_BYTES,
  MAX_FILES,
  MAX_PAGES,
  MAX_TOTAL_CHARS,
} from "./limits";
import { BUNDLE_INVALID, TOO_LARGE_FILE, TOO_MANY_CHARS, TOO_MANY_FILES } from "./messages";
import type { OkDoc, UploadedDoc } from "./types";
import { fail } from "./upload";

export const BUNDLE_FORMAT = "intern-helper-docs";
const BUNDLE_VERSION = 1;
// 한 파일에 담을 수 있다고 인정하는 문서 수의 상한 (앱이 받는 최대 개수보다 넉넉히 두고, 넘는 문서는 개수 제한으로 거른다)
const MAX_BUNDLE_DOCS = 20;

type BundleDoc = { name: string; pages: number; text: string };

export function isBundleFile(file: File): boolean {
  return file.name.toLowerCase().endsWith(".json");
}

export function serializeBundle(docs: OkDoc[], createdAt = new Date()): string {
  return JSON.stringify({
    format: BUNDLE_FORMAT,
    version: BUNDLE_VERSION,
    createdAt: createdAt.toISOString(),
    documents: docs.map((doc): BundleDoc => ({ name: doc.name, pages: doc.pages, text: doc.text })),
  });
}

// 파일로 내려받는다 (브라우저 안에서만 만들어지고 서버로 가지 않는다).
export function downloadBundle(docs: OkDoc[]): void {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const url = URL.createObjectURL(new Blob([serializeBundle(docs, now)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `intern-helper-docs-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// 모양이 하나라도 어긋나면 파일 전체를 받지 않는다 (null).
export function parseBundle(raw: string): BundleDoc[] | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(data) || data.format !== BUNDLE_FORMAT || data.version !== BUNDLE_VERSION) return null;
  if (!Array.isArray(data.documents) || data.documents.length === 0 || data.documents.length > MAX_BUNDLE_DOCS) {
    return null;
  }

  const docs: BundleDoc[] = [];
  for (const item of data.documents) {
    if (!isRecord(item)) return null;
    const { name, pages, text } = item;
    if (typeof name !== "string" || name.trim() === "" || name.length > MAX_DOC_NAME_CHARS) return null;
    if (typeof text !== "string" || text.trim() === "" || text.length > MAX_TOTAL_CHARS) return null;
    if (typeof pages !== "number" || !Number.isInteger(pages) || pages < 1 || pages > MAX_PAGES) return null;
    docs.push({ name: name.trim(), pages, text });
  }
  return docs;
}

// 공유 파일 하나를 읽어 문서들로 바꾼다. 개수·글자 수 제한은 직접 올릴 때와 똑같이 적용한다.
export async function processBundle(file: File, current: UploadedDoc[]): Promise<UploadedDoc[]> {
  if (file.size > MAX_FILE_BYTES) return [fail(file.name, TOO_LARGE_FILE)];

  const parsed = parseBundle(await file.text().catch(() => ""));
  if (!parsed) return [fail(file.name, BUNDLE_INVALID)];

  const added: UploadedDoc[] = [];
  let running = current;
  for (const item of parsed) {
    const okDocs = running.filter((doc): doc is OkDoc => doc.status === "ok");
    const totalChars = okDocs.reduce((sum, doc) => sum + doc.text.length, 0);

    let doc: UploadedDoc;
    if (okDocs.length >= MAX_FILES) doc = fail(item.name, TOO_MANY_FILES);
    else if (totalChars + item.text.length > MAX_TOTAL_CHARS) doc = fail(item.name, TOO_MANY_CHARS);
    else doc = { id: crypto.randomUUID(), name: item.name, status: "ok", text: item.text, pages: item.pages, imported: true };

    added.push(doc);
    running = [...running, doc];
  }
  return added;
}
