import BorderColorIcon from "../../../components/ui/icons/BorderColorIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const borderColor: FeatureTool = {
  name: "Border Color",
  description: "Change border color",
  price: 0,
  icon: BorderColorIcon,
  isCommon: true,
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
    colorInput.addEventListener("input", (e) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set("stroke", (e.target as HTMLInputElement).value);
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

export default borderColor;
