import StrokeWidthIcon from "../../../components/ui/icons/StrokeWidthIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const strokeWidth: FeatureTool = {
  name: "Stroke Width",
  description: "Adjust stroke width",
  price: 0,
  icon: StrokeWidthIcon,
  isCommon: true,
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create stroke width range input
    const strokeInput = document.createElement("input");
    strokeInput.type = "range";
    strokeInput.min = "1";
    strokeInput.max = "20";
    strokeInput.style.position = "fixed";
    strokeInput.style.top = "20px";
    strokeInput.style.left = "50%";
    strokeInput.style.transform = "translateX(-50%)";
    strokeInput.style.zIndex = "1000";
    document.body.appendChild(strokeInput);

    // Set initial value based on selected object
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      strokeInput.value = (activeObject.strokeWidth || 1).toString();
    }

    // Handle stroke width change
    strokeInput.addEventListener("input", (e) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        const width = parseInt((e.target as HTMLInputElement).value);
        activeObject.set("strokeWidth", width);
        canvas.renderAll();
      }
    });

    // Handle stroke width selection complete
    strokeInput.addEventListener("change", () => {
      document.body.removeChild(strokeInput);
    });

    // Remove input when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target !== strokeInput) {
        document.body.removeChild(strokeInput);
        document.removeEventListener("click", handleClickOutside);
      }
    };

    // Add delay to prevent immediate trigger
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);
  },
};

export default strokeWidth;
