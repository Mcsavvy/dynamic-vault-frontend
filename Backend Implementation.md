# DynamicVault Backend Implementation Plan: MongoDB and S3 Storage

## 1. Overview

This document outlines the implementation plan for the DynamicVault backend using MongoDB for database functionality and S3-compatible storage for asset files. The system will primarily focus on wallet-based authentication, where one wallet corresponds to one user, and provide comprehensive data storage capabilities for the DynamicVault platform.

## 2. Authentication System

### 2.1 User Authentication Flow

1. **Sign-In with Ethereum (SIWE)** 
   - User requests a nonce from the backend
   - User signs a standard SIWE message containing the nonce using their wallet
   - Backend verifies the signature and issues a JWT token

### 2.2 MongoDB Authentication Schema

```javascript
// users collection
{
  _id: ObjectId,               // MongoDB auto-generated ID
  walletAddress: String,       // Primary identifier (indexed, unique)
  nonce: String,               // Random string for signature verification
  nonceExpiry: Date,           // Expiration time for security
  createdAt: Date,             // Account creation timestamp
  lastLogin: Date,             // Most recent authentication
  roles: [String],             // Array of roles ("user", "admin", "oracle")
  profileInfo: {               // Optional user profile information
    username: String,          // Optional display name
    email: String,             // Optional email (for notifications)
    avatarUrl: String,         // Profile picture reference
    notificationPreferences: { // User notification settings
      priceUpdates: Boolean,
      transactions: Boolean,
      marketEvents: Boolean,
      emailNotifications: Boolean
    }
  },
  apiKeys: [{                  // For developer/oracle access
    key: String,               // Hashed API key
    name: String,              // Key identifier
    permissions: [String],     // Specific permissions
    createdAt: Date,
    expiresAt: Date,
    lastUsed: Date
  }],
  status: String               // "active", "suspended", etc.
}

// sessions collection
{
  _id: ObjectId,
  userId: ObjectId,            // Reference to users collection
  walletAddress: String,       // Redundant for quick lookups
  token: String,               // Hashed JWT token
  createdAt: Date,
  expiresAt: Date,
  ipAddress: String,           // For security logging
  userAgent: String,           // For security logging
  isValid: Boolean             // Can be set to false to invalidate
}
```

### 2.3 Authentication API Endpoints

1. **Request Nonce**
   - `GET /api/auth/nonce?walletAddress={address}`
   - Returns a unique nonce for the wallet to sign

2. **Verify Signature**
   - `POST /api/auth/verify`
   - Body: `{ walletAddress, signature, message }`
   - Verifies the signature and issues JWT token

3. **Refresh Token**
   - `POST /api/auth/refresh`
   - Uses secure HTTP-only cookie for token refresh

4. **Logout**
   - `POST /api/auth/logout`
   - Invalidates the current session

## 3. Data Storage Design

### 3.1 MongoDB Collections Structure

