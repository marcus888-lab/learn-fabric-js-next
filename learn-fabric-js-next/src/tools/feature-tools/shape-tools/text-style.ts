import TextStyleIcon from "../../../components/ui/icons/TextStyleIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject, IText } from "fabric";

const textStyle: FeatureTool = {
  name: "Text Style",
  description: "Change text style",
  price: 0,
  icon: TextStyleIcon,
  objectType: "text",
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create style controls container
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

    // Create style toggles
    const toggles = [
      {
        id: "bold",
        label: "Bold",
        property: "fontWeight",
        value: "bold",
        defaultValue: "normal",
      },
      {
        id: "italic",
        label: "Italic",
        property: "fontStyle",
        value: "italic",
        defaultValue: "normal",
      },
    ];

    // Create weight selector
    const weightContainer = document.createElement("div");
    weightContainer.style.display = "flex";
    weightContainer.style.alignItems = "center";
    weightContainer.style.gap = "10px";

    const weightLabel = document.createElement("label");
    weightLabel.textContent = "Weight:";
    weightLabel.style.minWidth = "60px";

    const weightSelect = document.createElement("select");
    weightSelect.style.flex = "1";
    weightSelect.style.padding = "5px";

    const weights = [100, 200, 300, 400, 500, 600, 700, 800, 900];
    weights.forEach((weight) => {
      const option = document.createElement("option");
      option.value = weight.toString();
      option.textContent = weight.toString();
      weightSelect.appendChild(option);
    });

    weightContainer.appendChild(weightLabel);
    weightContainer.appendChild(weightSelect);
    container.appendChild(weightContainer);

    // Create toggle buttons
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toggles.forEach(({ id, label, property, value, defaultValue }) => {
      const toggleContainer = document.createElement("div");
      toggleContainer.style.display = "flex";
      toggleContainer.style.alignItems = "center";
      toggleContainer.style.gap = "10px";

      const toggleButton = document.createElement("button");
      toggleButton.textContent = label;
      toggleButton.style.flex = "1";
      toggleButton.style.padding = "5px";
      toggleButton.style.border = "1px solid #ccc";
      toggleButton.style.borderRadius = "3px";
      toggleButton.style.cursor = "pointer";

      // Set initial state
      const activeObject = canvas.getActiveObject() as IText;
      if (activeObject && activeObject[property as keyof IText] === value) {
        toggleButton.style.backgroundColor = "#e0e0e0";
      } else {
        toggleButton.style.backgroundColor = "#fff";
      }

      toggleButton.addEventListener("click", () => {
        const activeObject = canvas.getActiveObject() as IText;
        if (activeObject) {
          const currentValue = activeObject[property as keyof IText];
          const newValue = currentValue === value ? defaultValue : value;
          activeObject.set(property, newValue);
          toggleButton.style.backgroundColor =
            newValue === value ? "#e0e0e0" : "#fff";
          canvas.renderAll();
        }
      });

      toggleContainer.appendChild(toggleButton);
      container.appendChild(toggleContainer);
    });

    // Set initial weight value
    const activeObject = canvas.getActiveObject() as IText;
    if (activeObject) {
      weightSelect.value = (activeObject.fontWeight || "400").toString();
    }

    // Handle weight change
    weightSelect.addEventListener("change", () => {
      const activeObject = canvas.getActiveObject() as IText;
      if (activeObject) {
        activeObject.set("fontWeight", weightSelect.value);
        canvas.renderAll();
      }
    });

    document.body.appendChild(container);

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

export default textStyle;
