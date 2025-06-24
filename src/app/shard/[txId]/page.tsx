"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useMemory } from "@/context/MemoryContext";
import MemoryCard from "@/components/MemoryCard";
import formatBytes from "@/utils/formatBytes";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import useMounted from "@/utils/useMounted";

export default function ShardPage() {
  const mounted = useMounted();
  const { archive, ready } = useMemory();
  const { txId } = useParams<{ txId: string }>();

   const shardItems = useMemo(() => {
    if (!txId) return [];
    return archive.filter((entry) => entry.txId === txId);
  }, [txId, archive]);

    const totalSize = useMemo(
    () => shardItems.reduce((acc, curr) => acc + parseInt(curr.size), 0),
    [shardItems]
  );

  if (!mounted || !ready || !txId) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25 }}
        className="relative z-30 min-h-screen flex items-center justify-center px-4 py-24 text-center bg-black bg-opacity-80 transition-colors duration-300"
      >
        <p className="text-white">Loading shard...</p>
      </motion.main>
    );
  }

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
     <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="relative z-30 min-h-screen flex flex-col items-center justify-start px-4 py-24 text-center bg-black bg-opacity-80 transition-colors duration-300"
    >
      <div className="mb-8">
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
        <p className="text-red-400 text-lg mb-12">No memories found for this shard.</p>
      ) : (
        <ul className="w-full max-w-3xl flex flex-col items-center justify-center gap-6 mt-6">
          <AnimatePresence initial={false}>
            {shardItems.map((entry) => (
              <motion.li
                key={entry.txId + entry.fileName}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <MemoryCard
                  entry={entry}
                  copied={false}
                  onCopy={() => {}}
                  inShardView={true}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <Link
        href="/"
        className="mt-16 inline-block bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full text-base shadow-lg transition font-semibold"
      >
        ⬅ Back to Archive
      </Link>
    </motion.main>
  );
}