"use client";

import React from "react";
import { useCanvasContext } from "../context/CanvasContext";
import { Button } from "./ui/button";
import {
  BrushIcon,
  CircleIcon,
  CursorIcon,
  EraserIcon,
  LineIcon,
  PolygonIcon,
  RectangleIcon,
  TextIcon,
  TriangleIcon,
} from "./ui/icons";
import { cn } from "../lib/utils";

export function EditTools({ className }: { className?: string }) {
  const { currentTool, setCurrentTool } = useCanvasContext();

  const tools = [
    { id: "select", icon: <CursorIcon /> },
    { id: "rectangle", icon: <RectangleIcon /> },
    { id: "circle", icon: <CircleIcon /> },
    { id: "triangle", icon: <TriangleIcon /> },
    { id: "text", icon: <TextIcon /> },
    { id: "brush", icon: <BrushIcon /> },
    { id: "eraser", icon: <EraserIcon /> },
    { id: "line", icon: <LineIcon /> },
    { id: "polygon", icon: <PolygonIcon /> },
  ] as const;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 bg-white rounded-lg shadow",
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
