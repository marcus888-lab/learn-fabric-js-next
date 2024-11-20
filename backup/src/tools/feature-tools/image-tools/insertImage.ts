import InsertImageIcon from "@/components/ui/icons/InsertImageIcon";
import { FeatureTool } from "@/types/feature-tools";
import * as fabric from "fabric";

const insertImage: FeatureTool = {
  name: "Insert Image",
  description: "Upload and insert an image to canvas",
  price: 0,
  icon: InsertImageIcon,
  action: (object: fabric.Object) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    console.log("Insert image action triggered");

    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    // Handle file selection
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      console.log("File selected:", file.name);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const imgUrl = event.target?.result as string;
        console.log("Image loaded");

        try {
          // Create image element
          const imgElement = await new Promise<HTMLImageElement>(
            (resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = (err) => reject(err);
              img.src = imgUrl;
            }
          );

          console.log("Image element created");

          // Create fabric.js Image instance
          const img = new fabric.Image(imgElement);

          // Scale image to fit within canvas while maintaining aspect ratio
          const canvasWidth = canvas.width || 800;
          const canvasHeight = canvas.height || 600;
          const scale = Math.min(
            (canvasWidth * 0.8) / (img.width ?? 100),
            (canvasHeight * 0.8) / (img.height ?? 100)
          );

          img.scale(scale);

          // Center the image on canvas
          img.set({
            left: (canvasWidth - (img.width ?? 100) * scale) / 2,
            top: (canvasHeight - (img.height ?? 100) * scale) / 2,
          });

          console.log("Adding image to canvas");

          // Deselect any currently selected objects
          canvas.discardActiveObject();

          // Add the image to canvas
          canvas.add(img);

          // Select the new image
          canvas.setActiveObject(img);

          // Trigger a selection event
          canvas.fire("selection:created", { selected: [img] });

          // Render the canvas
          canvas.requestRenderAll();

          console.log("Image added and selected");
        } catch (error) {
          console.error("Error loading image:", error);
        }
      };
      reader.readAsDataURL(file);
    };

    // Trigger file input click
    input.click();
  },
};

export default insertImage;
