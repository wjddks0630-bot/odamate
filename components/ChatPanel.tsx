// Design Ref: §1 화면 구성 ④대화창
// Plan SC: PLAN 1번 — 채팅 영역 틀. 질문 전송·답변 표시는 PLAN 13번 이후에 붙인다.

export default function ChatPanel() {
  return (
    <section
      aria-labelledby="chat-title"
      className="flex min-h-[28rem] flex-col gap-4 rounded-2xl border border-black/10 p-6 dark:border-white/15"
    >
      <h2 id="chat-title" className="text-xl font-semibold">
        대화
      </h2>

      {/* 메시지 목록 (지금은 문서가 없는 처음 상태 안내만 보인다) */}
      <div className="flex flex-1 items-center justify-center rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
        <p className="text-zinc-500 dark:text-zinc-400">
          먼저 문서를 올려주세요
        </p>
      </div>

      {/* 질문 입력창 (동작은 아직 연결하지 않아 잠가 둔다) */}
      <div className="flex gap-2">
        <label htmlFor="question" className="sr-only">
          질문 입력
        </label>
        <input
          id="question"
          type="text"
          disabled
          placeholder="질문을 입력하세요"
          className="h-12 min-w-0 flex-1 rounded-full border border-black/15 bg-transparent px-5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/20"
        />
        <button
          type="button"
          disabled
          className="h-12 rounded-full bg-foreground px-5 font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          보내기
        </button>
      </div>
    </section>
  );
}