#### 3.1.1 Asset Collection
```javascript
// assets collection
{
  _id: ObjectId,                // MongoDB auto-generated ID
  tokenId: Number,              // On-chain token ID (indexed)
  contractAddress: String,      // Smart contract address
  name: String,                 // Asset name
  assetType: String,            // E.g., "Art", "Collectible", "Real Estate"
  description: String,          // Full asset description
  metadata: {                   // Extended metadata
    assetLocation: String,      // Physical location of the asset
    acquisitionDate: Date,      // When the asset was acquired
    dimensions: String,         // Physical dimensions if applicable
    materials: [String],        // Materials used
    creator: String,            // Original creator/artist
    creationDate: Date,         // When the asset was created
    condition: String,          // Asset condition
    provenance: [{              // Ownership history
      owner: String,            // Previous owner
      period: String,           // Time period of ownership
      documentation: String     // Reference to documentation
    }],
    certificates: [{            // Authenticity certificates
      type: String,             // Certificate type
      issuer: String,           // Who issued the certificate
      date: Date,               // When it was issued
      fileKey: String           // Reference to S3 document
    }],
    customAttributes: Object    // Asset-type specific attributes
  },
  media: {                      // Media references
    thumbnailUrl: String,       // S3 key for thumbnail
    imageKeys: [String],        // Array of S3 keys for images
    videoKey: String,           // S3 key for video if applicable
    documentKeys: [String],     // S3 keys for related documents
    modelKey: String            // S3 key for 3D model if applicable
  },
  currentPrice: {
    value: Number,              // Current price in ETH
    valueUsd: Number,           // USD equivalent
    updatedAt: Date,            // Last price update
    aiConfidenceScore: Number   // AI confidence in price (0-100)
  },
  marketStatus: {
    isListed: Boolean,          // Whether currently for sale
    listingPrice: Number,       // If listed, at what price
    listedAt: Date,             // When it was listed
    listedBy: String            // Wallet address of lister
  },
  ownership: {
    currentOwner: String,       // Wallet address of current owner
    ownerSince: Date            // Since when
  },
  verification: {
    isVerified: Boolean,        // Whether verified by platform
    verifiedBy: String,         // Who verified it
    verifiedAt: Date,           // When verified
    verificationData: Object    // Additional verification info
  },
  stats: {
    viewCount: Number,          // Analytics metrics
    favoriteCount: Number,
    offerCount: Number
  },
  createdAt: Date,              // When token was minted
  updatedAt: Date               // Last metadata update
}
```

#### 3.1.2 Price History Collection
```javascript
// priceHistory collection
{
  _id: ObjectId,
  assetId: ObjectId,           // Reference to assets collection
  tokenId: Number,             // On-chain token ID (indexed)
  price: Number,               // Price in ETH
  priceUsd: Number,            // USD equivalent at the time
  timestamp: Date,             // When the price was set
  source: {
    type: String,              // "ai-oracle", "user-listing", "sale", etc.
    dataSourceName: String,    // Name of the data source
    modelVersion: String       // AI model version if applicable
  },
  aiMetrics: {
    confidenceScore: Number,   // AI confidence (0-100)
    factors: [{                // Factors influencing the price
      name: String,            // Factor name
      weight: Number,          // Factor weight
      impact: Number           // Factor impact on price
    }]
  },
  blockchain: {
    transactionHash: String,   // On-chain transaction hash if applicable
    blockNumber: Number,       // Block number
    timestamp: Date            // Block timestamp
  }
}
```

#### 3.1.3 Transactions Collection
```javascript
// transactions collection
{
  _id: ObjectId,
  type: String,                // "mint", "list", "buy", "sell", "delist", etc.
  tokenId: Number,             // On-chain token ID (indexed)
  assetId: ObjectId,           // Reference to assets collection
  price: Number,               // Price in ETH
  priceUsd: Number,            // USD equivalent at the time
  seller: String,              // Wallet address of seller
  buyer: String,               // Wallet address of buyer
  timestamp: Date,             // When the transaction occurred
  blockchain: {
    transactionHash: String,   // On-chain transaction hash
    blockNumber: Number,       // Block number
    gasUsed: Number,           // Gas used
    gasPriceWei: Number        // Gas price in wei
  },
  status: String,              // "pending", "completed", "failed"
  platformFee: Number,         // Platform fee in ETH
  paymentMethod: String        // "eth", etc.
}
```

