"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAppSounds } from "../hooks/useAppSounds";

type Theme = "dark" | "iris" | "matrix" | "pepe";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Default to dark so that server and initial client render match.
  const [theme, setThemeState] = useState<Theme>("dark");
  const { playThemeSwitch } = useAppSounds();
  const isFirstRender = useRef(true);

  // After mount, resolve the actual theme from localStorage or the existing
  // <html> class set by the theme-loader script. This keeps the first client
  // render in sync with the server markup and avoids hydration warnings.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("caelumTheme") as Theme | null;
      const validThemes: Theme[] = ["dark", "iris", "matrix", "pepe"];
      const rootClass = document.documentElement.className as Theme;
      const initial = saved && validThemes.includes(saved)
        ? saved
        : validThemes.includes(rootClass)
        ? rootClass
        : "dark";
      setThemeState(initial);
      document.documentElement.className = initial;
    } catch {
      document.documentElement.className = "dark";
    }
  }, []);

  // Apply theme class whenever it changes.
  useEffect(() => {
    document.documentElement.className = theme;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    playThemeSwitch();
  }, [theme, playThemeSwitch]);

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
