"use client";

// Design Ref: §1 화면 구성 — 처음에는 가운데 제목과 둥근 질문창만 보이고, 질문을 시작하면 제목이 위로 올라가고
// 대화가 아래로 쌓이며 질문창은 화면 아래에 붙는다. 문서는 질문창 아래에 칩으로 보인다.
// Design Ref: §2.3 — 문서·메시지 상태는 이 컴포넌트가 화면 메모리에만 들고 있다 (새로고침하면 사라진다).
import { useEffect, useRef, useState } from "react";
import type { ChatApiResponse, ChatMessage } from "@/lib/chat-types";
import {
  AI_ERROR,
  APP_NAME,
  APP_TAGLINE,
  DROP_HINT,
  LOGIN_EXPIRED,
  LOGOUT_LABEL,
  NO_DOCS_NOTICE,
  SHARE_EXPORT_CONFIRM,
  STORAGE_NOTICE,
  summaryRequest,
} from "@/lib/messages";
import { downloadBundle, isBundleFile, processBundle } from "@/lib/share";
import { processFile } from "@/lib/upload";
import type { OkDoc, UploadedDoc } from "@/lib/types";
import { loadWorldMap, type WorldMap } from "@/lib/world-map";
import AidMapBanner from "./AidMapBanner";
import EdcfBanner from "./EdcfBanner";
import EdcfChecklistDialog from "./EdcfChecklistDialog";
import AidMapDialog from "./AidMapDialog";
import ChatPanel from "./ChatPanel";
import LoginScreen from "./LoginScreen";
import ReportWidget from "./ReportWidget";
import SearchBar from "./SearchBar";
import TopBar from "./TopBar";
import UploadPanel from "./UploadPanel";

// 접속 비밀번호 로그인 상태: 확인 중 / 비밀번호 입력이 필요함 / 로그인됨
type Auth =
  | { status: "checking" }
  | { status: "locked"; configured: boolean; notice?: string }
  | { status: "ok" };

export default function Workspace() {
  const [auth, setAuth] = useState<Auth>({ status: "checking" });
  const [worldMap, setWorldMap] = useState<WorldMap | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [edcfOpen, setEdcfOpen] = useState(false);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [reading, setReading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [dragging, setDragging] = useState(false);
  // 읽는 도중에도 최신 문서 목록을 기준으로 검사하기 위해 ref에도 보관한다.
  const docsRef = useRef<UploadedDoc[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

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

  // 처음 열 때 이미 로그인되어 있는지 서버에 물어본다 (쿠키가 남아 있으면 비밀번호를 다시 묻지 않는다).
  useEffect(() => {
    let alive = true;
    fetch("/api/session")
      .then((response) => response.json())
      .then((session: { configured: boolean; authenticated: boolean }) => {
        if (!alive) return;
        setAuth(session.authenticated ? { status: "ok" } : { status: "locked", configured: session.configured });
      })
      .catch(() => alive && setAuth({ status: "locked", configured: true }));
    return () => {
      alive = false;
    };
  }, []);

  // 로그인한 뒤 세계지도 자료를 미리 불러 둔다 (처음 화면의 안내 카드와 팝업이 함께 쓴다).
  useEffect(() => {
    if (auth.status !== "ok") return;
    loadWorldMap()
      .then(setWorldMap)
      .catch(() => {
        // 지도를 불러오지 못해도 질문·답변 기능에는 영향이 없다.
      });
  }, [auth.status]);

  async function logout() {
    await fetch("/api/session", { method: "DELETE" }).catch(() => {});
    // 다른 사람이 이어서 쓰지 못하도록 올린 문서와 대화도 화면에서 지운다.
    docsRef.current = [];
    setDocs([]);
    setMessages([]);
    setAuth({ status: "locked", configured: true });
  }

  async function handleFiles(files: File[]) {
    setReading(true);
    // 한 번에 여러 파일을 골라도 순서대로 하나씩 처리한다.
    for (const file of files) {
      // 공유 파일(.json)은 문서 여러 개가 들어 있을 수 있어 따로 처리한다.
      const added = isBundleFile(file)
        ? await processBundle(file, docsRef.current)
        : [await processFile(file, docsRef.current)];
      docsRef.current = [...docsRef.current, ...added];
      setDocs(docsRef.current);
    }
    setReading(false);
  }

  // 올린 문서를 공유 파일로 내려받는다. 내용이 글자 그대로 들어가므로 먼저 한 번 확인한다.
  function handleExport() {
    const okDocs = docsRef.current.filter((doc): doc is OkDoc => doc.status === "ok");
    if (okDocs.length === 0 || !window.confirm(SHARE_EXPORT_CONFIRM)) return;
    downloadBundle(okDocs);
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

      if (response.status === 401) {
        // 로그인이 끊겼다: 비밀번호 입력 화면으로 돌아간다 (올린 문서와 대화는 그대로 남는다).
        setAuth({ status: "locked", configured: true, notice: LOGIN_EXPIRED });
        return;
      }
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

  if (auth.status === "checking") return <div className="flex-1" />;
  if (auth.status === "locked") {
    return (
      <LoginScreen
        configured={auth.configured}
        notice={auth.notice}
        onLoggedIn={() => setAuth({ status: "ok" })}
      />
    );
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
          onExport={handleExport}
          onImport={() => importInputRef.current?.click()}
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
      {/* 공유 파일(.json)만 고르는 창 — "문서 묶음 가져오기" 버튼이 연다 */}
      <input
        ref={importInputRef}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        aria-label="공유 파일 선택"
        tabIndex={-1}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (files.length > 0) handleFiles(files);
        }}
      />

      <TopBar>
        <button
          type="button"
          onClick={logout}
          className="text-sm text-zinc-500 hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {LOGOUT_LABEL}
        </button>
      </TopBar>

      {dragging && (
        <div className="pointer-events-none fixed inset-4 z-10 flex items-center justify-center rounded-3xl border-2 border-dashed border-blue-500 bg-blue-50/80 text-lg text-blue-700 dark:bg-blue-950/80 dark:text-blue-200">
          {DROP_HINT}
        </div>
      )}

      {started ? (
        <>
          <header className="mx-auto w-full max-w-3xl px-6 pt-5">
            <h1 className="font-gmarket text-2xl font-bold tracking-tight">{APP_NAME}</h1>
            <p className="font-gmarket text-xs font-medium text-zinc-500">{APP_TAGLINE}</p>
          </header>
          <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6">
            <ChatPanel messages={messages} sending={sending} />
          </div>
          <div className="sticky bottom-0 bg-background px-6 pb-4 pt-2">{controls}</div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-24">
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-gmarket text-[3.25rem] font-bold tracking-tight sm:text-[4.125rem]">{APP_NAME}</h1>
            <p className="font-gmarket text-sm font-medium text-zinc-500">{APP_TAGLINE}</p>
          </div>
          <AidMapBanner worldMap={worldMap} onOpen={() => setMapOpen(true)} />
          <EdcfBanner onOpen={() => setEdcfOpen(true)} />
          {controls}
        </div>
      )}

      <ReportWidget onUnauthorized={() => setAuth({ status: "locked", configured: true, notice: LOGIN_EXPIRED })} />

      <AidMapDialog open={mapOpen} worldMap={worldMap} onClose={() => setMapOpen(false)} />

      <EdcfChecklistDialog open={edcfOpen} onClose={() => setEdcfOpen(false)} />

      <footer className="border-t border-zinc-200 bg-zinc-100 px-6 py-3 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        {STORAGE_NOTICE}
      </footer>
    </div>
  );
}
