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
          <ThemeClientWrapper>
            <Web3Provider>
              {/* Background layer (e.g., animated canvas) */}
              <ThemeBackground memoryCount={0} memoryTrigger={false} />
              <Header />
              <Toaster position="top-right" />
              <LoadingOverlay />
              {children}
            </Web3Provider>
          </ThemeClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
