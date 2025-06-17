"use client";

import React from "react";

interface MetadataPreviewProps {
  fileName: string;
  type: string;
  size: number;
  cost: string;
}

function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const MetadataPreview: React.FC<MetadataPreviewProps> = ({
  fileName,
  type,
  size,
  cost,
}) => {
  return (
    <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700 shadow-inner max-w-xl mx-auto">
      <h3 className="text-lg font-semibold text-white mb-2">🧬 Upload Preview</h3>
      <ul className="text-sm text-gray-300 space-y-1">
        <li><strong>📁 File:</strong> {fileName}</li>
        <li><strong>🧠 Type:</strong> {type}</li>
        <li><strong>⚖️ Size:</strong> {formatBytes(size)}</li>
        <li><strong>💰 Estimated Cost:</strong> {parseFloat(cost).toFixed(6)} MATIC</li>
      </ul>
    </div>
  );
};

export default MetadataPreview;