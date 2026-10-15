"use client";

// 처음 화면의 지도 카드 아래에 있는 작은 안내 카드. 누르면 EDCF 사업 단계별 체크리스트 팝업이 열린다.
type Props = {
  onOpen: () => void;
};

export default function EdcfBanner({ onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full max-w-[584px] items-center gap-4 rounded-2xl border border-zinc-200 bg-background p-3 text-left shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700"
    >
      <span
        className="flex h-16 w-32 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-3xl dark:bg-zinc-900"
        aria-hidden="true"
      >
        📋
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">EDCF 사업 단계별 체크리스트</span>
        <span className="block text-xs text-zinc-500 dark:text-zinc-400">
          사업 발굴부터 사후관리까지 단계별 업무·제출자료를 확인하고 체크하세요
        </span>
      </span>
    </button>
  );
}
