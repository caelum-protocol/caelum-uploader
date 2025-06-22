"use client";
import { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "iris" | "matrix" | "pepe";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // Default to dark so that server and initial client render match.
  const [theme, setThemeState] = useState<Theme>("dark");

  // After mount, read the saved theme from localStorage. This avoids
  // hydration mismatches when the user previously selected a different
  // theme in the browser.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("caelumTheme") as Theme | null;
      const validThemes: Theme[] = ["dark", "iris", "matrix", "pepe"];
      const initial = saved && validThemes.includes(saved) ? saved : "dark";
      setThemeState(initial);
      document.documentElement.className = initial;
    } catch {
      document.documentElement.className = "dark";
    }
  }, []);

  // Apply theme class whenever it changes.
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
