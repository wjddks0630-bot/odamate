"use client";

// Design Ref: §1 화면 구성 — 처음에는 가운데 제목과 둥근 질문창만 보이고, 질문을 시작하면 제목이 위로 올라가고
// 대화가 아래로 쌓이며 질문창은 화면 아래에 붙는다. 문서는 질문창 아래에 칩으로 보인다.
// Design Ref: §2.3 — 문서·메시지 상태는 이 컴포넌트가 화면 메모리에만 들고 있다 (새로고침하면 사라진다).
import { useEffect, useRef, useState } from "react";
import type { ChatApiResponse, ChatMessage } from "@/lib/chat-types";
import { AI_ERROR, DROP_HINT, NO_DOCS_NOTICE, STORAGE_NOTICE, summaryRequest } from "@/lib/messages";
import { processFile } from "@/lib/upload";
import type { UploadedDoc } from "@/lib/types";
import ChatPanel from "./ChatPanel";
import SearchBar from "./SearchBar";
import UploadPanel from "./UploadPanel";

export default function Workspace() {
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [reading, setReading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [dragging, setDragging] = useState(false);
  // 읽는 도중에도 최신 문서 목록을 기준으로 검사하기 위해 ref에도 보관한다.
  const docsRef = useRef<UploadedDoc[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const started = messages.length > 0;

  // 파일을 화면 밖에 놓아도 브라우저가 그 파일을 열어 앱(올린 문서·대화)이 사라지지 않게 막는다.
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

  async function handleFiles(files: File[]) {
    setReading(true);
    // 한 번에 여러 파일을 골라도 순서대로 하나씩 처리한다.
    for (const file of files) {
      const doc = await processFile(file, docsRef.current);
      docsRef.current = [...docsRef.current, doc];
      setDocs(docsRef.current);
    }
    setReading(false);
  }

  function addMessage(message: ChatMessage) {
    setMessages((current) => [...current, message]);
  }

  // summarize: 문서 한 개를 요약할 때 그 문서의 이름
  async function handleSend(question: string, summarize?: string) {
    addMessage({ id: crypto.randomUUID(), role: "user", content: question });

    const okDocs = docsRef.current.filter((doc) => doc.status === "ok");
    // 문서가 없으면 서버를 부르지 않고 안내만 한다.
    if (okDocs.length === 0) {
      addMessage({ id: crypto.randomUUID(), role: "notice", content: NO_DOCS_NOTICE });
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          documents: okDocs.map((doc) => ({ name: doc.name, text: doc.text })),
          ...(summarize ? { summarize } : {}),
        }),
      });
      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message = (data as { error?: { message?: string } } | null)?.error?.message;
        addMessage({ id: crypto.randomUUID(), role: "error", content: message ?? AI_ERROR });
        return;
      }

      const result = data as ChatApiResponse;
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.answer,
        sourceKind: result.sourceKind,
        sources: result.sources,
      });
    } catch {
      addMessage({ id: crypto.randomUUID(), role: "error", content: AI_ERROR });
    } finally {
      setSending(false);
    }
  }

  const controls = (
    <div className={started ? "mx-auto w-full max-w-3xl" : "w-full max-w-[584px]"}>
      <SearchBar
        sending={sending}
        reading={reading}
        showButtons={!started}
        onSend={(question) => handleSend(question)}
        onPick={() => fileInputRef.current?.click()}
      />
      <div className="mt-4">
        <UploadPanel
          docs={docs}
          reading={reading}
          sending={sending}
          showHints={!started}
          onSummarize={(doc) => handleSend(summaryRequest(doc.name), doc.name)}
        />
      </div>
    </div>
  );

  return (
    <div
      className="relative flex flex-1 flex-col"
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes("Files") && !reading) setDragging(true);
      }}
      onDragLeave={(event) => {
        // 화면 밖으로 나갈 때만 강조를 끈다.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (reading) return; // 읽는 중에는 새 파일을 받지 않는다 (버튼과 같은 규칙)
        const files = Array.from(event.dataTransfer.files);
        if (files.length > 0) handleFiles(files);
      }}
    >
      <input
        ref={fileInputRef}
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
          if (files.length > 0) handleFiles(files);
        }}
      />

      {dragging && (
        <div className="pointer-events-none fixed inset-4 z-10 flex items-center justify-center rounded-3xl border-2 border-dashed border-blue-500 bg-blue-50/80 text-lg text-blue-700 dark:bg-blue-950/80 dark:text-blue-200">
          {DROP_HINT}
        </div>
      )}

      {started ? (
        <>
          <header className="mx-auto w-full max-w-3xl px-6 pt-5">
            <h1 className="text-2xl font-normal tracking-tight">인턴 도우미</h1>
          </header>
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6">
            <ChatPanel messages={messages} sending={sending} />
          </div>
          <div className="sticky bottom-0 bg-background px-6 pb-4 pt-2">{controls}</div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-24">
          <h1 className="text-6xl font-normal tracking-tight sm:text-7xl">인턴 도우미</h1>
          {controls}
        </div>
      )}

      <footer className="border-t border-zinc-200 bg-zinc-100 px-6 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        {STORAGE_NOTICE}
      </footer>
    </div>
  );
}
