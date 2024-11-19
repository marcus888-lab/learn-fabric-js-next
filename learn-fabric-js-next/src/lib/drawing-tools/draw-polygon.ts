import * as fabric from "fabric";
import { DrawingTool, Point } from "./index";

let activePolygon: CustomPolygon | null = null;
let points: Point[] = [];
let isDrawing = false;

const renderControl = (
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number
) => {
  ctx.save();
  ctx.beginPath();
  ctx.arc(left, top, 6, 0, Math.PI * 2, false);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
};

class CustomPolygon extends fabric.Polygon {
  isClosed: boolean = false;

  constructor(points: Point[], options: Partial<fabric.IPolygonOptions>) {
    super(points, {
      ...options,
      left: 0,
      top: 0,
      originX: "left",
      originY: "top",
      perPixelTargetFind: true,
    });
    this.objectCaching = false;

    // Handle double click to add new vertex
    this.on(
      "mousedblclick",
      (opt: fabric.TPointerEventInfo<MouseEvent | TouchEvent>) => {
        if (!this.canvas || !this.points) return;
        const pointer = this.canvas.getPointer(opt.e);

        // Find closest line segment
        let minDistance = Infinity;
        let insertIndex = -1;

        for (let i = 0; i < this.points.length; i++) {
          const p1 = this.points[i];
          const p2 = this.points[(i + 1) % this.points.length];
          const distance = this.distanceToLineSegment(pointer, p1, p2);

          if (distance < minDistance) {
            minDistance = distance;
            insertIndex = i + 1;
          }
        }

        if (minDistance < 10) {
          const newPoints = [...this.points];
          newPoints.splice(insertIndex, 0, pointer);
          this.set({ points: newPoints });
          this.updateControls();
          this.canvas.requestRenderAll();
        }
      }
    );

    // Show controls when selected
    this.on("selected", () => {
      this.updateControls();
      if (this.canvas) {
        this.canvas.requestRenderAll();
      }
    });
  }

  distanceToLineSegment(p: Point, v: Point, w: Point) {
    const l2 = Math.pow(w.x - v.x, 2) + Math.pow(w.y - v.y, 2);
    if (l2 === 0)
      return Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2));

    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));

    return Math.sqrt(
      Math.pow(p.x - (v.x + t * (w.x - v.x)), 2) +
        Math.pow(p.y - (v.y + t * (w.y - v.y)), 2)
    );
  }

  _render(ctx: CanvasRenderingContext2D) {
    if (!this.points || this.points.length < 2) return;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    if (this.isClosed) {
      ctx.lineTo(this.points[0].x, this.points[0].y);
      ctx.closePath();
      if (this.fill) {
        ctx.fillStyle = this.fill as string;
        ctx.fill();
      }
    }

    if (this.stroke) {
      ctx.strokeStyle = this.stroke as string;
      ctx.lineWidth = this.strokeWidth || 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  updateControls() {
    if (!this.points) return;

    this.controls = {};
    this.points.forEach((point, index) => {
      this.controls[`p${index}`] = new fabric.Control({
        positionHandler: () => {
          return new fabric.Point(point.x, point.y);
        },
        actionHandler: (_e, transform, x, y) => {
          const newPoints = [...this.points!];
          newPoints[index] = { x, y };
          this.set({ points: newPoints });
          return true;
        },
        render: renderControl,
        cursorStyle: "pointer",
        visible: true,
      });
    });
  }

  _setCornerCoords() {
    if (!this.points) return;

    this.oCoords = {};
    this.points.forEach((point, index) => {
      const p = new fabric.Point(point.x, point.y);
      this.oCoords[`p${index}`] = p;
    });

    return this;
  }
}

// Function to handle ESC key press
const handleKeyDown = (e: KeyboardEvent, canvas: fabric.Canvas) => {
  if (e.key === "Escape" && isDrawing) {
    if (activePolygon && canvas) {
      canvas.remove(activePolygon);
      canvas.requestRenderAll();
    }
    isDrawing = false;
    points = [];
    activePolygon = null;
  }
};

export const drawPolygon: Tool = {
  name: "polygon",
  cursor: "crosshair",

  handleMouseDown: (canvas: fabric.Canvas, pointer: Point) => {
    if (!isDrawing) {
      isDrawing = true;
      points = [pointer];
      const polygon = new CustomPolygon(points, {
        stroke: "#000000",
        strokeWidth: 2,
        fill: "transparent",
        selectable: false,
        hasBorders: false,
        hasControls: true,
      } as fabric.IPolygonOptions);

      // Add keyboard event listener when starting to draw
      document.addEventListener("keydown", (e) => handleKeyDown(e, canvas));

      polygon.updateControls();
      activePolygon = polygon;
      canvas.add(polygon);
    } else {
      // Check if clicking near start point to close polygon
      const startPoint = points[0];
      const dx = startPoint.x - pointer.x;
      const dy = startPoint.y - pointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 20 && points.length >= 3) {
        // Close polygon
        if (activePolygon) {
          points.push(points[0]); // Close the polygon by adding first point
          activePolygon.set({
            points: points,
            isClosed: true,
            selectable: true,
            hasBorders: true,
            hasControls: true,
            evented: true,
            fill: "rgba(0, 0, 0, 0.1)",
          } as fabric.IPolygonOptions);
          activePolygon.setCoords();
          activePolygon.updateControls();

          // Remove keyboard event listener when polygon is completed
          document.removeEventListener("keydown", (e) =>
            handleKeyDown(e, canvas)
          );

          // Make sure the polygon is selected and active
          canvas.setActiveObject(activePolygon);
          canvas.requestRenderAll();

          // Fire selection event
          canvas.fire("selection:created", { selected: [activePolygon] });
        }
        isDrawing = false;
        points = [];
        activePolygon = null;
      } else {
        // Add new point
        points.push(pointer);
        if (activePolygon) {
          activePolygon.set({ points: points });
          activePolygon.setCoords();
          activePolygon.updateControls();
          canvas.requestRenderAll();
        }
      }
    }
  },

  handleMouseMove: (canvas: fabric.Canvas, pointer: Point) => {
    if (!isDrawing || !activePolygon) return;

    const currentPoints = [...points, pointer];
    activePolygon.set({ points: currentPoints });
    activePolygon.setCoords();
    canvas.requestRenderAll();
  },

  handleMouseUp: () => {
    // Point-by-point creation, no action needed on mouse up
  },

  cleanUp: (canvas?: fabric.Canvas) => {
    // Remove keyboard event listener when cleaning up
    if (canvas) {
      document.removeEventListener("keydown", (e) => handleKeyDown(e, canvas));
    }
    activePolygon = null;
    points = [];
    isDrawing = false;
  },
};
