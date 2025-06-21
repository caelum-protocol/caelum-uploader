"use client";

import { useEffect, useState } from "react";

export default function LoadingOverlay() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 500); // delay removal after fade
    }, 1000); // show for 1 second

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col justify-center items-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      } bg-black`}
    >
      <img
        src="/CaelumLogo.png"
        alt="Loading..."
        className="w-24 h-24 animate-pulse"
      />
    </div>
  );
}
