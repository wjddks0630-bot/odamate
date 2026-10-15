// Design Ref: §1 화면 상태별 문구 — PRD에 정해진 문구는 글자 그대로 쓴다.
import { MAX_FILES, MAX_PAGES, MAX_TOTAL_CHARS } from "./limits";

// PRD에 정해진 문구
export const UNSUPPORTED_FORMAT = "지원하지 않는 형식입니다";
export const UNREADABLE = "내용을 읽을 수 없습니다";

export const NO_DOCS_NOTICE = "먼저 문서를 올려주세요";
export const NOT_FOUND = "문서에서 찾을 수 없습니다";

// 아래는 PRD에 글자가 정해져 있지 않아 새로 정한 문구 (DESIGN 6장에서 확인 요청)
export const AI_ERROR = "답변을 가져오지 못했습니다. 다시 시도해 주세요";
export const THINKING = "답변을 만드는 중…";
export const CHAT_HINT = "궁금한 내용을 질문해 보세요";
export const SOURCE_LABEL = "출처";
export const CHECKED_LABEL = "확인한 문서";
export const COPY_LABEL = "복사";
export const COPIED_LABEL = "복사됨";
export const COPY_FAILED_LABEL = "복사 안 됨";
export const HWP_NOTICE = `${UNSUPPORTED_FORMAT}. 한글 프로그램에서 .hwpx로 다시 저장해 올려주세요`;
export const TOO_LARGE_FILE = "파일이 10MB를 넘습니다";
export const TOO_MANY_PAGES = `${MAX_PAGES}쪽을 넘습니다`;
export const TOO_MANY_FILES = `문서는 최대 ${MAX_FILES}개까지 올릴 수 있습니다`;
export const TOO_MANY_CHARS = `문서 글자 수가 너무 많습니다 (전체 합계 ${MAX_TOTAL_CHARS.toLocaleString("ko-KR")}자 이하)`;
