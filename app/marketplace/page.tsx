'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Tag, 
  TrendingUp, 
  CheckCircle, 
  ChevronDown,
  Grid,
  List,
  PlusCircle,
  Calendar
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Mock marketplace listing data
const MARKETPLACE_LISTINGS = [
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
    seller: "0x7a23608a8eBe71868013BDA0d900351A83bb4Dc2",
    listingDate: "2023-04-22",
    expiresAt: "2023-07-22",
    confidenceScore: 98,
    assetType: "ART",
    isVerified: true,
    tokenSupply: 1000,
    listedAmount: 500
  },
  {
    id: "listing2",
    assetId: "2",
    tokenId: 2,
    name: "Luxury Real Estate Bundle",
    description: "Tokenized high-end properties in premium locations",
    imageUrl: "/images/asset-realestate.jpg",
    listingPrice: "2,500,000",
    currentValuation: "2,450,000",
    priceChange: "+1.5%",
    seller: "0x4b56E84772a5719a565c76E0226897f33e59f139",
    listingDate: "2023-04-25",
    expiresAt: "2023-07-25",
    confidenceScore: 95,
    assetType: "REAL_ESTATE",
    isVerified: true,
    tokenSupply: 100,
    listedAmount: 50
  },
  {
    id: "listing3",
    assetId: "4",
    tokenId: 4,
    name: "Vintage Watch Collection",
    description: "Rare and limited edition luxury timepieces",
    imageUrl: "/images/asset-collectible.jpg",
    listingPrice: "42,500",
    currentValuation: "40,000",
    priceChange: "+2.1%",
    seller: "0x8912DcFB23c5A1A04E58695F5AaFd2ff3d94f9B0",
    listingDate: "2023-04-18",
    expiresAt: "2023-07-18",
    confidenceScore: 94,
    assetType: "LUXURY_GOODS",
    isVerified: true,
    tokenSupply: 100,
    listedAmount: 100
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
    seller: "0x7a23608a8eBe71868013BDA0d900351A83bb4Dc2",
    listingDate: "2023-04-24",
    expiresAt: "2023-07-24",
    confidenceScore: 91,
    assetType: "COLLECTIBLE",
    isVerified: false,
    tokenSupply: 750,
    listedAmount: 250
  },
  {
    id: "listing5",
    assetId: "7",
    tokenId: 7,
    name: "Precious Metals Portfolio",
    description: "Diversified collection of gold, silver, and platinum assets",
    imageUrl: "/images/asset-commodity.jpg",
    listingPrice: "185,000",
    currentValuation: "182,000",
    priceChange: "+1.6%",
    seller: "0x3F2e61A1A3a92596a7D9EEA9C0321a48404E49c1",
    listingDate: "2023-04-26",
    expiresAt: "2023-07-26",
    confidenceScore: 93,
    assetType: "COMMODITY",
    isVerified: true,
    tokenSupply: 500,
    listedAmount: 250
  },
];

// Asset types for filtering
const ASSET_TYPES = [
  { id: "ALL", name: "All Types" },
  { id: "ART", name: "Art" },
  { id: "REAL_ESTATE", name: "Real Estate" },
  { id: "COLLECTIBLE", name: "Collectibles" },
  { id: "LUXURY_GOODS", name: "Luxury Goods" },
  { id: "COMMODITY", name: "Commodities" }
];

// Sort options
const SORT_OPTIONS = [
  { id: "RECENT", name: "Recently Listed" },
  { id: "PRICE_ASC", name: "Price: Low to High" },
  { id: "PRICE_DESC", name: "Price: High to Low" },
  { id: "CONFIDENCE", name: "Highest Confidence" }
];

