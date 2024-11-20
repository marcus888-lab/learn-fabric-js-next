import { SearchAndRecolorIcon } from "@/components/ui/icons";
import { FeatureTool } from "@/types/feature-tools";
import * as fabric from "fabric";
const searchAndRecolor: FeatureTool = {
  name: "searchAndRecolor",
  description: "Use simple words to change the color of an object",
  price: 5,
  icon: SearchAndRecolorIcon,
  action: (object: fabric.Object) => {
    console.log("Search and recolor action executed on", object);
  },
};

export default searchAndRecolor;
