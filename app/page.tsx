// Design Ref: §1 화면 구성 — 한 페이지(/)에 작업 공간만 둔다. 제목은 작업 공간 안에서 상태에 따라 크기가 바뀐다.
import Workspace from "@/components/Workspace";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Workspace />
    </main>
  );
}
