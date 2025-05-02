'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Tag, 
  CheckCircle, 
  TrendingUp,
  CircleDollarSign,
  Calendar,
  Info,
  User,
  LineChart,
  FileText,
  ShieldCheck,
  Share2,
  Bell,
  Loader2
} from 'lucide-react'

// Mock marketplace listing data
const MARKETPLACE_LISTINGS = [
  {
    id: "listing1",
    assetId: "1",
    tokenId: 1,
    name: "Blue Chip Art Collection",
    description: "Premium art pieces from renowned contemporary artists including limited edition prints and original paintings from established and emerging talents.",
    longDescription: "This carefully curated Blue Chip Art Collection represents an exceptional opportunity to own fractionalized shares of museum-quality artwork. Each piece in this collection has been authenticated by art experts and carries provenance documentation stored on-chain, ensuring transparency and legitimacy.\n\nThe collection includes works from prominent artists whose market values have demonstrated consistent growth over the past decade. All pieces are professionally stored in climate-controlled facilities, regularly maintained, and fully insured.\n\nThis tokenized art collection allows investors to gain exposure to high-value art assets without the traditional barriers to entry and management costs associated with fine art investment.",
    imageUrl: "/images/asset-art.jpg",
    listingPrice: "125,000",
    currentValuation: "120,000",
    priceChange: "+3.2%",
    priceHistory: [
      { date: "2023-01-22", price: "100,000" },
      { date: "2023-02-22", price: "105,000" },
      { date: "2023-03-22", price: "112,000" },
      { date: "2023-04-22", price: "120,000" }
    ],
    seller: "0x7a23608a8eBe71868013BDA0d900351A83bb4Dc2",
    sellerName: "ArtVault Holdings",
    listingDate: "2023-04-22",
    expiresAt: "2023-07-22",
    confidenceScore: 98,
    assetType: "ART",
    isVerified: true,
    allowsOffers: true,
    tokenSupply: 1000,
    listedAmount: 500,
    minPurchaseAmount: 1,
    lastUpdated: "2 days ago",
    location: "New York, USA",
    documentUrls: [
      { name: "Authentication Certificate", url: "#" },
      { name: "Valuation Report", url: "#" },
      { name: "Insurance Documentation", url: "#" }
    ],
    transactionHistory: [
      { date: "2023-03-15", type: "Sale", amount: 100, price: "110,000", buyer: "0x4b56E...f139" },
      { date: "2023-02-10", type: "Sale", amount: 250, price: "105,000", buyer: "0x8912D...f9B0" },
      { date: "2023-01-05", type: "Mint", amount: 1000, price: "100,000", buyer: "0x7a23...4Dc2" }
    ]
  }
];

