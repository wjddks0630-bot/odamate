// EDCF 사업 단계별 체크리스트의 저장 상태 — 이 브라우저(localStorage)에만 저장하고 서버로 보내지 않는다.
// 사업(프로젝트)마다 체크 여부와 업무 담당자 이름을 기억한다. 저장된 값은 믿지 않고 읽을 때마다 모양을 검사한다.

export const STORAGE_KEY = "tasky-edcf-checklist-v1";
export const MAX_PROJECTS = 20;
export const MAX_NAME_CHARS = 60;
export const MAX_OWNER_CHARS = 30;

export type ChecklistProject = {
  id: string;
  name: string;
  checked: Record<string, true>; // 체크한 항목 번호 (업무·제출자료·확인사항)
  owners: Record<string, string>; // 업무 번호 → 담당자
};

export type ChecklistState = {
  projects: ChecklistProject[];
  currentId: string | null;
};

// 항목 번호 만들기: 업무 t.<업무>, 제출자료 d.<업무>.<번호>, 다음 단계 전 확인사항 g.<단계>.<번호>
export const taskKey = (taskId: string) => `t.${taskId}`;
export const docKey = (taskId: string, index: number) => `d.${taskId}.${index}`;
export const gateKey = (stageId: string, index: number) => `g.${stageId}.${index}`;

export const newProject = (name: string): ChecklistProject => ({
  id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  name: name.trim().slice(0, MAX_NAME_CHARS) || "새 사업",
  checked: {},
  owners: {},
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function parseProject(raw: unknown): ChecklistProject | null {
  if (!isRecord(raw) || typeof raw.id !== "string" || typeof raw.name !== "string") return null;
  const checked: Record<string, true> = {};
  if (isRecord(raw.checked)) {
    for (const [key, value] of Object.entries(raw.checked)) {
      if (value === true && key.length < 80) checked[key] = true;
    }
  }
  const owners: Record<string, string> = {};
  if (isRecord(raw.owners)) {
    for (const [key, value] of Object.entries(raw.owners)) {
      if (typeof value === "string" && key.length < 80) owners[key] = value.slice(0, MAX_OWNER_CHARS);
    }
  }
  return { id: raw.id.slice(0, 40), name: raw.name.slice(0, MAX_NAME_CHARS), checked, owners };
}

export function loadState(): ChecklistState {
  const empty: ChecklistState = { projects: [], currentId: null };
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (!text) return empty;
    const raw: unknown = JSON.parse(text);
    if (!isRecord(raw) || !Array.isArray(raw.projects)) return empty;
    const projects = raw.projects.slice(0, MAX_PROJECTS).flatMap((item) => {
      const project = parseProject(item);
      return project ? [project] : [];
    });
    const currentId =
      typeof raw.currentId === "string" && projects.some((project) => project.id === raw.currentId)
        ? raw.currentId
        : (projects[0]?.id ?? null);
    return { projects, currentId };
  } catch {
    return empty; // 저장소를 못 쓰는 환경(시크릿 창 등)이거나 값이 깨졌으면 빈 상태로 시작
  }
}

// 저장에 실패하면 false (이 경우 화면에 안내한다)
export function saveState(state: ChecklistState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
