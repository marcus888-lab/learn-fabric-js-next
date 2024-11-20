import BlendModeIcon from "../../../components/ui/icons/BlendModeIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const blendMode: FeatureTool = {
  name: "Blend Mode",
  description: "Change blend mode",
  price: 0,
  icon: BlendModeIcon,
  isCommon: true,
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create blend mode selector container
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
    container.style.flexDirection = "column";
    container.style.gap = "5px";
    container.style.maxHeight = "300px";
    container.style.overflowY = "auto";
    container.style.border = "1px solid #ccc";
    container.style.width = "150px";

    // Define blend modes
    const blendModes = [
      { value: "normal", label: "Normal" },
      { value: "multiply", label: "Multiply" },
      { value: "screen", label: "Screen" },
      { value: "overlay", label: "Overlay" },
      { value: "darken", label: "Darken" },
      { value: "lighten", label: "Lighten" },
      { value: "color-dodge", label: "Color Dodge" },
      { value: "color-burn", label: "Color Burn" },
      { value: "hard-light", label: "Hard Light" },
      { value: "soft-light", label: "Soft Light" },
      { value: "difference", label: "Difference" },
      { value: "exclusion", label: "Exclusion" },
      { value: "hue", label: "Hue" },
      { value: "saturation", label: "Saturation" },
      { value: "color", label: "Color" },
      { value: "luminosity", label: "Luminosity" },
    ];

    // Create buttons for each blend mode
    blendModes.forEach(({ value, label }, index) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.style.padding = "5px 10px";
      button.style.border = "1px solid #ccc";
      button.style.borderRadius = "3px";
      button.style.backgroundColor = "#fff";
      button.style.cursor = "pointer";
      button.style.textAlign = "left";
      button.style.width = "100%";
      button.style.outline = "none";

      // Highlight active blend mode
      const activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.globalCompositeOperation === value) {
        button.style.backgroundColor = "#e0e0e0";
      }

      button.addEventListener("click", () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          activeObject.set("globalCompositeOperation", value);
          canvas.renderAll();
          if (document.body.contains(container)) {
            document.body.removeChild(container);
          }
        }
      });

      button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#f0f0f0";
      });

      button.addEventListener("mouseout", () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.globalCompositeOperation === value) {
          button.style.backgroundColor = "#e0e0e0";
        } else {
          button.style.backgroundColor = "#fff";
        }
      });

      // Add keyboard navigation
      button.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          button.click();
        }
      });

      // Focus management
      if (index === 0) {
        button.focus();
      }

      container.appendChild(button);
    });

    document.body.appendChild(container);

    // Remove container when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      if (!container.contains(e.target as Node)) {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
        document.removeEventListener("click", handleClickOutside);
      }
    };

    // Add delay to prevent immediate trigger
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);
  },
};

export default blendMode;
