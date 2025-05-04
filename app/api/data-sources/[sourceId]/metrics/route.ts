import { dataSourceService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAny } from '@/lib/auth/authMiddleware';
import { validateBody } from '@/lib/validators';
import { dataSourceMetricsUpdateSchema, dataSourceAccuracyUpdateSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';
import mongoose from 'mongoose';

// Update data source metrics after a fetch
export async function POST(
  request: NextRequest,
  { params }: { params: { sourceId: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      const { sourceId } = params;

      // Validate sourceId format
      if (!sourceId || !mongoose.isValidObjectId(sourceId)) {
        return NextResponse.json(
          { error: 'Invalid data source ID' },
          { status: 400 }
        );
      }

      // Only oracles and admins can update data source metrics
      if (!req.user || !req.user.roles.some(role => ['oracle', 'admin'].includes(role))) {
        return NextResponse.json(
          { error: 'Unauthorized - Insufficient permissions' },
          { status: 403 }
        );
      }

      // Check if data source exists
      const existingSource = await dataSourceService.getDataSourceById(sourceId);
      
      if (!existingSource) {
        return NextResponse.json(
          { error: 'Data source not found' },
          { status: 404 }
        );
      }

      // Validate request body
      const [bodyData, validationError] = await validateBody(request, dataSourceMetricsUpdateSchema);
      
      if (validationError) {
        return validationError;
      }

      if (!bodyData) {
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        );
      }

      // Update the data source metrics
      const updatedSource = await dataSourceService.updateDataSourceMetrics(
        sourceId,
        bodyData.success,
        bodyData.latency,
        bodyData.error
      );
      
      if (!updatedSource) {
        return NextResponse.json(
          { error: 'Failed to update data source metrics' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Data source metrics updated successfully',
        dataSource: {
          id: updatedSource._id.toString(),
          name: updatedSource.name,
          metrics: updatedSource.metrics,
          status: {
            lastFetchAt: updatedSource.status.lastFetchAt,
            nextFetchAt: updatedSource.status.nextFetchAt,
            errorCount: updatedSource.status.errorCount
          }
        }
      });
    } catch (error) {
      console.error(`Error updating metrics for data source with ID ${params.sourceId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Update price accuracy metric
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sourceId: string } }
): Promise<NextResponse> {
  // Connect to the database
  await connectToDatabase();

  return withAuthAny(request, async (req) => {
    try {
      const { sourceId } = params;

      // Validate sourceId format
      if (!sourceId || !mongoose.isValidObjectId(sourceId)) {
        return NextResponse.json(
          { error: 'Invalid data source ID' },
          { status: 400 }
        );
      }

      // Only oracles and admins can update data source accuracy
      if (!req.user || !req.user.roles.some(role => ['oracle', 'admin'].includes(role))) {
        return NextResponse.json(
          { error: 'Unauthorized - Insufficient permissions' },
          { status: 403 }
        );
      }

      // Check if data source exists
      const existingSource = await dataSourceService.getDataSourceById(sourceId);
      
      if (!existingSource) {
        return NextResponse.json(
          { error: 'Data source not found' },
          { status: 404 }
        );
      }

      // Validate request body
      const [bodyData, validationError] = await validateBody(request, dataSourceAccuracyUpdateSchema);
      
      if (validationError) {
        return validationError;
      }

      if (!bodyData) {
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        );
      }

      // Update the data source accuracy
      const updatedSource = await dataSourceService.updatePriceAccuracy(
        sourceId,
        bodyData.accuracy
      );
      
      if (!updatedSource) {
        return NextResponse.json(
          { error: 'Failed to update data source accuracy' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Data source accuracy updated successfully',
        dataSource: {
          id: updatedSource._id.toString(),
          name: updatedSource.name,
          metrics: {
            priceAccuracy: updatedSource.metrics.priceAccuracy
          }
        }
      });
    } catch (error) {
      console.error(`Error updating accuracy for data source with ID ${params.sourceId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 