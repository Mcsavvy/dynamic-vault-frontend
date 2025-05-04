import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './User';

export interface ISession extends Document {
  _id: mongoose.ObjectId;
  userId: mongoose.Types.ObjectId | IUser;
  walletAddress: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  isValid: boolean;
}

const SessionSchema = new Schema<ISession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  walletAddress: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  isValid: { type: Boolean, default: true }
});

// Create indexes
SessionSchema.index({ userId: 1 });
SessionSchema.index({ token: 1 });
SessionSchema.index({ expiresAt: 1 });

// Create and export the Session model
const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);

export default Session as Model<ISession>; 