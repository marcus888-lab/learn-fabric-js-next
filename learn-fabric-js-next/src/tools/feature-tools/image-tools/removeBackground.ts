import { FeatureTool } from "@/types/feature-tools";
import { RemoveBackgroundIcon } from "@/components/ui/icons";
import * as fabric from "fabric";
import { isImageSelected } from "@/tools/feature-tools/basic-tools";

const removeBackground: FeatureTool = {
  name: "removeBackground",
  description: "Remove the background from the selected image",
  price: 3,
  icon: RemoveBackgroundIcon,
  imageOnly: true,
  action: async (object: fabric.Object) => {
    if (isImageSelected(object)) {
      try {
        // Convert fabric image to file
        const fabricImage = object as fabric.Image;
        const canvas = fabricImage.canvas;

        if (!canvas) {
          throw new Error("No canvas found");
        }

        // Convert canvas image to file
        const dataURL = fabricImage.toDataURL({
          format: "png",
          quality: 1,
        });

        // Convert data URL to blob
        const response = await fetch(dataURL);
        const imageBlob = await response.blob();

        // Create form data
        const formData = new FormData();
        formData.append("image", imageBlob, "image.png");

        // Call the API route
        const result = await fetch("/api/remove-background", {
          method: "POST",
          body: formData,
        });

        if (!result.ok) {
          const error = await result.json();
          throw new Error(error.error || "Failed to remove background");
        }

        const data = await result.json();

        if (!data.success || !data.data) {
          throw new Error("Failed to remove background");
        }

        // Load the processed image from S3
        const newImage = await fabric.Image.fromURL(data.data, {
          crossOrigin: "anonymous",
        });

        // Set properties on new image
        newImage.set({
          scaleX: fabricImage.scaleX,
          scaleY: fabricImage.scaleY,
          left: fabricImage.left,
          top: fabricImage.top,
          srcFromAttribute: true,
          minimumScaleTrigger: 0,
          cropX: 0,
          cropY: 0,
          imageSmoothing: true,
          filters: [],
        });

        // Remove old image and add new one
        canvas.remove(fabricImage);
        canvas.add(newImage);
        canvas.renderAll();
      } catch (error) {
        console.error("Background removal error:", error);
        // Optionally show an error message to the user
      }
    }
  },
};

export default removeBackground;
