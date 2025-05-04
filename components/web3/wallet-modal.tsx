"use client";

import { useConnect, type Connector } from "wagmi";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
// import type { Config, ConnectErrorType, ResolvedRegister } from '@wagmi/core'
// import {
//     type ConnectData,
//     type ConnectMutate,
//     type ConnectMutateAsync,
//     type ConnectVariables,
//     connectMutationOptions,
// } from '@wagmi/core/query'

type WalletModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
    const { connectors, connect, isPending, } = useConnect();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [pendingConnectorId, setPendingConnectorId] = useState<string | null>(null);

    // Prevent hydration errors
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleConnectSuccess = (
    ) => {
        toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected.",
        });
        onClose();
        setPendingConnectorId(null);
    };

    const handleConnectError = () => {
        toast({
            title: "Connection Failed",
            description: "Failed to connect wallet. Please try again.",
            variant: "destructive",
        });
        onClose();
        setPendingConnectorId(null);
    };

    // Handle wallet connection
    const handleConnect = async (connector: Connector) => {
        try {
            setPendingConnectorId(connector.uid);
            connect({ connector }, { onSuccess: handleConnectSuccess, onError: handleConnectError });
            onClose();
        } catch (err) {
            console.error("Connection error:", err);
            setPendingConnectorId(null);
        }
    };

    if (!mounted) return null;
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            <div
                className="relative bg-white border border-gray-200 rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-zoom-in-95"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="font-montserrat text-xl font-semibold text-deep-navy">
                        Connect Wallet
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-light-gray transition-colors"
                    >
                        <X size={20} className="text-slate" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate mb-6">
                        Connect your wallet to access DynamicVault features, explore assets, and make transactions.
                    </p>

                    <div className="space-y-3">
                        {connectors.map((connector) => (
                            <button
                                key={connector.uid}
                                onClick={() => handleConnect(connector)}
                                disabled={isPending || pendingConnectorId === connector.uid}
                                className="w-full p-4 bg-light-gray hover:bg-gray-100 border border-gray-100 rounded-lg flex items-center justify-between transition-colors disabled:opacity-70"
                            >
                                <div className="flex items-center">
                                    {connector.name.toLowerCase().includes("metamask") && (
                                        <ImageWithFallback src="/assets/metamask.svg" alt="Metamask" width={24} height={24} />
                                    )}
                                    {connector.name.toLowerCase().includes("coinbase") && (
                                        <ImageWithFallback src="/assets/coinbase.svg" alt="Coinbase" width={24} height={24} />
                                    )}
                                    {connector.name.toLowerCase().includes("walletconnect") && (
                                        <ImageWithFallback src="/assets/walletconnect.svg" alt="WalletConnect" width={24} height={24} />
                                    )}
                                    <span className="ml-2 font-medium text-deep-navy">
                                        {connector.name}
                                    </span>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-teal-accent flex items-center justify-center">
                                    {pendingConnectorId === connector.uid ? (
                                        <div className="w-3 h-3 rounded-full bg-teal-accent animate-pulse" />
                                    ) : (
                                        <div className="w-3 h-3 rounded-full bg-transparent" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <p className="text-xs text-slate mt-6 text-center">
                        By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
} 