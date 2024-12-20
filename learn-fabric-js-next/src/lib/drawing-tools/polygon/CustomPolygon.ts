import * as fabric from 'fabric';
import { PolygonVertex } from './PolygonVertex';
import { PolygonEdge } from './PolygonEdge';


export class CustomPolygon extends fabric.Group {
    vertices: PolygonVertex[];
    edges: PolygonEdge[];
    static type = 'region';

    constructor(vertices: PolygonVertex[], edges: PolygonEdge[], options: Partial<fabric.FabricObjectProps> = {}) {
      // 首先將所有物件傳入 super
      const objects = [...vertices, ...edges];
      super(objects, {
        ...options,
        subTargetCheck: true,
        interactive: true,
      });
  
      this.vertices = vertices;
      this.edges = edges;
  
      // 設置頂點的事件處理
      this.vertices.forEach(vertex => {
        vertex.on('moving', () => {
          // 更新相關的邊
          vertex.edges.forEach(edge => edge.updatePosition());
          this.setCoords();
        });
      });
    }
  
    // 如果需要更新群組中的物件，可以使用這個方法
    updateObjects() {
      // 更新群組中的物件
      this._objects = [...this.vertices, ...this.edges];
      // 重新計算群組的邊界
      this.setCoords();
      // 請求重新渲染
      if (this.canvas) {
        this.canvas.requestRenderAll();
      }
    }
  }
