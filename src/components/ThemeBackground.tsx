"use client";

import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import dynamic from "next/dynamic";

const MatrixRain = dynamic(() => import("@/components/MatrixRain").then(mod => mod.default), { ssr: false });
const IrisBackground = dynamic(() => import("@/components/IrisBackground"), { ssr: false });
const DarkScratchPad = dynamic(() => import("@/components/DarkScratchPad").then(mod => mod.default), { ssr: false });

export const ThemeBackground = ({
  memoryTrigger,
  memoryCount,
}: {
  memoryTrigger: boolean;
  memoryCount: number;
}) => {
  const { theme } = useTheme();

  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-pepe", "theme-dark", "theme-matrix", "theme-iris");
    if (theme) body.classList.add(`theme-${theme}`);
  }, [theme]);

  if (theme === "matrix") return <MatrixRain />;
  if (theme === "iris") return <IrisBackground memoryTrigger={memoryTrigger} memoryCount={memoryCount} />;
  if (theme === "dark") return <DarkScratchPad />;

  return null;
};
