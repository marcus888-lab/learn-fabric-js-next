"use client";

import Canvas from "@/components/Canvas";
import { EditTools } from "@/components/edit-tools";
import FeatureToolbar from "@/components/feature-tools";
import { CanvasProvider } from "@/context/CanvasContext";
import { ObjectProvider, useObject } from "@/context/ObjectContext";

function FeatureToolbarWrapper() {
  const { selectedObject } = useObject();

  console.log("FeatureToolbarWrapper:", {
    hasSelectedObject: !!selectedObject,
    objectType: selectedObject?.type,
  });

  if (!selectedObject) return null;

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 mt-4">
      <FeatureToolbar
        object={selectedObject}
        onClose={() => {}} // No-op since we want the toolbar to stay visible
      />
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="w-full h-full relative">
        <CanvasProvider>
          <ObjectProvider>
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10">
              <EditTools />
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-[1280px] h-[720px] mt-16">
                <FeatureToolbarWrapper />
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <Canvas />
                </div>
              </div>
            </div>
          </ObjectProvider>
        </CanvasProvider>
      </div>
    </main>
  );
}
