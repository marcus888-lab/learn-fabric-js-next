import * as fabric from "fabric";
import { DrawingTool, Point } from "./types";

let activeText: fabric.IText | null = null;

export const drawText: DrawingTool = {
  name: "text",
  cursor: "text",

  init: (canvas: fabric.Canvas) => {
    // Add handler for when text editing starts
    canvas.on("text:editing:entered", () => {
      activeText = canvas.getActiveObject() as fabric.IText;
    });

    // Add handler for when text editing ends
    canvas.on("text:editing:exited", () => {
      activeText = null;
    });
  },

  handleMouseDown: (canvas: fabric.Canvas, pointer: Point) => {
    // If we're already editing text or clicked on an existing text, don't create new text
    const pointerEvent = pointer as unknown as fabric.TPointerEvent;
    const clickedObject = canvas.findTarget(pointerEvent);
    if (activeText || (clickedObject && clickedObject.type === "i-text")) {
      return;
    }

    // Create a new text object at click position
    const text = new fabric.IText("Enter text", {
      left: pointer.x,
      top: pointer.y,
      fontSize: 20,
      fill: "black",
      selectable: true,
      hasControls: true,
      editable: true,
      // Customize control box
      transparentCorners: false,
      cornerStyle: "circle",
      cornerColor: "black",
      cornerStrokeColor: "black",
      cornerSize: 6,
      borderColor: "black",
      controls: {
        // Top left control
        tl: new fabric.Control({
          x: -0.5,
          y: -0.5,
          cursorStyle: "nw-resize",
          actionHandler: fabric.controlsUtils.scalingEqually,
          actionName: "scaling",
        }),
        // Top right control
        tr: new fabric.Control({
          x: 0.5,
          y: -0.5,
          cursorStyle: "ne-resize",
          actionHandler: fabric.controlsUtils.scalingEqually,
          actionName: "scaling",
        }),
        // Bottom left control
        bl: new fabric.Control({
          x: -0.5,
          y: 0.5,
          cursorStyle: "sw-resize",
          actionHandler: fabric.controlsUtils.scalingEqually,
          actionName: "scaling",
        }),
        // Bottom right control
        br: new fabric.Control({
          x: 0.5,
          y: 0.5,
          cursorStyle: "se-resize",
          actionHandler: fabric.controlsUtils.scalingEqually,
          actionName: "scaling",
        }),
        // Rotation control
        mtr: new fabric.Control({
          x: 0,
          y: -0.5,
          offsetY: -40,
          cursorStyle: "crosshair",
          actionHandler: fabric.controlsUtils.rotationWithSnapping,
          actionName: "rotate",
          withConnection: true,
        }),
      },
    });

    canvas.add(text);
    canvas.setActiveObject(text);

    // Automatically enter editing mode
    text.enterEditing();
    text.selectAll();
    activeText = text;
  },

  handleMouseUp: (canvas: fabric.Canvas) => {
    const currentText = activeText;
    if (currentText && (!currentText.text || currentText.text.trim() === "")) {
      canvas.remove(currentText);
      activeText = null;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMouseMove: (canvas: fabric.Canvas) => {
    // No action needed for text tool mouse movement
  },

  cleanUp: (canvas: fabric.Canvas) => {
    activeText = null;
    canvas.off("text:editing:entered");
    canvas.off("text:editing:exited");
  },
};
