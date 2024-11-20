import LineWidthIcon from "../../../components/ui/icons/LineWidthIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const lineWidth: FeatureTool = {
  name: "Line Width",
  description: "Adjust line thickness",
  price: 0,
  icon: LineWidthIcon,
  objectType: "line",
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create width input container
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.zIndex = "1000";
    container.style.backgroundColor = "white";
    container.style.padding = "10px";
    container.style.borderRadius = "5px";
    container.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    container.style.display = "flex";
    container.style.gap = "10px";
    container.style.alignItems = "center";

    // Width input
    const widthInput = document.createElement("input");
    widthInput.type = "range";
    widthInput.min = "1";
    widthInput.max = "20";
    widthInput.step = "1";
    container.appendChild(widthInput);

    // Width value display
    const widthDisplay = document.createElement("span");
    widthDisplay.style.minWidth = "3em";
    widthDisplay.style.textAlign = "right";
    container.appendChild(widthDisplay);

    document.body.appendChild(container);

    // Set initial value based on selected object
    const activeObject = canvas.getActiveObject();
    if (activeObject && "strokeWidth" in activeObject) {
      const currentWidth =
        typeof activeObject.strokeWidth === "number"
          ? activeObject.strokeWidth
          : 1;
      widthInput.value = currentWidth.toString();
      widthDisplay.textContent = `${currentWidth}px`;
    }

    // Handle width change
    widthInput.addEventListener("input", (e) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject && "strokeWidth" in activeObject) {
        const width = parseInt((e.target as HTMLInputElement).value);
        activeObject.set("strokeWidth", width);
        widthDisplay.textContent = `${width}px`;
        canvas.renderAll();
      }
    });

    // Remove container when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (!container.contains(e.target as Node)) {
        document.body.removeChild(container);
        document.removeEventListener("click", handleClickOutside);
      }
    };

    // Add delay to prevent immediate trigger
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);
  },
};

export default lineWidth;
