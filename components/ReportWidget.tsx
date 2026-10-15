"use client";

// 우측 하단의 작은 말풍선 버튼과 팝업(메신저 상담창 모양): 보고서 작성 도우미.
// 목적 → 언어 → 내용을 고르고 적으면 서버(/api/report)가 선택한 언어로 보고서 초안을 만들어 준다.
import { useEffect, useRef, useState } from "react";
import {
  AI_ERROR,
  NETWORK_ERROR,
  RATE_LIMITED,
  REPORT_AGAIN,
  REPORT_CLOSE_LABEL,
  REPORT_INVALID,
  REPORT_MAKE,
  REPORT_MAKING,
  REPORT_NOTE,
  REPORT_OPEN_LABEL,
  REPORT_PLACEHOLDER,
  REPORT_STEP_CONTENT,
  REPORT_STEP_LANGUAGE,
  REPORT_STEP_PURPOSE,
  REPORT_SUBTITLE,
  REPORT_TITLE,
  COPIED_LABEL,
  COPY_FAILED_LABEL,
  COPY_LABEL,
} from "@/lib/messages";
import {
  MAX_REPORT_CONTENT_CHARS,
  REPORT_LANGUAGES,
  REPORT_PURPOSES,
  type ReportLanguage,
  type ReportPurpose,
} from "@/lib/report-options";

type Props = {
  onUnauthorized: () => void; // 로그인이 끊겼을 때 비밀번호 화면으로 돌아가게 한다
};

// 지구 모양 아이콘 (동그라미 + 가로선 + 세로 곡선). 색은 글자색(currentColor)을 따른다.
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19" />
      <path d="M4.2 7.5h15.6M4.2 16.5h15.6" />
      <path d="M12 2.5c2.6 2.6 4 5.9 4 9.5s-1.4 6.9-4 9.5c-2.6-2.6-4-5.9-4-9.5s1.4-6.9 4-9.5z" />
    </svg>
  );
}

const chip = (active: boolean) =>
  `rounded-full border px-3 py-1.5 text-sm transition-colors ${
    active
      ? "border-blue-600 bg-blue-600 text-white"
      : "border-zinc-200 bg-white text-zinc-700 hover:border-blue-400 hover:bg-blue-50"
  }`;

export default function ReportWidget({ onUnauthorized }: Props) {
  const [open, setOpen] = useState(false);
  const [purpose, setPurpose] = useState<ReportPurpose | null>(null);
  const [language, setLanguage] = useState<ReportLanguage | null>(null);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copy, setCopy] = useState<"idle" | "copied" | "failed">("idle");
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Esc로 닫고, 닫으면 포커스를 말풍선 버튼으로 돌려 준다.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const canMake = purpose !== null && language !== null && content.trim() !== "" && !busy;

  async function make() {
    if (!canMake) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose, language, content: content.trim() }),
      });
      if (response.status === 401) {
        onUnauthorized();
        return;
      }
      if (!response.ok) {
        setError(response.status === 400 ? REPORT_INVALID : response.status === 429 ? RATE_LIMITED : AI_ERROR);
        return;
      }
      const data = (await response.json()) as { report?: string };
      setReport(data.report ?? "");
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setBusy(false);
    }
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(report ?? "");
      setCopy("copied");
    } catch {
      setCopy("failed");
    }
    setTimeout(() => setCopy("idle"), 2000);
  }

  return (
    <>
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={REPORT_TITLE}
          className="fixed bottom-36 right-4 z-30 flex max-h-[calc(100vh-10rem)] w-[min(92vw,360px)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-2xl sm:bottom-24 sm:right-6 sm:max-h-[calc(100vh-7rem)]"
        >
          {/* 머리말 */}
          <header className="flex items-start gap-3 bg-blue-600 px-4 py-3 text-white">
            <GlobeIcon className="mt-0.5 h-8 w-8 shrink-0" />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold">{REPORT_TITLE}</h2>
              <p className="text-xs text-blue-50">{REPORT_SUBTITLE}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label={REPORT_CLOSE_LABEL}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-lg hover:bg-blue-700"
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>

          <div className="flex flex-col gap-4 overflow-y-auto bg-zinc-50 p-4">
            {report === null ? (
              <>
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-1 text-sm font-medium">{REPORT_STEP_PURPOSE}</legend>
                  <div className="flex flex-wrap gap-2">
                    {REPORT_PURPOSES.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        aria-pressed={purpose === item.code}
                        onClick={() => setPurpose(item.code)}
                        className={chip(purpose === item.code)}
                      >
                        {item.ko}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-1 text-sm font-medium">{REPORT_STEP_LANGUAGE}</legend>
                  <div className="flex flex-wrap gap-2">
                    {REPORT_LANGUAGES.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        aria-pressed={language === item.code}
                        onClick={() => setLanguage(item.code)}
                        className={chip(language === item.code)}
                      >
                        {item.ko === item.native ? item.ko : `${item.ko} (${item.native})`}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-2">
                  <label htmlFor="report-content" className="text-sm font-medium">
                    {REPORT_STEP_CONTENT}
                  </label>
                  <textarea
                    id="report-content"
                    value={content}
                    maxLength={MAX_REPORT_CONTENT_CHARS}
                    rows={6}
                    placeholder={REPORT_PLACEHOLDER}
                    onChange={(event) => setContent(event.target.value)}
                    className="resize-none rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none placeholder:text-zinc-400 focus:border-blue-600"
                  />
                  <p className="text-right text-xs text-zinc-400">
                    {content.length.toLocaleString("ko-KR")} / {MAX_REPORT_CONTENT_CHARS.toLocaleString("ko-KR")}
                  </p>
                </div>

                <p role="alert" className="min-h-4 text-sm text-red-600">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={make}
                  disabled={!canMake}
                  className="h-11 rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
                >
                  {busy ? REPORT_MAKING : REPORT_MAKE}
                </button>
                <p className="text-xs text-zinc-500">{REPORT_NOTE}</p>
              </>
            ) : (
              <>
                {/* 만들어진 보고서: HTML이 아니라 일반 글자로만 보여 준다 */}
                <pre className="max-h-[50vh] overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-zinc-200 bg-white p-3 font-sans text-sm leading-6">
                  {report}
                </pre>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={copyReport}
                    className="h-10 flex-1 rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {copy === "copied" ? COPIED_LABEL : copy === "failed" ? COPY_FAILED_LABEL : COPY_LABEL}
                  </button>
                  <button
                    type="button"
                    onClick={() => setReport(null)}
                    className="h-10 flex-1 rounded-xl border border-zinc-300 bg-white text-sm hover:bg-zinc-100"
                  >
                    {REPORT_AGAIN}
                  </button>
                </div>
                <p className="text-xs text-zinc-500">{REPORT_NOTE}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 우측 하단의 말풍선 버튼 */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={REPORT_OPEN_LABEL}
        aria-expanded={open}
        title={REPORT_TITLE}
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 sm:bottom-6 sm:right-6"
      >
        {open ? <span aria-hidden="true">×</span> : <GlobeIcon className="h-8 w-8" />}
      </button>
    </>
  );
}
