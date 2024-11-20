import CircleRadiusIcon from "../../../components/ui/icons/CircleRadiusIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const circleRadius: FeatureTool = {
  name: "Circle Radius",
  description: "Adjust circle radius",
  price: 0,
  icon: CircleRadiusIcon,
  objectType: "circle",
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create radius input
    const radiusInput = document.createElement("input");
    radiusInput.type = "range";
    radiusInput.min = "10";
    radiusInput.max = "200";
    radiusInput.style.position = "fixed";
    radiusInput.style.top = "20px";
    radiusInput.style.left = "50%";
    radiusInput.style.transform = "translateX(-50%)";
    radiusInput.style.zIndex = "1000";
    document.body.appendChild(radiusInput);

    // Set initial value based on selected object
    const activeObject = canvas.getActiveObject();
    if (activeObject && "radius" in activeObject) {
      const currentRadius =
        typeof activeObject.radius === "number" ? activeObject.radius : 50;
      radiusInput.value = currentRadius.toString();
    }

    // Handle radius change
    radiusInput.addEventListener("input", (e) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject && "radius" in activeObject) {
        const newRadius = parseInt((e.target as HTMLInputElement).value);
        const currentRadius =
          typeof activeObject.radius === "number" ? activeObject.radius : 50;
        const scale = newRadius / currentRadius;

        activeObject.set({
          radius: newRadius,
          scaleX: scale,
          scaleY: scale,
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

export default circleRadius;
