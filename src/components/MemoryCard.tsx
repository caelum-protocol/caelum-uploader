"use client";

import formatBytes from "../utils/formatBytes";
import getFileIcon from "../utils/getFileIcon";
import type { MemoryEntry } from "@/types/memory";
import mintToShard from "@/utils/mintToShard";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import toast from "react-hot-toast";
import JsonPreviewModal from "./JsonPreviewModal";

interface MemoryCardProps {
  entry: MemoryEntry;
  onCopy: (url: string, txId: string) => void;
  onDelete?: (txId: string) => void;
  copied: boolean;
  isNew?: boolean;
  inShardView?: boolean;
}

export default function MemoryCard({
  entry,
  onCopy,
  onDelete,
  copied,
  isNew,
  inShardView = false,
}: MemoryCardProps) {
  const { theme } = useTheme();
  const [showJson, setShowJson] = useState(
    isNew && entry.type === "application/json"
  );

  const glowMap: Record<string, string> = {
    matrix: "#00ff00",
    iris: "#a78bfa",
    pepe: "#ff53da",
    dark: "#ffffff",
  };

  const glowColor = glowMap[theme] || "#ffffff";

  return (
  <motion.li
    initial={{ y: 20, opacity: 0, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
    animate={{
      y: 0,
      opacity: 1,
      boxShadow: isNew
        ? [
            `0 0 0px ${glowColor}`,
            `0 0 12px ${glowColor}`,
            `0 0 0px ${glowColor}`,
          ]
        : "0px 0px 0px rgba(0,0,0,0)",
    }}
    exit={{ y: -20, opacity: 0 }}
    transition={{ duration: isNew ? 2 : 0.3 }}
    layout
    className="relative rounded-lg p-4 border shadow transition-all theme-card"
    id={`mem-${entry.txId}`}
  >
    {isNew && (
      <span className="absolute -top-2 -left-2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded">
        You uploaded this!
      </span>
    )}

    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium break-all">
          {getFileIcon(entry.type)} {entry.fileName}
        </p>
        <p className="text-sm opacity-80">
          {formatBytes(parseInt(entry.size))} — {entry.type}
        </p>
        {entry.note && (
          <p className="text-sm italic mt-1 break-words">{entry.note}</p>
        )}
        <p className="text-xs opacity-50 mt-1">
          {new Date(entry.uploadedAt).toLocaleString()}
        </p>
      </div>

      {!inShardView && onDelete && (
        <button
          onClick={() => onDelete(entry.txId)}
          className="text-red-500 text-xs hover:underline ml-4 flex-shrink-0"
        >
          Delete
        </button>
      )}
    </div>

    <div className="mt-3 flex flex-wrap items-center gap-4">
      {entry.type === "application/json" ? (
        <>
          <button
            onClick={() => setShowJson(true)}
            className="text-blue-400 text-sm hover:underline"
          >
            Preview
          </button>
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 text-sm hover:underline"
          >
            View Raw
          </a>
        </>
      ) : (
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 text-sm hover:underline"
        >
          View Memory
        </a>
      )}

      {!inShardView && (
        <>
          <button
            onClick={() => onCopy(entry.url, entry.txId)}
            className="text-yellow-400 text-sm hover:underline"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <button
            disabled={isNew}
            onClick={async () => {
              if (isNew) return;
              const res = await mintToShard(entry);
              if (res.success) {
                toast.success("\u2705 Minted successfully!");
              }
            }}
            className={`text-purple-400 text-sm hover:underline ${
              isNew ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Mint to Shard
          </button>

          {entry.txId && (
             <Link
              href={`/shard/${entry.txId}`}
              className="text-purple-300 text-sm hover:underline"
            >
              View Shard
             </Link>
          )}
        </>
      )}

      {showJson && (
        <JsonPreviewModal url={entry.url} onClose={() => setShowJson(false)} />
      )}
    </div>
  </motion.li>
);
}
