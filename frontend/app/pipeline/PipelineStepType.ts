import type { EncodingRequest, TransformationRequest } from "~/enTra/api";
import type { FeatureEngRequest } from "~/FeatEngin/api";
import type { ImbalancedRequest } from "~/imbalance/api";

export type PipelineStepType =
  | {
      type: "encoding";
      data: EncodingRequest;
    }
  | {
      type: "engineer";
      data: FeatureEngRequest;
    }
  | {
      type: "transform";
      data: TransformationRequest;
    }
  | {
      type: "imbalance";
      data: ImbalancedRequest;
    };
