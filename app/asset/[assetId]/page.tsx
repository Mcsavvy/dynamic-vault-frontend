'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
    Clock, Heart, Share2, ArrowLeft, 
    Calendar, MapPin, 
    CheckCircle, Tag, BarChart2, 
    ArrowUpRight, ArrowDownLeft, RefreshCw
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useEffect } from 'react'

// Mock asset data reflecting RWAAssetContract structure
const ASSET = {
    id: "1",
    tokenId: 1,
    name: "Blue Chip Art Collection",
    description: "This exclusive collection features premium art pieces from renowned contemporary artists. Each piece has been carefully selected for its artistic merit, investment potential, and cultural significance.",
    longDescription: "The Blue Chip Art Collection represents a carefully curated selection of artworks from some of the most influential contemporary artists of our time. Each piece has been authenticated and appraised by leading experts in the field, ensuring provenance and value integrity.\n\nThe collection spans various mediums including oil paintings, mixed media works, sculptures in bronze and marble, and limited edition digital art pieces.",
    imageUrl: "/images/asset-art.jpg",
    initialPrice: "100,000",
    currentPrice: "120,000",
    priceChange: "+3.2%",
    confidenceScore: 98,
    lastUpdate: "2023-04-28",
    assetType: "ART",
    assetLocation: "Secure Art Storage Facility, Zurich",
    acquisitionDate: "2023-10-15T14:30:00Z",
    isVerified: true,
    isListed: true,
    listingPrice: "125,000",
    marketplaceId: "listing123",
    attributes: [
        { trait_type: "Medium", value: "Mixed (Paintings, Sculptures, Digital)" },
        { trait_type: "Provenance", value: "Fully Documented" },
        { trait_type: "Insurance", value: "Comprehensive Coverage" },
        { trait_type: "Storage", value: "Climate-Controlled Facility" },
        { trait_type: "Authentication", value: "Expert Verified" }
    ],
    mintedBy: "0x5a34F8C90B8A6F28F17080B7Ed96B877D79D1702",
    owner: "0x7a16Ff8270133F063aAb6C9977183D9e72835539",
    totalSupply: "1000",
    availableSupply: "850",
    tokenURI: "ipfs://QmW8sjrn7wt1dZQDEQNx4rXyqgkKBsxqSBVbZMaV2jTMHP"
}

// Mock price update history from DynamicPricingAgent
const PRICE_HISTORY = [
    { 
        oldPrice: "100,000", 
        newPrice: "110,000", 
        timestamp: "2023-02-15", 
        dataSource: "Christie's Auction Data", 
        confidenceScore: 95 
    },
    { 
        oldPrice: "110,000", 
        newPrice: "115,000", 
        timestamp: "2023-03-22", 
        dataSource: "Sotheby's Market Analytics", 
        confidenceScore: 92 
    },
    { 
        oldPrice: "115,000", 
        newPrice: "120,000", 
        timestamp: "2023-04-28", 
        dataSource: "Global Art Index", 
        confidenceScore: 98
    }
]

// Mock transaction history
const TRANSACTIONS = [
    {
        type: "MINT",
        from: "0x0000000000000000000000000000000000000000",
        to: "0x5a34F8C90B8A6F28F17080B7Ed96B877D79D1702",
        amount: "1000",
        price: "100,000",
        timestamp: "2023-01-15T10:30:00Z",
        txHash: "0x4a6e2b7e8f0d3c9a1b5c6d8e7f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a"
    },
    {
        type: "TRANSFER",
        from: "0x5a34F8C90B8A6F28F17080B7Ed96B877D79D1702",
        to: "0x7a16Ff8270133F063aAb6C9977183D9e72835539", 
        amount: "150",
        price: "115,000",
        timestamp: "2023-03-25T14:22:00Z",
        txHash: "0x5b7c3d9f0e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c"
    },
    {
        type: "LIST",
        from: "0x7a16Ff8270133F063aAb6C9977183D9e72835539",
        to: null,
        amount: "100",
        price: "125,000",
        timestamp: "2023-04-30T09:15:00Z",
        txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
    }
]

