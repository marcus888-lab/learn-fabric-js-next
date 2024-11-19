import type { Metadata } from "next";
import "./globals.css";
import { CanvasProvider } from "@/context/CanvasContext";
import { ObjectProvider } from "@/context/ObjectContext";

export const metadata: Metadata = {
  title: "Fabric.js Next.js App",
  description: "A drawing app built with Fabric.js and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CanvasProvider>
          <ObjectProvider>{children}</ObjectProvider>
        </CanvasProvider>
      </body>
    </html>
  );
}
