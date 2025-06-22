"use client";

import { FileUpload } from "@/components/FileUpload";
import { MemoryArchive } from "@/components/MemoryArchive";

export default function Home() {
  return (
    <main>
      <div className="p-4 sm:p-8">
        <FileUpload />
        <MemoryArchive />
      </div>
    </main>
  );
}