#### 3.1.4 AI Oracle Data Collection
```javascript
// aiOracleData collection
{
  _id: ObjectId,
  assetId: ObjectId,           // Reference to assets collection
  tokenId: Number,             // On-chain token ID
  timestamp: Date,             // When prediction was made
  predictedPrice: Number,      // AI's price prediction in ETH
  confidenceScore: Number,     // Confidence in prediction (0-100)
  dataSourcesUsed: [String],   // Names of data sources used
  modelVersion: String,        // Version of AI model
  inputs: {                    // Raw data used for prediction
    marketData: Object,        // Market-related inputs
    assetSpecific: Object,     // Asset-specific inputs
    economicIndicators: Object,// Economic indicators
    sentimentAnalysis: Object  // Sentiment analysis results
  },
  featureImportance: [{        // How each feature influenced price
    feature: String,           // Feature name
    importance: Number,        // Relative importance (0-1)
    direction: Number          // Positive or negative influence
  }],
  performanceMetrics: {        // Model performance metrics
    accuracy: Number,          // How accurate was prediction
    errorMargin: Number,       // Error margin
    calibration: Number        // Confidence calibration
  },
  status: String,              // "pending", "submitted", "rejected", "accepted"
  onChainReference: {
    transactionHash: String,   // Transaction hash if submitted on-chain
    blockNumber: Number,       // Block number
    timestamp: Date            // Block timestamp
  }
}
```

#### 3.1.5 Data Sources Collection
```javascript
// dataSources collection
{
  _id: ObjectId,
  name: String,                // Data source name
  type: String,                // "api", "file", "stream"
  url: String,                 // Source URL if applicable
  description: String,         // Description of the source
  configuration: {
    refreshInterval: Number,   // How often to fetch (seconds)
    mapping: Object,           // Field mapping configuration
    headers: Object,           // API headers
    authentication: Object     // Authentication details (encrypted)
  },
  status: {
    isEnabled: Boolean,        // Whether currently active
    lastFetchAt: Date,         // Last successful fetch
    nextFetchAt: Date,         // Next scheduled fetch
    errorCount: Number,        // Consecutive errors
    lastError: String          // Last error message
  },
  metrics: {
    reliability: Number,       // Reliability score (0-100)
    latency: Number,           // Average latency in ms
    priceAccuracy: Number      // Price accuracy score
  },
  aiWeighting: Number,         // Weight in AI model (0-1)
  createdAt: Date,
  updatedAt: Date
}
```

#### 3.1.6 Indexes

Essential MongoDB indexes for performance:

```javascript
// User collection indexes
db.users.createIndex({ "walletAddress": 1 }, { unique: true })
db.users.createIndex({ "apiKeys.key": 1 })
db.users.createIndex({ "nonce": 1 })

// Asset collection indexes
db.assets.createIndex({ "tokenId": 1 }, { unique: true })
db.assets.createIndex({ "ownership.currentOwner": 1 })
db.assets.createIndex({ "assetType": 1 })
db.assets.createIndex({ "marketStatus.isListed": 1 })
db.assets.createIndex({ "currentPrice.value": 1 })

// Price history indexes
db.priceHistory.createIndex({ "tokenId": 1, "timestamp": -1 })
db.priceHistory.createIndex({ "assetId": 1, "timestamp": -1 })

// Transactions indexes
db.transactions.createIndex({ "tokenId": 1 })
db.transactions.createIndex({ "seller": 1 })
db.transactions.createIndex({ "buyer": 1 })
db.transactions.createIndex({ "blockchain.transactionHash": 1 }, { unique: true })
db.transactions.createIndex({ "timestamp": -1 })

// AI Oracle indexes
db.aiOracleData.createIndex({ "tokenId": 1, "timestamp": -1 })
db.aiOracleData.createIndex({ "assetId": 1, "timestamp": -1 })
db.aiOracleData.createIndex({ "status": 1 })
```

### 3.2 S3-Compatible Storage Structure

#### 3.2.1 Bucket Organization

