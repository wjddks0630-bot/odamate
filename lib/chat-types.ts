// Design Ref: §2.3 화면이 기억하는 정보 — 메시지 / §2.4 /api/chat 응답.

// "evidence": 답의 근거가 된 문서, "checked": 답을 못 찾아 확인만 한 문서 목록,
// "mixed": 문서를 근거로 하되 AI의 일반 지식으로 보충한 경우,
// "general": 문서 없이 AI의 일반 지식으로 답한 경우 (sources는 빈 배열)
export type SourceKind = "evidence" | "checked" | "mixed" | "general";

// 일반 질문 모드에서 이어지는 질문을 이해하도록 함께 보내는 이전 대화
export type ChatHistoryItem = { role: "user" | "assistant"; content: string };

export type ChatApiResponse = {
  answer: string;
  sourceKind: SourceKind;
  sources: string[];
};

export type ChatMessage =
  | { id: string; role: "user"; content: string }
  | ({ id: string; role: "assistant"; content: string } & Pick<ChatApiResponse, "sourceKind" | "sources">)
  | { id: string; role: "notice" | "error"; content: string };
