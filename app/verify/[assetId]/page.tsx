'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  FileText,
  Loader2,
  Info
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Mock asset data
const PORTFOLIO_ASSETS = [
  {
    id: "1",
    tokenId: 1,
    name: "Blue Chip Art Collection",
    description: "Premium art pieces from renowned contemporary artists",
    imageUrl: "/images/asset-art.jpg",
    currentPrice: "120,000",
    totalValue: "102,000",
    priceChange: "+3.2%",
    confidenceScore: 98,
    lastUpdate: "2023-04-28",
    assetType: "ART",
    supply: 1000,
    ownedSupply: 850,
    isVerified: true,
    ownership: "85%",
    transactionCount: 12,
    blockchainId: "0x7a23608a8eBe71868013BDA0d900351A83bb4Dc2",
    contractAddress: "0x8912DcFB23c5A1A04E58695F5AaFd2ff3d94f9B0",
    verificationData: {
      lastVerified: "2023-05-02",
      blockNumber: 15482930,
      transactionHash: "0x3f7e8b1a2d5c0e9f8a7b6d5e4f3c2b1a0d9c8b7a6d5e4f3c2b1a0d9c8b7a6d5e4",
      chain: "Ethereum Mainnet"
    }
  },
  {
    id: "2",
    tokenId: 2,
    name: "Luxury Real Estate Bundle",
    description: "Tokenized high-end properties in premium locations",
    imageUrl: "/images/asset-realestate.jpg",
    currentPrice: "2,450,000",
    totalValue: "612,500",
    priceChange: "+1.5%",
    confidenceScore: 95,
    lastUpdate: "2023-04-25",
    assetType: "REAL_ESTATE",
    supply: 100,
    ownedSupply: 25,
    isVerified: true,
    ownership: "25%",
    transactionCount: 4,
    blockchainId: "0x4b56E84772a5719a565c76E0226897f33e59f139",
    contractAddress: "0x7a23608a8eBe71868013BDA0d900351A83bb4Dc2",
    verificationData: {
      lastVerified: "2023-05-01",
      blockNumber: 15482100,
      transactionHash: "0x2c1d0b9a8f7e6d5c4b3a2f1e0d9c8b7a6d5e4f3c2b1a0d9c8b7a6d5e4f3c2b1a0",
      chain: "Ethereum Mainnet"
    }
  },
  {
    id: "3",
    tokenId: 3,
    name: "Rare Wine Collection",
    description: "Vintage and limited edition wines with provenance",
    imageUrl: "/images/asset-collectible.jpg",
    currentPrice: "75,000",
    totalValue: "75,000",
    priceChange: "+0.8%",
    confidenceScore: 92,
    lastUpdate: "2023-04-27",
    assetType: "COLLECTIBLE",
    supply: 500,
    ownedSupply: 500,
    isVerified: true,
    ownership: "100%",
    transactionCount: 8,
    blockchainId: "0x8912DcFB23c5A1A04E58695F5AaFd2ff3d94f9B0",
    contractAddress: "0x4b56E84772a5719a565c76E0226897f33e59f139",
    verificationData: {
      lastVerified: "2023-04-30",
      blockNumber: 15481500,
      transactionHash: "0x1a0d9c8b7a6d5e4f3c2b1a0d9c8b7a6d5e4f3c2b1a0d9c8b7a6d5e4f3c2b1a0d9",
      chain: "Ethereum Mainnet"
    }
  }
];

