import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { BrowserProvider } from "ethers";

const WALLET_STORAGE_KEY = "medstate_wallet_address";

type WalletContextType = {
  walletAddress: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    try {
      if (typeof window === "undefined" || !window.ethereum) {
        console.warn("No wallet extension found (MetaMask, Core, etc.)");
        return;
      }
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setIsConnected(true);
      window.localStorage.setItem(WALLET_STORAGE_KEY, address);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWalletAddress(null);
    setIsConnected(false);
    window.localStorage.removeItem(WALLET_STORAGE_KEY);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(WALLET_STORAGE_KEY);
    if (stored) {
      setWalletAddress(stored);
      setIsConnected(true);
    }
  }, []);

  const value: WalletContextType = {
    walletAddress,
    isConnected,
    connect,
    disconnect,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return ctx;
}
