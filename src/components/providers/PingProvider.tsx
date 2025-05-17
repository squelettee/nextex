"use client";
import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { updateLastSeen } from "@/actions/update-last-seen";

export function PingProvider() {
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    if (!connected || !publicKey) return;

    const ping = () => updateLastSeen(publicKey.toBase58());

    ping();

    const interval = setInterval(ping, 100_000);

    return () => clearInterval(interval);
  }, [connected, publicKey]);

  return null;
}