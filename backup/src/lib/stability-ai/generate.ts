"use server";
import { StabilityAIConfig, GenerateImageSchema } from "./config";
import { GenerateImageParams } from "./config";
import { ImageGenerationResult, StabilityAIResponse } from "./types";

// Main image generation function
export async function generateImage(
  params: GenerateImageParams,
  apiKey?: string
): Promise<StabilityAIResponse<ImageGenerationResult[]>> {
  try {
    // Use provided API key or fallback to config
    const effectiveApiKey = apiKey || StabilityAIConfig.API_KEY;

    if (!effectiveApiKey) {
      throw new Error("Stability AI API Key is required");
    }

    // Validate input parameters
    const validatedParams = GenerateImageSchema.parse(params);

    const response = await fetch(
      `${StabilityAIConfig.BASE_URL}/stable-image/generate/${validatedParams.model}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${effectiveApiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          prompt: validatedParams.prompt,
          negative_prompt: validatedParams.negativePrompt,
          aspect_ratio: validatedParams.aspectRatio,
          samples: validatedParams.samples,
          style: validatedParams.style,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.images.map(
        (img: { url: string; seed: number; finish_reason: string }) => ({
          imageUrl: img.url,
          seed: img.seed,
          finishReason: img.finish_reason,
        })
      ),
    };
  } catch (error) {
    console.error("Stability AI Image Generation Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Create a client with pre-configured API key
export async function createStabilityAIGenerator(apiKey?: string) {
  return {
    generateImage: async (params: GenerateImageParams) =>
      generateImage(params, apiKey),
  };
}
