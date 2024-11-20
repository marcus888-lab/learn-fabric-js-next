# Fabric.js Canvas Tutorial with Next.js and TypeScript

## Overview

This project is a comprehensive tutorial demonstrating the usage of Fabric.js with Next.js and TypeScript. It provides an interactive canvas drawing experience with various shape creation and manipulation features.

## Features

- Create and manipulate canvas objects using Fabric.js
- React context for managing canvas state
- TypeScript type safety
- Tailwind CSS for styling
- Modular component structure

## Prerequisites

- Node.js (v16 or later)
- npm or yarn

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/your-username/learn-fabric-js-next.git
cd learn-fabric-js-next
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `src/context/FabricContext.tsx`: Manages Fabric.js canvas state
- `src/components/FabricCanvasBase.tsx`: Base canvas component
- `src/components/ShapeControls.tsx`: Interactive shape creation buttons
- `src/app/page.tsx`: Main page component
- `src/app/layout.tsx`: Application layout
- `src/app/globals.css`: Global styles

## Key Concepts

- Context API for state management
- Dynamic canvas object creation
- TypeScript integration with Fabric.js

## Technologies

- Next.js 15
- Fabric.js 6.5.1
- TypeScript
- Tailwind CSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
