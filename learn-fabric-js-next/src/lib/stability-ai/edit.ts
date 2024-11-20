"use server";
import { StabilityAIConfig } from "./config";
import { StabilityAIResponse, EditImageParams, ImageInput } from "./types";

// Helper function to convert various image input types to Blob
async function convertToBlob(input: ImageInput): Promise<Blob> {
  // If already a Blob, return directly
  if (input instanceof Blob) {
    return input;
  }

  // If string (URL), fetch the image
  if (typeof input === "string") {
    const response = await fetch(input);
    return await response.blob();
  }

  // If ArrayBuffer, convert to Blob
  if (input instanceof ArrayBuffer) {
    return new Blob([input]);
  }

  // If Buffer, convert to Blob (using Node.js Buffer check)
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(input)) {
    return new Blob([input]);
  }

  // If File, return as Blob
  if (input instanceof File) {
    return input;
  }

  throw new Error("Unsupported image input type");
}

// Mapping of edit modes to their respective endpoints
const editEndpoints: Record<string, string> = {
  erase: "erase",
  inpaint: "inpaint",
  outpaint: "outpaint",
  "remove-background": "remove-background",
  "search-and-recolor": "search-and-recolor",
  "search-and-replace": "search-and-replace",
  "replace-background": "replace-background",
};

// Main edit image function
export async function editImage(
  params: EditImageParams,
  apiKey?: string
): Promise<StabilityAIResponse<string>> {
  try {
    // Use provided API key or fallback to config
    const effectiveApiKey = apiKey || StabilityAIConfig.API_KEY;

    if (!effectiveApiKey) {
      throw new Error("Stability AI API Key is required");
    }

    const formData = new FormData();

    // Append image
    const imageBlob = await convertToBlob(params.image);
    formData.append("image", imageBlob, "image.png");

    // Append other parameters
    formData.append("mode", params.mode);
    if (params.prompt) {
      formData.append("prompt", params.prompt);
    }

    // Append mask if provided for specific edit modes
    if (params.mask) {
      const maskBlob = await convertToBlob(params.mask);
      formData.append("mask", maskBlob, "mask.png");
    }

    // Validate edit mode
    const endpoint = editEndpoints[params.mode];
    if (!endpoint) {
      throw new Error(`Unsupported edit mode: ${params.mode}`);
    }

    // Make API request
    const response = await fetch(
      `${StabilityAIConfig.BASE_URL}/stable-image/edit/${endpoint}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${StabilityAIConfig.API_KEY}`,
          Accept: "image/*",
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${errorText}`);
    }

    // Convert the image response to a blob and create an object URL
    const imageResultBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageResultBlob);

    return {
      success: true,
      data: imageUrl,
    };
  } catch (error) {
    console.error("Stability AI Image Edit Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Create a client with pre-configured API key
export async function createStabilityAIEditor(apiKey?: string) {
  return {
    editImage: async (params: EditImageParams) => editImage(params, apiKey),
  };
}
