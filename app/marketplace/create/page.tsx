'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Tag,
  CircleDollarSign,
  CheckCircle,
  AlertCircle,
  InfoIcon,
  Search,
  Loader2,
} from 'lucide-react'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'

// Mock owned assets
const OWNED_ASSETS = [
  {
    id: "1",
    tokenId: 1,
    name: "Blue Chip Art Collection",
    description: "Premium art pieces from renowned contemporary artists",
    imageUrl: "/images/asset-art.jpg",
    currentPrice: "120,000",
    confidenceScore: 98,
    lastUpdate: "2023-04-28",
    assetType: "ART",
    supply: 1000,
    ownedSupply: 850,
    isVerified: true
  },
  {
    id: "3",
    tokenId: 3,
    name: "Rare Wine Collection",
    description: "Vintage and limited edition wines with provenance",
    imageUrl: "/images/asset-collectible.jpg",
    currentPrice: "75,000",
    confidenceScore: 92,
    lastUpdate: "2023-04-27",
    assetType: "COLLECTIBLE",
    supply: 500,
    ownedSupply: 500,
    isVerified: true
  },
  {
    id: "6",
    tokenId: 6,
    name: "Sports Memorabilia Collection",
    description: "Authenticated sports collectibles with historical significance",
    imageUrl: "/images/asset-collectible.jpg",
    currentPrice: "225,000",
    confidenceScore: 91,
    lastUpdate: "2023-04-24",
    assetType: "COLLECTIBLE",
    supply: 750,
    ownedSupply: 600,
    isVerified: false
  }
];

