import type { DecisionTreeNodeVisualization } from "./api";

const DecisionTree = function (
  visualNodes: DecisionTreeNodeVisualization[],
  canvas: HTMLCanvasElement,
) {
  const NodeWidth = 180,
    NodeHeight = 70;
  const adjustTree = (
    depths: DecisionTreeNodeVisualization[][],
    i: number,
    j: number,
    space: number,
  ) => {
    const currentDepth = depths[i];
    const currentNode = currentDepth[j];
    const prevNode = currentDepth[j - 1];
    if (!currentNode || !prevNode) {
      throw Error("Adjusting tree meet non-existent node");
    }
    if (!(prevNode.x !== undefined && currentNode.x !== undefined)) {
      throw Error(
        `One of these nodes hasn't been initialized, id: ${prevNode.id}, ${currentNode.id}`,
      );
    }
    let distance = prevNode.x + NodeWidth + space - currentNode.x;
    const leftHalf = j < depths[i].length / 2;
    const queue = leftHalf ? depths[i].slice(0, j) : depths[i].slice(j);
    let childN = queue.length;
    while (queue.length > 0) {
      const top = queue.shift();
      if (!top) {
        throw Error("Queue have undefined slot");
      }
      if (leftHalf) {
        top.x! -= distance;
      } else {
        if (top.x) {
          top.x += distance;
        }
      }
      if (top.parent && (queue.length == 0 || top.id != queue[0].id)) {
        const parent = visualNodes.find((n) => n.id == top.parent);
        if (!parent) {
          throw Error(`the parent of node with id: ${top.id} doesn't exist`);
        }
        queue.push(parent);
      }
      childN--;
      if (childN == 0) {
        distance *= 1 / 2;
      }
    }
  };
  const generatePositions = () => {
    const rect = canvas.getBoundingClientRect();
    const depths: DecisionTreeNodeVisualization[][] = [[visualNodes[0]]];
    let newDepth: DecisionTreeNodeVisualization[] = [];
    const space = 50;
    for (let i = 1; i < visualNodes.length; i++) {
      if (
        depths[depths.length - 1].some((n) => n.id == visualNodes[i].parent)
      ) {
        newDepth.push(visualNodes[i]);
      } else {
        depths.push(newDepth);
        newDepth = [visualNodes[i]];
      }
    }
    depths.push(newDepth);
    depths[0][0].x = rect.width / 2;
    depths[0][0].y = space;
    for (let i = 1; i < depths.length; i++) {
      const currentDepth = depths[i];
      const parentDepth = depths[i - 1];
      for (let j = 0; j < currentDepth.length; j++) {
        const isLeft =
          j == 0 || currentDepth[j - 1].parent != currentDepth[j].parent;
        const parentI = parentDepth.findIndex(
          (n) => n.id == currentDepth[j].parent,
        );
        if (parentI === -1) {
          throw new Error(
            `can't find parent of node with id: ${currentDepth[j].id}`,
          );
        }
        const distanceBetweenNodes = NodeWidth + space;
        const currentNode = currentDepth[j];
        const parentNode = parentDepth[parentI];
        if (!(currentNode && parentNode)) {
          throw new Error(
            `The index gone all wrong ${j}, ${parentI}, ${j - 1}`,
          );
        }
        if (parentNode.x === undefined) {
          throw new Error(
            `Some position hasn't been initialized, id: ${parentNode.id}, ${currentNode.id}`,
          );
        }
        currentDepth[j].x = isLeft
          ? (parentNode.x * 2 - distanceBetweenNodes) / 2
          : currentDepth[j - 1].x! + distanceBetweenNodes;
        if (j > 0 && isLeft) {
          const prevNode = currentDepth[j - 1];
          if (prevNode.x === undefined || currentNode.x === undefined) {
            throw new Error(
              `Some position hasn't been initialized, id: ${prevNode.id}, ${currentNode.id}`,
            );
          }

          if (prevNode.x + distanceBetweenNodes >= currentNode.x) {
            adjustTree(depths, i, j, space);
          }
        }
        currentDepth[j].y = space + i * (space + NodeHeight);
      }
    }
  };

  function addSplitNode(
    id: string,
    newNodes: [
      DecisionTreeNodeVisualization,
      DecisionTreeNodeVisualization,
      DecisionTreeNodeVisualization,
    ],
  ) {
    const newSplit: DecisionTreeNodeVisualization = newNodes[0];
    const one: DecisionTreeNodeVisualization = newNodes[1];
    const two: DecisionTreeNodeVisualization = newNodes[2];
    const oldDatasetIndex: number = visualNodes.findIndex((n) => n.id === id);
    const parent = visualNodes[oldDatasetIndex];
    if (!parent) {
      throw new Error(`Id does not exist ${id}`);
    }
    const pI = visualNodes.findIndex(
      (n) => n.y > parent.y && n.x >= parent.x + NodeWidth / 2,
    );
    visualNodes[oldDatasetIndex] = newSplit;
    if (pI == -1) {
      visualNodes.push(one, two);
    } else {
      visualNodes.splice(pI, 0, one, two);
    }
  }
  return {
    generatePositions,
    addSplitNode,
    NodeHeight,
    NodeWidth,
  };
};
export default DecisionTree;
