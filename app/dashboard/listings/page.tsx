'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle, ChevronRight, Clock, Loader2, PlusCircle, Tag, Trash, Edit2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// Mock data for active listings
const ACTIVE_LISTINGS = [
  {
    id: "listing1",
    assetId: "1",
    tokenId: 1,
    name: "Blue Chip Art Collection",
    description: "Premium art pieces from renowned contemporary artists",
    imageUrl: "/images/asset-art.jpg",
    listingPrice: "125,000",
    currentValuation: "120,000",
    priceChange: "+3.2%",
    listingDate: "2023-04-22",
    expiresAt: "2023-07-22",
    assetType: "ART",
    isVerified: true,
    views: 126,
    offers: 2,
    listedAmount: 500,
    tokenSupply: 1000
  },
  {
    id: "listing4",
    assetId: "6",
    tokenId: 6,
    name: "Sports Memorabilia Collection",
    description: "Authenticated sports collectibles with historical significance",
    imageUrl: "/images/asset-collectible.jpg",
    listingPrice: "228,000",
    currentValuation: "225,000",
    priceChange: "+1.3%",
    listingDate: "2023-04-24",
    expiresAt: "2023-07-24",
    assetType: "COLLECTIBLE",
    isVerified: false,
    views: 57,
    offers: 0,
    listedAmount: 250,
    tokenSupply: 750
  }
];

// Mock data for offers received
const OFFERS_RECEIVED = [
  {
    id: "offer1",
    listingId: "listing1",
    assetName: "Blue Chip Art Collection",
    assetImageUrl: "/images/asset-art.jpg",
    offerAmount: "118,500",
    offerDate: "2023-05-02",
    expiresAt: "2023-05-09",
    buyer: "0x4b56E84772a5719a565c76E0226897f33e59f139",
    buyerName: "Art Collector DAO",
    status: "pending",
    quantity: 100
  },
  {
    id: "offer2",
    listingId: "listing1",
    assetName: "Blue Chip Art Collection",
    assetImageUrl: "/images/asset-art.jpg",
    offerAmount: "115,000",
    offerDate: "2023-05-01",
    expiresAt: "2023-05-08",
    buyer: "0x8912DcFB23c5A1A04E58695F5AaFd2ff3d94f9B0",
    buyerName: "Anon Buyer",
    status: "pending",
    quantity: 250
  }
];

// Mock data for sales history
const SALES_HISTORY = [
  {
    id: "sale1",
    assetName: "Digital Real Estate Portfolio",
    assetImageUrl: "/images/asset-realestate.jpg",
    salePrice: "1,250,000",
    saleDate: "2023-03-15",
    buyer: "0x4b56E84772a5719a565c76E0226897f33e59f139",
    buyerName: "Real Estate DAO",
    assetType: "REAL_ESTATE",
    quantity: 25,
    tokenId: 2
  },
  {
    id: "sale2",
    assetName: "Rare Wine Collection",
    assetImageUrl: "/images/asset-collectible.jpg",
    salePrice: "78,500",
    saleDate: "2023-02-28",
    buyer: "0x8912DcFB23c5A1A04E58695F5AaFd2ff3d94f9B0",
    buyerName: "Luxury Investments",
    assetType: "COLLECTIBLE",
    quantity: 150,
    tokenId: 3
  }
];

