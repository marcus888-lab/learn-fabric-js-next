import OpacityIcon from "../../../components/ui/icons/OpacityIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const opacity: FeatureTool = {
  name: "Opacity",
  description: "Adjust object opacity",
  price: 0,
  icon: OpacityIcon,
  isCommon: true, // Mark as common tool
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create opacity range input
    const opacityInput = document.createElement("input");
    opacityInput.type = "range";
    opacityInput.min = "0";
    opacityInput.max = "100";
    opacityInput.style.position = "fixed";
    opacityInput.style.top = "20px";
    opacityInput.style.left = "50%";
    opacityInput.style.transform = "translateX(-50%)";
    opacityInput.style.zIndex = "1000";
    document.body.appendChild(opacityInput);

    // Set initial value based on selected object
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      opacityInput.value = (activeObject.opacity || 1) * 100 + "";
    }

    // Handle opacity change
    opacityInput.addEventListener("input", (e) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        const opacity = parseInt((e.target as HTMLInputElement).value) / 100;
        activeObject.set("opacity", opacity);
        canvas.renderAll();
      }
    });

    // Handle opacity selection complete
    opacityInput.addEventListener("change", () => {
      document.body.removeChild(opacityInput);
    });

    // Remove input when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target !== opacityInput) {
        document.body.removeChild(opacityInput);
        document.removeEventListener("click", handleClickOutside);
      }
    };

    // Add delay to prevent immediate trigger
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);
  },
};

export default opacity;
