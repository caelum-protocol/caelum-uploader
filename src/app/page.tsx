"use client";

import { FileUpload } from "@/components/FileUpload";
import { MemoryArchive } from "@/components/MemoryArchive";
// import ThemeOverlay from "@/components/ThemeOverlay"; // Removed because the module does not exist
// import CanvasBackground from "@/components/CanvasBackground"; // Removed because the module does not exist
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const { theme } = useTheme();

  return (
    <main className="relative z-10 min-h-screen overflow-x-hidden px-4 pt-24">
      {/* Optional theme-specific background layers */}
      {/* {theme === "iris" && <CanvasBackground />} */}
      {/* {theme === "dark" && <ThemeOverlay />} */}

      {/* Foreground UI */}
      <div className="relative z-20 max-w-4xl mx-auto space-y-12">
        <FileUpload />
        <MemoryArchive />
      </div>
    </main>
  );
}
