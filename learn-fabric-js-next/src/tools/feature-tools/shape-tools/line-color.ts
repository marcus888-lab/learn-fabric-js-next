import LineColorIcon from "../../../components/ui/icons/LineColorIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const lineColor: FeatureTool = {
  name: "Line Color",
  description: "Change line color",
  price: 0,
  icon: LineColorIcon,
  objectType: "line",
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create color input element
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.style.position = "absolute";
    colorInput.style.left = "-9999px";
    document.body.appendChild(colorInput);

    // Set initial color based on selected object
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const currentColor = activeObject.stroke || "#000000";
      colorInput.value = currentColor.toString();
    }

    // Handle color change
    const handleInput = (e: Event) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set("stroke", (e.target as HTMLInputElement).value);
        canvas.renderAll();
      }
    };

    // Handle color selection complete
    const handleChange = () => {
      try {
        // Remove event listeners
        colorInput.removeEventListener("input", handleInput);
        colorInput.removeEventListener("change", handleChange);

        // Check if element is still in the document
        if (document.body.contains(colorInput)) {
          document.body.removeChild(colorInput);
        }
      } catch (error) {
        console.error("Error cleaning up color picker:", error);
      }
    };

    // Add event listeners
    colorInput.addEventListener("input", handleInput);
    colorInput.addEventListener("change", handleChange);

    // Open color picker
    try {
      colorInput.click();
    } catch (error) {
      console.error("Error opening color picker:", error);
      handleChange(); // Clean up if click fails
    }
  },
};

export default lineColor;
