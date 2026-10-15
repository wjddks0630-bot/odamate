"use client";

// 대한민국이 공적개발원조(ODA)로 함께하는 나라들을 세계지도에 표시하고, 나라를 누르면 소개를 보여주는 팝업.
// 네이티브 <dialog>를 써서 Esc로 닫기·키보드 포커스 가둠·뒷배경 처리를 브라우저가 맡게 한다.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AID_BY_ID,
  AID_COUNTRIES,
  ODA_KOREA_URL,
  REGION_NAMES,
  TIER_NAMES,
  wikipediaUrl,
  type AidCountry,
  type AidRegion,
} from "@/lib/aid-countries";
import { AID_SUPPORT } from "@/lib/aid-projects";
import { MAP_HEIGHT, MAP_WIDTH, type WorldMap } from "@/lib/world-map";

type Props = {
  open: boolean;
  worldMap: WorldMap | null;
  onClose: () => void;
};

const PRIORITY_COUNT = AID_COUNTRIES.filter((country) => country.tier === "priority").length;
const PARTNER_COUNT = AID_COUNTRIES.length - PRIORITY_COUNT;
const REGION_ORDER: AidRegion[] = ["asia", "cis", "pacific", "latin", "africa"];

const fillFor = (country: AidCountry, selected: boolean) =>
  selected
    ? "fill-amber-400 stroke-amber-700"
    : country.tier === "priority"
      ? "fill-blue-600 stroke-white hover:fill-blue-500"
      : "fill-blue-300 stroke-white hover:fill-blue-400";

// 대한민국이 그 나라에 지원하는 사업. 조사한 자료(중점협력국)가 있을 때만 내용을 보여 준다.
function SupportSection({ country }: { country: AidCountry }) {
  const support = AID_SUPPORT[country.id];
  const sub = "text-zinc-500 dark:text-zinc-400";
  if (!support) {
    return (
      <section className="rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
        <h4 className="mb-1 font-semibold">대한민국의 지원 사업</h4>
        <p className={sub}>이 나라의 지원 사업은 아직 정리하지 못했습니다. 아래 ODA Korea에서 확인해 주세요.</p>
      </section>
    );
  }
  const empty = support.projects.length === 0 && support.fields.length === 0;
  return (
    <section className="flex flex-col gap-2 rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
      <h4 className="font-semibold">대한민국의 지원 사업</h4>
      {support.fields.length > 0 && (
        <p>
          <span className={sub}>중점 분야 </span>
          {support.fields.join(" · ")}
        </p>
      )}
      {support.projects.length > 0 && (
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          {support.projects.map((project) => (
            <li key={project.title}>
              {project.title}
              {project.detail && <span className={sub}> — {project.detail}</span>}
            </li>
          ))}
        </ul>
      )}
      {empty && <p className={sub}>확인된 지원 사업 정보가 없습니다.</p>}
      {support.note && <p className={sub}>{support.note}</p>}
      <p className={`text-xs ${sub}`}>
        자료 기준: {support.asOf}.{" "}
        {support.sources.map((url, index) => (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline dark:text-blue-300">
            출처{support.sources.length > 1 ? index + 1 : ""} ↗
          </a>
        ))}{" "}
        사업은 자주 바뀌므로 최신 내용은 ODA Korea에서 확인하세요.
      </p>
    </section>
  );
}

function CountryIntro({ country }: { country: AidCountry }) {
  const link =
    "rounded-full border border-zinc-300 px-4 py-1.5 text-sm text-blue-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-blue-300 dark:hover:bg-zinc-800";
  return (
    <article aria-live="polite" className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-700">
      <header className="flex items-center gap-3">
        <div>
          <h3 className="text-xl font-semibold">{country.name}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{country.en}</p>
        </div>
        <span
          className={`ml-auto rounded-full px-3 py-1 text-xs ${
            country.tier === "priority"
              ? "bg-blue-600 text-white"
              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
          }`}
        >
          {TIER_NAMES[country.tier]}
        </span>
      </header>
      <dl className="grid grid-cols-[5rem_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-zinc-500 dark:text-zinc-400">지역</dt>
        <dd>{REGION_NAMES[country.region]}</dd>
        <dt className="text-zinc-500 dark:text-zinc-400">수도</dt>
        <dd>{country.capital}</dd>
        <dt className="text-zinc-500 dark:text-zinc-400">공용어</dt>
        <dd>{country.languages}</dd>
        <dt className="text-zinc-500 dark:text-zinc-400">대한민국과의 관계</dt>
        <dd>
          {country.tier === "priority"
            ? "대한민국 공적개발원조(ODA)의 중점협력국입니다. 개발원조 예산의 큰 부분이 중점협력국에 쓰입니다."
            : "대한민국 공적개발원조(ODA)를 함께하는 협력국입니다."}
        </dd>
      </dl>
      <SupportSection country={country} />
      <div className="flex flex-wrap gap-2">
        <a href={wikipediaUrl(country)} target="_blank" rel="noopener noreferrer" className={link}>
          {country.name} 더 알아보기 (위키백과) ↗
        </a>
        <a href={ODA_KOREA_URL} target="_blank" rel="noopener noreferrer" className={link}>
          ODA Korea에서 협력 사업 보기 ↗
        </a>
      </div>
    </article>
  );
}

