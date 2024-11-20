import TextAlignIcon from "../../../components/ui/icons/TextAlignIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject, IText } from "fabric";

const textAlign: FeatureTool = {
  name: "Text Align",
  description: "Change text alignment",
  price: 0,
  icon: TextAlignIcon,
  objectType: "text",
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create alignment selector container
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

    // Create alignment buttons
    const alignments = [
      { value: "left", label: "⫷ Left" },
      { value: "center", label: "⟺ Center" },
      { value: "right", label: "⫸ Right" },
      { value: "justify", label: "⟷ Justify" },
    ];

    alignments.forEach(({ value, label }) => {
      const button = document.createElement("button");
      button.textContent = label;
      button.style.padding = "5px 10px";
      button.style.border = "1px solid #ccc";
      button.style.borderRadius = "3px";
      button.style.backgroundColor = "#fff";
      button.style.cursor = "pointer";

      // Highlight active alignment
      const activeObject = canvas.getActiveObject() as IText;
      if (activeObject && activeObject.textAlign === value) {
        button.style.backgroundColor = "#e0e0e0";
      }

      button.addEventListener("click", () => {
        const activeObject = canvas.getActiveObject() as IText;
        if (activeObject) {
          activeObject.set("textAlign", value);
          canvas.renderAll();
          document.body.removeChild(container);
        }
      });

      button.addEventListener("mouseover", () => {
        button.style.backgroundColor = "#f0f0f0";
      });

      button.addEventListener("mouseout", () => {
        const activeObject = canvas.getActiveObject() as IText;
        if (activeObject && activeObject.textAlign === value) {
          button.style.backgroundColor = "#e0e0e0";
        } else {
          button.style.backgroundColor = "#fff";
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

export default textAlign;
