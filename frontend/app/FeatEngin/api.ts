import { apiUrl, postData } from "~/api";
export type FeatureEngRequest =
  | {
      operation:
        | "extract_datetime"
        | "text_length"
        | "word_count"
        | "text_sentiment"
        | "flag_missing";
      column: string;
      new_col: string;
    }
  | {
      operation: "groupby_agg";
      new_col: string;
      params: {
        group_col: string[];
        agg_col: string;
        agg_func?: string;
      };
    }
  | {
      operation: "expression";
      new_col: string;
      params: {
        expression: string;
      };
    };
export async function featureEngineering(
  datasetId: string,
  req: FeatureEngRequest,
) {
  const prefix = `/features/engineering?dataset_id=${datasetId}`;

  return await postData(apiUrl + prefix, req);
}
