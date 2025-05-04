import AiOracleData, { IAiOracleData } from '../models/AiOracleData';
import Asset from '../models/Asset';
import { priceHistoryService } from './priceHistoryService';
import mongoose from 'mongoose';

export interface PredictionDTO {
  predictedPrice: number;
  confidenceScore: number;
  dataSourcesUsed: string[];
  modelVersion: string;
  inputs?: {
    marketData?: Record<string, unknown>;
    assetSpecific?: Record<string, unknown>;
    economicIndicators?: Record<string, unknown>;
    sentimentAnalysis?: Record<string, unknown>;
  };
  featureImportance: Array<{
    feature: string;
    importance: number;
    direction: number;
  }>;
  performanceMetrics?: {
    accuracy: number;
    errorMargin: number;
    calibration: number;
  };
}

/**
 * Service for managing AI oracle data
 */
export const aiOracleService = {
  /**
   * Submit a new price prediction
   */
  async submitPrediction(
    tokenId: number,
    predictionData: PredictionDTO
  ): Promise<IAiOracleData> {
    // Get the asset
    const asset = await Asset.findOne({ tokenId });
    
    if (!asset) {
      throw new Error(`Asset with token ID ${tokenId} not found`);
    }

    // Create the prediction record
    const prediction = new AiOracleData({
      assetId: asset._id,
      tokenId,
      timestamp: new Date(),
      predictedPrice: predictionData.predictedPrice,
      confidenceScore: predictionData.confidenceScore,
      dataSourcesUsed: predictionData.dataSourcesUsed,
      modelVersion: predictionData.modelVersion,
      inputs: predictionData.inputs || {},
      featureImportance: predictionData.featureImportance,
      performanceMetrics: predictionData.performanceMetrics,
      status: 'pending'
    });

    return await prediction.save();
  },

  /**
   * Get prediction by ID
   */
  async getPrediction(predictionId: string): Promise<IAiOracleData | null> {
    return AiOracleData.findById(predictionId).populate('assetId');
  },

  /**
   * Get predictions for a specific token
   */
  async getPredictionsByTokenId(
    tokenId: number,
    limit: number = 50,
    status?: string
  ): Promise<IAiOracleData[]> {
    const query: Record<string, unknown> = { tokenId };
    
    if (status) {
      query.status = status;
    }
    
    return AiOracleData.find(query)
      .sort({ timestamp: -1 })
      .limit(limit);
  },

  /**
   * Accept a prediction and update asset price
   */
  async acceptPrediction(
    predictionId: string,
    transactionHash?: string,
    blockNumber?: number
  ): Promise<IAiOracleData | null> {
    const prediction = await AiOracleData.findById(predictionId);
    
    if (!prediction) {
      throw new Error(`Prediction with ID ${predictionId} not found`);
    }
    
    // Get token USD price
    const asset = await Asset.findOne({ tokenId: prediction.tokenId });
    
    if (!asset) {
      throw new Error(`Asset with token ID ${prediction.tokenId} not found`);
    }
    
    // Calculate USD price (maintain the same ETH/USD rate)
    const ethUsdRate = asset.currentPrice.valueUsd / asset.currentPrice.value;
    const predictedPriceUsd = prediction.predictedPrice * ethUsdRate;
    
    // Update asset price
    await Asset.updateOne(
      { tokenId: prediction.tokenId },
      {
        $set: {
          'currentPrice.value': prediction.predictedPrice,
          'currentPrice.valueUsd': predictedPriceUsd,
          'currentPrice.updatedAt': new Date(),
          'currentPrice.aiConfidenceScore': prediction.confidenceScore
        }
      }
    );
    
    // Record in price history
    await priceHistoryService.recordPrice(
      prediction.tokenId,
      {
        price: prediction.predictedPrice,
        priceUsd: predictedPriceUsd,
        source: {
          type: 'ai-oracle',
          modelVersion: prediction.modelVersion
        },
        aiMetrics: {
          confidenceScore: prediction.confidenceScore,
          factors: prediction.featureImportance.map(f => ({
            name: f.feature,
            weight: f.importance,
            impact: f.direction
          }))
        },
        blockchain: transactionHash && blockNumber ? {
          transactionHash,
          blockNumber,
          timestamp: new Date()
        } : undefined
      }
    );
    
    // Update prediction status and record blockchain data
    return AiOracleData.findByIdAndUpdate(
      predictionId,
      {
        $set: {
          status: 'accepted',
          onChainReference: transactionHash && blockNumber ? {
            transactionHash,
            blockNumber,
            timestamp: new Date()
          } : undefined
        }
      },
      { new: true }
    );
  },

  /**
   * Reject a prediction
   */
  async rejectPrediction(
    predictionId: string,
    reason?: string
  ): Promise<IAiOracleData | null> {
    return AiOracleData.findByIdAndUpdate(
      predictionId,
      {
        $set: {
          status: 'rejected',
          rejectionReason: reason
        }
      },
      { new: true }
    );
  },

  /**
   * Get oracle performance metrics
   */
  async getOraclePerformance(
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    totalPredictions: number;
    acceptedPredictions: number;
    rejectedPredictions: number;
    averageConfidence: number;
    modelVersions: Array<{ version: string; count: number; avgConfidence: number }>;
  }> {
    // Build date range filter
    const dateFilter: Record<string, Date> = {};
    
    if (startDate) {
      dateFilter.$gte = startDate;
    }
    
    if (endDate) {
      dateFilter.$lte = endDate;
    }
    
    const matchStage = Object.keys(dateFilter).length > 0
      ? { timestamp: dateFilter }
      : {};
    
    // Get overall statistics
    const [
      totalPredictions,
      acceptedPredictions,
      rejectedPredictions,
      confidenceStats,
      versionStats
    ] = await Promise.all([
      AiOracleData.countDocuments(matchStage),
      
      AiOracleData.countDocuments({
        ...matchStage,
        status: 'accepted'
      }),
      
      AiOracleData.countDocuments({
        ...matchStage,
        status: 'rejected'
      }),
      
      AiOracleData.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            avgConfidence: { $avg: '$confidenceScore' }
          }
        }
      ]),
      
      AiOracleData.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$modelVersion',
            count: { $sum: 1 },
            avgConfidence: { $avg: '$confidenceScore' }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);
    
    const averageConfidence = confidenceStats.length > 0
      ? confidenceStats[0].avgConfidence
      : 0;
    
    const modelVersions = versionStats.map(v => ({
      version: v._id,
      count: v.count,
      avgConfidence: v.avgConfidence
    }));
    
    return {
      totalPredictions,
      acceptedPredictions,
      rejectedPredictions,
      averageConfidence,
      modelVersions
    };
  },

  /**
   * Get feature importance analysis
   */
  async getFeatureImportanceAnalysis(
    startDate?: Date,
    endDate?: Date
  ): Promise<Array<{
    feature: string;
    avgImportance: number;
    avgDirection: number;
    occurrences: number;
  }>> {
    // Build date range filter
    const dateFilter: Record<string, Date> = {};
    
    if (startDate) {
      dateFilter.$gte = startDate;
    }
    
    if (endDate) {
      dateFilter.$lte = endDate;
    }
    
    const matchStage = Object.keys(dateFilter).length > 0
      ? { timestamp: dateFilter }
      : {};
    
    // Unwind to analyze individual features
    return AiOracleData.aggregate([
      { $match: matchStage },
      { $unwind: '$featureImportance' },
      {
        $group: {
          _id: '$featureImportance.feature',
          avgImportance: { $avg: '$featureImportance.importance' },
          avgDirection: { $avg: '$featureImportance.direction' },
          occurrences: { $sum: 1 }
        }
      },
      { $sort: { avgImportance: -1 } },
      {
        $project: {
          _id: 0,
          feature: '$_id',
          avgImportance: 1,
          avgDirection: 1,
          occurrences: 1
        }
      }
    ]);
  },

  /**
   * Delete prediction data
   */
  async deletePrediction(predictionId: string): Promise<boolean> {
    const result = await AiOracleData.deleteOne({ _id: new mongoose.Types.ObjectId(predictionId) });
    return result.deletedCount > 0;
  }
}; 