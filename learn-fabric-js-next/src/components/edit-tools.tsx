"use client";

import React from "react";
import { useCanvasContext, DrawingTool } from "@/context/CanvasContext";
import { Button } from "./ui/button";
import RectangleIcon from "./ui/icons/Rectangle";
import CircleIcon from "./ui/icons/Circle";
import TriangleIcon from "./ui/icons/Triangle";
import TextIcon from "./ui/icons/Text";
import BrushIcon from "./ui/icons/Brush";
import EraserIcon from "./ui/icons/Eraser";
import { cn } from "@/lib/utils";

export function EditTools({ className }: { className?: string }) {
  const { currentTool, setCurrentTool } = useCanvasContext();

  const tools: { id: DrawingTool; icon: React.ReactNode }[] = [
    { id: "rectangle", icon: <RectangleIcon /> },
    { id: "circle", icon: <CircleIcon /> },
    { id: "triangle", icon: <TriangleIcon /> },
    { id: "text", icon: <TextIcon /> },
    { id: "brush", icon: <BrushIcon /> },
    { id: "eraser", icon: <EraserIcon /> },
  ];

  return (
    <div
      className={cn(
        " flex flex-col gap-2 p-4 bg-white rounded-lg shadow",
        className
      )}
    >
      {tools.map((tool) => (
        <Button
          key={tool.id}
          onClick={() => setCurrentTool(tool.id)}
          variant={currentTool === tool.id ? "default" : "outline"}
          size="icon"
          className="w-10 h-10"
        >
          {tool.icon}
        </Button>
      ))}
    </div>
  );
}
