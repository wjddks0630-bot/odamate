// Design Ref: §2.3 화면이 기억하는 정보 — 문서 (서버·DB에 저장하지 않고 화면 메모리에만 둔다).

export type OkDoc = {
  id: string;
  name: string;
  status: "ok";
  text: string;
  pages: number;
  // 다른 사람이 내보낸 문서 묶음(공유 파일)에서 가져온 문서. 원본 파일이 아니라 만든 사람이 준 글자라는 표시다.
  imported?: true;
};

export type UploadedDoc = OkDoc | { id: string; name: string; status: "error"; reason: string };
