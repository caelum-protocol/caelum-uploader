"use client";

import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import dynamic from "next/dynamic";
import { useMemory } from "@/context/MemoryContext";
import type { MemoryEntry } from "@/types/memory";
import { AnimatePresence, motion } from "framer-motion";
const BackgroundLayer = dynamic(
  () => import("./BackgroundLayer").then(mod => mod.default),
  { ssr: false }
);

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

   return (
    <>
      <AnimatePresence mode="wait">
        {theme === "matrix" && (
        <motion.div
          key="matrix"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <MatrixRain />
        </motion.div>
      )}
      {theme === "iris" && (
        <motion.div
          key="iris"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <IrisBackground
            memoryTrigger={memoryTrigger}
            memoryCount={archive.length}
            archive={archive}
          />
        </motion.div>
      )}
      {theme === "dark" && (
        <motion.div
          key="dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DarkScratchPad />
        </motion.div>
      )}
      {theme === "pepe" && (
        <motion.div
          key="pepe"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PepeEffects />
        </motion.div>
      )}
    </AnimatePresence>
      <BackgroundLayer />
    </>
  );
};
