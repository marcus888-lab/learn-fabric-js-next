import * as fabric from 'fabric';
import { PolygonVertex } from './PolygonVertex';

export class PolygonEdge extends fabric.Line {
    nextEdge: PolygonEdge | null = null;
    prevEdge: PolygonEdge | null = null;
    source: PolygonVertex;
    target: PolygonVertex;
    private hitboxPadding = 5;
    private isRemoving = false;
  
    constructor(
      source: PolygonVertex,
      target: PolygonVertex,
      options: Partial<fabric.Object> = {}
    ) {
      const points: [number, number, number, number] = [
        source.left! + source.radius!,
        source.top! + source.radius!,
        target.left! + target.radius!,
        target.top! + target.radius!
      ];
  
      super(points, {
        ...options,
        hasBorders: false,
        hasControls: false,
        perPixelTargetFind: true,
        selectable: false,
        evented: false,
      });
  
      this.source = source;
      this.target = target;
  
      // 將邊加入到頂點的邊集合中
      source.addEdge(this);
      target.addEdge(this);
  
      // 更新線段位置當頂點移動時
      source.on("moving", () => this.updatePosition());
      target.on("moving", () => this.updatePosition());
  
      // 處理刪除事件
      this.on('removed', () => {
        if (this.isRemoving) return;
        this.isRemoving = true;
  
        // 移除相關的頂點
        if (this.source?.canvas) {
          this.source.removeEdge(this);
          if (this.source.edges.length === 0) {
            this.source.canvas.remove(this.source);
          }
        }
        if (this.target?.canvas) {
          this.target.removeEdge(this);
          if (this.target.edges.length === 0) {
            this.target.canvas.remove(this.target);
          }
        }
  
        // 更新相鄰邊的關係
        if (this.prevEdge) {
          this.prevEdge.nextEdge = this.nextEdge;
        }
        if (this.nextEdge) {
          this.nextEdge.prevEdge = this.prevEdge;
        }
  
        this.isRemoving = false;
      });
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
  
      this.set({
        x1: sourceCenter.x,
        y1: sourceCenter.y,
        x2: targetCenter.x,
        y2: targetCenter.y,
      });
  
      this.setCoords();
      if (this.canvas) {
        this.canvas.requestRenderAll();
      }
    }
  
    // 精確的點擊檢測
    containsPoint(point: fabric.Point): boolean {
      const lineStart = new fabric.Point(this.x1!, this.y1!);
      const lineEnd = new fabric.Point(this.x2!, this.y2!);
      return this.distanceFromPointToLine(point, lineStart, lineEnd) <= this.hitboxPadding;
    }
  
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