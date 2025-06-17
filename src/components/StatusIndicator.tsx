"use client";

export const StatusIndicator = ({ status }: { status: string }) => {
  if (!status) return null;

  return (
    <div className="text-center text-sm font-medium text-gray-400">
      Status: <span className="text-cyan-400">{status}</span>
    </div>
  );
};