```
dynamicvault-assets/
  ├── images/
  │   ├── originals/
  │   │   └── {tokenId}/
  │   │       ├── primary.jpg
  │   │       ├── angle1.jpg
  │   │       └── detail1.jpg
  │   ├── thumbnails/
  │   │   └── {tokenId}/
  │   │       ├── thumbnail-sm.jpg
  │   │       ├── thumbnail-md.jpg
  │   │       └── thumbnail-lg.jpg
  │   └── processed/
  │       └── {tokenId}/
  │           ├── watermarked.jpg
  │           └── preview.jpg
  ├── documents/
  │   └── {tokenId}/
  │       ├── certificates/
  │       │   ├── authenticity.pdf
  │       │   └── appraisal.pdf
  │       ├── legal/
  │       │   └── ownership_transfer.pdf
  │       └── metadata/
  │           └── extended_metadata.json
  ├── models/
  │   └── {tokenId}/
  │       ├── 3d-model.glb
  │       └── textures/
  │           ├── diffuse.jpg
  │           └── normal.jpg
  ├── videos/
  │   └── {tokenId}/
  │       ├── preview.mp4
  │       └── full_rotation.mp4
  └── user-uploads/
      └── {walletAddress}/
          ├── profile/
          │   └── avatar.jpg
          └── temp/
              └── pending_upload.jpg
```

#### 3.2.2 File Naming Conventions

- All files should follow a consistent naming pattern: `{tokenId}_{purpose}_{timestamp}.{extension}`
- Thumbnails: `{tokenId}_thumb_{size}.{extension}`
- Versioned files: `{tokenId}_{purpose}_v{version}.{extension}`

#### 3.2.3 Access Control

- **Public Access**: Thumbnails, preview images, public metadata
- **Authenticated Access**: High-resolution images, detailed documentation
- **Admin-Only Access**: Original unprocessed files, verification documents

#### 3.2.4 Lifecycle Policies

- Temporary uploads: Delete after 24 hours if not processed
- Processing cache: Delete after 7 days
- Archive infrequently accessed files after 90 days

## 4. API Endpoints

### 4.1 Asset Management Endpoints

1. **Get All Assets**
   - `GET /api/assets`
   - Query parameters for filtering, sorting, pagination
   - Returns paginated list of assets with basic metadata

2. **Get Asset Details**
   - `GET /api/assets/{tokenId}`
   - Returns complete asset details including media URLs

3. **Get Asset Price History**
   - `GET /api/assets/{tokenId}/price-history`
   - Returns price history with timestamps and AI confidence scores

4. **Get User Assets**
   - `GET /api/users/{walletAddress}/assets`
   - Returns assets owned by a specific wallet address

5. **Update Asset Metadata**
   - `PATCH /api/assets/{tokenId}/metadata`
   - Updates off-chain metadata for an asset

### 4.2 Media Handling Endpoints

1. **Upload Asset Images**
   - `POST /api/assets/{tokenId}/images`
   - Multipart form for uploading multiple images

2. **Upload Asset Documents**
   - `POST /api/assets/{tokenId}/documents`
   - Uploads certificates, legal documents, etc.

3. **Generate Presigned URL**
   - `POST /api/storage/presigned-url`
   - Generates temporary direct upload URL for large files

4. **Process Uploaded Media**
   - `POST /api/assets/{tokenId}/process-media`
   - Triggers processing pipeline for uploaded media

### 4.3 Oracle and Price Update Endpoints

1. **Submit Price Prediction**
   - `POST /api/oracle/price-prediction`
   - Submits new AI price prediction for an asset

2. **Get AI Prediction Details**
   - `GET /api/oracle/predictions/{predictionId}`
   - Returns detailed information about a specific prediction

3. **Get AI Model Performance**
   - `GET /api/oracle/performance`
   - Returns performance metrics for the AI pricing model

### 4.4 Transaction and Market Endpoints

1. **Get Transaction History**
   - `GET /api/transactions`
   - Returns paginated list of platform transactions

2. **Get User Transactions**
   - `GET /api/users/{walletAddress}/transactions`
   - Returns transactions for a specific wallet

3. **Get Market Stats**
   - `GET /api/market/stats`
   - Returns platform-wide market statistics

4. **Get Active Listings**
   - `GET /api/market/listings`
   - Returns currently active marketplace listings

