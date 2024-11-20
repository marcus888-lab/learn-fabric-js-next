import * as fabric from "fabric";

/**
 * Checks if the selected object is an image
 * @param object - The Fabric.js object to check
 * @returns boolean indicating if the object is an image
 */
export const isImageSelected = (object: fabric.Object): boolean => {
  return object.type === "image";
};

/**
 * Adjusts the color of an image object
 * @param object - The Fabric.js image object to adjust
 * @param factor - The color adjustment factor (0-1)
 */
export const adjustColor = (object: fabric.Image, factor: number): void => {
  const colorMatrix = new fabric.filters.ColorMatrix({
    matrix: [
      1 + factor,
      0,
      0,
      0,
      0,
      0,
      1 + factor,
      0,
      0,
      0,
      0,
      0,
      1 + factor,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ],
    colorsOnly: true,
  });

  object.filters.push(colorMatrix);
  object.applyFilters();
};

/**
 * Adjusts the transparency of an image object
 * @param object - The Fabric.js image object to adjust
 * @param factor - The transparency adjustment factor (0-1)
 */
export const adjustTransparency = (
  object: fabric.Image,
  factor: number
): void => {
  object.set("opacity", factor);
  object.canvas?.renderAll();
};

/**
 * Adjusts the intensity of an image object
 * @param object - The Fabric.js image object to adjust
 * @param factor - The intensity adjustment factor (0-1)
 */
export const adjustIntensity = (object: fabric.Image, factor: number): void => {
  const colorMatrix = new fabric.filters.ColorMatrix({
    matrix: [
      factor,
      0,
      0,
      0,
      0,
      0,
      factor,
      0,
      0,
      0,
      0,
      0,
      factor,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
    ],
    colorsOnly: true,
  });

  object.filters.push(colorMatrix);
  object.applyFilters();
};
