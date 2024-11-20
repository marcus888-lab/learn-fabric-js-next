import LineIcon from "@/components/ui/icons/Line";
import { FeatureTool } from "@/types/feature-tools";
import { Object as FabricObject, Canvas } from "fabric";
import { drawLine } from "@/lib/drawing-tools";

const line: FeatureTool = {
  name: "Line",
  description: "Draw a straight line on the canvas",
  price: 0,
  icon: LineIcon,
  action: (object: FabricObject) => {
    const canvas = object?.canvas as Canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Set cursor style
    canvas.defaultCursor = drawLine.cursor;
    canvas.hoverCursor = drawLine.cursor;

    // Remove existing event listeners
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    // Add drawing event listeners
    canvas.on("mouse:down", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawLine.handleMouseDown?.(canvas, pointer);
    });

    canvas.on("mouse:move", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawLine.handleMouseMove?.(canvas, pointer);
    });

    canvas.on("mouse:up", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawLine.handleMouseUp?.(canvas, pointer);
    });

    // Clean up when switching tools
    return () => {
      drawLine.cleanUp?.(canvas);
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    };
  },
};

export default line;
