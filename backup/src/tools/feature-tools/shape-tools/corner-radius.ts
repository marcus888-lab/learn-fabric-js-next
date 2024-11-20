import CornerRadiusIcon from "../../../components/ui/icons/CornerRadiusIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const cornerRadius: FeatureTool = {
  name: "Corner Radius",
  description: "Adjust rectangle corner radius",
  price: 0,
  icon: CornerRadiusIcon,
  objectType: "rect",
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create radius input
    const radiusInput = document.createElement("input");
    radiusInput.type = "range";
    radiusInput.min = "0";
    radiusInput.max = "50";
    radiusInput.style.position = "fixed";
    radiusInput.style.top = "20px";
    radiusInput.style.left = "50%";
    radiusInput.style.transform = "translateX(-50%)";
    radiusInput.style.zIndex = "1000";
    document.body.appendChild(radiusInput);

    // Set initial value based on selected object
    const activeObject = canvas.getActiveObject();
    if (activeObject && "rx" in activeObject) {
      radiusInput.value = (activeObject.rx || 0).toString();
    }

    // Handle radius change
    radiusInput.addEventListener("input", (e) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject && "rx" in activeObject && "ry" in activeObject) {
        const radius = parseInt((e.target as HTMLInputElement).value);
        activeObject.set({
          rx: radius,
          ry: radius,
        });
        canvas.renderAll();
      }
    });

    // Handle radius selection complete
    radiusInput.addEventListener("change", () => {
      document.body.removeChild(radiusInput);
    });

    // Remove input when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target !== radiusInput) {
        document.body.removeChild(radiusInput);
        document.removeEventListener("click", handleClickOutside);
      }
    };

    // Add delay to prevent immediate trigger
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);
  },
};

export default cornerRadius;
