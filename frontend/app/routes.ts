import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("eda/:datasetId", "routes/eda.tsx"),
  route("encode&transform/:datasetId", "routes/encodingTransform.tsx"),
  route("feature-engineer/:datasetId", "routes/featureEngineer.tsx"),
  route("imbalance/:datasetId", "routes/imbalance.tsx"),
  route("model-training/:datasetId", "routes/modelTraining.tsx"),
] satisfies RouteConfig;
