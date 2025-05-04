'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, Grid3X3, List, Tag, CheckCircle, Clock, CircleDollarSign } from 'lucide-react'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import Link from 'next/link'

// Mock marketplace listing data
const marketplaceListings = [
  {
    id: "listing1",
    assetId: "asset1",
    tokenId: "10001",
    name: "Blue Chip Art Collection",
    description: "A collection of contemporary art pieces from renowned artists with proven market value appreciation over the last decade.",
    imageUrl: "/images/art-collection.jpg",
    listingPrice: 32500,
    currentValuation: 35000,
    priceChange: "+8.3%",
    seller: "0x1a2b3c4d5e6f7g8h9i0j",
    listingDate: "2023-04-25",
    expiresAt: "2023-07-25",
    confidenceScore: 97,
    assetType: "Art",
    isVerified: true,
    tokenSupply: 100,
    listedAmount: 25
  },
  {
    id: "listing2",
    assetId: "asset2",
    tokenId: "10002",
    name: "Luxury Real Estate Bundle",
    description: "Tokenized shares of premium real estate properties in major metropolitan areas with strong rental yields.",
    imageUrl: "/images/real-estate-bundle.jpg",
    listingPrice: 75000,
    currentValuation: 78500,
    priceChange: "+4.5%",
    seller: "0x2b3c4d5e6f7g8h9i0j1a",
    listingDate: "2023-04-22",
    expiresAt: "2023-07-22",
    confidenceScore: 95,
    assetType: "Real Estate",
    isVerified: true,
    tokenSupply: 1000,
    listedAmount: 200
  },
  {
    id: "listing3",
    assetId: "asset3",
    tokenId: "10003",
    name: "Vintage Watch Collection",
    description: "Rare and limited edition timepieces from prestigious manufacturers with strong secondary market demand.",
    imageUrl: "/images/watch-collection.jpg",
    listingPrice: 42500,
    currentValuation: 45000,
    priceChange: "+5.9%",
    seller: "0x3c4d5e6f7g8h9i0j1a2b",
    listingDate: "2023-04-18",
    expiresAt: "2023-07-18",
    confidenceScore: 94,
    assetType: "Collectibles",
    isVerified: false,
    tokenSupply: 50,
    listedAmount: 10
  },
  {
    id: "listing4",
    assetId: "asset4",
    tokenId: "10004",
    name: "Premium Wine Portfolio",
    description: "Curated selection of investment-grade wines from renowned vineyards with established appreciation history.",
    imageUrl: "/images/wine-portfolio.jpg",
    listingPrice: 28750,
    currentValuation: 30000,
    priceChange: "+4.2%",
    seller: "0x4d5e6f7g8h9i0j1a2b3c",
    listingDate: "2023-04-15",
    expiresAt: "2023-07-15",
    confidenceScore: 92,
    assetType: "Luxury Goods",
    isVerified: true,
    tokenSupply: 200,
    listedAmount: 50
  },
  {
    id: "listing5",
    assetId: "asset5",
    tokenId: "10005",
    name: "Industrial Commodity Basket",
    description: "Diversified exposure to essential industrial commodities with strong correlation to manufacturing growth.",
    imageUrl: "/images/commodity-basket.jpg",
    listingPrice: 15000,
    currentValuation: 15750,
    priceChange: "+5.0%",
    seller: "0x5e6f7g8h9i0j1a2b3c4d",
    listingDate: "2023-04-10",
    expiresAt: "2023-07-10",
    confidenceScore: 90,
    assetType: "Commodities",
    isVerified: true,
    tokenSupply: 500,
    listedAmount: 100
  }
]

// Asset types for filtering
const assetTypes = [
  { value: "all", label: "All Types" },
  { value: "art", label: "Art" },
  { value: "real-estate", label: "Real Estate" },
  { value: "collectibles", label: "Collectibles" },
  { value: "luxury-goods", label: "Luxury Goods" },
  { value: "commodities", label: "Commodities" }
]

