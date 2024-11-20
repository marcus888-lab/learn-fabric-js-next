// Extend the global Window interface to include Buffer if not already defined
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Buffer?: any;
  }
}

export interface StabilityAIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ImageGenerationResult {
  imageUrl: string;
  seed?: number;
  finishReason?: string;
}

// More flexible type for image inputs
export type ImageInput =
  | string
  | File
  | Blob
  | ArrayBuffer
  | Buffer
  | { buffer: ArrayBuffer };

export interface UpscaleParams {
  image: ImageInput;
  mode: "creative" | "conservative" | "fast";
  prompt?: string;
}

export interface EditImageParams {
  image: ImageInput;
  mode:
    | "erase"
    | "inpaint"
    | "outpaint"
    | "remove-background"
    | "search-and-recolor"
    | "search-and-replace"
    | "replace-background";
  prompt?: string;
  mask?: ImageInput;
}

export interface ControlImageParams {
  image: ImageInput;
  mode: "structure" | "sketch" | "style";
  prompt?: string;
}

export interface VideoGenerationParams {
  image: ImageInput;
  prompt?: string;
}

export interface ThreeDGenerationParams {
  image: ImageInput;
}

// Utility type to check if a value is a valid image input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValidImageInput(input: any): input is ImageInput {
  return (
    typeof input === "string" ||
    input instanceof File ||
    input instanceof Blob ||
    input instanceof ArrayBuffer ||
    (typeof Buffer !== "undefined" && Buffer.isBuffer(input)) ||
    (typeof input === "object" && input !== null && "buffer" in input)
  );
}
