import { FeatureTool } from "@/types/feature-tools";
import { SearchAndReplaceIcon } from "@/components/ui/icons";
import * as fabric from "fabric";

const searchAndReplace: FeatureTool = {
  name: "searchAndReplace",
  description:
    "Use simple words to automatically find an object in image and replace it with the desired prompt",
  price: 4,
  icon: SearchAndReplaceIcon,
  action: (object: fabric.Object) => {
    console.log("Search and replace action executed on", object);
  },
};

export default searchAndReplace;
