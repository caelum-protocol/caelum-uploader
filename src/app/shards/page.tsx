"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMemory } from "@/context/MemoryContext";
import type { MemoryEntry } from "@/types/memory";
import formatBytes from "@/utils/formatBytes";
import useMounted from "@/utils/useMounted";

interface ShardSummary {
  txId: string;
  count: number;
  totalSize: number;
  date: string;
}

export default function ShardsPage() {
  const mounted = useMounted();
  const { archive } = useMemory();
  const [shards, setShards] = useState<ShardSummary[]>([]);

  useEffect(() => {
    if (!mounted) return;
    const map = new Map<string, ShardSummary>();
    archive.forEach((entry: MemoryEntry) => {
      const existing = map.get(entry.txId);
      if (existing) {
        existing.count += 1;
        existing.totalSize += parseInt(entry.size);
      } else {
        map.set(entry.txId, {
          txId: entry.txId,
          count: 1,
          totalSize: parseInt(entry.size),
          date: entry.uploadedAt,
        });
      }
    });
    const arr = Array.from(map.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setShards(arr);
  }, [archive, mounted]);

  if (!mounted) return null;

  return (
    <main className="relative z-30 min-h-screen flex flex-col items-center justify-start px-2 sm:px-4 py-16 sm:py-24 text-center bg-black bg-opacity-80 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-white mb-8">🧩 All Shards</h2>
      {shards.length === 0 ? (
        <p className="text-gray-400">No shards found.</p>
      ) : (
        <ul className="w-full max-w-2xl flex flex-col items-center gap-4">
          {shards.map((s) => (
            <li key={s.txId} className="w-full theme-card">
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <h3 className="text-purple-300 break-all font-mono">
                    {s.txId}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {s.count} file{s.count > 1 ? "s" : ""} • {formatBytes(s.totalSize)} • {new Date(s.date).toLocaleString()}
                  </p>
                </div>
                <Link href={`/shard/${s.txId}`} className="text-blue-400 text-sm hover:underline">
                  View Shard
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/"
        className="mt-16 inline-block bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full text-base shadow-lg transition font-semibold"
      >
        ⬅ Back to Archive
      </Link>
    </main>
  );
}