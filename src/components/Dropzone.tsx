"use client";

import { useDropzone } from "react-dropzone";
import { FileUp } from "lucide-react";

export default function Dropzone({
  onDrop,
}: {
  onDrop: (acceptedFiles: File[]) => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/json": [".json"],
      "application/pdf": [".pdf"],
      "application/zip": [".zip"],
      "video/mp4": [".mp4"],
      "text/plain": [".txt"],
      "audio/*": [".mp3", ".wav"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`theme-card text-center cursor-pointer select-none flex flex-col items-center justify-center
        ${isDragActive ? "scale-[1.02] shadow-2xl" : "hover:scale-[1.01]"}
      `}
    >
      <input {...getInputProps()} />

      <FileUp size={40} className="mb-4 text-cyan-300 animate-pulse" />

      <p className="text-cyan-100 text-sm sm:text-base font-medium tracking-wide">
        {isDragActive
          ? "Drop your memory to forge it into a shard..."
          : "Drag & drop a file, or click to select a memory to preserve"}
      </p>
    </div>
  );
}