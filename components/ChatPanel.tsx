"use client";

// Design Ref: §1 화면 구성 ④대화창 — 질문과 답변 목록, 답변 끝의 출처 표시, 답변 복사 버튼.
// 질문 입력창은 SearchBar가 맡고, 이 컴포넌트는 메시지 목록만 그린다.
// Plan SC: PLAN 13·14·20·21번 — 채팅 화면, 문서 없이 질문 안내, 답변 복사, (화면이 열려 있는 동안의) 대화 기록.
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/chat-types";
import {
  CHECKED_LABEL,
  COPIED_LABEL,
  COPY_FAILED_LABEL,
  COPY_LABEL,
  GENERAL_LABEL,
  MIXED_NOTE,
  SOURCE_LABEL,
  THINKING,
} from "@/lib/messages";

type Props = {
  messages: ChatMessage[];
  sending: boolean;
};

function sourceLine(message: Extract<ChatMessage, { role: "assistant" }>): string {
  if (message.sourceKind === "general") return GENERAL_LABEL;
  const label = message.sourceKind === "checked" ? CHECKED_LABEL : SOURCE_LABEL;
  const line = `${label}: ${message.sources.join(", ")}`;
  return message.sourceKind === "mixed" ? `${line} · ${MIXED_NOTE}` : line;
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
      className="self-start rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {state === "copied" ? COPIED_LABEL : state === "failed" ? COPY_FAILED_LABEL : COPY_LABEL}
    </button>
  );
}

export default function ChatPanel({ messages, sending }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 생기면 맨 아래가 보이도록 내린다.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, sending]);

  return (
    // 화면이 열려 있는 동안의 대화 기록이 그대로 남는다 (저장하지 않음)
    <div
      role="log"
      aria-live="polite"
      aria-label="대화 내용"
      className="flex w-full flex-1 flex-col gap-4 py-6"
    >
      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <p
              key={message.id}
              className="max-w-[85%] self-end whitespace-pre-wrap break-words rounded-3xl bg-zinc-100 px-5 py-2 dark:bg-zinc-800"
            >
              {message.content}
            </p>
          );
        }
        if (message.role === "assistant") {
          return (
            <div key={message.id} className="flex max-w-full flex-col gap-2">
              {/* 답변은 HTML이 아니라 일반 글자로만 그린다 */}
              <p className="whitespace-pre-wrap break-words text-lg leading-8">{message.content}</p>
              <p className="break-words text-sm text-zinc-500 dark:text-zinc-400">
                {sourceLine(message)}
              </p>
              <CopyButton text={`${message.content}\n${sourceLine(message)}`} />
            </div>
          );
        }
        return (
          <p
            key={message.id}
            className={`max-w-full whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm ${
              message.role === "error"
                ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            }`}
          >
            {message.content}
          </p>
        );
      })}

      {sending && (
        <p role="status" className="text-sm text-zinc-500 dark:text-zinc-400">
          {THINKING}
        </p>
      )}
      <div ref={endRef} />
    </div>
  );
}
