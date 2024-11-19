# Fabric.js Tutorial with Next.js and TypeScript

## Introduction

This comprehensive tutorial will guide you through learning Fabric.js using Next.js and TypeScript. We'll cover various features of Fabric.js, from basic canvas creation to advanced object manipulation, providing practical examples and insights.

## Prerequisites

- Basic understanding of React and TypeScript
- Node.js (v16 or later) installed
- Familiarity with Next.js
- Basic knowledge of HTML5 Canvas concepts

## Setup

1. Create a new Next.js project with TypeScript and Tailwind CSS

```bash
npx create-next-app@latest learn-fabric-js-next --typescript --tailwind
cd learn-fabric-js-next
npm install fabric @types/fabric
```

## Tutorial Sections

1. [Basic Canvas Setup](#basic-canvas-setup)
2. [Drawing Shapes](#drawing-shapes)
3. [Object Manipulation](#object-manipulation)
4. [Event Handling](#event-handling)
5. [Advanced Interactions](#advanced-interactions)

### Basic Canvas Setup

#### Creating a Fabric.js Canvas Component

Create a new component to initialize a Fabric.js canvas:

```typescript
// src/components/FabricCanvas.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

const FabricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Initialize Fabric.js canvas
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 400,
        backgroundColor: "rgb(245,245,245)",
      });

      // Cleanup function
      return () => {
        fabricCanvasRef.current?.dispose();
      };
    }
  }, []);

  return <canvas ref={canvasRef} />;
};

export default FabricCanvas;
```

#### Integrating the Canvas in a Page

```typescript
// src/app/page.tsx
import FabricCanvas from "../components/FabricCanvas";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl mb-4">Fabric.js Canvas</h1>
      <FabricCanvas />
    </main>
  );
}
```

### Drawing Shapes

#### Adding Basic Shapes

Extend the `FabricCanvas` component to add shapes:

```typescript
useEffect(() => {
  if (fabricCanvasRef.current) {
    // Add a rectangle
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "red",
      width: 100,
      height: 100,
    });

    // Add a circle
    const circle = new fabric.Circle({
      left: 250,
      top: 100,
      radius: 50,
      fill: "green",
    });

    // Add shapes to canvas
    fabricCanvasRef.current.add(rect, circle);
  }
}, []);
```

### Object Manipulation

#### Interactive Object Transformations

```typescript
useEffect(() => {
  if (fabricCanvasRef.current) {
    const triangle = new fabric.Triangle({
      width: 100,
      height: 100,
      fill: "blue",
      left: 50,
      top: 50,
    });

    // Enable object selection and transformation
    triangle.set({
      cornerColor: "blue",
      cornerStyle: "circle",
      borderColor: "red",
      cornerSize: 12,
    });

    fabricCanvasRef.current.add(triangle);
  }
}, []);
```

### Event Handling

#### Adding Interactive Events

```typescript
useEffect(() => {
  if (fabricCanvasRef.current) {
    fabricCanvasRef.current.on("mouse:down", (options) => {
      console.log("Mouse down", options.target);
    });

    fabricCanvasRef.current.on("object:moving", (options) => {
      console.log("Object moving", options.target);
    });
  }
}, []);
```

### Advanced Interactions

#### Custom Object Creation

```typescript
const addCustomObject = () => {
  if (fabricCanvasRef.current) {
    const customPath = new fabric.Path("M 0 0 L 100 0 L 50 50 z", {
      fill: "purple",
      left: 200,
      top: 200,
    });

    fabricCanvasRef.current.add(customPath);
  }
};
```

## Best Practices

1. Always use `'use client'` for client-side components with Fabric.js
2. Dispose of the canvas when the component unmounts
3. Use TypeScript for type safety with Fabric.js
4. Leverage Fabric.js methods for complex interactions

## Troubleshooting

- Ensure you're using the client-side rendering for Fabric.js components
- Check browser console for any initialization errors
- Verify Fabric.js and type definitions are correctly installed

## Next Steps

- Explore Fabric.js documentation
- Experiment with more complex canvas interactions
- Build interactive drawing or design applications

## Conclusion

This tutorial covered the basics of using Fabric.js with Next.js and TypeScript. From canvas setup to advanced interactions, you now have a solid foundation to build interactive canvas applications.
