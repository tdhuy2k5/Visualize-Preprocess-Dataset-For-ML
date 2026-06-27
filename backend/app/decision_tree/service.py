from uuid import UUID
from app.decision_tree.schemas import NodeSchema
from fastapi import HTTPException
from typing import Optional
from app.decision_tree.tree_class import Tree
import pandas as pd

tree: Optional[Tree] = None


def get_tree(data: pd.DataFrame, feature_names: pd.Index) -> list[NodeSchema]:
    global tree
    tree = Tree(data.to_numpy(), feature_names)
    return [
        NodeSchema(
            id=node["id"],
            parent=node["parent"],
            half=node["half"],
            depth=node["depth"],
            samples=node["samples"],
            dist=node["dist"],
            type=node["type"],
            title=str(node["title"]),
            gini=node.get("gini"),
            gini_history=node.get("gini_history"),
        )
        for node in tree.tree_to_js_nodes(tree.root.id)
    ]


def add_node(id: UUID):
    global tree
    if tree:
        parent_id = tree.grow_leaf_by_id(id)
        return [NodeSchema(**node) for node in tree.tree_to_js_nodes(parent_id)]
    else:
        raise HTTPException(status_code=404, detail="Tree not found")
