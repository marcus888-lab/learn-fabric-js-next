import React, { useEffect } from "react";
import { Button } from "./ui/button";
import * as fabric from "fabric";
import { featureTools } from "../tools/feature-tools";
import { isImageSelected } from "../tools/feature-tools/basic-tools";

interface FeatureToolbarProps {
  object: fabric.Object;
  onClose: () => void;
}

const FeatureToolbar: React.FC<FeatureToolbarProps> = ({ object, onClose }) => {
  useEffect(() => {
    console.log("FeatureToolbar mounted with object:", {
      type: object?.type,
      hasCanvas: !!object?.canvas,
      isImage: isImageSelected(object),
    });
  }, [object]);

  const isImage = isImageSelected(object);

  // Filter and separate tools based on the selected object type
  const objectSpecificTools = featureTools.filter((tool) => {
    // For images, only show image-specific tools
    if (isImage) {
      return tool.imageOnly;
    }
    // For other objects, show object-specific tools
    return tool.objectType && object?.type?.includes(tool.objectType);
  });

  // Only show common tools for non-image objects
  const commonTools = !isImage
    ? featureTools.filter((tool) => {
        return tool.isCommon;
      })
    : [];

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg shadow-lg p-2">
      {/* Object-specific tools */}
      {objectSpecificTools.length > 0 && (
        <>
          {objectSpecificTools.map((tool) => (
            <div
              key={tool.name}
              className="tooltip tooltip-bottom"
              data-tip={tool.description}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  console.log("Tool clicked:", tool.name);
                  if (object && object.canvas) {
                    console.log("Executing tool action");
                    tool.action?.(object);
                  }
                  onClose();
                }}
                className={`${tool.name}`}
              >
                {tool.icon({})}
              </Button>
            </div>
          ))}

          {/* Divider */}
          {commonTools.length > 0 && (
            <div className="h-8 w-px bg-gray-300 mx-2" />
          )}
        </>
      )}

      {/* Common tools (only for non-image objects) */}
      {commonTools.map((tool) => (
        <div
          key={tool.name}
          className="tooltip tooltip-bottom"
          data-tip={tool.description}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              console.log("Tool clicked:", tool.name);
              if (object && object.canvas) {
                console.log("Executing tool action");
                tool.action?.(object);
              }
              onClose();
            }}
            className={`${tool.name}`}
          >
            {tool.icon({})}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default FeatureToolbar;
