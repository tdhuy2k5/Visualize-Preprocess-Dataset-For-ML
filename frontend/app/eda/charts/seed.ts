import type { heatMapType, histogramChartType } from "./api";
export const heatMap: heatMapType = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  matrix: [
    [1.2, 2.3, 3.1, 2.0, 4.5],
    [2.1, 3.4, 1.5, 2.2, 3.3],
    [0.5, 1.8, 2.6, 3.9, 2.7],
    [3.2, 2.9, 4.1, 1.7, 2.5],
    [4.0, 3.3, 2.2, 2.8, 1.9],
  ],
};
export const histogramChart: histogramChartType = {
  column: "response_time_ms",
  bins: 6,
  histogram: [
    { bin_start: 0, bin_end: 50, count: 40 },
    { bin_start: 50, bin_end: 100, count: 70 },
    { bin_start: 100, bin_end: 150, count: 55 },
    { bin_start: 150, bin_end: 200, count: 30 },
    { bin_start: 200, bin_end: 300, count: 10 },
    { bin_start: 300, bin_end: 500, count: 3 },
  ],
};
