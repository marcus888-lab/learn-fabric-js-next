"use client";

import React, { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { ColorIcon, OpacityIcon, StrokeWidthIcon } from "./ui/icons";
import {
  FeatureToolbarProps,
  ObjectProperties,
  PropertyType,
  PROPERTY_DEFINITIONS,
} from "../types/feature-tools";

const IconComponents = {
  ColorIcon,
  OpacityIcon,
  StrokeWidthIcon,
};

export function FeatureToolbar({ object, onClose }: FeatureToolbarProps) {
  const [editingProperty, setEditingProperty] = useState<PropertyType | null>(
    null
  );

  const updateObject = useCallback(
    (properties: ObjectProperties) => {
      if (!object?.canvas) return;
      try {
        object.set(properties);
        object.setCoords();
        object.canvas.requestRenderAll();
      } catch (error) {
        console.error("Error updating object:", error);
      }
    },
    [object]
  );

  const handlePropertyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, propertyId: PropertyType) => {
      const value =
        e.target.type === "range" ? parseFloat(e.target.value) : e.target.value;
      updateObject({ [propertyId]: value } as ObjectProperties);
    },
    [updateObject]
  );

  const handlePropertyClick = (property: PropertyType) => {
    setEditingProperty(property === editingProperty ? null : property);
  };

  if (!object) return null;

  const selectedProperty = editingProperty
    ? PROPERTY_DEFINITIONS.find((prop) => prop.id === editingProperty)
    : null;

  return (
    <div className="flex flex-col gap-2 p-2 bg-white/80 backdrop-blur-sm">
      {/* Property Controls */}
      {selectedProperty && (
        <div className="flex items-center gap-2 px-2">
          {selectedProperty.type === "color" ? (
            <input
              type="color"
              value={selectedProperty.getValue(object).toString()}
              onChange={(e) => handlePropertyChange(e, selectedProperty.id)}
              className="w-32 h-6 rounded cursor-pointer"
            />
          ) : (
            <>
              <input
                type="range"
                min={selectedProperty.min}
                max={selectedProperty.max}
                step={selectedProperty.step}
                value={selectedProperty.getValue(object)}
                onChange={(e) => handlePropertyChange(e, selectedProperty.id)}
                className="w-32"
              />
              <span className="text-xs w-12">
                {selectedProperty.getDisplayValue(
                  selectedProperty.getValue(object)
                )}
              </span>
            </>
          )}
        </div>
      )}

      {/* Property Icons */}
      <div className="flex gap-1">
        {PROPERTY_DEFINITIONS.map((prop) => {
          const IconComponent =
            IconComponents[prop.icon as keyof typeof IconComponents];
          return (
            <Button
              key={prop.id}
              variant="ghost"
              size="sm"
              onClick={() => handlePropertyClick(prop.id)}
              className={`p-1 h-8 w-8 ${
                editingProperty === prop.id ? "bg-gray-200" : ""
              }`}
            >
              <IconComponent />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
