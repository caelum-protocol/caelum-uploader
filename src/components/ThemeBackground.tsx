"use client";

import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const MatrixRain = dynamic(() => import("@/components/MatrixRain").then(mod => mod.default), { ssr: false });
const IrisBackground = dynamic(() => import("@/components/IrisBackground").then(mod => mod.default), { ssr: false });

export const ThemeBackground = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const body = document.body;
    body.classList.remove("theme-pepe", "theme-glass", "theme-forge", "theme-dark");
    if (theme) body.classList.add(`theme-${theme}`);
  }, [theme]);

  if (theme === "matrix") return <MatrixRain />;
  if (theme === "iris") return <IrisBackground />;
  return null;
};
