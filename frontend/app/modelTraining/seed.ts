import type { DecisionTreeNode } from "./api";

const nodes: DecisionTreeNode[] = [
  {
    id: "root",
    depth: 0,
    type: "split",
    title: "mean_radius <= 14.2",
    gini: 0.468,
    samples: 569,
    dist: [99, 1],
  },

  {
    id: "left",
    parent: "root",
    half: "left",
    depth: 1,
    type: "split",
    title: "texture_error <= 0.8",
    gini: 0.159,
    samples: 212,
    dist: [99, 1],
  },

  {
    id: "right",
    parent: "root",
    half: "right",
    depth: 1,
    type: "split",
    title: "smoothness <= 0.11",
    gini: 0.321,
    samples: 357,
    dist: [99, 1],
  },

  // Previous leaves become split nodes

  {
    id: "leaf1",
    parent: "left",
    half: "left",
    depth: 2,
    type: "split",
    title: "radius_error <= 0.35",
    gini: 0.045,
    samples: 100,
    dist: [99, 1],
  },

  {
    id: "leaf2",
    parent: "left",
    half: "right",
    depth: 2,
    type: "split",
    title: "concavity <= 0.12",
    gini: 0.112,
    samples: 100,
    dist: [99, 1],
  },

  {
    id: "leaf3",
    parent: "right",
    half: "left",
    depth: 2,
    type: "split",
    title: "area_error <= 28",
    gini: 0.021,
    samples: 100,
    dist: [99, 1],
  },

  {
    id: "leaf4",
    parent: "right",
    half: "right",
    depth: 2,
    type: "split",
    title: "symmetry <= 0.18",
    gini: 0.441,
    samples: 100,
    dist: [99, 1],
  },

  // Depth 3 leaves

  {
    id: "leaf1_left",
    parent: "leaf1",
    half: "left",
    depth: 3,
    type: "leaf",
    title: "Class A",
    samples: 60,
    gini: 0.01,
    dist: [99, 1],
  },

  {
    id: "leaf1_right",
    parent: "leaf1",
    half: "right",
    depth: 3,
    type: "leaf",
    title: "Mostly A",
    samples: 40,
    gini: 0.08,
    dist: [94, 6],
  },

  {
    id: "leaf2_left",
    parent: "leaf2",
    half: "left",
    depth: 3,
    type: "leaf",
    title: "Balanced",
    samples: 55,
    gini: 0.24,
    dist: [35, 65],
  },

  {
    id: "leaf2_right",
    parent: "leaf2",
    half: "right",
    depth: 3,
    type: "leaf",
    title: "Class B Leaning",
    samples: 45,
    gini: 0.11,
    dist: [18, 82],
  },

  // {
  //     id: "leaf3_left",
  //     parent: "leaf3",
  //     half: "left",
  //     width: 180,
  //     height: 70,
  //     depth: 3,
  //     type: "leaf",
  //     label: "Pure B",
  //     samples: 70,
  //     gini: 0.0,
  //     dist: [0, 100]
  // },

  // {
  //     id: "leaf3_right",
  //     parent: "leaf3",
  //     half: "right",
  //     width: 180,
  //     height: 70,
  //     depth: 3,
  //     type: "leaf",
  //     label: "Nearly Pure B",
  //     samples: 30,
  //     gini: 0.03,
  //     dist: [2, 98]
  // },

  {
    id: "leaf4_left",
    parent: "leaf4",
    half: "left",
    depth: 3,
    type: "leaf",
    title: "Uncertain A",
    samples: 52,
    gini: 0.39,
    dist: [65, 35],
  },

  {
    id: "leaf4_right",
    parent: "leaf4",
    half: "right",
    depth: 3,
    type: "leaf",
    title: "Uncertain B",
    samples: 48,
    gini: 0.42,
    dist: [42, 58],
  },
];
export default nodes;
