import { apiUrl, postData } from "~/api";
import type { PipelineStepType } from "~/pipeline/PipelineStepType";

export type TransformationMethodType =
  | "log"
  | "sqrt"
  | "minmax"
  | "standard"
  | "robust"
  | "power"
  | "normalize";
export const EncodingMethod = [
  "one_hot",
  "label",
  "target",
  "count",
  "freq",
  "binary",
  "ordinal",
];
export type EncodingMethodType = (typeof EncodingMethod)[number];
type EncodingData = {
  columns?: string[];
  column?: string;
  target?: string;
  mapping?: Record<string, any>;
};
export class EncodingRequest {
  public column?: string;
  public target?: string;
  public mapping?: Record<string, any>;
  constructor(
    public method: EncodingMethodType,
    public data: EncodingData,
  ) {
    switch (method) {
      case "target":
        if (!data.column || !data.target) {
          throw new Error(
            `They shouldn't be null in EncodingRequest(method: ${method}, target: ${data.target}, column: ${data.column}`,
          );
        }
        this.column = data.column;
        this.target = data.target;
        break;
      case "ordinal":
        if (!data.column || !data.mapping) {
          throw new Error(
            `They shouldn't be null in EncodingRequest(method: ${method}, mapping: ${data.mapping}, column: ${data.column}`,
          );
        }
        this.column = data.column;
        this.mapping = data.mapping;
        break;
      default:
        if (!data.column) {
          throw new Error(
            `They shouldn't be null in EncodingRequest(method: ${method}, column: ${data.column}`,
          );
        }
        this.column = data.column;
    }
  }
}
export class TransformationRequest {
  constructor(
    public method: TransformationMethodType,
    public columns: string[],
  ) {}
}
export async function enconding(datasetId: string, req: EncodingRequest) {
  const prefix = `/features/encoding?dataset_id=${datasetId}`;
  await postData(apiUrl + prefix, req);
}
export async function transform(datasetId: string, req: TransformationRequest) {
  const prefix = `/features/transformation?dataset_id=${datasetId}`;
  await postData(apiUrl + prefix, req);
}
