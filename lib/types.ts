// Design Ref: §2.3 화면이 기억하는 정보 — 문서 (서버·DB에 저장하지 않고 화면 메모리에만 둔다).

export type UploadedDoc =
  | { id: string; name: string; status: "ok"; text: string; pages: number }
  | { id: string; name: string; status: "error"; reason: string };
