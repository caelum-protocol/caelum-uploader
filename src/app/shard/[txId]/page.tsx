"use client";

import { useParams } from "next/navigation";
import { useMemory } from "@/context/MemoryContext";
import MemoryCard from "@/components/MemoryCard";
import { useMounted } from "@/hooks/useMounted";
import formatBytes from "@/utils/formatBytes";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Link from "next/link";

export default function ShardPage() {
  const mounted = useMounted();
  // Get both archive and isLoading from the context
  const { archive, isLoading } = useMemory();
  const { txId } = useParams<{ txId: string }>();

  // ✅ The new loading condition now waits for the context to finish loading
  if (!mounted || isLoading || !txId) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-sm opacity-60 animate-pulse">Loading shard...</p>
      </main>
    );
  }

  // This logic now runs only after the archive is confirmed to be loaded
  const shardItems = archive.filter((entry) => entry.txId === txId);
  const totalSize = shardItems.reduce((sum, item) => sum + parseInt(item.size), 0);

  const downloadShardZip = async () => {
    const zip = new JSZip();

    for (const file of shardItems) {
      try {
        const res = await fetch(file.url);
        const blob = await res.blob();
        zip.file(file.fileName, blob);
      } catch (err) {
        console.error(`Failed to fetch ${file.fileName}`, err);
      }
    }

    const metadata = shardItems.map(({ fileName, txId, type, size, uploadedAt }) => ({
      fileName, txId, type, size, uploadedAt,
    }));

    zip.file("metadata.json", JSON.stringify(metadata, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `shard-${txId}.zip`);
  };

  return (
    <main className="relative z-10 p-6 min-h-screen flex flex-col items-center bg-black bg-opacity-80">
      <section className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Shard: <span className="text-purple-300">{txId}</span>
        </h2>

        {shardItems.length > 0 && (
          <p className="text-gray-400 text-sm">
            {shardItems.length} file{shardItems.length > 1 ? "s" : ""} · {formatBytes(totalSize)} · Minted{" "}
            {new Date(shardItems[0].uploadedAt).toLocaleString()}
          </p>
        )}
      </section>

      {shardItems.length > 0 && (
        <button
          onClick={downloadShardZip}
          className="mb-8 text-white bg-green-600 px-6 py-2 rounded-md text-sm hover:bg-green-700 transition"
        >
          Download Shard (.zip)
        </button>
      )}

      {shardItems.length === 0 ? (
        <p className="text-red-400 text-lg mb-12">No memories found for this shard.</p>
      ) : (
        <ul className="w-full max-w-3xl flex flex-col gap-6 mt-6">
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
        Back to Archive
      </Link>
    </main>
  );
}
