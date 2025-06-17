"use client";

import { useEffect } from "react";

const validThemes = ["dark", "glass", "iris", "matrix", "pepe"];

export const ThemeClientWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const saved = localStorage.getItem("caelumTheme");
    const fallback = "dark";
    const theme = validThemes.includes(saved || "") ? saved! : fallback;

    let className = document.body.className;
    validThemes.forEach(t => className = className.replace(t, ""));
    document.body.className = `${className} ${theme}`.trim();
  }, []);

  return <>{children}</>;
};
