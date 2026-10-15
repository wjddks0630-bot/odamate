"use client";

// Design Ref: §1 화면 구성 ④대화창 — 질문 입력창, 메시지 목록, 답변 끝의 출처 표시.
// Plan SC: PLAN 13·14·20·21번 — 채팅 화면, 문서 없이 질문 안내, 답변 복사, (화면이 열려 있는 동안의) 대화 기록.
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { ChatMessage } from "@/lib/chat-types";
import { MAX_QUESTION_CHARS } from "@/lib/limits";
import {
  CHAT_HINT,
  CHECKED_LABEL,
  COPIED_LABEL,
  COPY_FAILED_LABEL,
  COPY_LABEL,
  NO_DOCS_NOTICE,
  SOURCE_LABEL,
  THINKING,
} from "@/lib/messages";

type Props = {
  messages: ChatMessage[];
  sending: boolean;
  hasDocs: boolean;
  onSend: (question: string) => void;
};

function sourceLine(message: Extract<ChatMessage, { role: "assistant" }>): string {
  const label = message.sourceKind === "checked" ? CHECKED_LABEL : SOURCE_LABEL;
  return `${label}: ${message.sources.join(", ")}`;
}

function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      // 복사 권한이 없는 환경이면 실패했다고 알린다 (답변은 화면에서 직접 선택해 복사할 수 있다).
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="self-start rounded-full border border-black/15 px-3 py-1 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
    >
      {state === "copied" ? COPIED_LABEL : state === "failed" ? COPY_FAILED_LABEL : COPY_LABEL}
    </button>
  );
}

export default function ChatPanel({ messages, sending, hasDocs, onSend }: Props) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 생기면 맨 아래가 보이도록 내린다.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, sending]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question || sending) return;
    setInput("");
    onSend(question);
  }

  return (
    <section
      aria-labelledby="chat-title"
      className="flex min-h-[28rem] flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/15"
    >
      <h2 id="chat-title" className="text-xl font-semibold">
        대화
      </h2>

      {/* 메시지 목록: 화면이 열려 있는 동안의 대화 기록이 그대로 남는다 (저장하지 않음) */}
      <div
        role="log"
        aria-live="polite"
        aria-label="대화 내용"
        className="flex max-h-[32rem] min-h-64 flex-1 flex-col gap-3 overflow-y-auto rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900"
      >
        {messages.length === 0 && (
          <p className="m-auto text-zinc-500 dark:text-zinc-400">
            {hasDocs ? CHAT_HINT : NO_DOCS_NOTICE}
          </p>
        )}

        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <p
                key={message.id}
                className="max-w-[85%] self-end whitespace-pre-wrap break-words rounded-2xl bg-foreground px-4 py-2 text-background"
              >
                {message.content}
              </p>
            );
          }
          if (message.role === "assistant") {
            return (
              <div
                key={message.id}
                className="flex max-w-[90%] flex-col gap-2 self-start rounded-2xl border border-black/10 bg-background px-4 py-3 dark:border-white/15"
              >
                {/* 답변은 HTML이 아니라 일반 글자로만 그린다 */}
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p className="break-words text-sm text-zinc-600 dark:text-zinc-400">
                  {sourceLine(message)}
                </p>
                <CopyButton text={`${message.content}\n${sourceLine(message)}`} />
              </div>
            );
          }
          return (
            <p
              key={message.id}
              className={`max-w-[90%] self-start whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm ${
                message.role === "error"
                  ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  : "bg-black/5 dark:bg-white/10"
              }`}
            >
              {message.content}
            </p>
          );
        })}

        {sending && (
          <p role="status" className="self-start text-sm text-zinc-500 dark:text-zinc-400">
            {THINKING}
          </p>
        )}
        <div ref={endRef} />
      </div>

      {/* 질문 입력창 */}
      <form onSubmit={submit} className="flex gap-2">
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
          onChange={(event) => setInput(event.target.value)}
          // 한글을 입력하는 중(글자 조합 중)에 누른 Enter는 보내지 않는다.
          onKeyDown={(event) => {
            if (event.key === "Enter" && event.nativeEvent.isComposing) event.preventDefault();
          }}
          className="h-12 min-w-0 flex-1 rounded-full border border-black/15 bg-transparent px-5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/20"
        />
        <button
          type="submit"
          disabled={sending || input.trim() === ""}
          className="h-12 rounded-full bg-foreground px-5 font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          보내기
        </button>
      </form>
    </section>
  );
}
