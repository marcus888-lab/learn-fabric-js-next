import * as fabric from 'fabric';
import { DrawingTool } from './types';
import { DrawingState } from './polygon/types';
import { PolygonVertex } from './polygon/PolygonVertex';
import { PolygonEdge } from './polygon/PolygonEdge';
import { CustomPolygon } from './polygon/CustomPolygon';
import { createPreviewLine, updatePreviewLine, cleanupDrawing } from './polygon/utils';

// 將state提升到模組級別
let currentState: DrawingState = {
  isDrawing: false,
  vertices: [],
  edges: [],
  firstVertex: null,
  lastVertex: null,
  previewLine: null,
};

export const drawPolygon: DrawingTool = {
  name: "polygon",
  cursor: "crosshair",

  handleMouseDown: (canvas: fabric.Canvas) => {
    // 重置狀態
    currentState = {
      isDrawing: false,
      vertices: [],
      edges: [],
      firstVertex: null,
      lastVertex: null,
      previewLine: null,
    };

    const clickHandler = (event: MouseEvent) => {
      const pointer = canvas.getPointer(event);
      
      if (!currentState.isDrawing) {
        currentState.isDrawing = true;
        const vertex = new PolygonVertex({
          left: pointer.x - 6,
          top: pointer.y - 6,
        });
        
        currentState.vertices.push(vertex);
        currentState.firstVertex = vertex;
        currentState.lastVertex = vertex;
        canvas.add(vertex);
      } else {
        if (currentState.vertices.length >= 3) {
          const firstVertexCenter = {
            x: currentState.firstVertex!.left! + currentState.firstVertex!.radius!,
            y: currentState.firstVertex!.top! + currentState.firstVertex!.radius!
          };
          
          const distance = Math.sqrt(
            Math.pow(firstVertexCenter.x - pointer.x, 2) +
            Math.pow(firstVertexCenter.y - pointer.y, 2)
          );

          if (distance < 20) {
            const finalEdge = new PolygonEdge(currentState.lastVertex!, currentState.firstVertex!, {
              stroke: '#000',
              strokeWidth: 2,
            });
            
            // 創建完整的多邊形物件
            const polygon = new CustomPolygon(currentState.vertices, [...currentState.edges, finalEdge], {
              hasBorders: true,
              hasControls: true,
            });

            // 移除原有的獨立物件
            currentState.vertices.forEach(v => canvas.remove(v));
            currentState.edges.forEach(e => canvas.remove(e));
            if (currentState.previewLine) canvas.remove(currentState.previewLine);

            // 添加新的多邊形物件
            canvas.add(polygon);
            
            cleanupDrawing(currentState);
            canvas.wrapperEl.removeEventListener('click', clickHandler);
            return;
          }
        }

        const newVertex = new PolygonVertex({
          left: pointer.x - 6,
          top: pointer.y - 6,
        });
        
        const newEdge = new PolygonEdge(currentState.lastVertex!, newVertex, {
          stroke: '#000',
          strokeWidth: 2,
        });

        canvas.add(newVertex);
        canvas.add(newEdge);
        
        currentState.vertices.push(newVertex);
        currentState.edges.push(newEdge);
        currentState.lastVertex = newVertex;
      }
    };

    // 添加mousemove事件監聽器
    const mouseMoveHandler = (event: MouseEvent) => {
      if (!currentState.isDrawing) return;
      const pointer = canvas.getPointer(event);
      
      // 如果還沒有預覽線，創建一個
      if (!currentState.previewLine) {
        createPreviewLine(canvas, pointer, currentState);
      }
      
      updatePreviewLine(canvas, pointer, currentState);
    };

    canvas.wrapperEl.addEventListener('click', clickHandler);
    canvas.wrapperEl.addEventListener('mousemove', mouseMoveHandler);

    // 記得在清理時移除事件監聽器
    return () => {
      canvas.wrapperEl.removeEventListener('click', clickHandler);
      canvas.wrapperEl.removeEventListener('mousemove', mouseMoveHandler);
    };
  },

  cleanUp: (canvas?: fabric.Canvas) => {
    if (canvas) {
      // 清除所有相關的物件
      currentState.vertices.forEach(v => canvas.remove(v));
      currentState.edges.forEach(e => canvas.remove(e));
      if (currentState.previewLine) {
        canvas.remove(currentState.previewLine);
      }
      
      // 重新渲染畫布
      canvas.requestRenderAll();
    }
    
    // 清理狀態
    cleanupDrawing(currentState);
    
    // 重置當前狀態
    currentState = {
      isDrawing: false,
      vertices: [],
      edges: [],
      firstVertex: null,
      lastVertex: null,
      previewLine: null,
    };
  },
};