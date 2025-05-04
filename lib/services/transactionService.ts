import Transaction, { ITransaction } from '../models/Transaction';
import { assetService } from './assetService';
import mongoose from 'mongoose';

export interface TransactionFilterOptions {
  tokenId?: number;
  assetId?: string;
  type?: string;
  seller?: string;
  buyer?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  page?: number;
  limit?: number;
}

/**
 * Service for managing transactions
 */
export const transactionService = {
  /**
   * Get transactions with filtering options
   */
  async getTransactions(options: TransactionFilterOptions = {}): Promise<{
    transactions: ITransaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      tokenId,
      assetId,
      type,
      seller,
      buyer,
      startDate,
      endDate,
      status,
      page = 1,
      limit = 10
    } = options;

    // Build filter
    const filter: Record<string, unknown> = {};

    if (tokenId) {
      filter.tokenId = tokenId;
    }

    if (assetId) {
      filter.assetId = new mongoose.Types.ObjectId(assetId);
    }

    if (type) {
      filter.type = type;
    }

    if (seller) {
      filter.seller = seller;
    }

    if (buyer) {
      filter.buyer = buyer;
    }

    if (status) {
      filter.status = status;
    }

    // Date range filtering
    if (startDate || endDate) {
      filter.timestamp = {};
      
      if (startDate) {
        (filter.timestamp as Record<string, Date>).$gte = startDate;
      }
      
      if (endDate) {
        (filter.timestamp as Record<string, Date>).$lte = endDate;
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('assetId', 'name contractAddress'),
      Transaction.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      transactions,
      total,
      page,
      totalPages
    };
  },

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string): Promise<ITransaction | null> {
    return Transaction.findById(transactionId).populate('assetId');
  },

  /**
   * Get transactions for a specific token
   */
  async getTransactionsByTokenId(tokenId: number): Promise<ITransaction[]> {
    return Transaction.find({ tokenId }).sort({ timestamp: -1 });
  },

  /**
   * Get transactions for a specific user (buyer or seller)
   */
  async getTransactionsByUser(walletAddress: string): Promise<ITransaction[]> {
    return Transaction.find({
      $or: [
        { seller: walletAddress },
        { buyer: walletAddress }
      ]
    }).sort({ timestamp: -1 });
  },

  /**
   * Record a new mint transaction
   */
  async recordMint(
    tokenId: number,
    minter: string,
    transactionHash?: string,
    blockNumber?: number
  ): Promise<ITransaction> {
    const asset = await assetService.getAssetByTokenId(tokenId);
    
    if (!asset) {
      throw new Error(`Asset with token ID ${tokenId} not found`);
    }

    const transaction = new Transaction({
      type: 'mint',
      tokenId,
      assetId: asset._id,
      buyer: minter,
      timestamp: new Date(),
      status: 'completed',
      paymentMethod: 'eth'
    });

    // Add blockchain data if available
    if (transactionHash && blockNumber) {
      transaction.blockchain = {
        transactionHash,
        blockNumber
      };
    }

    return await transaction.save();
  },

  /**
   * Record a listing transaction
   */
  async recordListing(
    tokenId: number,
    price: number,
    priceUsd: number,
    seller: string
  ): Promise<ITransaction> {
    const asset = await assetService.getAssetByTokenId(tokenId);
    
    if (!asset) {
      throw new Error(`Asset with token ID ${tokenId} not found`);
    }

    // Update the asset's market status
    await assetService.listAssetForSale(tokenId, price, seller);

    // Create the transaction record
    const transaction = new Transaction({
      type: 'list',
      tokenId,
      assetId: asset._id,
      price,
      priceUsd,
      seller,
      timestamp: new Date(),
      status: 'completed',
      paymentMethod: 'eth'
    });

    return await transaction.save();
  },

  /**
   * Record a delisting transaction
   */
  async recordDelisting(
    tokenId: number,
    seller: string
  ): Promise<ITransaction> {
    const asset = await assetService.getAssetByTokenId(tokenId);
    
    if (!asset) {
      throw new Error(`Asset with token ID ${tokenId} not found`);
    }

    // Update the asset's market status
    await assetService.delistAsset(tokenId);

    // Create the transaction record
    const transaction = new Transaction({
      type: 'delist',
      tokenId,
      assetId: asset._id,
      seller,
      timestamp: new Date(),
      status: 'completed',
      paymentMethod: 'eth'
    });

    return await transaction.save();
  },

  /**
   * Record a sale/purchase transaction
   */
  async recordSale(
    tokenId: number,
    price: number,
    priceUsd: number,
    seller: string,
    buyer: string,
    platformFee?: number,
    transactionHash?: string,
    blockNumber?: number
  ): Promise<ITransaction> {
    const asset = await assetService.getAssetByTokenId(tokenId);
    
    if (!asset) {
      throw new Error(`Asset with token ID ${tokenId} not found`);
    }

    // Update asset ownership
    await assetService.transferAssetOwnership(tokenId, buyer);

    // Create the transaction record
    const transaction = new Transaction({
      type: 'sell',
      tokenId,
      assetId: asset._id,
      price,
      priceUsd,
      seller,
      buyer,
      platformFee,
      timestamp: new Date(),
      status: 'completed',
      paymentMethod: 'eth'
    });

    // Add blockchain data if available
    if (transactionHash && blockNumber) {
      transaction.blockchain = {
        transactionHash,
        blockNumber
      };
    }

    return await transaction.save();
  },

  /**
   * Record an offer
   */
  async recordOffer(
    tokenId: number,
    price: number,
    priceUsd: number,
    seller: string,
    buyer: string
  ): Promise<ITransaction> {
    const asset = await assetService.getAssetByTokenId(tokenId);
    
    if (!asset) {
      throw new Error(`Asset with token ID ${tokenId} not found`);
    }

    const transaction = new Transaction({
      type: 'offer',
      tokenId,
      assetId: asset._id,
      price,
      priceUsd,
      seller,
      buyer,
      timestamp: new Date(),
      status: 'pending',
      paymentMethod: 'eth'
    });

    return await transaction.save();
  },

  /**
   * Update transaction status
   */
  async updateTransactionStatus(
    transactionId: string,
    status: string,
    blockchainData?: ITransaction['blockchain']
  ): Promise<ITransaction | null> {
    const updateData: Record<string, unknown> = { status };

    if (blockchainData) {
      updateData.blockchain = blockchainData;
    }

    return Transaction.findByIdAndUpdate(
      transactionId,
      { $set: updateData },
      { new: true }
    );
  },

  /**
   * Get transaction statistics
   */
  async getTransactionStats(period: 'day' | 'week' | 'month' = 'day'): Promise<{
    totalCount: number;
    totalVolume: number;
    salesByType: Record<string, number>;
    recentTransactions: ITransaction[];
  }> {
    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    // Query for completed sales in the period
    const completedSales = await Transaction.find({
      type: 'sell',
      status: 'completed',
      timestamp: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // Calculate total volume
    const totalVolume = completedSales.reduce(
      (sum, tx) => sum + (tx.price || 0),
      0
    );

    // Get count by type
    const typeResults = await Transaction.aggregate([
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lte: endDate
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convert to record
    const salesByType: Record<string, number> = {};
    typeResults.forEach((item: { _id: string; count: number }) => {
      salesByType[item._id] = item.count;
    });

    // Get recent transactions
    const recentTransactions = await Transaction.find({
      status: 'completed'
    })
      .sort({ timestamp: -1 })
      .limit(5)
      .populate('assetId', 'name thumbnailUrl');

    return {
      totalCount: completedSales.length,
      totalVolume,
      salesByType,
      recentTransactions
    };
  },

  /**
   * Delete a transaction (admin function)
   */
  async deleteTransaction(transactionId: string): Promise<boolean> {
    const result = await Transaction.deleteOne({ _id: transactionId });
    return result.deletedCount > 0;
  }
}; 