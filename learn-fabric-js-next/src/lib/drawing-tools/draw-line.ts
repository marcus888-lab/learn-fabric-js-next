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
  private hitboxPadding = 5;
  private lastLeft: number = 0;
  private lastTop: number = 0;

  constructor(
    source: fabric.Circle,
    target: fabric.Circle,
    options: Partial<fabric.Object> = {}
  ) {
    const points: [number, number, number, number] = [0, 0, 0, 0];
    super(points, {
      ...options,
      hasBorders: false,
      hasControls: false,
      perPixelTargetFind: true,
    });

    this.source = source;
    this.target = target;

    // Initially hide the circles
    this.source.set("fill", "transparent");
    this.target.set("fill", "transparent");

    // Update line position when circles move
    source.on("moving", () => {
      this.updatePosition();
      this.canvas?.requestRenderAll();
    });
    target.on("moving", () => {
      this.updatePosition();
      this.canvas?.requestRenderAll();
      this.showCircles();
    });

    // Show circles in any selected state
    this.on("selected", this.showCircles.bind(this));
    this.on("moving", this.showCircles.bind(this));
    this.on("scaling", this.showCircles.bind(this));
    this.on("rotating", this.showCircles.bind(this));
    this.on("mousedown", this.showCircles.bind(this));

    // Hide circles when deselected
    this.on("deselected", () => {
      this.source.set("fill", "transparent");
      this.target.set("fill", "transparent");
      this.canvas?.requestRenderAll();
    });

    // Handle line movement
    this.on("moving", () => {
      const dx = this.left! - this.lastLeft;
      const dy = this.top! - this.lastTop;

      // Move circles with the line
      this.source.set({
        left: this.source.left! + dx,
        top: this.source.top! + dy,
      });
      this.target.set({
        left: this.target.left! + dx,
        top: this.target.top! + dy,
      });

      this.source.setCoords();
      this.target.setCoords();
      this.updatePosition();

      // Store current position for next move
      this.lastLeft = this.left!;
      this.lastTop = this.top!;

      this.canvas?.requestRenderAll();
    });

    this.on("mousedown", () => {
      // Store initial position when starting to move
      this.lastLeft = this.left!;
      this.lastTop = this.top!;
    });

    this.updatePosition();
  }

  showCircles() {
    this.source.set("fill", "red");
    this.target.set("fill", "red");
    this.canvas?.requestRenderAll();
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
      left: Math.min(sourceCenter.x, targetCenter.x),
      top: Math.min(sourceCenter.y, targetCenter.y),
    });

    // Update last position
    this.lastLeft = this.left!;
    this.lastTop = this.top!;

    this.setCoords();
  }

  // Override containsPoint to implement precise hit detection
  containsPoint(point: fabric.Point): boolean {
    const lineStart = new fabric.Point(this.x1!, this.y1!);
    const lineEnd = new fabric.Point(this.x2!, this.y2!);

    // Calculate distance from point to line
    const distance = this.distanceFromPointToLine(point, lineStart, lineEnd);

    return distance <= this.hitboxPadding;
  }

  // Helper method to calculate distance from point to line
  private distanceFromPointToLine(
    point: fabric.Point,
    lineStart: fabric.Point,
    lineEnd: fabric.Point
  ): number {
    const lineLength = lineStart.distanceFrom(lineEnd);
    if (lineLength === 0) return point.distanceFrom(lineStart);

    const t =
      ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) +
        (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) /
      (lineLength * lineLength);

    if (t < 0) return point.distanceFrom(lineStart);
    if (t > 1) return point.distanceFrom(lineEnd);

    return point.distanceFrom(
      new fabric.Point(
        lineStart.x + t * (lineEnd.x - lineStart.x),
        lineStart.y + t * (lineEnd.y - lineStart.y)
      )
    );
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
      left: pointer.x - 10,
      top: pointer.y - 10,
      radius: 10,
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
      left: pointer.x - 10,
      top: pointer.y - 10,
      radius: 10,
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
      left: startPoint.x - 10,
      top: startPoint.y - 10,
      radius: 10,
      fill: "red",
      selectable: true,
      hasControls: false,
      hasBorders: false,
    });

    const permEndCircle = new fabric.Circle({
      left: pointer.x - 10,
      top: pointer.y - 10,
      radius: 10,
      fill: "red",
      selectable: true,
      hasControls: false,
      hasBorders: false,
    });

    // Create the connection line
    const connectionLine = new ConnectionLine(permStartCircle, permEndCircle, {
      stroke: "#000000",
      strokeWidth: 2,
      selectable: true,
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
