"use client";

import { useEffect, useState } from "react";

const LoadingOverlay = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 1000); // Feel free to change the delay if needed

    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 animate-fadeOut">
      <img
        src="/CaelumLogo.png"
        alt="Loading..."
        className="w-24 h-24 animate-pulse"
      />
    </div>
  );
};

export default LoadingOverlay;
