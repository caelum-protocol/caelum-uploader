"use client";

import { Web3Provider } from "@/providers/web3";
import { Toaster } from "react-hot-toast";
import { ThemeClientWrapper } from "@/components/ThemeClientWrapper";
import { Header } from "@/components/Header";
import { ThemeBackground } from "@/components/ThemeBackground";
import { useEffect, useState } from "react";
import useMounted from "../utils/useMounted";
import { AnimatePresence } from "framer-motion";
import LoadingOverlay from "@/components/LoadingOverlay";
import useHeartbeat from "@/hooks/useHeartbeat";

let hasShownLoader = false;

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  useHeartbeat();
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === "undefined") return true;
    if (sessionStorage.getItem("loaderShown")) {
      hasShownLoader = true;
      return false;
    }
    return !hasShownLoader;
  });
   
  useEffect(() => {
    if (!hasShownLoader) {
      const timer = setTimeout(() => {
        hasShownLoader = true;
        sessionStorage.setItem("loaderShown", "true");
        setShowLoader(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  
  if (!mounted) return null;

  return (
    <ThemeClientWrapper>
      <Web3Provider>
        <ThemeBackground />
        <Header />
        <Toaster position="top-right" />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "bg-gray-800 text-white",
            success: { iconTheme: { primary: "#22c55e", secondary: "#1e293b" } },
          }}
        />
        {showLoader && <LoadingOverlay />}
          <AnimatePresence mode="wait" initial={false}>
            {children}
          </AnimatePresence>
        </Web3Provider>
    </ThemeClientWrapper>
  );
}