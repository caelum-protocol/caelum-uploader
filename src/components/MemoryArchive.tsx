"use client";

import { useState, useEffect, useRef } from "react";
import { useMemory } from "@/context/MemoryContext";
import MemoryCard from "./MemoryCard";
import { useTheme } from "@/context/ThemeContext";
import { inputStylesByTheme, ThemeName } from "../themeStyles";
import { AnimatePresence } from "framer-motion";
import useMounted from "@/utils/useMounted";

export const MemoryArchive = () => {
  const mounted = useMounted();
  const { theme } = useTheme();
  const { archive, deleteMemory, clearArchive, newId, ready } = useMemory();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");
  const listRef = useRef<HTMLDivElement>(null);

  const handleCopy = (url: string, txId: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      // Ensure clipboard access only runs client-side for Next.js/SSR
      navigator.clipboard.writeText(url);
    }
    setCopiedId(txId);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const displayLog = archive
    .filter((entry) => {
      const term = searchTerm.toLowerCase();
      return (
        entry.fileName.toLowerCase().includes(term) ||
        (entry.note ? entry.note.toLowerCase().includes(term) : false)
      );
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "dateAsc":
          return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
        case "sizeDesc":
          return parseInt(b.size) - parseInt(a.size);
        case "sizeAsc":
          return parseInt(a.size) - parseInt(b.size);
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });

  useEffect(() => {
    if (newId && listRef.current) {
      const el = listRef.current.querySelector(`#mem-${newId}`);
      if (el) {
        (el as HTMLElement).scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [newId]);

  if (!mounted || !ready) {
     return null;
  }

  return (
      <div className="relative z-[5] mt-10 p-4 sm:p-6 rounded-lg max-w-2xl mx-auto theme-archive pointer-events-auto transition-colors duration-300">
      <h2 className="text-xl font-semibold text-center text-cyan-300 mb-4">
        🧠 Archived Memories
      </h2>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`px-4 py-2 rounded border w-full sm:w-64 ${inputStylesByTheme[theme as ThemeName] || "bg-white text-black border-gray-300"}`}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={`px-2 py-2 rounded border w-full sm:w-48 ${inputStylesByTheme[theme as ThemeName] || "bg-white text-black border-gray-300"}`}
        >
          <option value="dateDesc">Date (newest)</option>
          <option value="dateAsc">Date (oldest)</option>
          <option value="sizeDesc">Size (largest)</option>
          <option value="sizeAsc">Size (smallest)</option>
        </select>
      </div>

       <div className="space-y-4 max-h-96 min-h-48 overflow-y-auto pr-2 scrollbar-hide" ref={listRef}>
         <AnimatePresence>
          {displayLog.length > 0 ? (
            displayLog.map((entry) => (
              <MemoryCard
                key={entry.txId}
                entry={entry}
                onCopy={handleCopy}
                onDelete={() => deleteMemory(entry.txId)}
                copied={copiedId === entry.txId}
                isNew={entry.isNew || newId === entry.txId}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 italic mt-4">
              No memories found for this search.
            </div>
          )}
        </AnimatePresence>
      </div>

      {archive.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={clearArchive}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md transition"
          >
            Clear Archive
          </button>
        </div>
      )}
    </div>
  );
};


