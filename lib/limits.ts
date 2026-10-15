// Design Ref: §3.5 limits.ts — 업로드 제한값을 한 곳에 모은다 (서버 검사도 같은 값을 쓸 예정).
// Plan SC: 파일 1개 10MB·50쪽 이하, 최대 5개, 글자 수 합계 40만 자 이하.

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB 이하는 허용
export const MAX_PAGES = 50; // 50쪽 이하는 허용
export const MAX_FILES = 5; // 성공한 문서 기준 누적 5개
export const MAX_TOTAL_CHARS = 400_000; // 문서 전체 글자 수 합계 (잠정값)

// docx·hwpx는 쪽 수를 정확히 알 수 없어 글자 수로 근사한다 (한 쪽 약 1,500자, 잠정값).
export const CHARS_PER_PAGE = 1_500;

export const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".hwpx"] as const;
export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];
