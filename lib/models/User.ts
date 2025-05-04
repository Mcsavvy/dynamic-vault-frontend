import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApiKey {
  key: string;
  name: string;
  permissions: string[];
  createdAt: Date;
  expiresAt: Date;
  lastUsed: Date;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  walletAddress: string;
  nonce: string;
  nonceExpiry: Date;
  createdAt: Date;
  lastLogin: Date;
  roles: string[];
  profileInfo?: {
    username?: string;
    email?: string;
    avatarUrl?: string;
    notificationPreferences?: {
      priceUpdates: boolean;
      transactions: boolean;
      marketEvents: boolean;
      emailNotifications: boolean;
    };
  };
  apiKeys: IApiKey[];
  status: string;
}

const ApiKeySchema = new Schema<IApiKey>({
  key: { type: String, required: true },
  name: { type: String, required: true },
  permissions: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  lastUsed: { type: Date }
});

const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, required: true, unique: true, index: true },
  nonce: { type: String, required: true, index: true },
  nonceExpiry: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  roles: [{ type: String, enum: ['user', 'admin', 'oracle'] }],
  profileInfo: {
    username: { type: String },
    email: { type: String },
    avatarUrl: { type: String },
    notificationPreferences: {
      priceUpdates: { type: Boolean, default: true },
      transactions: { type: Boolean, default: true },
      marketEvents: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: false }
    }
  },
  apiKeys: [ApiKeySchema],
  status: { type: String, enum: ['active', 'suspended', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

// Create and export the User model
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User as Model<IUser>; 