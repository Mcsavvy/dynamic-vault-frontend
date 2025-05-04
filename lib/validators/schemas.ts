import { z } from 'zod';

// =============================================================================
// Authentication schemas
// =============================================================================
export const nonceRequestSchema = z.object({
  walletAddress: z.string().startsWith('0x').length(42),
});

export const verifySignatureSchema = z.object({
  walletAddress: z.string().startsWith('0x').length(42),
  signature: z.string(),
  message: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// =============================================================================
// User schemas
// =============================================================================
export const userProfileUpdateSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
  notificationPreferences: z
    .object({
      priceUpdates: z.boolean().optional(),
      transactions: z.boolean().optional(),
      marketEvents: z.boolean().optional(),
      emailNotifications: z.boolean().optional(),
    })
    .optional(),
});

export const userRolesUpdateSchema = z.object({
  roles: z.array(z.string()),
});

export const userStatusUpdateSchema = z.object({
  status: z.enum(['active', 'suspended', 'inactive']),
});

export const apiKeyCreateSchema = z.object({
  keyName: z.string().min(3),
  permissions: z.array(z.string()),
  expiresInDays: z.number().int().positive().optional(),
});

// =============================================================================
// Asset schemas
// =============================================================================
export const assetCreateSchema = z.object({
  tokenId: z.number().int().positive(),
  contractAddress: z.string().startsWith('0x'),
  name: z.string().min(1),
  assetType: z.string().min(1),
  description: z.string(),
  currentPrice: z.object({
    value: z.number().positive(),
    valueUsd: z.number().positive(),
  }),
  ownership: z.object({
    currentOwner: z.string().startsWith('0x').length(42),
  }),
});

export const assetMetadataUpdateSchema = z.object({
  assetLocation: z.string().optional(),
  acquisitionDate: z.string().optional(), // Will be parsed as Date
  dimensions: z.string().optional(),
  materials: z.array(z.string()).optional(),
  creator: z.string().optional(),
  creationDate: z.string().optional(), // Will be parsed as Date
  condition: z.string().optional(),
  provenance: z
    .array(
      z.object({
        owner: z.string(),
        period: z.string(),
        documentation: z.string().optional(),
      })
    )
    .optional(),
  certificates: z
    .array(
      z.object({
        type: z.string(),
        issuer: z.string(),
        date: z.string(), // Will be parsed as Date
        fileKey: z.string().optional(),
      })
    )
    .optional(),
  customAttributes: z.record(z.unknown()).optional(),
});

export const assetPriceUpdateSchema = z.object({
  price: z.number().positive(),
  priceUsd: z.number().positive(),
  aiConfidenceScore: z.number().min(0).max(100).optional(),
});

export const assetListingSchema = z.object({
  listingPrice: z.number().positive(),
});

export const assetVerificationSchema = z.object({
  verificationData: z.record(z.unknown()).optional(),
});

export const assetQuerySchema = z.object({
  assetType: z.string().optional(),
  currentOwner: z.string().optional(),
  isListed: z.string().optional().transform(val => val === 'true'), // Convert string to boolean
  priceMin: z.string().optional().transform(val => parseFloat(val || '0')),
  priceMax: z.string().optional().transform(val => parseFloat(val || '0')),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
});

// =============================================================================
// Transaction schemas
// =============================================================================
export const transactionQuerySchema = z.object({
  tokenId: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  assetId: z.string().optional(),
  type: z.string().optional(),
  seller: z.string().optional(),
  buyer: z.string().optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  status: z.string().optional(),
  page: z.string().optional().transform(val => parseInt(val || '1')),
  limit: z.string().optional().transform(val => parseInt(val || '10')),
});

export const mintTransactionSchema = z.object({
  tokenId: z.number().int().positive(),
  minter: z.string().startsWith('0x').length(42),
  transactionHash: z.string().optional(),
  blockNumber: z.number().int().optional(),
});

export const listingTransactionSchema = z.object({
  tokenId: z.number().int().positive(),
  price: z.number().positive(),
  priceUsd: z.number().positive(),
  seller: z.string().startsWith('0x').length(42),
});

export const saleTransactionSchema = z.object({
  tokenId: z.number().int().positive(),
  price: z.number().positive(),
  priceUsd: z.number().positive(),
  seller: z.string().startsWith('0x').length(42),
  buyer: z.string().startsWith('0x').length(42),
  platformFee: z.number().optional(),
  transactionHash: z.string().optional(),
  blockNumber: z.number().int().optional(),
});

export const offerTransactionSchema = z.object({
  tokenId: z.number().int().positive(),
  price: z.number().positive(),
  priceUsd: z.number().positive(),
  seller: z.string().startsWith('0x').length(42),
  buyer: z.string().startsWith('0x').length(42),
});

export const transactionStatusUpdateSchema = z.object({
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
  transactionHash: z.string().optional(),
  blockNumber: z.number().int().optional(),
});

// =============================================================================
// AI Oracle schemas
// =============================================================================
export const predictionSubmitSchema = z.object({
  tokenId: z.number().int().positive(),
  predictedPrice: z.number().positive(),
  confidenceScore: z.number().min(0).max(100),
  dataSourcesUsed: z.array(z.string()),
  modelVersion: z.string(),
  inputs: z
    .object({
      marketData: z.record(z.unknown()).optional(),
      assetSpecific: z.record(z.unknown()).optional(),
      economicIndicators: z.record(z.unknown()).optional(),
      sentimentAnalysis: z.record(z.unknown()).optional(),
    })
    .optional(),
  featureImportance: z.array(
    z.object({
      feature: z.string(),
      importance: z.number().min(0).max(1),
      direction: z.number().min(-1).max(1),
    })
  ),
  performanceMetrics: z
    .object({
      accuracy: z.number().min(0).max(100),
      errorMargin: z.number().positive(),
      calibration: z.number().min(0).max(100),
    })
    .optional(),
});

export const predictionAcceptSchema = z.object({
  predictionId: z.string(),
  transactionHash: z.string().optional(),
  blockNumber: z.number().int().optional(),
});

export const predictionRejectSchema = z.object({
  predictionId: z.string(),
  reason: z.string().optional(),
});

export const oraclePerformanceQuerySchema = z.object({
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
});

// =============================================================================
// Data Source schemas
// =============================================================================
export const dataSourceCreateSchema = z.object({
  name: z.string().min(3),
  type: z.enum(['api', 'file', 'stream']),
  url: z.string().url().optional(),
  description: z.string(),
  configuration: z.object({
    refreshInterval: z.number().int().positive(),
    mapping: z.record(z.unknown()).optional(),
    headers: z.record(z.string()).optional(),
    authentication: z.record(z.string()).optional(),
  }),
  aiWeighting: z.number().min(0).max(1).optional(),
});

export const dataSourceUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  url: z.string().url().optional(),
  description: z.string().optional(),
  configuration: z
    .object({
      refreshInterval: z.number().int().positive().optional(),
      mapping: z.record(z.unknown()).optional(),
      headers: z.record(z.string()).optional(),
      authentication: z.record(z.string()).optional(),
    })
    .optional(),
  aiWeighting: z.number().min(0).max(1).optional(),
});

export const dataSourceStatusSchema = z.object({
  enabled: z.boolean(),
});

export const dataSourceMetricsUpdateSchema = z.object({
  success: z.boolean(),
  latency: z.number().nonnegative(),
  error: z.string().optional(),
});

export const dataSourceAccuracyUpdateSchema = z.object({
  accuracy: z.number().min(0).max(100),
});