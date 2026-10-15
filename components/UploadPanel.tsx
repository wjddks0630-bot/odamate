"use client";

// Design Ref: §1 화면 구성 ②문서 올리기 + ③올린 문서 목록
// Plan SC: PLAN 4~12번 — 파일 선택, 검사 결과·실패 이유 표시, 성공한 문서 목록.
import { useRef } from "react";
import type { UploadedDoc } from "@/lib/types";

type Props = {
  docs: UploadedDoc[];
  reading: boolean;
  onFiles: (files: File[]) => void;
};

export default function UploadPanel({ docs, reading, onFiles }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section
      aria-labelledby="upload-title"
      className="flex flex-col gap-6 rounded-2xl border border-black/10 p-6 dark:border-white/15"
    >
      {/* ② 문서 올리기 */}
      <div className="flex flex-col gap-3">
        <h2 id="upload-title" className="text-xl font-semibold">
          문서 올리기
        </h2>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.hwpx"
          className="sr-only"
          aria-label="문서 파일 선택"
          tabIndex={-1}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            // 같은 파일을 다시 골라도 변경으로 인식되도록 비운다.
            event.target.value = "";
            if (files.length > 0) onFiles(files);
          }}
        />
        <button
          type="button"
          disabled={reading}
          onClick={() => inputRef.current?.click()}
          className="h-12 rounded-full bg-foreground px-5 font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          파일 선택
        </button>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>PDF, Word(.docx), 한글(.hwpx) 파일을 올릴 수 있습니다.</li>
          <li>파일 1개는 10MB 이하, 50쪽 이하입니다.</li>
          <li>한 번에 최대 5개까지 올릴 수 있습니다.</li>
        </ul>
      </div>

      {/* ③ 올린 문서 목록 */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold">올린 문서</h3>
        <p role="status" className="text-sm text-zinc-500 dark:text-zinc-400">
          {reading
            ? "문서 읽는 중…"
            : docs.length === 0
              ? "아직 올린 문서가 없습니다."
              : null}
        </p>
        {docs.length > 0 && (
          <ul className="flex flex-col gap-2">
            {docs.map((doc) => (
              <li key={doc.id} className="text-sm">
                {doc.status === "ok" ? (
                  <span>
                    <span aria-hidden="true">✅ </span>
                    <span className="sr-only">성공: </span>
                    <span className="break-all">{doc.name}</span>
                  </span>
                ) : (
                  <span>
                    <span aria-hidden="true">❌ </span>
                    <span className="sr-only">실패: </span>
                    <span className="break-all">{doc.name}</span>
                    <span className="block pl-6 text-red-600 dark:text-red-400">
                      {doc.reason}
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
