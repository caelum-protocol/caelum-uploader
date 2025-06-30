"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { WebIrys } from "@irys/sdk";
import { Web3Provider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
import { formatEther, ethers } from "ethers";
import { Buffer } from "buffer";
import toast from "react-hot-toast";

import MetadataPreview from "@/components/MetadataPreview";
import Dropzone from "@/components/Dropzone";
import { UploadButton } from "@/components/UploadButton";
import { StatusIndicator } from "@/components/StatusIndicator";

import { useMemory } from "@/context/MemoryContext";
import type { MemoryEntry } from "../types/memory"; 

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadCost, setUploadCost] = useState<string>("");
  const [txId, setTxId] = useState<string>("");
  const [showCheck, setShowCheck] = useState(false);
  const [note, setNote] = useState<string>("");

  // New states for balance/gas
  const [userEthBalance, setUserEthBalance] = useState<number | null>(null);
  const [gasNeededEth, setGasNeededEth] = useState<number | null>(null);
  const [insufficientFunds, setInsufficientFunds] = useState(false);

  const { addMemory } = useMemory();

  // Helper: get Irys instance (v5 provider for irys)
  const getIrys = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum)
      throw new Error("No crypto wallet found");
    const provider = new Web3Provider(window.ethereum);
    const irys = new WebIrys({
      network: "mainnet",
      token: "matic",
      wallet: { name: "ethersv5", provider },
    });
    await irys.ready();
    return irys;
  }, []);

  // Helper: check user's ETH and estimate gas for funding tx
  const checkBalanceAndGas = useCallback(async (fileSize: number, irys?: any) => {
    if (typeof window === "undefined" || !window.ethereum) return { sufficient: false, needed: null, balance: null };
    try {
      const provider = new Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      const userBalanceWei = await provider.getBalance(userAddress);
      const userBalanceEth = parseFloat(formatEther(userBalanceWei.toString()));;

      const _irys = irys || await getIrys();
      const price = await _irys.getPrice(fileSize);

      // Defensive: check that tokenConfig and funder exist
      let funder = _irys.tokenConfig?.funder;
      if (!funder) {
        // fallback: try to get from _irys.wallet?.address or default
        funder = _irys.wallet?.address || ethers.ZeroAddress;
      }

      const fundTx = {
        to: funder,
        value: price.toString(),
      };

      // Defensive: fallback to default gas if estimate fails
      let estimatedGas = BigNumber.from("21000");
      try {
        estimatedGas = await signer.estimateGas(fundTx);
      } catch (e) {
        // ignore, fallback to default
      }
      const gasPrice = await provider.getGasPrice();
      const totalGasCostWei = estimatedGas.mul(gasPrice);
      const totalGasCostEth = parseFloat(formatEther(totalGasCostWei.toString()));
      setGasNeededEth(totalGasCostEth);
      setUserEthBalance(userBalanceEth);

      const sufficient = userBalanceEth >= totalGasCostEth;
      setInsufficientFunds(!sufficient);
      return { sufficient, needed: totalGasCostEth, balance: userEthBalance };
    } catch (e) {
      setUploadStatus("Unable to estimate gas or check balance.");
      setInsufficientFunds(true);
      return { sufficient: false, needed: null, balance: null };
    }
  }, [getIrys]);

  // Estimate gas and check balance on file drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setUploadStatus("");
    setTxId("");
    setUploadCost("");
    setInsufficientFunds(false);

    try {
      setUploadStatus("Getting upload cost...");
      const irys = await getIrys();
      const price = await irys.getPrice(selectedFile.size);
      const cost = irys.utils.fromAtomic(price).toString();
      setUploadCost(cost);
      setUploadStatus("Cost retrieved. Estimating gas…");

      // Check balance and gas before enabling upload
      await checkBalanceAndGas(selectedFile.size, irys);

      setUploadStatus("Cost and gas estimated. Ready to upload.");
    } catch (e) {
      console.error(e);
      setUploadStatus(`Error: ${(e as Error).message}`);
      toast.error("Failed to retrieve upload cost or gas estimate");
    }
  }, [getIrys, checkBalanceAndGas]);

  // Double check balance/gas before uploading!
  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");

    try {
      setUploadStatus("Re-checking gas and balance...");
      const irys = await getIrys();
      const { sufficient, needed, balance } = await checkBalanceAndGas(file.size, irys);
      if (!sufficient) {
        setUploadStatus("Insufficient ETH for gas. Please fund your wallet.");
        toast.error(`You need at least ${needed?.toFixed(6)} ETH, you have ${balance?.toFixed(6)} ETH.`);
        setInsufficientFunds(true);
        return;
      }

      setUploadStatus("Uploading...");
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
        note: note.trim() || undefined,
        isNew: true,
      };

      addMemory(memory);
      
      setTimeout(() => {
        setFile(null);
        setUploadCost("");
        setUploadStatus("");
        setTxId("");
        setNote("");
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

      <AnimatePresence>
        {showCheck && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <CheckCircle className="w-16 h-16 text-green-400" />
          </motion.div>
        )}
      </AnimatePresence>

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

          <input
            type="text"
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded border px-3 py-2 text-black"
          />

          <StatusIndicator status={uploadStatus} />

          {insufficientFunds && (
            <div className="text-red-500 font-semibold">
              Insufficient ETH for gas (
              {gasNeededEth?.toFixed(6)} ETH required,
              you have {userEthBalance?.toFixed(6)} ETH).
              Please fund your wallet before uploading.
            </div>
          )}

          <div className="text-center">
            <UploadButton
              onClick={handleUpload}
              disabled={
                uploadStatus.includes("Uploading") ||
                uploadStatus.includes("Funding") ||
                !uploadCost ||
                insufficientFunds
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
