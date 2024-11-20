import * as fabric from "fabric";
import { Canvas } from "fabric";

const selectTool = {
  name: "select",
  cursor: "default",

  handleMouseDown: (
    canvas: Canvas,
    pointer: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    const target = canvas.findTarget(pointer.e);
    if (!target) {
      // Only clear selection if clicking on empty canvas
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    } else {
      // If clicking on an object, ensure it's selected
      canvas.setActiveObject(target);
      canvas.requestRenderAll();
    }
  },

  handleMouseMove: (
    canvas: Canvas,
    pointer: fabric.TPointerEventInfo<fabric.TPointerEvent>
  ) => {
    // Update cursor based on what's under it
    const target = canvas.findTarget(pointer.e);
    if (target) {
      canvas.defaultCursor = "pointer";
    } else {
      canvas.defaultCursor = "default";
    }
  },

  handleMouseUp: () => {
    // No specific action needed on mouse up for selection
  },

  cleanUp: () => {
    // No cleanup needed for selection
  },
};

export default selectTool;
