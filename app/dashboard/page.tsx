'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart, 
  PieChart, 
  Wallet, 
  Activity, 
  TrendingUp, 
  CircleDollarSign,
  Landmark,
  Tag,
  PlusCircle,
  ShoppingCart,
  BarChart2,
  ChevronRight,
  FileUp,
  Layers
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { address } = useAuth()
  
  // Simulated portfolio data
  const portfolioValue = "$258,425.00"
  const portfolioChange = "+8.4%"
  const isPositiveChange = portfolioChange.startsWith('+')
  
  // Simulated marketplace listings data
  const activeListings = [
    { id: "listing1", asset: "Blue Chip Art Collection", price: "$32,500", timeRemaining: "3 days", timestamp: "2023-04-25", confidenceScore: 97 },
    { id: "listing2", asset: "Vintage Watch Collection", price: "$42,500", timeRemaining: "5 days", timestamp: "2023-04-22", confidenceScore: 94 },
    { id: "listing3", asset: "Luxury Wine Selection", price: "$18,750", timeRemaining: "2 days", timestamp: "2023-04-27", confidenceScore: 92 },
  ]
  
  // Simulated dynamic price updates
  const recentPriceUpdates = [
    { asset: "Blue Chip Art Collection", oldPrice: "$30,000", newPrice: "$32,500", change: "+8.3%", dataSource: "Christie's Auction Data", timestamp: "2023-04-28", confidenceScore: 97 },
    { asset: "Rare Wine Collection", oldPrice: "$72,000", newPrice: "$75,000", change: "+4.2%", dataSource: "Wine Market Analytics", timestamp: "2023-04-26", confidenceScore: 94 },
    { asset: "Classic Car Portfolio", oldPrice: "$33,500", newPrice: "$35,000", change: "+4.5%", dataSource: "Automotive Auction Index", timestamp: "2023-04-24", confidenceScore: 95 },
  ]
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your tokenized assets and track performance
          </p>
          {address && (
            <Badge variant="outline" className="mt-2">
              <Wallet className="h-3 w-3 mr-1" />
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </Badge>
          )}
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/mint">
            <Button className="bg-teal-accent hover:bg-teal-accent/90 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create New Asset
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-2xl font-bold text-foreground">{portfolioValue}</p>
            <CircleDollarSign className="h-5 w-5 text-primary" />
          </div>
          <p className={`text-sm font-medium flex items-center mt-2 ${
            isPositiveChange ? 'text-green-500' : 'text-red-500'
          }`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {portfolioChange} (30d)
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Assets Owned</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-2xl font-bold text-foreground">12</p>
            <Landmark className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Across 4 asset categories
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Transactions</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-2xl font-bold text-foreground">28</p>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Last 30 days activity
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Marketplace Activity</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-2xl font-bold text-foreground">5</p>
            <Tag className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Active listings
          </p>
        </div>
      </div>
      
      {/* Quick Actions Section - NEW */}
      <div className="bg-card border border-border rounded-lg p-4 mb-8">
        <div className="flex items-center mb-4">
          <Layers className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link href="/mint">
            <div className="bg-muted p-4 rounded-lg hover:bg-muted/80 transition-colors flex flex-col items-center text-center cursor-pointer h-full">
              <div className="bg-primary/10 rounded-full p-3 mb-3">
                <FileUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Mint Asset</h3>
              <p className="text-xs text-muted-foreground">Tokenize real-world assets</p>
            </div>
          </Link>
          
          <Link href="/portfolio">
            <div className="bg-muted p-4 rounded-lg hover:bg-muted/80 transition-colors flex flex-col items-center text-center cursor-pointer h-full">
              <div className="bg-primary/10 rounded-full p-3 mb-3">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">My Portfolio</h3>
              <p className="text-xs text-muted-foreground">Manage your assets</p>
            </div>
          </Link>
          
          <Link href="/marketplace/create">
            <div className="bg-muted p-4 rounded-lg hover:bg-muted/80 transition-colors flex flex-col items-center text-center cursor-pointer h-full">
              <div className="bg-primary/10 rounded-full p-3 mb-3">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Create Listing</h3>
              <p className="text-xs text-muted-foreground">Sell your tokenized assets</p>
            </div>
          </Link>
          
          <Link href="/dashboard/listings">
            <div className="bg-muted p-4 rounded-lg hover:bg-muted/80 transition-colors flex flex-col items-center text-center cursor-pointer h-full">
              <div className="bg-primary/10 rounded-full p-3 mb-3">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">My Listings</h3>
              <p className="text-xs text-muted-foreground">Manage marketplace listings</p>
            </div>
          </Link>
          
          <Link href="/marketplace">
            <div className="bg-muted p-4 rounded-lg hover:bg-muted/80 transition-colors flex flex-col items-center text-center cursor-pointer h-full">
              <div className="bg-primary/10 rounded-full p-3 mb-3">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Marketplace</h3>
              <p className="text-xs text-muted-foreground">Discover available assets</p>
            </div>
          </Link>
          
          <Link href="/transactions">
            <div className="bg-muted p-4 rounded-lg hover:bg-muted/80 transition-colors flex flex-col items-center text-center cursor-pointer h-full">
              <div className="bg-primary/10 rounded-full p-3 mb-3">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Transactions</h3>
              <p className="text-xs text-muted-foreground">View transaction history</p>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Blockchain Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold">Portfolio Performance</h2>
            </div>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
          <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground text-sm">
              Portfolio chart visualization would be displayed here
            </p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold">Asset Allocation</h2>
            </div>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </div>
          <div className="h-80 flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground text-sm">
              Asset allocation chart would be displayed here
            </p>
          </div>
        </div>
      </div>
      
      {/* Marketplace Listings Section */}
      <div className="bg-card border border-border rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Tag className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-lg font-semibold">Your Marketplace Listings</h2>
          </div>
          <Link href="/marketplace" passHref>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Asset</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Listed Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Confidence</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm font-medium">{listing.asset}</td>
                  <td className="px-4 py-3 text-sm">{listing.price}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{listing.timestamp}</td>
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
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Delist</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            List New Asset
          </Button>
        </div>
      </div>
      
      {/* Recent Dynamic Price Updates */}
      <div className="bg-card border border-border rounded-lg p-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-lg font-semibold">Recent Price Updates</h2>
          </div>
          <Button variant="outline" size="sm">
            View History
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Asset</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Previous</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">New Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Change</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Confidence</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Data Source</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentPriceUpdates.map((update, idx) => (
                <tr key={idx} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm font-medium">{update.asset}</td>
                  <td className="px-4 py-3 text-sm">{update.oldPrice}</td>
                  <td className="px-4 py-3 text-sm font-medium">{update.newPrice}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={update.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                      {update.change}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden mr-2">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${update.confidenceScore}%` }}
                        ></div>
                      </div>
                      <span>{update.confidenceScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{update.dataSource}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{update.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Actions Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/marketplace" passHref>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:bg-muted/20 cursor-pointer transition-colors flex flex-col items-center">
            <ShoppingCart className="h-8 w-8 mb-3 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Marketplace</h3>
            <p className="text-sm text-muted-foreground">Browse and purchase tokenized assets</p>
          </div>
        </Link>
        
        <Link href="/transactions" passHref>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:bg-muted/20 cursor-pointer transition-colors flex flex-col items-center">
            <Activity className="h-8 w-8 mb-3 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Transactions</h3>
            <p className="text-sm text-muted-foreground">View your transaction history</p>
          </div>
        </Link>
        
        <Link href="/mint" passHref>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:bg-muted/20 cursor-pointer transition-colors flex flex-col items-center">
            <FileUp className="h-8 w-8 mb-3 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Mint New Asset</h3>
            <p className="text-sm text-muted-foreground">Tokenize your real-world assets on the blockchain</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
