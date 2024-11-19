import { Canvas, IText, TPointerEvent } from "fabric";
import { DrawingTool, Point } from "./index";

let activeText: IText | null = null;

export const drawText: DrawingTool = {
  name: "text",
  cursor: "text",

  init: (canvas: Canvas) => {
    // Add handler for when text editing starts
    canvas.on("text:editing:entered", () => {
      activeText = canvas.getActiveObject() as IText;
    });

    // Add handler for when text editing ends
    canvas.on("text:editing:exited", () => {
      activeText = null;
    });
  },

  handleMouseDown: (canvas: Canvas, pointer: Point) => {
    // If we're already editing text or clicked on an existing text, don't create new text
    const pointerEvent = pointer as unknown as TPointerEvent;
    const clickedObject = canvas.findTarget(pointerEvent);
    if (activeText || (clickedObject && clickedObject.type === "i-text")) {
      return;
    }

    // Create a new text object at click position
    const text = new IText("Enter text", {
      left: pointer.x,
      top: pointer.y,
      fontSize: 20,
      fill: "black",
      selectable: true,
      hasControls: true,
      editable: true,
    });

    canvas.add(text);
    canvas.setActiveObject(text);

    // Automatically enter editing mode
    text.enterEditing();
    text.selectAll();
    activeText = text;
  },

  handleMouseUp: (canvas: Canvas) => {
    const currentText = activeText;
    if (currentText && (!currentText.text || currentText.text.trim() === "")) {
      canvas.remove(currentText);
      activeText = null;
    }
  },

  cleanUp: (canvas: Canvas) => {
    activeText = null;
    canvas.off("text:editing:entered");
    canvas.off("text:editing:exited");
  },
};
