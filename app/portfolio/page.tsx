'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Search,
  Filter,
  CheckCircle,
  TrendingUp,
  Wallet,
  AlertCircle,
  BarChart3,
  Tag,
  Award,
  Grid3X3,
  List,
  Clock,
  CircleDollarSign,
  Edit,
  ArrowRight,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'

// Mock user portfolio data
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
    blockchainId: "0x7a23608a8eBe71868013BDA0d900351A83bb4Dc2"
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
    blockchainId: "0x4b56E84772a5719a565c76E0226897f33e59f139"
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
    blockchainId: "0x8912DcFB23c5A1A04E58695F5AaFd2ff3d94f9B0"
  }
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
  { id: "VALUE_DESC", name: "Highest Value" },
  { id: "VALUE_ASC", name: "Lowest Value" },
  { id: "RECENT", name: "Recently Updated" },
  { id: "OWNERSHIP_DESC", name: "Highest Ownership %" }
];

export default function PortfolioPage() {
  const { address } = useAuth()
  const isConnected = !!address
  
  // State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssetType, setSelectedAssetType] = useState("ALL")
  const [selectedSort, setSelectedSort] = useState("VALUE_DESC")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Calculate total portfolio value
  const totalPortfolioValue = PORTFOLIO_ASSETS.reduce((sum, asset) => {
    return sum + parseInt(asset.totalValue.replace(/,/g, ''));
  }, 0).toLocaleString();
  
  // Filter assets based on search query and asset type
  const filteredAssets = PORTFOLIO_ASSETS.filter(asset => {
    const matchesSearch = 
      searchQuery === '' || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAssetType = 
      selectedAssetType === "ALL" || 
      asset.assetType === selectedAssetType;
    
    return matchesSearch && matchesAssetType;
  });
  
  // Sort assets based on selected sort option
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (selectedSort) {
      case "VALUE_DESC":
        return parseInt(b.totalValue.replace(/,/g, '')) - parseInt(a.totalValue.replace(/,/g, ''));
      case "VALUE_ASC":
        return parseInt(a.totalValue.replace(/,/g, '')) - parseInt(b.totalValue.replace(/,/g, ''));
      case "RECENT":
        return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
      case "OWNERSHIP_DESC":
        return parseInt(b.ownership) - parseInt(a.ownership);
      default:
        return 0;
    }
  });
  
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">My Portfolio</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your tokenized real-world assets
            </p>
            {address && (
              <Badge variant="outline" className="mt-1.5 sm:mt-2 text-xs sm:text-sm">
                <Wallet className="h-3 w-3 mr-1" />
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </Badge>
            )}
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
            <p className="text-muted-foreground text-xs sm:text-sm">Total Portfolio Value</p>
            <p className="text-xl sm:text-2xl font-bold">${totalPortfolioValue}</p>
            <Link href="/marketplace" className="text-xs sm:text-sm text-primary flex items-center mt-1">
              Browse marketplace
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      {!isConnected ? (
        <div className="mt-6 p-4 sm:p-6 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 rounded-lg text-center">
          <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-600 dark:text-yellow-500 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 dark:text-yellow-400 mb-1.5 sm:mb-2">Wallet Not Connected</h3>
          <p className="text-yellow-700 dark:text-yellow-500 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
            Please connect your wallet to view your tokenized asset portfolio and manage your holdings.
          </p>
          <Button>Connect Wallet</Button>
        </div>
      ) : (
        <>
          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card>
              <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Wallet className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Total Portfolio Value
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="text-xl sm:text-3xl font-bold">${totalPortfolioValue}</div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Across {PORTFOLIO_ASSETS.length} assets</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <Award className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Highest Ownership
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="text-xl sm:text-3xl font-bold">
                  {PORTFOLIO_ASSETS.sort((a, b) => parseInt(b.ownership) - parseInt(a.ownership))[0].ownership}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1">
                  {PORTFOLIO_ASSETS.sort((a, b) => parseInt(b.ownership) - parseInt(a.ownership))[0].name}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-4 pt-3 sm:pt-4">
                <CardTitle className="text-base sm:text-lg flex items-center">
                  <BarChart3 className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Average Confidence Score
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 sm:px-4 pb-3 sm:pb-4">
                <div className="text-xl sm:text-3xl font-bold">
                  {Math.round(PORTFOLIO_ASSETS.reduce((sum, asset) => sum + asset.confidenceScore, 0) / PORTFOLIO_ASSETS.length)}%
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                  AI pricing confidence
                </p>
              </CardContent>
            </Card>
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
                    {ASSET_TYPES.map((type) => (
                      <SelectItem key={type.id} value={type.id} className="text-xs sm:text-sm">
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative">
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="min-w-[150px] h-9 sm:h-10 text-xs sm:text-sm">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.id} value={option.id} className="text-xs sm:text-sm">
                        {option.name}
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
            </div>
          </div>
          
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedAssets.map((asset) => (
                <Link href={`/asset/${asset.id}`} key={asset.id} className="block">
                  <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                    <div className="relative">
                      <div className="aspect-[16/9] bg-muted relative">
                        {asset.imageUrl && (
                          <ImageWithFallback
                            src={asset.imageUrl} 
                            alt={asset.name}
                            fill
                            
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="absolute top-2 right-2 flex gap-1">
                        {asset.isVerified && (
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
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{asset.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 sm:mt-1">{asset.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
                        <Badge variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {asset.assetType === "REAL_ESTATE" ? "Real Estate" : asset.assetType.charAt(0) + asset.assetType.slice(1).toLowerCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Updated: {new Date(asset.lastUpdate).toLocaleDateString()}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                        <div className="flex items-center gap-1">
                          <CircleDollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                          <span className="font-semibold text-sm sm:text-base">${asset.totalValue}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-muted-foreground">Per Token:</span>
                          <span className="text-xs sm:text-sm ml-1">${asset.currentPrice}</span>
                          <span className={`text-xs ml-1 ${asset.priceChange.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {asset.priceChange}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Ownership</span>
                        <span className="text-xs font-medium">{asset.ownership}</span>
                      </div>
                      <Progress value={parseInt(asset.ownership)} className="h-1.5 mt-1 bg-muted" />
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">AI Confidence</span>
                        <span className="text-xs font-medium">{asset.confidenceScore}%</span>
                      </div>
                      <Progress value={asset.confidenceScore} className="h-1.5 mt-1" />
                      
                      <div className="mt-3 sm:mt-4">
                        <Button className="w-full text-xs sm:text-sm h-8 sm:h-9">Manage Asset</Button>
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
              {sortedAssets.map((asset) => (
                <Link href={`/asset/${asset.id}`} key={asset.id} className="block">
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-60 lg:w-72">
                        <div className="aspect-[16/9] sm:aspect-auto sm:h-full bg-muted relative">
                          {asset.imageUrl && (
                            <ImageWithFallback
                              src={asset.imageUrl} 
                              alt={asset.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          {asset.isVerified && (
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
                                <h3 className="font-semibold text-sm sm:text-base">{asset.name}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 sm:mt-1">{asset.description}</p>
                              </div>
                              <div className="mt-2 sm:mt-0 sm:ml-4 flex flex-col sm:items-end">
                                <div className="flex items-center">
                                  <CircleDollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mr-1" />
                                  <span className="font-semibold text-sm sm:text-base">${asset.totalValue}</span>
                                </div>
                                <div className="flex items-center mt-0.5">
                                  <span className="text-xs text-muted-foreground">Per Token:</span>
                                  <span className="text-xs sm:text-sm ml-1">${asset.currentPrice}</span>
                                  <span className={`text-xs ml-1 ${asset.priceChange.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                    {asset.priceChange}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                              <Badge variant="secondary" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {asset.assetType === "REAL_ESTATE" ? "Real Estate" : asset.assetType.charAt(0) + asset.assetType.slice(1).toLowerCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                Updated: {new Date(asset.lastUpdate).toLocaleDateString()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Tokens: {asset.ownedSupply}/{asset.supply}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2.5 sm:mt-3.5">
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">Ownership</span>
                                  <span className="text-xs font-medium">{asset.ownership}</span>
                                </div>
                                <Progress value={parseInt(asset.ownership)} className="h-1.5 mt-1 bg-muted" />
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">AI Confidence</span>
                                  <span className="text-xs font-medium">{asset.confidenceScore}%</span>
                                </div>
                                <Progress value={asset.confidenceScore} className="h-1.5 mt-1" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex sm:flex-col justify-between sm:h-full gap-2 mt-3 sm:mt-0">
                            <Button className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 flex-1 sm:flex-none">Manage Asset</Button>
                            <Button variant="outline" className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 flex-1 sm:flex-none">
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Verify
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          {/* No assets */}
          {sortedAssets.length === 0 && (
            <div className="text-center py-12 rounded-lg border border-dashed">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 sm:mb-4">
                <Wallet className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">No assets found</h3>
              <p className="text-sm text-muted-foreground mb-4 sm:mb-6">
                Try adjusting your search or filter criteria, or mint your first asset
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedAssetType('ALL');
                    setSelectedSort('VALUE_DESC');
                  }}
                >
                  Clear Filters
                </Button>
                <Link href="/mint">
                  <Button className="w-full sm:w-auto">Mint New Asset</Button>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
} 