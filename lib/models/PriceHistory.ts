import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAsset } from './Asset';

interface IPriceFactor {
  name: string;
  weight: number;
  impact: number;
}

interface ISource {
  type: string;
  dataSourceName?: string;
  modelVersion?: string;
}

interface IAiMetrics {
  confidenceScore: number;
  factors?: IPriceFactor[];
}

interface IBlockchain {
  transactionHash?: string;
  blockNumber?: number;
  timestamp?: Date;
}

export interface IPriceHistory extends Document {
  _id: mongoose.Types.ObjectId;
  assetId: mongoose.Types.ObjectId | IAsset;
  tokenId: number;
  price: number;
  priceUsd: number;
  timestamp: Date;
  source: ISource;
  aiMetrics?: IAiMetrics;
  blockchain?: IBlockchain;
}

const PriceFactorSchema = new Schema<IPriceFactor>({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  impact: { type: Number, required: true }
}, { _id: false });

const PriceHistorySchema = new Schema<IPriceHistory>({
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true, index: true },
  tokenId: { type: Number, required: true, index: true },
  price: { type: Number, required: true },
  priceUsd: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  source: {
    type: { type: String, required: true, enum: ['ai-oracle', 'user-listing', 'sale', 'manual'] },
    dataSourceName: { type: String },
    modelVersion: { type: String }
  },
  aiMetrics: {
    confidenceScore: { type: Number },
    factors: [PriceFactorSchema]
  },
  blockchain: {
    transactionHash: { type: String },
    blockNumber: { type: Number },
    timestamp: { type: Date }
  }
});

// Create compound index for quick historical queries
PriceHistorySchema.index({ tokenId: 1, timestamp: -1 });
PriceHistorySchema.index({ assetId: 1, timestamp: -1 });

// Create and export the PriceHistory model
const PriceHistory = mongoose.models.PriceHistory || mongoose.model<IPriceHistory>('PriceHistory', PriceHistorySchema);

export default PriceHistory as Model<IPriceHistory>; 