import RectangleIcon from "@/components/ui/icons/Rectangle";
import { FeatureTool } from "@/types/feature-tools";
import { Object as FabricObject, Canvas } from "fabric";
import { drawRectangle } from "@/lib/drawing-tools";

const rectangle: FeatureTool = {
  name: "Rectangle",
  description: "Draw a rectangle on the canvas",
  price: 0,
  icon: RectangleIcon,
  action: (object: FabricObject) => {
    const canvas = object?.canvas as Canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Set cursor style
    canvas.defaultCursor = drawRectangle.cursor;
    canvas.hoverCursor = drawRectangle.cursor;

    // Remove existing event listeners
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");

    // Add drawing event listeners
    canvas.on("mouse:down", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawRectangle.handleMouseDown?.(canvas, pointer);
    });

    canvas.on("mouse:move", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawRectangle.handleMouseMove?.(canvas, pointer);
    });

    canvas.on("mouse:up", (options) => {
      if (!options.e) return;
      const pointer = canvas.getPointer(options.e);
      drawRectangle.handleMouseUp?.(canvas, pointer);
    });

    // Clean up when switching tools
    return () => {
      drawRectangle.cleanUp?.(canvas);
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
    };
  },
};

export default rectangle;
