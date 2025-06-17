"use client";

export const UploadButton = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 font-semibold rounded-md shadow-md transition ${
        disabled
          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 text-white"
      }`}
    >
      Upload to Irys
    </button>
  );
};