export default function AssetDetailPage({ params }: { params: { assetId: string } }) {
    const { toast } = useToast()
    
    // Simulate loading price chart data
    useEffect(() => {
        // This would be replaced with actual chart data implementation
        // No need to store the data since we're not using it yet
    }, [])

    // Helper function to format addresses
    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    // Helper function to render transaction type
    const renderTransactionType = (type: string) => {
        switch(type) {
            case "MINT":
                return (
                    <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-1 text-purple-500" />
                        <span>Mint</span>
                    </div>
                )
            case "TRANSFER":
                return (
                    <div className="flex items-center">
                        <ArrowUpRight className="h-4 w-4 mr-1 text-blue-500" />
                        <span>Transfer</span>
                    </div>
                )
            case "LIST":
                return (
                    <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-1 text-teal-accent" />
                        <span>List</span>
                    </div>
                )
            case "BUY":
                return (
                    <div className="flex items-center">
                        <ArrowDownLeft className="h-4 w-4 mr-1 text-green-500" />
                        <span>Buy</span>
                    </div>
                )
            default:
                return type
        }
    }

    return (
        <div className="container mx-auto px-4 py-6 sm:py-8">
            <Link href="/asset">
                <Button variant="ghost" size="sm" className="mb-4 sm:mb-6 flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Assets
                </Button>
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                {/* Asset Image */}
                <div className="lg:col-span-1">
                    <div className="bg-card dark:bg-card border border-border rounded-lg overflow-hidden">
                        <div className="relative aspect-square w-full rounded-md overflow-hidden mb-4">
                                <Image
                                src={ASSET.imageUrl} 
                                alt={ASSET.name} 
                                    fill
                                    className="object-cover"
                                />
                            <div className="absolute top-2 right-2 z-10">
                                <Badge variant="navy">
                                    {ASSET.assetType}
                                </Badge>
                            </div>
                            {ASSET.isListed && (
                                <div className="absolute top-2 left-2 z-10">
                                    <Badge variant="outline" className="bg-teal-accent/20 text-teal-accent border-teal-accent/30">
                                        <Tag className="h-3 w-3 mr-1" />
                                        For Sale
                                    </Badge>
                                </div>
                            )}
                        </div>
                        <div className="p-3 sm:p-4">
                        <div className="flex justify-between items-center">
                                <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs sm:text-sm">
                                    <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="hidden xs:inline">Favorite</span>
                            </Button>
                                <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs sm:text-sm">
                                    <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="hidden xs:inline">Share</span>
                            </Button>
                            </div>
                            
                            {/* Token URI and smart contract details */}
                            <div className="mt-4 pt-4 border-t border-border">
                                <h3 className="text-xs sm:text-sm font-medium mb-2">Token Details</h3>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Token ID:</span>
                                        <span className="font-medium">{ASSET.tokenId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Contract:</span>
                                        <a href="#" className="text-primary hover:underline">View</a>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Token URI:</span>
                                        <a 
                                            href={ASSET.tokenURI} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline truncate max-w-[100px] sm:max-w-[150px]"
                                        >
                                            {ASSET.tokenURI}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Asset Details */}
                <div className="lg:col-span-2">
                    <div className="bg-card dark:bg-card border border-border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{ASSET.name}</h1>
                                <div className="flex items-center mt-2">
                                    {ASSET.isVerified ? (
                                        <Badge variant="outline" className="bg-green-50 dark:bg-transparent text-green-600 border-green-200">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Verified
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="bg-yellow-50 dark:bg-transparent text-yellow-600 border-yellow-200">
                                            <Clock className="h-3 w-3 mr-1" />
                                            Pending Verification
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="bg-muted p-2 rounded-md mt-2 sm:mt-0">
                                <div className="flex items-center">
                                <div className={`h-2 w-2 rounded-full mr-2 ${
                                    ASSET.confidenceScore >= 90 ? 'bg-success-green' : 
                                    ASSET.confidenceScore >= 70 ? 'bg-yellow-400' : 'bg-alert-red'
                                }`}></div>
                                    <span className="text-xs font-medium text-foreground">
                                    {ASSET.confidenceScore}% confidence
                                </span>
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{ASSET.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                            <div className="bg-muted p-2 sm:p-3 rounded-md">
                                <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Current Price</p>
                                <p className="text-base sm:text-xl font-bold text-foreground">${ASSET.currentPrice}</p>
                                <p className={`text-xs font-medium ${ASSET.priceChange.startsWith('+') ? 'text-success-green' : 'text-alert-red'}`}>
                                    {ASSET.priceChange} (24h)
                                </p>
                            </div>
                            <div className="bg-muted p-2 sm:p-3 rounded-md">
                                <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Initial Price</p>
                                <p className="text-base sm:text-xl font-bold text-foreground">${ASSET.initialPrice}</p>
                                <p className="text-xs text-muted-foreground">Mint price</p>
                            </div>
                            <div className="bg-muted p-2 sm:p-3 rounded-md">
                                <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Available</p>
                                <p className="text-base sm:text-xl font-bold text-foreground">{ASSET.availableSupply}</p>
                                <p className="text-xs text-muted-foreground">of {ASSET.totalSupply} tokens</p>
                            </div>
                            <div className="bg-muted p-2 sm:p-3 rounded-md">
                                <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">Value/Token</p>
                                <p className="text-base sm:text-xl font-bold text-foreground">$120</p>
                                <p className="text-xs text-muted-foreground">USD</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
                            {ASSET.isListed ? (
                                <>
                            <Button 
                                        className="bg-teal-accent hover:bg-teal-accent/90 flex-1 text-sm sm:text-base"
                                onClick={() => {
                                    toast({
                                        title: "Purchase initiated",
                                        description: "Connect your wallet to complete this transaction.",
                                    })
                                }}
                            >
                                        Buy Now for ${ASSET.listingPrice}
                            </Button>
                            <Button 
                                variant="outline" 
                                        className="flex-1 text-sm sm:text-base"
                                onClick={() => {
                                    toast({
                                        title: "Bidding not available",
                                        description: "This feature will be available soon.",
                                    })
                                }}
                            >
                                Place Bid
                            </Button>
                                </>
                            ) : (
                                <Button 
                                    className="bg-teal-accent hover:bg-teal-accent/90 flex-1 text-sm sm:text-base"
                                    onClick={() => {
                                        toast({
                                            title: "Not available for purchase",
                                            description: "This asset is not currently listed for sale.",
                                        })
                                    }}
                                >
                                    Not For Sale
                                </Button>
                            )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                Tokenized: {new Date(ASSET.acquisitionDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                {ASSET.assetLocation}
                            </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Owner:</span>
                                    <span className="font-medium">{formatAddress(ASSET.owner)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Minted by:</span>
                                    <span className="font-medium">{formatAddress(ASSET.mintedBy)}</span>
                                    </div>
                                <div className="sm:col-span-2 mt-3 sm:mt-4">
                                    <Link href={`/verify/${params.assetId}`}>
                                        <Button variant="outline" size="sm" className="w-full flex items-center justify-center text-xs sm:text-sm">
                                            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                                            Verify Ownership
                                        </Button>
                                    </Link>
                                </div>
                                </div>
                                        </div>
                                            </div>
                                        </div>
                                    </div>

            {/* Tabs Section */}
            <Tabs defaultValue="details" className="mb-8 sm:mb-12">
                <TabsList className="mb-4 sm:mb-6 w-full overflow-x-auto flex-nowrap">
                    <TabsTrigger value="details" className="text-xs sm:text-sm whitespace-nowrap">Details</TabsTrigger>
                    <TabsTrigger value="price-history" className="text-xs sm:text-sm whitespace-nowrap">Price History</TabsTrigger>
                    <TabsTrigger value="attributes" className="text-xs sm:text-sm whitespace-nowrap">Attributes</TabsTrigger>
                    <TabsTrigger value="transactions" className="text-xs sm:text-sm whitespace-nowrap">Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="bg-card dark:bg-card border border-border rounded-lg p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">About this Asset</h2>
                    <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-line mb-4 sm:mb-6">{ASSET.longDescription}</p>
                </TabsContent>
                <TabsContent value="price-history" className="bg-card dark:bg-card border border-border rounded-lg p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">Price History</h2>
                    <div className="mb-4 sm:mb-6">
                        <div className="h-60 sm:h-80 flex items-center justify-center bg-muted rounded-lg">
                            <p className="text-muted-foreground text-sm">Price history chart would be displayed here</p>
                        </div>
                    </div>
                    
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center">
                        <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-primary" />
                        Price Updates
                    </h3>
                    
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="min-w-[640px] px-4 sm:px-0 sm:min-w-0">
                            <table className="w-full text-xs sm:text-sm">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-muted-foreground">Date</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-muted-foreground">Previous</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-muted-foreground">New Price</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-muted-foreground">Change</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-muted-foreground">Data Source</th>
                                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left font-medium text-muted-foreground">Confidence</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {PRICE_HISTORY.map((update, index) => {
                                        const oldPrice = parseFloat(update.oldPrice.replace(/,/g, ''));
                                        const newPrice = parseFloat(update.newPrice.replace(/,/g, ''));
                                        const percentChange = ((newPrice - oldPrice) / oldPrice * 100).toFixed(1);
                                        const isPositive = newPrice > oldPrice;
                                        
                                        return (
                                            <tr key={index} className="hover:bg-muted/20">
                                                <td className="px-2 sm:px-4 py-2 sm:py-3">{update.timestamp}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3">${update.oldPrice}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 font-medium">${update.newPrice}</td>
                                                <td className={`px-2 sm:px-4 py-2 sm:py-3 ${isPositive ? 'text-success-green' : 'text-alert-red'}`}>
                                                    {isPositive ? '+' : ''}{percentChange}%
                                                </td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-muted-foreground">{update.dataSource}</td>
                                                <td className="px-2 sm:px-4 py-2 sm:py-3">
                                                    <div className="flex items-center">
                                                        <div className="h-1.5 w-10 sm:w-16 bg-muted rounded-full overflow-hidden mr-2">
                                                            <div 
                                                                className="h-full bg-primary rounded-full" 
                                                                style={{ width: `${update.confidenceScore}%` }}
                                                            ></div>
                                                        </div>
                                                        <span>{update.confidenceScore}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="attributes" className="bg-card dark:bg-card border border-border rounded-lg p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">Asset Attributes</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        {ASSET.attributes.map((attr, index) => (
                            <div key={index} className="bg-muted p-3 sm:p-4 rounded-lg">
                                <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">{attr.trait_type}</p>
                                <p className="text-sm sm:text-base font-semibold text-foreground">{attr.value}</p>
                            </div>
                        ))}
                                        </div>
                </TabsContent>
                <TabsContent value="transactions" className="bg-card dark:bg-card border border-border rounded-lg p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">Transaction History</h2>
                    <div className="space-y-3 sm:space-y-4">
                        {TRANSACTIONS.map((tx, index) => (
                            <div key={index} className="flex items-center p-3 sm:p-4 border border-border rounded-lg">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                                    {renderTransactionType(tx.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <p className="font-semibold text-foreground text-sm sm:text-base truncate">
                                            {tx.type === "MINT" 
                                                ? `Minted ${tx.amount} tokens` 
                                                : tx.type === "TRANSFER" 
                                                ? `Transferred ${tx.amount} tokens to ${formatAddress(tx.to!)}` 
                                                : `Listed ${tx.amount} tokens for sale`
                                            }
                                        </p>
                                        <p className="font-bold text-foreground text-sm sm:text-base">${tx.price}</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm mt-1 sm:mt-0">
                                        <div className="flex items-center text-muted-foreground">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {new Date(tx.timestamp).toLocaleDateString()} {new Date(tx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                        <a 
                                            href={`https://etherscan.io/tx/${tx.txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline text-xs mt-1 sm:mt-0"
                                        >
                                            View transaction
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
            
            {/* Related Assets */}
            <div className="bg-card dark:bg-card border border-border rounded-lg p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6">Related Assets</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-muted rounded-lg overflow-hidden">
                            <div className="relative h-32 sm:h-40 w-full">
                                <Image 
                                    src="/images/asset-art.jpg" 
                                    alt={`Related Asset ${i}`} 
                                    fill 
                                    className="object-cover"
                                                    />
                                                </div>
                            <div className="p-3 sm:p-4">
                                <h3 className="font-semibold text-foreground text-sm sm:text-base">Related Asset {i}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Short description of the related asset</p>
                                <p className="font-bold text-foreground text-sm sm:text-base">$85,000</p>
                                                </div>
                                            </div>
                    ))}
                </div>
            </div>
        </div>
    )
}