export default function ManageListingsPage() {
  const { address } = useAuth()
  const isConnected = !!address
  const { toast } = useToast()
  
  // State
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isAcceptingOffer, setIsAcceptingOffer] = useState<string | null>(null)
  const [isDecliningOffer, setIsDecliningOffer] = useState<string | null>(null)
  
  // Format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Handle listing cancellation
  const handleCancelListing = (listingId: string) => {
    setIsDeleting(listingId);
    
    setTimeout(() => {
      setIsDeleting(null);
      
      toast({
        title: "Listing cancelled",
        description: "Your listing has been successfully cancelled",
      });
      
      // In a real implementation, this would update the UI to remove the listing
    }, 1500);
  };
  
  // Handle accepting an offer
  const handleAcceptOffer = (offerId: string) => {
    setIsAcceptingOffer(offerId);
    
    setTimeout(() => {
      setIsAcceptingOffer(null);
      
      toast({
        title: "Offer accepted",
        description: "The transaction will be processed on the blockchain",
      });
      
      // In a real implementation, this would update the UI to remove the offer
    }, 1500);
  };
  
  // Handle declining an offer
  const handleDeclineOffer = (offerId: string) => {
    setIsDecliningOffer(offerId);
    
    setTimeout(() => {
      setIsDecliningOffer(null);
      
      toast({
        title: "Offer declined",
        description: "The offer has been declined",
      });
      
      // In a real implementation, this would update the UI to remove the offer
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Marketplace Listings</h1>
          <p className="text-muted-foreground">
            Manage your active listings, offers, and sales on the marketplace
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/marketplace/create">
            <Button className="bg-teal-accent hover:bg-teal-accent/90 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Listing
            </Button>
          </Link>
        </div>
      </div>
      
      {!isConnected && (
        <div className="mb-8 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Please connect your wallet to view and manage your marketplace listings
          </p>
        </div>
      )}
      
      <Tabs defaultValue="active" className="space-y-8">
        <TabsList>
          <TabsTrigger value="active">
            Active Listings
            {ACTIVE_LISTINGS.length > 0 && (
              <Badge variant="secondary" className="ml-2">{ACTIVE_LISTINGS.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="offers">
            Offers Received
            {OFFERS_RECEIVED.length > 0 && (
              <Badge variant="secondary" className="ml-2">{OFFERS_RECEIVED.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">Sales History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-6">
          {ACTIVE_LISTINGS.length > 0 ? (
            ACTIVE_LISTINGS.map(listing => (
              <Card key={listing.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-48 md:h-auto md:w-48 bg-muted flex-shrink-0">
                    <Image
                      src={listing.imageUrl}
                      alt={listing.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-xl font-bold">{listing.name}</h3>
                          {listing.isVerified && (
                            <Badge variant="outline" className="ml-2 bg-green-50 dark:bg-transparent text-green-600 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <span>ID: {listing.tokenId}</span>
                          <span className="mx-2">•</span>
                          <Badge variant="outline" className="text-xs">{listing.assetType}</Badge>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-2xl font-bold">${listing.listingPrice}</p>
                        <Badge variant="outline" className={`mt-1 ${parseFloat(listing.priceChange) >= 0 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                          {listing.priceChange} from valuation
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-6">
                      {listing.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Listed On</p>
                        <p className="font-medium">{listing.listingDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expires On</p>
                        <p className="font-medium">{listing.expiresAt}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Listed Amount</p>
                        <p className="font-medium">{listing.listedAmount} of {listing.tokenSupply}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Views / Offers</p>
                        <p className="font-medium">{listing.views} / {listing.offers}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/marketplace/${listing.id}`}>
                          <Button variant="outline">View Listing</Button>
                        </Link>
                        <Link href={`/marketplace/edit/${listing.id}`}>
                          <Button variant="outline">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" className="gap-2">
                            <Trash className="h-4 w-4" />
                            Cancel Listing
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cancel Marketplace Listing</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to cancel this listing? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="flex items-center space-x-4 py-4">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={listing.imageUrl}
                                alt={listing.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">{listing.name}</h4>
                              <p className="text-sm text-muted-foreground">Listed price: ${listing.listingPrice}</p>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" className="w-full sm:w-auto">
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              className="w-full sm:w-auto"
                              onClick={() => handleCancelListing(listing.id)}
                              disabled={isDeleting === listing.id}
                            >
                              {isDeleting === listing.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                'Confirm Cancellation'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Active Listings</h3>
                  <p className="text-muted-foreground mb-6">
                    You don&apos;t have any active listings on the marketplace
                  </p>
                  <Link href="/marketplace/create">
                    <Button>Create a Listing</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="offers" className="space-y-6">
          {OFFERS_RECEIVED.length > 0 ? (
            OFFERS_RECEIVED.map(offer => (
              <Card key={offer.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="relative h-32 md:h-auto md:w-32 bg-muted flex-shrink-0">
                    <Image
                      src={offer.assetImageUrl}
                      alt={offer.assetName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{offer.assetName}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <p className="text-muted-foreground">
                            From: {offer.buyerName} ({formatAddress(offer.buyer)})
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <p className="text-sm text-muted-foreground">Offer Amount</p>
                        <p className="text-2xl font-bold">${offer.offerAmount}</p>
                        <p className="text-sm text-muted-foreground">For {offer.quantity} tokens</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Offer Date</p>
                        <p className="font-medium">{offer.offerDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expires On</p>
                        <p className="font-medium">{offer.expiresAt}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <Badge variant={offer.status === "pending" ? "outline" : offer.status === "accepted" ? "default" : "secondary"}>
                          {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="default"
                        onClick={() => handleAcceptOffer(offer.id)}
                        disabled={isAcceptingOffer === offer.id}
                      >
                        {isAcceptingOffer === offer.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Accept Offer'
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => handleDeclineOffer(offer.id)}
                        disabled={isDecliningOffer === offer.id}
                      >
                        {isDecliningOffer === offer.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Decline Offer'
                        )}
                      </Button>
                      
                      <Link href={`/marketplace/${offer.listingId}`}>
                        <Button variant="ghost">View Listing</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Offers Received</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven&apos;t received any offers on your listings yet
                  </p>
                  <Link href="/marketplace">
                    <Button variant="outline">View Marketplace</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          {SALES_HISTORY.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Asset</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Sold For</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Buyer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {SALES_HISTORY.map(sale => (
                      <tr key={sale.id} className="hover:bg-muted/20">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="relative h-10 w-10 rounded overflow-hidden mr-3">
                              <Image
                                src={sale.assetImageUrl}
                                alt={sale.assetName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{sale.assetName}</p>
                              <p className="text-xs text-muted-foreground">ID: {sale.tokenId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <Badge variant="outline">{sale.assetType}</Badge>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium">${sale.salePrice}</td>
                        <td className="px-4 py-4 text-sm">{sale.quantity} tokens</td>
                        <td className="px-4 py-4 text-sm">
                          <p>{sale.buyerName}</p>
                          <p className="text-xs text-muted-foreground">{formatAddress(sale.buyer)}</p>
                        </td>
                        <td className="px-4 py-4 text-sm">{sale.saleDate}</td>
                        <td className="px-4 py-4 text-sm">
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Sales History</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven&apos;t completed any sales on the marketplace yet
                  </p>
                  <Link href="/marketplace">
                    <Button variant="outline">View Marketplace</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Marketplace Tips Section */}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle className="text-lg">Marketplace Seller Tips</CardTitle>
          <CardDescription>
            Maximize your success when selling assets on the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Pricing Strategy</h3>
              <p className="text-sm text-muted-foreground">
                Consider the DynamicPricingAgent valuation when setting your price. Listings priced close to the valuation tend to sell faster.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Quality Documentation</h3>
              <p className="text-sm text-muted-foreground">
                Provide comprehensive documentation for your assets. Well-documented assets with verification attract more serious buyers.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Consider Offers</h3>
              <p className="text-sm text-muted-foreground">
                Enabling the &quot;Accept Offers&quot; option can increase interest in your listing and create competitive bidding situations.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/docs/marketplace-seller-guide">
            <Button variant="outline">Read Seller Guide</Button>
          </Link>
          <Link href="/marketplace/create">
            <Button>Create New Listing</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
} 