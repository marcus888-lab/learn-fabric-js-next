"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Object as FabricObject } from "fabric";

interface ObjectContextType {
  selectedObject: FabricObject | null;
  selectObject: (object: FabricObject | null) => void;
}

const ObjectContext = createContext<ObjectContextType | undefined>(undefined);

export function ObjectProvider({ children }: { children: React.ReactNode }) {
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(
    null
  );
  const selectedObjectRef = useRef<FabricObject | null>(null);

  const selectObject = useCallback((object: FabricObject | null) => {
    console.log("ObjectContext: selectObject called with:", {
      type: object?.type,
      hasCanvas: !!object?.canvas,
      isNull: object === null,
      isSameAsCurrent: object === selectedObjectRef.current,
    });

    if (object === selectedObjectRef.current) {
      console.log("ObjectContext: Same object, skipping update");
      return;
    }

    if (object) {
      if (!object.canvas) {
        console.error("ObjectContext: Object has no canvas reference");
        return;
      }

      selectedObjectRef.current = object;
      setSelectedObject(object);
      console.log("ObjectContext: Object selected successfully", {
        type: object.type,
        hasCanvas: !!object.canvas,
      });
    } else {
      selectedObjectRef.current = null;
      setSelectedObject(null);
      console.log("ObjectContext: Selection cleared");
    }
  }, []);

  // Debug: Monitor state changes
  useEffect(() => {
    console.log("ObjectContext: selectedObject state changed:", {
      type: selectedObject?.type,
      hasCanvas: !!selectedObject?.canvas,
      isNull: selectedObject === null,
    });
  }, [selectedObject]);

  // Create a stable context value
  const contextValue = React.useMemo(
    () => ({
      selectedObject,
      selectObject,
    }),
    [selectedObject, selectObject]
  );

  return (
    <ObjectContext.Provider value={contextValue}>
      {children}
    </ObjectContext.Provider>
  );
}

export function useObject() {
  const context = useContext(ObjectContext);
  if (context === undefined) {
    throw new Error("useObject must be used within an ObjectProvider");
  }
  return context;
}
