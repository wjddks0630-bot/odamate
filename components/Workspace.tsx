"use client";

// Design Ref: §1 화면 구성 — 넓은 화면은 왼쪽 문서·오른쪽 대화, 좁은 화면은 위아래로 쌓는다.
// Design Ref: §2.3 — 문서·메시지 상태는 이 컴포넌트가 화면 메모리에만 들고 있다 (새로고침하면 사라진다).
import { useRef, useState } from "react";
import type { ChatApiResponse, ChatMessage } from "@/lib/chat-types";
import { AI_ERROR, NO_DOCS_NOTICE } from "@/lib/messages";
import { processFile } from "@/lib/upload";
import type { UploadedDoc } from "@/lib/types";
import ChatPanel from "./ChatPanel";
import UploadPanel from "./UploadPanel";

export default function Workspace() {
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [reading, setReading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  // 읽는 도중에도 최신 문서 목록을 기준으로 검사하기 위해 ref에도 보관한다.
  const docsRef = useRef<UploadedDoc[]>([]);

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

  async function handleSend(question: string) {
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

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <UploadPanel docs={docs} reading={reading} onFiles={handleFiles} />
      <ChatPanel
        messages={messages}
        sending={sending}
        hasDocs={docs.some((doc) => doc.status === "ok")}
        onSend={handleSend}
      />
    </div>
  );
}
