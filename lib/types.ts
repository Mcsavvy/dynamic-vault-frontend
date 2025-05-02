// Blockchain and Web3 related types

export type Address = `0x${string}`;

export interface Chain {
  id: number;
  name: string;
  network: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: {
    default: {
      http: string[];
    };
  };
  blockExplorers: {
    default: {
      name: string;
      url: string;
    };
  };
}

// Asset Types
export enum AssetCategory {
  ART = 'ART',
  COLLECTIBLE = 'COLLECTIBLE',
  REAL_ESTATE = 'REAL_ESTATE',
  LUXURY_GOODS = 'LUXURY_GOODS',
  INVESTMENT = 'INVESTMENT',
  OTHER = 'OTHER',
}

export enum AssetStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SOLD_OUT = 'SOLD_OUT',
  ARCHIVED = 'ARCHIVED',
}

export interface AssetBase {
  id: string;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  category: AssetCategory;
  tokenAddress: Address;
  creator: Address;
  createdAt: string; // ISO date string
  status: AssetStatus;
}

export interface TokenizedAsset extends AssetBase {
  totalSupply: string; // BigNumber string
  availableSupply: string; // BigNumber string
  initialPrice: string; // BigNumber string
  currentPrice: string; // BigNumber string
  priceChangeLast24h: number; // percentage
  confidenceScore: number; // 0-100 
  metadataURI: string;
  chainId: number;
  attributes?: AssetAttribute[];
}

export interface AssetAttribute {
  trait_type: string;
  value: string | number;
}

export interface AssetPriceHistory {
  timestamps: number[];
  prices: string[]; // BigNumber strings
  confidenceScores: number[]; // 0-100
}

// User and Account Types
export interface UserProfile {
  address: Address;
  ensName?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  joinedAt: string; // ISO date string
  isAdmin: boolean;
}

export interface Portfolio {
  totalValueUSD: string;
  assets: PortfolioAsset[];
  performanceLast24h: number; // percentage
  performanceLast7d: number; // percentage
  performanceLast30d: number; // percentage
}

export interface PortfolioAsset {
  asset: TokenizedAsset;
  balance: string; // BigNumber string
  valueUSD: string;
  percentage: number; // percentage of total portfolio
}

// Transaction Types
export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  LIST = 'LIST',
  UNLIST = 'UNLIST',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  FAILED = 'FAILED',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  timestamp: string; // ISO date string
  asset: TokenizedAsset;
  amount: string; // BigNumber string
  pricePerToken: string; // BigNumber string
  totalValue: string; // BigNumber string
  txHash: string;
  from: Address;
  to: Address;
  gas?: string;
  gasPrice?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// UI Types
export interface FilterOptions {
  categories?: AssetCategory[];
  minPrice?: string;
  maxPrice?: string;
  sortBy?: 'price' | 'date' | 'popularity' | 'confidence';
  sortDirection?: 'asc' | 'desc';
}

export interface TimeframeOption {
  label: string;
  value: '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
  intervalSeconds: number;
}
