import type { prebuiltDatasetType } from "./home/api";

export type uploadedDatasetType = {
  name: string;
  dateModified: string;
  size: `${number}${"MB" | "GB"}`;
};
export const uploadedDataset: uploadedDatasetType[] = [
  {
    name: "user_logs_raw.csv",
    dateModified: "Nov 11",
    size: "4MB",
  },
  {
    name: "some_templates.csv",
    dateModified: "Oct 8",
    size: "5GB",
  },
  {
    name: "Some_other_templates.csv",
    dateModified: "Sep 12",
    size: "200MB",
  },
];
export type recentProject = {
  name: string;
  dateEdited: string;
};
export const recentProject: recentProject[] = [
  {
    name: "project_1",
    dateEdited: "2h ago",
  },
  { name: "project_2", dateEdited: "1h ago" },
];

export const prebuiltDataset: prebuiltDatasetType[] = [
  {
    id: "iris",
    name: "Iris Dataset",
    image: "Deceased",
    description:
      "Containing 150 samples of iris flowers with four features each, used to classify them into three species: setosa, versicolor, and virginica. It’s small, clean, and ideal for beginners learning multiclass classification.",
  },
  {
    id: "wine",
    name: "Wine Dataset",
    image: "Wine_Bar",
    description:
      "Having 178 samples of wines with 13 chemical features, classified into three cultivars. It’s commonly used to practice feature analysis and multiclass classification models.",
  },
  {
    id: "breast",
    name: "Breast Cancer Dataset",
    image: "Oncology",
    description:
      "Including 569 samples of cell nuclei features, labeled as malignant or benign tumors. It’s a classic binary classification dataset used in medical machine learning applications.",
  },
];
export const data = [
  [0, 0, 1],
  [0, 1, 0.6],
  [0, 2, 0.2],
  [0, 3, 0.1],
  [0, 4, 0.05],
  [1, 0, 0.6],
  [1, 1, 1],
  [1, 2, 0.4],
  [1, 3, 0.2],
  [1, 4, 0.1],
  [2, 0, 0.2],
  [2, 1, 0.4],
  [2, 2, 1],
  [2, 3, 0.6],
  [2, 4, 0.4],
  [3, 0, 0.1],
  [3, 1, 0.2],
  [3, 2, 0.6],
  [3, 3, 1],
  [3, 4, 0.8],
  [4, 0, 0.05],
  [4, 1, 0.1],
  [4, 2, 0.4],
  [4, 3, 0.8],
  [4, 4, 1],
];
