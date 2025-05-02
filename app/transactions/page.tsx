'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  Filter, 
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Wallet,
  ExternalLink,
  Layers,
  RotateCw
} from 'lucide-react'
import { TransactionType, TransactionStatus } from '@/lib/types'
import { CONTRACT_ADDRESSES } from '@/constants/contracts'

export default function TransactionsPage() {
  const { address } = useAuth()
  
  // Simulated transaction data
  const transactions = [
    { 
      id: "tx1", 
      type: TransactionType.BUY, 
      assetName: "Blue Chip Art Collection", 
      amount: "0.25", 
      value: "$30,000", 
      status: TransactionStatus.CONFIRMED, 
      timestamp: "2023-04-28 09:15",
      txHash: "0x4a6e2b7e8f0d3c9a1b5c6d8e7f9a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
      blockNumber: 14502356,
      confirmations: 32,
      contract: CONTRACT_ADDRESSES.MarketplaceContract
    },
    { 
      id: "tx2", 
      type: TransactionType.SELL, 
      assetName: "Luxury Real Estate Bundle", 
      amount: "0.5", 
      value: "$1,225,000", 
      status: TransactionStatus.CONFIRMED, 
      timestamp: "2023-04-25 14:30",
      txHash: "0x5b7c3d9f0e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
      blockNumber: 14500287,
      confirmations: 126,
      contract: CONTRACT_ADDRESSES.MarketplaceContract
    },
    { 
      id: "tx3", 
      type: TransactionType.TRANSFER_IN, 
      assetName: "Rare Wine Collection", 
      amount: "1", 
      value: "$75,000", 
      status: TransactionStatus.PENDING, 
      timestamp: "2023-04-30 11:45",
      txHash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
      blockNumber: null,
      confirmations: 0,
      contract: CONTRACT_ADDRESSES.RWAAssetContract
    },
    { 
      id: "tx4", 
      type: TransactionType.LIST, 
      assetName: "Vintage Watch Collection", 
      amount: "1", 
      value: "$42,500", 
      status: TransactionStatus.CONFIRMED, 
      timestamp: "2023-04-22 10:00",
      txHash: "0x8f9e0d1c2b3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
      blockNumber: 14495622,
      confirmations: 221,
      contract: CONTRACT_ADDRESSES.MarketplaceContract
    },
    { 
      id: "tx5", 
      type: TransactionType.BUY, 
      assetName: "Classic Car Portfolio", 
      amount: "0.1", 
      value: "$35,000", 
      status: TransactionStatus.FAILED, 
      timestamp: "2023-04-20 16:20",
      txHash: "0xc1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
      blockNumber: 14490112,
      confirmations: 0,
      contract: CONTRACT_ADDRESSES.MarketplaceContract
    },
  ]

  // Simulated pending transactions
  const pendingTransactions = [
    {
      id: "pending1",
      type: TransactionType.LIST,
      assetName: "Diamond Jewelry Collection",
      amount: "1",
      value: "$55,000",
      timestamp: "2023-04-30 14:22",
      txHash: "0x6f7e8d9c0b1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7",
      gasUsed: "0.0025 ETH",
      contract: CONTRACT_ADDRESSES.MarketplaceContract
    },
    {
      id: "pending2",
      type: TransactionType.TRANSFER_OUT,
      assetName: "Premium Whiskey Selection",
      amount: "0.3",
      value: "$12,800",
      timestamp: "2023-04-30 15:05",
      txHash: "0x3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
      gasUsed: "0.0018 ETH",
      contract: CONTRACT_ADDRESSES.RWAAssetContract
    }
  ]
  
  // Helper function to render transaction type with icon
  const renderTransactionType = (type: TransactionType) => {
    switch(type) {
      case TransactionType.BUY:
        return (
          <div className="flex items-center">
            <ArrowDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-green-500" />
            <span>Buy</span>
          </div>
        )
      case TransactionType.SELL:
        return (
          <div className="flex items-center">
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-red-500" />
            <span>Sell</span>
          </div>
        )
      case TransactionType.TRANSFER_IN:
        return (
          <div className="flex items-center">
            <ArrowDownLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-blue-500" />
            <span>Transfer In</span>
          </div>
        )
      case TransactionType.TRANSFER_OUT:
        return (
          <div className="flex items-center">
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-orange-500" />
            <span>Transfer Out</span>
          </div>
        )
      case TransactionType.LIST:
        return (
          <div className="flex items-center">
            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-purple-500" />
            <span>List</span>
          </div>
        )
      default:
        return type
    }
  }
  
  // Helper function to render transaction status with badge
  const renderStatus = (status: TransactionStatus) => {
    switch(status) {
      case TransactionStatus.CONFIRMED:
        return (
          <Badge variant="outline" className="bg-green-50 dark:bg-transparent text-green-600 border-green-200 text-xs h-6">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        )
      case TransactionStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-50 dark:bg-transparent text-yellow-600 border-yellow-200 text-xs h-6">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case TransactionStatus.FAILED:
        return (
          <Badge variant="outline" className="bg-red-50 dark:bg-transparent text-red-600 border-red-200 text-xs h-6">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return status
    }
  }
  
  // Format transaction hash for display with explorer link
  const formatTxHash = (hash: string) => (
    <div className="flex items-center">
      <span className="text-xs text-muted-foreground mr-1">{hash.slice(0, 8)}...{hash.slice(-6)}</span>
      <a 
        href={`https://etherscan.io/tx/${hash}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80"
      >
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
  
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">Transactions</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage your blockchain transaction history
          </p>
          {address && (
            <Badge variant="outline" className="mt-1.5 sm:mt-2 text-xs">
              <Wallet className="h-3 w-3 mr-1" />
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs h-8 sm:h-9">
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs h-8 sm:h-9">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Pending Transactions Section */}
      {pendingTransactions.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center">
              <RotateCw className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-primary animate-spin" />
              <h2 className="text-base sm:text-lg font-semibold">Pending Transactions</h2>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs h-8 sm:h-9">
              <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
              Refresh Status
            </Button>
          </div>
          
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <div className="min-w-[700px] px-3 sm:px-0 sm:min-w-0">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Asset</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Value</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Timestamp</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Transaction Hash</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Gas Used</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pendingTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/20">
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                          {renderTransactionType(tx.type)}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium">{tx.assetName}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{tx.amount}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{tx.value}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground">{tx.timestamp}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{formatTxHash(tx.txHash)}</td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground">{tx.gasUsed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Transaction History Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center mb-3 sm:mb-4">
          <Layers className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-primary" />
          <h2 className="text-base sm:text-lg font-semibold">Transaction History</h2>
        </div>
        
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[900px] px-3 sm:px-0 sm:min-w-0">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Type</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Asset</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Value</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Timestamp</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Block</th>
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Transaction Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/20">
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        {renderTransactionType(tx.type)}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium">{tx.assetName}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{tx.amount}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{tx.value}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        {renderStatus(tx.status)}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-muted-foreground">{tx.timestamp}</td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                        {tx.blockNumber ? (
                          <div className="flex items-center">
                            <span className="text-xs">#{tx.blockNumber}</span>
                            <Badge variant="outline" className="ml-1.5 text-xs px-1.5 py-0 h-5">
                              {tx.confirmations} confirms
                            </Badge>
                          </div>
                        ) : "-"}
                      </td>
                      <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{formatTxHash(tx.txHash)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blockchain Info Section */}
      <div className="bg-muted/30 border border-border rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
        <div className="flex items-center mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-medium">Smart Contract Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-card border border-border rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Dynamic Pricing Agent</p>
            <div className="flex items-center">
              <span className="text-xs sm:text-sm font-mono mr-1.5">{CONTRACT_ADDRESSES.DynamicPricingAgent.slice(0, 6)}...{CONTRACT_ADDRESSES.DynamicPricingAgent.slice(-4)}</span>
              <a 
                href={`https://etherscan.io/address/${CONTRACT_ADDRESSES.DynamicPricingAgent}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          
          <div className="p-2 sm:p-3 bg-card border border-border rounded-md">
            <p className="text-xs text-muted-foreground mb-1">RWA Asset Contract</p>
            <div className="flex items-center">
              <span className="text-xs sm:text-sm font-mono mr-1.5">{CONTRACT_ADDRESSES.RWAAssetContract.slice(0, 6)}...{CONTRACT_ADDRESSES.RWAAssetContract.slice(-4)}</span>
              <a 
                href={`https://etherscan.io/address/${CONTRACT_ADDRESSES.RWAAssetContract}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          
          <div className="p-2 sm:p-3 bg-card border border-border rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Marketplace Contract</p>
            <div className="flex items-center">
              <span className="text-xs sm:text-sm font-mono mr-1.5">{CONTRACT_ADDRESSES.MarketplaceContract.slice(0, 6)}...{CONTRACT_ADDRESSES.MarketplaceContract.slice(-4)}</span>
              <a 
                href={`https://etherscan.io/address/${CONTRACT_ADDRESSES.MarketplaceContract}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
