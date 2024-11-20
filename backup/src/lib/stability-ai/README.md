# Stability AI Library

This library provides a comprehensive TypeScript wrapper for the Stability AI API, offering easy-to-use functions for image generation, editing, and manipulation.

## Installation

1. Install dependencies:

```bash
npm install zod
```

2. Set up your Stability AI API key:

```
STABILITY_AI_API_KEY=your_api_key_here
```

## Usage

### Image Generation

```typescript
import { generateImage } from "./stability-ai";

async function generateImages() {
  const result = await generateImage({
    prompt: "A beautiful landscape with mountains and a lake",
    model: "stable-image-ultra",
    samples: 2,
  });

  if (result.success) {
    console.log("Generated images:", result.data);
  } else {
    console.error("Image generation failed:", result.error);
  }
}
```

### Image Editing

```typescript
import { editImage } from "./stability-ai";

async function editMyImage() {
  // Remove background from an image
  const result = await editImage({
    image: "path/to/image.jpg", // Can be URL, File, Blob, ArrayBuffer, or Buffer
    mode: "remove-background",
  });

  if (result.success) {
    console.log("Edited image URL:", result.data);
  } else {
    console.error("Image editing failed:", result.error);
  }
}
```

### Using a Pre-configured Client

```typescript
import { createStabilityAIClient } from "./stability-ai";

// Create a client with a specific API key
const client = createStabilityAIClient("your_api_key");

// Generate images
const generateResult = await client.generate.generateImage({
  prompt: "A futuristic cityscape",
  model: "stable-image-core",
});

// Edit an image
const editResult = await client.edit.editImage({
  image: "path/to/image.jpg",
  mode: "inpaint",
  prompt: "Remove the person from the background",
});
```

## Supported Features

- Image Generation

  - Multiple models (Ultra, SD3 Large, Core, etc.)
  - Customizable prompts and parameters

- Image Editing
  - Object Removal
  - Inpainting
  - Outpainting
  - Background Removal
  - Search and Recolor
  - Search and Replace

## Configuration

The library uses environment variables for configuration:

- `STABILITY_AI_API_KEY`: Your Stability AI API key

## Error Handling

The library returns a `StabilityAIResponse` object with:

- `success`: Boolean indicating operation success
- `data`: Successful result (if applicable)
- `error`: Error message (if operation failed)

## Supported Input Types

The library supports various image input types:

- URL strings
- File objects
- Blob objects
- ArrayBuffer
- Node.js Buffer
- Objects with a buffer property

## License

[Your License Here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
