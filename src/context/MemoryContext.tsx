"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import toast from "react-hot-toast";
import type { MemoryEntry } from "../types/memory";


type MemoryContextType = {
  archive: MemoryEntry[];
  addMemory: (memory: MemoryEntry) => void;
  deleteMemory: (txId: string) => void;
  clearArchive: () => void;
  memoryTrigger: boolean;
  newId: string | null;
  ready: boolean;
};

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider = ({ children }: { children: ReactNode }) => {
  const [archive, setArchive] = useState<MemoryEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem("caelumMemoryLog");
    let parsed: MemoryEntry[] = [];

    if (saved) {
      try {
        parsed = JSON.parse(saved) as MemoryEntry[];
        parsed.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      } catch (error) {
        console.error("Failed to load memory log from storage", error);
      }
    }

    setArchive(parsed);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    localStorage.setItem("caelumMemoryLog", JSON.stringify(archive));
  }, [archive, ready]);
  const [memoryTrigger] = useState(false);
  const [newId] = useState<string | null>(null);

  const addMemory = (memory: MemoryEntry) => {
    const updatedArchive = [memory, ...archive];
    setArchive(updatedArchive);
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


   const value = {
    archive,
    addMemory,
    deleteMemory,
    clearArchive,
    memoryTrigger,
    newId,
    ready,
  };

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

