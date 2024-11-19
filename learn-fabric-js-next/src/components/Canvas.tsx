"use client";

import React, { useRef, useEffect } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { useCanvasContext } from "../context/CanvasContext";
import { useObject } from "../context/ObjectContext";
import { initializeDrawingTool } from "../lib/drawing-tools";
import {
  drawRectangle,
  drawCircle,
  drawTriangle,
  drawText,
  drawBrush,
  drawEraser,
} from "../lib/drawing-tools";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstanceRef = useRef<FabricCanvas | null>(null);
  const { currentTool, setCurrentTool, setCanvas, addObject } =
    useCanvasContext();
  const { selectObject } = useObject();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    console.log("Canvas: Initializing");
    const canvas = new FabricCanvas(canvasRef.current, {
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
    function handleObjectSelect(e: { selected?: FabricObject[] }) {
      console.log("Canvas: Selection event triggered");

      if (e.selected?.[0]) {
        const obj = e.selected[0];
        console.log("Canvas: Object selected", {
          type: obj.type,
          fill: obj.fill,
          opacity: obj.opacity,
        });

        // Ensure the object is active
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();

        // Update context
        requestAnimationFrame(() => {
          selectObject(obj);
        });
      }
    }

    function handleSelectionClear() {
      console.log("Canvas: Selection cleared");
      selectObject(null);
    }

    function handleObjectModified(e: { target: FabricObject }) {
      if (e.target) {
        console.log("Canvas: Object modified", {
          type: e.target.type,
          fill: e.target.fill,
          opacity: e.target.opacity,
        });
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
      "object:added": (e: { target: FabricObject }) => {
        console.log("Canvas: Object added", e.target);
      },
    });

    // Enable selection by default
    canvas.selection = true;

    // Cleanup
    return () => {
      console.log("Canvas: Cleaning up");
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

    const tools: Record<string, typeof drawRectangle> = {
      rectangle: drawRectangle,
      circle: drawCircle,
      triangle: drawTriangle,
      text: drawText,
      brush: drawBrush,
      eraser: drawEraser,
    };

    const selectedTool = tools[currentTool];
    if (!selectedTool || currentTool === "select") {
      canvas.isDrawingMode = false;
      canvas.selection = true;
      canvas.defaultCursor = "default";
      canvas.requestRenderAll();
      return;
    }

    const cleanup = initializeDrawingTool(
      canvas,
      selectedTool,
      addObject,
      (tool: string | null) => setCurrentTool(tool as any)
    );

    return cleanup;
  }, [currentTool, addObject, setCurrentTool]);

  return (
    <div className="canvas-container relative border border-gray-300 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
