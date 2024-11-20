import FontSizeIcon from "../../../components/ui/icons/FontSizeIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const fontSize: FeatureTool = {
  name: "Font Size",
  description: "Adjust text font size",
  price: 0,
  icon: FontSizeIcon,
  objectType: "text",
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create font size input
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

    // Size input
    const sizeInput = document.createElement("input");
    sizeInput.type = "range";
    sizeInput.min = "8";
    sizeInput.max = "72";
    sizeInput.step = "1";
    container.appendChild(sizeInput);

    // Size value display
    const sizeDisplay = document.createElement("span");
    sizeDisplay.style.minWidth = "3em";
    sizeDisplay.style.textAlign = "right";
    container.appendChild(sizeDisplay);

    document.body.appendChild(container);

    // Set initial value based on selected object
    const activeObject = canvas.getActiveObject();
    if (activeObject && "fontSize" in activeObject) {
      const currentSize =
        typeof activeObject.fontSize === "number" ? activeObject.fontSize : 16;
      sizeInput.value = currentSize.toString();
      sizeDisplay.textContent = `${currentSize}px`;
    }

    // Handle font size change
    sizeInput.addEventListener("input", (e) => {
      const activeObject = canvas.getActiveObject();
      if (activeObject && "fontSize" in activeObject) {
        const size = parseInt((e.target as HTMLInputElement).value);
        activeObject.set("fontSize", size);
        sizeDisplay.textContent = `${size}px`;
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

export default fontSize;
