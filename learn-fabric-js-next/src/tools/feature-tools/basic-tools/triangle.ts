import TriangleIcon from "@/components/ui/icons/Triangle";
import { FeatureTool } from "@/types/feature-tools";
import { Object as FabricObject, Canvas } from "fabric";
import { drawTriangle } from "@/lib/drawing-tools";

const triangle: FeatureTool = {
  name: "Triangle",
  description: "Draw a triangle on the canvas",
  price: 0,
  icon: TriangleIcon,
  action: (object: FabricObject) => {
    const canvas = object?.canvas as Canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Set cursor style
    canvas.defaultCursor = drawTriangle.cursor;
    canvas.hoverCursor = drawTriangle.cursor;

    // Remove existing event listeners
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    // Add drawing event listeners
    canvas.on("mouse:down", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawTriangle.handleMouseDown?.(canvas, pointer);
    });

    canvas.on("mouse:move", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawTriangle.handleMouseMove?.(canvas, pointer);
    });

    canvas.on("mouse:up", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawTriangle.handleMouseUp?.(canvas, pointer);
    });

    // Clean up when switching tools
    return () => {
      drawTriangle.cleanUp?.(canvas);
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    };
  },
};

export default triangle;
