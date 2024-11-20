import { FeatureTool } from "@/types/feature-tools";
import { EraseObjectIcon } from "@/components/ui/icons";
import * as fabric from "fabric";
import { isImageSelected } from "@/tools/feature-tools/basic-tools";

const eraseObject: FeatureTool = {
  name: "eraseObject",
  description: "Erase specific objects from the image",
  price: 3,
  icon: EraseObjectIcon,
  imageOnly: true,
  action: (object: fabric.Object) => {
    if (isImageSelected(object)) {
      // Implement erase object action here
      console.log("Erase object action executed on image:", object);
    }
  },
};

export default eraseObject;
