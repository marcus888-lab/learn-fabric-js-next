import * as fabric from "fabric";
import { DrawingTool, Point } from "./index";

let startPoint: Point | null = null;
let isDrawing = false;
let startCircle: fabric.Circle | null = null;
let endCircle: fabric.Circle | null = null;
let selectedObject: fabric.Object | null = null;

class ConnectionLine extends fabric.Line {
  source: fabric.Circle;
  target: fabric.Circle;

  constructor(
    source: fabric.Circle,
    target: fabric.Circle,
    options: Partial<fabric.Object> = {}
  ) {
    const points: [number, number, number, number] = [0, 0, 0, 0];
    super(points, {
      ...options,
      selectable: false,
      evented: false,
    });

    this.source = source;
    this.target = target;

    // Update line position when circles move
    source.on("moving", this.updatePosition.bind(this));
    target.on("moving", this.updatePosition.bind(this));

    this.updatePosition();
  }

  updatePosition() {
    if (!this.source || !this.target) return;

    const sourceCenter = {
      x: this.source.left! + this.source.radius!,
      y: this.source.top! + this.source.radius!,
    };

    const targetCenter = {
      x: this.target.left! + this.target.radius!,
      y: this.target.top! + this.target.radius!,
    };

    // Update line coordinates
    this.set({
      x1: sourceCenter.x,
      y1: sourceCenter.y,
      x2: targetCenter.x,
      y2: targetCenter.y,
    });

    this.setCoords();
  }
}

export const drawLine: DrawingTool = {
  name: "line",
  cursor: "crosshair",

  handleMouseDown: (canvas: fabric.Canvas, pointer: Point) => {
    const objects = canvas.getObjects();
    const target = objects.find((obj) => {
      const point = new fabric.Point(pointer.x, pointer.y);
      return obj.containsPoint(point);
    });

    if (target) {
      selectedObject = target;
      return;
    }

    selectedObject = null;
    startPoint = pointer;
    isDrawing = true;

    startCircle = new fabric.Circle({
      left: pointer.x - 5,
      top: pointer.y - 5,
      radius: 5,
      fill: "red",
      selectable: true,
      hasControls: false,
      hasBorders: false,
    });
    canvas.add(startCircle);
    canvas.requestRenderAll();
  },

  handleMouseMove: (canvas: fabric.Canvas, pointer: Point) => {
    if (!isDrawing || !startPoint) return;

    if (endCircle) {
      canvas.remove(endCircle);
    }

    endCircle = new fabric.Circle({
      left: pointer.x - 5,
      top: pointer.y - 5,
      radius: 5,
      fill: "red",
      selectable: true,
      hasControls: false,
      hasBorders: false,
    });

    canvas.add(endCircle);
    canvas.requestRenderAll();
  },

  handleMouseUp: (canvas: fabric.Canvas, pointer: Point) => {
    if (!isDrawing || !startPoint) {
      isDrawing = false;
      startPoint = null;
      return;
    }

    const permStartCircle = new fabric.Circle({
      left: startPoint.x - 5,
      top: startPoint.y - 5,
      radius: 5,
      fill: "red",
      selectable: true,
      hasControls: false,
      hasBorders: false,
    });

    const permEndCircle = new fabric.Circle({
      left: pointer.x - 5,
      top: pointer.y - 5,
      radius: 5,
      fill: "red",
      selectable: true,
      hasControls: false,
      hasBorders: false,
    });

    // Create the connection line
    const connectionLine = new ConnectionLine(permStartCircle, permEndCircle, {
      stroke: "#000000",
      strokeWidth: 2,
    });

    // Add objects to canvas
    canvas.add(permStartCircle);
    canvas.add(permEndCircle);
    canvas.add(connectionLine);

    // Clean up temp objects
    if (startCircle) {
      canvas.remove(startCircle);
      startCircle = null;
    }
    if (endCircle) {
      canvas.remove(endCircle);
      endCircle = null;
    }

    isDrawing = false;
    startPoint = null;
    canvas.requestRenderAll();
  },

  cleanUp: () => {
    startPoint = null;
    isDrawing = false;
    startCircle = null;
    endCircle = null;
    selectedObject = null;
  },
};
