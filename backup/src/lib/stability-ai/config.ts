import { z } from "zod";

// Configuration for Stability AI API
export const StabilityAIConfig = {
  BASE_URL: "https://api.stability.ai/v2beta",
  API_KEY: process.env.STABILITY_AI_API_KEY || "",

  // Credit costs for different services
  CREDITS: {
    GENERATE: {
      ULTRA: 8,
      SD3_LARGE: 6.5,
      SD3_LARGE_TURBO: 4,
      SD3_MEDIUM: 3.5,
      CORE: 3,
      SDXL: 0.9,
      SD1_6: 0.9,
    },
    UPSCALE: {
      CREATIVE: 25,
      CONSERVATIVE: 25,
      FAST: 1,
    },
    EDIT: {
      ERASE_OBJECT: 3,
      INPAINT: 3,
      OUTPAINT: 4,
      REMOVE_BACKGROUND: 2,
      SEARCH_AND_RECOLOR: 5,
      SEARCH_AND_REPLACE: 4,
      REPLACE_BACKGROUND_RELIGHT: 8,
    },
    CONTROL: {
      STRUCTURE: 3,
      SKETCH: 3,
      STYLE: 4,
    },
    VIDEO: {
      STABLE_VIDEO: 20,
    },
    THREE_D: {
      STABLE_FAST_3D: 2,
    },
  },
};

// Validation schemas for API requests
export const GenerateImageSchema = z.object({
  prompt: z.string(),
  model: z.enum([
    "stable-image-ultra",
    "stable-diffusion-3-large",
    "stable-diffusion-3-medium",
    "stable-image-core",
    "sdxl-1.0",
    "sd-1.6",
  ]),
  aspectRatio: z.string().optional(),
  negativePrompt: z.string().optional(),
  samples: z.number().min(1).max(10).optional().default(1),
  style: z.string().optional(),
});

export type GenerateImageParams = z.infer<typeof GenerateImageSchema>;
