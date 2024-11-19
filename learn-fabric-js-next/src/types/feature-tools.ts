import { Object as FabricObject } from "fabric";

export interface ObjectProperties {
  fill?: string;
  opacity?: number;
  strokeWidth?: number;
}

export interface FeatureToolbarProps {
  object: FabricObject;
  onClose: () => void;
}

export type PropertyType = "color" | "opacity" | "strokeWidth";

export interface PropertyDefinition {
  id: PropertyType;
  label: string;
  icon: string;
  min?: number;
  max?: number;
  step?: number;
  type: "color" | "range";
  getValue: (obj: FabricObject) => string | number;
  getDisplayValue: (value: string | number) => string;
}

export const PROPERTY_DEFINITIONS: PropertyDefinition[] = [
  {
    id: "color",
    label: "Color",
    icon: "ColorIcon",
    type: "color",
    getValue: (obj) => obj.fill?.toString() || "#000000",
    getDisplayValue: (value) => value.toString(),
  },
  {
    id: "opacity",
    label: "Opacity",
    icon: "OpacityIcon",
    type: "range",
    min: 0,
    max: 1,
    step: 0.1,
    getValue: (obj) => obj.opacity || 1,
    getDisplayValue: (value) => `${Math.round(Number(value) * 100)}%`,
  },
  {
    id: "strokeWidth",
    label: "Stroke Width",
    icon: "StrokeWidthIcon",
    type: "range",
    min: 0,
    max: 20,
    step: 1,
    getValue: (obj) => obj.strokeWidth || 1,
    getDisplayValue: (value) => `${value}px`,
  },
];
