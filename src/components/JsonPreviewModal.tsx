// src/components/JsonPreviewModal.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function JsonPreviewModal({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) {
  const [content, setContent] = useState<string>("Loading...");

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) =>
        setContent(JSON.stringify(data, null, 2))
      )
      .catch(() => setContent("Failed to load JSON"));
  }, [url]);
  if (typeof document === "undefined") return null; // SSR safety: document only on client

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900 p-4 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto text-white"
        >
          <pre className="whitespace-pre-wrap text-xs">{content}</pre>
          <div className="text-center mt-4">
            <button
              onClick={onClose}
              className="px-4 py-1 bg-blue-600 rounded text-white"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body // Renders outside card container safely on client
  );
}
