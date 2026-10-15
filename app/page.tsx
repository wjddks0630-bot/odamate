// Design Ref: §1 화면 구성 ①제목 — 한 페이지(/)에 제목과 작업 공간만 둔다.
import Workspace from "@/components/Workspace";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10">
      <h1 className="text-5xl font-bold tracking-tight">인턴 도우미</h1>
      <Workspace />
    </main>
  );
}
