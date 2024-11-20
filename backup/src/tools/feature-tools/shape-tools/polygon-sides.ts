import PolygonSidesIcon from "../../../components/ui/icons/PolygonSidesIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject, Polygon } from "fabric";

const polygonSides: FeatureTool = {
  name: "Polygon Sides",
  description: "Adjust number of polygon sides",
  price: 0,
  icon: PolygonSidesIcon,
  objectType: "polygon",
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Create sides input container
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

    // Sides input
    const sidesInput = document.createElement("input");
    sidesInput.type = "range";
    sidesInput.min = "3";
    sidesInput.max = "12";
    sidesInput.step = "1";
    container.appendChild(sidesInput);

    // Sides value display
    const sidesDisplay = document.createElement("span");
    sidesDisplay.style.minWidth = "3em";
    sidesDisplay.style.textAlign = "right";
    container.appendChild(sidesDisplay);

    document.body.appendChild(container);

    // Helper function to update polygon points
    const updatePolygonPoints = (sides: number, radius: number) => {
      const points: { x: number; y: number }[] = [];
      for (let i = 0; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        points.push({
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
        });
      }
      return points;
    };

    // Set initial value based on selected object
    const activeObject = canvas.getActiveObject() as Polygon;
    if (activeObject && activeObject.points) {
      const currentSides = activeObject.points.length;
      sidesInput.value = currentSides.toString();
      sidesDisplay.textContent = `${currentSides} sides`;
    }

    // Handle sides change
    sidesInput.addEventListener("input", (e) => {
      const activeObject = canvas.getActiveObject() as Polygon;
      if (activeObject && activeObject.points) {
        const sides = parseInt((e.target as HTMLInputElement).value);
        // Calculate radius based on current points
        const points = activeObject.points;
        const centerX = 0;
        const centerY = 0;
        const radius = Math.sqrt(
          Math.pow(points[0].x - centerX, 2) +
            Math.pow(points[0].y - centerY, 2)
        );

        // Update polygon points
        const newPoints = updatePolygonPoints(sides, radius);
        activeObject.set("points", newPoints);
        sidesDisplay.textContent = `${sides} sides`;
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

export default polygonSides;
