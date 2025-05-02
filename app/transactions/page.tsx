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
            <ArrowDownLeft className="h-4 w-4 mr-1 text-green-500" />
            <span>Buy</span>
          </div>
        )
      case TransactionType.SELL:
        return (
          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1 text-red-500" />
            <span>Sell</span>
          </div>
        )
      case TransactionType.TRANSFER_IN:
        return (
          <div className="flex items-center">
            <ArrowDownLeft className="h-4 w-4 mr-1 text-blue-500" />
            <span>Transfer In</span>
          </div>
        )
      case TransactionType.TRANSFER_OUT:
        return (
          <div className="flex items-center">
            <ArrowUpRight className="h-4 w-4 mr-1 text-orange-500" />
            <span>Transfer Out</span>
          </div>
        )
      case TransactionType.LIST:
        return (
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-1 text-purple-500" />
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
          <Badge variant="outline" className="bg-green-50 dark:bg-transparent text-green-600 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        )
      case TransactionStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-50 dark:bg-transparent text-yellow-600 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case TransactionStatus.FAILED:
        return (
          <Badge variant="outline" className="bg-red-50 dark:bg-transparent text-red-600 border-red-200">
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage your blockchain transaction history
          </p>
          {address && (
            <Badge variant="outline" className="mt-2">
              <Wallet className="h-3 w-3 mr-1" />
              {`${address.slice(0, 6)}...${address.slice(-4)}`}
            </Badge>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Pending Transactions Section */}
      {pendingTransactions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <RotateCw className="h-5 w-5 mr-2 text-primary animate-spin" />
              <h2 className="text-lg font-semibold">Pending Transactions</h2>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Status
            </Button>
          </div>
          
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Asset</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Value</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Submitted</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Tx Hash</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Gas</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pendingTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm">{renderTransactionType(tx.type)}</td>
                      <td className="px-4 py-3 text-sm font-medium">{tx.assetName}</td>
                      <td className="px-4 py-3 text-sm">{tx.value}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{tx.timestamp}</td>
                      <td className="px-4 py-3 text-sm">{formatTxHash(tx.txHash)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{tx.gasUsed}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Transaction History */}
      <div className="mb-4">
        <div className="flex items-center mb-4">
          <Layers className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-lg font-semibold">Transaction History</h2>
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Asset</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Value</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm">{renderTransactionType(tx.type)}</td>
                  <td className="px-4 py-3 text-sm font-medium">{tx.assetName}</td>
                  <td className="px-4 py-3 text-sm">{tx.amount}</td>
                  <td className="px-4 py-3 text-sm font-medium">{tx.value}</td>
                  <td className="px-4 py-3 text-sm">{renderStatus(tx.status)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{tx.timestamp}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="space-y-1">
                      <div>{formatTxHash(tx.txHash)}</div>
                      {tx.blockNumber && (
                        <div className="text-xs text-muted-foreground">
                          {tx.confirmations} confirmations
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {transactions.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
        
        <div className="p-4 border-t border-border flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {transactions.length} transactions
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
