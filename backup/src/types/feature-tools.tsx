import * as fabric from "fabric";
import React from "react";

export type FeatureTool = {
  name: string;
  description: string;
  price: number;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  action: (object: fabric.Object) => void;
  imageOnly?: boolean;
  objectType?: string; // Type of object this tool is specific to (e.g., 'rect', 'circle')
  isCommon?: boolean; // Whether this is a common tool shared by all objects
};
