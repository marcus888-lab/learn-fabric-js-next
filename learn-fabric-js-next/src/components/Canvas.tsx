"use client";

import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { useCanvasContext } from "../context/CanvasContext";
import { useObject } from "../context/ObjectContext";
import selectTool from "../lib/select-tools/select";

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setCanvas } = useCanvasContext();
  const { selectObject } = useObject();
  const [currentTool, setCurrentTool] = useState(selectTool);

  useEffect(() => {
    if (canvasRef.current) {
      console.log("Canvas: Initializing");
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 1280,
        height: 720,
        backgroundColor: "white",
        preserveObjectStacking: true,
        selection: true, // Enable selection
        selectionKey: "shiftKey", // Use shift key for multiple selection
      });

      // Handle object selection
      fabricCanvas.on("selection:created", (e) => {
        console.log("Selection created:", {
          type: e.selected?.[0]?.type,
          hasCanvas: !!e.selected?.[0]?.canvas,
        });
        if (e.selected && e.selected[0]) {
          selectObject(e.selected[0]);
        }
      });

      fabricCanvas.on("selection:updated", (e) => {
        console.log("Selection updated:", {
          type: e.selected?.[0]?.type,
          hasCanvas: !!e.selected?.[0]?.canvas,
        });
        if (e.selected && e.selected[0]) {
          selectObject(e.selected[0]);
        }
      });

      fabricCanvas.on("selection:cleared", () => {
        console.log("Selection cleared");
        // Clear the selection state regardless of active object
        selectObject(null);
      });

      // Handle object addition
      fabricCanvas.on("object:added", (e) => {
        console.log("Object added:", {
          type: e.target?.type,
          hasCanvas: !!e.target?.canvas,
        });
        if (e.target) {
          // Automatically select newly added objects
          fabricCanvas.setActiveObject(e.target);
          selectObject(e.target);
          fabricCanvas.requestRenderAll();
        }
        // Switch to select mode after adding an object
        setCurrentTool(selectTool);
      });

      // Handle object modification
      fabricCanvas.on("object:modified", (e) => {
        console.log("Object modified:", {
          type: e.target?.type,
          hasCanvas: !!e.target?.canvas,
        });
        if (e.target) {
          selectObject(e.target);
          fabricCanvas.requestRenderAll();
        }
      });

      // Handle mouse:down event
      fabricCanvas.on("mouse:down", (e) => {
        currentTool.handleMouseDown(fabricCanvas, e);
      });

      // Handle mouse:move event
      fabricCanvas.on("mouse:move", (e) => {
        currentTool.handleMouseMove(fabricCanvas, e);
      });

      // Handle mouse:up event
      fabricCanvas.on("mouse:up", () => {
        if (currentTool.handleMouseUp) {
          currentTool.handleMouseUp();
        }
      });

      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, [setCanvas, selectObject, currentTool]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
