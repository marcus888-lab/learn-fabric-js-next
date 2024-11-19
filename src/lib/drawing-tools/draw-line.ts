import * as fabric from "fabric";
import { DrawingTool, Point } from "./index";

class CustomLine extends fabric.Line {
  endpoints: fabric.Circle[];
  canvas: fabric.Canvas | null;

  constructor(points: number[], options: fabric.ILineOptions = {}) {
    super(points, {
      ...options,
      originX: "center",
      originY: "center",
    });
    this.canvas = null;

    // Create endpoints
    this.endpoints = [
      new fabric.Circle({
        left: points[0] - 5,
        top: points[1] - 5,
        radius: 5,
        fill: "#000000",
        stroke: "#ffffff",
        strokeWidth: 1,
        selectable: false,
        evented: false,
      }),
      new fabric.Circle({
        left: points[2] - 5,
        top: points[3] - 5,
        radius: 5,
        fill: "#000000",
        stroke: "#ffffff",
        strokeWidth: 1,
        selectable: false,
        evented: false,
      }),
    ];

    this.on("modified", () => this.updateEndpoints());
  }

  updateEndpoints() {
    if (!this.canvas) return;

    const points =
      this.get("x1") !== undefined
        ? {
            x1: this.get("x1"),
            y1: this.get("y1"),
            x2: this.get("x2"),
            y2: this.get("y2"),
          }
        : { x1: 0, y1: 0, x2: 0, y2: 0 };

    const matrix = this.calcTransformMatrix();
    const p1 = fabric.util.transformPoint(
      new fabric.Point(points.x1, points.y1),
      matrix
    );
    const p2 = fabric.util.transformPoint(
      new fabric.Point(points.x2, points.y2),
      matrix
    );

    this.endpoints[0].set({
      left: p1.x - 5,
      top: p1.y - 5,
    });
    this.endpoints[1].set({
      left: p2.x - 5,
      top: p2.y - 5,
    });

    this.endpoints.forEach((endpoint) => {
      endpoint.setCoords();
    });

    this.canvas.requestRenderAll();
  }

  addToCanvas(canvas: fabric.Canvas) {
    this.canvas = canvas;
    canvas.add(this);
    this.endpoints.forEach((endpoint) => canvas.add(endpoint));

    canvas.on("object:moving", (e) => {
      if (e.target === this) {
        this.updateEndpoints();
      }
    });

    canvas.on("object:rotating", (e) => {
      if (e.target === this) {
        this.updateEndpoints();
      }
    });

    canvas.on("object:scaling", (e) => {
      if (e.target === this) {
        this.updateEndpoints();
      }
    });

    this.updateEndpoints();
  }

  removeFromCanvas() {
    if (!this.canvas) return;
    this.endpoints.forEach((endpoint) => this.canvas?.remove(endpoint));
    this.canvas.remove(this);
    this.canvas = null;
  }
}

let startPoint: Point | null = null;
let isDrawing = false;
let tempLine: CustomLine | null = null;

export const drawLine: DrawingTool = {
  name: "line",
  cursor: "crosshair",

  handleMouseDown: (canvas: fabric.Canvas, pointer: Point) => {
    startPoint = pointer;
    isDrawing = true;
  },

  handleMouseMove: (canvas: fabric.Canvas, pointer: Point) => {
    if (!isDrawing || !startPoint) return;

    // Remove previous temp line if it exists
    if (tempLine) {
      tempLine.removeFromCanvas();
    }

    // Create preview line
    tempLine = new CustomLine(
      [startPoint.x, startPoint.y, pointer.x, pointer.y],
      {
        stroke: "#000000",
        strokeWidth: 2,
        selectable: false,
        evented: false,
      }
    );

    tempLine.addToCanvas(canvas);
  },

  handleMouseUp: (canvas: fabric.Canvas, pointer: Point) => {
    if (!isDrawing || !startPoint || !pointer) {
      isDrawing = false;
      startPoint = null;
      return;
    }

    // Remove temp line
    if (tempLine) {
      tempLine.removeFromCanvas();
      tempLine = null;
    }

    // Create permanent line
    const line = new CustomLine(
      [startPoint.x, startPoint.y, pointer.x, pointer.y],
      {
        stroke: "#000000",
        strokeWidth: 2,
        selectable: true,
        hasBorders: true,
        hasControls: true,
        hasRotatingPoint: true,
        transparentCorners: false,
        perPixelTargetFind: true,
        lockMovementX: false,
        lockMovementY: false,
      }
    );

    line.addToCanvas(canvas);
    canvas.setActiveObject(line);

    isDrawing = false;
    startPoint = null;
  },

  cleanUp: () => {
    startPoint = null;
    isDrawing = false;
    if (tempLine) {
      tempLine = null;
    }
  },
};
