"use client";

import { useEffect, useState } from "react";
import { useMemory } from "@/context/MemoryContext";
import MemoryCard from "@/components/MemoryCard";
import formatBytes from "@/utils/formatBytes";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ShardPage({ params }: { params: { txId: string } }) {
  const { archive } = useMemory();
  const txId = params.txId;

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  if (!hasMounted) return null;

  const shardItems = archive.filter((entry) => entry.txId === txId);

  const totalSize = shardItems.reduce(
    (acc, curr) => acc + parseInt(curr.size),
    0
  );

  const downloadShardZip = async () => {
    const zip = new JSZip();

    for (const file of shardItems) {
      try {
        const res = await fetch(file.url);
        const blob = await res.blob();
        zip.file(file.fileName, blob);
      } catch (e) {
        console.error("Failed to fetch file", file.fileName);
      }
    }

    const metadata = shardItems.map(({ fileName, txId, type, size, uploadedAt }) => ({
      fileName,
      txId,
      type,
      size,
      uploadedAt,
    }));
    zip.file("metadata.json", JSON.stringify(metadata, null, 2));

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `shard-${txId}.zip`);
  };

  return (
    <div className="p-4 sm:p-8">
      <a href="/" className="text-sm text-blue-400 hover:underline mb-2 block">
        ← Back to Archive
      </a>

      <h2 className="text-2xl font-bold mb-2">📦 Shard: {txId}</h2>

      {shardItems.length > 0 && (
        <>
          <p className="text-sm text-gray-400 mb-4">
            🧬 {shardItems.length} file{shardItems.length > 1 ? "s" : ""} • {formatBytes(totalSize)} • Minted {new Date(shardItems[0].uploadedAt).toLocaleString()}
          </p>

          <button
            onClick={downloadShardZip}
            className="text-white bg-green-600 px-4 py-2 rounded text-sm hover:bg-green-700 mb-6"
          >
            ⬇ Download Shard (.zip)
          </button>
        </>
      )}

      {shardItems.length === 0 ? (
        <p className="text-red-500">No memories found for this shard.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {shardItems.map((entry) => (
            <MemoryCard
              key={entry.txId + entry.fileName}
              entry={entry}
              copied={false}
              onCopy={() => {}}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

