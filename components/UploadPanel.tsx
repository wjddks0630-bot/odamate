// Design Ref: §1 화면 구성 ②문서 올리기 + ③올린 문서 목록
// Plan SC: PLAN 1번 — 업로드 영역 틀. 파일 선택·검사 동작은 PLAN 4번 이후에 붙인다.

export default function UploadPanel() {
  return (
    <section
      aria-labelledby="upload-title"
      className="flex flex-col gap-6 rounded-2xl border border-black/10 p-6 dark:border-white/15"
    >
      {/* ② 문서 올리기 */}
      <div className="flex flex-col gap-3">
        <h2 id="upload-title" className="text-xl font-semibold">
          문서 올리기
        </h2>
        <button
          type="button"
          disabled
          className="h-12 rounded-full bg-foreground px-5 font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          파일 선택
        </button>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>PDF, Word(.docx), 한글(.hwpx) 파일을 올릴 수 있습니다.</li>
          <li>파일 1개는 10MB 이하, 50쪽 이하입니다.</li>
          <li>한 번에 최대 5개까지 올릴 수 있습니다.</li>
        </ul>
      </div>

      {/* ③ 올린 문서 목록 */}
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold">올린 문서</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          아직 올린 문서가 없습니다.
        </p>
      </div>
    </section>
  );
}
