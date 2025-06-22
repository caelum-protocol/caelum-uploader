"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemory } from "@/context/MemoryContext";
import MemoryCard from "@/components/MemoryCard";
import formatBytes from "@/utils/formatBytes";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ShardPage() {
  const { archive } = useMemory();
  
  const { txId } = useParams<{ txId: string }>();

  const shardItems = archive.filter((entry) => entry.txId === txId);
  const totalSize = shardItems.reduce((acc, curr) => acc + parseInt(curr.size), 0);

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
    <div className="relative z-30 min-h-screen flex flex-col items-center justify-start pt-24 px-4 text-center">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          📦 Shard: <span className="text-purple-300">{txId}</span>
        </h2>
        {shardItems.length > 0 && (
          <p className="text-gray-400 text-sm">
            🧬 {shardItems.length} file{shardItems.length > 1 ? "s" : ""} •{" "}
            {formatBytes(totalSize)} • Minted{" "}
            {new Date(shardItems[0].uploadedAt).toLocaleString()}
          </p>
        )}
      </div>

      {shardItems.length > 0 && (
        <button
          onClick={downloadShardZip}
          className="text-white bg-green-600 px-6 py-2 rounded-md text-sm hover:bg-green-700 transition mb-8"
        >
          ⬇ Download Shard (.zip)
        </button>
      )}

      {shardItems.length === 0 ? (
        <p className="text-red-400 mb-12">No memories found for this shard.</p>
      ) : (
        <ul className="w-full max-w-3xl flex flex-col items-center justify-center gap-6 mt-6">
          {shardItems.map((entry) => (
            <MemoryCard
              key={entry.txId + entry.fileName}
              entry={entry}
              copied={false}
              onCopy={() => {}}
              inShardView={true}
            />
          ))}
        </ul>
      )}

      <Link
        href="/"
        className="mt-16 inline-block bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full text-base shadow-lg transition font-semibold"
      >
        ⬅ Back to Archive
      </Link>
    </div>
  );
}

