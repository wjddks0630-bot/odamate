"use client";

// 접속 비밀번호 입력 화면 — 처음 화면과 같은 모양(가운데 제목, 둥근 입력창).
import { useState, type FormEvent } from "react";
import {
  APP_NAME,
  APP_TAGLINE,
  LOGIN_BUTTON,
  LOGIN_NOT_CONFIGURED,
  LOGIN_PROMPT,
  LOGIN_TOO_MANY,
  LOGIN_WRONG,
  NETWORK_ERROR,
} from "@/lib/messages";
import TopBar from "./TopBar";

type Props = {
  configured: boolean; // 서버에 접속 비밀번호가 설정되어 있는지
  notice?: string; // 로그인이 끊겨서 돌아온 경우의 안내
  onLoggedIn: () => void;
};

export default function LoginScreen({ configured, notice, onLoggedIn }: Props) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        setPassword("");
        onLoggedIn();
        return;
      }
      setError(response.status === 429 ? LOGIN_TOO_MANY : LOGIN_WRONG);
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-24">
        <h1 className="font-gmarket text-6xl font-bold tracking-tight sm:text-7xl">{APP_NAME}</h1>
        {configured ? (
          <form onSubmit={submit} className="flex w-full max-w-[584px] flex-col items-center gap-4">
            <div className="flex h-12 w-full items-center gap-1 rounded-full border border-zinc-200 bg-background pl-5 pr-2 shadow-sm transition-shadow focus-within:shadow-md hover:shadow-md dark:border-zinc-700">
              <label htmlFor="access-password" className="sr-only">
                {LOGIN_PROMPT}
              </label>
              <input
                id="access-password"
                type="password"
                value={password}
                autoFocus
                autoComplete="current-password"
                maxLength={200}
                placeholder={LOGIN_PROMPT}
                onChange={(event) => setPassword(event.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-zinc-400"
              />
              <button
                type="submit"
                disabled={busy || password === ""}
                className="h-9 shrink-0 rounded-full bg-blue-600 px-5 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 dark:disabled:bg-zinc-700"
              >
                {LOGIN_BUTTON}
              </button>
            </div>
            <p role="alert" className="min-h-5 text-sm text-red-600 dark:text-red-400">
              {error ?? notice}
            </p>
          </form>
        ) : (
          <p role="alert" className="max-w-md text-center text-sm text-red-600 dark:text-red-400">
            {LOGIN_NOT_CONFIGURED}
          </p>
        )}
      </div>
      <footer className="font-gmarket px-6 py-3 text-center text-[11px] font-medium text-zinc-400">{APP_TAGLINE}</footer>
    </div>
  );
}
