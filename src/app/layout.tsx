import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Script from "next/script";
import LayoutClient from "./layoutClient";
import { MemoryProvider } from "@/context/MemoryContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SoundProvider } from "@/context/SoundContext";

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
      <body
        className={`${inter.className} transition-colors duration-300`}
        suppressHydrationWarning
      >
         <SoundProvider>
          <ThemeProvider>
            <MemoryProvider>
              <LayoutClient>{children}</LayoutClient>
            </MemoryProvider>
          </ThemeProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
