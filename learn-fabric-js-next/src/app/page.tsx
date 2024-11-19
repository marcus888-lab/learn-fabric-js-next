"use client";

import dynamic from "next/dynamic";
import { EditTools } from "@/components/edit-tools";
import { FeatureToolbar } from "@/components/feature-tools";
import { ObjectProvider, useObject } from "@/context/ObjectContext";
import { CanvasProvider } from "@/context/CanvasContext";

// Dynamically import Canvas with no SSR to avoid fabric.js issues
const Canvas = dynamic(() => import("@/components/Canvas"), {
  ssr: false,
  loading: () => (
    <div className="w-[800px] h-[600px] bg-gray-100 rounded-lg animate-pulse" />
  ),
});

function MainContent() {
  const { selectedObject, selectObject } = useObject();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="flex gap-4">
          {/* Tools panel on the left */}
          <EditTools className="bg-white p-2 rounded-lg shadow-lg" />

          {/* Main canvas area */}
          <div className="relative w-[800px] h-[600px]">
            <div className="absolute inset-0 bg-white rounded-lg shadow-lg overflow-hidden">
              <Canvas />
            </div>

            {/* Feature toolbar positioned above canvas when object selected */}
            {selectedObject && (
              <div className="absolute -top-14 left-1/2 -translate-x-1/2">
                <FeatureToolbar
                  object={selectedObject}
                  onClose={() => selectObject(null)}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Debug info */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          Selected: {selectedObject ? selectedObject.type : "none"}
        </div>
      )}
    </div>
  );
}

function WrappedApp() {
  return (
    <CanvasProvider>
      <ObjectProvider>
        <MainContent />
      </ObjectProvider>
    </CanvasProvider>
  );
}

export default function Home() {
  return <WrappedApp />;
}
