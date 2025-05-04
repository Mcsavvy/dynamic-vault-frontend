'use client'

import { WalletConnectButton } from "@/components/web3/wallet-connect";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";

export default function ConnectPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Handle redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const redirectPath = sessionStorage.getItem('redirectAfterAuth') || '/';
      sessionStorage.removeItem('redirectAfterAuth');
      router.push(redirectPath);
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <div className="text-center">
      <Link href="/" className="inline-flex items-center text-slate hover:text-ocean-blue text-sm mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
      
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-16">
          <Image
            src="/images/logo.png"
            alt="DynamicVault Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>
      
      <h1 className="text-2xl font-bold text-deep-navy mb-2">Connect Your Wallet</h1>
      <p className="text-slate mb-8">
        To access DynamicVault, please connect your Ethereum wallet.
      </p>
      
      <div className="flex justify-center mb-8">
        <WalletConnectButton />
      </div>
      
      <div className="max-w-md mx-auto">
        <h2 className="text-lg font-medium text-deep-navy mb-2">Why connect a wallet?</h2>
        <p className="text-slate mb-4">
          Connecting your wallet allows you to securely authenticate with DynamicVault
          using your Ethereum address. We never have access to your private keys.
        </p>
        <p className="text-slate mb-4">
          You&apos;ll be able to:
        </p>
        <ul className="text-left text-slate list-disc list-inside mb-6">
          <li>View your asset portfolio</li>
          <li>Track your transaction history</li>
          <li>Participate in the marketplace</li>
          <li>Access personalized analytics</li>
        </ul>
      </div>
    </div>
  );
}