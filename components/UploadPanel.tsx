"use client";

// Design Ref: §1 화면 구성 ②③ — 올린 문서를 둥근 칩으로 보여주고, 실패한 문서는 이유를 함께 보여준다.
// Plan SC: PLAN 4~12번 — 검사 결과·실패 이유 표시, 성공한 문서 목록, 문서별 요약 버튼.
import { SUMMARIZE_LABEL } from "@/lib/messages";
import type { UploadedDoc } from "@/lib/types";

type OkDoc = Extract<UploadedDoc, { status: "ok" }>;

type Props = {
  docs: UploadedDoc[];
  reading: boolean;
  sending: boolean; // 답변을 기다리는 중에는 요약을 새로 요청하지 않는다
  showHints: boolean; // 처음 화면에서만 제한 안내를 보여준다
  onSummarize: (doc: OkDoc) => void;
};

export default function UploadPanel({ docs, reading, sending, showHints, onSummarize }: Props) {
  return (
    <section aria-label="올린 문서" className="flex w-full flex-col items-center gap-3">
      <p role="status" className="min-h-5 text-sm text-zinc-500 dark:text-zinc-400">
        {reading ? "문서 읽는 중…" : null}
      </p>

      {docs.length > 0 && (
        <ul className="flex w-full flex-wrap justify-center gap-2">
          {docs.map((doc) =>
            doc.status === "ok" ? (
              <li
                key={doc.id}
                className="flex max-w-full items-center gap-2 rounded-full bg-zinc-100 py-1 pl-3 pr-1 text-sm dark:bg-zinc-800"
              >
                <span aria-hidden="true">✅</span>
                <span className="sr-only">성공: </span>
                <span className="truncate">{doc.name}</span>
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => onSummarize(doc)}
                  aria-label={`${doc.name} ${SUMMARIZE_LABEL}`}
                  className="shrink-0 rounded-full bg-background px-3 py-1 text-xs text-blue-700 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 dark:text-blue-300"
                >
                  {SUMMARIZE_LABEL}
                </button>
              </li>
            ) : (
              <li
                key={doc.id}
                className="flex max-w-full flex-col rounded-2xl bg-red-50 px-3 py-1 text-sm dark:bg-red-950"
              >
                <span className="truncate">
                  <span aria-hidden="true">❌ </span>
                  <span className="sr-only">실패: </span>
                  {doc.name}
                </span>
                <span className="text-xs text-red-700 dark:text-red-300">{doc.reason}</span>
              </li>
            ),
          )}
        </ul>
      )}

      {showHints && (
        <ul className="space-y-0.5 text-center text-xs text-zinc-500 dark:text-zinc-400">
          <li>PDF, Word(.docx), 한글(.hwpx) 파일을 올릴 수 있습니다. 끌어다 놓아도 됩니다.</li>
          <li>파일 1개는 10MB 이하, 50쪽 이하이고, 최대 5개까지 올릴 수 있습니다.</li>
        </ul>
      )}
    </section>
  );
}
