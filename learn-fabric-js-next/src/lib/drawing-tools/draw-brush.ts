import { Canvas, PencilBrush } from "fabric";
import { DrawingTool } from "./index";

export const drawBrush: DrawingTool = {
  name: "brush",
  cursor: "crosshair",

  init: (canvas: Canvas) => {
    // Enable drawing mode
    canvas.isDrawingMode = true;

    // Initialize brush if not already done
    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new PencilBrush(canvas);
    }

    // Configure brush
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = "black";
  },

  // No need for mouse handlers as fabric handles the drawing mode internally

  cleanUp: (canvas: Canvas) => {
    // Disable drawing mode when switching tools
    canvas.isDrawingMode = false;
  },
};
