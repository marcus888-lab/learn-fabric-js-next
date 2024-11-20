import DeleteIcon from "../../../components/ui/icons/DeleteIcon";
import { FeatureTool } from "../../../types/feature-tools";
import { Object as FabricObject } from "fabric";

const deleteObject: FeatureTool = {
  name: "Delete Object",
  description: "Delete selected object",
  price: 0,
  icon: DeleteIcon,
  isCommon: true, // This is a common tool for all objects
  action: (object: FabricObject) => {
    const canvas = object?.canvas;
    if (!canvas) {
      console.error("No canvas available");
      return;
    }

    // Remove the object from canvas
    canvas.remove(object);
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  },
};

export default deleteObject;
