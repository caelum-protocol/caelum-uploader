"use client";

import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";

const MatrixRain = dynamic(() =>
  import("@/components/MatrixRain").then(mod => mod.default), { ssr: false }
);

const IrisBackground = dynamic(() =>
  import("@/components/IrisBackground").then(mod => mod.default), { ssr: false }
);

export const ThemeBackground = () => {
  const { theme } = useTheme();

  if (theme === "matrix") return <MatrixRain />;
  if (theme === "iris") return <IrisBackground />;
  return null;
};
