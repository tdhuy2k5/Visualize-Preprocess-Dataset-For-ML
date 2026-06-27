import { apiUrl, getData, postData } from "~/api";
interface DecisionTreeInfo {
  id: string;
  title: string;
  parent?: string;
  x?: number;
  y?: number;
  gini: number;
  gini_history: Record<string, number>;
  half?: "left" | "right";
  depth: number;
  samples: number;
  dist: number[];
}
interface DecisionTreeLeaf extends DecisionTreeInfo {
  type: "leaf";
}
interface DecisionTreeSplit extends DecisionTreeInfo {
  type: "split";
}
interface DecisionTreeLeafVisualization extends DecisionTreeLeaf {
  x: number;
  y: number;
  selected: boolean;
}
interface DecisionTreeSplitVisualization extends DecisionTreeSplit {
  x: number;
  y: number;
  selected: boolean;
}
export type DecisionTreeNodeVisualization =
  | DecisionTreeSplitVisualization
  | DecisionTreeLeafVisualization;
export type DecisionTreeNode = DecisionTreeLeaf | DecisionTreeSplit;

export async function getTree(
  datasetId: string,
): Promise<DecisionTreeNode[] | null> {
  const param = new URLSearchParams({ dataset_id: datasetId });
  const prefix = `/model/decision-tree/tree?${param}`;
  return await getData<DecisionTreeNode[]>(apiUrl + prefix);
}
export async function addNode(
  nodeId: string,
): Promise<
  | [
      DecisionTreeNodeVisualization,
      DecisionTreeNodeVisualization,
      DecisionTreeNodeVisualization,
    ]
  | null
> {
  const param = new URLSearchParams({ node_id: nodeId });
  const prefix = `/model/decision-tree/split?${param}`;
  return await postData(apiUrl + prefix, {});
}
