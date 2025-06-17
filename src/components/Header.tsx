"use client";

import Image from "next/image";
import { ConnectKitButton } from "connectkit";
import { useAccount, useChainId } from "wagmi";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Header = () => {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  // Show switch button if user is connected AND not on Polygon (137)
  const isWrongNetwork =
    isConnected && typeof chainId === "number" && chainId !== 137;

  const handleSwitchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x89" }], // Polygon Mainnet
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Add Polygon if it doesn't exist
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x89",
                chainName: "Polygon Mainnet",
                nativeCurrency: {
                  name: "MATIC",
                  symbol: "MATIC",
                  decimals: 18,
                },
                rpcUrls: ["https://polygon-rpc.com/"],
                blockExplorerUrls: ["https://polygonscan.com/"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Polygon:", addError);
        }
      } else {
        console.error("Switch error:", switchError);
      }
    }
  };

  return (
    <header className="z-50 relative flex justify-between items-center px-4 py-3 border-b border-slate-700">
      <div className="flex items-center gap-4">
        <Image
          src="/CaelumLogo.png"
          alt="Caelum Protocol Logo"
          width={40}
          height={40}
        />
        <div className="text-white">
          <h1 className="text-lg font-bold leading-tight">Caelum Protocol</h1>
          <p className="text-cyan-400 text-xs italic">
            Drop a file. Forge a memory. Shards are forever.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {isWrongNetwork && (
          <button
            onClick={handleSwitchNetwork}
            className="px-3 py-1 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 shadow transition-opacity"
          >
            Switch to Polygon
          </button>
        )}
        <ConnectKitButton />
      </div>
    </header>
  );
};
