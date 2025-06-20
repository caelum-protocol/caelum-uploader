import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/providers/web3";
import { Toaster } from "react-hot-toast";
import LoadingOverlay from "@/components/LoadingOverlay";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeClientWrapper } from "@/components/ThemeClientWrapper";
import { Header } from "@/components/Header";
import { ThemeBackground } from "@/components/ThemeBackground";
import Script from "next/script";
import { MemoryProvider } from "@/context/MemoryContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Caelum Uploader",
  description: "Permanent data uploader",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="/theme-loader.js" strategy="beforeInteractive" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <MemoryProvider>
            <ThemeClientWrapper>
              <Web3Provider>
                <ThemeBackground />
                <Header />
                <Toaster position="top-right" />
                <LoadingOverlay />
                {children}
              </Web3Provider>
            </ThemeClientWrapper>
          </MemoryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