export default function VerifyOwnershipPage({ params }: { params: { assetId: string } }) {
  const { assetId } = params
  const { address } = useAuth()
  const isConnected = !!address
  const { toast } = useToast()
  
  // State
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<null | { success: boolean; message: string }>(null)
  
  // Find the asset
  const asset = PORTFOLIO_ASSETS.find(item => item.id === assetId)
  
  // Handle copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };
  
  // Handle verification
  const handleVerifyOwnership = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to verify ownership",
        variant: "destructive"
      });
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate blockchain verification
    setTimeout(() => {
      setIsVerifying(false);
      
      // In a real implementation, this would check the blockchain
      setVerificationResult({
        success: true,
        message: `Successfully verified ownership of ${asset?.name}. You own ${asset?.ownership} of this asset.`
      });
      
      toast({
        title: "Verification Complete",
        description: "Your ownership has been verified on the blockchain",
      });
    }, 2000);
  };
  
  // Format contract address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  if (!asset) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Asset Not Found</h1>
        <p className="text-muted-foreground mb-6">The asset you are looking for does not exist or is not in your portfolio.</p>
        <Link href="/portfolio">
          <Button>Return to Portfolio</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/portfolio">
        <Button variant="ghost" size="sm" className="mb-6 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portfolio
        </Button>
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Shield className="mr-3 h-7 w-7 text-primary" />
            Verify Asset Ownership
          </h1>
          <p className="text-muted-foreground">
            Verify your ownership of this tokenized asset on the blockchain
          </p>
        </div>
        
        {!isConnected && (
          <div className="mb-8 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Please connect your wallet to verify asset ownership. You&apos;ll need to sign a message to prove you control the wallet.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Asset details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={asset.imageUrl}
                      alt={asset.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-bold">{asset.name}</h2>
                      {asset.isVerified && (
                        <Badge variant="outline" className="ml-2 bg-green-50 dark:bg-transparent text-green-600 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm mt-1">
                      <Badge variant="outline">{asset.assetType}</Badge>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-muted-foreground">ID: {asset.tokenId}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{asset.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Smart Contract Address</p>
                    <div className="flex items-center mt-1">
                      <span className="font-mono text-sm">{formatAddress(asset.contractAddress)}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(asset.contractAddress)}>
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy contract address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`https://etherscan.io/address/${asset.contractAddress}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View on Etherscan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Token ID</p>
                    <p className="font-medium">{asset.tokenId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Your Registered Wallet</p>
                    <div className="flex items-center mt-1">
                      <span className="font-mono text-sm">{formatAddress(asset.blockchainId)}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(asset.blockchainId)}>
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy wallet address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link href={`https://etherscan.io/address/${asset.blockchainId}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View on Etherscan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Ownership Percentage</p>
                    <p className="font-medium">{asset.ownership}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Total Supply</p>
                    <p className="font-medium">{asset.supply} tokens</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Your Balance</p>
                    <p className="font-medium">{asset.ownedSupply} tokens</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Last Verification Details</h3>
                  
                  {asset.verificationData ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Last Verified</p>
                        <p className="font-medium">{asset.verificationData.lastVerified}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Block Number</p>
                        <div className="flex items-center">
                          <span className="font-medium">{asset.verificationData.blockNumber}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`https://etherscan.io/block/${asset.verificationData.blockNumber}`} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View block on Etherscan</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction Hash</p>
                        <div className="flex items-center">
                          <span className="font-mono text-sm truncate max-w-[180px]">
                            {asset.verificationData.transactionHash.slice(0, 16)}...
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(asset.verificationData.transactionHash)}>
                                  <Copy className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy transaction hash</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`https://etherscan.io/tx/${asset.verificationData.transactionHash}`} target="_blank" rel="noopener noreferrer">
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View transaction on Etherscan</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Chain</p>
                        <p className="font-medium">{asset.verificationData.chain}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No previous verification data found. Please verify your ownership to create a record.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm flex">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-blue-600 dark:text-blue-400">
                <p className="font-medium mb-1">How ownership verification works:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Connect the wallet that owns the tokens</li>
                  <li>Click &quot;Verify Ownership&quot; to initiate the verification process</li>
                  <li>A signature request will appear in your wallet</li>
                  <li>Sign the message to verify that you control the wallet</li>
                  <li>The RWAAssetContract will be queried to confirm your token balance</li>
                  <li>Results will be displayed and saved for future reference</li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* Right column: Verification UI */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-primary" />
                  Ownership Verification
                </CardTitle>
                <CardDescription>
                  Verify your ownership of this asset on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Contract Standard</p>
                    <p className="text-sm font-medium">ERC-1155</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Implementation</p>
                    <p className="text-sm font-medium">RWAAssetContract</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">Verification Method</p>
                    <p className="text-sm font-medium">Signature + Query</p>
                  </div>
                </div>
                
                {verificationResult && (
                  <div className={`p-4 rounded-lg ${verificationResult.success ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                    <div className="flex">
                      {verificationResult.success ? (
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                      )}
                      <p className="text-sm">{verificationResult.message}</p>
                    </div>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  onClick={handleVerifyOwnership}
                  disabled={!isConnected || isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Ownership'
                  )}
                </Button>
                
                {!isConnected && (
                  <p className="text-center text-sm text-muted-foreground">
                    Please connect your wallet to verify ownership
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex-col space-y-4 border-t pt-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/asset/${assetId}`}>
                    Manage Asset
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`https://etherscan.io/token/${asset.contractAddress}?a=${asset.blockchainId}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Explorer
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href={`/docs/verification`}>
                    <FileText className="mr-2 h-4 w-4" />
                    Verification Docs
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 