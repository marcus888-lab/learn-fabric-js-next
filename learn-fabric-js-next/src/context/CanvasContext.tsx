"use client";

import React, { createContext, useContext, useState } from "react";
import { Canvas, Object as FabricObject } from "fabric";

export type DrawingTool =
  | "select"
  | "rectangle"
  | "circle"
  | "triangle"
  | "text"
  | "brush"
  | "eraser"
  | "line"
  | "polygon";

interface CanvasContextType {
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas | null) => void;
  currentTool: DrawingTool;
  setCurrentTool: (tool: DrawingTool) => void;
  addObject: (object: FabricObject) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [currentTool, setCurrentTool] = useState<DrawingTool>("select");

  const addObject = (object: FabricObject) => {
    if (canvas) {
      canvas.add(object);
      canvas.renderAll();
    }
  };

  return (
    <CanvasContext.Provider
      value={{
        canvas,
        setCanvas,
        currentTool,
        setCurrentTool,
        addObject,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvasContext() {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  return context;
}
