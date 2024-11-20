import ColorIcon from "../../../components/ui/icons/ColorIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const color: FeatureTool = {
  name: "Color",
  description: "Change object color",
  price: 0,
  icon: ColorIcon,
  isCommon: true, // Mark as common tool
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
      const currentColor = activeObject.fill || "#000000";
      colorInput.value = currentColor.toString();
    }

    // Handle color change
    colorInput.addEventListener("input", (e) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        if (activeObject.type === "path") {
          // For paths (brush strokes), change stroke color
          activeObject.set("stroke", (e.target as HTMLInputElement).value);
        } else {
          // For other objects, change fill color
          activeObject.set("fill", (e.target as HTMLInputElement).value);
        }
        canvas.renderAll();
      }
    });

    // Handle color selection complete
    colorInput.addEventListener("change", () => {
      document.body.removeChild(colorInput);
    });

    // Open color picker
    colorInput.click();
  },
};

export default color;
