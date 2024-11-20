import inpaint from "./image-tools/inpaint";
import outpaint from "./image-tools/outpaint";
import eraseObject from "./image-tools/eraseObject";
import searchAndRecolor from "./search-tools/searchAndRecolor";
import searchAndReplace from "./search-tools/searchAndReplace";
import deleteImage from "./image-tools/deleteImage";
import removeBackground from "./image-tools/removeBackground";
// import insertImage from "./image-tools/insertImage";
import {
  color,
  opacity,
  strokeWidth,
  shadow,
  rotationCenter,
  gradientFill,
  borderColor,
  blendMode,
  deleteObject,
} from "./property-tools";
import {
  cornerRadius,
  circleRadius,
  fontSize,
  fontFamily,
  lineWidth,
  lineColor,
  polygonSides,
  textAlign,
  textDecoration,
  textStyle,
} from "./shape-tools";

// Common tools that apply to all objects
const commonTools = [
  color,
  borderColor,
  opacity,
  strokeWidth,
  shadow,
  rotationCenter,
  gradientFill,
  blendMode,
  deleteObject, // Add delete object as a common tool
];

// Image-specific tools
const imageTools = [
  // insertImage,
  inpaint,
  outpaint,
  eraseObject,
  removeBackground,
  searchAndRecolor,
  searchAndReplace,
  deleteImage,
];

// Shape-specific tools
const shapeTools = [
  // Rectangle tools
  cornerRadius,
  // Circle tools
  circleRadius,
  // Line tools
  lineWidth,
  lineColor,
  // Polygon tools
  polygonSides,
  // Text tools
  fontSize,
  fontFamily,
  textAlign,
  textDecoration,
  textStyle,
];

// Combine all tools, marking their specificity
export const featureTools = [
  // Image-specific tools first
  ...imageTools.map((tool) => ({
    ...tool,
    imageOnly: true,
    objectType: "image",
  })),
  // Shape-specific tools next (they already have objectType set)
  ...shapeTools,
  // Then common tools
  ...commonTools.map((tool) => ({
    ...tool,
    isCommon: true,
  })),
];
