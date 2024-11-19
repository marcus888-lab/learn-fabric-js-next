import { Canvas, Circle } from "fabric";
import { DrawingTool, Point } from "./index";

let eraserCursor: Circle | null = null;
const ERASER_RADIUS = 10;
let isErasing = false;

export const drawEraser: DrawingTool = {
  name: "eraser",
  cursor: "none", // Hide default cursor since we'll show a custom one

  init: (canvas: Canvas) => {
    // Disable selection and selection styling
    canvas.selection = false;
    canvas.skipTargetFind = true;
    canvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });

    // Create eraser cursor
    eraserCursor = new Circle({
      left: 0,
      top: 0,
      radius: ERASER_RADIUS,
      fill: "rgba(255,0,0,0.2)",
      stroke: "red",
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      hoverCursor: "none",
    });
    canvas.add(eraserCursor);

    // Add mousemove handler to update cursor position
    canvas.on("mouse:move", (options) => {
      if (!eraserCursor || !options.e) return;
      const pointer = canvas.getPointer(options.e);
      eraserCursor.set({
        left: pointer.x - ERASER_RADIUS,
        top: pointer.y - ERASER_RADIUS,
        visible: true,
      });

      // If we're erasing, check for intersections
      if (isErasing) {
        const objects = canvas.getObjects();
        objects.forEach((obj) => {
          if (obj === eraserCursor) return;

          const objCenter = obj.getCenterPoint();
          const distance = Math.sqrt(
            Math.pow(pointer.x - objCenter.x, 2) +
              Math.pow(pointer.y - objCenter.y, 2)
          );

          if (distance < ERASER_RADIUS + (obj.width || 0) / 2) {
            canvas.remove(obj);
          }
        });
      }

      canvas.renderAll();
    });
  },

  handleMouseDown: (canvas: Canvas, pointer: Point) => {
    isErasing = true;
    // Initial erase check
    const objects = canvas.getObjects();
    objects.forEach((obj) => {
      if (obj === eraserCursor) return;

      const objCenter = obj.getCenterPoint();
      const distance = Math.sqrt(
        Math.pow(pointer.x - objCenter.x, 2) +
          Math.pow(pointer.y - objCenter.y, 2)
      );

      if (distance < ERASER_RADIUS + (obj.width || 0) / 2) {
        canvas.remove(obj);
      }
    });
    canvas.renderAll();
  },

  handleMouseUp: () => {
    isErasing = false;
  },

  cleanUp: (canvas: Canvas) => {
    if (eraserCursor) {
      canvas.remove(eraserCursor);
      eraserCursor = null;
    }
    isErasing = false;
    canvas.off("mouse:move");

    // Re-enable selection
    canvas.selection = true;
    canvas.skipTargetFind = false;
    canvas.forEachObject((obj) => {
      obj.selectable = true;
      obj.evented = true;
    });
  },
};
