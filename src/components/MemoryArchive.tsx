"use client";

import { useEffect, useState } from "react";
import MemoryCard from "./MemoryCard";
import { inputStylesByTheme, ThemeName } from "@/themeStyles";
import { useTheme } from "@/context/ThemeContext"; // adjust path as needed
import type { MemoryEntry } from "@/types/memory";

export const MemoryArchive = () => {
  const { theme } = useTheme();
  const [log, setLog] = useState<MemoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");

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

   const displayLog = [...log]
    .filter((entry) =>
      entry.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case "dateAsc":
          return (
            new Date(a.uploadedAt).getTime() -
            new Date(b.uploadedAt).getTime()
          );
        case "sizeDesc":
          return parseInt(b.size) - parseInt(a.size);
        case "sizeAsc":
          return parseInt(a.size) - parseInt(b.size);
        default:
          return (
            new Date(b.uploadedAt).getTime() -
            new Date(a.uploadedAt).getTime()
          );
      }
    });

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
       <div className="flex items-center justify-between gap-2 mb-4">
        <input
          type="text"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`px-4 py-2 rounded border ${inputStylesByTheme[theme as ThemeName] || "bg-white text-black border-gray-300"}`}

        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={`px-2 py-2 rounded border ml-2 ${inputStylesByTheme[theme as ThemeName] || "bg-white text-black border-gray-300"}`}
        >
          <option value="dateDesc">Date (newest)</option>
          <option value="dateAsc">Date (oldest)</option>
          <option value="sizeDesc">Size (largest)</option>
          <option value="sizeAsc">Size (smallest)</option>
        </select>
      </div>

      <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {displayLog.map((entry) => (
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