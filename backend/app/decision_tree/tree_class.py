import math
from typing import TypedDict
from typing import Literal
from typing import Deque
import numpy as np
from .node_class import SplitNode, LeafNode
from collections import deque


class NodeDict(TypedDict):
    id: str
    parent: str | None
    half: Literal["left", "right"] | None
    depth: int
    samples: int
    dist: list[int]
    type: Literal["leaf", "split"]
    title: str
    gini: float | None
    gini_history: dict[str, float]


class Tree:
    def __init__(self, data, feature_names):
        self.feature_names = feature_names
        self.nodes_lookup = {}
        self.root = self.build_new_node(data, feature_names)

    def gini(self, y):
        props = y / sum(y)
        return 1 - sum(props**2)

    def split_gini(self, left_y, right_y):
        n = sum(left_y) + sum(right_y)
        return sum(left_y) / n * self.gini(left_y) + sum(right_y) / n * self.gini(
            right_y
        )

    def find_gini_for_feature(self, feature_data, y):
        indices = np.argsort(feature_data)
        sorted_feature_data = feature_data[indices]
        sorted_label = y[indices]
        classes, encoded = np.unique(sorted_label, return_inverse=True)
        counts = np.bincount(encoded)
        checkpoints = np.where(sorted_feature_data[:-1] != sorted_feature_data[1:])[0]
        left_y = np.zeros(len(classes))
        right_y = counts
        best_threshold = 0
        i = 0
        best_gini = 1
        for checkpoint in checkpoints:
            while i <= checkpoint:
                left_y[encoded[i]] += 1
                right_y[encoded[i]] -= 1
                i += 1
            tmp_gini = self.split_gini(left_y, right_y)
            if tmp_gini < best_gini:
                best_gini = tmp_gini
            if len(checkpoints) < 2:
                best_threshold = sorted_feature_data[checkpoint]
            else:
                best_threshold = (
                    sorted_feature_data[checkpoint]
                    + sorted_feature_data[checkpoint + 1]
                ) / 2
        return best_gini, best_threshold

    def find_best_feature(self, X, y, feature_names):
        best_threshold = 0
        feature_plit = None
        best_gini = 1
        gini_history = {}
        for feature_id in range(len(feature_names)):
            feature_data = X[:, feature_id]
            tmp_gini, tmp_threshold = self.find_gini_for_feature(feature_data, y)
            gini_history[
                (
                    f"{feature_names[feature_id]} <= {math.ceil(tmp_threshold * 100) / 100}"
                )
            ] = math.ceil(tmp_gini * 100) / 100
            if tmp_gini <= best_gini:
                feature_plit = feature_id
                best_gini = tmp_gini
                best_threshold = tmp_threshold
        return feature_plit, best_threshold, best_gini, gini_history

    def build_new_node(self, dataset, feature_names):
        data = dataset[:, :-1]
        target = dataset[:, -1]
        samples = len(dataset)
        dist = np.bincount(target.astype(int))
        feature_id, threshold, gini, gini_history = self.find_best_feature(
            data, target, feature_names
        )
        if gini == 0:
            raise ValueError("This can't be split")
        mask = data[:, feature_id] <= threshold
        left_data = dataset[mask]
        right_data = dataset[~mask]
        left = LeafNode(
            len(left_data),
            np.bincount(left_data[:, -1].astype(int)),
            left_data,
        )

        right = LeafNode(
            len(right_data), np.bincount(right_data[:, -1].astype(int)), right_data
        )
        parent = SplitNode(
            samples=samples,
            dist=dist,
            feature=feature_names[feature_id],
            threshold=threshold,
            gini=gini,
            gini_history=gini_history,
            left=left,
            right=right,
        )
        self.nodes_lookup[parent.id] = parent
        self.nodes_lookup[right.id] = right
        self.nodes_lookup[left.id] = left
        right.set_parent(parent.id)
        left.set_parent(parent.id)
        return parent

    def grow_leaf_by_id(self, id):
        node = self.nodes_lookup.get(id)
        if node is None:
            raise ValueError("Node not found", self.nodes_lookup)

        if not node.parent:
            raise ValueError("Not a leaf node")
        parent = self.nodes_lookup[node.parent]
        # build split from this leaf's data
        new_node = self.build_new_node(node.data, self.feature_names)
        if parent.left is node:
            parent.left = new_node
        else:
            parent.right = new_node
        new_node.set_parent(parent.id)
        del self.nodes_lookup[id]
        return new_node.id

    def tree_to_js_nodes(self, id) -> list[NodeDict]:
        nodes = []

        queue: Deque[
            tuple[
                LeafNode | SplitNode, str | None, Literal["left", "right"] | None, int
            ]
        ] = deque()
        if id not in self.nodes_lookup:
            raise KeyError(f"Node not found: {id}, nodes_lookup: {self.nodes_lookup}")

        root = self.nodes_lookup[id]
        queue.append((root, str(getattr(root, "parent", None)), None, 0))

        while queue:
            node, parent_id, half, depth = queue.popleft()

            base: NodeDict = {
                "id": str(node.id),
                "parent": parent_id,
                "half": half,
                "depth": depth,
                "samples": node.samples,
                "dist": (
                    node.dist.tolist() if hasattr(node.dist, "tolist") else node.dist
                ),
                "gini": 0,
                "gini_history": {},
                "title": "ok",
                "type": "leaf",
            }

            if isinstance(node, SplitNode):
                base.update(
                    {
                        "type": "split",
                        "title": f"{node.feature} <= {math.ceil(node.threshold * 100) / 100}",
                        "gini": math.ceil(node.gini * 100) / 100,
                        "gini_history": node.gini_history,
                    }
                )

                nodes.append(base)

                queue.append((node.left, str(node.id), "left", depth + 1))
                queue.append((node.right, str(node.id), "right", depth + 1))

            else:
                base.update(
                    {
                        "type": "leaf",
                        "title": "leaf",
                        "gini": math.ceil(self.gini(node.dist) * 100) / 100,
                    }
                )

                nodes.append(base)

        return nodes
