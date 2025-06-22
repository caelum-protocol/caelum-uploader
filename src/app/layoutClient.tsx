"use client";

import { Web3Provider } from "@/providers/web3";
import { Toaster } from "react-hot-toast";
import { ThemeClientWrapper } from "@/components/ThemeClientWrapper";
import { Header } from "@/components/Header";
import { ThemeBackground } from "@/components/ThemeBackground";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ Tracks whether initial load is complete (ref does not cause re-renders)
  const hasLoadedOnce = useRef(false);
  const [showLoader, setShowLoader] = useState(!hasLoadedOnce.current);

  useEffect(() => {
    if (!hasLoadedOnce.current) {
      const timer = setTimeout(() => {
        hasLoadedOnce.current = true;
        setShowLoader(false);
      }, 800); // adjust delay if needed
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ThemeClientWrapper>
      <Web3Provider>
        <ThemeBackground />
        <Header />
        <Toaster position="top-right" />

            {/* ✅ Loader only ever shows once on cold start */}
            {showLoader && <LoadingOverlay />}

            <div key={pathname}>{children}</div>
           </Web3Provider>
    </ThemeClientWrapper>
  );
}

