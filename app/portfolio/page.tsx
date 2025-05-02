'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth/auth-context'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  TrendingUp,
  Wallet,
  AlertCircle,
  BarChart3,
  Shield,
  Tag,
  Award
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">My Portfolio</h1>
            <p className="text-muted-foreground">
              Manage your tokenized real-world assets
            </p>
          </div>
        </div>
        
        {!isConnected ? (
          <div className="mt-6 p-6 border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-900/30 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-400 mb-2">Wallet Not Connected</h3>
            <p className="text-yellow-700 dark:text-yellow-500 mb-6 max-w-md mx-auto">
              Please connect your wallet to view your tokenized asset portfolio and manage your holdings.
            </p>
            <Button>Connect Wallet</Button>
          </div>
        ) : (
          <>
            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Wallet className="mr-2 h-5 w-5 text-primary" />
                    Total Portfolio Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${totalPortfolioValue}</div>
                  <p className="text-sm text-muted-foreground mt-1">Across {PORTFOLIO_ASSETS.length} assets</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Award className="mr-2 h-5 w-5 text-primary" />
                    Highest Ownership
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {PORTFOLIO_ASSETS.sort((a, b) => parseInt(b.ownership) - parseInt(a.ownership))[0].ownership}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {PORTFOLIO_ASSETS.sort((a, b) => parseInt(b.ownership) - parseInt(a.ownership))[0].name}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                    Asset Diversification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Art</span>
                    <span>{(PORTFOLIO_ASSETS.filter(a => a.assetType === "ART").length / PORTFOLIO_ASSETS.length * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={PORTFOLIO_ASSETS.filter(a => a.assetType === "ART").length / PORTFOLIO_ASSETS.length * 100} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Real Estate</span>
                    <span>{(PORTFOLIO_ASSETS.filter(a => a.assetType === "REAL_ESTATE").length / PORTFOLIO_ASSETS.length * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={PORTFOLIO_ASSETS.filter(a => a.assetType === "REAL_ESTATE").length / PORTFOLIO_ASSETS.length * 100} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Collectibles</span>
                    <span>{(PORTFOLIO_ASSETS.filter(a => a.assetType === "COLLECTIBLE").length / PORTFOLIO_ASSETS.length * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={PORTFOLIO_ASSETS.filter(a => a.assetType === "COLLECTIBLE").length / PORTFOLIO_ASSETS.length * 100} className="h-2" />
                </CardContent>
              </Card>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search your assets..." 
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
              </div>
            </div>
            
            <Tabs defaultValue="grid" className="mb-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Showing {sortedAssets.length} {sortedAssets.length === 1 ? 'asset' : 'assets'}
                </div>
                <TabsList>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="grid" className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedAssets.length > 0 ? (
                    sortedAssets.map(asset => (
                      <Card key={asset.id} className="overflow-hidden transition-all hover:shadow-md">
                        <div className="relative h-40 w-full">
                          <Image 
                            src={asset.imageUrl}
                            alt={asset.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-black/70 text-white border-none">
                              {asset.assetType}
                            </Badge>
                          </div>
                          {asset.isVerified && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="outline" className="bg-green-50/80 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold truncate">{asset.name}</h3>
                              <p className="text-xs text-muted-foreground">ID: {asset.tokenId}</p>
                            </div>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Link href={`/verify/${asset.id}`} className="text-muted-foreground hover:text-primary">
                                    <Shield className="h-5 w-5" />
                                  </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Verify Ownership</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{asset.description}</p>
                          
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Current Price</p>
                              <p className="text-lg font-bold">${asset.currentPrice}</p>
                            </div>
                            <Badge variant="outline" className={`${parseFloat(asset.priceChange) >= 0 ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {asset.priceChange}
                            </Badge>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Owned: {asset.ownedSupply}/{asset.supply}</span>
                              <span className="font-medium">{asset.ownership}</span>
                            </div>
                            <Progress value={parseInt(asset.ownership)} className="h-2" />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                              Value: <span className="font-medium">${asset.totalValue}</span>
                            </p>
                            <Link href={`/asset/${asset.id}`}>
                              <Button variant="outline" size="sm">
                                Manage
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <p className="text-muted-foreground">No assets found matching your criteria</p>
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
              </TabsContent>
              
              <TabsContent value="list" className="mt-6">
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Asset</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ownership</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Total Value</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Updated</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {sortedAssets.length > 0 ? (
                          sortedAssets.map(asset => (
                            <tr key={asset.id} className="hover:bg-muted/20">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="relative h-10 w-10 rounded overflow-hidden mr-3">
                                    <Image
                                      src={asset.imageUrl}
                                      alt={asset.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">{asset.name}</p>
                                    <p className="text-xs text-muted-foreground">ID: {asset.tokenId}</p>
                                  </div>
                                  {asset.isVerified && (
                                    <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <Badge variant="outline">{asset.assetType}</Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex flex-col">
                                  <span className="font-medium">${asset.currentPrice}</span>
                                  <span className={`text-xs ${parseFloat(asset.priceChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {asset.priceChange}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex flex-col">
                                  <span className="font-medium">{asset.ownership}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {asset.ownedSupply}/{asset.supply} tokens
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">${asset.totalValue}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{asset.lastUpdate}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <Link href={`/asset/${asset.id}`}>
                                    <Button size="sm">Manage</Button>
                                  </Link>
                                  <Link href={`/verify/${asset.id}`}>
                                    <Button size="sm" variant="outline">
                                      <Shield className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                              No assets found matching your criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Portfolio Insights Section */}
            <Card className="mt-10">
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Insights</CardTitle>
                <CardDescription>
                  Analysis and recommendations for your tokenized asset portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Diversification</h3>
                    <p className="text-sm text-muted-foreground">
                      Your portfolio is diversified across {new Set(PORTFOLIO_ASSETS.map(a => a.assetType)).size} different asset classes, providing good protection against market volatility.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Your assets have shown an average price increase of {(PORTFOLIO_ASSETS.reduce((sum, asset) => sum + parseFloat(asset.priceChange), 0) / PORTFOLIO_ASSETS.length).toFixed(1)}% based on the most recent valuations.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Ownership Position</h3>
                    <p className="text-sm text-muted-foreground">
                      You have a majority ownership position in {PORTFOLIO_ASSETS.filter(a => parseInt(a.ownership) > 50).length} of your assets, providing significant control rights.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4 border-t pt-6">
                <Link href="/dashboard/charts">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Portfolio Analytics
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button className="w-full sm:w-auto">
                    <Tag className="mr-2 h-4 w-4" />
                    Browse Marketplace
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  )
} 