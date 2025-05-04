import DataSource, { IDataSource } from '../models/DataSource';
import mongoose from 'mongoose';

export interface DataSourceCreateDTO {
  name: string;
  type: 'api' | 'file' | 'stream';
  url?: string;
  description: string;
  configuration: {
    refreshInterval: number;
    mapping?: Record<string, unknown>;
    headers?: Record<string, string>;
    authentication?: Record<string, string>;
  };
  aiWeighting?: number;
}

/**
 * Service for managing data sources
 */
export const dataSourceService = {
  /**
   * Get all data sources
   */
  async getDataSources(enabled?: boolean): Promise<IDataSource[]> {
    const query = enabled !== undefined ? { 'status.isEnabled': enabled } : {};
    return DataSource.find(query).sort({ name: 1 });
  },

  /**
   * Get a data source by ID
   */
  async getDataSourceById(sourceId: string): Promise<IDataSource | null> {
    return DataSource.findById(sourceId);
  },

  /**
   * Get a data source by name
   */
  async getDataSourceByName(name: string): Promise<IDataSource | null> {
    return DataSource.findOne({ name });
  },

  /**
   * Create a new data source
   */
  async createDataSource(sourceData: DataSourceCreateDTO): Promise<IDataSource> {
    // Check if a source with this name already exists
    const existingSource = await DataSource.findOne({ name: sourceData.name });
    
    if (existingSource) {
      throw new Error(`Data source with name '${sourceData.name}' already exists`);
    }
    
    // Create the data source
    const newSource = new DataSource({
      ...sourceData,
      status: {
        isEnabled: true,
        errorCount: 0
      },
      metrics: {
        reliability: 100,
        latency: 0,
        priceAccuracy: 80
      },
      aiWeighting: sourceData.aiWeighting !== undefined ? sourceData.aiWeighting : 0.5
    });
    
    return await newSource.save();
  },

  /**
   * Update a data source
   */
  async updateDataSource(
    sourceId: string,
    updateData: Partial<DataSourceCreateDTO>
  ): Promise<IDataSource | null> {
    return DataSource.findByIdAndUpdate(
      sourceId,
      { $set: updateData },
      { new: true }
    );
  },

  /**
   * Enable or disable a data source
   */
  async setDataSourceStatus(
    sourceId: string,
    enabled: boolean
  ): Promise<IDataSource | null> {
    return DataSource.findByIdAndUpdate(
      sourceId,
      { $set: { 'status.isEnabled': enabled } },
      { new: true }
    );
  },

  /**
   * Update data source metrics after a fetch
   */
  async updateDataSourceMetrics(
    sourceId: string,
    success: boolean,
    latency: number,
    error?: string
  ): Promise<IDataSource | null> {
    const updateData: Record<string, unknown> = {
      'status.lastFetchAt': new Date(),
      'status.nextFetchAt': new Date(Date.now() + 3600 * 1000), // Default 1 hour ahead
      'metrics.latency': latency
    };
    
    if (success) {
      // Reset error count on success
      updateData['status.errorCount'] = 0;
      
      // Calculate reliability based on historical data
      // This is a simplified approach, in a real system you might use a more sophisticated algorithm
      updateData.$inc = { 'metrics.reliability': Math.min(5, 100 - 0 /* get current reliability */) };
    } else {
      // Increment error count on failure
      updateData.$inc = { 'status.errorCount': 1 };
      
      // Decrease reliability on error
      updateData.$inc['metrics.reliability'] = -10;
      
      // Record error message
      updateData['status.lastError'] = error || 'Unknown error';
    }
    
    return DataSource.findByIdAndUpdate(
      sourceId,
      updateData,
      { new: true }
    );
  },

  /**
   * Update price accuracy metric
   */
  async updatePriceAccuracy(
    sourceId: string,
    accuracy: number
  ): Promise<IDataSource | null> {
    // Accuracy should be between 0 and 100
    const boundedAccuracy = Math.min(100, Math.max(0, accuracy));
    
    return DataSource.findByIdAndUpdate(
      sourceId,
      {
        $set: { 'metrics.priceAccuracy': boundedAccuracy }
      },
      { new: true }
    );
  },

  /**
   * Get next data sources to fetch
   */
  async getNextSourcesToFetch(limit: number = 10): Promise<IDataSource[]> {
    const now = new Date();
    
    return DataSource.find({
      'status.isEnabled': true,
      'status.nextFetchAt': { $lte: now }
    })
      .sort({ 'status.nextFetchAt': 1 })
      .limit(limit);
  },

  /**
   * Get sources by type
   */
  async getSourcesByType(type: string): Promise<IDataSource[]> {
    return DataSource.find({
      type,
      'status.isEnabled': true
    }).sort({ 'metrics.reliability': -1 });
  },

  /**
   * Get optimal sources for oracle
   */
  async getOptimalSourcesForOracle(limit: number = 5): Promise<IDataSource[]> {
    return DataSource.find({
      'status.isEnabled': true,
      'metrics.reliability': { $gte: 70 } // Only use relatively reliable sources
    })
      .sort({ 
        'metrics.priceAccuracy': -1, 
        aiWeighting: -1 
      })
      .limit(limit);
  },

  /**
   * Delete a data source
   */
  async deleteDataSource(sourceId: string): Promise<boolean> {
    const result = await DataSource.deleteOne({ _id: new mongoose.Types.ObjectId(sourceId) });
    return result.deletedCount > 0;
  },

  /**
   * Reset error count for a source
   */
  async resetErrorCount(sourceId: string): Promise<IDataSource | null> {
    return DataSource.findByIdAndUpdate(
      sourceId,
      {
        $set: {
          'status.errorCount': 0,
          'status.lastError': null
        }
      },
      { new: true }
    );
  }
}; 