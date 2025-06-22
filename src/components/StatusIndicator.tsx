"use client";

import { CheckCircle } from "lucide-react";


export const StatusIndicator = ({ status }: { status: string }) => {
  if (!status) return null;

  const isDone = status.toLowerCase().includes("successful")

  return (
    <div className="relative text-center text-sm font-medium text-gray-400">
      Status: <span className="text-cyan-400">{status}</span>
       {isDone && (
        <span className="inline-block ml-2 text-green-400">
          <CheckCircle size={16} />
        </span>
      )}
    </div>
  );
};
