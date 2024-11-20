import { Canvas, Object as FabricObject } from "fabric";

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
