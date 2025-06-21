"use client";

import React, { createContext, useContext, useState } from "react";
import type { MemoryEntry } from "@/types/memory";

type MemoryContextType = {
  archive: MemoryEntry[];
  setArchive: React.Dispatch<React.SetStateAction<MemoryEntry[]>>;
  memoryTrigger: boolean;
  triggerMemory: (id?: string) => void;
  newId: string | null;
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
  const [newId, setNewId] = useState<string | null>(null);

  const triggerMemory = (id?: string) => {
    setMemoryTrigger(true);
    if (id) setNewId(id)
    setTimeout(() => setMemoryTrigger(false), 500); // brief pulse
    if (id) {
      setTimeout(() => setNewId(null), 4000); // remove highlight after a bit
    }
  };

  return (
     <MemoryContext.Provider value={{ archive, setArchive, memoryTrigger, triggerMemory, newId }}>
      {children}
    </MemoryContext.Provider>
  );
};

export const useMemory = () => {
  const context = useContext(MemoryContext);
  if (!context) throw new Error("useMemory must be used within MemoryProvider");
  return context;
};
