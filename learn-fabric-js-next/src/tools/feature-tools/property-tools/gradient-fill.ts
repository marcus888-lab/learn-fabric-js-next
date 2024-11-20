import GradientFillIcon from "../../../components/ui/icons/GradientFillIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject, Gradient } from "fabric";

const gradientFill: FeatureTool = {
  name: "Gradient Fill",
  description: "Add gradient fill",
  price: 0,
  icon: GradientFillIcon,
  isCommon: true,
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create gradient controls container
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
    container.style.gap = "10px";

    // Create color inputs container
    const colorsContainer = document.createElement("div");
    colorsContainer.style.display = "flex";
    colorsContainer.style.gap = "10px";
    colorsContainer.style.alignItems = "center";

    // Start color input
    const startColorLabel = document.createElement("label");
    startColorLabel.textContent = "Start:";
    const startColorInput = document.createElement("input");
    startColorInput.type = "color";
    startColorInput.value = "#000000";

    // End color input
    const endColorLabel = document.createElement("label");
    endColorLabel.textContent = "End:";
    const endColorInput = document.createElement("input");
    endColorInput.type = "color";
    endColorInput.value = "#ffffff";

    colorsContainer.appendChild(startColorLabel);
    colorsContainer.appendChild(startColorInput);
    colorsContainer.appendChild(endColorLabel);
    colorsContainer.appendChild(endColorInput);

    // Create angle control
    const angleContainer = document.createElement("div");
    angleContainer.style.display = "flex";
    angleContainer.style.alignItems = "center";
    angleContainer.style.gap = "10px";

    const angleLabel = document.createElement("label");
    angleLabel.textContent = "Angle:";

    const angleInput = document.createElement("input");
    angleInput.type = "range";
    angleInput.min = "0";
    angleInput.max = "360";
    angleInput.value = "0";
    angleInput.style.flex = "1";

    const angleValue = document.createElement("span");
    angleValue.textContent = "0°";
    angleValue.style.minWidth = "40px";
    angleValue.style.textAlign = "right";

    angleContainer.appendChild(angleLabel);
    angleContainer.appendChild(angleInput);
    angleContainer.appendChild(angleValue);

    // Create buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "10px";
    buttonsContainer.style.marginTop = "10px";

    // Apply button
    const applyButton = document.createElement("button");
    applyButton.textContent = "Apply Gradient";
    applyButton.style.flex = "1";
    applyButton.style.padding = "5px";

    // Remove gradient button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove Gradient";
    removeButton.style.flex = "1";
    removeButton.style.padding = "5px";

    buttonsContainer.appendChild(applyButton);
    buttonsContainer.appendChild(removeButton);

    // Add all elements to container
    container.appendChild(colorsContainer);
    container.appendChild(angleContainer);
    container.appendChild(buttonsContainer);

    document.body.appendChild(container);

    // Update function
    const updateGradient = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        const angle = parseInt(angleInput.value);
        const angleRad = (angle * Math.PI) / 180;

        // Calculate gradient coordinates based on angle
        const coords = {
          x1: Math.cos(angleRad + Math.PI) * 0.5 + 0.5,
          y1: Math.sin(angleRad + Math.PI) * 0.5 + 0.5,
          x2: Math.cos(angleRad) * 0.5 + 0.5,
          y2: Math.sin(angleRad) * 0.5 + 0.5,
        };

        const gradient = new Gradient({
          type: "linear",
          coords: coords,
          colorStops: [
            { offset: 0, color: startColorInput.value },
            { offset: 1, color: endColorInput.value },
          ],
        });

        activeObject.set("fill", gradient);
        canvas.renderAll();
      }
    };

    // Add event listeners
    angleInput.addEventListener("input", (e) => {
      angleValue.textContent = `${(e.target as HTMLInputElement).value}°`;
      updateGradient();
    });

    startColorInput.addEventListener("input", updateGradient);
    endColorInput.addEventListener("input", updateGradient);

    applyButton.addEventListener("click", () => {
      updateGradient();
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    });

    removeButton.addEventListener("click", () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set("fill", "#ffffff");
        canvas.renderAll();
      }
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    });

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

export default gradientFill;
