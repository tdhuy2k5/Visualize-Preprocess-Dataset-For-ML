import type { columnStat } from "../api";
import type { histogramChartType } from "./api";

export function formatMatrix(
  matrix: number[][] | null,
): [number, number, number][] {
  if (!matrix) {
    return [[0, 0, 0]];
  }
  const result: [number, number, number][] = [];
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      result.push([i, j, Math.round(matrix[i][j] * 100) / 100]);
    }
  }
  return result;
}
export function formatHistogramChart(
  chart: histogramChartType | null,
): [string, number][] {
  if (!chart) {
    return [["-", 0]];
  }
  return chart.histogram.map((row) => [
    ((row.bin_end + row.bin_start) / 2).toFixed(2),
    row.count,
  ]);
}
export function getCssVar(name: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}
export function rangingColor(a: string, b: string, n: number) {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);

  const ar = ah >> 16,
    ag = (ah >> 8) & 255,
    ab = ah & 255;
  const br = bh >> 16,
    bg = (bh >> 8) & 255,
    bb = bh & 255;

  return Array.from({ length: n }, (_, i) => {
    const t = n === 1 ? 0 : i / (n - 1);

    const r = Math.round(ar + (br - ar) * t);
    const g = Math.round(ag + (bg - ag) * t);
    const b = Math.round(ab + (bb - ab) * t);

    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  });
}
export type typeListType = {
  name: string;
  type: string;
};
export function createTypeList(
  columns: Record<string, columnStat>,
): typeListType[] {
  return Object.keys(columns).map((key) => ({
    name: key,
    type: columns[key].type,
  }));
}