## 5. Implementation Phases

### Phase 1: Core Infrastructure Setup
1. Set up MongoDB Atlas cluster with appropriate scaling
2. Configure S3-compatible storage with proper bucket structure
3. Implement basic security policies and access controls
4. Set up monitoring and logging infrastructure

### Phase 2: Authentication System
1. Implement SIWE authentication flow
2. Create JWT token management system
3. Develop user and session management
4. Implement role-based access control

### Phase 3: Data Storage Implementation
1. Create MongoDB schemas and indexes
2. Implement S3 storage integration
3. Develop file upload/retrieval services
4. Implement backup and recovery procedures

### Phase 4: API Development
1. Develop core CRUD endpoints for assets
2. Implement user portfolio management
3. Create transaction history endpoints
4. Develop AI oracle integration endpoints

### Phase 5: Advanced Features and Optimization
1. Implement caching strategy with Redis
2. Optimize database queries and indexes
3. Develop comprehensive analytics
4. Implement webhook system for notifications

## 6. Security Considerations

### 6.1 Data Protection
- Encrypt sensitive data at rest (MongoDB field-level encryption)
- Implement proper S3 bucket policies and encryption
- Set up proper IAM roles with least privilege principle
- Regular security audits and penetration testing

### 6.2 Access Control
- JWT token with short expiry (15 minutes)
- Implement refresh token rotation
- IP-based rate limiting
- API key management for service-to-service communication

### 6.3 Blockchain Security
- Signature verification for all blockchain-related operations
- Multi-factor authentication for admin operations
- Secure storage of private keys in a vault service
- Monitoring system for suspicious blockchain activities

## 7. Scalability Considerations

### 7.1 Database Scaling
- MongoDB Atlas with auto-scaling capabilities
- Implement MongoDB sharding for horizontal scaling
- Use read replicas for high-read workloads
- Implement proper indexing strategy

### 7.2 Storage Scaling
- Use S3 lifecycle policies for cost optimization
- Implement CDN for frequently accessed media
- Image processing pipeline optimization
- Automatic scaling of storage resources

### 7.3 API Performance
- Implement Redis caching for frequently accessed data
- API request rate limiting and throttling
- Pagination for large data sets
- Background processing for resource-intensive operations

## 8. Monitoring and Maintenance

### 8.1 Monitoring Setup
- MongoDB Atlas monitoring tools
- S3 storage metrics and alerts
- API performance monitoring
- Error tracking and alerting system

### 8.2 Backup Strategy
- Daily automated MongoDB backups with point-in-time recovery
- S3 versioning for critical assets
- Cross-region replication for disaster recovery
- Regular backup restoration tests

### 8.3 Maintenance Procedures
- Scheduled database maintenance windows
- Index optimization and cleanup
- Storage analytics and optimization
- Performance tuning based on usage patterns

## 9. Required DevOps Infrastructure

1. **CI/CD Pipeline**
   - Automated testing for database schemas and API endpoints
   - Deployment automation with rollback capability
   - Infrastructure as Code (IaC) for environment consistency

2. **Environment Configuration**
   - Development, Staging, and Production environments
   - Feature flags for controlled rollouts
   - Configuration management system

3. **Monitoring Stack**
   - Database monitoring tools
   - API performance monitoring
   - Error tracking and alerting system
   - Custom dashboards for key metrics

4. **Backup and Recovery**
   - Automated backup system
   - Recovery testing procedures
   - Disaster recovery documentation

## 10. Conclusion

This implementation plan provides a comprehensive approach to building the DynamicVault backend using MongoDB and S3-compatible storage. The system is designed to support wallet-based authentication, robust data storage, and scalable performance for the DynamicVault platform. 

The modular approach allows for phased implementation, starting with core infrastructure and gradually adding more advanced features. By following this plan, the development team can efficiently build a secure, scalable, and high-performance backend for the DynamicVault platform.