import HeatMap from "./HeatMap";
import PcaChart from "./PcaChart";
import HistogramChart from "./HistogramChart";
import type { JSX } from "react";
import KdeChart from "./KdeChart";
import ScatterPlot from "./ScatterPlot";
export type plotType = {
  name: string;
  icon: string;
  requiredColumn: number;
  component: (props: Record<string, any>) => JSX.Element;
};
export const chartList: plotType[] = [
  {
    name: "Scatter Plot",
    icon: "bubble_chart",
    requiredColumn: 2,
    component: ({ subset, datasetId }) => (
      <ScatterPlot subset={subset} datasetId={datasetId}></ScatterPlot>
    ),
  },
  {
    name: "Histogram",
    icon: "bar_chart",
    requiredColumn: 1,
    component: ({ columnName, max, datasetId }) => (
      <HistogramChart
        columnName={columnName}
        max={max}
        datasetId={datasetId}
      ></HistogramChart>
    ),
  },
  {
    name: "HeatMap",
    icon: "grid_view",
    requiredColumn: -1,
    component: ({ subset, datasetId }) => (
      <HeatMap subset={subset} datasetId={datasetId}></HeatMap>
    ),
  },
  {
    name: "Boxplot",
    icon: "candlestick_chart",
    requiredColumn: -1,
    component: ({ subset, datasetId }) => (
      <HeatMap subset={subset} datasetId={datasetId}></HeatMap>
    ),
  },
  {
    name: "Kde Chart",
    icon: "multiline_chart",
    requiredColumn: 1,
    component: ({ columnName, datasetId }) => (
      <KdeChart columnName={columnName} datasetId={datasetId}></KdeChart>
    ),
  },
  {
    name: "PCA Chart",
    icon: "insights",
    requiredColumn: 0,
    component: ({ datasetId }) => <PcaChart datasetId={datasetId}></PcaChart>,
  },
];
