import { getData } from "~/api";
import { apiUrl } from "~/api";
export type histogramChartType = {
  column: string;
  bins: number;
  histogram: {
    bin_start: number;
    bin_end: number;
    count: number;
  }[];
};

export async function getHistogramChart(
  columnName: string,
  datasetId: string,
): Promise<histogramChartType | null> {
  const param = new URLSearchParams({
    column_name: columnName,
    dataset_id: datasetId,
  });
  const prefix = `/dataset/charts/histogram?${param}`;
  return await getData<histogramChartType>(apiUrl + prefix);
}

export type heatMapType = {
  labels: string[];
  matrix: number[][];
};
export async function getHeatMap(
  subset: string[],
  datasetId: string,
): Promise<heatMapType | null> {
  const param = new URLSearchParams({
    dataset_id: datasetId,
  });
  subset.forEach((s) => {
    param.append("subset", s);
  });
  const prefix = `/dataset/charts/heatmap?${param}`;
  return await getData<heatMapType>(apiUrl + prefix);
}
export type pcaChartType = {
  points: [number, number, number][];
  explained_variance: number[];
  total_variance: number;
};
export async function getPcaChart(
  datasetId: string,
): Promise<pcaChartType | null> {
  const param = new URLSearchParams({
    dataset_id: datasetId,
  });
  const prefix = `/dataset/charts/pca?${param}`;
  return await getData<pcaChartType>(apiUrl + prefix);
}
export type kdeChartType = {
  points: [number, number][];
};
export async function getKdeChart(
  datasetId: string,
  columnName: string,
): Promise<kdeChartType | null> {
  const param = new URLSearchParams({
    dataset_id: datasetId,
    column_name: columnName,
  });
  const prefix = `/dataset/charts/kde?${param}`;
  return await getData<kdeChartType>(apiUrl + prefix);
}
export type scatterPlotType = {
  points: [number, number][];
};

export async function getScatterPlot(
  datasetId: string,
  columns: [string, string],
): Promise<scatterPlotType | null> {
  const params = new URLSearchParams({
    dataset_id: datasetId,
  });

  columns.forEach((col) => params.append("subset", col));

  const prefix = `/dataset/charts/scatter?${params}`;
  return await getData<scatterPlotType>(apiUrl + prefix);
}
