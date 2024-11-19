"use client";

import React, { useRef, useEffect } from "react";
import * as fabric from "fabric";
import {
  useCanvasContext,
  DrawingTool as ToolType,
} from "../context/CanvasContext";
import { useObject } from "../context/ObjectContext";
import { initializeDrawingTool } from "../lib/drawing-tools";
import {
  drawRectangle,
  drawCircle,
  drawTriangle,
  drawText,
  drawBrush,
  drawEraser,
  drawLine,
  drawPolygon,
  DrawingTool,
} from "../lib/drawing-tools";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
  const { currentTool, setCurrentTool, setCanvas, addObject } =
    useCanvasContext();
  const { selectObject } = useObject();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    console.log("Canvas: Initializing");
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "white",
      isDrawingMode: false,
      selection: true,
      preserveObjectStacking: true,
    });

    canvasInstanceRef.current = canvas;
    setCanvas(canvas);

    // Selection handlers
    function handleObjectSelect(e: { selected?: fabric.Object[] }) {
      if (e.selected?.[0]) {
        const obj = e.selected[0];
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();
        selectObject(obj);
      }
    }

    function handleSelectionClear() {
      selectObject(null);
    }

    function handleObjectModified(e: { target: fabric.Object }) {
      if (e.target) {
        e.target.setCoords();
        canvas.requestRenderAll();
      }
    }

    // Bind events
    canvas.on({
      "selection:created": handleObjectSelect,
      "selection:updated": handleObjectSelect,
      "selection:cleared": handleSelectionClear,
      "object:modified": handleObjectModified,
    });

    // Enable selection by default
    canvas.selection = true;

    // Cleanup
    return () => {
      canvas.off({
        "selection:created": handleObjectSelect,
        "selection:updated": handleObjectSelect,
        "selection:cleared": handleSelectionClear,
        "object:modified": handleObjectModified,
      });
      canvas.dispose();
      canvasInstanceRef.current = null;
    };
  }, [setCanvas, selectObject]);

  // Handle tool changes
  useEffect(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    const tools: Record<string, DrawingTool> = {
      rectangle: drawRectangle,
      circle: drawCircle,
      triangle: drawTriangle,
      text: drawText,
      brush: drawBrush,
      eraser: drawEraser,
      line: drawLine,
      polygon: drawPolygon,
    };

    const selectedTool = tools[currentTool];
    if (!selectedTool || currentTool === "select") {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.defaultCursor = "default";
      canvas.requestRenderAll();
      return;
    }

    // Add ESC key handler for polygon tool
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && currentTool === "polygon") {
        setCurrentTool("select" as ToolType);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const cleanup = initializeDrawingTool(
      canvas,
      selectedTool,
      addObject,
      (tool: string | null) => setCurrentTool((tool || "select") as ToolType)
    );

    return () => {
      cleanup?.();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentTool, addObject, setCurrentTool]);

  return (
    <div className="canvas-container relative border border-gray-300 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