export default function ListingDetailPage({ params }: { params: { listingId: string } }) {
  const { listingId } = params
  const { address } = useAuth()
  const isConnected = !!address
  const { toast } = useToast()
  
  // State
  const [purchaseQuantity, setPurchaseQuantity] = useState('1')
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false)
  const [offerPrice, setOfferPrice] = useState('')
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)

  // Find the listing
  const listing = MARKETPLACE_LISTINGS.find(item => item.id === listingId) || MARKETPLACE_LISTINGS[0]
  
  // Format currency string to number and vice versa
  const formatCurrencyToNumber = (value: string) => {
    return parseFloat(value.replace(/,/g, ''))
  }
  
  const formatNumberToCurrency = (value: number) => {
    return value.toLocaleString()
  }
  
  // Calculate total cost
  const calculateTotalCost = () => {
    const price = formatCurrencyToNumber(listing.listingPrice)
    const quantity = parseInt(purchaseQuantity) || 0
    return formatNumberToCurrency(price * quantity)
  }
  
  // Calculate marketplace fee (2.5%)
  const calculateMarketplaceFee = () => {
    const totalCost = formatCurrencyToNumber(calculateTotalCost())
    return formatNumberToCurrency(totalCost * 0.025)
  }

  // Handle purchase
  const handlePurchase = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a purchase",
        variant: "destructive"
      });
      return;
    }

    if (parseInt(purchaseQuantity) <= 0 || parseInt(purchaseQuantity) > listing.listedAmount) {
      toast({
        title: "Invalid quantity",
        description: `Please enter a quantity between 1 and ${listing.listedAmount}`,
        variant: "destructive"
      });
      return;
    }

    // Simulate purchase
    setIsProcessingPurchase(true);
    
    setTimeout(() => {
      setIsProcessingPurchase(false);
      
      toast({
        title: "Purchase successful!",
        description: `You have successfully purchased ${purchaseQuantity} tokens of ${listing.name}`,
      });
      
      // In a real implementation, this would redirect to a transaction success page
    }, 2000);
  }

  // Handle offer submission
  const handleSubmitOffer = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make an offer",
        variant: "destructive"
      });
      return;
    }

    if (!offerPrice) {
      toast({
        title: "Price required",
        description: "Please enter an offer price",
        variant: "destructive"
      });
      return;
    }

    // Simulate offer submission
    setIsSubmittingOffer(true);
    
    setTimeout(() => {
      setIsSubmittingOffer(false);
      
      toast({
        title: "Offer submitted",
        description: `Your offer has been sent to the seller`,
      });
      
      setOfferPrice('');
    }, 1500);
  }

  // Format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Listing Not Found</h1>
        <p className="text-muted-foreground mb-6">The listing you are looking for does not exist or has been removed.</p>
        <Link href="/marketplace">
          <Button>Return to Marketplace</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/marketplace">
        <Button variant="ghost" size="sm" className="mb-6 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Button>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Asset Image and Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="relative h-[300px] md:h-[400px] w-full">
              <Image 
                src={listing.imageUrl}
                alt={listing.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-black/70 text-white border-none">
                  {listing.assetType}
                </Badge>
              </div>
              {listing.isVerified && (
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-green-50/80 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-foreground">{listing.name}</h1>
                <span className="text-sm text-muted-foreground">ID: {listing.tokenId}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Seller: {listing.sellerName} ({formatAddress(listing.seller)})
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Listed on {listing.listingDate}
                </span>
              </div>
              
              <Tabs defaultValue="description" className="mt-6">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="details">Asset Details</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">Transaction History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4 space-y-4">
                  <p className="text-foreground whitespace-pre-line">
                    {listing.longDescription}
                  </p>
                </TabsContent>
                
                <TabsContent value="details" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Asset Type</span>
                        <span>{listing.assetType}</span>
                      </div>
                      <Separator />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Supply</span>
                        <span>{listing.tokenSupply} tokens</span>
                      </div>
                      <Separator />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available for Purchase</span>
                        <span>{listing.listedAmount} tokens</span>
                      </div>
                      <Separator />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Minimum Purchase</span>
                        <span>{listing.minPurchaseAmount} token</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Location</span>
                        <span>{listing.location}</span>
                      </div>
                      <Separator />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Valuation Update</span>
                        <span>{listing.lastUpdated}</span>
                      </div>
                      <Separator />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Valuation Confidence</span>
                        <div className="flex items-center">
                          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden mr-2">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${listing.confidenceScore}%` }}
                            ></div>
                          </div>
                          <span>{listing.confidenceScore}%</span>
                        </div>
                      </div>
                      <Separator />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Listing Expires</span>
                        <span>{listing.expiresAt}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      All documentation related to this asset is securely stored and verified through our blockchain infrastructure.
                    </p>
                    
                    <div className="space-y-2">
                      {listing.documentUrls.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-muted/20">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-primary mr-2" />
                            <span>{doc.name}</span>
                          </div>
                          <Link href={doc.url}>
                            <Button variant="outline" size="sm">View</Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm flex">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="text-blue-600 dark:text-blue-400">
                        <p>All documents are cryptographically signed and verified. The authenticity of these documents can be independently verified on-chain.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete on-chain transaction history for this asset.
                    </p>
                    
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Date</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Type</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Amount</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Price</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-muted-foreground">Buyer/Seller</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {listing.transactionHistory.map((tx, index) => (
                            <tr key={index} className="hover:bg-muted/20">
                              <td className="px-4 py-3 text-sm">{tx.date}</td>
                              <td className="px-4 py-3 text-sm">
                                <Badge variant={tx.type === "Mint" ? "outline" : "secondary"}>
                                  {tx.type}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">{tx.amount} tokens</td>
                              <td className="px-4 py-3 text-sm font-medium">${tx.price}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{tx.buyer}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Price History Chart Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-primary" />
                Price History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                {/* Chart would go here in a real implementation */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-4">
                    {listing.priceHistory.map((point, i) => (
                      <div key={i} className="text-center">
                        <p className="text-sm font-medium">${point.price}</p>
                        <p className="text-xs text-muted-foreground">{point.date}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Price history data visualization would appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column: Purchase UI and details */}
        <div className="space-y-6">
          {/* Buy Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Purchase This Asset</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <p className="text-2xl font-bold text-foreground flex items-center">
                    <CircleDollarSign className="h-5 w-5 mr-1 text-green-500" />
                    ${listing.listingPrice}
                  </p>
                </div>
                <Badge variant="outline" className={`${parseFloat(listing.priceChange) >= 0 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {listing.priceChange} from valuation
                </Badge>
              </div>
              
              <div className="p-4 border border-border rounded-lg bg-muted/30 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available</span>
                  <span className="font-medium">{listing.listedAmount} of {listing.tokenSupply} tokens</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(listing.listedAmount / listing.tokenSupply) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity to Purchase</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  min="1"
                  max={listing.listedAmount}
                  placeholder="Enter quantity" 
                  value={purchaseQuantity}
                  onChange={(e) => setPurchaseQuantity(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum purchase: {listing.minPurchaseAmount} token
                </p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per token</span>
                  <span>${listing.listingPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span>{purchaseQuantity || 0} tokens</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Marketplace fee (2.5%)</span>
                  <span>${calculateMarketplaceFee()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${calculateTotalCost()}</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                disabled={!isConnected || isProcessingPurchase || parseInt(purchaseQuantity) <= 0 || parseInt(purchaseQuantity) > listing.listedAmount}
                onClick={handlePurchase}
              >
                {isProcessingPurchase ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Buy Now'
                )}
              </Button>
              
              {!isConnected && (
                <div className="text-center text-sm text-muted-foreground">
                  Please connect your wallet to purchase this asset
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Make Offer Card */}
          {listing.allowsOffers && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Make an Offer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The seller is accepting offers for this asset. Submit your price below.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="offerPrice">Your Offer (USD)</Label>
                  <div className="relative">
                    <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="offerPrice" 
                      className="pl-10" 
                      placeholder="e.g. 100000" 
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={!isConnected || isSubmittingOffer || !offerPrice}
                  onClick={handleSubmitOffer}
                >
                  {isSubmittingOffer ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Offer'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Asset Security Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <ShieldCheck className="h-5 w-5 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium">Secure Transaction</h3>
                    <p className="text-xs text-muted-foreground">
                      All marketplace transactions are secured by escrow via the MarketplaceContract.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Tag className="h-5 w-5 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium">Verified Pricing</h3>
                    <p className="text-xs text-muted-foreground">
                      Asset pricing is derived from the DynamicPricingAgent with {listing.confidenceScore}% confidence.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="text-sm font-medium">On-Chain Documentation</h3>
                    <p className="text-xs text-muted-foreground">
                      All asset documentation is cryptographically verified and stored securely.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t border-border pt-4">
              <Button variant="ghost" size="sm" className="text-xs">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Bell className="h-4 w-4 mr-1" />
                Price Alert
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}