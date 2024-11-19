import Canvas from "../components/Canvas";
import { EditTools } from "../components/edit-tools";
import { CanvasProvider } from "../context/CanvasContext";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CanvasProvider>
        <div className="flex gap-4">
          <EditTools />
          <div className="border rounded-lg overflow-hidden">
            <Canvas />
          </div>
        </div>
      </CanvasProvider>
    </main>
  );
}
