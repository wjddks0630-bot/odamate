"use client";

// EDCF(대외경제협력기금) 사업의 단계별 업무 체크리스트 팝업.
// 단계마다 해야 할 업무·제출자료·담당자·다음 단계 전 확인사항을 보여 주고, 체크 상태는 이 브라우저에만 저장한다.
// 내용(단계·업무)은 lib/edcf-stages.ts, 저장 방식은 lib/edcf-checklist.ts에 있다.
import { useEffect, useMemo, useRef, useState } from "react";
import { EDCF_NOTICE, EDCF_STAGES, type EdcfStage } from "@/lib/edcf-stages";
import {
  MAX_NAME_CHARS,
  MAX_OWNER_CHARS,
  MAX_PROJECTS,
  docKey,
  gateKey,
  loadState,
  newProject,
  saveState,
  taskKey,
  type ChecklistProject,
  type ChecklistState,
} from "@/lib/edcf-checklist";

type Props = {
  open: boolean;
  onClose: () => void;
};

// 한 단계에서 체크해야 하는 항목 번호를 모두 모은다 (업무 + 제출자료 + 다음 단계 전 확인사항).
function stageKeys(stage: EdcfStage): string[] {
  const keys: string[] = [];
  for (const task of stage.tasks) {
    keys.push(taskKey(task.id));
    task.documents.forEach((_, index) => keys.push(docKey(task.id, index)));
  }
  stage.beforeNext.forEach((_, index) => keys.push(gateKey(stage.id, index)));
  return keys;
}

const STAGE_KEYS = EDCF_STAGES.map(stageKeys);

const sub = "text-zinc-500 dark:text-zinc-400";
const inputClass =
  "rounded-lg border border-zinc-300 bg-background px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-600";

