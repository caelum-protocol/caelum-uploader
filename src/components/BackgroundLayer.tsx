"use client";

import { motion } from "framer-motion";
import { ThemeName, backgroundImageByTheme } from "@/themeStyles";
import { useTheme } from "@/context/ThemeContext";
import { AnimatePresence } from "framer-motion";

export const BackgroundLayer = () => {
  const { theme } = useTheme();
  const bg = backgroundImageByTheme[theme as ThemeName];

  return (
    <AnimatePresence mode="wait">
      {bg && (
        <motion.div
          key={bg}
          className="fixed inset-0 z-[0] bg-cover bg-no-repeat bg-bottom"
          style={{ backgroundImage: `url('${bg}')` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </AnimatePresence>
  );
};

export default BackgroundLayer;