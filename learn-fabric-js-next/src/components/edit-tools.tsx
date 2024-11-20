"use client";

import React from "react";
import { useCanvasContext } from "../context/CanvasContext";
import { Button } from "./ui/button";
import * as fabric from "fabric";
import { cn } from "../lib/utils";

// Import icons
import CursorIcon from "./ui/icons/Cursor";
import RectangleIcon from "./ui/icons/Rectangle";
import CircleIcon from "./ui/icons/Circle";
import TriangleIcon from "./ui/icons/Triangle";
import TextIcon from "./ui/icons/Text";
import BrushIcon from "./ui/icons/Brush";
import EraserIcon from "./ui/icons/Eraser";
import LineIcon from "./ui/icons/Line";
import PolygonIcon from "./ui/icons/Polygon";

// Import tools
import insertImage from "@/tools/feature-tools/image-tools/insertImage";
import {
  rectangle,
  circle,
  triangle,
  text,
  brush,
  eraser,
  line,
  polygon,
} from "@/tools/feature-tools/basic-tools";

type DrawingToolType =
  | "select"
  | "rectangle"
  | "circle"
  | "triangle"
  | "text"
  | "brush"
  | "eraser"
  | "line"
  | "polygon";

type Tool = {
  id: string;
  icon: React.ReactNode;
  type: "select" | "drawing" | "action";
  action?: () => void;
};

export function EditTools({ className }: { className?: string }) {
  const { currentTool, setCurrentTool, canvas } = useCanvasContext();

  // Create a dummy fabric object with canvas reference for tools
  const createDummyObject = () => {
    if (!canvas) return null;
    const obj = new fabric.Object();
    obj.canvas = canvas;
    return obj;
  };

  // Helper function to setup select mode
  const setupSelectMode = () => {
    if (canvas) {
      // Remove any existing event listeners
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");

      // Set selection cursors
      canvas.defaultCursor = "default";
      canvas.hoverCursor = "move";

      // Enable object selection
      canvas.selection = true;
      canvas.forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
      });

      setCurrentTool("select");
    }
  };

  // Helper function to setup drawing tool
  const setupDrawingTool = (
    toolId: DrawingToolType,
    toolAction: (obj: fabric.Object) => void
  ) => {
    const dummyObject = createDummyObject();
    if (dummyObject && canvas) {
      setCurrentTool(toolId);

      // Remove any existing event listeners
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");

      // Add new mouse:up handler for reset
      const resetHandler = () => {
        // Remove all drawing event listeners
        canvas.off("mouse:down");
        canvas.off("mouse:move");
        canvas.off("mouse:up");

        // Wait for the current operation to complete
        setTimeout(() => {
          setupSelectMode(); // This will set up proper selection behavior
        }, 100);
      };

      // Set up the drawing tool
      toolAction(dummyObject);

      // Add the reset handler after the tool is set up
      canvas.on("mouse:up", resetHandler);
    }
  };

  const tools: Tool[] = [
    {
      id: "select",
      icon: <CursorIcon />,
      type: "select",
      action: setupSelectMode,
    },
    {
      id: "rectangle",
      icon: <RectangleIcon />,
      type: "drawing",
      action: () => setupDrawingTool("rectangle", rectangle.action),
    },
    {
      id: "circle",
      icon: <CircleIcon />,
      type: "drawing",
      action: () => setupDrawingTool("circle", circle.action),
    },
    {
      id: "triangle",
      icon: <TriangleIcon />,
      type: "drawing",
      action: () => setupDrawingTool("triangle", triangle.action),
    },
    {
      id: "text",
      icon: <TextIcon />,
      type: "drawing",
      action: () => setupDrawingTool("text", text.action),
    },
    {
      id: "brush",
      icon: <BrushIcon />,
      type: "drawing",
      action: () => setupDrawingTool("brush", brush.action),
    },
    {
      id: "eraser",
      icon: <EraserIcon />,
      type: "drawing",
      action: () => setupDrawingTool("eraser", eraser.action),
    },
    {
      id: "line",
      icon: <LineIcon />,
      type: "drawing",
      action: () => setupDrawingTool("line", line.action),
    },
    {
      id: "polygon",
      icon: <PolygonIcon />,
      type: "drawing",
      action: () => setupDrawingTool("polygon", polygon.action),
    },
    {
      id: "image",
      icon: insertImage.icon({}),
      type: "action",
      action: () => {
        const dummyObject = createDummyObject();
        if (dummyObject) {
          insertImage.action(dummyObject);
        }
      },
    },
  ];

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
          onClick={() => {
            if (tool.action) {
              tool.action();
            }
          }}
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