function Panel({ onClose }: { onClose: () => void }) {
  // 팝업이 열릴 때 처음 한 번만 저장된 내용을 읽는다.
  const [state, setState] = useState<ChecklistState>(loadState);
  const [stageIndex, setStageIndex] = useState(0);
  const [naming, setNaming] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);

  const project = state.projects.find((item) => item.id === state.currentId) ?? null;
  const stage = EDCF_STAGES[stageIndex];

  const update = (next: ChecklistState) => {
    setState(next);
    setSaveFailed(!saveState(next));
  };
  const updateProject = (change: (project: ChecklistProject) => ChecklistProject) => {
    if (!project) return;
    update({ ...state, projects: state.projects.map((item) => (item.id === project.id ? change(item) : item)) });
  };

  const toggle = (key: string) =>
    updateProject((item) => {
      const checked = { ...item.checked };
      if (checked[key]) delete checked[key];
      else checked[key] = true;
      return { ...item, checked };
    });
  const setOwner = (taskId: string, value: string) =>
    updateProject((item) => ({ ...item, owners: { ...item.owners, [taskId]: value.slice(0, MAX_OWNER_CHARS) } }));

  const addProject = () => {
    const created = newProject(draftName);
    update({ projects: [...state.projects, created], currentId: created.id });
    setDraftName("");
    setNaming(false);
    setStageIndex(0);
  };
  const removeProject = () => {
    if (!project) return;
    if (!window.confirm(`「${project.name}」 사업의 체크 기록을 지울까요?\n(이 브라우저에 저장된 기록만 지워지며 되돌릴 수 없습니다)`)) return;
    const projects = state.projects.filter((item) => item.id !== project.id);
    update({ projects, currentId: projects[0]?.id ?? null });
  };

  // 단계별 진행 상황
  const progress = useMemo(
    () =>
      STAGE_KEYS.map((keys) => {
        const done = project ? keys.filter((key) => project.checked[key]).length : 0;
        return { done, total: keys.length, complete: keys.length > 0 && done === keys.length };
      }),
    [project],
  );
  const stageDone = progress[stageIndex];
  const remaining = stageDone.total - stageDone.done;
  const isLast = stageIndex === EDCF_STAGES.length - 1;

  return (
    <div className="flex flex-col gap-4 p-5 sm:p-7">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h2 id="edcf-title" className="text-2xl font-semibold">
            📋 EDCF 사업 단계별 체크리스트
          </h2>
          <p className={`mt-1 text-sm ${sub}`}>
            사업 단계마다 해야 할 업무와 제출자료를 확인하고, 끝낸 일은 체크해 두세요.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <span aria-hidden="true">×</span>
        </button>
      </header>

      {/* 사업 고르기·추가 */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">
        {state.projects.length > 0 && !naming && (
          <>
            <label htmlFor="edcf-project" className="text-sm font-medium">
              사업
            </label>
            <select
              id="edcf-project"
              value={state.currentId ?? ""}
              onChange={(event) => update({ ...state, currentId: event.target.value })}
              className={`${inputClass} min-w-0 max-w-full flex-1 sm:flex-none`}
            >
              {state.projects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </>
        )}
        {naming ? (
          <form
            className="flex w-full flex-wrap items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              addProject();
            }}
          >
            <label htmlFor="edcf-new-name" className="text-sm font-medium">
              사업 이름
            </label>
            <input
              id="edcf-new-name"
              autoFocus
              value={draftName}
              maxLength={MAX_NAME_CHARS}
              onChange={(event) => setDraftName(event.target.value)}
              placeholder="예: ○○국 상수도 사업"
              className={`${inputClass} min-w-0 flex-1`}
            />
            <button type="submit" className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-500">
              만들기
            </button>
            <button
              type="button"
              onClick={() => setNaming(false)}
              className="rounded-lg px-3 py-1.5 text-sm hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              취소
            </button>
          </form>
        ) : (
          <>
            {state.projects.length < MAX_PROJECTS && (
              <button
                type="button"
                onClick={() => setNaming(true)}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
              >
                ＋ 새 사업
              </button>
            )}
            {project && (
              <button
                type="button"
                onClick={removeProject}
                className="ml-auto rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-zinc-100 dark:text-red-400 dark:hover:bg-zinc-800"
              >
                이 사업 기록 지우기
              </button>
            )}
          </>
        )}
      </div>

      {saveFailed && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          이 브라우저에 저장하지 못했습니다. 지금 체크한 내용은 창을 닫으면 사라질 수 있습니다.
        </p>
      )}

      {!project ? (
        <p className={`rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm dark:border-zinc-600 ${sub}`}>
          먼저 「＋ 새 사업」으로 사업 이름을 정해 주세요. 사업마다 따로 진행 상황이 저장됩니다.
        </p>
      ) : (
        <>
          {/* 단계 이동 */}
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {EDCF_STAGES.map((item, index) => {
              const info = progress[index];
              const current = index === stageIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setStageIndex(index)}
                    aria-current={current ? "step" : undefined}
                    className={`flex h-full w-full flex-col gap-0.5 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                      current
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                        : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                    }`}
                  >
                    <span className={`text-xs ${sub}`}>{index + 1}단계</span>
                    <span className="font-medium">
                      {info.complete && <span aria-label="완료">✅ </span>}
                      {item.name}
                    </span>
                    <span className={`text-xs ${sub}`}>
                      {info.done}/{info.total}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* 선택한 단계 */}
          <section aria-labelledby="edcf-stage-title" className="flex flex-col gap-4">
            <div>
              <h3 id="edcf-stage-title" className="text-lg font-semibold">
                {stageIndex + 1}단계 · {stage.name}
              </h3>
              <p className={`text-sm ${sub}`}>{stage.summary}</p>
            </div>

            <ul className="flex flex-col gap-3">
              {stage.tasks.map((task) => {
                const done = Boolean(project.checked[taskKey(task.id)]);
                return (
                  <li key={task.id} className="flex flex-col gap-2 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggle(taskKey(task.id))}
                        className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
                      />
                      <span className={done ? "text-zinc-500 line-through dark:text-zinc-400" : "font-medium"}>{task.title}</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pl-7 text-sm">
                      <span className={sub}>주관: {task.who}</span>
                      <label className="flex items-center gap-2">
                        <span className={sub}>담당자</span>
                        <input
                          value={project.owners[task.id] ?? ""}
                          maxLength={MAX_OWNER_CHARS}
                          onChange={(event) => setOwner(task.id, event.target.value)}
                          placeholder="이름"
                          className={`${inputClass} w-32`}
                        />
                      </label>
                      {done && !project.owners[task.id]?.trim() && (
                        <span className="text-xs text-amber-700 dark:text-amber-400">담당자를 적어 두세요</span>
                      )}
                    </div>
                    {task.documents.length > 0 && (
                      <div className="pl-7 text-sm">
                        <p className={`mb-1 text-xs ${sub}`}>제출자료</p>
                        <ul className="flex flex-col gap-1">
                          {task.documents.map((document, index) => (
                            <li key={document}>
                              <label className="flex items-start gap-2">
                                <input
                                  type="checkbox"
                                  checked={Boolean(project.checked[docKey(task.id, index)])}
                                  onChange={() => toggle(docKey(task.id, index))}
                                  className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                                />
                                <span>{document}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* 다음 단계로 넘어가기 전 확인사항 */}
            <div className="flex flex-col gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/40">
              <h4 className="font-semibold">{isLast ? "마무리 전에 확인할 사항" : "다음 단계로 넘어가기 전에 확인할 사항"}</h4>
              <ul className="flex flex-col gap-1.5 text-sm">
                {stage.beforeNext.map((text, index) => (
                  <li key={text}>
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(project.checked[gateKey(stage.id, index)])}
                        onChange={() => toggle(gateKey(stage.id, index))}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                      />
                      <span>{text}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                {!isLast && (
                  <button
                    type="button"
                    disabled={remaining > 0}
                    onClick={() => setStageIndex(stageIndex + 1)}
                    className="rounded-full bg-blue-600 px-4 py-1.5 text-sm text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
                  >
                    다음 단계로 → {EDCF_STAGES[stageIndex + 1].name}
                  </button>
                )}
                <p role="status" className="text-sm">
                  {remaining > 0
                    ? `아직 체크하지 않은 항목이 ${remaining}개 있습니다.`
                    : isLast
                      ? "이 단계의 모든 항목을 확인했습니다."
                      : "이 단계를 마쳤습니다. 다음 단계로 넘어가도 됩니다."}
                </p>
              </div>
            </div>

            {stage.note && <p className={`text-sm ${sub}`}>※ 확인하지 못한 부분: {stage.note}</p>}

            <p className={`text-xs ${sub}`}>
              자료 기준: {stage.asOf}.{" "}
              {stage.sources.map((url, index) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline dark:text-blue-300">
                  출처{stage.sources.length > 1 ? index + 1 : ""} ↗
                </a>
              ))}
            </p>
          </section>
        </>
      )}

      <p className={`border-t border-zinc-200 pt-3 text-xs dark:border-zinc-700 ${sub}`}>
        {EDCF_NOTICE} 체크한 내용은 이 브라우저에만 저장되며 서버로 보내지 않습니다. 다른 컴퓨터나 다른 브라우저에서는 보이지 않습니다.
      </p>
    </div>
  );
}

export default function EdcfChecklistDialog({ open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // open 값에 맞춰 팝업을 열고 닫는다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="edcf-title"
      className="m-auto w-[min(1000px,94vw)] max-h-[92vh] overflow-y-auto rounded-3xl border border-zinc-200 bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/50 dark:border-zinc-700"
    >
      {/* 열려 있을 때만 그려서, 열 때마다 저장된 내용을 새로 읽는다 */}
      {open && <Panel onClose={onClose} />}
    </dialog>
  );
}
