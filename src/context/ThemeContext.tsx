"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "iris" | "matrix" | "pepe";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const defaultTheme =
    typeof window !== "undefined"
      ? (localStorage.getItem("caelumTheme") as Theme) || "dark"
      : "dark";

  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // Apply theme class immediately
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("caelumTheme", newTheme);
    setThemeState(newTheme);
    document.documentElement.className = newTheme;
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
