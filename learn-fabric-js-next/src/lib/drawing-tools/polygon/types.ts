import * as fabric from 'fabric';
import { PolygonVertex } from './PolygonVertex';
import { PolygonEdge } from './PolygonEdge';

export interface DrawingState {
  isDrawing: boolean;
  vertices: PolygonVertex[];
  edges: PolygonEdge[];
  firstVertex: PolygonVertex | null;
  lastVertex: PolygonVertex | null;
  previewLine: fabric.Line | null;
}