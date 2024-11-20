import ShadowIcon from "../../../components/ui/icons/ShadowIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject, Shadow } from "fabric";

const shadow: FeatureTool = {
  name: "Shadow",
  description: "Add and adjust shadow",
  price: 0,
  icon: ShadowIcon,
  isCommon: true,
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create shadow controls container
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

    // Color input for shadow
    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = "#000000";
    container.appendChild(colorInput);

    // Blur input
    const blurInput = document.createElement("input");
    blurInput.type = "range";
    blurInput.min = "0";
    blurInput.max = "50";
    blurInput.value = "10";
    container.appendChild(blurInput);

    // Offset X input
    const offsetXInput = document.createElement("input");
    offsetXInput.type = "range";
    offsetXInput.min = "-50";
    offsetXInput.max = "50";
    offsetXInput.value = "5";
    container.appendChild(offsetXInput);

    // Offset Y input
    const offsetYInput = document.createElement("input");
    offsetYInput.type = "range";
    offsetYInput.min = "-50";
    offsetYInput.max = "50";
    offsetYInput.value = "5";
    container.appendChild(offsetYInput);

    document.body.appendChild(container);

    // Set initial values based on selected object
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.shadow) {
      const currentShadow = activeObject.shadow as Shadow;
      colorInput.value = currentShadow.color || "#000000";
      blurInput.value = currentShadow.blur?.toString() || "10";
      offsetXInput.value = currentShadow.offsetX?.toString() || "5";
      offsetYInput.value = currentShadow.offsetY?.toString() || "5";
    }

    // Update function
    const updateShadow = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        const shadowOptions = {
          color: colorInput.value,
          blur: parseInt(blurInput.value),
          offsetX: parseInt(offsetXInput.value),
          offsetY: parseInt(offsetYInput.value),
        };
        activeObject.set("shadow", shadowOptions);
        canvas.renderAll();
      }
    };

    // Add event listeners
    colorInput.addEventListener("input", updateShadow);
    blurInput.addEventListener("input", updateShadow);
    offsetXInput.addEventListener("input", updateShadow);
    offsetYInput.addEventListener("input", updateShadow);

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

export default shadow;
