"use client";

// 처음 화면의 제목 아래에 늘 보이는 작은 안내 카드. 누르면 세계지도 팝업이 열린다.
// 안의 작은 지도는 협력국만 파랗게 칠해 한눈에 보여준다.
import { AID_BY_ID, AID_COUNTRIES } from "@/lib/aid-countries";
import { MAP_HEIGHT, MAP_WIDTH, type WorldMap } from "@/lib/world-map";

type Props = {
  worldMap: WorldMap | null;
  onOpen: () => void;
};

export default function AidMapBanner({ worldMap, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full max-w-[584px] items-center gap-4 rounded-2xl border border-zinc-200 bg-background p-3 text-left shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700"
    >
      <span className="block w-32 shrink-0 overflow-hidden rounded-lg bg-sky-50 dark:bg-zinc-900" aria-hidden="true">
        {worldMap ? (
          <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="block h-auto w-full">
            {worldMap.shapes.map((shape) => {
              const country = AID_BY_ID[shape.id];
              return (
                <path
                  key={shape.id + shape.d.length}
                  d={shape.d}
                  className={
                    country
                      ? country.tier === "priority"
                        ? "fill-blue-600"
                        : "fill-blue-300"
                      : "fill-zinc-200 dark:fill-zinc-700"
                  }
                />
              );
            })}
          </svg>
        ) : (
          <span className="flex aspect-[1000/520] items-center justify-center text-2xl">🌏</span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium">🌏 대한민국이 함께하는 나라들</span>
        <span className="block text-xs text-zinc-500 dark:text-zinc-400">
          개발도상국 {AID_COUNTRIES.length}곳 · 지도에서 나라를 눌러 소개를 보세요
        </span>
      </span>
    </button>
  );
}
