"use client";

import { useEffect, useState } from "react";

const themes = ["dark", "iris", "matrix", "pepe"] as const;
type Theme = typeof themes[number];
const emojis: Record<Theme, string> = {
  dark: "🌑",
  iris: "🌌",
  matrix: "💻",
  pepe: "🐸",
};
export const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("caelumTheme");
    const theme = (themes.includes(saved as Theme) ? saved : "dark") as Theme;
    setCurrentTheme(theme);
  }, []);

  const cycleTheme = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setCurrentTheme(nextTheme);
    
    localStorage.setItem("caelumTheme", nextTheme);
    window.location.reload();
  };

  return (
    <button
      onClick={cycleTheme}
      className="text-sm px-3 py-1 rounded-md border border-cyan-400 text-cyan-300 hover:bg-cyan-800 transition"
    >
      Theme: {emojis[currentTheme]} {currentTheme}
    </button>
  );
};
