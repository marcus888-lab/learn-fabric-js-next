import EraserIcon from "@/components/ui/icons/Eraser";
import { FeatureTool } from "@/types/feature-tools";
import { Object as FabricObject, Canvas } from "fabric";
import { drawEraser } from "@/lib/drawing-tools";

const eraser: FeatureTool = {
  name: "Eraser",
  description: "Erase parts of the canvas",
  price: 0,
  icon: EraserIcon,
  action: (object: FabricObject) => {
    const canvas = object?.canvas as Canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Set cursor style
    canvas.defaultCursor = drawEraser.cursor;
    canvas.hoverCursor = drawEraser.cursor;

    // Remove existing event listeners
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    // Add drawing event listeners
    canvas.on("mouse:down", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawEraser.handleMouseDown?.(canvas, pointer);
    });

    canvas.on("mouse:move", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawEraser.handleMouseMove?.(canvas, pointer);
    });

    canvas.on("mouse:up", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawEraser.handleMouseUp?.(canvas, pointer);
    });

    // Clean up when switching tools
    return () => {
      drawEraser.cleanUp?.(canvas);
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    };
  },
};

export default eraser;
