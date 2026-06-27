import { apiUrl, postData } from "~/api";

type ImbalancedInfoType = {
  name: string;
  description: string;
  method: string;
};
export const ImbalancedInfo: ImbalancedInfoType[] = [
  {
    name: "SMOTE",
    description:
      "Generates synthetic samples for the minority class using nearest neighbors to balance the dataset.",
    method: "smote",
  },
  {
    name: "Undersampling",
    description:
      "Reduces the number of majority class samples to balance with the minority class.",
    method: "undersample",
  },
  {
    name: "Oversampling",
    description:
      "Randomly duplicates samples from the minority class to increase its size and balance the dataset.",
    method: "oversample",
  },
] as const;
export type ImbalancedMethod = (typeof ImbalancedInfo)[number]["method"];
export class ImbalancedRequest {
  constructor(
    public target: string,
    public method: ImbalancedMethod,
  ) {}
}
export async function imbalanced(datasetId: string, req: ImbalancedRequest) {
  const prefix = `/features/imbalanced/?dataset_id=${datasetId}`;

  return await postData(apiUrl + prefix, req);
}
