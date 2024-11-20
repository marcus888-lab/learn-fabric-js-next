import * as fabric from "fabric";
import { DrawingTool } from "./types";

export const drawBrush: DrawingTool = {
  name: "brush",
  cursor: "crosshair",

  init: (canvas: fabric.Canvas) => {
    // Enable drawing mode
    canvas.isDrawingMode = true;

    // Initialize brush if not already done
    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }

    // Configure brush
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = "black";
  },

  // No need for mouse handlers as fabric handles the drawing mode internally

  cleanUp: (canvas: fabric.Canvas) => {
    // Disable drawing mode when switching tools
    canvas.isDrawingMode = false;
  },
};
