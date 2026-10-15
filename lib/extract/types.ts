// 글자 뽑기 결과와, 사용자에게 그대로 보여줄 수 있는 이유를 담은 오류.

export type Extracted = { text: string; pages: number };

export class ExtractError extends Error {
  // message를 화면에 그대로 보여준다 (내부 오류 내용은 담지 않는다).
}
