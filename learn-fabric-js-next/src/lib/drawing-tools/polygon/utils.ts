import * as fabric from 'fabric';
import { DrawingState } from './types';
import { CLOSE_THRESHOLD, NORMAL_COLOR, CLOSE_COLOR } from './constants';

/**
 * 創建預覽線
 */
export const createPreviewLine = (
  canvas: fabric.Canvas, 
  pointer: fabric.Point, 
  state: DrawingState
): void => {
  // 如果已存在預覽線且在 canvas 上，先移除
  if (state.previewLine && state.previewLine.canvas) {
    canvas.remove(state.previewLine);
  }

  // 獲取起點（最後一個頂點的中心點）
  const startPoint = state.lastVertex ? {
    x: state.lastVertex.left! + state.lastVertex.radius!,
    y: state.lastVertex.top! + state.lastVertex.radius!
  } : pointer;

  // 創建新的預覽線，從最後一個頂點到當前滑鼠位置
  state.previewLine = new fabric.Line(
    [
      startPoint.x, 
      startPoint.y, 
      pointer.x, 
      pointer.y
    ], 
    {
      stroke: NORMAL_COLOR,
      strokeWidth: 2,
      strokeDashArray: [3, 3],
      selectable: false,
      evented: false,
      hoverCursor: 'default'
    }
  );

  canvas.add(state.previewLine);
  canvas.requestRenderAll();
};

/**
 * 更新預覽線
 */
export const updatePreviewLine = (
  canvas: fabric.Canvas, 
  pointer: fabric.Point, 
  state: DrawingState
): void => {
  if (!state.previewLine || !state.lastVertex || !state.firstVertex) return;

  // 計算起點（最後一個頂點的中心）
  const startPoint = {
    x: state.lastVertex.left! + state.lastVertex.radius!,
    y: state.lastVertex.top! + state.lastVertex.radius!
  };

  // 計算第一個頂點的中心點
  const firstVertexCenter = {
    x: state.firstVertex.left! + state.firstVertex.radius!,
    y: state.firstVertex.top! + state.firstVertex.radius!
  };

  // 計算與第一個頂點的距離
  const distanceToFirst = Math.sqrt(
    Math.pow(firstVertexCenter.x - pointer.x, 2) +
    Math.pow(firstVertexCenter.y - pointer.y, 2)
  );

  // 判斷是否接近起始點（可以閉合多邊形）
  const isNearFirstVertex = state.vertices.length >= 3 && distanceToFirst < CLOSE_THRESHOLD;

  // 更新預覽線的位置和顏色
  state.previewLine.set({
    x1: startPoint.x,
    y1: startPoint.y,
    x2: isNearFirstVertex ? firstVertexCenter.x : pointer.x,
    y2: isNearFirstVertex ? firstVertexCenter.y : pointer.y,
    stroke: isNearFirstVertex ? CLOSE_COLOR : NORMAL_COLOR
  });

  // 更新第一個頂點的外觀
  if (isNearFirstVertex) {
    state.firstVertex.set({
      stroke: CLOSE_COLOR,
      fill: CLOSE_COLOR
    });
  } else {
    state.firstVertex.set({
      stroke: '#000',
      fill: '#fff'
    });
  }

  canvas.requestRenderAll();
};

/**
 * 清理繪圖狀態
 */
export const cleanupDrawing = (state: DrawingState): void => {
  // 重置所有狀態
  state.isDrawing = false;
  
  // 重置第一個頂點的顏色（如果存在）
  if (state.firstVertex) {
    state.firstVertex.set({
      stroke: '#000',
      fill: '#fff'
    });
  }

  // 清空所有數組
  state.vertices = [];
  state.edges = [];
  state.firstVertex = null;
  state.lastVertex = null;

  // 移除預覽線
  if (state.previewLine && state.previewLine.canvas) {
    state.previewLine.canvas.remove(state.previewLine);
  }
  state.previewLine = null;
};

/**
 * 計算兩點之間的距離
 */
export const calculateDistance = (point1: fabric.Point, point2: fabric.Point): number => {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
};

/**
 * 檢查是否可以閉合多邊形
 */
export const canClosePolygon = (
  pointer: fabric.Point, 
  state: DrawingState
): boolean => {
  if (!state.firstVertex || state.vertices.length < 3) return false;

  const firstVertexCenter = {
    x: state.firstVertex.left! + state.firstVertex.radius!,
    y: state.firstVertex.top! + state.firstVertex.radius!
  };

  const distance = calculateDistance(
    new fabric.Point(firstVertexCenter.x, firstVertexCenter.y),
    pointer
  );

  return distance < CLOSE_THRESHOLD;
};