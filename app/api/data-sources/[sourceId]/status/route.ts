import { dataSourceService } from '@/lib/services';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthAny } from '@/lib/auth/authMiddleware';
import { validateBody } from '@/lib/validators';
import { dataSourceStatusSchema } from '@/lib/validators/schemas';
import connectToDatabase from '@/lib/database';
import mongoose from 'mongoose';

// Update data source status (enable/disable)
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

      // Only admins can update data source status
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
      const [bodyData, validationError] = await validateBody(request, dataSourceStatusSchema);
      
      if (validationError) {
        return validationError;
      }

      if (!bodyData) {
        return NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        );
      }

      // Update the data source status
      const updatedSource = await dataSourceService.setDataSourceStatus(
        sourceId,
        bodyData.enabled
      );
      
      if (!updatedSource) {
        return NextResponse.json(
          { error: 'Failed to update data source status' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: `Data source ${bodyData.enabled ? 'enabled' : 'disabled'} successfully`,
        dataSource: {
          id: updatedSource._id.toString(),
          name: updatedSource.name,
          isEnabled: updatedSource.status.isEnabled
        }
      });
    } catch (error) {
      console.error(`Error updating status for data source with ID ${params.sourceId}:`, error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
} 