import type { DecisionTreeNode } from "./api";
import { getColor } from "./ultils";

const DrawTree = function (
  ctx: CanvasRenderingContext2D,
  NodeHeight: number,
  NodeWidth: number,
) {
  const drawEdge = (
    parent: DecisionTreeNode,
    child: DecisionTreeNode,
    active = false,
  ) => {
    ctx.beginPath();
    if (
      !(
        parent.x !== undefined &&
        parent.y !== undefined &&
        child.x !== undefined &&
        child.y !== undefined
      )
    ) {
      console.error("Some nodes hasn't initialized");
      return;
    }

    ctx.moveTo(parent.x, parent.y + NodeHeight / 2);

    ctx.lineTo(child.x, child.y - NodeHeight / 2);

    ctx.strokeStyle = active ? "#7bd0ff" : "#666";

    ctx.lineWidth = active ? 3 : 1.5;

    ctx.stroke();
  };
  const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();

    ctx.moveTo(x + r, y);

    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);

    ctx.closePath();
  };
  const drawNode = (node: DecisionTreeNode) => {
    if (node.x === undefined || node.y === undefined) {
      throw Error(`this node hasn't been initialized, id: ${node.y}`);
    }
    const x = node.x - NodeWidth / 2;
    const y = node.y - NodeHeight / 2;

    roundRect(x, y, NodeWidth, NodeHeight, 10);

    ctx.fillStyle = node.type === "leaf" ? "#162235" : "#20242d";

    ctx.fill();

    ctx.strokeStyle = "#3d4250";
    ctx.stroke();

    ctx.fillStyle = "#7bd0ff";
    ctx.font = "10px Inter";

    const type = node.type !== "leaf" ? "SPLIT CONDITION" : "LEAF NODE";

    ctx.fillText(type, x + 10, y + 24);

    ctx.fillStyle = "#fff";
    ctx.font = "12px Inter";

    const title = node.title;

    ctx.fillText(title, x + 10, y + 48);

    ctx.fillStyle = "#9ca3af";
    ctx.font = "10px Inter";

    ctx.fillText(`Gini: ${node.gini}`, x + 10, y + 72);

    ctx.fillText(`Samples: ${node.samples}`, x + 80, y + 72);

    let offset = 0;
    const sumDist = node.dist.reduce((s, val) => s + val);

    node.dist.forEach((value, i) => {
      const width = (NodeWidth - 24) * (value / sumDist);

      ctx.fillStyle = getColor(i, node.dist.length);

      ctx.fillRect(x + 10 + offset, y + 90, width, 4);

      offset += width;
    });
  };

  return { drawEdge, drawNode };
};
export default DrawTree;
