import { FeatureTool } from "@/types/feature-tools";
import { OutpaintIcon } from "@/components/ui/icons";
import * as fabric from "fabric";
import { isImageSelected } from "@/tools/feature-tools/basic-tools";

const outpaint: FeatureTool = {
  name: "outpaint",
  description: "Expand the image beyond its original boundaries",
  price: 3,
  icon: OutpaintIcon,
  imageOnly: true,
  action: (object: fabric.Object) => {
    if (isImageSelected(object)) {
      // Implement outpaint action here
      console.log("Outpaint action executed on image:", object);
    }
  },
};

export default outpaint;
