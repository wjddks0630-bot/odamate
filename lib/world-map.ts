// 세계지도 그리기 (브라우저 전용): world-atlas의 나라 경계 자료를 SVG 길(path)로 바꾼다.
// 지도 자료(Natural Earth 기반, 공개 자료)는 지도를 처음 열 때만 불러온다.
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 520;

export type MapShape = { id: string; name: string; d: string };

export type WorldMap = {
  shapes: MapShape[];
  // 경도·위도를 지도 위의 좌표로 바꾼다 (너무 작은 섬나라의 점 표시에 쓴다)
  project: (lonLat: [number, number]) => [number, number] | null;
};

let cached: Promise<WorldMap> | undefined;

export function loadWorldMap(): Promise<WorldMap> {
  cached ??= (async () => {
    const topology = (await import("world-atlas/countries-50m.json")).default as unknown as Topology;
    const countries = feature(topology, topology.objects.countries as GeometryCollection);

    // 남극대륙은 빼서 나머지 대륙이 더 크게 보이게 한다.
    const land = countries.features.filter((item) => item.id !== "010");
    const projection = geoNaturalEarth1().fitExtent(
      [
        [8, 8],
        [MAP_WIDTH - 8, MAP_HEIGHT - 8],
      ],
      { type: "FeatureCollection", features: land },
    );
    const toPath = geoPath(projection);

    const shapes: MapShape[] = [];
    for (const item of land) {
      const d = toPath(item);
      if (d && item.id !== undefined) {
        const properties = item.properties as { name?: string } | null;
        shapes.push({ id: String(item.id), name: properties?.name ?? "", d });
      }
    }
    return { shapes, project: (lonLat) => projection(lonLat) };
  })();
  return cached;
}
