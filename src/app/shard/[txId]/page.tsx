"use client";

import { useMemory } from "@/context/MemoryContext";
import MemoryCard from "@/components/MemoryCard";
import formatBytes from "@/utils/formatBytes";

export default function ShardPage({ params }: { params: { txId: string } }) {
  const { archive } = useMemory();
  const txId = params.txId;

  const shardItems = archive.filter((entry) => entry.txId === txId);

  const totalSize = shardItems.reduce(
    (acc, curr) => acc + parseInt(curr.size),
    0
  );

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-2">📦 Shard: {txId}</h2>

      {shardItems.length > 0 && (
        <p className="text-sm text-gray-400 mb-4">
          🧬 {shardItems.length} file{shardItems.length > 1 ? "s" : ""} •{" "}
          {formatBytes(totalSize)} • Minted{" "}
          {new Date(shardItems[0].uploadedAt).toLocaleString()}
        </p>
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
