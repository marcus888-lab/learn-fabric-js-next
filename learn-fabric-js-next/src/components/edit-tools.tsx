"use client";

import React from "react";
import { useCanvasContext } from "../context/CanvasContext";
import { Button } from "./ui/button";
import { Rectangle, Circle, Triangle, Text, Brush, Eraser } from "./ui/icons";

export const EditTools = () => {
  const { currentTool, setCurrentTool } = useCanvasContext();

  const tools = [
    { name: "rectangle", icon: <Rectangle />, label: "Rectangle" },
    { name: "circle", icon: <Circle />, label: "Circle" },
    { name: "triangle", icon: <Triangle />, label: "Triangle" },
    { name: "text", icon: <Text />, label: "Text" },
    { name: "brush", icon: <Brush />, label: "Brush" },
    { name: "eraser", icon: <Eraser />, label: "Eraser" },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-3 gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.name}
            onClick={() => setCurrentTool(tool.name)}
            variant={currentTool === tool.name ? "default" : "outline"}
            className="flex flex-col items-center gap-1 p-2"
          >
            <span className="w-6 h-6">{tool.icon}</span>
            <span className="text-xs">{tool.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
