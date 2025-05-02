import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - DynamicVault",
  description: "Connect your wallet to DynamicVault",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        {children}
      </div>
    </div>
  );
}
