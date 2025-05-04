import Asset, { IAsset } from '../models/Asset';
import { uploadFileToS3, deleteFileFromS3 } from '../s3';

// Helper types for asset creation and filtering
export interface AssetCreateDTO {
  tokenId: number;
  contractAddress: string;
  name: string;
  assetType: string;
  description: string;
  currentPrice: {
    value: number;
    valueUsd: number;
  };
  ownership: {
    currentOwner: string;
  };
}

export interface AssetFilterOptions {
  assetType?: string;
  currentOwner?: string;
  isListed?: boolean;
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Service for managing assets
 */
export const assetService = {
  /**
   * Get all assets with filtering and pagination
   */
  async getAssets(options: AssetFilterOptions = {}): Promise<{
    assets: IAsset[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      assetType,
      currentOwner,
      isListed,
      priceMin,
      priceMax,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      page = 1,
      limit = 10
    } = options;

    // Build query filters
    const filter: Record<string, unknown> = {};

    if (assetType) {
      filter.assetType = assetType;
    }

    if (currentOwner) {
      filter['ownership.currentOwner'] = currentOwner;
    }

    if (isListed !== undefined) {
      filter['marketStatus.isListed'] = isListed;
    }

    // Price range filtering
    if (priceMin !== undefined || priceMax !== undefined) {
      filter['currentPrice.value'] = {};
      
      if (priceMin !== undefined) {
        (filter['currentPrice.value'] as Record<string, number>).$gte = priceMin;
      }
      
      if (priceMax !== undefined) {
        (filter['currentPrice.value'] as Record<string, number>).$lte = priceMax;
      }
    }

    // Calculate pagination values
    const skip = (page - 1) * limit;
    
    // Build sort object
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortDirection === 'asc' ? 1 : -1
    };

    // Execute query with pagination
    const [assets, total] = await Promise.all([
      Asset.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Asset.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      assets,
      total,
      page,
      totalPages
    };
  },

  /**
   * Get a single asset by token ID
   */
  async getAssetByTokenId(tokenId: number): Promise<IAsset | null> {
    return Asset.findOne({ tokenId });
  },

  /**
   * Get assets owned by a wallet address
   */
  async getAssetsByOwner(ownerAddress: string): Promise<IAsset[]> {
    return Asset.find({ 'ownership.currentOwner': ownerAddress });
  },

  /**
   * Create a new asset
   */
  async createAsset(assetData: AssetCreateDTO): Promise<IAsset> {
    // Set default values for required fields
    const newAsset = new Asset({
      ...assetData,
      stats: {
        viewCount: 0,
        favoriteCount: 0,
        offerCount: 0
      },
      marketStatus: {
        isListed: false
      },
      verification: {
        isVerified: false
      },
      ownership: {
        ...assetData.ownership,
        ownerSince: new Date()
      },
      currentPrice: {
        ...assetData.currentPrice,
        updatedAt: new Date()
      }
    });

    return await newAsset.save();
  },

  /**
   * Update asset metadata
   */
  async updateAssetMetadata(
    tokenId: number,
    metadata: Partial<IAsset['metadata']>
  ): Promise<IAsset | null> {
    return Asset.findOneAndUpdate(
      { tokenId },
      { $set: { metadata } },
      { new: true }
    );
  },

  /**
   * Update asset price
   */
  async updateAssetPrice(
    tokenId: number,
    price: number,
    priceUsd: number,
    aiConfidenceScore?: number
  ): Promise<IAsset | null> {
    return Asset.findOneAndUpdate(
      { tokenId },
      {
        $set: {
          'currentPrice.value': price,
          'currentPrice.valueUsd': priceUsd,
          'currentPrice.updatedAt': new Date(),
          'currentPrice.aiConfidenceScore': aiConfidenceScore
        }
      },
      { new: true }
    );
  },

  /**
   * List an asset for sale
   */
  async listAssetForSale(
    tokenId: number,
    listingPrice: number,
    listedBy: string
  ): Promise<IAsset | null> {
    return Asset.findOneAndUpdate(
      { tokenId },
      {
        $set: {
          'marketStatus.isListed': true,
          'marketStatus.listingPrice': listingPrice,
          'marketStatus.listedAt': new Date(),
          'marketStatus.listedBy': listedBy
        }
      },
      { new: true }
    );
  },

  /**
   * Remove asset from sale
   */
  async delistAsset(tokenId: number): Promise<IAsset | null> {
    return Asset.findOneAndUpdate(
      { tokenId },
      {
        $set: {
          'marketStatus.isListed': false
        },
        $unset: {
          'marketStatus.listingPrice': "",
          'marketStatus.listedBy': ""
        }
      },
      { new: true }
    );
  },

  /**
   * Transfer asset ownership
   */
  async transferAssetOwnership(
    tokenId: number,
    newOwner: string
  ): Promise<IAsset | null> {
    return Asset.findOneAndUpdate(
      { tokenId },
      {
        $set: {
          'ownership.currentOwner': newOwner,
          'ownership.ownerSince': new Date(),
          'marketStatus.isListed': false
        },
        $unset: {
          'marketStatus.listingPrice': "",
          'marketStatus.listedBy': ""
        }
      },
      { new: true }
    );
  },

  /**
   * Verify an asset
   */
  async verifyAsset(
    tokenId: number,
    verifiedBy: string,
    verificationData?: Record<string, unknown>
  ): Promise<IAsset | null> {
    return Asset.findOneAndUpdate(
      { tokenId },
      {
        $set: {
          'verification.isVerified': true,
          'verification.verifiedBy': verifiedBy,
          'verification.verifiedAt': new Date(),
          'verification.verificationData': verificationData
        }
      },
      { new: true }
    );
  },

  /**
   * Increment view count
   */
  async incrementViewCount(tokenId: number): Promise<void> {
    await Asset.updateOne(
      { tokenId },
      { $inc: { 'stats.viewCount': 1 } }
    );
  },

  /**
   * Toggle favorite status
   */
  async toggleFavorite(tokenId: number, increment: boolean): Promise<void> {
    await Asset.updateOne(
      { tokenId },
      { $inc: { 'stats.favoriteCount': increment ? 1 : -1 } }
    );
  },

  /**
   * Upload and associate image with an asset
   */
  async uploadAssetImage(
    tokenId: number,
    file: File,
    isPrimary: boolean = false
  ): Promise<string> {
    // Format the file name to include tokenId
    const originalName = file.name;
    const extension = originalName.split('.').pop() || '';
    const timestamp = Date.now();
    const newFileName = `${tokenId}_image_${timestamp}.${extension}`;
    
    // Create a new file with the formatted name
    const renamedFile = new File([file], newFileName, { type: file.type });
    
    // Upload to S3
    await uploadFileToS3(renamedFile);
    
    // Update the asset record to include the image key
    if (isPrimary) {
      await Asset.updateOne(
        { tokenId },
        { $set: { 'media.thumbnailUrl': newFileName } }
      );
    } else {
      await Asset.updateOne(
        { tokenId },
        { $push: { 'media.imageKeys': newFileName } }
      );
    }
    
    return newFileName;
  },

  /**
   * Upload a document for an asset
   */
  async uploadAssetDocument(
    tokenId: number,
    file: File,
    documentType: string
  ): Promise<string> {
    // Format the file name
    const originalName = file.name;
    const extension = originalName.split('.').pop() || '';
    const timestamp = Date.now();
    const newFileName = `${tokenId}_${documentType}_${timestamp}.${extension}`;
    
    // Create a new file with the formatted name
    const renamedFile = new File([file], newFileName, { type: file.type });
    
    // Upload to S3
    await uploadFileToS3(renamedFile);
    
    // Update the asset record
    await Asset.updateOne(
      { tokenId },
      { $push: { 'media.documentKeys': newFileName } }
    );
    
    if (documentType === 'certificate') {
      // Also add to certificates in metadata
      await Asset.updateOne(
        { tokenId },
        {
          $push: {
            'metadata.certificates': {
              type: 'document',
              issuer: 'user_upload',
              date: new Date(),
              fileKey: newFileName
            }
          }
        }
      );
    }
    
    return newFileName;
  },

  /**
   * Delete an asset image
   */
  async deleteAssetImage(tokenId: number, fileName: string): Promise<boolean> {
    try {
      // Delete from S3
      await deleteFileFromS3(fileName);
      
      // Update the asset record
      if (fileName.includes('thumbnail')) {
        await Asset.updateOne(
          { tokenId },
          { $unset: { 'media.thumbnailUrl': "" } }
        );
      } else {
        await Asset.updateOne(
          { tokenId },
          { $pull: { 'media.imageKeys': fileName } }
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting asset image:', error);
      return false;
    }
  },

  /**
   * Get asset statistics
   */
  async getAssetStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    listed: number;
    verified: number;
  }> {
    const [total, typeCounts, listedCount, verifiedCount] = await Promise.all([
      Asset.countDocuments(),
      Asset.aggregate([
        { $group: { _id: '$assetType', count: { $sum: 1 } } }
      ]),
      Asset.countDocuments({ 'marketStatus.isListed': true }),
      Asset.countDocuments({ 'verification.isVerified': true })
    ]);

    // Convert the type counts to an object
    const byType: Record<string, number> = {};
    typeCounts.forEach((item: { _id: string; count: number }) => {
      byType[item._id] = item.count;
    });

    return {
      total,
      byType,
      listed: listedCount,
      verified: verifiedCount
    };
  },

  /**
   * Delete an asset (admin function)
   */
  async deleteAsset(tokenId: number): Promise<boolean> {
    const asset = await Asset.findOne({ tokenId });
    
    if (!asset) {
      return false;
    }
    
    // Delete all associated files from S3
    const filesToDelete = [
      ...(asset.media.imageKeys || []),
      ...(asset.media.documentKeys || [])
    ];
    
    if (asset.media.thumbnailUrl) {
      filesToDelete.push(asset.media.thumbnailUrl);
    }
    
    if (asset.media.videoKey) {
      filesToDelete.push(asset.media.videoKey);
    }
    
    if (asset.media.modelKey) {
      filesToDelete.push(asset.media.modelKey);
    }
    
    // Delete files in parallel
    await Promise.all(
      filesToDelete.map(file => deleteFileFromS3(file).catch(err => {
        console.error(`Error deleting file ${file}:`, err);
      }))
    );
    
    // Delete the asset document
    await Asset.deleteOne({ tokenId });
    
    return true;
  }
};