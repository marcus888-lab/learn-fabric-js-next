import BrushIcon from "@/components/ui/icons/Brush";
import { FeatureTool } from "@/types/feature-tools";
import { Object as FabricObject, Canvas } from "fabric";
import { drawBrush } from "@/lib/drawing-tools";

const brush: FeatureTool = {
  name: "Brush",
  description: "Draw freely on the canvas",
  price: 0,
  icon: BrushIcon,
  action: (object: FabricObject) => {
    const canvas = object?.canvas as Canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Set cursor style
    canvas.defaultCursor = drawBrush.cursor;
    canvas.hoverCursor = drawBrush.cursor;

    // Remove existing event listeners
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    // Add drawing event listeners
    canvas.on("mouse:down", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawBrush.handleMouseDown?.(canvas, pointer);
    });

    canvas.on("mouse:move", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawBrush.handleMouseMove?.(canvas, pointer);
    });

    canvas.on("mouse:up", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawBrush.handleMouseUp?.(canvas, pointer);
    });

    // Clean up when switching tools
    return () => {
      drawBrush.cleanUp?.(canvas);
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    };
  },
};

export default brush;
