"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import * as fabric from "fabric";

interface CanvasContextType {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  clearCanvas: () => void;
  addObject: (object: fabric.Object) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [currentTool, setCurrentTool] = useState<string>("rectangle");

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = "rgb(245,245,245)";
      canvas.renderAll();
    }
  };

  const addObject = (object: fabric.Object) => {
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
        clearCanvas,
        addObject,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvasContext = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvasContext must be used within a CanvasProvider");
  }
  return context;
};
