import { Canvas, Rect } from "fabric";
import { DrawingTool, Point } from "./index";

let activeShape: Rect | null = null;
let startPoint: Point | null = null;
let isDrawing = false;

export const drawRectangle: DrawingTool = {
  name: "rectangle",
  cursor: "crosshair",

  handleMouseDown: (canvas: Canvas, pointer: Point) => {
    if (isDrawing) return;

    isDrawing = true;
    startPoint = pointer;
    activeShape = new Rect({
      left: pointer.x,
      top: pointer.y,
      width: 0,
      height: 0,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      selectable: true,
      hasControls: true,
    });
    canvas.add(activeShape);
  },

  handleMouseMove: (canvas: Canvas, pointer: Point) => {
    if (!activeShape || !startPoint || !isDrawing) return;

    const width = Math.abs(startPoint.x - pointer.x);
    const height = Math.abs(startPoint.y - pointer.y);
    const left = Math.min(startPoint.x, pointer.x);
    const top = Math.min(startPoint.y, pointer.y);

    activeShape.set({
      width,
      height,
      left,
      top,
    });

    canvas.renderAll();
  },

  handleMouseUp: (canvas: Canvas) => {
    if (!isDrawing) return;

    if (activeShape) {
      // Only set as active object if it has size
      if (activeShape.width > 0 && activeShape.height > 0) {
        canvas.setActiveObject(activeShape);
      } else {
        canvas.remove(activeShape);
      }
    }

    isDrawing = false;
    activeShape = null;
    startPoint = null;
  },

  cleanUp: () => {
    activeShape = null;
    startPoint = null;
    isDrawing = false;
  },
};
