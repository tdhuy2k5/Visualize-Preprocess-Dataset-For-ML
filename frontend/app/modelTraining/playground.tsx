import { useEffect, useRef } from "react";
import DecisionTree from "./DecisionTree";
import DrawTree from "./DrawTree";
import type { DecisionTreeNodeVisualization } from "./api";

const PlayGround = function ({
  visualNodes,
  setSelectedNode,
  selectedNode,
  nodeHeight,
  nodeWidth,
}: {
  visualNodes: DecisionTreeNodeVisualization[];
  setSelectedNode: (id: string) => void;
  selectedNode: DecisionTreeNodeVisualization | null;
  nodeHeight: number;
  nodeWidth: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef({
    x: 0,
    y: 0,
    zoom: 1,
  });
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    const tree = DecisionTree(visualNodes, canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const tool = DrawTree(ctx, nodeHeight, nodeWidth);
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    const camera = { ...cameraRef.current };
    tree.generatePositions();
    let animationId = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      ctx.translate(camera.x, camera.y);
      ctx.scale(camera.zoom, camera.zoom);

      visualNodes.forEach((node) => {
        if (!node.parent || node.parent === "None") return;

        const parent = visualNodes.find((n) => n.id === node.parent);

        if (!parent) {
          throw new Error(`can't find parent with id: ${node.parent}`);
        }
        const active = node.id === "leaf4" || parent.id === "right";

        tool.drawEdge(parent, node, active);
      });

      visualNodes.forEach(tool.drawNode);

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();
    canvas.addEventListener("click", (e) => {
      const mx = (e.offsetX - camera.x) / camera.zoom;

      const my = (e.offsetY - camera.y) / camera.zoom;

      const clicked = visualNodes.find((node) => {
        const left = node.x - nodeWidth / 2;

        const top = node.y;

        return (
          mx >= left &&
          mx <= left + nodeWidth &&
          my >= top &&
          my <= top + nodeHeight
        );
      });

      if (clicked) {
        setSelectedNode(clicked.id);
      }
    });
    let dragging = false;
    let startX = 0;
    let startY = 0;
    const mouseLine = {
      x: 0,
      y: 0,
    };
    canvas.addEventListener("mousedown", (e) => {
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (dragging) {
        camera.x += e.clientX - startX;
        camera.y += e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        return;
      }
      const rect = canvas.getBoundingClientRect();
      mouseLine.x = (e.clientX - rect.left - camera.x) / camera.zoom;
      mouseLine.y = (e.clientY - rect.top - camera.y) / camera.zoom;
    });
    canvas.addEventListener("wheel", (e) => {
      const rect = canvas.getBoundingClientRect();
      e.preventDefault();
      const zoomFactor = 1.05;

      if (e.deltaY < 0) {
        camera.zoom *= zoomFactor;
      } else {
        camera.zoom /= zoomFactor;
      }

      camera.zoom = Math.max(0.25, Math.min(camera.zoom, 5));
      camera.x = e.clientX - rect.left - mouseLine.x * camera.zoom;
      camera.y = e.clientY - rect.top - mouseLine.y * camera.zoom;
    });
    return () => {
      cancelAnimationFrame(animationId);
      cameraRef.current = { ...camera };
    };
  }, [visualNodes]);

  return (
    <canvas
      ref={ref}
      id="treeCanvas"
      className={`w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center p-20 `}
      style={{ aspectRatio: "16/10" }}
    ></canvas>
  );
};
export default PlayGround;
