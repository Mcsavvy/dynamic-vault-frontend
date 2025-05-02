'use client'

import { WalletConnectButton } from "@/components/web3/wallet-connect";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

export default function ConnectPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // Handle redirect if user is already connected
  useEffect(() => {
    if (isConnected) {
      const redirectPath = sessionStorage.getItem('redirectAfterAuth') || '/';
      sessionStorage.removeItem('redirectAfterAuth');
      router.push(redirectPath);
    }
  }, [isConnected, router]);

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
      
      <div className="text-sm text-slate">
        <p className="mb-2">
          By connecting, you agree to our{" "}
          <Link href="/terms" className="text-ocean-blue hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-ocean-blue hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <p>
          Need help?{" "}
          <Link href="/support" className="text-ocean-blue hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}