import { dataSourceService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAny } from '@/lib/auth/authMiddleware';
import { validateBody } from '@/lib/validators';
import { dataSourceUpdateSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';
import mongoose from 'mongoose';
import { DataSourceCreateDTO } from '@/lib/services/dataSourceService';

// Get a single data source
export async function GET(
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

      // Only admins and oracles can view data sources
      if (!req.user || !req.user.roles.some(role => ['admin', 'oracle'].includes(role))) {
        return NextResponse.json(
          { error: 'Unauthorized - Insufficient permissions' },
          { status: 403 }
        );
      }

      // Get the data source
      const dataSource = await dataSourceService.getDataSourceById(sourceId);

      if (!dataSource) {
        return NextResponse.json(
          { error: 'Data source not found' },
          { status: 404 }
        );
      }

      // Return the data source
      return NextResponse.json({
        dataSource: {
          id: dataSource._id.toString(),
          name: dataSource.name,
          type: dataSource.type,
          url: dataSource.url,
          description: dataSource.description,
          configuration: dataSource.configuration,
          status: dataSource.status,
          metrics: dataSource.metrics,
          aiWeighting: dataSource.aiWeighting,
          createdAt: dataSource.createdAt,
          updatedAt: dataSource.updatedAt
        }
      });
    } catch (error) {
      console.error(`Error fetching data source with ID ${params.sourceId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Update a data source
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

      // Only admins can update data sources
      if (!req.user || !req.user.roles.includes('admin')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin privileges required' },
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
      const [bodyData, validationError] = await validateBody(request, dataSourceUpdateSchema);
      
      if (validationError) {
        return validationError;
      }

      if (!bodyData) {
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        );
      }

      // Ensure configuration has required fields if provided
      const updateWithDefaults: Partial<DataSourceCreateDTO> = {
        ...bodyData,
        configuration: bodyData.configuration ? {
          ...bodyData.configuration,
          refreshInterval: bodyData.configuration.refreshInterval ?? existingSource.configuration.refreshInterval
        } : undefined
      };

      // Update the data source
      const updatedSource = await dataSourceService.updateDataSource(sourceId, updateWithDefaults);
      
      if (!updatedSource) {
        return NextResponse.json(
          { error: 'Failed to update data source' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Data source updated successfully',
        dataSource: {
          id: updatedSource._id.toString(),
          name: updatedSource.name,
          type: updatedSource.type,
          isEnabled: updatedSource.status.isEnabled,
          updatedAt: updatedSource.updatedAt
        }
      });
    } catch (error) {
      console.error(`Error updating data source with ID ${params.sourceId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

// Delete a data source
export async function DELETE(
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

      // Only admins can delete data sources
      if (!req.user || !req.user.roles.includes('admin')) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin privileges required' },
          { status: 403 }
        );
      }

      // Delete the data source
      const success = await dataSourceService.deleteDataSource(sourceId);
      
      if (!success) {
        return NextResponse.json(
          { error: 'Data source not found or could not be deleted' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: 'Data source deleted successfully'
      });
    } catch (error) {
      console.error(`Error deleting data source with ID ${params.sourceId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 