"use client";

import { useCallback, useState } from "react";

import { CheckCircle } from "lucide-react";
import { WebIrys } from "@irys/sdk";
import { providers } from "ethers";
import { Buffer } from "buffer";
import toast from "react-hot-toast";

import MetadataPreview from "@/components/MetadataPreview";
import Dropzone from "@/components/Dropzone";
import { UploadButton } from "@/components/UploadButton";
import { StatusIndicator } from "@/components/StatusIndicator";

import { useMemory } from "@/context/MemoryContext";
// import type { MemoryEntry } from "@/memory";
// import type { MemoryEntry } from "../memory"; // Update the path as needed to the correct location of MemoryEntry
// import type { MemoryEntry } from "types/memory"; // Update this path if your MemoryEntry type is located elsewhere
import type { MemoryEntry } from "../types/memory"; // Update the path as needed to the correct location of MemoryEntry

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadCost, setUploadCost] = useState<string>("");
  const [txId, setTxId] = useState<string>("");
  const [showCheck, setShowCheck] = useState(false);

  const { addMemory } = useMemory();

  const getIrys = async () => {
    // @ts-ignore
    if (!window.ethereum) throw new Error("No crypto wallet found");
    // @ts-ignore
    const provider = new providers.Web3Provider(window.ethereum);
    const irys = new WebIrys({
      network: "mainnet",
      token: "matic",
      wallet: { name: "ethersv5", provider },
    });
    await irys.ready();
    return irys;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setUploadStatus("");
    setTxId("");
    setUploadCost("");

    try {
      setUploadStatus("Getting upload cost...");
      const irys = await getIrys();
      const price = await irys.getPrice(selectedFile.size);
      const cost = irys.utils.fromAtomic(price).toString();
      setUploadCost(cost);
      setUploadStatus("Cost retrieved. Ready to upload.");
    } catch (e) {
      console.error(e);
      setUploadStatus(`Error: ${(e as Error).message}`);
      toast.error("Failed to retrieve upload cost");
    }
  }, [getIrys]); // Added getIrys to dependency array for correctness

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");
    try {
      setUploadStatus("Uploading...");
      const irys = await getIrys();
      const buffer = Buffer.from(await file.arrayBuffer());

      const price = await irys.getPrice(buffer.length);
      setUploadStatus("Funding node...");
      await irys.fund(price);

      setUploadStatus("Uploading file...");
      const receipt = await irys.upload(buffer, {
        tags: [{ name: "Content-Type", value: file.type }],
      });

      setTxId(receipt.id);
      setUploadStatus("Upload successful!");
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 1200);

      const memory: MemoryEntry = {
        fileName: file.name,
        size: file.size.toString(),
        type: file.type,
        uploadedAt: new Date().toISOString(),
        txId: receipt.id,
        url: `https://gateway.irys.xyz/${receipt.id}`,
        isNew: true,
      };

      addMemory(memory);
      
      // Reset the UI after a short delay
      setTimeout(() => {
        setFile(null);
        setUploadCost("");
        setUploadStatus("");
        setTxId("");
      }, 1500);


    } catch (e) {
      console.error(e);
      const errorMessage = (e as Error).message;
      setUploadStatus(`Error: ${errorMessage}`);
      toast.error(errorMessage || "Upload failed.");
    }
  };

  return (
    <div className="relative">
      <Dropzone onDrop={onDrop} />

       {/* Animated checkmark removed for debugging */}
      {showCheck && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <CheckCircle className="w-16 h-16 text-green-400" />
        </div>
      )}

      {/* The full preview and upload control section */}
      {file && (
        <div className="mt-6 space-y-4 max-w-xl mx-auto text-white">
          {uploadCost && (
            <MetadataPreview
              fileName={file.name}
              type={file.type}
              size={file.size}
              cost={uploadCost}
            />
          )}

          <StatusIndicator status={uploadStatus} />

          <div className="text-center">
            <UploadButton
              onClick={handleUpload}
              disabled={
                uploadStatus.includes("Uploading") ||
                uploadStatus.includes("Funding") ||
                !uploadCost
              }
            />
          </div>
        </div>
      )}

      {/* The final confirmation section */}
      {txId && (
        <div className="mt-6 text-center text-green-400">
          <h4 className="font-semibold text-lg">Upload Confirmed!</h4>
          <p className="text-sm truncate px-4">Tx ID: {txId}</p>
          <a
            href={`https://gateway.irys.xyz/${txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-cyan-300 text-sm"
          >
            View on Irys Gateway
          </a>
        </div>
      )}
    </div>
  );
};
