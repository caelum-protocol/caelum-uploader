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
import { useHeartbeat } from "@/hooks/useHeartbeat"; // ✅ Use named import

type LayoutClientProps = {
  children: React.ReactNode;
};

export default function LayoutClient({ children }: LayoutClientProps) {
  const mounted = useMounted();
  useHeartbeat();

  // Use only showLoader and sessionStorage
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("loaderShown");
  });

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        if (typeof window !== "undefined") {
          // Persist loader flag client-side only for Next.js SSR
          sessionStorage.setItem("loaderShown", "true");
        }
        setShowLoader(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

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
