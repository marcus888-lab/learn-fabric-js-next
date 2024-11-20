// Export configuration
export * from "./config";

// Import types
import type { GenerateImageParams } from "./config";

// Import and re-export functions
import { generateImage, createStabilityAIGenerator } from "./generate";
import { editImage, createStabilityAIEditor } from "./edit";
import {
  EditImageParams,
  ImageGenerationResult,
  StabilityAIResponse,
} from "./types";

// Export types explicitly
export type {
  GenerateImageParams,
  EditImageParams,
  StabilityAIResponse,
  ImageGenerationResult,
};

// Export individual functions as server actions
export { generateImage, createStabilityAIGenerator };
export { editImage, createStabilityAIEditor };

// Functional client creator
export function createStabilityAIClient(apiKey?: string) {
  return {
    generate: {
      generateImage: (params: GenerateImageParams) =>
        generateImage(params, apiKey),
    },
    edit: {
      editImage: (params: EditImageParams) => editImage(params, apiKey),
    },
  };
}
