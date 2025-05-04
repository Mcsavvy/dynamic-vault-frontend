import mongoose, { Schema, Document, Model } from 'mongoose';

interface ISourceConfiguration {
  refreshInterval: number;
  mapping?: Record<string, unknown>;
  headers?: Record<string, string>;
  authentication?: Record<string, string>;
}

interface ISourceStatus {
  isEnabled: boolean;
  lastFetchAt?: Date;
  nextFetchAt?: Date;
  errorCount: number;
  lastError?: string;
}

interface ISourceMetrics {
  reliability: number;
  latency: number;
  priceAccuracy: number;
}

export interface IDataSource extends Document {
  name: string;
  type: string;
  url?: string;
  description: string;
  configuration: ISourceConfiguration;
  status: ISourceStatus;
  metrics: ISourceMetrics;
  aiWeighting: number;
  createdAt: Date;
  updatedAt: Date;
}

const DataSourceSchema = new Schema<IDataSource>({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true, enum: ['api', 'file', 'stream'] },
  url: { type: String },
  description: { type: String },
  configuration: {
    refreshInterval: { type: Number, required: true, default: 3600 }, // Default 1 hour in seconds
    mapping: { type: Schema.Types.Mixed },
    headers: { type: Schema.Types.Mixed },
    authentication: { type: Schema.Types.Mixed }
  },
  status: {
    isEnabled: { type: Boolean, default: true },
    lastFetchAt: { type: Date },
    nextFetchAt: { type: Date },
    errorCount: { type: Number, default: 0 },
    lastError: { type: String }
  },
  metrics: {
    reliability: { type: Number, min: 0, max: 100, default: 100 },
    latency: { type: Number, default: 0 },
    priceAccuracy: { type: Number, min: 0, max: 100, default: 80 }
  },
  aiWeighting: { type: Number, min: 0, max: 1, default: 0.5 }
}, {
  timestamps: true
});

// Create and export the DataSource model
const DataSource = mongoose.models.DataSource || mongoose.model<IDataSource>('DataSource', DataSourceSchema);

export default DataSource as Model<IDataSource>; 