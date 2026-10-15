// Design Ref: §2.3 화면이 기억하는 정보 — 메시지 / §2.4 /api/chat 응답.

// "evidence": 답의 근거가 된 문서, "checked": 답을 못 찾아 확인만 한 문서 목록
export type SourceKind = "evidence" | "checked";

export type ChatApiResponse = {
  answer: string;
  sourceKind: SourceKind;
  sources: string[];
};

export type ChatMessage =
  | { id: string; role: "user"; content: string }
  | ({ id: string; role: "assistant"; content: string } & Pick<ChatApiResponse, "sourceKind" | "sources">)
  | { id: string; role: "notice" | "error"; content: string };
