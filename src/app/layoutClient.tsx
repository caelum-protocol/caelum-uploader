"use client";

import { Web3Provider } from "@/providers/web3";
import { Toaster } from "react-hot-toast";
import { ThemeClientWrapper } from "@/components/ThemeClientWrapper";
import { Header } from "@/components/Header";
import { ThemeBackground } from "@/components/ThemeBackground";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import useMounted from "../utils/useMounted";
import { AnimatePresence, motion } from "framer-motion";
import LoadingOverlay from "@/components/LoadingOverlay";

let hasShownLoader = false;

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const { theme } = useTheme();
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.add("overflow-y-hidden");
    const timer = setTimeout(() => {
      document.documentElement.classList.remove("overflow-y-hidden");
    }, 350);
    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove("overflow-y-hidden");
    };
  }, [pathname, theme]);
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
        {showLoader && <LoadingOverlay />}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${pathname}-${theme}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="min-h-screen transition-colors duration-300"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Web3Provider>
    </ThemeClientWrapper>
  );
}

