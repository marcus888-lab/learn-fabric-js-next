import FontFamilyIcon from "../../../components/ui/icons/FontFamilyIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject, IText } from "fabric";

const fontFamily: FeatureTool = {
  name: "Font Family",
  description: "Change text font family",
  price: 0,
  icon: FontFamilyIcon,
  objectType: "text",
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    const fonts = [
      "Arial",
      "Helvetica",
      "Times New Roman",
      "Georgia",
      "Courier New",
      "Verdana",
      "Impact",
      "Comic Sans MS",
      "Trebuchet MS",
      "Arial Black",
      "Palatino",
      "Garamond",
    ];

    // Create font family selector container
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
    container.style.maxHeight = "300px";
    container.style.overflowY = "auto";

    // Create select element
    const select = document.createElement("select");
    select.style.padding = "5px";
    select.style.fontSize = "14px";
    select.style.minWidth = "200px";

    // Add font options
    fonts.forEach((font) => {
      const option = document.createElement("option");
      option.value = font;
      option.textContent = font;
      option.style.fontFamily = font;
      select.appendChild(option);
    });

    container.appendChild(select);
    document.body.appendChild(container);

    // Set initial value based on selected object
    const activeObject = canvas.getActiveObject() as IText;
    if (activeObject && activeObject.fontFamily) {
      select.value = activeObject.fontFamily;
    }

    // Handle font family change
    select.addEventListener("change", (e) => {
      const activeObject = canvas.getActiveObject() as IText;
      if (activeObject && activeObject.fontFamily !== undefined) {
        const font = (e.target as HTMLSelectElement).value;
        activeObject.set("fontFamily", font);
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

    // Style the selected font option
    select.addEventListener("focus", () => {
      Array.from(select.options).forEach((option) => {
        option.style.fontFamily = option.value;
      });
    });
  },
};

export default fontFamily;
