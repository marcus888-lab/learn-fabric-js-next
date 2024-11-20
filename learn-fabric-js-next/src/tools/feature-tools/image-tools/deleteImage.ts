import { FeatureTool } from "@/types/feature-tools";
import { DeleteIcon } from "@/components/ui/icons";
import * as fabric from "fabric";
import { isImageSelected } from "@/tools/feature-tools/basic-tools";

const deleteImage: FeatureTool = {
  name: "deleteImage",
  description: "Delete the selected image",
  price: 0,
  icon: DeleteIcon,
  imageOnly: true,
  action: (object: fabric.Object) => {
    if (isImageSelected(object)) {
      // Implement delete image action here
      const canvas = object.canvas;
      if (canvas) {
        canvas.remove(object);
        canvas.renderAll();
      }
      console.log("Delete image action executed on image:", object);
    }
  },
};

export default deleteImage;