// Sort options
const sortOptions = [
  { value: "recently-listed", label: "Recently Listed" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "highest-confidence", label: "Highest Confidence" }
]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssetType, setSelectedAssetType] = useState('all')
  const [sortOption, setSortOption] = useState('recently-listed')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Filter listings based on search query and asset type
  const filteredListings = marketplaceListings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedAssetType === 'all' || listing.assetType.toLowerCase() === selectedAssetType;
    
    return matchesSearch && matchesType;
  });
  
  // Sort listings based on selected sort option
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch(sortOption) {
      case 'price-low-high':
        return a.listingPrice - b.listingPrice;
      case 'price-high-low':
        return b.listingPrice - a.listingPrice;
      case 'highest-confidence':
        return b.confidenceScore - a.confidenceScore;
      case 'recently-listed':
      default:
        return new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime();
    }
  });
  
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Marketplace</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Browse and purchase tokenized real-world assets
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="relative flex-grow max-w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search assets..."
            className="pl-9 pr-4 h-9 sm:h-10 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <div className="relative">
            <Select value={selectedAssetType} onValueChange={setSelectedAssetType}>
              <SelectTrigger className="min-w-[140px] h-9 sm:h-10 text-xs sm:text-sm">
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-muted-foreground" />
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                {assetTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-xs sm:text-sm">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="relative">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="min-w-[140px] h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-xs sm:text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex bg-muted rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-none h-9 sm:h-10 w-9 sm:w-10"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-none h-9 sm:h-10 w-9 sm:w-10"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Link href="/marketplace/create">
            <Button className="bg-teal-accent hover:bg-teal-accent/90 h-9 sm:h-10 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
              <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Create Listing
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sortedListings.map((listing) => (
            <Link href={`/marketplace/${listing.id}`} key={listing.id} className="block">
              <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                <div className="relative">
                  <div className="aspect-[16/9] bg-muted relative">
                    {listing.imageUrl && (
                      <ImageWithFallback 
                        src={listing.imageUrl} 
                        alt={listing.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {listing.isVerified && (
                      <Badge variant="outline" className="bg-background/80 backdrop-blur-sm flex items-center gap-1 px-2 h-7">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-xs">Verified</span>
                      </Badge>
                    )}
                  </div>
                </div>
                
                <CardContent className="pt-3 sm:pt-4 px-3 sm:px-4 pb-3 sm:pb-4">
                  <div className="mb-1.5 sm:mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{listing.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 sm:mt-1">{listing.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                    <Badge variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {listing.assetType}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Listed: {new Date(listing.listingDate).toLocaleDateString()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                    <div className="flex items-center gap-1">
                      <CircleDollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                      <span className="font-semibold text-sm sm:text-base">${listing.listingPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs text-muted-foreground">Valuation:</span>
                      <span className="text-xs sm:text-sm ml-1">${listing.currentValuation.toLocaleString()}</span>
                      <span className={`text-xs ml-1 ${listing.priceChange.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {listing.priceChange}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">AI Confidence</span>
                    <span className="text-xs font-medium">{listing.confidenceScore}%</span>
                  </div>
                  <Progress value={listing.confidenceScore} className="h-1.5 mt-1" />
                  
                  <div className="mt-3 sm:mt-4">
                    <Button className="w-full text-xs sm:text-sm h-8 sm:h-9">View Listing</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3 sm:space-y-4">
          {sortedListings.map((listing) => (
            <Link href={`/marketplace/${listing.id}`} key={listing.id} className="block">
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-60 lg:w-72">
                    <div className="aspect-[16/9] sm:aspect-auto sm:h-full bg-muted relative">
                      {listing.imageUrl && (
                        <ImageWithFallback 
                          src={listing.imageUrl} 
                          alt={listing.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      {listing.isVerified && (
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm flex items-center gap-1 px-2 h-7">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs">Verified</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <CardContent className="pt-3 sm:pt-4 px-3 sm:px-4 pb-3 sm:pb-4 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-sm sm:text-base">{listing.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 sm:mt-1">{listing.description}</p>
                          </div>
                          <div className="mt-2 sm:mt-0 sm:ml-4 flex flex-col sm:items-end">
                            <div className="flex items-center">
                              <CircleDollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mr-1" />
                              <span className="font-semibold text-sm sm:text-base">${listing.listingPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center mt-0.5">
                              <span className="text-xs text-muted-foreground">Valuation:</span>
                              <span className="text-xs sm:text-sm ml-1">${listing.currentValuation.toLocaleString()}</span>
                              <span className={`text-xs ml-1 ${listing.priceChange.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                {listing.priceChange}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                          <Badge variant="secondary" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {listing.assetType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Listed: {new Date(listing.listingDate).toLocaleDateString()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Tokens: {listing.listedAmount}/{listing.tokenSupply}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2.5 sm:mt-3.5">
                          <span className="text-xs text-muted-foreground">AI Confidence</span>
                          <span className="text-xs font-medium">{listing.confidenceScore}%</span>
                        </div>
                        <Progress value={listing.confidenceScore} className="h-1.5 mt-1" />
                      </div>
                      
                      <div className="flex sm:flex-col justify-end sm:justify-between sm:h-full gap-2 mt-3 sm:mt-0">
                        <Button className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 flex-1 sm:flex-none">View Listing</Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      {/* No results */}
      {sortedListings.length === 0 && (
        <div className="text-center py-12 rounded-lg border border-dashed">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">No listings found</h3>
          <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
            Try adjusting your search or filter criteria
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setSelectedAssetType('all');
              setSortOption('recently-listed');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
} 