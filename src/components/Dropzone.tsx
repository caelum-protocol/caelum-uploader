"use client";

import { useDropzone } from "react-dropzone";
import { FileUp } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function Dropzone({
  onDrop,
}: {
  onDrop: (acceptedFiles: File[]) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [],
      "image/jpg": [],
      "image/jpeg": [],
      "image/gif": [],
      "application/json": [],
      "application/pdf": [],
      "application/zip": [],
      "video/mp4": [],
      "text/plain": [],
      "audio/mp3": [],
      "audio/wav": [],
    },
  });

  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const pulseClass =
    theme === "matrix" && isDragActive ? "dropzone-active" : "";

  const hoverClass =
    theme === "matrix"
      ? "hover:shadow-[0_0_16px_#00ff00]"
      : theme === "iris"
      ? "hover:shadow-[0_0_16px_#a78bfa]"
      : theme === "pepe"
      ? "hover:shadow-[0_0_16px_#ff53da]"
      : "hover:shadow-[0_0_16px_#ffffff]";

  return (
    <div className="relative z-20 pointer-events-auto">
    <div
      {...getRootProps()}
      className={`theme-card border-2 rounded-xl p-4 text-center cursor-pointer select-none flex flex-col items-center justify-center transition-all duration-300 ${pulseClass} ${hoverClass}`}
    >
      <input {...getInputProps()} />
      <FileUp size={40} className="mb-4 text-sky-300 animate-pulse" />
      <p className="text-sky-100 text-sm sm:text-base font-medium tracking-wide">
        {isDragActive
          ? "Drop your memory to forge it into a shard..."
          : "Drag & drop a file, or click to select a memory to preserve"}
      </p>
     </div>
    </div>
  );
}