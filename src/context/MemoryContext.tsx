"use client";

import React, { createContext, useContext, useState } from "react";

type MemoryContextType = {
  archive: any[];
  setArchive: React.Dispatch<React.SetStateAction<any[]>>;
  memoryTrigger: boolean;
  triggerMemory: () => void;
};

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [archive, setArchive] = useState<any[]>(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("caelumMemoryLog");
    return saved ? JSON.parse(saved) : [];
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
