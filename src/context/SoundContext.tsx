"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface SoundContextType {
  soundOn: boolean;
  toggleSound: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("caelumSoundOn");
      if (stored !== null) setSoundOn(stored === "true");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("caelumSoundOn", soundOn ? "true" : "false");
    } catch {}
  }, [soundOn]);

  const toggleSound = () => setSoundOn((s) => !s);

  return (
    <SoundContext.Provider value={{ soundOn, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundEnabled = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSoundEnabled must be used within SoundProvider");
  return context;
};