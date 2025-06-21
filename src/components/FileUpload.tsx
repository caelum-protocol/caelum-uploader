"use client";

import { useCallback, useState } from "react";
import { WebIrys } from "@irys/sdk";
import { providers } from "ethers";
import { Buffer } from "buffer";
import toast from "react-hot-toast";

import MetadataPreview from "@/components/MetadataPreview";
import Dropzone from "@/components/Dropzone";
import { UploadButton } from "@/components/UploadButton";
import { StatusIndicator } from "@/components/StatusIndicator";

import { useMemory } from "@/context/MemoryContext";
import type { MemoryEntry } from "@/types/memory";

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadCost, setUploadCost] = useState<string>("");
  const [txId, setTxId] = useState<string>("");

  const { setArchive, triggerMemory } = useMemory();

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
  }, []);

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
      toast.success("Upload complete!");

      const memory: MemoryEntry = {
        fileName: file.name,
        size: file.size.toString(),
        type: file.type,
        uploadedAt: new Date().toISOString(),
        txId: receipt.id,
        url: `https://gateway.irys.xyz/${receipt.id}`,
        // mark as new so we can highlight on reload
        isNew: true,
      };

         const history: MemoryEntry[] = JSON.parse(
        localStorage.getItem("caelumMemoryLog") || "[]"
      );
      history.push(memory);
      localStorage.setItem("caelumMemoryLog", JSON.stringify(history));

      // 🌌 Update shared memory + trigger iris
      setArchive(prev => [...prev, memory]);
      triggerMemory(receipt.id);
    } catch (e) {
      console.error(e);
      setUploadStatus(`Error: ${(e as Error).message}`);
      toast.error("Upload failed.");
    }
  };

  return (
    <div>
      <Dropzone onDrop={onDrop} />

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

      {txId && (
        <div className="mt-6 text-center text-green-400">
          <h4 className="font-semibold text-lg">Upload Confirmed!</h4>
          <p>Tx ID: {txId}</p>
          <a
            href={`https://gateway.irys.xyz/${txId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-cyan-300"
          >
            View on Irys Gateway
          </a>
        </div>
      )}
    </div>
  );
};