export default function MarketplaceCreatePage() {
  const { address } = useAuth()
  const isConnected = !!address
  const { toast } = useToast()
  
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [listingPrice, setListingPrice] = useState('')
  const [listingQuantity, setListingQuantity] = useState('1')
  const [allowOffers, setAllowOffers] = useState(true)
  const [expirationDays, setExpirationDays] = useState('30')
  const [isCreatingListing, setIsCreatingListing] = useState(false)

  // Get the selected asset details
  const assetDetails = OWNED_ASSETS.find(asset => asset.id === selectedAsset)
  
  // Filter assets based on search query
  const filteredAssets = searchQuery
    ? OWNED_ASSETS.filter(asset => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : OWNED_ASSETS;

  // Calculate marketplace fee (2.5%)
  const calculateMarketplaceFee = () => {
    if (!listingPrice) return '0';
    const price = parseFloat(listingPrice.replace(/,/g, ''));
    return isNaN(price) ? '0' : (price * 0.025).toLocaleString();
  }

  // Format currency input
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return parseInt(numericValue).toLocaleString();
  }

  // Handle price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setListingPrice(formatCurrency(value));
  }

  // Handle listing creation
  const handleCreateListing = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a listing",
        variant: "destructive"
      });
      return;
    }

    if (!selectedAsset) {
      toast({
        title: "No asset selected",
        description: "Please select an asset to list",
        variant: "destructive"
      });
      return;
    }

    if (!listingPrice) {
      toast({
        title: "Price required",
        description: "Please enter a listing price",
        variant: "destructive"
      });
      return;
    }

    // Simulate listing creation
    setIsCreatingListing(true);
    
    setTimeout(() => {
      setIsCreatingListing(false);
      
      toast({
        title: "Asset listed successfully",
        description: "Your asset has been listed on the marketplace",
      });
      
      // In a real implementation, this would redirect to the marketplace
    }, 2000);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="mb-6 flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Tag className="mr-2 h-6 w-6 text-primary" />
            Create Marketplace Listing
          </h1>
          <p className="text-muted-foreground">
            List your tokenized assets for sale on the marketplace using the MarketplaceContract
          </p>
          
          {!isConnected && (
            <div className="mt-4 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Please connect your wallet to create marketplace listings. You&apos;ll need to sign the transaction to approve the marketplace contract.
              </p>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="select" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="select">Select Asset</TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedAsset}>Listing Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="select" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select an Asset to List</CardTitle>
                <CardDescription>
                  Choose one of your tokenized assets to list on the marketplace
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your assets..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Asset grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map(asset => (
                      <div 
                        key={asset.id} 
                        className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                          selectedAsset === asset.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedAsset(asset.id)}
                      >
                        <div className="flex h-24 md:h-32">
                          <div className="relative w-24 md:w-32 bg-muted flex-shrink-0">
                            <ImageWithFallback
                              src={asset.imageUrl}
                              alt={asset.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-sm md:text-base truncate">{asset.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {asset.assetType}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{asset.description}</p>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">${asset.currentPrice}</p>
                                <p className="text-xs text-muted-foreground">Last valuation</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">{asset.ownedSupply}/{asset.supply}</p>
                                <p className="text-xs text-muted-foreground">Tokens owned</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 py-8 text-center">
                      <p className="text-muted-foreground">No matching assets found</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button 
                  onClick={() => document.querySelector<HTMLButtonElement>('[data-value="details"]')?.click()}
                  disabled={!selectedAsset}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Listing Details</CardTitle>
                <CardDescription>
                  Set the price and conditions for your marketplace listing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {assetDetails && (
                  <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={assetDetails.imageUrl}
                        alt={assetDetails.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="font-medium truncate">{assetDetails.name}</h3>
                        {assetDetails.isVerified && (
                          <Badge variant="outline" className="ml-2 bg-green-50 dark:bg-transparent text-green-600 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">ID: {assetDetails.tokenId} | Type: {assetDetails.assetType}</p>
                      <p className="text-sm">Current valuation: <span className="font-medium">${assetDetails.currentPrice}</span></p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="listingPrice">Listing Price (USD)</Label>
                    <div className="relative">
                      <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input 
                        id="listingPrice" 
                        className="pl-10" 
                        placeholder="e.g. 100000" 
                        value={listingPrice}
                        onChange={handlePriceChange}
                      />
                    </div>
                    {assetDetails && listingPrice && (
                      <p className="text-xs text-muted-foreground">
                        {parseFloat(listingPrice.replace(/,/g, '')) > parseFloat(assetDetails.currentPrice.replace(/,/g, '')) 
                          ? 'Your price is above the current valuation'
                          : parseFloat(listingPrice.replace(/,/g, '')) < parseFloat(assetDetails.currentPrice.replace(/,/g, '')) 
                            ? 'Your price is below the current valuation'
                            : 'Your price matches the current valuation'
                        }
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="listingQuantity">Quantity to List</Label>
                    <Input 
                      id="listingQuantity" 
                      type="number" 
                      min="1"
                      max={assetDetails?.ownedSupply || 1}
                      placeholder="Default: 1" 
                      value={listingQuantity}
                      onChange={(e) => setListingQuantity(e.target.value)}
                    />
                    {assetDetails && (
                      <p className="text-xs text-muted-foreground">
                        You own {assetDetails.ownedSupply} of {assetDetails.supply} total tokens
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expirationDays">Listing Duration (Days)</Label>
                    <Input 
                      id="expirationDays" 
                      type="number" 
                      min="1"
                      max="90"
                      placeholder="e.g. 30" 
                      value={expirationDays}
                      onChange={(e) => setExpirationDays(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Maximum listing duration is 90 days
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="allowOffers" className="block mb-2">
                      Allow Offers
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="allowOffers" 
                        checked={allowOffers} 
                        onCheckedChange={setAllowOffers} 
                      />
                      <Label htmlFor="allowOffers">
                        {allowOffers ? 'Offers are allowed' : 'Fixed price only'}
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You can still decline any offers you receive
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 p-4 border border-border rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Service Fee (2.5%)</span>
                    <span>${calculateMarketplaceFee()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>You&apos;ll Receive</span>
                    <span>
                      {listingPrice ? 
                        `$${(
                          parseFloat(listingPrice.replace(/,/g, '')) - 
                          parseFloat(calculateMarketplaceFee().replace(/,/g, ''))
                        ).toLocaleString()}` : 
                        '$0'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-sm flex">
                  <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-blue-600 dark:text-blue-400">
                    <p className="font-medium mb-1">How marketplace listings work:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Your listing will be visible to all users on the marketplace</li>
                      <li>When someone purchases your asset, the transaction is handled by the MarketplaceContract</li>
                      <li>You&apos;ll receive payment minus the marketplace fee when the transaction is complete</li>
                      <li>You can cancel your listing at any time before it&apos;s purchased</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => document.querySelector<HTMLButtonElement>('[data-value="select"]')?.click()}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleCreateListing}
                  disabled={!selectedAsset || !listingPrice || isCreatingListing}
                  className="min-w-[120px]"
                >
                  {isCreatingListing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Listing'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 