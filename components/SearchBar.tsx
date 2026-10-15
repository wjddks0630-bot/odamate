"use client";

// Design Ref: §1 화면 구성 ④ 질문 입력창 — 가운데 둥근 검색창 모양 (왼쪽 +로 파일 선택, 오른쪽 화살표로 보내기).
// 한글을 입력하는 중(글자 조합 중)에 누른 Enter는 보내지 않는다.
import { useState, type FormEvent } from "react";
import { MAX_QUESTION_CHARS } from "@/lib/limits";
import { ASK_LABEL, PICK_LABEL } from "@/lib/messages";

type Props = {
  sending: boolean;
  reading: boolean;
  showButtons: boolean; // 처음 화면에서만 아래에 회색 버튼 두 개를 보여준다
  onSend: (question: string) => void;
  onPick: () => void;
};

const grayButton =
  "rounded-md border border-transparent bg-zinc-100 px-4 py-2 text-sm text-zinc-700 hover:border-zinc-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-600";

export default function SearchBar({ sending, reading, showButtons, onSend, onPick }: Props) {
  const [input, setInput] = useState("");
  const canSend = !sending && input.trim() !== "";

  function submit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question || sending) return;
    setInput("");
    onSend(question);
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col items-center gap-6">
      <div className="flex h-12 w-full items-center gap-1 rounded-full border border-zinc-200 bg-background pl-2 pr-2 shadow-sm transition-shadow focus-within:shadow-md hover:shadow-md dark:border-zinc-700">
        <button
          type="button"
          onClick={onPick}
          disabled={reading}
          aria-label={`문서 ${PICK_LABEL}`}
          title={PICK_LABEL}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl leading-none text-zinc-600 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          +
        </button>
        <label htmlFor="question" className="sr-only">
          질문 입력
        </label>
        <input
          id="question"
          type="text"
          value={input}
          maxLength={MAX_QUESTION_CHARS}
          disabled={sending}
          placeholder="질문을 입력하세요"
          autoComplete="off"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.nativeEvent.isComposing) event.preventDefault();
          }}
          className="h-full min-w-0 flex-1 bg-transparent px-2 outline-none placeholder:text-zinc-400 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={!canSend}
          aria-label="보내기"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:bg-zinc-700"
        >
          <span aria-hidden="true">↑</span>
        </button>
      </div>

      {showButtons && (
        <div className="flex gap-3">
          <button type="submit" disabled={!canSend} className={grayButton}>
            {ASK_LABEL}
          </button>
          <button type="button" onClick={onPick} disabled={reading} className={grayButton}>
            {PICK_LABEL}
          </button>
        </div>
      )}
    </form>
  );
}
