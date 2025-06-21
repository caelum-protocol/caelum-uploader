"use client";

import { FileUpload } from "@/components/FileUpload";
import ClientOnly from "@/components/ClientOnly";
import dynamic from "next/dynamic";

const MemoryArchive = dynamic(
  () => import("@/components/MemoryArchive").then((m) => m.MemoryArchive),
  { ssr: false }
);

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
