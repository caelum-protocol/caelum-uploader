"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
// ✅ CORRECTED IMPORT PATH
// Update the import path below to the correct relative path where MemoryEntry is defined.
// For example, if MemoryEntry is in src/types/memory.ts, use:
import type { MemoryEntry } from "../types/memory";
// Adjust the path as needed based on your project structure.

type MemoryContextType = {
  archive: MemoryEntry[];
  addMemory: (memory: MemoryEntry) => void;
  deleteMemory: (txId: string) => void;
  clearArchive: () => void;
  // Your advanced features can be added back here
  memoryTrigger: boolean;
  newId: string | null;
};

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider = ({ children }: { children: ReactNode }) => {
    const [archive, setArchive] = useState<MemoryEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("caelumMemoryLog");
      if (!saved) return [];
      const parsed = JSON.parse(saved) as MemoryEntry[];
      parsed.sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      return parsed;
    } catch (error) {
      console.error("Failed to load memory log from storage", error);
       return [];
    }
  });

  // Keep localStorage in sync when the archive changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("caelumMemoryLog", JSON.stringify(archive));
  }, [archive]);
  const [memoryTrigger, setMemoryTrigger] = useState(false);
  const [newId, setNewId] = useState<string | null>(null);

  const addMemory = (memory: MemoryEntry) => {
    const updatedArchive = [memory, ...archive];
    setArchive(updatedArchive);
    // You can add your trigger logic here
  };

  const deleteMemory = (txIdToDelete: string) => {
    const updatedArchive = archive.filter((e) => e.txId !== txIdToDelete);
    setArchive(updatedArchive);
    toast.success("Memory deleted.");
  };

  const clearArchive = () => {
    if (confirm("Are you sure you want to clear all archived memories?")) {
      setArchive([]);
      localStorage.removeItem("caelumMemoryLog");
      toast.success("Archive cleared.");
    }
  };


  const value = { archive, addMemory, deleteMemory, clearArchive, memoryTrigger, newId };

  return (
    <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (context === undefined) {
    throw new Error("useMemory must be used within a MemoryProvider");
  }
  return context;
};

