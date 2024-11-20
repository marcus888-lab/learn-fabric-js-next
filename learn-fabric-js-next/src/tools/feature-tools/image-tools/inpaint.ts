import { FeatureTool } from "@/types/feature-tools";
import { InpaintIcon } from "@/components/ui/icons";
import * as fabric from "fabric";
import { isImageSelected } from "@/tools/feature-tools/basic-tools";

const inpaint: FeatureTool = {
  name: "inpaint",
  description: "Use a mask (or alpha channel) to replace anything in an image",
  price: 3,
  icon: InpaintIcon,
  imageOnly: true,
  action: (object: fabric.Object) => {
    if (isImageSelected(object)) {
      // Implement inpaint action here
      console.log("Inpaint action executed on image:", object);
    }
  },
};

export default inpaint;
