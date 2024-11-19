# Project Structure

```
learn-fabric-js-next/
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   └── page.tsx          # Main page component
│   ├── components/
│   │   ├── Canvas.jsx        # Canvas wrapper
│   │   ├── FabricCanvas.tsx  # Fabric.js canvas implementation
│   │   ├── edit-tools.tsx    # Drawing tools selection
│   │   └── ui/
│   │       ├── button.tsx    # Reusable button component
│   │       └── icons/        # SVG icons for tools
│   │           ├── Rectangle.tsx
│   │           ├── Circle.tsx
│   │           ├── Triangle.tsx
│   │           ├── Text.tsx
│   │           ├── Brush.tsx
│   │           ├── Eraser.tsx
│   │           └── index.ts
│   ├── context/
│   │   └── CanvasContext.tsx # Canvas state management
│   └── lib/
│       ├── drawing-tools/    # Tool implementations
│       │   ├── draw-rectangle.ts
│       │   ├── draw-circle.ts
│       │   ├── draw-triangle.ts
│       │   ├── draw-text.ts
│       │   ├── draw-brush.ts
│       │   ├── draw-eraser.ts
│       │   └── index.ts
│       └── utils.js          # Utility functions
├── public/                   # Static assets
├── .env                      # Environment variables
├── next.config.ts           # Next.js configuration
├── package.json             # Project dependencies
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Directory Structure Explanation

### `/src`

Main source code directory containing all application code.

### `/src/app`

Next.js 13+ app directory structure with layouts and pages.

### `/src/components`

React components organized by feature:

- `Canvas.jsx`: Main canvas component
- `FabricCanvas.tsx`: Fabric.js integration
- `edit-tools.tsx`: Drawing tools UI
- `ui/`: Reusable UI components and icons

### `/src/context`

React context providers for state management:

- `CanvasContext.tsx`: Manages canvas state and tool selection

### `/src/lib`

Utility functions and tool implementations:

- `drawing-tools/`: Individual drawing tool logic
- `utils.js`: Shared utility functions

### Configuration Files

- `next.config.ts`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS settings
- `tsconfig.json`: TypeScript compiler options
