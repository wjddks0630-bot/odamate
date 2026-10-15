"use client";

// Design Ref: §1 화면 구성 ②문서 올리기 + ③올린 문서 목록
// Plan SC: PLAN 4~12번 — 파일 선택(끌어다 놓기 포함), 검사 결과·실패 이유 표시, 성공한 문서 목록.
import { useEffect, useRef, useState } from "react";
import { SUMMARIZE_LABEL } from "@/lib/messages";
import type { UploadedDoc } from "@/lib/types";

type Props = {
  docs: UploadedDoc[];
  reading: boolean;
  sending: boolean; // 답변을 기다리는 중에는 요약을 새로 요청하지 않는다
  onFiles: (files: File[]) => void;
  onSummarize: (doc: Extract<UploadedDoc, { status: "ok" }>) => void;
};

export default function UploadPanel({ docs, reading, sending, onFiles, onSummarize }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  // 파일을 영역 밖에 놓아도 브라우저가 그 파일을 열어 앱(올린 문서·대화)이 사라지지 않게 막는다.
  useEffect(() => {
    const keepPage = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) event.preventDefault();
    };
    window.addEventListener("dragover", keepPage);
    window.addEventListener("drop", keepPage);
    return () => {
      window.removeEventListener("dragover", keepPage);
      window.removeEventListener("drop", keepPage);
    };
  }, []);

  return (
    <section
      aria-labelledby="upload-title"
      className="flex flex-col gap-6 rounded-2xl border border-black/10 p-6 dark:border-white/15"
    >
      {/* ② 문서 올리기 (파일을 끌어다 놓을 수 있는 영역) */}
      <div
        onDragEnter={() => !reading && setDragging(true)}
        onDragOver={(event) => {
          event.preventDefault();
          if (!reading) setDragging(true);
        }}
        onDragLeave={(event) => {
          // 영역 안의 다른 요소로 옮겨 갈 때는 강조를 유지한다.
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (reading) return; // 읽는 중에는 새 파일을 받지 않는다 (버튼과 같은 규칙)
          const files = Array.from(event.dataTransfer.files);
          if (files.length > 0) onFiles(files);
        }}
        className={`flex flex-col gap-3 rounded-xl border-2 border-dashed p-4 transition-colors ${
          dragging
            ? "border-foreground bg-black/5 dark:bg-white/10"
            : "border-black/15 dark:border-white/20"
        }`}
      >
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
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          {dragging ? "여기에 놓으면 올라갑니다" : "또는 파일을 이 영역으로 끌어다 놓으세요"}
        </p>
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
                  <span className="flex items-center justify-between gap-2">
                    <span>
                      <span aria-hidden="true">✅ </span>
                      <span className="sr-only">성공: </span>
                      <span className="break-all">{doc.name}</span>
                    </span>
                    <button
                      type="button"
                      disabled={sending}
                      onClick={() => onSummarize(doc)}
                      aria-label={`${doc.name} ${SUMMARIZE_LABEL}`}
                      className="shrink-0 rounded-full border border-black/15 px-3 py-1 text-xs hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/20 dark:hover:bg-white/10"
                    >
                      {SUMMARIZE_LABEL}
                    </button>
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
