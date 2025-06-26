"use client";

import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const validThemes = ["dark", "iris", "matrix", "pepe"];

export const ThemeClientWrapper = ({ children }: { children: React.ReactNode }) => {
   const { theme } = useTheme();

  useEffect(() => {
    if (typeof document === "undefined") return;
    // Document check keeps body class manipulation client-side for SSR safety
    let className = document.body.className;
    validThemes.forEach(t => (className = className.replace(t, "")));
    document.body.className = `${className} ${theme}`.trim();
  }, [theme]);

  return <>{children}</>;
};
