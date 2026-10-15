// Design Ref: §2.1 ① 검사 — 형식(.pdf/.docx/.hwpx)과 10MB를 파일을 읽기 전에 확인한다.
import { ALLOWED_EXTENSIONS, MAX_FILE_BYTES, type AllowedExtension } from "./limits";
import { HWP_NOTICE, TOO_LARGE_FILE, UNREADABLE, UNSUPPORTED_FORMAT } from "./messages";

export type FileCheck =
  | { ok: true; extension: AllowedExtension }
  | { ok: false; reason: string };

export function checkFile(file: File): FileCheck {
  const dot = file.name.lastIndexOf(".");
  const extension = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";

  if (extension === ".hwp") return { ok: false, reason: HWP_NOTICE };
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(extension)) {
    return { ok: false, reason: UNSUPPORTED_FORMAT };
  }
  if (file.size > MAX_FILE_BYTES) return { ok: false, reason: TOO_LARGE_FILE };
  if (file.size === 0) return { ok: false, reason: UNREADABLE };

  return { ok: true, extension: extension as AllowedExtension };
}
