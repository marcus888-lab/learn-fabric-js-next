"use client";

import React, { useRef, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useCanvasContext } from "../context/CanvasContext";
import { initializeDrawingTool } from '../lib/drawing-tools';
import {
  drawRectangle,
  drawCircle,
  drawTriangle,
  drawText,
  drawBrush,
  drawEraser
} from '../lib/drawing-tools';

const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const { currentTool, setCurrentTool, setCanvas, addObject } = useCanvasContext();

  useEffect(() => {
    if (canvasRef.current) {
      fabricCanvasRef.current = new FabricCanvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: 'white',
        isDrawingMode: false,
        selection: true
      });

      // Set canvas in context
      setCanvas(fabricCanvasRef.current);

      return () => {
        if (fabricCanvasRef.current) {
          fabricCanvasRef.current.dispose();
        }
      };
    }
  }, [setCanvas]); // Added setCanvas to dependency array

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const tools = {
      rectangle: drawRectangle,
      circle: drawCircle,
      triangle: drawTriangle,
      text: drawText,
      brush: drawBrush,
      eraser: drawEraser
    };

    const selectedTool = tools[currentTool];
    if (!selectedTool) {
      // If no tool is selected, enable object selection
      canvas.selection = true;
      canvas.defaultCursor = 'default';
      return;
    }

    // Initialize the selected tool
    const cleanup = initializeDrawingTool(canvas, selectedTool, addObject, setCurrentTool);

    // Return cleanup function
    return () => {
      if (cleanup) cleanup();
    };
  }, [currentTool, addObject, setCurrentTool]); // Added addObject and setCurrentTool to dependency array

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
