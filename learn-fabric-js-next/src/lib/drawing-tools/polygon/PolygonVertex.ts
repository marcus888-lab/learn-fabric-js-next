import * as fabric from 'fabric';
import { PolygonEdge } from './PolygonEdge';

export class PolygonVertex extends fabric.Circle {
  edges: PolygonEdge[] = [];

  constructor(options: Partial<fabric.FabricObjectProps> = {}) {
    super({
      ...options,
      radius: 6,
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      hasControls: false,
      hasBorders: false,
      selectable: true,
    });
  }

  addEdge(edge: PolygonEdge) {
    this.edges.push(edge);
  }

  removeEdge(edge: PolygonEdge) {
    this.edges = this.edges.filter(e => e !== edge);
  }
}