import TextDecorationIcon from "../../../components/ui/icons/TextDecorationIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject, IText } from "fabric";

const textDecoration: FeatureTool = {
  name: "Text Decoration",
  description: "Add text decorations",
  price: 0,
  icon: TextDecorationIcon,
  objectType: "text",
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create decoration selector container
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

    // Create decoration buttons
    const decorations = [
      { value: "underline", label: "T̲ Underline", prop: "underline" },
      { value: "linethrough", label: "T̶ Strikethrough", prop: "linethrough" },
      { value: "overline", label: "T̅ Overline", prop: "overline" },
      { value: "none", label: "T None", prop: null },
    ];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    decorations.forEach(({ value, label, prop }) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.style.padding = "5px 10px";
      button.style.border = "1px solid #ccc";
      button.style.borderRadius = "3px";
      button.style.backgroundColor = "#fff";
      button.style.cursor = "pointer";

      // Highlight active decoration
      const activeObject = canvas.getActiveObject() as IText;
      if (activeObject) {
        const isActive = prop
          ? activeObject[prop as keyof IText]
          : !activeObject.underline &&
            !activeObject.linethrough &&
            !activeObject.overline;
        if (isActive) {
          button.style.backgroundColor = "#e0e0e0";
        }
      }

      button.addEventListener("click", () => {
        const activeObject = canvas.getActiveObject() as IText;
        if (activeObject) {
          // Reset all decorations first
          activeObject.set({
            underline: false,
            linethrough: false,
            overline: false,
          });

          // Set the selected decoration
          if (prop) {
            activeObject.set(prop, true);
          }

          canvas.renderAll();
          document.body.removeChild(container);
        }
      });

      button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#f0f0f0";
      });

      button.addEventListener("mouseout", () => {
        const activeObject = canvas.getActiveObject() as IText;
        if (activeObject) {
          const isActive = prop
            ? activeObject[prop as keyof IText]
            : !activeObject.underline &&
              !activeObject.linethrough &&
              !activeObject.overline;
          button.style.backgroundColor = isActive ? "#e0e0e0" : "#fff";
        }
      });

      container.appendChild(button);
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

export default textDecoration;
