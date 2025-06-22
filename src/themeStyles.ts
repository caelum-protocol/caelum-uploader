// src/themeStyles.ts

export type ThemeName = "dark" | "matrix" | "iris" | "pepe";

export const inputStylesByTheme: Record<ThemeName, string> = {
  dark: "bg-black text-white border-blue-400",
  matrix: "bg-black text-green-400 border-green-500",
  iris: "bg-indigo-100 text-indigo-900 border-indigo-400",
  pepe: "bg-purple-100 text-green-900 border-pink-400",
};

export const backgroundImageByTheme: Record<ThemeName, string | undefined> = {
  dark: undefined,
  matrix: undefined,
  iris: undefined,
  pepe: "/PepeWide.png",
};