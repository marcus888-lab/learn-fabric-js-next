import { Canvas, Circle } from "fabric";
import { DrawingTool, Point } from "./index";

let activeShape: Circle | null = null;
let startPoint: Point | null = null;

export const drawCircle: DrawingTool = {
  name: "circle",
  cursor: "crosshair",

  handleMouseDown: (canvas: Canvas, pointer: Point) => {
    startPoint = pointer;
    activeShape = new Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 0,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
    });
    canvas.add(activeShape);
  },

  handleMouseMove: (canvas: Canvas, pointer: Point) => {
    if (!activeShape || !startPoint) return;

    // Calculate radius based on distance from start point
    const radius =
      Math.sqrt(
        Math.pow(startPoint.x - pointer.x, 2) +
          Math.pow(startPoint.y - pointer.y, 2)
      ) / 2;

    // Calculate center point
    const centerX = (startPoint.x + pointer.x) / 2;
    const centerY = (startPoint.y + pointer.y) / 2;

    activeShape.set({
      radius,
      left: centerX - radius,
      top: centerY - radius,
    });

    canvas.renderAll();
  },

  handleMouseUp: (canvas: Canvas) => {
    if (activeShape) {
      canvas.setActiveObject(activeShape);
      activeShape = null;
      startPoint = null;
    }
  },

  cleanUp: () => {
    activeShape = null;
    startPoint = null;
  },
};
