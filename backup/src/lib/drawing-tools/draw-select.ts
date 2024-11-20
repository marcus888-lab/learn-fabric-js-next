import * as fabric from "fabric";
import { DrawingTool, Point } from "./types";

let isSelecting = false;

export const drawSelect: DrawingTool = {
  name: "select",
  cursor: "default",

  handleMouseDown: (canvas: fabric.Canvas, pointer: Point) => {
    if (isSelecting) return;

    isSelecting = true;
    const target = canvas.findTarget(
      pointer as unknown as fabric.TPointerEvent
    );

    if (!target) {
      // Clear selection if clicking on empty canvas
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    } else {
      // If clicking on an object, ensure it's selected
      canvas.setActiveObject(target);
      canvas.requestRenderAll();
    }
  },

  handleMouseMove: (canvas: fabric.Canvas, pointer: Point) => {
    if (!isSelecting) return;

    const target = canvas.findTarget(
      pointer as unknown as fabric.TPointerEvent
    );

    if (target) {
      canvas.defaultCursor = "pointer";
    } else {
      canvas.defaultCursor = "default";
    }
  },

  handleMouseUp: () => {
    isSelecting = false;
  },

  cleanUp: () => {
    isSelecting = false;
  },
};
