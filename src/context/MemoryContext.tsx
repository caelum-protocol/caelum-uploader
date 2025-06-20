"use client";

import React, { createContext, useContext, useState } from "react";
import type { MemoryEntry } from "@/types/memory";

type MemoryContextType = {
  archive: MemoryEntry[];
  setArchive: React.Dispatch<React.SetStateAction<MemoryEntry[]>>;
  memoryTrigger: boolean;
  triggerMemory: () => void;
};

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

type MemoryProviderProps = {
  children: React.ReactNode;
};

export const MemoryProvider: React.FC<MemoryProviderProps> = ({ children }) => {
  const [archive, setArchive] = useState<MemoryEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("caelumMemoryLog");
      return saved ? (JSON.parse(saved) as MemoryEntry[]) : [];
    }
    return [];
  });

  const [memoryTrigger, setMemoryTrigger] = useState(false);

  const triggerMemory = () => {
    setMemoryTrigger(true);
    setTimeout(() => setMemoryTrigger(false), 500); // brief pulse
  };

  return (
    <MemoryContext.Provider value={{ archive, setArchive, memoryTrigger, triggerMemory }}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) throw new Error("useMemory must be used within MemoryProvider");
  return context;
};
