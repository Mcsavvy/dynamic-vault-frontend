import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAsset } from './Asset';

interface IFeatureImportance {
  feature: string;
  importance: number;
  direction: number;
}

interface IPerformanceMetrics {
  accuracy: number;
  errorMargin: number;
  calibration: number;
}

interface IOnChainReference {
  transactionHash: string;
  blockNumber: number;
  timestamp: Date;
}

export interface IAiOracleData extends Document {
  _id: mongoose.Types.ObjectId;
  assetId: mongoose.Types.ObjectId | IAsset;
  tokenId: number;
  timestamp: Date;
  predictedPrice: number;
  confidenceScore: number;
  dataSourcesUsed: string[];
  modelVersion: string;
  inputs: {
    marketData?: Record<string, unknown>;
    assetSpecific?: Record<string, unknown>;
    economicIndicators?: Record<string, unknown>;
    sentimentAnalysis?: Record<string, unknown>;
  };
  featureImportance: IFeatureImportance[];
  performanceMetrics?: IPerformanceMetrics;
  status: string;
  onChainReference?: IOnChainReference;
}

const AiOracleDataSchema = new Schema<IAiOracleData>({
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true, index: true },
  tokenId: { type: Number, required: true, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  predictedPrice: { type: Number, required: true },
  confidenceScore: { type: Number, required: true },
  dataSourcesUsed: [{ type: String }],
  modelVersion: { type: String, required: true },
  inputs: {
    marketData: { type: Schema.Types.Mixed },
    assetSpecific: { type: Schema.Types.Mixed },
    economicIndicators: { type: Schema.Types.Mixed },
    sentimentAnalysis: { type: Schema.Types.Mixed }
  },
  featureImportance: [{
    feature: { type: String, required: true },
    importance: { type: Number, required: true },
    direction: { type: Number, required: true }
  }],
  performanceMetrics: {
    accuracy: { type: Number },
    errorMargin: { type: Number },
    calibration: { type: Number }
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'submitted', 'rejected', 'accepted'],
    default: 'pending',
    index: true 
  },
  onChainReference: {
    transactionHash: { type: String },
    blockNumber: { type: Number },
    timestamp: { type: Date }
  }
});

// Create compound indexes for efficient queries
AiOracleDataSchema.index({ tokenId: 1, timestamp: -1 });
AiOracleDataSchema.index({ assetId: 1, timestamp: -1 });

// Create and export the AiOracleData model
const AiOracleData = mongoose.models.AiOracleData || mongoose.model<IAiOracleData>('AiOracleData', AiOracleDataSchema);

export default AiOracleData as Model<IAiOracleData>; 