import PriceHistory, { IPriceHistory } from '../models/PriceHistory';
import Asset from '../models/Asset';
import mongoose from 'mongoose';

export interface PriceDataDTO {
  price: number;
  priceUsd: number;
  source: {
    type: string;
    dataSourceName?: string;
    modelVersion?: string;
  };
  aiMetrics?: {
    confidenceScore: number;
    factors?: Array<{
      name: string;
      weight: number;
      impact: number;
    }>;
  };
  blockchain?: {
    transactionHash?: string;
    blockNumber?: number;
    timestamp?: Date;
  };
}

/**
 * Service for managing price history
 */
export const priceHistoryService = {
  /**
   * Record a new price point
   */
  async recordPrice(
    tokenId: number,
    priceData: PriceDataDTO
  ): Promise<IPriceHistory> {
    // Get the asset to reference
    const asset = await Asset.findOne({ tokenId });
    
    if (!asset) {
      throw new Error(`Asset with token ID ${tokenId} not found`);
    }

    // Create price history record
    const priceHistory = new PriceHistory({
      assetId: asset._id,
      tokenId,
      price: priceData.price,
      priceUsd: priceData.priceUsd,
      timestamp: new Date(),
      source: priceData.source,
      aiMetrics: priceData.aiMetrics,
      blockchain: priceData.blockchain
    });

    return await priceHistory.save();
  },

  /**
   * Get price history for a specific token
   */
  async getPriceHistory(
    tokenId: number,
    limit: number = 100,
    startDate?: Date,
    endDate?: Date
  ): Promise<IPriceHistory[]> {
    const query: Record<string, unknown> = { tokenId };

    // Add date range if provided
    if (startDate || endDate) {
      query.timestamp = {};
      
      if (startDate) {
        (query.timestamp as Record<string, Date>).$gte = startDate;
      }
      
      if (endDate) {
        (query.timestamp as Record<string, Date>).$lte = endDate;
      }
    }

    return PriceHistory.find(query)
      .sort({ timestamp: -1 })
      .limit(limit);
  },

  /**
   * Get price history by asset ID
   */
  async getPriceHistoryByAssetId(
    assetId: string,
    limit: number = 100
  ): Promise<IPriceHistory[]> {
    return PriceHistory.find({ 
      assetId: new mongoose.Types.ObjectId(assetId) 
    })
      .sort({ timestamp: -1 })
      .limit(limit);
  },

  /**
   * Get price history grouped by time period
   */
  async getPriceHistoryAggregated(
    tokenId: number,
    period: 'hour' | 'day' | 'week' | 'month' = 'day',
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{
    _id: { year: number; period: number };
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    timestamp: Date;
  }>> {
    // Determine the date grouping for MongoDB aggregation
    let dateFormat;
    switch (period) {
      case 'hour':
        dateFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
          hour: { $hour: '$timestamp' },
          period: { $hour: '$timestamp' }
        };
        break;
      case 'day':
        dateFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
          period: { $dayOfMonth: '$timestamp' }
        };
        break;
      case 'week':
        dateFormat = {
          year: { $year: '$timestamp' },
          week: { $week: '$timestamp' },
          period: { $week: '$timestamp' }
        };
        break;
      case 'month':
        dateFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          period: { $month: '$timestamp' }
        };
        break;
    }

    // Build match stage
    const matchStage: Record<string, unknown> = { tokenId };
    
    if (startDate || endDate) {
      matchStage.timestamp = {};
      
      if (startDate) {
        (matchStage.timestamp as Record<string, Date>).$gte = startDate;
      }
      
      if (endDate) {
        (matchStage.timestamp as Record<string, Date>).$lte = endDate;
      }
    }

    // Run aggregation
    const results = await PriceHistory.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: dateFormat,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          timestamp: { $first: '$timestamp' }
        }
      },
      { $sort: { timestamp: 1 } }
    ]);

    return results;
  },

  /**
   * Get historical pricing analytics
   */
  async getPriceAnalytics(
    tokenId: number
  ): Promise<{
    current: number;
    change24h: number;
    change7d: number;
    change30d: number;
    averageConfidence: number;
    volatility: number;
  }> {
    // Get current price from asset
    const asset = await Asset.findOne({ tokenId });
    
    if (!asset) {
      throw new Error(`Asset with token ID ${tokenId} not found`);
    }

    const current = asset.currentPrice.value;
    
    // Get timestamps for comparison periods
    const now = new Date();
    const day1 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const day7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const day30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get historical prices
    const [price24h, price7d, price30d, confidenceData, allPrices] = await Promise.all([
      PriceHistory.findOne({ 
        tokenId, 
        timestamp: { $lte: day1 }
      }).sort({ timestamp: -1 }),
      
      PriceHistory.findOne({ 
        tokenId, 
        timestamp: { $lte: day7 }
      }).sort({ timestamp: -1 }),
      
      PriceHistory.findOne({ 
        tokenId, 
        timestamp: { $lte: day30 }
      }).sort({ timestamp: -1 }),
      
      // Get AI confidence score average
      PriceHistory.aggregate([
        { 
          $match: { 
            tokenId,
            'aiMetrics.confidenceScore': { $exists: true }
          }
        },
        {
          $group: {
            _id: null,
            avgConfidence: { $avg: '$aiMetrics.confidenceScore' }
          }
        }
      ]),
      
      // Get all prices for volatility calculation
      PriceHistory.find({ 
        tokenId,
        timestamp: { $gte: day30 }
      }).sort({ timestamp: 1 })
    ]);
    
    // Calculate price changes
    let change24h = 0;
    let change7d = 0;
    let change30d = 0;
    
    if (price24h) {
      change24h = ((current - price24h.price) / price24h.price) * 100;
    }
    
    if (price7d) {
      change7d = ((current - price7d.price) / price7d.price) * 100;
    }
    
    if (price30d) {
      change30d = ((current - price30d.price) / price30d.price) * 100;
    }
    
    // Calculate average confidence
    const averageConfidence = confidenceData.length > 0 
      ? confidenceData[0].avgConfidence 
      : 0;
    
    // Calculate volatility (standard deviation of daily returns)
    let volatility = 0;
    
    if (allPrices.length > 1) {
      const returns: number[] = [];
      
      // Calculate daily returns
      for (let i = 1; i < allPrices.length; i++) {
        const prevPrice = allPrices[i - 1].price;
        const currentPrice = allPrices[i].price;
        
        if (prevPrice > 0) {
          returns.push((currentPrice - prevPrice) / prevPrice);
        }
      }
      
      // Calculate standard deviation
      if (returns.length > 0) {
        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        
        const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
        const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / returns.length;
        
        volatility = Math.sqrt(variance) * 100; // Convert to percentage
      }
    }
    
    return {
      current,
      change24h,
      change7d,
      change30d,
      averageConfidence,
      volatility
    };
  },

  /**
   * Get price sources distribution
   */
  async getPriceSourcesDistribution(
    tokenId: number
  ): Promise<Array<{ source: string; count: number; percentage: number }>> {
    const results = await PriceHistory.aggregate([
      { $match: { tokenId } },
      {
        $group: {
          _id: '$source.type',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const total = results.reduce((sum, item) => sum + item.count, 0);
    
    return results.map(item => ({
      source: item._id,
      count: item.count,
      percentage: total > 0 ? (item.count / total) * 100 : 0
    }));
  },

  /**
   * Delete price history records
   */
  async deletePriceHistory(
    tokenId: number,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const filter: Record<string, unknown> = { tokenId };
    
    if (startDate || endDate) {
      filter.timestamp = {};
      
      if (startDate) {
        (filter.timestamp as Record<string, Date>).$gte = startDate;
      }
      
      if (endDate) {
        (filter.timestamp as Record<string, Date>).$lte = endDate;
      }
    }
    
    const result = await PriceHistory.deleteMany(filter);
    return result.deletedCount;
  }
}; 