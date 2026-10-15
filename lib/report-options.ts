// 보고서 작성 도우미의 선택 항목 — 화면과 서버가 같이 쓴다.

// 1) 보고서 작성 목적 (사용자가 "공문, 발표용 등"이라고 한 예시에 몇 가지를 더했다)
export const REPORT_PURPOSES = [
  { code: "official", ko: "공문" },
  { code: "presentation", ko: "발표용" },
  { code: "work", ko: "업무 보고서" },
  { code: "minutes", ko: "회의록" },
  { code: "press", ko: "보도자료" },
] as const;

// 2) 언어 (한국어, 영어, 중국어, 일본어). placeholder는 적지 않은 항목을 남겨 둘 때 쓰는 빈칸 표시다.
export const REPORT_LANGUAGES = [
  { code: "ko", ko: "한국어", native: "한국어", name: "Korean", placeholder: "[입력 필요]" },
  { code: "en", ko: "영어", native: "English", name: "English", placeholder: "[To be provided]" },
  { code: "zh", ko: "중국어", native: "简体中文", name: "Simplified Chinese", placeholder: "[待提供]" },
  { code: "ja", ko: "일본어", native: "日本語", name: "Japanese", placeholder: "[未記入]" },
] as const;

export type ReportPurpose = (typeof REPORT_PURPOSES)[number]["code"];
export type ReportLanguage = (typeof REPORT_LANGUAGES)[number]["code"];

export const MAX_REPORT_CONTENT_CHARS = 3_000; // 자유롭게 쓰는 내용의 길이 (잠정값)
