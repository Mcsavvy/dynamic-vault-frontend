import Session, { ISession } from '../models/Session';
import User from '../models/User';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { utils } from 'ethers';
import { userService } from './userService';
import ms from 'ms';

// Environment variables for JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = ms(process.env.REFRESH_TOKEN_EXPIRY || '2h');

interface TokenPayload {
  walletAddress: string;
  roles: string[];
  sessionId: string;
}

/**
 * Service for handling authentication and sessions
 */
export const authService = {
  /**
   * Verify an Ethereum signed message
   */
  verifySignature(
    message: string,
    signature: string,
    walletAddress: string
  ): boolean {
    try {
      // Recover the address that signed the message
      const recoveredAddress = utils.verifyMessage(message, signature);
      
      // Check if the recovered address matches the claimed wallet address
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  },

  /**
   * Create a new session for a user
   */
  async createSession(
    walletAddress: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ token: string; refreshToken: string }> {
    const user = await userService.findByWalletAddress(walletAddress);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Update last login time
    await userService.updateLastLogin(walletAddress);

    // Create a new session
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY);
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = new Session({
      userId: user._id,
      walletAddress,
      token: hashedRefreshToken,
      createdAt: new Date(),
      expiresAt,
      ipAddress,
      userAgent,
      isValid: true
    });

    await session.save();

    // Generate JWT access token
    const payload: TokenPayload = {
      walletAddress,
      roles: user.roles,
      sessionId: session._id.toString()
    };

    const token = jwt.sign(payload, JWT_SECRET as jwt.Secret, {
        expiresIn: JWT_EXPIRY,
        algorithm: "HS256"
    });

    return { token, refreshToken };
  },

  /**
   * Refresh a user's session and generate a new access token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string } | null> {
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    // Find the session
    const session = await Session.findOne({
      token: hashedRefreshToken,
      expiresAt: { $gt: new Date() },
      isValid: true
    });

    if (!session) {
      return null;
    }

    // Get the user
    const user = await User.findById(session.userId);
    
    if (!user) {
      return null;
    }

    // Generate a new JWT token
    const payload: TokenPayload = {
      walletAddress: user.walletAddress,
      roles: user.roles,
      sessionId: session._id.toString()
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY
    });

    return { token };
  },

  /**
   * Invalidate a session (logout)
   */
  async logout(sessionId: string): Promise<boolean> {
    const result = await Session.updateOne(
      { _id: sessionId },
      { $set: { isValid: false } }
    );

    return result.modifiedCount > 0;
  },

  /**
   * Invalidate all sessions for a user
   */
  async logoutAll(walletAddress: string): Promise<boolean> {
    const result = await Session.updateMany(
      { walletAddress },
      { $set: { isValid: false } }
    );

    return result.modifiedCount > 0;
  },

  /**
   * Verify and decode a JWT token
   */
  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  },

  /**
   * Get active sessions for a user
   */
  async getActiveSessions(walletAddress: string): Promise<ISession[]> {
    return Session.find({
      walletAddress,
      expiresAt: { $gt: new Date() },
      isValid: true
    }).sort({ createdAt: -1 });
  },
  
  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await Session.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isValid: false }
      ]
    });

    return result.deletedCount || 0;
  }
}; 