"use client";

import { useEffect, useState } from "react";
import MemoryCard from "./MemoryCard";

interface MemoryEntry {
  fileName: string;
  size: string;
  type: string;
  uploadedAt: string;
  txId: string;
  url: string;
}

export const MemoryArchive = () => {
  const [log, setLog] = useState<MemoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const storedLog = localStorage.getItem("caelumMemoryLog");
    if (storedLog) {
      try {
        const parsed = JSON.parse(storedLog);
        parsed.sort(
          (a: MemoryEntry, b: MemoryEntry) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        setLog(parsed);
      } catch (err) {
        console.error("Failed to parse memory log:", err);
      }
    }
  }, []);

  const handleCopy = (url: string, txId: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(txId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (txIdToDelete: string) => {
    const updatedLog = log.filter((e) => e.txId !== txIdToDelete);
    localStorage.setItem("caelumMemoryLog", JSON.stringify(updatedLog));
    setLog(updatedLog);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all archived memories?")) {
      localStorage.removeItem("caelumMemoryLog");
      setLog([]);
    }
  };

  if (log.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 text-sm italic">
        No memories have been archived yet.
      </div>
    );
  }

  return (
    <div className="relative z-20 mt-10 p-4 sm:p-6 rounded-lg max-w-2xl mx-auto theme-archive pointer-events-auto">
      <h2 className="text-xl font-semibold text-center text-cyan-300 mb-4">
        🧠 Archived Memories
      </h2>

      <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {log.map((entry) => (
          <MemoryCard
            key={entry.txId}
            entry={entry}
            onCopy={handleCopy}
            onDelete={handleDelete}
            copied={copiedId === entry.txId}
          />
        ))}
      </ul>

      {log.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={handleClearAll}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md transition"
          >
            Clear Archive
          </button>
        </div>
      )}
    </div>
  );
};