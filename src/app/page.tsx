"use client";

import { FileUpload } from "@/components/FileUpload";
import { MemoryArchive } from "@/components/MemoryArchive";
import ClientOnly from "@/components/ClientOnly";

export default function Home() {
  return (
    <main>
      <div className="p-4 sm:p-8">
        <FileUpload />
        <ClientOnly>
          <MemoryArchive />
        </ClientOnly>
      </div>
    </main>
  );
}
