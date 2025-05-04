import User, { IUser } from '../models/User';
import crypto from 'crypto';

/**
 * Service for managing users
 */
export const userService = {
  /**
   * Find a user by wallet address
   */
  async findByWalletAddress(walletAddress: string): Promise<IUser | null> {
    return await User.findOne({ walletAddress });
  },

  /**
   * Create a new user
   */
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    // Generate a nonce that expires in 1 hour
    const nonce = crypto.randomBytes(32).toString('hex');
    const nonceExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    const newUser = new User({
      ...userData,
      nonce,
      nonceExpiry,
      roles: ['user'],
      status: 'active',
      createdAt: new Date()
    });

    return await newUser.save();
  },

  /**
   * Generate a new nonce for a user
   */
  async generateNonce(walletAddress: string): Promise<string> {
    const nonce = crypto.randomBytes(32).toString('hex');
    const nonceExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await User.findOneAndUpdate(
      { walletAddress },
      { 
        $set: { 
          nonce, 
          nonceExpiry 
        }
      },
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return nonce;
  },

  /**
   * Update user profile information
   */
  async updateProfile(
    walletAddress: string, 
    profileInfo: IUser['profileInfo']
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { walletAddress },
      { $set: { profileInfo } },
      { new: true }
    );
  },

  /**
   * Update user's last login time
   */
  async updateLastLogin(walletAddress: string): Promise<void> {
    await User.updateOne(
      { walletAddress },
      { $set: { lastLogin: new Date() } }
    );
  },

  /**
   * Add an API key for a user (primarily for oracles and admins)
   */
  async addApiKey(
    walletAddress: string, 
    keyName: string, 
    permissions: string[],
    expiresInDays: number = 30
  ): Promise<string> {
    const apiKey = crypto.randomBytes(32).toString('hex');
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await User.updateOne(
      { walletAddress },
      {
        $push: {
          apiKeys: {
            key: hashedKey,
            name: keyName,
            permissions,
            createdAt: new Date(),
            expiresAt,
          }
        }
      }
    );

    return apiKey; // Return the unhashed key to the caller
  },

  /**
   * Remove an API key from a user
   */
  async removeApiKey(walletAddress: string, keyName: string): Promise<boolean> {
    const result = await User.updateOne(
      { walletAddress },
      { $pull: { apiKeys: { name: keyName } } }
    );

    return result.modifiedCount > 0;
  },

  /**
   * Set or update user roles
   */
  async setRoles(walletAddress: string, roles: string[]): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { walletAddress },
      { $set: { roles } },
      { new: true }
    );
  },

  /**
   * Update user status (active, suspended, etc.)
   */
  async updateStatus(walletAddress: string, status: string): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { walletAddress },
      { $set: { status } },
      { new: true }
    );
  }
};
