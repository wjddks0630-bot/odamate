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
export const SUMMARIZE_LABEL = "요약";
export const ASK_LABEL = "질문하기";
export const PICK_LABEL = "파일 선택";
export const DROP_HINT = "여기에 놓으면 올라갑니다";
export const STORAGE_NOTICE = "올린 문서는 서버에 저장되지 않으며, 새로고침하면 사라집니다";
// 앱 이름(화면 제목·브라우저 탭 제목). 바꾸려면 여기 한 곳만 고친다.
export const APP_NAME = "Intern Helper";
export const LOGIN_PROMPT = "접속 비밀번호";
export const LOGIN_BUTTON = "입장";
export const LOGIN_WRONG = "비밀번호가 맞지 않습니다";
export const LOGIN_TOO_MANY = "시도가 너무 많습니다. 잠시 후 다시 해 주세요";
export const LOGIN_EXPIRED = "접속이 끊겼습니다. 비밀번호를 다시 입력해 주세요";
export const LOGIN_NOT_CONFIGURED = "접속 비밀번호가 설정되지 않았습니다 (.env 파일의 ACCESS_PASSWORD)";
export const NETWORK_ERROR = "연결에 실패했습니다. 인터넷 연결을 확인해 주세요";
export const LOGOUT_LABEL = "로그아웃";
export const SHARE_EXPORT_LABEL = "문서 묶음 내보내기";
export const SHARE_IMPORT_LABEL = "문서 묶음 가져오기";
export const IMPORTED_LABEL = "가져옴";
export const BUNDLE_INVALID = "공유 파일이 올바르지 않습니다";
export const SHARE_EXPORT_CONFIRM =
  "내보내는 파일에는 올린 문서의 내용이 글자 그대로 들어 있습니다.\n대외비·개인정보가 들어 있는 문서는 공유하지 마세요.\n\n파일을 만들까요?";
export const SHARE_HINT =
  "문서 묶음 파일(.json)로 다른 사람과 문서를 나눌 수 있습니다. 가져온 문서는 만든 사람이 내용을 바꿀 수 있으니 믿을 수 있는 사람의 파일만 가져오세요.";
export const summaryRequest = (docName: string) => `「${docName}」 문서를 요약해 주세요`;
export const HWP_NOTICE = `${UNSUPPORTED_FORMAT}. 한글 프로그램에서 .hwpx로 다시 저장해 올려주세요`;
export const TOO_LARGE_FILE = "파일이 10MB를 넘습니다";
export const TOO_MANY_PAGES = `${MAX_PAGES}쪽을 넘습니다`;
export const TOO_MANY_FILES = `문서는 최대 ${MAX_FILES}개까지 올릴 수 있습니다`;
export const TOO_MANY_CHARS = `문서 글자 수가 너무 많습니다 (전체 합계 ${MAX_TOTAL_CHARS.toLocaleString("ko-KR")}자 이하)`;
