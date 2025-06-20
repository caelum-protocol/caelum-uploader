"use client";

import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import dynamic from "next/dynamic";
import { useMemory } from "@/context/MemoryContext";
import type { MemoryEntry } from "@/types/memory";

const MatrixRain = dynamic(() => import("@/components/MatrixRain").then(mod => mod.default), { ssr: false });
const IrisBackground = dynamic(
  () =>
    import("@/components/IrisBackground").then(
      mod => mod.default as React.ComponentType<{
        memoryCount: number;
        memoryTrigger: boolean;
        archive: MemoryEntry[];
      }>
    ),
  { ssr: false }
);

const DarkScratchPad = dynamic(() => import("@/components/DarkScratchPad").then(mod => mod.default), { ssr: false });
const PepeEffects = dynamic(() => import("@/components/PepeEffects").then(mod => mod.default), { ssr: false });

export const ThemeBackground = () => {
  const { theme } = useTheme();
  const { memoryTrigger, archive } = useMemory();

  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-pepe", "theme-dark", "theme-matrix", "theme-iris");
    if (theme) body.classList.add(`theme-${theme}`);
  }, [theme]);

  if (theme === "matrix") return <MatrixRain />;
  if (theme === "iris") return <IrisBackground memoryTrigger={memoryTrigger} memoryCount={archive.length} archive={archive} />;
  if (theme === "dark") return <DarkScratchPad />;
  if (theme === "pepe") return <PepeEffects />;

  return null;
};
