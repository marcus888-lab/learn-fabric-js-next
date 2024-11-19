import { Canvas, Object as FabricObject } from "fabric";
export { drawRectangle } from "./draw-rectangle";
export { drawCircle } from "./draw-circle";
export { drawTriangle } from "./draw-triangle";
export { drawText } from "./draw-text";
export { drawBrush } from "./draw-brush";
export { drawEraser } from "./draw-eraser";
export { drawLine } from "./draw-line";
export { drawPolygon } from "./draw-polygon";

export interface Point {
  x: number;
  y: number;
}

export interface DrawingTool {
  name: string;
  cursor: string;
  init?: (canvas: Canvas) => void;
  handleMouseDown?: (canvas: Canvas, pointer: Point) => void;
  handleMouseMove?: (canvas: Canvas, pointer: Point) => void;
  handleMouseUp?: (canvas: Canvas, pointer: Point) => void;
  cleanUp?: (canvas: Canvas) => void;
}

export interface DrawingToolContext {
  canvas: Canvas;
  isDrawing: boolean;
  currentShape?: FabricObject;
  startPoint?: Point;
}

export const createDrawingContext = (canvas: Canvas): DrawingToolContext => ({
  canvas,
  isDrawing: false,
});

export const initializeDrawingTool = (
  canvas: Canvas,
  tool: DrawingTool,
  addObject: (object: FabricObject) => void,
  setCurrentTool: (tool: string | null) => void
) => {
  if (!canvas) return;

  // Reset canvas state
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.defaultCursor = tool.cursor;

  // Remove previous event listeners
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");

  // Initialize tool
  tool.init?.(canvas);

  // Set up event handlers
  const context = createDrawingContext(canvas);
  let isDragging = false;

  canvas.on("mouse:down", (options) => {
    if (!options.e) return;

    // Check if we're clicking on an existing object
    const target = canvas.findTarget(options.e);
    if (target) {
      isDragging = true;
      return;
    }

    const pointer = canvas.getPointer(options.e);
    context.isDrawing = true;
    context.startPoint = pointer;
    tool.handleMouseDown?.(canvas, pointer);
  });

  canvas.on("mouse:move", (options) => {
    if (!context.isDrawing || !options.e || isDragging) return;
    const pointer = canvas.getPointer(options.e);
    tool.handleMouseMove?.(canvas, pointer);
  });

  canvas.on("mouse:up", (options) => {
    if (isDragging) {
      isDragging = false;
      return;
    }

    if (!context.isDrawing) return;
    context.isDrawing = false;
    if (context.startPoint) {
      const pointer = canvas.getPointer(options.e);
      tool.handleMouseUp?.(canvas, pointer);
    }
    if (context.currentShape) {
      addObject(context.currentShape);
      context.currentShape = undefined;
    }
    // Reset current tool after creating an object
    setCurrentTool(null);
  });

  return () => {
    tool.cleanUp?.(canvas);
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
  };
};
