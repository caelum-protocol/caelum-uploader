"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light" | "iris" | "matrix" | "pepe";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("caelumTheme") as Theme;
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("caelumTheme", newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
};
