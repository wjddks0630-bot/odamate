// Design Ref: §3.5 limits.ts — 업로드 제한값을 한 곳에 모은다 (서버 검사도 같은 값을 쓸 예정).
// Plan SC: 파일 1개 10MB·50쪽 이하, 최대 5개, 글자 수 합계 40만 자 이하.

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB 이하는 허용
export const MAX_PAGES = 50; // 50쪽 이하는 허용
export const MAX_FILES = 5; // 성공한 문서 기준 누적 5개
export const MAX_TOTAL_CHARS = 400_000; // 문서 전체 글자 수 합계 (잠정값)

// 서버(/api/chat)도 같은 값으로 다시 검사한다.
export const MAX_QUESTION_CHARS = 1_000; // 질문 길이 (잠정값)
export const MAX_DOC_NAME_CHARS = 200; // 문서 이름 길이 (잠정값)

// 문서 없이 묻는 일반 질문에서 함께 보내는 이전 대화 (비용을 줄이기 위해 최근 것만, 잠정값)
export const MAX_HISTORY_MESSAGES = 10; // 최근 메시지 10개
export const MAX_HISTORY_MESSAGE_CHARS = 4_000; // 메시지 1개 길이

// docx·hwpx는 쪽 수를 정확히 알 수 없어 글자 수로 근사한다 (한 쪽 약 1,500자, 잠정값).
export const CHARS_PER_PAGE = 1_500;

export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".hwpx"] as const;
export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];
