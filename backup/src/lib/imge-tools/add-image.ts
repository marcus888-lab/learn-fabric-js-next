import * as fabric from "fabric";

/**
 * Adds an image to the canvas.
 * @param canvas - The Fabric.js canvas instance.
 * @param imageUrl - The URL of the image to add.
 * @param imagePath - The local path of the image to add.
 * @param options - Optional configuration for the image.
 */
export async function addImageToCanvas(
  canvas: fabric.Canvas,
  imageUrl?: string,
  imagePath?: string,
  options?: fabric.ImageProps
): Promise<void> {
  try {
    let imgElement: HTMLImageElement;

    if (imageUrl) {
      imgElement = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = imageUrl;
      });
    } else if (imagePath) {
      imgElement = await new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = imagePath;
      });
    } else {
      throw new Error("Either imageUrl or imagePath must be provided");
    }

    const imgInstance = new fabric.Image(imgElement, options);
    canvas.add(imgInstance);
    canvas.renderAll();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error loading image:", error.message);
    } else {
      console.error("Error loading image:", String(error));
    }
  }
}
