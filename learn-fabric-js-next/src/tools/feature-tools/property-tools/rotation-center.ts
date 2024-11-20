import RotationCenterIcon from "../../../components/ui/icons/RotationCenterIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const rotationCenter: FeatureTool = {
  name: "Rotation Center",
  description: "Adjust rotation point",
  price: 0,
  icon: RotationCenterIcon,
  isCommon: true,
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create controls container
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

    // Create X control
    const xContainer = document.createElement("div");
    xContainer.style.display = "flex";
    xContainer.style.alignItems = "center";
    xContainer.style.gap = "10px";

    const xLabel = document.createElement("label");
    xLabel.textContent = "X:";
    xLabel.style.minWidth = "20px";

    const xInput = document.createElement("input");
    xInput.type = "range";
    xInput.min = "0";
    xInput.max = "100";
    xInput.step = "1";
    xInput.style.width = "150px";

    const xValue = document.createElement("span");
    xValue.style.minWidth = "40px";
    xValue.style.textAlign = "right";

    xContainer.appendChild(xLabel);
    xContainer.appendChild(xInput);
    xContainer.appendChild(xValue);

    // Create Y control
    const yContainer = document.createElement("div");
    yContainer.style.display = "flex";
    yContainer.style.alignItems = "center";
    yContainer.style.gap = "10px";

    const yLabel = document.createElement("label");
    yLabel.textContent = "Y:";
    yLabel.style.minWidth = "20px";

    const yInput = document.createElement("input");
    yInput.type = "range";
    yInput.min = "0";
    yInput.max = "100";
    yInput.step = "1";
    yInput.style.width = "150px";

    const yValue = document.createElement("span");
    yValue.style.minWidth = "40px";
    yValue.style.textAlign = "right";

    yContainer.appendChild(yLabel);
    yContainer.appendChild(yInput);
    yContainer.appendChild(yValue);

    container.appendChild(xContainer);
    container.appendChild(yContainer);

    // Reset button
    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset to Center";
    resetButton.style.padding = "5px";
    resetButton.style.marginTop = "5px";
    container.appendChild(resetButton);

    document.body.appendChild(container);

    // Set initial values
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      const originX =
        activeObject.originX === "left"
          ? 0
          : activeObject.originX === "right"
          ? 100
          : 50;
      const originY =
        activeObject.originY === "top"
          ? 0
          : activeObject.originY === "bottom"
          ? 100
          : 50;

      xInput.value = originX.toString();
      yInput.value = originY.toString();
      xValue.textContent = `${originX}%`;
      yValue.textContent = `${originY}%`;
    }

    // Update function
    const updateRotationPoint = () => {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        const x = parseInt(xInput.value);
        const y = parseInt(yInput.value);

        // Convert percentage to origin position
        const getOrigin = (value: number) => {
          if (value <= 25) return "left";
          if (value >= 75) return "right";
          return "center";
        };

        const getVerticalOrigin = (value: number) => {
          if (value <= 25) return "top";
          if (value >= 75) return "bottom";
          return "center";
        };

        activeObject.set({
          originX: getOrigin(x),
          originY: getVerticalOrigin(y),
        });

        xValue.textContent = `${x}%`;
        yValue.textContent = `${y}%`;

        canvas.renderAll();
      }
    };

    // Add event listeners
    xInput.addEventListener("input", updateRotationPoint);
    yInput.addEventListener("input", updateRotationPoint);

    resetButton.addEventListener("click", () => {
      xInput.value = "50";
      yInput.value = "50";
      updateRotationPoint();
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

export default rotationCenter;
