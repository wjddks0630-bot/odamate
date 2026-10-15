// Design Ref: §1 화면 구성 — 넓은 화면은 왼쪽 문서·오른쪽 대화, 좁은 화면은 위아래로 쌓는다.
// Design Ref: §3.5 — 문서·대화 상태는 이 컴포넌트가 들고 있게 될 자리다 (PLAN 12번 무렵).
import ChatPanel from "./ChatPanel";
import UploadPanel from "./UploadPanel";

export default function Workspace() {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <UploadPanel />
      <ChatPanel />
    </div>
  );
}
