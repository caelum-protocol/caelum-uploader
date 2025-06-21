"use client";

import formatBytes from "../utils/formatBytes";
import getFileIcon from "../utils/getFileIcon";
import type { MemoryEntry } from "@/types/memory";
import mintToShard from "@/utils/mintToShard";

interface MemoryCardProps {
  entry: MemoryEntry;
  onCopy: (url: string, txId: string) => void;
  onDelete: (txId: string) => void;
  copied: boolean;
}

export default function MemoryCard({
  entry,
  onCopy,
  onDelete,
  copied,
}: MemoryCardProps) {
  return (
    <li
      className="rounded-lg p-4 border shadow transition-all theme-card"
    >
      <div className="flex justify-between items-start">
        <div>
           <p className="font-medium break-all">
            {getFileIcon(entry.type)} {entry.fileName}
          </p>
          <p className="text-sm opacity-80">
            {formatBytes(parseInt(entry.size))} — {entry.type}
          </p>
          <p className="text-xs opacity-50 mt-1">
            {new Date(entry.uploadedAt).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => onDelete(entry.txId)}
          className="text-red-500 text-xs hover:underline ml-4 flex-shrink-0"
        >
          Delete
        </button>
      </div>
      <div className="mt-3 flex items-center space-x-4">
        <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 text-sm hover:underline"
        >
            View Memory
        </a>

        <button
            onClick={() => onCopy(entry.url, entry.txId)}
            className="text-yellow-400 text-sm hover:underline"
        >
            {copied ? "Copied!" : "Copy Link"}
        </button>

        <button
            onClick={async () => {
                const res = await mintToShard(entry);
                alert(`✅ Mint simulated!\nTx ID: ${res.txId}`);
            }}
            className="text-purple-400 text-sm hover:underline"
        >
            Mint to Shard
        </button>
    </div>
    </li>
  );
}
