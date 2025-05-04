import mongoose, { Schema, Document, Model } from 'mongoose';

interface IProvenance {
  owner: string;
  period: string;
  documentation: string;
}

interface ICertificate {
  type: string;
  issuer: string;
  date: Date;
  fileKey: string;
}

interface IAssetMetadata {
  assetLocation?: string;
  acquisitionDate?: Date;
  dimensions?: string;
  materials?: string[];
  creator?: string;
  creationDate?: Date;
  condition?: string;
  provenance?: IProvenance[];
  certificates?: ICertificate[];
  customAttributes?: Record<string, unknown>;
}

interface IAssetMedia {
  thumbnailUrl?: string;
  imageKeys?: string[];
  videoKey?: string;
  documentKeys?: string[];
  modelKey?: string;
}

interface IAssetPrice {
  value: number;
  valueUsd: number;
  updatedAt: Date;
  aiConfidenceScore?: number;
}

interface IMarketStatus {
  isListed: boolean;
  listingPrice?: number;
  listedAt?: Date;
  listedBy?: string;
}

interface IOwnership {
  currentOwner: string;
  ownerSince: Date;
}

interface IVerification {
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationData?: Record<string, unknown>;
}

interface IAssetStats {
  viewCount: number;
  favoriteCount: number;
  offerCount: number;
}

export interface IAsset extends Document {
  tokenId: number;
  contractAddress: string;
  name: string;
  assetType: string;
  description: string;
  metadata: IAssetMetadata;
  media: IAssetMedia;
  currentPrice: IAssetPrice;
  marketStatus: IMarketStatus;
  ownership: IOwnership;
  verification: IVerification;
  stats: IAssetStats;
  createdAt: Date;
  updatedAt: Date;
}

const ProvenanceSchema = new Schema<IProvenance>({
  owner: { type: String, required: true },
  period: { type: String },
  documentation: { type: String }
}, { _id: false });

const CertificateSchema = new Schema<ICertificate>({
  type: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: Date },
  fileKey: { type: String }
}, { _id: false });

const AssetSchema = new Schema<IAsset>({
  tokenId: { type: Number, required: true, unique: true, index: true },
  contractAddress: { type: String, required: true },
  name: { type: String, required: true },
  assetType: { type: String, required: true, index: true },
  description: { type: String },
  metadata: {
    assetLocation: { type: String },
    acquisitionDate: { type: Date },
    dimensions: { type: String },
    materials: [{ type: String }],
    creator: { type: String },
    creationDate: { type: Date },
    condition: { type: String },
    provenance: [ProvenanceSchema],
    certificates: [CertificateSchema],
    customAttributes: { type: Schema.Types.Mixed }
  },
  media: {
    thumbnailUrl: { type: String },
    imageKeys: [{ type: String }],
    videoKey: { type: String },
    documentKeys: [{ type: String }],
    modelKey: { type: String }
  },
  currentPrice: {
    value: { type: Number, required: true, index: true },
    valueUsd: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
    aiConfidenceScore: { type: Number }
  },
  marketStatus: {
    isListed: { type: Boolean, default: false, index: true },
    listingPrice: { type: Number },
    listedAt: { type: Date },
    listedBy: { type: String }
  },
  ownership: {
    currentOwner: { type: String, required: true, index: true },
    ownerSince: { type: Date, required: true }
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    verifiedBy: { type: String },
    verifiedAt: { type: Date },
    verificationData: { type: Schema.Types.Mixed }
  },
  stats: {
    viewCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    offerCount: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Create and export the Asset model
const Asset = mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);

export default Asset as Model<IAsset>; 