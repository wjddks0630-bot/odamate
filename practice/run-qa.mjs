// 성공 기준 점검(PLAN 19번): 질문 20개를 /api/chat에 보내 정답률과 출처 표시율을 센다.
// 사용법: 개발 서버(npm run dev)를 켜 둔 상태에서  node practice/run-qa.mjs
// 판정 기준: 정답 = 답변에 expect의 말이 모두 들어 있음 / notFound 질문은 "문서에서 찾을 수 없습니다"여야 함.
// 출처 = 모든 답변에 문서 이름(출처 또는 확인한 문서)이 1개 이상 붙어 있어야 함. 문장 수는 5문장 이내인지도 센다.
import { readFileSync } from "node:fs";

const set = JSON.parse(readFileSync(new URL("./qa-set.json", import.meta.url), "utf8"));
const NOT_FOUND = "문서에서 찾을 수 없습니다";
const URL_API = process.env.QA_URL ?? "http://localhost:3000/api/chat";

// 접속 비밀번호 로그인: .env의 ACCESS_PASSWORD(또는 같은 이름의 환경 변수)로 로그인해 쿠키를 받는다. 값은 화면에 출력하지 않는다.
function readAccessPassword() {
  if (process.env.ACCESS_PASSWORD) return process.env.ACCESS_PASSWORD;
  try {
    const line = readFileSync(new URL("../.env", import.meta.url), "utf8")
      .split(/\r?\n/)
      .find((l) => l.startsWith("ACCESS_PASSWORD="));
    return line?.slice("ACCESS_PASSWORD=".length).trim().replace(/^['"]|['"]$/g, "");
  } catch {
    return undefined;
  }
}

const loginRes = await fetch(new URL("/api/login", URL_API), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password: readAccessPassword() ?? "" }),
});
if (!loginRes.ok) {
  console.error(`로그인에 실패했습니다 (HTTP ${loginRes.status}). .env의 ACCESS_PASSWORD를 확인하세요.`);
  process.exit(1);
}
const cookie = (loginRes.headers.get("set-cookie") ?? "").split(";")[0];

let correct = 0;
let withSource = 0;
let shortEnough = 0;
const started = Date.now();
const times = [];

for (const [index, item] of set.questions.entries()) {
  const t = Date.now();
  const res = await fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ question: item.q, documents: set.documents }),
  });
  const data = await res.json().catch(() => null);
  times.push((Date.now() - t) / 1000);

  const answer = data?.answer ?? "";
  const ok = item.notFound
    ? answer === NOT_FOUND
    : item.expect.every((word) => answer.includes(word));
  const hasSource = Array.isArray(data?.sources) && data.sources.length > 0;
  const sentences = answer.split(/(?<=[.!?。])\s+/).filter(Boolean).length;

  if (ok) correct += 1;
  if (hasSource) withSource += 1;
  if (sentences <= 5) shortEnough += 1;

  console.log(
    `${String(index + 1).padStart(2)}. ${ok ? "정답 " : "오답 "} 출처:${hasSource ? "O" : "X"} ${sentences}문장 ${times.at(-1).toFixed(1)}s | ${item.q}\n    → ${answer}${hasSource ? `  [${data.sourceKind === "checked" ? "확인한 문서" : "출처"}: ${data.sources.join(", ")}]` : ""}`,
  );
}

const n = set.questions.length;
console.log("\n=== 결과 ===");
console.log(`정답률: ${correct}/${n} (${Math.round((correct / n) * 100)}%)  목표 16개 이상`);
console.log(`출처 표시율: ${withSource}/${n} (${Math.round((withSource / n) * 100)}%)  목표 100%`);
console.log(`5문장 이내: ${shortEnough}/${n}`);
console.log(`질문당 평균 ${(times.reduce((a, b) => a + b, 0) / n).toFixed(1)}초, 최대 ${Math.max(...times).toFixed(1)}초 (전체 ${((Date.now() - started) / 1000).toFixed(0)}초)`);
