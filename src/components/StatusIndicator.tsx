"use client";

import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const StatusIndicator = ({ status }: { status: string }) => {
  if (!status) return null;

  const isDone = status.toLowerCase().includes("successful")

  return (
    <div className="relative text-center text-sm font-medium text-gray-400">
      Status: <span className="text-cyan-400">{status}</span>
       <AnimatePresence>
        {isDone && (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="inline-block ml-2 text-green-400"
          >
            <CheckCircle size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