export default function AidMapDialog({ open, worldMap, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const introRef = useRef<HTMLDivElement>(null);

  // open 값에 맞춰 팝업을 열고 닫는다.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const select = (id: string) => {
    setSelectedId(id);
    // 좁은 화면에서도 소개가 바로 보이도록 내려 준다.
    requestAnimationFrame(() => introRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  };

  const selected = selectedId ? AID_BY_ID[selectedId] : undefined;
  // 지도에 모양이 없거나 너무 작은 섬나라는 점으로도 표시한다.
  const dots = useMemo(() => {
    if (!worldMap) return [];
    return AID_COUNTRIES.flatMap((country) => {
      const point = country.marker ? worldMap.project(country.marker) : null;
      return point ? [{ country, x: point[0], y: point[1] }] : [];
    });
  }, [worldMap]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // 팝업 바깥(어두운 배경)을 누르면 닫는다.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="aid-map-title"
      className="m-auto w-[min(1100px,94vw)] max-h-[92vh] overflow-y-auto rounded-3xl border border-zinc-200 bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/50 dark:border-zinc-700"
    >
      <div className="flex flex-col gap-4 p-5 sm:p-7">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="aid-map-title" className="text-2xl font-semibold">
              🌏 대한민국이 함께하는 나라들
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              대한민국은 공적개발원조(ODA)로 {AID_COUNTRIES.length}개 나라와 협력하고 있습니다. 지도에서 나라를 눌러 보세요.
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

        <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <li className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm bg-blue-600" aria-hidden="true" />
            중점협력국 {PRIORITY_COUNT}
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm bg-blue-300" aria-hidden="true" />
            협력국 {PARTNER_COUNT}
          </li>
          <li className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <span className="inline-block h-3 w-3 rounded-sm bg-zinc-200 dark:bg-zinc-700" aria-hidden="true" />
            그 밖의 나라
          </li>
        </ul>

        {/* 세계지도 */}
        <div className="overflow-hidden rounded-2xl bg-sky-50 dark:bg-zinc-900">
          {worldMap ? (
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              role="group"
              aria-label="세계지도: 대한민국 ODA 협력국"
              className="block h-auto w-full"
            >
              {worldMap.shapes.map((shape) => {
                const country = AID_BY_ID[shape.id];
                if (!country) {
                  return (
                    <path key={shape.id + shape.d.length} d={shape.d} className="fill-zinc-200 stroke-white dark:fill-zinc-700 dark:stroke-zinc-900" strokeWidth={0.4} />
                  );
                }
                return (
                  <path
                    key={shape.id}
                    d={shape.d}
                    role="button"
                    tabIndex={0}
                    aria-label={`${country.name} 소개 보기`}
                    aria-pressed={selectedId === country.id}
                    onClick={() => select(country.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        select(country.id);
                      }
                    }}
                    className={`cursor-pointer outline-none transition-colors focus-visible:stroke-amber-600 ${fillFor(country, selectedId === country.id)}`}
                    strokeWidth={selectedId === country.id ? 1.5 : 0.5}
                  >
                    <title>{country.name}</title>
                  </path>
                );
              })}
              {/* 너무 작거나 지도에 없는 섬나라 */}
              {dots.map(({ country, x, y }) => (
                <circle
                  key={country.id}
                  cx={x}
                  cy={y}
                  r={selectedId === country.id ? 7 : 5}
                  role="button"
                  tabIndex={0}
                  aria-label={`${country.name} 소개 보기`}
                  onClick={() => select(country.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      select(country.id);
                    }
                  }}
                  className={`cursor-pointer outline-none ${fillFor(country, selectedId === country.id)}`}
                  strokeWidth={1.5}
                >
                  <title>{country.name}</title>
                </circle>
              ))}
            </svg>
          ) : (
            <p className="flex aspect-[1000/520] items-center justify-center text-sm text-zinc-500">지도를 불러오는 중…</p>
          )}
        </div>

        {/* 선택한 나라 소개 */}
        <div ref={introRef}>
          {selected ? (
            <CountryIntro country={selected} />
          ) : (
            <p className="rounded-2xl border border-dashed border-zinc-300 p-5 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              지도에서 나라를 누르면 그 나라의 소개가 여기에 나옵니다.
            </p>
          )}
        </div>

        {/* 지도에서 찾기 어려운 나라도 고를 수 있는 목록 (키보드·화면 읽기 프로그램 사용자에게도 편하다) */}
        <details className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700">
          <summary className="cursor-pointer text-sm font-medium">나라 목록에서 고르기</summary>
          <div className="mt-3 flex flex-col gap-3">
            {REGION_ORDER.map((region) => (
              <section key={region}>
                <h3 className="mb-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">{REGION_NAMES[region]}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {AID_COUNTRIES.filter((country) => country.region === region).map((country) => (
                    <li key={country.id}>
                      <button
                        type="button"
                        onClick={() => select(country.id)}
                        className={`rounded-full px-3 py-1 text-sm ${
                          country.tier === "priority"
                            ? "bg-blue-600 text-white hover:bg-blue-500"
                            : "bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-100"
                        } ${selectedId === country.id ? "ring-2 ring-amber-500" : ""}`}
                      >
                        {country.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </details>

        <footer className="text-xs text-zinc-500 dark:text-zinc-400">
          2021~2025년 기준입니다. 협력국 명단은{" "}
          <a href={ODA_KOREA_URL} target="_blank" rel="noopener noreferrer" className="underline">
            ODA Korea
          </a>
          와 KOICA 자료를 따랐고, 앞으로 바뀔 수 있습니다. 지도 자료는 Natural Earth(공개 자료)입니다.
        </footer>
      </div>
    </dialog>
  );
}
