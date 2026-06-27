import { apiUrl, getData } from "~/api";

type stat = "count" | "mean" | "std" | "min" | "25%" | "50%" | "75%" | "max";
export interface columnStat extends Record<stat, number | null> {
  type: string;
  selected: boolean;
}
export type columnsInfo = {
  shape: [number, number];
  columns: Record<string, columnStat>;
};
export async function getColumnsInfo(datasetId: string) {
  const prefix = `/dataset/columns?dataset_id=${datasetId}`;
  return await getData<columnsInfo>(apiUrl + prefix);
}
export type rowSumaryStat = {
  count: number;
};
export async function getMissingRows(
  datasetId: string,
  subset: string[],
): Promise<rowSumaryStat | null> {
  const param = new URLSearchParams({
    dataset_id: datasetId,
  });
  subset.forEach((s) => {
    param.append("subset", s);
  });
  const prefix = `/dataset/rows/missing?${param}`;
  return await getData<rowSumaryStat>(apiUrl + prefix);
}
export async function getDuplicatedRows(
  datasetId: string,
  subset: string[],
): Promise<rowSumaryStat | null> {
  const param = new URLSearchParams({
    dataset_id: datasetId,
  });
  subset.forEach((s) => {
    param.append("subset", s);
  });
  const prefix = `/dataset/rows/duplicated?${param}`;
  return await getData<rowSumaryStat>(apiUrl + prefix);
}
export type RowsResponseType = {
  rows: (string | number)[][];
  count: number;
};
export async function getRows(
  datasetId: string,
  limit: number,
  offset: number,
): Promise<RowsResponseType | null> {
  const param = new URLSearchParams({
    dataset_id: datasetId,
    limit: limit.toString(),
    offset: offset.toString(),
  });
  const prefix = `/dataset/rows/filters?${param}`;
  return await getData<RowsResponseType>(apiUrl + prefix);
}
