import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAsset } from './Asset';

interface IBlockchainData {
  transactionHash: string;
  blockNumber: number;
  gasUsed?: number;
  gasPriceWei?: number;
}

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  type: string;
  tokenId: number;
  assetId: mongoose.Types.ObjectId | IAsset;
  price?: number;
  priceUsd?: number;
  seller?: string;
  buyer?: string;
  timestamp: Date;
  blockchain?: IBlockchainData;
  status: string;
  platformFee?: number;
  paymentMethod: string;
}

const TransactionSchema = new Schema<ITransaction>({
  type: { 
    type: String, 
    required: true, 
    enum: ['mint', 'list', 'buy', 'sell', 'delist', 'transfer', 'offer', 'offer_accept', 'offer_reject'] 
  },
  tokenId: { type: Number, required: true, index: true },
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true, index: true },
  price: { type: Number },
  priceUsd: { type: Number },
  seller: { type: String, index: true },
  buyer: { type: String, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  blockchain: {
    transactionHash: { type: String, unique: true, sparse: true, index: true },
    blockNumber: { type: Number },
    gasUsed: { type: Number },
    gasPriceWei: { type: Number }
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  platformFee: { type: Number },
  paymentMethod: { type: String, default: 'eth' }
});

// Create and export the Transaction model
const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction as Model<ITransaction>; 