export default function MarketplacePage() {
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssetType, setSelectedAssetType] = useState("ALL")
  const [selectedSort, setSelectedSort] = useState("RECENT")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Filter listings based on search query and asset type
  const filteredListings = MARKETPLACE_LISTINGS.filter(listing => {
    const matchesSearch = 
      searchQuery === '' || 
      listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAssetType = 
      selectedAssetType === "ALL" || 
      listing.assetType === selectedAssetType;
    
    return matchesSearch && matchesAssetType;
  });
  
  // Sort listings based on selected sort option
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (selectedSort) {
      case "RECENT":
        return new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime();
      case "PRICE_ASC":
        return parseInt(a.listingPrice.replace(/,/g, '')) - parseInt(b.listingPrice.replace(/,/g, ''));
      case "PRICE_DESC":
        return parseInt(b.listingPrice.replace(/,/g, '')) - parseInt(a.listingPrice.replace(/,/g, ''));
      case "CONFIDENCE":
        return b.confidenceScore - a.confidenceScore;
      default:
        return 0;
    }
  });
  
  // Format wallet address
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Marketplace</h1>
            <p className="text-muted-foreground">
              Browse and purchase tokenized real-world assets
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/marketplace/create">
              <Button className="bg-teal-accent hover:bg-teal-accent/90 flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Listing
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search assets by name or description..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {ASSET_TYPES.find(type => type.id === selectedAssetType)?.name}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Asset Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ASSET_TYPES.map(type => (
                  <DropdownMenuItem 
                    key={type.id} 
                    className={selectedAssetType === type.id ? "bg-muted" : ""}
                    onClick={() => setSelectedAssetType(type.id)}
                  >
                    {type.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Sort
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SORT_OPTIONS.map(option => (
                  <DropdownMenuItem 
                    key={option.id} 
                    className={selectedSort === option.id ? "bg-muted" : ""}
                    onClick={() => setSelectedSort(option.id)}
                  >
                    {option.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="border border-border rounded-md flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-10 w-10 ${viewMode === 'grid' ? 'bg-muted' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Grid View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-10 w-10 ${viewMode === 'list' ? 'bg-muted' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>List View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results count and stats */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {sortedListings.length} {sortedListings.length === 1 ? 'listing' : 'listings'}
        </p>
        <div className="flex gap-4">
          <p className="text-sm text-muted-foreground flex items-center">
            <Tag className="h-4 w-4 mr-1 text-primary" />
            <span>{MARKETPLACE_LISTINGS.length} total listings</span>
          </p>
          <p className="text-sm text-muted-foreground flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-primary" />
            <span>Updated daily</span>
          </p>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedListings.length > 0 ? (
            sortedListings.map(listing => (
              <div key={listing.id} className="bg-card border border-border rounded-lg overflow-hidden transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="relative h-48 w-full">
                  <Image 
                    src={listing.imageUrl}
                    alt={listing.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 text-white border-none">
                      {listing.assetType}
                    </Badge>
                  </div>
                  {listing.isVerified && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className="bg-green-50/80 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{listing.name}</h3>
                    <span className="text-xs text-muted-foreground">ID: {listing.tokenId}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{listing.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="text-xl font-bold text-foreground">${listing.listingPrice}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant="outline" className={`${parseFloat(listing.priceChange) >= 0 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {listing.priceChange}
                      </Badge>
                      <div className="flex items-center mt-1">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden mr-2">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${listing.confidenceScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{listing.confidenceScore}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 flex flex-wrap gap-1">
                    <Badge variant="secondary" className="text-xs">
                      {listing.listedAmount}/{listing.tokenSupply} tokens
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Listed: {listing.listingDate}
                    </Badge>
                  </div>
                  
                  <Link href={`/marketplace/${listing.id}`} passHref>
                    <Button className="w-full">
                      View Listing
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">No listings found matching your criteria</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedAssetType('ALL');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        // List View
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Asset</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Change</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Confidence</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Seller</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Listed</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedListings.length > 0 ? (
                  sortedListings.map(listing => (
                    <tr key={listing.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="relative h-10 w-10 rounded overflow-hidden mr-3">
                            <Image
                              src={listing.imageUrl}
                              alt={listing.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{listing.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {listing.tokenId}</p>
                          </div>
                          {listing.isVerified && (
                            <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline">{listing.assetType}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">${listing.listingPrice}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={parseFloat(listing.priceChange) >= 0 ? 'text-green-500' : 'text-red-500'}>
                          {listing.priceChange}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden mr-2">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${listing.confidenceScore}%` }}
                            ></div>
                          </div>
                          <span>{listing.confidenceScore}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatAddress(listing.seller)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {listing.listingDate}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link href={`/marketplace/${listing.id}`} passHref>
                          <Button size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      No listings found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Marketplace Explainer */}
      <div className="mt-16 bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Tag className="h-5 w-5 mr-2 text-primary" />
          About the DynamicVault Marketplace
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-2">
            <h3 className="font-medium">Smart Contract Powered</h3>
            <p className="text-sm text-muted-foreground">
              Our marketplace is powered by the MarketplaceContract, ensuring secure and transparent transactions for all tokenized assets.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Dynamic Pricing</h3>
            <p className="text-sm text-muted-foreground">
              Assets are valued using our DynamicPricingAgent which provides real-time market-based valuations with confidence scores.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Low Fees</h3>
            <p className="text-sm text-muted-foreground">
              Marketplace transactions include a 2.5% service fee, significantly lower than traditional asset marketplaces.
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Ready to list your own asset? <Link href="/marketplace/create" className="text-primary hover:underline">Create a new listing</Link> or learn more about <Link href="/docs/marketplace" className="text-primary hover:underline">how the marketplace works</Link>.
          </p>
        </div>
      </div>
    </div>
  )
} 