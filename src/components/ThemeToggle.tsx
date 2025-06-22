"use client";

import { useTheme } from "@/context/ThemeContext";

const themes = ["dark", "iris", "matrix", "pepe"] as const;
type Theme = typeof themes[number];
const emojis: Record<Theme, string> = {
  dark: "🌑",
  iris: "🌌",
  matrix: "💻",
  pepe: "🐸",
};
export const ThemeToggle = () => {
  const { theme: currentTheme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (!themes.includes(currentTheme as Theme)) {
      setTheme(themes[0]);
      return;
    }
    const currentIndex = themes.indexOf(currentTheme as Theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <button
      onClick={cycleTheme}
      className="text-sm px-3 py-1 rounded-md border border-cyan-400 text-cyan-300 hover:bg-cyan-800 transition"
    >
      Theme: {emojis[currentTheme as Theme] ?? "❓"} {currentTheme}
    </button>
  );
};
